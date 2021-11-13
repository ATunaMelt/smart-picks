import { useState } from 'react';
import Brackets from '../components/bracket';
import Title from '../components/title';
import { Button, Input } from '@mui/material';
import { Redirect } from 'react-router-dom';

export default function CreateBracket() {
  const [isValid, setIsValid] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [bracket, setBracket] = useState({});

  const setWinners = (roundOne, roundTwo, roundThree, roundFour, roundFive, overall) => {
    let isReady = true;
    if(!roundOne.every((item) => item)) isReady = false;
    if(!roundTwo.every((item) => item)) isReady = false;
    if(!roundThree.every((item) => item)) isReady = false;
    if(!roundFour.every((item) => item)) isReady = false;
    if(!roundFive.every((item) => item)) isReady = false;
    if(!overall) isReady = false;
    if (isReady !== isValid) setIsValid(isReady);
    if (isReady) {
      bracket.roundOne = roundOne;
      bracket.roundTwo = roundTwo;
      bracket.roundThree = roundThree;
      bracket.roundFour = roundFour;
      bracket.roundFive = roundFive;
      bracket.winner = overall;
    }
  };

  const onSave = () => {
    if (isValid) {
      const allBrackets = JSON.parse(window.localStorage.getItem('brackets')) || [];
      allBrackets.push(bracket);
      window.localStorage.setItem('brackets', JSON.stringify(allBrackets));
      setIsSaved(true);
    }
  }

  const handleInputChange = (event) => {
    bracket.title = event.target.value;
  };

  return isSaved ? <Redirect to={'/brackets'} /> : (
    <div className='page'>
    <Title title='Create Bracket' />
    <div className='bracket-page'>
      <div className='input-group'>
        <label for='name'>Enter name for the bracket: </label>
          <Input
            name='name'
            type='string'
            onChange={handleInputChange}
          />
        </div>
        <Brackets setWinners={setWinners}/>
        <Button variant='outlined' disabled={!isValid} onClick={onSave}>Save</Button>
      </div>
    </div>
  )
}
