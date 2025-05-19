import { EventManager, GameEvent } from '../core/utils/EventManager';
import { Globals } from '../core/Global';
import { IReelConfig, SYMBOLS_NUMBER } from './gameConfig'; // Assuming SYMBOLS_NUMBER is the count of unique symbols (e.g., 0-8 means 9 symbols)

export interface IReelSpinOutcome {
    finalSymbols: number[][]; // Keep as number[][] for now, representing symbol IDs
    isNearWin?: boolean;
    // Potentially other data like feature triggers determined by the spin outcome
}

export class ReelController {
    private numReels: number;
    private numRows: number; // Visible rows
    private config: IReelConfig;
    private eventManager: EventManager;
    private _reelStrips: string[][] = []; // Use string[][] for internal storage
    private _symbolsList: readonly string[] = [];
    private _symbolsCount: number = 0;
    private _originalReelStrips: string[][] | null = null; // Store original reel strips when switching modes

    constructor(numReels: number, numRows: number, config: IReelConfig, 
                initialReelStrips?: readonly string[][], // Expect string[][]
                initialSymbolsList?: readonly string[]) {
        this.numReels = numReels;
        this.numRows = numRows;
        this.config = config;
        this.eventManager = EventManager.getInstance();
        this.updateData(initialReelStrips || [], initialSymbolsList || []);
        console.log('ReelController Initialized');
    }

    public updateData(reelStripsData: readonly string[][], symbolsList: readonly string[]): void { // Expect string[][]
        this._symbolsList = [...symbolsList];
        this._symbolsCount = this._symbolsList.length > 0 ? this._symbolsList.length : 9; // Fallback symbols count
        
        this._reelStrips = []; // Clear existing strips
        if (reelStripsData && reelStripsData.length === this.numReels && reelStripsData.every(strip => Array.isArray(strip))) {
            // Use provided reel strips directly
            reelStripsData.forEach(strip => this._reelStrips.push([...strip]));
            console.log('ReelController: Updated with provided reel strips.');
        } else {
            // Fallback: Initialize with empty strips if no valid data given
            console.warn('ReelController: Invalid or no reelStripsData provided. Initializing with empty strips.');
            for (let i = 0; i < this.numReels; i++) {
                this._reelStrips.push([]); // Add empty strips
            }
            // NOTE: Empty strips will cause issues in generateSpinOutcome without further handling
        }
        // console.log('ReelController Reel Strips:', this._reelStrips);
    }

    /**
     * Update just the reel strips without changing the symbols list.
     * Used when switching between normal and free spins modes.
     */
    public updateReelStrips(newReelStrips: readonly string[][]): void {
        if (!newReelStrips || newReelStrips.length !== this.numReels || !newReelStrips.every(strip => Array.isArray(strip))) {
            console.error('ReelController: Invalid reel strips format provided to updateReelStrips.');
            return;
        }

        // Store current reel strips if not already stored
        if (!this._originalReelStrips) {
            this._originalReelStrips = this._reelStrips.map(strip => [...strip]);
        }

        // Update the reel strips
        this._reelStrips = newReelStrips.map(strip => [...strip]);
        console.log('ReelController: Reel strips updated.');
    }

    /**
     * Restore original reel strips if they were stored
     */
    public restoreOriginalReelStrips(): void {
        if (this._originalReelStrips) {
            this._reelStrips = this._originalReelStrips.map(strip => [...strip]);
            this._originalReelStrips = null; // Clear the stored original
            console.log('ReelController: Original reel strips restored.');
        } else {
            console.warn('ReelController: No original reel strips to restore.');
        }
    }

    /**
     * Get all reel strips
     */
    public getReelStrips(): readonly string[][] {
        return this._reelStrips;
    }

    // Helper to shuffle an array (Fisher-Yates shuffle) - keep as is
    private shuffleArray<T>(array: T[]): T[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    /**
     * Generates the outcome of a spin, determining where each reel will stop.
     * Returns symbol IDs in finalSymbols.
     */
    public generateSpinOutcome(): IReelSpinOutcome {
        const finalReelSymbolsById: number[][] = [];
        for (let i = 0; i < this.numReels; i++) {
            const reelOutcomeIds: number[] = [];
            const strip = this._reelStrips[i]; // This is string[]

            if (!strip || strip.length === 0) {
                console.warn(`Reel strip ${i} is empty or invalid. Generating random symbol IDs.`);
                // Generate random symbol IDs as fallback
                for (let j = 0; j < this.numRows; j++) {
                    const randomSymbolId = Math.floor(Math.random() * this._symbolsCount);
                    reelOutcomeIds.push(randomSymbolId);
                }
            } else {
                const stripStopIndex = Math.floor(Math.random() * strip.length);
                for (let j = 0; j < this.numRows; j++) {
                    const symbolString = strip[(stripStopIndex + j) % strip.length];
                    const symbolId = this._symbolsList.indexOf(symbolString);
                    if (symbolId === -1) {
                        console.warn(`Symbol "${symbolString}" from strip ${i} not found in symbolsList. Using ID 0 as fallback.`);
                        reelOutcomeIds.push(0); // Fallback to first symbol ID
                    } else {
                        reelOutcomeIds.push(symbolId);
                    }
                }
            }
            finalReelSymbolsById.push(reelOutcomeIds);
        }
        
        return {
            finalSymbols: finalReelSymbolsById,
            isNearWin: this.checkForNearWin(finalReelSymbolsById) // Pass symbol IDs to near win check
        };
    }
    
    // checkForNearWin remains unchanged as it expects symbol IDs
    private checkForNearWin(finalSymbols: number[][]): boolean {
        if (!this.config.nearWinProlongSymbol || !this.config.nearWinProlongSymbolCount || this.config.nearWinProlongSymbolCount < 2) {
            return false;
        }
        let scatterCount = 0;
        // Check if nearWinProlongSymbol (ID) exists in the first few reels
        const reelsToCheck = Math.min(this.numReels, 3); // Revert to checking first 3 reels max
        for (let i = 0; i < reelsToCheck; i++) {
            for (let j = 0; j < this.numRows; j++) {
                if (finalSymbols[i] && finalSymbols[i][j] === this.config.nearWinProlongSymbol) {
                    scatterCount++;
                    break; // Only count one scatter per reel for near win check
                }
            }
        }
        // Trigger near win if the exact number of scatters are found (e.g., 2 scatters)
        return scatterCount === this.config.nearWinProlongSymbolCount;
    }

    // Return type updated to string[]
    public getReelStrip(reelIndex: number): readonly string[] {
        if (reelIndex < 0 || reelIndex >= this._reelStrips.length) {
            console.error(`Invalid reelIndex for getReelStrip: ${reelIndex}`);
            return [];
        }
        return this._reelStrips[reelIndex];
    }
    
    /**
     * Get the current symbols list
     */
    public getSymbolsList(): readonly string[] {
        return this._symbolsList;
    }

    // No changes needed for startReelsSpin
    public startReelsSpin(): void {
        console.log('ReelController: Instructing reels to start spinning.');
        // ... (no direct visual control) ...
    }

    // This method might be called by SlotScene to instruct all reels to stop based on an outcome.
    // async stopReels(outcome: IReelSpinOutcome): Promise<void[]> {
    //     console.log('ReelController: Instructing reels to stop at:', outcome.finalSymbols);
    //     // This would involve SlotScene iterating its visual Reel instances
    //     // and calling their `stopAt(outcome.finalSymbols[i])` method.
    //     // This controller itself doesn't hold references to PixiJS Reel objects.
    // }
} 