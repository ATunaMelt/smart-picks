import { useState, useEffect } from 'react';
import Brackets from '../components/bracket';
import { Button, Input } from '@mui/material';
import PropTypes from 'prop-types';

export default function BracketContainer(props) {
  const [isValid, setIsValid] = useState(false);
  const [bracket, setBracket] = useState({});
  const { selectedWinners, saveChanges } = props;

  useEffect(() => {
    if (selectedWinners?.winner && !bracket.winner) {
      setWinners(
        selectedWinners.roundOne,
        selectedWinners.roundTwo,
        selectedWinners.roundThree,
        selectedWinners.roundFour,
        selectedWinners.roundFive,
        selectedWinners.winner
      );
      bracket.title = selectedWinners.title;
    }
  });

  const setWinners = (
    roundOne,
    roundTwo,
    roundThree,
    roundFour,
    roundFive,
    overall
  ) => {
    bracket.roundOne = roundOne;
    bracket.roundTwo = roundTwo;
    bracket.roundThree = roundThree;
    bracket.roundFour = roundFour;
    bracket.roundFive = roundFive;
    bracket.winner = overall;

    validateEntry();
  };

  const validateEntry = () => {
    let isReady = true;
    if (!bracket.roundOne.every((item) => item)) isReady = false;
    if (!bracket.roundTwo.every((item) => item)) isReady = false;
    if (!bracket.roundThree.every((item) => item)) isReady = false;
    if (!bracket.roundFour.every((item) => item)) isReady = false;
    if (!bracket.roundFive.every((item) => item)) isReady = false;
    if (!bracket.winner) isReady = false;
    if (bracket.title === '') isReady = false;

    if (isReady !== isValid) setIsValid(isReady);
  };

  const onSave = () => {
    if (isValid) {
      saveChanges(bracket);
    }
  };

  const handleInputChange = (event) => {
    bracket.title = event.target.value;
    validateEntry();
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
