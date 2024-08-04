const fs = require('fs');
const path = require('path');
const { encryptWithAES, decryptWithAES } = require('./aes');
const { loadSharedSecret } = require('./keyManagement');

// Function to encrypt data using a password or shared secret
function encryptData(dataPath, password, useSharedSecret, storagePath, outputPath) {
  if (!fs.existsSync(dataPath)) {
    throw new Error('The specified data path does not exist.');
  }

  let key;
  if (useSharedSecret) {
    const sharedSecret = loadSharedSecret(storagePath);
    key = sharedSecret.toString('hex'); // Use shared secret as key
  } else {
    key = password;
  }

  const data = fs.readFileSync(dataPath);
  console.log('Encrypting data with AES-256-GCM...');
  const encryptedData = encryptWithAES(data, key);

  const encryptedFilePath = outputPath || `${dataPath}.enc`;
  fs.writeFileSync(encryptedFilePath, encryptedData);
  console.log(`Data encrypted and saved to ${encryptedFilePath}.`);
}

// Function to decrypt data using a password or shared secret
function decryptData(encryptedDataPath, password, useSharedSecret, storagePath, outputPath) {
  if (!fs.existsSync(encryptedDataPath)) {
    throw new Error('The specified encrypted data path does not exist.');
  }

  let key;
  if (useSharedSecret) {
    const sharedSecret = loadSharedSecret(storagePath);
    key = sharedSecret.toString('hex'); // Use shared secret as key
  } else {
    key = password;
  }

  const encryptedData = fs.readFileSync(encryptedDataPath);
  console.log('Decrypting data with AES-256-GCM...');
  const decryptedData = decryptWithAES(encryptedData, key);

  let decryptedFilePath = outputPath || encryptedDataPath.replace('.enc', '');

  // If the output path is a directory, save the decrypted file in the directory with the original filename
  if (fs.existsSync(decryptedFilePath) && fs.lstatSync(decryptedFilePath).isDirectory()) {
    const originalFilename = path.basename(encryptedDataPath, '.enc');
    decryptedFilePath = path.join(decryptedFilePath, originalFilename);
  }

  // Check if the decrypted file already exists
  if (fs.existsSync(decryptedFilePath) && !fs.lstatSync(decryptedFilePath).isDirectory()) {
    return { filePath: decryptedFilePath, decryptedData };
  }

  fs.writeFileSync(decryptedFilePath, decryptedData);
  console.log(`Data decrypted and saved to ${decryptedFilePath}.`);
  return null;
}

module.exports = { encryptData, decryptData };
