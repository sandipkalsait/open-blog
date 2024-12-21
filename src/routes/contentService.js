import Web3 from 'web3';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

// import { CONTRACT_ABI, CONTRACT_ADDRESS } from './config.js';

const web3 = new Web3(process.env.RPC_URL);
// Get the ABI and bytecode
const abi = JSON.parse(fs.readFileSync(path.resolve('build', 'ContentManager.abi'), 'utf8'));

// Create the contract
const contract = new web3.eth.Contract(abi);
// This function fetches the content from the blockchain
async function getAllContent() {
  const contentCount = await contract.methods.getPostCount().call();
  const contentList = [];

  for (let i = 0; i < contentCount; i++) {
    const content = await contract.methods.getContent(i).call();
    contentList.push(content);
  }

  return contentList;
}

export { getAllContent };
