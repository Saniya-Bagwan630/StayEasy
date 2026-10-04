import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BookingCard from '../components/BookingCard';
import { fetchBookings, cancelBooking } from '../services/api';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchBookings();
      setBookings(data);
    } catch (err) {
      setError('Unable to load bookings. Please ensure the backend server is reachable.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    const confirmCancel = window.confirm('Are you sure you want to cancel this booking?');
    if (!confirmCancel) return;

    try {
      setActionMsg('');
      const res = await cancelBooking(id);
      setActionMsg(`Booking ${id} was cancelled successfully.`);
      // Update local state to reflect status: "Cancelled"
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: 'Cancelled' } : b))
      );
    } catch (err) {
      alert(err.message || 'Failed to cancel booking.');
    }
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 className="section-title">My Bookings</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            View and manage all your reserved hotel accommodations.
          </p>
        </div>
      </div>

      {actionMsg && (
        <div
          style={{
            background: 'var(--success-bg)',
            border: '1px solid #bbf7d0',
            color: 'var(--success)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1.25rem',
            fontWeight: 500
          }}
        >
          ✓ {actionMsg}
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Loading your bookings...
        </div>
      )}

      {error && (
        <div className="form-error" style={{ textAlign: 'center', padding: '1.5rem' }}>
          {error}
        </div>
      )}

      {!loading && !error && bookings.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🧳</div>
          <h3 className="empty-title">No Bookings Yet</h3>
          <p className="empty-text">You haven't made any reservations. Explore our hand-picked hotels and plan your trip!</p>
          <Link to="/" className="btn btn-primary">
            Explore Hotels
          </Link>
        </div>
      )}

      {!loading && !error && bookings.length > 0 && (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} onCancel={handleCancel} />
          ))}
        </div>
      )}
    </div>
  );
}
