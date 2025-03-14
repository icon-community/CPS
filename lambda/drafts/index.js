const { FleekSdk, PersonalAccessTokenService } = require('@fleek-platform/sdk/node');
const redis = require('redis');
const { promisify } = require('util');
var { v4: uuidv4 } = require('uuid');

const client = redis.createClient(process.env.REDIS_URL);
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const getAllProposalAsync = promisify(client.keys).bind(client);

require('dotenv').config()

const accessTokenService = new PersonalAccessTokenService({
	personalAccessToken: process.env.FLEEK_PERSONAL_ACCESS_TOKEN,
	projectId: process.env.FLEEK_PROJECT_ID
});

const fleekSdk = new FleekSdk({
	accessTokenService,
});

function convertToReadableStream({ content, fileName, type }) {

	if (type == 'json') {
		const jsonString = JSON.stringify(content);
		const bufferData = Buffer.from(jsonString, 'utf-8');
		content = bufferData
	}

	// Return as FileLike object (compatible with Fleek SDK)
	return {
		name: fileName,
		stream: () => new ReadableStream({
			start(controller) {
				controller.enqueue(content);
				controller.close();
			}
		})
	};
}

/* Upload to Fleek Storage. */
async function uploadToFleek({ content, fileName, type = 'json' }) {
	let fileStream = convertToReadableStream({ content, fileName, type })
	let uploadResult = await fleekSdk.storage().uploadFile({
		file: fileStream,
		parentFolderId: process.env.FLEEK_FOLDER_ID
	});
	uploadResult.hash = uploadResult.pin.cid;
	let ipfsUrl = `https://gateway.ipfs.io/ipfs/${uploadResult.hash}`;
	console.log(`✅ Upload Success! IPFS url: ${ipfsUrl}`);
	return uploadResult
}

async function uploadDraftToIPFS(payload) {

	let body = JSON.parse(payload);
	if (!body.type) throw new Error('type field missing');
	if (!body.address) throw new Error('address field missing');
	const ipfsKey = body.type + uuidv4();
	body.ipfsKey = ipfsKey;

	const uploadedProposal = await uploadToFleek({ content: body, fileName: ipfsKey });

	uploadedProposal.ipfsKey = body.ipfsKey;
	uploadedProposal.address = body.address;
	uploadedProposal.type = body.type;
	if (body.proposalName) uploadedProposal.proposalName = body.proposalName;
	if (body.progressReportName) uploadedProposal.progressReportName = body.progressReportName;

	console.log(uploadedProposal)

	return uploadedProposal;
}

async function updateDraftToIPFS(payload) {

	const body = JSON.parse(payload);

	if (!body.ipfsKey) throw new Error('ipfsKey field missing');
	if (!body.address) throw new Error('address field missing');
	if (!body.type) throw new Error('type field missing')

	const updatedProposal = await uploadToFleek({ content: body, fileName: ipfsKey });

	updatedProposal.ipfsKey = body.ipfsKey;
	updatedProposal.address = body.address;
	updatedProposal.type = body.type;
	if (body.proposalName) updatedProposal.proposalName = body.proposalName;
	if (body.progressReportName) updatedProposal.progressReportName = body.progressReportName;

	console.log(updatedProposal);

	return updatedProposal;
}

async function addHashToRedis(proposal) {

	const redisObject = {
		proposalName: proposal.proposalName,
		ipfsHash: proposal.hash,
		ipfsUrl: 'https://gateway.ipfs.io/ipfs/' + proposal.hash,
		ipfsKey: proposal.ipfsKey
	}

	if (proposal.proposalName) redisObject.proposalName = proposal.proposalName;

	if (proposal.type === 'ProgressReport') {
		redisObject.progressReportName = proposal.progressReportName;
	}

	console.log(redisObject);

	// storing draft name, hash, url and ipfskey in redis
	const redisResponse = await setAsync(`address:${proposal.address}:type:${proposal.type}:drafts:${proposal.ipfsKey}`,
		JSON.stringify(redisObject));

	if (!redisResponse) throw new Error('Data couldnot be uploaded in redis');
	console.log('Response from Redis' + redisResponse);

	return JSON.stringify({ redisResponse: redisResponse });
}

async function getUserDrafts(payload) {
	let userDrafts = [];

	if (!payload.queryStringParameters.address)
		return new Error('address of the user is required');
	if (!payload.queryStringParameters.type)
		return new Error('type of the draft is required');

	const { address, type } = payload.queryStringParameters;
	const drafts = await getAllProposalAsync(`address:${address}:type:${type}:drafts:*`);
	console.log(drafts);

	for (const draft of drafts) {
		const draftDetails = await getAsync(draft);
		const userDraft = JSON.parse(draftDetails);
		if (userDrafts.indexOf(userDraft) === -1) {
			userDrafts.push(userDraft);
		}
	}
	console.log(userDrafts);

	return userDrafts;
}

exports.handler = async (event) => {
	try {
		const responseCode = 200;
		let drafts;

		console.log(event);
		// request handling
		if (event.httpMethod === 'POST') {
			// sample body: {"projectName":"testProj","category":"Development","projectDuration":"1","totalBudget":"100","sponserPrep":"hxd47ad924eba01ec91330e4e996cf7b8c658f4e4c","sponserPrepName":"CPS Test P-Rep3(DO NOT DELEGATE)","description":"<p>jaskldfjksld sdfksjd fksdjfk sdjfk sdjlfkjsadflk sjkldfj slkdj lksdjf lksdjlk sjkdl jsdlksdj dkf d df</p>","milestones":[{"name":"test-milestone","duration":"1","budget":null,"description":null}],"teamName":"test-team","teamEmail":"test-email@ibriz.com","teamSize":"10","address":"hx0dc852acca3aba28881963c665b557582de55356","type":"Proposal","proposalName":"testProj"}
			drafts = await uploadDraftToIPFS(event.body);
			await addHashToRedis(drafts);
		} else if (event.httpMethod === 'PUT') {
			drafts = await updateDraftToIPFS(event.body);
			await addHashToRedis(drafts);
		} else if (event.httpMethod === 'GET') {
			drafts = await getUserDrafts(event);
		} else {
			throw new Error('Method doesnot exist');
		}

		console.log(drafts);
		const response = {
			statusCode: responseCode,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Headers': '*'
			},
			body: JSON.stringify(drafts)
		};
		console.log(response);

		return response;
	} catch (err) {
		console.log(err);

		return {
			statusCode: err.statusCode ? err.statusCode : 500,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Headers': '*'
			},
			body: JSON.stringify({
				error: err.name ? err.name : 'Exception',
				message: err.message ? err.message : 'Unknown error',
			}),
		};
	}
};
