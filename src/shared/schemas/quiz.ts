import { z } from 'zod';
import { LIMITS } from '../config/limits';

// Helper to check for raw HTML tags (V505)
const noHtml = (val: string) => !/[<>]/.test(val);

export const QuizQuestionSchema = z.strictObject({
  id: z.string().min(1),
  type: z.literal('mcq-single'),
  prompt: z
    .string()
    .min(1)
    .max(LIMITS.QUIZ_MAX_PROMPT_CHARS)
    .refine(noHtml, { message: 'HTML tags not allowed in prompt' }),
  options: z
    .array(
      z
        .string()
        .min(1)
        .max(LIMITS.QUIZ_MAX_OPTION_CHARS)
        .refine(noHtml, { message: 'HTML tags not allowed in options' })
    )
    .min(LIMITS.QUIZ_MIN_OPTIONS)
    .max(LIMITS.QUIZ_MAX_OPTIONS)
    .refine((opts) => new Set(opts).size === opts.length, {
      message: 'Duplicate option text found',
    }),
  answerIndex: z.number().int().min(0),
  explanation: z
    .string()
    .min(1)
    .max(LIMITS.QUIZ_MAX_EXPLANATION_CHARS)
    .refine(noHtml, { message: 'HTML tags not allowed in explanation' }),
}).refine((q) => q.answerIndex < q.options.length, {
  message: 'answerIndex out of range for options array',
  path: ['answerIndex'],
});

export const QuizSchema = z.strictObject({
  schemaVersion: z.literal(1),
  experiment: z.enum(['md5', 'sha1', 'mac', 'hmac', 'ssl-tls']),
  questions: z
    .array(QuizQuestionSchema)
    .min(LIMITS.QUIZ_MIN_QUESTIONS)
    .max(LIMITS.QUIZ_MAX_QUESTIONS)
    .refine(
      (qs) => {
        const ids = qs.map((q) => q.id);
        return new Set(ids).size === ids.length;
      },
      { message: 'Duplicate question id found', path: ['questions'] }
    ),
});

export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;
export type Quiz = z.infer<typeof QuizSchema>;
