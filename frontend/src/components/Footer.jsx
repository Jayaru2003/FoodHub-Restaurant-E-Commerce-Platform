export default function Footer() {
  return (
    <footer className="mt-20 border-t border-orange-100 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <p>© {new Date().getFullYear()} FoodHub. Made for good food.</p>
        <p>Fresh ingredients. Local favourites. Delivered with care.</p>
      </div>
    </footer>
  );
}
