import type { Finding } from './types';
import rulesetData from '../../rules/ruleset.v1.json';

export async function computeBlobSha(bytes: Uint8Array): Promise<string> {
  const header = `blob ${bytes.length}\0`;
  const headerBytes = new TextEncoder().encode(header);
  const combined = new Uint8Array(headerBytes.length + bytes.length);
  combined.set(headerBytes);
  combined.set(bytes, headerBytes.length);

  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const hashBuffer = await crypto.subtle.digest('SHA-1', combined);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  // Fallback Node
  const nodeCrypto = await import('node:crypto');
  return nodeCrypto.createHash('sha1').update(combined).digest('hex');
}

export function formatFinding(
  code: string,
  params: Record<string, string | number | null> = {},
  file: string | null = null,
  line: number | null = null
): Finding {
  const ruleMeta = (rulesetData.rules as Record<string, { severity: 'error' | 'warning'; message: string; fix: string }>)[code];
  let message = ruleMeta ? ruleMeta.message : code;
  let fix = ruleMeta ? ruleMeta.fix : '';
  const severity = ruleMeta ? ruleMeta.severity : 'error';

  for (const [k, v] of Object.entries(params)) {
    const placeholder = `{${k}}`;
    const strVal = v === null ? '' : String(v);
    message = message.replaceAll(placeholder, strVal);
    fix = fix.replaceAll(placeholder, strVal);
  }

  return {
    code,
    severity,
    file,
    line,
    message,
    fix,
  };
}

export function sortFindings(findings: Finding[]): Finding[] {
  return [...findings].sort((a, b) => {
    // 1. Severity: error before warning
    if (a.severity !== b.severity) {
      return a.severity === 'error' ? -1 : 1;
    }
    // 2. File: nulls last
    const fileA = a.file || '';
    const fileB = b.file || '';
    if (fileA !== fileB) {
      if (!a.file) return 1;
      if (!b.file) return -1;
      return fileA.localeCompare(fileB);
    }
    // 3. Line: nulls last, then numerical
    const lineA = a.line ?? 999999;
    const lineB = b.line ?? 999999;
    return lineA - lineB;
  });
}
