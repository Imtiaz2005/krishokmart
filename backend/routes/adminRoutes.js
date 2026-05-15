const express = require('express');
const router = express.Router();
const {
    getAllFarmers,
    approveFarmer,
    deleteFarmer,
    getAllProducts,
    deleteProduct
} = require('../controllers/adminController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// সব routes এ Admin token লাগবে
router.get('/farmers', verifyToken, isAdmin, getAllFarmers);
router.put('/farmers/approve/:id', verifyToken, isAdmin, approveFarmer);
router.delete('/farmers/delete/:id', verifyToken, isAdmin, deleteFarmer);
router.get('/products', verifyToken, isAdmin, getAllProducts);
router.delete('/products/delete/:id', verifyToken, isAdmin, deleteProduct);

module.exports = router;