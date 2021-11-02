//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

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

import "./StringUtils.sol";

/**
 * @title Pool
 * @dev Store & retrieveRules value in a variable
 */
contract Pool {
    uint256 entryFee;
    uint256 maximumPlayers;
    uint256 points;
    // Uints are initialized to 0 automatically
    uint256 numberOfPlayers;
    bool addressHasEntered;

    struct BracketEntry {
        string teamName;
        string[] roundOneWinners;
        string[] roundTwoWinners;
        string[] roundThreeWinners;
        string[] roundFourWinners;
        string[] _roundFiveWinners;
        string overallWinner;
    }

    mapping(address => BracketEntry) public brackets;
    mapping(uint256 => address) private entrants;
    mapping(uint256 => address) private playersTotalPoints;

    constructor(uint256 _entryFee, uint256 _maximumPlayers) public payable {
        require(_entryFee == msg.value);
        entryFee = _entryFee;
        maximumPlayers = _maximumPlayers;
    }

    /**
     * @dev Store value in variable
     * @param _num value to setMaximumPlayers
     */

    function setMaximumPlayers(uint256 _num) public {
        numberOfPlayers = _num;
    }

    function enterPool(
        address _addr,
        string memory _teamName,
        string[] memory _roundOneWinners,
        string[] memory _roundTwoWinners,
        string[] memory _roundThreeWinners,
        string[] memory _roundFourWinners,
        string[] memory _roundFiveWinners,
        string memory _overallWinner
    ) public payable {
        brackets[_addr] = BracketEntry(
            _teamName,
            _roundOneWinners,
            _roundTwoWinners,
            _roundThreeWinners,
            _roundFourWinners,
            _roundFiveWinners,
            _overallWinner
        );
        numberOfPlayers++;
        entrants[numberOfPlayers] = _addr;
    }

    event LogNum(uint256);
    event LogAdd(address);

    function closePool(
        string[] memory _roundOneWinners,
        string[] memory _roundTwoWinners,
        string[] memory _roundThreeWinners,
        string[] memory _roundFourWinners,
        string[] memory _roundFiveWinners,
        string memory _overallWinner
    ) public returns (address) {
        // logic to compare to all brackets
        address _winnerAddr;
        uint256 winnerScore = 0;

        for (uint256 i = 1; i <= numberOfPlayers; i++) {
            uint256 currentScore = 0;
            string memory winner = brackets[entrants[i]].overallWinner;
            if (StringUtils.equal(winner, _overallWinner)) {
                currentScore += 10;
            }

            if (currentScore > winnerScore) {
                winnerScore = currentScore;
                _winnerAddr = entrants[i];
            }
        }

        emit LogNum(numberOfPlayers);
        emit LogAdd(entrants[0]);

        return _winnerAddr;
    }

    /**
     * @dev Return value
     * @return value of 'numberOfPlayers'
     */
    function retrieveRules() public view returns (uint256, uint256) {
        return (maximumPlayers, entryFee);
    }

    function get(address _addr) public view returns (BracketEntry memory) {
        return brackets[_addr];
    }
}
