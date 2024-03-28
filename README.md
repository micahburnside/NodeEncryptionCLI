# How to Use NodeEncryptionCLI


This how-to guide is tailored for anyone who needs to secure their digital files using AES-256 encryption, utilizing a straightforward NodeJS Command Line Interface (CLI) tool. By following the outlined steps, users will learn how to encrypt and decrypt files using this tool, ensuring that their sensitive data remains protected and accessible only to those with the appropriate password. This documentation is particularly beneficial for developers, IT professionals, and anyone with a basic understanding of the command line and NodeJS, who are concerned with data privacy and security.


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

# Usage:

## Encryption
### Encrypt a file


1. Navigate to this project's folder and enter the following command to add an encryption layer to a file of your choosing:

```bash
 node encrypt.js
```
2. Enter the appropriate filepath for the file you want to decrypt. Accepts any filetype: .jpg, .png, .mpeg, .mov, .mp3, .pdf, .zip, etc.
    - You can drag and drop the file directly into the teriminal window text field to automatically get the file path. 
    - *Make sure you remove any white-space from the end of the url because the encryption operation will fail. That issue will be patched soon.
```bash
 /Path-To-Your-Encrypted-File.filetype
```
3. User will be prompted to enter password. Provide a password.
    - There are no password length or character type requirements at this time. It is recommended to be at 32 - 64 characters in length, use at least one capital letter A-Z, a number 0-9, and a special symbol (!@#$%^&*()_-=+{}[]\|;:'",<../?~).
```bash
 enter-password
```
4. Encryption operation will commence. Upon completion the encrypted file will be added to the same directory as original file.

## Decryption

### Decrypt a file

1. Navigate to this project's folder and enter the following command to decrypt an encrypted file:

```bash
 node decrypt.js
```
2. Enter the appropriate filepath for the file you want to decrypt. Accepts any filetype: .jpg, .png, .mpeg, .mov, .mp3, .pdf, .zip, etc.
```bash
 /Path-To-Your-Encrypted-File.filetype
```

3. User will be prompted to enter the password for the encrypted file. Provide the appropriate password.
    - There are no password length or character type requirements at this time.
```bash
 enter-password
```
4. Decryption operation will commence. Upon completion the decrypted file will be added to the same directory as original file. 
