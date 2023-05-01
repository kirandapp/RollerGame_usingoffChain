const { ethers } = require('hardhat');
async function main() {
	const [deployer] = await ethers.getSigners()
	console.log(`Deploying  Contracts with the account: ${deployer.address}`);
	const Roller = await ethers.getContractFactory('RollerGame');
	console.log('\nDeploying RollerGame...');
	const roller = await Roller.deploy();
	await roller.deployed();
	console.log('RollerGame contract deployed at: ', roller.address);
    const Token = await ethers.getContractFactory('MyToken');
    console.log('\nDeploying Token...');
    const token = await Token.deploy();
    await token.deployed();
    console.log('Token contract deployed at: ',token.address);
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
	console.error(error)
	process.exitCode = 1
});
