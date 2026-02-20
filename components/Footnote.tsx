import { SideNote } from './SideNote';

export function Footnote({ children, note }: { children: React.ReactNode; note: string }) {
  return <SideNote asChild note={note}>{children}</SideNote>;
}
