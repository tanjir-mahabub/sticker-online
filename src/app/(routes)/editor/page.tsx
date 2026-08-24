"use client";

import dynamic from "next/dynamic";

const EditorWorkspace = dynamic(() => import("@/components/Editor/EditorWorkspace"), {
  ssr: false,
  loading: () => <div className="editor-boot" role="status"><span /><strong>Opening Sticker Online</strong><small>Initializing the design engine…</small></div>,
});

export default function EditorPage() {
  return <EditorWorkspace />;
}
