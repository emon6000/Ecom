import React from 'react';
import { useNavigate } from 'react-router-dom';
import './About.css';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="about-container">
      {/* Hero Section */}
      <div className="about-hero">
        <h1 className="about-title">Welcome to <span className="highlight-text">MAGIC SHOP</span></h1>
        <p className="about-subtitle">Bringing a touch of enchantment to your everyday life.</p>
      </div>

      {/* Main Content */}
      <div className="about-content">
        <section className="about-section">
          <h2>Our Story</h2>
          <p>
            Founded in 2026, MAGIC SHOP started as a small mystical corner dedicated to finding the most extraordinary items. 
            Today, we have grown into a premier e-commerce destination, offering top-tier electronics, fashion, and home goods 
            with a sprinkle of magic. We believe that shopping online shouldn't just be a transaction; it should be an experience.
          </p>
        </section>

        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            Our mission is simple: to deliver spellbinding quality and otherworldly customer service. We handpick every product 
            in our inventory to ensure it meets our strict standards of durability, design, and absolute perfection. 
          </p>
        </section>

        {/* Feature Grid */}
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3>Fast Delivery</h3>
            <p>Our delivery wizards ensure your items arrive faster than a shooting star.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">✨</div>
            <h3>Premium Quality</h3>
            <p>Every product is enchanted with long-lasting quality and care.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Secure Checkout</h3>
            <p>Your data is protected by the strongest digital forcefields available.</p>
          </div>
        </div>

        <div className="about-actions">
          <button className="btn-primary" onClick={() => navigate('/')}>
            Explore Our Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;