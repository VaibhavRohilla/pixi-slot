import * as PIXI from 'pixi.js';
import * as TWEEN from '@tweenjs/tween.js';
import { EventManager, GameEvent } from '../core/utils/EventManager';
import { Globals } from '../core/Global';
import { PixiSymbol, IPixiSymbolConfig, PixiSymbolState } from './PixiSymbol';

// Define these interfaces more thoroughly based on Phaser's Reel & spin logic
export interface IPixiReelConfig {
    reelId: number;
    numSymbolsVisible: number; // e.g., 3
    symbolHeight: number;
    symbolWidth: number;
    reelStripDefaultLength?: number; // e.g., 22, for the backing data array
    paddingSymbols?: number; // e.g., 1 top, 1 bottom for tweening appearance
    
    symbolConfig: IPixiSymbolConfig; // Config to pass to each PixiSymbol

    // Spin animation parameters
    spinStartOffset?: number; // Initial offset before main spin distance
    spinDistanceFactor?: number; // Multiplier for reel strip length for spin distance
    spinBaseDuration?: number; // Base duration for the main spin part
    spinStaggerDelayFactor?: number; // ms per reel index for staggered start/stop
    bounceHeight?: number; // For stop animation
    bounceDuration?: number;
    turboDurationFactor?: number;
    
    nearWinProlongDuration?: number; // Extra duration if prolonging
}

export interface IPixiReelSpinParams {
    targetSymbols: number[]; // Array of symbol IDs to land on (length should match numSymbolsVisible)
    isTurbo?: boolean;
    shouldProlong?: number; // Factor or duration for prolonging this reel's spin
    isProlongInitial?: boolean;
}

const DEFAULT_REEL_CONFIG: Pick<IPixiReelConfig, 'numSymbolsVisible' | 'reelStripDefaultLength' | 'paddingSymbols' | 'spinBaseDuration' | 'spinStaggerDelayFactor'> = {
    numSymbolsVisible: 3,
    reelStripDefaultLength: 22,
    paddingSymbols: 1,
    spinBaseDuration: 1000,
    spinStaggerDelayFactor: 200,
};

// Type for a factory function that creates PixiSymbol instances
export type PixiSymbolFactory = (symbolId: number, config: IPixiSymbolConfig, x: number, y: number) => PixiSymbol;

export class PixiReel extends PIXI.Container {
    public readonly reelId: number;
    private config: IPixiReelConfig & typeof DEFAULT_REEL_CONFIG;
    private eventManager: EventManager;
    private symbolFactory: PixiSymbolFactory;

    private symbols: PixiSymbol[] = []; // Active PixiSymbol instances in the display window + padding
    private reelStrip: number[] = [];   // Underlying data strip of symbol IDs
    private currentYOffset: number = 0; // Master Y offset for the visual reel strip position
    private spinTween: TWEEN.Tween<{ yOffset: number }> | null = null;
    private _isSpinning: boolean = false;
    private maskGraphic: PIXI.Graphics | null = null;

    private currentTargetSymbols: number[] | null = null; // Store target symbols for current spin
    private _paddingSymbols: number; // Defaulted padding symbols

    public isStoppingFast: boolean = false;
    public canStopManually: boolean = false; // Flag for player-initiated stop

    constructor(reelId: number, config: IPixiReelConfig, symbolFactory?: PixiSymbolFactory) {
        super();
        this.reelId = reelId;
        this.config = { ...DEFAULT_REEL_CONFIG, ...config };
        this.eventManager = EventManager.getInstance();
        this._paddingSymbols = this.config.paddingSymbols ?? 0; // Initialize with default
        
        this.symbolFactory = symbolFactory || 
            ((id, cfg, x, y) => new PixiSymbol(id, cfg, x, y)); // Default factory

        this.initializeReelStrip();
        this.createVisibleSymbols();
        this.applyMask();
        
        this.positionSymbols(); // Initial positioning
        console.log(`PixiReel ${this.reelId} Initialized`);
    }

    private initializeReelStrip(initialSymbols?: number[]): void {
        this.reelStrip = [];
        const length = (this.config.reelStripDefaultLength || 22) + (this._paddingSymbols * 2);
        if (initialSymbols && initialSymbols.length >= this.config.numSymbolsVisible) {
            for(let i = 0; i < this.config.numSymbolsVisible; i++) {
                this.reelStrip[this._paddingSymbols + i] = initialSymbols[i];
            }
        }
        for (let i = 0; i < length; i++) {
            if (this.reelStrip[i] === undefined) { 
                 this.reelStrip[i] = Math.floor(Math.random() * (this.config.symbolConfig.staticSymbolAtlasKey ? 10: 1)); 
            }
        }
        this.currentYOffset = 0; // Or position to show specific symbols from strip
    }

    private createVisibleSymbols(): void {
        const numToCreate = this.config.numSymbolsVisible + (this._paddingSymbols * 2);
        for (let i = 0; i < numToCreate; i++) {
            // Initial symbol ID from strip, initial Y position will be set by positionSymbols
            const symbolId = this.reelStrip[i] || 0;
            const symbol = this.symbolFactory(symbolId, this.config.symbolConfig, 0, 0);
            this.symbols.push(symbol);
            this.addChild(symbol);
        }
    }

    public updateSymbolsOnStrip(targetSymbols: number[]): void {
        // This updates the part of the reelStrip that corresponds to the final landing position.
        // Phaser's Reel.ts used indices 20, 21, 22 for a strip of 24 (0-23) where visible are 1,2,3.
        // Assuming targetSymbols are for the visible area (this.config.numSymbolsVisible)
        // And they should land at a conceptual 'stopIndex' on the strip (e.g., padding + visible area).
        if (targetSymbols.length !== this.config.numSymbolsVisible) {
            console.warn(`PixiReel ${this.reelId}: targetSymbols length mismatch.`);
            return;
        }
        const stopIndexBase = this._paddingSymbols; // Where the first visible symbol would be after spin
        for (let i = 0; i < targetSymbols.length; i++) {
            // Determine where on the reelStrip these target symbols should be placed for the stop
            // This needs to align with how the spin tween calculates its final yOffset.
            // Placeholder: Place them at a fixed conceptual "landing zone" on the strip.
            // The actual strip indices will depend on the strip length and how yOffset maps to it.
            const stripLandingIndex = (this.reelStrip.length - this._paddingSymbols - this.config.numSymbolsVisible + i) % this.reelStrip.length;
            this.reelStrip[stripLandingIndex] = targetSymbols[i];
        }
        console.log(`PixiReel ${this.reelId}: Strip updated for landing:`, targetSymbols);
    }
    
    // Main method to update visual positions of symbols based on currentYOffset
    private positionSymbols(): void {
        const symbolHeight = this.config.symbolHeight;
        const totalStripHeight = this.reelStrip.length * symbolHeight;

        this.symbols.forEach((symbolInstance, i) => {
            // Calculate the effective Y position of this symbol slot considering the master offset and wrapping
            let symbolSlotBaseY = (i - this._paddingSymbols) * symbolHeight; // Base Y if no offset
            let effectiveY = symbolSlotBaseY - this.currentYOffset;

            // Handle wrapping around the reel strip
            effectiveY = (effectiveY % totalStripHeight + totalStripHeight) % totalStripHeight;
            
            // Determine which symbol from the strip should be at this visual position
            // This requires mapping effectiveY back to a strip index.
            // The symbol instance at display index `i` should show the symbol from strip at `stripIndex`.
            let stripIndex = Math.floor(this.currentYOffset / symbolHeight) + (i - this._paddingSymbols);
            stripIndex = (stripIndex % this.reelStrip.length + this.reelStrip.length) % this.reelStrip.length;

            const newSymbolId = this.reelStrip[stripIndex];
            if (symbolInstance.symbolId !== newSymbolId || symbolInstance.getCurrentState() !== PixiSymbolState.IDLE) {
                 // Only update if symbol or state changes (avoids resetting animation constantly during spin)
                 if(this._isSpinning && symbolInstance.getCurrentState() !== PixiSymbolState.IDLE){
                    // Potentially set to a blur state if spinning fast
                 } else {
                    symbolInstance.setSymbol(newSymbolId, PixiSymbolState.IDLE);
                 }
            }
            symbolInstance.y = effectiveY - (this.config.numSymbolsVisible * symbolHeight / 2) + (symbolHeight/2) ; // Center symbols in mask
            symbolInstance.x = this.config.symbolWidth / 2; // Center horizontally in reel container
        });
    }

    public spin(params: IPixiReelSpinParams): void {
        if (this._isSpinning) return;
        this._isSpinning = true;
        this.isStoppingFast = false;
        this.canStopManually = false; 
        this.currentTargetSymbols = params.targetSymbols; 

        this.updateSymbolsOnStrip(params.targetSymbols);
        this.eventManager.emit(GameEvent.REEL_SPIN_STARTED as any, { reelId: this.reelId });

        const symbolHeight = this.config.symbolHeight;
        const stripLengthPx = this.reelStrip.length * symbolHeight;
        
        // Target Y offset for symbols to align for the bounce sequence to start correctly
        const preBounceTargetYOffset = (this.reelStrip.length - this._paddingSymbols - this.config.numSymbolsVisible) * symbolHeight;

        const numFullRotations = 2 + (this.config.spinDistanceFactor || 2) + (params.shouldProlong || 0); // Added spinDistanceFactor
        
        let normalizedCurrentYOffset = (this.currentYOffset % stripLengthPx + stripLengthPx) % stripLengthPx;
        let totalTravelDistance = (numFullRotations * stripLengthPx) + preBounceTargetYOffset - normalizedCurrentYOffset;
        if (totalTravelDistance <= symbolHeight * 2) { // Ensure at least a bit more than a couple of symbols travel
            totalTravelDistance += stripLengthPx; 
        }

        // Durations
        let baseSpinDuration = (this.config.spinBaseDuration || 1000) + (this.reelId * (this.config.spinStaggerDelayFactor || 100));
        if(params.isTurbo) baseSpinDuration *= (this.config.turboDurationFactor ?? 0.5);
        if(params.shouldProlong && this.config.nearWinProlongDuration) baseSpinDuration += this.config.nearWinProlongDuration * (params.shouldProlong || 1);

        const initialKickOffDuration = Math.min(150, baseSpinDuration * 0.1);
        const preStopSlowdownDuration = Math.min(250, baseSpinDuration * 0.2);
        const mainSpinLoopDuration = Math.max(100, baseSpinDuration - initialKickOffDuration - preStopSlowdownDuration);

        // Distances
        const initialKickOffDistance = symbolHeight * 1.5; // Move one and a half symbols
        const preStopSlowdownDistance = symbolHeight * 2;   // Slow down over two symbols height before preBounceTarget
        const mainSpinLoopDistance = totalTravelDistance - initialKickOffDistance - preStopSlowdownDistance;

        if (this.spinTween) this.spinTween.stop(); // Stop any previous tween
        const spinData = { yOffset: this.currentYOffset }; 

        const startY = this.currentYOffset;
        const kickOffEndY = startY + initialKickOffDistance;
        const mainSpinEndY = kickOffEndY + mainSpinLoopDistance;
        const preStopEndY = mainSpinEndY + preStopSlowdownDistance; // This should align close to a multiple of strip + preBounceTargetYOffset

        // Stage 1: Initial Kick-off
        this.spinTween = new TWEEN.Tween(spinData)
            .to({ yOffset: kickOffEndY }, initialKickOffDuration)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(() => {
                this.currentYOffset = spinData.yOffset;
                this.positionSymbols();
            })
            .onComplete(() => {
                if (!this._isSpinning && !this.isStoppingFast) return; // Check if stopSpin was called
                // Stage 2: Main Spin Loop
                this.spinTween = new TWEEN.Tween(spinData)
                    .to({ yOffset: mainSpinEndY }, mainSpinLoopDuration)
                    .easing(TWEEN.Easing.Linear.None)
                    .onUpdate(() => {
                        this.currentYOffset = spinData.yOffset;
                        this.positionSymbols();
                    })
                    .onComplete(() => {
                        if (!this._isSpinning && !this.isStoppingFast) return;
                        // Stage 3: Pre-Stop Slowdown
                        this.spinTween = new TWEEN.Tween(spinData)
                            .to({ yOffset: preStopEndY }, preStopSlowdownDuration)
                            .easing(TWEEN.Easing.Quadratic.Out)
                            .onUpdate(() => {
                                this.currentYOffset = spinData.yOffset;
                                this.positionSymbols();
                            })
                            .onComplete(() => {
                                if (!this._isSpinning && !this.isStoppingFast) return;
                                this.currentYOffset = preStopEndY; // Ensure it ends at the calculated pre-bounce spot
                                this.positionSymbols();
                                this.performStopBounce(params, preBounceTargetYOffset);
                            })
                            .start();
                    })
                    .start();
            })
            .onStart(() => { setTimeout(() => { if(this._isSpinning) this.canStopManually = true; }, 250); })
            .start();
    }

    private performStopBounce(params: IPixiReelSpinParams, finalYOffset: number): void {
        const symbolHeight = this.config.symbolHeight;
        const bounceHeight = this.config.bounceHeight || symbolHeight * 0.2; // Smaller default bounce for normal stop
        const bounceDuration1 = (this.config.bounceDuration || 150) * 0.5; 
        const bounceDuration2 = (this.config.bounceDuration || 150) * 0.5; 

        const stopData = { yOffset: this.currentYOffset };

        // Adjust finalYOffset to be the closest one to currentYOffset (considering strip wraps)
        // The main spin tween should have brought currentYOffset close to a point where finalYOffset is the target landing.
        // We might need to normalize finalYOffset relative to currentYOffset after a long spin.
        let numWraps = Math.floor(this.currentYOffset / (this.reelStrip.length * symbolHeight));
        let adjustedFinalYOffset = finalYOffset + numWraps * (this.reelStrip.length * symbolHeight);
        // If still behind, add one more strip length. If too far ahead, subtract.
        while (adjustedFinalYOffset < this.currentYOffset - symbolHeight * this.config.numSymbolsVisible) { // give some margin
            adjustedFinalYOffset += (this.reelStrip.length * symbolHeight);
        }
        while (adjustedFinalYOffset > this.currentYOffset + symbolHeight * this.config.numSymbolsVisible) {
            adjustedFinalYOffset -= (this.reelStrip.length * symbolHeight);
        }
        // Final check: if currentYOffset is very close to adjustedFinalYOffset but slightly past it due to tween precision,
        // ensure the overshoot goes in the correct direction (usually down slightly then up).
        // The initial spin should end *before* or *at* the point from which the overshoot begins.
        // For simplicity, let's assume the main spin tween lands currentYOffset correctly for the bounce to start.
        // The overshoot will be from currentYOffset to adjustedFinalYOffset + bounceHeight

        this.spinTween = new TWEEN.Tween(stopData)
            .to({ yOffset: adjustedFinalYOffset + bounceHeight }, bounceDuration1)
            .easing(TWEEN.Easing.Circular.Out) 
            .onUpdate(() => {
                this.currentYOffset = stopData.yOffset;
                this.positionSymbols();
            })
            .onComplete(() => {
                this.spinTween = new TWEEN.Tween(stopData)
                    .to({ yOffset: adjustedFinalYOffset }, bounceDuration2)
                    .easing(TWEEN.Easing.Bounce.Out) 
                    .onUpdate(() => {
                        this.currentYOffset = stopData.yOffset;
                        this.positionSymbols();
                    })
                    .onComplete(() => {
                        this.currentYOffset = adjustedFinalYOffset; 
                        this.positionSymbols(); 
                        this.onSpinComplete(params); // Call original onSpinComplete for finalization
                    })
                    .start();
            })
            .start();
    }

    private async onSpinComplete(params: IPixiReelSpinParams): Promise<void> {
        const dropPromises: Promise<void>[] = [];
        const visibleSymbolsStart = this._paddingSymbols;
        const visibleSymbolsEnd = this._paddingSymbols + this.config.numSymbolsVisible;

        for (let i = visibleSymbolsStart; i < visibleSymbolsEnd; i++) {
            if (this.symbols[i]) {
                dropPromises.push(this.symbols[i].playDropAnimation());
            }
        }

        if (dropPromises.length > 0) {
            await Promise.all(dropPromises);
        }

        this._isSpinning = false;
        this.isStoppingFast = false;
        
        console.log(`PixiReel ${this.reelId}: Spin and Drops completed. Target Symbols:`, params.targetSymbols);
        this.eventManager.emit(GameEvent.REEL_SPIN_COMPLETED as any, { reelId: this.reelId, finalSymbols: params.targetSymbols });
    }

    public stopSpin(immediate: boolean = false): void {
        if (!this._isSpinning || this.isStoppingFast) return;
        if (!this.canStopManually && !immediate) return;

        this.isStoppingFast = true;
        if (this.spinTween) {
            this.spinTween.stop(); 
            this.spinTween = null; 

            const symbolHeight = this.config.symbolHeight;
            const bounceHeight = this.config.bounceHeight || symbolHeight * 0.3; 
            const bounceDuration1 = (this.config.bounceDuration || 200) * 0.4; 
            const bounceDuration2 = (this.config.bounceDuration || 200) * 0.6; 
            
            let finalYOffset = ( (this.reelStrip.length - this._paddingSymbols - this.config.numSymbolsVisible) * symbolHeight );
            const stripLengthPx = this.reelStrip.length * symbolHeight;
            let currentVisualOffset = (this.currentYOffset % stripLengthPx + stripLengthPx) % stripLengthPx;
            let normalizedFinalYOffset = (finalYOffset % stripLengthPx + stripLengthPx) % stripLengthPx; 
            
            let wraps = Math.floor(this.currentYOffset / stripLengthPx);
            if (currentVisualOffset > normalizedFinalYOffset && (currentVisualOffset - normalizedFinalYOffset) > stripLengthPx / 2) {
                // If current is past target but more than half a strip away, we likely want the previous wrap target
                wraps--; 
            } else if (currentVisualOffset <= normalizedFinalYOffset || (currentVisualOffset - normalizedFinalYOffset) <= stripLengthPx / 2 ){
                // If current is before target, or past it but within half a strip, aim for target in this or next wrap if needed
                // No change to wraps needed here, or it might need to increment if very close to end of strip
            }
            finalYOffset = normalizedFinalYOffset + wraps * stripLengthPx;
            // Further ensure it's the *next* logical stop if still behind currentYOffset
            while(finalYOffset < this.currentYOffset) finalYOffset += stripLengthPx;


            const stopData = { yOffset: this.currentYOffset };

            this.spinTween = new TWEEN.Tween(stopData)
                .to({ yOffset: finalYOffset + bounceHeight }, bounceDuration1)
                .easing(TWEEN.Easing.Circular.Out) 
                .onUpdate(() => {
                    this.currentYOffset = stopData.yOffset;
                    this.positionSymbols();
                })
                .onComplete(() => {
                    this.spinTween = new TWEEN.Tween(stopData)
                        .to({ yOffset: finalYOffset }, bounceDuration2)
                        .easing(TWEEN.Easing.Bounce.Out) 
                        .onUpdate(() => {
                            this.currentYOffset = stopData.yOffset;
                            this.positionSymbols();
                        })
                        .onComplete(()=> {
                            this.currentYOffset = finalYOffset; 
                            this.positionSymbols();
                            this.onSpinComplete({ targetSymbols: this.currentTargetSymbols || [] }); // This will now be async
                        })
                        .start();
                })
                .start();
            
            this.eventManager.emit(GameEvent.REEL_STOP_FAST as any, {reelId: this.reelId});
        }
    }

    public playSymbolWinAnimations(winningRows: number[]): void {
        winningRows.forEach(rowIndex => {
            if (rowIndex >= 0 && rowIndex < this.config.numSymbolsVisible) {
                const symbolInstance = this.symbols[this._paddingSymbols + rowIndex];
                if (symbolInstance) {
                    symbolInstance.setSymbol(symbolInstance.symbolId, PixiSymbolState.ANIMATING);
                }
            }
        });
    }

    public stopSymbolWinAnimations(): void {
         this.symbols.forEach(symbolInstance => {
            if (symbolInstance.getCurrentState() === PixiSymbolState.ANIMATING) {
                symbolInstance.setSymbol(symbolInstance.symbolId, PixiSymbolState.IDLE);
            }
        });
    }

    public resetReel(initialSymbols?: number[]): void {
        this.stopSpin(true);
        this.initializeReelStrip(initialSymbols);
        this.positionSymbols();
    }

    private applyMask(): void {
        if (!this.maskGraphic) {
            this.maskGraphic = new PIXI.Graphics();
            this.addChild(this.maskGraphic); // Mask needs to be a child to be in local coords for drawing
        }
        this.maskGraphic.clear();
        this.maskGraphic.beginFill(0xff0000, 0.5); // Visible for debugging, set alpha to 0 for production
        this.maskGraphic.drawRect(
            0, 
            0, 
            this.config.symbolWidth,
            this.config.numSymbolsVisible * this.config.symbolHeight
        );
        this.maskGraphic.endFill();
        this.mask = this.maskGraphic;
    }
    
    public getVisibleSymbolsData(): {symbolId: number, symbolRef: PixiSymbol}[] {
        const visibleSymbols: {symbolId: number, symbolRef: PixiSymbol}[] = [];
        for(let i=0; i < this.config.numSymbolsVisible; i++){
            const symbolInstance = this.symbols[this._paddingSymbols + i];
            if(symbolInstance){
                visibleSymbols.push({symbolId: symbolInstance.symbolId, symbolRef: symbolInstance});
            }
        }
        return visibleSymbols;
    }

    public destroy(options?: PIXI.IDestroyOptions | boolean): void {
        if (this.spinTween) this.spinTween.stop();
        this.symbols.forEach(s => s.destroy());
        this.symbols = [];
        this.reelStrip = [];
        super.destroy(options);
    }
} 