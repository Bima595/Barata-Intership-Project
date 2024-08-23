import { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Button,
  Card,
  CardContent,
  IconButton,
  Grid,
  Box
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';

const statusOptions = [
  { value: 'Aktif', label: 'Aktif' },
  { value: 'Tidak Aktif', label: 'Tidak Aktif' },
  { value: 'Perbaikan', label: 'Perbaikan' },
  { value: 'Hilang', label: 'Hilang' },
  { value: 'Tidak Terpakai', label: 'Tidak Terpakai' },
];

const AddComputer = ({ open, onClose }) => {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({
      ...formData,
      foto: [...formData.foto, ...files],
    });
  };

  const handleImageRemove = (index) => {
    setFormData({
      ...formData,
      foto: formData.foto.filter((_, i) => i !== index),
    });
  };

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
        onClose(); // Close dialog after success
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('There was an error submitting the form!', error);
      alert('Submission failed. Please try again.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Input Device Details</DialogTitle>
      <DialogContent>
        {/* Form fields */}
        <TextField
          margin="dense"
          label="Nomor Aset"
          type="text"
          name="nomor_aset"
          fullWidth
          value={formData.nomor_aset}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          label="Jenis"
          type="text"
          name="jenis"
          fullWidth
          value={formData.jenis}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          label="Nama"
          type="text"
          name="nama"
          fullWidth
          value={formData.nama}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          label="Operating System (OS)"
          type="text"
          name="os"
          fullWidth
          value={formData.os}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          label="Manufaktur"
          type="text"
          name="manufaktur"
          fullWidth
          value={formData.manufaktur}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          label="Model"
          type="text"
          name="model"
          fullWidth
          value={formData.model}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          label="Serial Number (SN)"
          type="text"
          name="serial_number"
          fullWidth
          value={formData.serial_number}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          label="Masa Garansi"
          type="date"
          name="garansi"
          fullWidth
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
        <TextField
          margin="dense"
          label="Ram (GB)"
          type="number"
          name="ram"
          fullWidth
          value={formData.ram}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          label="Harddisk (GB)"
          type="number"
          name="harddisk"
          fullWidth
          value={formData.harddisk}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          label="Prosesor (Gen)"
          type="text"
          name="prosesor"
          fullWidth
          value={formData.prosesor}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          label="Tahun Pembelian"
          type="date"
          name="thn_pembelian"
          fullWidth
          value={formData.thn_pembelian}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          label="Nilai Pembelian"
          type="text"
          name="nilai_pembelian"
          fullWidth
          value={formData.nilai_pembelian}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          label="MAC"
          type="text"
          name="mac"
          fullWidth
          value={formData.mac}
          onChange={handleInputChange}
        />
        <Card variant="outlined" sx={{ textAlign: 'center', marginTop: '16px' }}>
          <CardContent>
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
                {formData.foto.map((file, index) => (
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
                      src={URL.createObjectURL(file)}
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
        <TextField
          margin="dense"
          label="Deskripsi"
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
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddComputer;
