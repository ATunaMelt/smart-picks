require('@nomiclabs/hardhat-waffle');
require('dotenv').config();
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: '0.8.4',
  networks: {
    kovan: {
      url: `https://eth-kovan.alchemyapi.io/v2/${process.env.REACT_APP_ALCHEMY_API_KEY}`,
      accounts: [`0x${process.env.KOVAN_PRIVATE_KEY}`]
    },
    mumbai: {
      url: 'https://rpc-mumbai.maticvigil.com',
      accounts: [`0x${process.env.MUMBAI_MATIC_KEY}`]
    },
    fuji: {
      url: 'https://api.avax-test.network/ext/bc/C/rpc',
      accounts: [`0x${process.env.FUJI_AVALANCHE_KEY}`]
    }
  }
};
