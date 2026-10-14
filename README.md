<div align="center">

<img src="public/icons/lab-icon.svg" width="130" alt="Virtual Cryptography Laboratory Icon" />

# Virtual Cryptography Laboratory - Fr. CRCE

**Department of Computer Engineering | Fr. Conceicao Rodrigues College of Engineering**  
*Cryptographic Security Systems (CSS) • Batch A • Academic Year 2025-2026*

[Live Platform](https://virtual-cryptography-lab.vercel.app) • [Verification Dashboard](https://virtual-cryptography-lab.vercel.app/dash) • [Team Roster](https://virtual-cryptography-lab.vercel.app/team)

**Deployed by Ulric and Sai**

</div>

---

## About the Project

The **Virtual Cryptography Laboratory** is a hands-on learning platform developed by **Batch A** for Cryptographic Security Systems (CSS). It lets students test and understand core cryptographic algorithms directly in the browser through interactive simulations, packet flow visualizers, and live Man-in-the-Middle (MitM) attacker scenarios.

All cryptographic computations run **100% client-side** using standard bitwise math and the browser's native **Web Crypto API** (`crypto.subtle`), with zero backend dependencies.

---

## Lab Structure

To maintain uniformity across all Batch A experiments, every module follows a standard 7-part structure:

1. **Objective:** Pedagogical goals and expected learning outcomes
2. **Theory:** Cryptographic definitions, mathematical foundations, and RFC standards
3. **Procedure:** Step-by-step instructions to perform the lab
4. **Simulation:** Interactive real-time sandbox with customizable inputs
5. **Observations:** Execution transcript, round-by-round math, and bit-level tracking
6. **Assessment:** Multiple-choice quiz to verify understanding
7. **References:** RFC documents, NIST publications, and academic resources

---

## Experiments

- **MD5 Hash Algorithm (RFC 1321)**  
  128-bit digest generator, 64-round step compression pipeline, message padding breakdown, and avalanche effect analysis.

- **SHA-1 Secure Hash Algorithm (RFC 3174 / FIPS 180-1)**  
  160-bit digest, 80-step expansion schedule ($W_0 \dots W_{79}$), 512-bit block padding inspector, and bit-flip sensitivity testing.

- **Message Authentication Code (MAC)**  
  Data origin authentication and integrity simulation featuring Alice (Sender), Eve (In-Transit Attacker), and Bob (Receiver) with live payload tampering and MAC verification.

- **HMAC Keyed-Hash MAC (RFC 2104 / FIPS 198-1)**  
  Nested hashing construction ($K \oplus opad$ / $K \oplus ipad$), dual Encrypt-then-MAC AES-256 simulation, and avalanche diffusion analysis.

- **SSL/TLS Handshake Protocol (RFC 8446 / RFC 5246)**  
  Interactive handshake state machines for TLS 1.3 (1-RTT) and TLS 1.2 (2-RTT), ECDHE P-256 key exchange, animated SVG packet flow, and error injection scenarios.

---

## Batch A Team

### Deployment Team
- **Ulric and Sai**

### Experiment Authors
- **MD5:** Ruth Dmello, Alciya Dodti, Nicole Dabre, Larissa Dabreo
- **SHA-1:** Tanush Chavan, Swar, Aaron Deniz, Asher
- **MAC:** Slora Bar, Aarna Chopdekar, Arya Chavan, Cajetan Dsouza
- **HMAC:** Wendell Dsouza, Jaden Crasto, Rohit Ahir, Shreyas Divekar
- **SSL/TLS:** Jace Jaison, Ahamed Wafiq, Sai Balkawade

---

## Quickstart

### Prerequisites
- Node.js (v18+)
- npm

### Run Locally
```bash
# Clone the repository
git clone https://github.com/WillyEverGreen/css-virtual-lab.git
cd css-virtual-lab

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production
```bash
npm run build
```

---

## College & Course Info
- **Institution:** Fr. Conceicao Rodrigues College of Engineering (Fr. CRCE), Bandra, Mumbai
- **Department:** Department of Computer Engineering
- **Course:** Cryptographic Security Systems (CSS) - Batch A
- **Academic Year:** 2025-2026
