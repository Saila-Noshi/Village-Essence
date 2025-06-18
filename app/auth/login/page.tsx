// app/auth/login/page.tsx
"use client";
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { signInVendor, AuthFormState } from '@/lib/actions/authActions'; // Your auth actions
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

const initialState: AuthFormState = { message: '', type: null };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-gradient-green w-100 py-2" disabled={pending}>
      {pending ? (
        <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Logging In...
        </>
      ) : 'Login'}
    </button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useActionState(signInVendor, initialState);
  const router = useRouter();

   useEffect(() => {
    const checkInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const userRole = session.user.app_metadata?.role;
        if (userRole === 'vendor') router.push('/vendor/dashboard');
        else if (userRole === 'admin') router.push('/admin/dashboard');
        // else router.push('/profile'); // For general users
      }
    };
    checkInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const userRole = session.user.app_metadata?.role;
          if (userRole === 'vendor') router.push('/vendor/dashboard');
          else if (userRole === 'admin') router.push('/admin/dashboard');
          // else router.push('/profile');
        }
      }
    );
    return () => authListener.subscription.unsubscribe();
  }, [router]);


  return (
    <div className="container auth-container">
      <div className="row justify-content-center w-100">
        <div className="col-md-7 col-lg-5 col-xl-4">
          <div className="card auth-card">
            <div className="card-body">
              <div className="auth-logo">
                <div className="logo-icon-wrapper bg-gradient-green-to-blue">
                    <i className="bi bi-leaf-fill text-white"></i>
                </div>
                <h1 className="brand-text text-gradient-green-blue mb-0">Village Essence</h1>
              </div>
              <h2 className="card-title text-center mb-4">Vendor Login</h2>
              <form action={formAction}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input type="email" name="email" id="email" className="form-control" required placeholder="you@example.com" />
                </div>
                <div className="mb-4"> {/* Increased bottom margin */}
                  <label htmlFor="password" className="form-label">Password</label>
                  <input type="password" name="password" id="password" className="form-control" required placeholder="••••••••" />
                </div>
                {state?.message && (
                  <div className={`alert ${state.type === 'error' ? 'alert-danger' : 'alert-success'} mt-3 py-2`}>
                    {state.message}
                  </div>
                )}
                <SubmitButton />
              </form>
              <div className="text-center mt-4 extra-links">
                <p className="mb-1">
                  <Link href="/auth/forgot-password">Forgot Password?</Link>
                </p>
                <p className="mb-0">
                  Don't have an account? <Link href="/auth/signup">Register here</Link>
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