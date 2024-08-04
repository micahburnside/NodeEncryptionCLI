const fs = require('fs');
const path = require('path');

// Function to save shared secret to file
function saveSharedSecret(storagePath, sharedSecret) {
  fs.writeFileSync(path.join(storagePath, 'sharedSecret.pem'), sharedSecret.toString('base64'));
}

// Function to load shared secret from file
function loadSharedSecret(storagePath) {
  const sharedSecret = fs.readFileSync(path.join(storagePath, 'sharedSecret.pem'), 'utf-8');
  return Buffer.from(sharedSecret, 'base64');
}

module.exports = { saveSharedSecret, loadSharedSecret };
