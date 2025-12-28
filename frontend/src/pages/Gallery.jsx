import { useState } from 'react';
import {
  FaSearch,
  FaArrowLeft,
  FaArrowRight,
  FaTimes,
} from 'react-icons/fa';

import HeroImage from '../assets/images/hero.png';
import Single1 from '../assets/images/single1.jpeg';
import Single2 from '../assets/images/single2.jpeg';
import Standard1 from '../assets/images/standard1.jpeg';
import Standard2 from '../assets/images/standard2.jpeg';
import Executive1 from '../assets/images/executive1.jpeg';
import Executive2 from '../assets/images/executive2.jpeg';
import DroneImage2 from '../assets/images/ChatGPT Image Oct 2, 2025, 01_32_32 PM.png';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const galleryImages = [
    { id: 1, src: Single1, category: 'rooms', alt: 'Single Suite' },
    { id: 2, src: Single2, category: 'rooms', alt: 'Single Suite' },
    { id: 3, src: Standard1, category: 'rooms', alt: 'Standard Suite' },
    { id: 4, src: Standard2, category: 'rooms', alt: 'Standard Suite' },
    { id: 5, src: Executive1, category: 'rooms', alt: 'Executive Suite' },
    { id: 6, src: Executive2, category: 'rooms', alt: 'Executive Suite' },
    { id: 7, src: HeroImage, category: 'view', alt: 'Hotel View' },
    { id: 8, src: DroneImage2, category: 'lobby', alt: 'Hotel Lobby' },
  ];

  const categories = ['all', 'rooms', 'dining', 'pool', 'spa', 'events', 'lobby', 'bar', 'view'];
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredImages =
    activeCategory === 'all'
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeCategory);

  const openModal = (index) => {
    setSelectedImage(filteredImages[index].src);
    setCurrentIndex(index);
  };

  const closeModal = () => setSelectedImage(null);

  const navigate = (direction) => {
    let newIndex;
    if (direction === 'prev') {
      newIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    } else {
      newIndex = (currentIndex + 1) % filteredImages.length;
    }
    setCurrentIndex(newIndex);
    setSelectedImage(filteredImages[newIndex].src);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400">
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Photo Gallery
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Explore our hotel through stunning visuals
            </p>
          </div>
        </div>
      </div>

      {/* Gallery Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
                activeCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
              onClick={() => openModal(index)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-300">
                <div className="bg-white bg-opacity-80 rounded-full p-3 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  <FaSearch className="h-5 w-5 text-gray-800" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <FaTimes className="h-8 w-8" />
          </button>

          <button
            onClick={() => navigate('prev')}
            className="absolute left-4 text-white hover:text-gray-300 z-10"
          >
            <FaArrowLeft className="h-8 w-8" />
          </button>

          <img
            src={selectedImage}
            alt="Enlarged view"
            className="max-h-[80vh] max-w-full object-contain"
          />

          <button
            onClick={() => navigate('next')}
            className="absolute right-4 text-white hover:text-gray-300 z-10"
          >
            <FaArrowRight className="h-8 w-8" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Gallery;
