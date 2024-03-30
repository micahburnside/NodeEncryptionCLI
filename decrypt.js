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

// Prepare readline interface
const readlineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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
