/** A template, unlike a layout, mounts again on every navigation, so each page fades in briefly. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-fade">{children}</div>;
}
