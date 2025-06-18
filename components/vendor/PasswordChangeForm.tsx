"use client";
import { useActionState } from 'react';
// If you are using Next.js App Router, uncomment the following line instead:
import { useFormStatus } from 'react-dom';
import { updateVendorPassword, AuthFormState } from '@/lib/actions/authActions';
import { useEffect, useRef } from 'react';

const initialState: AuthFormState = { message: '', type: null };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-gradient-orange w-100 btn-lg" disabled={pending}>
      {pending ? (
        <>
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Changing...
        </>
      ) : (
        <><i className="bi bi-key-fill me-2"></i>Change Password</>
      )}
    </button>
  );
}

export default function PasswordChangeForm() {
  const [state, formAction] = useActionState(updateVendorPassword, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.message) {// Use a toast for better UX
      if (state.type === 'success') {
        formRef.current?.reset();
      }
    }
  }, [state]);

  return (
    <form action={formAction} ref={formRef} className="mt-3 needs-validation" noValidate>
      <div className="mb-3">
        <label htmlFor="newPasswordInput" className="form-label fw-medium">New Password</label>
        <input
          type="password"
          name="newPassword"
          id="newPasswordInput"
          className="form-control form-control-lg"
          required
          minLength={8}
          aria-describedby="passwordHelpBlock"
        />
        <div id="passwordHelpBlock" className="form-text text-muted small">
          Your password must be at least 8 characters long.
        </div>
        <div className="invalid-feedback">Password must be at least 8 characters.</div>
      </div>
      <div className="mb-3">
        <label htmlFor="confirmNewPasswordInput" className="form-label fw-medium">Confirm New Password</label>
        <input
          type="password"
          name="confirmNewPassword"
          id="confirmNewPasswordInput"
          className="form-control form-control-lg"
          required
        />
        <div className="invalid-feedback">Passwords must match.</div>
      </div>
      {state?.message && state.type === 'error' && (
        <div className="alert alert-danger d-flex align-items-center mt-3">
          <i className="bi bi-x-octagon-fill me-2"></i>{state.message}
        </div>
      )}
      {state?.message && state.type === 'success' && (
        <div className="alert alert-success d-flex align-items-center mt-3">
          <i className="bi bi-check-circle-fill me-2"></i>{state.message}
        </div>
      )}
      <SubmitButton />
    </form>
  );
}
