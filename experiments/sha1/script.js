/**
 * ============================================================================
 * Fr. Conceicao Rodrigues College of Engineering (Fr. CRCE)
 * Cryptography Virtual Laboratory - Experiment 02: SHA-1 Hash Algorithm
 * ============================================================================
 * Collaborative Implementation by Group B:
 * - Member 1: Aaron Deniz  (Preprocessing, UTF-8 Encoding, 512-bit Big-Endian Padding)
 * - Member 2: Tanush Chavan (State Registers A,B,C,D,E, 80-Step Expansion & Compression)
 * - Member 3: Swar         (Strict Avalanche Criterion Engine, 160-Bit Diff Matrix)
 * - Member 4: Asher        (Simulation UI, State Inspector, Interactive Test Vectors & Quiz)
 * ============================================================================
 */

/* ============================================================================
   MEMBER 1: PREPROCESSING, PADDING & 512-BIT BLOCK PARSING (Aaron Deniz)
   ============================================================================ */

function preprocessSHA1(message) {
  const bytes = [];

  // Convert string to UTF-8 byte stream
  for (let i = 0; i < message.length; i++) {
    let code = message.charCodeAt(i);
    if (code < 0x80) {
      bytes.push(code);
    } else if (code < 0x800) {
      bytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
    } else if (code < 0xd800 || code >= 0xe000) {
      bytes.push(
        0xe0 | (code >> 12),
        0x80 | ((code >> 6) & 0x3f),
        0x80 | (code & 0x3f)
      );
    } else {
      // UTF-16 surrogate pairs
      i++;
      const nextCode = message.charCodeAt(i);
      const codePoint = 0x10000 + (((code & 0x3ff) << 10) | (nextCode & 0x3ff));
      bytes.push(
        0xf0 | (codePoint >> 18),
        0x80 | ((codePoint >> 12) & 0x3f),
        0x80 | ((codePoint >> 6) & 0x3f),
        0x80 | (codePoint & 0x3f)
      );
    }
  }

  const originalBitLength = bytes.length * 8;

  // Append single '1' bit (0x80)
  bytes.push(0x80);

  // Append '0' bits until length = 448 mod 512 (56 bytes mod 64)
  while ((bytes.length % 64) !== 56) {
    bytes.push(0x00);
  }

  // Append 64-bit original bit length in BIG-ENDIAN format (FIPS 180-1)
  const highBits = Math.floor(originalBitLength / 0x100000000) >>> 0;
  const lowBits = (originalBitLength & 0xffffffff) >>> 0;

  bytes.push((highBits >>> 24) & 0xff);
  bytes.push((highBits >>> 16) & 0xff);
  bytes.push((highBits >>> 8) & 0xff);
  bytes.push(highBits & 0xff);

  bytes.push((lowBits >>> 24) & 0xff);
  bytes.push((lowBits >>> 16) & 0xff);
  bytes.push((lowBits >>> 8) & 0xff);
  bytes.push(lowBits & 0xff);

  // Partition into 512-bit (16 x 32-bit big-endian words) blocks
  const blocks = [];
  for (let blockStart = 0; blockStart < bytes.length; blockStart += 64) {
    const words = [];
    for (let i = 0; i < 64; i += 4) {
      const word = (
        (bytes[blockStart + i] << 24) |
        (bytes[blockStart + i + 1] << 16) |
        (bytes[blockStart + i + 2] << 8) |
        bytes[blockStart + i + 3]
      ) >>> 0;
      words.push(word);
    }
    blocks.push(words);
  }

  return {
    blocks: blocks,
    rawLength: message.length,
    utf8ByteLength: originalBitLength / 8,
    origBitLength: originalBitLength,
    paddedByteLength: bytes.length,
    paddedBitLength: bytes.length * 8,
    blockCount: blocks.length
  };
}

/* ============================================================================
   MEMBER 2: REGISTERS, EXPANSION & 80-STEP COMPRESSION (Tanush Chavan)
   ============================================================================ */

// 32-bit left circular rotation
function rotl(x, n) {
  return ((x << n) | (x >>> (32 - n))) >>> 0;
}

function sha1Detailed(message) {
  const prep = preprocessSHA1(message);

  // Initial 160-bit state registers (FIPS 180-1 constants)
  let H0 = 0x67452301;
  let H1 = 0xEFCDAB89;
  let H2 = 0x98BADCFE;
  let H3 = 0x10325476;
  let H4 = 0xC3D2E1F0;

  for (let b = 0; b < prep.blocks.length; b++) {
    const words = prep.blocks[b];
    const W = new Uint32Array(80);

    // Message schedule: W[0..15] from block
    for (let t = 0; t < 16; t++) {
      W[t] = words[t];
    }

    // Message schedule expansion: W[t] = rotl(W[t-3] ^ W[t-8] ^ W[t-14] ^ W[t-16], 1)
    for (let t = 16; t < 80; t++) {
      W[t] = rotl(W[t - 3] ^ W[t - 8] ^ W[t - 14] ^ W[t - 16], 1);
    }

    // Initialize 5 working variables
    let A = H0;
    let B = H1;
    let C = H2;
    let D = H3;
    let E = H4;

    // 80-round compression loop
    for (let t = 0; t < 80; t++) {
      let f, K;
      if (t < 20) {
        // Round 1: Ch(B, C, D) = (B & C) | (~B & D)
        f = (B & C) | ((~B) & D);
        K = 0x5A827999;
      } else if (t < 40) {
        // Round 2: Parity(B, C, D) = B ^ C ^ D
        f = B ^ C ^ D;
        K = 0x6ED9EBA1;
      } else if (t < 60) {
        // Round 3: Maj(B, C, D) = (B & C) | (B & D) | (C & D)
        f = (B & C) | (B & D) | (C & D);
        K = 0x8F1BBCDC;
      } else {
        // Round 4: Parity(B, C, D) = B ^ C ^ D
        f = B ^ C ^ D;
        K = 0xCA62C1D6;
      }

      const temp = (rotl(A, 5) + f + E + K + W[t]) >>> 0;
      E = D;
      D = C;
      C = rotl(B, 30);
      B = A;
      A = temp;
    }

    // Add block results back to hash accumulators (modulo 2^32)
    H0 = (H0 + A) >>> 0;
    H1 = (H1 + B) >>> 0;
    H2 = (H2 + C) >>> 0;
    H3 = (H3 + D) >>> 0;
    H4 = (H4 + E) >>> 0;
  }

  function toHex(val) {
    return val.toString(16).padStart(8, '0');
  }

  const digest = (toHex(H0) + toHex(H1) + toHex(H2) + toHex(H3) + toHex(H4)).toLowerCase();

  return {
    prep: prep,
    digest: digest,
    finalState: {
      A: H0,
      B: H1,
      C: H2,
      D: H3,
      E: H4
    }
  };
}

/* ============================================================================
   MEMBER 3: STRICT AVALANCHE CRITERION & 160-BIT MATRIX (Swar)
   ============================================================================ */

function hexToBin160(hex) {
  let bin = '';
  for (let i = 0; i < hex.length; i++) {
    bin += parseInt(hex[i], 16).toString(2).padStart(4, '0');
  }
  return bin;
}

function calculateAvalanche(text1, text2) {
  const res1 = sha1Detailed(text1);
  const res2 = sha1Detailed(text2);
  const bin1 = hexToBin160(res1.digest);
  const bin2 = hexToBin160(res2.digest);

  let flippedCount = 0;
  const bitComparison = [];

  for (let i = 0; i < 160; i++) {
    const b1 = bin1[i] || '0';
    const b2 = bin2[i] || '0';
    const flipped = b1 !== b2;
    if (flipped) {
      flippedCount++;
    }
    bitComparison.push({
      index: i + 1,
      b1: b1,
      b2: b2,
      flipped: flipped
    });
  }

  const percentage = ((flippedCount / 160) * 100).toFixed(2);

  return {
    hash1: res1.digest,
    hash2: res2.digest,
    flippedCount: flippedCount,
    percentage: percentage,
    bitComparison: bitComparison
  };
}

/* ============================================================================
   MEMBER 4: SIMULATION CONTROLS, INSPECTORS & QUIZ ENGINE (Asher)
   ============================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Navigation Tab Switching (Master Navbar Interop)
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

  // 2. SHA-1 Live Simulation
  const sha1Input = document.getElementById('sha1Input');
  const btnGenerate = document.getElementById('btnGenerate');
  const btnClear = document.getElementById('btnClear');
  const digestDisplay = document.getElementById('digestDisplay');
  const btnCopyDigest = document.getElementById('btnCopyDigest');
  const saltToggle = document.getElementById('saltToggle');
  const saltInput = document.getElementById('saltInput');

  // Preprocessing stats
  const statChars = document.getElementById('statChars');
  const statBytes = document.getElementById('statBytes');
  const statBits = document.getElementById('statBits');
  const statBlocks = document.getElementById('statBlocks');

  // Registers A, B, C, D, E
  const regA = document.getElementById('regA');
  const regB = document.getElementById('regB');
  const regC = document.getElementById('regC');
  const regD = document.getElementById('regD');
  const regE = document.getElementById('regE');

  function updateSimulation() {
    let rawText = sha1Input ? sha1Input.value : '';
    if (saltToggle && saltToggle.checked && saltInput && saltInput.value) {
      rawText = saltInput.value + rawText;
    }

    const result = sha1Detailed(rawText);

    if (digestDisplay) digestDisplay.textContent = result.digest;
    if (statChars) statChars.textContent = sha1Input ? sha1Input.value.length : 0;
    if (statBytes) statBytes.textContent = result.prep.utf8ByteLength;
    if (statBits) statBits.textContent = result.prep.origBitLength;
    if (statBlocks) statBlocks.textContent = result.prep.blockCount;

    if (regA) regA.textContent = '0x' + result.finalState.A.toString(16).padStart(8, '0');
    if (regB) regB.textContent = '0x' + result.finalState.B.toString(16).padStart(8, '0');
    if (regC) regC.textContent = '0x' + result.finalState.C.toString(16).padStart(8, '0');
    if (regD) regD.textContent = '0x' + result.finalState.D.toString(16).padStart(8, '0');
    if (regE) regE.textContent = '0x' + result.finalState.E.toString(16).padStart(8, '0');

    setTimeout(reportHeight, 40);
  }

  // Calculate ONLY on button click
  if (btnGenerate) {
    btnGenerate.addEventListener('click', updateSimulation);
  }

  if (btnClear && sha1Input) {
    btnClear.addEventListener('click', () => {
      sha1Input.value = '';
    });
  }

  // Presets populate message only, strictly NO auto-calculation
  const presetButtons = document.querySelectorAll('.sim-preset-btn:not(.av-preset)');
  presetButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const val = btn.getAttribute('data-val');
      if (sha1Input && val !== null) {
        sha1Input.value = val;
      }
    });
  });

  // Copy Digest
  if (btnCopyDigest && digestDisplay) {
    btnCopyDigest.addEventListener('click', () => {
      const text = digestDisplay.textContent || '';
      navigator.clipboard.writeText(text);
      const originalText = btnCopyDigest.textContent;
      btnCopyDigest.textContent = '✓ Copied';
      setTimeout(() => {
        btnCopyDigest.textContent = originalText;
      }, 1800);
    });
  }

  // 3. Message Padding Inspector (From Tanush's Repo)
  const inspectorInput = document.getElementById('inspectorInput');
  const btnInspectPadding = document.getElementById('btnInspectPadding');
  const padOrigStr = document.getElementById('padOrigStr');
  const padOrigLen = document.getElementById('padOrigLen');
  const padKZeros = document.getElementById('padKZeros');
  const padLenField = document.getElementById('padLenField');
  const padTotalSize = document.getElementById('padTotalSize');

  function inspectPadding() {
    const str = inspectorInput ? inspectorInput.value : '';
    const byteLen = new TextEncoder().encode(str).length;
    const bitLen = byteLen * 8;
    let k = (448 - (bitLen + 1) % 512) % 512;
    if (k < 0) k += 512;
    const totalPaddedBits = bitLen + 1 + k + 64;
    const totalBlocks = Math.ceil(totalPaddedBits / 512);

    if (padOrigStr) padOrigStr.textContent = str || '"" (Empty)';
    if (padOrigLen) padOrigLen.textContent = `${str.length} characters = ${bitLen} bits (${byteLen} bytes)`;
    if (padKZeros) padKZeros.textContent = `1 bit '1' + ${k} zero bits = ${k + 1} padding bits`;
    const lenHex = '0x' + (BigInt(bitLen)).toString(16).padStart(16, '0');
    if (padLenField) padLenField.textContent = `${lenHex} (${bitLen} in decimal)`;
    if (padTotalSize) padTotalSize.textContent = `${totalPaddedBits} bits (${totalBlocks} block${totalBlocks > 1 ? 's' : ''} of 16 words)`;

    setTimeout(reportHeight, 40);
  }

  if (btnInspectPadding) {
    btnInspectPadding.addEventListener('click', inspectPadding);
  }

  // 4. Avalanche Effect Visualizer
  const avInput1 = document.getElementById('avInput1');
  const avInput2 = document.getElementById('avInput2');
  const btnRunAvalanche = document.getElementById('btnRunAvalanche');
  const avHash1 = document.getElementById('avHash1');
  const avHash2 = document.getElementById('avHash2');
  const avFlippedCount = document.getElementById('avFlippedCount');
  const avPercent = document.getElementById('avPercent');
  const avBitGrid = document.getElementById('avBitGrid');
  const avObservationText = document.getElementById('avObservationText');

  // Avalanche Presets (Tanush's Repo)
  const avPresets = document.querySelectorAll('.av-preset');
  avPresets.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!avInput1 || !avInput2) return;
      const action = btn.getAttribute('data-action');
      const base = 'The quick brown fox jumps over the lazy dog';
      avInput1.value = base;

      if (action === 'case') {
        avInput2.value = 'the quick brown fox jumps over the lazy dog';
      } else if (action === 'add') {
        avInput2.value = base + '!';
      } else if (action === 'remove') {
        avInput2.value = base.slice(0, -1);
      } else if (action === 'character') {
        avInput2.value = 'The quick brown fox jumps over the lazy dog.';
      } else if (action === 'reset') {
        avInput1.value = 'The quick brown fox jumps over the lazy dog';
        avInput2.value = 'The quick brown fox jumps over the lazy dog.';
      }
    });
  });

  function updateAvalanche() {
    const text1 = avInput1 ? avInput1.value : '';
    const text2 = avInput2 ? avInput2.value : '';

    const av = calculateAvalanche(text1, text2);

    if (avHash1) avHash1.textContent = av.hash1;
    if (avHash2) avHash2.textContent = av.hash2;
    if (avFlippedCount) avFlippedCount.textContent = av.flippedCount;
    if (avPercent) avPercent.textContent = av.percentage + '%';

    // Render 160-bit difference matrix (5 rows of 32 bits)
    if (avBitGrid) {
      avBitGrid.innerHTML = '';
      av.bitComparison.forEach((bit) => {
        const cell = document.createElement('div');
        cell.className = 'bit-cell ' + (bit.flipped ? 'diff' : 'match');
        cell.textContent = bit.flipped ? '1' : '0';
        cell.title = `Bit #${bit.index}: Message 1 had '${bit.b1}', Message 2 had '${bit.b2}' (${bit.flipped ? 'FLIPPED' : 'MATCH'})`;
        avBitGrid.appendChild(cell);
      });
    }

    if (avObservationText) {
      const diffFrom50 = Math.abs(parseFloat(av.percentage) - 50);
      avObservationText.textContent = `Avalanche Diffusion: ${av.flippedCount}/160 bits (${av.percentage}%). ${diffFrom50 < 10 ? 'Target achieved! Approximately 50% of the digest bits inverted, proving strong Strict Avalanche Criterion (SAC) diffusion across all 80 rounds.' : 'Significant bit dispersion observed across all 80 rounds of logical transformations.'}`;
    }

    setTimeout(reportHeight, 40);
  }

  // Calculate ONLY on button click
  if (btnRunAvalanche) {
    btnRunAvalanche.addEventListener('click', updateAvalanche);
  }

  // 4. Assessment Quiz Engine
  const btnSubmitQuiz = document.getElementById('btnSubmitQuiz');
  const quizFeedback = document.querySelectorAll('.quiz-feedback');
  const quizScoreBanner = document.getElementById('quizScoreBanner');
  const quizScoreText = document.getElementById('quizScoreText');
  const btnResetQuiz = document.getElementById('btnResetQuiz');

  const correctAnswers = {
    q1: 1, // 160 bits (40 hex chars)
    q2: 2, // 80 operations
    q3: 1, // 5 registers (A, B, C, D, E)
    q4: 1, // XORing four previous words and rotating left by 1 bit
    q5: 1, // SHAttered (Stevens et al. / Google)
    q6: 1  // Big-endian (network) byte ordering
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
            feedbackEl.textContent = '✓ Correct! Excellent grasp of the cryptographic concept.';
          } else {
            feedbackEl.className = 'quiz-feedback incorrect';
            feedbackEl.textContent = '✗ Incorrect. Review the algorithm specification in Theory & Procedure.';
          }
        }
      });

      if (quizScoreBanner && quizScoreText) {
        quizScoreBanner.style.display = 'flex';
        quizScoreText.textContent = `You scored ${score} out of ${total} (${Math.round((score / total) * 100)}%)`;
      }
    });
  }

  if (btnResetQuiz) {
    btnResetQuiz.addEventListener('click', () => {
      document.querySelectorAll('input[type="radio"]').forEach((r) => {
        r.checked = false;
      });
      quizFeedback.forEach((f) => {
        f.className = 'quiz-feedback';
        f.textContent = '';
      });
      if (quizScoreBanner) {
        quizScoreBanner.style.display = 'none';
      }
    });
  }
});
