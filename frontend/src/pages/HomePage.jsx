import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '../data/mockData';
import './HomePage.css';

/* ─── Section: Hero ─────────────────────────────────────── */
function HeroSection() {
  return (
    <section className="fh-hero" aria-label="Welcome to FoodHub">
      <div className="fh-section">
        <div className="fh-hero__inner">

          {/* Copy column */}
          <div className="fh-hero__copy">
            <p className="fh-hero__tag">
              <span className="fh-hero__tag-dot" aria-hidden="true" />
              Order &amp; Enjoy Today
            </p>

            <h1 className="fh-hero__headline">
              Your next favourite meal is{' '}
              <em>one click away.</em>
            </h1>

            <p className="fh-hero__sub">
              Discover restaurant-quality dishes made from fresh, locally sourced
              ingredients — delivered straight to your door with zero fuss.
            </p>

            <div className="fh-hero__cta-row">
              <Link
                to="/cart"
                id="hero-order-now-btn"
                className="fh-hero__btn fh-hero__btn--primary"
                aria-label="Start ordering food now"
              >
                🛒 Order Now
              </Link>
              <Link
                to="/products"
                id="hero-explore-menu-btn"
                className="fh-hero__btn fh-hero__btn--secondary"
                aria-label="Explore the full menu"
              >
                Explore Menu →
              </Link>
            </div>

            <div className="fh-hero__stats" aria-label="FoodHub statistics">
              <div>
                <p className="fh-hero__stat-value">50+</p>
                <p className="fh-hero__stat-label">Menu Items</p>
              </div>
              <div>
                <p className="fh-hero__stat-value">4.9★</p>
                <p className="fh-hero__stat-label">Customer Rating</p>
              </div>
              <div>
                <p className="fh-hero__stat-value">30 min</p>
                <p className="fh-hero__stat-label">Avg Delivery</p>
              </div>
            </div>
          </div>

          {/* Visual column */}
          <div className="fh-hero__visual" aria-hidden="true">
            <div className="fh-hero__glow" />
            <div className="fh-hero__img-frame">
              <img
                src="/images/hero_food_banner.jpg"
                alt="A spread of gourmet dishes from FoodHub"
                className="fh-hero__img"
                loading="eager"
                fetchpriority="high"
              />
              <div className="fh-hero__float-badge">
                <span className="fh-hero__float-badge-icon">👨‍🍳</span>
                <div className="fh-hero__float-badge-text">
                  <strong>Chef's Special</strong>
                  <span>Made fresh daily</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─── Section: Featured Products ────────────────────────── */
/**
 * TODO: Replace MOCK_PRODUCTS with a real API call:
 *   const { data, isLoading, error } = useAsync(() => getProducts({ size: 6 }));
 *   const products = data?.content ?? [];
 */
function FeaturedProducts() {
  const products = MOCK_PRODUCTS;

  return (
    <section className="fh-featured" aria-labelledby="featured-heading">
      <div className="fh-section">
        <header className="fh-section-header">
          <span className="fh-section-label">Our Menu</span>
          <h2 className="fh-section-title" id="featured-heading">
            Freshly Featured Dishes
          </h2>
          <p className="fh-section-sub">
            Handpicked by our chefs — a taste of what's waiting for you on the full menu.
          </p>
        </header>

        <div className="fh-featured__grid" role="list" aria-label="Featured food items">
          {products.map((product) => (
            <div key={product.id} role="listitem">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="fh-featured__footer">
          <Link
            to="/products"
            id="view-full-menu-btn"
            className="fh-view-all-btn"
            aria-label="View the complete menu"
          >
            View Full Menu →
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Section: Categories ───────────────────────────────── */
/**
 * TODO: Replace MOCK_CATEGORIES with a real API call:
 *   const { data: categories } = useAsync(getCategories);
 */
function CategoriesSection() {
  const navigate = useNavigate();
  const categories = MOCK_CATEGORIES;

  const handleCategoryClick = (categoryId) => {
    navigate(`/products?category=${encodeURIComponent(categoryId)}`);
  };

  return (
    <section className="fh-categories" aria-labelledby="categories-heading">
      <div className="fh-section">
        <header className="fh-section-header">
          <span className="fh-section-label">Browse by Category</span>
          <h2 className="fh-section-title" id="categories-heading">
            What Are You Craving?
          </h2>
          <p className="fh-section-sub">
            Tap a category to instantly filter the menu to your taste.
          </p>
        </header>

        <div className="fh-categories__grid" role="list" aria-label="Food categories">
          {categories.map((cat) => (
            <button
              key={cat.id}
              id={`category-${cat.id}-btn`}
              type="button"
              className="fh-category-card"
              onClick={() => handleCategoryClick(cat.id)}
              aria-label={`Browse ${cat.name}: ${cat.description}`}
              role="listitem"
            >
              <span className="fh-category-card__emoji" aria-hidden="true">
                {cat.emoji}
              </span>
              <span className="fh-category-card__name">{cat.name}</span>
              <span className="fh-category-card__desc">{cat.description}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Section: Why Choose FoodHub ───────────────────────── */
const BENEFITS = [
  {
    id: 'fresh-food',
    icon: '🥬',
    title: 'Fresh Food',
    desc: 'Every dish is prepared with locally sourced, seasonal ingredients — no shortcuts, no frozen shortcuts.',
  },
  {
    id: 'fast-delivery',
    icon: '⚡',
    title: 'Fast Delivery',
    desc: 'From our kitchen to your door in 30 minutes or less. We mean it.',
  },
  {
    id: 'secure-payment',
    icon: '🔒',
    title: 'Secure Payment',
    desc: 'Industry-standard encryption keeps your payment details safe at every step.',
  },
  {
    id: 'easy-ordering',
    icon: '📱',
    title: 'Easy Ordering',
    desc: 'A seamless browse-to-checkout experience that takes less than 60 seconds.',
  },
];

function WhyChooseSection() {
  return (
    <section className="fh-why" aria-labelledby="why-heading">
      <div className="fh-section">
        <header className="fh-section-header">
          <span className="fh-section-label">Why FoodHub?</span>
          <h2 className="fh-section-title" id="why-heading">
            Food You Can Trust
          </h2>
          <p className="fh-section-sub">
            We hold ourselves to a higher standard so every order feels like it
            came from a restaurant that cares.
          </p>
        </header>

        <div className="fh-why__grid" role="list" aria-label="FoodHub benefits">
          {BENEFITS.map((b) => (
            <div key={b.id} className="fh-benefit-card" role="listitem" id={`benefit-${b.id}`}>
              <div className="fh-benefit-card__icon-wrap" aria-hidden="true">
                {b.icon}
              </div>
              <h3 className="fh-benefit-card__title">{b.title}</h3>
              <p className="fh-benefit-card__desc">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Section: CTA ──────────────────────────────────────── */
function CtaSection() {
  return (
    <section className="fh-cta" aria-labelledby="cta-heading">
      <div className="fh-section">
        <div className="fh-cta__inner">
          <span className="fh-cta__emoji" aria-hidden="true">🍽️</span>
          <h2 className="fh-cta__title" id="cta-heading">
            Ready to Order Something Amazing?
          </h2>
          <p className="fh-cta__sub">
            Hundreds of satisfied customers order from FoodHub every day. Your
            next great meal is just a few clicks away.
          </p>
          <div className="fh-cta__actions">
            <Link
              to="/products"
              id="cta-browse-menu-btn"
              className="fh-cta__btn fh-cta__btn--white"
              aria-label="Browse the full menu"
            >
              🍴 Browse Menu
            </Link>
            <Link
              to="/register"
              id="cta-signup-btn"
              className="fh-cta__btn fh-cta__btn--outline"
              aria-label="Create a free account"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Page root ─────────────────────────────────────────── */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedProducts />
      <CategoriesSection />
      <WhyChooseSection />
      <CtaSection />
    </>
  );
}
