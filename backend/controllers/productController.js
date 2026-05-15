const db = require('../config/db');

// ================================
// সব Product দেখাও (Home Page)
// ================================
const getAllProducts = (req, res) => {
    const query = `
        SELECT p.product_id, p.name, p.price, p.quantity, p.image_url,
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
// Product Search করো
// ================================
const searchProducts = (req, res) => {
    const { name, category_id, sort } = req.query;

    const searchName = name || '';
    const searchCategory = parseInt(category_id) || 0;
    const sortOrder = sort || '';

    const query = 'CALL SearchProducts(?, ?, ?)';

    db.query(query, [searchName, searchCategory, sortOrder], (err, result) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        
        // image_url already আসবে কারণ Stored Procedure এ * নেই
        // তাই Procedure update করতে হবে
        res.status(200).json(result[0]);
    });
};

// ================================
// Farmer এর নিজের Products দেখাও
// ================================
const getMyProducts = (req, res) => {
    const farmerId = req.user.userId;

    const query = `
        SELECT p.product_id, p.name, p.price, p.quantity, p.image_url,
               c.category_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.category_id
        WHERE p.farmer_id = ?
        ORDER BY p.created_at DESC
    `;

    db.query(query, [farmerId], (err, result) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        res.status(200).json(result);
    });
};

// ================================
// Product Add করো (Farmer)
// ================================
const addProduct = (req, res) => {
    const farmerId = req.user.userId;
    const { name, price, quantity, category_id, image_url } = req.body;

    const query = `
        INSERT INTO products (farmer_id, name, price, quantity, category_id, image_url)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [farmerId, name, price, quantity, category_id, image_url || null], (err, result) => {
    if (err) {
        console.log('DB Error:', err.message); // ← এটা যোগ করো
        return res.status(500).json({ message: 'Server error' });
    }
    res.status(201).json({ 
        message: '✅ Product added successfully!',
        productId: result.insertId
    });
});
};

// ================================
// Product Delete করো (Farmer)
// ================================
const deleteProduct = (req, res) => {
    const farmerId = req.user.userId;
    const productId = req.params.id;

    // নিজের product কিনা check করো
    const checkQuery = 'SELECT * FROM products WHERE product_id = ? AND farmer_id = ?';
    db.query(checkQuery, [productId, farmerId], (err, result) => {
        if (err) return res.status(500).json({ message: 'Server error' });

        if (result.length === 0) {
            return res.status(403).json({ message: '❌ Not your product!' });
        }

        const deleteQuery = 'DELETE FROM products WHERE product_id = ?';
        db.query(deleteQuery, [productId], (err) => {
            if (err) return res.status(500).json({ message: 'Server error' });
            res.status(200).json({ message: '✅ Product deleted!' });
        });
    });
};

// ================================
// Farmer Dashboard Stats
// ================================
const getFarmerStats = (req, res) => {
    const farmerId = req.user.userId;

    const query = `
        SELECT 
            COUNT(p.product_id) AS total_products,
            COALESCE(SUM(o.total_price), 0) AS total_earnings,
            COALESCE(AVG(p.price), 0) AS avg_price
        FROM products p
        LEFT JOIN orders o ON p.product_id = o.product_id
        WHERE p.farmer_id = ?
    `;

    db.query(query, [farmerId], (err, result) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        res.status(200).json(result[0]);
    });
};

module.exports = {
    getAllProducts,
    searchProducts,
    getMyProducts,
    addProduct,
    deleteProduct,
    getFarmerStats
};
