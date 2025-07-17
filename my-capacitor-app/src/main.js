import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'
import { Capacitor } from '@capacitor/core'
import { NativePasskey } from '@joyid/capacitor-native-passkey'

document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Hello Vite!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
      <button id="register" type="button">Register Passkey</button>
      <button id="login" type="button">Login Passkey</button>
    </div>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
  </div>
`

function getRandomBuffer(len) {
  const buf = new Uint8Array(len);
  window.crypto.getRandomValues(buf);
  return buf;
}

function arrayBufferToBase64(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

function base64ToArrayBuffer(base64) {
  const binary = atob(base64);
  const buf = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    buf[i] = binary.charCodeAt(i);
  }
  return buf.buffer;
}

async function registerNativePasskey() {
  const challenge = arrayBufferToBase64(getRandomBuffer(32));
  const userId = arrayBufferToBase64(getRandomBuffer(32));
  try {
    const { credentialId } = await NativePasskey.register({
      challenge,
      userId,
      userName: 'user@example.com',
      displayName: 'User Example'
    });
    localStorage.setItem('passkeyId', credentialId);
    alert('Native passkey registered!');
  } catch (err) {
    console.error(err);
    alert('Native registration failed: ' + err);
  }
}

async function loginNativePasskey() {
  const credentialId = localStorage.getItem('passkeyId');
  if (!credentialId) {
    alert('No passkey registered');
    return;
  }
  const challenge = arrayBufferToBase64(getRandomBuffer(32));
  try {
    await NativePasskey.authenticate({ challenge, credentialId });
    alert('Native authentication succeeded!');
  } catch (err) {
    console.error(err);
    alert('Native authentication failed: ' + err);
  }
}


async function registerPasskey() {
  if (!window.PublicKeyCredential) {
    alert('WebAuthn not supported');
    return;
  }
  const challenge = getRandomBuffer(32);
  const userId = getRandomBuffer(32);
  const options = {
    publicKey: {
      rp: { name: 'My Capacitor App' },
      user: {
        id: userId,
        name: 'user@example.com',
        displayName: 'User Example'
      },
      pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
      authenticatorSelection: { authenticatorAttachment: 'platform' },
      attestation: 'none',
      timeout: 60000,
      challenge
    }
  };
  try {
    const credential = await navigator.credentials.create(options);
    const credId = arrayBufferToBase64(credential.rawId);
    localStorage.setItem('passkeyId', credId);
    alert('Passkey registered!');
  } catch (err) {
    console.error(err);
    alert('Registration failed: ' + err);
  }
}

async function loginPasskey() {
  const credIdBase64 = localStorage.getItem('passkeyId');
  if (!credIdBase64) {
    alert('No passkey registered');
    return;
  }
  const challenge = getRandomBuffer(32);
  const options = {
    publicKey: {
      challenge,
      timeout: 60000,
      allowCredentials: [
        {
          id: base64ToArrayBuffer(credIdBase64),
          type: 'public-key'
        }
      ]
    }
  };
  try {
    await navigator.credentials.get(options);
    alert('Authentication succeeded!');
  } catch (err) {
    console.error(err);
    alert('Authentication failed: ' + err);
}
}

setupCounter(document.querySelector('#counter'))
if (Capacitor.getPlatform() === 'android') {
  document.getElementById('register').addEventListener('click', registerNativePasskey)
  document.getElementById('login').addEventListener('click', loginNativePasskey)
} else {
  document.getElementById('register').addEventListener('click', registerPasskey)
  document.getElementById('login').addEventListener('click', loginPasskey)
}
