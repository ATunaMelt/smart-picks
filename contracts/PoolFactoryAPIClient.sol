// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "./Pool.sol";

// 0xc57B33452b4F7BB189bB5AfaE9cc4aBa1f7a4FD8 | oracle
// d5270d1c311941d0b08bead21fea7747 | jobId

contract PoolFactory is ChainlinkClient {
    using Chainlink for Chainlink.Request;
    bytes[] public gamesArray;
    address private oracle;
    bytes32 private jobId;
    uint256 private fee;
    Pool[] public poolArray;
    uint256 public numberOfPoolContracts;
    string public poolName;

    // put _oracleContract & _jobId into a function, not constructor
    constructor(address _oracleContract, string memory _jobId) {
        setPublicChainlinkToken();
        oracle = _oracleContract;
        jobId = bytes32(bytes(_jobId));
        fee = 0.1 * 10**18; // (Varies by network and job)
    }

    function requestFinalScores(string memory _endpoint)
        public
        returns (bytes32 requestId)
    {
        // string memory endpoint = string(
        //     bytes.concat(bytes(_urlBase), bytes(_apiKey))
        // );

        Chainlink.Request memory request = buildChainlinkRequest(
            jobId,
            address(this),
            this.fulfill.selector
        );
        // Set the URL to perform the GET request on
        request.add("get", _endpoint);
        // Set the path to find the desired data in the API response, where the response format is:
        request.add("path", "Games");
        // Sends the request
        return sendChainlinkRequestTo(oracle, request, fee);
    }

    /**
     * Receive the response ?
     */
    function fulfill(bytes32 _requestId, bytes[] memory _gamesArray)
        public
        recordChainlinkFulfillment(_requestId)
    {
        gamesArray = _gamesArray;
    }

    // function withdrawLink() external {} - Implement a withdraw function to avoid locking your LINK in the contract

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
}
