import { ethers } from 'ethers';
import * as dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

// Load ABI
const contractAbi = JSON.parse(fs.readFileSync('./build/ContentManager.abi', 'utf-8'));

// Setup provider and wallet
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Initialize contract instance
const contractAddress = process.env.CONTRACT_ADDRESS; // Deployed address
if (!contractAddress) {
  console.error(
    'Error: CONTRACT_ADDRESS is not set in the .env file. Deploy the contract first and update the .env file.'
  );
  process.exit(1);
}

const contract = new ethers.Contract(contractAddress, contractAbi, wallet);

/**
 * Add content to the blockchain
 * @param {string} title - The title of the blog post
 * @param {string} ipfsHash - The IPFS hash of the content
 */
export const addContent = async (title, ipfsHash) => {
  try {
    console.log(`Adding content: Title="${title}", IPFS Hash="${ipfsHash}"`);
    const tx = await contract.addContent(title, ipfsHash, {
      gasPrice: ethers.parseUnits(process.env.DEFAULT_GAS_PRICE, 'wei'),
    });
    await tx.wait(); // Wait for transaction confirmation
    console.log('Content added successfully!');
  } catch (error) {
    console.error('Error adding content:', error.message);
  }
};

/**
 * Retrieve content from the blockchain
 * @param {number} index - Index of the content
 */
export const getContent = async (index) => {
  try {
    console.log(`Fetching content at index: ${index}`);
    const content = await contract.getContent(index);
    console.log(`Content retrieved: Title="${content[0]}", IPFS Hash="${content[1]}", Author="${content[2]}"`);
    return {
      title: content[0],
      ipfsHash: content[1],
      author: content[2],
    };
  } catch (error) {
    console.error('Error fetching content:', error.message);
    throw error; // Rethrow the error for further handling
  }
};

/**
 * Get total number of posts
 */
export const getPostCount = async () => {
  try {
    const count = await contract.getPostCount();
    console.log('Count:', count); // Log the count to see its value and type
    console.log('Count Type:', typeof count); // Check the type of count

    if (count && count.toNumber) {
      console.log('Total posts:', count.toNumber());
      return count.toNumber(); // Use .toNumber() if it's a BigNumber
    } else {
      console.log('Total posts:', Number(count)); // Fallback if it's not a BigNumber
      return Number(count); // Return it as a regular number
    }
  } catch (error) {
    console.error('Error getting post count:', error.message);
  }
};
