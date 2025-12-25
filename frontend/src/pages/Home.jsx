import { Link } from 'react-router-dom';
import { FaArrowRight, FaWifi, FaSwimmingPool, FaUtensils, FaParking, FaStar, FaQuoteLeft, FaUser, FaUtensilSpoon, FaSnowflake, FaBath, FaBed, FaCouch, FaTshirt, FaHotTub, FaMusic } from 'react-icons/fa';
import { motion } from 'framer-motion';
import React from 'react';
import DroneImage from '../assets/images/ChatGPT Image Oct 2, 2025, 01_13_25 PM.png';

const Home = () => {
  const rooms = [
    {
      id: 1,
      name: 'Single Suite',
      description: 'Cozy and comfortable room with a single bed, perfect for solo travelers.',
      price: 129,
      images: [
        '/src/assets/images/single1.jpeg',
        '/src/assets/images/single2.jpeg',
        '/src/assets/images/single3.jpeg'
      ],
      link: '/rooms/single-suite',
    },
    {
      id: 2,
      name: 'Standard Suite',
      description: 'Spacious room with a queen-size bed, ideal for couples or business travelers.',
      price: 189,
      images: [
        '/src/assets/images/standard1.jpeg',
        '/src/assets/images/standard2.jpeg'
      ],
      link: '/rooms/standard-suite',
    },
    {
      id: 3,
      name: 'Executive Suite',
      description: 'Luxurious suite with a king-size bed and separate living area.',
      price: 259,
      images: [
        '/src/assets/images/executive1.jpeg',
        '/src/assets/images/executive2.jpeg'
      ],
      link: '/rooms/executive-suite',
    },
  ];

  const facilities = [
    {
      id: 1,
      name: 'Conference Hall',
      description: 'State-of-the-art conference facilities for your business needs.',
      icon: <FaWifi className="text-4xl text-primary-600 mb-4" />,
      link: '/facilities/conference',
    },
    {
      id: 2,
      name: 'Swimming Pool',
      description: 'Relax and unwind in our temperature-controlled swimming pool.',
      icon: <FaSwimmingPool className="text-4xl text-primary-600 mb-4" />,
      link: '/facilities/pool',
    },
    {
      id: 3,
      name: 'Restaurant',
      description: 'Experience fine dining with our exquisite menu and wine selection.',
      icon: <FaUtensils className="text-4xl text-primary-600 mb-4" />,
      link: '/facilities/restaurant',
    },
    {
      id: 4,
      name: 'Parking',
      description: 'Secure parking available for all our guests.',
      icon: <FaParking className="text-4xl text-primary-600 mb-4" />,
      link: '/facilities/parking',
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: 'John Doe',
      role: 'Business Traveler',
      content: 'The best hotel I\'ve stayed at in years. The service was impeccable and the rooms were spotless.',
      rating: 5,
    },
    {
      id: 2,
      name: 'Jane Smith',
      role: 'Tourist',
      content: 'Amazing location and the staff went above and beyond to make our stay memorable.',
      rating: 5,
    },
    {
      id: 3,
      name: 'Michael Johnson',
      role: 'Event Organizer',
      content: 'Perfect venue for our corporate event. The conference facilities are top-notch.',
      rating: 4,
    },
  ];

  return (
    <div className="bg-white">
    {/* Hero Section */}
    <section className="relative h-screen flex items-center justify-center bg-cover bg-center overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src="/src/assets/images/hero.png"
          alt="Luxury Resort Hotel" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Drone Animation */}
      <motion.div
        initial={{ x: -500, y: -300, opacity: 0 }}
        animate={{ x: 0, y: 0, opacity: 1 }}
        transition={{ duration: 1.5, type: "spring", stiffness: 80 }}
        className="absolute top-20 w-40 z-20"
      >
        <motion.img
          src={DroneImage}
          alt="Flying Drone"
          className="w-full h-auto"
          animate={{ y: [0, -10, 0] }} // floating effect
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 1 }} // show sooner
        className="relative z-10 text-center text-white px-6 max-w-5xl"
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
        >
          Experience Luxury <br className="hidden md:block" />
          <span className="text-secondary-300">Redefined</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-gray-100"
        >
          Discover the perfect blend of comfort and elegance at Northern Capital Hotel, 
          where every stay is a memorable experience.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.8, duration: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link 
            to="/book-now" 
            className="px-6 py-2 rounded-full bg-white text-primary-700 font-semibold hover:bg-gray-100 transition shadow-lg text-center"
          >
            BOOK NOW
          </Link>
          <Link 
            to="/rooms" 
            className="px-6 py-2 rounded-full border-2 border-white text-white font-semibold hover:bg-white/10 transition text-center"
          >
            EXPLORE ROOMS
          </Link>
        </motion.div>
      </motion.div>
    </section>

      {/* Rooms Section */}
<section className="py-20 bg-white">
  <div className="container">
    <div className="text-center mb-16">
      <span className="inline-block text-primary-600 font-semibold mb-3">ACCOMMODATIONS</span>
      <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Rooms & Suites</h2>
      <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto mb-8"></div>
      <p className="text-gray-600 max-w-2xl mx-auto text-lg">
        Experience unparalleled comfort in our thoughtfully designed rooms and suites.
      </p>
    </div>
    
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            staggerChildren: 0.2
          }
        }
      }}
    >
      {rooms.map((room) => (
        <motion.div
          key={room.id}
          className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
        >
          <Link to={`/rooms/${room.id}`} className="block">
            {/* Room content */}
            <div className="h-64 overflow-hidden">
              <img
                src={Array.isArray(room.images) ? room.images[0] : room.image}
                alt={room.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2 text-gray-900 group-hover:text-primary-600 transition-colors">
                {room.name}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{room.description}</p>
              
              {/* Room features based on room ID */}
              <div className="mb-4">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <FaUser className="mr-1" />
                    {room.id === 1 ? '1 Guest' : '2 Guests'}
                  </span>
                  <span className="flex items-center">
                    <FaBed className="mr-1" />
                    {room.id === 1 ? 'Single Bed' : room.id === 2 ? 'Queen Bed' : 'King Bed'}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <span className="text-2xl font-bold text-primary-600">
                  ${room.price}<span className="text-sm font-normal text-gray-500"> / night</span>
                </span>
                <span className="px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-full transition-colors">
                  View Details
                </span>
              </div>
            </div>
          </Link>
          
          {/* Quick Book Button - Stays at the bottom */}
          <div className="px-6 pb-6 pt-0">
            <Link
              to={`/booking/${room.id}`}
              onClick={(e) => e.stopPropagation()}
              className="block w-full text-center px-6 py-3 rounded-full bg-primary-600 text-white font-semibold hover:bg-primary-700 transition shadow-lg hover:shadow-xl"
            >
              Book Now
            </Link>
          </div>
        </motion.div>
      ))}
    </motion.div>
    
    <div className="text-center mt-16">
      <Link 
        to="/rooms" 
        className="inline-block px-6 py-2 rounded-full bg-primary-600 text-white font-semibold hover:bg-primary-700 transition shadow-lg"
      >
        EXPLORE ALL ACCOMMODATIONS
      </Link>
    </div>
  </div>
</section>

      {/* Facilities Section */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-16">
            <span className="inline-block text-primary-600 font-semibold mb-3">AMENITIES</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Facilities</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto mb-8"></div>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Discover our world-class amenities designed to enhance your stay and make your experience truly exceptional.
            </p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2,
                  delayChildren: 0.3
                }
              }
            }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px 0px -50px 0px" }}
          >
            {facilities.map((facility) => (
              <motion.div
                key={facility.id}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  show: { 
                    opacity: 1, 
                    y: 0,
                    transition: { 
                      duration: 0.8,
                      ease: [0.16, 1, 0.3, 1]
                    }
                  }
                }}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center group"
                whileHover={{ 
                  y: -5,
                  transition: { 
                    type: "spring",
                    stiffness: 300,
                    damping: 15
                  }
                }}
              >
                <motion.div 
                  className="w-20 h-20 mx-auto mb-6 bg-primary-50 rounded-full flex items-center justify-center group-hover:bg-primary-100 transition-colors duration-300"
                  whileHover={{ 
                    rotate: 360,
                    scale: 1.1,
                    transition: { 
                      duration: 0.5,
                      type: "spring"
                    } 
                  }}
                >
                  {React.cloneElement(facility.icon, { className: 'text-3xl text-primary-600' })}
                </motion.div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{facility.name}</h3>
                <p className="text-gray-600 mb-6">{facility.description}</p>
                <motion.div
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Link 
                    to={facility.link} 
                    className="inline-flex items-center text-primary-600 hover:text-primary-800 font-medium group-hover:underline"
                  >
                    Learn More
                    <FaArrowRight className="ml-2 transition-transform group-hover:translate-x-1 duration-300" />
                  </Link>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <span className="inline-block text-primary-600 font-semibold mb-3">TESTIMONIALS</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Guest Experiences</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto mb-8"></div>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Don't just take our word for it. Here's what our guests have to say about their experience.
            </p>
          </div>
          <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar 
                      key={i} 
                      className={`${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'} text-xl mr-1`} 
                    />
                  ))}
                </div>
                <div className="relative mb-6">
                  <FaQuoteLeft className="text-gray-200 text-4xl absolute -top-2 -left-2" />
                  <p className="text-gray-700 italic relative z-10">{testimonial.content}</p>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-lg mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-700 to-primary-900 text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready for an Unforgettable Stay?</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto text-gray-100">
            Book your stay today and experience the perfect blend of luxury and comfort at Northern Capital Hotel.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/book-now" 
              className="bg-white text-primary-700 hover:bg-gray-100 px-8 py-4 rounded-md font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl inline-block"
            >
              Book Your Stay
            </Link>
            <Link 
              to="/contact" 
              className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-md font-semibold text-lg transition-all duration-300 transform hover:scale-105 inline-block"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
