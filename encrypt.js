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
