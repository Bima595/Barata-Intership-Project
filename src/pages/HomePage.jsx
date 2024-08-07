import { useState } from 'react';
import HeroSection from '../components/HeroSection';
import DeviceDetails from '../components/DeviceSearch';

const data = [
  {
    deviceName: 'Asus Vivobook A1400AE',
    details: {
      CPU: 'Intel i7',
      Memori: '16GB',
      Layar: '14"',
      RAM: '16GB / DDR4 / 3200Mhz',
      Windows: '10',
      Warna: 'Black',
      SerialNumber: '1234567890',
      Condition: 'Product Sudah Rusak'
    }
  },
  // Add more data here
];

const HomePage = () => {
  const [filteredDevice, setFilteredDevice] = useState(null);

  const handleSearch = (query) => {
    const result = data.find(item => item.deviceName.toLowerCase().includes(query.toLowerCase()));
    setFilteredDevice(result);
  };

  return (
    <div>
      <HeroSection onSearch={handleSearch} />
      {filteredDevice && <DeviceDetails device={filteredDevice} />}
    </div>
  );
};

export default HomePage;
