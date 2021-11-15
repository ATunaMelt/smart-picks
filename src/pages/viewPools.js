import { useState, useEffect } from 'react';
import CustomTable from '../components/table.js';
import Title from '../components/title.js';
import { TextField } from '@mui/material';
import { useMoralis } from 'react-moralis';
import { abi as factoryABI } from '../constants/PoolFactory.json';
import { abi as poolABI } from '../constants/Pool.json';
import poolFactoryAddress from '../constants/poolFactoryAddress.js';
import { Button } from '@mui/material';

const filterPools = (pools, search) => {
  if (!search || search.length === 0) return pools;
  return pools.filter((pool) => pool.title.includes(search));
};

export default function ViewPools() {
  const { Moralis } = useMoralis();
  const factoryOptions = {
    abi: factoryABI,
    contractAddress: poolFactoryAddress
  };
  const poolOptions = { abi: poolABI };

  const [searchName, setSearchName] = useState('');
  const [poolAddresses, setPoolAddresses] = useState([]);
  const [allPools, setAllPools] = useState([]);
  let filteredPools = filterPools(allPools, searchName);

  const getPools = async () => {
    await Moralis.enableWeb3();
    let tx = await Moralis.executeFunction({
      functionName: 'getAllPools',
      ...factoryOptions
    });

    if (tx[2].length !== poolAddresses.length) {
      let poolDetails = tx[2].map(async (address) => {
        let rules = await Moralis.executeFunction({
          functionName: 'retrieveRules',
          contractAddress: address,
          ...poolOptions
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
  useEffect(async () => {
    if (allPools.length === 0) {
      await getPools();
    }
    filteredPools = filterPools(allPools, searchName);
  });

  const search = (event) => {
    (event.target.value.length >= 3 || event.target.value.length === 0) &&
      setSearchName(event.target.value);
  };

  return (
    <div className='page'>
      <Title title='Pools' />
      <Button variant='outlined' onClick={getPools}>
        {'Refresh Pools'}
      </Button>

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
          <CustomTable type='pool' data={filteredPools} />
        </>
      )}
    </div>
  );
}
