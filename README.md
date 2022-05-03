# Hats Challenge #1

## Capture the Flag

The contract [`Game.sol`](./contracts/Game.sol) encodes a card fighting game where the goal is to obtain the flag by pitching your deck of Mons against the deck of the flagholder and win the fight

- anyone can join the game calling `game.join()`
- on joining, a player receives a deck of 3 pseudo-random Mons
- each Mon is an NFT, and each Mon has powers: FIRE; WATER; AIR and SPEED, each with a value in a range from [0,9]
- users can try to improve their deck by swapping their Mons with other users, or by exchanging a Mon for a randomly generated new one
- for a swap to succeed, another player must put one of their Mons for sale
- at each moment, one single player holds the flag
- other players can try to capture the flag by challing the flag holder
- a fight between two Mons takes place with one of the 3 elements (FIRE, WATER or AIR). The Mon with the highest value in that element wins the fight. If the two Mons have the same strength, the Mon with the most SPEED wins. If the two Mons are excatly the same, the flag holder wins.
- A fight between two decks consists of pairing the three Mons of the challenger with the 3 Mons of the flag holder, pseudo-randomly choosing 3 elements, and then having the 3 pairs fight in each of these elements

## The Hats Challenge

The [`Game.sol`](./contracts/Game.sol) is deployed with the flagHolder holding an apparently unbeatable deck with perfect Mons.

Your mission is to obtain the flag: i.e. `game.flagHolder()` should return an address that you control

## How to submit

- Solutions must be submitted through the hats application at https://app.hats.finance/vulnerability
- To win our $10,000 bounty, you must submit a working demonstration of the solution. This could be, for example, a hardhat project in which you fork mainnet and provide a script that will obtain the flag.
- First submitter of a complete solution will win the game, and receive the $10,000 bounty and an NFT
- The contract is deployed on rinkeby: https://rinkeby.etherscan.io/address/0x9E4c331120448816450615349BD25605e4A2049E . However, if you do not want to give away the solution to your competitors, do not execute anything on-chain :)
