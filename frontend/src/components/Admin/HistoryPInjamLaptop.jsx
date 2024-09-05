import { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import VShapeArrow from './VShapeArrow';
import axios from 'axios';

const HistoryPinjamLaptop = ({ nomorAset }) => {
  const [historyData, setHistoryData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  const observers = useRef([]);
  const itemsPerPage = 10;

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/computers/${nomorAset}/history`);
      if (response.data.success) {
        setHistoryData(response.data.data || []);
        setErrorMessage('');
      } else {
        console.warn('Data history belum ada karna belum pernah dipinjam');
        setHistoryData([]);
        setErrorMessage('Data history belum ada karna belum pernah dipinjam');
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.warn('Data history tidak ada');
        setErrorMessage('Data history tidak ada');
      } else {
        console.warn('Terjadi kesalahan saat mengambil data history');
        setErrorMessage('Terjadi kesalahan saat mengambil data history');
      }
      setHistoryData([]);
    }
  };

  useEffect(() => {
    if (nomorAset) {
      fetchHistory();
    }
  }, [nomorAset]);

  const observeEntry = useCallback((entry) => {
    if (entry) {
      const observer = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            e.target.classList.add('animate-fade-in');
            e.target.classList.remove('animate-fade-out');
          } else {
            e.target.classList.remove('animate-fade-in');
            e.target.classList.add('animate-fade-out');
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(entry);
      observers.current.push(observer);
    }
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Pagination logic
  const totalPages = Math.ceil(historyData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = historyData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="mt-10 px-4 sm:px-8 md:px-16 lg:px-32">
      <h1 className="text-xl sm:text-2xl font-bold mb-6">History Pinjam Laptop</h1>
      <div className="relative ml-6">
        <div className="absolute top-0 bottom-0 w-1 bg-black left-0"></div>

        {errorMessage ? (
          <p className="ml-8 text-lg font-semibold text-gray-500">{errorMessage}</p>
        ) : currentItems.length > 0 ? (
          currentItems.map((entry, index) => (
            <div
              key={index}
              ref={observeEntry}
              className="flex items-center mb-10 relative opacity-0 transform translate-y-8 transition-all duration-500 ease-in-out"
            >
              <div className="absolute left-[-4px] top-2.5 w-3 h-3 bg-black rounded-full z-10"></div>
              <div className="ml-10 w-full">
                <h2 className="text-xl">{entry.nama_pengguna}</h2>
                <p className="text-lg font-semibold">{entry.jabatan}</p>
                <p className="text-base">
                  Peminjaman: {formatDate(entry.tgl_peminjaman)} - Pengembalian: {entry.tgl_pengembalian ? formatDate(entry.tgl_pengembalian) : 'Belum dikembalikan'}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="ml-8 text-lg font-semibold text-gray-500">Device belum pernah dipinjam</p>
        )}

        {historyData.length > itemsPerPage && (
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
                  className={`px-3 py-1 border ${currentPage === i + 1 ? 'bg-gray-300' : 'bg-gray-200 hover:bg-gray-300'}`}
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

        {historyData.length > 0 && (
          <div className="absolute bottom-[-16px] left-[-6px]">
            <VShapeArrow size={16} color="black" />
          </div>
        )}
      </div>
    </div>
  );
};

HistoryPinjamLaptop.propTypes = {
  nomorAset: PropTypes.string.isRequired,
};

export default HistoryPinjamLaptop;
