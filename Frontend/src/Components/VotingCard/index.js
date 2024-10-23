import ProposalList from 'Components/Card/ProposalList';
import TabBar from 'Components/Card/VotingTabBar';
import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import {
  fetchProposalListRequest,
  fetchRemainingVotesRequest,
  fetchSortPriorityProposalListRequest,
  setModalShowVoting,
} from 'Redux/Reducers/proposalSlice';
import styles from './ProposalCard.module.scss';
import proposalStates from './proposalStates';
// import { select } from 'redux-saga/effects';
import PriorityVoteCard from 'Components/Card/PriorityVoteCard';
import PriorityVoteStatusCard from 'Components/Card/PriorityVoteStatusCard';
import ProgressReportList from 'Components/Card/ProgressReportList';
import { useHistory } from 'react-router-dom';
import {
  fetchProgressReportListRequest,
  setModalShowVotingPR,
} from 'Redux/Reducers/progressReportSlice';

const VotingCard = ({
  proposalList,
  fetchProposalListRequest,
  fetchSortPriorityProposalListRequest,
  walletAddress,
  totalPages,
  proposalStatesList,
  initialState,
  priorityVote,
  fetchProgressReport,
  progressReportList,
  modalShow,
  setModalShow,
  modalShowPR,
  setModalShowPR,
  fetchRemainingVotesRequest,
  remainingVotesProposal,
  remainingVotesPR,
}) => {
  const [selectedTab, setSelectedTab] = useState(
    proposalStatesList.find(e => e.value === initialState).value,
  );
  const [filteredProposalList, setFilteredProposalList] =
    useState(proposalList);
  let [searchText, setSearchText] = useState('');
  const [pageNumber, setPageNumber] = useState();
  // const [modalShow, setModalShow] = React.useState(false);
  // const [modalShowPR, setModalShowPR] = React.useState(false);
  const history = useHistory();

  const [selectedProposal, setSelectedProposal] = React.useState();
  const status = 'Voting';
  const [filteredProgressReportList, setFilteredProgressReportList] =
    useState(progressReportList);
  const [selectedProgressReport, setSelectedProgressReport] = React.useState();

  const onClickProposal = proposal => {
    // setModalShow(true);
    history.push(`/proposals/${proposal.ipfsHash}`);
    setSelectedProposal(proposal);
  };

  const onClickProposalDraft = proposal => {};

  const onClickProgressReport = progressReport => {
    // setModalShowPR(true);
    history.push(`/progress-reports/${progressReport.ipfsHash}`);
    setSelectedProgressReport(progressReport);
  };

  useEffect(() => {
    if (selectedTab === 'priorityVoting') {
      if (!priorityVote) {
        console.log('fetching priority voting');
        fetchProposalListRequest({ status });
      } else {
        fetchSortPriorityProposalListRequest();
      }
    }
  }, [selectedTab, priorityVote]);

  useEffect(() => {
    fetchRemainingVotesRequest({
      type: 'progress_reports',
    });
  }, [selectedTab, pageNumber, fetchRemainingVotesRequest]);

  useEffect(() => {
    const filteredProgressReports = remainingVotesPR.filter(proposal =>
      proposal.progressReportTitle
        ?.toLowerCase()
        .includes(searchText?.toLowerCase()),
    );
    setFilteredProgressReportList(filteredProgressReports);
  }, [selectedTab, remainingVotesPR, searchText, pageNumber]);

  useEffect(() => {
    fetchRemainingVotesRequest({
      type: 'proposal',
    });
  }, [selectedTab, pageNumber, fetchRemainingVotesRequest]);

  const setCurrentPages = (status, pageNumber) => {
    setPageNumber(prevState => ({
      ...prevState,
      [status]: pageNumber,
    }));
  };

  useEffect(() => {
    proposalStates.map(proposalState => {
      setCurrentPages(proposalState, 1);
    });
  }, []);

  useEffect(() => {
    const filteredProposals = remainingVotesProposal.filter(proposal =>
      proposal._proposal_title.includes(searchText),
    );

    setFilteredProposalList(filteredProposals);
  }, [selectedTab, remainingVotesProposal, searchText, pageNumber]);

  return (
    <>
      <Row className={styles.proposalCard}>
        <Col>
          <Card className={styles.card}>
            <Card.Body className={styles.cardBody}>
              <TabBar
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
                searchText={searchText}
                setSearchText={setSearchText}
                tabs={proposalStatesList}
                placeholder='Search Proposal'
                // newIndexList={
                //   !priorityVote &&
                //   proposalStatesList.includes('Priority Voting')
                //     ? [proposalStatesList.indexOf('Priority Voting')]
                //     : []
                // }
              />
              <hr style={{ marginTop: '-9px' }} />
              {selectedTab === 'proposal' ? (
                <ProposalList
                  minLayout={true}
                  showBadge={false}
                  proposals={filteredProposalList}
                  selectedTab={status}
                  searchText={searchText}
                  modalShow={modalShow}
                  setModalShow={setModalShow}
                  selectedProposal={selectedProposal}
                  setSelectedProposal={setSelectedProposal}
                  onClickProposal={
                    selectedTab === 'Draft'
                      ? onClickProposalDraft
                      : onClickProposal
                  }
                />
              ) : selectedTab === 'progressReport' ? (
                <ProgressReportList
                  minLayout={true}
                  showBadge={false}
                  projectReports={filteredProgressReportList}
                  selectedTab={status}
                  onClickProgressReport={onClickProgressReport}
                />
              ) : !priorityVote ? (
                <PriorityVoteCard
                  proposals={proposalList?.['Voting']?.[0] || []}
                  selectedTab={status}
                  searchText={searchText}
                  emptyListMessage='No Priority Voting'
                />
              ) : (
                <PriorityVoteStatusCard
                  proposals={proposalList?.['Voting']?.[0] || []}
                  selectedTab={status}
                  searchText={searchText}
                  emptyListMessage='No Priority Voting'
                />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

const mapStateToProps = state => ({
  proposalList: state.proposals.proposalList,
  walletAddress: state.account.address,
  totalPages: state.proposals.totalPages,
  progressReportList: state.progressReport.progressReportList,
  totalPagesProgressReport: state.progressReport.totalPages,
  modalShow: state.proposals.modalShowVoting,
  modalShowPR: state.progressReport.modalShowVotingPR,

  remainingVotesProposal: state.proposals.remainingVotes,
  remainingVotesPR: state.progressReport.remainingVotes,
  priorityVoting: state.proposals.priorityVoting,
});

const mapDispatchToProps = dispatch => ({
  fetchProposalListRequest: payload =>
    dispatch(fetchProposalListRequest(payload)),
  fetchSortPriorityProposalListRequest: payload =>
    dispatch(fetchSortPriorityProposalListRequest(payload)),
  fetchProgressReport: payload =>
    dispatch(fetchProgressReportListRequest(payload)),
  setModalShow: payload => dispatch(setModalShowVoting(payload)),
  setModalShowPR: payload => dispatch(setModalShowVotingPR(payload)),
  fetchRemainingVotesRequest: payload =>
    dispatch(fetchRemainingVotesRequest(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VotingCard);
