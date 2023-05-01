
const { ethers, web3 } = require('hardhat');
const { chai } = require('chai');
const { logger } = require('ethers');
require('dotenv').config()
// const { web3 } = require('web3');

// chai.use(solidity);

describe("Roller Game", () => {
    let roller, tokenTest, randomgenerate;

    beforeEach(async () => {
        const [signers] = await ethers.getSigners();

        console.log("Signers address :- ",signers.address);
        // prepare the contract for deployment
        const tokenFactory = await ethers.getContractFactory("MyToken");
        tokenTest = (await tokenFactory.deploy());
        await tokenTest.deployed();
        console.log("\nToken Contract Address - ",tokenTest.address);

        const Roller = await ethers.getContractFactory("RollerGame",signers.address);
        // DEPLOY
        roller = (await Roller.deploy());
        await roller.deployed();
        console.log("\nRoller Game Contract Address - ",roller.address);       
        
        const RandomGenerate = await ethers.getContractFactory("RollerGame",signers.address);
        // DEPLOY
        randomgenerate = (await RandomGenerate.deploy());
        await randomgenerate.deployed();
        console.log("Random num Generation Contract Address - ",randomgenerate.address); 
    });

    describe("test", async () => {

        it("test basic signing from client", async () => {
            const privateKey = `${ process.env.PRIVATE_KEY }`
            const wallet = new ethers.Wallet(privateKey);
            const [adminwallet] = await ethers.getSigners();
            console.log("\nAdmin Wallet :- ",adminwallet.address);

            const randomNumber = Math.floor(Math.random() * 100) + 1;
            console.log(" \nGenerated Random Number is - ",randomNumber);
            const time = Date.now()+"";
            console.log(" time - ",time);
            // const letnonce = web3.utils.keccak256(web3.eth.abi.encodeParameters(['string', 'uint'], [nonce, randomNumber]));

            //mint token to the game contract
            await tokenTest.connect(adminwallet).mint(roller.address, 500);
            await tokenTest.connect(adminwallet).mint(adminwallet.address, 100);
            await tokenTest.connect(adminwallet).approve(roller.address, 100);
            console.log("\nContract BEFORE Token Balance - ",await tokenTest.balanceOf(roller.address));
            console.log("User BEFORE Token Balance - ",await tokenTest.balanceOf(adminwallet.address));

            // STEP 1:
            let messageHash = ethers.utils.solidityKeccak256(["uint"],[time]);
            console.log("message - ", messageHash);

            // STEP 2:
            let message = ethers.utils.arrayify(messageHash);

            // STEP 3:
            let signature = await wallet.signMessage(message);
            console.log("\nsignature :- ",signature);

            // STEP 4: rollover function
            await roller.connect(adminwallet).initialize(tokenTest.address, randomgenerate.address);
            console.log("\nreading token address ",await roller.token());
            await roller.connect(adminwallet).rollOver(2, time, signature, {gasLimit: 200000});
            console.log("\nContract AFTER Token Balance - ",await tokenTest.balanceOf(roller.address));
            console.log("User AFTER Token Balance - ",await tokenTest.balanceOf(adminwallet.address));

            // // STEP 5 : rollUnder function
            // console.log("\nContract BEFORE Token Balance - ",await tokenTest.balanceOf(roller.address));
            // console.log("User BEFORE Token Balance - ",await tokenTest.balanceOf(adminwallet.address));
            // result = await roller.connect(adminwallet).rollUnder(2, randomNumber, signature, {gasLimit: 200000});
            // console.log("\nContract AFTER Token Balance - ",await tokenTest.balanceOf(roller.address));
            // console.log("User AFTER Token Balance - ",await tokenTest.balanceOf(adminwallet.address));
        });
    });
});


// const coupon = Date.now()+"";
// const encryptedCoupon = web3.utils.keccak256(coupon);

// console.log("encryptedCoupon", encryptedCoupon);

// const message = web3.utils
//   .soliditySha3({ t: "string", v: coupon })
//   .toString("hex");

// console.log("message", message);


// // const privKey = "52ee4defadbc3954f9deb49b2e62664df875a5e5529624511e1a930361c72232";

// const { signature } = web3.eth.accounts.sign(
//   encryptedCoupon,  
//     privKey
//   );

// console.log("signature", signature);