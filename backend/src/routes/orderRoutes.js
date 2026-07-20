const express = require('express');
const router = express.Router();
// Import the new function name
const { addOrderItems, getOrders, updateOrderStatus } = require('../controllers/orderController');

router.post('/', addOrderItems);
router.get('/', getOrders);
// Change the route to /status and use the new controller function
router.put('/:id/status', updateOrderStatus); 

module.exports = router;