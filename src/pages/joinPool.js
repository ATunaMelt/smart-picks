import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CustomTable from '../components/table.js';
import Title from '../components/title.js';
import {
  TextField,
  MenuItem,
  Select,
  Typography,
  InputLabel,
  Input,
  FormControl
} from '@mui/material';
import { useMoralis } from 'react-moralis';
import { abi as poolABI } from '../constants/Pool.json';
import { Button } from '@mui/material';
import Bracket from '../components/bracket.js';
import BracketContainer from '../containers/bracketContainer';

export default function JoinPool() {
  const [pool, setPool] = useState({});
  const [selectedBracket, setSelectedBracket] = useState('');
  const [selectedBracketName, setSelectedBracketName] = useState({});

  const { Moralis } = useMoralis();
  const params = useParams();
  let pageTitle = '';
  const [bracket, setBracket] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [teamName, setTeamName] = useState('');
  const allBrackets = JSON.parse(window.localStorage.getItem('brackets')) || [];
  const poolOptions = { abi: poolABI, contractAddress: params.id };

  const retrievePoolInformation = async (address) => {
    await Moralis.enableWeb3();

    let rules = await Moralis.executeFunction({
      functionName: 'retrieveRules',
      contractAddress: params.id,
      ...poolOptions
    });

    pageTitle =
      rules._poolName.length > 30
        ? `${rules._poolName.substring(0, 30)}...`
        : rules._poolName;

    setPool({
      title: rules._poolName,
      price: rules._entryFee,
      entrants: rules._numberOfPlayers,
      maxPlayers: rules._maximumPlayers,
      etherInPot: rules._etherInPot,
      address: params.id
    });
  };

  useEffect(async () => {
    if (!pool.title) {
      await retrievePoolInformation();
    }
  });

  const handleChange = (event) => {
    const val = event.target.value;
    const newBracket =
      val.length > 1
        ? allBrackets.filter((bracket) => bracket.title === val)[0]
        : {};
    setSelectedBracket(newBracket);
    setSelectedBracketName(val);
  };

  const handleInputChange = (event) => {
    setTeamName(event.target.value);
  };

  const onSave = async (bracket) => {
    let tx = await Moralis.executeFunction({
      functionName: 'enterPool',
      params: {
        _teamName: teamName,
        _roundOneWinners: bracket.roundOne,
        _roundTwoWinners: bracket.roundTwo,
        _roundThreeWinners: bracket.roundThree,
        _roundFourWinners: bracket.roundFour,
        _roundFiveWinners: bracket.roundFive,
        _overallWinner: bracket.winner
      },
      msgValue: pool.price,
      ...poolOptions
    });
  };

  return (
    <div className='page'>
      <Title
        title={`Join '${
          pool.title && pool.title.length > 30
            ? `${pool.title.substring(0, 30)}...`
            : pool.title
        }'`}
      />
      <div className='center pool-details'>
        <div className='half'>
          <p>Price to join: {pool.price} </p>
          <p>Max number of players: {pool.maxPlayers}</p>
        </div>
        <div className='half'>
          <p>Ether in pot: {pool.etherInPot}</p>
          <p>Number of entrants: {pool.entrants}</p>
        </div>
      </div>

      <Typography variant='h6' component='h6'>
        Create a bracket to enter the pool
      </Typography>
      {allBrackets.length > 0 && (
        <span>You can select from your saved brackets to get started: </span>
      )}
      {allBrackets.length > 0 && (
        <FormControl
          className='form'
          variant='standard'
          sx={{ m: 1, minWidth: 120 }}
        >
          <Select
            labelId='bracket-dropdown'
            id='bracket-dropdown'
            value={selectedBracketName}
            onChange={handleChange}
            label='Select Bracket'
          >
            <MenuItem value={{}}>
              <em>None</em>
            </MenuItem>
            {allBrackets.map((bracket) => {
              return <MenuItem value={bracket.title}>{bracket.title}</MenuItem>;
            })}
          </Select>
        </FormControl>
      )}

      <div className='input-group'>
        <label for='name'>Enter name for your team: </label>
        <Input name='name' type='string' onChange={handleInputChange} />
      </div>

      <BracketContainer
        saveChanges={onSave}
        buttonText='Join Pool'
        showBracketTitle={false}
        selectedWinners={selectedBracket}
      />
    </div>
  );
}
