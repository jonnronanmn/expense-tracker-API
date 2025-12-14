const Expense = require("../models/Expense");

module.exports.addExpenses = async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;

    if (!title || !amount || !category || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const saveAmount = new Expense({
      userId: req.user.id, // 🔑 ADDED
      title,
      amount,
      category,
      date,
    });

    await saveAmount.save();
    res.status(201).json({ expense: saveAmount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({
      userId: req.user.id, // 🔑 ADDED
    }).sort({ date: -1 });

    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.getSingleExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.user.id, // 🔑 ADDED
    });

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
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id, // 🔑 ADDED
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json({ message: "Expense Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.getTotalExpenses = async (req, res) => {
  try {
    const expense = await Expense.aggregate([
      { $match: { userId: req.user.id } }, // 🔑 ADDED
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]);

    res.status(200).json(expense[0] || { totalAmount: 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.updateExpenses = async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;

    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id }, // 🔑 CHANGED
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
