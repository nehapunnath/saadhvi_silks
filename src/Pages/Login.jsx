import React, { useState } from 'react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt:', formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8E1] to-[#F5E6D3] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-[#6B2D2D]">
           Sign in to your Admin account
          </h2>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl shadow-sm border border-[#D9A7A7] p-8 space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#2E2E2E] mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 border border-[#D9A7A7] rounded-lg placeholder-gray-400 text-[#2E2E2E] focus:outline-none focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent transition-all duration-200"
                placeholder="Enter your email"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#2E2E2E] mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 border border-[#D9A7A7] rounded-lg placeholder-gray-400 text-[#2E2E2E] focus:outline-none focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent transition-all duration-200"
                placeholder="Enter your password"
              />
            </div>

            {/* Remember Me & Forgot Password */}
            {/* <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#6B2D2D] focus:ring-[#6B2D2D] border-[#D9A7A7] rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-[#2E2E2E]">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-[#6B2D2D] hover:text-[#8B3A3A] transition-colors duration-200">
                  Forgot password?
                </a>
              </div>
            </div> */}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#6B2D2D] hover:bg-[#8B3A3A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6B2D2D] transition-all duration-200 transform hover:scale-[1.02]"
              >
                Sign in
              </button>
            </div>
          </div>

          {/* Sign Up Link */}
          {/* <div className="text-center">
            <p className="text-sm text-[#2E2E2E]">
              Don't have an account?{' '}
              <a href="#" className="font-medium text-[#6B2D2D] hover:text-[#8B3A3A] transition-colors duration-200">
                Sign up
              </a>
            </p>
          </div> */}
        </form>
      </div>
    </div>
  );
};

export default Login;