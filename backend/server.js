
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON body parsing
app.use(cors());
app.use(express.json());

// ==========================================
// Static In-Memory Data for Hotels
// ==========================================
const hotels = [
  {
    id: '1',
    name: 'Grand Palace Hotel',
    city: 'Mumbai',
    pricePerNight: 3000,
    rating: 4.8,
    description: 'A luxurious heritage hotel located in the heart of Mumbai, offering panoramic sea views and world-class hospitality.',
    roomTypes: ['Deluxe Room', 'Executive Suite', 'Presidential Suite'],
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: '2',
    name: 'The Fern Residency',
    city: 'Pune',
    pricePerNight: 2200,
    rating: 4.4,
    description: 'An eco-friendly contemporary hotel situated close to Pune tech hubs, featuring modern rooms and tranquil gardens.',
    roomTypes: ['Standard Room', 'Deluxe AC', 'Studio Suite'],
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: '3',
    name: 'Lakeview Resort',
    city: 'Udaipur',
    pricePerNight: 4500,
    rating: 4.9,
    description: 'Perched on the banks of Lake Pichola, this royal resort provides unforgettable sunsets and Rajasthani architecture.',
    roomTypes: ['Lake View Room', 'Royal Heritage Suite', 'Pool Villa'],
    imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: '4',
    name: 'Royal Comfort Inn',
    city: 'Bangalore',
    pricePerNight: 1800,
    rating: 4.2,
    description: 'A cozy and affordable budget hotel situated in central Bangalore, perfect for business travelers and weekend tourists.',
    roomTypes: ['Standard Single', 'Deluxe Double'],
    imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: '5',
    name: 'Ocean Pearl Hotel',
    city: 'Goa',
    pricePerNight: 3500,
    rating: 4.7,
    description: 'Steps away from pristine white sands, with a private beach shack, sun loungers, and complimentary tropical breakfast.',
    roomTypes: ['Sea View Deluxe', 'Beachfront Cottage', 'Family Villa'],
    imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: '6',
    name: 'Mountain Breeze Retreat',
    city: 'Manali',
    pricePerNight: 2800,
    rating: 4.6,
    description: 'Nestled amidst tall pine forests and snow-capped Himalayan peaks, featuring warm wooden interiors and bonfires.',
    roomTypes: ['Valley View Deluxe', 'Alpine Wooden Chalet'],
    imageUrl: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=600&q=80'
  }
];

// ==========================================
// In-Memory Array for Bookings
// (Single demo user, no auth required)
// ==========================================
let bookings = [
  {
    id: 'BK-1001',
    hotelId: '1',
    hotelName: 'Grand Palace Hotel',
    city: 'Mumbai',
    roomType: 'Deluxe Room',
    checkIn: '2026-10-10',
    checkOut: '2026-10-12',
    nights: 2,
    guests: 2,
    totalPrice: 6000,
    status: 'Confirmed',
    createdAt: new Date().toISOString()
  }
];

// Helper to generate unique booking ID
const generateBookingId = () => {
  return 'BK-' + Math.floor(1000 + Math.random() * 9000);
};

// ==========================================
// REST API Endpoints
// ==========================================

// Health check endpoint (for Kubernetes probes / debugging)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 1. GET /api/hotels - Get all hotels (with optional search query)
app.get('/api/hotels', (req, res) => {
  const { search } = req.query;

  if (!search) {
    return res.status(200).json(hotels);
  }

  const query = search.trim().toLowerCase();
  const filtered = hotels.filter(
    (h) =>
      h.name.toLowerCase().includes(query) ||
      h.city.toLowerCase().includes(query)
  );

  return res.status(200).json(filtered);
});

// 2. GET /api/hotels/:id - Get details of a single hotel
app.get('/api/hotels/:id', (req, res) => {
  const { id } = req.params;
  const hotel = hotels.find((h) => h.id === id);

  if (!hotel) {
    return res.status(404).json({ error: 'Hotel not found' });
  }

  return res.status(200).json(hotel);
});

// 3. POST /api/bookings - Create a new booking
app.post('/api/bookings', (req, res) => {
  const { hotelId, roomType, checkIn, checkOut, guests } = req.body;

  // Validation: Check for required fields
  if (!hotelId || !checkIn || !checkOut || !guests) {
    return res.status(400).json({
      error: 'Missing required booking fields (hotelId, checkIn, checkOut, guests are required).'
    });
  }

  // Validation: Verify hotel exists
  const hotel = hotels.find((h) => h.id === String(hotelId));
  if (!hotel) {
    return res.status(404).json({ error: 'Selected hotel does not exist.' });
  }

  // Validation: Check-in before check-out
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
    return res.status(400).json({ error: 'Invalid check-in or check-out date format.' });
  }

  if (checkInDate >= checkOutDate) {
    return res.status(400).json({
      error: 'Check-out date must be strictly after check-in date.'
    });
  }

  // Validation: Number of guests > 0
  const parsedGuests = parseInt(guests, 10);
  if (isNaN(parsedGuests) || parsedGuests <= 0) {
    return res.status(400).json({
      error: 'Number of guests must be a positive integer greater than 0.'
    });
  }

  // Calculate number of nights
  const diffTime = Math.abs(checkOutDate - checkInDate);
  const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Calculate total price: nights * pricePerNight
  const totalPrice = nights * hotel.pricePerNight;

  // Create booking record
  const newBooking = {
    id: generateBookingId(),
    hotelId: hotel.id,
    hotelName: hotel.name,
    city: hotel.city,
    roomType: roomType || hotel.roomTypes[0] || 'Standard Room',
    checkIn,
    checkOut,
    nights,
    guests: parsedGuests,
    totalPrice,
    status: 'Confirmed',
    createdAt: new Date().toISOString()
  };

  // Save to in-memory list (newest first)
  bookings.unshift(newBooking);

  return res.status(201).json({
    message: 'Booking confirmed successfully',
    booking: newBooking
  });
});

// 4. GET /api/bookings - Get all bookings
app.get('/api/bookings', (req, res) => {
  return res.status(200).json(bookings);
});

// 5. DELETE /api/bookings/:id - Cancel a booking
app.delete('/api/bookings/:id', (req, res) => {
  const { id } = req.params;
  const booking = bookings.find((b) => b.id === id);

  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  // Requirement: Update booking status to "Cancelled"
  booking.status = 'Cancelled';

  return res.status(200).json({
    message: 'Booking cancelled successfully',
    booking
  });
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`StayEasy Backend running on port ${PORT}`);
  console.log(`Available APIs:`);
  console.log(`  GET    /api/hotels`);
  console.log(`  GET    /api/hotels/:id`);
  console.log(`  POST   /api/bookings`);
  console.log(`  GET    /api/bookings`);
  console.log(`  DELETE /api/bookings/:id`);
});
