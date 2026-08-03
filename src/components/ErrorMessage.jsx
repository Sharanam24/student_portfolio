const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '16px',
  padding: '48px 0',
  textAlign: 'center',
};

const messageStyle = {
  color: 'var(--text, #e53e3e)',
  fontSize: '1rem',
};

const buttonStyle = {
  padding: '8px 20px',
  border: '2px solid var(--accent, #6c63ff)',
  borderRadius: '6px',
  background: 'transparent',
  color: 'var(--accent, #6c63ff)',
  fontSize: '1rem',
  cursor: 'pointer',
};

// Props: message (string), onRetry (function)
export default function ErrorMessage({ message, onRetry }) {
  return (
    <div style={containerStyle}>
      <p style={messageStyle}>{message}</p>
      <button type="button" onClick={onRetry} style={buttonStyle}>
        Retry
      </button>
    </div>
  );
}
