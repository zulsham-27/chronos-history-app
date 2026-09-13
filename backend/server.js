const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());

// [Dikemas Kini] Naikkan had saiz payload kepada 10mb untuk terima gambar Base64
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Sambungan MySQL dengan SSL (Diwajibkan oleh Aiven)
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  }
});

db.connect((err) => {
  if (err) {
    console.error("Database connection error:", err);
    return;
  }
  console.log("Connected to Aiven MySQL!");

  // [PENTING] Naikkan had saiz max_allowed_packet dalam pangkalan data MySQL
  db.query("SET GLOBAL max_allowed_packet = 67108864", (err) => {
    if (err) console.log("Note: Could not set global max_allowed_packet (normal for restricted users)");
  });

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS topics (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      period VARCHAR(100),
      region VARCHAR(100),
      short_description TEXT,
      content TEXT,
      image LONGTEXT, 
      source TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.query(createTableQuery, (err) => {
    if (err) {
      console.error("Error creating table:", err);
    } else {
      console.log("Table 'topics' is ready!");
      db.query("ALTER TABLE topics ADD COLUMN IF NOT EXISTS source TEXT", () => {});
      db.query("ALTER TABLE topics MODIFY COLUMN image LONGTEXT", () => {});
    }
  });
});

// API Routes
app.get("/api/topics", (req, res) => {
  db.query("SELECT * FROM topics ORDER BY created_at DESC", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get("/api/topics/:id", (req, res) => {
  db.query("SELECT * FROM topics WHERE id = ?", [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Topic not found" });
    res.json(results[0]);
  });
});

// [Dikemas Kini] Terima parameter 'source' untuk pendaftaran baru
app.post("/api/topics", (req, res) => {
  const { title, period, region, short_description, content, image, source } = req.body;

  // 1. Paksa tukar struktur kolum image & source dulu jika belum LONGTEXT
  const alterQuery = `
    ALTER TABLE topics 
    MODIFY COLUMN image LONGTEXT,
    ADD COLUMN IF NOT EXISTS source TEXT;
  `;

  db.query(alterQuery, (alterErr) => {
    if (alterErr) {
      console.log("Nota Alter (abaikan jika sudah wujud):", alterErr.message);
    }

    // 2. Masukkan data baharu
    const sql = "INSERT INTO topics (title, period, region, short_description, content, image, source) VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [title, period, region, short_description, content, image, source], (err, result) => {
      if (err) {
        console.error("MYSQL INSERT ERROR:", err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: result.insertId, ...req.body });
    });
  });
});

// [Dikemas Kini] Terima parameter 'source' semasa menyunting
app.put("/api/topics/:id", (req, res) => {
  const { title, period, region, short_description, content, image, source } = req.body;
  const sql = "UPDATE topics SET title=?, period=?, region=?, short_description=?, content=?, image=?, source=? WHERE id=?";
  
  db.query(sql, [title, period, region, short_description, content, image, source, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: req.params.id, ...req.body });
  });
});

app.delete("/api/topics/:id", (req, res) => {
  db.query("DELETE FROM topics WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Topic deleted successfully" });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});