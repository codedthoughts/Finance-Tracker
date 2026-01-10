import Bucket from "../models/bucket.models.js";
import {checkTotalPercentage, calculateGeneralSavings} from "../utility/financeHelpers.js";

export const getAllBuckets = async (req, res) => {
    try 
    {
        const buckets = await Bucket.find({});

        res.status(200).json(buckets);
    } 
    catch (error) 
    {
        res.status(500).json({ message: error.message });
    }
};

export const addBucket = async (req, res) => {
    try 
    {
        const { bucketName, percentage, purpose } = req.body;
        
        if (!bucketName || percentage === undefined || !purpose) 
        {
            return res.status(400).json({ 
                message: 'Bucket name, percentage, and purpose are required' 
            });
        }

        const numericPercentage = parseFloat(percentage);
        
        const totalPercentageCheck = await checkTotalPercentage(numericPercentage);

        if (!totalPercentageCheck) 
        {
            return res.status(400).json({ 
                message: 'Total percentage exceeds 100%' 
            });
        }
        
        const bucket = await Bucket.create({
            bucketName,
            percentage,
            purpose,
            currentAllocationAmount: 0,
            currentMonthAmount: 0,
            bucketFund: 0,
            date: new Date()
        });
        
        res.status(201).json(bucket);
        
    } 
    catch (error) 
    {
        res.status(500).json({ message: error.message });
    }
};

export const updateBucket = async (req, res) => {
    try {
        const { id } = req.params;
        const { bucketName, percentage, purpose } = req.body;

        if (!id) 
        {
            return res.status(400).json({ message: 'Bucket ID is required' });
        }

        if (!bucketName && percentage === undefined && !purpose) 
        {
            return res.status(400).json({ message: 'At least one field (bucketName, percentage, or purpose) must be provided for update' });
        }
        
        const existingBucket = await Bucket.findById(id);

        if (!existingBucket) 
        {
            return res.status(404).json({ message: 'Bucket not found' });
        }

        const numericPercentage = parseFloat(percentage);
        
        if (numericPercentage !== undefined && numericPercentage !== existingBucket.percentage) 
        {
            const allBuckets = await Bucket.find({});
            const currentTotalWithoutThisBucket = allBuckets
                .filter(bucket => bucket._id.toString() !== id)
                .reduce((total, bucket) => total + bucket.percentage, 0);
            
            if (currentTotalWithoutThisBucket + numericPercentage > 100) 
            {
                return res.status(400).json({ message: "Total allocation cannot exceed 100%" });
            }
        }
        
        const updateData = {};
        if (bucketName !== undefined) updateData.bucketName = bucketName;
        if (numericPercentage !== undefined) updateData.percentage = numericPercentage;
        if (purpose !== undefined) updateData.purpose = purpose;
        
        const updatedBucket = await Bucket.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true, runValidators: true }
        );
        
        res.status(200).json(updatedBucket);
        
    } 
    catch (error) 
    {
        res.status(500).json({ message: error.message });
    }
};

export const deleteBucket = async (req, res) => {
    try 
    {
        const { id } = req.params;

        const bucket = await Bucket.findById(id);

        if (!bucket) 
        {
            return res.status(404).json({ message: "Bucket not found" });
        }

        const releasedAmount = bucket.currentMonthAmount + bucket.bucketFund;

        await Bucket.findByIdAndDelete(id);

        res.status(200).json({ 
            message: `Bucket deleted successfully. ₹${releasedAmount} has been moved to General Savings.`,
            releasedAmount: releasedAmount
        });

    } 
    catch (error) 
    {
        res.status(500).json({ message: error.message });
    }
};

export const addFromGeneralSavings = async (req, res) => {
    try 
    {
        const { id } = req.params;
        const { amount } = req.body;

        let myamount = parseFloat(amount);

        if (!myamount || myamount <= 0) 
        {
            return res.status(400).json({ message: 'Amount must be a positive number' });
        }

        const bucket = await Bucket.findById(id);

        if (!bucket) 
        {
            return res.status(404).json({ message: 'Bucket not found' });
        }

        const generalSavings = await calculateGeneralSavings();

        if (generalSavings.generalSavings <= 0) 
        {
            return res.status(400).json({ message: 'No funds available in General Savings' });
        }

        if (generalSavings.generalSavings < myamount) 
        {
            return res.status(400).json({ message: 'Not enough balance in General Savings' });
        }

        bucket.bucketFund += myamount;

        await bucket.save();

        res.status(200).json({
            message: `₹${myamount} added to bucket successfully`,
            bucket: bucket
        });

    } 
    catch (error) 
    {
        res.status(500).json({ message: error.message });
    }
};