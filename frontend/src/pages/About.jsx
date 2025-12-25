const About = () => {
    return (
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="relative h-96 bg-gradient-to-r from-blue-800 to-blue-600 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="relative text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              About Us
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
              Discover the story behind Northern Capital Hotel
            </p>
          </div>
        </div>
  
        {/* About Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Section */}
            <div>
              <h2 className="text-3xl font-bold text-blue-800 mb-6">
                Our Story
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Welcome to <span className="text-blue-700 font-semibold">Northern Capital Hotel</span>, 
                where luxury meets comfort in the heart of the city. Established in 2010, our hotel 
                has been a landmark of hospitality, offering guests unforgettable experiences with 
                world-class service and amenities.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Our commitment to excellence has earned us numerous awards and recognition in the 
                hospitality industry. We take pride in creating memorable moments for our guests, 
                whether visiting for business or leisure.
              </p>
  
              {/* Stats */}
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="bg-blue-50 hover:bg-blue-100 transition rounded-xl p-6 shadow-md text-center">
                  <h3 className="text-3xl font-bold text-blue-700 mb-2">100+</h3>
                  <p className="text-gray-600">Rooms & Suites</p>
                </div>
                <div className="bg-blue-50 hover:bg-blue-100 transition rounded-xl p-6 shadow-md text-center">
                  <h3 className="text-3xl font-bold text-blue-700 mb-2">10+</h3>
                  <p className="text-gray-600">Years Experience</p>
                </div>
              </div>
            </div>
  
            {/* Image Section */}
            <div className="relative h-96">
              <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-lg">
                <img
                  src="/src/assets/images/hotel-exterior.jpg"
                  alt="Hotel Exterior"
                  className="w-full h-full object-cover transform hover:scale-105 transition duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default About;
  