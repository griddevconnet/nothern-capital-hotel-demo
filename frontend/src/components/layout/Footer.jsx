import { 
  FaFacebook, FaTwitter, FaInstagram, 
  FaMapMarkerAlt, FaPhone, FaEnvelope 
} from 'react-icons/fa';
import logo from '../../assets/images/logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Rooms & Suites', href: '/rooms' },
    { name: 'Facilities', href: '/facilities' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const contactInfo = [
    { icon: <FaMapMarkerAlt />, text: '123 Luxury Avenue, City Center, 10001' },
    { icon: <FaPhone />, text: '+1 (555) 123-4567' },
    { icon: <FaEnvelope />, text: 'info@northerncapitalhotel.com' },
  ];

  const socialLinks = [
    { icon: <FaFacebook />, href: 'https://facebook.com' },
    { icon: <FaTwitter />, href: 'https://twitter.com' },
    { icon: <FaInstagram />, href: 'https://instagram.com' },
  ];

  return (
    <footer className="relative bg-gradient-to-r from-[#0a192f] via-[#0f2747] to-[#0a192f] text-white pt-16 pb-8 overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f]/70 to-transparent pointer-events-none"></div>

      <div className="container relative mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Logo + About */}
          <div className="lg:col-span-2 animate-fadeIn">
            <div className="flex items-center mb-6">
              <img src={logo} alt="Hotel Logo" className="h-12 w-auto mr-3 drop-shadow-lg" />
              <h3 className="text-2xl font-bold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-300">
                Northern Capital Hotel
              </h3>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Experience luxury and comfort at Northern Capital Hotel, where every stay is designed to be memorable. 
              Our commitment to excellence ensures a perfect blend of modern amenities and timeless elegance.
            </p>
            <div className="flex space-x-5">
              {socialLinks.map((social, index) => (
                <a 
                  key={index}
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-400 transform hover:scale-110 transition duration-300 text-2xl"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="animate-slideUp">
            <h4 className="text-lg font-semibold mb-6 text-blue-300">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-gray-300 hover:text-blue-400 relative group"
                  >
                    {link.name}
                    <span className="block h-0.5 bg-blue-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="animate-slideUp delay-200">
            <h4 className="text-lg font-semibold mb-6 text-blue-300">Contact Us</h4>
            <ul className="space-y-4">
              {contactInfo.map((item, index) => (
                <li key={index} className="flex items-start space-x-3 text-gray-300 hover:text-blue-400 transition">
                  <span className="text-xl mt-1">{item.icon}</span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 border-t border-gray-700/40"></div>

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-8 text-gray-400 text-sm">
          <p>&copy; {currentYear} Northern Capital Hotel. All rights reserved.</p>
          <div className="flex space-x-4 mt-3 md:mt-0">
            <a href="/privacy" className="hover:text-blue-400 transition">Privacy Policy</a>
            <span>|</span>
            <a href="/terms" className="hover:text-blue-400 transition">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
