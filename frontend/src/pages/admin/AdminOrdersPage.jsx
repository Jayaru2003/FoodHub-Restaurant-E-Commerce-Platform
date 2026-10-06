import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StatusBadge from '../../components/admin/StatusBadge';
import OrderDetailsModal from '../../components/admin/OrderDetailsModal';
import LoadingState from '../../components/LoadingState';
import EmptyState from '../../components/EmptyState';
import { getAdminOrders, updateOrderStatus, updatePaymentStatus } from '../../services/adminService';

const STATUS_TABS = [
  { id: 'ALL', label: 'All Orders' },
  { id: 'PENDING', label: 'Pending' },
  { id: 'CONFIRMED', label: 'Confirmed' },
  { id: 'PREPARING', label: 'Preparing' },
  { id: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
  { id: 'DELIVERED', label: 'Delivered' },
  { id: 'CANCELLED', label: 'Cancelled' },
];

/**
 * AdminOrdersPage Component
 * Full admin order management interface for processing customer orders.
 */
export default function AdminOrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthError, setIsAuthError] = useState(false);

  const [activeTab, setActiveTab] = useState('ALL');
  const [search, setSearch] = useState('');

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    setIsAuthError(false);
    try {
      const data = await getAdminOrders();
      const list = Array.isArray(data) ? data : (data?.content || []);
      setOrders(list);
    } catch (err) {
      console.error('Failed to load admin orders:', err);
      let errMsg = 'Failed to fetch orders. Please verify backend service availability.';
      if (err.response) {
        if (err.response.status === 401 || err.response.status === 403) {
          errMsg = 'Admin session expired or authorization required. Please log in with an Administrator account.';
          setIsAuthError(true);
        } else if (err.response.data?.message) {
          errMsg = err.response.data.message;
        }
      } else if (err.request) {
        errMsg = 'Unable to reach backend API at http://localhost:8080. Please ensure the FoodHub Spring Boot backend is running.';
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    if (!Array.isArray(orders)) return [];
    return orders.filter((order) => {
      const matchesTab =
        activeTab === 'ALL' || order.orderStatus?.toUpperCase() === activeTab;

      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        String(order.id || '').includes(query) ||
        (order.customerName || '').toLowerCase().includes(query) ||
        (order.customerPhone || '').toLowerCase().includes(query);

      return matchesTab && matchesSearch;
    });
  }, [orders, activeTab, search]);

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
    return <LoadingState message="Loading store orders..." />;
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-100 bg-red-50 p-8 text-center space-y-4">
        <p className="font-bold text-red-800 text-base">{error}</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={fetchOrders}
            className="rounded-xl bg-red-700 px-5 py-2.5 text-xs font-bold text-white hover:bg-red-800 transition"
          >
            🔄 Try again
          </button>
          {isAuthError && (
            <Link
              to="/login"
              className="rounded-xl border border-red-300 bg-white px-5 py-2.5 text-xs font-bold text-red-700 hover:bg-red-100 transition"
            >
              🔑 Log In as Admin
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* Title & Refresh */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Orders Management
          </h2>
          <p className="text-xs font-medium text-slate-500">
            Monitor, confirm, and update order & payment fulfillment statuses
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition"
        >
          🔄 Refresh Orders
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="space-y-4">
        {/* Status Tabs */}
        <div className="flex overflow-x-auto gap-1.5 border-b border-slate-200 pb-2 scrollbar-none">
          {STATUS_TABS.map((tab) => {
            const count = tab.id === 'ALL'
              ? orders.length
              : orders.filter((o) => o.orderStatus?.toUpperCase() === tab.id).length;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-bold transition flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] ${
                  activeTab === tab.id ? 'bg-orange-700 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <input
            type="text"
            placeholder="Search orders by Order #, Customer Name, or Phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-medium focus:border-orange-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        {filteredOrders.length === 0 ? (
          <EmptyState
            title="No orders found"
            message={
              search || activeTab !== 'ALL'
                ? 'No orders match your selected tab or search query.'
                : 'No customer orders have been recorded in the database yet.'
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3.5">Order ID</th>
                  <th className="px-5 py-3.5">Customer & Contact</th>
                  <th className="px-5 py-3.5">Items</th>
                  <th className="px-5 py-3.5">Total Amount</th>
                  <th className="px-5 py-3.5">Payment</th>
                  <th className="px-5 py-3.5">Order Status</th>
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredOrders.map((order) => {
                  const formattedDate = order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'N/A';

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-5 py-4 font-black text-slate-900">
                        #{order.id}
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-extrabold text-slate-900">{order.customerName || 'Customer'}</p>
                        <p className="text-xs text-slate-500">📞 {order.customerPhone || 'N/A'}</p>
                      </td>

                      <td className="px-5 py-4 text-xs font-bold text-slate-600">
                        {order.items?.length || 0} item(s)
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

                      <td className="px-5 py-4 text-xs text-slate-500 whitespace-nowrap">
                        {formattedDate}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsModalOpen(true);
                          }}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition shadow-2xs"
                        >
                          View & Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
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
