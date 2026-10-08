import type {
  Finding,
  ReportFile,
  Rule,
  RuleContext,
  ValidationContext,
  ValidationReport,
} from './types';
import { scanHtml } from './scan/html';
import { scanJs } from './scan/js';
import { scanCss } from './scan/css';
import { scanReadme } from './scan/markdown';
import { computeBlobSha, formatFinding, sortFindings } from './report';
import { LIMITS } from '../shared/config/limits';
import { generateId, nowIso } from '../shared/ids';

const rulesRegistry: Rule[] = [];

export function registerRule(rule: Rule): void {
  // Prevent duplicate rule registration
  const idx = rulesRegistry.findIndex((r) => r.code === rule.code);
  if (idx >= 0) {
    rulesRegistry[idx] = rule;
  } else {
    rulesRegistry.push(rule);
  }
}

export function getRegisteredRules(): Rule[] {
  return [...rulesRegistry];
}

export async function validate(
  files: Map<string, Uint8Array>,
  ctx: ValidationContext
): Promise<ValidationReport> {
  const startTime = Date.now();
  const textCache = new Map<string, string | null>();

  const textReader = (path: string): string | null => {
    if (textCache.has(path)) return textCache.get(path)!;
    const buf = files.get(path);
    if (!buf) {
      textCache.set(path, null);
      return null;
    }
    try {
      const decoded = new TextDecoder('utf-8', { fatal: true }).decode(buf);
      textCache.set(path, decoded);
      return decoded;
    } catch {
      textCache.set(path, null);
      return null;
    }
  };

  // Run structure rules first (§7.6)
  const structureRules = rulesRegistry.filter((r) => r.appliesTo === 'structure');
  const baseRuleContext: RuleContext = {
    files,
    text: textReader,
    experiment: ctx.experiment,
  };

  const findings: Finding[] = [];
  const affectedFilesSkipped = new Set<string>();

  for (const rule of structureRules) {
    const res = rule.run(baseRuleContext);
    for (const f of res) {
      findings.push(f);
      // Skip content rules for files hit by critical structure codes (§7.6)
      if (['V001', 'V003', 'V005', 'V009'].includes(f.code) && f.file) {
        affectedFilesSkipped.add(f.file);
      }
    }
  }

  // Pre-scan files if they are not skipped
  let htmlScan = undefined;
  if (!affectedFilesSkipped.has('index.html')) {
    const htmlSrc = textReader('index.html');
    if (htmlSrc !== null) htmlScan = scanHtml(htmlSrc);
  }

  let jsScan = undefined;
  if (!affectedFilesSkipped.has('script.js')) {
    const jsSrc = textReader('script.js');
    if (jsSrc !== null) jsScan = scanJs(jsSrc);
  }

  let cssScan = undefined;
  if (!affectedFilesSkipped.has('style.css')) {
    const cssSrc = textReader('style.css');
    if (cssSrc !== null) cssScan = scanCss(cssSrc);
  }

  let mdScan = undefined;
  if (!affectedFilesSkipped.has('README.md')) {
    const mdSrc = textReader('README.md');
    if (mdSrc !== null) mdScan = scanReadme(mdSrc);
  }

  const enrichedContext: RuleContext = {
    ...baseRuleContext,
    html: htmlScan,
    js: jsScan,
    css: cssScan,
    md: mdScan,
  };

  // Content rules
  const contentRules = rulesRegistry.filter((r) => r.appliesTo !== 'structure');
  for (const rule of contentRules) {
    if (
      (rule.appliesTo === 'index.html' && affectedFilesSkipped.has('index.html')) ||
      (rule.appliesTo === 'script.js' && affectedFilesSkipped.has('script.js')) ||
      (rule.appliesTo === 'style.css' && affectedFilesSkipped.has('style.css')) ||
      (rule.appliesTo === 'README.md' && affectedFilesSkipped.has('README.md')) ||
      (rule.appliesTo === 'quiz.json' && affectedFilesSkipped.has('quiz.json'))
    ) {
      continue;
    }
    const res = rule.run(enrichedContext);
    for (const f of res) {
      findings.push(f);
    }
  }

  // Sort findings
  let sorted = sortFindings(findings);

  // Cap at 100 findings (§7.5, V999)
  if (sorted.length > LIMITS.MAX_FINDINGS_PER_RUN) {
    sorted = sorted.slice(0, LIMITS.MAX_FINDINGS_PER_RUN);
    sorted.push(formatFinding('V999', {}));
  }

  const errors = sorted.filter((f) => f.severity === 'error');
  const warnings = sorted.filter((f) => f.severity === 'warning');

  // Compute file reports
  const fileReports: ReportFile[] = [];
  for (const [path, bytes] of files.entries()) {
    const blobSha = await computeBlobSha(bytes);
    fileReports.push({
      path,
      bytes: bytes.length,
      blobSha,
    });
  }

  return {
    runId: ctx.runId || generateId(),
    slug: ctx.experiment.slug,
    commitSha: ctx.commitSha || '0000000000000000000000000000000000000000',
    branch: ctx.branch || 'main',
    startedAt: ctx.startedAt || nowIso(),
    durationMs: Date.now() - startTime,
    rulesetVersion: 1,
    status: errors.length === 0 ? 'passed' : 'failed',
    errors,
    warnings,
    files: fileReports,
  };
}

export * from './types';
export * from './report';
export * from './scan/html';
export * from './scan/js';
export * from './scan/css';
export * from './scan/markdown';
