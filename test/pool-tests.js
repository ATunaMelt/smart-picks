const { popoverClasses } = require('@mui/material');
const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Pool', function () {
  let Pool;
  let pool;
  let owner;
  let addr1;
  let addr2;
  let winnerStartingBalance;

  before(async () => {
    Pool = await ethers.getContractFactory('Pool');
    pool = await Pool.deploy(555555555555555, 2);
    await pool.deployed();
    [owner, addr1, addr2] = await ethers.getSigners();
    winnerStartingBalance = await addr2.getBalance();

    console.log(winnerStartingBalance.toString());
  });

  it('should exist', () => {
    expect(Pool).to.exist;
    expect(pool).to.exist;
  });

  it('should reject an entrant with insufficient funds', () => {});

  it('should reject an entrant with malformed data', () => {});

  it('should allow an entrant', async () => {
    const entrant = await pool
      .connect(addr1)
      .enterPool(
        'coles team',
        [
          'Gonzaga',
          'Oklahoma',
          'Creighton',
          'Ohio',
          'USC',
          'Kansas',
          'Oregon',
          'Iowa',
          'Michigan',
          'LSU',
          'Colorado',
          'Florida St.',
          'UCLA',
          'Abilene Christian',
          'Maryland',
          'Alabama',
          'Baylor',
          'Wisconsin',
          'Villanova',
          'North Texas',
          'Texas Tech',
          'Arkansas',
          'Florida',
          'Oral Roberts',
          'Illinois',
          'Loyola Chicago',
          'Oregon St.',
          'Oklahoma St.',
          'Syracuse',
          'West Virginia',
          'Rutgers',
          'Houston'
        ],
        [
          'Gonzaga',
          'Creighton',
          'USC',
          'Oregon',
          'Michigan',
          'Florida St.',
          'UCLA',
          'Alabama',
          'Baylor',
          'Villanova',
          'Arkansas',
          'Oral Roberts',
          'Loyola Chicago',
          'Oregon St.',
          'Syracuse',
          'Houston'
        ],
        [
          'Gonzaga',
          'USC',
          'Michigan',
          'UCLA',
          'Baylor',
          'Arkansas',
          'Oregon St.',
          'Houston'
        ],
        ['Gonzaga', 'UCLA', 'Arkansas', 'Houston'],
        ['Gonzaga', 'Houston'],
        'Gonzaga',
        { value: 555555555555555 }
      );

    expect(entrant.from).to.equal(addr1.address);

    const numEntrants = await pool.getNumberEntries();
    expect(numEntrants).to.equal(1);
  });

  it('should allow a second entrant', async () => {
    const entrant = await pool
      .connect(addr2)
      .enterPool(
        'BECKS team',
        [
          'Gonzaga',
          'Oklahoma',
          'Creighton',
          'Ohio',
          'USC',
          'Kansas',
          'Oregon',
          'Iowa',
          'Michigan',
          'LSU',
          'Colorado',
          'Florida St.',
          'UCLA',
          'Abilene Christian',
          'Maryland',
          'Alabama',
          'Baylor',
          'Wisconsin',
          'Villanova',
          'North Texas',
          'Texas Tech',
          'Arkansas',
          'Florida',
          'Oral Roberts',
          'Illinois',
          'Loyola Chicago',
          'Oregon St.',
          'Oklahoma St.',
          'Syracuse',
          'West Virginia',
          'Rutgers',
          'Houston'
        ],
        [
          'Gonzaga',
          'Creighton',
          'USC',
          'Oregon',
          'Michigan',
          'Florida St.',
          'UCLA',
          'Alabama',
          'Baylor',
          'Villanova',
          'Arkansas',
          'Oral Roberts',
          'Loyola Chicago',
          'Oregon St.',
          'Syracuse',
          'Houston'
        ],
        [
          'Gonzaga',
          'USC',
          'Michigan',
          'UCLA',
          'Baylor',
          'Arkansas',
          'Oregon St.',
          'Houston'
        ],
        ['Gonzaga', 'UCLA', 'Baylor', 'Houston'],
        ['Gonzaga', 'Baylor'],
        'Baylor',
        { value: 555555555555555 }
      );
    console.log(winnerStartingBalance.sub(await addr2.getBalance()));
    console.log(entrant.gasLimit.toString());
    expect(entrant.from).to.equal(addr2.address);

    const numEntrants = await pool.getNumberEntries();
    expect(numEntrants).to.equal(2);
  });

  it('should reject entrant from entering', async () => {
    // set this up
  });

  it('should reject closePool calls from anyone other than the pool', () => {});

  it('should return the winning address on close', async () => {
    await pool.closePool(
      [
        'Gonzaga',
        'Oklahoma',
        'Creighton',
        'Ohio',
        'USC',
        'Kansas',
        'Oregon',
        'Iowa',
        'Michigan',
        'LSU',
        'Colorado',
        'Florida St.',
        'UCLA',
        'Abilene Christian',
        'Maryland',
        'Alabama',
        'Baylor',
        'Wisconsin',
        'Villanova',
        'North Texas',
        'Texas Tech',
        'Arkansas',
        'Florida',
        'Oral Roberts',
        'Illinois',
        'Loyola Chicago',
        'Oregon St.',
        'Oklahoma St.',
        'Syracuse',
        'West Virginia',
        'Rutgers',
        'Houston'
      ],
      [
        'Gonzaga',
        'Creighton',
        'USC',
        'Oregon',
        'Michigan',
        'Florida St.',
        'UCLA',
        'Alabama',
        'Baylor',
        'Villanova',
        'Arkansas',
        'Oral Roberts',
        'Loyola Chicago',
        'Oregon St.',
        'Syracuse',
        'Houston'
      ],
      [
        'Gonzaga',
        'USC',
        'Michigan',
        'UCLA',
        'Baylor',
        'Arkansas',
        'Oregon St.',
        'Houston'
      ],
      ['Gonzaga', 'UCLA', 'Baylor', 'Houston'],
      ['Gonzaga', 'Baylor'],
      'Baylor'
    );
    const winner = await pool.getWinnerAddress();
    expect(winner).to.equal(addr2.address);
    const afterWinning = await addr2.getBalance();
    const afterLosing = await addr1.getBalance();

    console.log(afterWinning.toString());
    console.log(afterLosing.toString());
  });
  it('should send the SC balamce to the winner', async () => {
    let whichBigger = await afterWinning.gt(winnerStartingBalance);
    console.log(whichBigger);
    expect(whichBigger).to.be.true();
  });
});
