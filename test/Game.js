const { expect } = require("chai");

describe("Game contract", function () {
  let game;
  let attack;
  let deployer;
  let attacker;
  beforeEach(async function () {
    [deployer, player1, player2] = await ethers.getSigners();
    const Game = await ethers.getContractFactory("Game");
    game = await Game.deploy();
  });

  it("Basic game", async function () {
    [deployer] = await ethers.getSigners();

    const flagHolder = await game.flag();
    expect(flagHolder).to.equal(deployer.address);

    // player joins the game
    const tx = await game.connect(player1).join();
    const receipt = await tx.wait();
    // get a tokenID
    const monId1 = receipt.events[0].args.tokenId;
    const monId2 = receipt.events[1].args.tokenId;
    const monId3 = receipt.events[2].args.tokenId;
    expect(await game.ownerOf(monId1)).to.equal(player1.address);
    await game.connect(player1).fight();
    // because the deployer has 3 supermons, he should win
    expect(await game.flag()).to.equal(deployer.address);
  });

  it("Swap", async function () {
    const tx = await game.connect(player1).join();
    const receipt = await tx.wait();
    // get a tokenID
    const monId1 = receipt.events[0].args.tokenId;
    const tx2 = await game.connect(player2).join();
    const receipt2 = await tx2.wait();
    // get a tokenID
    const monId2 = receipt2.events[0].args.tokenId;

    await game.connect(player2).putUpForSale(monId2);
    await game.connect(player1).swap(player2.address, monId1, monId2);
    expect(await game.ownerOf(monId1)).to.equal(player2.address);
    expect(await game.ownerOf(monId2)).to.equal(player1.address);
  });

  it("swapForNewCard", async function () {
    const tx = await game.connect(player1).join();
    const receipt = await tx.wait();
    // get a tokenID
    const monId1 = receipt.events[0].args.tokenId;
    await game.connect(player1).swapForNewCard(monId1, 0);
    await expect(game.ownerOf(monId1)).to.revertedWith("nonexistent token");
  });
});
