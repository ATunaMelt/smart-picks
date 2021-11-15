import { Web3Provider } from '@ethersproject/providers';
import { Input, ButtonS, Button } from '@mui/material';
import { useState } from 'react';
import { useMoralis } from 'react-moralis';
import Title from '../components/title';
import { abi } from '../constants/PoolFactory.json';
import poolFactoryAddress from '../constants/poolFactoryAddress.js';
import { aggregatorV3InterfaceABI } from '../constants/aggregatorV3InterfaceABI';

/*
const Web3 = require('web3'); // for nodejs only
const web3 = new Web3(
  `https://eth-kovan.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`
);
const addr = '0x9326BFA02ADD2366b30bacB125260Af641031331';
const priceFeed = new web3.eth.Contract(aggregatorV3InterfaceABI, addr);
 */

export default function CreatePool() {
  const { Moralis } = useMoralis();
  const options = { abi, contractAddress: poolFactoryAddress };
  const [entryFee, setEntryFee] = useState(1);
  const [maximumPlayers, setMaximumPlayers] = useState(2);
  const [poolName, setPoolName] = useState('');

  /*
  const getLastPrice = () =>
    priceFeed.methods
      .latestRoundData()
      .call()
      .then((roundData) => {
        // Do something with roundData
        console.log('Latest Round Data', roundData);
      });
  */
  const createNewSmartContract = async (event) => {
    let tx = await Moralis.executeFunction({
      functionName: 'createNewPool',
      params: {
        _poolName: poolName,
        _entryFee: entryFee,
        _maximumPlayers: maximumPlayers
      },
      ...options
    });
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
            name='fee'
            type='number'
            defaultValue={entryFee}
            inputProps={{ min: '1' }}
            onChange={(event) => {
              handleInputChange(event, 'fee');
            }}
          />
        </div>
        <Button variant='outlined' onClick={console.log('hi')}>
          {'Update price'}
        </Button>
        <Button variant='outlined' onClick={createNewSmartContract}>
          {'Create Pool'}
        </Button>
      </div>
    </div>
  );
}
