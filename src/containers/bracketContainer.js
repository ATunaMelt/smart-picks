import { useState } from 'react';
import Brackets from '../components/bracket';
import { Button, Input } from '@mui/material';
import PropTypes from 'prop-types';

export default function BracketContainer(props) {
  const [isValid, setIsValid] = useState(false);
  const [bracket, setBracket] = useState({});
  const { selectedWinners, saveChanges } = props;

  const setWinners = (
    roundOne,
    roundTwo,
    roundThree,
    roundFour,
    roundFive,
    overall
  ) => {
    let isReady = true;
    if (!roundOne.every((item) => item)) isReady = false;
    if (!roundTwo.every((item) => item)) isReady = false;
    if (!roundThree.every((item) => item)) isReady = false;
    if (!roundFour.every((item) => item)) isReady = false;
    if (!roundFive.every((item) => item)) isReady = false;
    if (!overall) isReady = false;
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
      saveChanges(bracket);
    }
  };

  const handleInputChange = (event) => {
    bracket.title = event.target.value;
  };

  return (
    <div className='bracket-page'>
      {props.showBracketTitle && props.selectedWinners && (
        <div className='input-group'>
          <label for='name'>Enter name for the bracket: </label>
          <Input
            name='name'
            type='string'
            defaultValue={selectedWinners.title}
            onChange={handleInputChange}
          />
        </div>
      )}
      <Brackets setWinners={setWinners} selectedWinners={selectedWinners} />
      <Button variant='outlined' disabled={!isValid} onClick={onSave}>
        {props.buttonText}
      </Button>
    </div>
  );
}

BracketContainer.propTypes = {
  saveChanges: PropTypes.func.isRequired,
  buttonText: PropTypes.string.isRequired,
  showBracketTitle: PropTypes.bool.isRequired,
  selectedWinners: PropTypes.object
};
