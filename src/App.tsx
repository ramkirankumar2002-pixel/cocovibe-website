import { lazy, Suspense } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Hero from './components/sections/Hero';
import CartDrawer from './components/cart/CartDrawer';
import CheckoutModal from './components/cart/CheckoutModal';
import AuthPage from './components/auth/AuthPage';
import Dashboard from './components/dashboard/Dashboard';

// Lazy load sections below the fold for better performance
const About = lazy(() => import('./components/sections/About'));
const Flavours = lazy(() => import('./components/sections/Flavours'));
const Experience = lazy(() => import('./components/sections/Experience'));
const Testimonials = lazy(() => import('./components/sections/Testimonials'));
const Contact = lazy(() => import('./components/sections/Contact'));

const Spinner = () => (
  <div className="w-full py-40 flex justify-center items-center bg-beige">
    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

function AppContent() {
  const { page } = useAuth();

  if (page === 'auth') return <AuthPage />;
  if (page === 'dashboard') return <Dashboard />;

  return (
    <div className="relative w-full h-full min-h-screen font-sans antialiased text-charcoal selection:bg-primary/20">
      <Navbar />

      <main>
        <Hero />
        <Suspense fallback={<Spinner />}>
          <About />
          <Flavours />
          <Experience />
          <Testimonials />
          <Contact />
        </Suspense>
      </main>

      <footer className="bg-charcoal text-white py-16 text-center relative z-10 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="mb-8">
            <span className="text-3xl font-black tracking-tighter text-white">
              Coco<span className="text-primary">Vibe</span>
            </span>
          </div>
          <p className="opacity-60 mb-8 font-light max-w-md mx-auto">
            Bringing the purest tropical hydration straight from nature to your hands. Refresh your soul.
          </p>
          <div className="flex justify-center space-x-8 opacity-60 uppercase text-xs tracking-widest font-bold">
            <a href="#" className="hover:text-primary transition-colors">Instagram</a>
            <a href="#" className="hover:text-primary transition-colors">Twitter</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
          </div>
          <p className="mt-12 text-sm opacity-40">&copy; {new Date().getFullYear()} CocoVibe Inc. All rights reserved.</p>
        </div>
      </footer>

      <CartDrawer />
      <CheckoutModal />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
