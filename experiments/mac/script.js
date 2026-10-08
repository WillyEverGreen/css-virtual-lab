/**
 * ============================================================================
 * Fr. Conceicao Rodrigues College of Engineering (Fr. CRCE)
 * Cryptography Virtual Laboratory - Experiment 03: Message Authentication Code (MAC)
 * ============================================================================
 * Collaborative Implementation by Group C:
 * - Aarna Chopdekar
 * - Slora Bar
 * - Arya Chavan
 * - Cajetan Dsouza
 * - Shreyas Divekar
 * ============================================================================
 */

'use strict';

/* ============================================================================
   CRYPTOGRAPHIC HMAC-SHA256 ENGINE (Pure Offline Web Crypto API)
   ============================================================================ */

function stringToBytes(str) {
  return new TextEncoder().encode(str);
}

function bytesToHex(bytes) {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function computeHmacSha256(keyStr, messageStr) {
  const keyBytes = stringToBytes(keyStr);
  const msgBytes = stringToBytes(messageStr);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, msgBytes);
  return bytesToHex(new Uint8Array(signature));
}

function generateRandomHexKey(byteLength = 16) {
  const randomBytes = new Uint8Array(byteLength);
  crypto.getRandomValues(randomBytes);
  return bytesToHex(randomBytes);
}

/* ============================================================================
   INTERACTIVE SIMULATION LOGIC (Alice -> Eve -> Bob)
   Strict On-Demand Execution Upon Button Press
   ============================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Master Navbar Tab Switching & Dynamic Height Interop
  const sections = document.querySelectorAll('.lab-section');
  const tabButtons = document.querySelectorAll('.lab-tab-btn');

  function reportHeight() {
    try {
      const container = document.querySelector('.lab-experiment-container');
      const h = container
        ? Math.max(container.scrollHeight, container.offsetHeight)
        : Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
      window.parent?.postMessage({ type: 'RESIZE_IFRAME', height: h }, '*');
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

    tabButtons.forEach((b) => {
      if (b.getAttribute('data-target') === targetId) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      window.parent.postMessage({ type: 'ACTIVE_TAB_CHANGED', target: targetId }, '*');
    } catch (_) {}
    setTimeout(reportHeight, 40);
  }

  window.addEventListener('message', (event) => {
    if (event.data && (event.data.type === 'SET_TAB' || event.data.type === 'SET_ACTIVE_TAB')) {
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

  // 2. DOM Elements
  // Alice (Sender)
  const aliceMessage = document.getElementById('aliceMessage');
  const aliceKey = document.getElementById('aliceKey');
  const btnAliceSend = document.getElementById('btnAliceSend');
  const senderError = document.getElementById('senderError');
  const aliceTagDisplay = document.getElementById('aliceTagDisplay');
  const aliceTagMeta = document.getElementById('aliceTagMeta');
  const aliceTransmittedBox = document.getElementById('aliceTransmittedBox');
  const aliceTransmittedContent = document.getElementById('aliceTransmittedContent');

  // Channel & Eve
  const channelStatusText = document.getElementById('channelStatusText');
  const attackerToggle = document.getElementById('attackerToggle');
  const evePanel = document.getElementById('evePanel');
  const eveInterceptedMsg = document.getElementById('eveInterceptedMsg');
  const eveInterceptedTag = document.getElementById('eveInterceptedTag');
  const eveModifiedMsg = document.getElementById('eveModifiedMsg');
  const btnTamperAmount = document.getElementById('btnTamperAmount');
  const btnEveForge = document.getElementById('btnEveForge');
  const eveForgedResultBox = document.getElementById('eveForgedResultBox');
  const eveRandomKeyDisplay = document.getElementById('eveRandomKeyDisplay');
  const eveForgedTagDisplay = document.getElementById('eveForgedTagDisplay');

  // Bob (Receiver)
  const bobReceivedMsg = document.getElementById('bobReceivedMsg');
  const bobReceivedTag = document.getElementById('bobReceivedTag');
  const bobSharedKey = document.getElementById('bobSharedKey');
  const btnBobVerify = document.getElementById('btnBobVerify');
  const bobComputedTag = document.getElementById('bobComputedTag');
  const bobVerifySuccess = document.getElementById('bobVerifySuccess');
  const bobVerifyFailure = document.getElementById('bobVerifyFailure');
  const bobSuccessDetails = document.getElementById('bobSuccessDetails');
  const bobFailureDetails = document.getElementById('bobFailureDetails');

  // Reset Button
  const btnResetSim = document.getElementById('btnResetSim');

  // Pipeline State
  let simState = {
    transmitted: false,
    senderMessage: '',
    senderKey: '',
    senderMAC: '',
    attackerForgedMsg: '',
    attackerForgedTag: '',
    attackerRandomKey: ''
  };

  // 3. Preset Buttons (Only fills the message, strictly NO auto-calculation)
  const presetButtons = document.querySelectorAll('.sim-preset-btn');
  presetButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const val = btn.getAttribute('data-val');
      if (aliceMessage && val) {
        aliceMessage.value = val;
      }
    });
  });

  // 4. BUTTON 1: Alice "⚡ Generate MAC & Transmit"
  // ONLY on this button press is Alice's HMAC computed!
  if (btnAliceSend) {
    btnAliceSend.addEventListener('click', async () => {
      const msg = aliceMessage ? aliceMessage.value : '';
      const key = aliceKey ? aliceKey.value.trim() : '';

      // Reset any previous errors
      if (senderError) {
        senderError.style.display = 'none';
        senderError.textContent = '';
      }

      if (!key) {
        if (senderError) {
          senderError.textContent = 'Please enter a shared secret key (K).';
          senderError.style.display = 'block';
        }
        return;
      }

      if (!msg) {
        if (senderError) {
          senderError.textContent = 'Please enter a message payload (M).';
          senderError.style.display = 'block';
        }
        return;
      }

      btnAliceSend.disabled = true;
      const originalBtnText = btnAliceSend.innerHTML;
      btnAliceSend.innerHTML = '<span>Computing HMAC-SHA256…</span>';

      try {
        const mac = await computeHmacSha256(key, msg);

        simState.transmitted = true;
        simState.senderMessage = msg;
        simState.senderKey = key;
        simState.senderMAC = mac;

        // Render Alice's computed tag
        if (aliceTagDisplay) {
          aliceTagDisplay.textContent = mac;
        }

        if (aliceTagMeta) {
          aliceTagMeta.innerHTML = `Tag: <strong>${mac.length * 4} bits</strong> (${mac.length / 2} bytes) &bull; <strong>HMAC-SHA256</strong>`;
          aliceTagMeta.style.display = 'block';
        }

        if (aliceTransmittedBox && aliceTransmittedContent) {
          aliceTransmittedContent.innerHTML = `
            <span class="transmitted-msg">${escapeHTML(msg)}</span>
            <span class="transmitted-separator">||</span>
            <span class="transmitted-mac">${mac}</span>
          `;
          aliceTransmittedBox.style.display = 'block';
        }

        // Forward through channel depending on attacker toggle
        const isAttacker = attackerToggle ? attackerToggle.checked : false;

        if (isAttacker) {
          // Attacker intercepts
          if (eveInterceptedMsg) eveInterceptedMsg.textContent = msg;
          if (eveInterceptedTag) eveInterceptedTag.textContent = mac;
          if (eveModifiedMsg && (!eveModifiedMsg.value || eveModifiedMsg.value === 'Transfer $5,000 to Account #98412')) {
            eveModifiedMsg.value = msg;
          }
          if (eveForgedResultBox) eveForgedResultBox.style.display = 'none';

          // Bob awaits attacker forwarding
          if (bobReceivedMsg) bobReceivedMsg.textContent = '[Awaiting Transmission from Attacker]';
          if (bobReceivedTag) bobReceivedTag.textContent = '[Awaiting Transmission from Attacker]';
        } else {
          // Clean transmission direct to Bob
          if (bobReceivedMsg) bobReceivedMsg.textContent = msg;
          if (bobReceivedTag) bobReceivedTag.textContent = mac;
        }

        // Reset Bob's computation & verdict (Bob does NOT verify automatically!)
        if (bobComputedTag) bobComputedTag.textContent = "[Awaiting Verification — Click '⚡ Verify Cryptographic Integrity']";
        if (bobVerifySuccess) bobVerifySuccess.style.display = 'none';
        if (bobVerifyFailure) bobVerifyFailure.style.display = 'none';

        setTimeout(reportHeight, 50);
      } catch (err) {
        if (senderError) {
          senderError.textContent = 'Cryptographic Error: ' + err.message;
          senderError.style.display = 'block';
        }
      } finally {
        btnAliceSend.disabled = false;
        btnAliceSend.innerHTML = originalBtnText;
      }
    });
  }

  // 5. Attacker Toggle (Simulate Attacker Switch)
  if (attackerToggle) {
    attackerToggle.addEventListener('change', () => {
      const active = attackerToggle.checked;
      if (evePanel) evePanel.style.display = active ? 'block' : 'none';

      if (channelStatusText) {
        channelStatusText.textContent = active
          ? '⚠️ Compromised Channel (Eve Active)'
          : '🛡️ Secure Direct Channel';
        channelStatusText.style.color = active ? '#e11d48' : '#18181b';
      }

      if (simState.transmitted) {
        if (active) {
          // Populate Eve with Alice's payload
          if (eveInterceptedMsg) eveInterceptedMsg.textContent = simState.senderMessage;
          if (eveInterceptedTag) eveInterceptedTag.textContent = simState.senderMAC;
          if (eveModifiedMsg) eveModifiedMsg.value = simState.senderMessage;
          if (eveForgedResultBox) eveForgedResultBox.style.display = 'none';

          if (bobReceivedMsg) bobReceivedMsg.textContent = '[Awaiting Transmission from Attacker]';
          if (bobReceivedTag) bobReceivedTag.textContent = '[Awaiting Transmission from Attacker]';
        } else {
          // Re-route Alice's clean transmission direct to Bob
          if (bobReceivedMsg) bobReceivedMsg.textContent = simState.senderMessage;
          if (bobReceivedTag) bobReceivedTag.textContent = simState.senderMAC;
        }
      }

      // Reset Bob's computation & verdict
      if (bobComputedTag) bobComputedTag.textContent = "[Awaiting Verification — Click '⚡ Verify Cryptographic Integrity']";
      if (bobVerifySuccess) bobVerifySuccess.style.display = 'none';
      if (bobVerifyFailure) bobVerifyFailure.style.display = 'none';

      setTimeout(reportHeight, 50);
    });
  }

  // 6. BUTTON 2: Eve "⚡ Tamper: $5,000 → $95,000"
  // ONLY changes the text in Eve's textarea, strictly NO auto-calculation or forwarding!
  if (btnTamperAmount && eveModifiedMsg) {
    btnTamperAmount.addEventListener('click', () => {
      const current = eveModifiedMsg.value;
      if (current.includes('$5,000')) {
        eveModifiedMsg.value = current.replace('$5,000', '$95,000');
      } else if (current.includes('$95,000')) {
        eveModifiedMsg.value = current.replace('$95,000', '$5,000');
      } else {
        eveModifiedMsg.value = current + ' [TAMPERED]';
      }

      eveModifiedMsg.classList.add('tampered-highlight');
      setTimeout(() => eveModifiedMsg.classList.remove('tampered-highlight'), 1200);

      // Hide previous forgery result until Forge button is pressed
      if (eveForgedResultBox) eveForgedResultBox.style.display = 'none';
    });
  }

  // 7. BUTTON 3: Eve "⚡ Forge Tag with Random Key & Forward"
  // ONLY on this button press is the random key generated and forged MAC computed!
  if (btnEveForge) {
    btnEveForge.addEventListener('click', async () => {
      const modifiedPayload = eveModifiedMsg ? eveModifiedMsg.value : '';

      if (!simState.transmitted) {
        alert('Please click "⚡ Generate MAC & Transmit" in Alice\'s panel first before forging!');
        return;
      }

      btnEveForge.disabled = true;
      const originalText = btnEveForge.innerHTML;
      btnEveForge.innerHTML = '<span>Forging MAC…</span>';

      try {
        // Generate a random unknown 128-bit key
        const randomKey = generateRandomHexKey(16);

        // Compute forged MAC tag using random key on modified message
        const forgedTag = await computeHmacSha256(randomKey, modifiedPayload);

        simState.attackerForgedMsg = modifiedPayload;
        simState.attackerForgedTag = forgedTag;
        simState.attackerRandomKey = randomKey;

        // Render attacker's forged credentials
        if (eveRandomKeyDisplay) eveRandomKeyDisplay.textContent = randomKey;
        if (eveForgedTagDisplay) eveForgedTagDisplay.textContent = forgedTag;
        if (eveForgedResultBox) eveForgedResultBox.style.display = 'grid';

        // Forward tampered payload to Bob
        if (bobReceivedMsg) bobReceivedMsg.textContent = modifiedPayload;
        if (bobReceivedTag) bobReceivedTag.textContent = forgedTag;

        // Reset Bob's computation & verdict (Bob does NOT verify automatically!)
        if (bobComputedTag) bobComputedTag.textContent = "[Awaiting Verification — Click '⚡ Verify Cryptographic Integrity']";
        if (bobVerifySuccess) bobVerifySuccess.style.display = 'none';
        if (bobVerifyFailure) bobVerifyFailure.style.display = 'none';

        setTimeout(reportHeight, 50);
      } catch (err) {
        console.error('Error generating forged MAC:', err);
      } finally {
        btnEveForge.disabled = false;
        btnEveForge.innerHTML = originalText;
      }
    });
  }

  // 8. BUTTON 4: Bob "⚡ Verify Cryptographic Integrity"
  // ONLY on this button press does Bob recompute HMAC using shared key K and compare!
  if (btnBobVerify) {
    btnBobVerify.addEventListener('click', async () => {
      const key = bobSharedKey ? bobSharedKey.value.trim() : '';
      const receivedMsg = bobReceivedMsg ? bobReceivedMsg.textContent : '';
      const receivedTag = bobReceivedTag ? bobReceivedTag.textContent : '';

      if (!receivedMsg || receivedMsg.includes('[Awaiting Transmission')) {
        alert('Bob has not received any message payload yet! Transmit from Alice first.');
        return;
      }

      btnBobVerify.disabled = true;
      const originalText = btnBobVerify.innerHTML;
      btnBobVerify.innerHTML = '<span>Verifying Cryptographic Integrity…</span>';

      try {
        // Bob computes HMAC on received message using his shared key K
        const computed = await computeHmacSha256(key, receivedMsg);

        if (bobComputedTag) {
          bobComputedTag.textContent = computed;
        }

        const isMatch = (computed === receivedTag);

        if (isMatch) {
          if (bobVerifySuccess) {
            bobVerifySuccess.style.display = 'flex';
          }
          if (bobVerifyFailure) {
            bobVerifyFailure.style.display = 'none';
          }
          if (bobSuccessDetails) {
            bobSuccessDetails.innerHTML = `
              Computed MAC: <code style="color: #15803d; font-weight: 700;">${computed}</code><br>
              Received MAC: <code style="color: #15803d; font-weight: 700;">${receivedTag}</code>
            `;
          }
        } else {
          if (bobVerifySuccess) {
            bobVerifySuccess.style.display = 'none';
          }
          if (bobVerifyFailure) {
            bobVerifyFailure.style.display = 'flex';
          }
          if (bobFailureDetails) {
            bobFailureDetails.innerHTML = `
              Computed MAC: <code style="color: #15803d; font-weight: 700;">${computed}</code><br>
              Received MAC: <code style="color: #b91c1c; font-weight: 700;">${receivedTag}</code>
            `;
          }
        }

        setTimeout(reportHeight, 50);
      } catch (err) {
        console.error('Error during Bob verification:', err);
      } finally {
        btnBobVerify.disabled = false;
        btnBobVerify.innerHTML = originalText;
      }
    });
  }

  // 9. BUTTON 5: "↺ Reset Simulation"
  // Resets all panels to initial awaiting state
  if (btnResetSim) {
    btnResetSim.addEventListener('click', () => {
      simState = {
        transmitted: false,
        senderMessage: '',
        senderKey: '',
        senderMAC: '',
        attackerForgedMsg: '',
        attackerForgedTag: '',
        attackerRandomKey: ''
      };

      // Reset Alice
      if (aliceMessage) aliceMessage.value = 'Transfer $5,000 to Account #98412';
      if (aliceKey) aliceKey.value = 'mysecretkey123';
      if (senderError) {
        senderError.style.display = 'none';
        senderError.textContent = '';
      }
      if (aliceTagDisplay) {
        aliceTagDisplay.textContent = "[Awaiting Generation — Click '⚡ Generate MAC & Transmit']";
      }
      if (aliceTagMeta) aliceTagMeta.style.display = 'none';
      if (aliceTransmittedBox) aliceTransmittedBox.style.display = 'none';

      // Reset Channel & Eve
      if (attackerToggle) attackerToggle.checked = false;
      if (evePanel) evePanel.style.display = 'none';
      if (channelStatusText) {
        channelStatusText.textContent = '🛡️ Secure Direct Channel';
        channelStatusText.style.color = '#18181b';
      }
      if (eveInterceptedMsg) eveInterceptedMsg.textContent = '[Awaiting Alice\'s Transmission]';
      if (eveInterceptedTag) eveInterceptedTag.textContent = '[Awaiting Alice\'s Transmission]';
      if (eveModifiedMsg) eveModifiedMsg.value = 'Transfer $5,000 to Account #98412';
      if (eveForgedResultBox) eveForgedResultBox.style.display = 'none';

      // Reset Bob
      if (bobSharedKey) bobSharedKey.value = 'mysecretkey123';
      if (bobReceivedMsg) bobReceivedMsg.textContent = '[Awaiting Transmission]';
      if (bobReceivedTag) bobReceivedTag.textContent = '[Awaiting Transmission]';
      if (bobComputedTag) bobComputedTag.textContent = "[Awaiting Verification — Click 'Verify']";
      if (bobVerifySuccess) bobVerifySuccess.style.display = 'none';
      if (bobVerifyFailure) bobVerifyFailure.style.display = 'none';

      setTimeout(reportHeight, 50);
    });
  }

  // 10. Self-Assessment Quiz Engine
  const btnSubmitQuiz = document.getElementById('btnSubmitQuiz');
  const btnResetQuiz = document.getElementById('btnResetQuiz');
  const quizScoreBanner = document.getElementById('quizScoreBanner');
  const quizScoreText = document.getElementById('quizScoreText');

  const correctAnswers = {
    q1: 1, // Data integrity & origin auth
    q2: 1, // Symmetric shared secret key
    q3: 1, // Verification fails
    q4: 1, // Both hold same key
    q5: 1, // HMAC
    q6: 1  // M || T
  };

  const quizReasons = {
    q1: 'A MAC uses a secret key to generate a unique tag. This tag proves that the message came from a trusted sender who holds the secret key (Data Origin Authentication), and the content was not altered in transit (Data Integrity).',
    q2: 'MAC is a symmetric key system. Both sender (Alice) and receiver (Bob) share the exact same secret key K. Alice uses K to generate the tag, and Bob uses K to verify it.',
    q3: 'When the receiver computes MAC(K, M\') using the actual secret key K, the result will be completely different from the attacker\'s forged MAC(random_key, M\'). The mismatch immediately reveals tampering.',
    q4: 'Both communicating endpoints share the exact same symmetric key K. Either party could compute the tag, so neither can prove to an outside third party which one created it (unlike digital signatures with private keys).',
    q5: 'HMAC (RFC 2104) is the standardized cryptographic construction that converts any iterative hash function (such as SHA-256) into a secure message authentication code.',
    q6: 'In standard MAC communication, the sender transmits the plaintext message concatenated with the computed authentication tag M || T across the channel.'
  };

  if (btnSubmitQuiz) {
    btnSubmitQuiz.addEventListener('click', () => {
      let score = 0;
      const total = Object.keys(correctAnswers).length;

      Object.entries(correctAnswers).forEach(([qKey, correctIdx]) => {
        const selected = document.querySelector(`input[name="${qKey}"]:checked`);
        const feedbackEl = document.getElementById(`${qKey}-feedback`);

        if (feedbackEl) {
          if (selected && parseInt(selected.value, 10) === correctIdx) {
            score++;
            feedbackEl.className = 'quiz-feedback correct';
            feedbackEl.textContent = `✓ Correct! ${quizReasons[qKey] || ''}`;
          } else {
            feedbackEl.className = 'quiz-feedback incorrect';
            feedbackEl.textContent = `✗ Incorrect. ${quizReasons[qKey] || ''}`;
          }
        }
      });

      if (quizScoreBanner && quizScoreText) {
        quizScoreBanner.style.display = 'flex';
        quizScoreText.textContent = `You scored ${score} out of ${total} (${Math.round((score / total) * 100)}%)`;
      }
      setTimeout(reportHeight, 50);
    });
  }

  if (btnResetQuiz) {
    btnResetQuiz.addEventListener('click', () => {
      document.querySelectorAll('input[type="radio"]').forEach((r) => {
        r.checked = false;
      });
      document.querySelectorAll('.quiz-feedback').forEach((f) => {
        f.className = 'quiz-feedback';
        f.textContent = '';
      });
      if (quizScoreBanner) {
        quizScoreBanner.style.display = 'none';
      }
      setTimeout(reportHeight, 50);
    });
  }

});
