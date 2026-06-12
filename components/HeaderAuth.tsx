'use client';

import { useEffect, useState } from 'react';
import { cloudEnabled, onAuthChange, signInWithGoogle, signOut } from '@/lib/cloud';

export default function HeaderAuth() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => onAuthChange((u) => setEmail(u?.email ?? null)), []);

  if (!cloudEnabled()) return null;

  return (
    <span className="header-auth">
      {email ? (
        <>
          <span className="muted small header-auth-hint">{email}</span>
          <button className="btn small" onClick={() => { void signOut(); }}>Sign out</button>
        </>
      ) : (
        <>
          <span className="muted small header-auth-hint">Keep your plans across devices —</span>
          <button
            className="btn small primary"
            onClick={() => { void signInWithGoogle(); }}
            title="Sign up or sign in with Google to save your plans to your account"
          >
            Sign up / in to save
          </button>
        </>
      )}
    </span>
  );
}
