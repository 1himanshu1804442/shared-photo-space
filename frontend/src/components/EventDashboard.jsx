import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Upload, Image as ImageIcon } from 'lucide-react';

export default function EventDashboard() {
  const { joinCode } = useParams();
  const location = useLocation();
  const user = location.state?.user; // In a real app, this would be in Context/Redux
  
  const [event, setEvent] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Fallback if no user in state
  const currentUserId = user?.id || 'd3b25f4b-2d4e-4b7f-b8c3-4d47a3ff25eb'; // Mock UUID for testing

  useEffect(() => {
    // 1. Fetch Event by JoinCode (need to add this endpoint or find it)
    // Since we don't have a GET /by-code endpoint yet, we'll mock the event data for UI testing.
    setEvent({ name: "Summer Trip", joinCode, id: 'a1b25f4b-2d4e-4b7f-b8c3-4d47a3ff25eb' });
  }, [joinCode]);

  useEffect(() => {
    if (event?.id) {
      fetchPhotos();
    }
  }, [event]);

  const fetchPhotos = async () => {
    try {
      const res = await axios.get(`/api/photos/event/${event.id}`);
      setPhotos(res.data);
    } catch (err) {
      console.log("Error fetching photos", err);
    }
  };

  const handleFileSelect = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append('file', files[i]);
      formData.append('eventId', event.id);
      formData.append('uploaderId', currentUserId);

      try {
        await axios.post('/api/photos/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } catch (err) {
        console.error("Failed to upload file", files[i].name);
      }
    }
    setIsUploading(false);
    fetchPhotos(); // Refresh gallery
  };

  return (
    <div className="container">
      <header className="dashboard-header glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ color: '#fff' }}>{event?.name || 'Loading Event...'}</h2>
          <p style={{ margin: 0 }}>Join Code: <strong style={{ color: 'var(--primary)' }}>{joinCode}</strong></p>
        </div>
        
        <div>
          <input 
            type="file" 
            multiple 
            accept="image/*" 
            style={{ display: 'none' }} 
            ref={fileInputRef}
            onChange={handleFileSelect}
          />
          <button onClick={() => fileInputRef.current?.click()}>
            <Upload size={20} />
            {isUploading ? 'Uploading...' : 'Upload Photos'}
          </button>
        </div>
      </header>

      {photos.length === 0 ? (
        <div className="glass-panel center-screen" style={{ minHeight: '50vh' }}>
          <ImageIcon size={64} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
          <h3>No photos yet!</h3>
          <p>Be the first to upload a memory.</p>
        </div>
      ) : (
        <div className="photo-grid">
          {photos.map(photo => (
            <img 
              key={photo.id} 
              src={photo.storageUrl} 
              alt="Event Memory" 
              className="photo-item"
            />
          ))}
        </div>
      )}
    </div>
  );
}
