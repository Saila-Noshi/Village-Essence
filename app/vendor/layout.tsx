"use client";
import { useEffect, useState, ReactNode } from "react";
import { createClient, User } from "@supabase/supabase-js";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { signOutVendor } from "@/lib/actions/authActions";

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
  { href: "/", label: "Home", icon: "bi-house-fill" },
  { href: "/vendor/dashboard", label: "Dashboard", icon: "bi-grid-1x2-fill" },
  { href: "/vendor/products", label: "My Products", icon: "bi-box-seam-fill" },
  { href: "/vendor/profile", label: "Profile", icon: "bi-person-fill" },
  { href: "/vendor/settings", label: "Settings", icon: "bi-gear-fill" },
];

const VendorSidebar = ({
  user,
  sidebarOpen,
  setSidebarOpen,
}: {
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
      <div className={`vendor-sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
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
          
          .vendor-layout-wrapper {
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
          
          .vendor-sidebar {
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
          .vendor-sidebar {
    position: fixed; /* Changed from relative to fixed */
    top: 0;
    left: 0;
    height: 100vh;
    transform: translateX(0);
  }

  .vendor-main-content {
    margin-left: 280px; /* Push content next to fixed sidebar */
  }
}

          
          .sidebar-header {
            padding: 1rem;
            border-bottom: 1px solid #334155;
            flex-shrink: 0;
          }
          
          .navbar-brand-vendor {
            color: var(--sidebar-text);
            text-decoration: none;
            display: flex;
            align-items: center;
          }
          
          .navbar-brand-vendor:hover {
            color: #e5e7eb;
          }
          
          .brand-tagline-vendor {
            font-size: 0.75rem;
            color: #9ca3af;
          }
          
          .sidebar-nav {
            flex: 1;
            overflow-y: auto;
            padding: 1rem 0;
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
            width: calc(100% - 1rem);
            background: var(--danger-gradient);
            border: none;
            color: white;
            padding: 0.75rem 1rem;
            font-size: 0.9rem;
            transition: all 0.2s ease;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            margin: 0.5rem;
            border-radius: var(--border-radius);
          }
          
          .sign-out-btn:hover {
            background: linear-gradient(90deg, #b91c1c, #dc2626);
          }
          
          .spinner-border.text-gradient-green-blue {
            border-color: #10b981;
            border-right-color: transparent;
          }
          
          /* Updated mobile-toggle */
.mobile-toggle {
  position: fixed;
  top: 1rem;
  right: 1rem; /* Changed from left to right */
  z-index: 1060;
  background: var(--sidebar-bg);
  color: var(--sidebar-text);
  border: none;
  padding: 0.5rem;
  border-radius: var(--border-radius);
  display: none;
  transition: all 0.2s ease;
  box-shadow: var(--shadow);
}

.mobile-toggle:hover {
  background: var(--sidebar-hover);
  color: #ffffff;
}

          
          .vendor-main-content {
            flex: 1;
            background: #f8fafc;
            overflow: auto;
          }
          
          @media (max-width: 991px) {
            .mobile-toggle {
              display: block;
            }
            
            .vendor-main-content {
              margin-left: 0;
              width: 100%;
            }
          }
          
          @media (min-width: 992px) {
            .mobile-toggle {
              display: none;
            }
          }
          
          @media (max-width: 576px) {
            .vendor-sidebar {
              width: 260px;
            }
            
            .main-content-area {
              padding: 1rem !important;
            }
            
            .navbar-brand-vendor {
              font-size: 0.9rem;
            }
            
            .nav-link {
              font-size: 0.9rem;
              padding: 0.6rem 0.8rem;
            }
          }
        `}</style>

        {/* Sidebar Header */}
        <div className="sidebar-header">
          <Link href="/vendor/dashboard" className="navbar-brand-vendor">
            <i className="bi bi-shop-window fs-4 me-2 text-gradient-green-blue"></i>
            <div>
              <div className="fs-5 fw-semibold">Village Essence</div>
              <div className="brand-tagline-vendor">Vendor Panel</div>
            </div>
          </Link>
        </div>

        {/* Sidebar Navigation */}
        <div className="sidebar-nav">
          <ul className="nav nav-pills flex-column">
            {navLinks.map((link) => (
              <li className="nav-item" key={link.href}>
                <Link
                  href={link.href}
                  className={`nav-link ${
                    pathname === link.href ||
                    (pathname.startsWith(link.href) &&
                      link.href !== "/vendor/dashboard" &&
                      link.href !== "/")
                      ? "active"
                      : ""
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <i className={`bi ${link.icon} me-2`}></i>
                  <span>{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Sign Out Button */}
        {user && (
          <button onClick={() => signOutVendor()} className="sign-out-btn">
            <i className="bi bi-box-arrow-right"></i>
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </>
  );
};

export default function VendorLayout({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) {
          console.error("VendorLayout: Session error:", error);
        }
        setUser(session?.user || null);
        if (!session?.user) {
          router.push("/auth/login?reason=no_session_layout");
        }
        setLoading(false);
      } catch (error) {
        console.error("VendorLayout: Error getting session:", error);
        setLoading(false);
      }
    };
    getInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("VendorLayout: Auth state change:", event);
        setUser(session?.user || null);
        if (event === "SIGNED_OUT") {
          router.push("/auth/login?reason=signed_out");
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
        <div
          className="spinner-border text-gradient-green-blue"
          role="status"
          style={{ width: "3rem", height: "3rem" }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="vendor-layout-wrapper">
      {/* Mobile Toggle Button */}
      <button
        className="mobile-toggle d-lg-none"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        <i className={`bi ${sidebarOpen ? "bi-x-lg" : "bi-list"} fs-5`}></i>
      </button>

      <VendorSidebar
        user={user}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <main className="vendor-main-content">
        <div className="p-3 p-md-4">{children}</div>
        <footer className="text-center text-muted mt-auto py-3 border-top">
          <small>
            Village Essence Vendor Panel © {new Date().getFullYear()}
          </small>
        </footer>
      </main>
    </div>
  );
}
