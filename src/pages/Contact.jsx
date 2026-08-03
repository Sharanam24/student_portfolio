import { useState } from 'react';

export default function Contact({ data }) {
  const [message, setMessage] = useState('');

  return (
    <section className="contact-section" aria-labelledby="contact-heading">
      <h2 id="contact-heading">Contact Info</h2>

      <div className="contact-details">
        {data.email && <p>Email: <a href={`mailto:${data.email}`}>{data.email}</a></p>}
        {data.phone && <p>Phone: <a href={`tel:${data.phone}`}>{data.phone}</a></p>}
      </div>

      <div className="contact-social">
        {data.github && <a href={data.github} target="_blank" rel="noreferrer">GitHub</a>}
      </div>

      <div className="contact-form">
        <h3>Send a Message</h3>
        <label htmlFor="contact-message" className="form-label">Your message</label>
        <textarea
          id="contact-message"
          className="form-textarea"
          rows={4}
          placeholder="Write something..."
          value={message}
          onChange={e => setMessage(e.target.value)}
          aria-describedby={message ? 'message-preview' : undefined}
        />
        {message && (
          <div id="message-preview" className="message-preview" aria-live="polite">
            <strong>Preview:</strong>
            <p>{message}</p>
          </div>
        )}
      </div>
    </section>
  );
}
