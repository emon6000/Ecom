import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { cartItems, removeFromCart, updateCartQty } = useCart();
  const navigate = useNavigate();

  const getEffectivePrice = (item) => {
    const basePrice = Number(item.price || 0);
    const discount = Number(item.discount || 0);

    if (discount > 0) {
      return basePrice - basePrice * (discount / 100);
    }

    return basePrice;
  };

  const cartTotal = cartItems
    .reduce((acc, item) => acc + getEffectivePrice(item) * Number(item.qty || 0), 0)
    .toFixed(2);

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your cart is empty</h2>
        <Link to="/" className="btn-continue">
          Go Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>

      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item._id} className="cart-item">
              <img
                src={
                  item.images && item.images.length > 0
                    ? item.images[0]
                    : 'https://via.placeholder.com/150'
                }
                alt={item.name}
              />

              <div className="item-details">
                <Link to={`/product/${item._id}`}>
                  <h3>{item.name}</h3>
                </Link>
                <div className="price-row">
                  {Number(item.discount || 0) > 0 ? (
                    <>
                      <span className="old-price">৳{Number(item.price || 0).toFixed(2)}</span>
                      <span className="item-price">৳{getEffectivePrice(item).toFixed(2)}</span>
                    </>
                  ) : (
                    <span className="item-price">৳{Number(item.price || 0).toFixed(2)}</span>
                  )}
                </div>
                <div className="item-qty">
                  <button onClick={() => updateCartQty(item._id, Number(item.qty || 1) - 1)}>
                    -
                  </button>
                  <span>{item.qty}</span>
                  <button onClick={() => updateCartQty(item._id, Number(item.qty || 1) + 1)}>
                    +
                  </button>
                </div>
              </div>

              <div className="item-actions">
                <button onClick={() => removeFromCart(item._id)} className="btn-remove">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Items ({cartItems.reduce((acc, item) => acc + Number(item.qty || 0), 0)}):</span>
            <span>৳{cartTotal}</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>৳{cartTotal}</span>
          </div>
          <button className="btn-checkout" onClick={() => navigate('/checkout')}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
