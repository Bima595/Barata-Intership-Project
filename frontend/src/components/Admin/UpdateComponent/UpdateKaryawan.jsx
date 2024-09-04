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
  Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const UpdateKaryawan = ({ open, handleClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    npk: '',
    nama: '',
    jabatan: '',
    unit_organisasi: '',
  });
  const [searchResult, setSearchResult] = useState(null);
  const [searchInitiated, setSearchInitiated] = useState(false);
  const [searchError, setSearchError] = useState('');

  useEffect(() => {
    if (!open) {
      setFormData({
        npk: '',
        nama: '',
        jabatan: '',
        unit_organisasi: '',
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
        const response = await fetch(`http://localhost:5000/pengguna/${searchTerm}`);
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          if (data.success) {
            setSearchResult(data.data);
            setFormData({
              npk: data.data.npk || '',
              nama: data.data.nama || '',
              jabatan: data.data.jabatan || '',
              unit_organisasi: data.data.unit_organisasi || '',
            });
            setSearchError('');
          } else {
            setSearchError('NPK tidak ditemukan.');
          }
        } else {
          setSearchError('Unexpected response format.');
        }
      } catch (error) {
        console.error('Error fetching employee data:', error);
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

  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:5000/update-pengguna/${formData.npk}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

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
      <DialogTitle>Update Employee Details</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={9}>
            <TextField
              variant="outlined"
              margin="dense"
              label="Search by NPK"
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
          <Grid container spacing={2} sx={{ marginTop: 2 }}>
            {[
              { label: 'NPK', name: 'npk', type: 'text', disabled: true },
              { label: 'Nama', name: 'nama', type: 'text' },
              { label: 'Jabatan', name: 'jabatan', type: 'text' },
              { label: 'Unit Organisasi', name: 'unit_organisasi', type: 'text' },
            ].map(({ label, name, type }) => (
              <Grid item xs={6} key={name}>
                <TextField
                  label={label}
                  fullWidth
                  margin="dense"
                  variant="outlined"
                  name={name}
                  value={formData[name]}
                  onChange={handleInputChange}
                  type={type}
                  disabled={name === 'npk'}
                />
              </Grid>
            ))}
          </Grid>
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

UpdateKaryawan.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default UpdateKaryawan;
