// components/admin/DeleteButtonWithConfirmation.tsx
"use client";
import { useState, useTransition, useRef, useEffect } from 'react';
import { type AdminActionFormState } from '@/app/admin/dashboard/actions';

interface DeleteButtonProps {
  itemId: string;
  itemName: string;
  deleteAction: (id: string) => Promise<AdminActionFormState>;
  buttonText?: string;
  buttonClass?: string;
  modalTitle?: string;
  modalBody?: string;
  onSuccess?: () => void;
}

export default function DeleteButtonWithConfirmation({
  itemId,
  itemName,
  deleteAction,
  buttonText = "Delete",
  buttonClass = "btn btn-sm btn-outline-danger",
  modalTitle = "Confirm Deletion",
  modalBody,
  onSuccess,
}: DeleteButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = useState<AdminActionFormState | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleDelete = () => {
    setFormState(null);
    startTransition(async () => {
      const result = await deleteAction(itemId);
      setFormState(result);
      if (result.type === 'success') {
        // Delay closing modal slightly to show success message if needed, or close immediately
        setTimeout(() => setShowModal(false), 1000); // Example delay
        if (onSuccess) onSuccess();
      }
    });
  };

  const openModal = () => {
    setFormState(null);
    setShowModal(true);
  };

  const closeModal = () => {
    if (!isPending) setShowModal(false);
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isPending]);

  return (
    <>
      <button className={buttonClass} onClick={openModal}>
        {buttonText}
      </button>

      {showModal && (
        <div className="modal show d-block" tabIndex={-1} role="dialog" ref={modalRef}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{modalTitle}</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <p>{modalBody || `Are you sure you want to delete "${itemName}"?`}</p>
                {formState?.type === 'error' && (
                  <div className="alert alert-danger mt-2">{formState.message}</div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                  disabled={isPending}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                  disabled={isPending}
                >
                  {isPending ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
