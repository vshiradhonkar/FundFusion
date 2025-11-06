import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Dashboard.css';

const AdminDashboard = () => {
  const [pitches, setPitches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPitch, setEditingPitch] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    pitch_text: '',
    money_requested: '',
    equity_offered: ''
  });

  const token = localStorage.getItem('token');

  const fetchPitches = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/startups/pending/list', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPitches(response.data);
    } catch (error) {
      toast.error('Failed to fetch pending pitches');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPitches();
  }, []);

  const handleEdit = (pitch) => {
    setEditingPitch(pitch);
    setFormData({
      name: pitch.name,
      pitch_text: pitch.pitch_text,
      money_requested: pitch.money_requested,
      equity_offered: pitch.equity_offered || ''
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/api/startups/update/${editingPitch.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Pitch updated successfully');
      setShowModal(false);
      fetchPitches();
    } catch (error) {
      toast.error('Failed to update pitch');
      console.error('Update error:', error);
    }
  };

  const handleStatusUpdate = async (pitchId, status) => {
    try {
      await axios.put(`http://localhost:5000/api/startups/status/${pitchId}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Pitch ${status} successfully`);
      setPitches(pitches.filter(p => p.id !== pitchId));
    } catch (error) {
      toast.error(`Failed to ${status} pitch`);
      console.error('Status update error:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="dashboard-content">
        <h1>Admin Dashboard</h1>
        <p>Loading pending pitches...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Admin Dashboard - Pending Pitches</h1>
        <button className="btn" onClick={fetchPitches} disabled={loading}>
          🔄 Refresh
        </button>
      </div>

      {pitches.length === 0 ? (
        <div className="card">
          <p>No pending pitches at the moment.</p>
        </div>
      ) : (
        <div className="card-grid">
          {pitches.map((pitch) => (
            <div key={pitch.id} className="card">
              <h3>{pitch.name}</h3>
              <p><strong>Founder:</strong> {pitch.founder_name}</p>
              <p><strong>Email:</strong> {pitch.founder_email}</p>
              <p><strong>Pitch:</strong> {pitch.pitch_text}</p>
              <p><strong>Funding Requested:</strong> ₹{pitch.money_requested?.toLocaleString()}</p>
              <p><strong>Equity Offered:</strong> {pitch.equity_offered || 'N/A'}%</p>
              
              <div className="btn-row" style={{ marginTop: '1rem', gap: '0.5rem' }}>
                <button 
                  className="btn" 
                  onClick={() => handleEdit(pitch)}
                  style={{ background: '#0077b6', fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                >
                  ✏️ Edit
                </button>
                <button 
                  className="approve-btn" 
                  onClick={() => handleStatusUpdate(pitch.id, 'approved')}
                  style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                >
                  ✅ Approve
                </button>
                <button 
                  className="reject-btn" 
                  onClick={() => handleStatusUpdate(pitch.id, 'rejected')}
                  style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                >
                  ❌ Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {showModal && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="modal-content" style={{
            background: '#fff',
            padding: '2rem',
            borderRadius: '1rem',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>Edit Pitch Details</h2>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Startup Name:
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '0.5rem',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Pitch Description:
              </label>
              <textarea
                name="pitch_text"
                value={formData.pitch_text}
                onChange={handleInputChange}
                rows="4"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Money Requested (₹):
              </label>
              <input
                type="number"
                name="money_requested"
                value={formData.money_requested}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '0.5rem',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Equity Offered (%):
              </label>
              <input
                type="number"
                name="equity_offered"
                value={formData.equity_offered}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '0.5rem',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '0.5rem',
                  background: '#f8f9fa',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  background: '#0077b6',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;