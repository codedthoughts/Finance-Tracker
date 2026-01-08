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
        enum: ['Manual', 'Bucket']
    },
    bucketId: 
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bucket',
        required: false
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