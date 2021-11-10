//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;
import "./Pool.sol";

contract PoolFactory {
    Pool[] public poolArray;
    uint256 public numberOfPoolContracts;

    function createNewPool(uint256 _entryFee, uint256 _maximumPlayers)
        public
        returns (address)
    {
        Pool pool = new Pool(_entryFee, _maximumPlayers);
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
}
