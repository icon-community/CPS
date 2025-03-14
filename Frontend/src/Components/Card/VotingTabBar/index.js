import React from 'react';
import styles from './ProposalNavBar.module.scss';
import NavBarTitle from '../../UI/LowerCardNavBar/NavBarTitle';
import NavBarInputGroup from '../../UI/LowerCardNavBar/NavBarInputGroup';
import { Nav } from 'react-bootstrap';

const VotingTabBar = ({
  selectedTab,
  setSelectedTab,
  // searchText,
  // setSearchText,
  tabs,
  placeholder,
  maxWidth,
  newIndexList = [],
}) => {
  return (
    <div className={styles.proposalNavBar}>
      {/* {
                proposalStates.map(
                    (proposalState) =>
                       
                        <NavBarTitle
                        onClick = {() => setSelectedTab(proposalState)}
                        activeCondition = {selectedTab === proposalState}>
                            {proposalState}  
                        </NavBarTitle>
                )

            } */}
      <Nav
        activeKey='/home'
        onSelect={selectedKey => alert(`selected ${selectedKey}`)}
        style={{
          display: 'inline-flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '5px',
          width: '100%',
        }}
      >
        {tabs.map((tab, index) => (
          <Nav.Item key={index} className={styles.navItem}>
            <NavBarTitle
              onClick={() => setSelectedTab(tab.value)}
              activeCondition={selectedTab === tab.value}
            >
              {tab.title}{' '}
              {newIndexList.includes(index) && (
                <sup style={{ color: 'red', fontWeight: 'normal' }}>New</sup>
              )}
            </NavBarTitle>
          </Nav.Item>
        ))}

        <div style={{ flexGrow: 1 }}></div>
      </Nav>
    </div>
  );
};

export default VotingTabBar;
