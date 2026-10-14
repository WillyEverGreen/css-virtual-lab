/**
 * ============================================================================
 * Cryptography Virtual Laboratory - Experiment 01: MD5 Hash Algorithm
 * Fr. Conceicao Rodrigues College of Engineering (Fr. CRCE)
 * ============================================================================
 * Collaborative Implementation by Group A:
 * - Member 1: Nicole Dabre  (Preprocessing, UTF-8 Encoding, Padding, Block Parsing)
 * - Member 2: Alciya Dodti  (Constants, Auxiliary Functions F,G,H,I, Left Rotation)
 * - Member 3: Larissa Dabreo (Initial State, 64-Round Compression, formatHex, MD5 Pipeline)
 * - Member 4: Ruth Dmello   (Simulation UI, Avalanche Visualizer, Output Analysis, Quiz)
 * ============================================================================
 */

/* ============================================================================
   MEMBER 1: PREPROCESSING, PADDING & 512-BIT BLOCK PARSING (Nicole Dabre)
   ============================================================================ */

function preprocess(message) {
  const bytes = [];

  // Step 1.1: Convert Unicode string to UTF-8 byte array
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

  // Step 1.2: Append single '1' bit (0x80 byte)
  bytes.push(0x80);

  // Step 1.3: Append '0' bits until length = 448 mod 512 (56 bytes mod 64)
  while ((bytes.length % 64) !== 56) {
    bytes.push(0x00);
  }

  // Step 1.4: Append original bit length as a 64-bit little-endian integer
  const lowBits = (originalBitLength & 0xffffffff) >>> 0;
  const highBits = Math.floor(originalBitLength / 0x100000000) >>> 0;

  for (let i = 0; i < 4; i++) {
    bytes.push((lowBits >>> (i * 8)) & 0xff);
  }
  for (let i = 0; i < 4; i++) {
    bytes.push((highBits >>> (i * 8)) & 0xff);
  }

  // Step 1.5: Partition padded byte stream into 512-bit (64-byte) blocks
  const blocks = [];
  for (let blockStart = 0; blockStart < bytes.length; blockStart += 64) {
    const words = [];
    for (let i = 0; i < 64; i += 4) {
      const word = (
        bytes[blockStart + i] |
        (bytes[blockStart + i + 1] << 8) |
        (bytes[blockStart + i + 2] << 16) |
        (bytes[blockStart + i + 3] << 24)
      ) >>> 0;
      words.push(word);
    }
    blocks.push(words);
  }

  return {
    blocks: blocks,
    rawByteCount: message.length,
    utf8ByteCount: originalBitLength / 8,
    origBitLength: originalBitLength,
    paddedByteCount: bytes.length,
    paddedBitLength: bytes.length * 8,
    totalBlocks: blocks.length
  };
}

/* ============================================================================
   MEMBER 2: MD5 CONSTANTS, ROTATION & AUXILIARY FUNCTIONS (Alciya Dodti)
   ============================================================================ */

const S = [
  7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, // Round 1
  5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20, // Round 2
  4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, // Round 3
  6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21  // Round 4
];

const K = [
  0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee,
  0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
  0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be,
  0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
  0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa,
  0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
  0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed,
  0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
  0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c,
  0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
  0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05,
  0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
  0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039,
  0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
  0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1,
  0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391
];

function F(B, C, D) {
  return ((B & C) | (~B & D)) >>> 0;
}

function G(B, C, D) {
  return ((B & D) | (C & ~D)) >>> 0;
}

function H(B, C, D) {
  return (B ^ C ^ D) >>> 0;
}

function I(B, C, D) {
  return (C ^ (B | ~D)) >>> 0;
}

function leftRotate(x, s) {
  return ((x << s) | (x >>> (32 - s))) >>> 0;
}

/* ============================================================================
   MEMBER 3: 64-ROUND COMPRESSION & HEX CONVERSION (Larissa Dabreo)
   ============================================================================ */

const INIT_STATE = {
  A: 0x67452301,
  B: 0xefcdab89,
  C: 0x98badcfe,
  D: 0x10325476
};

function processBlock(block, state) {
  let a = state.A;
  let b = state.B;
  let c = state.C;
  let d = state.D;

  for (let i = 0; i < 64; i++) {
    let auxFunc;
    let g;

    if (i < 16) {
      auxFunc = F(b, c, d);
      g = i;
    } else if (i < 32) {
      auxFunc = G(b, c, d);
      g = (5 * i + 1) % 16;
    } else if (i < 48) {
      auxFunc = H(b, c, d);
      g = (3 * i + 5) % 16;
    } else {
      auxFunc = I(b, c, d);
      g = (7 * i) % 16;
    }

    const temp = d;
    d = c;
    c = b;

    const sum = (auxFunc + a + K[i] + block[g]) >>> 0;
    b = (b + leftRotate(sum, S[i])) >>> 0;
    a = temp;
  }

  return {
    A: (state.A + a) >>> 0,
    B: (state.B + b) >>> 0,
    C: (state.C + c) >>> 0,
    D: (state.D + d) >>> 0
  };
}

function wordToHexLE(word) {
  let hex = '';
  for (let i = 0; i < 4; i++) {
    hex += ((word >>> (i * 8)) & 0xff).toString(16).padStart(2, '0');
  }
  return hex;
}

function formatHex(state) {
  return (
    wordToHexLE(state.A) +
    wordToHexLE(state.B) +
    wordToHexLE(state.C) +
    wordToHexLE(state.D)
  );
}

function md5(message) {
  const prep = preprocess(message);
  let state = {
    A: INIT_STATE.A,
    B: INIT_STATE.B,
    C: INIT_STATE.C,
    D: INIT_STATE.D
  };

  for (const block of prep.blocks) {
    state = processBlock(block, state);
  }

  return formatHex(state);
}

function md5Detailed(message) {
  const prep = preprocess(message);
  let state = {
    A: INIT_STATE.A,
    B: INIT_STATE.B,
    C: INIT_STATE.C,
    D: INIT_STATE.D
  };

  for (const block of prep.blocks) {
    state = processBlock(block, state);
  }

  const digest = formatHex(state);

  return {
    digest: digest,
    prep: prep,
    finalState: state,
    initialState: INIT_STATE
  };
}

window.md5 = md5;
window.md5Detailed = md5Detailed;
window.preprocess = preprocess;

/* ============================================================================
   MEMBER 4: SIMULATION UI, AVALANCHE VISUALIZER & QUIZ (Ruth Dmello)
   ============================================================================ */

function hexToBinary128(hexStr) {
  let binStr = '';
  for (let i = 0; i < hexStr.length; i++) {
    const nibble = parseInt(hexStr[i], 16);
    binStr += nibble.toString(2).padStart(4, '0');
  }
  return binStr;
}

function analyzeAvalanche(msg1, msg2) {
  const hash1 = md5(msg1);
  const hash2 = md5(msg2);

  const bin1 = hexToBinary128(hash1);
  const bin2 = hexToBinary128(hash2);

  let flippedBits = 0;
  const bitComparison = [];

  for (let i = 0; i < 128; i++) {
    const isFlipped = bin1[i] !== bin2[i];
    if (isFlipped) flippedBits++;
    bitComparison.push({
      bitIndex: i,
      registerIndex: Math.floor(i / 32),
      bit1: bin1[i],
      bit2: bin2[i],
      isFlipped: isFlipped
    });
  }

  let hexFlipped = 0;
  for (let i = 0; i < 32; i++) {
    if (hash1[i] !== hash2[i]) {
      hexFlipped++;
    }
  }

  const percentage = ((flippedBits / 128) * 100).toFixed(2);

  let status = 'Moderate Diffusion';
  if (percentage >= 40 && percentage <= 60) {
    status = 'Ideal Avalanche Diffusion (Near 50%)';
  } else if (percentage > 60) {
    status = 'High Diffusion (> 60%)';
  } else {
    status = 'Low Diffusion (< 40%)';
  }

  return {
    msg1,
    msg2,
    hash1,
    hash2,
    bin1,
    bin2,
    flippedBits,
    totalBits: 128,
    percentage,
    hexFlipped,
    status,
    bitComparison
  };
}

window.analyzeAvalanche = analyzeAvalanche;

document.addEventListener('DOMContentLoaded', () => {

  const generationHistory = [];

  // 1. Navigation & Resize Handling
  const sections = document.querySelectorAll('.lab-section');
  const tabButtons = document.querySelectorAll('.lab-tab-btn');

  let lastReportedHeight = 0;
  function reportHeight() {
    try {
      const activeEl = document.getElementById('simulation') || document.querySelector('.lab-section:not(.tab-hidden)') || document.querySelector('.lab-experiment-container') || document.body;
      if (!activeEl) return;
      const h = Math.ceil(Math.max(activeEl.scrollHeight || 0, activeEl.offsetHeight || 0, activeEl.getBoundingClientRect().height || 0)) + 32;
      if (Math.abs(h - lastReportedHeight) > 6) {
        lastReportedHeight = h;
        window.parent?.postMessage({ type: 'RESIZE_IFRAME', height: h }, '*');
      }
    } catch (_) {}
  }

  if (typeof ResizeObserver !== 'undefined') {
    try {
      const ro = new ResizeObserver(() => reportHeight());
      const simSection = document.getElementById('simulation') || document.querySelector('.lab-experiment-container');
      if (simSection) ro.observe(simSection);
    } catch (_) {}
  }

  function switchTab(rawTargetId) {
    const targetId = (rawTargetId === 'assessment' ? 'quiz' : rawTargetId === 'aim' ? 'objective' : rawTargetId) || 'objective';
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

  const urlParams = new URLSearchParams(window.location.search);
  const isSimMode = urlParams.get('mode') === 'sim';
  const initialHash = window.location.hash.replace(/^#/, '');
  const initialTab = urlParams.get('tab') || initialHash;

  if (isSimMode || initialTab === 'simulation' || initialTab === 'sim') {
    document.body.classList.add('mode-sim');
    switchTab('simulation');
    const header = document.querySelector('.lab-header-card');
    if (header) header.style.display = 'none';
    const container = document.querySelector('.lab-experiment-container');
    if (container) container.style.padding = '12px 16px 36px';
  } else if (initialTab) {
    switchTab(initialTab);
  }

  // 2. Simulation UI Elements
  const md5Input = document.getElementById('md5Input');
  const enableSaltToggle = document.getElementById('enableSaltToggle');
  const saltBadgeToken = document.getElementById('saltBadgeToken');
  const generateHashBtn = document.getElementById('generateHash');
  const clearInputBtn = document.getElementById('clearInput');
  const hashOutput = document.getElementById('hashOutput');
  const hashLength = document.getElementById('hashLength');
  const copyHashBtn = document.getElementById('copyHashBtn');

  // Diagnostics
  const statCharCount = document.getElementById('statCharCount');
  const statOrigBits = document.getElementById('statOrigBits');
  const statPaddedBytes = document.getElementById('statPaddedBytes');
  const statBlockCount = document.getElementById('statBlockCount');
  const statPureHash = document.getElementById('statPureHash');
  const statSaltUsed = document.getElementById('statSaltUsed');
  const regA = document.getElementById('regA');
  const regB = document.getElementById('regB');
  const regC = document.getElementById('regC');
  const regD = document.getElementById('regD');
  const regHexLE = document.getElementById('regHexLE');

  // Avalanche
  const avalancheHistoryBanner = document.getElementById('avalancheHistoryBanner');
  const avMsg1 = document.getElementById('avMsg1');
  const avMsg2 = document.getElementById('avMsg2');
  const btnRunAvalanche = document.getElementById('btnRunAvalanche');
  const btnToggleChar = document.getElementById('btnToggleChar');
  const avHash1 = document.getElementById('avHash1');
  const avHash2 = document.getElementById('avHash2');
  const avFlippedCount = document.getElementById('avFlippedCount');
  const avPercent = document.getElementById('avPercent');
  const avHexFlipped = document.getElementById('avHexFlipped');
  const avStatus = document.getElementById('avStatus');
  const bitMatrixContainer = document.getElementById('bitMatrixContainer');

  function generateRandomNonce() {
    const randNum = Math.floor(Math.random() * 0xffffffff);
    return '0x' + randNum.toString(16).padStart(8, '0');
  }

  function updateAvalancheDisplay(m1, m2) {
    if (!bitMatrixContainer) return;

    const res = analyzeAvalanche(m1, m2);

    if (avMsg1) avMsg1.value = m1;
    if (avMsg2) avMsg2.value = m2;

    if (avHash1) avHash1.textContent = res.hash1;
    if (avHash2) avHash2.textContent = res.hash2;
    if (avFlippedCount) avFlippedCount.textContent = res.flippedBits + ' / 128';
    if (avPercent) avPercent.textContent = res.percentage + '%';
    if (avHexFlipped) avHexFlipped.textContent = res.hexFlipped + ' / 32';
    if (avStatus) avStatus.textContent = res.status;

    // Render 128-bit visual heatmap matrix
    bitMatrixContainer.innerHTML = '';
    const registerNames = ['Register A', 'Register B', 'Register C', 'Register D'];

    res.bitComparison.forEach((item) => {
      const cell = document.createElement('div');
      cell.className = 'bit-cell ' + (item.isFlipped ? 'bit-flipped' : 'bit-same');
      cell.textContent = item.isFlipped ? '1' : '0';
      cell.title =
        'Bit #' + item.bitIndex + ' (' + registerNames[item.registerIndex] + ')\n' +
        'Msg1 bit: ' + item.bit1 + '\n' +
        'Msg2 bit: ' + item.bit2 + '\n' +
        (item.isFlipped ? 'STATUS: FLIPPED (Changed via Avalanche)' : 'STATUS: UNCHANGED');

      bitMatrixContainer.appendChild(cell);
    });

    reportHeight();
  }

  function syncAvalancheWithHistory() {
    if (generationHistory.length >= 2) {
      const prevEntry = generationHistory[generationHistory.length - 2];
      const currEntry = generationHistory[generationHistory.length - 1];

      if (avalancheHistoryBanner) {
        avalancheHistoryBanner.innerHTML =
          '<strong>Dynamic Avalanche Active:</strong> Comparing <em>Recent Run #' + prevEntry.runNumber +
          '</em> (<code>"' + (prevEntry.rawInput || '(empty)') + '"</code>) &longleftrightarrow; <em>Recent Run #' + currEntry.runNumber +
          '</em> (<code>"' + (currEntry.rawInput || '(empty)') + '"</code>)';
      }

      updateAvalancheDisplay(prevEntry.effectiveInput, currEntry.effectiveInput);
    } else if (generationHistory.length === 1) {
      const single = generationHistory[0];
      const modifiedVariant = single.effectiveInput ? (single.effectiveInput + '!') : 'a';

      if (avalancheHistoryBanner) {
        avalancheHistoryBanner.innerHTML =
          '<strong>Run #1 Recorded:</strong> <code>"' + (single.rawInput || '(empty)') +
          '"</code>. Comparing against modified preview variant <code>"' + modifiedVariant +
          '"</code>. <em>(Enter your next message above and click Generate to see your consecutive inputs compared!)</em>';
      }

      updateAvalancheDisplay(single.effectiveInput, modifiedVariant);
    } else {
      if (avalancheHistoryBanner) {
        avalancheHistoryBanner.innerHTML =
          '<strong>Ready for Input:</strong> Type a message above and click <em>Generate MD5 Hash</em> to record runs and see live Avalanche comparison.';
      }
      updateAvalancheDisplay('Cryptography', 'Cryptography!');
    }
  }

  function runSimulation() {
    if (!md5Input || !hashOutput) return;

    const rawMessage = md5Input.value;
    const useSalt = enableSaltToggle ? enableSaltToggle.checked : true;

    let saltToken = '';
    let effectiveMessage = rawMessage;

    if (useSalt) {
      saltToken = generateRandomNonce();
      effectiveMessage = rawMessage + ':' + saltToken;
      if (saltBadgeToken) {
        saltBadgeToken.textContent = 'Nonce / Salt Token: ' + saltToken;
        saltBadgeToken.style.display = 'inline-block';
      }
    } else {
      if (saltBadgeToken) {
        saltBadgeToken.textContent = 'Unsalted (Deterministic)';
        saltBadgeToken.style.display = 'inline-block';
      }
    }

    const details = md5Detailed(effectiveMessage);
    const pureDigest = md5(rawMessage);

    hashOutput.textContent = details.digest;
    if (hashLength) hashLength.textContent = details.digest.length;

    if (statCharCount) statCharCount.textContent = details.prep.rawByteCount + ' characters';
    if (statOrigBits) statOrigBits.textContent = details.prep.origBitLength + ' bits';
    if (statPaddedBytes) statPaddedBytes.textContent = details.prep.paddedByteCount + ' bytes (' + details.prep.paddedBitLength + ' bits)';
    if (statBlockCount) statBlockCount.textContent = details.prep.totalBlocks + ' block(s)';
    if (statPureHash) statPureHash.textContent = pureDigest;
    if (statSaltUsed) statSaltUsed.textContent = useSalt ? saltToken : 'None (Raw Message Only)';

    if (regA) regA.textContent = '0x' + details.finalState.A.toString(16).padStart(8, '0') + ' (' + details.finalState.A + ')';
    if (regB) regB.textContent = '0x' + details.finalState.B.toString(16).padStart(8, '0') + ' (' + details.finalState.B + ')';
    if (regC) regC.textContent = '0x' + details.finalState.C.toString(16).padStart(8, '0') + ' (' + details.finalState.C + ')';
    if (regD) regD.textContent = '0x' + details.finalState.D.toString(16).padStart(8, '0') + ' (' + details.finalState.D + ')';

    if (regHexLE) {
      regHexLE.textContent =
        wordToHexLE(details.finalState.A) + ' ' +
        wordToHexLE(details.finalState.B) + ' ' +
        wordToHexLE(details.finalState.C) + ' ' +
        wordToHexLE(details.finalState.D);
    }

    generationHistory.push({
      runNumber: generationHistory.length + 1,
      rawInput: rawMessage,
      effectiveInput: effectiveMessage,
      digest: details.digest,
      salt: saltToken,
      timestamp: new Date().toLocaleTimeString()
    });

    syncAvalancheWithHistory();
    reportHeight();
  }

  if (generateHashBtn) {
    generateHashBtn.addEventListener('click', runSimulation);
  }

  if (clearInputBtn) {
    clearInputBtn.addEventListener('click', () => {
      if (md5Input) md5Input.value = '';
      if (hashOutput) hashOutput.textContent = 'Your MD5 hash will appear here.';
      if (hashLength) hashLength.textContent = '0';
      if (statCharCount) statCharCount.textContent = '0';
      if (statOrigBits) statOrigBits.textContent = '0 bits';
      if (statPaddedBytes) statPaddedBytes.textContent = '0 bytes';
      if (statBlockCount) statBlockCount.textContent = '0';
      if (statPureHash) statPureHash.textContent = '—';
      if (statSaltUsed) statSaltUsed.textContent = '—';
      if (regA) regA.textContent = '—';
      if (regB) regB.textContent = '—';
      if (regC) regC.textContent = '—';
      if (regD) regD.textContent = '—';
      if (regHexLE) regHexLE.textContent = '—';
      if (saltBadgeToken) saltBadgeToken.textContent = 'Ready';
      reportHeight();
    });
  }

  if (copyHashBtn) {
    copyHashBtn.addEventListener('click', () => {
      if (!hashOutput) return;
      const text = hashOutput.textContent.trim();
      if (text && text !== 'Your MD5 hash will appear here.') {
        navigator.clipboard.writeText(text).then(() => {
          const originalText = copyHashBtn.textContent;
          copyHashBtn.textContent = 'Copied!';
          setTimeout(() => {
            copyHashBtn.textContent = originalText;
          }, 1500);
        });
      }
    });
  }

  // Preset sample buttons
  const presetButtons = document.querySelectorAll('.preset-btn[data-sample]');
  presetButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (md5Input) {
        md5Input.value = btn.dataset.sample;
        runSimulation();
      }
    });
  });

  // Manual Avalanche controls
  if (btnRunAvalanche) {
    btnRunAvalanche.addEventListener('click', () => {
      const m1 = avMsg1 ? avMsg1.value : 'Cryptography';
      const m2 = avMsg2 ? avMsg2.value : 'Cryptography!';
      if (avalancheHistoryBanner) {
        avalancheHistoryBanner.innerHTML =
          '<strong>Custom Avalanche Test:</strong> Comparing <code>"' + m1 +
          '"</code> &longleftrightarrow; <code>"' + m2 + '"</code>';
      }
      updateAvalancheDisplay(m1, m2);
    });
  }

  if (btnToggleChar) {
    btnToggleChar.addEventListener('click', () => {
      if (!avMsg1 || !avMsg2) return;
      const current = avMsg1.value || 'Cryptography';
      avMsg1.value = current;
      if (current.endsWith('!')) {
        avMsg2.value = current.slice(0, -1) + '?';
      } else if (current.endsWith('1')) {
        avMsg2.value = current.slice(0, -1) + '2';
      } else {
        avMsg2.value = current + '!';
      }
      const m1 = avMsg1.value;
      const m2 = avMsg2.value;
      if (avalancheHistoryBanner) {
        avalancheHistoryBanner.innerHTML =
          '<strong>Single Character Modification:</strong> Comparing <code>"' + m1 +
          '"</code> &longleftrightarrow; <code>"' + m2 + '"</code>';
      }
      updateAvalancheDisplay(m1, m2);
    });
  }

  // Initial sync & default run
  if (md5Input && !md5Input.value) {
    md5Input.value = 'Cryptography Virtual Lab 2026';
  }
  runSimulation();

  // -------------------------------------------------------------
  // 3. Quiz Evaluation (10 MD5 Questions)
  // -------------------------------------------------------------
  const submitQuizBtn = document.getElementById('submitQuiz');
  const retryQuizBtn = document.getElementById('retryQuiz');
  const quizScoreBanner = document.getElementById('quizScoreBanner');

  const quizKey = {
    q1: '128',
    q2: '80',
    q3: '512',
    q4: '64',
    q5: 'avalanche',
    q6: 'func_f',
    q7: 'sine',
    q8: '64bit_le',
    q9: 'little_endian',
    q10: 'collision'
  };

  if (submitQuizBtn) {
    submitQuizBtn.addEventListener('click', () => {
      let score = 0;
      const total = 10;

      for (let i = 1; i <= total; i++) {
        const qName = 'q' + i;
        const correctVal = quizKey[qName];
        const selected = document.querySelector('input[name="' + qName + '"]:checked');
        const card = document.getElementById('card_' + qName);
        const expBox = document.getElementById('exp_' + qName);

        if (card) {
          card.classList.remove('correct-card', 'wrong-card');
        }
        if (expBox) {
          expBox.classList.remove('show', 'exp-correct', 'exp-wrong');
        }

        if (selected && selected.value === correctVal) {
          score++;
          if (card) card.classList.add('correct-card');
          if (expBox) expBox.classList.add('show', 'exp-correct');
        } else {
          if (card) card.classList.add('wrong-card');
          if (expBox) expBox.classList.add('show', 'exp-wrong');
        }
      }

      if (quizScoreBanner) {
        const percent = Math.round((score / total) * 100);
        let message = '';
        if (percent === 100) {
          message = '🌟 Perfect Score! Excellent mastery of the MD5 Algorithm!';
        } else if (percent >= 70) {
          message = '👍 Well done! Strong understanding of MD5 hashing principles.';
        } else {
          message = '💡 Good attempt! Review the theory and procedure tabs to strengthen key concepts.';
        }

        quizScoreBanner.textContent = 'Your Score: ' + score + ' / ' + total + ' (' + percent + '%) — ' + message;
        quizScoreBanner.classList.add('show');
        quizScoreBanner.style.display = 'block';
      }

      if (retryQuizBtn) {
        retryQuizBtn.style.display = 'inline-block';
      }
      reportHeight();
    });
  }

  if (retryQuizBtn) {
    retryQuizBtn.addEventListener('click', () => {
      const allRadios = document.querySelectorAll('.quiz-wrapper input[type="radio"]');
      allRadios.forEach((radio) => {
        radio.checked = false;
      });

      for (let i = 1; i <= 10; i++) {
        const qName = 'q' + i;
        const card = document.getElementById('card_' + qName);
        const expBox = document.getElementById('exp_' + qName);
        if (card) card.classList.remove('correct-card', 'wrong-card');
        if (expBox) expBox.classList.remove('show', 'exp-correct', 'exp-wrong');
      }

      if (quizScoreBanner) {
        quizScoreBanner.classList.remove('show');
        quizScoreBanner.textContent = '';
        quizScoreBanner.style.display = 'none';
      }

      retryQuizBtn.style.display = 'none';
      reportHeight();
    });
  }

  setTimeout(reportHeight, 150);

});
