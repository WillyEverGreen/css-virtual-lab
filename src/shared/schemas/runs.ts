import { z } from 'zod';

export const FindingSchema = z.strictObject({
  code: z.string(),
  severity: z.enum(['error', 'warning']),
  file: z.string().nullable(),
  line: z.number().nullable(),
  message: z.string(),
  fix: z.string(),
});

export const ReportFileSchema = z.strictObject({
  path: z.string(),
  bytes: z.number(),
  blobSha: z.string(),
});

export const ValidationReportSchema = z.strictObject({
  runId: z.string(),
  slug: z.string(),
  commitSha: z.string(),
  branch: z.string(),
  startedAt: z.string(),
  durationMs: z.number(),
  rulesetVersion: z.literal(1),
  status: z.enum(['passed', 'failed']),
  errors: z.array(FindingSchema),
  warnings: z.array(FindingSchema),
  files: z.array(ReportFileSchema),
});

export const RunsSchema = z.strictObject({
  schemaVersion: z.literal(1),
  slug: z.string(),
  runs: z.array(ValidationReportSchema),
});

export type Finding = z.infer<typeof FindingSchema>;
export type ReportFile = z.infer<typeof ReportFileSchema>;
export type ValidationReport = z.infer<typeof ValidationReportSchema>;
export type Runs = z.infer<typeof RunsSchema>;
