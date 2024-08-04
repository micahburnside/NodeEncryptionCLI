// const crypto = require('crypto');
// const fs = require('fs');
// const path = require('path');
//
// // Generate RSA key pair
// function generateRSAKeys() {
//   const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
//     modulusLength: 2048,
//   });
//   return { publicKey, privateKey };
// }
//
// // Save RSA keys to storage in PEM format
// function savePrivateKey(storagePath, privateKey) {
//   fs.writeFileSync(path.join(storagePath, 'privateKey.pem'), privateKey.export({ type: 'pkcs1', format: 'pem' }));
// }
//
// function savePublicKey(storagePath, publicKey) {
//   fs.writeFileSync(path.join(storagePath, 'publicKey.pem'), publicKey.export({ type: 'spki', format: 'pem' }));
// }
//
// // Load RSA keys from storage in PEM format
// function loadPrivateKey(storagePath) {
//   return crypto.createPrivateKey(fs.readFileSync(path.join(storagePath, 'privateKey.pem'), 'utf-8'));
// }
//
// function loadPublicKey(storagePath) {
//   return crypto.createPublicKey(fs.readFileSync(path.join(storagePath, 'publicKey.pem'), 'utf-8'));
// }
//
// module.exports = { generateRSAKeys, savePrivateKey, savePublicKey, loadPrivateKey, loadPublicKey };
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Generate RSA keys
function generateRSAKeys() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
  });
  return { publicKey, privateKey };
}

// Save private key to file
function savePrivateKey(storagePath, privateKey) {
  const privateKeyPath = path.join(storagePath, 'privateKey.pem');
  fs.writeFileSync(privateKeyPath, privateKey.export({ type: 'pkcs1', format: 'pem' }));
}

// Save public key to file
function savePublicKey(storagePath, publicKey) {
  const publicKeyPath = path.join(storagePath, 'publicKey.pem');
  fs.writeFileSync(publicKeyPath, publicKey.export({ type: 'spki', format: 'pem' }));
}

// Load public key from file
function loadPublicKey(storagePath) {
  const publicKeyPath = path.join(storagePath, 'publicKey.pem');
  const publicKeyPem = fs.readFileSync(publicKeyPath, 'utf8');
  return crypto.createPublicKey(publicKeyPem);
}

module.exports = {
  generateRSAKeys,
  savePrivateKey,
  savePublicKey,
  loadPublicKey,
};
