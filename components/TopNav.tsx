import Image from 'next/image';
import Link from 'next/link';
import { LogoutButton } from './LogoutButton';

export function TopNav({ isAdmin }: { isAdmin: boolean }) {
  return (
    <header
      style={{
        borderBottom: '1px solid var(--border)',
        background: 'rgba(12,16,23,0.9)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <div
        className="container"
        style={{
          maxWidth: 960,
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Image src="/logo.png" alt="JAgencourse" width={28} height={28} style={{ borderRadius: 6 }} />
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 15 }}>
            JAgencourse
          </span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {isAdmin && (
            <Link href="/admin" style={{ fontSize: 13, color: 'var(--text-2)' }}>
              Admin
            </Link>
          )}
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
