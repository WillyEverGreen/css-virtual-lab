import { z } from 'zod';

export const RosterMemberSchema = z.strictObject({
  name: z.string().min(1),
  rollNo: z.string().min(1),
  githubLogin: z.string().nullable(),
});

export const RosterTeamSchema = z.strictObject({
  slug: z.enum(['md5', 'sha1', 'mac', 'hmac', 'ssl-tls']),
  members: z.array(RosterMemberSchema),
});

export const RosterSchema = z.strictObject({
  schemaVersion: z.literal(1),
  teams: z.array(RosterTeamSchema),
});

export type RosterMember = z.infer<typeof RosterMemberSchema>;
export type RosterTeam = z.infer<typeof RosterTeamSchema>;
export type Roster = z.infer<typeof RosterSchema>;
