import { useState, useEffect, useCallback, useRef } from 'react';

const API = 'http://localhost:5000';

// ── Toast ────────────────────────────────────────────────────────────────────
function Toast({ toasts }) {
  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast--${t.type}`}>
          <span className="toast__icon">
            {t.type === 'success' && '✅'}
            {t.type === 'delete'  && '🗑️'}
            {t.type === 'error'   && '❌'}
          </span>
          {t.message}
        </div>
      ))}
    </div>
  );
}

// ── Certificate card ─────────────────────────────────────────────────────────
function CertCard({ cert, onDelete }) {
  const isPdf = cert.mimetype === 'application/pdf';
  const fileUrl = `${API}${cert.url}`;

  return (
    <div className="cert-card">
      <div className="cert-card__preview">
        {isPdf ? (
          <a href={fileUrl} target="_blank" rel="noreferrer noopener" className="cert-card__pdf-link">
            <span className="cert-card__pdf-icon">📄</span>
            <span>View PDF</span>
          </a>
        ) : (
          <a href={fileUrl} target="_blank" rel="noreferrer noopener">
            <img src={fileUrl} alt={cert.title} className="cert-card__img" />
          </a>
        )}
      </div>
      <div className="cert-card__body">
        <h3 className="cert-card__title">{cert.title}</h3>
        {cert.issuer    && <p className="cert-card__issuer">Issued by: {cert.issuer}</p>}
        {cert.issueDate && <p className="cert-card__date">Date: {new Date(cert.issueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>}
        <button className="task-btn task-btn--delete cert-card__delete" onClick={() => onDelete(cert.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function CertificatesPage() {
  const [certs,     setCerts]     = useState([]);
  const [online,    setOnline]    = useState(false);
  const [title,     setTitle]     = useState('');
  const [issuer,    setIssuer]    = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [file,      setFile]      = useState(null);
  const [error,     setError]     = useState('');
  const [toasts,    setToasts]    = useState([]);
  const fileRef    = useRef();
  const toastTimer = useRef({});

  function showToast(message, type = 'success') {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    toastTimer.current[id] = setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
      delete toastTimer.current[id];
    }, 3000);
  }

  useEffect(() => {
    const timers = toastTimer.current;
    return () => Object.values(timers).forEach(clearTimeout);
  }, []);

  const fetchCerts = useCallback(async () => {
    try {
      const res = await fetch(`${API}/certificates`);
      if (!res.ok) throw new Error();
      setCerts(await res.json());
      setOnline(true);
    } catch {
      setOnline(false);
    }
  }, []);

  useEffect(() => { fetchCerts(); }, [fetchCerts]);

  async function handleUpload(e) {
    e.preventDefault();
    setError('');
    if (!file)        { setError('Please select a file.'); return; }
    if (!title.trim()) { setError('Certificate title is required.'); return; }

    const form = new FormData();
    form.append('file',      file);
    form.append('title',     title.trim());
    form.append('issuer',    issuer.trim());
    form.append('issueDate', issueDate);

    try {
      const res = await fetch(`${API}/certificates`, { method: 'POST', body: form });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      setTitle(''); setIssuer(''); setIssueDate(''); setFile(null);
      if (fileRef.current) fileRef.current.value = '';
      await fetchCerts();
      showToast('✅ Certificate uploaded successfully!', 'success');
    } catch (err) {
      setError(err.message || 'Upload failed.');
      showToast('Upload failed.', 'error');
    }
  }

  async function handleDelete(id) {
    try {
      const res = await fetch(`${API}/certificates/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      await fetchCerts();
      showToast('🗑 Certificate deleted from server!', 'delete');
    } catch {
      showToast('Failed to delete certificate.', 'error');
    }
  }

  return (
    <section className="certs-page" aria-labelledby="certs-heading">
      <Toast toasts={toasts} />

      <div className="tasks-page__hero">
        <h2 id="certs-heading">Certificates</h2>
        <p className="tasks-page__subtitle">Upload and manage your certificates</p>
      </div>

      <div className="backend-status">
        <span className={`backend-status__dot${online ? ' backend-status__dot--online' : ''}`} />
        {online ? 'Backend: Online (Port 5000)' : 'Backend: Offline'}
      </div>

      <div className="tasks-layout">

        {/* ── Upload form ── */}
        <div className="tasks-form-card">
          <h3>Upload Certificate</h3>
          <form onSubmit={handleUpload} encType="multipart/form-data" noValidate>
            <label className="tasks-form__label" htmlFor="cert-title">Title *</label>
            <input id="cert-title" className="tasks-form__input" type="text"
              placeholder="e.g. AWS Cloud Practitioner"
              value={title} onChange={e => setTitle(e.target.value)} required />

            <label className="tasks-form__label" htmlFor="cert-issuer">Issued By</label>
            <input id="cert-issuer" className="tasks-form__input" type="text"
              placeholder="e.g. Amazon Web Services"
              value={issuer} onChange={e => setIssuer(e.target.value)} />

            <label className="tasks-form__label" htmlFor="cert-date">Issue Date</label>
            <input id="cert-date" className="tasks-form__input" type="date"
              value={issueDate} onChange={e => setIssueDate(e.target.value)} />

            <label className="tasks-form__label" htmlFor="cert-file">
              File * <span className="tasks-form__hint">(PDF, JPG, PNG — max 5 MB)</span>
            </label>
            <input id="cert-file" className="tasks-form__input tasks-form__file"
              type="file" accept=".pdf,.jpg,.jpeg,.png,.webp"
              ref={fileRef}
              onChange={e => setFile(e.target.files[0] || null)} required />

            {error && <p className="tasks-form__error" role="alert">{error}</p>}

            <button type="submit" className="tasks-form__submit">⬆ Upload Certificate</button>
          </form>
        </div>

        {/* ── Certificate grid ── */}
        <div className="tasks-list-card">
          <h3>My Certificates ({certs.length})</h3>
          {certs.length === 0 ? (
            <p className="tasks-empty">{online ? 'No certificates yet. Upload one!' : 'Connect to backend to see certificates.'}</p>
          ) : (
            <div className="cert-grid">
              {certs.map(cert => (
                <CertCard key={cert.id} cert={cert} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
