import { useState, useEffect } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import axios from 'axios';

const HistoryKerusakanLaptop = ({ nomorAset }) => {
  const [damageHistory, setDamageHistory] = useState([]);

  useEffect(() => {
    const fetchDamageHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/history/${nomorAset}/rusak`);
        if (response.data.success) {
          setDamageHistory(response.data.history || []);
        } else {
          console.warn('Data history kerusakan tidak tersedia');
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.warn('Laptop belum pernah melakukan ganti sparepart ataupun rusak');
        } else {
          console.warn('Terjadi kesalahan saat mengambil data history kerusakan');
        }
        setDamageHistory([]);
      }
    };

    if (nomorAset) {
      fetchDamageHistory();
    }
  }, [nomorAset]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="mt-6 px-4 sm:px-8 md:px-16 lg:px-32">
      <h1 className="text-xl sm:text-2xl font-bold mb-6">History Kerusakan Laptop</h1>
      <div className="relative ml-8">
        {damageHistory.length > 0 ? (
          damageHistory.map((entry, index) => (
            <div key={index} className="flex items-start mb-10 relative">
              <div className="absolute left-[-1.5rem] top-2.5 text-lg font-bold text-black">
                {index + 1}.
              </div>
              <div className="ml-8 w-full">
                <h2 className="text-lg sm:text-xl font-semibold">{formatDate(entry.waktu)}</h2>
                <p className="text-sm">{entry.deskripsi}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="ml-8 text-lg font-semibold text-gray-500">
            Laptop belum pernah melakukan ganti sparepart ataupun rusak
          </p>
        )}
      </div>
    </div>
  );
};

// Define PropTypes for the component
HistoryKerusakanLaptop.propTypes = {
  nomorAset: PropTypes.string.isRequired,
};

export default HistoryKerusakanLaptop;
