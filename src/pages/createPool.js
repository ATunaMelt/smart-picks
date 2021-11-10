import { Web3Provider } from '@ethersproject/providers';
import { Input, ButtonS, Button } from '@mui/material';
import { useState } from 'react';
import { useMoralis } from 'react-moralis';
import Title from '../components/title';
import { abi } from '../constants/PoolFactory.json';

const poolFactoryAddress = '0xfa27c64a57851e4e586b39b06fa91e0592fb25bc';

export default function CreatePool() {
  const { Moralis } = useMoralis();
  console.log(Moralis);
  const options = { abi, contractAddress: poolFactoryAddress };
  const [entryFee, setEntryFee] = useState(0);
  const [maximumPlayers, setMaximumPlayers] = useState(0);

  const createNewSmartContract = async (event) => {
    console.log(entryFee, maximumPlayers);
    let tx = await Moralis.executeFunction({
      functionName: 'createNewPool',
      params: { _entryFee: entryFee, _maximumPlayers: maximumPlayers },
      ...options,
    });
  };
  const handleInputChange = (event, contractInput) => {
    let newAmount = event.target.value === 2 ? 2 : event.target.value;
    console.log(newAmount);
    if (contractInput === 'entrants') setMaximumPlayers(newAmount);
    if (contractInput === 'fee') setEntryFee(newAmount);
  };

  return (
    <div className='page'>
      <Title title='My Brackets' />
      <p>
        Enter Number of players:
        <Input
          type='number'
          inputProps={{ min: '2' }}
          onChange={(event) => {
            handleInputChange(event, 'entrants');
          }}
        />
      </p>
      <p>
        Enter entry fee:
        <Input
          type='number'
          inputProps={{ min: '1' }}
          onChange={(event) => {
            handleInputChange(event, 'fee');
          }}
        />
      </p>
      <Button onClick={createNewSmartContract}>{'Create Pool'}</Button>
    </div>
  );
}
