//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;
import "./Pool.sol";

contract PoolFactory {
    Pool[] public poolArray;

    function createNewPool() public {
        Pool pool = new Pool();
        poolArray.push(pool);
    }
}
