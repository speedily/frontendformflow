import React, { useState } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './components/ui/Card';

export default function UploadPage() {
  const [image, setImage] = useState(null);
  const [fields, setFields] = useState(null);
  const [publicUrl, setPublicUrl] = useState(null);
  const [adminUrl, setAdminUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setError(null);
  };

  const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!image) return;
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('image', image);
    try {
      const res = await axios.post(`${API_BASE}/api/upload-image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFields(res.data.fields);
      setPublicUrl(res.data.publicUrl);
      setAdminUrl(res.data.adminUrl);
    } catch (err) {
      setError('Upload failed: ' + (err.response?.data?.error || err.message));
    }
    setLoading(false);
  };

  return (
    <div className="w3-container" style={{ maxWidth: 500, margin: '2rem auto' }}>
      <div className="w3-center w3-padding-16">
        <span className="w3-xxlarge w3-text-blue w3-wide"><b>Express Flow Form</b></span>
      </div>
      <div className="w3-card w3-padding-large w3-round-large">
        <h2 className="w3-center w3-margin-bottom">Upload a Form Image</h2>
        <form onSubmit={handleUpload}>
          <input
            type="file"
            accept="image/*"
            onChange={e => setImage(e.target.files[0])}
            className="w3-input w3-border w3-margin-bottom"
            required
          />
          <button type="submit" className="w3-button w3-blue w3-block" disabled={loading}>
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
        {error && <div className="w3-panel w3-red w3-margin-top">{error}</div>}
        {publicUrl && (
          <div className="w3-panel w3-green w3-margin-top">
            <div><b>Public Form Link:</b> <a href={publicUrl} className="w3-text-blue w3-hover-text-indigo" target="_blank" rel="noopener noreferrer">{window.location.origin + publicUrl}</a></div>
            <div><b>Admin Link:</b> <a href={adminUrl} className="w3-text-blue w3-hover-text-indigo" target="_blank" rel="noopener noreferrer">{window.location.origin + adminUrl}</a></div>
            <div className="w3-margin-top">
              <b>Generated Form Fields</b>
              <ul className="w3-ul w3-border w3-margin-top">
                {fields.map((f, i) => (
                  <li key={i}>{f.label} ({f.type})</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
      <div className="w3-center w3-padding-16 w3-text-grey w3-small" style={{marginTop: 24}}>
        Powered by <b>Express Flow Form</b>
      </div>
    </div>
  );
} 