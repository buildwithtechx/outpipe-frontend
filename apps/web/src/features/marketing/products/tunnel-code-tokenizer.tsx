export type TunnelCodeToken = {
  id: string;
  text: string;
  kind: 'plain' | 'keyword' | 'string' | 'number' | 'comment';
};

export function tokenizeTunnelCode(source: string): TunnelCodeToken[] {
  const tokens: TunnelCodeToken[] = [];
  const pattern =
    /\/\/[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:import|from|export|default|const|let|await|async|function|return)\b|\b\d+(?:\.\d+)?\b/g;
  let cursor = 0;
  for (const match of source.matchAll(pattern)) {
    const start = match.index;
    if (start > cursor) {
      tokens.push({
        id: `plain-${cursor}`,
        text: source.slice(cursor, start),
        kind: 'plain',
      });
    }
    const text = match[0];
    const kind = text.startsWith('//')
      ? 'comment'
      : text.startsWith('"') || text.startsWith("'")
        ? 'string'
        : /^\d/.test(text)
          ? 'number'
          : 'keyword';
    tokens.push({ id: `${kind}-${start}`, text, kind });
    cursor = start + text.length;
  }
  if (cursor < source.length) {
    tokens.push({
      id: `plain-${cursor}`,
      text: source.slice(cursor),
      kind: 'plain',
    });
  }
  return tokens;
}

export function HighlightedTunnelCode({
  source,
  styles,
}: {
  source: string;
  styles: Record<string, string>;
}) {
  return (
    <>
      {tokenizeTunnelCode(source).map((token) =>
        token.kind === 'plain' ? (
          token.text
        ) : (
          <span key={token.id} className={styles[`${token.kind}Token`]}>
            {token.text}
          </span>
        ),
      )}
    </>
  );
}
