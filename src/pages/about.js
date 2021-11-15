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
      </div>
    </div>
  );
}
