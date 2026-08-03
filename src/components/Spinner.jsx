const spinnerStyle = {
  width: '40px',
  height: '40px',
  border: '4px solid var(--border)',
  borderTop: '4px solid var(--accent)',
  borderRadius: '50%',
  animation: 'spin 0.8s linear infinite',
  display: 'inline-block',
};

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '48px 0',
};

const keyframesStyle = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export default function Spinner() {
  return (
    <>
      <style>{keyframesStyle}</style>
      <div style={containerStyle}>
        <div
          role="status"
          aria-label="Loading repositories"
          style={spinnerStyle}
        />
      </div>
    </>
  );
}
