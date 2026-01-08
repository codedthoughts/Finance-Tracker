import express from 'express';
import { createExpense, deleteExpense, getAllExpenses } from '../controllers/expense.controllers.js';

const router = express.Router();

router.post('/add', createExpense);
router.get('/history', getAllExpenses);
router.delete('/delete/:id', deleteExpense);

export default router;