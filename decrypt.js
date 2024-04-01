const fs = require('fs');
const readline = require('readline');
const crypto = require('crypto');
const algorithm = 'aes-256-ctr';


/**
 *  * ----------------------
 *  * function decryptFile
 *  * ----------------------
 * This function decrypts an aes-256-ctr encrypted file using the specified password and saves decrypted content to a new file.
 *
 * @param {string} file - The path to the encrypted file.
 * @param {string} decryptedFile - The path where the decrypted file will be saved.
 * @param {string} password - The decryption password.
*/

function decryptFile(file, decryptedFile, password) {
// read file, assign it the name encryptedData
  const encryptedData = fs.readFileSync(file);
// Extract the Initialization Vector (IV) from the encrypted data. Initialization vector is a "nonce". It is a random piece of data to add randomness to the encryption.
  const IV = encryptedData.slice(0, 16);
  // Extract the encrypted data starting from index 16, right after the Initialization Vector (IV).
  const data = encryptedData.slice(16);
  //Generates a hashing for the password and using this hashed password, along with the provided algorithm and IV, to create a decryption decipher.
  let decipher = crypto.createDecipheriv(algorithm, crypto.createHash('sha256').update(password).digest(), IV);
  // Decrypt the 'data' using the 'update' method and finalize the decryption process using the 'final' method. The results are concatenated into a single Buffer to produce the completed decrypted data.
  let decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
  //write the decrypted data to the new file
  fs.writeFileSync(decryptedFile, decrypted);
}
//READLINE CLI Interface
// Create a readline interface to receive input from the console and output back to the console, using the standard input and output streams.
const readlineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// hides text input by replacing it with * when entering file password
readlineInterface._writeToOutput = function _writeToOutput(stringToWrite) {
  if (readlineInterface.stdoutMuted)
    readlineInterface.output.write("*");
  else
    readlineInterface.output.write(stringToWrite);
};
readlineInterface.question('Please provide the filepath to the file you want to decrypt: ', filePath => {
  let sourceFile, destinationFile;
  // Set the source file and destination filepath
  sourceFile = filePath;
  // We need to replace "Encrypted" with "Decrypted" in the file name
  const base = sourceFile.replace('Encrypted', '');
  // Adds "Decrypted" to the end of the filename
  destinationFile = `${base.substring(0, base.lastIndexOf('.'))}Decrypted${base.substring(base.lastIndexOf('.'), base.length)}`;

  // Note: that immediately after this question, readlineInterface.stdoutMuted becomes true and raw mode set to true

  readlineInterface.question('Please enter the Password: ', password => {
    // Unmute output and disable raw mode
    readlineInterface.stdoutMuted = false;
    process.stdin.setRawMode(false);

    // Prepare for next line
    console.log('');

    // Call the decryptFile function
    decryptFile(sourceFile, destinationFile, password);

    // Close the readline interface
    readlineInterface.close();
  });

  // Enable raw mode and mute output
  readlineInterface.stdoutMuted = true;
  process.stdin.setRawMode(true);
});


//TODO(AES-256 Decryption)

// Here's the step-by-step pseudocode for AES-256 decryption:
// Import necessary crypto module (In Node.js, const crypto = require('crypto'))
// Load the encrypted data, the AES key, and the initialization vector (IV) from the storage.
//   encrypted_data = load encrypted data from storage AES_KEY = load AES key from storage IV = load IV from storage
// Create an AES-256 decipher using the AES key and IV.
//   AES_DECIPHER = create AES-256 decipher with AES_KEY and IV
// Decrypt the data by feeding the encrypted data into the AES-256 decipher. Similar to the encryption process, this will often need to be done in two parts: an 'update' phase that decrypts most of the data, and a 'final' phase that decrypts any remaining data and returns the plaintext.
//   decrypted_data = AES_DECIPHER.decrypt(encrypted_data)
// The decrypted_data is now the original plaintext data.

//TODO(RSA Decryption)

// Here's the step-by-step pseudocode for RSA decryption:
// Import necessary 'crypto' module (In Node.js, const crypto = require('crypto')).
// Load the RSA private key and the encrypted AES key from the storage.
//   encrypted_AES_KEY = load the encrypted AES key from storage RSA_private_Key = load the RSA private key from storage
// Decrypt the AES key with RSA private key.
//   AES_KEY = RSA_private_Key.decrypt(encrypted_AES_KEY)
// The AES_KEY is now the original AES key used for AES Cipher. Feed this key into the AES decryption process (as stated in Part 1) to decrypt your original data.
//   This process essentially goes back through the encryption process in reverse, using the private key to decrypt the AES key, and then using that to decrypt the original data. Please keep in mind real implementation code in Javascript or other programming languages may vary and this pseudocode gives you a descriptive walkthrough of how decryption will work.
//
