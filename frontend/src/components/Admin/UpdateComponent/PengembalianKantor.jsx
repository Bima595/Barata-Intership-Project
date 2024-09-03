import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Table, TableBody, TableCell, TableHead, TableRow, Alert, Checkbox, IconButton,
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import CancelIcon from '@mui/icons-material/Cancel';
import PropTypes from 'prop-types';

const PengembalianKantor = ({ open, handleClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [result, setResult] = useState(null);
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState([]); 

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage('');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  const handleSearch = () => {
    fetch(`http://localhost:5000/pengembalian/${searchQuery}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setResult(data);
          setSelectedAssets([]);
          setDescription('');
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

  const handleAssetSelection = (assetId) => {
    setSelectedAssets((prev) =>
      prev.includes(assetId) ? prev.filter((id) => id !== assetId) : [...prev, assetId]
    );
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(files);
  };

  const handleImageRemove = (index) => {
    setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!result) {
      setAlertMessage('Tidak ada aset yang ditemukan.');
      setAlertSeverity('warning');
      return;
    }

    const selectedAssetIds = selectedAssets.length > 0 ? selectedAssets : [result.assets[0].aset_id];
    const selectedAssetsData = result.assets.filter((asset) => selectedAssetIds.includes(asset.aset_id));

    if (selectedAssetsData.length === 0) {
      setAlertMessage('Tolong pilih 1 aset yang ingin dikembalikan.');
      setAlertSeverity('warning');
      return;
    }

    const formData = new FormData();
    formData.append('nomor_aset', selectedAssetsData[0].nomor_aset);
    formData.append('deskripsi', description);

    photos.forEach((photo) => {
      formData.append('foto', photo);
    });

    fetch('http://localhost:5000/return-device', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setAlertMessage('Mengembalikan Aset Sukses!');
          setAlertSeverity('success');
          setSearchQuery('');
          setResult(null);
          setSelectedAssets([]);
          setDescription('');
          setPhotos([]);
        } else {
          setAlertMessage(`Gagal mengembalikan aset: ${data.message}`);
          setAlertSeverity('error');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setAlertMessage('Terjadi kesalahan saat mengembalikan perangkat.');
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
        <Button onClick={handleSearch} color="primary" fullWidth>
          Search
        </Button>

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

            {/* Photo Upload Section */}
            <div>
              <Button
                variant="contained"
                component="label"
                startIcon={<PhotoCamera />}
                fullWidth
                style={{ marginTop: '15px' }}
              >
                Upload Photos
                <input type="file" hidden multiple onChange={handleFileChange} />
              </Button>
              <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '15px' }}>
                {photos.map((photo, index) => (
                  <div key={index} style={{ position: 'relative', marginRight: '10px' }}>
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Preview ${index}`}
                      style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    />
                    <IconButton
                      onClick={() => handleImageRemove(index)}
                      size="small"
                      style={{ position: 'absolute', top: 0, right: 0 }}
                    >
                      <CancelIcon color="error" />
                    </IconButton>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

PengembalianKantor.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default PengembalianKantor;
