const User = require("../models/user.model");
const bcrypt = require('bcrypt');
  const jwt = require('jsonwebtoken');
  require('dotenv').config();



//register  
exports.register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // Check if fields are empty
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check name length
  if (firstName.length < 3 || lastName.length < 3) {
    return res
      .status(400)
      .json({ message: "Name should be at least 3 characters" });
  }

  // Check email format
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  // Check password length
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password should be at least 6 characters" });
  }

  try {
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: await bcrypt.hash(password, 10)
    });
    await user.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};


//login user

exports.login = async (req, res) => {
  
  const { email, password } = req.body;
  
 

  try {
   // Find the user by email
   const user = await User.findOne({ email });

   if (!user) {
     return res.status(401).json({ error: 'Invalid email or password' });
   }
 
   // Compare the password with the hashed password stored in the database
   const isValidPassword = await bcrypt.compare(password, user.password);
 
   if (!isValidPassword) {
     return res.status(401).json({ error: 'Invalid email or password' });
   }
   const payload = { id: user._id,};

  // Sign token with payload and secret key
  const token = jwt.sign(payload, process.env.JWT_SECRET);
 
   // Generate a JWT token with the user ID as payload
   
   res.json({ user,token });
 
 
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }


 
  }


  exports.getUserById = async (req, res) => { 
    const { userId } = req.params;
    try {
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Send user data in response
      res.json({
        id: user._id,
        name: user.firstName,
        lastName: user.lastName,
        email: user.email
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
};