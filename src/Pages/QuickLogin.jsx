// // src/components/QuickLoginModal.jsx
// import React, { useState } from 'react';
// import { toast } from 'react-hot-toast';
// import authApi from '../Services/authApi';

// const QuickLogin = ({ isOpen, onClose, onSuccess }) => {
//   const [name, setName] = useState('');
//   const [phone, setPhone] = useState('');
//   const [loading, setLoading] = useState(false);

//   if (!isOpen) return null;

//   const handleSubmit = async () => {
//     // Basic validation
//     if (!name.trim()) {
//       toast.error('Please enter your name');
//       return;
//     }
//     if (!/^\d{10}$/.test(phone)) {
//       toast.error('Please enter a valid 10-digit phone number');
//       return;
//     }

//     setLoading(true);

//     try {
//       const result = await authApi.quickPhoneLoginOrRegister(name.trim(), phone);
      
//       if (result.success) {
//         toast.success(`Welcome${name ? `, ${name}` : ''}!`);
//         onSuccess();   // ← this will run add to cart or wishlist
//         onClose();
//       } else {
//         toast.error(result.error || 'Login failed. Please try again.');
//       }
//     } catch (err) {
//       toast.error('Something went wrong. Please try again.');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
//       <div className="bg-white rounded-xl md:rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl">
//         <h2 className="text-2xl md:text-3xl font-bold text-[#2E2E2E] mb-4 text-center">
//           Quick Access
//         </h2>
        
//         <p className="text-center text-gray-600 mb-6 text-sm md:text-base">
//           Please enter your name and phone number to continue
//         </p>

//         <div className="space-y-5">
//           <div>
//             <label className="block text-[#2E2E2E] font-medium mb-2">
//               Your Name
//             </label>
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               placeholder="e.g. Neha"
//               className="w-full px-4 py-3 border border-[#D9A7A7] rounded-lg focus:outline-none focus:border-[#800020] focus:ring-1 focus:ring-[#800020]"
//             />
//           </div>

//           <div>
//             <label className="block text-[#2E2E2E] font-medium mb-2">
//               Phone Number
//             </label>
//             <div className="flex">
//               <span className="inline-flex items-center px-4 py-3 bg-gray-100 border border-r-0 border-[#D9A7A7] rounded-l-lg text-gray-700 font-medium">
//                 +91
//               </span>
//               <input
//                 type="tel"
//                 value={phone}
//                 onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
//                 placeholder="Enter 10-digit number"
//                 maxLength={10}
//                 className="flex-1 px-4 py-3 border border-[#D9A7A7] rounded-r-lg focus:outline-none focus:border-[#800020] focus:ring-1 focus:ring-[#800020]"
//               />
//             </div>
//           </div>

//           <button
//             onClick={handleSubmit}
//             disabled={loading}
//             className={`w-full py-3.5 rounded-lg font-medium text-white transition-all ${
//               loading 
//                 ? 'bg-gray-400 cursor-not-allowed' 
//                 : 'bg-[#800020] hover:bg-[#6B2D2D]'
//             }`}
//           >
//             {loading ? 'Please wait...' : 'Continue'}
//           </button>

//           <button
//             onClick={onClose}
//             className="w-full text-center text-gray-600 hover:text-[#800020] mt-2 text-sm"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default QuickLogin;