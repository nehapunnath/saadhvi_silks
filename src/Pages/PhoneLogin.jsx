// components/PhoneLogin.jsx
import React, { useState, useRef, useEffect } from 'react';
import authApi from '../Services/authApi';

const PhoneLogin = ({ onSuccess, onSwitchToEmail }) => {
  const [step, setStep] = useState('phone'); // 'phone', 'otp'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(0);
  const [resendEnabled, setResendEnabled] = useState(false);
  
  const inputRefs = useRef([]);
  
  // Countdown timer for resend
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setResendEnabled(true);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);
  
  const formatPhoneNumber = (value) => {
    // Only allow digits
    const cleaned = value.replace(/\D/g, '');
    // Limit to 10 digits
    if (cleaned.length <= 10) return cleaned;
    return cleaned.slice(0, 10);
  };
  
  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await authApi.sendPhoneOtp(phoneNumber);
      setStep('otp');
      setTimer(30);
      setResendEnabled(false);
      setError('');
      // Auto-focus first OTP input
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    
    // Auto-submit when all digits are filled
    if (index === 5 && value && newOtp.every(digit => digit !== '')) {
      handleOtpSubmit();
    }
  };
  
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  
  const handleOtpSubmit = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter complete 6-digit OTP');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const result = await authApi.verifyPhoneOtp(otpCode, name || null);
      
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err) {
      setError(err.message);
      // Clear OTP inputs on error
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };
  
  const handleResendOtp = async () => {
    if (!resendEnabled) return;
    
    setLoading(true);
    setError('');
    
    try {
      await authApi.resendPhoneOtp();
      setTimer(30);
      setResendEnabled(false);
      setError('');
      // Clear OTP inputs
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="w-full">
      {step === 'phone' ? (
        // Phone Number Form
        <form onSubmit={handlePhoneSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#2E2E2E] mb-2">
              Phone Number
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-[#D9A7A7] bg-[#FFF8E1] text-[#6B2D2D]">
                +91
              </span>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                className="flex-1 px-4 py-3 border border-[#D9A7A7] rounded-r-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent bg-white"
                maxLength={10}
                autoFocus
              />
            </div>
            <p className="text-xs text-[#8B5A5A] mt-2">
              You'll receive a 6-digit OTP for verification
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#2E2E2E] mb-2">
              Name 
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 border border-[#D9A7A7] rounded-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent bg-white"
            />
          </div>
          
          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border-l-4 border-red-500">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#6B2D2D] text-white py-3 px-4 rounded-lg hover:bg-[#8B3A3A] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending OTP...
              </span>
            ) : (
              'Send OTP'
            )}
          </button>
          
          <div className="text-center">
            <button
              type="button"
              onClick={onSwitchToEmail}
              className="text-sm text-[#6B2D2D] hover:text-[#8B3A3A] hover:underline"
            >
              ← Back to Email Login
            </button>
          </div>
        </form>
      ) : (
        // OTP Verification Form
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-[#FFF8E1] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#D9A7A7]">
              <svg className="w-8 h-8 text-[#6B2D2D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18v-5m0 0V8m0 5h5m-5 0H7m6-8a9 9 0 11-9 9 9 9 0 019-9z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#2E2E2E]">Verify Your Phone</h3>
            <p className="text-[#8B5A5A] mt-1">
              Enter the 6-digit OTP sent to <br />
              <span className="font-medium text-[#6B2D2D]">+91 {phoneNumber}</span>
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#2E2E2E] text-center mb-3">
              Verification Code
            </label>
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl font-semibold border border-[#D9A7A7] rounded-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent bg-white"
                />
              ))}
            </div>
          </div>
          
          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg text-center border-l-4 border-red-500">
              {error}
            </div>
          )}
          
          <button
            onClick={handleOtpSubmit}
            disabled={loading || otp.some(d => d === '')}
            className="w-full bg-[#6B2D2D] text-white py-3 px-4 rounded-lg hover:bg-[#8B3A3A] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </span>
            ) : (
              'Verify & Login'
            )}
          </button>
          
          <div className="text-center">
            <button
              onClick={handleResendOtp}
              disabled={!resendEnabled}
              className={`text-sm ${resendEnabled ? 'text-[#6B2D2D] hover:underline' : 'text-gray-400 cursor-not-allowed'}`}
            >
              {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
            </button>
          </div>
          
          <div className="text-center">
            <button
              onClick={() => {
                setStep('phone');
                setError('');
                setOtp(['', '', '', '', '', '']);
              }}
              className="text-sm text-[#8B5A5A] hover:text-[#6B2D2D]"
            >
              ← Change phone number
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhoneLogin;