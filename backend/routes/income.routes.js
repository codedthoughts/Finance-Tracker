import express from 'express';
import {addIncome, getHistory} from '../controllers/income.controllers.js';

const router = express.Router();

router.post('/add', addIncome);
router.get('/history', getHistory);

export default router;