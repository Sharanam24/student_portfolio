import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Centralized Client-Side Validation
    if (!email.trim() || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email.trim(), password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Registration failed.');
      }

      setSuccess('Account created successfully! Redirecting to login page...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Register to start organizing your projects and tasks</p>
        
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="auth-form__group">
            <label className="auth-form__label" htmlFor="register-email">Email Address</label>
            <input
              id="register-email"
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
            <label className="auth-form__label" htmlFor="register-password">Password</label>
            <input
              id="register-password"
              type="password"
              className="auth-form__input"
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="auth-form__group">
            <label className="auth-form__label" htmlFor="register-confirm">Confirm Password</label>
            <input
              id="register-confirm"
              type="password"
              className="auth-form__input"
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {error && <div className="auth-form__error" role="alert">{error}</div>}
          {success && <div className="auth-form__success" role="alert">{success}</div>}

          <button type="submit" className="auth-form__submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Login here</Link>
        </p>
      </div>
    </div>
  );
}
