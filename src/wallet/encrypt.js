// encryptionUtils.js

// Fixed IV and Salt
const FIXED_IV = new Uint8Array(12); // Replace with your desired fixed IV
const FIXED_SALT = new Uint8Array([
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
]); // Replace with your desired fixed salt

// Function to encrypt data
export async function encryptPrivateKey(data, password) {
  const encoder = new TextEncoder();

  // Derive a key from the password using PBKDF2 with the fixed salt
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: FIXED_SALT,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt"]
  );

  const encrypted = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: FIXED_IV,
    },
    key,
    encoder.encode(data)
  );

  // Return encrypted data as a Uint8Array

  return arrayBufferToBase64(new Uint8Array(encrypted));
}

// Function to decrypt data
export async function decryptPrivateKey(encryptedData, password) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  // Derive the key from the password using PBKDF2 with the fixed salt
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: FIXED_SALT,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["decrypt"]
  );

  const decrypted = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: FIXED_IV,
    },
    key,
    base64ToArrayBuffer(encryptedData)
  );

  return decoder.decode(decrypted);
}

// Function to convert Uint8Array to Base64 string
export function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;

  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  // Check if running in a browser environment
  if (typeof window !== 'undefined') {
    // Running in the browser
    return window.btoa(binary);
  } else {
    // Running in Node.js (or Next.js API route)
    return Buffer.from(binary, 'binary').toString('base64');
  }
}

// Function to convert Base64 string back to Uint8Array
export function base64ToArrayBuffer(base64) {
  let binaryString;

  // Use Buffer in Node.js (server-side) and atob in the browser (client-side)
  if (typeof window !== 'undefined') {
    // Running in the browser
    binaryString = window.atob(base64);
  } else {
    // Running in Next.js API route or Node.js
    binaryString = Buffer.from(base64, 'base64').toString('binary');
  }

  const len = binaryString.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes.buffer;
}
