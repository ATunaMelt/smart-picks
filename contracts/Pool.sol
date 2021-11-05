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

/**
 * @title Pool
 * @dev Store & retrieveRules value in a variable
 */
contract Pool {
    uint256 public entryFee;
    uint256 public maximumPlayers;
    uint256 points;
    uint256 public etherInPot;
    address winner;
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
        address sender;
    }

    mapping(address => BracketEntry) public playersBracketMapping;
    mapping(uint256 => address) public playersAddressMapping;
    mapping(uint256 => address) private playersTotalPoints;

    constructor(uint256 _entryFee, uint256 _maximumPlayers) {
        entryFee = _entryFee;
        maximumPlayers = _maximumPlayers;
        etherInPot = 0;
    }

    /**
     * @dev Store value in variable
     * @param _num value to setMaximumPlayers
     */

    function setMaximumPlayers(uint256 _num) public {
        maximumPlayers = _num;
    }

    function getNumberEntries() public view returns (uint256) {
        return numberOfPlayers;
    }

    function getWinnerAddress() public view returns (address) {
        return winner;
    }

    function enterPool(
        string memory _teamName,
        string[] memory _roundOneWinners,
        string[] memory _roundTwoWinners,
        string[] memory _roundThreeWinners,
        string[] memory _roundFourWinners,
        string[] memory _roundFiveWinners,
        string memory _overallWinner
    ) public payable returns (address) {
        require(msg.value >= entryFee, "Entry fee not sufficient");
        require(
            _roundOneWinners.length == 32,
            "roundOneWinners length incorrect"
        );
        require(
            _roundTwoWinners.length == 16,
            "roundTwoWinners length incorrect"
        );
        require(
            _roundThreeWinners.length == 8,
            "roundThreeWinners length incorrect"
        );
        require(
            _roundFourWinners.length == 4,
            "roundFourWinners length incorrect"
        );
        require(
            _roundFiveWinners.length == 2,
            "roundFiveWinners length incorrect"
        );

        require(
            abi.encode(playersBracketMapping[msg.sender]).length > 0,
            "Sender has already entered bracket"
        );

        playersBracketMapping[msg.sender] = BracketEntry(
            _teamName,
            _roundOneWinners,
            _roundTwoWinners,
            _roundThreeWinners,
            _roundFourWinners,
            _roundFiveWinners,
            _overallWinner,
            msg.sender
        );

        playersAddressMapping[numberOfPlayers] = msg.sender;
        etherInPot = etherInPot + msg.value;
        numberOfPlayers++;
        address sender = msg.sender;
        return sender;
    }

    function closePool(
        string[] memory _roundOneWinners,
        string[] memory _roundTwoWinners,
        string[] memory _roundThreeWinners,
        string[] memory _roundFourWinners,
        string[] memory _roundFiveWinners,
        string memory _overallWinner
    ) public payable {
        // logic to compare to all playersBracketMapping
        address _winnerAddr;
        uint256 winnerScore = 0;
        require(_roundOneWinners.length == 32);
        require(_roundTwoWinners.length == 16);
        require(_roundThreeWinners.length == 8);
        require(_roundFourWinners.length == 4);
        require(_roundFiveWinners.length == 2);

        // todo: add in require for only keeper can call this function

        for (uint256 i = 0; i <= numberOfPlayers - 1; i++) {
            uint256 currentScoreForPlayer = 0;

            BracketEntry memory playersBracketStruct = playersBracketMapping[
                playersAddressMapping[i]
            ];
            // ~~~ Round One ~~~~
            currentScoreForPlayer = totalRound(
                playersBracketStruct.roundOneWinners,
                _roundOneWinners,
                1,
                currentScoreForPlayer
            );
            // ~~~ Round Two ~~~~
            currentScoreForPlayer = totalRound(
                playersBracketStruct.roundTwoWinners,
                _roundTwoWinners,
                1,
                currentScoreForPlayer
            );
            currentScoreForPlayer = totalRound(
                playersBracketStruct.roundThreeWinners,
                _roundThreeWinners,
                1,
                currentScoreForPlayer
            );
            currentScoreForPlayer = totalRound(
                playersBracketStruct.roundFourWinners,
                _roundFourWinners,
                1,
                currentScoreForPlayer
            );
            currentScoreForPlayer = totalRound(
                playersBracketStruct.roundFiveWinners,
                _roundFiveWinners,
                1,
                currentScoreForPlayer
            );

            if (
                compareStrings(
                    playersBracketStruct.overallWinner,
                    _overallWinner
                )
            ) {
                currentScoreForPlayer += 10;
            }

            if (currentScoreForPlayer > winnerScore) {
                winnerScore = currentScoreForPlayer;
                _winnerAddr = playersBracketStruct.sender;
            }
        }

        bool sent = payable(_winnerAddr).send(entryFee);
        require(sent, "Failed to send Ether");
        winner = _winnerAddr;
    }

    function totalRound(
        string[] memory _playersRound,
        string[] memory _roundWinners,
        uint256 pointsPerGame,
        uint256 currentScoreForPlayer
    ) internal pure returns (uint256) {
        for (uint256 i = 0; i < _roundWinners.length; i++) {
            if (compareStrings(_playersRound[i], _roundWinners[i])) {
                currentScoreForPlayer += pointsPerGame;
            }
        }
        return currentScoreForPlayer;
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

    function compareStrings(string memory a, string memory b)
        public
        pure
        returns (bool)
    {
        return (keccak256(abi.encodePacked((a))) ==
            keccak256(abi.encodePacked((b))));
    }

    function payWinner(address winnerAddress) internal returns (bool) {
        bool sent = payable(winnerAddress).send(etherInPot);
        return sent;
    }
}
