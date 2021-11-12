import { useState, useEffect } from 'react';
import CustomTable from '../components/table.js';
import Title from '../components/title.js';
import { TextField } from '@mui/material';
import { useMoralis } from 'react-moralis';

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
      <Title title='My Brackets' />
      {userBrackets.length === 0 ? (
        <>
          <p> Look like you don't have any brackets saved.</p>
          <p>Create one to get started!</p>
        </>
      ) : (
        <>
          <TextField
            id='outlined-name'
            label='Search by name'
            variant='outlined'
            onChange={search}
            size='small'
          />
          <CustomTable type='bracket' data={userBrackets} />
        </>
      )}
    </div>
  );
}
