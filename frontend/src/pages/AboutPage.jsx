import { Link } from 'react-router-dom';

export default function AboutPage() {
  const VALUES = [
    {
      icon: '🥗',
      title: 'Fresh & Locally Sourced',
      description: 'Every ingredient is hand-selected daily from top local farms and trusted artisans to guarantee maximum flavor and peak nutritional quality.',
    },
    {
      icon: '👨‍🍳',
      title: 'Crafted by Culinary Experts',
      description: 'Our team of experienced chefs blends traditional culinary traditions with modern flair to craft meals that delight every palate.',
    },
    {
      icon: '⚡',
      title: 'Express Hot Delivery',
      description: 'Using custom insulated temperature-controlled packaging, we deliver your food straight from the pan to your door in under 30 minutes.',
    },
    {
      icon: '🌱',
      title: '100% Eco-Friendly Packaging',
      description: 'We believe great food shouldn’t cost the Earth. All of our containers and utensils are 100% biodegradable and compostable.',
    },
  ];

  const STATS = [
    { value: '50,000+', label: 'Delivered Orders' },
    { value: '4.9 / 5', label: 'Customer Rating' },
    { value: '30 mins', label: 'Average Delivery' },
    { value: '100%', label: 'Freshness Guaranteed' },
  ];

  const TEAM = [
    {
      name: 'Chef Marcus Vance',
      role: 'Head Culinary Officer',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToOECu4g2ln5cNYbkMjZ7sAS3IvboTabkbaJgd1bmjBf5jP-3P2_X_6kM&s=10',
      bio: 'Over 15 years leading Michelin-recognized kitchens across New York and Paris.',
    },
    {
      name: 'Elena Rostova',
      role: 'Master Pastry Chef',
      image: 'https://www.ocregister.com/wp-content/uploads/2025/12/OCR-L-INF25-Viet-Nguyen-02-1.jpg',
      bio: 'Specialist in artisan desserts, sourdough baking, and delicate sweet creations.',
    },
    {
      name: 'Kenji Takahashi',
      role: 'Executive Chef - Asian Fusion',
      image: 'https://miro.medium.com/v2/resize:fit:1200/1*sLRzh0rzv1ByxtpS_7SbhA.jpeg',
      bio: 'Passionate about authentic traditional techniques combined with fresh local produce.',
    },
  ];

  return (
    <div className="bg-slate-50/50 min-h-screen py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* ── 1. Hero Banner ─────────────────────────────────── */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-500 to-amber-600 p-8 sm:p-12 md:p-16 text-white shadow-soft">
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-white animate-pulse" /> About FoodHub
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white">
              Bringing Culinary Excellence Straight to Your Door.
            </h1>
            <p className="text-lg text-amber-100/90 leading-relaxed max-w-2xl">
              At FoodHub, we believe every meal should be a memorable experience. We connect food lovers with fresh, restaurant-grade meals prepared with passion and delivered lightning-fast.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-brand-600 shadow-md hover:bg-slate-100 transition"
              >
                🍴 Explore Our Menu
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white/60 px-6 py-3.5 text-sm font-bold text-white hover:bg-white/10 transition"
              >
                Contact Our Team →
              </Link>
            </div>
          </div>
          <div className="absolute -right-16 -bottom-16 opacity-10 pointer-events-none text-[18rem]" aria-hidden="true">
            🍳
          </div>
        </div>

        {/* ── 2. Our Story Section ───────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="font-bold uppercase tracking-widest text-brand-600 text-xs">Our Journey</span>
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
              From a Local Kitchen Vision to Your Everyday Favorite Dish
            </h2>
            <p className="text-slate-600 leading-relaxed">
              FoodHub was born out of a simple desire: eliminating the gap between high-end restaurant meals and convenient food delivery. We noticed that traditional food delivery often compromised on freshness, temperature, and presentation.
            </p>
            <p className="text-slate-600 leading-relaxed">
              We set out to build a platform that partners directly with top local chefs, uses real-time kitchen orchestration, and enforces rigorous quality standards at every phase — ensuring that every dish arrives at your table exactly as the chef intended.
            </p>
            <div className="pt-2 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <p className="text-2xl font-black text-brand-600">100%</p>
                <p className="text-xs font-semibold text-slate-500 mt-1">Real Ingredients Only</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <p className="text-2xl font-black text-brand-600">&lt; 30 min</p>
                <p className="text-xs font-semibold text-slate-500 mt-1">Average Delivery Time</p>
              </div>
            </div>
          </div>
          <div className="relative rounded-3xl overflow-hidden shadow-soft border border-slate-100 group">
            <img
              src="/images/hero_food_banner.jpg"
              alt="FoodHub gourmet kitchen display"
              className="w-full h-[400px] object-cover transition transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-8">
              <p className="text-white font-medium italic text-sm">
                "Food is not just sustenance; it’s an art form that brings people together."
              </p>
            </div>
          </div>
        </div>

        {/* ── 3. Core Values Grid ─────────────────────────────── */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="font-bold uppercase tracking-widest text-brand-600 text-xs">What Drives Us</span>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">Our Core Principles</h2>
            <p className="mt-2 text-slate-600 text-sm">
              We maintain an uncompromising dedication to food safety, taste excellence, and customer happiness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, index) => (
              <div key={index} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md hover:-translate-y-1">
                <div className="h-12 w-12 rounded-2xl bg-brand-50 flex items-center justify-center text-2xl mb-4">
                  {v.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{v.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 4. Stats Highlight ──────────────────────────────── */}
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 shadow-soft">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
            {STATS.map((stat, i) => (
              <div key={i} className={i !== 0 ? 'pt-6 lg:pt-0' : ''}>
                <p className="text-3xl sm:text-4xl font-extrabold text-brand-500">{stat.value}</p>
                <p className="mt-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 5. Culinary Team Spotlight ──────────────────────── */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="font-bold uppercase tracking-widest text-brand-600 text-xs">Meet The Masters</span>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">Behind the FoodHub Kitchen</h2>
            <p className="mt-2 text-slate-600 text-sm">
              Passionate culinary professionals committed to crafting unforgettable meals every single day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TEAM.map((member, i) => (
              <div key={i} className="rounded-3xl bg-white border border-slate-100 overflow-hidden shadow-sm transition hover:shadow-md">
                <div className="h-48 overflow-hidden bg-slate-100">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition duration-300 hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-900">{member.name}</h3>
                  <p className="text-xs font-semibold text-brand-600 mb-3">{member.role}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 6. Bottom Call To Action ────────────────────────── */}
        <div className="rounded-3xl bg-brand-50 border border-brand-100 p-8 sm:p-12 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Ready to Taste the Difference?
          </h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            Explore our diverse, freshly updated menu and order your next favorite dish in less than 60 seconds.
          </p>
          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-8 py-3.5 text-sm font-bold text-white shadow-md hover:bg-brand-700 transition"
            >
              Order Food Now 🛒
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
