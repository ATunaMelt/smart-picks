//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;
import "./PoolMumbai.sol";

contract MumbaiPoolFactory {
    PoolMumbai[] public poolArray;
    uint256 public numberOfPoolContracts;
    string public poolName;

    function createNewPool(
        string memory _poolName,
        int256 _entryFeeInUSD,
        uint256 _maximumPlayers
    ) public returns (address) {
        PoolMumbai pool = new PoolMumbai(
            _poolName,
            _entryFeeInUSD,
            _maximumPlayers
        );
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
            PoolMumbai[] memory
        )
    {
        return (numberOfPoolContracts, poolArray.length, poolArray);
    }
}
