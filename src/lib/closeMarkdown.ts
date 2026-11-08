const FENCE = /^ {0,3}(```|~~~)/;

/**
 * Repairs markdown that is still being streamed so it renders cleanly
 * on every update. Handles an unclosed code fence, an unclosed inline
 * code span, and an unclosed or dangling bold marker. Single asterisks
 * are left alone because they are common as list bullets.
 */
export function closeOpenMarkdown(text: string): string {
  const lines = text.split("\n");
  let fence: string | null = null;
  const outside: string[] = [];

  for (const line of lines) {
    const match = FENCE.exec(line);
    if (fence === null) {
      if (match) {
        fence = match[1];
      } else {
        outside.push(line);
      }
    } else if (match && match[1] === fence) {
      fence = null;
    }
  }

  if (fence !== null) {
    return text + (text.endsWith("\n") ? "" : "\n") + fence;
  }

  const plain = outside.join("\n");
  const ticks = (plain.match(/`/g) ?? []).length;
  if (ticks % 2 === 1) return text + "`";

  const withoutCode = plain.replace(/`[^`]*`/g, "");
  const bold = (withoutCode.match(/\*\*/g) ?? []).length;
  if (bold % 2 === 1) {
    const trimmed = text.trimEnd();
    if (trimmed.endsWith("**")) return trimmed.slice(0, -2).trimEnd();
    return trimmed + "**";
  }

  return text;
}
