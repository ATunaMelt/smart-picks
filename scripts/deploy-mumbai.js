// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require('hardhat');
const fs = require('fs');

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with the account:', deployer.address);
  console.log('Account balance:', (await deployer.getBalance()).toString());

  const Pool = await ethers.getContractFactory('Pool');
  const PoolFactory = await ethers.getContractFactory('PoolFactory');

  // const pool = await Pool.deploy(2, 2);
  const poolFactory = await PoolFactory.deploy();

  // await pool.deployed();
  await poolFactory.deployed();

  // console.log('pool deployed to:', pool.address);
  console.log('poolFactory deployed to:', poolFactory.address);
  const address = poolFactory.address;
  const poolArtifact = await hre.artifacts.readArtifact('Pool');
  const poolFactoryArtifact = await hre.artifacts.readArtifact('PoolFactory');

  const poolJson = JSON.stringify(poolArtifact);
  const poolFactoryJson = JSON.stringify(poolFactoryArtifact);

  // console.log('pool artifact', poolArtifact);
  // console.log('Facotry articat', poolFactoryArtifact);

  fs.writeFileSync(
    'src/constants/mumbai/poolFactoryAddress.js',
    `export default '${address}';`,
    (err) => {
      console.log('contract-address, now contains', poolFactory);
      if (err) throw err;
    }
  );
  fs.writeFileSync('src/constants/mumbai/Pool.json', poolJson, (err) => {
    console.log('poolJson, now contains', poolJson);
    if (err) throw err;
  });
  fs.writeFileSync(
    'src/constants/mumbai/PoolFactory.json',
    poolFactoryJson,
    (err) => {
      console.log('poolFactoryJson, now contains', poolFactoryJson);
      if (err) throw err;
    }
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
