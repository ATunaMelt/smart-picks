import { useState, useEffect } from 'react';
import CustomTable from '../components/table.js';
import Title from '../components/title.js';
import { TextField } from '@mui/material';
import { useMoralis } from 'react-moralis';
import { abi as factoryABI } from '../constants/PoolFactory.json';
import { abi as poolABI } from '../constants/Pool.json';
import poolFactoryAddress from '../constants/poolFactoryAddress.js';
import { Button } from '@mui/material';

export default function JoinPool() {
  return <div>Joining Pools</div>;
}
