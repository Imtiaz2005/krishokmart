const express = require('express');
const router = express.Router();
const { 
    placeOrder, 
    getMyOrders, 
    getAllOrders,
    getAdminStats,
    getFarmerOrders,
    confirmOrder,
    cancelOrder
} = require('../controllers/orderController');
const { verifyToken, isBuyer, isAdmin, isFarmer } = require('../middleware/authMiddleware');

// Buyer routes
router.post('/place', verifyToken, isBuyer, placeOrder);
router.get('/my-orders', verifyToken, isBuyer, getMyOrders);
router.put('/cancel/:id', verifyToken, isBuyer, cancelOrder);

// Farmer routes
router.get('/farmer-orders', verifyToken, isFarmer, getFarmerOrders);
router.put('/confirm/:id', verifyToken, isFarmer, confirmOrder);

// Admin routes
router.get('/all', verifyToken, isAdmin, getAllOrders);
router.get('/stats', verifyToken, isAdmin, getAdminStats);

module.exports = router;