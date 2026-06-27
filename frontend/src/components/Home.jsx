import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Camera, Users } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [joinCode, setJoinCode] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [eventName, setEventName] = useState('');

  const handleJoin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`/api/events/${joinCode}/join`, {
        name,
        phoneNumber: phone
      });
      navigate(`/event/${joinCode}`, { state: { user: res.data.participants.find(p => p.user.phoneNumber === phone)?.user } });
    } catch (err) {
      alert("Invalid join code or error joining.");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/events', {
        name: eventName,
        hostName: name,
        hostPhoneNumber: phone
      });
      navigate(`/event/${res.data.joinCode}`, { state: { user: res.data.host } });
    } catch (err) {
      alert("Error creating event.");
    }
  };

  return (
    <div className="center-screen">
      <h1>Shared Photo Space</h1>
      <p>The AI-powered memory platform for your events.</p>

      <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {/* Join Event Card */}
        <div className="glass-panel login-card">
          <Users size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
          <h2>Join an Event</h2>
          <form onSubmit={handleJoin} style={{ marginTop: '1.5rem' }}>
            <input type="text" placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} required />
            <input type="tel" placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} required />
            <input type="text" placeholder="6-Digit Join Code" value={joinCode} onChange={e => setJoinCode(e.target.value)} maxLength={6} required />
            <button type="submit">Join Event</button>
          </form>
        </div>

        {/* Create Event Card */}
        <div className="glass-panel login-card">
          <Camera size={48} color="#c084fc" style={{ marginBottom: '1rem' }} />
          <h2>Create an Event</h2>
          <form onSubmit={handleCreate} style={{ marginTop: '1.5rem' }}>
            <input type="text" placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} required />
            <input type="tel" placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} required />
            <input type="text" placeholder="Event Name (e.g. Goa Trip)" value={eventName} onChange={e => setEventName(e.target.value)} required />
            <button type="submit" style={{ background: 'linear-gradient(135deg, #60a5fa, #c084fc)' }}>Create Event</button>
          </form>
        </div>
      </div>
    </div>
  );
}
