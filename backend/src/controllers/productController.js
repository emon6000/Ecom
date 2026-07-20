const Product = require("../models/Product");

// @desc    Fetch all products (Public & Admin)
// @route   GET /api/products
const getProducts = async (req, res) => {
  try {
    // We pull all products here so the Admin can see everything (including hidden ones).
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Create a single product (Admin only)
// @route   POST /api/products
const createProduct = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      price, 
      category, 
      images, 
      videoLink, 
      countInStock, 
      discount,
      isHidden // <-- Added here
    } = req.body;

    const product = new Product({ 
      name, 
      description, 
      price, 
      category, 
      images,
      videoLink,
      countInStock,
      discount,
      isHidden // <-- Added here
    });
    
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: "Invalid product data", error: error.message });
  }
};

// @desc    Update a product (Admin only)
// @route   PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const { 
      name, 
      price, 
      description, 
      images, 
      videoLink, 
      category, 
      countInStock, 
      discount,
      isHidden // <-- Added here
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price || product.price;
      product.description = description || product.description;
      product.images = images || product.images;
      product.videoLink = videoLink || product.videoLink;
      product.category = category || product.category;
      product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;
      product.discount = discount !== undefined ? discount : product.discount;
      product.isHidden = isHidden !== undefined ? isHidden : product.isHidden; // <-- Added here

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to update product", error: error.message });
  }
};

// @desc    Delete a product (Admin only)
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.json({ message: "Product removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product" });
  }
};

module.exports = { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
};