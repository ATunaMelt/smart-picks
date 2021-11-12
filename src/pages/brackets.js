import { useState, useEffect } from 'react';
import CustomTable from '../components/table.js';
import Title from '../components/title.js';
<<<<<<< HEAD
import { TextField, Button } from '@mui/material';
import {Link} from 'react-router-dom';
=======
import { TextField } from '@mui/material';
import { useMoralis } from 'react-moralis';
>>>>>>> 811e341f84dd810b2b37581008996a64779f1e8a

const filterBrackets = (brackets, search) => {
  if (!search || search.length === 0) return brackets;
  return brackets.filter((bracket) => bracket.title.includes(search));
};

export default function BracketPage() {
  const { Moralis } = useMoralis();

  const [searchName, setSearchName] = useState('');
  const allBrackets = JSON.parse(window.localStorage.getItem('brackets')) || [];
  let userBrackets = filterBrackets(allBrackets, searchName);

  useEffect(() => {
    userBrackets = filterBrackets(allBrackets, searchName);
  });

  const search = (event) => {
    (event.target.value.length >= 3 || event.target.value.length === 0) &&
      setSearchName(event.target.value);
  };

  return (
    <div className='page'>
<<<<<<< HEAD
      <Title title='My Brackets'/>

      { userBrackets.length === 0 ? <>
          <p> Look like you don't have any brackets saved.</p>
          <p>Create one to get started!</p>
        </> : <>

=======
      <Title title='My Brackets' />
      {userBrackets.length === 0 ? (
        <>
          <p> Look like you don't have any brackets saved.</p>
          <p>Create one to get started!</p>
        </>
      ) : (
        <>
>>>>>>> 811e341f84dd810b2b37581008996a64779f1e8a
          <TextField
            id='outlined-name'
            label='Search by name'
            variant='outlined'
            onChange={search}
<<<<<<< HEAD
            size="small"/>
          <Link className='pull-right' to='/brackets/new'>
            <Button variant='outlined'>Make New Bracket</Button>
          </Link>
=======
            size='small'
          />
>>>>>>> 811e341f84dd810b2b37581008996a64779f1e8a
          <CustomTable type='bracket' data={userBrackets} />
        </>
      )}
    </div>
  );
}
