/* eslint-disable jsx-a11y/alt-text */
import Title from '../components/title.js';

export default function About() {
  return (
    <div className='page'>
      <Title title='About' />

      <div className='about'>
        <p>
          This dApp has been built during the Chainlink Fall 2021 Hackathon by
          <a href='https://github.com/ATunaMelt' target='_blank'>
            ATunaMelt
          </a>
          and
          <a href='https://github.com/becks25' target='_blank'>
            Becks25
          </a>
          .
        </p>
        <h3>What is Smart Picks? </h3>

        <p>
          Smart Picks is a dApp that lets users create and enter into NCAA March
          Madness betting pools. You can build and save brackets in advance, and
          join whichever pool you prefer. Each pool is a smart contract, which
          uses Chainlink price feeds to provide the up-to-date price in $ETH,
          $MATIC, or $AVAX. We use SportsDataIO for our Oracle’s data source
          and, to maintain proper decentralization, a keeper contract will close
          all of the pools 24 hours after the tournament has ended.
        </p>

        <h3>How do I use Smart Picks?</h3>
        <p>
          In order to use this dApp, you must have a Metamask wallet set up, and
          sufficient funds with one of our compatible blockchains.
        </p>

        <p>
          We recommend that you start by creating a bracket. Once you've done
          that, either select an existing pool to join, or make your own!
        </p>

        <hr />
        <h3>Built With </h3>

        <img
          className='logo'
          src='https://assets-global.website-files.com/5f6b7190899f41fb70882d08/5f760a499b56c47b8fa74fbb_chainlink-logo.svg'
        />
        <img
          className='logo'
          src='https://s3.amazonaws.com/challengepost/sponsors/logos/000/022/968/highres/moralis.png'
        />
        <img
          className='logo'
          src='https://s3.amazonaws.com/challengepost/sponsors/logos/000/022/704/highres/Alchemy_Logo-800x419.jpeg'
        />
        <img
          className='logo'
          src='https://sportsdata.io/assets/images/logos/sportsdataio-light-270.png'
        />
        <img
          className='logo'
          src='https://upload.wikimedia.org/wikipedia/commons/c/c2/IPFS_logo.png'
        />
        <img
          className='logo'
          src='https://polygon.technology/wp-content/uploads/2021/07/polygon-logo.svg'
        />
        <img
          className='logo'
          src='https://assets.website-files.com/6059b554e81c705f9dd2dd32/6100222344a9783fbdf5a4f2_Group%203004.svg'
        />
        <img
          className='logo'
          src='https://cdn2.hubspot.net/hubfs/4795067/consensys-logo-horizontal-blue.png'
        />
        <img className='logo' src='https://metamask.io/images/mm-logo.svg' />
        <img
          className='logo'
          src='https://hardhat.org/assets/img/Hardhat-logo.652a7049.svg'
        />
        <img
          className='logo primary-background'
          src='https://storageapi.fleek.co/fleek-team-bucket/site/fleek-logo.png'
        />
        <img
          className='logo'
          src='https://miro.medium.com/max/600/1*SHg7SgjVtPJ-Fma-liXz_Q.png'
        />
        <img
          className='logo'
          src='https://ethereum.github.io/remix-website/assets/imgs/remix_logo_background.svg'
        />
        <img className='logo' src='https://mui.com/static/logo.png' />
        <img
          className='logo'
          src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1280px-React-icon.svg.png'
        />
      </div>
    </div>
  );
}
