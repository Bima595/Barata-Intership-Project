import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Table, TableBody, TableCell, TableHead, TableRow, Alert, Checkbox
} from '@mui/material';

const Pengembalian = ({ open, handleClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [result, setResult] = useState(null);
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [description, setDescription] = useState(''); // State untuk menyimpan deskripsi

  const handleSearch = () => {
    fetch(`http://localhost:5000/pengembalian/${searchQuery}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setResult(data);
          setSelectedAssets([]);
          setDescription(''); // Reset deskripsi setelah pencarian baru
        } else {
          setResult(null);
          setAlertMessage(data.message);
          setAlertSeverity('error');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setAlertMessage('An error occurred while searching.');
        setAlertSeverity('error');
      });
  };

  const handleAssetSelection = (assetId) => {
    setSelectedAssets((prev) => 
      prev.includes(assetId) ? prev.filter(id => id !== assetId) : [...prev, assetId]
    );
  };

  const handleSubmit = () => {
    if (!result) {
      setAlertMessage('No asset to return.');
      setAlertSeverity('warning');
      return;
    }
  
    const selectedAssetIds = selectedAssets.length > 0 ? selectedAssets : [result.assets[0].aset_id];
    const selectedAssetsData = result.assets.filter(asset => selectedAssetIds.includes(asset.aset_id));
  
    if (selectedAssetsData.length === 0) {
      setAlertMessage('Please select at least one asset to return.');
      setAlertSeverity('warning');
      return;
    }
  
    const data = {
      nomor_aset: selectedAssetsData[0].nomor_aset,
      deskripsi: description, // Correctly include the description here
    };
  
    fetch('http://localhost:5000/return-device', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setAlertMessage('Device returned successfully!');
          setAlertSeverity('success');
        } else {
          setAlertMessage(`Failed to return device: ${data.message}`);
          setAlertSeverity('error');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setAlertMessage('An error occurred while returning the device.');
        setAlertSeverity('error');
      });
  };
  
  
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Pengembalian Aset</DialogTitle>
      <DialogContent>
        {alertMessage && (
          <Alert severity={alertSeverity} onClose={() => setAlertMessage('')}>
            {alertMessage}
          </Alert>
        )}
        
        <TextField
          autoFocus
          margin="dense"
          label="Search NPK / Nomor Aset / Serial Number"
          type="text"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button onClick={handleSearch} color="primary" fullWidth>Search</Button>
        
        {result && (
          <>
            {result.user && (
              <>
                <h3>Data Karyawan</h3>
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
                      <TableCell>{result.user.npk}</TableCell>
                      <TableCell>{result.user.nama}</TableCell>
                      <TableCell>{result.user.jabatan}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </>
            )}

            <h3>Data Device / Aset</h3>
            <Table>
              <TableHead>
                <TableRow>
                  {result.assets.length > 1 && <TableCell>Select</TableCell>}
                  <TableCell>Nomor Aset</TableCell>
                  <TableCell>Jenis</TableCell>
                  <TableCell>Device</TableCell>
                  <TableCell>Serial Number</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {result.assets.map((asset) => (
                  <TableRow key={asset.aset_id}>
                    {result.assets.length > 1 && (
                      <TableCell>
                        <Checkbox 
                          checked={selectedAssets.includes(asset.aset_id)}
                          onChange={() => handleAssetSelection(asset.aset_id)}
                        />
                      </TableCell>
                    )}
                    <TableCell>{asset.nomor_aset}</TableCell>
                    <TableCell>{asset.jenis}</TableCell>
                    <TableCell>{`${asset.nama} ${asset.model}`}</TableCell>
                    <TableCell>{asset.serial_number}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <TextField
              margin="dense"
              label="Deskripsi Kondisi Aset"
              type="text"
              fullWidth
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tambahkan Deskripsi Kondisi Pengembalian Aset (opsional)"
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary">Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default Pengembalian;
