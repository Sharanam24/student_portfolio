import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email.trim(), password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Invalid email or password.');
      }

      // Store in localStorage
      localStorage.setItem('task_manager_token', data.token);
      localStorage.setItem('task_manager_email', data.user.email);
      
      // Update global App state
      onLoginSuccess(data.token, data.user.email);
      
      // Redirect to tasks
      navigate('/tasks-api');
    } catch (err) {
      setError(err.message || 'Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Sign in to manage your tasks securely</p>
        
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="auth-form__group">
            <label className="auth-form__label" htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              className="auth-form__input"
              placeholder="e.g. student@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="auth-form__group">
            <label className="auth-form__label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              className="auth-form__input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {error && <div className="auth-form__error" role="alert">{error}</div>}

          <button type="submit" className="auth-form__submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register" className="auth-link">Register here</Link>
        </p>
      </div>
    </div>
  );
}
