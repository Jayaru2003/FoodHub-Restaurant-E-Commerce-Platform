import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../services/productService';
import './Footer.css';

/**
 * Footer – global site footer rendered by MainLayout.
 */
export default function Footer() {
  const year = new Date().getFullYear();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let isMounted = true;
    getCategories()
      .then((data) => {
        if (isMounted) setCategories(data || []);
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

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
              {categories.length === 0 ? (
                <li><Link to="/products" className="fh-footer__link">All Menu</Link></li>
              ) : (
                categories.slice(0, 5).map((cat) => (
                  <li key={cat.id}>
                    <Link
                      to={`/products?categoryId=${encodeURIComponent(cat.id)}`}
                      className="fh-footer__link"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))
              )}
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
