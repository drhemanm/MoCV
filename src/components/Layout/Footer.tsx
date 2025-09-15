// src/components/Layout/Footer.tsx
import React from 'react';
import { Heart, Github, Twitter, Linkedin, Mail, ExternalLink, Shield, FileText, HelpCircle } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Templates', href: '#templates' },
      { name: 'CV Builder', href: '#builder' },
      { name: 'AI Assistant', href: '#ai' },
      { name: 'CV Analyzer', href: '#analyzer' },
      { name: 'Job Matching', href: '#jobs' },
      { name: 'Interview Prep', href: '#interview' }
    ],
    company: [
      { name: 'About Us', href: '#about' },
      { name: 'Blog', href: '#blog' },
      { name: 'Careers', href: '#careers' },
      { name: 'Contact', href: '#contact' },
      { name: 'Press Kit', href: '#press' }
    ],
    resources: [
      { name: 'Help Center', href: '#help', icon: HelpCircle },
      { name: 'CV Tips', href: '#tips' },
      { name: 'Industry Guides', href: '#guides' },
      { name: 'Resume Examples', href: '#examples' },
      { name: 'Career Advice', href: '#advice' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '#privacy', icon: Shield },
      { name: 'Terms of Service', href: '#terms', icon: FileText },
      { name: 'Cookie Policy', href: '#cookies' },
      { name: 'Data Protection', href: '#data' }
    ]
  };

  const socialLinks = [
    {
      name: 'GitHub',
      href: 'https://github.com/mocv-mu',
      icon: Github,
      color: 'hover:text-gray-900'
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com/mocv_mu',
      icon: Twitter,
      color: 'hover:text-blue-400'
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/company/mocv-mu',
      icon: Linkedin,
      color: 'hover:text-blue-600'
    },
    {
      name: 'Email',
      href: 'mailto:hello@mocv.mu',
      icon: Mail,
      color: 'hover:text-green-600'
    }
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-xl font-bold text-gray-900">MoCV.mu</span>
            </div>
            <p className="text-gray-600 mb-4 max-w-md">
              Create professional CVs with AI assistance, get instant feedback, and land your dream job. 
              Built with ❤️ for job seekers in Mauritius and beyond.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-400 ${social.color} transition-colors duration-200`}
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>

            {/* Mauritius Badge */}
            <div className="mt-4 inline-flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-gray-200">
              <span className="text-lg">🇲🇺</span>
              <span className="text-sm text-gray-600 font-medium">Made in Mauritius</span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-200 text-sm flex items-center gap-1"
                  >
                    {link.name}
                    {link.icon && <ExternalLink className="h-3 w-3" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-200 text-sm flex items-center gap-1"
                  >
                    {link.icon && <link.icon className="h-3 w-3" />}
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-gray-200 pt-8 mb-8">
          <div className="max-w-md">
            <h3 className="font-semibold text-gray-900 mb-2">Stay Updated</h3>
            <p className="text-gray-600 text-sm mb-4">
              Get the latest CV tips, job market insights, and product updates.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                Subscribe
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              No spam, unsubscribe at any time.
            </p>
          </div>
        </div>

        {/* Statistics Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">10K+</div>
              <div className="text-sm text-gray-600">CVs Created</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">50+</div>
              <div className="text-sm text-gray-600">Templates</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">95%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">24/7</div>
              <div className="text-sm text-gray-600">AI Support</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600">
              © {currentYear} MoCV.mu. All rights reserved.
            </div>
            
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                Made with <Heart className="h-4 w-4 text-red-500" /> for job seekers
              </span>
              
              <div className="flex items-center gap-4">
                <span>Version 1.0.0</span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="All systems operational"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile App Promotion */}
        <div className="mt-8 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Coming Soon: Mobile App</h4>
              <p className="text-sm text-gray-600">Create CVs on the go with our upcoming mobile app.</p>
            </div>
            <div className="flex gap-2">
              <div className="bg-black text-white px-3 py-1 rounded text-xs font-medium">
                iOS
              </div>
              <div className="bg-green-600 text-white px-3 py-1 rounded text-xs font-medium">
                Android
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
