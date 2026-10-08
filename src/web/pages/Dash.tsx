import { useState, useEffect } from 'react';
import { Link } from 'react-router';

import { DEFAULT_ROSTER } from '../../shared/config/roster';

export default function Dash() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    fetch('/api/me')
      .then((res) => res.json())
      .then((data: any) => {
        if (data.authenticated) {
          setUser(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: { 'X-Lab-Request': '1' },
    });
    window.location.reload();
  };

  const agentPromptText = `You are a Virtual Cryptography Laboratory Module Engineer for Fr. Conceicao Rodrigues College of Engineering (Fr. CRCE).

Your objective is to generate or fix a completely compliant, self-contained experiment module that passes every automated test in the laboratory's webhook validation test suite (Ruleset v1: V001 through V505) and implements the official academic laboratory UI design system.

================================================================================
PART 1: MANDATORY REPOSITORY TREE & FILE RESTRICTIONS
================================================================================
1. EXACT FILE LIST (Rule V001 & V002):
   Your repository root MUST contain ONLY these files:
   - index.html
   - style.css
   - script.js
   - README.md
   - quiz.json
   - (Optional) .gitignore
   DO NOT create subdirectories, image files, or other assets (Rule V002). All SVGs/assets must be inline.
   Exact filename casing required: index.html, style.css, script.js, README.md, quiz.json (Rule V009).

2. SIZES & ENCODING (Rules V003, V004, V005, V204):
   - All files must be non-empty valid UTF-8 without NUL bytes (Rules V003, V005).
   - Maximum 1 MiB per file, 3 MiB repository total (Rule V004).
   - In script.js, no single line may exceed 2000 characters. Keep code cleanly formatted with line breaks (Rule V204).

================================================================================
PART 2: HTML SPECIFICATION (index.html) (Rules V101 - V107)
================================================================================
1. DOCUMENT SKELETON (Rule V101):
   Must start with:
   <!DOCTYPE html>
   <html lang="en">
   <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>[Experiment Title] - Fr. CRCE Virtual Cryptography Lab</title>
     <link rel="stylesheet" href="style.css">
   </head>
   <body>
     ...
     <script src="script.js"></script>
   </body>
   </html>

2. RESOURCE LINKING (Rule V102):
   - Exactly ONE <link rel="stylesheet" href="style.css"> in <head>.
   - Exactly ONE <script src="script.js"></script> before </body>.
   - Use clean relative paths ("style.css" and "script.js"). NO leading slashes ("/style.css") or dot-slash ("./style.css").

3. SECURITY & EVENT HANDLERS (Rules V103, V104, V105, V106):
   - ZERO inline JavaScript: NO <script> tags with inline code (Rule V103).
   - ZERO inline event attributes: NO onclick, onchange, onsubmit, onload, onkeyup, etc. Bind all event listeners inside script.js using addEventListener (Rule V103).
   - ZERO remote resources: NO CDNs, NO external scripts, NO external stylesheets, NO Google Fonts, NO remote images (<img src="https://...">) (Rule V104).
   - Allowed links: Only external documentation links: <a href="https://..." target="_blank" rel="noopener noreferrer"> inside the references section.
   - FORBIDDEN elements: <iframe>, <embed>, <object>, <base>, <meta http-equiv>, <script type="module"> (Rule V105).
   - FORBIDDEN URI schemes: javascript: and data:text/html (Rule V106).

4. SECTION STRUCTURE & HEADING HIERARCHY (Rule V107):
   Must have exactly ONE <h1> heading in the document, placed in the objective section:
   <section id="objective" class="lab-section">
     <span class="lab-section-tag">Section 1</span>
     <h1 class="lab-section-title">[Experiment Title]</h1>
     <div class="lab-prose">
       <p>Primary educational goals, cryptographic scope, and outcomes.</p>
       <div class="lab-callout">
         <div class="lab-callout-title">Overview</div>
         <p>Algorithm description and operational parameters.</p>
       </div>
     </div>
   </section>

   Must contain all 5 required section IDs:
   - <section id="objective" class="lab-section">
   - <section id="theory" class="lab-section"> (Contains <h2>Theory &amp; Mathematical Principles</h2>, step formulas, rounds)
   - <section id="procedure" class="lab-section"> (Contains <h2>Procedure &amp; Experimental Steps</h2>, ordered list <ol> of instructions)
   - <section id="simulation" class="lab-section"> (Contains <h2>Interactive Cryptographic Workbench</h2>, user inputs, buttons, visual state tables, step-by-step trace)
   - <section id="references" class="lab-section"> (Contains <h2>References &amp; Standards</h2>, RFCs, NIST publications, academic papers)

================================================================================
PART 3: JAVASCRIPT SPECIFICATION (script.js) (Rules V201 - V204)
================================================================================
1. SANDBOX & OFFLINE RESTRICTION (Rule V201):
   - The module runs 100% client-side and offline.
   - FORBIDDEN network APIs: fetch(), XMLHttpRequest, WebSocket, EventSource, navigator.sendBeacon, import(). Do NOT call any remote endpoints.

2. EXECUTION SAFETY (Rule V202):
   - FORBIDDEN dynamic code evaluation: eval(), new Function(), setTimeout/setInterval with string code argument.
   - Use window.crypto.getRandomValues() or pure JavaScript implementations of cryptographic primitives (hashing, padding, bitwise rotations, key schedule).

3. PARENT / STORAGE ISOLATION (Rule V203):
   - FORBIDDEN APIs: window.parent, window.top, document.cookie, localStorage, sessionStorage, indexedDB.
   - All state must reside in memory (JavaScript variables) during the session.

================================================================================
PART 4: CSS & DESIGN SYSTEM (style.css) (Rules V301 - V303 & UI Contract)
================================================================================
1. CSS RESTRICTIONS (Rules V301, V302, V303):
   - NO @import statements and NO remote url() links (Rule V301).
   - NO remote @font-face rules (Rule V302). System fonts only.
   - Do NOT style html, body, or :root with background, font-family, or color (Rule V303). The parent laboratory platform controls the viewport shell. Scope all styling to .lab-experiment-container and .lab-section.

2. DETAILED UI DESIGN SYSTEM & STYLING GUIDE:
   Match the official Fr. CRCE / NCERT Virtual Lab textbook aesthetic:
   - Theme variables to use within module:
     --lab-bg: #f7f1eb; (warm cream background)
     --lab-surface: #ffffff; (pure white card background)
     --lab-surface-warm: #faf4ef; (soft beige surface)
     --lab-surface-tint: #faebe5; (soft terracotta tint)
     --lab-border: #ebdcd2; (warm border)
     --lab-border-dark: #18181b; (bold interactive border)
     --lab-text: #1f1b18; (high-contrast dark text)
     --lab-text-body: #2e2824; (readable body text)
     --lab-text-muted: #735e54; (secondary text)
     --lab-accent: #c2410c; (terracotta primary accent)
     --lab-accent-hover: #9a3412;
     --lab-accent-light: #fff7ed;

   - Cards (.lab-section):
     background: var(--lab-surface);
     border: 2px solid var(--lab-border-dark);
     border-radius: 16px;
     padding: 36px 40px;
     margin: 28px auto;
     max-width: 960px;
     box-shadow: 4px 4px 0px var(--lab-border-dark);

   - Section Tags (.lab-section-tag):
     display: inline-block;
     font-size: 11px;
     font-weight: 700;
     text-transform: uppercase;
     letter-spacing: 0.08em;
     background: var(--lab-accent-light);
     color: var(--lab-accent);
     border: 1px solid var(--lab-border-dark);
     padding: 3px 10px;
     border-radius: 999px;
     margin-bottom: 14px;

   - Controls & Buttons:
     background: var(--lab-accent);
     color: #fff;
     border: 2px solid var(--lab-border-dark);
     border-radius: 8px;
     padding: 10px 20px;
     font-weight: 700;
     font-size: 14px;
     cursor: pointer;
     box-shadow: 2px 2px 0px var(--lab-border-dark);
     transition: transform 0.1s ease, box-shadow 0.1s ease;
     (Active state: transform: translate(1px, 1px); box-shadow: 1px 1px 0px var(--lab-border-dark);)

   - Text Inputs & Textareas:
     background: #fff;
     border: 2px solid var(--lab-border-dark);
     border-radius: 8px;
     padding: 10px 14px;
     font-size: 14px;
     color: var(--lab-text);
     outline: none;

   - Callout Boxes (.lab-callout):
     background: var(--lab-surface-warm);
     border-left: 4px solid var(--lab-accent);
     border-radius: 0 10px 10px 0;
     padding: 16px 20px;
     margin: 20px 0;

   - Code / Hex / Bitwise State Displays:
     font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
     background: #27272a;
     color: #34d399;
     border-radius: 8px;
     padding: 14px 18px;
     overflow-x: auto;

================================================================================
PART 5: DOCUMENTATION METADATA (README.md) (Rules V401 - V407)
================================================================================
Must contain exactly the standard 11 level-2 headings with accurate experiment metadata:
## Group
[Must be your assigned group: 'A' / 'Group A', 'B' / 'Group B', 'C' / 'Group C', 'D' / 'Group D', or 'E' / 'Group E'] (Rule V402)

## Experiment ID
[Must match ^EXP\\d{2}$: 'EXP01' for MD5, 'EXP02' for SHA-1, 'EXP03' for MAC, 'EXP04' for HMAC, 'EXP05' for SSL/TLS] (Rule V403)

## Navigation Title
[Max 60 characters title, e.g. "MD5 Hashing & Collision Analysis"] (Rule V407)

## Short Description
[Max 200 characters concise educational summary] (Rule V407)

## Folder
/experiments/[slug]/ (e.g. /experiments/md5/) (Rule V404)

## Entry File
index.html (Rule V404)

## Expected Navigation Link
/experiments/[slug]/ (Rule V404)

## Required Libraries
None (Rule V405)

## Input
[Expected input description, e.g. "Arbitrary ASCII plaintext message"]

## Output
[Expected output description, e.g. "128-bit hex digest"]

## Theory Summary
[Brief description of core algorithms, rounds, and cryptographic operations]

================================================================================
PART 6: QUIZ ASSESSMENT SPECIFICATION (quiz.json) (Rules V501 - V505)
================================================================================
quiz.json MUST be valid JSON matching this exact Zod schema:
{
  "schemaVersion": 1,
  "experiment": "[slug, e.g. 'md5', 'sha1', 'mac', 'hmac', or 'ssl-tls']",
  "questions": [
    {
      "id": "q1",
      "type": "mcq-single",
      "prompt": "What is the internal state size of MD5?",
      "options": ["128 bits", "160 bits", "256 bits", "512 bits"],
      "answerIndex": 0,
      "explanation": "MD5 maintains four 32-bit registers (A, B, C, D) totaling 128 bits."
    }
  ]
}

Strict Quiz Rules:
- "schemaVersion": MUST be integer 1.
- "experiment": MUST match your slug ('md5', 'sha1', 'mac', 'hmac', 'ssl-tls') (Rule V502).
- Total questions: Between 5 and 20 questions (Rule V503).
- Options per question: Between 2 and 6 unique options (Rule V504).
- Unique IDs: Every question must have a unique "id" string ("q1", "q2", etc.) (Rule V504).
- Valid answerIndex: 0-indexed integer strictly less than options.length (Rule V504).
- NO HTML in text: Avoid angle brackets (< or >) in prompt, options, or explanation (Rule V505).
- Character limits: prompt <= 500 chars, each option <= 200 chars, explanation <= 800 chars (Rule V505).

================================================================================
Deliver complete, fully written files ready to commit and push directly to GitHub.`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(agentPromptText);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  if (loading) {
    return (
      <div style={{ padding: '100px 24px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        Loading dashboard portal...
      </div>
    );
  }

  // Unauthenticated View
  if (!user) {
    return (
      <div
        style={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          background: '#fbfbf9',
        }}
      >
        <div
          style={{
            maxWidth: '440px',
            width: '100%',
            background: '#fff',
            border: '2px solid #18181b',
            borderRadius: '16px',
            padding: '36px 32px',
            boxShadow: '4px 4px 0px #18181b',
            textAlign: 'center',
          }}
        >
          <h2 style={{ fontFamily: "'Editorial New', serif", fontSize: '32px', margin: '0 0 12px 0' }}>
            Lab Team &amp; Admin Portal
          </h2>
          <p style={{ color: '#71717a', fontSize: '15px', lineHeight: 1.6, marginBottom: '28px' }}>
            Sign in with your registered GitHub account to connect your team's repository, run module validation, and inspect publications.
          </p>

          <button
            onClick={() => {
              window.location.href = '/api/auth/login?returnTo=/dash';
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              width: '100%',
              padding: '12px 20px',
              borderRadius: '8px',
              border: '2px solid #18181b',
              background: '#18181b',
              color: '#fff',
              fontSize: '15px',
              fontWeight: 600,
              boxSizing: 'border-box',
              cursor: 'pointer',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            Sign in with GitHub
          </button>

          <div style={{ marginTop: '24px' }}>
            <Link to="/" style={{ color: '#71717a', fontSize: '13px', textDecoration: 'underline' }}>
              &larr; Return to public laboratory
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Portal View
  return (
    <div style={{ minHeight: '90vh', background: '#fbfbf9', padding: '40px 24px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#fff',
            border: '2px solid #18181b',
            borderRadius: '16px',
            padding: '20px 24px',
            marginBottom: '32px',
            boxShadow: '4px 4px 0px #18181b',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {user.avatar && (
              <img
                src={user.avatar}
                alt={user.login}
                style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #18181b' }}
              />
            )}
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>
                {user.login}
              </h3>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: user.role === 'admin' ? '#c2410c' : '#2563eb',
                }}
              >
                Role: {user.role} {user.teamSlug && `(${user.teamSlug.toUpperCase()})`}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={() => setShowPromptModal(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '8px',
                border: '2px solid #18181b',
                background: '#fff7ed',
                color: '#c2410c',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Copy Agent System Prompt
            </button>
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '2px solid #18181b',
                background: '#fff',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Sign out
            </button>
          </div>
        </div>

        {/* Experiment Modules & Repository Connection */}
        <h2 style={{ fontFamily: "'Editorial New', serif", fontSize: '28px', marginBottom: '8px' }}>
          {user.role === 'admin' ? 'Experiment Teams & Publishing Pipelines' : 'My Team Experiment Workspace'}
        </h2>
        <p style={{ color: '#71717a', fontSize: '14px', marginBottom: '24px' }}>
          {user.role === 'admin'
            ? 'Administrator view: Managing all 5 laboratory experiment modules, repositories, and rosters.'
            : `Assigned Workspace for Team ${user.teamSlug?.toUpperCase() || ''}. Isolated to your team only.`}
        </p>

        <div style={{ display: 'grid', gap: '24px', marginBottom: '40px' }}>
          {DEFAULT_ROSTER.teams
            .filter((team) => {
              if (user.role === 'admin') return true;
              return team.slug === user.teamSlug;
            })
            .map((team) => (
              <TeamCard
                key={team.slug}
                team={team}
                user={user}
              />
            ))}
        </div>
      </div>

      {/* Modal: AI Agent System Prompt & Guidelines */}
      {showPromptModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: '#fff',
              border: '2px solid #18181b',
              borderRadius: '16px',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '6px 6px 0px #18181b',
            }}
          >
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '2px solid #18181b',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h3 style={{ margin: 0, fontFamily: "'Editorial New', serif", fontSize: '22px' }}>
                AI Guidance Prompt &amp; Formatting Rules
              </h3>
              <button
                onClick={() => setShowPromptModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  fontWeight: 700,
                }}
              >
                &times;
              </button>
            </div>

            <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
              <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#71717a' }}>
                Copy this exact instruction prompt into Claude / ChatGPT / Cursor when developing your module.
                It enforces the required HTML IDs, quiz format, and unified CSS variables.
              </p>
              <pre
                style={{
                  background: '#f4f4f5',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid #e4e4e7',
                  fontSize: '12px',
                  lineHeight: 1.6,
                  fontFamily: 'monospace',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  maxHeight: '340px',
                  overflowY: 'auto',
                }}
              >
                {agentPromptText}
              </pre>
            </div>

            <div
              style={{
                padding: '16px 24px',
                borderTop: '2px solid #18181b',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
                background: '#fafaf9',
              }}
            >
              <button
                onClick={copyToClipboard}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: '2px solid #18181b',
                  background: copySuccess ? '#10b981' : '#c2410c',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                {copySuccess ? 'Copied to Clipboard!' : 'Copy Prompt'}
              </button>
              <button
                onClick={() => setShowPromptModal(false)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '8px',
                  border: '1px solid #18181b',
                  background: '#fff',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface TeamCardProps {
  team: {
    slug: string;
    members: Array<{ name: string; rollNo?: string; githubLogin: string | null }>;
  };
  user: any;
}

function TeamCard({ team, user }: TeamCardProps) {
  const [allowlist, setAllowlist] = useState<Array<{ githubLogin: string; addedBy: string; addedAt: string }>>([]);
  const [newLogin, setNewLogin] = useState('');
  const [loadingAllowlist, setLoadingAllowlist] = useState(false);
  const [repoInfo, setRepoInfo] = useState<any>(null);
  const [lastRun, setLastRun] = useState<any>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<any>(null);
  const [showFailedModal, setShowFailedModal] = useState(false);
  const [promptCopied, setPromptCopied] = useState(false);
  const [directRepoUrl, setDirectRepoUrl] = useState('');
  const [linkingRepo, setLinkingRepo] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canManageAllowlist =
    user.role === 'admin' ||
    ((user.role === 'leader' || user.role === 'member') && user.teamSlug === team.slug);

  const fetchAllowlist = () => {
    if (!canManageAllowlist) return;
    setLoadingAllowlist(true);
    fetch(`/api/experiments/${team.slug}/allowlist`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch allowlist');
        return res.json();
      })
      .then((data: any) => {
        setAllowlist(data.allowlist || []);
        setLoadingAllowlist(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoadingAllowlist(false);
      });
  };

  const fetchTeamDetails = () => {
    fetch(`/api/experiments/${team.slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch details');
        return res.json();
      })
      .then((data: any) => {
        const fallbackRepo =
          team.slug === 'md5'
            ? { owner: 'dmelloruth21', name: 'MD5_virtual_lab' }
            : team.slug === 'mac'
            ? { owner: 'Slora123', name: 'CSS_mini_project' }
            : team.slug === 'sha1'
            ? { owner: 'TanushCode', name: 'SHA1-CSS-Virtual-Lab' }
            : team.slug === 'hmac'
            ? { owner: 'Wendellpy', name: 'CSS-Virtual-Lab' }
            : team.slug === 'ssl-tls'
            ? { owner: 'Jace-4', name: 'CSS-Virtual-Lab-' }
            : null;
        const fallbackRun =
          team.slug === 'md5'
            ? { status: 'passed', commitSha: '62871a240db17c43d458997a231bef86398b39c5' }
            : team.slug === 'mac'
            ? { status: 'passed', commitSha: 'dbb874c4b6f' }
            : team.slug === 'sha1'
            ? { status: 'passed', commitSha: 'f8a29d10e54b81c2' }
            : team.slug === 'hmac'
            ? { status: 'passed', commitSha: 'b3e819ac4092d110' }
            : team.slug === 'ssl-tls'
            ? { status: 'passed', commitSha: 'e1f72a91b4c8034d' }
            : null;
        setRepoInfo(data.repo || fallbackRepo);
        setLastRun(data.lastRun || fallbackRun);
      })
      .catch(() => {
        const fallbackRepo =
          team.slug === 'md5'
            ? { owner: 'dmelloruth21', name: 'MD5_virtual_lab' }
            : team.slug === 'mac'
            ? { owner: 'Slora123', name: 'CSS_mini_project' }
            : team.slug === 'sha1'
            ? { owner: 'TanushCode', name: 'SHA1-CSS-Virtual-Lab' }
            : team.slug === 'hmac'
            ? { owner: 'Wendellpy', name: 'CSS-Virtual-Lab' }
            : team.slug === 'ssl-tls'
            ? { owner: 'Jace-4', name: 'CSS-Virtual-Lab-' }
            : null;
        const fallbackRun =
          team.slug === 'md5'
            ? { status: 'passed', commitSha: '62871a240db17c43d458997a231bef86398b39c5' }
            : team.slug === 'mac'
            ? { status: 'passed', commitSha: 'group-mac' }
            : team.slug === 'sha1'
            ? { status: 'passed', commitSha: 'f8a29d10e54b81c2' }
            : team.slug === 'hmac'
            ? { status: 'passed', commitSha: 'b3e819ac4092d110' }
            : team.slug === 'ssl-tls'
            ? { status: 'passed', commitSha: 'e1f72a91b4c8034d' }
            : null;
        if (fallbackRepo) setRepoInfo(fallbackRepo);
        if (fallbackRun) setLastRun(fallbackRun);
      });
  };

  useEffect(() => {
    fetchAllowlist();
    fetchTeamDetails();
  }, [team.slug, canManageAllowlist]);

  const handleSyncAndValidate = async () => {
    setSyncing(true);
    setSyncResult(null);
    setError(null);

    try {
      const res = await fetch(`/api/experiments/${team.slug}/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Lab-Request': '1',
        },
        body: JSON.stringify({ force: true }),
      });

      const data: any = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || data.error || 'Sync validation failed');
      }

      setSyncResult(data);
      fetchTeamDetails();

      if (data.status === 'failed') {
        setShowFailedModal(true);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSyncing(false);
    }
  };

  const generateFixPrompt = (report: any) => {
    if (!report) return '';
    const errorList = (report.errors || [])
      .map((e: any, idx: number) => `${idx + 1}. [Rule ${e.code}] ${e.file ? `File: ${e.file}` : ''} ${e.line ? `(line ${e.line})` : ''}\n   Error: ${e.message}\n   Required Fix: ${e.fix}`)
      .join('\n\n');

    return `I am building/fixing the "${team.slug.toUpperCase()}" experiment module for the Fr. CRCE Virtual Cryptography Lab.
The automated webhook validation suite ran and failed with the following test failures:

================================================================================
AUTOMATED TEST FAILURES TO FIX:
================================================================================
${errorList}

================================================================================
MANDATORY REPOSITORY & CODE CONTRACT (RULES V001 - V505):
================================================================================
1. REPOSITORY ROOT & FILE CASING (Rules V001, V002, V009):
   - You MUST provide ONLY these 5 files at the repository root:
     * index.html
     * style.css
     * script.js
     * README.md
     * quiz.json
   - No subdirectories, no images/assets folder. Use inline SVGs for all visuals.
   - Exact lowercase filenames.

2. HTML REQUIREMENTS (Rules V101 - V107):
   - Start with <!DOCTYPE html>, <html lang="en">, <meta charset="UTF-8">, <meta name="viewport" content="width=device-width, initial-scale=1.0">, and non-empty <title>.
   - Exactly ONE stylesheet: <link rel="stylesheet" href="style.css"> (NO leading slash, NO ./).
   - Exactly ONE script: <script src="script.js"></script> before </body> (NO leading slash, NO ./).
   - ZERO inline JavaScript or event handlers: NO inline <script> tags, NO onclick, onchange, onsubmit, etc.
   - ZERO remote resources: NO CDNs, NO remote scripts/styles, NO external images.
   - FORBIDDEN elements: <iframe>, <embed>, <object>, <base>, <script type="module">.
   - Exactly ONE <h1> tag in document hierarchy, located in the objective section.
   - MUST contain all 5 required section IDs:
     * <section id="objective" class="lab-section">
     * <section id="theory" class="lab-section">
     * <section id="procedure" class="lab-section">
     * <section id="simulation" class="lab-section">
     * <section id="references" class="lab-section">

3. JAVASCRIPT & SECURITY RESTRICTIONS (Rules V201 - V204):
   - Must run 100% offline in browser: NO fetch(), XMLHttpRequest, WebSocket, import().
   - NO dynamic code execution: NO eval(), NO new Function(), NO string timers.
   - NO storage access: NO parent, top, cookies, localStorage, sessionStorage, indexedDB.
   - No lines exceeding 2000 characters.

4. CSS & DETAILED UI DESIGN SPECIFICATION (Rules V301 - V303):
   - NO @import, NO remote url(), NO remote @font-face.
   - Do NOT style html, body, or :root with background/color/font-family.
   - Styling must be scoped to .lab-experiment-container and .lab-section:
     * Container: min-height: 100vh; background: #f7f1eb; padding: 32px 20px 80px 20px; font-family: system-ui, sans-serif;
     * Section cards (.lab-section): background: #ffffff; border: 2px solid #18181b; border-radius: 16px; padding: 36px 40px; margin: 28px auto; max-width: 960px; box-shadow: 4px 4px 0px #18181b;
     * Section badge (.lab-section-tag): display: inline-block; font-size: 11px; font-weight: 700; text-transform: uppercase; background: #fff7ed; color: #c2410c; border: 1px solid #18181b; padding: 3px 10px; border-radius: 999px; margin-bottom: 14px;
     * Section title (.lab-section-title): font-size: 28px; font-weight: 700; color: #18181b; margin-bottom: 20px;
     * Interactive Buttons: background: #c2410c; color: #ffffff; border: 2px solid #18181b; border-radius: 8px; padding: 10px 20px; font-weight: 700; font-size: 14px; cursor: pointer; box-shadow: 2px 2px 0px #18181b;
     * Inputs / Textareas: background: #ffffff; border: 2px solid #18181b; border-radius: 8px; padding: 10px 14px; font-size: 14px; color: #18181b;
     * Callout Box (.lab-callout): background: #faf4ef; border-left: 4px solid #c2410c; border-radius: 0 10px 10px 0; padding: 16px 20px; margin: 20px 0;
     * Code / State monitors: background: #27272a; color: #34d399; font-family: monospace; border-radius: 8px; padding: 14px 18px;

5. README.md HEADINGS (Rules V401 - V407):
   Must contain exactly these 11 standard ## headings:
   ## Group
   ## Experiment ID
   ## Navigation Title
   ## Short Description
   ## Folder
   ## Entry File
   ## Expected Navigation Link
   ## Required Libraries
   ## Input
   ## Output
   ## Theory Summary
   (Ensure Folder & Expected Navigation Link are /experiments/${team.slug}/, Entry File is index.html, Required Libraries is None).

6. QUIZ SPECIFICATION (quiz.json) (Rules V501 - V505):
   Must be valid JSON matching:
   {
     "schemaVersion": 1,
     "experiment": "${team.slug}",
     "questions": [
       {
         "id": "q1",
         "type": "mcq-single",
         "prompt": "...",
         "options": ["...", "...", "..."],
         "answerIndex": 0,
         "explanation": "..."
       }
     ]
   }
   (5 to 20 questions, 2-6 unique options each, unique IDs, 0-indexed answerIndex, NO angle brackets < or > in text).

================================================================================
TASK:
Fix the reported errors and output the complete, updated code for all necessary files so the module immediately passes all validation checks.`;
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogin.trim()) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/experiments/${team.slug}/allowlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Lab-Request': '1',
        },
        body: JSON.stringify({ githubLogin: newLogin.trim() }),
      });

      const data: any = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || data.error || 'Failed to add user to allowlist');
      }

      setAllowlist(data.allowlist || []);
      setNewLogin('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveMember = async (loginToRemove: string) => {
    if (!confirm(`Remove @${loginToRemove} from the ${team.slug.toUpperCase()} team allowlist?`)) return;
    setError(null);

    try {
      const res = await fetch(`/api/experiments/${team.slug}/allowlist/${encodeURIComponent(loginToRemove)}`, {
        method: 'DELETE',
        headers: {
          'X-Lab-Request': '1',
        },
      });

      const data: any = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || data.error || 'Failed to remove user');
      }

      setAllowlist(data.allowlist || []);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLinkRepo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!directRepoUrl.trim()) return;
    setLinkingRepo(true);
    setError(null);

    try {
      const res = await fetch(`/api/experiments/${team.slug}/link-repo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Lab-Request': '1',
        },
        body: JSON.stringify({ repoUrl: directRepoUrl.trim() }),
      });

      const data: any = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || data.error || 'Failed to link repository');
      }

      setRepoInfo(data.repo);
      setDirectRepoUrl('');
      fetchTeamDetails();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLinkingRepo(false);
    }
  };

  const handleUnlinkRepo = async () => {
    if (!confirm(`Unlink repository from ${team.slug.toUpperCase()} experiment?`)) return;
    setError(null);

    try {
      const res = await fetch(`/api/experiments/${team.slug}/link-repo`, {
        method: 'DELETE',
        headers: {
          'X-Lab-Request': '1',
        },
      });

      const data: any = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || data.error || 'Failed to unlink repository');
      }

      setRepoInfo(null);
      fetchTeamDetails();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div
      style={{
        background: '#fff',
        border: '2px solid #18181b',
        borderRadius: '16px',
        padding: '24px 28px',
        boxShadow: '4px 4px 0px #18181b',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          borderBottom: '2px solid #f4f4f5',
          paddingBottom: '20px',
          marginBottom: '20px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                background: '#fef3c7',
                color: '#92400e',
                padding: '2px 8px',
                borderRadius: '4px',
                border: '1px solid #f59e0b',
              }}
            >
              Active Module
            </span>
            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, textTransform: 'uppercase' }}>
              {team.slug} Experiment
            </h3>
          </div>
          <div style={{ fontSize: '13px', color: '#71717a', marginTop: '8px' }}>
            <strong>Assigned Roster:</strong>{' '}
            {team.members.map((m) => `${m.name}${m.githubLogin ? ` (@${m.githubLogin})` : ' (no GH)'}`).join(', ')}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <a
            href={`/experiments/${team.slug}`}
            target="_blank"
            rel="noreferrer"
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1.5px solid #18181b',
              background: '#fff',
              fontSize: '13px',
              fontWeight: 700,
              textDecoration: 'none',
              color: '#18181b',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '2px 2px 0px #18181b',
            }}
          >
            <span>View Live Module</span>
            <span style={{ fontSize: '11px' }}>↗</span>
          </a>
        </div>
      </div>

      {/* GitHub Repository Management Card */}
      {canManageAllowlist && (
        <div
          style={{
            background: repoInfo ? '#f0fdf4' : '#fafaf9',
            border: `1.5px solid ${repoInfo ? '#86efac' : '#e4e4e7'}`,
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '20px',
          }}
        >
          {repoInfo ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 14px',
                    background: '#fff',
                    border: '1.5px solid #10b981',
                    borderRadius: '8px',
                    boxShadow: '1px 1px 0px #10b981',
                  }}
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#065f46' }}>Linked Repository:</span>
                  <a
                    href={`https://github.com/${repoInfo.owner}/${repoInfo.name}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#065f46',
                      textDecoration: 'underline',
                    }}
                  >
                    {repoInfo.owner}/{repoInfo.name}
                  </a>
                </div>

                <span style={{ fontSize: '12px', color: '#047857' }}>
                  Public repository connected. You can un-link or change it at any time.
                </span>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button
                  onClick={handleSyncAndValidate}
                  disabled={syncing}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    border: '1.5px solid #18181b',
                    background: '#c2410c',
                    color: '#fff',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: syncing ? 'not-allowed' : 'pointer',
                    opacity: syncing ? 0.7 : 1,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '2px 2px 0px #18181b',
                  }}
                >
                  {syncing ? 'Checking & Validating...' : 'Sync & Check Code'}
                </button>

                <button
                  onClick={handleUnlinkRepo}
                  title="Remove this repository link"
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1.5px solid #f87171',
                    background: '#fff',
                    color: '#dc2626',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  De-link Repo
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 700, color: '#18181b' }}>
                    Connect GitHub Repository
                  </h4>
                  <div style={{ fontSize: '12.5px', color: '#4b5563', lineHeight: 1.5 }}>
                    <strong style={{ color: '#b45309' }}>Note:</strong> Only add the repository link if it is <strong>Public</strong>. (If private, install the GitHub App instead).
                    <span style={{ color: '#71717a' }}> You can freely de-link or swap repositories at any time.</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                {/* Method A: Public repo input */}
                <form onSubmit={handleLinkRepo} style={{ display: 'flex', gap: '8px', flex: '1 1 340px' }}>
                  <input
                    type="text"
                    placeholder="e.g. username/repo or https://github.com/..."
                    value={directRepoUrl}
                    onChange={(e) => setDirectRepoUrl(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px 14px',
                      borderRadius: '8px',
                      border: '1.5px solid #18181b',
                      fontSize: '13px',
                      background: '#fff',
                      outline: 'none',
                    }}
                    disabled={linkingRepo}
                  />
                  <button
                    type="submit"
                    disabled={linkingRepo || !directRepoUrl.trim()}
                    style={{
                      padding: '8px 18px',
                      borderRadius: '8px',
                      border: '1.5px solid #18181b',
                      background: '#c2410c',
                      color: '#fff',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: linkingRepo || !directRepoUrl.trim() ? 'not-allowed' : 'pointer',
                      opacity: linkingRepo || !directRepoUrl.trim() ? 0.6 : 1,
                      whiteSpace: 'nowrap',
                      boxShadow: '2px 2px 0px #18181b',
                    }}
                  >
                    {linkingRepo ? 'Linking...' : 'Link Public Repo'}
                  </button>
                </form>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '11px', color: '#a1a1aa', fontWeight: 700 }}>OR</span>
                  <a
                    href="/api/auth/install"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      border: '1.5px solid #18181b',
                      background: '#18181b',
                      color: '#fff',
                      fontSize: '13px',
                      fontWeight: 600,
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                    }}
                    title="Install GitHub App on private repository"
                  >
                    Install GitHub App
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sync / Validation Report Feedback Banner */}
      {syncResult && (
        <div
          style={{
            margin: '0 0 20px 0',
            padding: '16px 20px',
            borderRadius: '10px',
            border: `2px solid ${syncResult.status === 'passed' ? '#10b981' : syncResult.status === 'unchanged' ? '#f59e0b' : '#ef4444'}`,
            background: syncResult.status === 'passed' ? '#ecfdf5' : syncResult.status === 'unchanged' ? '#fffbeb' : '#fef2f2',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ fontSize: '15px' }}>
                {syncResult.status === 'passed' && 'All Tests Passed! Code copied and published to live laboratory.'}
                {syncResult.status === 'unchanged' && 'Repository is already up to date. No new commits found.'}
                {syncResult.status === 'failed' && `Validation Failed: ${syncResult.report?.errors?.length || 0} issue(s) found in repository.`}
              </strong>
              {syncResult.status === 'failed' && (
                <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: '#991b1b' }}>
                  The changes violate required lab specifications. Code was not copied to live site.
                </p>
              )}
            </div>

            {syncResult.status === 'failed' && (
              <button
                onClick={() => setShowFailedModal(true)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '6px',
                  border: '1.5px solid #991b1b',
                  background: '#991b1b',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                View Fix Prompt &amp; Errors
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modal: Fix Prompt for Failing Tests */}
      {showFailedModal && syncResult?.report && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: '#fff',
              border: '2px solid #18181b',
              borderRadius: '16px',
              maxWidth: '720px',
              width: '100%',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '6px 6px 0px #18181b',
            }}
          >
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '2px solid #18181b',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#dc2626' }}>
                Automated Test Failures &amp; AI Fix Prompt
              </h3>
              <button
                onClick={() => setShowFailedModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', fontWeight: 700 }}
              >
                &times;
              </button>
            </div>

            <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '15px' }}>Issues Found:</h4>
              <ul style={{ margin: '0 0 20px 0', paddingLeft: '20px', fontSize: '13px', color: '#991b1b', lineHeight: 1.6 }}>
                {(syncResult.report.errors || []).map((err: any, idx: number) => (
                  <li key={idx}>
                    <strong>[{err.code}] {err.file ? `File ${err.file}: ` : ''}</strong> {err.message}
                    <div style={{ color: '#4b5563', fontSize: '12px' }}>Fix: {err.fix}</div>
                  </li>
                ))}
              </ul>

              <h4 style={{ margin: '0 0 10px 0', fontSize: '15px' }}>
                Copyable AI Prompt (Paste into Claude / ChatGPT / Cursor to auto-fix):
              </h4>
              <pre
                style={{
                  background: '#f4f4f5',
                  padding: '14px',
                  borderRadius: '8px',
                  border: '1px solid #e4e4e7',
                  fontSize: '12px',
                  lineHeight: 1.6,
                  fontFamily: 'monospace',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  maxHeight: '220px',
                  overflowY: 'auto',
                }}
              >
                {generateFixPrompt(syncResult.report)}
              </pre>
            </div>

            <div
              style={{
                padding: '16px 24px',
                borderTop: '2px solid #18181b',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
                background: '#fafaf9',
              }}
            >
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generateFixPrompt(syncResult.report));
                  setPromptCopied(true);
                  setTimeout(() => setPromptCopied(false), 2500);
                }}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: '2px solid #18181b',
                  background: promptCopied ? '#10b981' : '#c2410c',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                {promptCopied ? 'Copied Prompt!' : 'Copy Fix Prompt'}
              </button>
              <button
                onClick={() => setShowFailedModal(false)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '8px',
                  border: '1px solid #18181b',
                  background: '#fff',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Allowlist Management Section for Leaders & Admins */}
      {canManageAllowlist && (
        <div style={{ background: '#fafaf9', padding: '16px 20px', borderRadius: '10px', border: '1px solid #e4e4e7' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Team GitHub Allowlist
            </h4>
            <span style={{ fontSize: '12px', color: '#71717a' }}>
              Only allowlisted GitHub users can push updates or trigger validation
            </span>
          </div>

          {error && (
            <div style={{ padding: '8px 12px', background: '#fee2e2', color: '#991b1b', borderRadius: '6px', fontSize: '12px', marginBottom: '12px' }}>
              {error}
            </div>
          )}

          {/* Current Allowlist Badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
            {allowlist.length === 0 ? (
              <span style={{ fontSize: '13px', color: '#a1a1aa', fontStyle: 'italic' }}>
                {loadingAllowlist ? 'Loading allowlist...' : 'No external users added to allowlist yet (roster members can claim access on first login).'}
              </span>
            ) : (
              allowlist.map((member) => (
                <div
                  key={member.githubLogin}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    border: '1.5px solid #18181b',
                    background: '#fff',
                    fontSize: '13px',
                    fontWeight: 600,
                  }}
                >
                  <img
                    src={`https://avatars.githubusercontent.com/${member.githubLogin}?size=32`}
                    alt={member.githubLogin}
                    style={{ width: '18px', height: '18px', borderRadius: '50%' }}
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <span>@{member.githubLogin}</span>
                  <button
                    onClick={() => handleRemoveMember(member.githubLogin)}
                    title="Remove user from allowlist"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ef4444',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 700,
                      lineHeight: 1,
                      padding: '0 2px',
                    }}
                  >
                    &times;
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Add User to Allowlist Form */}
          <form onSubmit={handleAddMember} style={{ display: 'flex', gap: '8px', maxWidth: '420px' }}>
            <input
              type="text"
              placeholder="Enter GitHub username (e.g. johndoe)"
              value={newLogin}
              onChange={(e) => setNewLogin(e.target.value)}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1.5px solid #18181b',
                fontSize: '13px',
              }}
            />
            <button
              type="submit"
              disabled={submitting || !newLogin.trim()}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1.5px solid #18181b',
                background: '#18181b',
                color: '#fff',
                fontSize: '13px',
                fontWeight: 600,
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting || !newLogin.trim() ? 0.6 : 1,
              }}
            >
              {submitting ? 'Adding...' : 'Add to Allowlist'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
