import { z } from 'zod';

export const TeamLeaderSchema = z.strictObject({
  githubId: z.number(),
  githubLogin: z.string(),
  claimedAt: z.string(),
});

export const TeamAllowlistEntrySchema = z.strictObject({
  githubId: z.number().nullable(),
  githubLogin: z.string(),
  addedBy: z.string(),
  addedAt: z.string(),
});

export const TeamRepoSchema = z.strictObject({
  installationId: z.number(),
  repoId: z.number(),
  owner: z.string(),
  name: z.string(),
  linkedAt: z.string(),
  linkedBy: z.string(),
});

export const TeamLastRunSchema = z.strictObject({
  runId: z.string(),
  at: z.string(),
  commitSha: z.string(),
  status: z.enum(['passed', 'failed']),
});

export const SnapshotFileInfoSchema = z.strictObject({
  blobSha: z.string(),
  bytes: z.number(),
});

export const TeamSnapshotSchema = z.strictObject({
  commitSha: z.string(),
  at: z.string(),
  files: z.record(z.string(), SnapshotFileInfoSchema),
});

export const TeamLiveSchema = z.strictObject({
  snapshotCommitSha: z.string(),
  mainCommitSha: z.string(),
  publishedAt: z.string(),
  publishedBy: z.string(),
});

export const TeamSchema = z.strictObject({
  schemaVersion: z.literal(1),
  slug: z.enum(['md5', 'sha1', 'mac', 'hmac', 'ssl-tls']),
  leader: TeamLeaderSchema.nullable(),
  allowlist: z.array(TeamAllowlistEntrySchema),
  repo: TeamRepoSchema.nullable(),
  lastRun: TeamLastRunSchema.nullable(),
  snapshots: z.array(TeamSnapshotSchema),
  live: TeamLiveSchema.nullable(),
  held: z.boolean(),
  updatedAt: z.string(),
});

export type TeamLeader = z.infer<typeof TeamLeaderSchema>;
export type TeamAllowlistEntry = z.infer<typeof TeamAllowlistEntrySchema>;
export type TeamRepo = z.infer<typeof TeamRepoSchema>;
export type TeamLastRun = z.infer<typeof TeamLastRunSchema>;
export type TeamSnapshot = z.infer<typeof TeamSnapshotSchema>;
export type TeamLive = z.infer<typeof TeamLiveSchema>;
export type Team = z.infer<typeof TeamSchema>;
