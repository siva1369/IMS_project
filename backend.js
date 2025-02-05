const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors'); // Import CORS

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Add CORS middleware here

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'inventory'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        process.exit();
    }
    console.log('Connected to database');
});

// Routes
app.get('/products', (req, res) => {
    const sql = 'SELECT * FROM products';
    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
});

app.post('/products', (req, res) => {
    const product = req.body;
    const sql = 'INSERT INTO products (name, category, stock, price) VALUES (?, ?, ?, ?)';
    db.query(sql, [product.name, product.category, product.stock, product.price], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ id: result.insertId, ...product });
        }
    });
});

app.put('/products/:id', (req, res) => {
    const id = req.params.id;
    const product = req.body;
    const sql = 'UPDATE products SET name = ?, category = ?, stock = ?, price = ? WHERE id = ?';
    db.query(sql, [product.name, product.category, product.stock, product.price, id], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ id, ...product });
        }
    });
});

app.delete('/products/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM products WHERE id = ?';
    db.query(sql, [id], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ message: 'Product deleted successfully' });
        }
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
