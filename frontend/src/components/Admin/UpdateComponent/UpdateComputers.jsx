import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button,
  MenuItem, Card, CardContent, IconButton, Grid
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import CancelIcon from '@mui/icons-material/Cancel';

const UpdateComputers = ({ open, handleClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    nomor_aset: '',
    jenis: '',
    nama: '',
    os: '',
    manufaktur: '',
    model: '',
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
  });

  const [statusOptions, setStatusOptions] = useState([]);
  const [searchResult, setSearchResult] = useState(null);
  
  const fetchData = async (query) => {
    try {
      const response = await fetch(`http://localhost:5000/computers/${query}`);
      const contentType = response.headers.get("content-type");
      
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        setSearchResult(data.data);
        setFormData({
          nomor_aset: data.data.nomor_aset || '',
          jenis: data.data.jenis || '',
          nama: data.data.nama || '',
          os: data.data.os || '',
          manufaktur: data.data.manufaktur || '',
          model: data.data.model || '',
          serial_number: data.data.serial_number || '',
          garansi: data.data.garansi || '',
          status: data.data.status || '',
          ram: data.data.ram || '',
          harddisk: data.data.harddisk || '',
          prosesor: data.data.prosesor || '',
          thn_pembelian: data.data.thn_pembelian || '',
          nilai_pembelian: data.data.nilai_pembelian || '',
          mac: data.data.mac || '',
          foto: data.data.foto ? [data.data.foto] : [],
          deskripsi: data.data.deskripsi || '',
        });
        setStatusOptions([
          { value: 'Aktif', label: 'Aktif' },
          { value: 'Tidak Aktif', label: 'Tidak Aktif' },
          { value: 'Perbaikan', label: 'Perbaikan' },
          { value: 'Hilang', label: 'Hilang' },
          { value: 'Tidak Terpakai', label: 'Tidak Terpakai' },
        ]);
      } else {
        console.error("Expected JSON, but received:", contentType);
        const errorText = await response.text();
        console.error("Response body:", errorText);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const handleSearch = () => {
    fetchData(searchQuery);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    
    // Ensure we only handle date inputs for specific fields
    if (name === 'thn_pembelian' || name === 'garansi') {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };
  

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files).map(file => URL.createObjectURL(file));
    setFormData((prevData) => ({ ...prevData, foto: [...prevData.foto, ...files] }));
  };

  const handleImageRemove = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      foto: prevData.foto.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    try {
      // Create a FormData object to handle the file upload
      const formDataToSend = new FormData();
      formDataToSend.append('nomor_aset', formData.nomor_aset);
      formDataToSend.append('jenis', formData.jenis);
      formDataToSend.append('nama', formData.nama);
      formDataToSend.append('os', formData.os);
      formDataToSend.append('manufaktur', formData.manufaktur);
      formDataToSend.append('model', formData.model);
      formDataToSend.append('serial_number', formData.serial_number);
      formDataToSend.append('garansi', formData.garansi);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('ram', formData.ram);
      formDataToSend.append('harddisk', formData.harddisk);
      formDataToSend.append('prosesor', formData.prosesor);
      formDataToSend.append('thn_pembelian', formData.thn_pembelian);
      formDataToSend.append('nilai_pembelian', formData.nilai_pembelian);
      formDataToSend.append('mac', formData.mac);
      formDataToSend.append('deskripsi', formData.deskripsi);

      // Append the file if available
      if (formData.foto.length > 0) {
        // Assuming you want to upload only the first image for simplicity
        const file = formData.foto[0];
        const fileBlob = await fetch(file).then(res => res.blob());
        formDataToSend.append('foto', fileBlob, 'foto.jpg');
      }

      const response = await fetch(`http://localhost:5000/komputer/${formData.nomor_aset}`, {
        method: 'PUT',
        body: formDataToSend,
      });

      const result = await response.json();
      if (result.success) {
        alert('Update successful!');
        handleClose();
      } else {
        alert(`Update failed: ${result.message}`);
      }
    } catch (error) {
      console.error('Failed to update data:', error);
      alert('Update failed. Please try again.');
    }
  };
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Search and Update Device Details</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Search by asset number"
          type="text"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button onClick={handleSearch} color="primary" fullWidth>Search</Button>

        {searchResult && (
          <>
            <TextField
              margin="dense"
              label="Nomor Aset"
              type="text"
              name="nomor_aset"
              fullWidth
              value={formData.nomor_aset}
              onChange={handleInputChange}
              disabled
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
              label="OS"
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
              label="Serial Number"
              type="text"
              name="serial_number"
              fullWidth
              value={formData.serial_number}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              label="Garansi"
              type="date"
              name="garansi"
              fullWidth
              InputLabelProps={{ shrink: true }} // Ensure the label is always visible
              value={formData.garansi ? formData.garansi.split('T')[0] : ''}
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
              label="RAM"
              type="text"
              name="ram"
              fullWidth
              value={formData.ram}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              label="Harddisk"
              type="text"
              name="harddisk"
              fullWidth
              value={formData.harddisk}
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
              label="Tahun Pembelian"
              type="date"
              name="thn_pembelian"
              fullWidth
              InputLabelProps={{ shrink: true }} // Ensure the label is always visible
              value={formData.thn_pembelian ? formData.thn_pembelian.split('T')[0] : ''}
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
              label="MAC Address"
              type="text"
              name="mac"
              fullWidth
              value={formData.mac}
              onChange={handleInputChange}
            />
            <input
              accept="image/*"
              type="file"
              id="foto-upload"
              multiple
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <label htmlFor="foto-upload">
              <Button variant="contained" color="primary" component="span" startIcon={<PhotoCamera />}>
                Upload
              </Button>
            </label>
            <Grid container spacing={2} mt={2}>
              {formData.foto.map((file, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <Card>
                    <CardContent>
                      <img src={file} alt={`foto-${index}`} style={{ width: '100%', height: 'auto' }} />
                      <IconButton onClick={() => handleImageRemove(index)}>
                        <CancelIcon />
                      </IconButton>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <TextField
              margin="dense"
              label="Deskripsi"
              type="text"
              name="deskripsi"
              fullWidth
              value={formData.deskripsi}
              onChange={handleInputChange}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        {searchResult && <Button onClick={handleSubmit} color="primary">Submit</Button>}
      </DialogActions>
    </Dialog>
  );
};

export default UpdateComputers;
