import React, { useEffect } from 'react';
import { FaAngleDown } from 'react-icons/fa';
import styles from './MilestoneVotingCard.module.scss';
import { MdStars } from 'react-icons/md';
import { ButtonGroup, Button, Row, Col, Container } from 'react-bootstrap';
import { ListTitle } from 'Components/UI/DetailsModal';
import VoteList from 'Components/Card/DetailsModalProgressReport/VoteList';
import InfoIcon from 'Components/InfoIcon';
import store from 'Redux/Store';
import { IconConverter } from 'icon-sdk-js';
import { CPSScore, call, callKeyStoreWallet } from 'Redux/ICON/utils';
import ProgressBarCombined from 'Components/Card/ProgressBarCombined';
import VoteProgressBar from 'Components/VoteProgressBar';
import { useParams } from 'react-router-dom';

const MilestoneVoteCard = ({
  id,
  reportKey,
  name,
  description,
  duration,
  button,
  votesByProgressReport,
}) => {
  const [data, setData] = React.useState();
  const params = useParams();
  // console.log("parameters",params);
  useEffect(() => {
    let isMounted = true;
    try {
      callKeyStoreWallet({
        method: 'getMilestoneVoteResult',
        params: {
          reportKey: `${reportKey}`,
          // milestoneID: `0x${Number(id).toString(16)}`
          milestoneId: `${id}`,
        },
      }).then(res => {
        if (isMounted) setData(res); // add conditional check
      });
    } catch (e) {
      console.log(e);
    }
    return () => {
      isMounted = false;
    };
  }, [id]);

  // console.log(data);

  return (
    <>
      <div className='accordion pb-1 pt-1' id='accordionComponent'>
        <div
          className='card'
          style={{
            backgroundColor: 'var(--proposal-card-color)',
            color: 'var(--proposal-text-color)',
            border: '1px solid var(--table-border-color)',
          }}
        >
          <div
            className='card-header w-100 d-flex justify-content-between'
            id={`heading${id}`}
            style={{
              borderBottom: '1px solid var(--table-border-color)',
            }}
          >
            <h2 className='mb-0 d-flex'>
              <div
                className='btn d-flex btn-block text-left w-100 align-items-center '
                type='button'
                data-toggle='collapse'
                data-target={`#collapse${id}`}
                aria-expanded='true'
                aria-controls={`collapse${id}`}
              >
                <div className='d-flex'>
                  <div className='p-2'>
                    <MdStars className={styles.icon} />
                  </div>
                  <div className='d-flex flex-column pl-2 pr-4'>
                    <h6
                      style={{
                        fontSize: '18',
                        fontWeight: '600',
                        lineHeight: '1.2',
                        marginBottom: '0',
                        color: 'var(--font-color)',
                      }}
                    >
                      {name}
                    </h6>
                    <div className='d-flex pt-2'>
                      <p
                        style={{
                          marginBottom: '0',
                          fontSize: '16',
                          color: 'grey',
                        }}
                      >
                        {' '}
                        {`${duration} days`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </h2>
            {/* <ButtonGroup aria-label='Basic example'>
            <Button variant='dark' onClick={() => {}}>
              Accept
            </Button>
            <Button variant='dark' onClick={() => {}}>
              Reject
            </Button>
          </ButtonGroup> */}
            {button}
          </div>

          <div
            id={`collapse${id}`}
            class='collapse show'
            aria-labelledby='headingOne'
            data-parent='#accordionComponent'
          >
            <div class='card-body'>
              <div className='d-flex flex-column'>
                <p style={{ fontWeight: '600', marginBottom: '4px' }}>
                  Milestone Description
                </p>
                <p>{description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Row>
        <Col xs='12'>
          {votesByProgressReport?.length ? (
            <div
              style={{
                marginTop: '12px',
                backgroundColor: 'var(--proposal-card-color)',
                padding: '12px',
              }}
            >
              <ListTitle>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                <div style={{ padding: '10px', display: 'flex' }}>
                  <span
                    style={{
                      marginRight: '4px',
                      color: 'var(--proposal-text-color)',
                    }}
                  >
                    VOTES
                  </span>
                  <InfoIcon
                    description={'Click on a vote to view more details'}
                  />
                  
                </div>
                <div
        style={{ display: 'flex', gap: 24,padding:'4px 16px' }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <ProgressBarCombined
            approvedPercentage={IconConverter.toBigNumber(data?.approved_votes)}
            rejectedPercentage={IconConverter.toBigNumber(data?.rejected_votes)}
          />

          <Container
            style={{
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            <VoteProgressBar
              approvedPercentage={IconConverter.toBigNumber(
                data?.approved_votes,
              )}
              rejectedPercentage={IconConverter.toBigNumber(
                data?.rejected_votes,
              )}
              noProgressBar
              // budgetAdjustment
            />
          </Container>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <ProgressBarCombined
            approvedPercentage={IconConverter.toBigNumber(data?.approve_voters)}
            rejectedPercentage={IconConverter.toBigNumber(data?.reject_voters)}
          />

          <Container
            style={{
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            <VoteProgressBar
              approvedPercentage={IconConverter.toBigNumber(
                data?.approve_voters,
              )}
              rejectedPercentage={IconConverter.toBigNumber(
                data?.reject_voters,
              )}
              noProgressBar
              // budgetAdjustment
              voterCount
            />
          </Container>
        </div>
      </div>

                </div>
              </ListTitle>
              {}
              <VoteList votes={votesByProgressReport} progressReport />
            </div>
          ) : null}
        </Col>
      </Row>
    
    </>
  );
};

export default MilestoneVoteCard;
