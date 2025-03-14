import React, { useEffect } from 'react';
import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarHeader,
  SidebarContent,
} from 'react-pro-sidebar';
import {
  FaTachometerAlt,
  FaGem,
  FaList,
  FaBookOpen,
  FaChartLine,
} from 'react-icons/fa';
import { BiPieChartAlt } from 'react-icons/bi';
import { MdDashboard, MdForum } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { Badge, Fade } from 'react-bootstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { CgFileDocument } from 'react-icons/cg';
import iconCPSImg from '../../Assets/Images/iconCPSlogo.svg';
import iconCPSImgDark from '../../Assets/Images/iconCPSlogo-light.svg';
import { GenIcon } from 'react-icons';

const Aside = ({
  collapsed,
  toggled,
  isVotingPRep,
  handleToggleSidebar,
  handleCollapsedChange,
  history,
  setToggled,
  priorityVote,
  remainingVotesProposal,
  remainingVotesPR,
  pendingCount,
  period,
}) => {
  const highlightedStyle = { background: 'rgba(38, 38, 38, 0.1)' };
  const pathName = history.location.pathname;
  const [notificationsCount, setNotificationsCount] = React.useState(0);
  const getHighlightedStyle = routes => {
    return routes.includes(pathName) ? highlightedStyle : {};
  };

  useEffect(() => {
    if (window.innerWidth < 769) {
      handleCollapsedChange(false);
    }
  }, [toggled]);

  useEffect(() => {
    setNotificationsCount(
      priorityVote
        ? remainingVotesProposal.length + remainingVotesPR.length
        : remainingVotesProposal.length +
            remainingVotesPR.length +
            (pendingCount > 0 ? 1 : 0),
    );
  }, [priorityVote, remainingVotesPR, remainingVotesProposal, period]);

  return (
    <ProSidebar
      collapsed={collapsed}
      toggled={toggled}
      breakPoint='md'
      onToggle={handleToggleSidebar}
    >
      <SidebarHeader>
        <div
          style={{
            padding: '24px',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            letterSpacing: '1px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          {!collapsed && (
            <Link
              style={{ fontSize: 'initial' }}
              to='/'
              className='sidebarHeader'
            >
              {/* <span style = {{fontSize: '26px', fontWeight: 400}}>ICON</span><span style = {{fontSize: '26px', fontWeight: '900'}}>CPS</span> */}
              <img src={iconCPSImgDark} style={{ width: '65%' }} />
            </Link>
          )}
          <FaList
            onClick={() => {
              if (window.innerWidth > 769) {
                handleCollapsedChange(!collapsed);
              } else {
                setToggled(false);
              }
            }}
            style={{ cursor: 'pointer', height: 'auto', fontSize: 35 }}
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <Menu iconShape='circle'>
          {isVotingPRep ? (
            <MenuItem
              icon={<MdDashboard />}
              style={getHighlightedStyle(['/dashboard'])}
            >
              {
                <span
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  Dashboard
                  {period === 'VOTING' && notificationsCount !== 0 && (
                    <span
                      style={{
                        height: 'fit-content',
                        fontSize: '12px',
                        fontWeight: '600',
                        padding: '1px 6px',
                        backgroundColor: '#fa3e3e',
                        borderRadius: '2px',
                      }}
                    >
                      {notificationsCount}
                    </span>
                  )}
                </span>
              }
              <Link to='/dashboard' />
            </MenuItem>
          ) : (
            <MenuItem
              icon={<MdDashboard />}
              style={getHighlightedStyle(['/dashboard'])}
            >
              {<span>Dashboard</span>}
              <Link to='/dashboard' />
            </MenuItem>
          )}

          <MenuItem icon={<FaGem />} style={getHighlightedStyle(['/voting'])}>
            {<span>Voting</span>}
            <Link to='/voting' />
          </MenuItem>
          <MenuItem
            icon={<FaList />}
            style={getHighlightedStyle(['/active-proposals'])}
          >
            {<span>Active Proposals</span>}
            <Link to='/active-proposals' />
          </MenuItem>

          <MenuItem
            icon={<BiPieChartAlt />}
            style={getHighlightedStyle(['/proposal-history'])}
          >
            {' '}
            {<span>Proposal History</span>}
            <Link to='/proposal-history' />
          </MenuItem>

          <MenuItem
            icon={<FaChartLine />}
            style={getHighlightedStyle(['/stats'])}
          >
            {' '}
            {<span>Stats</span>}
            <Link to='/stats' />
          </MenuItem>

          <MenuItem icon={<FaBookOpen />}>
            {' '}
            {<span>User Guide</span>}
            <a
              href='https://github.com/icon-community/CPS/wiki'
              target='_blank'
            />
          </MenuItem>
        </Menu>
      </SidebarContent>
    </ProSidebar>
  );
};

const mapStateToProps = state => ({
  isPrep: state.account.isPrep,
  isVotingPRep: state.account.votingPRep,
  period: state.period.period,
  isRegistered: state.account.isRegistered,
  priorityVote: state.proposals.priorityVoting,
  remainingVotesProposal: state.proposals.remainingVotes,
  remainingVotesPR: state.progressReport.remainingVotes,
  pendingCount: state.proposals.pendingCount,
});

export default withRouter(connect(mapStateToProps)(Aside));
