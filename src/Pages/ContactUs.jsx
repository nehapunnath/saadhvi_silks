import React from 'react';
import { FaFacebookF, FaInstagram, FaPinterestP, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';

const ContactUS = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-pink-100">
     

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Page Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#891c3c] mb-4">Get in Touch</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Visit our store or reach out to us through any of the following methods. We're here to help you find the perfect silk saree.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-md">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 pb-2 border-b border-rose-100">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-pink-100 p-3 rounded-lg mr-4">
                    <FaMapMarkerAlt className="text-[#891c3c] text-xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Address</h4>
                    <p className="text-gray-700">
                      #69/2, AGR Tower, Carmelaram Post,<br />
                      Kaikondrahalli, Sarjapur Main Road,<br />
                      Bengaluru - 560035
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-pink-100 p-3 rounded-lg mr-4">
                    <FaPhone className="text-[#891c3c] text-xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Phone Numbers</h4>
                    <p className="text-gray-700">8861315710, 080-41706009</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-pink-100 p-3 rounded-lg mr-4">
                    <FaEnvelope className="text-[#891c3c] text-xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Email Address</h4>
                    <p className="text-gray-700">saadhvisilksblr@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-pink-100 p-3 rounded-lg mr-4">
                    <FaClock className="text-[#891c3c] text-xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Business Hours</h4>
                    <p className="text-gray-700">
                      <span className="block">Monday - Saturday: 10:00 AM - 8:00 PM</span>
                      <span className="block">Sunday: 11:00 AM - 6:00 PM</span>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-rose-100">
                <h4 className="font-semibold text-gray-800 mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  <a href="#" className="bg-pink-100 p-3 rounded-full text-[#891c3c] hover:bg-[#891c3c] hover:text-white transition-colors">
                    <FaFacebookF className="text-lg" />
                  </a>
                  <a href="#" className="bg-pink-100 p-3 rounded-full text-[#891c3c] hover:bg-[#891c3c] hover:text-white transition-colors">
                    <FaInstagram className="text-lg" />
                  </a>
                  <a href="#" className="bg-pink-100 p-3 rounded-full text-[#891c3c] hover:bg-[#891c3c] hover:text-white transition-colors">
                    <FaPinterestP className="text-lg" />
                  </a>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-md">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Why Visit Our Store?</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-[#891c3c] mr-2">•</span>
                  <span>Expert assistance in selecting the perfect silk saree</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#891c3c] mr-2">•</span>
                  <span>See and feel the quality of our fabrics in person</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#891c3c] mr-2">•</span>
                  <span>Get personalized recommendations based on your preferences</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#891c3c] mr-2">•</span>
                  <span>Learn about proper saree maintenance and care</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Map Section */}
          <div className="bg-white rounded-2xl p-8 shadow-md">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Our Location</h3>
            <div className="bg-gray-200 h-96 rounded-lg overflow-hidden mb-6">
              {/* This would be your actual map component */}
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-rose-100 to-pink-200">
                <div className="text-center p-4">
                  <FaMapMarkerAlt className="text-[#891c3c] text-5xl mx-auto mb-4" />
                  <p className="text-gray-700 font-semibold">Map would be embedded here</p>
                  <p className="text-gray-600 mt-2">#69/2, AGR Tower, Carmelaram Post, Bengaluru</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800">Directions</h4>
              <p className="text-gray-700">
                We are located on Sarjapur Main Road, near Carmelaram Post. Look for the AGR Tower building, and you'll find our store on the ground floor.
              </p>
              
              {/* <h4 className="font-semibold text-gray-800 mt-6">Parking Information</h4>
              <p className="text-gray-700">
                Ample parking space is available in front of the building for your convenience.
              </p> */}
            </div>
          </div>
        </div>
      </main>



    </div>
  );
};

export default ContactUS;