import solc from 'solc';
import fs from 'fs';
import path from 'path';

// Ensure the build directory exists
const buildDir = path.resolve('build');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir);
}

const contractPath = path.resolve('contracts', 'ContentManager.sol');
const source = fs.readFileSync(contractPath, 'utf8');

const input = {
  language: 'Solidity',
  sources: {
    'ContentManager.sol': {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['abi', 'evm.bytecode'],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));

// Get ABI and Bytecode
const contract = output.contracts['ContentManager.sol']['ContentManager'];
const abi = JSON.stringify(contract.abi);
const bytecode = contract.evm.bytecode.object;

// Write ABI and Bytecode to files
fs.writeFileSync(path.resolve(buildDir, 'ContentManager.abi'), abi);
fs.writeFileSync(path.resolve(buildDir, 'ContentManager.bin'), bytecode);

console.log('Compilation successful!');
