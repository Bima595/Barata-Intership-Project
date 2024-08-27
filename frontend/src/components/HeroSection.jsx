import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import '../styles/index.css';

const HeroSection = ({ onSearch, error }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);

  const images = [
    '/logo1.png',
    '/logo2.png',
    '/logo3.png',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsSliding(true);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
        setIsSliding(false);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  return (
    <div className="container mx-auto mt-20 flex flex-col md:flex-row items-center justify-between px-6 md:min-h-screen">
      {/* Gambar di sini */}
      <div className="flex-1 flex justify-end overflow-hidden order-1 md:order-2">
        <img
          className={`w-full h-auto max-w-lg md:max-w-xl transition-transform duration-500 ${isSliding ? 'slide-right' : ''}`}
          src={images[currentImageIndex]}
          alt="Illustration"
        />
      </div>
      
      {/* Teks di sini */}
      <div className="flex-1 mb-10 md:mb-0 order-2 md:order-1">
        <div className="max-w-xl ml-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 font-semibold animated-text" style={{ fontFamily: 'Plus Jakarta Sans', color: '#29166F' }}>OfficeTech.</h1>
          <p className="text-base md:text-lg mb-6 font-light animated-text" style={{ fontFamily: 'Plus Jakarta Sans', color: '#29166F' }}>Menghubungkan Anda dengan Semua Perangkat Kantor, Memungkinkan Pengelolaan yang Lebih Baik dan Penggunaan yang Lebih Efektif, Demi Mencapai Produktivitas Maksimal.</p>
          <div className="flex flex-col space-y-2">
            <div className="flex flex-col md:flex-row space-x-0 md:space-x-0">
              <input
                type="text"
                placeholder="Enter your Devices"
                className="flex-grow px-4 py-2 text-gray-700 border-t border-b border-l border-gray-300 rounded-t-md md:rounded-t-none md:rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                className="px-6 py-2 bg-black text-white rounded-b-md md:rounded-b-none md:rounded-r-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={handleSearch}
              >
                Get started
              </button>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

HeroSection.propTypes = {
  onSearch: PropTypes.func.isRequired,
  error: PropTypes.string,
};

export default HeroSection;