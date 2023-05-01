// Import the necessary libraries
const { ethers } = require('hardhat');
const { keccak256 } = require('ethers/lib/utils');
// const { default: ECDSA } = require('@openzeppelin/contracts/utils/cryptography/ECDSA.sol');

async function main() {
  console.log("1");
  // Deploy the test contract for verifying signatures
  const privateKey = "0x4ba35480719fa68c04f812b60a58c78c05674d9ec35f87795cae3c32b55e74fc";
  const wallet = new ethers.Wallet(privateKey);
  const [signer] = await ethers.getSigners();
  signerAddress = signer.getAddress();
  console.log(`Deploying  Contract with the account: ${signer.address}`);
  console.log(signerAddress);
  const Roller = await ethers.getContractFactory('RollerGame');
  const roller = await Roller.deploy();
  await roller.deployed();
  console.log("Contract deployed:", roller.address);
  console.log("2");
  // 
  // console.log("3");
  // 
  // console.log("4");
  // console.log("RollerGame deployed at the address :- ",roller.address);

  // // Get the signer's Ethereum address
  

  
  // console.log("5");
  // console.log("6");

  // // Define the message to be signed and the random number parameter
  // const message = 'Hello, world!';
  // console.log("7");
  // const randomNumber = Math.floor(Math.random() * 100); // Generate a random number between 0 and 99
  // console.log("8");
  // const messageHash = ethers.utils.solidityKeccak256(['string', 'uint256'], [message, randomNumber]);
  // console.log("9");

  // // Sign the message hash using the signer's private key
  // // const signature = await signer.signMessage(ethers.utils.arrayify(messageHash));
  // const signature = await wallet.signMessage(ethers.utils.arrayify(messageHash));
  
  // console.log("10");

  // Verify the signature using the recover function from the ECDSA library
  // const recoveredAddress = ECDSA.recover(messageHash, signature);
  // console.log('Recovered address:', recoveredAddress);
  // console.log('Expected address:', signerAddress);
  // console.log('Signature verification:', recoveredAddress === signerAddress);

  // Verify the signature using the verify function from the test contract
  // const isVerified = await roller.rollOver(randomNumber, message, signature);
  // console.log("11");
  // console.log('Signature verification (via contract):', isVerified);
}

main().catch((error) => {
	console.error(error)
	process.exitCode = 1
});