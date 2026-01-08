import Expense from "../models/expense.models.js";
import { calculateGeneralSavings } from "../utility/financeHelpers.js";
import Bucket from "../models/bucket.models.js";

export const createExpense = async (req, res) => {
    try 
    {
        const { amount, type, date, bucketId, note } = req.body;
        // Frontend calls GET /buckets to get the list for the dropdown menu to send BucketId

        if (!amount || !type || !date) 
        {
            return res.status(400).json({ message: 'Amount, Type, and Date are required' });
        }

        if (type === 'Manual') 
        {
            const { generalSavings } = await calculateGeneralSavings();

            if (amount > generalSavings) 
            {
                return res.status(400).json({ 
                    message: `Insufficient General Savings. You only have ₹${generalSavings} available.` 
                });
            }

            const newExpense = await Expense.create({
                amount,
                type: 'Manual',
                date: new Date(date),
                note
            });

            return res.status(201).json(newExpense);
        }
        else if (type === 'Bucket') 
        {
            if (!bucketId) 
            {
                return res.status(400).json({ message: 'Bucket ID is required for Bucket expenses' });
            }

            const bucket = await Bucket.findById(bucketId);

            if (!bucket) 
            {
                return res.status(404).json({ message: 'Bucket not found' });
            }

            const totalAvailable = bucket.currentMonthAmount + bucket.bucketFund;

            if (amount > totalAvailable) 
            {
                return res.status(400).json({ 
                    message: `Insufficient funds in ${bucket.name}. Total available: ₹${totalAvailable}` 
                });
            }

            let remainingExpense = amount;

            if (bucket.currentMonthAmount >= remainingExpense) 
            {
                bucket.currentMonthAmount -= remainingExpense;
                remainingExpense = 0;
            } 
            else
            {
                remainingExpense -= bucket.currentMonthAmount; 
                bucket.currentMonthAmount = 0;
            }

            if (remainingExpense > 0) 
            {
                bucket.bucketFund -= remainingExpense;
            }

            await bucket.save();

            const newExpense = await Expense.create({
                amount,
                type: 'Bucket',
                bucketId, // Tagging the expense so we know where it came from
                date: new Date(date),
                note
            });

            return res.status(201).json({
                message: 'Expense added and bucket updated',
                expense: newExpense,
                updatedBucketBalance: {
                    currentMonthAmount: bucket.currentMonthAmount,
                    bucketFund: bucket.bucketFund
                }
            });
        } 
        else 
        {
            return res.status(400).json({ message: 'Invalid expense type. Must be Manual or Bucket.' });
        }
    } 
    catch (error) 
    {
        res.status(500).json({ message: error.message });
    }
};

export const deleteExpense = async (req, res) => {
    try 
    {
        const { id } = req.params;

        if (!id) 
        {
            return res.status(400).json({ message: 'Expense ID is required' });
        }

        const expense = await Expense.findById(id);

        if (!expense) 
        {
            return res.status(404).json({ message: 'Expense not found' });
        }

        if (expense.type === 'Manual') 
        {
            await Expense.findByIdAndDelete(id);

            return res.status(200).json({ 
                message: 'Expense deleted. Money returned to General Savings.' 
            });
        }
        else if (expense.type === 'Bucket') 
        {   
            const bucket = await Bucket.findById(expense.bucketId);

            if (bucket) 
            {
                bucket.bucketFund += expense.amount;
                
                await bucket.save();
            }

            await Expense.findByIdAndDelete(id);

            return res.status(200).json({ 
                message: 'Expense deleted. Money refunded to Bucket Fund.',
                refundedAmount: expense.amount
            });
        }
    } 
    catch (error) 
    {
        console.error("Error deleting expense:", error);
        res.status(500).json({ message: error.message });
    }
};

export const getAllExpenses = async (req, res) => {
    try 
    {
        const expenses = await Expense.find();

        res.status(200).json(expenses);
    } 
    catch (error) 
    {
        res.status(500).json({ message: error.message });
    }
};
