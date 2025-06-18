// app/auth/forgot-password/page.tsx
"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:3000/auth/update-password', // Replace with your redirect URL
    });

    if (error) {
      setMessage({ text: error.message, type: 'error' });
    } else {
      setMessage({ text: 'Password reset link has been sent to your email.', type: 'success' });
      setTimeout(() => router.push('/auth/login'), 3000); // Redirect to login page after 3 seconds
    }
  };

  return (
    <div className="container auth-container">
      <div className="row justify-content-center w-100">
        <div className="col-md-8 col-lg-6 col-xl-5">
          <div className="card auth-card">
            <div className="card-body">
              <div className="auth-logo">
                <div className="logo-icon-wrapper bg-gradient-green-to-blue">
                  <i className="bi bi-shield-lock-fill text-white"></i>
                </div>
                <h1 className="brand-text text-gradient-green-blue mb-0">Village Essence</h1>
              </div>
              <h2 className="card-title text-center mb-4">Forgot Password</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                {message.text && (
                  <div className={`alert ${message.type === 'error' ? 'alert-danger' : 'alert-success'} mt-3 py-2`}>
                    {message.text}
                  </div>
                )}
                <button type="submit" className="btn btn-gradient-green w-100 py-2">
                  Send Reset Link
                </button>
              </form>
              <div className="text-center mt-4 extra-links">
                <p className="mb-0">
                  Remember your password? <Link href="/auth/login">Login here</Link>
                </p>
                <p className="mt-2">
                  <Link href="/">← Back to Home</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
