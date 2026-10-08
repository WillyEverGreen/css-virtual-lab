export interface ReadmeHeading {
  text: string;
  value: string;
  line: number;
}

export interface MdScan {
  raw: string;
  headings: ReadmeHeading[];
}

export function scanReadme(src: string): MdScan {
  // Strip BOM if present
  const cleanSrc = src.replace(/^\uFEFF/, '');
  const lines = cleanSrc.split(/\r?\n/);

  const headings: ReadmeHeading[] = [];
  let currentHeading: { text: string; line: number; valueLines: string[] } | null = null;

  for (let idx = 0; idx < lines.length; idx++) {
    const lineNum = idx + 1;
    const line = lines[idx];

    // Check for level-2 heading: ## Heading Text
    const match = line.match(/^##\s+(.+)$/);
    if (match) {
      if (currentHeading) {
        const val = currentHeading.valueLines.join('\n').replace(/`/g, '').trim();
        headings.push({
          text: currentHeading.text,
          value: val,
          line: currentHeading.line,
        });
      }
      currentHeading = {
        text: match[1].trim(),
        line: lineNum,
        valueLines: [],
      };
    } else if (currentHeading) {
      currentHeading.valueLines.push(line);
    }
  }

  if (currentHeading) {
    const val = currentHeading.valueLines.join('\n').replace(/`/g, '').trim();
    headings.push({
      text: currentHeading.text,
      value: val,
      line: currentHeading.line,
    });
  }

  return { raw: src, headings };
}
