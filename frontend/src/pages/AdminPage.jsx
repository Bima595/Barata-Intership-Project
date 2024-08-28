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
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeviceInputForm from '../components/Admin/AddComponent/DeviceInputForm';
import EmployeeInputForm from '../components/Admin/AddKaryawan/AddKaryawan';

const AdminPage = () => {
  const [filteredDevice, setFilteredDevice] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [openDeviceForm, setOpenDeviceForm] = useState(false);
  const [openEmployeeForm, setOpenEmployeeForm] = useState(false);

  const handleSearch = async (query) => {
    if (!query) {
      setError('Input wajib diisi');
      setFilteredDevice(null);
      return;
    }
    setError('');
    setLoading(true);

    try {
      const response = await axios.get(`http://localhost:5000/computers/${query}`);
      const result = response.data;

      if (result.success && result.data) {
        setFilteredDevice(result.data);
      } else {
        setFilteredDevice({ deviceName: 'Device not found', details: {} });
      }
    } catch (error) {
      console.error('There was an error fetching the data!', error);
      setFilteredDevice({ deviceName: 'Device not found', details: {} });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDeviceForm = () => {
    setOpenDeviceForm(true);
  };

  const handleCloseDeviceForm = () => {
    setOpenDeviceForm(false);
  };

  const handleOpenEmployeeForm = () => {
    setOpenEmployeeForm(true);
  };

  const handleCloseEmployeeForm = () => {
    setOpenEmployeeForm(false);
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
            <HistoryPinjamLaptop nomorAset={filteredDevice.nomor_aset} />
            <HistoryKerusakanLaptop nomorAset={filteredDevice.nomor_aset} />
          </>
        ))
      )}
      <UpdateData />
      <DeviceKantor />
      <AsetKantor />
      <SpeedDial
        ariaLabel="Add Options"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        <SpeedDialAction
          icon={<FileCopyIcon />}
          tooltipTitle="Add Device"
          onClick={handleOpenDeviceForm}
        />
        <SpeedDialAction
          icon={<PersonAddIcon />}
          tooltipTitle="Add Karyawan"
          onClick={handleOpenEmployeeForm}
        />
      </SpeedDial>
      <DeviceInputForm open={openDeviceForm} onClose={handleCloseDeviceForm} />
      <EmployeeInputForm open={openEmployeeForm} onClose={handleCloseEmployeeForm} />
    </div>
  );
};

export default AdminPage;
