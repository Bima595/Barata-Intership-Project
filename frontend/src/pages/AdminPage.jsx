import { useState } from 'react';
import axios from 'axios';
import HeroSection from '../components/HeroSection';
// import DeviceDetails from '../components/Admin/DeviceSearch';
import DeviceDetails from '../components/Karyawan/DeviceDetails';
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

const statusOptions = [
  { value: 'aktif', label: 'Aktif' },
  { value: 'tidak aktif', label: 'Tidak Aktif' },
  { value: 'hilang', label: 'Hilang' },
  { value: 'rusak', label: 'Rusak' },
];

const AdminPage = () => {
  const [filteredDevice, setFilteredDevice] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({

    nomor_aset: '',
    jenis: '',
    nama: '',
    os: '',
    manufaktur: '',
    serial_number: '',
    garansi: '',
    status: '',
    ram:'',
    harddisk: '',
    prosesor: '',
    thn_pembelian: '',
    nilai_pembelian: '',
    mac: '',
    foto: [],
    deskripsi: '',
  });

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
      console.error("There was an error fetching the data!", error);
      setFilteredDevice({ deviceName: 'Device not found', details: {} });
    } finally {
      setLoading(false);
    }
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

  // const handleSubmit = () => {
  //   console.log('Form Data:', formData);
  //   handleClose();
  // };

  // const handleSubmit = async () => {
  //   const data = new FormData();
    
  //   data.append('nomor_aset', formData.nomor_aset); 
  //   data.append('jenis', formData.jenis);
  //   data.append('nama', formData.nama);
  //   data.append('os', formData.os);
  //   data.append('manufaktur', formData.manufaktur);
  //   data.append('model', formData.model); 
  //   data.append('serial_number', formData.serial_number);
  //   data.append('garansi', formData.garansi);
  //   data.append('status', formData.status);
  //   data.append('ram', formData.ram);
  //   data.append('harddisk', formData.harddisk);
  //   data.append('prosesor', formData.prosesor);
  //   data.append('thn_pembelian', formData.thn_pembelian); 
  //   data.append('nilai_pembelian', formData.nilai_pembelian); 
  //   data.append('mac', formData.mac); 
  //   data.append('foto', formData.foto);
  //   data.append('deskripsi', formData.deskripsi); 
    
  //   formData.foto.forEach((file) => {
  //     data.append('foto', file);
  //   });
  
  //   try {
  //     const response = await axios.post('http://localhost:5000/komputer', data, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });
  //     if (response.data.success) {
  //       alert('Computer added successfully');
  //     } else {
  //       alert(response.data.message);
  //     }
  //   } catch (error) {
  //     console.error('There was an error submitting the form!', error);
  //   } finally {
  //     handleClose();
  //   }
  // };

  const handleSubmit = async () => {
    const data = new FormData();
    
    for (const key in formData) {
      if (key === 'foto') {
        formData.foto.forEach((file) => {
          data.append('foto', file);
        });
      } else {
        data.append(key, formData[key]);
      }
    }
  
    try {
      const response = await axios.post('http://localhost:5000/komputer', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.success) {
        alert('Computer added successfully');
        // You might want to reset the form or perform other UI updates here
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('There was an error submitting the form!', error);
      alert('Submission failed. Please try again.');
    } finally {
      handleClose();
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
          <>
            <DeviceDetails device={filteredDevice} />
            <HistoryPinjamLaptop />
            <HistoryKerusakanLaptop />
          </>
        ))
      )}
      <DeviceKantor />
      <AsetKantor />

      {/* Input Device Admin */}
      <SpeedDial
        ariaLabel="SpeedDial example"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
        onClick={handleOpen}
      />

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Input Device Details</DialogTitle>
        <DialogContent>
          <h3>Nomor Aset</h3>
          <TextField
            margin="dense"
            label="nomor aset"
            type="text"
            name="nomor_aset"
            fullWidth
            value={formData.nomor_aset}
            onChange={handleInputChange}
          />
          <h3>Jenis</h3>
          <TextField
            margin="dense"
            label="jenis"
            type="text"
            name="jenis"
            fullWidth
            value={formData.jenis}
            onChange={handleInputChange}
          />
          <h3>nama</h3>
          <TextField
            margin="dense"
            label="nama"
            type="text"
            name="nama"
            fullWidth
            value={formData.nama}
            onChange={handleInputChange}
          />
          <h3>Operating system (OS)</h3>
          <TextField
            margin="dense"
            label="os"
            type="text"
            name="os"
            fullWidth
            value={formData.os}
            onChange={handleInputChange}
          />
          <h3>Manufaktur</h3>
          <TextField
            margin="dense"
            label="manufaktur"
            type="text"
            name="manufaktur"
            fullWidth
            value={formData.manufaktur}
            onChange={handleInputChange}
          />
          <h3>Model</h3>
          <TextField
            margin="dense"
            label="model"
            type="text"
            name="model"
            fullWidth
            value={formData.model}
            onChange={handleInputChange}
          />
          <h3>Serial Number (SN)</h3>
          <TextField
            margin="dense"
            label="serial number"
            type="text"
            name="serial_number"
            fullWidth
            value={formData.serial_number}
            onChange={handleInputChange}
          />
          <h3>Masa Garansi</h3>
          <TextField
            margin="dense"
            label=""
            type="date"
            name="garansi"
            fullWidth
            value={formData.garansi}
            onChange={handleInputChange}
          />
          <h3>Status Perangkat</h3>
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
          <h3>Ram (GB)</h3>
          <TextField
            margin="dense"
            label="ram"
            type="number"
            name="ram"
            fullWidth
            value={formData.ram}
            onChange={handleInputChange}
          />
          <h3>Harddisk (GB)</h3>
          <TextField
            margin="dense"
            label="harddisk"
            type="number"
            name="harddisk"
            fullWidth
            value={formData.harddisk}
            onChange={handleInputChange}
          />
          <h3>Prosesor (Gen)</h3>
          <TextField
            margin="dense"
            label="prosessor"
            type="text"
            name="prosessor"
            fullWidth
            value={formData.prosessor}
            onChange={handleInputChange}
          />
          <h3>Tahun Pembelian</h3>
          <TextField
            margin="dense"
            label=""
            type="date"
            name="thn_pembelian"
            fullWidth
            value={formData.thn_pembelian}
            onChange={handleInputChange}
          />
          <h3>Nilai Pembelian</h3>
          <TextField
            margin="dense"
            label="nilai pembelian"
            type="text"
            name="nilai_pembelian"
            fullWidth
            value={formData.nilai_pembelian}
            onChange={handleInputChange}
          />
          <h3>Mac</h3>
          <TextField
            margin="dense"
            label="mac"
            type="text"
            name="mac"
            fullWidth
            value={formData.mac}
            onChange={handleInputChange}
          />
          <h3>Foto</h3>
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
          <h3>Deskripsi</h3>
          <TextField
            margin="dense"
            label="deskripsi"
            type="text"
            name="deskripsi"
            fullWidth
            multiline
            rows={5}
            value={formData.deskripsi}
            onChange={handleInputChange}
          />
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
