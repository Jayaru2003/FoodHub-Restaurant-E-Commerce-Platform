import React, { useState, useEffect } from 'react';
import { NavLink, Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/* ── Inline SVG icons ──────────────────────────────────── */
const IconDashboard = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="7" height="9" x="3" y="3" rx="1" />
    <rect width="7" height="5" x="14" y="3" rx="1" />
    <rect width="7" height="9" x="14" y="12" rx="1" />
    <rect width="7" height="5" x="3" y="16" rx="1" />
  </svg>
);

const IconProducts = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m7.5 4.27 9 5.15" />
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </svg>
);

const IconCategories = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="7" height="7" x="3" y="3" rx="1" />
    <rect width="7" height="7" x="14" y="3" rx="1" />
    <rect width="7" height="7" x="14" y="14" rx="1" />
    <rect width="7" height="7" x="3" y="14" rx="1" />
  </svg>
);

const IconOrders = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const IconStore = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const IconLogout = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const IconFork = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="2" x2="12" y2="22" />
    <path d="M17 2v4a5 5 0 0 1-5 5" />
    <path d="M7 2v4a5 5 0 0 0 5 5" />
  </svg>
);

const IconMenu = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const IconClose = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/**
 * AdminLayout Component
 * Primary layout shell for all Admin pages.
 * Includes Header, Mobile Responsive Sidebar, and Main Content Outlet.
 */
export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClasses = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-bold transition ${
      isActive
        ? 'bg-orange-600 text-white shadow-sm shadow-orange-500/30'
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased flex flex-col md:flex-row">

      {/* ── Mobile Header Bar ───────────────────────────────── */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 transition"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <IconClose /> : <IconMenu />}
          </button>

          <Link to="/admin" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600 text-white">
              <IconFork />
            </span>
            <span className="text-base font-extrabold text-slate-900">
              FoodHub <span className="text-orange-600 text-xs font-bold uppercase tracking-wider">Admin</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-bold text-orange-800">
            ADMIN
          </span>
        </div>
      </header>

      {/* ── Mobile Sidebar Overlay Backdrop ─────────────────── */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs md:hidden"
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar (Responsive: Drawer on mobile, Fixed sidebar on desktop) ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-900 text-slate-300 transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="flex h-20 items-center justify-between px-6 border-b border-slate-800/80">
          <Link to="/admin" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-600 text-white shadow-lg shadow-orange-600/30">
              <IconFork />
            </span>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold text-white tracking-tight leading-tight">
                FoodHub
              </span>
              <span className="text-[11px] font-bold text-orange-400 uppercase tracking-widest">
                Admin Console
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1 text-slate-400 hover:text-white md:hidden"
          >
            <IconClose />
          </button>
        </div>

        {/* User Info Card */}
        <div className="mx-4 my-4 rounded-xl bg-slate-800/60 p-3.5 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500/20 text-orange-400 font-bold text-sm border border-orange-500/30">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="truncate text-xs font-bold text-white">
                {user?.name || 'Administrator'}
              </p>
              <p className="truncate text-[11px] font-medium text-slate-400">
                {user?.email || 'admin@foodhub.com'}
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Navigation Links */}
        <nav className="flex-1 space-y-1 px-4 py-2" aria-label="Admin Navigation">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Main Menu
          </div>

          <NavLink to="/admin" end className={navLinkClasses}>
            <IconDashboard />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/admin/products" className={navLinkClasses}>
            <IconProducts />
            <span>Products</span>
          </NavLink>

          <NavLink to="/admin/categories" className={navLinkClasses}>
            <IconCategories />
            <span>Categories</span>
          </NavLink>

          <NavLink to="/admin/orders" className={navLinkClasses}>
            <IconOrders />
            <span>Orders</span>
          </NavLink>
        </nav>

        {/* Sidebar Footer / System Actions */}
        <div className="border-t border-slate-800/80 p-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            System
          </div>

          <Link
            to="/"
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <IconStore />
            <span>Back to Store</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-bold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition text-left"
          >
            <IconLogout />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content Container ──────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-x-hidden min-w-0">
        
        {/* Desktop Header */}
        <header className="hidden md:flex h-20 items-center justify-between border-b border-slate-200/80 bg-white px-8">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              FoodHub Admin Control Center
            </h1>
            <p className="text-xs font-medium text-slate-500">
              Manage products, inventory, customer orders, and operations
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
            >
              <IconStore /> Storefront
            </Link>

            <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
              <div className="text-right">
                <p className="text-xs font-bold text-slate-800">{user?.name || 'Admin User'}</p>
                <span className="inline-block text-[10px] font-extrabold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                  ADMIN ROLE
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

    </div>
  );
}
