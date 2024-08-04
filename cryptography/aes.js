const crypto = require('crypto');

// Function to derive a key from a password using PBKDF2
// Applies a pseudorandom function to a password along with a salt and iterates this process multiple times to generate a cryptographic key
function deriveKey(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256'); // 256-bit key
}

// Function to encrypt data using AES-256-GCM
function encryptWithAES256GCM(data, password) {
  const salt = crypto.randomBytes(16); // Generate a random salt
  const key = deriveKey(password, salt); // Derive key from password and salt
  const iv = crypto.randomBytes(12); // Generate a random IV
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  let encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
  const authTag = cipher.getAuthTag();

  // Concatenate salt, IV, encrypted data, and authentication tag
  return Buffer.concat([salt, iv, encrypted, authTag]);
}

// Function to decrypt data using AES-256-GCM
function decryptWithAES256GCM(encryptedData, password) {
  const salt = encryptedData.slice(0, 16); // First 16 bytes for salt
  const iv = encryptedData.slice(16, 28); // Next 12 bytes for IV
  const authTag = encryptedData.slice(encryptedData.length - 16); // Last 16 bytes for auth tag
  const encryptedText = encryptedData.slice(28, encryptedData.length - 16); // The rest is encrypted data
  const key = deriveKey(password, salt); // Derive key from password and salt

  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted;
}

module.exports = { encryptWithAES256GCM, decryptWithAES256GCM };
