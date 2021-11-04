const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Greeter', function () {
  it("Should return the new greeting once it's changed", async function () {
    const Greeter = await ethers.getContractFactory('Greeter');
    const greeter = await Greeter.deploy('Hello, world!');
    await greeter.deployed();

    expect(await greeter.greet()).to.equal('Hello, world!');

    const setGreetingTx = await greeter.setGreeting('Hola, mundo!');

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal('Hola, mundo!');
  });
});

describe('Pool', function () {
  it("Should return the new greeting once it's changed", async function () {
    const Pool = await ethers.getContractFactory('Pool');
    const pool = await Pool.deploy(2, 2);
    await pool.deployed();
    await pool.enterPool(
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
      'Gonzaga'
    );
    await pool.enterPool(
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
      'Baylor'
    );
    const winnerIThink = await pool.playersAddressMapping(1);
    expect(
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
      )
    ).to.equal(winnerIThink);
  });
});
