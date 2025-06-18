"use client";

import { useState, useTransition } from 'react';
import { type OrderStatus } from '@/lib/types';
import { type AdminActionFormState } from '../../actions';

interface OrderStatusUpdaterProps {
  orderId: string;
  currentStatus: OrderStatus | null;
  availableStatuses: (OrderStatus | null | undefined)[];
  updateAction: (orderId: string, newStatus: OrderStatus) => Promise<AdminActionFormState>;
}

export default function OrderStatusUpdater({
  orderId,
  currentStatus,
  availableStatuses,
  updateAction,
}: OrderStatusUpdaterProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(currentStatus ?? 'pending');
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = useState<AdminActionFormState | null>(null);

  const validStatuses: OrderStatus[] = [
    'pending',
    'confirmed',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
  ];

  const filteredStatuses = availableStatuses.filter(
    (status): status is OrderStatus => status != null && validStatuses.includes(status)
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormState(null);
    if (!validStatuses.includes(selectedStatus)) {
      setFormState({ type: 'error', message: 'Invalid status selected' });
      return;
    }
    startTransition(async () => {
      const result = await updateAction(orderId, selectedStatus);
      setFormState(result);
    });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as OrderStatus;
    if (validStatuses.includes(newStatus)) {
      setSelectedStatus(newStatus);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="order-status-updater-form">
      <div className="mb-3">
        <label htmlFor="status" className="form-label fw-medium">
          Change Order Status:
        </label>
        <select
          id="status"
          name="status"
          className="form-select form-select-lg"
          value={selectedStatus}
          onChange={handleStatusChange}
          disabled={isPending || filteredStatuses.length === 0}
        >
          {filteredStatuses.length > 0 ? (
            filteredStatuses.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))
          ) : (
            <option value="" disabled>
              No valid statuses available
            </option>
          )}
        </select>
      </div>
      {formState?.message && (
        <div
          className={`alert ${
            formState.type === 'error' ? 'alert-danger' : 'alert-success-soft'
          } mt-2 p-2 small d-flex align-items-center`}
        >
          <i
            className={`bi ${
              formState.type === 'error'
                ? 'bi-exclamation-triangle-fill'
                : 'bi-check-circle-fill'
            } me-2`}
          ></i>
          {formState.message}
        </div>
      )}
      <button
        type="submit"
        className="btn btn-gradient-primary w-100 btn-lg"
        disabled={isPending || selectedStatus === (currentStatus ?? 'pending') || filteredStatuses.length === 0}
      >
        {isPending ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            Updating...
          </>
        ) : (
          <>
            <i className="bi bi-arrow-repeat me-2"></i>Update Status
          </>
        )}
      </button>
    </form>
  );
}





