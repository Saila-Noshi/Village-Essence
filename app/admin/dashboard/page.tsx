// app/admin/dashboard/page.tsx
import { createSupabaseServerClient } from "@/app/lib/supabaseServerClient";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const supabase = await createSupabaseServerClient();
  try {
    const { count: totalOrders, error: ordersError } = await supabase
      .from("orders")
      .select("id", { count: "exact", head: true });
    if (ordersError) console.error("Error fetching orders count:", ordersError);

    const { count: totalVendors, error: vendorsError } = await supabase
      .from("vendors")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true);
    if (vendorsError)
      console.error("Error fetching vendors count:", vendorsError);

    const { count: totalProducts, error: productsError } = await supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true);
    if (productsError)
      console.error("Error fetching products count:", productsError);

    const { count: pendingOrdersCount, error: pendingOrdersError } =
      await supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending");
    if (pendingOrdersError)
      console.error("Error fetching pending orders:", pendingOrdersError);

    const { data: revenueData, error: revenueError } = await supabase
      .from("orders")
      .select("total_amount")
      .eq("status", "delivered");
    if (revenueError)
      console.error("Error fetching revenue data:", revenueError);

    let totalRevenue = 0;
    if (revenueData && Array.isArray(revenueData)) {
      totalRevenue = revenueData.reduce(
        (acc, order) => acc + (order.total_amount || 0),
        0
      );
    }

    const dashboardCards = [
      {
        title: "Total Orders",
        value: ordersError ? "Error" : totalOrders ?? 0,
        icon: "bi-receipt-cutoff",
        link: "/admin/dashboard/orders",
        color: "bg-gradient-primary-to-secondary",
      },
      {
        title: "Active Vendors",
        value: vendorsError ? "Error" : totalVendors ?? 0,
        icon: "bi-people-fill",
        link: "/admin/dashboard/vendors",
        color: "bg-gradient-green-to-blue",
      },
      {
        title: "Active Products",
        value: productsError ? "Error" : totalProducts ?? 0,
        icon: "bi-box-seam-fill",
        link: "/admin/dashboard/products",
        color: "bg-gradient-blue-to-purple",
      },
      {
        title: "Pending Orders",
        value: pendingOrdersError ? "Error" : pendingOrdersCount,
        icon: "bi-hourglass-split",
        link: "/admin/dashboard/orders?status=pending",
        color: "bg-gradient-orange-to-red",
      },
      {
        title: "Total Revenue (Delivered)",
        value: revenueError ? "Error" : `$${totalRevenue.toFixed(2)}`,
        icon: "bi-cash-coin",
        link: "#!",
        color: "bg-gradient-pink-to-purple",
        noLink: true,
      },
    ];

    return (
      <div className="container-fluid admin-dashboard-page">
        <div className="page-header mb-4">
          <h1 className="h2 text-dark fw-bold">Admin Dashboard Overview</h1>
        </div>
        <div className="row g-4">
          {dashboardCards.map((card, index) => (
            <div key={index} className="col-xl-3 col-lg-4 col-md-6">
              <div
                className={`card admin-stat-card text-white shadow-lg h-100 ${card.color}`}
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fs-2 fw-bold">{card.value}</div>
                      <div className="text-white-75 small">{card.title}</div>
                    </div>
                    <i className={`bi ${card.icon} fs-1 opacity-50`}></i>
                  </div>
                </div>
                {!card.noLink ? (
                  <Link
                    href={card.link}
                    className="card-footer admin-card-footer text-white text-decoration-none d-flex align-items-center justify-content-between"
                  >
                    <span>View Details</span>{" "}
                    <i className="bi bi-arrow-right-circle"></i>
                  </Link>
                ) : (
                  <div className="card-footer admin-card-footer text-white-75 small">
                    Based on 'delivered' orders
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="row mt-5">
          <div className="col-12">
            <div className="card admin-card shadow-sm">
              <div className="card-header bg-light border-bottom">
                <h5 className="card-title-custom mb-0">System Status</h5>
              </div>
              <div className="card-body">
                <div
                  className="alert alert-success-soft d-flex align-items-center"
                  role="alert"
                >
                  <i className="bi bi-check-circle-fill me-2 text-success"></i>
                  Admin dashboard systems are operational.
                </div>
                <p className="text-muted mb-0 small">
                  Dashboard loaded successfully at {new Date().toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in AdminDashboardPage:", error);
    return (
      <div className="container-fluid">
        <h1 className="mb-4">Admin Dashboard</h1>
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error Loading Dashboard Data</h4>
          <p>
            There was an unexpected error while trying to load the dashboard.
            Please check the server logs for more details or try again later.
          </p>
          <hr />
          <p className="mb-0 small">
            Error:{" "}
            {error instanceof Error
              ? error.message
              : "An unknown error occurred"}
          </p>
        </div>
      </div>
    );
  }
}