const db = require('../config/db');

// ================================
// Order দাও (Buyer)
// ================================
const placeOrder = (req, res) => {
    const buyerId = req.user.userId;
    const { product_id, quantity } = req.body;

    const checkProduct = 'SELECT * FROM products WHERE product_id = ?';
    db.query(checkProduct, [product_id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Server error' });

        if (result.length === 0) {
            return res.status(404).json({ message: '❌ Product not found!' });
        }

        const product = result[0];

        if (product.quantity < quantity) {
            return res.status(400).json({ 
                message: `❌ Only ${product.quantity}kg available!` 
            });
        }

        // Calculate fees
        const total_price = product.price * quantity;
        const platform_fee = total_price * 0.10;   // 10% admin
        const farmer_amount = total_price * 0.90;   // 90% farmer

        const insertOrder = `
            INSERT INTO orders 
            (buyer_id, product_id, quantity, total_price, platform_fee, farmer_amount)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        db.query(insertOrder, [buyerId, product_id, quantity, total_price, platform_fee, farmer_amount], (err, result) => {
            if (err) return res.status(500).json({ message: 'Server error' });

            res.status(201).json({
                message: '✅ Order placed successfully!',
                orderId: result.insertId,
                total_price: total_price,
                platform_fee: platform_fee,
                farmer_amount: farmer_amount
            });
        });
    });
};

// ================================
// Buyer এর Orders দেখাও
// ================================
const getMyOrders = (req, res) => {
    const buyerId = req.user.userId;

    const query = `
        SELECT o.order_id, o.quantity, o.total_price, o.platform_fee, 
               o.farmer_amount, o.status, o.order_date,
               p.name AS product_name, p.price,
               u.name AS farmer_name
        FROM orders o
        JOIN products p ON o.product_id = p.product_id
        JOIN users u ON p.farmer_id = u.user_id
        WHERE o.buyer_id = ?
        ORDER BY o.order_date DESC
    `;

    db.query(query, [buyerId], (err, result) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        res.status(200).json(result);
    });
};

// ================================
// Admin সব Orders দেখবে
// ================================
const getAllOrders = (req, res) => {
    const query = `
        SELECT o.order_id, o.quantity, o.total_price, o.platform_fee,
               o.farmer_amount, o.status, o.order_date,
               p.name AS product_name,
               buyer.name AS buyer_name,
               farmer.name AS farmer_name
        FROM orders o
        JOIN products p ON o.product_id = p.product_id
        JOIN users buyer ON o.buyer_id = buyer.user_id
        JOIN users farmer ON p.farmer_id = farmer.user_id
        ORDER BY o.order_date DESC
    `;

    db.query(query, (err, result) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        res.status(200).json(result);
    });
};

// ================================
// Admin Dashboard Stats
// ================================
const getAdminStats = (req, res) => {
    const query = `
        SELECT
            (SELECT COUNT(*) FROM users WHERE role = 'farmer') AS total_farmers,
            (SELECT COUNT(*) FROM users WHERE role = 'buyer') AS total_buyers,
            (SELECT COUNT(*) FROM products) AS total_products,
            (SELECT COUNT(*) FROM orders) AS total_orders,
            (SELECT COALESCE(SUM(total_price), 0) FROM orders) AS total_revenue,
            (SELECT COALESCE(SUM(platform_fee), 0) FROM orders) AS total_platform_income,
            (SELECT COALESCE(SUM(farmer_amount), 0) FROM orders) AS total_farmer_earnings
    `;

    db.query(query, (err, result) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        res.status(200).json(result[0]);
    });
};

// ================================
// Farmer এর কাছে আসা Orders দেখাও
// ================================
const getFarmerOrders = (req, res) => {
    const farmerId = req.user.userId;

    const query = `
        SELECT o.order_id, o.quantity, o.total_price, o.platform_fee,
               o.farmer_amount, o.status, o.order_date,
               p.name AS product_name,
               u.name AS buyer_name
        FROM orders o
        JOIN products p ON o.product_id = p.product_id
        JOIN users u ON o.buyer_id = u.user_id
        WHERE p.farmer_id = ?
        ORDER BY o.order_date DESC
    `;

    db.query(query, [farmerId], (err, result) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        res.status(200).json(result);
    });
};

// ================================
// Farmer Order Confirm করবে
// ================================
const confirmOrder = (req, res) => {
    const farmerId = req.user.userId;
    const orderId = req.params.id;

    const checkQuery = `
        SELECT o.* FROM orders o
        JOIN products p ON o.product_id = p.product_id
        WHERE o.order_id = ? AND p.farmer_id = ?
    `;

    db.query(checkQuery, [orderId, farmerId], (err, result) => {
        if (err) return res.status(500).json({ message: 'Server error' });

        if (result.length === 0) {
            return res.status(403).json({ message: '❌ Not your order!' });
        }

        const updateQuery = `
            UPDATE orders 
            SET status = 'confirmed' 
            WHERE order_id = ?
        `;

        db.query(updateQuery, [orderId], (err) => {
            if (err) return res.status(500).json({ message: 'Server error' });
            res.status(200).json({ message: '✅ Order confirmed!' });
        });
    });
};

// ================================
// Buyer Order Cancel করবে
// ================================
const cancelOrder = (req, res) => {
    const buyerId = req.user.userId;
    const orderId = req.params.id;

    const checkQuery = `
        SELECT * FROM orders 
        WHERE order_id = ? AND buyer_id = ?
    `;

    db.query(checkQuery, [orderId, buyerId], (err, result) => {
        if (err) return res.status(500).json({ message: 'Server error' });

        if (result.length === 0) {
            return res.status(403).json({ message: '❌ Not your order!' });
        }

        if (result[0].status === 'confirmed') {
            return res.status(400).json({ 
                message: '❌ Confirmed order cancel করা যাবে না!' 
            });
        }

        // Quantity ফেরত দাও
        const restoreQuery = `
            UPDATE products 
            SET quantity = quantity + ?
            WHERE product_id = ?
        `;

        db.query(restoreQuery, [result[0].quantity, result[0].product_id], (err) => {
            if (err) return res.status(500).json({ message: 'Server error' });

            const cancelQuery = `
                UPDATE orders 
                SET status = 'cancelled' 
                WHERE order_id = ?
            `;

            db.query(cancelQuery, [orderId], (err) => {
                if (err) return res.status(500).json({ message: 'Server error' });
                res.status(200).json({ message: '✅ Order cancelled!' });
            });
        });
    });
};

module.exports = { 
    placeOrder, 
    getMyOrders, 
    getAllOrders, 
    getAdminStats,
    getFarmerOrders,
    confirmOrder,
    cancelOrder
};