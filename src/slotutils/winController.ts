import { paylines as configuredPaylines } from './gameConfig';
import { PayTable } from './PayTable'; // Import new PayTable

// Re-define PayTable here or import from a shared location if you move it from SlotScene.ts
// For this example, let's assume it might be passed in or defined/imported.
// If SlotScene.ts PayTable is not exported, we'd need to duplicate or move it.
// For now, to make this self-contained for creation, I'll include a simplified PayTable definition.
// Ideally, you'd have one PayTable definition for the whole game.

// Assuming PayTable class will be imported or available in the scope 
// where WinController is instantiated and the instance is passed to the constructor.
// import { PayTable } from '../core/PayTable'; // Example if PayTable is moved

// Remove the internal PayTable definition from here.
// The constructor will expect a PayTable instance to be injected.

export interface ICalculatedWinLine {
    lineIndex: number;      // Index of the payline in the paylines array
    symbolId: number;       // ID of the winning symbol (non-wild, or wild if only wilds)
    count: number;          // Number of matching symbols (including wilds)
    winAmount: number;      // Amount won for this line
    positions: number[];    // The row positions on each reel that form this win (e.g., [0,0,0] for top line)
}

export interface ISpinWinInfo {
    winningLines: ICalculatedWinLine[];
    totalWinAmount: number;
    awardedFreeSpins?: { count: number, multiplier: number, triggerSymbolId?: number }; // Added for free spins
}

// Define config interface for WinController
export interface IWinControllerConfig {
    wildSymbolId?: number;
    scatterSymbolId?: number;
    minScattersForFreeSpins?: number;
    freeSpinsAwardCount?: number;
    freeSpinsAwardMultiplier?: number;
}

export class WinController {
    private _paylines: readonly number[][]; 
    private _payTable: PayTable; 
    private _numReels: number;
    private _wildSymbolId: number | undefined; 
    private _scatterSymbolId: number | undefined;
    private _minScattersForFreeSpins: number; // Will have a default
    private _freeSpinsAwardCount: number;     // Will have a default
    private _freeSpinsAwardMultiplier: number;// Will have a default

    constructor(
        payTable: PayTable, 
        numReels: number, 
        paylines: readonly number[][], 
        config: IWinControllerConfig = {} // Use the new interface
    ) {
        this._payTable = payTable;
        this._paylines = paylines; 
        this._numReels = numReels; 
        
        this._wildSymbolId = config.wildSymbolId;
        this._scatterSymbolId = config.scatterSymbolId; // Assign from config
        
        // Apply defaults for FS properties if not provided in config
        this._minScattersForFreeSpins = config.minScattersForFreeSpins ?? 3;
        this._freeSpinsAwardCount = config.freeSpinsAwardCount ?? 10;
        this._freeSpinsAwardMultiplier = config.freeSpinsAwardMultiplier ?? 1;

        // Default scatterSymbolId if not in config (e.g. from a global const or first symbol)
        // For now, if undefined, scatter logic will be skipped.
        // This is better than hardcoding to a specific index like 6 if the data isn't there.
        if (this._scatterSymbolId === undefined) {
            console.warn('WinController: scatterSymbolId not provided in config. Scatter wins/FS might not work.');
        }

        console.log(`WinController Initialized. Config:`, JSON.stringify(config));
    }

    public calculateWins(finalSymbols: number[][], totalBetAmount: number): ISpinWinInfo {
        const lineWinResult = this.calculateLineWins(finalSymbols);
        const winningLines: ICalculatedWinLine[] = lineWinResult.winningLines;
        let totalLineWinAmount = lineWinResult.totalLineWinAmount;
        
        let awardedFreeSpins: { count: number, multiplier: number, triggerSymbolId?: number } | undefined = undefined;
        let scatterCount = 0;
        let totalScatterWin = 0;

        if (typeof this._scatterSymbolId === 'number') {
            const gameScatterSymbolId = this._scatterSymbolId;

            for (let reelIdx = 0; reelIdx < this._numReels; reelIdx++) {
                if (finalSymbols[reelIdx]) {
                    for (let rowIdx = 0; rowIdx < finalSymbols[reelIdx].length; rowIdx++) {
                        if (finalSymbols[reelIdx][rowIdx] === gameScatterSymbolId) {
                            scatterCount++;
                        }
                    }
                }
            }

            if (scatterCount > 0) {
                const scatterWinAmount = this._payTable.getScatterWinAmount(gameScatterSymbolId, scatterCount, totalBetAmount);
                if (scatterWinAmount > 0) {
                    totalScatterWin = scatterWinAmount;
                }
            }

            if (scatterCount >= this._minScattersForFreeSpins) {
                console.log(`WinController: Awarding ${this._freeSpinsAwardCount} free spins with multiplier x${this._freeSpinsAwardMultiplier}`);
                awardedFreeSpins = {
                    count: this._freeSpinsAwardCount,
                    multiplier: this._freeSpinsAwardMultiplier,
                    triggerSymbolId: gameScatterSymbolId
                };
            }
        }

        return {
            winningLines,
            totalWinAmount: totalLineWinAmount + totalScatterWin,
            awardedFreeSpins
        };
    }

    private calculateLineWins(finalSymbols: number[][]): { winningLines: ICalculatedWinLine[], totalLineWinAmount: number } {
        const winningLines: ICalculatedWinLine[] = [];
        let totalLineWinAmount = 0;
        const isWildDefined = typeof this._wildSymbolId === 'number';

        for (let lineIndex = 0; lineIndex < this._paylines.length; lineIndex++) {
            const paylineDefinition = this._paylines[lineIndex];
            if (paylineDefinition.length !== this._numReels) continue; 

            let symbolToCheckFor: number | undefined = undefined;
            let winCount = 0;
            let effectiveWinSymbolId: number = -1;

            for (let reelIdx = 0; reelIdx < this._numReels; reelIdx++) {
                const symbolRowOnReel = paylineDefinition[reelIdx];
                if (finalSymbols[reelIdx]?.[symbolRowOnReel] === undefined) break;
                const currentSymbolId = finalSymbols[reelIdx][symbolRowOnReel];
                const isCurrentSymbolWild = isWildDefined && currentSymbolId === this._wildSymbolId;

                if (reelIdx === 0) {
                    if (isCurrentSymbolWild && isWildDefined) { 
                        const wildId = this._wildSymbolId;
                        symbolToCheckFor = wildId;
                        effectiveWinSymbolId = wildId as number; 
                        winCount++;
                    } else if (!isCurrentSymbolWild) {
                        symbolToCheckFor = currentSymbolId;
                        effectiveWinSymbolId = currentSymbolId;
                        winCount++;
                    } else {
                        break; 
                    }
                } else { 
                    if (isCurrentSymbolWild) {
                        winCount++;
                    } else if (typeof symbolToCheckFor === 'number' && isWildDefined && symbolToCheckFor === this._wildSymbolId) {
                        symbolToCheckFor = currentSymbolId;
                        effectiveWinSymbolId = currentSymbolId; 
                        winCount++;
                    } else if (currentSymbolId === symbolToCheckFor) {
                        winCount++;
                    } else {
                        break; 
                    }
                }
            }

            if (effectiveWinSymbolId !== -1) {
                const winAmount = this._payTable.getWinAmount(effectiveWinSymbolId, winCount);
                if (winAmount > 0) {
                    winningLines.push({
                        lineIndex,
                        symbolId: effectiveWinSymbolId,
                        count: winCount,
                        winAmount,
                        positions: paylineDefinition.slice(0, winCount)
                    });
                    totalLineWinAmount += winAmount;
                }
            }
        }
        return { winningLines, totalLineWinAmount };
    }
} 