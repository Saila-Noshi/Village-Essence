"use client";
import Link from 'next/link';
import { PropsWithChildren, useEffect, useState } from 'react';
import { createClient, User } from '@supabase/supabase-js';
import { useRouter, usePathname } from 'next/navigation';
import { signOutVendor } from '@/lib/actions/authActions';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true,
    },
  }
);

const navLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "bi-grid-1x2-fill" },
  { href: "/admin/dashboard/orders", label: "Orders", icon: "bi-receipt-cutoff" },
  { href: "/admin/dashboard/vendors", label: "Vendors", icon: "bi-people-fill" },
  { href: "/admin/dashboard/products", label: "Products", icon: "bi-box-seam-fill" },
  { href: "/admin/dashboard/settings", label: "Settings", icon: "bi-gear-fill" },
];

const AdminSidebar = ({ user, sidebarOpen, setSidebarOpen }: { 
  user: User | null; 
  sidebarOpen: boolean; 
  setSidebarOpen: (open: boolean) => void; 
}) => {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="mobile-overlay d-lg-none"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`admin-sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <style>{`
          :root {
            --sidebar-bg: #1e293b;
            --sidebar-text: #f3f4f6;
            --sidebar-hover: #334155;
            --gradient-green-blue: linear-gradient(90deg, #10b981, #06b6d4);
            --danger-gradient: linear-gradient(90deg, #dc2626, #f87171);
            --border-radius: 0.375rem;
            --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }
          
          .admin-layout-wrapper {
            min-height: 100vh;
            display: flex;
          }
          
          .mobile-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1040;
          }
          
          .admin-sidebar {
            width: 280px;
            background: var(--sidebar-bg);
            color: var(--sidebar-text);
            transition: all 0.3s ease;
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            z-index: 1050;
            transform: translateX(-100%);
            box-shadow: var(--shadow);
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }
          
          .sidebar-open {
            transform: translateX(0);
          }
          
          @media (min-width: 992px) {
            .admin-sidebar {
              position: sticky;
              transform: translateX(0);
            }
          }
          
          .sidebar-header {
            padding: 1rem;
            border-bottom: 1px solid #334155;
            flex-shrink: 0;
          }
          
          .navbar-brand-admin {
            color: var(--sidebar-text);
            text-decoration: none;
            display: flex;
            align-items: center;
          }
          
          .navbar-brand-admin:hover {
            color: #e5e7eb;
          }
          
          .brand-tagline-admin {
            font-size: 0.75rem;
            color: #9ca3af;
          }
          
          .sidebar-nav {
            flex: 1;
            overflow-y: auto;
            padding: 1rem 0;
            display: flex;
            flex-direction: column;
          }
          
          .nav-link {
            color: var(--sidebar-text);
            padding: 0.75rem 1rem;
            border-radius: var(--border-radius);
            margin: 0.25rem 0.5rem;
            font-size: 0.95rem;
            transition: all 0.2s ease;
            text-decoration: none;
            display: flex;
            align-items: center;
          }
          
          .nav-link:hover {
            background: var(--sidebar-hover);
            color: #ffffff;
          }
          
          .nav-link.active {
            background: var(--gradient-green-blue);
            color: #ffffff;
            font-weight: 500;
          }
          
          .text-gradient-green-blue {
            background: var(--gradient-green-blue);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          
          .sign-out-btn {
            color: #dc2626;
            padding: 0.75rem 1rem;
            border-radius: var(--border-radius);
            margin: 0.25rem 0.5rem;
            font-size: 0.95rem;
            transition: all 0.2s ease;
            text-decoration: none;
            display: flex;
            align-items: center;
            background: none;
            border: 1px solid rgba(220, 38, 38, 0.2);
            cursor: pointer;
            width: calc(100% - 1rem);
            text-align: left;
            font-weight: 500;
          }
          
          .sign-out-btn:hover {
            background: rgba(220, 38, 38, 0.1);
            color: #f87171;
            border: 1px solid rgba(220, 38, 38, 0.4);
          }
          
          .mobile-toggle {
            position: fixed;
            top: 1rem;
            right: 1rem;
            z-index: 1060;
            background: var(--gradient-green-blue);
            color: white;
            border: none;
            padding: 0.5rem;
            border-radius: var(--border-radius);
            display: none;
            transition: all 0.2s ease;
          }
          
          .mobile-toggle:hover {
            background: linear-gradient(90deg, #059669, #0891b2);
          }
          
          .admin-main-content {
            flex: 1;
            background: #f8fafc;
            overflow: auto;
          }
          
          .main-content-area-admin {
            max-width: 1400px;
            margin: 0 auto;
            padding: 1rem;
          }
          
          @media (max-width: 991px) {
            .mobile-toggle {
              display: block;
            }
            
            .admin-main-content {
              margin-left: 0;
              width: 100%;
            }
            
            .main-content-area-admin {
              padding: 1rem;
            }
          }
          
          @media (min-width: 992px) {
            .mobile-toggle {
              display: none;
            }
          }
          
          @media (max-width: 576px) {
            .admin-sidebar {
              width: 260px;
            }
            
            .main-content-area-admin {
              padding: 0.75rem;
            }
            
            .navbar-brand-admin {
              font-size: 0.9rem;
            }
            
            .nav-link, .sign-out-btn {
              font-size: 0.9rem;
              padding: 0.6rem 0.8rem;
            }
          }
          
          @media (max-width: 768px) {
            .main-content-area-admin {
              padding: 0.5rem;
            }
          }
        `}</style>
        
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <Link href="/admin/dashboard" className="navbar-brand-admin">
            <i className="bi bi-shield-lock-fill fs-4 me-2 text-gradient-green-blue"></i>
            <div>
              <div className="fs-5 fw-semibold">Village Admin</div>
              <div className="brand-tagline-admin">Admin Panel</div>
            </div>
          </Link>
        </div>
        
        {/* Sidebar Navigation */}
        <div className="sidebar-nav">
          <ul className="nav nav-pills flex-column">
            {navLinks.map(link => (
              <li className="nav-item" key={link.href}>
                <Link
                  href={link.href}
                  className={`nav-link ${pathname === link.href || (pathname.startsWith(link.href) && link.href !== "/admin/dashboard") ? 'active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <i className={`bi ${link.icon} me-2`}></i>
                  <span>{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default function AdminLayout({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("AdminLayout: Session error:", error);
        }
        const fetchedUser = session?.user || null;
        setUser(fetchedUser);
        if (!fetchedUser) {
          router.push('/auth/login?reason=no_session_layout');
        } else if (fetchedUser.app_metadata?.role !== 'admin') {
          console.error('AdminLayout: User is not admin:', fetchedUser.app_metadata?.role);
          router.push('/auth/login?error_key=not_admin&origin=admin_layout_role_mismatch');
        }
        setLoading(false);
      } catch (error) {
        console.error("AdminLayout: Error getting session:", error);
        setLoading(false);
      }
    };
    getInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("AdminLayout: Auth state change:", event);
        const fetchedUser = session?.user || null;
        setUser(fetchedUser);
        if (event === 'SIGNED_OUT' || !fetchedUser) {
          router.push('/auth/login?reason=signed_out');
        } else if (fetchedUser.app_metadata?.role !== 'admin') {
          router.push('/auth/login?error_key=not_admin&origin=admin_layout_role_mismatch');
        }
        setLoading(false);
      }
    );
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [router]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="spinner-border text-gradient-green-blue" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout-wrapper">
      {/* Mobile Toggle Button */}
      <button 
        className="mobile-toggle d-lg-none"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        <i className={`bi ${sidebarOpen ? 'bi-x-lg' : 'bi-list'} fs-5`}></i>
      </button>

      <AdminSidebar 
        user={user} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />
      
      <main className="admin-main-content">
        <div className="main-content-area-admin">
          {children}
          <footer className="text-center text-muted mt-auto py-3 border-top">
            <small>Village Essence Admin Panel © {new Date().getFullYear()}</small>
          </footer>
        </div>
      </main>
    </div>
  );
}