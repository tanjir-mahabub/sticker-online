import Link from "next/link";

export default function Header() {
  return <header className="studio-nav">
    <Link className="studio-brand" href="/"><span>S</span><strong>Stickora</strong><em>Studio</em></Link>
    <nav aria-label="Primary navigation"><a href="#features">Features</a><a href="#workflow">Workflow</a><a href="#showcase">Showcase</a></nav>
    <div><a className="source-link" href="https://github.com/tanjir-mahabub/sticker-online" target="_blank" rel="noreferrer">Source ↗</a><Link className="nav-cta" href="/editor">Open studio</Link></div>
  </header>;
}
