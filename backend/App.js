const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

var db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'barata2',
  port: '8000',
});

db.connect(function (err) {
  if (err) {
    console.error('Connection failed: ', err.message);
  } else {
    console.log('Connected to MySQL database!');
  }
});

app.post('/login', (req, res) => {
  const { userType, username, password, employeeId } = req.body;

  if (userType === 'Admin') {
    const query = `SELECT * FROM pengguna WHERE nama = ? AND password = ? AND peran = 'Admin'`;
    db.query(query, [username, password], (err, results) => {
      if (err) {
        return res.status(500).send('Database query error');
      }
      if (results.length > 0) {
        res.json({ success: true, role: 'Admin' });
      } else {
        res
          .status(401)
          .json({ success: false, message: 'Invalid admin credentials' });
      }
    });
  } else if (userType === 'Karyawan') {
    const query = `SELECT * FROM pengguna WHERE npk = ? AND peran = 'Karyawan'`;
    db.query(query, [employeeId], (err, results) => {
      if (err) {
        return res.status(500).send('Database query error');
      }
      if (results.length > 0) {
        res.json({ success: true, role: 'Karyawan' });
      } else {
        res
          .status(401)
          .json({ success: false, message: 'Invalid employee ID' });
      }
    });
  } else {
    res.status(400).json({ success: false, message: 'Invalid user type' });
  }
});

// Endpoint untuk mengambil semua komputer
app.get('/computers', (req, res) => {
  const query = 'SELECT * FROM tb_komputer';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send('Database query error');
    }
    res.json({ success: true, data: results });
  });
});

//Mencari komputer by nomor aset
app.get('/computers/:nomor_aset', (req, res) => {
  const nomorAset = req.params.nomor_aset;

  console.log('Received nomor_aset:', nomorAset); 

  const query = 'SELECT * FROM tb_komputer WHERE nomor_aset = ?';
  db.query(query, [nomorAset], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).send('Database query error');
    }
    console.log('Query results:', results);

    if (results.length > 0) {
      res.json({ success: true, data: results[0] });
    } else {
      res.status(404).json({ success: false, message: 'Computer not found' });
    }
  });
});


// Endpoint to create a new device loan (when the device is borrowed)
app.post('/borrow-device', (req, res) => {
  const { npk, nomor_aset } = req.body;
  const tgl_peminjaman = new Date(); // Automatically set the current date and time

  // Step 1: Validate if npk exists in pengguna table
  const checkUserQuery = 'SELECT pengguna_id FROM pengguna WHERE npk = ?';
  db.query(checkUserQuery, [npk], (err, userResults) => {
      if (err) {
          console.error('Database query error:', err);
          return res.status(500).send('Database query error');
      }

      if (userResults.length === 0) {
          return res.status(404).json({ success: false, message: 'User not found' });
      }

      const penggunaId = userResults[0].pengguna_id;

      // Step 2: Validate if nomor_aset exists and is active in tb_komputer table
      const checkAssetQuery = `
          SELECT a.aset_id, k.status 
          FROM aset a 
          JOIN tb_komputer k ON a.komputer_id = k.id_komputer 
          WHERE k.nomor_aset = ?`;
      db.query(checkAssetQuery, [nomor_aset], (err, assetResults) => {
          if (err) {
              console.error('Database query error:', err);
              return res.status(500).send('Database query error');
          }

          if (assetResults.length === 0) {
              return res.status(404).json({ success: false, message: 'Asset not found' });
          }

          const asetId = assetResults[0].aset_id;
          const status = assetResults[0].status;

          if (status !== 'Aktif') {
              return res.status(400).json({ success: false, message: 'Device is not available for borrowing' });
          }

          // Step 3: Insert a new record into peminjam table
          const insertLoanQuery = `
              INSERT INTO peminjam (aset_id, pengguna_id, tgl_peminjaman) 
              VALUES (?, ?, ?)`;
          db.query(insertLoanQuery, [asetId, penggunaId, tgl_peminjaman], (err, results) => {
              if (err) {
                  console.error('Database query error:', err);
                  return res.status(500).send('Database query error');
              }

              // Step 4: Update device status to 'Tidak Aktif'
              const updateStatusQuery = 'UPDATE tb_komputer SET status = ? WHERE nomor_aset = ?';
              db.query(updateStatusQuery, ['Tidak Aktif', nomor_aset], (err) => {
                  if (err) {
                      console.error('Failed to update device status:', err);
                      return res.status(500).send('Database query error');
                  }

                  res.json({
                      success: true,
                      message: 'Device borrowed successfully and status updated to "Tidak Aktif"',
                      data: results
                  });
              });
          });
      });
  });
});


app.post('/return-device', (req, res) => {
  const { nomor_aset } = req.body;

  // Check if the device is currently loaned out
  const checkLoanQuery = `
      SELECT p.peminjam_id, k.status
      FROM peminjam p
      JOIN aset a ON p.aset_id = a.aset_id
      JOIN tb_komputer k ON a.komputer_id = k.id_komputer
      WHERE k.nomor_aset = ? AND p.tgl_pengembalian IS NULL AND k.status = 'Tidak Aktif'
  `;

  db.query(checkLoanQuery, [nomor_aset], (err, results) => {
      if (err) {
          console.error('Database query error:', err);
          return res.status(500).send('Database query error');
      }

      if (results.length > 0) {
          // Mark the device as returned
          const updateLoanQuery = `
              UPDATE peminjam p
              JOIN aset a ON p.aset_id = a.aset_id
              JOIN tb_komputer k ON a.komputer_id = k.id_komputer
              SET p.tgl_pengembalian = NOW(), k.status = 'Aktif'
              WHERE k.nomor_aset = ? AND p.tgl_pengembalian IS NULL
          `;

          db.query(updateLoanQuery, [nomor_aset], (err, updateResults) => {
              if (err) {
                  console.error('Database query error:', err);
                  return res.status(500).send('Database query error');
              }

              res.json({
                  success: true,
                  message: `Device ${nomor_aset} returned successfully and status updated to 'Aktif'`,
                  data: updateResults,
              });
          });
      } else {
          res.status(404).json({
              success: false,
              message: `No active loan found for device ${nomor_aset}`,
          });
      }
  });
});



//cari peminjam laptop
app.get('/computers/:nomor_aset/borrowers', (req, res) => {
  const nomorAset = req.params.nomor_aset;
  console.log('Request for borrowers received for computer: ', nomorAset);

  const query = `
        SELECT p.*, g.nama as nama_pengguna
        FROM peminjam p
        JOIN pengguna g ON p.pengguna_id = g.pengguna_id
        JOIN aset a ON p.aset_id = a.aset_id
        JOIN tb_komputer k ON a.komputer_id = k.id_komputer
        WHERE k.nomor_aset = ?
    `;
  db.query(query, [nomorAset], (err, results) => {
    if (err) {
      return res.status(500).send('Database query error');
    }
    if (results.length > 0) {
      res.json({ success: true, data: results });
    } else {
      res.status(404).json({
        success: false,
        message: 'No borrowers found for this computer',
      });
    }
  });
});

//create new computer
app.post('/komputer', (req, res) => {
    console.log('Request Body:', req.body);
  
    const computerData = [
      req.body.nomor_aset,
      req.body.jenis,
      req.body.nama,
      req.body.os,
      req.body.manufaktur,
      req.body.model,
      req.body.serial_number,
      req.body.garansi,
      req.body.status,
      req.body.ram,
      req.body.harddisk,
      req.body.prosesor,
      req.body.thn_pembelian,
      req.body.nilai_pembelian,
      req.body.mac,
      req.body.foto,
      req.body.deskripsi
    ];
  
    const query = `INSERT INTO tb_komputer (nomor_aset, jenis, nama, os, manufaktur, model, serial_number, garansi, status, ram, harddisk, prosesor, thn_pembelian, nilai_pembelian, mac, foto, deskripsi) VALUES (?)`;
  
    db.query(query, [computerData], (err, results) => {
      if (err) {
        console.error('Database query error:', err);
        console.log('Request Body:', req.body);
        return res.status(500).send('Database query error');
      }
      res.json({
        success: true,
        message: 'Computer added successfully',
        data: results,
      });
    });
  });

// Update computer
app.put('/komputer/:nomor_aset', (req, res) => {
    console.log('Request Body:', req.body);
  
    const nomorAset = req.params.nomor_aset;
    const updatedData = {
      jenis: req.body.jenis,
      nama: req.body.nama,
      os: req.body.os,
      manufaktur: req.body.manufaktur,
      model: req.body.model,
      serial_number: req.body.serial_number,
      garansi: req.body.garansi,
      status: req.body.status,
      ram: req.body.ram,
      harddisk: req.body.harddisk,
      prosesor: req.body.prosesor,
      thn_pembelian: req.body.thn_pembelian,
      nilai_pembelian: req.body.nilai_pembelian,
      mac: req.body.mac,
      foto: req.body.foto,
      deskripsi: req.body.deskripsi
    };
  
    const query = `
      UPDATE tb_komputer 
      SET jenis = ?, nama = ?, os = ?, manufaktur = ?, model = ?, serial_number = ?, garansi = ?, status = ?, ram = ?, harddisk = ?, prosesor = ?, thn_pembelian = ?, nilai_pembelian = ?, mac = ?, foto = ?, deskripsi = ? 
      WHERE nomor_aset = ?
    `;
  
    const values = [
      updatedData.jenis,
      updatedData.nama,
      updatedData.os,
      updatedData.manufaktur,
      updatedData.model,
      updatedData.serial_number,
      updatedData.garansi,
      updatedData.status,
      updatedData.ram,
      updatedData.harddisk,
      updatedData.prosesor,
      updatedData.thn_pembelian,
      updatedData.nilai_pembelian,
      updatedData.mac,
      updatedData.foto,
      updatedData.deskripsi,
      nomorAset
    ];
  
    db.query(query, values, (err, results) => {
      if (err) {
        console.error('Database query error:', err);
        console.log('Request Body:', req.body);
        return res.status(500).send('Database query error');
      }
  
      if (results.affectedRows === 0) {
        return res.status(404).send('Computer not found');
      }
  
      res.json({
        success: true,
        message: 'Computer updated successfully',
        data: results,
      });
    });
});

//delete a komputer
app.delete('/computers/:nomor_aset', (req, res) => {
  const nomorAset = req.params.nomor_aset;
  const query = 'DELETE FROM tb_komputer WHERE nomor_aset = ?';
  db.query(query, [nomorAset], (err, results) => {
    if (err) {
      return res.status(500).send('Database query error');
    }
    res.json({
      success: true,
      message: 'Computer deleted successfully',
      data: results,
    });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
