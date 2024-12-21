import express from 'express';
import { addContent, getContent, getPostCount } from '../utils/blockchain.js';

const router = express.Router();

// Route to fetch all content
router.get('/', async (req, res) => {
  try {
    const count = await getPostCount();
    const content = [];

    for (let i = 0; i < count; i++) {
      const contentData = await getContent(i);
      content.push(contentData);
    }

    // Render the view with the content array
    res.render('pages/index', { content }); // Correct path for views/index.ejs
  } catch (error) {
    console.error('Error fetching content:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Route to add content
router.post('/add-content', async (req, res) => {
  const { title, ipfsHash } = req.body;

  try {
    await addContent(title, ipfsHash);
    res.status(200).json({ message: 'Content added successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to fetch content by index
router.get('/content/:index', async (req, res) => {
  const index = parseInt(req.params.index, 10);

  try {
    const content = await getContent(index);
    res.status(200).json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get total post count
router.get('/posts/count', async (req, res) => {
  try {
    const count = await getPostCount();
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
