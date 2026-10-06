import { Link } from 'react-router-dom';
import { MOCK_CATEGORIES } from '../data/mockData';
import './Footer.css';

/**
 * Footer – global site footer rendered by MainLayout.
 *
 * Category links pull from MOCK_CATEGORIES (same mock used on HomePage).
 * When the real GET /api/categories endpoint is ready, replace the import
 * with a useAsync call here.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="fh-footer" aria-label="FoodHub site footer">
      <div className="fh-footer__section">
        <div className="fh-footer__grid">

          {/* Brand column */}
          <div>
            <p className="fh-footer__brand-name">Food<span>Hub</span></p>
            <p className="fh-footer__brand-desc">
              Fresh ingredients, bold flavours, fast delivery. FoodHub brings
              restaurant quality straight to your table.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <p className="fh-footer__col-title">Quick Links</p>
            <ul className="fh-footer__links">
              <li><Link to="/"         className="fh-footer__link">Home</Link></li>
              <li><Link to="/products" className="fh-footer__link">Menu</Link></li>
              <li><Link to="/about"    className="fh-footer__link">About Us</Link></li>
              <li><Link to="/contact"  className="fh-footer__link">Contact</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <p className="fh-footer__col-title">Account</p>
            <ul className="fh-footer__links">
              <li><Link to="/login"    className="fh-footer__link">Sign In</Link></li>
              <li><Link to="/register" className="fh-footer__link">Register</Link></li>
              <li><Link to="/cart"     className="fh-footer__link">My Cart</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <p className="fh-footer__col-title">Categories</p>
            <ul className="fh-footer__links">
              {MOCK_CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/products?category=${cat.id}`}
                    className="fh-footer__link"
                  >
                    {cat.emoji} {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className="fh-footer__bottom">
          <p className="fh-footer__copy">
            © {year} <span>FoodHub</span>. All rights reserved.
          </p>
          <p className="fh-footer__copy">Made with ❤️ for food lovers everywhere.</p>
        </div>
      </div>
    </footer>
  );
}
