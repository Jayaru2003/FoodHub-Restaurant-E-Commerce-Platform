import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../../components/admin/StatCard';
import StatusBadge from '../../components/admin/StatusBadge';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';
import EmptyState from '../../components/EmptyState';
import OrderDetailsModal from '../../components/admin/OrderDetailsModal';
import { getProducts } from '../../services/productService';
import { getAdminOrders, updateOrderStatus, updatePaymentStatus } from '../../services/adminService';

/* Inline icons for cards */
const IconBox = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m7.5 4.27 9 5.15" />
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </svg>
);

const IconCheckCircle = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const IconShoppingBag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const IconClock = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

/**
 * AdminDashboardPage Component
 * Main overview dashboard presenting key metrics and recent orders.
 */
export default function AdminDashboardPage() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [productsRes, ordersRes] = await Promise.all([
        getProducts({ size: 100 }),
        getAdminOrders().catch((err) => {
          console.warn('Could not fetch admin orders', err);
          return [];
        }),
      ]);

      const productList = productsRes?.content || (Array.isArray(productsRes) ? productsRes : []);
      setProducts(productList);
      setOrders(Array.isArray(ordersRes) ? ordersRes : []);
    } catch (err) {
      console.error('Error fetching admin dashboard data:', err);
      setError('Failed to load dashboard statistics. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Dashboard stats calculations
  const totalProducts = products.length;
  const availableProducts = products.filter((p) => p.available).length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.orderStatus === 'PENDING').length;
  const totalRevenue = orders
    .filter((o) => o.orderStatus !== 'CANCELLED')
    .reduce((acc, o) => acc + (Number(o.totalAmount) || 0), 0);

  // Recent 5 orders sorted by date desc
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5);

  const handleUpdateStatus = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => ({ ...prev, orderStatus: newStatus }));
    }
  };

  const handleUpdatePaymentStatus = async (orderId, newPaymentStatus) => {
    await updatePaymentStatus(orderId, newPaymentStatus);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, paymentStatus: newPaymentStatus } : o))
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => ({ ...prev, paymentStatus: newPaymentStatus }));
    }
  };

  if (loading) {
    return <LoadingState message="Loading dashboard overview..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchDashboardData} />;
  }

  return (
    <div className="space-y-8 animate-fadeIn">

      {/* Header Banner */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Dashboard Overview
          </h2>
          <p className="text-xs font-medium text-slate-500">
            Real-time catalog and order status insights
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboardData}
            className="rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition"
          >
            🔄 Refresh Stats
          </button>
          <Link
            to="/admin/products"
            className="rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-orange-600/30 hover:bg-orange-700 transition"
          >
            + Add Product
          </Link>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Products"
          value={totalProducts}
          icon={<IconBox />}
          description="Total items in menu catalog"
          badgeText="Catalog"
          badgeColor="bg-slate-100 text-slate-700"
        />

        <StatCard
          title="Available Products"
          value={availableProducts}
          icon={<IconCheckCircle />}
          description={`${totalProducts - availableProducts} currently unavailable`}
          badgeText={availableProducts === totalProducts ? 'All Active' : 'Active'}
          badgeColor="bg-emerald-100 text-emerald-800"
        />

        <StatCard
          title="Total Orders"
          value={totalOrders}
          icon={<IconShoppingBag />}
          description={`Est. Revenue: $${totalRevenue.toFixed(2)}`}
          badgeText="All Time"
          badgeColor="bg-blue-100 text-blue-800"
        />

        <StatCard
          title="Pending Orders"
          value={pendingOrders}
          icon={<IconClock />}
          description="Orders requiring store confirmation"
          badgeText={pendingOrders > 0 ? 'Requires Action' : 'Clear'}
          badgeColor={pendingOrders > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}
        />
      </div>

      {/* Quick Action Banner */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          to="/admin/products"
          className="group flex items-center justify-between rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white to-slate-50/80 p-5 shadow-xs transition hover:border-orange-200 hover:shadow-md"
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
              Product Management
            </span>
            <h3 className="mt-1 text-base font-extrabold text-slate-900 group-hover:text-orange-600 transition">
              Manage Food Menu & Inventory
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Add new dishes, update prices, stock & availability
            </p>
          </div>
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-700 group-hover:bg-orange-600 group-hover:text-white transition">
            →
          </span>
        </Link>

        <Link
          to="/admin/orders"
          className="group flex items-center justify-between rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white to-slate-50/80 p-5 shadow-xs transition hover:border-blue-200 hover:shadow-md"
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Orders Management
            </span>
            <h3 className="mt-1 text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition">
              Process & Track Customer Orders
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Update order progress, payment statuses & delivery details
            </p>
          </div>
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition">
            →
          </span>
        </Link>
      </div>

      {/* Recent Orders Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Recent Orders
            </h3>
            <p className="text-xs font-medium text-slate-500">
              Latest incoming orders from customers
            </p>
          </div>

          <Link
            to="/admin/orders"
            className="text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline"
          >
            View All Orders →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <EmptyState
            title="No orders placed yet"
            message="When customers place orders, they will show up right here in real time."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3.5">Order ID</th>
                  <th className="px-5 py-3.5">Customer</th>
                  <th className="px-5 py-3.5">Items</th>
                  <th className="px-5 py-3.5">Total Amount</th>
                  <th className="px-5 py-3.5">Payment</th>
                  <th className="px-5 py-3.5">Order Status</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-5 py-4 font-bold text-slate-900">
                      #{order.id}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-800">{order.customerName || 'Customer'}</p>
                      <p className="text-xs text-slate-400">{order.customerPhone || 'N/A'}</p>
                    </td>
                    <td className="px-5 py-4 text-xs font-semibold text-slate-600">
                      {order.items ? `${order.items.length} item(s)` : 'N/A'}
                    </td>
                    <td className="px-5 py-4 font-extrabold text-slate-900">
                      ${Number(order.totalAmount || 0).toFixed(2)}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={order.paymentStatus} type="payment" />
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={order.orderStatus} type="order" />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsModalOpen(true);
                        }}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
        onUpdateStatus={handleUpdateStatus}
        onUpdatePaymentStatus={handleUpdatePaymentStatus}
      />

    </div>
  );
}
