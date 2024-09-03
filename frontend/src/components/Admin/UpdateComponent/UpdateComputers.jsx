import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  Typography,
  Card,
  CardContent,
  IconButton,
  MenuItem,
  Box,
  Alert,
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';

const UpdateComputers = ({ open, handleClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
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
  const [searchInitiated, setSearchInitiated] = useState(false);
  const [searchError, setSearchError] = useState('');

  useEffect(() => {
    if (!open) {
      setFormData({
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
      setSearchTerm('');
      setSearchResult(null);
      setSearchInitiated(false);
      setSearchError('');
    }
  }, [open]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = async () => {
    if (searchTerm) {
      try {
        const response = await fetch(
          `http://localhost:5000/computers/${searchTerm}`
        );
        const contentType = response.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          if (data.success) {
            setSearchResult(data.data);
            setFormData({
              nomor_aset: data.data.nomor_aset || '',
              jenis: data.data.jenis || '',
              nama: data.data.nama || '',
              os: data.data.os || '',
              manufaktur: data.data.manufaktur || '',
              model: data.data.model || '',
              serial_number: data.data.serial_number || '',
              garansi: data.data.garansi
                ? new Date(data.data.garansi).toISOString().split('T')[0]
                : '',
              status: data.data.status || '',
              ram: data.data.ram || '',
              harddisk: data.data.harddisk || '',
              prosesor: data.data.prosesor || '',
              thn_pembelian: data.data.thn_pembelian
                ? new Date(data.data.thn_pembelian).toISOString().split('T')[0]
                : '',
              nilai_pembelian: data.data.nilai_pembelian || '',
              mac: data.data.mac || '',
              foto: data.data.foto ? data.data.foto.split(',') : [], // URL dari backend
              deskripsi: data.data.deskripsi || '',
            });

            setStatusOptions([
              { value: 'Aktif', label: 'Aktif' },
              { value: 'Tidak Aktif', label: 'Tidak Aktif' },
              { value: 'Perbaikan', label: 'Perbaikan' },
              { value: 'Hilang', label: 'Hilang' },
              { value: 'Tidak Terpakai', label: 'Tidak Terpakai' },
            ]);
            setSearchError('');
          } else {
            setSearchError('Nomor aset tidak ditemukan.');
          }
        } else {
          setSearchError('Unexpected response format.');
        }
      } catch (error) {
        console.error('Error fetching computer data:', error);
        setSearchError('Terjadi kesalahan saat mencari data.');
      } finally {
        setSearchInitiated(true);
      }
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setFormData((prevData) => ({
      ...prevData,
      foto: [...prevData.foto, ...files],
    }));
  };

  const handleImageRemove = async (index) => {
    const fileToRemove = formData.foto[index];

    if (typeof fileToRemove === 'string') {
      try {
        const response = await fetch(
          `http://localhost:5000/komputer/${formData.nomor_aset}/foto`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fileName: fileToRemove }),
          }
        );

        if (!response.ok) {
          throw new Error('Gagal menghapus foto dari server');
        }

        setFormData((prevData) => {
          const newFotos = [...prevData.foto];
          newFotos.splice(index, 1);
          return { ...prevData, foto: newFotos };
        });
      } catch (error) {
        console.error('Error menghapus gambar:', error);
      }
    } else {
      setFormData((prevData) => {
        const newFotos = [...prevData.foto];
        newFotos.splice(index, 1);
        return { ...prevData, foto: newFotos };
      });
    }
  };

  const handleSubmit = async () => {
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === 'foto' && formData[key].length > 0) {
          formData[key].forEach((file) => {
            formDataToSend.append('foto', file);
          });
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await fetch(
        `http://localhost:5000/komputer/${formData.nomor_aset}`,
        {
          method: 'PUT',
          body: formDataToSend,
        }
      );

      if (response.headers.get('Content-Type')?.includes('application/json')) {
        const result = await response.json();
        console.log('Submit result:', result);
        handleClose();
      } else {
        console.error('Unexpected response format');
      }
    } catch (error) {
      console.error('Error submitting form data:', error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Update Device Details</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={9}>
            <TextField
              variant="outlined"
              margin="dense"
              label="Search by Asset Number"
              fullWidth
              value={searchTerm}
              onChange={handleSearchChange}
              autoFocus
            />
          </Grid>
          <Grid item xs={3}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SearchIcon />}
              fullWidth
              onClick={handleSearch}
            >
              Search
            </Button>
          </Grid>
        </Grid>
        {searchInitiated && searchError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {searchError}
          </Alert>
        )}
        {searchInitiated && searchResult && (
          <>
            <Grid container spacing={2} sx={{ marginTop: 2 }}>
              {[
                {
                  label: 'Nomor Aset',
                  name: 'nomor_aset',
                  type: 'text',
                  disabled: true,
                },
                { label: 'Jenis', name: 'jenis', type: 'text' },
                { label: 'Nama', name: 'nama', type: 'text' },
                { label: 'Operating System (OS)', name: 'os', type: 'text' },
                { label: 'Manufaktur', name: 'manufaktur', type: 'text' },
                { label: 'Model', name: 'model', type: 'text' },
                {
                  label: 'Serial Number (SN)',
                  name: 'serial_number',
                  type: 'text',
                },
                { label: 'Masa Garansi', name: 'garansi', type: 'date' },
                {
                  label: 'Status Perangkat',
                  name: 'status',
                  type: 'select',
                  options: statusOptions,
                },
                { label: 'Ram (GB)', name: 'ram', type: 'number' },
                { label: 'Harddisk (GB)', name: 'harddisk', type: 'number' },
                { label: 'Prosesor', name: 'prosesor', type: 'text' },
                {
                  label: 'Tahun Pembelian',
                  name: 'thn_pembelian',
                  type: 'date',
                },
                {
                  label: 'Nilai Pembelian (Rp)',
                  name: 'nilai_pembelian',
                  type: 'text',
                },
                { label: 'MAC Address', name: 'mac', type: 'text' },
                { label: 'Deskripsi', name: 'deskripsi', type: 'textarea' },
              ].map(({ label, name, type, options }) => (
                <Grid item xs={6} key={name}>
                  {type === 'select' ? (
                    <TextField
                      select
                      label={label}
                      fullWidth
                      margin="dense"
                      variant="outlined"
                      name={name}
                      value={formData[name]}
                      onChange={handleInputChange}
                    >
                      {options.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  ) : (
                    <TextField
                      label={label}
                      fullWidth
                      margin="dense"
                      variant="outlined"
                      name={name}
                      value={formData[name]}
                      onChange={handleInputChange}
                      type={type}
                      multiline={type === 'textarea'}
                      rows={type === 'textarea' ? 4 : 1}
                      disabled={name === 'nomor_aset'}
                    />
                  )}
                </Grid>
              ))}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Upload Photos
                </Typography>
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<PhotoCamera />}
                >
                  Upload File
                  <input
                    type="file"
                    hidden
                    multiple
                    onChange={handleFileChange}
                  />
                </Button>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', marginTop: 2 }}>
                  {formData.foto.map((image, index) => (
                    <Card
                      key={index}
                      sx={{ maxWidth: 150, marginRight: 1, marginBottom: 1 }}
                    >
                      <CardContent sx={{ position: 'relative', padding: 0 }}>
                        <img
                          src={
                            typeof image === 'string'
                              ? `http://localhost:5000/uploads/${image}`
                              : URL.createObjectURL(image)
                          }
                          alt={`Preview ${index}`}
                          style={{ width: '100%', height: 'auto' }}
                        />
                        <IconButton
                          sx={{ position: 'absolute', top: 0, right: 0 }}
                          onClick={() => handleImageRemove(index)}
                        >
                          <CancelIcon />
                        </IconButton>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

UpdateComputers.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default UpdateComputers;
