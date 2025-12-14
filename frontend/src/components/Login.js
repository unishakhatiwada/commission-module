import React, { useState } from 'react';
import client from '../api/client';

const Login = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState(null);
    const [emailError, setEmailError] = useState(null);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);
        setEmailError(null);

        if (!validateEmail(email)) {
            setEmailError("Please enter a valid email address.");
            return;
        }

        if (password.length < 6) {
            setFormError("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);

        try {
            const response = await client.post('/login', { email, password });
            const token = response.data.token;

            localStorage.setItem('auth_token', token);
            onLoginSuccess(token);

        } catch (err) {
            setFormError(err.response?.data?.message || "Login failed. Check credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Admin Login</h2>

                {formError && (
                    <div className="login-error-box">
                        {formError}
                    </div>
                )}

                <form onSubmit={handleSubmit} autoComplete="off">

                    <div className="login-form-group">
                        <label className="login-label">Username</label>
                        <input
                            type="email"
                            className={`login-input ${emailError ? 'error' : ''}`}
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (emailError) setEmailError(null);
                            }}
                            placeholder="Enter username or email"
                            autoComplete="off"
                            required
                        />
                        {emailError && <div className="login-input-error-msg">{emailError}</div>}
                    </div>

                    <div className="login-form-group">
                        <label className="login-label">Password</label>
                        <div className="login-input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="login-input"
                                style={{ paddingRight: '40px' }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                autoComplete="new-password"
                                required
                            />

                            <button
                                type="button"
                                className="login-toggle-btn"
                                onClick={() => setShowPassword(!showPassword)}
                                title={showPassword ? "Hide Password" : "Show Password"}
                            >
                                {showPassword ? (
                                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                ) : (
                                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>

                <div className="login-footer">
                    <p>Use <strong>admin@example.com</strong> / <strong>password</strong></p>
                </div>
            </div>
        </div>
    );
};

export default Login;