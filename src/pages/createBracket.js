import { useState } from 'react';
import BracketContainer from '../containers/bracketContainer';
import Title from '../components/title';
import { Redirect } from 'react-router-dom';

export default function CreateBracket() {
  const [isSaved, setIsSaved] = useState(false);

  const onSave = (bracket) => {
    const allBrackets = JSON.parse(window.localStorage.getItem('brackets')) || [];
    bracket.id = allBrackets.length;
    allBrackets.push(bracket);
    window.localStorage.setItem('brackets', JSON.stringify(allBrackets));
    setIsSaved(true);
  }

  return isSaved ? <Redirect to={'/brackets'} /> : (
    <div className='page'>
      <Title title='Create Bracket' />
      <BracketContainer saveChanges={onSave} buttonText='Save' showBracketTitle={true} />
    </div>
  )
}
