import { ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const URL_RE = /(https?:\/\/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=%]+)/;

function linkify(text: string): ReactNode[] {
  const parts = text.split(URL_RE);
  return parts.map((part, i) =>
    i % 2 === 1
      ? <a key={i} href={part} target="_blank" rel="noopener noreferrer">{part}</a>
      : part
  );
}

function linkifyChildren(children: ReactNode): ReactNode {
  if (typeof children !== 'string') return children;
  return children.split('\\n').flatMap((line, i, arr) => {
    const linked = linkify(line);
    return i < arr.length - 1 ? [...linked, <br key={`br-${i}`} />] : linked;
  });
}

interface LineCoords { x1: number; y1: number; x2: number; y2: number; x2End: number }

function ConnectedSideNote({ children, note }: { children: ReactNode; note: string }) {
  const refEl = useRef<HTMLSpanElement>(null);
  const noteEl = useRef<HTMLSpanElement>(null);
  const [line, setLine] = useState<LineCoords | null>(null);
  const [hovered, setHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    const measure = () => {
      if (!refEl.current || !noteEl.current || window.innerWidth < 1280) {
        setLine(null);
        return;
      }
      const r = refEl.current.getBoundingClientRect();
      const n = noteEl.current.getBoundingClientRect();
      setLine({ x1: r.right, y1: r.bottom, x2: n.left, y2: n.bottom, x2End: n.right });
    };
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, { passive: true });
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure);
    };
  }, [mounted]);

  const onEnter = () => setHovered(true);
  const onLeave = () => setHovered(false);

  return (
    <>
      <span ref={refEl} className={`footnote-ref${hovered ? ' footnote-ref-boxed' : ''}`} onMouseEnter={onEnter} onMouseLeave={onLeave}>
        {children}
      </span>
      <span ref={noteEl} className="sidenote sidenote-no-border" onMouseEnter={onEnter} onMouseLeave={onLeave}>
        {linkifyChildren(note)}
      </span>
      {mounted && line && createPortal(
        <svg
          aria-hidden="true"
          style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 5, overflow: 'visible' }}
        >
          <g
            stroke="currentColor"
            strokeWidth={0.75}
            fill="none"
            style={{ opacity: hovered ? 0.5 : 0.15, transition: 'opacity 200ms ease' }}
          >
            {/* horizontal → down left edge of sidenote → baseline right */}
            <path d={`M ${line.x1} ${line.y1} L ${line.x2} ${line.y1} L ${line.x2} ${line.y2} L ${line.x2End} ${line.y2}`} />
          </g>
        </svg>,
        document.body
      )}
    </>
  );
}

interface SideNoteProps {
  children: ReactNode;
  anchor?: ReactNode;
  asChild?: boolean;
  note?: string;
}

export function SideNote({ children, anchor, asChild, note }: SideNoteProps) {
  if (asChild && note) {
    return <ConnectedSideNote note={note}>{children}</ConnectedSideNote>;
  }
  return (
    <>
      {anchor && <span className="footnote-ref">{anchor}</span>}
      <span className="sidenote">{linkifyChildren(children)}</span>
    </>
  );
}
