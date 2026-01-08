import { calculateGeneralSavings } from "../utility/financeHelpers.js";

export const getDashboardSummary = async (req, res) => {
    try 
    {
        const { generalSavings, netWorth, lockedFunds } = await calculateGeneralSavings();
        
        return res.status(200).json({
            generalSavings,
            netWorth,
            lockedFunds
        });
    } 
    catch (error) 
    {
        console.error("Error getting dashboard:", error);
        res.status(500).json({ message: error.message });
    }
}