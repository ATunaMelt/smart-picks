pragma solidity >=0.8.0 <0.9.0;

//SPDX-License-Identifier: MIT

/*
Pool contract lifecycle
  Pool is created, with its first entry included from the creator.
    Pool constructor needs several params:
      How many entrants?
      What is the buy in price?
      Winner take all set (This can be changed later)
    Pool contract needs several functions
      Recieve Additional submissions
        params will include:
          New submission fee
          New submission bracket
      a final submission should close further submissions
    Pool contract's final function is to payout the winner
      the winner will have the greatest amount of points
      Points will be determined when the chainlink keep calls the tally function
      the tally function will get the winners of each of the games, and preform
      the totalPoints() function on each user and then return the winning user, along with the payout transaction.
 */
contract Pool {
    address payable[] public players;
    uint256 public usdEntryFee;
    AggregatorV3Interface internal ethUsdPriceFeed;

    constructor() public {
        usdEntryFee = 50 * (10**18);
        ethUsdPriceFeed = AggregatorV3Interface()
    }

    function createPool() public {}

    function newEntrant() public {
        players.push(msg.sender);
    }

    function payWinner() public {}

    function getMinimumEntry() public {}
}
