import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Checkout.css';

// Same discount logic used in Cart.jsx — kept identical so the price shown
// here always matches what the customer saw in their cart.
const getEffectivePrice = (item) => {
  const basePrice = Number(item.price || 0);
  const discount = Number(item.discount || 0);

  if (discount > 0) {
    return basePrice - basePrice * (discount / 100);
  }

  return basePrice;
};

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    shippingAddress: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // FIX: was using item.price (original price), ignoring item.discount.
  // Now uses the same effective (discounted) price as the Cart page.
  const cartTotal = cartItems.reduce(
    (acc, item) => acc + getEffectivePrice(item) * Number(item.qty || 0),
    0
  );

  useEffect(() => {
    if (cartItems.length === 0 && !success) {
      navigate('/cart');
    }
  }, [cartItems, success, navigate]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitOrderHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // FIX: send the discounted price per item, not the original price,
    // so the order stored in the backend matches what the customer agreed to pay.
    const orderItems = cartItems.map((item) => ({
      product: item._id,
      name: item.name,
      qty: item.qty,
      price: getEffectivePrice(item),
      image:
        item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/150',
    }));

    const orderData = {
      orderItems,
      customerInfo: {
        name: formData.customerName,
        phone: formData.phone,
        address: formData.shippingAddress,
      },
      email: formData.email,
      totalPrice: cartTotal,
      paymentMethod: 'Cash on Delivery',
    };

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/orders`, orderData);
      setSuccess(true);
      clearCart();
      setLoading(false);
    } catch (err) {
      setError(
        err.response?.data?.message || err.response?.data?.error || 'Failed to submit order'
      );
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="checkout-success">
        <h2>🎉 Order Placed Successfully!</h2>
        <p>Thank you for your purchase. We will contact you soon for delivery.</p>
        <button onClick={() => navigate('/')} className="btn-home">
          Return to Store
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h2>Checkout (Cash on Delivery)</h2>
      {error && <div className="error-message">{error}</div>}

      <div className="checkout-content">
        <form onSubmit={submitOrderHandler} className="checkout-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Full Shipping Address</label>
            <textarea
              name="shippingAddress"
              value={formData.shippingAddress}
              onChange={handleInputChange}
              rows="3"
              required
            ></textarea>
          </div>

          <button type="submit" className="btn-submit-order" disabled={loading}>
            {loading ? 'Processing...' : `Place Order - ৳${cartTotal.toFixed(2)}`}
          </button>
        </form>

        <div className="checkout-summary">
          <h3>Order Summary</h3>
          <div className="summary-items">
            {cartItems.map((item) => {
              const effectivePrice = getEffectivePrice(item);
              const hasDiscount = Number(item.discount || 0) > 0;
              return (
                <div key={item._id} className="summary-item">
                  <span>
                    {item.qty}x {item.name}
                  </span>
                  <span>
                    {hasDiscount && (
                      <span className="summary-old-price">
                        ৳{(Number(item.price || 0) * Number(item.qty || 0)).toFixed(2)}
                      </span>
                    )}
                    ৳{(effectivePrice * Number(item.qty || 0)).toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="summary-total">
            <span>Total to pay upon delivery:</span>
            <span>৳{cartTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;