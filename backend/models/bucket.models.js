import mongoose from 'mongoose';

const bucketSchema = new mongoose.Schema({
    bucketName: 
    {
        type: String,
        required: true,
        trim: true
    },
    percentage: 
    {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    currentAllocationAmount: 
    {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    purpose: 
    {
        type: String,
        required: true,
        trim: true
    },
    currentMonthAmount: 
    {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    bucketFund: 
    {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    date: 
    {
        type: Date,
        required: true,
        default: Date.now
    }
}, 
{
    timestamps: true
});

const Bucket = mongoose.model('Bucket', bucketSchema);

export default Bucket;