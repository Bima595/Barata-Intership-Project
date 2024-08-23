import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Box, Typography } from '@mui/material';
import Carousel from 'react-material-ui-carousel';

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
      <Box display="flex" alignItems="center" justifyContent="center" width="100%">
        <Box position="relative" width="400px" height="400px">
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
                  height="100%"
                  overflow="hidden"
                  padding="10px"
                >
                  <img
                    src={`http://localhost:5000/uploads/${fileName}`}
                    alt={`Device ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
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
        </Box>

        <Box ml={5}>
          <Typography variant="h6" component="div" gutterBottom>
            {nama}
          </Typography>
          <Box mt={3}>
            {[
              { label: 'Nomor Aset', value: nomor_aset },
              { label: 'Jenis', value: jenis },
              { label: 'OS', value: os },
              { label: 'Manufaktur', value: manufaktur },
              { label: 'Model', value: model },
              { label: 'Serial Number', value: serial_number },
              { label: 'Garansi', value: new Date(garansi).toDateString() },
              { label: 'Status', value: status },
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
              <Box mb={3} key={label}>
                <Typography variant="body1">
                  <strong>{label}:</strong> {value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {borrower ? (
        borrower.tgl_pengembalian ? (
          <Box mt={5}>
            <Typography variant="h6" component="div" gutterBottom>
              Device sedang tidak digunakan
            </Typography>
          </Box>
        ) : (
          <Box mt={5}>
            <Typography variant="h6" component="div" gutterBottom>
              Pemakai Saat Ini
            </Typography>
            <Typography variant="h4" component="div">
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
