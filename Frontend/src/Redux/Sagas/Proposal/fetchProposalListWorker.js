import { put, call } from 'redux-saga/effects';
import { callKeyStoreWallet } from '../../ICON/utils';
// import {
//   getCourseInfo,
// } from '../services/api';
import {
  fetchProposalListSuccess,
  fetchProposalListFailure,
} from '../../Reducers/proposalSlice';

const proposalListStatusMapping = {
  Active: '_active',
  Voting: '_pending',
  Pending: '_sponsor_pending',

  Completed: '_completed',
  Disqualified: '_disqualified',
  Paused: '_paused',
  Rejected: '_rejected',
};

function* fetchProposalListWorker({ payload }) {
  try {
    const response = yield call(callKeyStoreWallet, {
      method: 'getProposalDetails',
      params: {
        status: proposalListStatusMapping[payload.status],
        walletAddress: payload.walletAddress,
        startIndex: `${(payload.pageNumber || 1) * 10 - 10}`,
      },
    });

    yield put(
      fetchProposalListSuccess({
        response,
        status: payload.status,
        pageNumber: payload.pageNumber || 1,
      }),
    );
  } catch (error) {
    yield put(fetchProposalListFailure());
  }
}

export default fetchProposalListWorker;
