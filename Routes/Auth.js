const Router = require('express').Router();
const User = require('../Modules/User');
const bcrypt = require('bcrypt');

Router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, uid } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword ,uid });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    }catch (error) {
        res.status(500).json({ message: 'Server error' ,error});
        console.log('Error during signup:', error);
    }
});


Router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.json({ success: false, message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.json({ success: false, message: "Invalid password" });
  }

  res.json({
    success: true,
    message: "Login successful",
    user: {
      id: user.uid,
      email: user.email,
      name: user.name
    }
  });
});

module.exports = Router;