export interface HtmlTag {
  name: string;
  isClosing: boolean;
  isSelfClosing: boolean;
  attrs: Record<string, string>;
  line: number;
  body?: string; // Text content if tag is <script> or <style>
}

export interface HtmlScan {
  raw: string;
  hasDoctype: boolean;
  tags: HtmlTag[];
}

export function scanHtml(src: string): HtmlScan {
  const hasDoctype = /^\s*<!DOCTYPE\s+html/i.test(src);
  const tags: HtmlTag[] = [];

  let line = 1;
  let i = 0;
  const len = Math.min(src.length, 1024 * 1024); // 1 MiB cap

  while (i < len) {
    const ch = src[i];
    if (ch === '\n') {
      line++;
      i++;
      continue;
    }

    // Check for comment <!-- ... -->
    if (src.startsWith('<!--', i)) {
      const end = src.indexOf('-->', i + 4);
      if (end === -1) break;
      // Count newlines in comment
      for (let k = i; k < end + 3; k++) {
        if (src[k] === '\n') line++;
      }
      i = end + 3;
      continue;
    }

    // Tag opening '<'
    if (ch === '<' && i + 1 < len && (src[i + 1] === '/' || /[a-zA-Z!]/.test(src[i + 1]))) {
      const tagStartLine = line;
      i++;
      const isClosing = src[i] === '/';
      if (isClosing) i++;

      // Tag name
      const nameStart = i;
      while (i < len && /[a-zA-Z0-9-]/.test(src[i])) {
        i++;
      }
      const tagName = src.slice(nameStart, i).toLowerCase();

      // Skip DOCTYPE if encountered
      if (tagName === '!doctype') {
        while (i < len && src[i] !== '>') {
          if (src[i] === '\n') line++;
          i++;
        }
        if (i < len && src[i] === '>') i++;
        continue;
      }

      // Attributes
      const attrs: Record<string, string> = {};
      let isSelfClosing = false;

      while (i < len && src[i] !== '>') {
        const c = src[i];
        if (c === '\n') {
          line++;
          i++;
          continue;
        }
        if (/\s/.test(c)) {
          i++;
          continue;
        }
        if (c === '/' && i + 1 < len && src[i + 1] === '>') {
          isSelfClosing = true;
          i++;
          break;
        }

        // Attribute name
        const attrNameStart = i;
        while (i < len && /[^\s=>/]/.test(src[i])) {
          i++;
        }
        const attrName = src.slice(attrNameStart, i).toLowerCase();

        // Check for '='
        while (i < len && /\s/.test(src[i])) {
          if (src[i] === '\n') line++;
          i++;
        }

        let attrVal = '';
        if (i < len && src[i] === '=') {
          i++;
          while (i < len && /\s/.test(src[i])) {
            if (src[i] === '\n') line++;
            i++;
          }
          if (i < len && (src[i] === '"' || src[i] === "'")) {
            const quote = src[i];
            i++;
            const valStart = i;
            while (i < len && src[i] !== quote) {
              if (src[i] === '\n') line++;
              i++;
            }
            attrVal = src.slice(valStart, i);
            if (i < len && src[i] === quote) i++;
          } else {
            // Unquoted attr value
            const valStart = i;
            while (i < len && /[^\s>]/.test(src[i])) {
              i++;
            }
            attrVal = src.slice(valStart, i);
          }
        }
        if (attrName) {
          attrs[attrName] = attrVal;
        }
      }

      if (i < len && src[i] === '>') {
        i++;
      }

      let body: string | undefined;

      // Special handling for <script> and <style> bodies until closing tag
      if (!isClosing && (tagName === 'script' || tagName === 'style')) {
        const closeTag = `</${tagName}>`;
        const closeIdx = src.toLowerCase().indexOf(closeTag, i);
        if (closeIdx !== -1) {
          body = src.slice(i, closeIdx);
          for (let k = i; k < closeIdx; k++) {
            if (src[k] === '\n') line++;
          }
          i = closeIdx; // will parse </script> in next iteration
        }
      }

      if (tagName) {
        tags.push({
          name: tagName,
          isClosing,
          isSelfClosing,
          attrs,
          line: tagStartLine,
          body,
        });
      }
      continue;
    }

    i++;
  }

  return { raw: src, hasDoctype, tags };
}
