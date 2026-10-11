"use strict";

(function () {
  var H_INIT = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];
  var K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];
  var F_NAMES = ["Ch", "Parity", "Maj", "Parity"];
  var DEFAULT_A = "abc";
  var DEFAULT_B = "abd";

  function rotl(x, n) {
    return ((x << n) | (x >>> (32 - n))) >>> 0;
  }

  function hex8(n) {
    return ("00000000" + (n >>> 0).toString(16)).slice(-8);
  }

  function hex2(n) {
    return ("0" + n.toString(16)).slice(-2);
  }

  function textToBytes(str) {
    return Array.prototype.slice.call(new TextEncoder().encode(str));
  }

  function roundFunction(t, b, c, d) {
    if (t < 20) {
      return ((b & c) | (~b & d)) >>> 0;
    }
    if (t < 40 || t >= 60) {
      return (b ^ c ^ d) >>> 0;
    }
    return ((b & c) | (b & d) | (c & d)) >>> 0;
  }

  // RFC 3174 padding. Returns padded bytes plus the size of each part.
  function padMessage(bytes) {
    var len = bytes.length;
    var zeros = (55 - len) % 64;
    if (zeros < 0) {
      zeros += 64;
    }
    var padded = bytes.slice();
    padded.push(0x80);
    for (var i = 0; i < zeros; i++) {
      padded.push(0);
    }
    var bitLen = len * 8;
    var high = Math.floor(bitLen / 4294967296);
    var low = bitLen >>> 0;
    var lenBytes = [high >>> 24, high >>> 16, high >>> 8, high, low >>> 24, low >>> 16, low >>> 8, low];
    for (var j = 0; j < 8; j++) {
      padded.push(lenBytes[j] & 0xff);
    }
    return { padded: padded, msgLen: len, zeros: zeros, bitLen: bitLen };
  }

  function expandSchedule(block, offset) {
    var w = new Array(80);
    for (var t = 0; t < 16; t++) {
      var p = offset + t * 4;
      w[t] = ((block[p] << 24) | (block[p + 1] << 16) | (block[p + 2] << 8) | block[p + 3]) >>> 0;
    }
    for (var u = 16; u < 80; u++) {
      w[u] = rotl(w[u - 3] ^ w[u - 8] ^ w[u - 14] ^ w[u - 16], 1);
    }
    return w;
  }

  // Full SHA-1 with every intermediate value recorded for the views.
  function computeSha1(str) {
    var bytes = textToBytes(str);
    var pad = padMessage(bytes);
    var h = H_INIT.slice();
    var blocks = [];

    for (var off = 0; off < pad.padded.length; off += 64) {
      var w = expandSchedule(pad.padded, off);
      var a = h[0], b = h[1], c = h[2], d = h[3], e = h[4];
      var steps = [];
      var roundEnds = [];

      for (var t = 0; t < 80; t++) {
        var f = roundFunction(t, b, c, d);
        var k = K[Math.floor(t / 20)];
        var temp = (rotl(a, 5) + f + e + k + w[t]) >>> 0;
        e = d;
        d = c;
        c = rotl(b, 30);
        b = a;
        a = temp;
        steps.push({ t: t, f: f, k: k, w: w[t], regs: [a, b, c, d, e] });
        if (t % 20 === 19) {
          roundEnds.push([a, b, c, d, e]);
        }
      }

      h = [
        (h[0] + a) >>> 0,
        (h[1] + b) >>> 0,
        (h[2] + c) >>> 0,
        (h[3] + d) >>> 0,
        (h[4] + e) >>> 0
      ];

      blocks.push({
        offset: off,
        words: w,
        steps: steps,
        roundEnds: roundEnds,
        chainOut: h.slice()
      });
    }

    var digest = h.map(hex8).join("");
    return {
      input: str,
      bytes: bytes,
      pad: pad,
      blocks: blocks,
      digest: digest
    };
  }

  function countBitDiffs(a, b) {
    var diff = (a ^ b) >>> 0;
    var count = 0;
    while (diff) {
      count += diff & 1;
      diff >>>= 1;
    }
    return count;
  }

  function compareDigests(d1, d2) {
    var charDiffs = 0;
    var bitDiffs = 0;
    var mark1 = [];
    for (var i = 0; i < d1.length; i++) {
      var diff = d1[i] !== d2[i];
      if (diff) {
        charDiffs++;
      }
      mark1.push(diff);
      var v1 = parseInt(d1[i], 16);
      var v2 = parseInt(d2[i], 16);
      bitDiffs += countBitDiffs(v1, v2);
    }
    return { chars: charDiffs, bits: bitDiffs, marks: mark1 };
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function el(id) {
    return document.getElementById(id);
  }

  function reportHeight() {
    try {
      var simEl = document.getElementById("simulation") || document.querySelector(".lab-experiment-container") || document.body;
      var h = Math.max(simEl.scrollHeight || 0, simEl.offsetHeight || 0);
      window.parent?.postMessage({ type: 'RESIZE_IFRAME', height: h }, '*');
    } catch (_) {}
  }

  // ---- Rendering views --------------------------------------------------------
  var input = el("sim-input");
  var input2 = el("sim-input2");
  var schedBlock = el("sim-sched-block");
  var stepBlock = el("sim-step-block");
  var stepRange = el("sim-step");
  var current = null;

  function renderDigest(r) {
    el("sim-digest").textContent = r.digest;
    el("sim-bits").textContent = r.pad.bitLen + " bits (" + r.bytes.length + " bytes)";
    el("sim-blocks").textContent = r.blocks.length + " block" + (r.blocks.length === 1 ? "" : "s") + " (" + r.pad.padded.length + " bytes padded)";
  }

  function renderSelfCheck() {
    var v1 = computeSha1("abc").digest;
    var v2 = computeSha1("").digest;
    var ok1 = v1 === "a9993e364706816aba3e25717850c26c9cd0d89d";
    var ok2 = v2 === "da39a3ee5e6b4b0d3255bfef95601890afd80709";
    var lines = [
      (ok1 ? "PASS" : "FAIL") + "  SHA1(\"abc\") = " + v1,
      (ok2 ? "PASS" : "FAIL") + "  SHA1(\"\")    = " + v2
    ];
    el("sim-selfcheck").textContent = lines.join("\n");
  }

  function renderPadding(r) {
    var p = r.pad;
    var lines = [];
    lines.push("Original message length: " + p.msgLen + " bytes (" + p.bitLen + " bits)");
    lines.push("Appended: 0x80 (1 byte) + " + p.zeros + " zero bytes");
    lines.push("Length field: 8 bytes (64-bit big-endian = " + p.bitLen + ")");
    lines.push("Total padded length: " + p.padded.length + " bytes (" + (p.padded.length / 64) + " block" + (p.padded.length === 64 ? "" : "s") + ")");
    el("sim-padding").textContent = lines.join("\n");

    var byteHtml = [];
    for (var i = 0; i < p.padded.length; i++) {
      var cls = "lab-b-zero";
      if (i < p.msgLen) {
        cls = "lab-b-msg";
      } else if (i === p.msgLen) {
        cls = "lab-b-one";
      } else if (i >= p.padded.length - 8) {
        cls = "lab-b-len";
      }
      byteHtml.push('<span class="lab-byte ' + cls + '">' + hex2(p.padded[i]) + "</span>");
    }
    el("sim-padbytes").innerHTML = byteHtml.join("");
  }

  function fillBlockSelect(select, total) {
    var val = select.value ? Math.min(parseInt(select.value, 10), total - 1) : 0;
    if (val < 0) val = 0;
    var opts = [];
    for (var i = 0; i < total; i++) {
      opts.push('<option value="' + i + '"' + (i === val ? " selected" : "") + ">Block " + (i + 1) + " of " + total + "</option>");
    }
    select.innerHTML = opts.join("");
  }

  function renderSchedule(r) {
    var bi = parseInt(schedBlock.value, 10) || 0;
    if (bi >= r.blocks.length) bi = 0;
    var w = r.blocks[bi].words;
    var rows = [];
    for (var t = 0; t < 40; t++) {
      var t2 = t + 40;
      var src1 = t < 16 ? "block[" + t + "]" : "ROTL1(W[" + (t - 3) + "] ^ W[" + (t - 8) + "] ^ W[" + (t - 14) + "] ^ W[" + (t - 16) + "])";
      var src2 = "ROTL1(W[" + (t2 - 3) + "] ^ W[" + (t2 - 8) + "] ^ W[" + (t2 - 14) + "] ^ W[" + (t2 - 16) + "])";
      rows.push(
        "<tr><td>" + t + "</td><td><code>" + hex8(w[t]) + "</code></td><td>" + escapeHtml(src1) + "</td>" +
        "<td>" + t2 + "</td><td><code>" + hex8(w[t2]) + "</code></td><td>" + escapeHtml(src2) + "</td></tr>"
      );
    }
    el("sim-schedule").innerHTML = rows.join("");
  }

  function renderRounds(r) {
    var rows = [];
    for (var bi = 0; bi < r.blocks.length; bi++) {
      var b = r.blocks[bi];
      for (var round = 0; round < 4; round++) {
        var regs = b.roundEnds[round];
        rows.push(
          "<tr><td>Block " + (bi + 1) + ", end of round " + (round + 1) + " (" + F_NAMES[round] + ")</td>" +
          "<td><code>" + hex8(regs[0]) + "</code></td>" +
          "<td><code>" + hex8(regs[1]) + "</code></td>" +
          "<td><code>" + hex8(regs[2]) + "</code></td>" +
          "<td><code>" + hex8(regs[3]) + "</code></td>" +
          "<td><code>" + hex8(regs[4]) + "</code></td></tr>"
        );
      }
      rows.push(
        '<tr class="lab-row-chain"><td>Block ' + (bi + 1) + " chaining output (+ initial H)</td>" +
        "<td><code>" + hex8(b.chainOut[0]) + "</code></td>" +
        "<td><code>" + hex8(b.chainOut[1]) + "</code></td>" +
        "<td><code>" + hex8(b.chainOut[2]) + "</code></td>" +
        "<td><code>" + hex8(b.chainOut[3]) + "</code></td>" +
        "<td><code>" + hex8(b.chainOut[4]) + "</code></td></tr>"
      );
    }
    el("sim-rounds").innerHTML = rows.join("");
    renderStep(r);
  }

  function renderStep(r) {
    var bi = parseInt(stepBlock.value, 10) || 0;
    if (bi >= r.blocks.length) bi = 0;
    var t = parseInt(stepRange.value, 10) || 0;
    var s = r.blocks[bi].steps[t];
    var round = Math.floor(t / 20);
    el("sim-step-label").textContent = String(t);
    el("sim-stepinfo").textContent =
      "Block " + (bi + 1) + ", step " + t + " (round " + (round + 1) + ", f = " + F_NAMES[round] + ")\n" +
      "f(b,c,d) = " + hex8(s.f) + "\n" +
      "K        = " + hex8(s.k) + "\n" +
      "W[" + t + "]" + (t < 10 ? "   " : "  ") + " = " + hex8(s.w) + "\n" +
      "a = " + hex8(s.regs[0]) + "   b = " + hex8(s.regs[1]) + "   c = " + hex8(s.regs[2]) + "\n" +
      "d = " + hex8(s.regs[3]) + "   e = " + hex8(s.regs[4]);
  }

  function highlight(digest, marks, invert) {
    var out = [];
    for (var i = 0; i < digest.length; i++) {
      var isDiff = marks[i];
      if (invert ? isDiff : !isDiff) {
        out.push('<span class="lab-diff">' + digest[i] + "</span>");
      } else {
        out.push(digest[i]);
      }
    }
    return out.join("");
  }

  function renderAvalanche(r) {
    var other = computeSha1(input2.value);
    var cmp = compareDigests(r.digest, other.digest);
    var percent = (cmp.bits / 160) * 100;
    var identical = input.value === input2.value;
    el("sim-hash-a").innerHTML = highlight(r.digest, cmp.marks, true);
    el("sim-hash-b").innerHTML = highlight(other.digest, cmp.marks, true);
    el("sim-changed").textContent = cmp.bits + " / 160 bits";
    el("sim-percent").textContent = percent.toFixed(2) + " %";
    el("sim-hexdiff").textContent = cmp.chars + " / 40";
    var note;
    if (identical) {
      note = "The two messages are identical, so the digests match. Edit the modified message to see the avalanche effect.";
    } else if (cmp.bits >= 64 && cmp.bits <= 96) {
      note = "Close to the ideal 50 percent (about 80 bits): a small input change flipped roughly half of the digest bits.";
    } else {
      note = "Different from the ideal 80 bits for this sample. Statistically the average over many inputs is 50 percent; single samples vary.";
    }
    el("sim-observation").textContent = note;
  }

  function renderAll() {
    current = computeSha1(input.value);
    fillBlockSelect(schedBlock, current.blocks.length);
    fillBlockSelect(stepBlock, current.blocks.length);
    renderDigest(current);
    renderPadding(current);
    renderSchedule(current);
    renderRounds(current);
    renderAvalanche(current);
    setTimeout(reportHeight, 30);
  }

  // ---- Wiring (simulator subviews) -------------------------------------------
  var btns = document.querySelectorAll(".lab-sim-viewbtn");
  btns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      btns.forEach(function (b) {
        b.classList.remove("active");
      });
      btn.classList.add("active");
      var want = btn.getAttribute("data-view");
      document.querySelectorAll(".lab-sim-view").forEach(function (panel) {
        panel.classList.toggle("active", panel.getAttribute("data-viewpanel") === want);
      });
      setTimeout(reportHeight, 30);
    });
  });

  input.addEventListener("input", renderAll);
  input2.addEventListener("input", function () {
    renderAvalanche(current);
    setTimeout(reportHeight, 30);
  });
  schedBlock.addEventListener("change", function () {
    renderSchedule(current);
    setTimeout(reportHeight, 30);
  });
  stepBlock.addEventListener("change", function () {
    renderStep(current);
  });
  stepRange.addEventListener("input", function () {
    renderStep(current);
  });

  el("sim-reset").addEventListener("click", function () {
    input.value = DEFAULT_A;
    input2.value = DEFAULT_B;
    stepRange.value = "0";
    renderAll();
  });

  el("sim-flip").addEventListener("click", function () {
    var chars = Array.from(input.value);
    if (chars.length === 0) {
      input2.value = "\u0001";
    } else {
      var last = chars.length - 1;
      chars[last] = String.fromCodePoint(chars[last].codePointAt(0) ^ 1);
      input2.value = chars.join("");
    }
    renderAvalanche(current);
    setTimeout(reportHeight, 30);
  });

  el("sim-append").addEventListener("click", function () {
    input2.value = input.value + ".";
    renderAvalanche(current);
    setTimeout(reportHeight, 30);
  });

  el("sim-copy").addEventListener("click", function () {
    input2.value = input.value;
    renderAvalanche(current);
    setTimeout(reportHeight, 30);
  });

  // URL query handling for modes
  var urlParams = new URLSearchParams(window.location.search);
  var isSimMode = urlParams.get("mode") === "sim";
  var initialHash = window.location.hash.replace(/^#/, "");
  var initialTab = urlParams.get("tab") || initialHash;

  if (isSimMode || initialTab === "simulation" || initialTab === "sim") {
    document.body.classList.add("mode-sim");
    var header = document.querySelector(".lab-header-card");
    if (header) header.style.display = "none";
    var secSim = document.getElementById("simulation");
    if (secSim) secSim.classList.remove("tab-hidden");
    document.querySelectorAll(".lab-section").forEach(function (s) {
      if (s.id !== "simulation") s.classList.add("tab-hidden");
    });
  }

  window.addEventListener("resize", reportHeight);

  renderSelfCheck();
  renderAll();
  setTimeout(reportHeight, 150);
})();
