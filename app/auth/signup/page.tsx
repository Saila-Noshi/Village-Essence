// app/auth/signup/page.tsx
"use client";
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { signUpVendor, AuthFormState } from '@/lib/actions/authActions'; // Your auth actions
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const initialState: AuthFormState = { message: '', type: null };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-gradient-green w-100 py-2" disabled={pending}>
      {pending ? (
        <>
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Signing Up...
        </>
      ) : 'Sign Up'}
    </button>
  );
}

export default function SignUpPage() {
  const [state, formAction] = useActionState(signUpVendor, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state?.type === 'success') {
      // Message is displayed, user can now login
      // setTimeout(() => router.push('/auth/login?message=signup_success'), 3000); // Optional redirect after delay
    }
  }, [state, router]);

  return (
    <div className="container auth-container">
      <div className="row justify-content-center w-100">
        <div className="col-md-8 col-lg-6 col-xl-5">
          <div className="card auth-card">
            <div className="card-body">
              <div className="auth-logo">
                <div className="logo-icon-wrapper bg-gradient-green-to-blue">
                  <i className="bi bi-person-plus-fill text-white"></i>
                </div>
                <h1 className="brand-text text-gradient-green-blue mb-0">Village Essence</h1>
              </div>
              <h2 className="card-title text-center mb-4">Vendor Registration</h2>
              <form action={formAction}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <input type="text" name="name" id="name" className="form-control" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input type="email" name="email" id="email" className="form-control" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="phone_number" className="form-label">Phone Number</label>
                  <input type="tel" name="phone_number" id="phone_number" className="form-control" required />
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="age" className="form-label">Age (Optional)</label>
                    <input type="number" name="age" id="age" className="form-control" min="18" max="120" />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="gender" className="form-label">Gender (Optional)</label>
                    <select name="gender" id="gender" className="form-select">
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer_not_to_say">Prefer not to say</option>
                    </select>
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password (min. 6 characters)</label>
                  <input type="password" name="password" id="password" className="form-control" required minLength={6} />
                </div>
                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                  <input type="password" name="confirmPassword" id="confirmPassword" className="form-control" required />
                </div>

                {state?.message && (
                  <div className={`alert ${state.type === 'error' ? 'alert-danger' : state.type === 'success' ? 'alert-success' : 'alert-info'} mt-3 py-2`}>
                    {state.message}
                  </div>
                )}
                <SubmitButton />
              </form>
              <div className="text-center mt-4 extra-links">
                <p className="mb-0">
                  Already have an account? <Link href="/auth/login">Login here</Link>
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
