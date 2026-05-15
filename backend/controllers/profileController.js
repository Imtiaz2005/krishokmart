const db = require('../config/db');

// ================================
// Profile দেখাও
// ================================
const getProfile = (req, res) => {
    const userId = req.user.userId;
    const role = req.user.role;

    if (role === 'buyer') {
        const query = `
            SELECT 
                u.user_id, u.name, u.email, u.role, u.created_at,
                COUNT(o.order_id) AS total_orders,
                COALESCE(SUM(o.total_price), 0) AS total_spent
            FROM users u
            LEFT JOIN orders o ON u.user_id = o.buyer_id
            WHERE u.user_id = ?
            GROUP BY u.user_id
        `;

        db.query(query, [userId], (err, result) => {
            if (err) return res.status(500).json({ message: 'Server error' });

            // Recent orders
            const ordersQuery = `
                SELECT o.order_id, o.quantity, o.total_price, o.status, o.order_date,
                       p.name AS product_name,
                       u.name AS farmer_name
                FROM orders o
                JOIN products p ON o.product_id = p.product_id
                JOIN users u ON p.farmer_id = u.user_id
                WHERE o.buyer_id = ?
                ORDER BY o.order_date DESC
                LIMIT 5
            `;

            db.query(ordersQuery, [userId], (err, orders) => {
                if (err) return res.status(500).json({ message: 'Server error' });

                res.status(200).json({
                    ...result[0],
                    recent_orders: orders
                });
            });
        });

    } else if (role === 'farmer') {
        const query = `
            SELECT 
                u.user_id, u.name, u.email, u.role, u.status, u.created_at,
                COUNT(DISTINCT p.product_id) AS total_products,
                COALESCE(SUM(o.total_price), 0) AS total_earnings,
                COUNT(DISTINCT o.order_id) AS total_orders
            FROM users u
            LEFT JOIN products p ON u.user_id = p.farmer_id
            LEFT JOIN orders o ON p.product_id = o.product_id
            WHERE u.user_id = ?
            GROUP BY u.user_id
        `;

        db.query(query, [userId], (err, result) => {
            if (err) return res.status(500).json({ message: 'Server error' });

            // Recent products
            const productsQuery = `
                SELECT p.product_id, p.name, p.price, p.quantity,
                       c.category_name
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.category_id
                WHERE p.farmer_id = ?
                ORDER BY p.created_at DESC
                LIMIT 5
            `;

            db.query(productsQuery, [userId], (err, products) => {
                if (err) return res.status(500).json({ message: 'Server error' });

                res.status(200).json({
                    ...result[0],
                    recent_products: products
                });
            });
        });
    }
};

module.exports = { getProfile };