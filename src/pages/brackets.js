import { useState, useEffect } from 'react';
import CustomTable from '../components/table.js';
import Title from '../components/title.js';
import { TextField, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const filterBrackets = (brackets, search) => {
  if (!search || search.length === 0) return brackets;
  return brackets.filter((bracket) => bracket.title.includes(search));
};

export default function BracketPage() {
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
          <Link className='center' to='/brackets/new'>
            <Button variant='outlined'>Make New Bracket</Button>
          </Link>
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
          <Link className='pull-right' to='/brackets/new'>
            <Button variant='outlined'>Make New Bracket</Button>
          </Link>
          <CustomTable type='bracket' data={userBrackets} />
        </>
      )}
    </div>
  );
}
