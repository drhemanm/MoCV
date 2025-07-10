import React from 'react';
import { Shield, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">MoCV.mu</h3>
            <p className="text-gray-300 text-sm">
              AI-powered CV optimization platform designed for Mauritians and Africans 
              to compete in global job markets.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                support@mocv.mu
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                +230 5123 4567
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Port Louis, Mauritius
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="/gdpr" className="hover:text-white transition-colors">GDPR Compliance</a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="bg-gray-800 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h5 className="font-semibold text-blue-400 mb-2">Disclaimer</h5>
                <p className="text-gray-300 text-sm leading-relaxed">
                  This platform is built in compliance with GDPR. Your data is stored securely on Firebase. 
                  MoCV is a career guidance and CV enhancement platform. The information provided by the AI assistant 
                  does not guarantee job placement or interview success. Contact us for data removal or inquiries at support@mocv.mu.
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center text-gray-400 text-sm">
            <p>&copy; 2024 MoCV.mu. All rights reserved. | Made with ❤️ in Mauritius</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;