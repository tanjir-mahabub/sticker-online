import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return <section className="studio-hero">
    <div className="hero-orb hero-orb-one" /><div className="hero-orb hero-orb-two" />
    <div className="hero-copy">
      <p className="studio-eyebrow"><span />Production-ready creative tooling</p>
      <h1>Ideas become<br/><em>print-ready stickers.</em></h1>
      <p className="hero-lead">A production-minded vector editor with uploads, live typography, materials, die-cut contours, canvas history, pricing, and export—built entirely for the browser.</p>
      <div className="hero-actions"><Link className="hero-primary" href="/editor">Start designing <span>→</span></Link><a className="hero-secondary" href="#features">Explore capabilities</a></div>
      <div className="hero-proof"><div><strong>10+</strong><span>editing tools</span></div><div><strong>8</strong><span>material finishes</span></div><div><strong>3</strong><span>versioned APIs</span></div></div>
    </div>
    <div className="hero-visual" aria-label="Sticker editor preview"><div className="preview-shell">
      <div className="preview-toolbar"><i/><i/><i/><span>Sticker canvas · 100%</span></div>
      <div className="preview-canvas"><div className="sticker-shadow"/><div className="sticker-shape"><Image src="/homepage/hero/watermelon.svg" alt="Watermelon sticker artwork" width={250} height={180} priority/></div><span className="selection-corner top-left"/><span className="selection-corner top-right"/><span className="selection-corner bottom-left"/><span className="selection-corner bottom-right"/></div>
      </div><div className="floating-tool tool-one"><span>#F98332</span><strong>Die-cut border</strong></div><div className="floating-tool tool-two"><span>✓</span><strong>Print ready</strong></div></div>
  </section>;
}
