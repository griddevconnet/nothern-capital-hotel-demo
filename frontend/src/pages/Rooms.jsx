import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { roomsAPI } from "../services/api.js";
import {
  FaBed,
  FaRuler,
  FaWifi,
  FaTv,
  FaSnowflake,
  FaCoffee,
  FaWineGlassAlt,
  FaUmbrellaBeach,
  FaSearch,
} from "react-icons/fa";

// Mock data - replace with API call in real app
const rooms = [
  {
    id: 1,
    name: "Single Suite",
    description:
      "Cozy and comfortable room with a single bed, perfect for solo travelers.",
    price: 129,
    size: "25",
    maxOccupancy: 1,
    image: "/src/assets/images/single1.jpeg",
    amenities: [
      { icon: <FaWifi />, name: "Free WiFi" },
      { icon: <FaTv />, name: "Smart TV" },
      { icon: <FaSnowflake />, name: "Air Conditioning" },
      { icon: <FaCoffee />, name: "Coffee Maker" },
    ],
  },
  {
    id: 2,
    name: "Standard Suite",
    description:
      "Spacious room with a queen-size bed, ideal for couples or business travelers.",
    price: 189,
    size: "35",
    maxOccupancy: 2,
    image: "/src/assets/images/standard1.jpeg",
    amenities: [
      { icon: <FaWifi />, name: "Free WiFi" },
      { icon: <FaTv />, name: "Smart TV" },
      { icon: <FaSnowflake />, name: "Air Conditioning" },
      { icon: <FaCoffee />, name: "Coffee Maker" },
      { icon: <FaWineGlassAlt />, name: "Mini Bar" },
    ],
  },
  {
    id: 3,
    name: "Executive Suite",
    description: "Luxurious suite with a king-size bed and separate living area.",
    price: 259,
    size: "50",
    maxOccupancy: 2,
    image: "/src/assets/images/executive1.jpeg",
    amenities: [
      { icon: <FaWifi />, name: "Free WiFi" },
      { icon: <FaTv />, name: "Smart TV" },
      { icon: <FaSnowflake />, name: "Air Conditioning" },
      { icon: <FaCoffee />, name: "Coffee Maker" },
      { icon: <FaWineGlassAlt />, name: "Mini Bar" },
      { icon: <FaUmbrellaBeach />, name: "Ocean View" },
    ],
  },
];

const Rooms = () => {
  const { data: roomsData, isLoading, isError, refetch } = useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      const res = await roomsAPI.getAllRooms();
      return res.data;
    },
  });

  const getImageForRoom = (roomName) => {
    const name = (roomName || "").toLowerCase();
    if (name.includes("single")) return "/src/assets/images/single1.jpeg";
    if (name.includes("standard")) return "/src/assets/images/standard1.jpeg";
    return "/src/assets/images/executive1.jpeg";
  };

  const iconForAmenity = (amenity) => {
    const a = (amenity || "").toLowerCase();
    if (a.includes("wifi")) return <FaWifi />;
    if (a.includes("tv")) return <FaTv />;
    if (a.includes("air")) return <FaSnowflake />;
    if (a.includes("coffee")) return <FaCoffee />;
    if (a.includes("mini") || a.includes("bar")) return <FaWineGlassAlt />;
    if (a.includes("ocean") || a.includes("view") || a.includes("beach")) return <FaUmbrellaBeach />;
    return <FaBed />;
  };

  const viewRooms = useMemo(() => {
    const list = Array.isArray(roomsData) && roomsData.length ? roomsData : rooms;
    return list.map((r) => {
      const amenities = Array.isArray(r.amenities)
        ? r.amenities.map((a) => (typeof a === "string" ? { icon: iconForAmenity(a), name: a } : a))
        : [];

      return {
        ...r,
        image: r.image || getImageForRoom(r.name),
        amenities,
        maxOccupancy: r.maxOccupancy ?? r.max_occupancy,
      };
    });
  }, [roomsData]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-br from-blue-700 to-indigo-900 flex items-center justify-center text-center">
        <div className="px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Our Rooms & Suites
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Experience unparalleled comfort and luxury in our meticulously
            designed accommodations
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white shadow-lg mx-4 md:mx-8 lg:mx-16 rounded-lg p-6 mb-16 -mt-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Check-in
            </label>
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Check-out
            </label>
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Guests
            </label>
            <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>1 Guest</option>
              <option>2 Guests</option>
              <option>3 Guests</option>
              <option>4+ Guests</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300 flex items-center justify-center">
              <FaSearch className="mr-2" />
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {isLoading && (
          <div className="text-center py-10 text-gray-600">Loading rooms...</div>
        )}

        {isError && (
          <div className="text-center py-10 text-gray-600">
            Failed to load rooms.
            <button
              onClick={() => refetch()}
              className="ml-3 px-4 py-2 rounded-md bg-blue-600 text-white"
            >
              Retry
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {viewRooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="h-64 overflow-hidden">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    {room.name}
                  </h3>
                  <div className="text-blue-600 font-bold text-xl">
                    ${room.price}
                    <span className="text-sm font-normal text-gray-500">
                      {" "}
                      /night
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{room.description}</p>

                <div className="flex items-center text-gray-500 text-sm mb-4 space-x-4">
                  <span className="flex items-center">
                    <FaBed className="mr-1" /> {room.maxOccupancy}{" "}
                    {room.maxOccupancy > 1 ? "Guests" : "Guest"}
                  </span>
                  <span className="flex items-center">
                    <FaRuler className="mr-1" /> {room.size} m²
                  </span>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Room Amenities
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {(room.amenities || []).slice(0, 6).map((amenity, index) => (
                      <div
                        key={index}
                        className="flex items-center text-sm text-gray-600"
                      >
                        <span className="text-blue-500 mr-2">
                          {amenity.icon}
                        </span>
                        {amenity.name}
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  to={`/rooms/${room.id}`}
                  className="mt-6 block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready for an Unforgettable Stay?
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Book your perfect room today and experience luxury like never before
            at Northern Capital Hotel.
          </p>
          <Link
            to={viewRooms?.[0]?.id ? `/booking/${viewRooms[0].id}` : '/book-now'}
            className="inline-block bg-white text-blue-700 font-semibold py-3 px-8 rounded-full transition duration-300 transform hover:-translate-y-1 shadow-md"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Rooms;
