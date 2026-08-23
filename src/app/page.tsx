import Link from "next/link";
import Header from "@/components/Homepage/Header";
import Hero from "@/components/Homepage/Hero";

const features = [
  ["01", "Vector canvas", "Fabric.js interactions with selection, scaling, rotation, layering, mirroring, and viewport-aware controls."],
  ["02", "Smart die-cut", "Generate print-safe contour paths around uploaded artwork and preview the finished sticker edge in real time."],
  ["03", "Type studio", "Add curved or straight text, switch creative fonts, tune colors, and keep typography editable on canvas."],
  ["04", "Material system", "Preview vinyl, holographic, glitter, and laminate treatments while pricing updates from dimensions and quantity."],
  ["05", "History engine", "Undo and redo meaningful canvas operations with bounded snapshots and predictable object restoration."],
  ["06", "Production export", "Prepare artwork for downstream print workflows with image preview and PDF/vector export capabilities."],
];

export default function Home() {
  return <main className="studio-home">
    <Header />
    <Hero />
    <section className="capability-strip" aria-label="Technology stack"><span>React</span><i/> <span>Next.js</span><i/> <span>TypeScript</span><i/> <span>Fabric.js</span><i/> <span>Redux Toolkit</span><i/> <span>Canvas API</span></section>
    <section className="studio-section" id="features"><div className="section-heading"><div><p className="studio-eyebrow"><span/>Creative engineering</p><h2>A real editor.<br/>Not a styled mockup.</h2></div><p>Every surface supports an actual design workflow—from choosing a format to manipulating artwork and preparing a production-ready result.</p></div><div className="feature-grid">{features.map(([number,title,body])=><article key={number}><span>{number}</span><h3>{title}</h3><p>{body}</p><b>Explore capability ↗</b></article>)}</div></section>
    <section className="workflow-section" id="workflow"><div><p className="studio-eyebrow"><span/>Primary workflow</p><h2>From blank canvas<br/>to print-ready.</h2><p>Focused steps keep a complex creative tool understandable for first-time users without removing advanced controls.</p><Link href="/editor">Open the live editor →</Link></div><ol><li><span>01</span><div><strong>Choose a format</strong><p>Start with die-cut, round, rectangular, or transparent stickers.</p></div></li><li><span>02</span><div><strong>Create the artwork</strong><p>Upload imagery, add text, arrange layers, and refine the contour.</p></div></li><li><span>03</span><div><strong>Configure production</strong><p>Select material, dimensions, lamination, and order quantity.</p></div></li><li><span>04</span><div><strong>Preview and export</strong><p>Review the final composition and prepare the print artifact.</p></div></li></ol></section>
    <section className="portfolio-note" id="showcase"><p className="studio-eyebrow"><span/>Selected engineering work</p><h2>Complex creative interaction,<br/>made approachable.</h2><p>Stickora demonstrates frontend architecture across canvas manipulation, derived pricing state, responsive editor controls, file handling, and non-trivial visual export.</p><div><Link href="/editor">Launch Stickora Studio</Link><a href="https://github.com/tanjir-mahabub/sticker-online" target="_blank" rel="noreferrer">Review architecture ↗</a></div></section>
    <footer className="studio-footer"><span>Stickora Studio · Built by Md. Tanjir Mahabub</span><span>Creative tooling · Product engineering · 2026</span></footer>
  </main>;
}
