//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

contract SportsDataIOChainlink is ChainlinkClient {
    using Chainlink for Chainlink.Request;
    uint256 oraclePayment;
    bytes32 public data;
    bytes32 constant JOB_ID = bytes32("9abb342e5a1d41c6b72941a3064cf55f");
    uint256 constant PAYMENT = 1 * LINK_DIVISIBILITY;
    uint256 latestPrice;

    constructor(address _oracle) public {
        setPublicChainlinkToken();
        setChainlinkOracle(_oracle);
    }

    function requestSomething(string memory _team) public {
        // build a request that calls the myCallback function defined
        //   below by specifying the address of this contract and the function
        //   selector of the myCallback
        Chainlink.Request memory req = buildChainlinkRequest(
            JOB_ID,
            address(this),
            this.myCallback.selector
        );
        // req.add("date", "_date");
        req.add("teamName", _team);

        // send the request you just built
        sendChainlinkRequest(req, PAYMENT);
    }

    function myCallback(bytes32 _requestId, uint256 _price) public {
        validateChainlinkCallback(_requestId); // always validate callbacks
        latestPrice = _price;
    }

    // function requestData(string memory _date, string memory _team) public {
    //     Chainlink.Request memory req = buildChainlinkRequest(
    //         _jobId,
    //         this,
    //         this.fulfill.selector
    //     );
    //     req.add("date", "_date");
    //     req.add("teamName", "_team");
    //     sendChainlinkRequestTo(_oracle, req, oraclePayment);
    // }

    // function fulfill(bytes32 _requestId, bytes32 _data)
    //     public
    //     recordChainlinkFulfillment(_requestId)
    // {
    //     data = _data;
    // }
}
