const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

var db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "barata2",
    port:"8000"
});

db.connect(function(err) {
    if (err) {
        console.error("Connection failed: ", err.message);
    } else {
        console.log("Connected to MySQL database!");
    }
});

// Route to handle login
app.post('/login', (req, res) => {
    const { userType, username, password, employeeId } = req.body;

    if (userType === 'Admin') {
        const query = `SELECT * FROM pengguna WHERE nama = ? AND password = ? AND peran = 'Admin'`;
        db.query(query, [username, password], (err, results) => {
            if (err) {
                return res.status(500).send("Database query error");
            }
            if (results.length > 0) {
                res.json({ success: true, role: 'Admin' });
            } else {
                res.status(401).json({ success: false, message: 'Invalid admin credentials' });
            }
        });
    } else if (userType === 'Karyawan') {
        const query = `SELECT * FROM pengguna WHERE npk = ? AND peran = 'Karyawan'`;
        db.query(query, [employeeId], (err, results) => {
            if (err) {
                return res.status(500).send("Database query error");
            }
            if (results.length > 0) {
                res.json({ success: true, role: 'Karyawan' });
            } else {
                res.status(401).json({ success: false, message: 'Invalid employee ID' });
            }
        });
    } else {
        res.status(400).json({ success: false, message: 'Invalid user type' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
