//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;
import "./Pool.sol";

contract PoolFactory {
    Pool[] public poolArray;

    function createNewPool(uint256 _entryFee, uint256 _maximumPlayers) public {
        Pool pool = new Pool(_entryFee, _maximumPlayers);
        poolArray.push(pool);
    }
}
