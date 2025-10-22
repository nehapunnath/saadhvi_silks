import React, { useState } from 'react';
import authApi from '../Services/authApi';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const result = await authApi.registerUser(formData.username, formData.email, formData.password);
      
      localStorage.setItem('userToken', result.token);
      localStorage.setItem('userUid', result.uid);
      localStorage.setItem('username', result.username);
      
      setSuccess('Registration successful! Redirecting...');
      
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E1F5FE] to-[#B3E5FC] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-[#01579B]">
            Create your account
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl shadow-sm border border-[#81D4FA] p-8 space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-[#2E2E2E] mb-2">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 border border-[#81D4FA] rounded-lg placeholder-gray-400 text-[#2E2E2E] focus:outline-none focus:ring-2 focus:ring-[#01579B] focus:border-transparent transition-all duration-200"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#2E2E2E] mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 border border-[#81D4FA] rounded-lg placeholder-gray-400 text-[#2E2E2E] focus:outline-none focus:ring-2 focus:ring-[#01579B] focus:border-transparent transition-all duration-200"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#2E2E2E] mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 border border-[#81D4FA] rounded-lg placeholder-gray-400 text-[#2E2E2E] focus:outline-none focus:ring-2 focus:ring-[#01579B] focus:border-transparent transition-all duration-200"
                placeholder="Enter your password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#2E2E2E] mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 border border-[#81D4FA] rounded-lg placeholder-gray-400 text-[#2E2E2E] focus:outline-none focus:ring-2 focus:ring-[#01579B] focus:border-transparent transition-all duration-200"
                placeholder="Confirm your password"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border-l-4 border-red-500">
                {error}
              </div>
            )}

            {success && (
              <div className="text-green-600 text-sm bg-green-50 p-3 rounded-lg border-l-4 border-green-500">
                {success}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white transition-all duration-200 transform ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#01579B] hover:bg-[#0277BD] hover:scale-[1.02]'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#01579B]`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <a href="/login" className="font-medium text-[#01579B] hover:text-[#0277BD]">
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;