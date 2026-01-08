import Expense from '../models/expense.models.js';
import Income from '../models/income.models.js';
import Bucket from '../models/bucket.models.js';
export async function rolloverBuckets() 
{
    try 
    {
        const buckets = await Bucket.find({});

        await Promise.all(buckets.map(async (bucket) => 
        {
            if (bucket.currentMonthAmount > 0) 
            {
                bucket.bucketFund += bucket.currentMonthAmount;
                
                bucket.currentMonthAmount = 0;
                
                await bucket.save();
            }
        }));

        console.log("Rollover complete: Unspent monthly funds moved to vaults.");

        return true;

    } 
    catch (error) 
    {
        console.error("Error in rolloverBuckets:", error);
        throw error; 
    }
}

export async function distributeSalary(SalaryAmount) 
{
    try 
    {
        const buckets = await Bucket.find({});

        await Promise.all(buckets.map(async (bucket) => 
        {
            if (bucket.percentage > 0) 
            {
                const amountToAdd = SalaryAmount * (bucket.percentage / 100);
                
                bucket.currentMonthAmount += amountToAdd;

                bucket.currentAllocationAmount = amountToAdd;
                
                await bucket.save();
            }
        }));
    } 
    catch (error) 
    {
        console.error("Error in distributeSalary:", error);
        throw error;
    }
}

export async function checkTotalPercentage(newPercentage, bucketIdToExclude = null) 
{
    try 
    {
        const query = bucketIdToExclude ? { _id: { $ne: bucketIdToExclude } } : {};
        const buckets = await Bucket.find(query);
        
        const currentTotalPercentage = buckets.reduce((total, bucket) => {
            return total + bucket.percentage;
        }, 0);
        
        return currentTotalPercentage + newPercentage <= 100;
    } 
    catch (error) 
    {
        console.error("Error in checkTotalPercentage:", error);
        throw error;
    }
}

export const calculateGeneralSavings = async () => {
    try 
    {
        const allIncome = await Income.find({});
        const totalIncome = allIncome.reduce((sum, inc) => sum + inc.amount, 0);

        const allExpenses = await Expense.find({});
        const totalExpenses = allExpenses.reduce((sum, exp) => sum + exp.amount, 0);

        const allBuckets = await Bucket.find({});
        const lockedFunds = allBuckets.reduce((sum, b) => sum + b.currentMonthAmount + b.bucketFund, 0);

        const netWorth = totalIncome - totalExpenses;

        const generalSavings = netWorth - lockedFunds;

        return { generalSavings, netWorth, lockedFunds};
    } 
    catch (error) 
    {
        console.error("Error calculating savings:", error);
        throw error;
    }
};