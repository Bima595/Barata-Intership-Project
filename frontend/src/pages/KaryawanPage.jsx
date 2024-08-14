import { useState } from 'react';
import axios from 'axios';
import HeroSection from '../components/HeroSection';
import DeviceDetails from '../components/Karyawan/DeviceDetails';
import Navbar from '../components/Navbar';

const KaryawanPage = () => {
  const [filteredDevice, setFilteredDevice] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query) => {
    if (!query) {
      setError('Input wajib diisi');
      setFilteredDevice(null);
      return;
    }
    setError('');
    setLoading(true);

    try {
      // Mengirim request ke backend untuk mencari data berdasarkan nomor aset
      const response = await axios.get(`http://localhost:5000/computers/search/${query}`);
      const result = response.data;

      if (result.success && result.data) {
        setFilteredDevice(result.data);
      } else {
        setFilteredDevice({ deviceName: 'Device not found', details: {} });
      }
    } catch (error) {
      console.error("There was an error fetching the data!", error);
      setFilteredDevice({ deviceName: 'Device not found', details: {} });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <HeroSection onSearch={handleSearch} error={error} />
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <p className="text-Black-500 text-4xl font-bold">Loading...</p>
        </div>
      ) : (
        filteredDevice &&
        (filteredDevice.deviceName === 'Device not found' ? (
          <div className="flex justify-center items-center h-screen">
            <p className="text-Black-500 text-4xl font-bold">
              Device not found !!!
            </p>
          </div>
        ) : (
          <DeviceDetails device={filteredDevice} />
        ))
      )}
    </div>
  );
};

export default KaryawanPage;
