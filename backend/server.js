require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`,
  ssl: { rejectUnauthorized: false }
});

// Create table
pool.query(`
  CREATE TABLE IF NOT EXISTS models (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    file_url VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  )
`);

// Get all models
app.get('/api/models', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM models ORDER BY created_at DESC');
    res.json(result.rows.map(r => ({
      _id: r.id,
      name: r.name,
      description: r.description,
      fileUrl: r.file_url,
      createdAt: r.created_at
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add model
app.post('/api/models', async (req, res) => {
  try {
    const { name, description, fileUrl } = req.body;
    const result = await pool.query(
      'INSERT INTO models (name, description, file_url) VALUES ($1, $2, $3) RETURNING *',
      [name, description || '', fileUrl]
    );
    res.status(201).json({
      _id: result.rows[0].id,
      name: result.rows[0].name,
      description: result.rows[0].description,
      fileUrl: result.rows[0].file_url
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete model
app.delete('/api/models/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM models WHERE id = $1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on ${PORT}`));
module.exports = app;