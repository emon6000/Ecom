import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Home.css';

// Inline SVG placeholder used whenever a product/banner image is missing or fails to load.
// Using a data URI instead of an external placeholder service avoids blank boxes when
// that service is slow, blocked, or down.
const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="250">' +
      '<rect width="100%" height="100%" fill="#f1f5f9"/>' +
      '<text x="50%" y="50%" font-size="16" fill="#94a3b8" text-anchor="middle" dy=".3em" font-family="Arial, sans-serif">No Image</text>' +
      '</svg>'
  );

const Home = () => {
  const [products, setProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState('default');
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('search') || '';

  // --- BANNER CAROUSEL STATE ---
  const [currentBanner, setCurrentBanner] = useState(0);

  const banners = ['/freedelivary.jpg','/jewelaryoffer.jpg','/offer1.jpg','/offer2.jpg'];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 2000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const nextBanner = () => setCurrentBanner((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  const prevBanner = () => setCurrentBanner((prev) => (prev === 0 ? banners.length - 1 : prev - 1));

  // --- PRODUCT FETCHING ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
        const visibleProducts = data.filter((product) => product.isHidden !== true);
        setProducts(visibleProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const getDisplayedProducts = () => {
    let filtered = products.filter((product) => {
      const productName = product?.name || '';
      const productCategory = product?.category || '';
      const search = searchTerm || '';

      return (
        productName.toLowerCase().includes(search.toLowerCase()) ||
        productCategory.toLowerCase().includes(search.toLowerCase())
      );
    });

    if (sortOrder === 'low-to-high') filtered.sort((a, b) => a.price - b.price);
    else if (sortOrder === 'high-to-low') filtered.sort((a, b) => b.price - a.price);

    return filtered;
  };

  const displayedProducts = getDisplayedProducts();

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    alert(`${product.name} added to cart`);
  };

  return (
    <div className="store-container" style={{ padding: '0', backgroundColor: '#f8fafc', minHeight: '100vh', width: '100%' }}>
      {/* --- EDGE-TO-EDGE CAROUSEL BANNER SECTION --- */}
      <div
        style={{
          width: '100%',
          height: '400px',
          margin: '0 0 50px 0',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#1e293b'
        }}
      >
        {banners.map((banner, index) => (
          <img
            key={index}
            src={banner}
            alt={`Promo Banner ${index + 1}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'absolute',
              top: 0,
              left: 0,
              opacity: index === currentBanner ? 1 : 0,
              transition: 'opacity 0.6s ease-in-out',
              pointerEvents: index === currentBanner ? 'auto' : 'none'
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = FALLBACK_IMAGE;
            }}
          />
        ))}

        <button
          onClick={prevBanner}
          style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(4px)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            cursor: 'pointer',
            fontSize: '24px',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.3s'
          }}
          onMouseEnter={(e) => (e.target.style.background = 'rgba(0,0,0,0.7)')}
          onMouseLeave={(e) => (e.target.style.background = 'rgba(0,0,0,0.4)')}
        >
          ❮
        </button>
        <button
          onClick={nextBanner}
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(4px)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            cursor: 'pointer',
            fontSize: '24px',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.3s'
          }}
          onMouseEnter={(e) => (e.target.style.background = 'rgba(0,0,0,0.7)')}
          onMouseLeave={(e) => (e.target.style.background = 'rgba(0,0,0,0.4)')}
        >
          ❯
        </button>

        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '12px',
            zIndex: 2
          }}
        >
          {banners.map((_, index) => (
            <div
              key={index}
              onClick={() => setCurrentBanner(index)}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: index === currentBanner ? 'white' : 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
                transition: 'background 0.3s',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
            ></div>
          ))}
        </div>
      </div>

      <main className="main-content" style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 40px', width: '100%', boxSizing: 'border-box' }}>
        <div className="store-header">
          <div>
            <span className="store-header-eyebrow">Shop the collection</span>
            <h2 className="store-header-title">
              {searchTerm ? `Search Results for "${searchTerm}"` : 'Featured Products'}
            </h2>
          </div>
          <div className="sort-controls">
            <label htmlFor="sort-select">Sort by</label>
            <select id="sort-select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="default">Latest</option>
              <option value="low-to-high">Price: Low to High</option>
              <option value="high-to-low">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="product-grid">
          {displayedProducts.length > 0 ? (
            displayedProducts.map((product) => (
              <div className="product-card" key={product._id}>
                <div className="product-image-container">
                  {product.discount > 0 && <span className="discount-ribbon">-{product.discount}%</span>}
                  <img
                    src={product.images && product.images[0] ? product.images[0] : FALLBACK_IMAGE}
                    alt={product.name || 'Product'}
                    className="product-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = FALLBACK_IMAGE;
                    }}
                  />
                </div>
                <div className="product-details">
                  <h3 className="product-name">{product.name || 'Unnamed Product'}</h3>
                  <div className="product-price">
                    {product.discount > 0 ? (
                      <>
                        <span className="old-price">৳{product.price}</span>
                        <span className="new-price">৳{(product.price - product.price * (product.discount / 100)).toFixed(2)}</span>
                      </>
                    ) : (
                      <span className="new-price">৳{product.price}</span>
                    )}
                  </div>

                  <div className="product-actions">
                    <button className="btn-view-details" onClick={() => navigate(`/product/${product._id}`)}>
                      View Details
                    </button>
                    <button
                      className={`btn-add-cart ${product.countInStock === 0 ? 'out-of-stock' : ''}`}
                      disabled={product.countInStock === 0}
                      onClick={() => handleAddToCart(product)}
                    >
                      {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="no-products">No products match your search.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;