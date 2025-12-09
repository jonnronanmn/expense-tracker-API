const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expenseController");
const auth = require("../auth");

// Protected routes
router.post("/", auth.verify, expenseController.addExpenses);
router.get("/", auth.verify, expenseController.getAllExpenses);

// Put /total BEFORE /:id
router.get("/total", auth.verify, expenseController.getTotalExpenses);
router.get("/:id", auth.verify, expenseController.getSingleExpense);

router.put("/:id", auth.verify, expenseController.updateExpenses);
router.delete("/:id", auth.verify, expenseController.deleteExpenses);

module.exports = router;
