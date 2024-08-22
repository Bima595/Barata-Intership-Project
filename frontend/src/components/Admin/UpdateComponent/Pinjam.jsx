import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Divider, Table, TableBody, TableCell, TableHead, TableRow, Alert
} from '@mui/material';

const Pinjam = ({ open, handleClose }) => {
  const [searchQuery1, setSearchQuery1] = useState('');
  const [searchQuery2, setSearchQuery2] = useState('');
  const [result1, setResult1] = useState(null);
  const [result2, setResult2] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  const handleSearch1 = () => {
    fetch(`http://localhost:5000/pengguna/${searchQuery1}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setResult1(data.data);
        } else {
          setResult1(null);
          alert(data.message);
        }
      })
      .catch((error) => console.error('Error:', error));
  };

  const handleSearch2 = () => {
    fetch(`http://localhost:5000/computers/${searchQuery2}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setResult2(data.data);
        } else {
          setResult2(null);
          alert(data.message);
        }
      })
      .catch((error) => console.error('Error:', error));
  };

  const handleSubmit = () => {
    if (!result1 || !result2) {
      setAlertMessage('Please search and select both a Karyawan and an Aset before submitting.');
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
          setAlertMessage('Device borrowed successfully!');
          setAlertSeverity('success');
        } else {
          setAlertMessage(`Failed to borrow device: ${data.message}`);
          setAlertSeverity('error');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setAlertMessage('An error occurred while borrowing the device.');
        setAlertSeverity('error');
      });
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
        <Button onClick={handleSearch1} color="primary" fullWidth>Search</Button>
        
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
        <Button onClick={handleSearch2} color="primary" fullWidth>Search</Button>
        
        {result2 && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nomor Aset</TableCell>
                <TableCell>Jenis</TableCell>
                <TableCell>Device</TableCell> {/* Merged Nama and Model into Device */}
                <TableCell>Serial Number</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{result2.nomor_aset}</TableCell>
                <TableCell>{result2.jenis}</TableCell>
                <TableCell>{`${result2.nama} ${result2.model}`}</TableCell> {/* Merged data */}
                <TableCell>{result2.serial_number}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary">Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default Pinjam;
