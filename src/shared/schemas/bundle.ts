import { z } from 'zod';

export const ExperimentBundleSchema = z.strictObject({
  schemaVersion: z.literal(1),
  slug: z.enum(['md5', 'sha1', 'mac', 'hmac', 'ssl-tls']),
  commitSha: z.string(),
  files: z.record(z.string(), z.string()), // relative file path -> base64 string
  updatedAt: z.string(),
});

export type ExperimentBundle = z.infer<typeof ExperimentBundleSchema>;
