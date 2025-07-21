import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './components/ui/Card';

export default function PublicFormPage() {
  const { form_id } = useParams();
  const [fields, setFields] = useState(null);
  const [title, setTitle] = useState('');
  const [values, setValues] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

  useEffect(() => {
    setLoading(true);
    setError(null);
    axios.get(`${API_BASE}/api/forms/${form_id}`)
      .then(res => {
        setFields(res.data.fields);
        if (res.data.title) setTitle(res.data.title);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load form: ' + (err.response?.data?.error || err.message));
        setLoading(false);
      });
  }, [form_id]);

  const handleChange = (e, label) => {
    // Remove trailing colon from label for storage
    const cleanLabel = label.replace(/:$/, '');
    setValues({ ...values, [cleanLabel]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError(null);
    try {
      await axios.post(`${API_BASE}/api/form/${form_id}/submit`, values);
      setSubmitted(true);
    } catch (err) {
      setError('Submission failed: ' + (err.response?.data?.error || err.message));
    }
    setSubmitLoading(false);
  };

  if (loading) return <div className="w3-container w3-center" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  if (error) return <div className="w3-container w3-center w3-text-red" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{error}</div>;
  if (submitted) return <div className="w3-container w3-center w3-text-green" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}><div>Thank you for your submission!</div><div className="w3-margin-top w3-text-grey w3-small">Powered by <b>Express Flow Form</b></div></div>;

  return (
    <div className="w3-container" style={{ maxWidth: 500, margin: '2rem auto' }}>
      <div className="w3-card w3-padding-large w3-round-large">
        {title && <h2 className="w3-center w3-margin-bottom">{title}</h2>}
        <h3 className="w3-margin-bottom">Fill Out the Form</h3>
        <form onSubmit={handleSubmit}>
          {fields.map((f, i) => {
            const cleanLabel = f.label.replace(/:$/, '');
            return (
              <div key={i} className="w3-margin-bottom">
                <label className="w3-margin-bottom">{f.label}:</label>
                <input
                  type={f.type}
                  value={values[cleanLabel] || ''}
                  onChange={e => handleChange(e, f.label)}
                  required
                  className="w3-input w3-border"
                />
              </div>
            );
          })}
          <button type="submit" className="w3-button w3-blue w3-block" disabled={submitLoading}>
            {submitLoading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
} 