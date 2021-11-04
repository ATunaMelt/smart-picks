const { expect } = require('chai');
const { ethers } = require('hardhat');

// describe('Greeter', function () {
//   it("Should return the new greeting once it's changed", async function () {
//     const Greeter = await ethers.getContractFactory('Greeter');
//     const greeter = await Greeter.deploy('Hello, world!');
//     await greeter.deployed();

//     expect(await greeter.greet()).to.equal('Hello, world!');

//     const setGreetingTx = await greeter.setGreeting('Hola, mundo!');

//     // wait until the transaction is mined
//     await setGreetingTx.wait();

//     expect(await greeter.greet()).to.equal('Hola, mundo!');
//   });
// });

describe('Pool', function () {
  let Pool;
  let pool;
  let owner;
  let addr1;
  let addr2;

  before(async () => {
    Pool = await ethers.getContractFactory('Pool');
    pool = await Pool.deploy(2, 2);
    await pool.deployed();
    [owner, addr1, addr2] = await ethers.getSigners();
  });

  it('should exist', () => {
    expect(Pool).to.exist;
    expect(pool).to.exist;
  });

  it('should allow an entrant', async () => {
    const entrant = await pool
      .connect(addr2)
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
        { from: addr2.address, value: 2 }
      );

    expect(entrant.from).to.equal(addr2.address);

    const numEntrants = await pool.getNumberEntries();
    expect(numEntrants).to.equal(1);
  });

  it('should allow a second entrant', async () => {
    const entrant = await pool
      .connect(addr1)
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
        { from: addr1.address, value: 2 }
      );

    expect(entrant.from).to.equal(addr1.address);

    const numEntrants = await pool.getNumberEntries();
    expect(numEntrants).to.equal(2);
  });

  it('should reject entrant from entering', async () => {
    // set this up
  });

  it('should return the winning address on close', async () => {
    const winner = await pool
      .connect(addr1)
      .closePool(
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
        { from: addr1.address, value: 2 }
      );

    expect(winner.to).to.equal(addr2.address);
  });
});
