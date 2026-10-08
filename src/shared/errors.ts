export type ErrorCode =
  | 'E_VALIDATION'
  | 'E_CAPTCHA'
  | 'E_UNAUTHENTICATED'
  | 'E_FORBIDDEN'
  | 'E_CSRF'
  | 'E_NOT_FOUND'
  | 'E_CONFLICT'
  | 'E_NO_REPO'
  | 'E_SNAPSHOT_INVALID'
  | 'E_COMMENTS_FULL'
  | 'E_PAYLOAD_TOO_LARGE'
  | 'E_REPO_ACCESS_LOST'
  | 'E_RATE_LIMITED'
  | 'E_INTERNAL'
  | 'E_GITHUB_UNAVAILABLE';

export const ERROR_STATUS_MAP: Record<ErrorCode, number> = {
  E_VALIDATION: 400,
  E_CAPTCHA: 400,
  E_UNAUTHENTICATED: 401,
  E_FORBIDDEN: 403,
  E_CSRF: 403,
  E_NOT_FOUND: 404,
  E_CONFLICT: 409,
  E_NO_REPO: 409,
  E_SNAPSHOT_INVALID: 409,
  E_COMMENTS_FULL: 409,
  E_PAYLOAD_TOO_LARGE: 413,
  E_REPO_ACCESS_LOST: 422,
  E_RATE_LIMITED: 429,
  E_INTERNAL: 500,
  E_GITHUB_UNAVAILABLE: 502,
};

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly status: number;
  readonly field?: string;
  readonly details?: unknown;

  get statusCode(): number {
    return this.status;
  }

  constructor(code: ErrorCode, message: string, field?: string, details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = ERROR_STATUS_MAP[code] || 500;
    this.field = field;
    this.details = details;
  }
}
