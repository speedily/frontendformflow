import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './components/ui/Card';

export default function AdminPage() {
  const { form_id } = useParams();
  const [searchParams] = useSearchParams();
  const secret = searchParams.get('secret');
  const [submissions, setSubmissions] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

  useEffect(() => {
    setLoading(true);
    setError(null);
    axios.get(`${API_BASE}/api/admin/${form_id}?secret=${secret}`)
      .then(res => {
        setSubmissions(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Access denied or no submissions.');
        setLoading(false);
      });
  }, [form_id, secret]);

  if (loading) return <div className="w3-container w3-center" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  if (error) return <div className="w3-container w3-center w3-text-red" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{error}</div>;

  return (
    <div className="w3-container" style={{ maxWidth: 800, margin: '2rem auto' }}>
      <div className="w3-card w3-padding-large w3-round-large">
        <h2 className="w3-center w3-margin-bottom">Form Submissions</h2>
        {submissions.length === 0 ? (
          <div className="w3-text-grey w3-center">No submissions yet.</div>
        ) : (
          <div className="w3-responsive">
            <table className="w3-table w3-bordered w3-striped w3-small">
              <thead>
                <tr>
                  {Object.keys(submissions[0].data).map((key, i) => (
                    <th key={i}>{key}</th>
                  ))}
                  <th>Submitted At</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((s, i) => (
                  <tr key={i}>
                    {Object.values(s.data).map((val, j) => (
                      <td key={j}>{val}</td>
                    ))}
                    <td className="w3-text-grey w3-tiny">{new Date(s.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="w3-center w3-padding-16 w3-text-grey w3-small" style={{marginTop: 24}}>
        Powered by <b>Express Flow Form</b>
      </div>
    </div>
  );
} 