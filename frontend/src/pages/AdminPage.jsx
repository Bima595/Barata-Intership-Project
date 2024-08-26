import { useState } from 'react';
import axios from 'axios';
import HeroSection from '../components/HeroSection';
import UpdateData from '../components/Admin/UpdateData';
import DeviceDetails from '../components/Karyawan/DeviceDetails';
import Navbar from '../components/Navbar';
import HistoryPinjamLaptop from '../components/Admin/HistoryPInjamLaptop';
import HistoryKerusakanLaptop from '../components/Admin/HistoryKerusakanLaptop';
import DeviceKantor from '../components/Admin/DeviceKantor';
import AsetKantor from '../components/Admin/AsetKantor';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import DeviceInputForm from '../components/Admin/AddComponent/DeviceInputForm';

const AdminPage = () => {
  const [filteredDevice, setFilteredDevice] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);

  const handleSearch = async (query) => {
    if (!query) {
      setError('Input wajib diisi');
      setFilteredDevice(null);
      return;
    }
    setError('');
    setLoading(true);
  
    try {
      // Mencari device
      const response = await axios.get(`http://localhost:5000/computers/${query}`);
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

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
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
          <>
            <DeviceDetails device={filteredDevice} />
            <HistoryPinjamLaptop nomorAset={filteredDevice.nomor_aset}/>
            <HistoryKerusakanLaptop nomorAset={filteredDevice.nomor_aset}/>
          </>
        ))
      )}
      <DeviceKantor />
      <UpdateData />
      <AsetKantor />
      <SpeedDial
        ariaLabel="Add Device"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        <SpeedDialAction
          icon={<FileCopyIcon />}
          tooltipTitle="Add Device"
          onClick={handleOpenForm}
        />
      </SpeedDial>
      <DeviceInputForm open={openForm} onClose={handleCloseForm} />
    </div>
  );
};

export default AdminPage;
