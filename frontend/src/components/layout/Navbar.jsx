import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaBars, FaTimes, FaUser, FaCalendarAlt } from 'react-icons/fa';
import logo from '../../assets/images/logo.png';

import { useAuth } from '../../context/AuthContext.jsx';

const navigation = [
  { name: 'Rooms', href: '/rooms' },
  { name: 'Dining', href: '/dining' },
  { name: 'Facilities', href: '/facilities' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Contact', href: '/contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { isAuthenticated, user, logout } = useAuth();
  const roles = user?.roles || (user?.role ? [user.role] : []);
  const isAdmin = roles.includes('ADMIN');
  const isReception = roles.includes('RECEPTIONIST');
  const isStaff = isAuthenticated && (isAdmin || isReception);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-md' : 'bg-white/90 backdrop-blur-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo + Brand */}
          <div className="flex items-center space-x-3">
          <Link to="/" className="flex items-center space-x-3">
  <img
    src={logo}
    alt="Northern Capital Hotel Logo"
    className="h-12 w-auto"
  />
  <span className={`hidden md:block text-xl font-serif font-bold tracking-wide relative group whitespace-nowrap ${
    'text-blue-900'
  }`}>
    <span className="relative z-10">Northern Capital Hotel</span>
    <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 bg-[length:200%_100%] bg-clip-text text-transparent opacity-0 group-hover:opacity-100 animate-[shimmer_2s_linear_infinite]">
      Northern Capital Hotel
    </span>
  </span>
</Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            {!isStaff &&
              navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `relative px-2 py-2 text-sm font-medium transition duration-200 group ${
                      isActive
                        ? 'text-blue-900 font-semibold'
                        : 'text-blue-800 hover:text-blue-900'
                    }`
                  }
                >
                  {item.name}
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
                </NavLink>
              ))}

            {/* Right Side (Bookings + Login + CTA) */}
            <div className="flex items-center space-x-6">
              {isAuthenticated && (isAdmin || isReception) && (
                <Link
                  to={isAdmin ? '/admin' : '/reception'}
                  className={`flex items-center transition-colors duration-200 ${
                    'text-blue-800 hover:text-blue-900'
                  }`}
                >
                  <FaUser className="mr-1" />
                  <span className="text-sm font-medium">Dashboard</span>
                </Link>
              )}

              {!isStaff && (
                <Link
                  to="/my-bookings"
                  className="flex items-center transition-colors duration-200 text-blue-800 hover:text-blue-900"
                >
                  <FaCalendarAlt className="mr-1" />
                  <span className="text-sm font-medium">My Bookings</span>
                </Link>
              )}

              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => logout()}
                  className="flex items-center transition-colors duration-200 text-blue-800 hover:text-blue-900"
                >
                  <FaUser className="mr-1" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center transition-colors duration-200 text-blue-800 hover:text-blue-900"
                >
                  <FaUser className="mr-1" />
                  <span className="text-sm font-medium">Login</span>
                </Link>
              )}
              {!isStaff && (
                <Link
                  to="/rooms"
                  className="relative px-6 py-2 rounded-full bg-blue-600 text-white font-semibold shadow-lg transition transform hover:-translate-y-0.5 overflow-hidden"
                >
                  <span className="relative z-10">Book Now</span>
                  <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 opacity-0 hover:opacity-100 blur-md transition duration-500"></span>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md focus:outline-none ${
                'text-blue-800 hover:text-blue-900'
              }`}
            >
              {isOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur-md shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {!isStaff &&
              navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 text-base font-medium rounded-md transition-colors duration-200 ${
                      isActive
                        ? 'bg-blue-50 text-blue-900 font-semibold'
                        : 'text-blue-800 hover:text-blue-900 hover:bg-blue-50'
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            <div className="pt-4 pb-3 border-t border-gray-200">
              {isAuthenticated && (isAdmin || isReception) && (
                <Link
                  to={isAdmin ? '/admin' : '/reception'}
                  className="flex items-center text-blue-800 hover:text-blue-900 px-3 py-2 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  <FaUser className="mr-2" />
                  <span>Dashboard</span>
                </Link>
              )}
              {!isStaff && (
                <Link
                  to="/my-bookings"
                  className="flex items-center text-blue-800 hover:text-blue-900 px-3 py-2 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  <FaCalendarAlt className="mr-2" />
                  <span>My Bookings</span>
                </Link>
              )}

              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="flex items-center text-blue-800 hover:text-blue-900 px-3 py-2 transition-colors duration-200 w-full"
                >
                  <FaUser className="mr-2" />
                  <span>Logout</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center text-blue-800 hover:text-blue-900 px-3 py-2 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  <FaUser className="mr-2" />
                  <span>Login</span>
                </Link>
              )}
              {!isStaff && (
                <Link
                  to="/rooms"
                  className="block w-full text-center bg-blue-600 text-white hover:bg-blue-800 px-4 py-2.5 rounded-md font-medium transition-all duration-200 shadow-md hover:shadow-lg mt-3 transform hover:-translate-y-0.5"
                  onClick={() => setIsOpen(false)}
                >
                  Book Now
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
