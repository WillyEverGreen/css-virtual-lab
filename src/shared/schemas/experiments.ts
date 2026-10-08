import { z } from 'zod';

export const ExperimentConfigItemSchema = z.strictObject({
  slug: z.enum(['md5', 'sha1', 'mac', 'hmac', 'ssl-tls']),
  order: z.number(),
  groupLabel: z.string(),
  title: z.string(),
  shortDescription: z.string(),
  experimentId: z.string().nullable(),
  readmeGroupValues: z.array(z.string()),
  readmeInput: z.string().nullable(),
  readmeOutput: z.string().nullable(),
});

export const ExperimentsConfigSchema = z.strictObject({
  schemaVersion: z.literal(1),
  experiments: z.array(ExperimentConfigItemSchema),
});

export type ExperimentConfigItem = z.infer<typeof ExperimentConfigItemSchema>;
export type ExperimentsConfig = z.infer<typeof ExperimentsConfigSchema>;
