import { useParams, Link } from 'react-router-dom';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  FaArrowLeft, FaBed, FaRuler, FaWifi, FaTv, 
  FaSnowflake, FaCoffee, FaWineGlassAlt, FaUmbrellaBeach 
} from 'react-icons/fa';
import { useEffect, useState } from 'react';

import Single1 from '../assets/images/single1.jpeg';
import Single2 from '../assets/images/single2.jpeg';
import Single3 from '../assets/images/single3.jpeg';
import Standard1 from '../assets/images/standard1.jpeg';
import Standard2 from '../assets/images/standard2.jpeg';
import Executive1 from '../assets/images/executive1.jpeg';
import Executive2 from '../assets/images/executive2.jpeg';

import { roomsAPI } from '../services/api.js';

// Mock data - replace with API call in real app
const roomData = {
  1: {
    id: 1,
    name: 'Single Suite',
    description: 'Cozy and comfortable room with a single bed, perfect for solo travelers.',
    price: 129,
    size: '25',
    maxOccupancy: 1,
    images: [
      Single1,
      Single2,
      Single3
    ],
    amenities: [
      { icon: <FaWifi />, name: 'Free WiFi' },
      { icon: <FaTv />, name: 'Smart TV' },
      { icon: <FaSnowflake />, name: 'Air Conditioning' },
      { icon: <FaCoffee />, name: 'Coffee Maker' },
    ],
  },
  2: {
    id: 2,
    name: 'Standard Suite',
    description: 'Spacious room with a queen-size bed, ideal for couples or business travelers.',
    price: 189,
    size: '35',
    maxOccupancy: 2,
    images: [
      Standard1,
      Standard2
    ],
    amenities: [
      { icon: <FaWifi />, name: 'Free WiFi' },
      { icon: <FaTv />, name: 'Smart TV' },
      { icon: <FaSnowflake />, name: 'Air Conditioning' },
      { icon: <FaCoffee />, name: 'Coffee Maker' },
      { icon: <FaWineGlassAlt />, name: 'Mini Bar' },
    ],
  },
  3: {
    id: 3,
    name: 'Executive Suite',
    description: 'Luxurious suite with a king-size bed and separate living area.',
    price: 259,
    size: '50',
    maxOccupancy: 2,
    images: [
      Executive1,
      Executive2
    ],
    amenities: [
      { icon: <FaWifi />, name: 'Free WiFi' },
      { icon: <FaTv />, name: 'Smart TV' },
      { icon: <FaSnowflake />, name: 'Air Conditioning' },
      { icon: <FaCoffee />, name: 'Coffee Maker' },
      { icon: <FaWineGlassAlt />, name: 'Mini Bar' },
      { icon: <FaUmbrellaBeach />, name: 'Ocean View' },
    ],
  },
};

export default function RoomDetail() {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: roomFromApi, isLoading, isError, refetch } = useQuery({
    queryKey: ['room', id],
    enabled: !!id,
    queryFn: async () => {
      const res = await roomsAPI.getRoomById(id);
      return res.data;
    },
  });

  const room = roomFromApi || roomData[id];

  const iconForAmenity = (amenity) => {
    const a = (amenity || '').toLowerCase();
    if (a.includes('wifi')) return <FaWifi />;
    if (a.includes('tv')) return <FaTv />;
    if (a.includes('air')) return <FaSnowflake />;
    if (a.includes('coffee')) return <FaCoffee />;
    if (a.includes('mini') || a.includes('bar')) return <FaWineGlassAlt />;
    if (a.includes('ocean') || a.includes('view') || a.includes('beach')) return <FaUmbrellaBeach />;
    return <FaBed />;
  };

  const imagesForRoom = (roomName) => {
    const name = (roomName || '').toLowerCase();
    if (name.includes('single')) {
      return [Single1, Single2, Single3];
    }
    if (name.includes('standard')) {
      return [Standard1, Standard2];
    }
    return [Executive1, Executive2];
  };

  const roomImages = useMemo(() => {
    if (!room) return [];
    if (Array.isArray(room.images) && room.images.length) return room.images;
    return imagesForRoom(room.name);
  }, [room]);

  const roomAmenities = useMemo(() => {
    if (!room) return [];
    if (!Array.isArray(room.amenities)) return [];
    return room.amenities.map((a) => (typeof a === 'string' ? { icon: iconForAmenity(a), name: a } : a));
  }, [room]);

  useEffect(() => {
    setCurrentImageIndex(0);
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-700">Loading room...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to load room</h2>
          <button
            onClick={() => refetch()}
            className="px-6 py-2 rounded-full bg-primary-600 text-white font-semibold hover:bg-primary-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Room Not Found</h2>
          <p className="text-gray-600 mb-6">The room you're looking for doesn't exist or has been removed.</p>
          <Link 
            to="/rooms" 
            className="px-6 py-2 rounded-full bg-primary-600 text-white font-semibold hover:bg-primary-700 transition"
          >
            View All Rooms
          </Link>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === roomImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? roomImages.length - 1 : prev - 1
    );
  };

  return (
    <div className="bg-white">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <Link 
          to="/rooms" 
          className="inline-flex items-center text-gray-700 hover:text-primary-600 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Back to Rooms
        </Link>
      </div>

      {/* Main Layout */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12">
          
          {/* LEFT COLUMN - Room Details */}
          <div className="space-y-10">
            {/* Header */}
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-3">{room.name}</h1>
              <div className="flex items-center text-gray-600 space-x-6 mb-6">
                <span className="flex items-center text-lg">
                  <FaBed className="mr-2 text-primary-600" />
                  {room.maxOccupancy} {room.maxOccupancy > 1 ? 'Guests' : 'Guest'}
                </span>
                <span className="flex items-center text-lg">
                  <FaRuler className="mr-2 text-primary-600" />
                  {room.size} m²
                </span>
              </div>
              <div className="inline-block bg-primary-50 text-primary-700 px-5 py-2 rounded-lg text-2xl font-bold">
                ${room.price} <span className="text-base font-medium text-gray-500">/ night</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-lg leading-relaxed text-gray-700">{room.description}</p>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Room Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                {room.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-3 bg-gray-50 rounded-lg px-3 py-2">
                    <span className="text-primary-600 text-xl">{amenity.icon}</span>
                    <span className="text-gray-700">{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-primary-50 rounded-xl p-6 shadow-sm">
              <div className="md:flex items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to book your stay?</h3>
                  <p className="text-gray-600">Experience luxury and comfort at Northern Capital Hotel</p>
                </div>
                <Link
                  to={`/booking/${room.id}`}
                  className="inline-block px-8 py-3 rounded-full bg-primary-600 text-white font-semibold hover:bg-primary-700 transition shadow-lg"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative h-80 md:h-[450px] bg-gray-100 rounded-xl overflow-hidden">
              <img
                src={roomImages[currentImageIndex]}
                alt={room.name}
                className="w-full h-full object-cover"
              />
              {roomImages.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition"
                  >
                    ‹
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {roomImages.length > 1 && (
              <div className="grid grid-cols-3 gap-3">
                {roomImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-24 rounded-lg overflow-hidden border-2 ${
                      currentImageIndex === index ? 'border-primary-600' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
