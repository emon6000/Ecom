import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { cartItems } = useCart();
  const currentSearch = searchParams.get('search') || '';

  const handleSearch = (e) => {
    navigate(`/?search=${e.target.value}`);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + Number(item.qty || 0), 0);

  return (
    <nav
      className="navbar"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#1e293b',
        padding: '10px 40px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        color: 'white',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        flexWrap: 'wrap',
        gap: '15px',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      {/* Left: Logo Section */}
      <div
        onClick={() => navigate('/')}
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
      >
        <img
          src="/logo.png"
          alt="My Store Logo"
          style={{
            height: '80px',
            width: 'auto',
            objectFit: 'contain',
            margin: '-10px 0'
          }}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        <span
          className="brand-text"
          style={{
            color: '#4ade80',
            fontSize: '22px',
            fontWeight: '900',
            letterSpacing: '1.5px',
            marginLeft: '15px',
            fontFamily: 'system-ui, sans-serif'
          }}
        >
          MAGIC SHOP
        </span>
      </div>

      {/* Center: Navigation & Search */}
      <div
        className="nav-center"
        style={{ display: 'flex', alignItems: 'center', gap: '30px', flex: 1, justifyContent: 'center' }}
      >
        <span
          className="nav-link"
          onClick={() => navigate('/')}
          style={{
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            color: '#e2fce8',
            letterSpacing: '0.5px'
          }}
        >
          Home
        </span>

        <div className="search-container" style={{ position: 'relative', width: '100%', maxWidth: '450px' }}>
          <span
            style={{
              position: 'absolute',
              left: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              opacity: 0.5,
              fontSize: '14px'
            }}
          >
            🔍
          </span>
          <input
            type="text"
            placeholder="Search products..."
            value={currentSearch}
            onChange={handleSearch}
            style={{
              width: '100%',
              padding: '12px 20px 12px 40px',
              borderRadius: '25px',
              border: 'none',
              outline: 'none',
              fontSize: '15px',
              backgroundColor: '#f8fafc',
              color: '#334155',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <span
          className="nav-link"
          onClick={() => navigate('/about')}
          style={{
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            color: '#e2fce8',
            letterSpacing: '0.5px'
          }}
        >
          About Us
        </span>
      </div>

      {/* Right: Cart Button */}
      <div
        onClick={() => navigate('/cart')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          backgroundColor: '#3b82f6',
          padding: '10px 20px',
          borderRadius: '25px',
          fontWeight: 'bold',
          transition: 'background 0.2s',
          boxShadow: '0 2px 8px rgba(59, 130, 246, 0.4)'
        }}
      >
        <svg
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>

        <span>Cart</span>

        <span
          style={{
            backgroundColor: '#ef4444',
            color: 'white',
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '13px',
            marginLeft: '4px',
            display: cartCount > 0 ? 'inline-block' : 'none'
          }}
        >
          {cartCount}
        </span>
      </div>
    </nav>
  );
};

export default Navbar;