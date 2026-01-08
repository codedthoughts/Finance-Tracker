import mongoose from 'mongoose';

const incomeSchema = new mongoose.Schema({
    amount: 
    {
        type: Number,
        required: true,
        min: 0
    },
    date: 
    {
        type: Date,
        required: true,
        default: Date.now
    },
    type: 
    {
        type: String,
        required: true,
        enum: ['Salary', 'Manual']
    }
}, 
{
    timestamps: true
});

const Income = mongoose.model('Income', incomeSchema);

export default Income;