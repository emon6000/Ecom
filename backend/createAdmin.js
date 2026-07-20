const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config(); // Loads your MONGO_URI from .env

const User = require("./models/User"); // Adjust this path if your user model is somewhere else!

const createAdmin = async () => {
  try {
    // 1. Connect to your database
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    // 2. Check if an admin already exists to prevent duplicates
    const adminExists = await User.findOne({ email: "admin@store.com" });
    if (adminExists) {
      console.log("Admin already exists! You can log in.");
      process.exit();
    }

    // 3. Hash the password (using 10 salt rounds)
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // 4. Create the new user
    const admin = new User({
      name: "Admin User",
      email: "admin@store.com",
      password: hashedPassword,
      // role defaults to "admin" based on your schema!
    });

    // 5. Save to the database
    await admin.save();
    console.log("SUCCESS! Admin created.");
    console.log("Email: admin@store.com");
    console.log("Password: admin123");
    
    process.exit(); // Close the script
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();