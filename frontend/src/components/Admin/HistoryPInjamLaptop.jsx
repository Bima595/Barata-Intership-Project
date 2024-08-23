import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import VShapeArrow from './VShapeArrow';
import axios from 'axios';

const HistoryPinjamLaptop = ({ nomorAset }) => {
  const [historyData, setHistoryData] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/computers/${nomorAset}/history`);
        if (response.data.success) {
          setHistoryData(response.data.data || []);
          setErrorMessage(''); // Clear any previous error message
        } else {
          console.warn('Data history Belum ada karna belum pernah di pinjam');
          setHistoryData([]);
          setErrorMessage('Data history Belum ada karna belum pernah di pinjam');
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.warn('Data history tidak ada'); // Change the console message to be more user-friendly
          setErrorMessage('Data history tidak ada');
        } else {
          console.warn('Terjadi kesalahan saat mengambil data history'); // Change the console message to be more user-friendly
          setErrorMessage('Terjadi kesalahan saat mengambil data history');
        }
        setHistoryData([]);
      }
    };

    if (nomorAset) {
      fetchHistory();
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
      <h1 className="text-xl sm:text-2xl font-bold mb-6">History Pinjam Laptop</h1>
      <div className="relative ml-6">
        <div className="absolute top-0 bottom-0 w-1 bg-black left-0"></div>

        {errorMessage ? (
          <p className="ml-8 text-lg font-semibold text-gray-500">{errorMessage}</p>
        ) : historyData.length > 0 ? (
          historyData.map((entry, index) => (
            <div key={index} className="flex items-center mb-10 relative">
              <div className="absolute left-[-4px] top-2.5 w-3 h-3 bg-black rounded-full z-10"></div>
              <div className="ml-10 w-full">
                <h2 className="text-xl">{entry.nama_pengguna}</h2>
                <p className="text-lg font-semibold">{entry.jabatan}</p>
                <p className="text-base">
                  {`Peminjaman: ${formatDate(entry.tgl_peminjaman)} - Pengembalian: ${entry.tgl_pengembalian ? formatDate(entry.tgl_pengembalian) : 'Belum dikembalikan'}`}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="ml-8 text-lg font-semibold text-gray-500">Device belum pernah dipinjam</p>
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
