import Moralis from 'moralis';

import {
  aggregatorV3InterfaceABI,
  aggregatorV3InterfaceAddress
} from '../constants/aggregatorV3Interface';
const aggregatorV3InterfaceOptions = {
  abi: aggregatorV3InterfaceABI,
  contractAddress: aggregatorV3InterfaceAddress
};
export const lastPrice = async () => {
  await Moralis.enableWeb3();
  let etherPriceUSD = await Moralis.executeFunction({
    functionName: 'latestRoundData',
    ...aggregatorV3InterfaceOptions
  });
  return etherPriceUSD[1] / 100000000;
};
