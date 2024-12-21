import Web3 from 'web3';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Check if the necessary environment variables are defined
if (!process.env.RPC_URL) {
  console.error("RPC_URL is not defined in the .env file");
  process.exit(1); // Exit if RPC_URL is missing
}

const web3 = new Web3(process.env.RPC_URL); // Ensure RPC_URL is defined in .env

// Deploy the contract
const deploy = async () => {
  try {
    // Get the accounts from the Ethereum network (Ganache, Infura, etc.)
    const accounts = await web3.eth.getAccounts();

    // Check if accounts are available
    if (accounts.length === 0) {
      console.error("No accounts found. Ensure Ganache or your provider is running.");
      process.exit(1);
    }

    // Get the ABI and bytecode
    const abiPath = path.resolve('build', 'ContentManager.abi');
    const binPath = path.resolve('build', 'ContentManager.bin');

    if (!fs.existsSync(abiPath) || !fs.existsSync(binPath)) {
      console.error("ABI or bytecode file not found. Please build the contract first.");
      process.exit(1);
    }

    const abi = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
    const bytecode = fs.readFileSync(binPath, 'utf8');

    // Create the contract
    const contract = new web3.eth.Contract(abi);

    // Estimate gas required for deployment
    const estimatedGas = await contract
      .deploy({ data: bytecode })
      .estimateGas({ from: accounts[0] });

    console.log(`Estimated Gas: ${estimatedGas}`);

    // Deploy the contract
    const deployedContract = await contract
      .deploy({ data: bytecode })
      .send({ from: accounts[0], gas: estimatedGas });

    console.log('Contract deployed to:', deployedContract.options.address);
  } catch (error) {
    console.error('Deployment failed:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
  }
};

deploy();
