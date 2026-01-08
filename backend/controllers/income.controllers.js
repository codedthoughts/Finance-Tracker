import Income from "../models/income.models.js";
import {rolloverBuckets, distributeSalary} from "../utility/financeHelpers.js";

//AddIncome 
//Gethistory

export const addIncome = async (req, res) => {
    try {
        const { amount, type, date } = req.body;

        if (!amount || !type || !date) 
        {
            return res.status(400).json({ message: 'All fields are required' });
        }
        
        if (type === 'Salary') 
        {
            const selectedMonth = new Date(date);
            const startOfMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
            const endOfMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0);
            
            const existingSalary = await Income.findOne({
                type: 'Salary',
                date: { $gte: startOfMonth, $lte: endOfMonth }
            });
            
            if (existingSalary) 
            {
                return res.status(400).json({ 
                    message: 'Salary for this month already exists' 
                });
            }
            
            // Moving previous month's remaining CurrentMonthamount to Bucket Fund
            await rolloverBuckets();
            
            const income = await Income.create({
                amount,
                type: 'Salary',
                date: new Date(date)
            });
            
            // Distributing salary to buckets as per allocation
            await distributeSalary(amount);
            
            res.status(201).json(income);
            
        } 
        else if (type === 'Manual') 
        {
            const income = await Income.create({
                amount,
                type: 'Manual',
                date: new Date(date)
            });
            
            res.status(201).json(income);
            
        } 
        else 
        {
            res.status(400).json({ message: 'Invalid income type' });
        }
        
    } 
    catch (error) 
    {
        res.status(500).json({ message: error.message });
    }
};

export const getHistory = async (req, res) => {
    try 
    {
        const incomes = await Income.find();
        res.status(200).json(incomes);
    } 
    catch (error) 
    {
        res.status(500).json({ message: error.message });
    }
};