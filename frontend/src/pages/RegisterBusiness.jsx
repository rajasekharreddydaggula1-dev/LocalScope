import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Compass, MapPin, Phone, Mail, Globe, Clock, ChevronLeft, Plus, X } from 'lucide-react';

export default function RegisterBusiness({ setCurrentPage }) {
  const { isAuthenticated } = useAuth();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('restaurants');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Bangalore');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [lat, setLat] = useState('12.9716');
  const [lng, setLng] = useState('77.5946');
  const [newService, setNewService] = useState('');
  const [services, setServices] = useState([]);
  
  const [hours, setHours] = useState({
    monday: '09:00 AM - 05:00 PM',
    tuesday: '09:00 AM - 05:00 PM',
    wednesday: '09:00 AM - 05:00 PM',
    thursday: '09:00 AM - 05:00 PM',
    friday: '09:00 AM - 05:00 PM',
    saturday: '09:00 AM - 01:00 PM',
    sunday: 'Closed'
  });

  const handleAddService = (e) => {
    e.preventDefault();
    if (newService.trim() && !services.includes(newService.trim())) {
      setServices([...services, newService.trim()]);
      setNewService('');
    }
  };

  const handleRemoveService = (indexToRemove) => {
    setServices(services.filter((_, idx) => idx !== indexToRemove));
  };

  const handleHoursChange = (day, value) => {
    setHours({ ...hours, [day]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("Please login first to submit a business profile");
      return;
    }

    if (!name || !address || !city) {
      alert("Name, Address, and City are required");
      return;
    }

    try {
      const token = JSON.parse(localStorage.getItem('directory_user'))?.token;
      const res = await fetch('http://localhost:5000/api/businesses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          category,
          description,
          address,
          city,
          lat: parseFloat(lat),
          lng: parseFloat(lng),
          phone,
          email,
          website,
          hours,
          services
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit business listing');
      }

      alert("Business listing registered successfully! It is pending administrator verification and approval.");
      setCurrentPage('dashboard');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '5rem' }}>
      
      {/* Back button */}
      <div style={{ padding: '1.5rem 0' }}>
        <button 
          onClick={() => setCurrentPage('dashboard')} 
          className="btn btn-secondary" 
          style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
        >
          <ChevronLeft size={16} />
          Back to Dashboard
        </button>
      </div>

      <div className="card-glass" style={{ maxWidth: '800px', margin: '0 auto', padding: '2.5rem' }}>
        <h2 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Compass size={24} style={{ color: 'var(--accent-primary)' }} />
          <span>Register Your Business Profile</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.95rem' }}>
          Fill out the details below to list your business in our local directory platform. Listings will be verified by a moderator.
        </p>

        <form onSubmit={handleSubmit}>
          
          {/* Main Info */}
          <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem', fontSize: '1.2rem', color: 'var(--accent-primary)' }}>1. General Information</h3>

          <div className="form-group">
            <label className="form-label">Business Name *</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. The Filter Coffee Club" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category *</label>
            <select 
              className="form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="restaurants">Restaurants</option>
              <option value="salons">Salons & Barber Shops</option>
              <option value="healthcare">Healthcare Services</option>
              <option value="retail">Retail Shops</option>
              <option value="education">Educational Institutions</option>
              <option value="repair">Repair Services</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Business Description</label>
            <textarea 
              rows="4" 
              className="form-control" 
              placeholder="Tell customers about what services you offer, your unique specialties, and your store atmosphere..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Location details */}
          <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem', marginTop: '2.5rem', fontSize: '1.2rem', color: 'var(--accent-primary)' }}>2. Location Details</h3>

          <div className="form-group">
            <label className="form-label">Street Address *</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. 100 Feet Rd, Indiranagar" 
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">City *</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. Bangalore" 
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Latitude Coordinate (for Maps)</label>
              <input 
                type="number" 
                step="any"
                className="form-control" 
                placeholder="e.g. 12.9716" 
                value={lat}
                onChange={(e) => setLat(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Longitude Coordinate (for Maps)</label>
              <input 
                type="number" 
                step="any"
                className="form-control" 
                placeholder="e.g. 77.5946" 
                value={lng}
                onChange={(e) => setLng(e.target.value)}
              />
            </div>
          </div>

          {/* Contacts details */}
          <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem', marginTop: '2.5rem', fontSize: '1.2rem', color: 'var(--accent-primary)' }}>3. Contact Channels</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. +91 80 5550 1980" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                className="form-control" 
                placeholder="e.g. hello@mybusiness.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Website URL</label>
            <input 
              type="url" 
              className="form-control" 
              placeholder="e.g. https://mybusiness.com" 
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          {/* Services offered */}
          <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem', marginTop: '2.5rem', fontSize: '1.2rem', color: 'var(--accent-primary)' }}>4. Services & Features</h3>

          <div className="form-group">
            <label className="form-label">Add Service / Amenity</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. Free Wi-Fi, Outdoor Seating, Organic Products..." 
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
              />
              <button onClick={handleAddService} className="btn btn-secondary">
                <Plus size={18} />
              </button>
            </div>
            
            {/* Added services list */}
            <div className="detail-services-list">
              {services.map((svc, index) => (
                <span key={index} className="detail-service-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>{svc}</span>
                  <X 
                    size={12} 
                    style={{ cursor: 'pointer', color: 'var(--error)' }} 
                    onClick={() => handleRemoveService(index)}
                  />
                </span>
              ))}
            </div>
          </div>

          {/* Timing details */}
          <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem', marginTop: '2.5rem', fontSize: '1.2rem', color: 'var(--accent-primary)' }}>5. Timings / Hours</h3>

          {Object.keys(hours).map((day) => (
            <div key={day} style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '1rem', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ textTransform: 'capitalize', fontWeight: 600, color: 'var(--text-secondary)' }}>{day}</span>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. 08:00 AM - 06:00 PM, or Closed" 
                value={hours[day]}
                onChange={(e) => handleHoursChange(day, e.target.value)}
              />
            </div>
          ))}

          {/* Submit */}
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '1rem', marginTop: '3rem', fontSize: '1.05rem' }}
          >
            Register Profile
          </button>

        </form>
      </div>
    </div>
  );
}
