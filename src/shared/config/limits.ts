// Limits and thresholds defined by PRD v1.1.
// Values tagged with [P] are proposed defaults and can be adjusted here.
// Values tagged with [OPEN] are pending owner decision.

export const LIMITS = {
  // File size & tree limits (PRD §7.4 V004, V007)
  MAX_FILE_BYTES: 1 * 1024 * 1024, // 1 MiB [P]
  MAX_TOTAL_BYTES: 3 * 1024 * 1024, // 3 MiB [P]
  MAX_TREE_ENTRIES: 50, // [P]
  MAX_SCRIPT_LINE_CHARS: 2000, // [P]

  // README constraints (PRD §7.4 V403, V407)
  README_EXPERIMENT_ID_REGEX: /^EXP\d{2}$/, // [P]
  README_MAX_NAV_TITLE_CHARS: 60, // [P]
  README_MAX_SHORT_DESC_CHARS: 200, // [P]

  // Quiz limits (PRD §7.4 V503, V504, V505)
  QUIZ_MIN_QUESTIONS: 5, // [P]
  QUIZ_MAX_QUESTIONS: 20, // [P]
  QUIZ_MIN_OPTIONS: 2, // [P]
  QUIZ_MAX_OPTIONS: 6, // [P]
  QUIZ_MAX_PROMPT_CHARS: 500, // [P]
  QUIZ_MAX_OPTION_CHARS: 200, // [P]
  QUIZ_MAX_EXPLANATION_CHARS: 800, // [P]

  // Validation report limits (PRD §7.5)
  MAX_FINDINGS_PER_RUN: 100, // [P]
  TYPICAL_CPU_BUDGET_MS: 25, // [P]
  MAX_CPU_BUDGET_MS: 150, // [P]

  // Datastore & Staging limits (PRD §4.3, §7.7)
  MAX_SNAPSHOTS_KEPT: 5, // [P]
  MAX_RUNS_KEPT: 20, // [P]
  OPTIMISTIC_CONCURRENCY_RETRIES: 5, // [P]
  ROSTER_CACHE_TTL_MS: 10_000, // 10 s [P]

  // Auth & Session (PRD §5.3)
  SESSION_MAX_AGE_SECONDS: 28800, // 8 hours [P]
  ALLOWLIST_ROSTER_ONLY: false, // Allow leaders to add any valid GitHub username

  // Comments limits (PRD §13.2)
  COMMENT_NAME_MIN_CHARS: 2, // [P]
  COMMENT_NAME_MAX_CHARS: 40, // [P]
  COMMENT_MSG_MIN_CHARS: 5, // [P]
  COMMENT_MSG_MAX_CHARS: 1000, // [P]
  COMMENT_MAX_PAYLOAD_BYTES: 8 * 1024, // 8 KiB (FR-CMT-08)
  COMMENT_FILE_CAP_ITEMS: 2000, // 2,000 comments [P]
  COMMENT_FILE_CAP_BYTES: 800 * 1024, // 800 KB [P]

  // OPEN: Rate limiting (PRD FR-CMT-07 / OI-03)
  // Owner wrote "max 20 per ...". Unit missing. Left disabled until resolved.
  commentLimits: {
    max: null,
    per: null,
  } as { max: number | null; per: number | null },
} as const;
