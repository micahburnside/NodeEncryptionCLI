const fs = require('fs');
const readline = require('readline');
const crypto = require('crypto');
const algorithm = 'aes-256-ctr';

function encryptFile(file, encryptedFile, password) {
  const IV = crypto.randomBytes(16);
  const data = fs.readFileSync(file);
  let cipher = crypto.createCipheriv(algorithm, crypto.createHash('sha256').update(password).digest(), IV);
  let encrypted = Buffer.concat([IV, cipher.update(data), cipher.final()]);
  fs.writeFileSync(encryptedFile, encrypted);
}

let sourceFile, destinationFile;

// Prepare readline interface
const readLineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

readLineInterface._writeToOutput = function _writeToOutput(stringToWrite) {
  if (readLineInterface.stdoutMuted)
    readLineInterface.output.write("*");
  else
    readLineInterface.output.write(stringToWrite);
};

readLineInterface.question('Please provide the filepath to the file you want to encrypt: ', filePath => {
  // Set the source file and destination filepath
  sourceFile = filePath;
  destinationFile = `${sourceFile.substring(0, sourceFile.lastIndexOf('.'))}Encrypted${sourceFile.substring(sourceFile.lastIndexOf('.'), sourceFile.length)}`;

  // Note: that immediately after this question, readLineInterface.stdoutMuted becomes true and raw mode set to true

  readLineInterface.question('Enter Encryption Password: ', password => {
    // Unmute output and disable raw mode
    readLineInterface.stdoutMuted = false;
    process.stdin.setRawMode(false);

    // Prepare for next line
    console.log('');

    // Call the encryptFile function
    encryptFile(sourceFile, destinationFile, password);

    // Close the readline interface
    readLineInterface.close();
  });

  // Enable raw mode and mute output
  readLineInterface.stdoutMuted = true;
  process.stdin.setRawMode(true);
});


//TODO(AES-256 Encryption)
//
// Here is the step by step pseudocode for AES-256 encryption:
//   Import the necessary crypto module (In Node.js, that would be const crypto = require('crypto'))
// Generate a random 32-byte key for AES-256 using the randomBytes function.
// AES_KEY = generate a 32-byte random key
// Create a 16-byte Initialization Vector (IV) for your cipher.
//   IV = generate a 16-byte random initialization vector
// Create an AES-256 Cipher using the previously generated key and IV.
//   AES_CIPHER = create AES-256 cipher with AES_KEY and IV
// Encrypt the data by feeding it into your AES-256 cipher. This will often need to be done in two parts: an 'update' phase that encrypts most of the data, and a 'final' phase that encrypts any remaining data and returns the result.
//   encrypted_data = AES_CIPHER.encrypt(data)
// Save the encrypted data and the key to your preferred storage. NOTE: The IV will also need to be securely stored as it's required for decryption.
// save the encrypted data save the AES_KEY save the IV

//TODO(RSA Encryption)

// Here is the step by step pseudocode for RSA Encryption:
//   Import the necessary 'crypto' module (In Node.js, const crypto = require('crypto'))
// Generate an RSA public-private key pair.
//   RSA_KEYS = generate an RSA public-private key pair
// In the context of a hybrid encryption scheme, take the AES_KEY produced in the previous steps and encrypt it with the RSA public key.
//   encrypted_AES_KEY = RSA_KEYS.publicKey.encrypt(AES_KEY)
// Save the encrypted AES key and RSA private key to your preferred storage.
//   save the encrypted AES Key save the RSA private Key
// In this way, the heavy-duty encryption of the data is performed using a symmetric cipher (the AES-256 part), but the key used for that encryption is itself encrypted using an asymmetric cipher (the RSA part), combining the benefits of both encryption methods.
//
