import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import PropTypes from 'prop-types';

const EmployeeInputForm = ({ open, onClose }) => {
  const [npk, setNpk] = useState('');
  const [nama, setNama] = useState('');
  const [jabatan, setJabatan] = useState('');
  const [unitOrganisasi, setUnitOrganisasi] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!npk || !nama || !jabatan || !unitOrganisasi) {
      setError('Semua input wajib diisi');
      return;
    }

    try {
      const token = localStorage.getItem('jwtToken');

      const response = await axios.post(
        'http://localhost:5000/add-user',
        {
          nama,
          npk,
          peran: 'Karyawan',
          jabatan,
          unit_organisasi: unitOrganisasi,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 2000);
      } else {
        setError(response.data.message || 'Terjadi kesalahan, coba lagi');
      }
    } catch (error) {
      console.error('Error adding employee:', error);
      setError('Terjadi kesalahan, coba lagi');
    }
  };

  const handleSnackbarClose = () => {
    setSuccess(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Tambah Karyawan</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="NPK"
            type="text"
            fullWidth
            value={npk}
            onChange={(e) => setNpk(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Nama"
            type="text"
            fullWidth
            value={nama}
            onChange={(e) => setNama(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Jabatan"
            type="text"
            fullWidth
            value={jabatan}
            onChange={(e) => setJabatan(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Unit Organisasi"
            type="text"
            fullWidth
            value={unitOrganisasi}
            onChange={(e) => setUnitOrganisasi(e.target.value)}
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={success}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Karyawan berhasil ditambahkan!
        </Alert>
      </Snackbar>
    </>
  );
};

EmployeeInputForm.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    showSuccessAnimation: PropTypes.func,
  };

export default EmployeeInputForm;
