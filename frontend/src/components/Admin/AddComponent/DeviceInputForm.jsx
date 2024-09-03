import { useState } from 'react';
import axios from 'axios';
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
  Box,
  Typography,
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import CancelIcon from '@mui/icons-material/Cancel';
import PropTypes from 'prop-types';

const statusOptions = [
  { value: 'Aktif', label: 'Aktif' },
  { value: 'Tidak Aktif', label: 'Tidak Aktif' },
  { value: 'Perbaikan', label: 'Perbaikan' },
  { value: 'Hilang', label: 'Hilang' },
  { value: 'Tidak Terpakai', label: 'Tidak Terpakai' },
];

const DeviceInputForm = ({ open, onClose }) => {
  const initialFormData = {
    nomor_aset: '',
    jenis: '',
    nama: '',
    os: '',
    manufaktur: '',
    serial_number: '',
    garansi: '',
    status: '',
    ram: '',
    harddisk: '',
    prosesor: '',
    thn_pembelian: '',
    nilai_pembelian: '',
    mac: '',
    foto: [],
    deskripsi: '',
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prevFormData) => ({
      ...prevFormData,
      foto: [...prevFormData.foto, ...files],
    }));
  };

  const handleImageRemove = (index) => {
    setFormData({
      ...formData,
      foto: formData.foto.filter((_, i) => i !== index),
    });
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const handleClose = () => {
    resetForm();  // Reset form data when the dialog is closed
    onClose();
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
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('There was an error submitting the form!', error);
      alert('Submission failed. Please try again.');
    } finally {
      handleClose(); // Close and reset form after submission
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Input Device Details</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {[
            { label: 'Nomor Aset', name: 'nomor_aset', type: 'text' },
            { label: 'Jenis', name: 'jenis', type: 'text' },
            { label: 'Nama', name: 'nama', type: 'text' },
            { label: 'Operating System (OS)', name: 'os', type: 'text' },
            { label: 'Manufaktur', name: 'manufaktur', type: 'text' },
            { label: 'Model', name: 'model', type: 'text' },
            { label: 'Serial Number (SN)', name: 'serial_number', type: 'text' },
            { label: 'Masa Garansi', name: 'garansi', type: 'date' },
            { label: 'Status Perangkat', name: 'status', type: 'select', options: statusOptions },
            { label: 'Ram (GB)', name: 'ram', type: 'number' },
            { label: 'Harddisk (GB)', name: 'harddisk', type: 'number' },
            { label: 'Prosesor (Gen)', name: 'prosesor', type: 'text' },
            { label: 'Tahun Pembelian', name: 'thn_pembelian', type: 'date' },
            { label: 'Nilai Pembelian', name: 'nilai_pembelian', type: 'text' },
            { label: 'Mac', name: 'mac', type: 'text' },
          ].map((field, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Typography variant="subtitle1">{field.label}</Typography>
              <TextField
                variant="outlined"
                margin="dense"
                type={field.type}
                name={field.name}
                fullWidth
                value={formData[field.name]}
                onChange={handleInputChange}
                select={field.type === 'select'}
              >
                {field.type === 'select' && field.options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Typography variant="subtitle1">Foto</Typography>
            <Card variant="outlined" sx={{ textAlign: 'center', marginTop: 2 }}>
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
                  <Grid container spacing={2} justifyContent="center" sx={{ marginTop: 2 }}>
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
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Deskripsi</Typography>
            <TextField
              variant="outlined"
              margin="dense"
              type="text"
              name="deskripsi"
              fullWidth
              multiline
              rows={4}
              value={formData.deskripsi}
              onChange={handleInputChange}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

DeviceInputForm.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
  };

export default DeviceInputForm;
