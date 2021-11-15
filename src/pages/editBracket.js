import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Title from '../components/title.js';
import BracketContainer from '../containers/bracketContainer';

export default function EditBracket() {
  const [bracket, setBracket] = useState();
  const allBrackets = JSON.parse(window.localStorage.getItem('brackets')) || [];
  const params = useParams();

  const getBracket = () => {
    const savedBracket = allBrackets.filter(
      (bracket) => bracket.id.toString() === params.id.toString()
    )[0];
    setBracket(savedBracket);
  };

  useEffect(() => {
    if (!bracket || !bracket.winner) {
      getBracket();
    }
  });

  const onSave = (newBracket) => {
    const updatedBrackets = allBrackets.map((bkt) => {
      if (bkt.id.toString() === bracket.id.toString()) {
        return { ...bkt, ...newBracket };
      } else return bkt;
    });
    window.localStorage.setItem('brackets', JSON.stringify(updatedBrackets));
  };

  return (
    <div className='page'>
      <Title title='Edit Bracket' />

      <BracketContainer
        saveChanges={onSave}
        buttonText='Update Bracket'
        showBracketTitle={true}
        selectedWinners={bracket}
      />
    </div>
  );
}
