const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

var db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'barata',
  port: '3306',
});

db.connect(function (err) {
  if (err) {
    console.error('Connection failed: ', err.message);
  } else {
    console.log('Connected to MySQL database!');
  }
});

const karyawanFilePath = path.join(__dirname, 'karyawan.json');
const karyawanData = JSON.parse(fs.readFileSync(karyawanFilePath, 'utf8'));

// Konfigurasi multer untuk menyimpan file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Tambahkan `req` sebagai argumen pertama
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Tambahkan `req` sebagai argumen pertama
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const jwt = require('jsonwebtoken');

// Secret key for signing the JWT
const jwtSecret = 'your_secret_key';

//Login
app.post('/login', (req, res) => {
  const { userType, username, password, employeeId } = req.body;

  if (userType === 'Admin') {
    const query = `SELECT * FROM pengguna WHERE nama = ? AND password = ? AND peran = 'Admin'`;
    db.query(query, [username, password], (err, results) => {
      if (err) {
        return res.status(500).send('Database query error');
      }
      if (results.length > 0) {
        // Generate JWT token for Admin
        const token = jwt.sign({ role: 'Admin' }, jwtSecret, {
          expiresIn: '1h',
        });
        res.json({ success: true, role: 'Admin', token: token });
      } else {
        res
          .status(401)
          .json({ success: false, message: 'Invalid admin credentials' });
      }
    });
  } else if (userType === 'Karyawan') {
    // Check against dummy data first
    const karyawan = karyawanData.find((k) => k.npk === employeeId);
    if (karyawan) {
      // Generate JWT token for Karyawan
      const token = jwt.sign({ role: 'Karyawan' }, jwtSecret, {
        expiresIn: '1h',
      });
      res.json({ success: true, role: 'Karyawan', token: token });
    } else {
      // If not found in JSON, check in the database
      const query = `SELECT * FROM pengguna WHERE npk = ? AND peran = 'Karyawan'`;
      db.query(query, [employeeId], (err, results) => {
        if (err) {
          return res.status(500).send('Database query error');
        }
        if (results.length > 0) {
          // Generate JWT token for Karyawan
          const token = jwt.sign({ role: 'Karyawan' }, jwtSecret, {
            expiresIn: '1h',
          });
          res.json({ success: true, role: 'Karyawan', token: token });
        } else {
          res
            .status(401)
            .json({ success: false, message: 'Invalid employee ID' });
        }
      });
    }
  } else {
    res.status(400).json({ success: false, message: 'Invalid user type' });
  }
});

// Middleware untuk memverifikasi JWT dan memastikan hanya admin yang bisa mengakses
function verifyAdmin(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: 'No token provided' });
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      console.error('JWT verification error:', err.message);
      return res
        .status(401)
        .json({ success: false, message: 'Failed to authenticate token' });
    }
    if (decoded.role !== 'Admin') {
      return res
        .status(403)
        .json({ success: false, message: 'Access forbidden: Admins only' });
    }
    next();
  });
}

// Endpoint untuk menambahkan pengguna baru
app.post('/add-user', verifyAdmin, (req, res) => {
  const { nama, password, npk, peran, jabatan, unit_organisasi } = req.body;

  // Validation: only adding Karyawan (not Admin)
  if (peran !== 'Karyawan') {
    return res
      .status(400)
      .json({ success: false, message: 'Cannot add users with admin role' });
  }

  // Check if NPK or nama already exists in the database
  const checkQuery = 'SELECT * FROM pengguna WHERE npk = ? OR nama = ?';
  db.query(checkQuery, [npk, nama], (err, results) => {
    if (err) {
      return res.status(500).send('Database query error');
    }

    if (results.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: 'NPK or Nama already exists' });
    }

    // If NPK and Nama are unique, proceed with the insertion
    const insertQuery = `INSERT INTO pengguna (nama, password, npk, peran, jabatan, unit_organisasi) VALUES (?, ?, ?, ?, ?, ?)`;
    db.query(
      insertQuery,
      [nama, password, npk, peran, jabatan, unit_organisasi],
      (err, results) => {
        if (err) {
          return res.status(500).send('Database insert error');
        }

        res.json({ success: true, message: 'User added successfully' });
      }
    );
  });
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

// Endpoint search all pengguna "Hanya Karyawan" (baru)
app.get('/pengguna', (req, res) => {
  const query = 'SELECT * FROM pengguna WHERE peran = "Karyawan"';

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send('Database query error');
    }
    res.json({ success: true, data: results });
  });
});

// Endpoint search devicekantor dan asetkantor
app.get('/devicekantor', (req, res) => {
  const query = `
    SELECT 
      tb_komputer.id_komputer,
      tb_komputer.nama AS nama_komputer, 
      tb_komputer.model, 
      tb_komputer.status, 
      pengguna.nama AS nama_pengguna, 
      pengguna.unit_organisasi
    FROM tb_komputer
    LEFT JOIN aset ON tb_komputer.id_komputer = aset.komputer_id
    LEFT JOIN peminjam ON aset.aset_id = peminjam.aset_id AND peminjam.tgl_pengembalian IS NULL
    LEFT JOIN pengguna ON peminjam.pengguna_id = pengguna.pengguna_id
    ORDER BY tb_komputer.id_komputer
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).send('Database query error');
    }
    res.json({ success: true, data: results });
  });
});

//Mencari komputer by nomor aset & serial_number
app.get('/computers/:identifier', (req, res) => {
  const identifier = req.params.identifier;

  console.log('Received identifier:', identifier);

  const query =
    'SELECT * FROM tb_komputer WHERE nomor_aset = ? OR serial_number = ?';
  db.query(query, [identifier, identifier], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).send('Database query error');
    }
    console.log('Query results:', results);

    if (results.length > 0) {
      res.json({ success: true, data: results[0] });
    } else {
      res
        .status(404)
        .json({ success: false, message: 'Perangkat Tidak Ditemukan' });
    }
  });
});

//Mencari pengguna by npk (hanya karyawan)
app.get('/pengguna/:npk', (req, res) => {
  const npk = req.params.npk;

  console.log('Received NPK:', npk);

  const query = 'SELECT * FROM pengguna WHERE npk = ? AND peran = "Karyawan"';
  db.query(query, [npk], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).send('Database query error');
    }
    console.log('Query results:', results);

    if (results.length > 0) {
      res.json({ success: true, data: results[0] });
    } else {
      res
        .status(404)
        .json({ success: false, message: 'Karyawan tidak ditemukan' });
    }
  });
});

// Update pengguna
app.put('/update-pengguna/:npk', (req, res) => {
  const npk = req.params.npk;

  const updatedData = {
    nama: req.body.nama,
    jabatan: req.body.jabatan,
    unit_organisasi: req.body.unit_organisasi,
  };

  const updateQuery = `
    UPDATE pengguna 
    SET nama = ?, jabatan = ?, unit_organisasi = ?, waktu_diubah = NOW()
    WHERE npk = ?
  `;

  const values = [
    updatedData.nama,
    updatedData.jabatan,
    updatedData.unit_organisasi,
    npk,
  ];

  db.query(updateQuery, values, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).send('Database query error');
    }

    if (results.affectedRows === 0) {
      return res.status(404).send('Pengguna tidak ditemukan');
    }

    res.json({
      success: true,
      message: 'Data pengguna berhasil diperbarui',
      data: results,
    });
  });
});

// Mencari NPK (Karyawan), dan Nomor_aset / Serial_number (device)
app.get('/pengembalian/:identifier', (req, res) => {
  const identifier = req.params.identifier;

  const userQuery = `
    SELECT * 
    FROM pengguna 
    WHERE npk = ? AND peran = "Karyawan"
  `;

  const assetQuery = `
    SELECT k.*, a.*, p.*, u.nama AS peminjam_nama, u.npk AS peminjam_npk, u.jabatan AS peminjam_jabatan
    FROM tb_komputer k
    JOIN aset a ON k.id_komputer = a.komputer_id
    JOIN peminjam p ON a.aset_id = p.aset_id
    JOIN pengguna u ON p.pengguna_id = u.pengguna_id
    WHERE (u.npk = ? OR k.nomor_aset = ? OR k.serial_number = ?)
    AND p.tgl_pengembalian IS NULL
  `;

  db.query(userQuery, [identifier], (err, userResults) => {
    if (err) {
      console.error('Database query error (user):', err);
      return res.status(500).send('Database query error');
    }

    if (userResults.length > 0) {
      // User found with the given NPK
      db.query(assetQuery, [identifier, identifier, identifier], (err, assetResults) => {
        if (err) {
          console.error('Database query error (asset):', err);
          return res.status(500).send('Database query error');
        }

        const relevantAssets = assetResults.filter(asset => asset.pengguna_id === userResults[0].pengguna_id);
        
        if (relevantAssets.length > 0) {
          // User has borrowed assets
          res.json({
            success: true,
            user: {
              ...userResults[0],
            },
            assets: relevantAssets
          });
        } else {
          // User found but has not borrowed any assets
          res.status(404).json({
            success: false,
            message: 'Tidak ada pengguna atau aset yang ditemukan dengan pengenal ini'
          });
        }
      });
    } else {
      // User not found, check for asset by nomor_aset or serial_number
      db.query(assetQuery, [identifier, identifier, identifier], (err, assetResults) => {
        if (err) {
          console.error('Database query error (asset):', err);
          return res.status(500).send('Database query error');
        }

        if (assetResults.length > 0) {
          // Asset found, return asset details and borrower info
          const users = new Set(assetResults.map(asset => ({
            nama: asset.peminjam_nama,
            npk: asset.peminjam_npk,
            jabatan: asset.peminjam_jabatan
          })));
          const usersList = Array.from(users);

          res.json({
            success: true,
            user: usersList.length > 0 ? usersList[0] : null,
            assets: assetResults
          });
        } else {
          // No user or asset found with the given identifier
          res.status(404).json({
            success: false,
            message: 'Tidak ada pengguna atau aset yang ditemukan dengan pengenal ini'
          });
        }
      });
    }
  });
});

//Mencari NPK saja, dengan hasil Aset yang sedang dipinjam
app.get('/pengguna/pinjam/:npk', (req, res) => {
  const npk = req.params.npk;

  const userQuery = `
    SELECT * 
    FROM pengguna 
    WHERE npk = ? AND peran = "Karyawan"
  `;

  const assetQuery = `
    SELECT k.*, a.*, p.*, u.nama AS peminjam_nama, u.npk AS peminjam_npk, u.jabatan AS peminjam_jabatan
    FROM tb_komputer k
    JOIN aset a ON k.id_komputer = a.komputer_id
    JOIN peminjam p ON a.aset_id = p.aset_id
    JOIN pengguna u ON p.pengguna_id = u.pengguna_id
    WHERE u.npk = ? AND p.tgl_pengembalian IS NULL
  `;

  db.query(userQuery, [npk], (err, userResults) => {
    if (err) {
      console.error('Database query error (user):', err);
      return res.status(500).send('Database query error');
    }

    if (userResults.length > 0) {
      // User found with the given NPK
      db.query(assetQuery, [npk], (err, assetResults) => {
        if (err) {
          console.error('Database query error (asset):', err);
          return res.status(500).send('Database query error');
        }

        if (assetResults.length > 0) {
          res.json({
            success: true,
            user: {
              ...userResults[0],
            },
            assets: assetResults
          });
        } else {
          res.json({
            success: true,
            user: {
              ...userResults[0],
            },
            message: 'Pengguna tidak meminjam laptop'
          });
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Pengguna tidak ditemukan'
      });
    }
  });
});

// Serah Terima Aset
app.post('/transfer-device', upload.array('foto', 5), (req, res) => {
  const { npk1, npk2, nomor_aset, deskripsi } = req.body;
  const fotoFiles = req.files || [];
  const foto = fotoFiles.map((file) => file.filename).join(', '); // Menggabungkan nama file foto dengan koma

  // Step 1: Validate if npk1 and npk2 exist in pengguna table
  const checkUserQuery = 'SELECT pengguna_id FROM pengguna WHERE npk = ?';
  db.query(checkUserQuery, [npk1], (err, userResults1) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).send('Database query error');
    }

    if (userResults1.length === 0) {
      return res.status(404).json({ success: false, message: 'Pengguna pertama tidak ditemukan' });
    }

    const penggunaId1 = userResults1[0].pengguna_id;

    db.query(checkUserQuery, [npk2], (err, userResults2) => {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).send('Database query error');
      }

      if (userResults2.length === 0) {
        return res.status(404).json({ success: false, message: 'Pengguna kedua tidak ditemukan' });
      }

      const penggunaId2 = userResults2[0].pengguna_id;

      // Step 2: Return the device from penggunaId1
      const checkLoanQuery = `
        SELECT p.peminjam_id, a.aset_id, k.status
        FROM peminjam p
        JOIN aset a ON p.aset_id = a.aset_id
        JOIN tb_komputer k ON a.komputer_id = k.id_komputer
        WHERE k.nomor_aset = ? AND p.pengguna_id = ? AND p.tgl_pengembalian IS NULL
      `;

      db.query(checkLoanQuery, [nomor_aset, penggunaId1], (err, results) => {
        if (err) {
          console.error('Database query error:', err);
          return res.status(500).send('Database query error');
        }

        if (results.length > 0) {
          const peminjam_id = results[0].peminjam_id;
          const aset_id = results[0].aset_id; // Extract aset_id from query result

          const updateLoanQuery = `
            UPDATE peminjam 
            SET tgl_pengembalian = NOW() 
            WHERE peminjam_id = ?
          `;

          db.query(updateLoanQuery, [peminjam_id], (err) => {
            if (err) {
              console.error('Database query error:', err);
              return res.status(500).send('Gagal mengembalikan aset');
            }

            // Step 3: Insert history entry
            const insertHistoryQuery = `
              INSERT INTO history (peminjam_id, deskripsi, foto) 
              VALUES (?, ?, ?)
            `;

            db.query(insertHistoryQuery, [peminjam_id, deskripsi || null, foto], (err) => {
              if (err) {
                console.error('Database query error:', err);
                return res.status(500).send('Gagal mencatat riwayat');
              }

              // Step 4: Borrow the device to penggunaId2
              const tgl_peminjaman = new Date();
              const insertLoanQuery = `
                INSERT INTO peminjam (aset_id, pengguna_id, tgl_peminjaman) 
                VALUES (?, ?, ?)
              `;

              db.query(insertLoanQuery, [aset_id, penggunaId2, tgl_peminjaman], (err) => {
                if (err) {
                  console.error('Database query error:', err);
                  return res.status(500).send('Gagal meminjamkan aset ke pengguna kedua');
                }

                // Step 5: Update device status to 'Aktif'
                const updateStatusQuery = `
                  UPDATE tb_komputer 
                  SET status = 'Aktif' 
                  WHERE nomor_aset = ?
                `;

                db.query(updateStatusQuery, [nomor_aset], (err) => {
                  if (err) {
                    console.error('Failed to update device status:', err);
                    return res.status(500).send('Gagal mengupdate status perangkat');
                  }

                  res.json({
                    success: true,
                    message: 'Serah terima aset berhasil dan riwayat telah tercatat.',
                  });
                });
              });
            });
          });
        } else {
          res.status(404).json({
            success: false,
            message: `Pengguna pertama tidak memiliki pinjaman aktif untuk perangkat ${nomor_aset}`,
          });
        }
      });
    });
  });
});

//endpoint pinjam device
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
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
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
        return res
          .status(404)
          .json({ success: false, message: 'Asset not found' });
      }

      const idKomputer = komputerResults[0].id_komputer;
      const status = komputerResults[0].status;

      if (status !== 'Tidak Terpakai') {
        return res
          .status(400)
          .json({
            success: false,
            message: 'Device is not available for borrowing',
          });
      }

      // Check if komputer_id already exists in aset table
      const checkAsetQuery = 'SELECT aset_id FROM aset WHERE komputer_id = ?';
      db.query(checkAsetQuery, [idKomputer], (err, asetResults) => {
        if (err) {
          console.error('Database query error:', err);
          return res.status(500).send('Database query error');
        }

        let asetId;
        if (asetResults.length > 0) {
          // Use the existing aset_id
          asetId = asetResults[0].aset_id;
          proceedWithLoan(asetId, penggunaId);
        } else {
          // Insert a new record into aset table with komputer_id
          const insertAsetQuery =
            'INSERT INTO aset (komputer_id, waktu_dibuat) VALUES (?, ?)';
          db.query(
            insertAsetQuery,
            [idKomputer, tgl_peminjaman],
            (err, insertResults) => {
              if (err) {
                console.error('Database query error:', err);
                return res.status(500).send('Database query error');
              }

              asetId = insertResults.insertId; // Get the newly created aset_id
              proceedWithLoan(asetId, penggunaId);
            }
          );
        }

        function proceedWithLoan(asetId, penggunaId) {
          // Step 3: Insert a new record into peminjam table
          const insertLoanQuery = `
            INSERT INTO peminjam (aset_id, pengguna_id, tgl_peminjaman) 
            VALUES (?, ?, ?)`;
          db.query(
            insertLoanQuery,
            [asetId, penggunaId, tgl_peminjaman],
            (err, loanResults) => {
              if (err) {
                console.error('Database query error:', err);
                return res.status(500).send('Database query error');
              }

              // Step 4: Update device status to 'Aktif'
              const updateStatusQuery =
                'UPDATE tb_komputer SET status = ? WHERE nomor_aset = ?';
              db.query(updateStatusQuery, ['Aktif', nomor_aset], (err) => {
                if (err) {
                  console.error('Failed to update device status:', err);
                  return res.status(500).send('Database query error');
                }

                res.json({
                  success: true,
                  message:
                    'Device borrowed successfully, status updated to "Aktif", and aset record created',
                  data: loanResults,
                });
              });
            }
          );
        }
      });
    });
  });
});

//return-device
app.post('/return-device', upload.array('foto', 5), (req, res) => {
  const { nomor_aset, deskripsi } = req.body;
  const fotoFiles = req.files || [];
  const foto = fotoFiles.map((file) => file.filename).join(', '); // Join filenames with a comma

  // Check if the device is currently loaned out
  const checkLoanQuery = `
      SELECT p.peminjam_id, k.status
      FROM peminjam p
      JOIN aset a ON p.aset_id = a.aset_id
      JOIN tb_komputer k ON a.komputer_id = k.id_komputer
      WHERE k.nomor_aset = ? AND p.tgl_pengembalian IS NULL AND k.status = 'Aktif'
  `;

  db.query(checkLoanQuery, [nomor_aset], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).send('Database query error');
    }

    if (results.length > 0) {
      const peminjam_id = results[0].peminjam_id;

      // Record the history (damage/replacement details)
      const insertHistoryQuery = `
              INSERT INTO history (peminjam_id, deskripsi, foto) 
              VALUES (?, ?, ?)
          `;

      db.query(
        insertHistoryQuery,
        [peminjam_id, deskripsi || null, foto],
        (err, historyResults) => {
          if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Failed to record history');
          }

          // Mark the device as returned
          const updateLoanQuery = `
                  UPDATE peminjam p
                  JOIN aset a ON p.aset_id = a.aset_id
                  JOIN tb_komputer k ON a.komputer_id = k.id_komputer
                  SET p.tgl_pengembalian = NOW(), k.status = 'Tidak Terpakai'
                  WHERE k.nomor_aset = ? AND p.tgl_pengembalian IS NULL
              `;

          db.query(updateLoanQuery, [nomor_aset], (err, updateResults) => {
            if (err) {
              console.error('Database query error:', err);
              return res.status(500).send('Failed to update device status');
            }

            res.json({
              success: true,
              message: `Device ${nomor_aset} returned successfully and status updated to 'Tidak Terpakai'. History recorded.`,
              data: updateResults,
            });
          });
        }
      );
    } else {
      res.status(404).json({
        success: false,
        message: `Tidak ditemukan pinjaman aktif untuk perangkat ${nomor_aset}`,
      });
    }
  });
});

// Get history of damages/replacements for a specific asset
app.get('/history/:nomor_aset/rusak', (req, res) => {
  const { nomor_aset } = req.params;

  const getHistoryQuery = `
      SELECT h.deskripsi, h.waktu
      FROM history h
      JOIN peminjam p ON h.peminjam_id = p.peminjam_id
      JOIN aset a ON p.aset_id = a.aset_id
      JOIN tb_komputer k ON a.komputer_id = k.id_komputer
      WHERE k.nomor_aset = ?
      ORDER BY h.waktu DESC
  `;

  db.query(getHistoryQuery, [nomor_aset], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).send('Database query error');
    }

    if (results.length > 0) {
      res.json({
        success: true,
        history: results,
      });
    } else {
      res.status(404).json({
        success: false,
        message: `No history found for device ${nomor_aset}`,
      });
    }
  });
});

//melihat device sedang di bawa siapa
app.get('/computers/:nomor_aset/borrowers', (req, res) => {
  const nomorAset = req.params.nomor_aset;
  console.log('Request for latest borrower received for computer: ', nomorAset);

  const query = `
    SELECT 
      g.nama AS nama_pengguna, 
      g.unit_organisasi AS divisi,
      p.tgl_peminjaman, 
      p.tgl_pengembalian
    FROM peminjam p
    JOIN pengguna g ON p.pengguna_id = g.pengguna_id
    JOIN aset a ON p.aset_id = a.aset_id
    JOIN tb_komputer k ON a.komputer_id = k.id_komputer
    WHERE k.nomor_aset = ?
    ORDER BY p.tgl_peminjaman DESC
    LIMIT 1
  `;

  db.query(query, [nomorAset], (err, results) => {
    if (err) {
      return res.status(500).send('Database query error');
    }
    if (results.length > 0) {
      res.json({
        success: true,
        data: {
          nama_pengguna: results[0].nama_pengguna,
          divisi: results[0].divisi,
          tgl_peminjaman: results[0].tgl_peminjaman,
          tgl_pengembalian: results[0].tgl_pengembalian,
        },
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'No borrowers found for this computer',
      });
    }
  });
});

//cari peminjam laptop
app.get('/computers/:nomor_aset/borrowers', (req, res) => {
  const nomorAset = req.params.nomor_aset;
  console.log('Request for latest borrower received for computer: ', nomorAset);

  const query = `
    SELECT 
      g.nama AS nama_pengguna, 
      g.unit_organisasi AS divisi,
      p.tgl_peminjaman, 
      p.tgl_pengembalian
    FROM peminjam p
    JOIN pengguna g ON p.pengguna_id = g.pengguna_id
    JOIN aset a ON p.aset_id = a.aset_id
    JOIN tb_komputer k ON a.komputer_id = k.id_komputer
    WHERE k.nomor_aset = ?
    ORDER BY p.tgl_peminjaman DESC
    LIMIT 1
  `;

  db.query(query, [nomorAset], (err, results) => {
    if (err) {
      return res.status(500).send('Database query error');
    }
    if (results.length > 0) {
      res.json({
        success: true,
        data: {
          nama_pengguna: results[0].nama_pengguna,
          divisi: results[0].divisi,
          tgl_peminjaman: results[0].tgl_peminjaman,
          tgl_pengembalian: results[0].tgl_pengembalian,
        },
      });
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

// Endpoint untuk membuat komputer baru dengan beberapa file foto
app.post('/komputer', upload.array('foto', 10), (req, res) => {
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
        message:
          'Nomor aset sudah ada di database. Tidak bisa membuat komputer dengan nomor aset yang sama.',
      });
    }

    // Jika nomor_aset belum ada, lakukan operasi INSERT
    const fileNames = req.files.map((file) => file.filename); // Mendapatkan nama semua file
    const foto = fileNames.join(','); // Menggabungkan nama file dengan tanda koma

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
      foto, // Menyimpan nama file yang sudah digabungkan
      req.body.deskripsi,
    ];

    const insertQuery = `INSERT INTO tb_komputer (nomor_aset, jenis, nama, os, manufaktur, model, serial_number, garansi, status, ram, harddisk, prosesor, thn_pembelian, nilai_pembelian, mac, foto, deskripsi) VALUES (?)`;

    db.query(insertQuery, [computerData], (err, results) => {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).send('Database query error');
      }

      const komputer_id = results.insertId;
      const assetInsertQuery = 'INSERT INTO aset (komputer_id) VALUES (?)';

      db.query(assetInsertQuery, [komputer_id], (err) => {
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
    });
  });
});

// Update komputer
app.put('/komputer/:nomor_aset', upload.array('foto', 10), (req, res) => {
  const currentNomorAset = req.params.nomor_aset;
  const newNomorAset = req.body.nomor_aset;

  // Ambil foto yang ada di database saat ini
  const getCurrentPhotosQuery =
    'SELECT foto FROM tb_komputer WHERE nomor_aset = ?';

  db.query(getCurrentPhotosQuery, [currentNomorAset], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).send('Database query error');
    }

    let existingPhotos = results[0].foto ? results[0].foto.split(',') : [];

    // Hapus foto yang diminta
    if (req.body.foto_hapus) {
      const photosToDelete = req.body.foto_hapus.split(',');
      existingPhotos = existingPhotos.filter(
        (photo) => !photosToDelete.includes(photo)
      );

      // Optional: Hapus file fisik dari sistem
      photosToDelete.forEach((photo) => {
        fs.unlink(`uploads/${photo}`, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      });
    }

    // Tambahkan foto baru (jika ada)
    const newPhotos = req.files.map((file) => file.filename);
    const updatedPhotos = [...existingPhotos, ...newPhotos];

    // Lakukan update data
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
      foto: updatedPhotos.join(','), // Menyimpan daftar foto yang diperbarui
      deskripsi: req.body.deskripsi,
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
      currentNomorAset,
    ];

    db.query(updateQuery, values, (err, results) => {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).send('Database query error');
      }

      if (results.affectedRows === 0) {
        return res.status(404).send('Computer not found');
      }

      // Update aset table jika nomor_aset berubah
      if (currentNomorAset !== newNomorAset) {
        const updateAsetQuery =
          'UPDATE aset SET komputer_id = (SELECT id FROM tb_komputer WHERE nomor_aset = ?) WHERE komputer_id = (SELECT id FROM tb_komputer WHERE nomor_aset = ?)';

        db.query(updateAsetQuery, [newNomorAset, currentNomorAset], (err) => {
          if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Database query error');
          }
        });
      }

      res.json({
        success: true,
        message: 'Computer updated successfully',
        data: results,
      });
    });
  });
});

//delete foto komputer saat update
app.delete('/komputer/:nomor_aset/foto', async (req, res) => {
  const { nomor_aset } = req.params;
  const { fileName } = req.body;

  try {
    const filePath = path.join(__dirname, 'uploads', fileName);
    fs.unlinkSync(filePath);

    const queryGet = 'SELECT foto FROM tb_komputer WHERE nomor_aset = ?';
    db.query(queryGet, [nomor_aset], (err, results) => {
      if (err) {
        throw err;
      }

      let fotoList = results[0].foto ? results[0].foto.split(',') : [];
      fotoList = fotoList.filter(foto => foto !== fileName);
      const updatedFoto = fotoList.length > 0 ? fotoList.join(',') : null;
      const queryUpdate = 'UPDATE tb_komputer SET foto = ? WHERE nomor_aset = ?';
      db.query(queryUpdate, [updatedFoto, nomor_aset], (err) => {
        if (err) {
          throw err;
        }
        res.status(200).json({ success: true, message: 'Foto berhasil dihapus' });
      });
    });
  } catch (error) {
    console.error('Gagal Menghapus Foto:', error);
    res.status(500).json({ success: false, message: 'Gagal menghapus foto' });
  }
});

//delete a komputer
app.delete('/delete-computers/:nomor_aset', (req, res) => {
  const nomorAset = req.params.nomor_aset;

  // Step 1: Find the aset_id from tb_komputer and link it to aset
  const findAsetIdQuery = `
    SELECT aset.aset_id
    FROM tb_komputer
    INNER JOIN aset ON tb_komputer.id_komputer = aset.komputer_id
    WHERE tb_komputer.nomor_aset = ?
  `;

  db.query(findAsetIdQuery, [nomorAset], (err, results) => {
    if (err) {
      console.error('Error executing findAsetIdQuery:', err); // Log detailed error
      return res.status(500).json({
        success: false,
        message: 'Database query error while finding aset_id',
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Computer not found',
      });
    }

    const asetId = results[0].aset_id;

    // Step 2: Check if the aset_id exists in peminjam
    const checkPeminjamQuery = 'SELECT * FROM peminjam WHERE aset_id = ?';
    db.query(checkPeminjamQuery, [asetId], (err, results) => {
      if (err) {
        console.error('Error executing checkPeminjamQuery:', err); // Log detailed error
        return res.status(500).json({
          success: false,
          message: 'Database query error while checking peminjam',
        });
      }

      // If the aset_id is found in peminjam, it cannot be deleted
      if (results.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete computer; it is currently borrowed',
        });
      }

      // Start a transaction
      db.beginTransaction((err) => {
        if (err) {
            console.error('Transaction start error:', err);
            return res.status(500).json({ success: false, message: 'Transaction error' });
        }

        const deleteAsetQuery = `
            DELETE FROM aset WHERE komputer_id = (
                SELECT id_komputer FROM tb_komputer WHERE nomor_aset = ?
            )
        `;
        db.query(deleteAsetQuery, [nomorAset], (err, results) => {
            if (err) {
                console.error('Error executing deleteAsetQuery:', err);
                return db.rollback(() => {
                    res.status(500).json({ success: false, message: 'Error deleting from aset' });
                });
            }

            const deleteKomputerQuery = 'DELETE FROM tb_komputer WHERE nomor_aset = ?';
            db.query(deleteKomputerQuery, [nomorAset], (err, results) => {
                if (err) {
                    console.error('Error executing deleteKomputerQuery:', err);
                    return db.rollback(() => {
                        res.status(500).json({ success: false, message: 'Error deleting from tb_komputer' });
                    });
                }

                db.commit((err) => {
                    if (err) {
                        console.error('Transaction commit error:', err);
                        return db.rollback(() => {
                            res.status(500).json({ success: false, message: 'Transaction commit error' });
                        });
                    }

                    res.json({ success: true, message: 'Computer and related asset deleted successfully' });
                });
            });
        });
      });
    });
  });
});

app.use(express.json());
//Start Surat Keterangan Serah Terima
const templateDirectory = path.join(__dirname, '/SK');
const outputDirectory1 = path.join(__dirname, '/Hasil_SK');
const outputDirectory2 = path.join(__dirname, '/Download_SK');

// Helper function to format dates
const formatDate = (date) => {
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  return `${day} ${month} ${year}`;
};

// Helper function to generate unique file names
const generateUniqueFileName = (dir, baseName, ext) => {
  let fileName = baseName + ext;
  let counter = 1;

  while (fs.existsSync(path.join(dir, fileName))) {
    fileName = `${baseName}${counter}${ext}`;
    counter++;
  }

  return fileName;
};

// API route to handle Word template filling
app.post('/word-template', async (req, res) => {
  try {
    const data = req.body;

    if (!data) {
      return res.status(400).json({ success: false, error: 'Data tidak lengkap.' });
    }

    const templatePath = path.join(templateDirectory, 'SKST.docx');

    if (!fs.existsSync(templatePath)) {
      return res.status(404).json({ success: false, error: 'Template file tidak ditemukan.' });
    }

    const content = fs.readFileSync(templatePath, 'binary');
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip);

    const currentDate = formatDate(new Date());

    // Prepare data for template rendering
    doc.render({
      tglSurat: currentDate,
      namaKaryawan1: data.namaKaryawan1 || '',
      npk1: data.npk1 || '',
      jabatan1: data.jabatan1 || '',
      unitOrganisasi1: data.unitOrganisasi1 || '',
      namaKaryawan2: data.namaKaryawan2 || '',
      npk2: data.npk2 || '',
      jabatan2: data.jabatan2 || '',
      unitOrganisasi2: data.unitOrganisasi2 || '',
      namaLaptop: data.namaLaptop || '',
      model: data.model || '',
      serialNumber: data.serialNumber || '',
      os: data.os || '',
      prosesor: data.prosesor || '',
      ram: data.ram || '',
      harddisk: data.harddisk || '',
      thnPembelian: data.thnPembelian || '',
      deskripsi: data.deskripsi || ''
    });

    const buffer = doc.getZip().generate({ type: 'nodebuffer' });

    // Generate file names based on npk2 value
    const npk2 = data.npk2 || 'undefined';
    const outputFileName = `${npk2}_SKST.docx`;

    // Generate unique file names for both output directories
    const uniqueFileName1 = generateUniqueFileName(outputDirectory1, npk2 + '_SKST', '.docx');
    const uniqueFileName2 = generateUniqueFileName(outputDirectory2, npk2 + '_SKST', '.docx');

    const outputPath1 = path.join(outputDirectory1, uniqueFileName1);
    const outputPath2 = path.join(outputDirectory2, uniqueFileName2);

    // Write files to both output directories
    fs.writeFileSync(outputPath1, buffer);
    fs.writeFileSync(outputPath2, buffer);

    res.json({ 
      success: true, 
      message: 'Files berhasil dibuat dan disimpan.', 
      files: {
        hasil_sk: outputPath1,
        download_sk: uniqueFileName2
      }
    });
  } catch (error) {
    console.error('Error processing Word file:', error);
    res.status(500).json({ success: false, error: 'Gagal memproses file Word.' });
  }
});

// Endpoint untuk mengunduh file
app.get('/download', (req, res) => {
  try {
    const files = fs.readdirSync(outputDirectory2);
    if (files.length === 0) {
      return res.status(404).json({ success: false, error: 'Tidak ada file untuk diunduh.' });
    }

    const fileName = files[0];
    const filePath = path.join(outputDirectory2, fileName);

    // Set headers to ensure the browser uses the original file name
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        return res.status(500).json({ success: false, error: 'Gagal mengunduh file.' });
      }

      // Delete the file after a successful download
      fs.unlinkSync(filePath);
    });
  } catch (error) {
    console.error('Error handling download:', error);
    res.status(500).json({ success: false, error: 'Gagal memproses permintaan unduhan.' });
  }
});

// Endpoint untuk menghapus file di direktori Download_SK
app.delete('/delete', (req, res) => {
  try {
    const files = fs.readdirSync(outputDirectory2);
    if (files.length === 0) {
      return res.status(404).json({ success: false, error: 'Tidak ada file untuk dihapus.' });
    }

    const fileName = files[0]; // Mengambil file pertama
    const filePath = path.join(outputDirectory2, fileName);

    // Hapus file
    fs.unlinkSync(filePath);

    res.json({ success: true, message: 'File berhasil dihapus.' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ success: false, error: 'Gagal menghapus file.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
