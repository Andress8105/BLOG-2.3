import React from 'react';
import { Mail, Phone, MessageCircle } from 'lucide-react';

const Footer: React.FC = () => {
  const handleWhatsAppClick = () => {
    const phoneNumber = '573126951749'; // +57 312 6951749 in international format without +
    const message = encodeURIComponent('Hola, me interesa contactarte sobre el desarrollo web.');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Developer Info */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-4">Developed by</h3>
            <h4 className="text-xl font-semibold text-blue-300 mb-6">
              Maria C Guerrero Roqueme
            </h4>
          </div>

          {/* Contact Information */}
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8 mb-8">
            {/* Email */}
            <a
              href="mailto:roquememariac@gmail.com"
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors group"
            >
              <Mail className="w-5 h-5 group-hover:text-blue-400" />
              <span>roquememariac@gmail.com</span>
            </a>

            {/* Phone */}
            <a
              href="tel:+573126951749"
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors group"
            >
              <Phone className="w-5 h-5 group-hover:text-green-400" />
              <span>+57 312 6951749</span>
            </a>

            {/* WhatsApp */}
            <button
              onClick={handleWhatsAppClick}
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors group bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
            >
              <MessageCircle className="w-5 h-5" />
              <span>WhatsApp</span>
            </button>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} BlogPlatform. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Built with React, TypeScript, Node.js & MongoDB
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;