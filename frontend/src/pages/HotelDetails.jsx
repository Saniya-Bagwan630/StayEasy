import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import BookingForm from '../components/BookingForm';
import { fetchHotelById } from '../services/api';

export default function HotelDetails() {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  useEffect(() => {
    loadHotel();
  }, [id]);

  const loadHotel = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchHotelById(id);
      setHotel(data);
    } catch (err) {
      setError('Could not find hotel details. It may not exist.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSuccess = (booking) => {
    setConfirmedBooking(booking);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
        Loading hotel details...
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="empty-state">
        <div className="empty-icon">⚠️</div>
        <h3 className="empty-title">Hotel Not Found</h3>
        <p className="empty-text">{error || 'The requested hotel could not be found.'}</p>
        <Link to="/" className="btn btn-primary">
          Back to Hotels
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/" className="back-link">
        ← Back to all hotels
      </Link>

      {/* Booking Confirmation Box (Displayed after successful booking) */}
      {confirmedBooking && (
        <div className="confirmation-card">
          <div className="confirmation-header">
            <span>✓</span> Booking Confirmed!
          </div>

          <div className="confirmation-details">
            <div className="conf-row">
              <span className="conf-label">Booking ID:</span>
              <span className="conf-value">{confirmedBooking.id}</span>
            </div>
            <div className="conf-row">
              <span className="conf-label">Hotel:</span>
              <span className="conf-value">{confirmedBooking.hotelName}</span>
            </div>
            <div className="conf-row">
              <span className="conf-label">Room Type:</span>
              <span className="conf-value">{confirmedBooking.roomType}</span>
            </div>
            <div className="conf-row">
              <span className="conf-label">Check-in:</span>
              <span className="conf-value">{confirmedBooking.checkIn}</span>
            </div>
            <div className="conf-row">
              <span className="conf-label">Check-out:</span>
              <span className="conf-value">{confirmedBooking.checkOut}</span>
            </div>
            <div className="conf-row">
              <span className="conf-label">Guests:</span>
              <span className="conf-value">{confirmedBooking.guests}</span>
            </div>
            <div className="conf-row">
              <span className="conf-label">Total:</span>
              <span className="conf-value">₹{confirmedBooking.totalPrice.toLocaleString()}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/bookings" className="btn btn-primary">
              View in My Bookings →
            </Link>
            <button
              onClick={() => setConfirmedBooking(null)}
              className="btn btn-outline"
            >
              Book Another Room
            </button>
          </div>
        </div>
      )}

      {/* Main Details and Booking Form Layout */}
      {!confirmedBooking && (
        <div className="hotel-details-layout">
          {/* Left Column: Hotel Info */}
          <div className="details-card">
            <img
              src={hotel.imageUrl}
              alt={hotel.name}
              className="details-hero-img"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />

            <div className="details-content">
              <div className="details-header">
                <div>
                  <h1 className="details-title">{hotel.name}</h1>
                  <div className="details-meta">
                    <span className="city-tag">📍 {hotel.city}</span>
                    <span className="rating-badge" style={{ position: 'static' }}>
                      ★ {hotel.rating}
                    </span>
                  </div>
                </div>

                <div className="price-wrap" style={{ textAlign: 'right' }}>
                  <span className="price-amount">₹{hotel.pricePerNight.toLocaleString()}</span>
                  <span className="price-unit">per night</span>
                </div>
              </div>

              <h2 className="details-desc-title">About this property</h2>
              <p className="details-description">{hotel.description}</p>

              {/* Available Room Types */}
              <div className="room-types-box">
                <h3 className="room-types-title">Available Room Types</h3>
                <div className="room-pill-list">
                  {hotel.roomTypes &&
                    hotel.roomTypes.map((type) => (
                      <span key={type} className="room-pill">
                        🛏️ {type}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Booking Form */}
          <div>
            <BookingForm hotel={hotel} onBookingSuccess={handleBookingSuccess} />
          </div>
        </div>
      )}
    </div>
  );
}
