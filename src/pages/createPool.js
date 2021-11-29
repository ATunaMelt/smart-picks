/* eslint-disable no-unused-vars */
import { Input, Button, InputAdornment } from '@mui/material';
import { useState, useEffect } from 'react';
import { useMoralis } from 'react-moralis';
import Title from '../components/title';
import { abi } from '../constants/PoolFactoryABI.json';
import poolFactoryAddress from '../constants/kovan/poolFactoryAddress.js';
import PropTypes from 'prop-types';
import { POOL_FACTORY_ADDRESSES } from '../constants/web3-constants.js';

export default function CreatePool(props) {
  const { Moralis } = useMoralis();
  let options = { abi, contractAddress: poolFactoryAddress };
  const [entryFee, setEntryFee] = useState(1);
  const [maximumPlayers, setMaximumPlayers] = useState(2);
  const [poolName, setPoolName] = useState('');

  const createNewSmartContract = async (event) => {
    props.updateSnacks('info', 'Pool is pending');
    const networkId = await Moralis.getChainId();
    const poolFactoryAddress = POOL_FACTORY_ADDRESSES[networkId];
    let tx = await Moralis.executeFunction({
      functionName: 'createNewPool',
      params: {
        _poolName: poolName,
        _entryFeeInUSD: entryFee,
        _maximumPlayers: maximumPlayers
      },
      abi: abi,
      contractAddress: poolFactoryAddress
    });

    props.updateSnacks('success', 'Successfully created pool');
  };
  const handleInputChange = (event, contractInput) => {
    if (contractInput === 'players') setMaximumPlayers(event.target.value);
    if (contractInput === 'fee') setEntryFee(event.target.value);
    if (contractInput === 'name') setPoolName(event.target.value);
  };

  return (
    <div className='page'>
      <Title title='Create Pool' />
      <div className='create-section'>
        <div className='input-group'>
          <label htmlFor='name'>Enter name for the pool: </label>
          <Input
            required='true'
            name='name'
            type='string'
            defaultValue={poolName}
            onChange={(event) => {
              handleInputChange(event, 'name');
            }}
          />
        </div>

        <div className='input-group'>
          <label htmlFor='players'>Enter Number of players:</label>
          <Input
            required='true'
            name='players'
            type='number'
            defaultValue={maximumPlayers}
            inputProps={{ min: '2' }}
            onChange={(event) => {
              handleInputChange(event, 'players');
            }}
          />
        </div>

        <div className='input-group'>
          <label htmlFor='fee'>Enter entry fee:</label>
          <Input
            required='true'
            name='fee'
            type='number'
            InputAdornment='$'
            defaultValue={entryFee}
            inputProps={{ min: '1' }}
            onChange={(event) => {
              handleInputChange(event, 'fee');
            }}
            startAdornment={<InputAdornment position='start'>$</InputAdornment>}
          />
        </div>
        <Button variant='outlined' onClick={createNewSmartContract}>
          {'Create Pool'}
        </Button>
      </div>
    </div>
  );
}

CreatePool.propTypes = {
  updateSnacks: PropTypes.func.isRequired
};
