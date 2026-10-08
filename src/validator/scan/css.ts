export interface CssScan {
  raw: string;
  cleaned: string;
  lines: string[];
}

export function stripCssComments(src: string): string {
  let result = '';
  let i = 0;
  const len = src.length;
  let inComment = false;

  while (i < len) {
    const ch = src[i];
    const next = i + 1 < len ? src[i + 1] : '';

    if (inComment) {
      if (ch === '*' && next === '/') {
        inComment = false;
        result += '  ';
        i += 2;
      } else {
        result += ch === '\n' ? '\n' : ' ';
        i++;
      }
      continue;
    }

    if (ch === '/' && next === '*') {
      inComment = true;
      result += '  ';
      i += 2;
      continue;
    }

    result += ch;
    i++;
  }

  return result;
}

export function scanCss(src: string): CssScan {
  const cleaned = stripCssComments(src);
  const lines = src.split(/\r?\n/);
  return { raw: src, cleaned, lines };
}
