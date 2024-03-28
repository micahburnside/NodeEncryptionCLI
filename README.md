# How to Use NodeEncryptionCLI


This how-to guide is tailored for individuals looking to secure their digital files using AES-256 encryption, utilizing a straightforward NodeJS Command Line Interface (CLI) tool. By following the outlined steps, users will learn how to encrypt and decrypt files, ensuring that their sensitive data remains protected and accessible only to those with the appropriate password. This documentation is particularly beneficial for developers, IT professionals, and anyone with a basic understanding of the command line and NodeJS, who are concerned with data privacy and security.


## Prerequisites

This project requires NodeJS.

Make sure that:
- Have a working knowledge of CLI tools and how to use them.
- You are ready to securely store any passwords for files you encrypt. 
- You have NodeJS installed on your system. 
- You have a file to encrypt.

## How to install NodeJS

First check if NodeJS is installed on your system

1.  Check for NodeJS Installation. If NodeJS is already installed, skip ahead to Usage

```bash
    node --verison
 ```

2. If NodeJS is not installed, please follow this link to the node website to download and install NodeJS
   - [link](https://nodejs.org/en/download/)
   
3. Navigate to the the NodeEncryptionCLI-main folder in Command Line:
```bash
cd /Path-To-NodeEncryptionCLI-main
```
## Encryption
### Encrypt a file


1. Enter the command:

```bash
 node encrypt.js
```
2. Enter the appropriate filepath for the file you want to encrypt
```bash
 /Path-To-Your-File.mov
```
3. CLI will prompt you for a password. Provide a password. 
   - There are no password length or character type requirements at this time.
```bash
 enter-password
```
4. Check original file location for encrypted version of file

## Decryption

### Decrypt a file

1. Decrypt

```bash
 node decrypt.js
```
2. Enter the appropriate filepath for the file you want to decrypt
```bash
 /Path-To-Your-Encrypted-File.mov
```
3. CLI will prompt you for the file's password. Provide the appropriate password.
   - There are no password length or character type requirements at this time.
```bash
 enter-password
```
4. Check encrypted file location for decrypted version of file
