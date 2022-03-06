pragma solidity 0.8.12;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/**
  FIGHTING GAME

  - each player has a deck of 3 monsters, each monster is an NFT
  - users can try to improve their deck by monsters with other users (for a fee)
  - monsters have a FIRE; WATER; AIR and SPEED, each power in a range from [0,9]
  - So a monster "3459" has 3 fire, 4 water, 5 air and 9 speed
  - the total score of a monster never exceeds 21
  - monsters can fight in one of the elements, the monster with the highest score in that element wins. If the score is the same, the fastest monster wins.
  - player can put up their deck for challenges by setting a bounty
  - other players can accept the challenge. They need to match the bounty. 
  - a fight consists of psuedo-randomly choosing 3 elements, and matching the 3 monsters
  - loosing monsters are burned
  - the winner will take the bounty
--------------
THE CHALLENGE:
  - Superplayer holds the flag and has a special deck with 3 "9999" monsters. Your task is to create a deck to win the bounty.
 */
contract Game is ERC721 {
  uint256 public totalBalance; // total amount of monsters available
  uint256 private nonce = 123;
  uint8 constant WATER = 0;
  uint8 constant AIR = 1;
  uint8 constant FIRE = 2;
  uint8 constant MAX_POINTS = 22;
  uint8 constant DECK_SIZE = 3;

  struct Mon {
    uint8 water;
    uint8 air;
    uint8 fire;
    uint8 speed;
  }

  
  mapping(uint256 => Mon) public mons;

  mapping(address => uint256[3]) public decks;

  mapping(uint256 => bool) public forSale;

  address flag;

  constructor() ERC721("Hats Game 1", "HG1") {
    // create a superdeck for this contract
    Mon memory superMon = Mon(9,9,9,9);
    for (uint8 i; i < DECK_SIZE;i++) {
      uint256 tokenId = totalBalance;
      totalBalance += 1;
      mons[tokenId] = superMon;
      decks[address(this)][i] = tokenId;
    }
    flag = address(this);
  }
  
  function join() public {
    require(balanceOf(msg.sender) == 0, "player already joined");
    // give the player 3 pseudoramon Mons
    _mintMon(msg.sender);
    _mintMon(msg.sender);
    _mintMon(msg.sender);

  }


  // function openForChallenges(uint256[3] calldata deck) public {
  //   for (uint8 i; i < 3; ) {
  //     require(ownerOf(deck[i]) == msg.sender, "You can only fight with Mons you own");
  //   }
  //   readyToFight[msg.sender] = deck;
  // }

  function fight(address _opponent, uint256[3] calldata deck) public {
    for (uint8 i; i < 3; ) {
      require(ownerOf(deck[i]) == msg.sender, "You can only fight with Mons you own");
    }

    require(flag == _opponent, "Youc an only fight the opponent that holds the flag");
    
    // fight the two decks (something liek this, logic to be added)
    uint256[3] memory deck0 = deck;
    uint256[3] memory deck1 = decks[_opponent];
    
    for (uint8 i = 0; i < deck0.length; i++) {
      uint8 element = randomGen(3);
      // if the first player wins, burn the Mon of the second player
      if (_fight(deck0[i], deck1[i], element)) {
        _burn(deck1[i]);
      } else {
        _burn(deck0[i]);
      }
    }
    address winner;
    // winner is the player with most Mons left
    if (balanceOf(msg.sender) > balanceOf(_opponent)) {
        winner = msg.sender;
    } else {
        winner = _opponent;
    }
    // replenish balance of both players so they can play again
    for (uint i = balanceOf(msg.sender); i < DECK_SIZE; i++) {
      _mintMon(msg.sender);
    }
    for (uint i = balanceOf(_opponent); i < DECK_SIZE; i++) {
      _mintMon(_opponent);
    }
  }

  function _fight(uint256 _mon0, uint256 _mon1, uint8 element) internal view returns(bool) {
    assert(element < 3);
    Mon memory mon0;
    Mon memory mon1;
    if (mons[_mon0].speed < mons[_mon1].speed) {
      mon0 = mons[_mon0];
      mon1 = mons[_mon1];
    } else {
      mon0 = mons[_mon1];
      mon1 = mons[_mon0];
    }

    if (element == WATER) {
      return mon0.water < mon1.water;
    } else if (element == AIR) {
      return mon0.air < mon1.air;
    } else if (element == FIRE) {
      return mon0.fire < mon1.fire;
    } else {
      assert(false);
    }
  }

  function forSale(uint256 _monId) public {
    require(ownerOf(_monId) == msg.sender, "Can only put your own mons up for sale");
    forSale[_montId] = true;
  }
  function swap(uint256 _mon1, address _to, uint256 _mon2) public {
    require(forSale[_mon1], "Canoot swap a Mon that is no for sale");
    require(msg.sender != _to, "cannot swap a card with yourself");
    _safeTransfer(msg.sender, _to, _mon1, "");
    _safeTransfer(_to, msg.sender, _mon1, "");
  }


  function swapForNewCard(uint256 _mon) public {
    _burn(_mon);
    _mintMon(msg.sender);
  }

 
  function _mintMon(address _to, Mon memory newMon) internal {
    uint256 tokenId = totalBalance;
    totalBalance += 1;
    mons[tokenId] = newMon;
    _mint(_to, tokenId);
 
  }
  function _mintMon(address _to) internal {
    Mon memory newMon = genMon();
    _mintMon(_to, newMon);

  }

  function genMon() private returns (Mon memory newMon) {
    // generate a new Mon
    uint8 fire = randomGen(9);
    uint8 water = randomGen(9);
    uint8 air = randomGen(MAX_POINTS - fire - water);
    uint8 speed = MAX_POINTS - fire - water - air;
    newMon = Mon(fire, water, air, speed);
  }

  // function that generates pseudorandom numbers
  function randomGen(uint256 i) private returns (uint8) {
    uint8 x = uint8(uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, nonce))) % i);
    nonce++;
    return x;
  }
}
