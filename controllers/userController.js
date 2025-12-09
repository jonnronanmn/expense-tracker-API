const express = require("express");
const Users = require("../models/Users");
const bcrypt = require("bcrypt");
const auth = require("../auth");

module.exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const newUser = new Users({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error("Error registering user:", err.message);

    res.status(500).json({
      message: "Something went wrong while registering the user.",
      error: err.message,
    });
  }
};

module.exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).send({ error: "Invalid Email " });
    }

    if (!password) {
      return res.status(400).send({ error: "Password is required" });
    }

    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(400).send({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ error: "Invalid credentials" });
    }

    const token = auth.createAccessToken(user);

    return res.status(200).send({ message: "Login Successful", token: token });
  } catch (error) {
    console.error("Login error", error.message);
    return res
      .status(500)
      .send({ error: "Server Error", details: error.messgae });
  }
};

module.exports.getUserDetails = async (req, res) => {
  try {
    const user = await Users.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(400).send({ error: "User not found " });
    }
    res.status(200).send({ user });
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
};
