// kovan contract
import { abi as kovanFactoryABI } from '../constants/kovan/PoolFactory.json';
import { abi as kovanPoolABI } from '../constants/kovan/Pool.json';
import kovanPoolFactoryAddress from '../constants/kovan/poolFactoryAddress.js';

// fuji contract
import { abi as fujiFactoryABI } from '../constants/fuji/PoolFactory.json';
import { abi as fujiPoolABI } from '../constants/fuji/Pool.json';
import fujiPoolFactoryAddress from '../constants/fuji/poolFactoryAddress.js';

// mumbai contract
import { abi as mumbaiFactoryABI } from '../constants/mumbai/PoolFactory.json';
import { abi as mumbaiPoolABI } from '../constants/mumbai/Pool.json';
import mumbaiPoolFactoryAddress from '../constants/mumbai/poolFactoryAddress.js';

export default function getPoolInfo(network) {
  switch (network) {
    case 'kovan':
      return {
        poolFactoryABI: kovanFactoryABI,
        poolABI: kovanPoolABI,
        factoryAddress: kovanPoolFactoryAddress
      };
    case 'fuji':
      return {
        poolFactoryABI: fujiFactoryABI,
        poolABI: fujiPoolABI,
        factoryAddress: fujiPoolFactoryAddress
      };
    case 'mumbai':
      return {
        poolFactoryABI: mumbaiFactoryABI,
        poolABI: mumbaiPoolABI,
        factoryAddress: mumbaiPoolFactoryAddress
      };
    default:
      return {};
  }
}
