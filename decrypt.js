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
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl._writeToOutput = function _writeToOutput(stringToWrite) {
  if (rl.stdoutMuted)
    rl.output.write("*");
  else
    rl.output.write(stringToWrite);
};

rl.question('Please provide the filepath to the file you want to decrypt: ', filePath => {
  // Set the source file and destination filepath
  sourceFile = filePath;
  // We need to replace "Encrypted" with "Decrypted" in the file name
  const base = sourceFile.replace('Encrypted', '');
  destinationFile = `${base.substring(0, base.lastIndexOf('.'))}Decrypted${base.substring(base.lastIndexOf('.'), base.length)}`;

  // Note: that immediately after this question, rl.stdoutMuted becomes true and raw mode set to true

  rl.question('Enter Decryption Password: ', password => {
    // Unmute output and disable raw mode
    rl.stdoutMuted = false;
    process.stdin.setRawMode(false);

    // Prepare for next line
    console.log('');

    // Call the decryptFile function
    decryptFile(sourceFile, destinationFile, password);

    // Close the readline interface
    rl.close();
  });

  // Enable raw mode and mute output
  rl.stdoutMuted = true;
  process.stdin.setRawMode(true);
});
