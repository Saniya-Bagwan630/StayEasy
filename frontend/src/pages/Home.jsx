import React, { useState, useEffect } from 'react';
import HotelCard from '../components/HotelCard';
import { fetchHotels } from '../services/api';

export default function Home() {
  const [hotels, setHotels] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load hotels from backend
  useEffect(() => {
    loadHotels();
  }, []);

  const loadHotels = async (query = '') => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchHotels(query);
      setHotels(data);
    } catch (err) {
      setError('Unable to load hotels from server. Please verify backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    loadHotels(value);
  };

  const clearSearch = () => {
    setSearchTerm('');
    loadHotels('');
  };

  return (
    <div>
      {/* Hero Banner */}
      <section className="hero-section">
        <h1 className="hero-title">StayEasy</h1>
        <p className="hero-tagline">Find your perfect stay</p>

        {/* Search Bar for Hotel / City */}
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search hotels by name or city (e.g. Mumbai, Goa, Resort)..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <button className="clear-search-btn" onClick={clearSearch} title="Clear search">
              ✕
            </button>
          )}
        </div>
      </section>

      {/* Hotel Cards Section */}
      <div className="section-header">
        <h2 className="section-title">
          {searchTerm ? `Search Results (${hotels.length})` : 'Popular Destinations & Stays'}
        </h2>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Loading hotels...
        </div>
      )}

      {error && (
        <div className="form-error" style={{ textAlign: 'center', padding: '1.5rem' }}>
          {error}
        </div>
      )}

      {!loading && !error && hotels.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🏨</div>
          <h3 className="empty-title">No Hotels Found</h3>
          <p className="empty-text">No properties match "{searchTerm}". Try another search term.</p>
          <button onClick={clearSearch} className="btn btn-outline">
            Show All Hotels
          </button>
        </div>
      )}

      {!loading && !error && hotels.length > 0 && (
        <div className="hotels-grid">
          {hotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      )}
    </div>
  );
}
