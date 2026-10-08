import { z } from 'zod';

export const AuditActorRoleSchema = z.enum(['admin', 'leader', 'member', 'system']);

export const AuditActorSchema = z.strictObject({
  login: z.string(),
  githubId: z.number().nullable(),
  role: AuditActorRoleSchema,
});

export const AuditActionSchema = z.enum([
  'team.claim',
  'team.repo.link',
  'team.refresh',
  'team.allowlist.add',
  'team.allowlist.remove',
  'admin.team.refresh',
  'admin.allowlist.set',
  'team.autopublish',
  'admin.publish',
  'admin.unpublish',
  'admin.rollback',
  'auth.login.denied',
  'admin.comments.export',
]);

export const AuditEntrySchema = z.strictObject({
  ts: z.string(),
  actor: AuditActorSchema,
  action: AuditActionSchema,
  slug: z.string().nullable(),
  details: z.record(z.string(), z.unknown()),
});

export const AuditLogSchema = z.strictObject({
  schemaVersion: z.literal(1),
  month: z.string(), // YYYY-MM
  entries: z.array(AuditEntrySchema),
});

export type AuditActor = z.infer<typeof AuditActorSchema>;
export type AuditAction = z.infer<typeof AuditActionSchema>;
export type AuditEntry = z.infer<typeof AuditEntrySchema>;
export type AuditLog = z.infer<typeof AuditLogSchema>;
