import Link from "next/link";

export default function Header() {
  return <header className="studio-nav">
    <Link className="studio-brand" href="/"><span>SO</span><strong>Sticker</strong><em>Online</em></Link>
    <nav aria-label="Primary navigation"><a href="#features">Features</a><a href="#workflow">Workflow</a><a href="#architecture">Architecture</a></nav>
    <div><a className="source-link" href="https://github.com/tanjir-mahabub/sticker-online" target="_blank" rel="noreferrer">GitHub ↗</a><Link className="nav-cta" href="/editor">Open editor</Link></div>
  </header>;
}
