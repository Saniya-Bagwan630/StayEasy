import React, { useState } from 'react';
import { createBooking } from '../services/api';

export default function BookingForm({ hotel, onBookingSuccess }) {
  // Form State
  const [roomType, setRoomType] = useState(hotel.roomTypes ? hotel.roomTypes[0] : 'Standard Room');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Calculate nights and estimated total
  let nights = 0;
  let estimatedTotal = 0;

  if (checkIn && checkOut) {
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    if (d2 > d1) {
      const diffTime = Math.abs(d2 - d1);
      nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      estimatedTotal = nights * hotel.pricePerNight;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!checkIn || !checkOut) {
      setErrorMsg('Please choose both check-in and check-out dates.');
      return;
    }

    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    if (d1 >= d2) {
      setErrorMsg('Check-out date must be after check-in date.');
      return;
    }

    if (guests < 1) {
      setErrorMsg('Number of guests must be at least 1.');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        hotelId: hotel.id,
        roomType,
        checkIn,
        checkOut,
        guests: parseInt(guests, 10)
      };

      const result = await createBooking(payload);
      onBookingSuccess(result.booking);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to complete booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Restrict past dates in datepicker
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="booking-sidebar">
      <h3 className="sidebar-title">Book Your Stay</h3>

      {errorMsg && <div className="form-error">{errorMsg}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="roomType">
            Room Type
          </label>
          <select
            id="roomType"
            className="form-select"
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
          >
            {hotel.roomTypes &&
              hotel.roomTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
          </select>
        </div>

        <div className="date-row">
          <div className="form-group">
            <label className="form-label" htmlFor="checkIn">
              Check-In
            </label>
            <input
              id="checkIn"
              type="date"
              className="form-input"
              min={today}
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="checkOut">
              Check-Out
            </label>
            <input
              id="checkOut"
              type="date"
              className="form-input"
              min={checkIn || today}
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="guests">
            Number of Guests
          </label>
          <input
            id="guests"
            type="number"
            className="form-input"
            min="1"
            max="10"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            required
          />
        </div>

        {nights > 0 && (
          <div className="price-summary">
            <div className="summary-row">
              <span>
                ₹{hotel.pricePerNight.toLocaleString()} × {nights} {nights === 1 ? 'night' : 'nights'}
              </span>
              <span>₹{estimatedTotal.toLocaleString()}</span>
            </div>
            <div className="summary-total">
              <span>Estimated Total</span>
              <span>₹{estimatedTotal.toLocaleString()}</span>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '0.75rem' }}
          disabled={loading}
        >
          {loading ? 'Processing Booking...' : 'Book Now'}
        </button>
      </form>
    </div>
  );
}
