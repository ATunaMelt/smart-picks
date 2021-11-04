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
    uint256 public entryFee;
    uint256 public maximumPlayers;
    uint256 points;
    // Uints are initialized to 0 automatically
    uint256 public numberOfPlayers;
    bool addressHasEntered;

    struct BracketEntry {
        string teamName;
        string[] roundOneWinners;
        string[] roundTwoWinners;
        string[] roundThreeWinners;
        string[] roundFourWinners;
        string[] roundFiveWinners;
        string overallWinner;
    }

    mapping(address => BracketEntry) public playersBracketMapping;
    mapping(uint256 => address) private playersAddressMapping;
    mapping(uint256 => address) private playersTotalPoints;

    constructor(uint256 _entryFee, uint256 _maximumPlayers) public {
        entryFee = _entryFee;
        maximumPlayers = _maximumPlayers;
    }

    /**
     * @dev Store value in variable
     * @param _num value to setMaximumPlayers
     */

    function setMaximumPlayers(uint256 _num) public {
        maximumPlayers = _num;
    }

    function enterPool(
        string memory _teamName,
        string[] memory _roundOneWinners,
        string[] memory _roundTwoWinners,
        string[] memory _roundThreeWinners,
        string[] memory _roundFourWinners,
        string[] memory _roundFiveWinners,
        string memory _overallWinner
    ) public payable {
        require(msg.value == entryFee);
        require(_roundOneWinners.length == 32);
        require(_roundTwoWinners.length == 16);
        require(_roundThreeWinners.length == 8);
        require(_roundFourWinners.length == 4);
        require(_roundFiveWinners.length == 2);
        playersBracketMapping[msg.sender] = BracketEntry(
            _teamName,
            _roundOneWinners,
            _roundTwoWinners,
            _roundThreeWinners,
            _roundFourWinners,
            _roundFiveWinners,
            _overallWinner
        );
        numberOfPlayers++;
        playersAddressMapping[numberOfPlayers] = msg.sender;
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
        // logic to compare to all playersBracketMapping
        address _winnerAddr;
        uint256 winnerScore = 0;
        require(_roundOneWinners.length == 32);
        require(_roundTwoWinners.length == 16);
        require(_roundThreeWinners.length == 8);
        require(_roundFourWinners.length == 4);
        require(_roundFiveWinners.length == 2);

        for (uint256 i = 1; i <= numberOfPlayers; i++) {
            uint256 currentScore = 0;
            BracketEntry memory playersBracketStruct = playersBracketMapping[
                playersAddressMapping[i]
            ];
            // ~~~ Round One ~~~~
            currentScore = totalRound(
                playersBracketStruct.roundOneWinners,
                _roundOneWinners,
                1,
                currentScore
            );
            // ~~~ Round Two ~~~~
            // currentScore = totalRound(
            //     playersBracketStruct.roundTwoWinners,
            //     _roundTwoWinners,
            //     1,
            //     currentScore
            // );
            // currentScore = totalRound(
            //     playersBracketStruct.roundThreeWinners,
            //     _roundThreeWinners,
            //     1,
            //     currentScore
            // );
            // currentScore = totalRound(
            //     playersBracketStruct.roundFourWinners,
            //     _roundFourWinners,
            //     1,
            //     currentScore
            // );
            // currentScore = totalRound(
            //     playersBracketStruct.roundFiveWinners,
            //     _roundFiveWinners,
            //     1,
            //     currentScore
            // );

            if (
                StringUtils.equal(
                    playersBracketStruct.overallWinner,
                    _overallWinner
                )
            ) {
                currentScore += 10;
            }

            if (currentScore > winnerScore) {
                winnerScore = currentScore;
                _winnerAddr = playersAddressMapping[i];
            }
        }

        emit LogNum(numberOfPlayers);
        emit LogAdd(playersAddressMapping[0]);

        return _winnerAddr;
    }

    function totalRound(
        string[] memory _playersRound,
        string[] memory _roundWinners,
        uint256 pointsPerGame,
        uint256 currentScore
    ) internal returns (uint256) {
        emit LogNum(_roundWinners.length);

        // for (uint256 i = 0; i < _roundWinners.length; i++) {
        //     if (StringUtils.equal(_playersRound[i], _roundWinners[i])) {
        //         currentScore += pointsPerGame;
        //     }
        // }
        return currentScore;
    }

    /**
     * @dev Return value
     * @return value of 'numberOfPlayers'
     */
    function retrieveRules() public view returns (uint256, uint256) {
        return (maximumPlayers, entryFee);
    }

    function get(address _addr) public view returns (BracketEntry memory) {
        return playersBracketMapping[_addr];
    }
}
