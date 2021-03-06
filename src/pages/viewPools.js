import { useState, useEffect } from 'react';
import CustomTable from '../components/table.js';
import Title from '../components/title.js';
import { TextField } from '@mui/material';
import { useMoralis } from 'react-moralis';
import { POOL_FACTORY_ADDRESSES } from '../constants/web3-constants.js';
import { Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Link } from 'react-router-dom';
import { abi as poolABI } from '../constants/PoolABI';
import { abi as poolFactoryABI } from '../constants/PoolFactoryABI';

const filterPools = (pools, search) => {
  if (!search || search.length === 0) return pools;
  return pools.filter((pool) => pool.title.includes(search));
};

export default function ViewPools() {
  const { Moralis } = useMoralis();
  const [poolFactoryAddress, setPoolFactoryAddress] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [poolAddresses, setPoolAddresses] = useState([]);
  const [allPools, setAllPools] = useState([]);
  let filteredPools = filterPools(allPools, searchName);

  // eslint-disable-next-line
  useEffect(async () => {
    if (poolFactoryAddress === '') {
      await updateNetworkInfo();
    } else if (!isLoaded) {
      await getPools();
      setIsLoaded(true);
    }
    filteredPools = filterPools(allPools, searchName);
  });

  Moralis.onChainChanged(async () => {
    await updateNetworkInfo();
    await getPools();
  });

  const updateNetworkInfo = async () => {
    await Moralis.enableWeb3();
    const networkId = await Moralis.getChainId();
    if (POOL_FACTORY_ADDRESSES[networkId] !== poolFactoryAddress) {
      setPoolFactoryAddress(POOL_FACTORY_ADDRESSES[networkId]);
    }
  };

  const getPools = async () => {
    if (poolFactoryAddress === '') return;

    let tx = await Moralis.executeFunction({
      functionName: 'getAllPools',
      abi: poolFactoryABI,
      contractAddress: poolFactoryAddress
    });

    if (tx[2].length !== poolAddresses.length) {
      let poolDetails = tx[2].map(async (address) => {
        let rules = await Moralis.executeFunction({
          functionName: 'retrieveRules',
          contractAddress: address,
          abi: poolABI
          // contractAddress: poolContractSpecs.contractAddress
        });
        return {
          title: rules._poolName,
          price: rules._entryFeeInUSD,
          entrants: rules._numberOfPlayers,
          maxPlayers: rules._maximumPlayers,
          etherInPot: rules._etherInPot,
          address: address
        };
      });
      poolDetails = await Promise.all(poolDetails);
      setPoolAddresses(tx[2]);
      setAllPools(poolDetails);
    }
  };

  const search = (event) => {
    (event.target.value.length >= 3 || event.target.value.length === 0) &&
      setSearchName(event.target.value);
  };

  return (
    <div className='page'>
      <Title title='Pools' />
      {filteredPools.length === 0 ? (
        <>
          <p>Look like there aren't any pools yet</p>
          <p>Create one to get started!</p>
        </>
      ) : (
        <>
          <TextField
            id='outlined-name'
            label='Search by name'
            variant='outlined'
            onChange={search}
            size='small'
          />

          <Link className='pull-right' to='/pool/new'>
            <Button variant='outlined'>Make New Pool</Button>
          </Link>
          <RefreshIcon
            className='refresh-icon secondary-color pull-right'
            onClick={getPools}
          />
          <CustomTable type='pool' data={filteredPools} />
        </>
      )}
    </div>
  );
}
