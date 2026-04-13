// src/components/QuickLoginModal.jsx
import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import authApi from '../Services/authApi';

const QuickLoginModal = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState('details'); // 'details', 'otp'
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [resendEnabled, setResendEnabled] = useState(false);
  
  const inputRefs = useRef([]);

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

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      // Reset after modal closes
      setTimeout(() => {
        setStep('details');
        setName('');
        setPhone('');
        setOtp(['', '', '', '', '', '']);
        setTimer(0);
        setResendEnabled(false);
        setLoading(false);
      }, 300);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSendOtp = async () => {
    // Basic validation
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);

    try {
      // Send OTP to phone number
      const result = await authApi.sendPhoneOtp(phone);
      
      if (result.success) {
        toast.success('OTP sent successfully!');
        setStep('otp');
        setTimer(30);
        setResendEnabled(false);
        // Auto-focus first OTP input
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      } else {
        toast.error(result.error || 'Failed to send OTP');
      }
    } catch (err) {
      toast.error('Failed to send OTP. Please try again.');
      console.error(err);
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
      handleVerifyOtp();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      toast.error('Please enter complete 6-digit OTP');
      return;
    }
    
    setLoading(true);

    try {
      // Verify OTP and login/register
      const result = await authApi.verifyPhoneOtp(otpCode, name);
      
      if (result.success) {
        toast.success(`Welcome${name ? `, ${name}` : ''}!`);
        
        // Store user info in localStorage
        localStorage.setItem('userToken', result.token);
        localStorage.setItem('userUid', result.uid);
        if (result.name) localStorage.setItem('username', result.name);
        if (result.phoneNumber) localStorage.setItem('phoneNumber', result.phoneNumber);
        
        // Call onSuccess callback (for cart/wishlist actions)
        if (onSuccess) {
          await onSuccess();
        }
        
        onClose();
      } else {
        toast.error(result.error || 'Verification failed. Please try again.');
        // Clear OTP inputs on error
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      toast.error('Verification failed. Please try again.');
      console.error(err);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!resendEnabled) return;
    
    setLoading(true);

    try {
      const result = await authApi.resendPhoneOtp();
      
      if (result.success) {
        toast.success('OTP resent successfully!');
        setTimer(30);
        setResendEnabled(false);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      } else {
        toast.error(result.error || 'Failed to resend OTP');
      }
    } catch (err) {
      toast.error('Failed to resend OTP. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDetails = () => {
    setStep('details');
    setOtp(['', '', '', '', '', '']);
    setTimer(0);
    setResendEnabled(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl md:rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl">
        {step === 'details' ? (
          // Step 1: Name and Phone Number
          <>
            <h2 className="text-2xl md:text-3xl font-bold text-[#2E2E2E] mb-4 text-center">
              Quick Access
            </h2>
            
            <p className="text-center text-gray-600 mb-6 text-sm md:text-base">
              Please enter your name and phone number to continue
            </p>

            <div className="space-y-5">
              <div>
                <label className="block text-[#2E2E2E] font-medium mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-[#D9A7A7] rounded-lg focus:outline-none focus:border-[#800020] focus:ring-1 focus:ring-[#800020]"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-[#2E2E2E] font-medium mb-2">
                  Phone Number
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-4 py-3 bg-gray-100 border border-r-0 border-[#D9A7A7] rounded-l-lg text-gray-700 font-medium">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="Enter 10-digit number"
                    maxLength={10}
                    className="flex-1 px-4 py-3 border border-[#D9A7A7] rounded-r-lg focus:outline-none focus:border-[#800020] focus:ring-1 focus:ring-[#800020]"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  You'll receive a 6-digit OTP for verification
                </p>
              </div>

              <button
                onClick={handleSendOtp}
                disabled={loading}
                className={`w-full py-3.5 rounded-lg font-medium text-white transition-all ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-[#800020] hover:bg-[#6B2D2D]'
                }`}
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

              <button
                onClick={onClose}
                className="w-full text-center text-gray-600 hover:text-[#800020] mt-2 text-sm"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          // Step 2: OTP Verification
          <>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#FFF8E1] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#D9A7A7]">
                <svg className="w-8 h-8 text-[#800020]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18v-5m0 0V8m0 5h5m-5 0H7m6-8a9 9 0 11-9 9 9 9 0 019-9z" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#2E2E2E] mb-2">
                Verify OTP
              </h2>
              <p className="text-gray-600 mb-4 text-sm">
                Enter the 6-digit OTP sent to <br />
                <span className="font-semibold text-[#800020]">+91 {phone}</span>
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-[#2E2E2E] font-medium text-center mb-3">
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
                      className="w-12 h-12 text-center text-xl font-semibold border border-[#D9A7A7] rounded-lg focus:ring-2 focus:ring-[#800020] focus:border-transparent bg-white"
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={loading || otp.some(d => d === '')}
                className={`w-full py-3.5 rounded-lg font-medium text-white transition-all ${
                  loading || otp.some(d => d === '')
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-[#800020] hover:bg-[#6B2D2D]'
                }`}
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
                  'Verify & Continue'
                )}
              </button>

              <div className="text-center space-y-2">
                <button
                  onClick={handleResendOtp}
                  disabled={!resendEnabled}
                  className={`text-sm ${
                    resendEnabled 
                      ? 'text-[#800020] hover:underline' 
                      : 'text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
                </button>
                
                <div>
                  <button
                    onClick={handleBackToDetails}
                    className="text-sm text-gray-500 hover:text-[#800020]"
                  >
                    ← Edit phone number
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuickLoginModal;