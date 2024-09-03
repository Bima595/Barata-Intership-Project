import React, { useState, useEffect } from 'react';
import moment from 'moment';
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
  Checkbox,
  IconButton,
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import CancelIcon from '@mui/icons-material/Cancel';

const SerahTerimaAset = ({ open, handleClose }) => {
  const [searchQuery1, setSearchQuery1] = useState('');
  const [searchQuery2, setSearchQuery2] = useState('');
  const [result1, setResult1] = useState(null);
  const [result2, setResult2] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState([]);
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  useEffect(() => {
    if (result1 && result1.assets.length === 1) {
      setSelectedAsset(result1.assets[0].aset_id);
    }
  }, [result1]);

  const handleSearch1 = () => {
    if (searchQuery1 === searchQuery2) {
      setAlertMessage('NPK tidak boleh sama');
      setAlertSeverity('warning');
      return;
    }

    fetch(`http://localhost:5000/pengguna/pinjam/${searchQuery1}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          if (data.assets && data.assets.length > 0) {
            setResult1(data);
            setSelectedAsset(null);
          } else {
            setResult1(null);
            setAlertMessage('NPK ini tidak sedang meminjam aset');
            setAlertSeverity('warning');
          }
        } else {
          setResult1(null);
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

  const handleSearch2 = () => {
    if (searchQuery1 === searchQuery2) {
      setAlertMessage('NPK tidak boleh sama');
      setAlertSeverity('warning');
      return;
    }

    fetch(`http://localhost:5000/pengguna/pinjam/${searchQuery2}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          if (data.user.aset) {
            setAlertMessage('Pengguna ini sedang meminjam aset.');
            setAlertSeverity('warning');
            setResult2(null);
          } else {
            setResult2(data);
          }
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

  const handleAssetSelection = (asetId) => {
    setSelectedAsset(asetId);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(files);
  };

  const handleImageRemove = (index) => {
    setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!result1 || !result2 || !selectedAsset) {
      setAlertMessage('Silakan cari dan pilih Karyawan dan Aset sebelum submit.');
      setAlertSeverity('warning');
      return;
    }

    const selectedAssetData = result1.assets.find((asset) => asset.aset_id === selectedAsset);

    const formData = new FormData();
    formData.append('npk1', result1.user.npk);
    formData.append('npk2', result2.user.npk);
    formData.append('nomor_aset', selectedAssetData.nomor_aset);
    formData.append('deskripsi', description);

    photos.forEach((photo) => {
      formData.append('foto', photo);
    });

    fetch('http://localhost:5000/transfer-device', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          setAlertMessage('Aset berhasil dipindahkan!');
          setAlertSeverity('success');
          handleSave(result1.user.npk, result2.user.npk, selectedAssetData.nomor_aset); // Simpan
          setDownloadDialogOpen(true);
          resetForm();
        } else {
          setAlertMessage(`Gagal memindahkan aset: ${data.message}`);
          setAlertSeverity('error');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setAlertMessage('Terjadi kesalahan saat memindahkan aset.');
        setAlertSeverity('error');
      });
  };

  const handleSave = async (npk1, npk2, nomor_aset) => {
    try {
      const response1 = await fetch(`http://localhost:5000/pengguna/${npk1}`);
      const result1 = await response1.json();
      if (!result1.success) {
        throw new Error('Karyawan 1 tidak ditemukan');
      }

      const response2 = await fetch(`http://localhost:5000/pengguna/${npk2}`);
      const result2 = await response2.json();
      if (!result2.success) {
        throw new Error('Karyawan 2 tidak ditemukan');
      }

      const response3 = await fetch(`http://localhost:5000/computers/${nomor_aset}`);
      const result3 = await response3.json();
      if (!result3.success) {
        throw new Error('Aset tidak ditemukan');
      }

      const requestData = {
        namaKaryawan1: result1.data.nama || '',
        npk1: result1.data.npk || '',
        jabatan1: result1.data.jabatan || '',
        unitOrganisasi1: result1.data.unit_organisasi || '',
        namaKaryawan2: result2.data.nama || '',
        npk2: result2.data.npk || '',
        jabatan2: result2.data.jabatan || '',
        unitOrganisasi2: result2.data.unit_organisasi || '',
        namaLaptop: result3.data.nama || '',
        model: result3.data.model || '',
        serialNumber: result3.data.serial_number || '',
        os: result3.data.os || '',
        prosesor: result3.data.prosesor || '',
        ram: result3.data.ram || '',
        harddisk: result3.data.harddisk || '',
        thnPembelian: moment(result3.data.thn_pembelian).format('DD MMMM YYYY') || '',
        deskripsi: result3.data.deskripsi || ''
      };

      await handleFillWordTemplate(requestData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setAlertMessage('Terjadi kesalahan saat mengambil data.');
      setAlertSeverity('error');
    }
  };

  const handleFillWordTemplate = async (data) => {
    try {
      const response = await fetch('http://localhost:5000/word-template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Gagal mengisi template Word');
      }

      const result = await response.json();
      setAlertMessage('Surat Keterangan Berhasil Dibuat.');
      setAlertSeverity('success');
    } catch (error) {
      console.error('Error saving Word file:', error);
      setAlertMessage('Gagal membuat Surat Keterangan.');
      setAlertSeverity('error');
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch('http://localhost:5000/download');
      
      if (!response.ok) {
        throw new Error('Failed to download file.');
      }

      const disposition = response.headers.get('Content-Disposition');
      const fileNameMatch = disposition && disposition.match(/filename="(.+)"/);
      const fileName = fileNameMatch ? fileNameMatch[1] : 'downloaded_file.docx';

      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;

      link.setAttribute('download', fileName);
      
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      if (typeof handleClose === 'function') {
        handleClose();
      }

      setAlertMessage('Surat Keterangan berhasil diunduh.');
      setAlertSeverity('success');
      setDownloadDialogOpen(false); // Tutup dialog setelah unduh
    } catch (error) {
      console.error('Error downloading Word file:', error);
      setAlertMessage('Gagal mengunduh Surat Keterangan.');
      setAlertSeverity('error');
    }
  };

  const handleDeleteFile = async () => {
    try {
      const response = await fetch('http://localhost:5000/delete', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete file.');
      }

      setAlertMessage('File telah dihapus.');
      setAlertSeverity('success');
    } catch (error) {
      console.error('Error deleting file:', error);
      setAlertMessage('Gagal menghapus file.');
      setAlertSeverity('error');
    }
  };

  const handleCloseDialog = () => {
    handleDeleteFile(); // Hapus file saat menutup dialog
    setDownloadDialogOpen(false);
  };

  const resetForm = () => {
    setSearchQuery1('');
    setSearchQuery2('');
    setResult1(null);
    setResult2(null);
    setSelectedAsset(null);
    setDescription('');
    setPhotos([]);
  };

  return (
    <>
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Serah Terima Aset</DialogTitle>
      <Divider />
      <DialogContent>
        {alertMessage && (
            <Alert severity={alertSeverity} onClose={() => setAlertMessage('')}>
              {alertMessage}
            </Alert>
          )}
          <TextField
          autoFocus
          margin="dense"
          label="NPK Karyawan Aset Lama"
          type="text"
          fullWidth
          value={searchQuery1}
          onChange={(e) => setSearchQuery1(e.target.value)}
          />
          <Button onClick={handleSearch1} color="primary" fullWidth>
            Search
          </Button>

          {result1 && (
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
                    <TableCell>{result1.user.npk}</TableCell>
                    <TableCell>{result1.user.nama}</TableCell>
                    <TableCell>{result1.user.jabatan}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <h3>Data Device / Aset</h3>
            <Table>
              <TableHead>
                <TableRow>
                  {result1.assets.length > 1 && <TableCell>Select</TableCell>}
                  <TableCell>Nomor Aset</TableCell>
                  <TableCell>Jenis</TableCell>
                  <TableCell>Device</TableCell>
                  <TableCell>Serial Number</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {result1.assets.map((asset) => (
                  <TableRow key={asset.aset_id}>
                    {result1.assets.length > 1 && (
                      <TableCell>
                        <Checkbox
                          checked={selectedAsset === asset.aset_id}
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
            </>
          )}

          <Divider style={{ margin: '20px 0' }} />

          <TextField
            margin="dense"
            label="NPK Karyawan Aset Baru"
            type="text"
            fullWidth
            value={searchQuery2}
            onChange={(e) => setSearchQuery2(e.target.value)}
          />
          <Button onClick={handleSearch2} color="primary" fullWidth>
            Search
          </Button>

          {result2 && (
            <>
              <h3>Data Karyawan Baru</h3>
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
                    <TableCell>{result2.user.npk}</TableCell>
                    <TableCell>{result2.user.nama}</TableCell>
                    <TableCell>{result2.user.jabatan}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </>
          )}

          <Divider style={{ margin: '20px 0' }} />

          <TextField
            margin="dense"
            label="Deskripsi"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div>
            <label htmlFor="upload-photo">
              <input
                style={{ display: 'none' }}
                id="upload-photo"
                name="upload-photo"
                type="file"
                onChange={handleFileChange}
                multiple
              />
              <Button
                variant="contained"
                component="span"
                startIcon={<PhotoCamera />}
                style={{ margin: '8px 0' }}
              >
                Upload Photo
              </Button>
            </label>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {photos.map((photo, index) => (
              <div key={index} style={{ position: 'relative' }}>
                <img
                  src={URL.createObjectURL(photo)}
                  alt={`Preview ${index}`}
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                />
                <IconButton
                  size="small"
                  color="secondary"
                  style={{ position: 'absolute', top: 0, right: 0 }}
                  onClick={() => handleImageRemove(index)}
                >
                  <CancelIcon />
                </IconButton>
              </div>
            ))}
          </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Batal
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>

      {/* DownloadDialog Component */}
      <Dialog open={downloadDialogOpen} onClose={() => setDownloadDialogOpen(false)}>
        <DialogTitle>Download Surat Keterangan</DialogTitle>
        <h3 style={{ color: 'red', textAlign: 'center', paddingLeft: '16px', paddingRight: '16px' }}>
          Surat Keterangan ini hanya dapat di unduh 1 Kali saja, jika gagal, silahkan hubungi admin
        </h3>
        <DialogContent>
          <Alert severity="success">Surat Keterangan telah berhasil dibuat.</Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Tutup</Button>
          <Button onClick={handleDownload} color="primary" variant="contained">
            Unduh
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
    </>
  );
};

export default SerahTerimaAset;
