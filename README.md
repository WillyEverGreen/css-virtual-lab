# css-virtual-lab

# Virtual Cryptography Laboratory — Fr. CRCE
> **Department of Computer Engineering | Fr. Conceicao Rodrigues College of Engineering**  
> Cryptographic Security Systems (CSS) Interactive Laboratory Platform

🌐 **Live Production Deployment:** [https://virtual-cryptography-lab.vercel.app](https://virtual-cryptography-lab.vercel.app)

---

## 🏛️ Overview
The **Virtual Cryptography Laboratory** is a comprehensive educational simulation platform engineered for Cryptographic Security Systems (CSS). It features **5 interactive laboratory experiments** developed collaboratively by student research teams at Fr. Conceicao Rodrigues College of Engineering (Fr. CRCE).

Every experiment provides real-time client-side cryptographic computation, interactive attacker & Man-in-the-Middle (MitM) simulation environments, protocol packet inspectors, animated state machines, strict on-demand button execution, and automated assessment quizzes.

---

## 🧪 Experiments Catalog & Team Roster

| Exp # | Slug | Experiment Name & Specification | Team Members | Core Algorithms & Features |
|---|---|---|---|---|
| **EXP 01** | `md5` | **MD5 Message Digest Algorithm**<br>*(RFC 1321)* | Ruth Dmello, Alciya Dodti, Nicole Dabre, Larissa Dabreo | RFC 1321 padding layout inspector, 512-bit Block 0 breakdown, 4-Round State Tracing table (F, G, H, I), 128-bit bitwise Strict Avalanche Criterion (SAC) diff visualizer, salt prefixing. |
| **EXP 02** | `sha1` | **Secure Hash Algorithm 1**<br>*(RFC 3174 / FIPS PUB 180-1)* | Tanush Chavan, Swar, Aaron Deniz, Asher | 512-bit Message Padding Inspector ($L$ length, $k$ zero bits, 64-bit length descriptor hex, total blocks), 80-round state machine, live SAC evaluation box with single-bit preset mutators. |
| **EXP 03** | `mac` | **Message Authentication Code**<br>*(HMAC-SHA256)* | Slora Bar, Aarna Chopdekar, Arya Chavan, Cajetan Dsouza, Shreyas Divekar | Mathematical MAC formulation, 3-entity network channel (Sender Alice &rarr; In-Transit MitM Eve &rarr; Receiver Bob), live attacker toggle, payload & key tampering, recalculated vs supplied MAC verification verdict. |
| **EXP 04** | `hmac` | **Keyed-Hash Message Authentication Code**<br>*(RFC 2104 / FIPS PUB 198-1)* | Wendell Dsouza, Jadern Crasto, Rohit Ahir | 5-step workflow stepper, 4 presets, dual simulation modes (Full Encrypt-then-MAC with AES-256-CBC, IV, HMAC, Bob Decryption & Force Decrypt Unsafe vs RFC 2104 Multi-Hash Digest), In-Transit network channel, Key Pad Inspector (ipad `0x36`, opad `0x5C`), Modification Analysis with character diff & Hamming distance & avalanche SAC %, "Why Can't HMAC Be Decrypted?" explainer. |
| **EXP 05** | `ssl-tls` | **SSL/TLS Protocol Overview & Handshake Analysis**<br>*(RFC 8446 / RFC 5246)* | Jace Jaison, Ahamed Wafiq, Sai Balkawade | Web Crypto API ECDHE P-256 key exchange & AES-GCM AEAD encryption, TLS 1.3 (1-RTT) vs TLS 1.2 (2-RTT) state machines, 4 execution scenarios (Normal, Expired Certificate, MitM Forged Cert, Tampered Finished MAC), animated network sequence with dynamic SVG arrows, clickable Packet Inspector with JSON payloads, live Client terminal with encrypted application data transmission & Server decryption, dynamic Observations table, PDF Lab Report export (jsPDF). |

---

## 🎨 Unified Design System & Architecture

- **Retro-Academic Aesthetics:** Built on `#f7f1eb` retro-parchment background, `2px solid #18181b` ink borders, `4px 4px 0px #18181b` brutalist offset box shadows, Google Fonts typography, and curated color palettes.
- **Unified Master Navbar:** Section switching across all experiments is dynamically coordinated by the parent application via postMessage (`SET_TAB` / `ACTIVE_TAB_CHANGED` / `RESIZE_IFRAME`), with zero external box wrapper nesting.
- **Strictly On-Demand Computation:** Calculations across all experiments occur **strictly on button clicks** (e.g., `⚡ Generate Hash`, `⚡ Calculate HMAC`, `⚡ Simulate Handshake`). Initial page load starts in clean awaiting placeholder states with zero unwanted auto-computations.
- **100% Client-Side Cryptography:** Utilizing modern browser Web Crypto API (`crypto.subtle`) and standard RFC bitwise logic with zero external server dependencies for cryptographic security.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/WillyEverGreen/css-virtual-lab.git
cd css-virtual-lab

# Install dependencies
npm install
```

### Local Development
```bash
# Start Vite development server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build
```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

### Deployment (Vercel)
This repository is configured for instantaneous deployment with Vercel:
```bash
vercel --prod
```

---

## 📂 Repository Structure
```
css-virtual-lab/
├── experiments/            # 5 Standalone laboratory modules (strictly RFC/FIPS compliant)
│   ├── md5/                # EXP 01: MD5 Message Digest Algorithm
│   ├── sha1/               # EXP 02: Secure Hash Algorithm 1
│   ├── mac/                # EXP 03: Message Authentication Code
│   ├── hmac/               # EXP 04: Keyed-Hash Message Authentication Code
│   └── ssl-tls/            # EXP 05: SSL/TLS Protocol Overview & Handshake Analysis
│       ├── index.html      # Self-contained lab UI & interactive simulator
│       ├── style.css       # Scoped retro-academic brutalist stylesheet
│       ├── script.js       # Pure client-side offline cryptographic computation
│       ├── quiz.json       # Assessment question bank (Ruleset v1 schema)
│       └── README.md       # Standardized experiment technical specification
├── public/                 # Static assets copied directly to build output
│   ├── css/                # Shared design system stylesheets
│   ├── fonts/              # Web font assets
│   ├── icons/              # Vector SVG icons
│   ├── images/             # Educational diagrams and college insignia
│   ├── js/                 # Common web runtime scripts
│   ├── 404.html            # Standalone fallback error page
│   ├── favicon.svg         # Platform vector favicon
│   ├── robots.txt          # Web crawler access instructions
│   └── _headers            # Security & CSP headers
├── src/                    # React SPA source code
│   ├── components/         # Master Navbar, Hero, Modals, Widgets
│   ├── shared/             # Configurations, schemas, roster metadata
│   ├── web/                # Pages (Dashboard, ExperimentView, Instructions, About)
│   ├── App.jsx             # Root React application
│   └── main.jsx            # React DOM bootstrap
├── index.html              # Main SPA HTML entry point
├── package.json            # Project dependencies and npm scripts
├── vite.config.ts          # Vite bundler configuration & experiment runner
└── vercel.json             # Vercel deployment and routing rules
```

---

## 📄 License & Attribution
Developed for educational purposes at **Fr. Conceicao Rodrigues College of Engineering (Fr. CRCE), Bandra, Mumbai**.  
All cryptographic algorithms conform to authoritative IETF RFC and NIST FIPS standards.
