import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Table, TableBody, TableCell, TableHead, TableRow, Alert,
} from '@mui/material';

const DeleteComputers = ({ open, handleClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [result, setResult] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage('');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setAlertMessage('Please enter a valid Nomor Aset.');
      setAlertSeverity('warning');
      return;
    }

    fetch(`http://localhost:5000/computers/${searchQuery}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('Search result:', data); // Debug log
        if (data.success) {
          setResult(data.data); // Ensure `data.data` has the desired format
        } else {
          setResult(null);
          setAlertMessage(data.message);
          setAlertSeverity('error');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setAlertMessage('Terjadi kesalahan saat mencari.');
        setAlertSeverity('error');
      });
  };

  const handleSubmit = () => {
    if (!result || !result.nomor_aset) {
      setAlertMessage('Tidak ada komputer yang ditemukan.');
      setAlertSeverity('warning');
      return;
    }

    fetch(`http://localhost:5000/delete-computers/${result.nomor_aset}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setAlertMessage('Komputer berhasil dihapus!');
          setAlertSeverity('success');
          setSearchQuery('');
          setResult(null);
        } else {
          setAlertMessage(`Gagal menghapus komputer: ${data.message}`);
          setAlertSeverity('error');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setAlertMessage('Terjadi kesalahan saat menghapus komputer.');
        setAlertSeverity('error');
      });
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Hapus Komputer</DialogTitle>
      <DialogContent>
        {alertMessage && (
          <Alert severity={alertSeverity} onClose={() => setAlertMessage('')}>
            {alertMessage}
          </Alert>
        )}

        <TextField
          autoFocus
          margin="dense"
          label="Search by Nomor Aset"
          type="text"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button onClick={handleSearch} color="primary" fullWidth>
          Search
        </Button>

        {result && (
          <>
            <h3>Data Komputer</h3>
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
                  <TableCell>{result.nomor_aset}</TableCell>
                  <TableCell>{result.jenis || 'N/A'}</TableCell>
                  <TableCell>{`${result.nama || 'N/A'} ${result.model || 'N/A'}`}</TableCell>
                  <TableCell>{result.serial_number || 'N/A'}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteComputers;
