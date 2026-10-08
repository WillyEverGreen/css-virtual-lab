import type { ExperimentConfigItem } from '../shared/schemas/experiments';
import type { HtmlScan } from './scan/html';
import type { JsScan } from './scan/js';
import type { CssScan } from './scan/css';
import type { MdScan } from './scan/markdown';

export type FindingSeverity = 'error' | 'warning';

export interface Finding {
  code: string;
  severity: FindingSeverity;
  file: string | null;
  line: number | null;
  message: string;
  fix: string;
}

export interface ReportFile {
  path: string;
  bytes: number;
  blobSha: string;
}

export interface ValidationReport {
  runId: string;
  slug: string;
  commitSha: string;
  branch: string;
  startedAt: string;
  durationMs: number;
  rulesetVersion: 1;
  status: 'passed' | 'failed';
  errors: Finding[];
  warnings: Finding[];
  files: ReportFile[];
}

export interface RuleContext {
  files: Map<string, Uint8Array>;
  text: (path: string) => string | null;
  html?: HtmlScan;
  js?: JsScan;
  css?: CssScan;
  md?: MdScan;
  experiment: ExperimentConfigItem;
}

export interface Rule {
  code: string;
  severity: FindingSeverity;
  appliesTo:
    | 'structure'
    | 'index.html'
    | 'script.js'
    | 'style.css'
    | 'README.md'
    | 'quiz.json';
  run: (ctx: RuleContext) => Finding[];
}

export interface ValidationContext {
  experiment: ExperimentConfigItem;
  rulesetVersion: 1;
  runId?: string;
  commitSha?: string;
  branch?: string;
  startedAt?: string;
}
