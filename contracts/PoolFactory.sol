//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;
import "./Pool.sol";
import {
    ISuperfluid,
    ISuperToken,
    ISuperAgreement,
    SuperAppDefinitions
} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";

import {
    IConstantFlowAgreementV1
} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IConstantFlowAgreementV1.sol";

import {
    SuperAppBase
} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperAppBase.sol";

contract PoolFactory {
    Pool[] public poolArray;
    uint256 public numberOfPoolContracts;
    string public poolName;

    function createNewPool(
        string memory _poolName,
        int256 _entryFeeInUSD,
        uint256 _maximumPlayers
    ) public returns (address) {
        Pool pool = new Pool(_poolName, _entryFeeInUSD, _maximumPlayers);
        poolArray.push(pool);
        numberOfPoolContracts++;
        return address(pool);
    }

    function getAllPools()
        public
        view
        returns (
            uint256,
            uint256,
            Pool[] memory
        )
    {
        return (numberOfPoolContracts, poolArray.length, poolArray);
    }

    // 1. bring in Superfluid

    function distributePrizes() private {
      // this is O(n^2)
      // 1. loop through all of the pools
      // 2. get winner for each pool
      // 3. create payout object for winner, push to list (?)
      // 4. send out all prizes (as one transaction?)
    }

    function getWinner(uint poolIdx) return (address) {
      // 1. retrieve pool info based off of poolIdx
      // 2. call closePool for it, retrieving winner address;
      // 3. return address
    }
}
