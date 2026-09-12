const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
require("dotenv").config();
const db = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

// Bolehkan folder 'uploads' diakses melalui URL
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Konfigurasi Multer untuk Simpan Gambar
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// API UPLOAD GAMBAR
app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Tiada fail diupload" });
  const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

// API TOPICS (Kekal macam biasa)
app.get("/api/topics", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM topics ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/topics/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM topics WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "Not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/topics", async (req, res) => {
  const { title, period, region, shortDescription, content, image } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO topics (title, period, region, short_description, content, image) VALUES (?, ?, ?, ?, ?, ?)",
      [title, period, region, shortDescription, content, image]
    );
    res.json({ id: result.insertId, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/topics/:id", async (req, res) => {
  const { title, period, region, shortDescription, content, image } = req.body;
  try {
    await db.query(
      "UPDATE topics SET title=?, period=?, region=?, short_description=?, content=?, image=? WHERE id=?",
      [title, period, region, shortDescription, content, image, req.params.id]
    );
    res.json({ message: "Updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/topics/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM topics WHERE id = ?", [req.params.id]);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server Chronos running on port ${PORT}`));