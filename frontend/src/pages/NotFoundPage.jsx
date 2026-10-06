import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-20 text-center">
      <p className="text-6xl font-extrabold text-brand-500">404</p>
      <h1 className="mt-5 text-3xl font-extrabold">That page is off the menu</h1>
      <Link to="/" className="mt-7 inline-flex rounded-2xl bg-brand-600 px-6 py-3 font-bold text-white hover:bg-brand-700">Back home</Link>
    </section>
  );
}
