import React from 'react';
import styles from './ProposalList.module.scss';
import { Container, Col, Row } from 'react-bootstrap';
import Proposal from './Proposal';

const ProposalHistoryList = ({
  proposals,
  onClickProposal,
  emptyListMessage,
  sponsorRequest = false,
  minHeight = '100px',
  minLayout = false,
  showBadge = true,
}) => {
  return (
    <Container
      fluid
      style={
        proposals.length
          ? {
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              columnGap: '12px',
              rowGap: '12px',
              marginTop: '16px',
            }
          : {
              minHeight: minHeight,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }
      }
    >
      {proposals.length ? (
        proposals.map(proposal =>
          proposal ? (
            <Proposal
              proposal={proposal}
              sponsorRequest={sponsorRequest}
              onClick={() => onClickProposal(proposal)}
              minLayout={minLayout}
              showBadge={showBadge}
            />
          ) : (
            <></>
          ),
        )
      ) : (
        <span className={styles.noProposals}>
          {emptyListMessage || `No Proposals`}
        </span>
      )}
    </Container>
  );
};

export default ProposalHistoryList;
