require('dotenv').config(); // Load environment variables
const { Web3 } = require('web3');
const fs = require('fs');
const path = require('path');

// Initialize Web3 using Infura Sepolia URL from the .env file
const web3 = new Web3(process.env.INFURA_URL);

// Ensure necessary environment variables are set
const privateKey = process.env.PRIVATE_KEY;
if (!process.env.INFURA_URL || !privateKey) {
  throw new Error('Please set INFURA_URL and PRIVATE_KEY in .env file');
}

// Path to the compiled contract JSON file
const contractPath = path.resolve(__dirname, '../artifacts/contracts/SwapExamples.sol/SwapExamples.json');
const contractJson = JSON.parse(fs.readFileSync(contractPath, 'utf8'));

// The contract ABI and bytecode
const contractAbi = contractJson.abi;
const contractBytecode = contractJson.bytecode;

// Contract constructor argument (the address to be passed during deployment)
const swapRouterAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'; // Uniswap Router address on Sepolia

async function main() {
  // Create a new contract instance with ABI
  const contract = new web3.eth.Contract(contractAbi);

  // Get the deployer's account from the private key
  const deployerAccount = web3.eth.accounts.privateKeyToAccount(privateKey);
  web3.eth.accounts.wallet.add(deployerAccount);
  const deployer = deployerAccount.address;
  console.log('Deploying contract from account:', deployer);

  // Get the current gas price dynamically

  const gasPrice = web3.utils.toWei('2', 'gwei'); // Set to a lower gas price (e.g., 10 gwei)
  const gasLimit = 3000000;
  const nonce = await web3.eth.getTransactionCount(deployer);
  console.log('Current gas price:', gasPrice);
  // Create the transaction to deploy the contract
  const deployTx = contract.deploy({
    data: contractBytecode,
    arguments: [swapRouterAddress] // The Uniswap router address
  });

  // Estimate the gas needed for deployment
  try {
    const gasEstimate = await deployTx.estimateGas({ from: deployer });
    console.log('Estimated gas for deployment:', gasEstimate);

    // Deploy the contract
    const deployedContract = await deployTx
      .send({
        from: deployer,
        gasPrice: gasPrice,
        gas:gasLimit,
        nonce:nonce,
      })
      .on('receipt', receipt => {
        console.log('Contract deployed at address:', receipt.contractAddress);
        // Log any emitted events here if needed
      })
      .on('error', (error) => {
        console.error('Error deploying contract:', error);
      });

    console.log('Contract deployed successfully!', deployedContract.options.address);
  } catch (error) {
    console.error('Gas estimation failed:', error);
  }
}

main().catch((error) => {
  console.error('Deployment failed:', error);
});
