async function main() {
  const Game = await ethers.getContractFactory("Game");
  console.log("Deploying Game...");
  const game = await Game.deploy();
  await game.deployed();
  console.log("Game deployed to:", game.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
