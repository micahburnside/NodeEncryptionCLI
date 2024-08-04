const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Generate Diffie-Hellman keys
function generateDiffieHellmanKeys() {
  const dh = crypto.createDiffieHellman(2048);
  dh.generateKeys();
  return {
    publicKey: dh.getPublicKey('hex'),
    privateKey: dh.getPrivateKey('hex'),
  };
}

// Save Diffie-Hellman keys to file
function saveDiffieHellmanKeys(storagePath, dhKeys) {
  const publicKeyPath = path.join(storagePath, 'dhPublicKey.pem');
  const privateKeyPath = path.join(storagePath, 'dhPrivateKey.pem');
  fs.writeFileSync(publicKeyPath, dhKeys.publicKey);
  fs.writeFileSync(privateKeyPath, dhKeys.privateKey);
}

// Load Diffie-Hellman keys from file
function loadDiffieHellmanKeys(storagePath) {
  const publicKeyPath = path.join(storagePath, 'dhPublicKey.pem');
  const privateKeyPath = path.join(storagePath, 'dhPrivateKey.pem');
  const publicKey = fs.readFileSync(publicKeyPath, 'utf8');
  const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
  const dh = crypto.createDiffieHellman(2048);
  dh.setPrivateKey(Buffer.from(privateKey, 'hex'));
  dh.setPublicKey(Buffer.from(publicKey, 'hex'));
  return dh;
}

module.exports = {
  generateDiffieHellmanKeys,
  saveDiffieHellmanKeys,
  loadDiffieHellmanKeys,
};
