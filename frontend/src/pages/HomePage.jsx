import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div>
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div>
          <p className="mb-5 inline-flex rounded-full bg-brand-100 px-4 py-2 text-sm font-bold text-brand-700">Good food, good mood</p>
          <h1 className="max-w-xl text-4xl font-extrabold leading-tight text-ink sm:text-5xl lg:text-6xl">
            Your next favourite meal is <span className="text-brand-600">one click away.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">
            Discover comforting classics and fresh new flavours from the FoodHub kitchen, prepared for your table.
          </p>
          <Link to="/products" className="mt-8 inline-flex rounded-2xl bg-brand-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-orange-200 hover:bg-brand-700">
            Explore the menu <span className="ml-2">→</span>
          </Link>
        </div>
        <div className="relative mx-auto w-full max-w-lg">
          <div className="absolute -inset-4 rounded-[3rem] bg-orange-100/70 blur-2xl" />
          <div className="relative grid aspect-square place-items-center overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-orange-300 via-brand-500 to-red-500 text-[10rem] shadow-soft sm:text-[12rem]">
            🍔
            <span className="absolute bottom-5 left-5 rounded-2xl bg-white/95 px-4 py-3 text-left shadow-lg">
              <strong className="block text-sm text-ink">Chef's special</strong>
              <span className="text-xs text-slate-500">Made fresh today</span>
            </span>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-8 sm:grid-cols-3 sm:px-6 lg:px-8">
        {[
          ['🥬', 'Fresh ingredients', 'Simple, quality ingredients in every bite.'],
          ['⚡', 'Quick ordering', 'Find what you want and keep it simple.'],
          ['💛', 'Made with care', 'Food that feels like it came from home.']
        ].map(([icon, title, text]) => (
          <div key={title} className="rounded-3xl border border-orange-100 bg-white p-6">
            <span className="text-2xl">{icon}</span>
            <h2 className="mt-4 font-bold">{title}</h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">{text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
