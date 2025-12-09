const express = require("express");
const Expense = require("../models/Expense");
const auth = require("../auth");

module.exports.addExpenses = async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;

    if (!title || !amount || !category || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const saveAmount = new Expense({
      title,
      amount,
      category,
      date,
    });

    await saveAmount.save();
    res.status(201).json({ expense: saveAmount });
  } catch (err) {
    console.error("Error registering user:", err.message);

    res.status(500).json({
      message: "Something went wrong while registering the user.",
      error: err.message,
    });
  }
};

module.exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.getSingleExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.status(200).json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.deleteExpenses = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json({ message: "Expense Deleted Succesfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.getTotalExpenses = async (req, res) => {
  try {
    const expense = await Expense.aggregate([
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]);
    res.status(200).json(expense[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.updateExpenses = async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;

    const expense = await Expense.findByIdAndUpdate(
      req.params.id,

      { title, amount, category, date },

      { new: true, runValidators: true }
    );

    if (!expense) {
      return res.status(404).json({ message: "Expense Not Found" });
    }

    res.status(200).json({ expense });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
