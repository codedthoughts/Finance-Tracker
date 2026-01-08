import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
    amount: 
    {
        type: Number,
        required: true,
        min: 0
    },
    type: 
    {
        type: String,
        required: true,
        enum: ['Manual', 'From Bucket']
    },
    date: 
    {
        type: Date,
        required: true,
        default: Date.now
    },
    note: 
    {
        type: String,
        required: false
    }
}, 
{
    timestamps: true
});

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;