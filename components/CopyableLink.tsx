'use client';

import { useState } from 'react';

export function CopyableLink({ link }: { link: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        alignItems: 'center',
        background: 'var(--bg)',
        border: '1px solid var(--border-2)',
        borderRadius: 6,
        padding: '10px 12px',
      }}
    >
      <input
        readOnly
        value={link}
        onFocus={(e) => e.target.select()}
        style={{
          flex: 1,
          minWidth: 0,
          background: 'transparent',
          border: 'none',
          color: 'var(--text-2)',
          fontSize: 12,
          fontFamily: 'var(--font-mono)',
          outline: 'none',
        }}
      />
      <button
        onClick={handleCopy}
        className="btn-secondary"
        style={{ padding: '6px 14px', fontSize: 12, flexShrink: 0 }}
      >
        {copied ? 'Kopierad!' : 'Kopiera'}
      </button>
    </div>
  );
}
