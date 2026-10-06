import { Link } from 'react-router-dom';

export default function FeaturePlaceholderPage({ title, description }) {
  return (
    <section className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
      <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-brand-100 text-4xl">🍴</div>
      <h1 className="mt-8 text-4xl font-extrabold text-ink">{title}</h1>
      <p className="mt-4 leading-7 text-slate-500">{description}</p>
      <Link to="/products" className="mt-8 inline-flex rounded-2xl bg-brand-600 px-6 py-3 font-bold text-white hover:bg-brand-700">Browse the menu</Link>
    </section>
  );
}
