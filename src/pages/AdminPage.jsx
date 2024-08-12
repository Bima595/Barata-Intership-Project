import { useState } from 'react';
import HeroSection from '../components/HeroSection';
import DeviceDetails from '../components/Admin/DeviceSearch';
import Navbar from '../components/Navbar';
import HistoryPinjamLaptop from '../components/Admin/HistoryPInjamLaptop';
import HistoryKerusakanLaptop from '../components/Admin/HistoryKerusakanLaptop';
import DeviceKantor from '../components/Admin/DeviceKantor';
import AsetKantor from '../components/Admin/AsetKantor';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import CancelIcon from '@mui/icons-material/Cancel';

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
    foto: '/LaptopBlack.png',
  },
];

const statusOptions = [
  { value: 'aktif', label: 'Aktif' },
  { value: 'tidak aktif', label: 'Tidak Aktif' },
  { value: 'hilang', label: 'Hilang' },
  { value: 'rusak', label: 'Rusak' },
];

const AdminPage = () => {
  const [filteredDevice, setFilteredDevice] = useState(null);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    merk: '',
    prosesor: '',
    ram: '',
    storage: '',
    vga: '',
    os: '',
    serialNumber: '',
    garansi: '',
    status: '',
    foto: [],
  });

  const handleSearch = (query) => {
    if (!query) {
      setError('Input wajib diisi');
      setFilteredDevice(null);
      return;
    }
    setError('');
    const result = data.find((item) =>
      item.nomor_aset.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredDevice(result || { deviceName: 'Device not found', details: {} });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const fileURLs = files.map((file) => URL.createObjectURL(file));
    setFormData({
      ...formData,
      foto: [...formData.foto, ...fileURLs],
    });
  };

  const handleImageRemove = (index) => {
    setFormData({
      ...formData,
      foto: formData.foto.filter((_, i) => i !== index),
    });
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = () => {
    console.log('Form Data:', formData);
    handleClose();
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
          </>
        )
      )}
      <DeviceKantor />
      <AsetKantor />

      <SpeedDial
        ariaLabel="SpeedDial example"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
        onClick={handleOpen}
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Input Device Details</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Merk"
            type="text"
            name="merk"
            fullWidth
            value={formData.merk}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Prosesor"
            type="text"
            name="prosesor"
            fullWidth
            value={formData.prosesor}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="RAM"
            type="number"
            name="ram"
            fullWidth
            value={formData.ram}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Storage"
            type="number"
            name="storage"
            fullWidth
            value={formData.storage}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="VGA"
            type="text"
            name="vga"
            fullWidth
            value={formData.vga}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Sistem Operasi"
            type="text"
            name="os"
            fullWidth
            value={formData.os}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Serial Number"
            type="text"
            name="serialNumber"
            fullWidth
            value={formData.serialNumber}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Tgl Akhir Masa Garansi"
            type="date"
            name="garansi"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            value={formData.garansi}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Status Perangkat"
            name="status"
            select
            fullWidth
            value={formData.status}
            onChange={handleInputChange}
          >
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <Card variant="outlined" sx={{ textAlign: 'center', marginTop: '16px',}}>
            <CardContent >
              <input
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                id="upload-images"
                name="foto"
                onChange={handleFileChange}
              />
              <label htmlFor="upload-images">
                <IconButton component="span">
                  <PhotoCamera sx={{ fontSize: 48 }} />
                </IconButton>
              </label>
              {formData.foto.length > 0 && (
                <Grid container spacing={2} justifyContent="center" sx={{ marginTop: '16px' }}>
                  {formData.foto.map((src, index) => (
                    <Grid item xs={4} key={index} position="relative">
                      <Box
                        component="img"
                        sx={{
                          height: 100,
                          width: '100%',
                          objectFit: 'cover',
                          borderRadius: 1,
                        }}
                        alt={`Selected ${index + 1}`}
                        src={src}
                      />
                      <IconButton
                        size="small"
                        sx={{ position: 'absolute', top: 4, right: 4, backgroundColor: 'gray' }}
                        onClick={() => handleImageRemove(index)}
                      >
                        <CancelIcon />
                      </IconButton>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminPage;
