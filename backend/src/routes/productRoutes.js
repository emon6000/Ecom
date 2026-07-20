const express = require("express");
const router = express.Router();
const { 
  getProducts, 
  getProductById,
  createProduct, 
  updateProduct, 
  deleteProduct 
} = require("../controllers/productController");
const { protect, admin } = require('../middleware/authMiddleware');

// ---------------------------------------------------
// ROUTE: /api/products
// ---------------------------------------------------

router.route("/")
  .get(getProducts) // PUBLIC: Anyone can see products
  .post(protect, admin, createProduct); // PRIVATE/ADMIN: Only admins can create

// ---------------------------------------------------
// ROUTE: /api/products/:id
// ---------------------------------------------------

router.route("/:id")
  .get(getProductById) // PUBLIC: Anyone can see a single product
  .put(protect, admin, updateProduct) // PRIVATE/ADMIN: Only admins can edit
  .delete(protect, admin, deleteProduct); // PRIVATE/ADMIN: Only admins can delete

module.exports = router;