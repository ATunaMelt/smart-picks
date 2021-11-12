//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

/*
Still needed:
    1. Additional functionality for tiered payouts, currently winner take all
    2. Chainlink keeper should be calling close pool function, it should be the only one able
*/

/**
 * @title Pool
 * @dev Store & retrieveRules value in a variable
 */
contract Pool {
    string public poolName;
    uint256 public entryFee;
    uint256 public maximumPlayers;
    uint256 public etherInPot;
    uint256 public numberOfPlayers;

    address winner;
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
        bool hasEntered;
    }

    mapping(address => BracketEntry) public playersBracketMapping;
    mapping(uint256 => address) public playersAddressMapping;
    mapping(uint256 => address) private playersTotalPoints;

    constructor(
        string memory _poolName,
        uint256 _entryFee,
        uint256 _maximumPlayers
    ) {
        poolName = _poolName;
        entryFee = _entryFee;
        maximumPlayers = _maximumPlayers;
        etherInPot = 0;
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
        require(
            playersBracketMapping[msg.sender].hasEntered != true,
            "Sender has already entered bracket"
        );
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

        playersBracketMapping[msg.sender] = BracketEntry(
            _teamName,
            _roundOneWinners,
            _roundTwoWinners,
            _roundThreeWinners,
            _roundFourWinners,
            _roundFiveWinners,
            _overallWinner,
            msg.sender,
            true
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
        address winnerAddress;
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
            // ~~~ Round Three ~~~~
            currentScoreForPlayer = totalRound(
                playersBracketStruct.roundThreeWinners,
                _roundThreeWinners,
                1,
                currentScoreForPlayer
            );
            // ~~~ Round Four ~~~~
            currentScoreForPlayer = totalRound(
                playersBracketStruct.roundFourWinners,
                _roundFourWinners,
                1,
                currentScoreForPlayer
            );
            // ~~~ Round Five ~~~~
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
                winnerAddress = playersBracketStruct.sender;
            }
        }
        bool sent = payWinner(winnerAddress);
        require(sent, "Failed to send Ether");
        winner = winnerAddress;
    }

    // Helper Functions
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

    // Getter functions
    function getNumberEntries() public view returns (uint256) {
        return numberOfPlayers;
    }

    function getWinnerAddress() public view returns (address) {
        return winner;
    }

    function getPlayersEntry(address _addr)
        public
        view
        returns (BracketEntry memory)
    {
        return playersBracketMapping[_addr];
    }

    function retrieveRules()
        public
        view
        returns (
            string memory _poolName,
            uint256 _entryFee,
            uint256 _maximumPlayers,
            uint256 _etherInPot,
            uint256 _numberOfPlayers
        )
    {
        _poolName = poolName;
        _entryFee = entryFee;
        _maximumPlayers = maximumPlayers;
        _etherInPot = etherInPot;
        _numberOfPlayers = numberOfPlayers;
    }
}
