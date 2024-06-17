import React from 'react';
import discordImg from '../../Assets/Images/discord.png';
import iconCommunityImg from '../../Assets/Images/iconCommunity.png';
import twitterLightImg from '../../Assets/Images/x-light.png';
import twitterDarkImg from '../../Assets/Images/x-dark.png';
import githubImgDark from '../../Assets/Images/github-dark.png';
import githubImgLight from '../../Assets/Images/github-light.png';

const DeveloperCommunity = props => {
  const { footerRef } = props;

  const isDarkTheme = localStorage.getItem('theme');

  const twitterImg = isDarkTheme === 'dark'  ? twitterLightImg : twitterDarkImg;
  const githubImg = isDarkTheme === 'dark'  ? githubImgLight : githubImgDark;

  return (
    <div className='landingPage__DeveloperCommunity' ref={footerRef}>
      <h1>Join the ICON Developer Community</h1>
      <div>
        <div>
          <a target='_blank' href='https://x.com/helloiconworld'>
            <img src={twitterImg} />
            <p>Twitter</p>
          </a>
        </div>
        <div>
          <a target='_blank' href='https://discord.gg/b5QvCXJjJM'>
            <img src={discordImg} />
            <p>Discord</p>
          </a>
        </div>
        <div>
          <a target='_blank' href='https://github.com/icon-community/CPS'>
            <img src={githubImg} />
            <p>Github</p>
          </a>
        </div>
        <div>
          <a
            target='_blank'
            href='https://forum.icon.community/c/contribution-proposals/45'
          >
            {' '}
            <img src={iconCommunityImg} />
            <p>Community Forum</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default DeveloperCommunity;
