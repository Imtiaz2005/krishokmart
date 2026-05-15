const express = require('express');
const router = express.Router();
const { 
    getAllProducts,
    searchProducts,
    getMyProducts,
    addProduct,
    deleteProduct,
    getFarmerStats
} = require('../controllers/productController');
const { verifyToken, isFarmer } = require('../middleware/authMiddleware');

// Public routes (Login লাগবে না)
router.get('/', getAllProducts);
router.get('/search', searchProducts);

// Farmer only routes (Login + Farmer লাগবে)
router.get('/my-products', verifyToken, isFarmer, getMyProducts);
router.get('/stats', verifyToken, isFarmer, getFarmerStats);
router.post('/add', verifyToken, isFarmer, addProduct);
router.delete('/delete/:id', verifyToken, isFarmer, deleteProduct);

module.exports = router;