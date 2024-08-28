import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Alert,
} from '@mui/material';

const Pinjam = ({ open, handleClose }) => {
  const [searchQuery1, setSearchQuery1] = useState('');
  const [searchQuery2, setSearchQuery2] = useState('');
  const [result1, setResult1] = useState(null);
  const [result2, setResult2] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage('');
      }, 5000);

      // Cleanup the timer when the component is unmounted or when alertMessage changes
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  const handleSearch1 = () => {
    fetch(`http://localhost:5000/pengguna/${searchQuery1}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setResult1(data.data);
        } else {
          setResult1(null);
          setAlertMessage(data.message);
          setAlertSeverity('warning');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setAlertMessage('An error occurred while fetching the data.');
        setAlertSeverity('error');
      });
  };

  const handleSearch2 = () => {
    fetch(`http://localhost:5000/computers/${searchQuery2}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setResult2(data.data);
        } else {
          setResult2(null);
          setAlertMessage(data.message);
          setAlertSeverity('warning');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setAlertMessage('Terjadi kesalahan saat mengambil data.');
        setAlertSeverity('error');
      });
  };

  const handleSubmit = () => {
    if (!result1 || !result2) {
      setAlertMessage('Silakan cari dan pilih Karyawan dan Aset sebelum submit.');
      setAlertSeverity('warning');
      return;
    }

    const data = {
      npk: result1.npk,
      nomor_aset: result2.nomor_aset,
    };

    fetch('http://localhost:5000/borrow-device', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setAlertMessage('Perangkat Berhasil Dipinjam!');
          setAlertSeverity('success');
          // Reset form after successful submission
          resetForm();
        } else {
          setAlertMessage(`Gagal meminjam perangkat: ${data.message}`);
          setAlertSeverity('error');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setAlertMessage('Terjadi kesalahan saat meminjam perangkat.');
        setAlertSeverity('error');
      });
  };

  const resetForm = () => {
    setSearchQuery1('');
    setSearchQuery2('');
    setResult1(null);
    setResult2(null);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Pinjam Aset</DialogTitle>
      <DialogContent>
        {alertMessage && (
          <Alert severity={alertSeverity} onClose={() => setAlertMessage('')}>
            {alertMessage}
          </Alert>
        )}

        {/* Search Section 1: Karyawan */}
        <TextField
          autoFocus
          margin="dense"
          label="Search NPK Karyawan"
          type="text"
          fullWidth
          value={searchQuery1}
          onChange={(e) => setSearchQuery1(e.target.value)}
        />
        <Button onClick={handleSearch1} color="primary" fullWidth>
          Search
        </Button>

        {result1 && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>NPK</TableCell>
                <TableCell>Nama</TableCell>
                <TableCell>Jabatan</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{result1.npk}</TableCell>
                <TableCell>{result1.nama}</TableCell>
                <TableCell>{result1.jabatan}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}

        <Divider variant="middle" style={{ margin: '20px 0', height: '3px', backgroundColor: '#000' }} />

        {/* Search Section 2: Komputer */}
        <TextField
          margin="dense"
          label="Search Aset / Serial Number"
          type="text"
          fullWidth
          value={searchQuery2}
          onChange={(e) => setSearchQuery2(e.target.value)}
        />
        <Button onClick={handleSearch2} color="primary" fullWidth>
          Search
        </Button>

        {result2 && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nomor Aset</TableCell>
                <TableCell>Jenis</TableCell>
                <TableCell>Device</TableCell>
                <TableCell>Serial Number</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{result2.nomor_aset}</TableCell>
                <TableCell>{result2.jenis}</TableCell>
                <TableCell>{`${result2.nama} ${result2.model}`}</TableCell>
                <TableCell>{result2.serial_number}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit || location.reload} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Pinjam;
