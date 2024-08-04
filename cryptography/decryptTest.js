const fs = require('fs');
const readline = require('readline');
const crypto = require('crypto');
const path = require('path');
const algorithm = 'aes-256-gcm';
const saltLength = 16;
const ivLength = 12;

// Function to derive a key from a password
function deriveKey(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256'); // 256-bit key
}

// Function to securely decrypt a file using AES-256-GCM
function decryptFile(encryptedFile, decryptedFile, password) {
  // Read the encrypted data
  const encryptedData = fs.readFileSync(encryptedFile);

  // Extract IV, encrypted data, and authentication tag
  const dataIv = encryptedData.slice(0, ivLength); // First bytes for IV
  const dataAuthTag = encryptedData.slice(encryptedData.length - 16); // Last 16 bytes for auth tag
  const encryptedText = encryptedData.slice(ivLength, encryptedData.length - 16); // The rest is encrypted data

  // Read the encrypted key
  const encryptedKeyBuffer = fs.readFileSync(`${encryptedFile}.key`);

  // Extract salt, IV, encrypted key, and authentication tag from the key file
  const salt = encryptedKeyBuffer.slice(0, saltLength); // First bytes for salt
  const keyIv = encryptedKeyBuffer.slice(saltLength, saltLength + ivLength); // Next bytes for IV
  const keyAuthTag = encryptedKeyBuffer.slice(encryptedKeyBuffer.length - 16); // Last 16 bytes for auth tag
  const encryptedKey = encryptedKeyBuffer.slice(saltLength + ivLength, encryptedKeyBuffer.length - 16); // The rest is encrypted key

  // Derive the key for key decryption
  const key = deriveKey(password, salt);

  // Decrypt the data key
  const keyDecipher = crypto.createDecipheriv(algorithm, key, keyIv);
  keyDecipher.setAuthTag(keyAuthTag);

  let dataKey = keyDecipher.update(encryptedKey);
  dataKey = Buffer.concat([dataKey, keyDecipher.final()]);

  // Decrypt the data
  const dataDecipher = crypto.createDecipheriv(algorithm, dataKey, dataIv);
  dataDecipher.setAuthTag(dataAuthTag);

  let decrypted = dataDecipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, dataDecipher.final()]);
  fs.writeFileSync(decryptedFile, decrypted);
}

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
      resolve(answer);
    });
  });
}

async function main() {
  const encryptedFile = await getInput('Please provide the filepath to the encrypted file: ');
  const password = await getInput('Enter decryption password: ');

  const decryptedFile = `${encryptedFile.substring(0, encryptedFile.lastIndexOf('.'))}Decrypted${encryptedFile.substring(encryptedFile.lastIndexOf('.'), encryptedFile.length)}`;

  decryptFile(encryptedFile, decryptedFile, password);
  console.log('File decrypted successfully.');
}

main();
