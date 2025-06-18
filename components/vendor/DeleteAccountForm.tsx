"use client";
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { deleteVendorAccount, AuthFormState } from '@/lib/actions/authActions';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify'; // Import react-toastify

const initialState: AuthFormState = { message: '', type: null };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-lg btn-danger w-100" disabled={pending}>
      {pending ? (
        <>
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Deleting...
        </>
      ) : (
        <><i className="bi bi-trash3-fill me-2"></i>Delete My Account Permanently</>
      )}
    </button>
  );
}

export default function DeleteAccountForm() {
  const [state, formAction] = useActionState(deleteVendorAccount, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (state?.message) {
      if (state.type === 'success') {
        toast.success(state.message); // Use toast instead of alert
        formRef.current?.reset();
        router.push('/auth/login?message=account_deleted');
      } else if (state.type === 'error') {
        toast.error(state.message); // Use toast instead of alert
      }
    }
  }, [state, router]);

  return (
    <form action={formAction} ref={formRef} className="mt-3 p-3 p-md-4 border border-danger-subtle rounded bg-white">
      <h5 className="text-danger fw-bold"><i className="bi bi-exclamation-triangle-fill me-2"></i>Delete Account</h5>
      <p className="text-muted mb-3">
        This action is irreversible. To confirm, please enter your current password.
        Your vendor profile and associated products will be removed (product data might be archived or disassociated).
        Final deletion of your authentication record may require admin processing or rely on automated cleanup tasks.
      </p>
      <div className="mb-3">
        <label htmlFor="passwordConfirmDelete" className="form-label fw-medium">Confirm Password</label>
        <input type="password" name="password" id="passwordConfirmDelete" className="form-control form-control-lg" required />
      </div>
      {state?.message && state.type === 'error' && (
        <div className="alert alert-danger d-flex align-items-center mt-3">
            <i className="bi bi-x-octagon-fill me-2"></i> {state.message}
        </div>
      )}
      <SubmitButton />
    </form>
  );
}