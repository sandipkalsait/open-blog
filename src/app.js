import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import contentRoutes from './routes/contentRoutes.js';
import ipfsRoutes from './routes/ipfsRoutes.js';
import { getContent, getPostCount } from './utils/blockchain.js';
import path from 'path';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Get the current directory (equivalent of __dirname in ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));  // Corrected path

// Middleware to parse incoming JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (e.g., CSS, JS)
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(__dirname + '/public', { extensions: ['html', 'css', 'js'] }));



// Define the route for the homepage
app.get('/', async (req, res) => {
  try {
    // Fetch content from blockchain or your database
    const count = await getPostCount();
    const content = [];

    for (let i = 0; i < count; i++) {
      const contentData = await getContent(i);
      content.push(contentData);
    }

    // Pass content to the view
    res.render('pages/index', { content });
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).send('Error fetching content');
  }
});

// Use routes for handling content and IPFS operations
app.use('/api', contentRoutes);
app.use('/api', ipfsRoutes);

export default app;
