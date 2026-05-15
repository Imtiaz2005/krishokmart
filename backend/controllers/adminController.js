const db = require('../config/db');

// ================================
// সব Farmers দেখাও
// ================================
const getAllFarmers = (req, res) => {
    const query = `
        SELECT user_id, name, email, status, created_at
        FROM users
        WHERE role = 'farmer'
        ORDER BY created_at DESC
    `;

    db.query(query, (err, result) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        res.status(200).json(result);
    });
};

// ================================
// Farmer Approve করো
// ================================
const approveFarmer = (req, res) => {
    const farmerId = req.params.id;

    const query = `
        UPDATE users 
        SET status = 'approved' 
        WHERE user_id = ? AND role = 'farmer'
    `;

    db.query(query, [farmerId], (err, result) => {
        if (err) return res.status(500).json({ message: 'Server error' });

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: '❌ Farmer not found!' });
        }

        res.status(200).json({ message: '✅ Farmer approved!' });
    });
};

// ================================
// Farmer Reject/Delete করো
// ================================
const deleteFarmer = (req, res) => {
    const farmerId = req.params.id;

    const query = `
        DELETE FROM users 
        WHERE user_id = ? AND role = 'farmer'
    `;

    db.query(query, [farmerId], (err, result) => {
        if (err) return res.status(500).json({ message: 'Server error' });

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: '❌ Farmer not found!' });
        }

        res.status(200).json({ message: '✅ Farmer deleted!' });
    });
};

// ================================
// সব Products দেখাও (Admin)
// ================================
const getAllProducts = (req, res) => {
    const query = `
        SELECT p.product_id, p.name, p.price, p.quantity,
               u.name AS farmer_name,
               c.category_name
        FROM products p
        JOIN users u ON p.farmer_id = u.user_id
        LEFT JOIN categories c ON p.category_id = c.category_id
        ORDER BY p.created_at DESC
    `;

    db.query(query, (err, result) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        res.status(200).json(result);
    });
};

// ================================
// Product Delete করো (Admin)
// ================================
const deleteProduct = (req, res) => {
    const productId = req.params.id;

    const query = 'DELETE FROM products WHERE product_id = ?';

    db.query(query, [productId], (err, result) => {
        if (err) return res.status(500).json({ message: 'Server error' });

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: '❌ Product not found!' });
        }

        res.status(200).json({ message: '✅ Product deleted!' });
    });
};

module.exports = { 
    getAllFarmers, 
    approveFarmer, 
    deleteFarmer,
    getAllProducts,
    deleteProduct
};