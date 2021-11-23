import Title from '../components/title.js';

export default function About() {
  return (
    <div className='page'>
      <Title title='About' />

      <div className='about'>
        <p>
          Smart Picks is an app that allows users to create and enter into NCAA
          March Madness betting pools. Pools are tallied and closed via a
          chainlink keeper contract that uses a sports data feed, and
          automatically pays out to the winner.
        </p>

        <p>
          {' '}
          This app has been built during the Chainlink Fall 2021 Hackathon by{' '}
          <a href='https://github.com/ATunaMelt' target='_blank'>
            ATunaMelt
          </a>{' '}
          and
          <a href='https://github.com/becks25' target='_blank'>
            {' '}
            Becks25
          </a>
          .
        </p>
        <hr />
        <h3>Built With </h3>

        <img
          className='logo'
          src='https://assets-global.website-files.com/5f6b7190899f41fb70882d08/5f760a499b56c47b8fa74fbb_chainlink-logo.svg'
        />
        <img
          className='logo'
          src='https://hardhat.org/assets/img/Hardhat-logo.652a7049.svg'
        />
        <img
          className='logo primary-background'
          src='https://docs.ethers.io/v5/static/logo.svg'
        />
        <img
          className='logo'
          src='https://moralis.io/wp-content/uploads/2021/06/Moralis-Glass-Favicon.svg'
        />
        <img
          className='logo primary-background'
          src='https://www.alchemytech.io/images/about_logo.png'
        />
        <img
          className='logo'
          src='https://sportsdata.io/assets/images/logos/sportsdataio-light-270.png'
        />
        <img className='logo' src='https://metamask.io/images/mm-logo.svg' />
        <img className='logo' src='https://docs.ipfs.io/images/ipfs-logo.svg' />
        <img
          className='logo'
          src='https://polygon.technology/wp-content/uploads/2021/07/polygon-logo.svg'
        />
        <img
          className='logo'
          src='https://assets.website-files.com/6059b554e81c705f9dd2dd32/6100222344a9783fbdf5a4f2_Group%203004.svg'
        />
      </div>
    </div>
  );
}
