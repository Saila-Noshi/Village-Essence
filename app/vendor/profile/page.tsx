import { getCurrentVendor } from '@/lib/authUtils';
import ProfileUpdateForm from '@/components/vendor/ProfileUpdateForm';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function VendorProfilePage() {
  const vendorSession = await getCurrentVendor();

  if (!vendorSession || !vendorSession.data || !vendorSession.data.vendor) {
    redirect('/auth/login');
  }


  return (
    <div className="container py-4">
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link href="/vendor/dashboard">Dashboard</Link></li>
          <li className="breadcrumb-item active" aria-current="page">My Profile</li>
        </ol>
      </nav>
      <h1 className="h2 text-dark fw-bold mb-4">My Profile</h1>
      <div className="card shadow-sm">
        <div className="card-header bg-light">
          <h5 className="mb-0">Update Your Information</h5>
        </div>
        <div className="card-body p-lg-4">
          <ProfileUpdateForm vendor={vendorSession.data.vendor} />
        </div>
      </div>
    </div>
  );
}