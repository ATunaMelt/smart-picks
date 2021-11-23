//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// 10^18 wei = 1 ether
/*
Still needed:
    1. Additional functionality for tiered payouts, currently winner take all
    2. Chainlink keeper should be calling close pool function, it should be the only one able
*/
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

/**
 * @title Pool
 * @dev Store & retrieveRules value in a variable
 */
contract Pool {
    string public poolName;
    int256 public entryFeeInUSD;
    uint256 public maximumPlayers;
    uint256 public etherInPot;
    uint256 public numberOfPlayers;

    address public winner;
    bool addressHasEntered;

    AggregatorV3Interface internal priceFeed;

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

    mapping(address => BracketEntry) public addressToBracketMap;
    mapping(uint256 => address) public uintToAddressMap;
    mapping(uint256 => address) private playersScoreToAddressMap;

    constructor(
        string memory _poolName,
        int256 _entryFeeInUSD,
        uint256 _maximumPlayers
    ) {
        poolName = _poolName;
        // Chainlink price feed will return 8 decimals for USD, so we normalized to match to two
        entryFeeInUSD = _entryFeeInUSD * 10**8;
        maximumPlayers = _maximumPlayers;
        etherInPot = 0;
        priceFeed = AggregatorV3Interface(
            0x9326BFA02ADD2366b30bacB125260Af641031331
        );
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
            addressToBracketMap[msg.sender].hasEntered != true,
            "Sender has already entered bracket"
        );
        // require(normalizeEntryFee(msg.value) >= entryFeeInUSD);
        require(checkEntryFee(int256(msg.value)), "Entry fee not sufficient");

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

        addressToBracketMap[msg.sender] = BracketEntry(
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

        uintToAddressMap[numberOfPlayers] = msg.sender;
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
        // logic to compare to all addressToBracketMap
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

            BracketEntry memory playersBracketStruct = addressToBracketMap[
                uintToAddressMap[i]
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
    // Keeper function - WIP
    // function checkUpkeep(bytes calldata checkData)
    //     external
    //     returns (bool upkeepNeeded, bytes memory performData)
    // {
    //     return 1;
    // }

    function getCurrentEntryFeeInWei() public view returns (int256) {
        int256 entryFeeInWei = entryFeeInUSD * 10**18;
        entryFeeInWei = entryFeeInWei / getLatestPrice();
        return entryFeeInWei;
    }

    function checkEntryFee(int256 value) public view returns (bool) {
        // was the passed in value higher than the original entry fee?
        return (value >= getCurrentEntryFeeInWei());
    }

    function getLatestPrice() public view returns (int256) {
        (
            uint80 roundID,
            int256 price,
            uint256 startedAt,
            uint256 timeStamp,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();
        return price;
    }

    function compareStrings(string memory a, string memory b)
        internal
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

    function getPlayersEntry(address _addr)
        public
        view
        returns (BracketEntry memory)
    {
        return addressToBracketMap[_addr];
    }

    function retrieveRules()
        public
        view
        returns (
            string memory _poolName,
            int256 _entryFeeInUSD,
            uint256 _maximumPlayers,
            uint256 _etherInPot,
            uint256 _numberOfPlayers
        )
    {
        _poolName = poolName;
        _entryFeeInUSD = entryFeeInUSD;
        _maximumPlayers = maximumPlayers;
        _etherInPot = etherInPot;
        _numberOfPlayers = numberOfPlayers;
    }
}
