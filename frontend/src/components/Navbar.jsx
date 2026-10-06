import { useState, useEffect, useRef, useCallback } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

/* ── nav items config ──────────────────────────────────── */
const NAV_ITEMS = [
  { label: 'Home',             to: '/',          end: true  },
  { label: 'Menu / Products',  to: '/products',  end: false },
  { label: 'About',            to: '/about',     end: true  },
  { label: 'Contact',          to: '/contact',   end: true  },
];

/* ── SVG icons (inline, no external dep) ───────────────── */
const IconSearch = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
       viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
       aria-hidden="true">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconCart = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
       viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
       aria-hidden="true">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const IconArrow = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15"
       viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
       aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const IconFork = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
       viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
       aria-hidden="true">
    <line x1="12" y1="2" x2="12" y2="22" />
    <path d="M17 2v4a5 5 0 0 1-5 5" />
    <path d="M7 2v4a5 5 0 0 0 5 5" />
  </svg>
);

/* ═══════════════════════════════════════════════════════════
   Navbar Component
   ═══════════════════════════════════════════════════════════ */
export default function Navbar() {
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const [searchVal,  setSearchVal]  = useState('');

  const searchInputRef = useRef(null);
  const navigate       = useNavigate();

  // Cart count from context
  const { cartCount } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const [badgeBump, setBadgeBump] = useState(false);

  useEffect(() => {
    if (cartCount === 0) return;
    setBadgeBump(true);
    const timer = setTimeout(() => setBadgeBump(false), 300);
    return () => clearTimeout(timer);
  }, [cartCount]);

  /* ── scroll shadow ─────────────────────────────────────── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── close menu on route change & escape key ───────────── */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  /* ── prevent body scroll when mobile drawer is open ───── */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  /* ── focus search input when panel opens ───────────────── */
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 280);
    }
  }, [searchOpen]);

  /* ── handlers ──────────────────────────────────────────── */
  const toggleSearch = useCallback(() => {
    setSearchOpen((v) => !v);
    setMenuOpen(false);
  }, []);

  const toggleMenu = useCallback(() => {
    setMenuOpen((v) => !v);
    setSearchOpen(false);
  }, []);

  const closeMobileMenu = useCallback(() => setMenuOpen(false), []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchVal.trim())}`);
      setSearchOpen(false);
      setSearchVal('');
    }
  };

  /* ── active-link class helper ──────────────────────────── */
  const navLinkClass = ({ isActive }) =>
    `fh-nav__link${isActive ? ' fh-nav__link--active' : ''}`;

  const drawerLinkClass = ({ isActive }) =>
    `fh-drawer__link${isActive ? ' fh-drawer__link--active' : ''}`;

  return (
    <>
      {/* ═══════ NAVBAR ════════════════════════════════════ */}
      <header
        className={`fh-nav${scrolled ? ' fh-nav--scrolled' : ''}`}
        role="banner"
      >
        <div className="fh-nav__inner">

          {/* ── Logo ─────────────────────────────────────── */}
          <Link
            to="/"
            className="fh-nav__logo"
            aria-label="FoodHub – go to homepage"
            onClick={closeMobileMenu}
          >
            <span className="fh-nav__logo-icon" aria-hidden="true">
              <IconFork />
            </span>
            <span className="fh-nav__logo-text">
              <span className="fh-nav__logo-name">
                Food<span>Hub</span>
              </span>
              <span className="fh-nav__logo-tagline">Culinary Express</span>
            </span>
          </Link>

          {/* ── Desktop nav links ─────────────────────────── */}
          <nav aria-label="Main navigation">
            <ul className="fh-nav__links" role="list">
              {NAV_ITEMS.map(({ label, to, end }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={end}
                    className={navLinkClass}
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* ── Desktop right actions ─────────────────────── */}
          <div className="fh-nav__actions" role="toolbar" aria-label="Site actions">

            {/* Search */}
            <div className={`fh-search${searchOpen ? ' fh-search--open' : ''}`}>
              <form onSubmit={handleSearchSubmit}>
                <div className="fh-search__input-wrapper">
                  <input
                    ref={searchInputRef}
                    type="search"
                    className="fh-search__input"
                    placeholder="Search dishes…"
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    aria-label="Search dishes"
                    aria-expanded={searchOpen}
                  />
                </div>
              </form>
              <button
                type="button"
                className="fh-search__btn"
                onClick={toggleSearch}
                aria-label={searchOpen ? 'Close search' : 'Open search'}
                aria-expanded={searchOpen}
              >
                <IconSearch />
              </button>
            </div>

            {/* Cart */}
            <div className="fh-cart">
              <Link
                to="/cart"
                className="fh-cart__btn"
                aria-label={`View cart${cartCount > 0 ? `, ${cartCount} item${cartCount !== 1 ? 's' : ''}` : ''}`}
              >
                <IconCart />
              </Link>
              {cartCount > 0 && (
                <span className={`fh-cart__badge${badgeBump ? ' fh-cart__badge--bump' : ''}`} aria-hidden="true">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </div>

            {/* Account / Sign In */}
            {isAuthenticated ? (
              <div className="fh-user-menu flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-800">
                  👤 {user?.name ? user.name.split(' ')[0] : 'Account'}
                </span>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="fh-signin"
                aria-label="Sign in to your account"
              >
                Sign In <IconArrow />
              </Link>
            )}
          </div>

          {/* ── Mobile hamburger ──────────────────────────── */}
          <button
            type="button"
            className={`fh-hamburger${menuOpen ? ' fh-hamburger--open' : ''}`}
            onClick={toggleMenu}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="fh-mobile-menu"
          >
            <span className="fh-hamburger__icon" aria-hidden="true">
              <span className="fh-hamburger__line" />
              <span className="fh-hamburger__line" />
              <span className="fh-hamburger__line" />
            </span>
          </button>

        </div>
      </header>

      {/* ═══════ MOBILE OVERLAY ════════════════════════════ */}
      <div
        className={`fh-overlay${menuOpen ? ' fh-overlay--visible' : ''}`}
        onClick={closeMobileMenu}
        aria-hidden="true"
      />

      {/* ═══════ MOBILE DRAWER ═════════════════════════════ */}
      <nav
        id="fh-mobile-menu"
        className={`fh-drawer${menuOpen ? ' fh-drawer--open' : ''}`}
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
      >
        {/* Nav links */}
        {NAV_ITEMS.map(({ label, to, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={drawerLinkClass}
            onClick={closeMobileMenu}
          >
            <span className="fh-drawer__link-dot" aria-hidden="true" />
            {label}
          </NavLink>
        ))}

        <div className="fh-drawer__divider" role="separator" />

        <div className="fh-drawer__actions">
          {/* Mobile search */}
          <form onSubmit={handleSearchSubmit}>
            <div className="fh-drawer__search">
              <span className="fh-drawer__search-icon" aria-hidden="true">
                <IconSearch />
              </span>
              <input
                type="search"
                className="fh-drawer__search-input"
                placeholder="Search dishes…"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                aria-label="Search dishes"
              />
            </div>
          </form>

          {/* Mobile cart link */}
          <Link
            to="/cart"
            className="fh-drawer__link"
            style={{ justifyContent: 'space-between' }}
            onClick={closeMobileMenu}
            aria-label={`View cart${cartCount > 0 ? `, ${cartCount} items` : ''}`}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span className="fh-drawer__link-dot" style={{ opacity: 1, background: '#ea580c' }} aria-hidden="true" />
              Cart
            </span>
            {cartCount > 0 && (
              <span
                style={{
                  background: '#ea580c',
                  color: '#fff',
                  borderRadius: '999px',
                  padding: '0 8px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  minWidth: '22px',
                  textAlign: 'center',
                }}
                aria-hidden="true"
              >
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>

          {/* Mobile Sign In / Logout */}
          {isAuthenticated ? (
            <button
              type="button"
              className="fh-drawer__signin"
              style={{ background: '#f1f5f9', color: '#334155' }}
              onClick={() => {
                logout();
                closeMobileMenu();
              }}
            >
              Logout ({user?.name ? user.name.split(' ')[0] : 'User'})
            </button>
          ) : (
            <Link
              to="/login"
              className="fh-drawer__signin"
              onClick={closeMobileMenu}
              aria-label="Sign in to your account"
            >
              Sign In <IconArrow />
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}
