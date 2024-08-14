import { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Box, Typography, Button } from '@mui/material';

const DeviceDetails = ({ deviceId }) => {
  const [device, setDevice] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/computers/${deviceId}`)
      .then(response => {
        setDevice(response.data.data);
      })
      .catch(error => {
        console.error("There was an error fetching the data!", error);
      });
  }, [deviceId]);

  if (!device) {
    return <p>Loading...</p>;
  }

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
    pemakai,
  } = device;

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mb={5} p={3}>
      <Box display="flex" alignItems="center">
        <Box position="relative" display="flex" alignItems="center" mr={5}>
          <img src={foto} alt="Device" style={{ maxWidth: '400px', marginRight: '20px' }} />
        </Box>

        <Box>
          <Typography variant="h6" component="div" gutterBottom>
            {nama}
          </Typography>
          <Box mt={3}>
            {[
              { label: "Nomor Aset", value: nomor_aset },
              { label: "Jenis", value: jenis },
              { label: "OS", value: os },
              { label: "Manufaktur", value: manufaktur },
              { label: "Model", value: model },
              { label: "Serial Number", value: serial_number },
              { label: "Garansi", value: new Date(garansi).toDateString() },
              { label: "Status", value: status },
              { label: "RAM", value: `${ram} GB` },
              { label: "Harddisk", value: `${harddisk} GB` },
              { label: "Prosesor", value: prosesor },
              { label: "Tahun Pembelian", value: new Date(thn_pembelian).toDateString() },
              { label: "Nilai Pembelian", value: nilai_pembelian },
              { label: "MAC", value: mac },
            ].map(({ label, value }) => (
              <Box mb={3} key={label}>
                <Button variant="outlined" disabled style={{ borderRadius: '800px', color: 'black' }}>
                  {label}: {value}
                </Button>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      <Box mt={5} style={{ fontFamily: 'Plus Jakarta Sans' }}>
        <Typography variant="h6" component="div" gutterBottom className="font-semibold">
          Pemakai Saat Ini
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {pemakai.nama}
        </Typography>
        <Typography variant="body2" color="textSecondary" className="font-bold">
          {pemakai.nip}
        </Typography>
        <Typography variant="body2" color="textSecondary" className="font-light">
          {new Date(pemakai.tanggal_pinjam).toDateString()} - Sekarang
        </Typography>
      </Box>
    </Box>
  );
};

DeviceDetails.propTypes = {
  deviceId: PropTypes.string.isRequired,
};

export default DeviceDetails;
