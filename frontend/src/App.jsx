import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

// Import Global Components
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import About from './pages/About';

// Import Public Pages
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Home from './pages/Home';
import Login from './pages/Login';
import ProductDetails from './pages/ProductDetails';

import ChatWidget from './components/ChatWidget';

// Import Admin Pages & Protection
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './pages/AdminDashboard';
import AdminOrders from './pages/AdminOrders';
import AdminProducts from './pages/AdminProducts';

const App = () => {
  return (
    <Router>
      {/* Invisible component that instantly scrolls to top on page change */}
      <ScrollToTop />

      <Navbar />

      <main style={{ minHeight: '100vh', margin: 0, padding: 0 }}>
        <Routes>
          {/* Public Store Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />

          {/* Admin Backend Routes */}
          <Route path="/admin" element={<AdminRoute />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
          </Route>
        </Routes>
      </main>

      <Footer />

      {/* Floating chat widget - shows on every page, above Router's Routes so it persists across navigation */}
      <ChatWidget />
    </Router>
  );
};

export default App;
