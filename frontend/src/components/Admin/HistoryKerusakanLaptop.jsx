import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const HistoryKerusakanLaptop = ({ nomorAset }) => {
  const [damageHistory, setDamageHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const entriesPerPage = 10;

  useEffect(() => {
    const fetchDamageHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/history/${nomorAset}/rusak`);
        if (response.data.success) {
          const history = response.data.history || [];
          setDamageHistory(history);
          setTotalPages(Math.ceil(history.length / entriesPerPage)); // Calculate total pages
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

  // Get current entries based on the current page
  const currentEntries = damageHistory.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  // Handle page change
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="mt-10 px-4 sm:px-8 md:px-16 lg:px-32">
      <h1 className="text-xl sm:text-2xl font-bold mb-6">History Kerusakan Laptop</h1>
      <div className="relative ml-8">
        {currentEntries.length > 0 ? (
          currentEntries.map((entry, index) => (
            <div key={index} className="flex items-start mb-10 relative">
              <div className="absolute left-[-1.5rem] top-2.5 text-lg font-bold text-black">
                {(currentPage - 1) * entriesPerPage + index + 1}.
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

        {/* Pagination buttons */}
        {damageHistory.length > entriesPerPage && (
          <div className="flex justify-center mt-4">
            <nav className="inline-flex shadow-sm">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded-l bg-gray-200 hover:bg-gray-300"
              >
                &lt;
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`px-3 py-1 border ${
                    currentPage === i + 1 ? 'bg-gray-300' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded-r bg-gray-200 hover:bg-gray-300"
              >
                &gt;
              </button>
            </nav>
          </div>
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
