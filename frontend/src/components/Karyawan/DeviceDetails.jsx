import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import Carousel from 'react-material-ui-carousel';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';

const DeviceDetails = ({ device }) => {
  const [borrower, setBorrower] = useState(null);
  const {
    nomor_aset,
    jenis,
    nama,
    os,
    manufaktur,
    model,
    serial_number,
    garansi,
    status,
    ram,
    harddisk,
    prosesor,
    thn_pembelian,
    nilai_pembelian,
    mac,
    foto,
  } = device;

  useEffect(() => {
    const fetchBorrowerData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/computers/${nomor_aset}/borrowers`
        );
        const result = response.data;

        if (result.success) {
          setBorrower(result.data);
        } else {
          setBorrower(null);
        }
      } catch (error) {
        console.warn('Data sedang tidak dipinjam:', error);
        setBorrower(null);
      }
    };

    if (nomor_aset) {
      fetchBorrowerData();
    }
  }, [nomor_aset]);

  const fotoArray = foto ? foto.split(',') : [];

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mb={5} p={3}>
      <Card sx={{ width: '100%', mb: 5, bgcolor: '#F5F7F8' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            {fotoArray.length > 0 ? (
              <Carousel
                indicators={true}
                autoPlay={false}
                navButtonsAlwaysVisible={true}
                animation="slide"
              >
                {fotoArray.map((fileName, index) => (
                  <Box
                    key={index}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    width="100%"
                    padding="10px"
                    position="relative"
                    overflow="hidden"
                    style={{
                      paddingTop: '75%',
                      marginTop: '20px', // Adds gap at the top
                      marginLeft: '20px',
                    }}
                  >
                    <img
                      src={`http://localhost:5000/uploads/${fileName}`}
                      alt={`Device ${index + 1}`}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        borderRadius: '10px',
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                  </Box>
                ))}
              </Carousel>
            ) : (
              <Typography variant="body1">No images available</Typography>
            )}
          </Grid>

          <Grid item xs={12} md={8}>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                padding="8px 16px"
                borderRadius="50px"
                boxShadow="0px 2px 10px rgba(0, 0, 0, 0.1)"
                bgcolor="white"
                border="1px solid rgba(0, 0, 0, 0.1)"
                mb={3} // margin-bottom untuk memberi ruang ke bawah
                width="fit-content" // Lebar otomatis sesuai dengan konten
              >
                <LaptopMacIcon style={{ marginRight: '8px', color: '#000' }} />
                <Typography
                  variant="body1"
                  style={{ fontWeight: 'bold', color: '#000' }}
                >
                  {nama}
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  {[
                    { label: 'Nomor Aset', value: nomor_aset },
                    { label: 'Jenis', value: jenis },
                    { label: 'OS', value: os },
                    { label: 'Manufaktur', value: manufaktur },
                    { label: 'Model', value: model },
                    { label: 'Serial Number', value: serial_number },
                    {
                      label: 'Garansi',
                      value: new Date(garansi).toDateString(),
                    },
                    { label: 'Status', value: status },
                  ].map(({ label, value }) => (
                    <Box mb={2} key={label}>
                      <Typography variant="body1">
                        <strong>{label}:</strong> {value}
                      </Typography>
                    </Box>
                  ))}
                </Grid>

                <Grid item xs={6}>
                  {[
                    { label: 'RAM', value: `${ram} GB` },
                    { label: 'Harddisk', value: `${harddisk} GB` },
                    { label: 'Prosesor', value: prosesor },
                    {
                      label: 'Tahun Pembelian',
                      value: new Date(thn_pembelian).toDateString(),
                    },
                    { label: 'Nilai Pembelian', value: nilai_pembelian },
                    { label: 'MAC', value: mac },
                  ].map(({ label, value }) => (
                    <Box mb={2} key={label}>
                      <Typography variant="body1">
                        <strong>{label}:</strong> {value}
                      </Typography>
                    </Box>
                  ))}
                </Grid>
              </Grid>
            </CardContent>
          </Grid>
        </Grid>
      </Card>

      {borrower ? (
        borrower.tgl_pengembalian ? (
          <Box mt={5}>
            <Typography variant="h6" component="div" gutterBottom>
              Device sedang tidak digunakan
            </Typography>
          </Box>
        ) : (
          <Box
            mt={5}
            display="flex"
            flexDirection="column"
            alignItems="center"
            textAlign="center"
            p={3}
            borderRadius={2}
            bgcolor="#f0f0f0"
            boxShadow={3}
          >
            <Typography variant="h6" component="div" gutterBottom>
              Pemakai Saat Ini
            </Typography>
            <Typography variant="h4" component="div" fontWeight="bold">
              {borrower.nama_pengguna}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Divisi: {borrower.divisi}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {new Date(borrower.tgl_peminjaman).toLocaleDateString('id-ID')} -{' '}
              {borrower.tgl_pengembalian
                ? new Date(borrower.tgl_pengembalian).toLocaleDateString(
                    'id-ID'
                  )
                : 'Sekarang'}
            </Typography>
          </Box>
        )
      ) : (
        <Box mt={5}>
          <Typography variant="h6" component="div" gutterBottom>
            Tidak ada pemakai saat ini
          </Typography>
        </Box>
      )}
    </Box>
  );
};

DeviceDetails.propTypes = {
  device: PropTypes.object.isRequired,
};

export default DeviceDetails;
