import React from 'react';
import { Link } from 'react-router-dom';

export default function HotelCard({ hotel }) {
  return (
    <div className="hotel-card">
      <div className="card-image-wrap">
        <img
          src={hotel.imageUrl}
          alt={hotel.name}
          className="card-image"
          loading="lazy"
          onError={(e) => {
            // Fallback gradient if unsplash image fails to load
            e.target.style.display = 'none';
          }}
        />
        <span className="city-badge">{hotel.city}</span>
        <span className="rating-badge">★ {hotel.rating}</span>
      </div>

      <div className="card-body">
        <h3 className="hotel-name">{hotel.name}</h3>
        <p className="hotel-desc">{hotel.description}</p>

        <div className="card-footer">
          <div className="price-wrap">
            <span className="price-amount">₹{hotel.pricePerNight.toLocaleString()}</span>
            <span className="price-unit">per night</span>
          </div>

          <Link to={`/hotel/${hotel.id}`} className="btn btn-primary">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
