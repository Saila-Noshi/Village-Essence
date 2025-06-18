// components/ConditionalLayout.tsx
'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ConditionalLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const pathname = usePathname();
  
  // Check if current route starts with /admin or /vendor
  const isAdminRoute = pathname.startsWith('/admin');
  const isVendorRoute = pathname.startsWith('/vendor');
  
  // Don't show header/footer for admin or vendor routes
  const shouldShowHeaderFooter = !isAdminRoute && !isVendorRoute;

  return (
    <>
      {shouldShowHeaderFooter && <Header />}
      <main>{children}</main>
      {shouldShowHeaderFooter && <Footer />}
    </>
  );
}