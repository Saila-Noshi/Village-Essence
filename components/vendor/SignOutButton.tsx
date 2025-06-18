"use client";
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { signOutVendor } from '@/lib/actions/authActions';

export default function SignOutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSignOut = async () => {
    startTransition(async () => {
      try {
        await signOutVendor();
        router.push('/auth/login?reason=signed_out');
      } catch (error) {
        console.error('Sign out error:', error);
      }
    });
  };

  return (
    <>
      <style>{`
        :root {
          --danger-gradient: linear-gradient(90deg, #dc2626, #f87171);
          --border-radius: 0.375rem;
        }

        .sign-out-btn {
          width: 100%;
          background: var(--danger-gradient);
          border: none;
          color: white;
          padding: 0.75rem 1rem;
          font-size: 0.9rem;
          transition: all 0.2s ease;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1.5rem;
          border-radius: var(--border-radius);
        }

        .sign-out-btn:hover {
          background: linear-gradient(90deg, #b91c1c, #dc2626);
        }

        .sign-out-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
      <button
        onClick={handleSignOut}
        className="sign-out-btn"
        disabled={isPending}
      >
        <i className="bi bi-box-arrow-right"></i>
        <span>{isPending ? 'Signing Out...' : 'Sign Out'}</span>
      </button>
    </>
  );
}