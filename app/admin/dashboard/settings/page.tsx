"use client";
import { useState, useEffect } from 'react';
import { createClient, User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { signOutVendor } from '@/lib/actions/authActions';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminSettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };
    getUser();
  }, []);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOutVendor();
      router.push('/auth/login');
    } catch (error) {
      console.error('Sign out error:', error);
      setSigningOut(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-page">
      <style jsx>{`
        .settings-page {
          max-width: 600px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }
        
        .settings-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2rem;
          border-radius: 1rem;
          margin-bottom: 2rem;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        
        .settings-card {
          background: white;
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 4px 15px rgba(0,0,0,0.08);
          border: 1px solid #e2e8f0;
          text-align: center;
        }
        
        .user-info {
          background: #f8fafc;
          border-radius: 0.75rem;
          padding: 1.5rem;
          margin-bottom: 2rem;
          border: 1px solid #e2e8f0;
        }
        
        .user-email {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }
        
        .user-role {
          font-size: 0.9rem;
          color: #10b981;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          background: #dcfce7;
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
        }
        
        .sign-out-btn {
          background: linear-gradient(135deg, #dc2626, #f87171);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 0.75rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          min-width: 150px;
          justify-content: center;
        }
        
        .sign-out-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #b91c1c, #f56565);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(220, 38, 38, 0.4);
        }
        
        .sign-out-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }
        
        .loading-spinner {
          width: 1rem;
          height: 1rem;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .warning-text {
          color: #dc2626;
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        
        @media (max-width: 768px) {
          .settings-page {
            padding: 1rem;
          }
          
          .settings-header {
            padding: 1.5rem;
          }
          
          .settings-card {
            padding: 1.5rem;
          }
        }
      `}</style>

      {/* Header */}
      <div className="settings-header">
        <div className="d-flex align-items-center justify-content-center">
          <i className="bi bi-gear-fill fs-2 me-3"></i>
          <div className="text-center">
            <h1 className="mb-0 fs-3 fw-bold">Settings</h1>
            <p className="mb-0 opacity-75">Account Management</p>
          </div>
        </div>
      </div>

      {/* Settings Card */}
      <div className="settings-card">
        {/* User Information */}
        <div className="user-info">
          <div className="user-email">{user?.email || 'N/A'}</div>
          <div className="user-role">
            <i className="bi bi-shield-check"></i>
            Admin
          </div>
        </div>

        {/* Warning */}
        <div className="warning-text">
          <i className="bi bi-exclamation-triangle"></i>
          This will end your current session
        </div>

        {/* Sign Out Button */}
        <button 
          className="sign-out-btn"
          onClick={handleSignOut}
          disabled={signingOut}
        >
          {signingOut ? (
            <>
              <div className="loading-spinner"></div>
              Signing Out...
            </>
          ) : (
            <>
              <i className="bi bi-box-arrow-right"></i>
              Sign Out
            </>
          )}
        </button>
      </div>
    </div>
  );
}