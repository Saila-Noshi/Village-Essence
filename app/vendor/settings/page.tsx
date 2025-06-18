import PasswordChangeForm from '@/components/vendor/PasswordChangeForm';
import DeleteAccountForm from '@/components/vendor/DeleteAccountForm';
import { getCurrentVendor } from '@/lib/authUtils';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import SignOutButton from '@/components/vendor/SignOutButton';

export default async function VendorSettingsPage() {
  const vendorSession = await getCurrentVendor();

  if (!vendorSession.data || !vendorSession.data.vendor) {
    redirect('/auth/login');
  }

  return (
    <div className="container py-4">
      <style>{`
        .bg-danger-soft {
          background-color: #fef2f2;
        }
      `}</style>
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link href="/vendor/dashboard">Dashboard</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Account Settings</li>
        </ol>
      </nav>
      <h1 className="h2 text-dark fw-bold mb-4">Account Settings</h1>
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-light">
          <h5 className="mb-0">Change Password</h5>
        </div>
        <div className="card-body p-lg-4">
          <PasswordChangeForm />
        </div>
      </div>
      <div className="card border-danger shadow-sm">
        <div className="card-header bg-danger-soft text-danger">
          <h5 className="mb-0"><i className="bi bi-exclamation-triangle-fill me-2"></i>Danger Zone</h5>
        </div>
        <div className="card-body p-lg-4">
          <DeleteAccountForm />
        </div>
      </div>
      <SignOutButton />
    </div>
  );
}