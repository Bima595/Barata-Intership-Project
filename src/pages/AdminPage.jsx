import { useState } from 'react';
import HeroSection from '../components/HeroSection';
import DeviceDetails from '../components/DeviceSearch';
import Navbar from '../components/Navbar';
import HistoryPinjamLaptop from '../components/HistoryPInjamLaptop';
import HistoryKerusakanLaptop from '../components/HistoryKerusakanLaptop';
import DeviceKantor from '../components/DeviceKantor';

const data = [
  {
    id_komputer: 1,
    nomor_aset: 'A12345',
    jenis: 'Laptop',
    nama: 'Asus Vivobook A1400AE',
    os: 'Windows 10',
    manufaktur: 'Asus',
    model: 'Vivobook',
    serial_number: '1234567890',
    garansi: new Date('2023-08-06'), 
    status: 'Product Sudah Rusak',
    ram: 16, 
    harddisk: 512, 
    prosesor: 'Intel i7',
    thn_pembelian: new Date('2022-01-15'),
    nilai_pembelian: '1500 USD', 
    mac: '00:1A:2B:3C:4D:5E',
    foto: '/public/LaptopBlack.png'
  },
];

const AdminPage = () => {
  const [filteredDevice, setFilteredDevice] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = (query) => {
    if (!query) {
      setError('Input wajib diisi');
      setFilteredDevice(null);
      return;
    }
    setError('');
    const result = data.find(item => item.nomor_aset.toLowerCase().includes(query.toLowerCase()));
    setFilteredDevice(result || { deviceName: 'Device not found', details: {} });
  };

  return (
    <div>
      <Navbar />
      <HeroSection onSearch={handleSearch} error={error} />
      {filteredDevice && (
        filteredDevice.deviceName === 'Device not found' ? (
          <div className="flex justify-center items-center h-screen">
            <p className="text-Black-500 text-4xl font-bold">Device not found !!!</p>
          </div>
        ) : (
          <>
            <DeviceDetails device={filteredDevice} />
            <HistoryPinjamLaptop />
            <HistoryKerusakanLaptop />
            <DeviceKantor />
          </>
        )
      )}
    </div>
  );
};

export default AdminPage;
