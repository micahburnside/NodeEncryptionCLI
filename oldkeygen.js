/**
 * Singleton Class dedicated to generating key pairs
 */

const fs = require('fs');
const readLine = require('readline');
const crypto = require('crypto');

const readlineInterface = readLine.createInterface({
  input: process.stdin,
  output: process.stdout
});

function generateRsaKey(modulusLength = 4096, hash = 'SHA-512') {
  crypto.generateKeyPair('rsa', {
    modulusLength,
    publicExponent: 0x10001,
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
  }, (err, publicKey, privateKey) => {
    // If there is an error in key generation, log the error and exit
    if (err) {
      console.error('Error during key generation:', err);
      return;
    }

    fs.writeFile('publicKey.pem', publicKey, (err) => {
      if (err) throw err;
      console.log('Public key has been written to publicKey.pem');
    });

    fs.writeFile('privateKey.pem', privateKey, (err) => {
      if (err) throw err;
      console.log('Private key has been written to privateKey.pem');
    });
  });
}

generateRsaKey();

