/**
 * ============================================================================
 * Fr. Conceicao Rodrigues College of Engineering (Fr. CRCE)
 * Cryptography Virtual Laboratory - Experiment 04: HMAC Authentication & Verification
 * ============================================================================
 * Collaborative Implementation by Group D:
 * - Wendell Dsouza (AES-256-CBC Encrypt-then-MAC Pipeline & Decryption Engine)
 * - Jadern Crasto  (RFC 2104 Standard HMAC Generator & Verifier, Web Crypto API)
 * - Rohit Ahir     (In-Transit Network Channel Attacker, Avalanche SAC & Quiz)
 * ============================================================================
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. Navigation & Master Navbar Interop
  // =========================================================================
  const sections = document.querySelectorAll('.lab-section');
  const tabButtons = document.querySelectorAll('.lab-tab-btn');

  function reportHeight() {
    try {
      const container = document.querySelector('.lab-experiment-container');
      const h = container ? Math.max(container.scrollHeight, container.offsetHeight) : document.documentElement.scrollHeight;
      window.parent.postMessage({ type: 'RESIZE_IFRAME', height: h }, '*');
    } catch (_) {}
  }

  function switchTab(targetId) {
    sections.forEach((sec) => {
      if (sec.id === targetId) {
        sec.classList.remove('tab-hidden');
      } else {
        sec.classList.add('tab-hidden');
      }
    });

    tabButtons.forEach((btn) => {
      const isTarget = btn.getAttribute('data-target') === targetId;
      btn.classList.toggle('active', isTarget);
      btn.setAttribute('aria-selected', isTarget ? 'true' : 'false');
    });

    try {
      window.parent.postMessage({ type: 'ACTIVE_TAB_CHANGED', target: targetId }, '*');
    } catch (_) {}

    setTimeout(reportHeight, 40);
  }

  // Master Navbar postMessage handler
  window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SET_TAB' && event.data.target) {
      switchTab(event.data.target);
    }
  });

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      switchTab(targetId);
    });
  });

  window.addEventListener('resize', reportHeight);
  setTimeout(reportHeight, 100);

  // =========================================================================
  // 2. Cryptographic Engine (W3C Web Crypto API - crypto.subtle)
  // =========================================================================

  function bufferToHex(buffer) {
    return Array.from(new Uint8Array(buffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  function hexToBuffer(hex) {
    const cleanHex = hex.replace(/[^0-9a-fA-F]/g, '');
    const bytes = new Uint8Array(Math.floor(cleanHex.length / 2));
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = parseInt(cleanHex.substr(i * 2, 2), 16) || 0;
    }
    return bytes.buffer;
  }

  function strToBuffer(str) {
    return new TextEncoder().encode(str);
  }

  function bufferToStr(buffer) {
    return new TextDecoder().decode(buffer);
  }

  function bufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  function base64ToBuffer(base64) {
    const binary = window.atob(base64.trim());
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  function generateIvHex() {
    const iv = new Uint8Array(16);
    window.crypto.getRandomValues(iv);
    return bufferToHex(iv.buffer);
  }

  async function deriveKeyFromPassphrase(passphrase, saltBytes) {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      enc.encode(passphrase),
      'PBKDF2',
      false,
      ['deriveKey']
    );

    return window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: saltBytes,
        iterations: 10000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-CBC', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  async function encryptAesCbc(plaintext, keyStr, ivHex) {
    const ivBuffer = hexToBuffer(ivHex);
    const saltBytes = new Uint8Array([72, 77, 65, 67, 45, 65, 69, 83, 45, 83, 65, 76, 84, 45, 50, 48]);
    const aesKey = await deriveKeyFromPassphrase(keyStr, saltBytes);
    const plainBuffer = strToBuffer(plaintext);

    const cipherBuffer = await window.crypto.subtle.encrypt(
      { name: 'AES-CBC', iv: ivBuffer },
      aesKey,
      plainBuffer
    );

    return bufferToBase64(cipherBuffer);
  }

  async function decryptAesCbc(ciphertextBase64, keyStr, ivHex) {
    const ivBuffer = hexToBuffer(ivHex);
    const saltBytes = new Uint8Array([72, 77, 65, 67, 45, 65, 69, 83, 45, 83, 65, 76, 84, 45, 50, 48]);
    const aesKey = await deriveKeyFromPassphrase(keyStr, saltBytes);
    const cipherBuffer = base64ToBuffer(ciphertextBase64);

    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: 'AES-CBC', iv: ivBuffer },
      aesKey,
      cipherBuffer
    );

    return bufferToStr(decryptedBuffer);
  }

  async function computeHmacHex(message, keyStr, algorithm = 'SHA-256') {
    const enc = new TextEncoder();
    const keyData = enc.encode(keyStr);
    const messageData = enc.encode(message);

    const cryptoKey = await window.crypto.subtle.importKey(
      'raw',
      keyData,
      {
        name: 'HMAC',
        hash: { name: algorithm }
      },
      false,
      ['sign', 'verify']
    );

    const signatureBuffer = await window.crypto.subtle.sign(
      'HMAC',
      cryptoKey,
      messageData
    );

    return bufferToHex(signatureBuffer);
  }

  function calculateHammingDistance(hexA, hexB) {
    let diffBits = 0;
    const len = Math.min(hexA.length, hexB.length);
    for (let i = 0; i < len; i += 2) {
      const byteA = parseInt(hexA.substr(i, 2), 16) || 0;
      const byteB = parseInt(hexB.substr(i, 2), 16) || 0;
      let xor = byteA ^ byteB;
      while (xor > 0) {
        diffBits += (xor & 1);
        xor >>= 1;
      }
    }
    return diffBits;
  }

  function generateHexDiffHtml(origHex, newHex) {
    let html = '';
    const maxLen = Math.max(origHex.length, newHex.length);
    for (let i = 0; i < maxLen; i++) {
      const origChar = origHex[i] || '';
      const newChar = newHex[i] || '';
      if (origChar === newChar) {
        html += `<span class="diff-match">${newChar}</span>`;
      } else {
        html += `<span class="diff-mismatch">${newChar || ' '}</span>`;
      }
    }
    return html;
  }

  // =========================================================================
  // 3. UI Elements Cache
  // =========================================================================

  // Stepper
  const flowStepElements = [
    document.getElementById('flowStep1'),
    document.getElementById('flowStep2'),
    document.getElementById('flowStep3'),
    document.getElementById('flowStep4'),
    document.getElementById('flowStep5')
  ];

  function setFlowStep(stepNum) {
    flowStepElements.forEach((el, index) => {
      if (el) {
        el.classList.toggle('active', index < stepNum);
      }
    });
  }

  // Mode Switcher
  const btnModeEncryptMac = document.getElementById('btnModeEncryptMac');
  const btnModeHmacOnly = document.getElementById('btnModeHmacOnly');
  const panelEncryptMac = document.getElementById('panelEncryptMac');
  const panelHmacOnly = document.getElementById('panelHmacOnly');

  if (btnModeEncryptMac && btnModeHmacOnly && panelEncryptMac && panelHmacOnly) {
    btnModeEncryptMac.addEventListener('click', () => {
      btnModeEncryptMac.classList.add('active');
      btnModeHmacOnly.classList.remove('active');
      panelEncryptMac.style.display = 'block';
      panelHmacOnly.style.display = 'none';
      reportHeight();
    });

    btnModeHmacOnly.addEventListener('click', () => {
      btnModeHmacOnly.classList.add('active');
      btnModeEncryptMac.classList.remove('active');
      panelHmacOnly.style.display = 'block';
      panelEncryptMac.style.display = 'none';
      reportHeight();
    });
  }

  // Pipeline - Sender
  const pipeMessage = document.getElementById('pipeMessage');
  const pipeKey = document.getElementById('pipeKey');
  const pipeCipher = document.getElementById('pipeCipher');
  const pipeHash = document.getElementById('pipeHash');
  const btnPipeEncrypt = document.getElementById('btnPipeEncrypt');
  const btnPipeTransmit = document.getElementById('btnPipeTransmit');
  const btnTogglePipeKey = document.getElementById('btnTogglePipeKey');

  // Pipeline - Outputs
  const pipeCiphertextDisplay = document.getElementById('pipeCiphertextDisplay');
  const pipeIvDisplay = document.getElementById('pipeIvDisplay');
  const pipeHmacDisplay = document.getElementById('pipeHmacDisplay');
  const pipeCtLen = document.getElementById('pipeCtLen');
  const pipeHmacLen = document.getElementById('pipeHmacLen');
  const btnCopyPipeCt = document.getElementById('btnCopyPipeCt');
  const btnCopyPipeIv = document.getElementById('btnCopyPipeIv');
  const btnCopyPipeHmac = document.getElementById('btnCopyPipeHmac');

  // Channel
  const channelStatusBadge = document.getElementById('channelStatusBadge');
  const packetIvDisplay = document.getElementById('packetIvDisplay');
  const packetCtDisplay = document.getElementById('packetCtDisplay');
  const packetHmacDisplay = document.getElementById('packetHmacDisplay');
  const btnChannelClean = document.getElementById('btnChannelClean');
  const btnChannelTamperCt = document.getElementById('btnChannelTamperCt');
  const btnChannelTamperHmac = document.getElementById('btnChannelTamperHmac');
  const btnChannelTamperKey = document.getElementById('btnChannelTamperKey');

  // Pipeline - Receiver
  const pipeRxCiphertext = document.getElementById('pipeRxCiphertext');
  const pipeRxIv = document.getElementById('pipeRxIv');
  const pipeRxKey = document.getElementById('pipeRxKey');
  const pipeRxHmac = document.getElementById('pipeRxHmac');
  const btnPipeVerifyDecrypt = document.getElementById('btnPipeVerifyDecrypt');
  const btnPipeForceDecrypt = document.getElementById('btnPipeForceDecrypt');
  const btnPipeCopySender = document.getElementById('btnPipeCopySender');
  const btnTogglePipeRxKey = document.getElementById('btnTogglePipeRxKey');

  // Receiver Output Banners
  const pipeRxStatusBadge = document.getElementById('pipeRxStatusBadge');
  const pipeRxPendingMsg = document.getElementById('pipeRxPendingMsg');
  const pipeHmacSuccessBanner = document.getElementById('pipeHmacSuccessBanner');
  const pipeHmacSuccessDetails = document.getElementById('pipeHmacSuccessDetails');
  const pipeHmacFailureBanner = document.getElementById('pipeHmacFailureBanner');
  const pipeHmacFailureDetails = document.getElementById('pipeHmacFailureDetails');
  const pipeDecryptedSuccessBox = document.getElementById('pipeDecryptedSuccessBox');
  const pipeDecryptedTextDisplay = document.getElementById('pipeDecryptedTextDisplay');
  const btnCopyDecrypted = document.getElementById('btnCopyDecrypted');
  const pipeDecryptedAbortedBox = document.getElementById('pipeDecryptedAbortedBox');
  const pipeForcedDecryptBox = document.getElementById('pipeForcedDecryptBox');
  const pipeForcedDecryptErrorMsg = document.getElementById('pipeForcedDecryptErrorMsg');

  // State cache for in-transit channel
  let lastGeneratedIv = '';
  let lastGeneratedCiphertext = '';
  let lastGeneratedHmac = '';
  let currentChannelMode = 'clean';

  // Key visibility toggles
  if (btnTogglePipeKey && pipeKey) {
    btnTogglePipeKey.addEventListener('click', () => {
      const isPass = pipeKey.type === 'password';
      pipeKey.type = isPass ? 'text' : 'password';
      btnTogglePipeKey.textContent = isPass ? 'Hide' : 'Show';
    });
  }

  if (btnTogglePipeRxKey && pipeRxKey) {
    btnTogglePipeRxKey.addEventListener('click', () => {
      const isPass = pipeRxKey.type === 'password';
      pipeRxKey.type = isPass ? 'text' : 'password';
      btnTogglePipeRxKey.textContent = isPass ? 'Hide' : 'Show';
    });
  }

  // =========================================================================
  // 4. Pipeline Execution: Encrypt & Generate HMAC (On-Demand Button Click)
  // =========================================================================

  async function handlePipeEncrypt() {
    const msg = pipeMessage ? pipeMessage.value : '';
    const key = pipeKey ? pipeKey.value : '';
    const algo = pipeHash ? pipeHash.value : 'SHA-256';

    if (!msg || !key) {
      alert('Please provide both message and shared secret key.');
      return;
    }

    try {
      const ivHex = generateIvHex();
      const ciphertextBase64 = await encryptAesCbc(msg, key, ivHex);

      // Authenticate: HMAC(IV || Ciphertext)
      const dataToAuth = ivHex + ':' + ciphertextBase64;
      const hmacHex = await computeHmacHex(dataToAuth, key, algo);

      lastGeneratedIv = ivHex;
      lastGeneratedCiphertext = ciphertextBase64;
      lastGeneratedHmac = hmacHex;

      if (pipeCiphertextDisplay) pipeCiphertextDisplay.textContent = ciphertextBase64;
      if (pipeIvDisplay) pipeIvDisplay.textContent = ivHex;
      if (pipeHmacDisplay) pipeHmacDisplay.textContent = hmacHex;
      if (pipeCtLen) pipeCtLen.textContent = base64ToBuffer(ciphertextBase64).byteLength;
      if (pipeHmacLen) pipeHmacLen.textContent = hmacHex.length;

      // Update Channel Packet Preview
      if (packetIvDisplay) packetIvDisplay.textContent = ivHex.substring(0, 16) + '...';
      if (packetCtDisplay) packetCtDisplay.textContent = ciphertextBase64.substring(0, 24) + '...';
      if (packetHmacDisplay) packetHmacDisplay.textContent = hmacHex.substring(0, 24) + '...';

      setFlowStep(2);
      reportHeight();
    } catch (err) {
      console.error('Pipeline Encrypt Error:', err);
      alert('Error during encryption: ' + err.message);
    }
  }

  if (btnPipeEncrypt) {
    btnPipeEncrypt.addEventListener('click', handlePipeEncrypt);
  }

  // Transmit to In-Transit Channel
  if (btnPipeTransmit) {
    btnPipeTransmit.addEventListener('click', async () => {
      if (!lastGeneratedCiphertext) {
        await handlePipeEncrypt();
      }

      applyChannelTamper(currentChannelMode);
      setFlowStep(3);
      reportHeight();
    });
  }

  if (btnPipeCopySender) {
    btnPipeCopySender.addEventListener('click', () => {
      if (pipeRxCiphertext) pipeRxCiphertext.value = lastGeneratedCiphertext;
      if (pipeRxIv) pipeRxIv.value = lastGeneratedIv;
      if (pipeRxKey && pipeKey) pipeRxKey.value = pipeKey.value;
      if (pipeRxHmac) pipeRxHmac.value = lastGeneratedHmac;
      reportHeight();
    });
  }

  // Channel Tamper Controls
  function setChannelTamper(mode) {
    currentChannelMode = mode;
    [btnChannelClean, btnChannelTamperCt, btnChannelTamperHmac, btnChannelTamperKey].forEach((b) => {
      if (b) b.classList.remove('chip-active');
    });

    if (mode === 'clean' && btnChannelClean) btnChannelClean.classList.add('chip-active');
    if (mode === 'tamper_ct' && btnChannelTamperCt) btnChannelTamperCt.classList.add('chip-active');
    if (mode === 'tamper_hmac' && btnChannelTamperHmac) btnChannelTamperHmac.classList.add('chip-active');
    if (mode === 'tamper_key' && btnChannelTamperKey) btnChannelTamperKey.classList.add('chip-active');

    applyChannelTamper(mode);
  }

  function applyChannelTamper(mode) {
    if (!lastGeneratedCiphertext) return;

    if (mode === 'clean') {
      if (channelStatusBadge) {
        channelStatusBadge.className = 'badge-tag badge-green';
        channelStatusBadge.textContent = 'Status: Clean (No Tampering)';
      }
      if (pipeRxCiphertext) pipeRxCiphertext.value = lastGeneratedCiphertext;
      if (pipeRxIv) pipeRxIv.value = lastGeneratedIv;
      if (pipeRxKey && pipeKey) pipeRxKey.value = pipeKey.value;
      if (pipeRxHmac) pipeRxHmac.value = lastGeneratedHmac;
      if (packetCtDisplay) packetCtDisplay.textContent = lastGeneratedCiphertext.substring(0, 24) + '...';
      if (packetHmacDisplay) packetHmacDisplay.textContent = lastGeneratedHmac.substring(0, 24) + '...';
    } else if (mode === 'tamper_ct') {
      if (channelStatusBadge) {
        channelStatusBadge.className = 'badge-tag badge-red';
        channelStatusBadge.textContent = 'Status: Tampered Ciphertext (Byte Modified)';
      }
      // Corrupt middle character of base64 ciphertext
      const tampered = lastGeneratedCiphertext.substring(0, 10) + 'X' + lastGeneratedCiphertext.substring(11);
      if (pipeRxCiphertext) pipeRxCiphertext.value = tampered;
      if (pipeRxIv) pipeRxIv.value = lastGeneratedIv;
      if (pipeRxKey && pipeKey) pipeRxKey.value = pipeKey.value;
      if (pipeRxHmac) pipeRxHmac.value = lastGeneratedHmac;
      if (packetCtDisplay) packetCtDisplay.textContent = tampered.substring(0, 24) + '... [MODIFIED]';
    } else if (mode === 'tamper_hmac') {
      if (channelStatusBadge) {
        channelStatusBadge.className = 'badge-tag badge-red';
        channelStatusBadge.textContent = 'Status: Corrupted HMAC Tag (Forgery Attempt)';
      }
      // Flip first hex character of HMAC tag
      const firstChar = lastGeneratedHmac[0] === 'a' ? 'b' : 'a';
      const tamperedHmac = firstChar + lastGeneratedHmac.substring(1);
      if (pipeRxCiphertext) pipeRxCiphertext.value = lastGeneratedCiphertext;
      if (pipeRxIv) pipeRxIv.value = lastGeneratedIv;
      if (pipeRxKey && pipeKey) pipeRxKey.value = pipeKey.value;
      if (pipeRxHmac) pipeRxHmac.value = tamperedHmac;
      if (packetHmacDisplay) packetHmacDisplay.textContent = tamperedHmac.substring(0, 24) + '... [FORGED]';
    } else if (mode === 'tamper_key') {
      if (channelStatusBadge) {
        channelStatusBadge.className = 'badge-tag badge-amber';
        channelStatusBadge.textContent = 'Status: Wrong Receiver Key';
      }
      if (pipeRxCiphertext) pipeRxCiphertext.value = lastGeneratedCiphertext;
      if (pipeRxIv) pipeRxIv.value = lastGeneratedIv;
      if (pipeRxKey) pipeRxKey.value = 'wrongsecretkey123';
      if (pipeRxHmac) pipeRxHmac.value = lastGeneratedHmac;
    }

    setFlowStep(4);
    reportHeight();
  }

  if (btnChannelClean) btnChannelClean.addEventListener('click', () => setChannelTamper('clean'));
  if (btnChannelTamperCt) btnChannelTamperCt.addEventListener('click', () => setChannelTamper('tamper_ct'));
  if (btnChannelTamperHmac) btnChannelTamperHmac.addEventListener('click', () => setChannelTamper('tamper_hmac'));
  if (btnChannelTamperKey) btnChannelTamperKey.addEventListener('click', () => setChannelTamper('tamper_key'));

  // =========================================================================
  // 5. Receiver Verification & Authenticated Plaintext Decryption
  // =========================================================================

  async function handlePipeVerifyAndDecrypt() {
    const rxCt = pipeRxCiphertext ? pipeRxCiphertext.value.trim() : '';
    const rxIv = pipeRxIv ? pipeRxIv.value.trim() : '';
    const rxKey = pipeRxKey ? pipeRxKey.value.trim() : '';
    const rxHmac = pipeRxHmac ? pipeRxHmac.value.trim().toLowerCase() : '';
    const algo = pipeHash ? pipeHash.value : 'SHA-256';

    if (!rxCt || !rxIv || !rxKey || !rxHmac) {
      alert('Please ensure ciphertext, IV, receiver key, and HMAC tag are provided.');
      return;
    }

    try {
      if (pipeRxPendingMsg) pipeRxPendingMsg.style.display = 'none';
      if (pipeForcedDecryptBox) pipeForcedDecryptBox.style.display = 'none';

      // Step 1: Recompute HMAC over (IV || Ciphertext)
      const dataToVerify = rxIv + ':' + rxCt;
      const recomputedHmac = (await computeHmacHex(dataToVerify, rxKey, algo)).toLowerCase();
      const isHmacValid = (recomputedHmac === rxHmac);

      if (isHmacValid) {
        // Step 1 Success
        if (pipeRxStatusBadge) {
          pipeRxStatusBadge.className = 'badge-tag badge-green';
          pipeRxStatusBadge.textContent = 'Verified ✓';
        }
        if (pipeHmacFailureBanner) pipeHmacFailureBanner.style.display = 'none';
        if (pipeDecryptedAbortedBox) pipeDecryptedAbortedBox.style.display = 'none';
        if (pipeHmacSuccessBanner) {
          pipeHmacSuccessBanner.style.display = 'flex';
          if (pipeHmacSuccessDetails) {
            pipeHmacSuccessDetails.innerHTML =
              `<strong>Recomputed HMAC:</strong> ${recomputedHmac}<br>` +
              `<strong>Supplied HMAC:</strong> &nbsp;&nbsp;&nbsp;&nbsp;${rxHmac}<br>` +
              `<em>Status: Perfect match. Message integrity guaranteed. Safe to decrypt.</em>`;
          }
        }

        // Step 2: Decrypt Ciphertext
        const decryptedPlaintext = await decryptAesCbc(rxCt, rxKey, rxIv);
        if (pipeDecryptedSuccessBox) {
          pipeDecryptedSuccessBox.style.display = 'block';
          if (pipeDecryptedTextDisplay) pipeDecryptedTextDisplay.textContent = decryptedPlaintext;
        }

        setFlowStep(5);
      } else {
        // Step 1 Failure
        if (pipeRxStatusBadge) {
          pipeRxStatusBadge.className = 'badge-tag badge-red';
          pipeRxStatusBadge.textContent = 'Failed ✗';
        }
        if (pipeHmacSuccessBanner) pipeHmacSuccessBanner.style.display = 'none';
        if (pipeDecryptedSuccessBox) pipeDecryptedSuccessBox.style.display = 'none';

        if (pipeHmacFailureBanner) {
          pipeHmacFailureBanner.style.display = 'flex';
          if (pipeHmacFailureDetails) {
            pipeHmacFailureDetails.innerHTML =
              `<strong>Recomputed HMAC:</strong> ${recomputedHmac}<br>` +
              `<strong>Supplied HMAC:</strong> &nbsp;&nbsp;&nbsp;&nbsp;${rxHmac}<br>` +
              `<em>Status: Mismatch detected! Payload was altered or secret key is invalid.</em>`;
          }
        }

        // Security Defense: Halt and abort decryption
        if (pipeDecryptedAbortedBox) {
          pipeDecryptedAbortedBox.style.display = 'flex';
        }
      }
      reportHeight();
    } catch (err) {
      console.error('Verify & Decrypt Error:', err);
      alert('Error during verification or decryption: ' + err.message);
    }
  }

  if (btnPipeVerifyDecrypt) {
    btnPipeVerifyDecrypt.addEventListener('click', handlePipeVerifyAndDecrypt);
  }

  // Unsafe Force-Decryption Attempt
  if (btnPipeForceDecrypt) {
    btnPipeForceDecrypt.addEventListener('click', async () => {
      const rxCt = pipeRxCiphertext ? pipeRxCiphertext.value.trim() : '';
      const rxIv = pipeRxIv ? pipeRxIv.value.trim() : '';
      const rxKey = pipeRxKey ? pipeRxKey.value.trim() : '';

      if (!rxCt || !rxIv || !rxKey) {
        alert('Please provide ciphertext, IV, and key for decryption attempt.');
        return;
      }

      try {
        if (pipeRxPendingMsg) pipeRxPendingMsg.style.display = 'none';
        if (pipeHmacSuccessBanner) pipeHmacSuccessBanner.style.display = 'none';
        if (pipeHmacFailureBanner) pipeHmacFailureBanner.style.display = 'none';
        if (pipeDecryptedAbortedBox) pipeDecryptedAbortedBox.style.display = 'none';

        const rawDecrypted = await decryptAesCbc(rxCt, rxKey, rxIv);
        if (pipeDecryptedSuccessBox) {
          pipeDecryptedSuccessBox.style.display = 'block';
          if (pipeDecryptedTextDisplay) pipeDecryptedTextDisplay.textContent = rawDecrypted;
        }
        if (pipeForcedDecryptBox) pipeForcedDecryptBox.style.display = 'none';
      } catch (err) {
        if (pipeDecryptedSuccessBox) pipeDecryptedSuccessBox.style.display = 'none';
        if (pipeForcedDecryptBox) {
          pipeForcedDecryptBox.style.display = 'flex';
          if (pipeForcedDecryptErrorMsg) {
            pipeForcedDecryptErrorMsg.textContent = `Cryptographic Exception: ${err.name} - ${err.message}. Decryption failed due to invalid PKCS#7 padding or authentication failure.`;
          }
        }
      }
      reportHeight();
    });
  }

  // Copy Buttons for Pipeline
  function setupCopyBtn(btn, textGetter) {
    if (!btn) return;
    btn.addEventListener('click', () => {
      const text = textGetter();
      if (!text || text.includes('[Click') || text === '--') return;
      navigator.clipboard.writeText(text);
      const orig = btn.textContent;
      btn.textContent = '✓ Copied';
      setTimeout(() => { btn.textContent = orig; }, 1800);
    });
  }

  setupCopyBtn(btnCopyPipeCt, () => pipeCiphertextDisplay?.textContent || '');
  setupCopyBtn(btnCopyPipeIv, () => pipeIvDisplay?.textContent || '');
  setupCopyBtn(btnCopyPipeHmac, () => pipeHmacDisplay?.textContent || '');
  setupCopyBtn(btnCopyDecrypted, () => pipeDecryptedTextDisplay?.textContent || '');

  // =========================================================================
  // 6. Standard Mode (RFC 2104) Generator, Verifier & Pad Inspector
  // =========================================================================

  const genMessage = document.getElementById('genMessage');
  const genKey = document.getElementById('genKey');
  const genAlgorithm = document.getElementById('genAlgorithm');
  const btnGenerate = document.getElementById('btnGenerate');
  const btnSendToVerify = document.getElementById('btnSendToVerify');
  const btnToggleGenKey = document.getElementById('btnToggleGenKey');
  const generatedHmacDisplay = document.getElementById('generatedHmacDisplay');
  const btnCopyGenerated = document.getElementById('btnCopyGenerated');
  const outputAlgoTag = document.getElementById('outputAlgoTag');
  const hexLenLabel = document.getElementById('hexLenLabel');
  const outCharCount = document.getElementById('outCharCount');
  const outBitLength = document.getElementById('outBitLength');

  const verMessage = document.getElementById('verMessage');
  const verKey = document.getElementById('verKey');
  const verHmac = document.getElementById('verHmac');
  const btnVerify = document.getElementById('btnVerify');
  const btnFillFromGen = document.getElementById('btnFillFromGen');
  const btnToggleVerKey = document.getElementById('btnToggleVerKey');
  const verifyStatusBadge = document.getElementById('verifyStatusBadge');
  const verifyPendingMsg = document.getElementById('verifyPendingMsg');
  const verifySuccessBanner = document.getElementById('verifySuccessBanner');
  const verifySuccessDetails = document.getElementById('verifySuccessDetails');
  const verifyFailureBanner = document.getElementById('verifyFailureBanner');
  const verifyFailureDetails = document.getElementById('verifyFailureDetails');

  // Key toggles for standard mode
  if (btnToggleGenKey && genKey) {
    btnToggleGenKey.addEventListener('click', () => {
      const isPass = genKey.type === 'password';
      genKey.type = isPass ? 'text' : 'password';
      btnToggleGenKey.textContent = isPass ? 'Hide' : 'Show';
    });
  }

  if (btnToggleVerKey && verKey) {
    btnToggleVerKey.addEventListener('click', () => {
      const isPass = verKey.type === 'password';
      verKey.type = isPass ? 'text' : 'password';
      btnToggleVerKey.textContent = isPass ? 'Hide' : 'Show';
    });
  }

  async function handleGenerateHmac() {
    const msg = genMessage ? genMessage.value : '';
    const key = genKey ? genKey.value : '';
    const algo = genAlgorithm ? genAlgorithm.value : 'SHA-256';

    if (!key) {
      alert('Secret key cannot be empty. HMAC requires a secret key for authentication.');
      return;
    }

    try {
      const hexHmac = await computeHmacHex(msg, key, algo);
      if (generatedHmacDisplay) generatedHmacDisplay.textContent = hexHmac;
      if (outCharCount) outCharCount.textContent = hexHmac.length;
      if (outBitLength) outBitLength.textContent = hexHmac.length * 4;
      if (outputAlgoTag) outputAlgoTag.textContent = `HMAC-${algo}`;
      if (hexLenLabel) hexLenLabel.textContent = `Hexadecimal Digest (${hexHmac.length} chars / ${hexHmac.length * 4} bits)`;

      // Render RFC 2104 Pad Inspector
      renderPadInspector(key, msg);

      setFlowStep(2);
      reportHeight();
    } catch (err) {
      console.error('HMAC Generation Error:', err);
      if (generatedHmacDisplay) generatedHmacDisplay.textContent = 'Error: ' + err.message;
    }
  }

  if (btnGenerate) {
    btnGenerate.addEventListener('click', handleGenerateHmac);
  }

  setupCopyBtn(btnCopyGenerated, () => generatedHmacDisplay?.textContent || '');

  if (btnSendToVerify) {
    btnSendToVerify.addEventListener('click', async () => {
      if (verMessage && genMessage) verMessage.value = genMessage.value;
      if (verKey && genKey) verKey.value = genKey.value;
      let genTag = generatedHmacDisplay ? generatedHmacDisplay.textContent.trim() : '';
      if (!genTag || genTag.includes('[Click')) {
        await handleGenerateHmac();
        genTag = generatedHmacDisplay ? generatedHmacDisplay.textContent.trim() : '';
      }
      if (verHmac) verHmac.value = genTag;
      setFlowStep(4);
      reportHeight();
    });
  }

  if (btnFillFromGen) {
    btnFillFromGen.addEventListener('click', () => {
      if (verMessage && genMessage) verMessage.value = genMessage.value;
      if (verKey && genKey) verKey.value = genKey.value;
      const genTag = generatedHmacDisplay ? generatedHmacDisplay.textContent.trim() : '';
      if (verHmac && genTag && !genTag.includes('[Click')) {
        verHmac.value = genTag;
      }
      reportHeight();
    });
  }

  async function handleVerifyHmac() {
    const message = verMessage ? verMessage.value : '';
    const key = verKey ? verKey.value : '';
    const suppliedHmac = verHmac ? verHmac.value.trim().toLowerCase() : '';
    const algo = genAlgorithm ? genAlgorithm.value : 'SHA-256';

    if (!suppliedHmac) {
      alert('Please supply an HMAC tag to verify.');
      return;
    }

    try {
      const recalculatedHmac = (await computeHmacHex(message, key, algo)).toLowerCase();
      if (verifyPendingMsg) verifyPendingMsg.style.display = 'none';

      const isMatch = (recalculatedHmac === suppliedHmac);

      if (isMatch) {
        if (verifyStatusBadge) {
          verifyStatusBadge.className = 'badge-tag badge-green';
          verifyStatusBadge.textContent = 'Verified ✓';
        }
        if (verifyFailureBanner) verifyFailureBanner.style.display = 'none';
        if (verifySuccessBanner) {
          verifySuccessBanner.style.display = 'flex';
          if (verifySuccessDetails) {
            verifySuccessDetails.innerHTML =
              `<strong>Recalculated HMAC:</strong> ${recalculatedHmac}<br>` +
              `<strong>Supplied HMAC:</strong> &nbsp;&nbsp;&nbsp;&nbsp;${suppliedHmac}<br>` +
              `<em>Status: Identical match. Message authenticity and integrity confirmed.</em>`;
          }
        }
        setFlowStep(5);
      } else {
        if (verifyStatusBadge) {
          verifyStatusBadge.className = 'badge-tag badge-red';
          verifyStatusBadge.textContent = 'Failed ✗';
        }
        if (verifySuccessBanner) verifySuccessBanner.style.display = 'none';
        if (verifyFailureBanner) {
          verifyFailureBanner.style.display = 'flex';
          if (verifyFailureDetails) {
            verifyFailureDetails.innerHTML =
              `<strong>Recalculated HMAC:</strong> ${recalculatedHmac}<br>` +
              `<strong>Supplied HMAC:</strong> &nbsp;&nbsp;&nbsp;&nbsp;${suppliedHmac}<br>` +
              `<em>Mismatch detected! The message content has been altered, or secret key is invalid.</em>`;
          }
        }
        setFlowStep(4);
      }
      reportHeight();
    } catch (err) {
      console.error('HMAC Verification Error:', err);
      alert('Error during verification: ' + err.message);
    }
  }

  if (btnVerify) {
    btnVerify.addEventListener('click', handleVerifyHmac);
  }

  // RFC 2104 Pad Inspector calculation
  function renderPadInspector(keyStr, msgStr) {
    const displayKipad = document.getElementById('displayKipad');
    const displayKopad = document.getElementById('displayKopad');
    const displayInnerHash = document.getElementById('displayInnerHash');

    const keyBytes = new Uint8Array(64);
    const encKey = new TextEncoder().encode(keyStr);
    for (let i = 0; i < Math.min(encKey.length, 64); i++) {
      keyBytes[i] = encKey[i];
    }

    const ipadBytes = new Uint8Array(64);
    const opadBytes = new Uint8Array(64);
    for (let i = 0; i < 64; i++) {
      ipadBytes[i] = keyBytes[i] ^ 0x36;
      opadBytes[i] = keyBytes[i] ^ 0x5c;
    }

    if (displayKipad) displayKipad.textContent = bufferToHex(ipadBytes.buffer);
    if (displayKopad) displayKopad.textContent = bufferToHex(opadBytes.buffer);
    if (displayInnerHash) {
      displayInnerHash.textContent = `SHA256( (K' ^ 0x36) || "${msgStr.substring(0, 20)}${msgStr.length > 20 ? '...' : ''}" ) ready`;
    }
  }

  // =========================================================================
  // 7. Modification Analysis (Avalanche Effect & Character Diff)
  // =========================================================================

  const btnTabModMsg = document.getElementById('btnTabModMsg');
  const btnTabModKey = document.getElementById('btnTabModKey');
  const sectionModMsg = document.getElementById('sectionModMsg');
  const sectionModKey = document.getElementById('sectionModKey');
  const btnModAnalyze = document.getElementById('btnModAnalyze');

  if (btnTabModMsg && btnTabModKey && sectionModMsg && sectionModKey) {
    btnTabModMsg.addEventListener('click', () => {
      btnTabModMsg.classList.add('chip-active');
      btnTabModKey.classList.remove('chip-active');
      sectionModMsg.style.display = 'block';
      sectionModKey.style.display = 'none';
      reportHeight();
    });

    btnTabModKey.addEventListener('click', () => {
      btnTabModKey.classList.add('chip-active');
      btnTabModMsg.classList.remove('chip-active');
      sectionModKey.style.display = 'block';
      sectionModMsg.style.display = 'none';
      reportHeight();
    });
  }

  // Modification Inputs
  const modOrigMsg = document.getElementById('modOrigMsg');
  const modMsgSharedKey = document.getElementById('modMsgSharedKey');
  const modTamperedMsg = document.getElementById('modTamperedMsg');
  const modOrigMsgHmac = document.getElementById('modOrigMsgHmac');
  const modTamperedMsgHmac = document.getElementById('modTamperedMsgHmac');
  const statMsgHexDiff = document.getElementById('statMsgHexDiff');
  const statMsgBitDiff = document.getElementById('statMsgBitDiff');
  const statMsgAvalanchePct = document.getElementById('statMsgAvalanchePct');
  const statMsgVerdict = document.getElementById('statMsgVerdict');
  const diffDisplayMsg = document.getElementById('diffDisplayMsg');

  const modOrigKey = document.getElementById('modOrigKey');
  const modKeySharedMsg = document.getElementById('modKeySharedMsg');
  const modTamperedKey = document.getElementById('modTamperedKey');
  const modOrigKeyHmac = document.getElementById('modOrigKeyHmac');
  const modTamperedKeyHmac = document.getElementById('modTamperedKeyHmac');
  const statKeyHexDiff = document.getElementById('statKeyHexDiff');
  const statKeyBitDiff = document.getElementById('statKeyBitDiff');
  const statKeyAvalanchePct = document.getElementById('statKeyAvalanchePct');
  const statKeyVerdict = document.getElementById('statKeyVerdict');
  const diffDisplayKey = document.getElementById('diffDisplayKey');

  // Quick chips
  const quickModMsgCase = document.getElementById('quickModMsgCase');
  const quickModMsgExcl = document.getElementById('quickModMsgExcl');
  const quickModMsgSpace = document.getElementById('quickModMsgSpace');

  if (quickModMsgCase && modTamperedMsg) quickModMsgCase.addEventListener('click', () => { modTamperedMsg.value = 'Hello world'; });
  if (quickModMsgExcl && modTamperedMsg) quickModMsgExcl.addEventListener('click', () => { modTamperedMsg.value = 'Hello World!'; });
  if (quickModMsgSpace && modTamperedMsg) quickModMsgSpace.addEventListener('click', () => { modTamperedMsg.value = 'Hello World '; });

  const quickModKeyUpper = document.getElementById('quickModKeyUpper');
  const quickModKeyAppend = document.getElementById('quickModKeyAppend');
  const quickModKeyWrong = document.getElementById('quickModKeyWrong');

  if (quickModKeyUpper && modTamperedKey) quickModKeyUpper.addEventListener('click', () => { modTamperedKey.value = 'mysecretKey'; });
  if (quickModKeyAppend && modTamperedKey) quickModKeyAppend.addEventListener('click', () => { modTamperedKey.value = 'mysecretkey123'; });
  if (quickModKeyWrong && modTamperedKey) quickModKeyWrong.addEventListener('click', () => { modTamperedKey.value = 'wrongkey'; });

  async function runModificationAnalysis() {
    // 1. Message Modification
    const oMsg = modOrigMsg ? modOrigMsg.value : 'Hello World';
    const sKey = modMsgSharedKey ? modMsgSharedKey.value : 'mysecretkey';
    const tMsg = modTamperedMsg ? modTamperedMsg.value : 'Hello world';

    const hmacOrig = await computeHmacHex(oMsg, sKey, 'SHA-256');
    const hmacTamp = await computeHmacHex(tMsg, sKey, 'SHA-256');

    if (modOrigMsgHmac) modOrigMsgHmac.textContent = hmacOrig;
    if (modTamperedMsgHmac) modTamperedMsgHmac.textContent = hmacTamp;

    const bitDiff = calculateHammingDistance(hmacOrig, hmacTamp);
    let hexDiff = 0;
    for (let i = 0; i < 64; i++) {
      if (hmacOrig[i] !== hmacTamp[i]) hexDiff++;
    }
    const pct = ((bitDiff / 256) * 100).toFixed(1);

    if (statMsgHexDiff) statMsgHexDiff.textContent = `${hexDiff} / 64`;
    if (statMsgBitDiff) statMsgBitDiff.textContent = `${bitDiff} / 256`;
    if (statMsgAvalanchePct) statMsgAvalanchePct.textContent = `${pct}%`;
    if (statMsgVerdict) {
      statMsgVerdict.className = hexDiff > 0 ? 'badge-tag badge-red' : 'badge-tag badge-green';
      statMsgVerdict.textContent = hexDiff > 0 ? '✗ HMAC Mismatch (Detected)' : '✓ Identical';
    }
    if (diffDisplayMsg) diffDisplayMsg.innerHTML = generateHexDiffHtml(hmacOrig, hmacTamp);

    // 2. Key Modification
    const oKey = modOrigKey ? modOrigKey.value : 'mysecretkey';
    const sMsg = modKeySharedMsg ? modKeySharedMsg.value : 'Hello World';
    const tKey = modTamperedKey ? modTamperedKey.value : 'mysecretKey';

    const hmacKeyOrig = await computeHmacHex(sMsg, oKey, 'SHA-256');
    const hmacKeyTamp = await computeHmacHex(sMsg, tKey, 'SHA-256');

    if (modOrigKeyHmac) modOrigKeyHmac.textContent = hmacKeyOrig;
    if (modTamperedKeyHmac) modTamperedKeyHmac.textContent = hmacKeyTamp;

    const bitDiffK = calculateHammingDistance(hmacKeyOrig, hmacKeyTamp);
    let hexDiffK = 0;
    for (let i = 0; i < 64; i++) {
      if (hmacKeyOrig[i] !== hmacKeyTamp[i]) hexDiffK++;
    }
    const pctK = ((bitDiffK / 256) * 100).toFixed(1);

    if (statKeyHexDiff) statKeyHexDiff.textContent = `${hexDiffK} / 64`;
    if (statKeyBitDiff) statKeyBitDiff.textContent = `${bitDiffK} / 256`;
    if (statKeyAvalanchePct) statKeyAvalanchePct.textContent = `${pctK}%`;
    if (statKeyVerdict) {
      statKeyVerdict.className = hexDiffK > 0 ? 'badge-tag badge-red' : 'badge-tag badge-green';
      statKeyVerdict.textContent = hexDiffK > 0 ? '✗ Key Mismatch (Detected)' : '✓ Identical';
    }
    if (diffDisplayKey) diffDisplayKey.innerHTML = generateHexDiffHtml(hmacKeyOrig, hmacKeyTamp);

    reportHeight();
  }

  if (btnModAnalyze) {
    btnModAnalyze.addEventListener('click', runModificationAnalysis);
  }

  // Educational Explainer Toggle
  const btnAttemptHmacDecrypt = document.getElementById('btnAttemptHmacDecrypt');
  const hmacDecryptResult = document.getElementById('hmacDecryptResult');

  if (btnAttemptHmacDecrypt && hmacDecryptResult) {
    btnAttemptHmacDecrypt.addEventListener('click', () => {
      const isVisible = hmacDecryptResult.style.display === 'block';
      hmacDecryptResult.style.display = isVisible ? 'none' : 'block';
      btnAttemptHmacDecrypt.textContent = isVisible ? 'Attempt HMAC "Decryption" 🔍' : 'Hide Decryption Explainer ✕';
      reportHeight();
    });
  }

  // =========================================================================
  // 8. Preset Test Cases Quick Bar
  // =========================================================================

  const loadPreset1 = document.getElementById('loadPreset1');
  const loadPreset2 = document.getElementById('loadPreset2');
  const loadPreset3 = document.getElementById('loadPreset3');
  const loadPreset4 = document.getElementById('loadPreset4');
  const loadPresetReset = document.getElementById('loadPresetReset');

  if (loadPreset1) {
    loadPreset1.addEventListener('click', () => {
      if (pipeMessage) pipeMessage.value = 'Hello World';
      if (pipeKey) pipeKey.value = 'mysecretkey';
      if (genMessage) genMessage.value = 'Hello World';
      if (genKey) genKey.value = 'mysecretkey';
      setChannelTamper('clean');
      setFlowStep(1);
      reportHeight();
    });
  }

  if (loadPreset2) {
    loadPreset2.addEventListener('click', () => {
      if (pipeMessage) pipeMessage.value = 'Transfer $1,000 to Alice';
      if (pipeKey) pipeKey.value = 'bank_master_secret';
      setChannelTamper('tamper_ct');
      setFlowStep(3);
      reportHeight();
    });
  }

  if (loadPreset3) {
    loadPreset3.addEventListener('click', () => {
      if (pipeMessage) pipeMessage.value = 'CRCE Cryptography Lab';
      if (pipeKey) pipeKey.value = 'correct_shared_key';
      setChannelTamper('tamper_key');
      setFlowStep(3);
      reportHeight();
    });
  }

  if (loadPreset4) {
    loadPreset4.addEventListener('click', () => {
      if (pipeMessage) pipeMessage.value = 'Authorized Admin Access';
      if (pipeKey) pipeKey.value = 'admin_root_token';
      setChannelTamper('tamper_hmac');
      setFlowStep(3);
      reportHeight();
    });
  }

  if (loadPresetReset) {
    loadPresetReset.addEventListener('click', () => {
      if (pipeMessage) pipeMessage.value = 'Hello World';
      if (pipeKey) pipeKey.value = 'mysecretkey';
      if (pipeRxCiphertext) pipeRxCiphertext.value = '';
      if (pipeRxIv) pipeRxIv.value = '';
      if (pipeRxKey) pipeRxKey.value = 'mysecretkey';
      if (pipeRxHmac) pipeRxHmac.value = '';

      if (pipeCiphertextDisplay) pipeCiphertextDisplay.textContent = '[Click \'⚡ Encrypt & Generate HMAC\' to produce ciphertext]';
      if (pipeIvDisplay) pipeIvDisplay.textContent = '--';
      if (pipeHmacDisplay) pipeHmacDisplay.textContent = '--';
      if (pipeCtLen) pipeCtLen.textContent = '0';
      if (packetIvDisplay) packetIvDisplay.textContent = '-';
      if (packetCtDisplay) packetCtDisplay.textContent = '-';
      if (packetHmacDisplay) packetHmacDisplay.textContent = '-';

      if (pipeRxPendingMsg) pipeRxPendingMsg.style.display = 'block';
      if (pipeHmacSuccessBanner) pipeHmacSuccessBanner.style.display = 'none';
      if (pipeHmacFailureBanner) pipeHmacFailureBanner.style.display = 'none';
      if (pipeDecryptedSuccessBox) pipeDecryptedSuccessBox.style.display = 'none';
      if (pipeDecryptedAbortedBox) pipeDecryptedAbortedBox.style.display = 'none';
      if (pipeForcedDecryptBox) pipeForcedDecryptBox.style.display = 'none';

      if (generatedHmacDisplay) generatedHmacDisplay.textContent = '[Click \'⚡ Generate HMAC\' above to produce the authentication code]';
      if (outCharCount) outCharCount.textContent = '0';
      if (outBitLength) outBitLength.textContent = '0';
      if (verifyPendingMsg) verifyPendingMsg.style.display = 'block';
      if (verifySuccessBanner) verifySuccessBanner.style.display = 'none';
      if (verifyFailureBanner) verifyFailureBanner.style.display = 'none';

      setChannelTamper('clean');
      setFlowStep(1);
      reportHeight();
    });
  }

  // =========================================================================
  // 9. Assessment Quiz Engine
  // =========================================================================

  const btnSubmitQuiz = document.getElementById('btnSubmitQuiz');
  const btnResetQuiz = document.getElementById('btnResetQuiz');
  const quizScoreBanner = document.getElementById('quizScoreBanner');
  const quizScoreText = document.getElementById('quizScoreText');

  const quizAnswers = {
    q1: 1, // RFC 2104
    q2: 1, // ipad = 0x36, opad = 0x5C
    q3: 2, // H((K' ^ opad) || H((K' ^ ipad) || M))
    q4: 1, // H(K) then zero padded
    q5: 1, // Length extension attack
    q6: 1  // No, integrity/authenticity only
  };

  if (btnSubmitQuiz) {
    btnSubmitQuiz.addEventListener('click', () => {
      let score = 0;
      const total = Object.keys(quizAnswers).length;

      Object.entries(quizAnswers).forEach(([qKey, correctIdx]) => {
        const selected = document.querySelector(`input[name="${qKey}"]:checked`);
        const feedbackEl = document.getElementById(`${qKey}-feedback`);

        if (feedbackEl) {
          if (selected && parseInt(selected.value, 10) === correctIdx) {
            score++;
            feedbackEl.className = 'quiz-feedback correct';
            feedbackEl.textContent = '✓ Correct! Excellent grasp of the HMAC standard.';
          } else {
            feedbackEl.className = 'quiz-feedback incorrect';
            feedbackEl.textContent = '✗ Incorrect. Review the algorithm formulation in Theory & Procedure.';
          }
        }
      });

      if (quizScoreBanner && quizScoreText) {
        quizScoreBanner.style.display = 'flex';
        quizScoreText.textContent = `You scored ${score} out of ${total} (${Math.round((score / total) * 100)}%)`;
      }
      reportHeight();
    });
  }

  if (btnResetQuiz) {
    btnResetQuiz.addEventListener('click', () => {
      document.querySelectorAll('input[type="radio"]').forEach((r) => { r.checked = false; });
      document.querySelectorAll('.quiz-feedback').forEach((f) => {
        f.className = 'quiz-feedback';
        f.textContent = '';
      });
      if (quizScoreBanner) quizScoreBanner.style.display = 'none';
      reportHeight();
    });
  }

})();
