# Open-Blog Project(UNDER DEVELOPMENT)

Open-Blog is a decentralized blogging platform designed for learning and exploring Web3 technologies. It allows users to upload and retrieve blog posts securely using IPFS (InterPlanetary File System) and Ethereum smart contracts.

---

## Features

1. **Decentralized Content Storage:**
   - Blog content is stored on IPFS to ensure immutability and decentralization.

2. **Smart Contract Integration:**
   - Ethereum smart contracts manage metadata, authorship, and post organization.

3. **User Interaction:**
   - Add blog posts by uploading content and associating it with an IPFS hash.
   - Retrieve and view posts through their stored metadata.

---

## Purpose

This project is built for **learning purposes** and is not intended for production use. It helps users understand the integration of Web3 technologies such as:

- Ethereum smart contracts
- IPFS for content storage
- Web3.js for blockchain interaction

---

## Prerequisites

Before running the project, ensure you have the following installed:

- Node.js (v16 or later)
- npm or yarn
- Ganache (for local Ethereum network testing)
- Truffle or Hardhat (for smart contract compilation)

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/open-blog.git
   cd open-blog
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Compile the smart contracts:
   ```bash
   npx truffle compile
   ```

4. Start the local blockchain:
   ```bash
   npx ganache-cli
   ```

5. Deploy the smart contracts:
   ```bash
   npx truffle migrate
   ```

6. Start the server:
   ```bash
   node server.js
   ```

---

## Usage

### Upload Content

1. Use the `/upload` endpoint to upload content to IPFS.
   ```bash
   curl -X POST -H "Content-Type: application/json" \
   -d '{"content": "Your blog post content here"}' \
   http://localhost:5000/upload
   ```

2. The response will include the IPFS hash of the uploaded content.

### Add Blog Post

1. Use the smart contract to add metadata:
   ```javascript
   await contract.methods.addContent("Title", "IPFS_HASH").send({ from: "YOUR_ACCOUNT_ADDRESS" });
   ```

### Retrieve Content

1. Use the `/retrieve/:hash` endpoint to retrieve content from IPFS:
   ```bash
   curl http://localhost:5000/retrieve/IPFS_HASH
   ```

2. Alternatively, query the smart contract to get post metadata:
   ```javascript
   const post = await contract.methods.getContent(INDEX).call();
   console.log(post);
   ```

---

## Future Enhancements

- **Frontend Integration:**
  - Build a React-based UI for user interaction.

- **Enhanced Authentication:**
  - Add wallet authentication for secure interactions.

- **Additional Features:**
  - Enable editing and deletion of posts.
  - Add categories and tags for better organization.

---

## License

This project is licensed under the MIT License. Feel free to use it for educational purposes.

---

## Disclaimer

This project is for **educational purposes only**. Do not use it in production environments without additional security and optimization measures.
