const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const db = require('./db/init.js');

// Health check
app.get('/api/health', (req, res) => {
    return res.json({ status: 'ok'});
});

app.get('/api/invoices', (req, res) => {
    return res.json([]);
});

app.get('/api/invoices/:id', (req, res) => {
    return res.json({});
});

app.post('/api/invoices', (req, res) => {
    return res.status(201).json({ message: 'Invoice created successfully'});
});

app.put('/api/invoices/:id', (req, res) => {
    return res.json({});
});

app.delete('/api/invoices/:id', (req, res) => {
    return res.json({ok: true});
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});