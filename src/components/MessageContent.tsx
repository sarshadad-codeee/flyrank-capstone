import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import { closeOpenMarkdown } from "@/lib/closeMarkdown";

const components: Components = {
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  ul: ({ children }) => (
    <ul className="mb-2 list-disc pl-5 last:mb-0">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-2 list-decimal pl-5 last:mb-0">{children}</ol>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline underline-offset-2"
    >
      {children}
    </a>
  ),
  pre: ({ children }) => (
    <pre className="mb-2 overflow-x-auto rounded bg-background p-2 text-sm last:mb-0 [&_code]:bg-transparent [&_code]:p-0">
      {children}
    </pre>
  ),
  code: ({ children }) => (
    <code className="rounded bg-background px-1 font-mono text-sm">
      {children}
    </code>
  ),
};

export interface MessageContentProps {
  text: string;
}

/**
 * Renders an assistant message as markdown. Unfinished markdown is
 * repaired first so streaming never shows broken formatting. Raw HTML
 * is not rendered, images are dropped, and unsafe link schemes are
 * removed by the renderer.
 */
export function MessageContent({ text }: MessageContentProps) {
  return (
    <ReactMarkdown components={components} disallowedElements={["img"]}>
      {closeOpenMarkdown(text)}
    </ReactMarkdown>
  );
}
