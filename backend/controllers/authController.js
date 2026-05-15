 const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// ================================
// SIGNUP
// ================================
const signup = (req, res) => {
    const { name, email, password, role } = req.body;

    // আগে check করো email already আছে কিনা
    const checkEmail = 'SELECT * FROM users WHERE email = ?';
    db.query(checkEmail, [email], (err, result) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        
        if (result.length > 0) {
            return res.status(400).json({ message: '❌ Email already exists!' });
        }

        // Password encrypt করো
        const hashedPassword = bcrypt.hashSync(password, 10);

        // User save করো
        const insertUser = 'INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)';
        
        // Farmer হলে pending, বাকিরা approved
        const status = role === 'farmer' ? 'pending' : 'approved';

        db.query(insertUser, [name, email, hashedPassword, role, status], (err, result) => {
            if (err) return res.status(500).json({ message: 'Server error' });
            
            res.status(201).json({ 
                message: '✅ Signup successful!',
                userId: result.insertId
            });
        });
    });
};

// ================================
// LOGIN
// ================================
const login = (req, res) => {
    const { email, password } = req.body;

    // Email দিয়ে user খোঁজো
    const findUser = 'SELECT * FROM users WHERE email = ?';
    db.query(findUser, [email], (err, result) => {
        if (err) return res.status(500).json({ message: 'Server error' });

        if (result.length === 0) {
            return res.status(400).json({ message: '❌ User not found!' });
        }

        const user = result[0];

        // Farmer approved কিনা check করো
        if (user.role === 'farmer' && user.status === 'pending') {
            return res.status(403).json({ message: '⏳ Wait for admin approval!' });
        }

        // Password check করো
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: '❌ Wrong password!' });
        }

        // Token বানাও
        const token = jwt.sign(
            { userId: user.user_id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: '✅ Login successful!',
            token,
            user: {
                id: user.user_id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    });
};

module.exports = { signup, login };
