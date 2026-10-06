import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { CartProvider } from '../context/CartContext';

export default function MainLayout() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-[#fffdf9]">
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}
