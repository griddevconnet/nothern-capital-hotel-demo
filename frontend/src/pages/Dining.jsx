import {
    FaUtensils,
    FaWineGlassAlt,
    FaCoffee,
    FaRegClock,
    FaPhone,
  } from "react-icons/fa";

  import Standard1 from "../assets/images/standard1.jpeg";
  import Standard2 from "../assets/images/standard2.jpeg";
  import Executive1 from "../assets/images/executive1.jpeg";
  import Executive2 from "../assets/images/executive2.jpeg";
  
  const Dining = () => {
    const restaurants = [
      {
        name: "The Grand Restaurant",
        cuisine: "International",
        hours: "6:30 AM - 11:00 PM",
        description:
          "Experience a culinary journey with our international buffet featuring live cooking stations and a wide variety of global cuisines.",
        image: Standard1,
      },
      {
        name: "La Bella Vista",
        cuisine: "Italian",
        hours: "5:30 PM - 11:00 PM",
        description:
          "Authentic Italian cuisine in an elegant setting with panoramic views of the city. Our chef prepares traditional dishes with the finest ingredients imported from Italy.",
        image: Standard2,
      },
      {
        name: "The Lobby Lounge",
        cuisine: "Afternoon Tea & Drinks",
        hours: "10:00 AM - 12:00 AM",
        description:
          "Relax in our sophisticated lounge while enjoying premium teas, cocktails, and light bites throughout the day. Live piano music in the evenings.",
        image: Executive1,
      },
      {
        name: "Sakura",
        cuisine: "Japanese",
        hours: "11:30 AM - 10:30 PM",
        description:
          "Experience the art of Japanese cuisine with our master chefs preparing sushi, sashimi, and teppanyaki right before your eyes at our interactive dining counter.",
        image: Executive2,
      },
    ];
  
    const diningOptions = [
      {
        title: "Room Service",
        description:
          "24-hour in-room dining with an extensive menu available at your convenience.",
        icon: <FaUtensils className="h-8 w-8 text-blue-600" />,
      },
      {
        title: "Wine Cellar",
        description:
          "An extensive collection of fine wines from around the world, carefully selected by our sommelier.",
        icon: <FaWineGlassAlt className="h-8 w-8 text-blue-600" />,
      },
      {
        title: "Coffee Shop",
        description:
          "Freshly brewed coffee, pastries, and light meals available throughout the day.",
        icon: <FaCoffee className="h-8 w-8 text-blue-600" />,
      },
    ];
  
    return (
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="relative h-96 bg-gradient-to-br from-blue-700 to-indigo-900 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              Dining & Bars
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Discover exceptional culinary experiences at Northern Capital Hotel
            </p>
          </div>
        </div>
  
        {/* Restaurants */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Our Restaurants
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500">
              A world of flavors awaits you
            </p>
          </div>
  
          <div className="space-y-12">
            {restaurants.map((restaurant, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="md:w-1/3 h-64 md:h-auto">
                  <img
                    className="w-full h-full object-cover"
                    src={restaurant.image}
                    alt={restaurant.name}
                  />
                </div>
                <div className="p-8 md:w-2/3">
                  <div className="flex flex-col h-full">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {restaurant.name}
                      </h3>
                      <div className="flex items-center text-gray-600 mb-4">
                        <FaUtensils className="mr-2" />
                        <span>{restaurant.cuisine}</span>
                        <span className="mx-2">•</span>
                        <FaRegClock className="mr-2" />
                        <span>{restaurant.hours}</span>
                      </div>
                      <p className="text-gray-600 mb-6">
                        {restaurant.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-blue-600">
                        <FaPhone className="mr-2" />
                        <span>+1 (555) 123-4567</span>
                      </div>
                      <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        Make a Reservation
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
  
          {/* Additional Dining Options */}
          <div className="mt-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                More Dining Options
              </h2>
              <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500">
                Additional services to enhance your stay
              </p>
            </div>
  
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {diningOptions.map((option, index) => (
                <div
                  key={index}
                  className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow"
                >
                  <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-blue-50 mb-4">
                    {option.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {option.title}
                  </h3>
                  <p className="text-gray-600">{option.description}</p>
                </div>
              ))}
            </div>
          </div>
  
          {/* Private Dining & Events */}
          <div className="mt-24 bg-gray-50 rounded-xl p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-6">
                Private Dining & Events
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Host your next special event with us. Our dedicated events team
                will help you create a memorable experience for your guests.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Inquire About Private Events
                </button>
                <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                  View Event Spaces
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Dining;
  