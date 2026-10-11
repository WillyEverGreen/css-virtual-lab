/**
 * Virtual Cryptography Laboratory - HMAC Experiment
 * RFC 2104 / NIST FIPS PUB 198-1 Keyed-Hash Message Authentication Code
 * 100% Offline, Zero external dependencies, Pure client-side implementation.
 */

(function () {
  'use strict';

  // --- CRYPTOGRAPHIC ENGINE: SHA-256 & RFC 2104 HMAC ---

  var SHA256_K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];

  function sha256Bytes(bytes) {
    var H = [
      0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
      0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
    ];
    var bitLen = bytes.length * 8;
    var rem = bytes.length % 64;
    var paddingLen = (rem < 56) ? (56 - rem) : (120 - rem);
    var totalLen = bytes.length + paddingLen + 8;
    var padded = new Uint8Array(totalLen);
    padded.set(bytes);
    padded[bytes.length] = 0x80;

    var view = new DataView(padded.buffer);
    view.setBigUint64(totalLen - 8, BigInt(bitLen));

    var w = new Int32Array(64);
    for (var i = 0; i < totalLen; i += 64) {
      for (var t = 0; t < 16; t++) {
        w[t] = view.getInt32(i + t * 4);
      }
      for (var t1 = 16; t1 < 64; t1++) {
        var s0 = ((w[t1 - 15] >>> 7) | (w[t1 - 15] << 25)) ^
                 ((w[t1 - 15] >>> 18) | (w[t1 - 15] << 14)) ^
                 (w[t1 - 15] >>> 3);
        var s1 = ((w[t1 - 2] >>> 17) | (w[t1 - 2] << 15)) ^
                 ((w[t1 - 2] >>> 19) | (w[t1 - 2] << 13)) ^
                 (w[t1 - 2] >>> 10);
        w[t1] = (w[t1 - 16] + s0 + w[t1 - 7] + s1) | 0;
      }

      var a = H[0], b = H[1], c = H[2], d = H[3],
          e = H[4], f = H[5], g = H[6], h = H[7];

      for (var t2 = 0; t2 < 64; t2++) {
        var S1 = ((e >>> 6) | (e << 26)) ^
                 ((e >>> 11) | (e << 21)) ^
                 ((e >>> 25) | (e << 7));
        var ch = (e & f) ^ ((~e) & g);
        var temp1 = (h + S1 + ch + SHA256_K[t2] + w[t2]) | 0;
        var S0 = ((a >>> 2) | (a << 30)) ^
                 ((a >>> 13) | (a << 19)) ^
                 ((a >>> 22) | (a << 10));
        var maj = (a & b) ^ (a & c) ^ (b & c);
        var temp2 = (S0 + maj) | 0;

        h = g;
        g = f;
        f = e;
        e = (d + temp1) | 0;
        d = c;
        c = b;
        b = a;
        a = (temp1 + temp2) | 0;
      }

      H[0] = (H[0] + a) | 0;
      H[1] = (H[1] + b) | 0;
      H[2] = (H[2] + c) | 0;
      H[3] = (H[3] + d) | 0;
      H[4] = (H[4] + e) | 0;
      H[5] = (H[5] + f) | 0;
      H[6] = (H[6] + g) | 0;
      H[7] = (H[7] + h) | 0;
    }

    var out = new Uint8Array(32);
    var outView = new DataView(out.buffer);
    for (var j = 0; j < 8; j++) {
      outView.setInt32(j * 4, H[j]);
    }
    return out;
  }

  function bytesToHex(uint8arr) {
    var hex = '';
    for (var i = 0; i < uint8arr.length; i++) {
      var byteHex = uint8arr[i].toString(16);
      if (byteHex.length === 1) {
        hex += '0';
      }
      hex += byteHex;
    }
    return hex;
  }

  function stringToUtf8(str) {
    if (typeof TextEncoder !== 'undefined') {
      return new TextEncoder().encode(str);
    }
    var utf8 = [];
    for (var i = 0; i < str.length; i++) {
      var charcode = str.charCodeAt(i);
      if (charcode < 0x80) utf8.push(charcode);
      else if (charcode < 0x800) {
        utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
      } else if (charcode < 0xd800 || charcode >= 0xe000) {
        utf8.push(0xe0 | (charcode >> 12), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
      }
    }
    return new Uint8Array(utf8);
  }

  /**
   * RFC 2104 HMAC-SHA-256 with step-by-step state capture
   */
  function computeHmacWithTrace(keyStr, msgStr) {
    var keyBytes = stringToUtf8(keyStr);
    var msgBytes = stringToUtf8(msgStr);
    var B = 64; // Block size for SHA-256 (64 bytes / 512 bits)

    // Step 1: Pre-hash key if length > B
    if (keyBytes.length > B) {
      keyBytes = sha256Bytes(keyBytes);
    }

    // Step 2: Pad derived key K' to B bytes with zeroes
    var Kprime = new Uint8Array(B);
    Kprime.set(keyBytes);

    // Step 3: Compute inner padded key (K' XOR ipad) and outer padded key (K' XOR opad)
    var innerPaddedKey = new Uint8Array(B);
    var outerPaddedKey = new Uint8Array(B);
    for (var i = 0; i < B; i++) {
      innerPaddedKey[i] = Kprime[i] ^ 0x36;
      outerPaddedKey[i] = Kprime[i] ^ 0x5c;
    }

    // Step 4: Inner hash H((K' XOR ipad) || message)
    var innerInput = new Uint8Array(B + msgBytes.length);
    innerInput.set(innerPaddedKey, 0);
    innerInput.set(msgBytes, B);
    var innerHashBytes = sha256Bytes(innerInput);

    // Step 5: Outer hash H((K' XOR opad) || inner_hash)
    var outerInput = new Uint8Array(B + innerHashBytes.length);
    outerInput.set(outerPaddedKey, 0);
    outerInput.set(innerHashBytes, B);
    var finalDigestBytes = sha256Bytes(outerInput);

    return {
      kPrimeHex: bytesToHex(Kprime),
      innerPadKeyHex: bytesToHex(innerPaddedKey),
      outerPadKeyHex: bytesToHex(outerPaddedKey),
      innerHashHex: bytesToHex(innerHashBytes),
      finalDigestHex: bytesToHex(finalDigestBytes)
    };
  }

  // --- HAMMING DISTANCE AND BIT DIFF ---

  function hexToBinaryString(hexStr) {
    var bin = '';
    for (var i = 0; i < hexStr.length; i++) {
      var nibble = parseInt(hexStr.charAt(i), 16);
      bin += nibble.toString(2).padStart(4, '0');
    }
    return bin;
  }

  function calculateBitDifference(hex1, hex2) {
    var bin1 = hexToBinaryString(hex1);
    var bin2 = hexToBinaryString(hex2);
    var diffCount = 0;
    var totalBits = Math.max(bin1.length, bin2.length);

    for (var i = 0; i < totalBits; i++) {
      var b1 = bin1[i] || '0';
      var b2 = bin2[i] || '0';
      if (b1 !== b2) {
        diffCount++;
      }
    }
    return {
      diffCount: diffCount,
      totalBits: totalBits,
      percentage: ((diffCount / totalBits) * 100).toFixed(2)
    };
  }

  // --- QUIZ QUESTIONS SPECIFICATION (10 Questions, Rule V501-V505) ---

  var QUIZ_QUESTIONS = [
    {
      id: "q1",
      prompt: "What primary security properties are provided by HMAC?",
      options: [
        "Confidentiality and encryption",
        "Data integrity and message authenticity",
        "Non-repudiation and public key exchange",
        "Key generation and certificate distribution"
      ],
      answerIndex: 1,
      explanation: "HMAC verifies that a message has not been altered in transit (integrity) and confirms that it originated from a sender possessing the shared secret key (authenticity). It does not encrypt data for confidentiality."
    },
    {
      id: "q2",
      prompt: "Which RFC standard officially specifies Keyed-Hashing for Message Authentication (HMAC)?",
      options: [
        "RFC 793",
        "RFC 2104",
        "RFC 2616",
        "RFC 5246"
      ],
      answerIndex: 1,
      explanation: "RFC 2104, published in 1997, defines the standard HMAC construction and operational guidelines."
    },
    {
      id: "q3",
      prompt: "Why is naive concatenation Hash(Key || Message) vulnerable in Merkle-Damgard hash algorithms?",
      options: [
        "It is vulnerable to length extension attacks",
        "It cannot be computed in linear time",
        "It produces variable length outputs",
        "It requires asymmetric private keys"
      ],
      answerIndex: 0,
      explanation: "In Merkle-Damgard hash functions like MD5, SHA-1, and SHA-256, an attacker knowing Hash(Key || Message) and the message length can append data and compute the new valid hash without knowing the secret key."
    },
    {
      id: "q4",
      prompt: "What constant byte value is repeated B times to form the inner pad (ipad) in RFC 2104?",
      options: [
        "0x00",
        "0x36",
        "0x5C",
        "0xFF"
      ],
      answerIndex: 1,
      explanation: "The inner padding byte ipad is 0x36 repeated B times (64 times for SHA-256) and XORed with the derived key."
    },
    {
      id: "q5",
      prompt: "What constant byte value is repeated B times to form the outer pad (opad) in RFC 2104?",
      options: [
        "0x36",
        "0x5C",
        "0xAA",
        "0x00"
      ],
      answerIndex: 1,
      explanation: "The outer padding byte opad is 0x5C repeated B times (64 times for SHA-256) and XORed with the derived key for the second hash pass."
    },
    {
      id: "q6",
      prompt: "If a secret key K is longer than the hash block size B (64 bytes for SHA-256), how is it processed?",
      options: [
        "It is truncated to the first 16 bytes",
        "It is hashed using the underlying hash function to produce a shorter key",
        "It is rejected as an invalid key error",
        "It is padded with ones to double block size"
      ],
      answerIndex: 1,
      explanation: "When key K is longer than block size B, HMAC pre-hashes it so that K prime equals H(K), then pads it with zeroes to block size B."
    },
    {
      id: "q7",
      prompt: "What is the expected avalanche effect when altering a single bit in the message or key?",
      options: [
        "0 percent of output bits change",
        "Approximately 10 percent of output bits change",
        "Approximately 50 percent of output bits change",
        "Exactly 100 percent of output bits are inverted"
      ],
      answerIndex: 2,
      explanation: "A high-quality cryptographic hash exhibits the avalanche effect, flipping roughly 50 percent of the output bits on average when a single input bit changes."
    },
    {
      id: "q8",
      prompt: "Can a receiver decrypt an HMAC digest to recover the original plaintext message?",
      options: [
        "Yes, using the secret key in reverse",
        "Yes, using RSA asymmetric decryption",
        "No, because HMAC is a lossy one-way hash digest and not an encryption cipher",
        "No, unless an initialization vector was used"
      ],
      answerIndex: 2,
      explanation: "HMAC is a one-way cryptographic hash construction that compresses messages into a fixed digest. It is not an encryption cipher and cannot be inverted or decrypted."
    },
    {
      id: "q9",
      prompt: "In the Encrypt-then-MAC authenticated encryption scheme, what does the HMAC tag authenticate?",
      options: [
        "Only the shared secret key",
        "The initialization vector and the ciphertext",
        "Only the unencrypted plaintext",
        "The salt and user password"
      ],
      answerIndex: 1,
      explanation: "In Encrypt-then-MAC, HMAC authenticates the IV and ciphertext, allowing the receiver to verify message integrity before attempting any decryption."
    },
    {
      id: "q10",
      prompt: "During HMAC verification, what happens if an attacker modifies one byte of the ciphertext during transmission?",
      options: [
        "The verification succeeds because the key was unchanged",
        "The receiver computes a completely different HMAC tag, causing verification to fail",
        "The hash function automatically corrects the corrupted byte",
        "The digest length expands to indicate tampering"
      ],
      answerIndex: 1,
      explanation: "Due to the avalanche effect, modifying even one byte in transit produces an entirely different HMAC at the receiver, causing verification to fail and alerting the receiver of tampering."
    }
  ];

  // --- STATE VARIABLES ---
  var state = {
    originalPacket: {
      message: '',
      key: '',
      hmac: ''
    },
    channelPacket: {
      message: '',
      key: '',
      hmac: ''
    }
  };

  // --- INITIALIZATION ---
  document.addEventListener('DOMContentLoaded', function () {
    initTabs();
    initGenerator();
    initNetworkChannel();
    initAvalanche();
    initQuiz();
    // Auto calculate initial sender HMAC
    generateSenderHmac();
  });

  // --- TAB NAVIGATION ---
  
  function reportHeight() {
    try {
      var simEl = document.getElementById("simulation") || document.querySelector(".lab-experiment-container") || document.body;
      var h = Math.max(simEl.scrollHeight || 0, simEl.offsetHeight || 0);
      window.parent.postMessage({ type: 'RESIZE_IFRAME', height: h }, '*');
    } catch (_) {}
  }
  window.addEventListener('resize', reportHeight);

  var urlParams = new URLSearchParams(window.location.search);
  var isSimMode = urlParams.get('mode') === 'sim';
  if (isSimMode) {
    document.body.classList.add('mode-sim');
    var allSecs = document.querySelectorAll('.lab-section');
    for (var s = 0; s < allSecs.length; s++) {
      if (allSecs[s].id !== 'simulation') allSecs[s].style.display = 'none';
      else allSecs[s].style.display = 'block';
    }
  }
  setTimeout(reportHeight, 100);

  function initTabs() {
    var btnGen = document.getElementById('tabBtnGen');
    var btnAv = document.getElementById('tabBtnAvalanche');
    var btnQ = document.getElementById('tabBtnQuiz');

    var paneGen = document.getElementById('paneGenerator');
    var paneAv = document.getElementById('paneAvalanche');
    var paneQ = document.getElementById('paneQuiz');

    if (!btnGen || !btnAv || !btnQ) return;

    btnGen.addEventListener('click', function () {
      btnGen.classList.add('active');
      btnAv.classList.remove('active');
      btnQ.classList.remove('active');
      paneGen.style.display = 'block';
      paneAv.style.display = 'none';
      paneQ.style.display = 'none';
    });

    btnAv.addEventListener('click', function () {
      btnAv.classList.add('active');
      btnGen.classList.remove('active');
      btnQ.classList.remove('active');
      paneGen.style.display = 'none';
      paneAv.style.display = 'block';
      paneQ.style.display = 'none';
      runAvalancheAnalysis();
    });

    btnQ.addEventListener('click', function () {
      btnQ.classList.add('active');
      btnGen.classList.remove('active');
      btnAv.classList.remove('active');
      paneGen.style.display = 'none';
      paneAv.style.display = 'none';
      paneQ.style.display = 'block';
    });
  }

  // --- HMAC GENERATOR LOGIC ---
  function generateSenderHmac() {
    var msgInput = document.getElementById('senderMessage');
    var keyInput = document.getElementById('senderKey');
    var display = document.getElementById('senderHmacDisplay');

    var traceK = document.getElementById('traceDerivedKey');
    var traceInPad = document.getElementById('traceInnerPadKey');
    var traceOutPad = document.getElementById('traceOuterPadKey');
    var traceInHash = document.getElementById('traceInnerHash');
    var traceFinal = document.getElementById('traceFinalDigest');

    if (!msgInput || !keyInput) return;

    var msg = msgInput.value;
    var key = keyInput.value;

    var result = computeHmacWithTrace(key, msg);

    if (display) display.textContent = result.finalDigestHex;
    if (traceK) traceK.textContent = result.kPrimeHex;
    if (traceInPad) traceInPad.textContent = result.innerPadKeyHex;
    if (traceOutPad) traceOutPad.textContent = result.outerPadKeyHex;
    if (traceInHash) traceInHash.textContent = result.innerHashHex;
    if (traceFinal) traceFinal.textContent = result.finalDigestHex;

    state.originalPacket.message = msg;
    state.originalPacket.key = key;
    state.originalPacket.hmac = result.finalDigestHex;
  }

  function initGenerator() {
    var btnGen = document.getElementById('btnGenerateHmac');
    var btnPreset = document.getElementById('btnPresetRfc');
    var btnClear = document.getElementById('btnClearSender');

    if (btnGen) {
      btnGen.addEventListener('click', function () {
        generateSenderHmac();
      });
    }

    if (btnPreset) {
      btnPreset.addEventListener('click', function () {
        var msgInput = document.getElementById('senderMessage');
        var keyInput = document.getElementById('senderKey');
        if (msgInput) msgInput.value = 'The quick brown fox jumps over the lazy dog';
        if (keyInput) keyInput.value = 'key';
        generateSenderHmac();
      });
    }

    if (btnClear) {
      btnClear.addEventListener('click', function () {
        var msgInput = document.getElementById('senderMessage');
        var keyInput = document.getElementById('senderKey');
        if (msgInput) msgInput.value = '';
        if (keyInput) keyInput.value = '';
        var display = document.getElementById('senderHmacDisplay');
        if (display) display.textContent = 'Enter message and key, then click Generate...';
      });
    }
  }

  // --- NETWORK CHANNEL & RECEIVER VERIFICATION LOGIC ---
  function updateChannelDisplay() {
    var chMsg = document.getElementById('channelMsgText');
    var chKey = document.getElementById('channelKeyText');
    var chHmac = document.getElementById('channelHmacText');

    if (chMsg) chMsg.textContent = state.channelPacket.message || '[Empty]';
    if (chKey) chKey.textContent = state.channelPacket.key || '[Empty]';
    if (chHmac) chHmac.textContent = state.channelPacket.hmac || '[Empty]';

    var badge = document.getElementById('receiverVerdictBadge');
    if (badge) {
      badge.className = 'lab-status-badge lab-status-neutral';
      badge.textContent = 'Status: Awaiting Verification';
    }
    var recRecomputed = document.getElementById('receiverRecalculatedHmac');
    if (recRecomputed) recRecomputed.textContent = '---';
    var recTransmitted = document.getElementById('receiverTransmittedHmac');
    if (recTransmitted) recTransmitted.textContent = '---';
  }

  function initNetworkChannel() {
    var btnSend = document.getElementById('btnSendToChannel');
    var btnTamperM = document.getElementById('btnTamperMsg');
    var btnTamperK = document.getElementById('btnTamperKey');
    var btnTamperT = document.getElementById('btnTamperTag');
    var btnReset = document.getElementById('btnResetPacket');
    var btnVerify = document.getElementById('btnVerifyHmac');

    if (btnSend) {
      btnSend.addEventListener('click', function () {
        generateSenderHmac();
        state.channelPacket.message = state.originalPacket.message;
        state.channelPacket.key = state.originalPacket.key;
        state.channelPacket.hmac = state.originalPacket.hmac;
        updateChannelDisplay();
      });
    }

    if (btnTamperM) {
      btnTamperM.addEventListener('click', function () {
        if (!state.channelPacket.message) {
          state.channelPacket.message = 'The quick brown fox jumps over the lazy dog';
        }
        var current = state.channelPacket.message;
        if (current.endsWith('[TAMPERED]')) {
          state.channelPacket.message = current + '!';
        } else {
          state.channelPacket.message = current + ' [TAMPERED]';
        }
        updateChannelDisplay();
      });
    }

    if (btnTamperK) {
      btnTamperK.addEventListener('click', function () {
        if (!state.channelPacket.key) {
          state.channelPacket.key = 'secret-key-2026';
        }
        state.channelPacket.key = state.channelPacket.key + '_corrupted';
        updateChannelDisplay();
      });
    }

    if (btnTamperT) {
      btnTamperT.addEventListener('click', function () {
        if (!state.channelPacket.hmac || state.channelPacket.hmac.length < 4) {
          state.channelPacket.hmac = '0000000000000000000000000000000000000000000000000000000000000000';
        } else {
          var tag = state.channelPacket.hmac;
          var flipped = (tag.charAt(0) === 'f') ? '0' : 'f';
          state.channelPacket.hmac = flipped + tag.substring(1);
        }
        updateChannelDisplay();
      });
    }

    if (btnReset) {
      btnReset.addEventListener('click', function () {
        state.channelPacket.message = state.originalPacket.message;
        state.channelPacket.key = state.originalPacket.key;
        state.channelPacket.hmac = state.originalPacket.hmac;
        updateChannelDisplay();
      });
    }

    if (btnVerify) {
      btnVerify.addEventListener('click', function () {
        var msg = state.channelPacket.message;
        var key = state.channelPacket.key;
        var transmitted = state.channelPacket.hmac;

        var recResult = computeHmacWithTrace(key, msg);
        var calculated = recResult.finalDigestHex;

        var recCalculatedDisplay = document.getElementById('receiverRecalculatedHmac');
        var recTransmittedDisplay = document.getElementById('receiverTransmittedHmac');
        var badge = document.getElementById('receiverVerdictBadge');

        if (recCalculatedDisplay) recCalculatedDisplay.textContent = calculated;
        if (recTransmittedDisplay) recTransmittedDisplay.textContent = transmitted || '[None]';

        if (transmitted && calculated === transmitted) {
          if (badge) {
            badge.className = 'lab-status-badge lab-status-match';
            badge.textContent = 'HMAC VERIFIED: Authentic & Unmodified (Integrity Preserved)';
          }
        } else {
          if (badge) {
            badge.className = 'lab-status-badge lab-status-mismatch';
            badge.textContent = 'VERIFICATION FAILED: Tampered Data or Invalid Key Detected!';
          }
        }
      });
    }
  }

  // --- AVALANCHE EFFECT LOGIC ---
  function runAvalancheAnalysis() {
    var msgAEl = document.getElementById('avMsgA');
    var keyAEl = document.getElementById('avKeyA');
    var msgBEl = document.getElementById('avMsgB');
    var keyBEl = document.getElementById('avKeyB');

    if (!msgAEl || !keyAEl || !msgBEl || !keyBEl) return;

    var resA = computeHmacWithTrace(keyAEl.value, msgAEl.value);
    var resB = computeHmacWithTrace(keyBEl.value, msgBEl.value);

    var digestAEl = document.getElementById('avDigestA');
    var digestBEl = document.getElementById('avDigestB');
    if (digestAEl) digestAEl.textContent = resA.finalDigestHex;
    if (digestBEl) digestBEl.textContent = resB.finalDigestHex;

    var metrics = calculateBitDifference(resA.finalDigestHex, resB.finalDigestHex);

    var bitDiffEl = document.getElementById('avBitDiffCount');
    var percEl = document.getElementById('avPercentage');
    if (bitDiffEl) bitDiffEl.textContent = metrics.diffCount + ' / ' + metrics.totalBits + ' bits';
    if (percEl) percEl.textContent = metrics.percentage + ' %';

    var diffBox = document.getElementById('avHexDiffBox');
    if (diffBox) {
      var html = '<div style="margin-bottom: 6px;"><strong>Sample A:</strong> ' + resA.finalDigestHex + '</div>';
      html += '<div><strong>Sample B:</strong> ';
      for (var i = 0; i < resA.finalDigestHex.length; i++) {
        var cA = resA.finalDigestHex.charAt(i);
        var cB = resB.finalDigestHex.charAt(i);
        if (cA === cB) {
          html += '<span class="lab-diff-same">' + cB + '</span>';
        } else {
          html += '<span class="lab-diff-flip">' + cB + '</span>';
        }
      }
      html += '</div>';
      diffBox.innerHTML = html;
    }
  }

  function initAvalanche() {
    var btnRun = document.getElementById('btnRunAvalanche');
    var btnFlip = document.getElementById('btnFlipSingleChar');
    var btnAlterKey = document.getElementById('btnAlterKeyOnly');

    if (btnRun) {
      btnRun.addEventListener('click', function () {
        runAvalancheAnalysis();
      });
    }

    if (btnFlip) {
      btnFlip.addEventListener('click', function () {
        var msgAEl = document.getElementById('avMsgA');
        var msgBEl = document.getElementById('avMsgB');
        if (msgAEl && msgBEl) {
          msgAEl.value = 'The quick brown fox jumps over the lazy dog';
          msgBEl.value = 'The quick brown fox jumps over the lazy cog';
          runAvalancheAnalysis();
        }
      });
    }

    if (btnAlterKey) {
      btnAlterKey.addEventListener('click', function () {
        var keyAEl = document.getElementById('avKeyA');
        var keyBEl = document.getElementById('avKeyB');
        if (keyAEl && keyBEl) {
          keyAEl.value = 'cryptography-lab-key-1';
          keyBEl.value = 'cryptography-lab-key-2';
          runAvalancheAnalysis();
        }
      });
    }
  }

  // --- QUIZ LOGIC ---
  function initQuiz() {
    var container = document.getElementById('quizContainer');
    if (!container) return;

    var html = '';
    for (var i = 0; i < QUIZ_QUESTIONS.length; i++) {
      var q = QUIZ_QUESTIONS[i];
      html += '<div class="lab-quiz-card" id="quizCard_' + q.id + '">';
      html += '<div class="lab-quiz-question">' + (i + 1) + '. ' + escapeHtml(q.prompt) + '</div>';
      html += '<div class="lab-quiz-options">';
      for (var j = 0; j < q.options.length; j++) {
        var opt = q.options[j];
        var optId = q.id + '_opt' + j;
        html += '<label class="lab-quiz-option" for="' + optId + '" id="label_' + optId + '">';
        html += '<input type="radio" name="' + q.id + '" id="' + optId + '" value="' + j + '"> ';
        html += '<span>' + escapeHtml(opt) + '</span>';
        html += '</label>';
      }
      html += '</div>';
      html += '<div class="lab-quiz-feedback" id="feedback_' + q.id + '"></div>';
      html += '</div>';
    }
    container.innerHTML = html;

    var btnSubmit = document.getElementById('btnSubmitQuiz');
    var btnReset = document.getElementById('btnResetQuiz');

    if (btnSubmit) {
      btnSubmit.addEventListener('click', function () {
        submitQuizAnswers();
      });
    }

    if (btnReset) {
      btnReset.addEventListener('click', function () {
        resetQuizAnswers();
      });
    }
  }

  function escapeHtml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function submitQuizAnswers() {
    var score = 0;
    var total = QUIZ_QUESTIONS.length;

    for (var i = 0; i < total; i++) {
      var q = QUIZ_QUESTIONS[i];
      var radios = document.getElementsByName(q.id);
      var selectedVal = -1;
      for (var r = 0; r < radios.length; r++) {
        if (radios[r].checked) {
          selectedVal = parseInt(radios[r].value, 10);
          break;
        }
      }

      var feedbackEl = document.getElementById('feedback_' + q.id);
      for (var j = 0; j < q.options.length; j++) {
        var labelEl = document.getElementById('label_' + q.id + '_opt' + j);
        if (labelEl) {
          labelEl.classList.remove('correct', 'incorrect');
          if (j === q.answerIndex) {
            labelEl.classList.add('correct');
          } else if (j === selectedVal) {
            labelEl.classList.add('incorrect');
          }
        }
      }

      if (feedbackEl) {
        if (selectedVal === q.answerIndex) {
          score++;
          feedbackEl.className = 'lab-quiz-feedback show-correct';
          feedbackEl.textContent = 'Correct! ' + q.explanation;
        } else {
          feedbackEl.className = 'lab-quiz-feedback show-incorrect';
          if (selectedVal === -1) {
            feedbackEl.textContent = 'Unanswered. Correct answer: ' + q.options[q.answerIndex] + '. ' + q.explanation;
          } else {
            feedbackEl.textContent = 'Incorrect. Correct answer: ' + q.options[q.answerIndex] + '. ' + q.explanation;
          }
        }
      }
    }

    var banner = document.getElementById('quizResultsBanner');
    var scoreText = document.getElementById('quizScoreText');
    var feedbackText = document.getElementById('quizScoreFeedbackText');

    if (banner && scoreText && feedbackText) {
      banner.style.display = 'block';
      scoreText.textContent = score + ' / ' + total;
      if (score === total) {
        feedbackText.textContent = 'Outstanding! Perfect score on HMAC cryptography concepts!';
      } else if (score >= total * 0.7) {
        feedbackText.textContent = 'Great work! You have demonstrated solid command of HMAC mechanisms.';
      } else {
        feedbackText.textContent = 'Good attempt. Review the Theory and Procedure sections to strengthen your understanding.';
      }
    }
  }

  function resetQuizAnswers() {
    for (var i = 0; i < QUIZ_QUESTIONS.length; i++) {
      var q = QUIZ_QUESTIONS[i];
      var radios = document.getElementsByName(q.id);
      for (var r = 0; r < radios.length; r++) {
        radios[r].checked = false;
      }
      for (var j = 0; j < q.options.length; j++) {
        var labelEl = document.getElementById('label_' + q.id + '_opt' + j);
        if (labelEl) labelEl.classList.remove('correct', 'incorrect');
      }
      var feedbackEl = document.getElementById('feedback_' + q.id);
      if (feedbackEl) {
        feedbackEl.className = 'lab-quiz-feedback';
        feedbackEl.style.display = 'none';
        feedbackEl.textContent = '';
      }
    }

    var banner = document.getElementById('quizResultsBanner');
    if (banner) banner.style.display = 'none';
  }

})();
