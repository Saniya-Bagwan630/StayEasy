// Base URL for API requests.
// In development, Vite proxies '/api' to 'http://localhost:5000'.
// In Kubernetes/Docker, Nginx proxies '/api' to 'http://backend-service:5000'.
const API_BASE = import.meta.env.VITE_API_URL || '/api';

/**
 * Fetch list of all hotels with optional search term (by hotel name or city).
 */
export async function fetchHotels(search = '') {
  const url = search ? `${API_BASE}/hotels?search=${encodeURIComponent(search)}` : `${API_BASE}/hotels`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch hotels');
  }
  return response.json();
}

/**
 * Fetch a single hotel by ID.
 */
export async function fetchHotelById(id) {
  const response = await fetch(`${API_BASE}/hotels/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch hotel details');
  }
  return response.json();
}

/**
 * Fetch all existing bookings.
 */
export async function fetchBookings() {
  const response = await fetch(`${API_BASE}/bookings`);
  if (!response.ok) {
    throw new Error('Failed to fetch bookings');
  }
  return response.json();
}

/**
 * Create a new hotel booking.
 */
export async function createBooking(bookingData) {
  const response = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bookingData)
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to submit booking');
  }
  return data;
}

/**
 * Cancel a booking by ID.
 */
export async function cancelBooking(id) {
  const response = await fetch(`${API_BASE}/bookings/${id}`, {
    method: 'DELETE'
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to cancel booking');
  }
  return data;
}
