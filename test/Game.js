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

    const flagHolder = await game.flagHolder();
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
    expect(await game.flagHolder()).to.equal(deployer.address);
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

  it("swapForNewMon", async function () {
    const tx = await game.connect(player1).join();
    const receipt = await tx.wait();
    // get a tokenID
    const monId1 = receipt.events[0].args.tokenId;
    await game.connect(player1).swapForNewMon(monId1);
    await expect(game.ownerOf(monId1)).to.revertedWith("nonexistent token");
  });

  it("Sane Mon Generation", async function () {
    [deployer] = await ethers.getSigners();

    const flagHolder = await game.flagHolder();
    expect(flagHolder).to.equal(deployer.address);

    // player joins the game
    const tx = await game.connect(player1).join();
    const receipt = await tx.wait();
    // get a tokenID
    const monId1 = receipt.events[0].args.tokenId;
    const mon1 = await game.mons(monId1);
    await expect(mon1.water).to.be.lessThanOrEqual(9);
    await expect(mon1.air).to.be.lessThanOrEqual(9);
    await expect(mon1.fire).to.be.lessThanOrEqual(9);
    await expect(mon1.speed).to.be.lessThanOrEqual(9);
  });

  it("transfer fails", async function () {
    const tx = await game.connect(player1).join();
    const receipt = await tx.wait();
    // get a tokenID
    const monId1 = receipt.events[0].args.tokenId;
    expect(await game.balanceOf(player1.address)).to.equal(3);
    await expect(
      game.transferFrom(player1.address, player2.address, monId1)
    ).to.be.revertedWith("disabled");
    await expect(
      game["safeTransferFrom(address,address,uint256,bytes)"](
        player1.address,
        player2.address,
        monId1,
        []
      )
    ).to.be.revertedWith("disabled");
    await expect(
      game["safeTransferFrom(address,address,uint256)"](
        player1.address,
        player2.address,
        monId1
      )
    ).to.be.revertedWith("disabled");
  });
});
