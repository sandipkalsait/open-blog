import express from 'express';
import { create } from 'ipfs-http-client';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const router = express.Router();

// Initialize IPFS client
const ipfs = create({
  host: process.env.IPFS_HOST,  // 127.0.0.1 from .env
  port: process.env.IPFS_PORT,  // 5001 from .env
  protocol: process.env.IPFS_PROTOCOL, // http from .env
});

// Upload content to IPFS
router.post('/upload', async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }

  console.log('Uploading content:', content);

  try {
    // Add content to IPFS
    const result = await ipfs.add(content);
    const ipfsHash = result.path; // Retrieve the IPFS hash

    console.log('Uploaded to IPFS successfully:', ipfsHash);
    res.status(200).json({ hash: ipfsHash });
  } catch (error) {
    console.error('Failed to upload to IPFS:', error.message);
    res.status(500).json({ error: 'Failed to upload to IPFS', details: error.message });
  }
});

// Retrieve content from IPFS
router.get('/retrieve/:hash', async (req, res) => {
  const { hash } = req.params;

  if (!hash) {
    return res.status(400).json({ error: 'IPFS hash is required' });
  }

  console.log('Retrieving content from IPFS for hash:', hash);

  try {
    // Retrieve content from IPFS
    const chunks = [];
    for await (const chunk of ipfs.cat(hash)) {
      chunks.push(chunk);
    }
    const content = Buffer.concat(chunks).toString();

    console.log('Content retrieved from IPFS:', content);
    res.status(200).send(content);
  } catch (error) {
    console.error('Failed to retrieve content from IPFS:', error.message);
    res.status(500).json({ error: 'Failed to retrieve content from IPFS', details: error.message });
  }
});

export default router;
