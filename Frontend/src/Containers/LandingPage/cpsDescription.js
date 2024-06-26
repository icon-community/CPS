import React, { useState } from 'react';
import curveImg from '../../Assets/Images/curve.png';
import iconLogoImg from '../../Assets/Images/iconLogo.png';
import iconBlackImg from '../../Assets/Images/iconCPS1.png';
import { Link, Redirect } from 'react-router-dom';
import Summary from './summary';
import { Waypoint } from 'react-waypoint';

const CPSDescription = props => {
  const { walletAddress, onClickLogin, setActiveTabCenter, createProposalRef } =
    props;
  const [clickedProposal, setClickedProposal] = useState(false);

  if (clickedProposal && walletAddress) {
    return <Redirect to='/newProposal' />;
  }
  return (
    <Waypoint
      onEnter={() => {
        // setActiveTabCenter('description')
      }}
      onLeave={() => {
        // setActiveTabCenter('')
      }}
    >
      <div ref={createProposalRef}>
        <div className='descriptionLeft scrollSection' id='description'>
          <h3>Launch your projects on </h3>
          <img src={iconBlackImg}></img>
          <p>
            The Contribution Proposal System (CPS) <br></br>is a decentralized
            grant program that supports developers and teams wanting to build on
            the ICON blockchain.
          </p>
          <div className='buttons'>
            <p
              onClick={() => {
                setClickedProposal(true);
                if (!walletAddress) {
                  onClickLogin();
                }
              }}
              className='active'
            >
              Create a proposal
            </p>
            <p>
              <a
                style={{ color: 'white', textDecoration: 'none' }}
                href='https://discord.gg/4vpFeYams4'
                target='_blank'
              >
                Get in touch
              </a>
            </p>
          </div>
        </div>
      </div>
    </Waypoint>
  );
};

export default CPSDescription;
