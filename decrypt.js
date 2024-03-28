const fs = require('fs');
const readline = require('readline');
const crypto = require('crypto');
const algorithm = 'aes-256-ctr';

function decryptFile(file, decryptedFile, password) {
  const encryptedData = fs.readFileSync(file);
  const IV = encryptedData.slice(0, 16);
  const data = encryptedData.slice(16);
  let decipher = crypto.createDecipheriv(algorithm, crypto.createHash('sha256').update(password).digest(), IV);
  let decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
  fs.writeFileSync(decryptedFile, decrypted);
}

let sourceFile, destinationFile;

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
  // Set the source file and destination filepath
  sourceFile = filePath;
  // We need to replace "Encrypted" with "Decrypted" in the file name
  const base = sourceFile.replace('Encrypted', '');
  destinationFile = `${base.substring(0, base.lastIndexOf('.'))}Decrypted${base.substring(base.lastIndexOf('.'), base.length)}`;

  // Note: that immediately after this question, readlineInterface.stdoutMuted becomes true and raw mode set to true

  readlineInterface.question('Enter Decryption Password: ', password => {
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
