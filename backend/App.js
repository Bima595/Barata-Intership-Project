const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

var db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'barata2',
  port: '3306',
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

// Endpoint untuk devicekantor dan asetkantor
app.get('/devicekantor', (req, res) => {
  const query = `
    SELECT 
      tb_komputer.nama AS nama_komputer, 
      tb_komputer.model, 
      tb_komputer.status, 
      pengguna.nama AS nama_pengguna, 
      pengguna.unit_organisasi 
    FROM tb_komputer
    JOIN aset ON tb_komputer.id_komputer = aset.komputer_id
    LEFT JOIN peminjam ON aset.aset_id = peminjam.aset_id
    LEFT JOIN pengguna ON peminjam.pengguna_id = pengguna.pengguna_id
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send('Database query error');
    }
    res.json({ success: true, data: results });
  });
});

// Endpoint untuk mencari komputer berdasarkan nomor aset dan NPK karyawan
// app.get('/computers/:nomor_aset', async (req, res) => {
//   const { nomor_aset } = req.params;
//   const { npk } = req.query;

//   try {
//     // Query untuk menemukan aset yang dipinjam oleh karyawan dengan NPK tersebut
//     const result = await db.query(
//       `SELECT * FROM tb_komputer
//         INNER JOIN peminjam ON tb_komputer.nomor_aset = peminjam.aset_id
//         WHERE tb_komputer.nomor_aset = ? AND peminjam.pengguna_id = (
//         SELECT pengguna_id FROM pengguna WHERE npk = ?
//       )`,
//       [nomor_aset, npk]
//     );

//     if (result.length > 0) {
//       res.json({ success: true, data: result[0] });
//     } else {
//       res.json({ success: false, message: 'Device not found or not borrowed by this user' });
//     }
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'An error occurred while fetching the data' });
//   }
// });

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


// app.get('/computers/borrowers/:nomor_aset', (req, res) => {
//   const nomorAset = req.params.nomor_aset;
//   console.log('Request for borrowers received for computer: ', nomorAset);

//   const query = `
//         SELECT g.nama, g.jabatan, p.tgl_peminjaman, p.tgl_pengembalian
//         FROM peminjam p
//         JOIN pengguna g ON p.pengguna_id = g.pengguna_id
//         JOIN aset a ON p.aset_id = a.aset_id
//         JOIN tb_komputer k ON a.komputer_id = k.id_komputer
//         WHERE k.nomor_aset = ?
//     `;
//   db.query(query, [nomorAset], (err, results) => {
//     if (err) {
//       return res.status(500).send('Database query error');
//     }
//     if (results.length > 0) {
//       res.json({ success: true, data: results[0] });
//     } else {
//       res.status(404).json({
//         success: false,
//         message: 'No borrowers found for this computer',
//       });
//     }
//   });
// });


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

      // Validate if nomor_aset exists and is active in tb_komputer table
      const checkAssetQuery = `
          SELECT id_komputer, status 
          FROM tb_komputer 
          WHERE nomor_aset = ?`;
      db.query(checkAssetQuery, [nomor_aset], (err, komputerResults) => {
          if (err) {
              console.error('Database query error:', err);
              return res.status(500).send('Database query error');
          }

          if (komputerResults.length === 0) {
              return res.status(404).json({ success: false, message: 'Asset not found' });
          }

          const idKomputer = komputerResults[0].id_komputer;
          const status = komputerResults[0].status;

          if (status !== 'Aktif') {
              return res.status(400).json({ success: false, message: 'Device is not available for borrowing' });
          }

          // Step 2: Insert a new record into aset table with komputer_id
          const insertAsetQuery = 'INSERT INTO aset (komputer_id, waktu_dibuat) VALUES (?, ?)';
          db.query(insertAsetQuery, [idKomputer, tgl_peminjaman], (err, asetResults) => {
              if (err) {
                  console.error('Database query error:', err);
                  return res.status(500).send('Database query error');
              }

              const asetId = asetResults.insertId; // Get the newly created aset_id

              // Step 3: Insert a new record into peminjam table
              const insertLoanQuery = `
                  INSERT INTO peminjam (aset_id, pengguna_id, tgl_peminjaman) 
                  VALUES (?, ?, ?)`;
              db.query(insertLoanQuery, [asetId, penggunaId, tgl_peminjaman], (err, loanResults) => {
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
                          message: 'Device borrowed successfully, status updated to "Tidak Aktif", and aset record created',
                          data: loanResults
                      });
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

//Mencari History Device
app.get('/computers/:nomor_aset/history', (req, res) => {
  const nomorAset = req.params.nomor_aset;

  const query = `
    SELECT 
      g.nama as nama_pengguna, 
      g.jabatan, 
      p.tgl_peminjaman, 
      p.tgl_pengembalian 
    FROM peminjam p
    JOIN pengguna g ON p.pengguna_id = g.pengguna_id
    JOIN aset a ON p.aset_id = a.aset_id
    JOIN tb_komputer k ON a.komputer_id = k.id_komputer
    WHERE k.nomor_aset = ?
    ORDER BY p.tgl_peminjaman DESC
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
        message: 'No borrowing history found for this computer',
      });
    }
  });
});

//file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

const upload = multer({ storage: storage });

//create new computer
app.post('/komputer', upload.single('foto'), (req, res) => {
  const { nomor_aset } = req.body;

  // Cek apakah nomor_aset sudah ada di database
  const checkQuery = 'SELECT nomor_aset FROM tb_komputer WHERE nomor_aset = ?';

  db.query(checkQuery, [nomor_aset], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).send('Database query error');
    }

    if (results.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Nomor aset sudah ada di database. Tidak bisa membuat komputer dengan nomor aset yang sama.'
      });
    }

    // Jika nomor_aset belum ada, lakukan operasi INSERT
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
      req.file ? req.file.filename : null,
      req.body.deskripsi
    ];

    const insertQuery = `INSERT INTO tb_komputer (nomor_aset, jenis, nama, os, manufaktur, model, serial_number, garansi, status, ram, harddisk, prosesor, thn_pembelian, nilai_pembelian, mac, foto, deskripsi) VALUES (?)`;

    db.query(insertQuery, [computerData], (err, results) => {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).send('Database query error');
      }
      res.json({
        success: true,
        message: 'Computer added successfully',
        data: results,
      });
    });
  })
});


// Update komputer
app.put('/komputer/:nomor_aset', upload.single('foto'), (req, res) => {
  const currentNomorAset = req.params.nomor_aset;
  const newNomorAset = req.body.nomor_aset;

  // Check if the new nomor_aset already exists in the database
  const checkQuery = 'SELECT nomor_aset FROM tb_komputer WHERE nomor_aset = ? AND nomor_aset != ?';

  db.query(checkQuery, [newNomorAset, currentNomorAset], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).send('Database query error');
    }

    if (results.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Nomor aset sudah ada di database. Tidak bisa mengupdate komputer dengan nomor aset yang sama.'
      });
    }

    // If the check passes, proceed with the update
    const updatedData = {
      nomor_aset: newNomorAset,
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
      foto: req.file ? req.file.filename : req.body.foto,
      deskripsi: req.body.deskripsi
    };

    const updateQuery = `
      UPDATE tb_komputer 
      SET nomor_aset = ?, jenis = ?, nama = ?, os = ?, manufaktur = ?, model = ?, serial_number = ?, garansi = ?, status = ?, ram = ?, harddisk = ?, prosesor = ?, thn_pembelian = ?, nilai_pembelian = ?, mac = ?, foto = ?, deskripsi = ? 
      WHERE nomor_aset = ?
    `;

    const values = [
      updatedData.nomor_aset,
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
      currentNomorAset
    ];

    db.query(updateQuery, values, (err, results) => {
      if (err) {
        console.error('Database query error:', err);
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
  })
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