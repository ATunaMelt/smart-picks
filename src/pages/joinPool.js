/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import Title from '../components/title.js';
import {
  MenuItem,
  Select,
  Typography,
  Input,
  FormControl
} from '@mui/material';
import { useMoralis } from 'react-moralis';
import { abi } from '../constants/PoolABI.json';
import BracketContainer from '../containers/bracketContainer';
import Web3 from 'web3';
import {
  aggregatorV3InterfaceABI,
  aggregatorV3InterfaceAddress
} from '../constants/aggregatorV3Interface';

export default function JoinPool(props) {
  const { Moralis } = useMoralis();
  const params = useParams();
  const poolOptions = { abi, contractAddress: params.id };
  const aggregatorV3InterfaceOptions = {
    abi: aggregatorV3InterfaceABI,
    contractAddress: aggregatorV3InterfaceAddress
  };
  const [pool, setPool] = useState({});
  const [selectedBracket, setSelectedBracket] = useState('');
  const [selectedBracketName, setSelectedBracketName] = useState({});
  const [teamName, setTeamName] = useState('');

  const allBrackets = JSON.parse(window.localStorage.getItem('brackets')) || [];

  const retrievePoolInformation = async (address) => {
    await Moralis.enableWeb3();
    let rules = await Moralis.executeFunction({
      functionName: 'retrieveRules',
      contractAddress: params.id,
      ...poolOptions
    });

    setPool({
      title: rules._poolName,
      price: rules._entryFeeInUSD,
      entrants: rules._numberOfPlayers,
      maxPlayers: rules._maximumPlayers,
      etherInPot: rules._etherInPot,
      address: params.id
    });
  };

  const lastPrice = async () => {
    await Moralis.enableWeb3();
    let etherPriceUSD = await Moralis.executeFunction({
      functionName: 'latestRoundData',
      ...aggregatorV3InterfaceOptions
    });
    return etherPriceUSD[1];
  };
  // eslint-disable-next-line
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
  const entryFeeToWei = async () => {
    return await Moralis.executeFunction({
      functionName: 'getCurrentEntryFeeInWei',
      ...poolOptions
    });
  };

  const onSave = async (bracket) => {
    props.updateSnacks('info', 'Join pool is pending');
    try {
    let _msgValue = await entryFeeToWei(pool.price);
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
      msgValue: _msgValue,
      ...poolOptions
    });
    props.updateSnacks('success', 'Successfully joined pool');
  } catch (err) {
    props.updateSnacks('error', 'Error joining pool');

  }
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
          <p>Price to join: {'$ ' + pool.price / 10 ** 8} </p>
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

JoinPool.propTypes = {
  updateSnacks: PropTypes.func.isRequired
};
