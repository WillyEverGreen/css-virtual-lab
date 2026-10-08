/**
 * ============================================================================
 * Fr. Conceicao Rodrigues College of Engineering (Fr. CRCE)
 * Cryptography Virtual Laboratory - Experiment 01: MD5 Hash Algorithm
 * ============================================================================
 * Collaborative Implementation by Group A:
 * - Member 1: Nicole Dabre  (Preprocessing, UTF-8 Encoding, 512-bit Padding)
 * - Member 2: Alciya Dodti  (Constants K, Shift S, Auxiliary Functions F,G,H,I)
 * - Member 3: Larissa Dabreo (Registers A,B,C,D, 64-Step Compression, formatHex)
 * - Member 4: Ruth Dmello   (Simulation UI, Dynamic Salt, Avalanche Visualizer, Quiz)
 * ============================================================================
 */

/* ============================================================================
   MEMBER 1: PREPROCESSING, PADDING & 512-BIT BLOCK PARSING (Nicole Dabre)
   ============================================================================ */

function preprocess(message) {
  const bytes = [];

  // Convert string to UTF-8 bytes
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

  // Append single '1' bit (0x80 byte)
  bytes.push(0x80);

  // Append '0' bits until length = 448 mod 512 (56 bytes mod 64)
  while ((bytes.length % 64) !== 56) {
    bytes.push(0x00);
  }

  // Append 64-bit original length in little-endian format
  const lowBits = (originalBitLength & 0xffffffff) >>> 0;
  const highBits = Math.floor(originalBitLength / 0x100000000) >>> 0;

  for (let i = 0; i < 4; i++) {
    bytes.push((lowBits >>> (i * 8)) & 0xff);
  }
  for (let i = 0; i < 4; i++) {
    bytes.push((highBits >>> (i * 8)) & 0xff);
  }

  // Partition into 512-bit (16 x 32-bit little-endian words) blocks
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
    rawLength: message.length,
    utf8ByteLength: originalBitLength / 8,
    origBitLength: originalBitLength,
    paddedByteLength: bytes.length,
    paddedBitLength: bytes.length * 8,
    blockCount: blocks.length
  };
}

/* ============================================================================
   MEMBER 2: CONSTANTS, SHIFT AMOUNTS & AUXILIARY FUNCTIONS (Alciya Dodti)
   ============================================================================ */

// Left rotation shift amounts for 64 operations
const S = [
  7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, // Round 1
  5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20, // Round 2
  4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, // Round 3
  6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21  // Round 4
];

// Constants K[0..63] where K[i] = floor(2^32 * abs(sin(i + 1)))
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

// Round 1 auxiliary function: F(B,C,D) = (B & C) | (~B & D)
function F(B, C, D) {
  return ((B & C) | (~B & D)) >>> 0;
}

// Round 2 auxiliary function: G(B,C,D) = (B & D) | (C & ~D)
function G(B, C, D) {
  return ((B & D) | (C & ~D)) >>> 0;
}

// Round 3 auxiliary function: H(B,C,D) = B ^ C ^ D
function H(B, C, D) {
  return (B ^ C ^ D) >>> 0;
}

// Round 4 auxiliary function: I(B,C,D) = C ^ (B | ~D)
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

function processBlockWithSteps(block, state) {
  let a = state.A;
  let b = state.B;
  let c = state.C;
  let d = state.D;
  const roundSteps = [];

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

    if (i === 15) {
      roundSteps.push({ round: 'Round 1 (F logic • Steps 0-15)', A: wordToHexLE(a), B: wordToHexLE(b), C: wordToHexLE(c), D: wordToHexLE(d) });
    } else if (i === 31) {
      roundSteps.push({ round: 'Round 2 (G logic • Steps 16-31)', A: wordToHexLE(a), B: wordToHexLE(b), C: wordToHexLE(c), D: wordToHexLE(d) });
    } else if (i === 47) {
      roundSteps.push({ round: 'Round 3 (H logic • Steps 32-47)', A: wordToHexLE(a), B: wordToHexLE(b), C: wordToHexLE(c), D: wordToHexLE(d) });
    } else if (i === 63) {
      roundSteps.push({ round: 'Round 4 (I logic • Steps 48-63)', A: wordToHexLE(a), B: wordToHexLE(b), C: wordToHexLE(c), D: wordToHexLE(d) });
    }
  }

  // Merkle-Damgard feed-forward addition
  return {
    newState: {
      A: (state.A + a) >>> 0,
      B: (state.B + b) >>> 0,
      C: (state.C + c) >>> 0,
      D: (state.D + d) >>> 0
    },
    roundSteps: roundSteps
  };
}

function processBlock(block, state) {
  return processBlockWithSteps(block, state).newState;
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
  let state = { ...INIT_STATE };

  for (const block of prep.blocks) {
    state = processBlock(block, state);
  }

  return formatHex(state);
}

function md5Detailed(message) {
  const prep = preprocess(message);
  let state = { ...INIT_STATE };
  let allRoundSteps = [];

  for (const block of prep.blocks) {
    const res = processBlockWithSteps(block, state);
    state = res.newState;
    allRoundSteps = res.roundSteps;
  }

  return {
    digest: formatHex(state),
    prep: prep,
    finalState: state,
    roundSteps: allRoundSteps,
    initialState: INIT_STATE
  };
}

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

function calculateAvalanche(msg1, msg2) {
  const hash1 = md5(msg1);
  const hash2 = md5(msg2);
  const bin1 = hexToBinary128(hash1);
  const bin2 = hexToBinary128(hash2);

  let flippedCount = 0;
  const bitComparison = [];

  for (let i = 0; i < 128; i++) {
    const isFlipped = bin1[i] !== bin2[i];
    if (isFlipped) flippedCount++;
    bitComparison.push({
      index: i,
      b1: bin1[i],
      b2: bin2[i],
      flipped: isFlipped
    });
  }

  const percentage = ((flippedCount / 128) * 100).toFixed(2);

  return {
    hash1,
    hash2,
    flippedCount,
    percentage,
    bitComparison
  };
}

// Attach event listeners after DOM load
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

  // 2. MD5 Live Simulation Subtab Switching
  const subTabDigest = document.getElementById('md5SubTabDigest');
  const subTabPadding = document.getElementById('md5SubTabPadding');
  const subTabRounds = document.getElementById('md5SubTabRounds');
  const panelDigest = document.getElementById('md5PanelDigest');
  const panelPadding = document.getElementById('md5PanelPadding');
  const panelRounds = document.getElementById('md5PanelRounds');

  function setSubTab(activeTab, activePanel) {
    [subTabDigest, subTabPadding, subTabRounds].forEach((btn) => {
      if (btn) {
        btn.style.background = '#faf9f6';
        btn.style.color = '#18181b';
      }
    });
    [panelDigest, panelPadding, panelRounds].forEach((p) => {
      if (p) p.style.display = 'none';
    });

    if (activeTab) {
      activeTab.style.background = '#18181b';
      activeTab.style.color = '#fff';
    }
    if (activePanel) {
      activePanel.style.display = 'block';
    }
    reportHeight();
  }

  if (subTabDigest) subTabDigest.addEventListener('click', () => setSubTab(subTabDigest, panelDigest));
  if (subTabPadding) subTabPadding.addEventListener('click', () => setSubTab(subTabPadding, panelPadding));
  if (subTabRounds) subTabRounds.addEventListener('click', () => setSubTab(subTabRounds, panelRounds));

  // Simulation Controls & Output Elements
  const md5Input = document.getElementById('md5Input');
  const btnGenerate = document.getElementById('btnGenerate');
  const btnClear = document.getElementById('btnClear');
  const digestDisplay = document.getElementById('digestDisplay');
  const btnCopyDigest = document.getElementById('btnCopyDigest');
  const saltToggle = document.getElementById('saltToggle');
  const saltInput = document.getElementById('saltInput');

  // Stats
  const statChars = document.getElementById('statChars');
  const statBytes = document.getElementById('statBytes');
  const statBits = document.getElementById('statBits');
  const statBlocks = document.getElementById('statBlocks');
  const regA = document.getElementById('regA');
  const regB = document.getElementById('regB');
  const regC = document.getElementById('regC');
  const regD = document.getElementById('regD');
  const paddingTerminal = document.getElementById('md5PaddingTerminal');
  const padSegments = document.getElementById('md5PadSegments');
  const roundsTbody = document.getElementById('md5RoundsTbody');

  function updateSimulation() {
    let rawText = md5Input ? md5Input.value : '';
    if (saltToggle && saltToggle.checked && saltInput && saltInput.value) {
      rawText = saltInput.value + rawText;
    }

    const result = md5Detailed(rawText);

    if (digestDisplay) digestDisplay.textContent = result.digest;
    if (statChars) statChars.textContent = md5Input ? md5Input.value.length : 0;
    if (statBytes) statBytes.textContent = result.prep.utf8ByteLength;
    if (statBits) statBits.textContent = result.prep.origBitLength;
    if (statBlocks) statBlocks.textContent = result.prep.blockCount;

    if (regA) regA.textContent = '0x' + result.finalState.A.toString(16).padStart(8, '0');
    if (regB) regB.textContent = '0x' + result.finalState.B.toString(16).padStart(8, '0');
    if (regC) regC.textContent = '0x' + result.finalState.C.toString(16).padStart(8, '0');
    if (regD) regD.textContent = '0x' + result.finalState.D.toString(16).padStart(8, '0');

    // RFC 1321 Padding Terminal Output
    if (paddingTerminal) {
      const padBitsMod = (result.prep.origBitLength + 8) % 512;
      const zeroBitsNeeded = (448 - padBitsMod + 512) % 512;
      paddingTerminal.textContent =
        'RFC 1321 Padding Pipeline:\n' +
        '1. Original Payload : ' + (md5Input ? md5Input.value.length : 0) + ' chars (' + result.prep.utf8ByteLength + ' bytes, ' + result.prep.origBitLength + ' bits)\n' +
        '2. Padding Delimiter: 1 byte (0x80 = 10000000b)\n' +
        '3. Zero-Padding     : ' + zeroBitsNeeded + ' zero bits (' + Math.floor(zeroBitsNeeded / 8) + ' bytes) -> Total 448 (mod 512)\n' +
        '4. Message Length   : 64-bit integer = ' + result.prep.origBitLength + ' bits (appended little-endian)\n' +
        '5. Padded Block Count: ' + result.prep.blockCount + ' x 512-bit block(s) (' + (result.prep.blockCount * 64) + ' bytes total)';
    }

    // Block Segments Visualizer
    if (padSegments) {
      const padModBytes = (result.prep.utf8ByteLength + 1) % 64;
      const zBytes = (56 - padModBytes + 64) % 64;
      padSegments.innerHTML =
        '<span style="padding: 4px 10px; background: #3b82f6; color: #fff; border-radius: 6px; font-size: 12px; font-weight: 700;">Data: ' + result.prep.utf8ByteLength + 'B</span>' +
        '<span style="padding: 4px 10px; background: #10b981; color: #fff; border-radius: 6px; font-size: 12px; font-weight: 700;">0x80: 1B</span>' +
        '<span style="padding: 4px 10px; background: #6b7280; color: #fff; border-radius: 6px; font-size: 12px; font-weight: 700;">0x00: ' + zBytes + 'B</span>' +
        '<span style="padding: 4px 10px; background: #f59e0b; color: #18181b; border-radius: 6px; font-size: 12px; font-weight: 700;">Len: 8B (64-bit LE)</span>';
    }

    // Intermediate Round States Table
    if (roundsTbody) {
      let rHtml = '';
      result.roundSteps.forEach((step) => {
        rHtml += '<tr>' +
          '<td style="padding: 8px 12px; font-weight: 700;">' + step.round + '</td>' +
          '<td style="padding: 8px 12px; color: #3b82f6;">0x' + step.A + '</td>' +
          '<td style="padding: 8px 12px; color: #10b981;">0x' + step.B + '</td>' +
          '<td style="padding: 8px 12px; color: #f59e0b;">0x' + step.C + '</td>' +
          '<td style="padding: 8px 12px; color: #ef4444;">0x' + step.D + '</td>' +
          '</tr>';
      });
      roundsTbody.innerHTML = rHtml;
    }

    reportHeight();
  }

  // STRICTLY on button click
  if (btnGenerate) {
    btnGenerate.addEventListener('click', updateSimulation);
  }

  if (btnClear && md5Input) {
    btnClear.addEventListener('click', () => {
      md5Input.value = '';
      if (digestDisplay) digestDisplay.textContent = '[Click \'⚡ Generate MD5 Hash\' to calculate]';
      if (statChars) statChars.textContent = '--';
      if (statBytes) statBytes.textContent = '--';
      if (statBits) statBits.textContent = '--';
      if (statBlocks) statBlocks.textContent = '--';
      if (regA) regA.textContent = '--';
      if (regB) regB.textContent = '--';
      if (regC) regC.textContent = '--';
      if (regD) regD.textContent = '--';
      if (paddingTerminal) paddingTerminal.textContent = '[Click \'⚡ Generate MD5 Hash\' to inspect padding]';
      if (padSegments) padSegments.innerHTML = '<span style="padding: 4px 10px; background: #3b82f6; color: #fff; border-radius: 6px; font-size: 12px; font-weight: 700;">Awaiting Calculation</span>';
      if (roundsTbody) roundsTbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px; color: #71717a;">Click \'⚡ Generate MD5 Hash\' to trace round compression states.</td></tr>';
      reportHeight();
    });
  }

  // Presets populate input only without auto-calculating
  const presetButtons = document.querySelectorAll('.sim-preset-btn');
  presetButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const val = btn.getAttribute('data-val');
      if (md5Input) {
        md5Input.value = val !== undefined ? val : '';
      }
    });
  });

  // Copy Digest
  if (btnCopyDigest && digestDisplay) {
    btnCopyDigest.addEventListener('click', () => {
      const text = digestDisplay.textContent || '';
      if (text.includes('Click')) return;
      navigator.clipboard.writeText(text);
      const originalText = btnCopyDigest.textContent;
      btnCopyDigest.textContent = '✓ Copied';
      setTimeout(() => {
        btnCopyDigest.textContent = originalText;
      }, 1800);
    });
  }

  // 3. Avalanche Effect Visualizer
  const avInput1 = document.getElementById('avInput1');
  const avInput2 = document.getElementById('avInput2');
  const btnRunAvalanche = document.getElementById('btnRunAvalanche');
  const btnFlipBit = document.getElementById('btnFlipBit');
  const avHash1 = document.getElementById('avHash1');
  const avHash2 = document.getElementById('avHash2');
  const avFlippedCount = document.getElementById('avFlippedCount');
  const avPercent = document.getElementById('avPercent');
  const avBitGrid = document.getElementById('avBitGrid');

  function updateAvalanche() {
    const text1 = avInput1 ? avInput1.value : '';
    const text2 = avInput2 ? avInput2.value : '';

    const av = calculateAvalanche(text1, text2);

    if (avHash1) avHash1.textContent = av.hash1;
    if (avHash2) avHash2.textContent = av.hash2;
    if (avFlippedCount) avFlippedCount.textContent = av.flippedCount;
    if (avPercent) avPercent.textContent = av.percentage + '%';

    // Render 128-bit diff grid
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
    reportHeight();
  }

  // STRICTLY on button click
  if (btnRunAvalanche) {
    btnRunAvalanche.addEventListener('click', updateAvalanche);
  }

  if (btnFlipBit && avInput1 && avInput2) {
    btnFlipBit.addEventListener('click', () => {
      avInput1.value = 'The quick brown fox jumps over the lazy dog';
      avInput2.value = 'The quick brown fox jumps over the lazy dog.';
    });
  }

  // 4. Assessment Quiz Engine
  const btnSubmitQuiz = document.getElementById('btnSubmitQuiz');
  const quizFeedback = document.querySelectorAll('.quiz-feedback');
  const quizScoreBanner = document.getElementById('quizScoreBanner');
  const quizScoreText = document.getElementById('quizScoreText');
  const btnResetQuiz = document.getElementById('btnResetQuiz');

  const correctAnswers = {
    q1: 1, // 128 bits
    q2: 2, // 0x80
    q3: 1, // 512-bit block and 32-bit word
    q4: 2, // 64 operations
    q5: 2, // ~50% SAC
    q6: 1  // practical collision attacks
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
