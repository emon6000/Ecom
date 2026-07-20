import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductDetails.css';

// Dummy display-only sizes. Not tied to backend/cart data — purely visual for now.
const DUMMY_SIZES = ['M', 'L', 'XL', 'XXL'];

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [mainImage, setMainImage] = useState('');
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState(DUMMY_SIZES[0]); // dummy only, not sent anywhere
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const fetchProductData = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
        setProduct(data);
        setMainImage(data.images && data.images.length > 0 ? data.images[0] : '');
        setQty(1);

        const allProductsRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
        const related = allProductsRes.data
          .filter((p) => p.category === data.category && p._id !== data._id && !p.isHidden)
          .slice(0, 4);

        setRelatedProducts(related);
        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };
    fetchProductData();
  }, [id]);

  const addToCartHandler = () => {
    addToCart(product, qty);
    navigate('/cart');
  };

  const decreaseQty = () => setQty((prev) => Math.max(1, prev - 1));
  const increaseQty = () => setQty((prev) => Math.min(product.countInStock || 1, prev + 1));

  const formatVideoUrl = (url) => {
    if (!url) return '#';
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  };

  const getEmbedUrl = (url) => {
    if (!url) return null;
    let videoId = '';

    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://via.placeholder.com/500?text=Image+Not+Found';
  };

  if (loading)
    return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Loading Product...</h2>;
  if (error)
    return (
      <h2 style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>Product not found!</h2>
    );

  const salePrice =
    product.discount > 0
      ? (product.price - product.price * (product.discount / 100)).toFixed(2)
      : product.price;

  return (
    <div className="product-details-container">
      <button className="btn-back" onClick={() => navigate('/')}>
        ← Back to Home
      </button>

      <div className="details-grid">
        {/* --- Photo view --- */}
        <div className="image-section">
          <div className="main-image-box">
            {product.discount > 0 && (
              <span className="corner-discount-ribbon">{product.discount}% Off</span>
            )}
            <img
              src={mainImage || 'https://via.placeholder.com/500?text=No+Image'}
              alt={product.name}
              onError={handleImageError}
            />
          </div>

          <div className="thumbnail-list">
            {product.images &&
              product.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`thumbnail ${index}`}
                  className={mainImage === img ? 'active-thumb' : ''}
                  onClick={() => setMainImage(img)}
                  onError={handleImageError}
                />
              ))}
          </div>

          <div className="authentic-badge">
            <span className="authentic-check">✓</span> 100% Authentic Product
          </div>
        </div>

        {/* --- Info section --- */}
        <div className="info-section">
          <span className="category-badge">{product.category}</span>
          <h1 className="title">{product.name}</h1>

          <div className="price-block">
            {product.discount > 0 ? (
              <>
                <span className="new-price">${salePrice}</span>
                <span className="old-price">${product.price}</span>
                <span className="stock-dot in-stock">
                  ● {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </>
            ) : (
              <>
                <span className="new-price">${product.price}</span>
                <span className={`stock-dot ${product.countInStock > 0 ? 'in-stock' : 'no-stock'}`}>
                  ● {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </>
            )}
          </div>

          {/* Dummy size variants - visual only, not sent to backend/cart */}
          {/* <div className="variant-section">
            <span className="variant-label">Variants :</span>
            <div className="variant-options">
              {DUMMY_SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`variant-btn ${selectedSize === size ? 'selected' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div> */}

          {product.videoLink && getEmbedUrl(product.videoLink) ? (
            <div className="embedded-video">
              <iframe
                width="100%"
                height="250"
                src={getEmbedUrl(product.videoLink)}
                title="Product Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : product.videoLink ? (
            <div className="video-link">
              <a href={formatVideoUrl(product.videoLink)} target="_blank" rel="noopener noreferrer">
                🎥 Watch Product Video
              </a>
            </div>
          ) : null}

          <div className="delivery-info-box">
            <h4>Delivery Options</h4>
            <ul>
              <li>
                🚚 <strong>Standard Delivery:</strong> 3-5 Business Days ($5.00)
              </li>
              <li>
                ⚡ <strong>Express Delivery:</strong> 1-2 Business Days ($12.00)
              </li>
              <li>
                💵 <strong>Cash on Delivery:</strong> Available in your area
              </li>
              <li>
                🔄 <strong>Returns:</strong> 7-day easy return policy
              </li>
            </ul>
          </div>

          {product.countInStock > 0 && (
            <div className="cart-action-box">
              <div className="qty-selector">
                <label>Quantity</label>
                <div className="qty-stepper">
                  <button type="button" onClick={decreaseQty} disabled={qty <= 1}>
                    −
                  </button>
                  <span>{qty}</span>
                  <button type="button" onClick={increaseQty} disabled={qty >= product.countInStock}>
                    +
                  </button>
                </div>
              </div>

              <button className="btn-add-to-cart-large" onClick={addToCartHandler}>
                🛒 Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="product-description-section">
        <h3>Product Description</h3>
        <p className="description-text">
          {product.description || 'No description provided for this product.'}
        </p>
      </div>

      {relatedProducts.length > 0 && (
        <div className="related-products-section">
          <h3>Related Products</h3>
          <div className="related-grid">
            {relatedProducts.map((related) => (
              <div
                className="related-card"
                key={related._id}
                onClick={() => navigate(`/product/${related._id}`)}
              >
                <div className="related-image-container">
                  <img
                    src={
                      related.images && related.images[0]
                        ? related.images[0]
                        : 'https://via.placeholder.com/200?text=No+Image'
                    }
                    alt={related.name}
                    onError={handleImageError}
                  />
                </div>
                <div className="related-details">
                  <h4>{related.name}</h4>
                  <p className="related-price">${related.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;