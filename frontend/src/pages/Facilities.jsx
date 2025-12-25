import { 
    FaSwimmingPool, 
    FaWifi, 
    FaParking, 
    FaDumbbell, 
    FaUtensils, 
    FaConciergeBell 
  } from 'react-icons/fa';
  
  const Facilities = () => {
    const facilities = [
      {
        icon: <FaSwimmingPool className="text-5xl text-blue-600 group-hover:text-blue-800 transition-colors duration-300" />,
        title: 'Swimming Pool',
        description: 'Enjoy our heated outdoor pool with a stunning view of the city skyline.'
      },
      {
        icon: <FaUtensils className="text-5xl text-blue-600 group-hover:text-blue-800 transition-colors duration-300" />,
        title: 'Restaurant & Bar',
        description: 'Experience exquisite dining with our award-winning restaurant and bar.'
      },
      {
        icon: <FaDumbbell className="text-5xl text-blue-600 group-hover:text-blue-800 transition-colors duration-300" />,
        title: 'Fitness Center',
        description: 'Stay fit with our state-of-the-art fitness equipment available 24/7.'
      },
      {
        icon: <FaConciergeBell className="text-5xl text-blue-600 group-hover:text-blue-800 transition-colors duration-300" />,
        title: 'Concierge',
        description: 'Our dedicated staff is available to assist with all your needs and bookings.'
      },
      {
        icon: <FaWifi className="text-5xl text-blue-600 group-hover:text-blue-800 transition-colors duration-300" />,
        title: 'Free WiFi',
        description: 'High-speed internet access available throughout the hotel.'
      },
      {
        icon: <FaParking className="text-5xl text-blue-600 group-hover:text-blue-800 transition-colors duration-300" />,
        title: 'Parking',
        description: 'Complimentary parking available for all our guests.'
      }
    ];
  
    return (
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="relative h-96 bg-gradient-to-r from-blue-800 to-blue-600 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="relative text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              Our Facilities
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
              Discover our world-class amenities designed for your comfort and convenience.
            </p>
          </div>
        </div>
  
        {/* Facilities Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {facilities.map((facility, index) => (
              <div 
                key={index} 
                className="group bg-white border border-blue-100 rounded-2xl shadow-md 
                           hover:shadow-xl hover:border-blue-400 transition-all duration-300 
                           p-8 flex flex-col items-center text-center"
              >
                {/* Icon with animation */}
                <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {facility.icon}
                </div>
  
                {/* Title */}
                <h3 className="text-xl font-bold text-blue-700 group-hover:text-blue-900 mb-3">
                  {facility.title}
                </h3>
  
                {/* Description */}
                <p className="text-gray-600 leading-relaxed">
                  {facility.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default Facilities;
  