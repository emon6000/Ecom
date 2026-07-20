import { useNavigate } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const navigate = useNavigate();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-col">
          <div
            onClick={() => navigate('/')}
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              marginBottom: '10px',
            }}
          >
            <img src="/logo.png" alt="Logo" style={{ height: '30px', marginRight: '10px' }} />
            <h2 style={{ color: '#4ade80', margin: 0, fontSize: '1.2rem' }}>MAGIC SHOP</h2>
          </div>
          <p>Quality Products • Best Prices • Fast Delivery</p>
        </div>

        <div className="footer-col">
          <h3>Categories</h3>
          <ul>
            <li onClick={() => navigate('/?search=electronics')}>Electronics</li>
            <li onClick={() => navigate('/?search=fashion')}>Fashion</li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>Support</h3>
          <ul>
            <li onClick={() => navigate('/about')}>About Us</li>
            <li>Contact Us</li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>Contact</h3>
          <ul>
            <li>📞 +8801743430587</li>
            <li>✉️ mh163092@gmail.com</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} MAGIC SHOP. All rights reserved.</p>
        <button className="back-to-top" onClick={scrollToTop}>
          ↑
        </button>
      </div>
    </footer>
  );
};

export default Footer;
