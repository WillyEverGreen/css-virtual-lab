export interface JsScan {
  raw: string;
  cleaned: string;
  lines: string[];
}

export function lineOf(src: string, offset: number): number {
  let line = 1;
  const bound = Math.min(offset, src.length);
  for (let i = 0; i < bound; i++) {
    if (src[i] === '\n') line++;
  }
  return line;
}

export function stripJsComments(src: string): string {
  let result = '';
  let i = 0;
  const len = src.length;

  let inSingleQuote = false;
  let inDoubleQuote = false;
  let inTemplate = false;
  let inRegex = false;
  let inBlockComment = false;
  let inLineComment = false;

  while (i < len) {
    const ch = src[i];
    const next = i + 1 < len ? src[i + 1] : '';

    if (inLineComment) {
      if (ch === '\n') {
        inLineComment = false;
        result += '\n';
      } else {
        result += ' ';
      }
      i++;
      continue;
    }

    if (inBlockComment) {
      if (ch === '*' && next === '/') {
        inBlockComment = false;
        result += '  ';
        i += 2;
      } else {
        result += ch === '\n' ? '\n' : ' ';
        i++;
      }
      continue;
    }

    if (inSingleQuote) {
      result += ch;
      if (ch === '\\') {
        if (i + 1 < len) {
          result += src[i + 1];
          i += 2;
          continue;
        }
      } else if (ch === "'") {
        inSingleQuote = false;
      }
      i++;
      continue;
    }

    if (inDoubleQuote) {
      result += ch;
      if (ch === '\\') {
        if (i + 1 < len) {
          result += src[i + 1];
          i += 2;
          continue;
        }
      } else if (ch === '"') {
        inDoubleQuote = false;
      }
      i++;
      continue;
    }

    if (inTemplate) {
      result += ch;
      if (ch === '\\') {
        if (i + 1 < len) {
          result += src[i + 1];
          i += 2;
          continue;
        }
      } else if (ch === '`') {
        inTemplate = false;
      }
      i++;
      continue;
    }

    if (inRegex) {
      result += ch;
      if (ch === '\\') {
        if (i + 1 < len) {
          result += src[i + 1];
          i += 2;
          continue;
        }
      } else if (ch === '/') {
        inRegex = false;
      }
      i++;
      continue;
    }

    // Check comment start
    if (ch === '/' && next === '/') {
      inLineComment = true;
      result += '  ';
      i += 2;
      continue;
    }

    if (ch === '/' && next === '*') {
      inBlockComment = true;
      result += '  ';
      i += 2;
      continue;
    }

    // Check string or template start
    if (ch === "'") {
      inSingleQuote = true;
      result += ch;
      i++;
      continue;
    }

    if (ch === '"') {
      inDoubleQuote = true;
      result += ch;
      i++;
      continue;
    }

    if (ch === '`') {
      inTemplate = true;
      result += ch;
      i++;
      continue;
    }

    // Regex literal heuristics: slash following ( = : [ , ! & | ; or return
    if (ch === '/') {
      const prevNonWs = result.trimEnd().slice(-1);
      if (/^[(=:,!&|;[]$/.test(prevNonWs) || result.trimEnd().endsWith('return')) {
        inRegex = true;
        result += ch;
        i++;
        continue;
      }
    }

    result += ch;
    i++;
  }

  return result;
}

export function scanJs(src: string): JsScan {
  const cleaned = stripJsComments(src);
  const lines = src.split(/\r?\n/);
  return { raw: src, cleaned, lines };
}
