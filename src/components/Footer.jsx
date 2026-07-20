export default function Footer({ email = '', phone = '', github = '', year = '' }) {
  return (
    <footer id="contact" className="site-footer">
      <h2>Contact</h2>
      <div className="site-footer__details">
        {email && <p>Email: <a href={`mailto:${email}`}>{email}</a></p>}
        {phone && <p>Phone: <a href={`tel:${phone}`}>{phone}</a></p>}
        {github && <p>GitHub: <a href={github} target="_blank" rel="noreferrer">{github}</a></p>}
      </div>
      {year !== '' && <p className="site-footer__copy">&copy; {year} Sharanam</p>}
    </footer>
  );
}
