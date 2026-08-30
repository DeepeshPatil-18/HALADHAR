/**
 * MarkdownMessage — renders AI responses as clean formatted text.
 *
 * Uses react-markdown to render Markdown safely.
 * No raw HTML allowed. No dangerous content executed.
 *
 * Supported: headings, bold, italic, bullet lists, numbered lists, paragraphs.
 */

import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';

interface Props {
  content: string;
  /** Dark background variant (user bubble) — renders white text */
  dark?: boolean;
}

/* Shared style helpers */
const baseText = (dark: boolean): React.CSSProperties => ({
  color: dark ? 'rgba(255,255,255,0.95)' : 'var(--haladhar-text-primary)',
});

export function MarkdownMessage({ content, dark = false }: Props) {
  const components: Components = {
    /* ── Paragraphs ─────────────────────────────────────────── */
    p({ children }) {
      return (
        <p style={{
          ...baseText(dark),
          fontSize: 'var(--text-base)',
          lineHeight: 1.6,
          margin: '0 0 6px 0',
        }}>
          {children}
        </p>
      );
    },

    /* ── Headings ──────────────────────────────────────────── */
    h1({ children }) {
      return <p style={{ ...baseText(dark), fontWeight: 700, fontSize: 'var(--text-lg)', margin: '8px 0 4px 0' }}>{children}</p>;
    },
    h2({ children }) {
      return <p style={{ ...baseText(dark), fontWeight: 700, fontSize: 'var(--text-base)', margin: '8px 0 4px 0' }}>{children}</p>;
    },
    h3({ children }) {
      return <p style={{ ...baseText(dark), fontWeight: 600, fontSize: 'var(--text-base)', margin: '6px 0 3px 0' }}>{children}</p>;
    },
    h4: ({ children }) => <p style={{ ...baseText(dark), fontWeight: 600, fontSize: 'var(--text-sm)', margin: '4px 0 2px 0' }}>{children}</p>,
    h5: ({ children }) => <p style={{ ...baseText(dark), fontWeight: 600, fontSize: 'var(--text-sm)', margin: '4px 0 2px 0' }}>{children}</p>,
    h6: ({ children }) => <p style={{ ...baseText(dark), fontWeight: 600, fontSize: 'var(--text-sm)', margin: '4px 0 2px 0' }}>{children}</p>,

    /* ── Strong / Bold ─────────────────────────────────────── */
    strong({ children }) {
      return (
        <strong style={{
          fontWeight: 700,
          color: dark ? 'white' : 'var(--haladhar-text-primary)',
        }}>
          {children}
        </strong>
      );
    },

    /* ── Em / Italic ───────────────────────────────────────── */
    em({ children }) {
      return <em style={{ fontStyle: 'italic' }}>{children}</em>;
    },

    /* ── Unordered list ────────────────────────────────────── */
    ul({ children }) {
      return (
        <ul style={{
          paddingLeft: '18px',
          margin: '4px 0 6px 0',
          listStyleType: 'disc',
        }}>
          {children}
        </ul>
      );
    },

    /* ── Ordered list ──────────────────────────────────────── */
    ol({ children }) {
      return (
        <ol style={{
          paddingLeft: '20px',
          margin: '4px 0 6px 0',
          listStyleType: 'decimal',
        }}>
          {children}
        </ol>
      );
    },

    /* ── List item ─────────────────────────────────────────── */
    li({ children }) {
      return (
        <li style={{
          ...baseText(dark),
          fontSize: 'var(--text-base)',
          lineHeight: 1.55,
          marginBottom: '3px',
        }}>
          {children}
        </li>
      );
    },

    /* ── Inline code — show as plain text, not code block ──── */
    code({ children }) {
      return <span style={{ fontFamily: 'inherit', ...baseText(dark) }}>{children}</span>;
    },

    /* ── Code block — render as plain paragraph ────────────── */
    pre({ children }) {
      return <div style={{ ...baseText(dark), margin: '4px 0' }}>{children}</div>;
    },

    /* ── Blockquote ────────────────────────────────────────── */
    blockquote({ children }) {
      return (
        <div style={{
          borderLeft: `3px solid ${dark ? 'rgba(255,255,255,0.4)' : 'var(--haladhar-green)'}`,
          paddingLeft: '10px',
          margin: '6px 0',
          opacity: 0.9,
        }}>
          {children}
        </div>
      );
    },

    /* ── Horizontal rule ───────────────────────────────────── */
    hr() {
      return <div style={{ height: '1px', background: dark ? 'rgba(255,255,255,0.2)' : 'var(--haladhar-border)', margin: '8px 0' }} />;
    },

    /* ── Links — render as plain text (no external navigation) */
    a({ children }) {
      return <span style={{ ...baseText(dark), textDecoration: 'underline' }}>{children}</span>;
    },
  };

  return (
    <div className="md-message">
      <ReactMarkdown
        components={components}
        /* disallowedElements blocks any HTML passthrough */
        disallowedElements={['script', 'style', 'iframe', 'form', 'input']}
        unwrapDisallowed
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
