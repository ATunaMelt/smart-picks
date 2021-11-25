import kovanPoolFactoryAddress from '../constants/kovan/poolFactoryAddress.js';
import fujiPoolFactoryAddress from '../constants/fuji/poolFactoryAddress.js';
import mumbaiPoolFactoryAddress from '../constants/mumbai/poolFactoryAddress.js';

export const POOL_FACTORY_ADDRESSES = {
  80001: mumbaiPoolFactoryAddress,
  1: fujiPoolFactoryAddress,
  42: kovanPoolFactoryAddress
};

export const NETWORK_IDS = [
  '80001', // Polygon mumbai testnet
  '1', // Avalanche fuji testnet
  '42' // Eth kovan testnet
];
