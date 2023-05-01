
const { ethers } = require('hardhat');
const { chai } = require('chai');

// chai.use(solidity);

describe("Roller Game", () => {
    let roller, tokenTest;

    beforeEach(async () => {
        const privateKey = "0x4ba35480719fa68c04f812b60a58c78c05674d9ec35f87795cae3c32b55e74fc";
        const wallet = new ethers.Wallet(privateKey);
        // Get eth signers
        const [signers] = await ethers.getSigners();
        // prepare the contract for deployment
        const tokenFactory = await ethers.getContractFactory("MyToken");
        tokenTest = (await tokenFactory.deploy());
        await tokenTest.deployed();
        console.log("Token Contract Address - ",tokenTest.address);

        const counterFactory = await ethers.getContractFactory("RollerGame",signers.address);
        // DEPLOY
        roller = (await counterFactory.deploy());
        await roller.deployed();
        console.log("Roller Game Contract Address - ",roller.address);        
    });

    describe("test", async () => {

        it("test basic signing from client", async () => {
            const privateKey = "0x4ba35480719fa68c04f812b60a58c78c05674d9ec35f87795cae3c32b55e74fc";
            const wallet = new ethers.Wallet(privateKey);
            const [adminWallet] = await ethers.getSigners();
            const randomNumber = Math.floor(Math.random() * 100) + 1;
            console.log(" \nGenerated Random Number is - ",randomNumber);

            //mint token to the game contract
            await tokenTest.connect(adminWallet).mint(roller.address, 500);
            await tokenTest.connect(adminWallet).mint(adminWallet.address, 100);
            await tokenTest.connect(adminWallet).approve(roller.address, 100);
            console.log("\nContract BEFORE Token Balance - ",await tokenTest.balanceOf(roller.address));
            console.log("User BEFORE Token Balance - ",await tokenTest.balanceOf(adminWallet.address));

            // STEP 1:
            // building hash has to come from system address
            // 32 bytes of data
            let messageHash = ethers.utils.solidityKeccak256(
                ["uint"],
                [randomNumber]
            );

            // STEP 2: 32 bytes of data in Uint8Array
            let messageHashBinary = ethers.utils.arrayify(messageHash);

            // STEP 3: To sign the 32 bytes of data, make sure you pass in the data
            // let signature = await adminWallet.signMessage(messageHashBinary);
            let signature = await wallet.signMessage(messageHashBinary);
            console.log("\nsignature :- ",signature);

            // STEP 4: Fire off the transaction with the adminWallet signed data
            await roller.connect(adminWallet).initialize(tokenTest.address);
            console.log("\nreading token address ",await roller.token());
            let result = await roller.connect(adminWallet).rollOver(2, randomNumber, signature, {gasLimit: 200000});
            // console.log("Guess is ",result);
            console.log("\nContract AFTER Token Balance - ",await tokenTest.balanceOf(roller.address));
            console.log("User AFTER Token Balance - ",await tokenTest.balanceOf(adminWallet.address));

            // STEP 5 : rollUnder transaction
            // console.log("\nContract BEFORE Token Balance - ",await tokenTest.balanceOf(roller.address));
            // console.log("User BEFORE Token Balance - ",await tokenTest.balanceOf(adminWallet.address));
            // await roller.connect(adminWallet).initialize(tokenTest.address);
            // console.log("\nreading token address ",await roller.token());
            // result = await roller.connect(adminWallet).rollUnder(2, randomNumber, signature, {gasLimit: 200000});
        });
    });
});