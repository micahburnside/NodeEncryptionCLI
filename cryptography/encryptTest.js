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

// Function to securely encrypt a file using AES-256-GCM
function encryptFile(file, encryptedFile, password) {
  const dataKey = crypto.randomBytes(32); // Generate a random 256-bit key for data encryption
  const dataIv = crypto.randomBytes(ivLength); // Generate a random IV for data encryption
  const data = fs.readFileSync(file);
  const dataCipher = crypto.createCipheriv(algorithm, dataKey, dataIv);

  let encryptedData = Buffer.concat([dataCipher.update(data), dataCipher.final()]);
  const dataAuthTag = dataCipher.getAuthTag();

  // Concatenate IV, encrypted data, and authentication tag
  const encryptedDataBuffer = Buffer.concat([dataIv, encryptedData, dataAuthTag]);
  fs.writeFileSync(encryptedFile, encryptedDataBuffer);

  // Encrypt the data encryption key with a password
  const salt = crypto.randomBytes(saltLength); // Generate a random salt
  const key = deriveKey(password, salt); // Derive key from password and salt
  const keyIv = crypto.randomBytes(ivLength); // Generate a random IV for key encryption
  const keyCipher = crypto.createCipheriv(algorithm, key, keyIv);

  let encryptedKey = Buffer.concat([keyCipher.update(dataKey), keyCipher.final()]);
  const keyAuthTag = keyCipher.getAuthTag();

  // Concatenate salt, IV, encrypted key, and authentication tag
  const encryptedKeyBuffer = Buffer.concat([salt, keyIv, encryptedKey, keyAuthTag]);
  fs.writeFileSync(`${encryptedFile}.key`, encryptedKeyBuffer); // Save the encrypted key buffer in a separate file
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
  const file = await getInput('Please provide the filepath to the file you want to encrypt: ');
  const password = await getInput('Enter encryption password: ');

  // Generate path for encrypted file
  const encryptedFile = `${file.substring(0, file.lastIndexOf('.'))}Encrypted${file.substring(file.lastIndexOf('.'), file.length)}`;

  // Encrypt the file
  encryptFile(file, encryptedFile, password);
  console.log('File encrypted successfully.');
}

main();
