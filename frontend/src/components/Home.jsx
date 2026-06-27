import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Camera, Users } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <>
      {/* Background Elements */}
      <div className="animated-bg"></div>
      <div className="noise-overlay"></div>

      <div className="center-screen">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ textAlign: 'center', marginBottom: '4rem', marginTop: '-4rem' }}
        >
          <h1>Shared Photo <span className="gradient-text">Space</span></h1>
          <p>The AI-powered memory platform for your events.</p>
        </motion.div>

        <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          
          {/* Join Event Card */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="glass-panel login-card"
          >
            <div style={{ 
              width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem'
            }}>
              <Users size={32} color="#60a5fa" />
            </div>
            <h2 style={{ marginBottom: '1.5rem' }}>Join an Event</h2>
            <form onSubmit={handleJoin}>
              <input type="text" placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} required />
              <input type="tel" placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} required />
              <input type="text" placeholder="6-Digit Join Code" value={joinCode} onChange={e => setJoinCode(e.target.value)} maxLength={6} required />
              <button type="submit" style={{ marginTop: '0.5rem' }}>Join Gallery</button>
            </form>
          </motion.div>

          {/* Create Event Card */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="glass-panel login-card"
          >
            <div style={{ 
              width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(168, 85, 247, 0.1)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem'
            }}>
              <Camera size={32} color="#c084fc" />
            </div>
            <h2 style={{ marginBottom: '1.5rem' }}>Create an Event</h2>
            <form onSubmit={handleCreate}>
              <input type="text" placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} required />
              <input type="tel" placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} required />
              <input type="text" placeholder="Event Name (e.g. Goa Trip)" value={eventName} onChange={e => setEventName(e.target.value)} required />
              <button type="submit" className="primary-gradient" style={{ marginTop: '0.5rem' }}>Create Event</button>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
}
