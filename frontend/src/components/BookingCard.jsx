import React from 'react';

export default function BookingCard({ booking, onCancel }) {
  const isCancelled = booking.status === 'Cancelled';

  return (
    <div className="booking-card">
      <div className="booking-card-main">
        <div className="booking-card-header">
          <h3 className="booking-hotel-name">{booking.hotelName}</h3>
          <span className="booking-id-tag">{booking.id}</span>
          <span
            className={`status-badge ${
              isCancelled ? 'status-cancelled' : 'status-confirmed'
            }`}
          >
            {booking.status}
          </span>
        </div>

        <div className="booking-grid-info">
          <div className="info-item">
            <span className="info-label">City</span>
            <span className="info-val">{booking.city}</span>
          </div>

          <div className="info-item">
            <span className="info-label">Room Type</span>
            <span className="info-val">{booking.roomType}</span>
          </div>

          <div className="info-item">
            <span className="info-label">Check-in</span>
            <span className="info-val">{booking.checkIn}</span>
          </div>

          <div className="info-item">
            <span className="info-label">Check-out</span>
            <span className="info-val">{booking.checkOut}</span>
          </div>

          <div className="info-item">
            <span className="info-label">Guests</span>
            <span className="info-val">
              {booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}
            </span>
          </div>
        </div>
      </div>

      <div className="booking-card-actions">
        <div className="price-wrap" style={{ textAlign: 'right' }}>
          <span className="price-unit">Total Amount</span>
          <span className="booking-total-price">₹{booking.totalPrice.toLocaleString()}</span>
        </div>

        {!isCancelled ? (
          <button
            onClick={() => onCancel(booking.id)}
            className="btn btn-danger"
          >
            Cancel Booking
          </button>
        ) : (
          <button className="btn btn-outline" disabled>
            Cancelled
          </button>
        )}
      </div>
    </div>
  );
}
