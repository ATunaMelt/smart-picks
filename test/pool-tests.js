const { popoverClasses } = require('@mui/material');
const { expect } = require('chai');
const { ethers } = require('hardhat');

const entryFee = BigInt(4846789628618318);

describe('Pool', function () {
  let Pool;
  let pool;
  let owner;
  let addr1;
  let addr2;
  let winnerStartingBalance;

  before(async () => {
    Pool = await ethers.getContractFactory('Pool');
    pool = await Pool.deploy(2, entryFee);
    await pool.deployed();
    [owner, addr1, addr2] = await ethers.getSigners();
    winnerStartingBalance = await addr2.getBalance();
  });

  it('should exist', () => {
    expect(Pool).to.exist;
    expect(pool).to.exist;
  });

  it('should reject an entrant with insufficient funds', async () => {
    await expect(
      pool
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
            'Houston',
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
            'Houston',
          ],
          [
            'Gonzaga',
            'USC',
            'Michigan',
            'UCLA',
            'Baylor',
            'Arkansas',
            'Oregon St.',
            'Houston',
          ],
          ['Gonzaga', 'UCLA', 'Arkansas', 'Houston'],
          ['Gonzaga', 'Houston'],
          'Gonzaga',
          { value: 1 }
        )
    ).to.be.revertedWith('Entry fee not sufficient');
  });

  it('should reject an entrant with malformed data', async () => {
    await expect(
      pool
        .connect(addr1)
        .enterPool(
          'coles team',
          ['Gonzaga'],
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
            'Houston',
          ],
          [
            'Gonzaga',
            'USC',
            'Michigan',
            'UCLA',
            'Baylor',
            'Arkansas',
            'Oregon St.',
            'Houston',
          ],
          ['Gonzaga', 'UCLA', 'Arkansas', 'Houston'],
          ['Gonzaga', 'Houston'],
          'Gonzaga',
          { value: 2 }
        )
    ).to.be.revertedWith('roundOneWinners length incorrect');
  });

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
          'Houston',
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
          'Houston',
        ],
        [
          'Gonzaga',
          'USC',
          'Michigan',
          'UCLA',
          'Baylor',
          'Arkansas',
          'Oregon St.',
          'Houston',
        ],
        ['Gonzaga', 'UCLA', 'Arkansas', 'Houston'],
        ['Gonzaga', 'Houston'],
        'Gonzaga',
        { value: entryFee }
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
          'Houston',
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
          'Houston',
        ],
        [
          'Gonzaga',
          'USC',
          'Michigan',
          'UCLA',
          'Baylor',
          'Arkansas',
          'Oregon St.',
          'Houston',
        ],
        ['Gonzaga', 'UCLA', 'Baylor', 'Houston'],
        ['Gonzaga', 'Baylor'],
        'Baylor',
        { value: entryFee }
      );
    expect(entrant.from).to.equal(addr2.address);

    const numEntrants = await pool.getNumberEntries();
    expect(numEntrants).to.equal(2);
  });

  it('should reject entrant from entering twice', async () => {
    await expect(
      pool
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
            'Houston',
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
            'Houston',
          ],
          [
            'Gonzaga',
            'USC',
            'Michigan',
            'UCLA',
            'Baylor',
            'Arkansas',
            'Oregon St.',
            'Houston',
          ],
          ['Gonzaga', 'UCLA', 'Baylor', 'Houston'],
          ['Gonzaga', 'Baylor'],
          'Baylor',
          { value: 2 }
        )
    ).to.be.revertedWith('Sender has already entered bracket');
  });

  it('should reject closePool calls from anyone other than the pool', async () => {});

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
        'Houston',
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
        'Houston',
      ],
      [
        'Gonzaga',
        'USC',
        'Michigan',
        'UCLA',
        'Baylor',
        'Arkansas',
        'Oregon St.',
        'Houston',
      ],
      ['Gonzaga', 'UCLA', 'Baylor', 'Houston'],
      ['Gonzaga', 'Baylor'],
      'Baylor'
    );
    const winner = await pool.getWinnerAddress();
    expect(winner).to.equal(addr2.address);
    expect((await addr2.getBalance()).gte(winnerStartingBalance));
  });
});
