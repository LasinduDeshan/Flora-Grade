import { Link } from 'react-router-dom';
import Logo from '../assets/img/FloraGrade Logo.png';

const socialLinks = [
  {
    href: 'https://facebook.com/',
    label: 'Facebook',
    icon: (
      <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
        <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.326 24h11.495v-9.294H9.691v-3.622h3.13V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0" />
      </svg>
    ),
  },
  {
    href: 'https://twitter.com/',
    label: 'Twitter',
    icon: (
      <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
        <path d="M24 4.557a9.93 9.93 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195a4.92 4.92 0 0 0-8.384 4.482C7.691 8.095 4.066 6.13 1.64 3.161c-.542.929-.856 2.01-.857 3.17 0 2.188 1.115 4.116 2.823 5.247a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.209c9.057 0 14.009-7.496 14.009-13.986 0-.213-.005-.425-.014-.636A9.936 9.936 0 0 0 24 4.557z" />
      </svg>
    ),
  },
  {
    href: 'https://instagram.com/',
    label: 'Instagram',
    icon: (
      <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.069 1.646.069 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.747 2.163 15.367 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.241-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.775.13 4.602.402 3.635 1.37 2.668 2.337 2.396 3.51 2.338 4.788 2.279 6.068 2.266 6.477 2.266 12c0 5.523.013 5.932.072 7.212.058 1.278.33 2.451 1.297 3.418.967.967 2.14 1.239 3.418 1.297 1.28.059 1.689.072 7.212.072s5.932-.013 7.212-.072c1.278-.058 2.451-.33 3.418-1.297.967-.967 1.239-2.14 1.297-3.418.059-1.28.072-1.689.072-7.212s-.013-5.932-.072-7.212c-.058-1.278-.33-2.451-1.297-3.418C21.451.402 20.278.13 19 .072 17.721.013 17.312 0 14.053 0h-4.106z" />
        <circle cx="12" cy="12" r="3.5" />
      </svg>
    ),
  },
  {
    href: 'https://github.com/your-repo',
    label: 'GitHub',
    icon: (
      <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
        <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.334-5.466-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23a11.52 11.52 0 0 1 3.003-.404c1.018.005 2.045.138 3.003.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.653.242 2.873.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.803 5.624-5.475 5.921.43.372.823 1.102.823 2.222v3.293c0 .322.218.694.825.576C20.565 21.796 24 17.299 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
];

const Footer = () => (
  <footer className="bg-black bg-opacity-90 text-gray-400 pt-10 pb-6 border-t border-gray-800">
    <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row md:items-start md:justify-between gap-8">
      {/* Logo and Description */}
      <div className="flex flex-col items-center md:items-start text-center md:text-left gap-3 md:w-1/3">
        <Link to="/" className="flex items-center gap-2 mb-2">
          <img src={Logo} alt="FloraGrade Logo" className="h-12 w-auto" />
          
        </Link>
        <p className="text-sm text-gray-400 max-w-xs">
          FloraGrade is your trusted platform for AI-powered flower grading, quality e-commerce, and seamless floral business management.
        </p>
      </div>
      {/* Navigation Links */}
      <div className="flex flex-col gap-2 md:w-1/3">
        <span className="uppercase text-xs text-gray-500 font-semibold mb-2">Pages</span>
        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
          <Link to="/" className="hover:text-pink-400 transition-colors">Home</Link>
          <Link to="/products" className="hover:text-pink-400 transition-colors">Products</Link>
          <Link to="/flower-grading" className="hover:text-pink-400 transition-colors">Flower Grading</Link>
          
          <Link to="/profile" className="hover:text-pink-400 transition-colors">Profile</Link>
          <Link to="/orders" className="hover:text-pink-400 transition-colors">Orders</Link>
         
        </div>
      </div>
      {/* Contact & Social */}
      <div className="flex flex-col gap-3 md:w-1/3 items-center md:items-end text-center md:text-right">
        <span className="uppercase text-xs text-gray-500 font-semibold mb-2">Contact</span>
        <div className="text-sm">
          <div>Email: <a href="mailto:support@floragrade.com" className="hover:text-pink-400 transition-colors">support@floragrade.com</a></div>
          <div>Phone: <a href="tel:+1234567890" className="hover:text-pink-400 transition-colors">+1 (234) 567-890</a></div>
        </div>
        <div className="flex gap-4 mt-2 justify-center md:justify-end">
          {socialLinks.map(({ href, label, icon }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="hover:text-pink-400 transition-colors">
              {icon}
            </a>
          ))}
        </div>
      </div>
    </div>
    <div className="mt-8 text-center text-xs text-gray-600">
      &copy; {new Date().getFullYear()} FloraGrade. All rights reserved.
    </div>
  </footer>
);

export default Footer; 