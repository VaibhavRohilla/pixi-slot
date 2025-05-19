
// Placeholder for currency formatting, import if needed from a utils file
const formatCurrency = (amount: number, symbol?: string, decimals?: number) => `${symbol || '$'}${amount.toFixed(decimals || 2)}`;

export class PayTable {
    private payoutTableData: readonly number[][] = [];
    private scatterPayoutTableData: readonly number[][] = [];
    private lineBet: number = 1; 
    
    constructor(paytableData: readonly number[][], scatterPaytableData?: readonly number[][]) {
        this.payoutTableData = paytableData || [];
        this.scatterPayoutTableData = scatterPaytableData || [];
        if (this.payoutTableData.length === 0) {
            console.warn("PayTable initialized with empty paytableData!");
        }
    }

    public setLineBet(lineBet: number): void {
        this.lineBet = Math.max(0.01, lineBet); // Line bet can be fractional
    }
    
    public getWinAmount(symbolId: number, count: number): number { 
        if (count < 1) return 0; // Some games might pay for 1 or 2 (e.g. scatters, high symbols)
                                 // For standard lines, often starts at 3.
                                 // This logic depends on how paytableData is structured.
                                 // Assuming paytableData[symbolId] is an array where index = count-1 or count-minMatch
        
        // Example: if paytableData[symbolId] = [0, 0, 50, 200, 500] (0 for 1x,2x; 50 for 3x)
        // then payoutIndex should be count - 1. And check count >= 3 (or min match for that symbol)
        const minMatch = 3; // Default min matches for a line win, could be symbol-specific
        if (count < minMatch) return 0;

        if (symbolId < 0 || symbolId >= this.payoutTableData.length || !this.payoutTableData[symbolId]) {
            return 0;
        }
        
        const symbolPayouts = this.payoutTableData[symbolId];
        // Assuming symbolPayouts array is indexed by [matches - minMatch]
        // e.g., for minMatch=3: symbolPayouts[0] is 3-of-a-kind, symbolPayouts[1] is 4-of-a-kind
        const payoutIndex = count - minMatch; 
        
        if (payoutIndex < 0 || payoutIndex >= symbolPayouts.length) {
            return 0;
        }
        
        const payoutMultiplier = symbolPayouts[payoutIndex];
        if (payoutMultiplier > 0) {
            return payoutMultiplier * this.lineBet;
        }
        return 0;
    }

    public getScatterWinAmount(symbolId: number, scatterCount: number, totalBet: number): number {
        // Assumes scatterPayoutTableData[symbolId][scatterCount-1] = total bet multiplier or fixed amount
        if (scatterCount < 1) return 0;
        if (symbolId < 0 || symbolId >= this.scatterPayoutTableData.length || !this.scatterPayoutTableData[symbolId]) {
            return 0;
        }
        const scatterPayouts = this.scatterPayoutTableData[symbolId];
        const payoutIndex = scatterCount - 1; // e.g., scatterPayouts[2] is for 3 scatters

        if (payoutIndex < 0 || payoutIndex >= scatterPayouts.length) {
            return 0;
        }
        const payoutValue = scatterPayouts[payoutIndex];
        if (payoutValue > 0) {
            // Scatter payouts are often multipliers of TOTAL bet, or fixed amounts
            // This needs to be clarified by the game's paytable design.
            // Assuming it's a multiplier of totalBet for now.
            return payoutValue * totalBet; 
        }
        return 0;
    }
} 