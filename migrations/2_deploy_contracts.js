const Auction = artifacts.require("Auction");

module.exports = async function(deployer) {
  await deployer.deploy(Auction);
};