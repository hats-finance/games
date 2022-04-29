# Hats Challenge #1

## Task: Capture the Flag

`Game.sol` encodes a card fighting game where the goal is to obtain the flag by pitching your deck of Mons against the deck of the flagholder and win the fight

- anyone can join the game calling `game.join()`
- on joining, a player receives a deck of 3 pseudo-random Mons
- each Mon is an NFT, and each Mon has powers: FIRE; WATER; AIR and SPEED, each with a value in a range from [0,9]
- users can try to improve their deck by swapping their Mons with other users, or by exchanging a Mon for a randomly generated new one
- for a swap to succeed, another player must put of one of their Mons for sale

- at each moment, one player holds the flag
- other players can try to capture the flag by fighting the flag holder
- a fight between two Mons takes place with one of the 3 elements (FIRE, WATER or AIR). The Mon with the highest value in that element wins the fight. If the two mons have the same strength, the Mon with the most SPEED wins.
- A fight between two decks consists of pairing the three Mons of the challenger with the 3 Mons of the flag holder, pseudo-randomly choosing 3 elements, and then having the 3 pairs fight in each of these elements

## THE HATS CHALLENGE:

- Obtain the flag: i.e. `game.flag()` should return an address that you control
