const readline = require('readline');
const fs = require('fs');
const path = require('path');
const { generateDiffieHellmanKeys, saveDiffieHellmanKeys, loadDiffieHellmanKeys } = require('../cryptography/diffieHellman');
const { generateRSAKeys, savePrivateKey, savePublicKey, loadPublicKey } = require('../cryptography/rsa');
const { encryptData, decryptData } = require('../cryptography/encryptionOperations');
const { saveSharedSecret, loadSharedSecret } = require('../cryptography/keyManagement');

// Function to get user input securely
function getInput(prompt) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true
    });

    rl.question(prompt, (answer) => {
      rl.close();
      resolve(answer.trim()); // Remove whitespace from input
    });
  });
}

// Function to normalize yes/no input
function isYes(answer) {
  const normalized = answer.trim().toLowerCase();
  return ['yes', 'y'].includes(normalized);
}

function isNo(answer) {
  const normalized = answer.trim().toLowerCase();
  return ['no', 'n'].includes(normalized);
}

// Main CLI function
async function main() {
  try {
    const operation = await getInput('Choose an operation (1: keygen, 2: encrypt, 3: decrypt, 4: keyexchange, 5: print public key): ');
    const storagePath = await getInput('Enter the path to the external storage (USB drive, SD card, etc.): ');

    if (!fs.existsSync(storagePath)) {
      console.error('Error: The specified storage path does not exist.');
      return;
    }

    switch (operation.toLowerCase()) {
      case '1':
      case 'keygen':
        await handleKeyGen(storagePath);
        break;
      case '2':
      case 'encrypt':
        await handleEncrypt(storagePath);
        break;
      case '3':
      case 'decrypt':
        await handleDecrypt(storagePath);
        break;
      case '4':
      case 'keyexchange':
        await handleKeyExchange(storagePath);
        break;
      case '5':
      case 'print public key':
        await printPublicKey(storagePath);
        break;
      default:
        console.error('Invalid operation. Please choose from 1, 2, 3, 4, or 5.');
    }
  } catch (error) {
    console.error('An error occurred:', error.message);
  }
}

// Handle key generation
async function handleKeyGen(storagePath) {
  console.log('Generating RSA keys...');
  const { publicKey, privateKey } = generateRSAKeys();
  console.log('RSA keys generated.');

  console.log('Saving keys to external storage...');
  savePrivateKey(storagePath, privateKey);
  savePublicKey(storagePath, publicKey);
  console.log('Keys saved to external storage.');

  console.log('Generating Diffie-Hellman keys...');
  const dhKeys = generateDiffieHellmanKeys();
  saveDiffieHellmanKeys(storagePath, dhKeys);
  console.log('Diffie-Hellman keys generated and saved.');
}

// Handle encryption
async function handleEncrypt(storagePath) {
  const dataPath = await getInput('Enter the filepath to the file you want to encrypt: ');
  const useSharedSecret = await getInput('Do you want to use the shared secret for AES encryption? (yes/no): ');

  let password;
  if (!isYes(useSharedSecret)) {
    password = await getInput('Enter the password for AES encryption: ');
  }

  const saveToNewLocation = await getInput('Do you want to save the encrypted file to a new location? (yes/no): ');

  let outputPath;
  if (isYes(saveToNewLocation)) {
    outputPath = await getInput('Enter the new filepath to save the encrypted data: ');
  }

  try {
    encryptData(dataPath, password, isYes(useSharedSecret), storagePath, outputPath);
  } catch (error) {
    console.error(`Encryption failed: ${error.message}`);
  }
}

// Handle decryption
async function handleDecrypt(storagePath) {
  const encryptedDataPath = await getInput('Enter the filepath to the encrypted file: ');
  const useSharedSecret = await getInput('Do you want to use the shared secret for AES decryption? (yes/no): ');

  let password;
  if (!isYes(useSharedSecret)) {
    password = await getInput('Enter the password for AES decryption: ');
  }

  const saveToNewLocation = await getInput('Do you want to save the decrypted file to a new location? (yes/no): ');

  let outputPath;
  if (isYes(saveToNewLocation)) {
    outputPath = await getInput('Enter the new filepath to save the decrypted data: ');
  }

  try {
    const result = decryptData(encryptedDataPath, password, isYes(useSharedSecret), storagePath, outputPath);
    if (result) {
      const overwrite = await getInput(`File ${result.filePath} already exists. Do you want to overwrite it? (yes/no): `);
      if (isYes(overwrite)) {
        fs.writeFileSync(result.filePath, result.decryptedData);
        console.log(`Data decrypted and saved to ${result.filePath}.`);
      } else {
        console.log('Decryption canceled by the user.');
      }
    }
  } catch (error) {
    console.error(`Decryption failed: ${error.message}`);
  }
}

// Handle key exchange
async function handleKeyExchange(storagePath) {
  console.log('Loading existing Diffie-Hellman keys...');
  let dhKeys;
  try {
    dhKeys = loadDiffieHellmanKeys(storagePath);
    console.log('Loaded existing Diffie-Hellman keys.');
    console.log('Your public key (share this with the other party):');
    console.log(dhKeys.getPublicKey('hex'));
  } catch (error) {
    console.error('Error loading keys. Ensure the keys exist in the specified path.');
    return;
  }

  const otherPartyPath = await getInput("Enter the other party's keystore directory path: ");
  if (!fs.existsSync(otherPartyPath) || !fs.lstatSync(otherPartyPath).isDirectory()) {
    console.error('Error: The specified directory path is invalid.');
    return;
  }

  const otherPublicKeyPath = path.join(otherPartyPath, 'dhPublicKey.pem');
  if (!fs.existsSync(otherPublicKeyPath)) {
    console.error('Error: The other party\'s public key file does not exist.');
    return;
  }

  const otherPublicKeyHex = fs.readFileSync(otherPublicKeyPath, 'utf8');

  console.log('Computing shared secret...');
  try {
    const sharedSecret = dhKeys.computeSecret(Buffer.from(otherPublicKeyHex, 'hex'));
    saveSharedSecret(storagePath, sharedSecret);
    console.log('Shared secret computed and saved.');
  } catch (error) {
    console.error('An error occurred during the key exchange:', error.message);
  }
}

// Print public key
async function printPublicKey(storagePath) {
  console.log('Loading public key...');
  const publicKey = loadPublicKey(storagePath);
  const publicKeyHex = publicKey.export({ type: 'spki', format: 'der' }).toString('hex');
  console.log('Public Key (hex):');
  console.log(publicKeyHex);
}

main();
