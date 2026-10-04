import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import HotelDetails from './pages/HotelDetails';
import MyBookings from './pages/MyBookings';

export default function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hotel/:id" element={<HotelDetails />} />
          <Route path="/bookings" element={<MyBookings />} />
        </Routes>
      </main>
      <footer className="footer">
        <p>© 2026 StayEasy — Simple Hotel Booking for DevOps & Kubernetes Demo</p>
      </footer>
    </div>
  );
}
