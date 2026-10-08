/**
 * ============================================================================
 * Fr. Conceicao Rodrigues College of Engineering (Fr. CRCE)
 * Cryptography Virtual Laboratory - Experiment 05: SSL/TLS Protocol Overview
 * ============================================================================
 * Group E - Collaborative Implementation:
 * - Jace Jaison: ECDHE Key Agreement, Web Crypto AES-GCM, TLS 1.3 State Machine,
 *                Interactive Application Data Channel, Packet Inspector
 * - Ahamed Wafiq: TLS 1.2 vs 1.3 Handshake Sequences, Attack Scenarios (MITM,
 *                 Expired Cert, MAC Tampering), Metrics & Observations Table, Quiz
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. MASTER NAVBAR INTEROPERABILITY & TAB SWITCHING
     ========================================================================== */
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
      window.parent?.postMessage({ type: 'ACTIVE_TAB_CHANGED', target: targetId }, '*');
    } catch (_) {}
    setTimeout(reportHeight, 50);
  }

  window.addEventListener('message', (event) => {
    if (event.data && (event.data.type === 'SET_TAB' || event.data.type === 'SET_ACTIVE_TAB')) {
      switchTab(event.data.target);
    }
  });

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      switchTab(targetId);
    });
  });

  window.addEventListener('resize', reportHeight);
  setTimeout(reportHeight, 150);

  /* ==========================================================================
     2. STATE MANAGEMENT & DOM ELEMENTS
     ========================================================================== */
  const State = {
    stepIndex: 0,
    isPlaying: false,
    speed: 3,
    tlsVersion: '1.3',
    scenario: 'success',
    keyExchange: 'ECDHE',
    clientCrypto: {},
    serverCrypto: {},
    messages: [],
    rttCount: 0,
    autoPlayTimeout: null,
    runId: 0,
    isFailed: false,
    isInitialized: false
  };

  const Elements = {
    tlsVersion: document.getElementById('tlsVersion'),
    scenario: document.getElementById('simScenario'),
    keyExchange: document.getElementById('keyExchange'),
    btnPlay: document.getElementById('btnPlay'),
    btnStepFwd: document.getElementById('btnStepFwd'),
    btnReset: document.getElementById('btnReset'),
    speed: document.getElementById('simSpeed'),
    clientState: document.getElementById('clientState'),
    serverState: document.getElementById('serverState'),
    clientCrypto: document.getElementById('clientCrypto'),
    serverCrypto: document.getElementById('serverCrypto'),
    networkChannel: document.getElementById('networkChannel'),
    messagesContainer: document.getElementById('messagesContainer'),
    svg: document.getElementById('sequenceSvg'),
    inspectorContent: document.getElementById('inspectorContent'),
    explanationText: document.getElementById('explanationText'),
    eventLog: document.getElementById('eventLog'),
    obsTableBody: document.querySelector('#obsTable tbody'),
    rttCount: document.getElementById('rttCount'),
    hsStatusBadge: document.getElementById('hsStatusBadge'),
    conclusionText: document.getElementById('conclusionText'),
    appInput: document.getElementById('appInput'),
    btnSendApp: document.getElementById('btnSendApp'),
    serverOutputBox: document.getElementById('serverOutputBox'),
    btnExportLog: document.getElementById('btnExportLog')
  };

  /* ==========================================================================
     3. REAL CRYPTOGRAPHY ENGINE (Web Crypto API)
     ========================================================================== */
  function buf2hex(buffer) {
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
  }

  function generateRandom() {
    const arr = new Uint8Array(32);
    crypto.getRandomValues(arr);
    return buf2hex(arr);
  }

  async function generateECDHKeyPair() {
    return await crypto.subtle.generateKey(
      { name: "ECDH", namedCurve: "P-256" },
      true,
      ["deriveKey", "deriveBits"]
    );
  }

  async function deriveSharedSecret(privateKey, publicKey) {
    const bits = await crypto.subtle.deriveBits(
      { name: "ECDH", public: publicKey },
      privateKey,
      256
    );
    return buf2hex(bits);
  }

  async function exportPublicKey(key) {
    return await crypto.subtle.exportKey("jwk", key);
  }

  async function encryptData(keyHex, ivHex, plaintext) {
    const keyBytes = new Uint8Array(keyHex.substring(0, 32).match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    const key = await crypto.subtle.importKey(
      "raw", keyBytes,
      { name: "AES-GCM" }, false, ["encrypt"]
    );
    const iv = new Uint8Array(ivHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    const enc = new TextEncoder();
    const cipherBuffer = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv },
      key,
      enc.encode(plaintext)
    );
    return buf2hex(cipherBuffer);
  }

  async function decryptData(keyHex, ivHex, ciphertextHex) {
    const keyBytes = new Uint8Array(keyHex.substring(0, 32).match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    const key = await crypto.subtle.importKey(
      "raw", keyBytes,
      { name: "AES-GCM" }, false, ["decrypt"]
    );
    const iv = new Uint8Array(ivHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    const cipherData = new Uint8Array(ciphertextHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    
    try {
      const plainBuffer = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: iv },
        key,
        cipherData
      );
      const dec = new TextDecoder();
      return dec.decode(plainBuffer);
    } catch (e) {
      return null;
    }
  }

  /* ==========================================================================
     4. PROTOCOL STATE MACHINE SEQUENCES
     ========================================================================== */
  let simSequence = [];

  async function initializeCryptoState() {
    State.clientCrypto = {
      random: generateRandom(),
      keyPair: await generateECDHKeyPair(),
      sharedSecret: null,
      masterSecret: null
    };
    State.serverCrypto = {
      random: generateRandom(),
      keyPair: await generateECDHKeyPair(),
      sharedSecret: null,
      masterSecret: null
    };
  }

  function buildTLS13Sequence() {
    return [
      {
        name: "ClientHello",
        dir: "c2s",
        desc: "Client initiates connection, proposes TLS 1.3, ciphers, and proactively transmits ephemeral public key share (ECDHE P-256).",
        execute: async () => {
          const jwk = await exportPublicKey(State.clientCrypto.keyPair.publicKey);
          Elements.clientState.innerText = "CLIENT_HELLO_SENT";
          return {
            version: "TLS 1.3 (RFC 8446)",
            clientRandom: State.clientCrypto.random,
            supportedCiphers: ["TLS_AES_128_GCM_SHA256", "TLS_AES_256_GCM_SHA384", "TLS_CHACHA20_POLY1305_SHA256"],
            keyShareType: "ECDHE secp256r1",
            clientPublicKeyShare: (jwk.x || '').substring(0, 16) + "..."
          };
        },
        rtt: 0
      },
      {
        name: "ServerHello & KeyShare",
        dir: "s2c",
        desc: "Server negotiates TLS_AES_128_GCM_SHA256, responds with its matching key share, and derives ECDH shared secret.",
        execute: async () => {
          const jwk = await exportPublicKey(State.serverCrypto.keyPair.publicKey);
          State.serverCrypto.sharedSecret = await deriveSharedSecret(
            State.serverCrypto.keyPair.privateKey, 
            State.clientCrypto.keyPair.publicKey
          );
          Elements.serverState.innerText = "KEY_SHARE_COMPUTED";
          return {
            version: "TLS 1.3",
            serverRandom: State.serverCrypto.random,
            cipherSelected: "TLS_AES_128_GCM_SHA256",
            serverPublicKeyShare: (jwk.x || '').substring(0, 16) + "...",
            serverDerivedSecret: State.serverCrypto.sharedSecret.substring(0, 16) + "..."
          };
        },
        rtt: 0.5
      },
      {
        name: "EncryptedExtensions & Certificate",
        dir: "s2c",
        encrypted: true,
        desc: "Server transmits X.509 Certificate and parameters (encrypted in TLS 1.3) to authenticate server identity.",
        execute: async () => {
          if (State.scenario === 'expired') {
            return { error: "X.509 Certificate Expired (SEC_ERROR_EXPIRED_CERTIFICATE)" };
          }
          Elements.serverState.innerText = "CERT_TRANSMITTED";
          return {
            subject: "CN=virtual-crypto-lab.crce.edu",
            issuer: "CN=Fr. CRCE Root Authority CA-G2",
            validity: "Valid (Current Epoch)",
            signatureAlgorithm: "sha256WithRSAEncryption",
            publicKeyType: "RSA 2048 Bits"
          };
        },
        rtt: 0.5
      },
      {
        name: "Server Finished",
        dir: "s2c",
        encrypted: true,
        desc: "Server confirms transcript authentication using HMAC verify_data over all previous handshake messages.",
        execute: async () => {
          Elements.serverState.innerText = "SERVER_FINISHED";
          return {
            status: "Server Handshake Complete",
            verifyData: buf2hex(new Uint8Array([0x3c, 0xa1, 0x94, 0xf8, 0x12, 0xbe, 0x70, 0x55]))
          };
        },
        rtt: 0.5
      },
      {
        name: "Client Finished",
        dir: "c2s",
        encrypted: true,
        desc: "Client derives secret, validates server certificate chain, and sends its Finished authentication confirmation.",
        execute: async () => {
          State.clientCrypto.sharedSecret = await deriveSharedSecret(
            State.clientCrypto.keyPair.privateKey, 
            State.serverCrypto.keyPair.publicKey
          );
          
          if (State.scenario === 'mitm') {
            return { alert: "Fatal Alert: Bad Certificate (MITM Forgery Detected)" };
          }

          if (State.scenario === 'tampered') {
            return { alert: "Fatal Alert: Bad Record MAC (Finished Verification Failed)" };
          }

          Elements.clientState.innerText = "ESTABLISHED";
          Elements.serverState.innerText = "ESTABLISHED";
          return {
            status: "Client Handshake Authenticated",
            computedSecret: State.clientCrypto.sharedSecret.substring(0, 16) + "...",
            verifyData: buf2hex(new Uint8Array([0x8b, 0x47, 0x16, 0x9c, 0xa3, 0x22, 0xd0, 0x14]))
          };
        },
        rtt: 1.0
      }
    ];
  }

  function buildTLS12Sequence() {
    return [
      {
        name: "ClientHello",
        dir: "c2s",
        desc: "Client proposes protocol version 1.2, cipher suite candidates, and 32-byte ClientRandom (2-RTT).",
        execute: async () => {
          Elements.clientState.innerText = "CLIENT_HELLO";
          return {
            version: "TLS 1.2 (RFC 5246)",
            clientRandom: State.clientCrypto.random,
            ciphers: ["TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256", "TLS_RSA_WITH_AES_128_CBC_SHA"]
          };
        },
        rtt: 0
      },
      {
        name: "ServerHello",
        dir: "s2c",
        desc: "Server picks TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256 and supplies 32-byte ServerRandom.",
        execute: async () => {
          Elements.serverState.innerText = "SERVER_HELLO";
          return {
            version: "TLS 1.2",
            serverRandom: State.serverCrypto.random,
            cipher: "TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256"
          };
        },
        rtt: 0.5
      },
      {
        name: "Certificate",
        dir: "s2c",
        desc: "Server presents cleartext X.509 certificate to client for identity verification.",
        execute: async () => {
          if (State.scenario === 'expired') {
            return { error: "X.509 Certificate Expired" };
          }
          return {
            subject: "CN=virtual-crypto-lab.crce.edu",
            issuer: "CN=CRCE CA",
            status: "Cleartext Transmission"
          };
        },
        rtt: 0.5
      },
      {
        name: "ServerKeyExchange",
        dir: "s2c",
        desc: "Server transmits ephemeral ECDHE parameters signed by server's RSA private key.",
        execute: async () => {
          return {
            curve: "secp256r1 (NIST P-256)",
            signatureAlgorithm: "RSA-SHA256",
            signedECDHParams: "Verified"
          };
        },
        rtt: 0.5
      },
      {
        name: "ServerHelloDone",
        dir: "s2c",
        desc: "Server signals conclusion of its initial negotiation flight.",
        execute: async () => ({ status: "First Flight Complete" }),
        rtt: 0.5
      },
      {
        name: "ClientKeyExchange",
        dir: "c2s",
        desc: "Client transmits its ephemeral ECDHE public share and derives Pre-Master Secret.",
        execute: async () => {
          if (State.scenario === 'mitm') {
            return { alert: "Fatal Alert: Bad Certificate (MITM Intercepted)" };
          }
          State.clientCrypto.sharedSecret = await deriveSharedSecret(
            State.clientCrypto.keyPair.privateKey, 
            State.serverCrypto.keyPair.publicKey
          );
          Elements.clientState.innerText = "SECRET_DERIVED";
          return {
            clientECDHShare: "secp256r1 Point",
            secretDerived: true
          };
        },
        rtt: 1.0
      },
      {
        name: "ChangeCipherSpec (Client)",
        dir: "c2s",
        desc: "Client notifies server that upcoming messages will be encrypted under negotiated session keys.",
        execute: async () => ({ status: "Client Symmetric Cipher Activated" }),
        rtt: 1.0
      },
      {
        name: "Finished (Client)",
        dir: "c2s",
        encrypted: true,
        desc: "Client transmits encrypted verification tag over all previous handshake messages.",
        execute: async () => {
          if (State.scenario === 'tampered') {
            return { alert: "Fatal Alert: Bad Record MAC (Tampered Payload)" };
          }
          return { verifyData: "0xABCDEF7890..." };
        },
        rtt: 1.0
      },
      {
        name: "ChangeCipherSpec (Server)",
        dir: "s2c",
        desc: "Server activates symmetric encryption using derived write keys.",
        execute: async () => {
          State.serverCrypto.sharedSecret = await deriveSharedSecret(
            State.serverCrypto.keyPair.privateKey, 
            State.clientCrypto.keyPair.publicKey
          );
          Elements.serverState.innerText = "CIPHER_ACTIVATED";
          return { status: "Server Symmetric Cipher Activated" };
        },
        rtt: 1.5
      },
      {
        name: "Finished (Server)",
        dir: "s2c",
        encrypted: true,
        desc: "Server validates client handshake transcript and sends its encrypted Finished tag.",
        execute: async () => {
          Elements.clientState.innerText = "ESTABLISHED";
          Elements.serverState.innerText = "ESTABLISHED";
          return { verifyData: "0x123456789ABC..." };
        },
        rtt: 1.5
      }
    ];
  }

  /* ==========================================================================
     5. SIMULATION PREPARATION & UI UPDATES
     ========================================================================== */
  async function prepareSimulation() {
    State.runId++;
    State.isFailed = false;
    clearUI();
    await initializeCryptoState();
    State.tlsVersion = Elements.tlsVersion.value;
    State.scenario = Elements.scenario.value;
    State.keyExchange = Elements.keyExchange.value;
    State.stepIndex = 0;
    State.isInitialized = true;
    
    if (State.tlsVersion === '1.3') {
      simSequence = buildTLS13Sequence();
    } else {
      simSequence = buildTLS12Sequence();
    }
    
    updateCryptoUI();
    logEvent(`Initialized ${State.tlsVersion} state machine | KeyEx: ${State.keyExchange} | Scenario: ${State.scenario}`);
  }

  function clearUI() {
    Elements.messagesContainer.innerHTML = '';
    Elements.svg.innerHTML = '';
    Elements.eventLog.innerHTML = '';
    Elements.obsTableBody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #71717a;">Click \'Play Auto-Run\' or \'Step Forward\' to generate real-time observations.</td></tr>';
    Elements.inspectorContent.innerHTML = 'Click any message packet in the sequence to view its structured cryptographic payload.';
    Elements.explanationText.innerText = 'Configure settings above, then click Play Auto-Run or Step Forward to begin.';
    Elements.appInput.placeholder = 'Wait for handshake...';
    Elements.appInput.disabled = true;
    Elements.btnSendApp.disabled = true;
    State.messages = [];
    Elements.clientCrypto.innerHTML = "Keys: [Click 'Play' or 'Step Forward' to initialize]";
    Elements.serverCrypto.innerHTML = "Keys: [Click 'Play' or 'Step Forward' to initialize]";
    Elements.clientState.innerText = "INITIAL";
    Elements.serverState.innerText = "INITIAL";
    Elements.rttCount.innerText = "0";
    Elements.hsStatusBadge.innerText = "Not Started";
    Elements.hsStatusBadge.style.background = "#f4f4f5";
    Elements.hsStatusBadge.style.color = "#52525b";
    Elements.serverOutputBox.innerHTML = '<p class="server-rcvd-msg">Awaiting secure channel...</p>';
    Elements.conclusionText.innerText = "Awaiting simulation execution.";
    State.isInitialized = false;
    reportHeight();
  }

  function updateCryptoUI() {
    if (!State.clientCrypto.random) return;
    Elements.clientCrypto.innerHTML = `
      <strong>Client Random:</strong><br>${State.clientCrypto.random.substring(0, 16)}...<br><br>
      <strong>Shared Secret (Z):</strong><br>${State.clientCrypto.sharedSecret ? State.clientCrypto.sharedSecret.substring(0, 24) + '...' : 'Awaiting Exchange'}
    `;
    Elements.serverCrypto.innerHTML = `
      <strong>Server Random:</strong><br>${State.serverCrypto.random.substring(0, 16)}...<br><br>
      <strong>Shared Secret (Z):</strong><br>${State.serverCrypto.sharedSecret ? State.serverCrypto.sharedSecret.substring(0, 24) + '...' : 'Awaiting Exchange'}
    `;
  }

  function logEvent(msg) {
    const li = document.createElement('li');
    const time = new Date().toLocaleTimeString();
    li.innerText = `[${time}] ${msg}`;
    Elements.eventLog.prepend(li);
  }

  function recordObservation(step) {
    if (Elements.obsTableBody.querySelector('td[colspan="4"]')) {
      Elements.obsTableBody.innerHTML = '';
    }
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${new Date().toLocaleTimeString()}</td>
      <td><strong>${step.dir === 'c2s' ? 'Client &rarr; Server' : 'Server &rarr; Client'}</strong></td>
      <td><code>${step.name}</code></td>
      <td><span style="display:inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 800; background: ${step.encrypted ? '#fffbeb' : '#eff6ff'}; color: ${step.encrypted ? '#b45309' : '#1d4ed8'}; border: 1px solid #18181b;">${step.encrypted ? 'AEAD Encrypted' : 'Cleartext Header'}</span></td>
    `;
    Elements.obsTableBody.appendChild(tr);
    reportHeight();
  }

  /* ==========================================================================
     6. STEP EXECUTION & ANIMATION ENGINE
     ========================================================================== */
  async function executeStep() {
    const currentRunId = State.runId;
    if (State.stepIndex >= simSequence.length) {
      completeHandshake();
      return;
    }

    const step = simSequence[State.stepIndex];
    const payload = await step.execute();
    
    if (State.runId !== currentRunId) return;
    
    // Failure handling
    if (payload.error || payload.alert) {
      State.isPlaying = false;
      State.isFailed = true;
      Elements.btnPlay.innerText = "▶ Play Auto-Run";
      animatePacket(step, payload, true);
      
      Elements.hsStatusBadge.innerText = "FAILED (ALERT)";
      Elements.hsStatusBadge.style.background = "#fee2e2";
      Elements.hsStatusBadge.style.color = "#991b1b";
      
      Elements.clientState.innerText = "TERMINATED";
      Elements.serverState.innerText = "TERMINATED";

      Elements.explanationText.innerHTML = `<strong>Handshake Terminated:</strong> ${payload.error || payload.alert}. Connection closed before application data transfer.`;
      Elements.conclusionText.innerHTML = `<strong style="color: #b91c1c;">Handshake Aborted:</strong> ${payload.error || payload.alert}. This demonstrates how TLS cryptographic verification shields against compromised certificates, impersonators, and active tampering.`;
      logEvent(`FATAL TLS ALERT: ${payload.error || payload.alert}`);
      reportHeight();
      return;
    }

    animatePacket(step, payload, false);
    
    Elements.explanationText.innerText = step.desc;
    Elements.rttCount.innerText = step.rtt;
    logEvent(`${step.dir === 'c2s' ? 'Client transmitted' : 'Server transmitted'} ${step.name}`);
    recordObservation(step);
    
    updateCryptoUI();
    State.stepIndex++;

    if (State.isPlaying) {
      const delay = (6 - Elements.speed.value) * 450;
      State.autoPlayTimeout = setTimeout(executeStep, delay + 750);
    } else if (State.stepIndex >= simSequence.length) {
      completeHandshake();
    }
  }

  function animatePacket(step, payload, isError) {
    const pkt = document.createElement('div');
    pkt.className = `msg-packet ${step.encrypted ? 'encrypted' : ''} ${isError ? 'error' : ''}`;
    pkt.innerText = step.name;
    
    pkt.dataset.payload = JSON.stringify(payload, null, 2);
    pkt.onclick = () => {
      Elements.inspectorContent.innerHTML = `<pre style="margin: 0; font-family: inherit;">${pkt.dataset.payload}</pre>`;
    };

    Elements.messagesContainer.appendChild(pkt);
    
    const startY = 12 + (State.stepIndex * 36);
    pkt.style.top = startY + 'px';
    
    if (step.dir === 'c2s') {
      pkt.style.left = '8%';
      pkt.style.transform = 'translateX(0)';
      setTimeout(() => { 
        pkt.style.left = '92%'; 
        pkt.style.transform = 'translateX(-100%)'; 
      }, 50);
    } else {
      pkt.style.left = '92%';
      pkt.style.transform = 'translateX(-100%)';
      setTimeout(() => { 
        pkt.style.left = '8%'; 
        pkt.style.transform = 'translateX(0)'; 
      }, 50);
    }
    
    drawArrow(startY + 12, step.dir, isError ? '#ef4444' : (step.encrypted ? '#d97706' : '#2563eb'));
  }

  function drawArrow(y, dir, color) {
    const svgNS = "http://www.w3.org/2000/svg";
    
    if (!document.getElementById('arrow-defs')) {
      const defs = document.createElementNS(svgNS, 'defs');
      defs.id = 'arrow-defs';
      Elements.svg.appendChild(defs);
    }
    const defs = document.getElementById('arrow-defs');
    const markerId = `arrowhead-${color.replace('#', '')}`;
    if (!document.getElementById(markerId)) {
      const marker = document.createElementNS(svgNS, 'marker');
      marker.setAttribute('id', markerId);
      marker.setAttribute('markerWidth', '8');
      marker.setAttribute('markerHeight', '6');
      marker.setAttribute('refX', '7');
      marker.setAttribute('refY', '3');
      marker.setAttribute('orient', 'auto');
      
      const polygon = document.createElementNS(svgNS, 'polygon');
      polygon.setAttribute('points', '0 0, 8 3, 0 6');
      polygon.setAttribute('fill', color);
      marker.appendChild(polygon);
      defs.appendChild(marker);
    }

    const line = document.createElementNS(svgNS, 'line');
    let x1 = dir === 'c2s' ? '8%' : '92%';
    let x2 = dir === 'c2s' ? '92%' : '8%';
    
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y);
    line.setAttribute('stroke', color);
    line.setAttribute('stroke-width', '2');
    line.setAttribute('stroke-dasharray', '4,4');
    line.setAttribute('marker-end', `url(#${markerId})`);
    
    Elements.svg.appendChild(line);
  }

  function completeHandshake() {
    State.isPlaying = false;
    Elements.btnPlay.innerText = "▶ Play Auto-Run";
    
    Elements.hsStatusBadge.innerText = "ESTABLISHED";
    Elements.hsStatusBadge.style.background = "#dcfce7";
    Elements.hsStatusBadge.style.color = "#15803d";
    
    Elements.explanationText.innerHTML = "<strong>Handshake Complete!</strong> Mutual authenticated key agreement established. Perfect Forward Secrecy secured. Enter data below to transmit encrypted application records.";
    Elements.conclusionText.innerHTML = `<strong style="color: #15803d;">Handshake Success:</strong> Both Client and Server negotiated parameters and derived shared secret <code>${State.clientCrypto.sharedSecret.substring(0, 16)}...</code>. Communication is now wrapped in AES-GCM AEAD encryption.`;
    logEvent("Secure TLS session successfully established.");
    
    Elements.appInput.placeholder = "Enter HTTP request or confidential message...";
    Elements.appInput.disabled = false;
    Elements.btnSendApp.disabled = false;
    Elements.appInput.focus();
    reportHeight();
  }

  /* ==========================================================================
     7. APPLICATION DATA ENCRYPTION & TRANSMISSION
     ========================================================================== */
  Elements.btnSendApp.onclick = async () => {
    const plaintext = Elements.appInput.value.trim();
    if (!plaintext) return;
    
    const iv = "00112233445566778899aabb"; // 96-bit AES-GCM IV
    const ciphertext = await encryptData(State.clientCrypto.sharedSecret, iv, plaintext);
    
    logEvent(`Client transmitted encrypted application record: "${plaintext.substring(0, 20)}..."`);
    
    const pkt = document.createElement('div');
    pkt.className = 'msg-packet encrypted';
    pkt.innerText = "Application Data [AEAD]";
    pkt.dataset.payload = JSON.stringify({
      type: "TLS Inner Plaintext (Record Layer)",
      contentType: "application_data (23)",
      ivHex: iv,
      ciphertextHex: ciphertext,
      authenticatedPayload: plaintext
    }, null, 2);
    pkt.onclick = () => { 
      Elements.inspectorContent.innerHTML = `<pre style="margin: 0; font-family: inherit;">${pkt.dataset.payload}</pre>`; 
    };
    
    const startY = 12 + ((State.stepIndex + 1) * 36);
    pkt.style.top = startY + 'px';
    Elements.messagesContainer.appendChild(pkt);
    pkt.style.left = '8%';
    pkt.style.transform = 'translateX(0)';
    setTimeout(() => { 
      pkt.style.left = '92%'; 
      pkt.style.transform = 'translateX(-100%)'; 
    }, 50);
    drawArrow(startY + 12, 'c2s', '#d97706');
    State.stepIndex++;

    // Server decryption
    setTimeout(async () => {
      const decrypted = await decryptData(State.serverCrypto.sharedSecret, iv, ciphertext);
      Elements.serverOutputBox.innerHTML = `
        <div style="background: #f0fdf4; border: 1.5px solid #22c55e; border-radius: 6px; padding: 8px 10px; margin-top: 4px;">
          <span style="font-size: 11px; font-weight: 800; color: #15803d; text-transform: uppercase;">AES-GCM Decrypted:</span><br>
          <strong style="color: #14532d; font-size: 12.5px;">${decrypted}</strong>
        </div>
      `;
      logEvent("Server decrypted application record successfully.");
      reportHeight();
    }, 600);
    
    Elements.appInput.value = '';
  };

  /* ==========================================================================
     8. CONTROL EVENT LISTENERS (Strictly On-Demand)
     ========================================================================== */
  // Changing dropdowns clears/resets UI, but does NOT auto-run!
  Elements.tlsVersion.onchange = () => {
    clearTimeout(State.autoPlayTimeout);
    clearUI();
  };

  Elements.scenario.onchange = () => {
    clearTimeout(State.autoPlayTimeout);
    clearUI();
  };

  Elements.keyExchange.onchange = () => {
    clearTimeout(State.autoPlayTimeout);
    clearUI();
  };

  // Play Auto-Run Button
  Elements.btnPlay.onclick = async () => {
    if (!State.isInitialized || State.isFailed || State.stepIndex >= simSequence.length) {
      await prepareSimulation();
    }
    
    if (State.isPlaying) {
      State.isPlaying = false;
      Elements.btnPlay.innerText = "▶ Play Auto-Run";
      clearTimeout(State.autoPlayTimeout);
    } else {
      State.isPlaying = true;
      Elements.btnPlay.innerText = "⏸ Pause";
      executeStep();
    }
  };

  // Step Forward Button
  Elements.btnStepFwd.onclick = async () => {
    if (!State.isInitialized || State.isFailed || State.stepIndex >= simSequence.length) {
      await prepareSimulation();
    }
    State.isPlaying = false;
    Elements.btnPlay.innerText = "▶ Play Auto-Run";
    clearTimeout(State.autoPlayTimeout);
    executeStep();
  };

  // Reset Button
  Elements.btnReset.onclick = () => {
    State.isPlaying = false;
    Elements.btnPlay.innerText = "▶ Play Auto-Run";
    clearTimeout(State.autoPlayTimeout);
    clearUI();
  };

  /* ==========================================================================
     9. QUIZ ENGINE (10 Comprehensive Questions)
     ========================================================================== */
  const quizQuestions = [
    { q: "What does the abbreviation TLS stand for in computer networking?", options: ["Transport Level Security", "Transport Layer Security", "Transmission Layer Security", "Transitional Link Security"], ans: 1 },
    { q: "What primary performance latency benefit does TLS 1.3 introduce over TLS 1.2 during a fresh handshake?", options: ["0-RTT by default for all sessions", "1-RTT handshake instead of 2-RTT", "No initial TCP connection required", "3-RTT authentication pipeline"], ans: 1 },
    { q: "Why was static RSA key exchange completely eliminated from TLS 1.3 in RFC 8446?", options: ["RSA was computationally too fast", "It lacked Perfect Forward Secrecy (PFS)", "It utilized excessive network bandwidth", "RSA certificates cannot be signed by CAs"], ans: 1 },
    { q: "What is the primary role of the ClientRandom and ServerRandom nonces?", options: ["To prevent replay attacks and ensure unique per-session keys", "To compress HTTP request payloads", "To format certificate trust chains", "To authenticate client biometric IDs"], ans: 0 },
    { q: "In TLS 1.2, what is the role of the ChangeCipherSpec protocol message?", options: ["To request a new X.509 certificate", "To signal that subsequent records will be symmetrically encrypted", "To close the TCP socket connection", "To update the DNS record entry"], ans: 1 },
    { q: "Which cryptographic primitive is used to derive the Master Secret in TLS 1.2?", options: ["AES Block Cipher", "RSA Digital Signature", "Pseudo-Random Function (PRF)", "Base64 Encoding Engine"], ans: 2 },
    { q: "What happens if a Man-in-the-Middle (MITM) adversary tampers with handshake messages in transit?", options: ["The session continues unencrypted without notification", "The 'Finished' message MAC verification fails and triggers a fatal alert", "The server silently drops client packets without alert", "Client auto-downgrades to plaintext HTTP"], ans: 1 },
    { q: "Which entity is authenticated via a standard X.509 Digital Certificate during a one-way TLS handshake?", options: ["The Client Browser", "The Network Edge Router", "The Server Host", "The Local DNS Resolver"], ans: 2 },
    { q: "What does Perfect Forward Secrecy (PFS) guarantee to cryptographic communications?", options: ["Past recorded sessions remain secure even if the server private key is stolen later", "Keys are transmitted over unencrypted wires safely", "Server hardware cannot overheat during ECDH derivation", "Client IP addresses are anonymized"], ans: 0 },
    { q: "Which symmetric encryption mode family is exclusively mandated in TLS 1.3, deprecating CBC mode?", options: ["ECB (Electronic Codebook)", "OFB (Output Feedback)", "Authenticated Encryption with Associated Data (AEAD, e.g. AES-GCM)", "CFB (Cipher Feedback)"], ans: 2 }
  ];

  const quizContainer = document.getElementById('quizContainer');
  if (quizContainer) {
    quizQuestions.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'quiz-card';
      let optionsHtml = '';
      item.options.forEach((opt, i) => {
        optionsHtml += `
          <label class="quiz-option-label">
            <input type="radio" name="q_${index}" value="${i}">
            <span>${opt}</span>
          </label>
        `;
      });
      card.innerHTML = `
        <div class="quiz-prompt">${index + 1}. ${item.q}</div>
        <div class="quiz-options-group">${optionsHtml}</div>
        <div id="q_${index}_feedback" class="quiz-feedback"></div>
      `;
      quizContainer.appendChild(card);
    });
  }

  const btnSubmitQuiz = document.getElementById('btnSubmitQuiz');
  const btnResetQuiz = document.getElementById('btnResetQuiz');
  const quizScoreBanner = document.getElementById('quizScoreBanner');
  const quizScoreText = document.getElementById('quizScoreText');

  if (btnSubmitQuiz) {
    btnSubmitQuiz.onclick = () => {
      let score = 0;
      quizQuestions.forEach((item, index) => {
        const selected = document.querySelector(`input[name="q_${index}"]:checked`);
        const feedbackEl = document.getElementById(`q_${index}_feedback`);
        if (feedbackEl) {
          if (selected && parseInt(selected.value, 10) === item.ans) {
            score++;
            feedbackEl.className = 'quiz-feedback correct';
            feedbackEl.innerText = '✓ Correct! Excellent grasp of the TLS specification.';
          } else {
            feedbackEl.className = 'quiz-feedback incorrect';
            feedbackEl.innerText = `✗ Incorrect. Correct answer: "${item.options[item.ans]}"`;
          }
        }
      });
      if (quizScoreBanner && quizScoreText) {
        quizScoreBanner.style.display = 'flex';
        quizScoreText.innerText = `You scored ${score} out of ${quizQuestions.length} (${Math.round((score / quizQuestions.length) * 100)}%).`;
        reportHeight();
      }
    };
  }

  if (btnResetQuiz) {
    btnResetQuiz.onclick = () => {
      document.querySelectorAll('#quizContainer input[type="radio"]').forEach(r => { r.checked = false; });
      document.querySelectorAll('#quizContainer .quiz-feedback').forEach(f => {
        f.className = 'quiz-feedback';
        f.innerText = '';
      });
      if (quizScoreBanner) quizScoreBanner.style.display = 'none';
      reportHeight();
    };
  }

  /* ==========================================================================
     10. EXPORT LAB REPORT (jsPDF)
     ========================================================================== */
  if (Elements.btnExportLog) {
    Elements.btnExportLog.onclick = () => {
      if (!window.jspdf) {
        alert("PDF generator library is loading, please try again in a few seconds.");
        return;
      }
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      
      doc.setFontSize(16);
      doc.text("Virtual Cryptography Laboratory - Fr. CRCE", 14, 15);
      doc.setFontSize(13);
      doc.text("Experiment 05: SSL/TLS Protocol Overview & Handshake Analysis", 14, 23);
      
      doc.setFontSize(10);
      doc.text(`Engineered by: Jace Jaison, Ahamed Wafiq`, 14, 30);
      doc.text(`Report Generated: ${new Date().toLocaleString()}`, 14, 36);
      
      doc.setDrawColor(24, 24, 27);
      doc.line(14, 40, 196, 40);
      
      doc.setFontSize(11);
      doc.text(`Protocol Version: ${Elements.tlsVersion.value}`, 14, 48);
      doc.text(`Key Exchange: ${Elements.keyExchange.value}`, 14, 54);
      doc.text(`Execution Scenario: ${Elements.scenario.value}`, 14, 60);
      doc.text(`Round Trip Time (RTT): ${Elements.rttCount.innerText}`, 14, 66);
      doc.text(`Handshake Status: ${Elements.hsStatusBadge.innerText}`, 14, 72);
      
      doc.line(14, 78, 196, 78);
      doc.setFontSize(12);
      doc.text("Handshake Event Log Transcript:", 14, 86);
      
      let y = 94;
      const logItems = Elements.eventLog.querySelectorAll('li');
      if (logItems.length === 0) {
        doc.setFontSize(10);
        doc.text("No handshake events recorded in this session.", 14, y);
      } else {
        logItems.forEach((li, idx) => {
          if (idx > 20) return;
          doc.setFontSize(9);
          doc.text(li.innerText, 14, y);
          y += 7;
        });
      }
      
      doc.save(`SSL_TLS_Lab_Report_${Elements.tlsVersion.value}_${Date.now()}.pdf`);
    };
  }

  // Initial State: Clean, awaiting user click
  clearUI();
});
