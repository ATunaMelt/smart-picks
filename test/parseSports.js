const sportsData = require('../src/constants/sportsdataReturn.json');
const pre = require('../src/constants/pre.json');

function printer(sportsData) {
  const data = sportsData.Games;
  let counter = 0;
  for (let i = 0; i < data.length; i++) {
    counter++;
    const gameObject = data[i];
    console.log('\n', counter);
    console.log(
      gameObject.Updated,
      '|',
      gameObject.GameID,
      'gameID |',
      gameObject.AwayTeam,
      gameObject.AwayTeamScore,
      '<--Away Team |',
      gameObject.HomeTeam,
      gameObject.HomeTeamScore,
      '<--Home Team'
    );

    let awayScore = 0;
    let homeScore = 0;
    let winner = gameObject.AwayTeamScore - gameObject.HomeTeamScore;
    if (winner < 0) {
      console.log('Winner:', gameObject.HomeTeam);
    } else console.log('Winner:', gameObject.AwayTeam);
  }
  console.log(counter);
}
// printer(pre);
printer(sportsData);

// 2, 4, 5, 7, 9, 11
// 11 = finals (2 teams).
// 11 winner --> overall winner
// 11 teams --> round 5 (2)
// 9 teams --> (2 games) round 4 (4)
// 7 teams --> (4 games, 4 null) round 3 (8)
// 5 teams --> (8 games) round 2 (16)
// 4 teams --> (16 games) round 1 (32)
