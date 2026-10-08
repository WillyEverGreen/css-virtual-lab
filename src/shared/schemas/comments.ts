import { z } from 'zod';

export const CommentRecordSchema = z.strictObject({
  id: z.string(),
  name: z.string(),
  message: z.string(),
  createdAt: z.string(),
});

export const CommentsSchema = z.strictObject({
  schemaVersion: z.literal(1),
  slug: z.string(),
  comments: z.array(CommentRecordSchema),
});

export type CommentRecord = z.infer<typeof CommentRecordSchema>;
export type Comments = z.infer<typeof CommentsSchema>;
