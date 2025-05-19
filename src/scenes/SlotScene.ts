import { Container, Sprite, Texture, Graphics, Text, TextStyle } from 'pixi.js';
import { Scene } from '../core/scenemanager/Scene';
import { Globals } from '../core/Global';
import { EventManager, GameEvent } from '../core/utils/EventManager';
import * as TWEEN from '@tweenjs/tween.js';
import { ReelController, IReelSpinOutcome } from '../slotutils/reelController';
import { sceneReelsConfig, paylines as configuredPaylines } from '../slotutils/gameConfig';
import { SoundController } from '../slotutils/soundController';
import { WinController, ISpinWinInfo, ICalculatedWinLine } from '../slotutils/winController';
import { GameFlowController, SlotGameState } from '../slotutils/gameFlowController';
import { IGameData } from '../interfaces/IGameData';
import { FreeSpinsController, IFreeSpinsAwardedData } from '../slotutils/FreeSpinsController';
import { NearWinFXController, ILandedScatterInfo } from '../slotutils/NearWinFXController';
import { PixiTextPopup } from '../slotutils/PixiTextPopup';
import { PayTable } from '../slotutils/PayTable';

// Reel class to handle individual reels
class Reel extends Container {
    private symbols: Sprite[] = [];
    private symbolHeight: number = 250;
    private symbolWidth: number = 280;
    private numVisibleSymbols: number = 3;
    private symbolTextures: Map<number, Texture[]> = new Map(); // Map of symbol ID to array of animation frames
    private symbolMask: Graphics;
    private isSpinning: boolean = false;
    private spinSpeed: number = 30; // Base spin speed
    private spinningTween: TWEEN.Tween<any> | null = null;
    private reelIndex: number;
    public stopSymbols: number[] = []; // The IDs of the symbols to stop at
    private eventManager: EventManager;
    private finalVisibleSprites: (Sprite | null)[] = []; // Stores the actual Sprite objects visible after stop
    private gameFlowController: GameFlowController; // Added to access turbo state
    private isStoppingFast: boolean = false; // Flag for fast stop

    constructor(reelIndex: number) {
        super();
        this.reelIndex = reelIndex;
        this.symbolMask = new Graphics();
        this.eventManager = EventManager.getInstance();
        this.gameFlowController = GameFlowController.getInstance(); // Initialize GameFlowController
        this.init();
    }

    // Add public getters for symbol dimensions
    public getSymbolHeight(): number { return this.symbolHeight; }
    public getSymbolWidth(): number { return this.symbolWidth; }
    public getNumVisibleSymbols(): number { return this.numVisibleSymbols; }

    private init(): void {
        // Create mask for the reel
        this.symbolMask.beginFill(0xFFFFFF);
        this.symbolMask.drawRect(0, 0, this.symbolWidth, this.symbolHeight * this.numVisibleSymbols);
        this.symbolMask.endFill();
        this.addChild(this.symbolMask);
        this.mask = this.symbolMask;
        
        // Load symbol textures
        for (let i = 0; i < 9; i++) {
            const key = `symbols-${Math.floor(i / 8)}`; // Split symbols between two texture atlases
            const texture = Globals.resources[key];
            if (texture && texture.data) {
                // Get all frames for this symbol's animation
                const frames: Texture[] = [];
                for (let frame = 1; frame <= 6; frame++) {
                    const frameName = `anim_SYMBOLS/sym_${i + 1}_drop_0${frame}`;
                    if (texture.data.frames[frameName]) {
                        frames.push(Texture.from(frameName));
                    } else {
                        console.warn(`Symbol frame not found: ${frameName} in ${key}`);
                    }
                }
                if (frames.length > 0) {
                    this.symbolTextures.set(i, frames);
                }
            } else {
                console.warn(`Symbol atlas not found: ${key}`);
            }
        }

        // Create initial symbols (add extra symbols above and below for seamless spinning)
        for (let i = 0; i < this.numVisibleSymbols + 2; i++) {
            const symbolIndex = Math.floor(Math.random() * this.symbolTextures.size);
            const frames = this.symbolTextures.get(symbolIndex);
            if (frames && frames.length > 0) {
                const symbol = new Sprite(frames[0]); // Start with first frame
                symbol.width = this.symbolWidth;
                symbol.height = this.symbolHeight;
                symbol.position.set(0, i * this.symbolHeight - this.symbolHeight);
                symbol.visible = true;
                this.addChild(symbol);
                this.symbols.push(symbol);
            }
        }

        // Debug: Log symbol count and visibility
        console.log(`Reel ${this.reelIndex} initialized with ${this.symbols.length} symbols`);
        this.symbols.forEach((symbol, index) => {
            console.log(`Symbol ${index} visible: ${symbol.visible}, texture: ${symbol.texture ? 'loaded' : 'missing'}`);
        });
    }

    public spin(): void {
        if (this.isSpinning) return;
        this.isStoppingFast = false; // Reset flag on new spin
        this.isSpinning = true;
        this.finalVisibleSprites = new Array(this.numVisibleSymbols).fill(null); // Clear/Initialize on new spin
        this.eventManager.emit(GameEvent.REEL_START_SPIN, this.reelIndex);
        
        // Play spin sound
        const spinSound = Globals.soundResources['audio-reelrotation1'];
        if (spinSound) spinSound.play();

        const currentSpinSpeed = this.gameFlowController.getIsTurboOn() ? this.spinSpeed * 2 : this.spinSpeed;
        
        // Create spin animation
        const spinPos = { y: 0 };
        this.spinningTween = new TWEEN.Tween(spinPos)
            .to({ y: this.symbolHeight }, 200) // Time for one symbol to scroll past - this could also be turbo affected
            .repeat(Infinity)
            .onUpdate(() => {
                // Move all symbols down
                for (let i = 0; i < this.symbols.length; i++) {
                    this.symbols[i].y += currentSpinSpeed;
                    
                    // If a symbol goes below the visible area, move it to the top
                    if (this.symbols[i].y > this.numVisibleSymbols * this.symbolHeight) {
                        this.symbols[i].y -= this.symbols.length * this.symbolHeight;
                        
                        // Change the texture to a random symbol
                        const symbolIndex = Math.floor(Math.random() * this.symbolTextures.size);
                        const frames = this.symbolTextures.get(symbolIndex);
                        if (frames && frames.length > 0) {
                            this.symbols[i].texture = frames[0]; // Use first frame during spin
                            this.symbols[i].visible = true;
                        }
                    }
                }
            })
            .start();
    }

    public stopAt(symbolsToDisplay: number[], isFastStop: boolean = false): Promise<void> {
        this.stopSymbols = symbolsToDisplay;
        this.finalVisibleSprites = new Array(this.numVisibleSymbols).fill(null); // Initialize for this stop sequence
        this.isStoppingFast = isFastStop;

        return new Promise((resolve) => {
            // Cancel the current spinning tween
            if (this.spinningTween) {
                this.spinningTween.stop();
                this.spinningTween = null;
            }

            // Set up the final positions
            const finalPositions: { y: number; frames: Texture[] }[] = [];
            for (let i = 0; i < this.numVisibleSymbols; i++) {
                const symbolIndex = symbolsToDisplay[i];
                const frames = this.symbolTextures.get(symbolIndex);
                if (frames && frames.length > 0) {
                    finalPositions.push({
                        y: i * this.symbolHeight,
                        frames: frames
                    });
                } else {
                    // Fallback if a symbol texture is missing for some reason
                    console.warn(`Texture not found for symbol ${symbolIndex} in Reel ${this.reelIndex}. Using default.`);
                    const defaultFrames = this.symbolTextures.get(0); // Assuming symbol 0 is a safe default
                    if (defaultFrames && defaultFrames.length > 0) {
                         finalPositions.push({ y: i * this.symbolHeight, frames: defaultFrames });
                    } else {
                        // Absolute fallback: create an empty placeholder or handle error
                         finalPositions.push({ y: i * this.symbolHeight, frames: [] });
                    }
                }
            }

            // Sort the symbols by their current position to avoid overlapping
            const sortedSymbols = [...this.symbols].sort((a, b) => a.y - b.y);

            // Assign final textures to the correct visual symbols before tweening
            // This ensures the stopping animation looks correct if symbols change during the stop.
             for (let i = 0; i < this.numVisibleSymbols; i++) {
                if (this.symbols[i] && finalPositions[i] && finalPositions[i].frames.length > 0) {
                    // This part might need adjustment based on how your visual symbols are managed
                    // The goal is that the symbols that will be visible at stop have the correct texture
                }
            }


            // Set up the final state
            for (let i = 0; i < this.numVisibleSymbols; i++) {
                const symbol = sortedSymbols[i]; // Use the visually sorted symbols
                const targetPos = i * this.symbolHeight;
                const visualRowIndex = i; // To use in onComplete for finalVisibleSprites
                
                let baseStopDuration = this.gameFlowController.getIsTurboOn() ? 150 : 300;
                let reelDelay = this.gameFlowController.getIsTurboOn() ? 75 : 150;

                if (this.isStoppingFast) {
                    baseStopDuration = 50; // Minimal duration for fast stop
                    reelDelay = 25;      // Minimal delay for fast stop
                }

                const stopDuration = baseStopDuration + this.reelIndex * reelDelay;
                
                // Animate to the final position
                new TWEEN.Tween(symbol)
                    .to({ y: targetPos }, stopDuration) 
                    .easing(TWEEN.Easing.Bounce.Out)
                    .onComplete(() => {
                        // Apply the correct texture when the reel stops
                        if (finalPositions[visualRowIndex] && finalPositions[visualRowIndex].frames.length > 0) {
                            symbol.texture = finalPositions[visualRowIndex].frames[0]; // Use first frame when stopped
                            symbol.visible = true;
                            this.finalVisibleSprites[visualRowIndex] = symbol; // Store the sprite reference
                        } else {
                            // Handle case where texture might be missing, ensure a placeholder or make invisible
                            symbol.visible = false; 
                            this.finalVisibleSprites[visualRowIndex] = null;
                        }
                        
                        // Play stop sound
                        const stopSound = Globals.soundResources[`audio-reelstop${this.reelIndex + 1}`];
                        if (stopSound) stopSound.play();
                        
                        // If this is the last symbol of the visible area that has completed its tween
                        if (i === this.numVisibleSymbols - 1) {
                            this.isSpinning = false;
                            this.eventManager.emit(GameEvent.REEL_STOPPED, this.reelIndex);
                            resolve();
                        }
                    })
                    .start();
            }
        });
    }

    public performFastStop(symbolsToDisplay: number[]): void {
        if (this.isSpinning && this.spinningTween) {
            this.spinningTween.stop();
            this.spinningTween = null;
            // isSpinning will be set to false by stopAt
        }
        // Call stopAt with the fast stop flag
        this.stopAt(symbolsToDisplay, true).then(() => {
            // Reel has visually stopped quickly
        });
    }

    public getVisibleSymbolSprite(row: number): Sprite | null {
        if (row >= 0 && row < this.numVisibleSymbols && this.finalVisibleSprites.length === this.numVisibleSymbols) {
            return this.finalVisibleSprites[row];
        }
        return null;
    }

    public getSymbolAt(row: number): number {
        if (!this.stopSymbols || !this.stopSymbols.length) return -1;
        return this.stopSymbols[row];
    }

    public getPosition(): { x: number; y: number } {
        return { x: this.x, y: this.y };
    }

    public resize(scale: number): void {
        this.scale.set(scale);
        
        // Update mask to match the new scale
        this.symbolMask.clear();
        this.symbolMask.beginFill(0xFFFFFF);
        this.symbolMask.drawRect(0, 0, this.symbolWidth, this.symbolHeight * this.numVisibleSymbols);
        this.symbolMask.endFill();
    }

    public getIsSpinning(): boolean {
        return this.isSpinning;
    }
}

// WinLine class to handle win line animations
class WinLine extends Container {
    private graphics: Graphics;
    private linePoints: { x: number; y: number }[] = [];
    private lineColor: number;
    private lineThickness: number = 5;
    private isAnimating: boolean = false;
    private isTurbo: boolean;

    constructor(points: { x: number; y: number }[], color: number = 0xFFFF00, isTurbo: boolean = false) {
        super();
        this.linePoints = points;
        this.lineColor = color;
        this.graphics = new Graphics();
        this.addChild(this.graphics);
        this.isTurbo = isTurbo;
        this.draw();
    }

    private draw(): void {
        this.graphics.clear();
        this.graphics.lineStyle(this.lineThickness, this.lineColor, 1);
        this.graphics.moveTo(this.linePoints[0].x, this.linePoints[0].y);
        
        for (let i = 1; i < this.linePoints.length; i++) {
            this.graphics.lineTo(this.linePoints[i].x, this.linePoints[i].y);
        }
    }

    public animate(): Promise<void> {
        if (this.isAnimating) return Promise.resolve();
        this.isAnimating = true;
        this.visible = true;
        const animationDuration = this.isTurbo ? 150 : 300;
        const repeatCount = this.isTurbo ? 2 : 5;

        return new Promise((resolve) => {
            new TWEEN.Tween(this.graphics)
                .to({ alpha: 0 }, animationDuration)
                .yoyo(true)
                .repeat(repeatCount)
                .onComplete(() => {
                    this.isAnimating = false;
                    this.visible = false;
                    resolve();
                })
                .start();
        });
    }
}

export class SlotScene extends Scene {
    private eventManager: EventManager;
    private reels: Reel[] = [];
    private numReels: number = 5;
    private numRows: number = 3;
    private reelContainer: Container;
    private uiContainer: Container;
    private winLinesContainer: Container;
    private spinButton!: Sprite;
    private winLines: WinLine[] = [];
    private currentWinAmount: number = 0;
    private betAmount: number = 10;
    private balance: number = 1000;
    private balanceText: Text | null = null;
    private winText: Text | null = null;
    private totalWinPopup: PixiTextPopup | null = null;
    private payTable: PayTable;
    private background: Sprite | null = null;
    private reelController: ReelController;
    private soundController: SoundController;
    private winController: WinController;
    private gameFlowController: GameFlowController;
    private freeSpinsController: FreeSpinsController;
    private nearWinFXController: NearWinFXController;
    private lastSpinOutcome: IReelSpinOutcome | null = null;
    private reelsVisuallySpinning: boolean[] = [];
    private reelsVisuallyStopped: boolean[] = [];
    private spinStopTimeoutId: number | null = null; // For clearing the regular stop timeout

    // Near Win Tracking
    private landedScattersThisSpin: ILandedScatterInfo[] = [];
    private isNearWinActive: boolean = false;
    private readonly scatterSymbolId: number = 8; // Assuming 8 is scatter, move to config later

    constructor() {
        super('SlotScene');
        this.eventManager = EventManager.getInstance();
        this.gameFlowController = GameFlowController.getInstance(); 

        this.payTable = new PayTable([], []); 
        const initialPaylines = this.gameFlowController.getPaylines() || configuredPaylines; // Use getter or fallback
        this.winController = new WinController(
            this.payTable, 
            this.numReels, 
            initialPaylines, 
            { wildSymbolId: this.gameFlowController.getWildSymbolId() } // Pass wild symbol ID in config object
        ); 

        this.reelContainer = new Container();
        this.uiContainer = new Container();
        this.winLinesContainer = new Container();
        
        this.betAmount = this.gameFlowController.getCurrentBet(); 
        const numPaylines = initialPaylines.length > 0 ? initialPaylines.length : 1;
        this.payTable.setLineBet(this.betAmount / numPaylines); 
        
        this.reelController = new ReelController(
            this.numReels, 
            this.numRows, 
            sceneReelsConfig,
            this.gameFlowController.getReelStrips(),      // Expects string[][] now, getter provides it
            this.gameFlowController.getSymbolsList()      // Expects string[], getter provides it
        );
        this.soundController = SoundController.getInstance();
        this.freeSpinsController = new FreeSpinsController(this.uiContainer);
        this.nearWinFXController = new NearWinFXController(this.gameContainer);
        
        this.gameContainer.addChild(this.reelContainer);
        this.gameContainer.addChild(this.uiContainer);
        this.gameContainer.addChild(this.winLinesContainer);
        
        this.setup();
    }

    private setup(): void {
        // Set up background
        const bgTexture = Globals.resources['game-main-bg'];
        if (bgTexture) {
            this.background = new Sprite(bgTexture);
            this.background.anchor.set(0.5);
            this.background.position.set(window.innerWidth/2,window.innerHeight/2); // Center in gameContainer
            this.gameContainer.addChildAt(this.background, 0);
        }

        // Create reels
        const reelSpacing = 280;
        const startX = -((this.numReels * reelSpacing) / 2) + (reelSpacing / 2); // Center reels
        
        this.reelsVisuallySpinning = new Array(this.numReels).fill(false);
        this.reelsVisuallyStopped = new Array(this.numReels).fill(false);
        
        for (let i = 0; i < this.numReels; i++) {
            const reel = new Reel(i);
            reel.position.set(startX + i * reelSpacing, 100);
            this.reelContainer.addChild(reel);
            this.reels.push(reel);
        }

        // Create UI elements
        this.createUI();

        // Setup event listeners
        this.setupGameEventListeners();
        this.eventManager.emit(GameEvent.SCENE_READY as any);
    }

    private setupGameEventListeners(): void {
        this.eventManager.on(GameEvent.GAME_STATE_CHANGED as any, this.onGameStateChanged.bind(this));
        this.eventManager.on(GameEvent.WIN_AMOUNT_UPDATED as any, this.onWinAmountUpdatedFromGamble.bind(this)); 
        this.eventManager.on(GameEvent.BET_AMOUNT_CHANGED as any, this.onBetAmountChanged.bind(this)); 
        this.eventManager.on(GameEvent.INITIATE_FAST_STOP as any, this.handleInitiateFastStop.bind(this)); 
        this.eventManager.on(GameEvent.REEL_START_SPIN, this.handleReelStartSpin.bind(this));
        this.eventManager.on(GameEvent.REEL_STOPPED, this.handleReelVisuallyStopped.bind(this));
        this.eventManager.on(GameEvent.CORE_GAME_DATA_UPDATED as any, this.onCoreGameDataUpdated.bind(this));
    }

    private onGameStateChanged(data: {newState: SlotGameState, oldState: SlotGameState}): void {
        console.log('SlotScene: GameState Changed to', data.newState);
        // Update Spin Button Interactivity
        if (this.spinButton) {
            this.spinButton.interactive = this.gameFlowController.canRequestSpin();
            this.spinButton.alpha = this.spinButton.interactive ? 1 : 0.5;
        }

        // Handle UI changes based on Gamble State
        if (data.oldState === SlotGameState.GAMBLE_ACTIVE) {
            if (data.newState !== SlotGameState.GAMBLE_ACTIVE) {
                this.reelContainer.visible = true;
                this.uiContainer.visible = true; // Show main UI as gamble is no longer active
                // Gamble UI itself is managed by PixiUIManager based on GAMBLE_UI_HIDE event
            }
        } else if (data.newState === SlotGameState.GAMBLE_ACTIVE) {
            this.reelContainer.visible = false;
            this.uiContainer.visible = false; // Hide main UI, gamble UI will take over
            this.winLinesContainer.visible = false;
            // PixiUIManager will handle showing the actual PixiGambleUI based on GAMBLE_UI_SHOW event
        }

        // Update FreeSpinsController display when relevant states are entered
        if (this.gameFlowController.getIsInFreeSpins()) {
            if (data.newState === SlotGameState.FREE_SPIN_IDLE || 
                (data.newState === SlotGameState.ROUND_COMPLETE && this.gameFlowController.getRemainingFreeSpins() > 0) ||
                 data.newState === SlotGameState.FREE_SPINS_INTRO ) { // Update on intro too
                this.freeSpinsController.updateDisplay(
                    this.gameFlowController.getRemainingFreeSpins(),
                    this.gameFlowController.getTotalFreeSpins(), // Use the new getter
                    this.gameFlowController.getFreeSpinsMultiplier()
                );
            }
        }

        switch (data.newState) {
            case SlotGameState.IDLE:
                this.updateBalanceDisplay();
                this.currentWinAmount = 0;
                break;
            case SlotGameState.SPIN_REQUESTED:
                this.handleSpinRequest();
                break;
            case SlotGameState.REELS_STOPPING:
                break;
            case SlotGameState.WINS_CALCULATING:
                if (this.lastSpinOutcome) {
                    let spinWinInfo = this.winController.calculateWins(this.lastSpinOutcome.finalSymbols, this.betAmount);
                    
                    // Apply free spins multiplier if active
                    if (this.gameFlowController.getIsInFreeSpins()) {
                        const multiplier = this.gameFlowController.getFreeSpinsMultiplier();
                        if (multiplier > 1) { // Only apply if multiplier is meaningful
                            spinWinInfo.totalWinAmount *= multiplier;
                            for (const line of spinWinInfo.winningLines) {
                                line.winAmount *= multiplier;
                            }
                            console.log(`Applied free spins multiplier: x${multiplier}. New total win: ${spinWinInfo.totalWinAmount}`);
                        }
                    }

                    // Check for awarded free spins before emitting WIN_CALCULATION_COMPLETE
                    if (spinWinInfo.awardedFreeSpins && !this.gameFlowController.getIsInFreeSpins()) {
                        // Free spins ARE awarded. If a near win effect was active, stop it.
                        if (this.isNearWinActive) {
                            this.nearWinFXController.stopNearWinEffect();
                            this.isNearWinActive = false;
                        }
                        this.eventManager.emit(GameEvent.FREE_SPINS_START as any, {
                            totalSpins: spinWinInfo.awardedFreeSpins.count,
                            currentSpins: spinWinInfo.awardedFreeSpins.count,
                            multiplier: spinWinInfo.awardedFreeSpins.multiplier
                        } as IFreeSpinsAwardedData);
                    } else if (this.isNearWinActive) {
                        // Free spins were NOT awarded, but near win was active. Stop the effect now.
                        this.nearWinFXController.stopNearWinEffect();
                        this.isNearWinActive = false;
                    }
                    this.eventManager.emit(GameEvent.WIN_CALCULATION_COMPLETE as any, spinWinInfo);
                } else {
                    console.error("WINS_CALCULATING state but no lastSpinOutcome!");
                    this.eventManager.emit(GameEvent.WIN_CALCULATION_COMPLETE as any, { winningLines: [], totalWinAmount: 0 });
                }
                break;
            case SlotGameState.WINS_CALCULATED:
                // This state is handled by GameFlowController, which moves to WIN_PRESENTATION or ROUND_COMPLETE.
                // SlotScene reacts to those specific states if needed.
                const lastWinInfo = this.getLastWinInfo(); // Helper to get data from last WIN_CALCULATION_COMPLETE event if needed
                if (lastWinInfo && lastWinInfo.totalWinAmount > 0) {
                     this.eventManager.emit(GameEvent.START_WIN_PRESENTATION as any);
                } // else GameFlowController should have moved to ROUND_COMPLETE
                break;
            case SlotGameState.WIN_PRESENTATION:
                if (this.lastSpinOutcome) { // Ensure outcome is available
                    const spinWinInfo = this.winController.calculateWins(this.lastSpinOutcome.finalSymbols, this.betAmount);
                     if (spinWinInfo.totalWinAmount > 0) {
                        this.presentWins(spinWinInfo.winningLines, spinWinInfo.totalWinAmount);
                    }
                } else {
                    // Should not happen if flow is correct, but handle defensively
                    this.eventManager.emit(GameEvent.WIN_PRESENTATION_COMPLETE as any);
                }
                break;
            case SlotGameState.ROUND_COMPLETE:
                 // Add win to balance before updating display
                 if (this.currentWinAmount > 0) {
                    this.balance += this.currentWinAmount;
                    // currentWinAmount will be reset in SPIN_REQUESTED or if no win next round
                 }
                 this.updateBalanceDisplay();
                 this.emitBalanceUpdate(); // Emit after balance changes

                 // Hide win lines and win text after a delay or when user clicks again
                 // For now, let's assume hideWinLines is part of starting a new spin (SPIN_REQUESTED)
                // If coming from gamble, balance should reflect gamble outcome.
                // currentWinAmount should have been updated by onWinAmountUpdatedFromGamble
                break;
            case SlotGameState.FREE_SPIN_IDLE: // Add case for FREE_SPIN_IDLE
                this.updateBalanceDisplay(); // Balance display might need to show 0 bet or other info
                // Spin button should be active, ready for player or auto-spin
                if (this.spinButton) {
                    this.spinButton.interactive = true;
                    this.spinButton.alpha = 1;
                }
                // Potentially auto-trigger next free spin if desired
                // this.eventManager.emit(GameEvent.REQUEST_SPIN as any);
                break;
        }
    }
    
    // Helper, assuming WIN_CALCULATION_COMPLETE payload is stored if needed later.
    // This is a bit contrived; ideally, data flows directly via events or parameters.
    private _lastWinCalculation: ISpinWinInfo | null = null;
    private getLastWinInfo(): ISpinWinInfo | null {
        // Ensure this doesn't overwrite currentSpinWinInfo if gamble is active
        if(this.gameFlowController.getCurrentState() !== SlotGameState.GAMBLE_ACTIVE) {
        this.eventManager.on(GameEvent.WIN_CALCULATION_COMPLETE as any, (info: ISpinWinInfo) => this._lastWinCalculation = info); // Keep updated
        }
        return this._lastWinCalculation;
    }

    private onWinAmountUpdatedFromGamble(newWinAmount: number): void {
        console.log(`SlotScene: Win amount updated from gamble to: ${newWinAmount}`);
        this.currentWinAmount = newWinAmount;
        // Balance will be updated in ROUND_COMPLETE using this this.currentWinAmount
    }

    private onBetAmountChanged(newBetAmount: number): void {
        console.log(`SlotScene: Bet amount changed to ${newBetAmount}`);
        this.betAmount = newBetAmount;
        const paylinesToUse = this.gameFlowController.getPaylines();
        const numPaylines = paylinesToUse.length > 0 ? paylinesToUse.length : 1;
        this.payTable.setLineBet(this.betAmount / numPaylines);
    }

    private handleReelStartSpin(reelIndex: number): void {
        this.reelsVisuallySpinning[reelIndex] = true;
        if (this.reelsVisuallySpinning.every(isSpinning => isSpinning)) {
            this.eventManager.emit(GameEvent.ALL_REELS_SPINNING as any);
        }
    }

    private handleReelVisuallyStopped(reelIndex: number): void {
        this.reelsVisuallyStopped[reelIndex] = true;

        // --- Near Win Logic Start ---
        const stoppedReel = this.reels[reelIndex];
        if (stoppedReel && stoppedReel.stopSymbols) { // stopSymbols should be populated by Reel.stopAt
            for (let i = 0; i < stoppedReel.stopSymbols.length; i++) {
                if (stoppedReel.stopSymbols[i] === this.scatterSymbolId) {
                    const alreadyLogged = this.landedScattersThisSpin.find(s => s.reelIndex === reelIndex && s.symbolRow === i);
                    if (!alreadyLogged) {
                        this.landedScattersThisSpin.push({ 
                            reelIndex: reelIndex, 
                            symbolRow: i,
                            symbolSprite: stoppedReel.getVisibleSymbolSprite(i) // Get the actual Sprite reference
                        });
                    }
                }
            }
        }

        const totalReelsPendingStop = this.reelsVisuallyStopped.filter(stopped => !stopped).length;
        const minScattersForFreeSpinTrigger = 3; // Should be from a config
        const nearWinScatterThreshold = 2; // Trigger near win if 2 scatters landed

        if (!this.isNearWinActive && 
            this.landedScattersThisSpin.length >= nearWinScatterThreshold && 
            this.landedScattersThisSpin.length < minScattersForFreeSpinTrigger &&
            totalReelsPendingStop > 0) {
            
            this.isNearWinActive = true;
            const stillSpinningReelIndices = this.reels
                .map((reel, idx) => idx)
                .filter(idx => !this.reelsVisuallyStopped[idx]);

            // Prepare public data for all reels for NearWinFXController
            const reelsPublicData = this.reels.map(reel => ({
                x: this.reelContainer.x + reel.x, // Position relative to gameContainer
                y: this.reelContainer.y + reel.y,
                width: reel.getSymbolWidth(),
                height: reel.getSymbolHeight() * reel.getNumVisibleSymbols(), // Added height
                symbolHeight: reel.getSymbolHeight(),
                numVisibleSymbols: reel.getNumVisibleSymbols() // Used getter
            }));

            console.log('SlotScene: Near win condition detected!');
            this.nearWinFXController.startNearWinEffect(this.landedScattersThisSpin, stillSpinningReelIndices, reelsPublicData);
        }
        // --- Near Win Logic End ---

        if (this.reelsVisuallyStopped.every(isStopped => isStopped)) {
            if (this.isNearWinActive && !this.gameFlowController.getIsInFreeSpins()) {
                 // If all reels stopped, near win was active, but free spins were NOT triggered by THIS spin sequence
                 // (because FREE_SPINS_START would have already changed isInFreeSpins)
                 // However, FREE_SPINS_START is checked later in WINS_CALCULATING.
                 // We need a more robust check here if free spins were ACTUALLY triggered or not.
                 // For now, assume if near win was active, and we are here, FS wasn't the *immediate* outcome that would clear it.
                 // This logic will be refined when checking spinWinInfo.awardedFreeSpins.
            }
            this.eventManager.emit(GameEvent.ALL_REELS_STOPPED_VISUALLY as any);
        }
    }

    private createUI(): void {
        // Create spin button
        const spinButtonTexture = Globals.resources['ui-spinbutton'];
        if (spinButtonTexture) {
            this.spinButton = new Sprite(spinButtonTexture);
            this.spinButton.anchor.set(0.5);
            this.spinButton.position.set(0, 400); // Position relative to gameContainer
            this.spinButton.interactive = true;
            this.spinButton.cursor = 'pointer';
            // Spin button now emits REQUEST_SPIN
            this.spinButton.on('pointerdown', () => {
                this.eventManager.emit(GameEvent.REQUEST_SPIN as any);
            });
            this.uiContainer.addChild(this.spinButton);
        }

        // Create balance text
        const balanceStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xFFFFFF,
            align: 'left'
        });

        this.balanceText = new Text(`Balance: $${this.balance}`, balanceStyle);
        this.balanceText.position.set(-800, -400); // Position relative to gameContainer
        this.uiContainer.addChild(this.balanceText);

        // Create win text (original, can be deprecated by PixiTextPopup)
        const winStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 32,
            fill: 0xFFFF00,
            align: 'center'
        });
        this.winText = new Text('', winStyle);
        this.winText.anchor.set(0.5);
        this.winText.position.set(0, -300); // Position relative to gameContainer
        this.winText.visible = false;
        this.uiContainer.addChild(this.winText); // Keep for now

        // Create Total Win Popup
        this.totalWinPopup = new PixiTextPopup({ // Pass options object only
            initialText: '',
            x: 0, // Centered like old winText
            y: -350, // Slightly above old winText or adjust as needed
            style: {
                fontSize: 60,
                fill: '#FFFF00',
                stroke: '#333333',
                strokeThickness: 5
            },
            visible: false,
            currencySymbol: '$' // Assuming $ currency
        });
        this.uiContainer.addChild(this.totalWinPopup); // Add to container

        // Hide the old winText if totalWinPopup is being used primarily
        if (this.winText) this.winText.visible = false;
    }

    private handleSpinRequest(): void {
        // Clear previous near-win state if any
        if (this.isNearWinActive) {
            this.nearWinFXController.stopNearWinEffect();
            this.isNearWinActive = false;
        }
        this.landedScattersThisSpin = [];

        if (!this.gameFlowController.getIsInFreeSpins()) {
            this.balance -= this.betAmount;
            // Only update balance display if it's not a free spin,
            // as free spin wins will be accumulated and added at the end, or per spin based on design.
            // For now, regular spin deducts and updates immediately.
            this.updateBalanceDisplay(); 
            this.emitBalanceUpdate(); // Emit after balance changes
        }
        this.hideWinLines();
        if (this.totalWinPopup) this.totalWinPopup.hide(false); // Hide new popup immediately, no animation
        this.currentWinAmount = 0; // Reset for the new spin
        this.lastSpinOutcome = null;
        this.reelsVisuallySpinning.fill(false);
        this.reelsVisuallyStopped.fill(false);

        // Clear any pending regular stop sequence if a new spin starts
        if (this.spinStopTimeoutId) {
            window.clearTimeout(this.spinStopTimeoutId); // Use window.clearTimeout
            this.spinStopTimeoutId = null;
        }

        for (const reel of this.reels) {
            reel.spin(); // This will emit REEL_START_SPIN for each reel
        }

        // After telling reels to spin, GameFlowController state will move to REELS_ACCELERATING / REELS_SPINNING.
        // Now, determine stop outcome and tell reels to stop after a delay or trigger.
        // This replaces the old direct call to stopReels() in startSpin().
        // The actual call to visual stop (`reel.stopAt`) will happen based on game logic (e.g., timer, server response)
        // For this example, we initiate the logic to get stopping positions and then tell reels to stop.
        
        // This should happen based on game rules (e.g. after min spin time, or server response)
        // For now, let's simulate a delay then decide stops.
        // This delay can also be affected by Turbo mode.
        const spinLogicDelay = this.gameFlowController.getIsTurboOn() ? 250 : 500;
        this.spinStopTimeoutId = window.setTimeout(() => { // Use window.setTimeout
            this.spinStopTimeoutId = null; // Clear the ID once the timeout executes
            if (this.gameFlowController.getCurrentState() !== SlotGameState.REELS_SPINNING && this.gameFlowController.getCurrentState() !== SlotGameState.REELS_ACCELERATING) {
                // If state changed (e.g., fast stop occurred, or another spin started), don't proceed
                console.log('SlotScene: Regular stop sequence aborted due to state change.');
                return;
            }

            this.lastSpinOutcome = this.reelController.generateSpinOutcome();
            this.eventManager.emit(GameEvent.REELS_STOPPING_LOGIC_INITIATED as any, this.lastSpinOutcome);

            // Now instruct visual reels to stop
            const symbolsToStopAt: number[][] = this.lastSpinOutcome.finalSymbols;
            if(this.lastSpinOutcome.isNearWin) {
                console.log("Near win condition detected by ReelController!");
                // this.eventManager.emit(GameEvent.NEAR_WIN_DETECTED as any); 
            }
            this.reels.forEach((reel, i) => reel.stopAt(symbolsToStopAt[i]));
            // Each reel.stopAt() will eventually emit REEL_STOPPED, 
            // which handleReelVisuallyStopped will catch to eventually emit ALL_REELS_STOPPED_VISUALLY.
        }, spinLogicDelay);
    }

    private presentWins(calculatedWinLines: ICalculatedWinLine[], totalWin: number): void {
        this.currentWinAmount = totalWin;
        this.updateBalanceDisplay(); // This updates text, balance itself is updated on ROUND_COMPLETE for wins
        // No balance change here directly, but good to note that currentWinAmount is now known.

        const isTurbo = this.gameFlowController.getIsTurboOn();

        if (this.totalWinPopup) {
            this.totalWinPopup.setValue(this.currentWinAmount, true, isTurbo); // Pass turbo state
            this.totalWinPopup.show(true);
        }
        if (this.winText) this.winText.visible = false;

        this.eventManager.emit(GameEvent.SHOW_WIN as any, { amount: this.currentWinAmount, type: this.determineWinType(this.currentWinAmount) });

        const winLinePromises: Promise<void>[] = [];
        if (calculatedWinLines.length > 0) {
            for (const win of calculatedWinLines) {
                winLinePromises.push(this.showWinLine(win)); 
            }
            Promise.all(winLinePromises).then(() => {
                // After all win lines have finished animating (important if showWinLine returns a promise)
                this.eventManager.emit(GameEvent.WIN_PRESENTATION_COMPLETE as any);
            });
        } else {
            // No win lines to show, so presentation is immediately complete.
            this.eventManager.emit(GameEvent.WIN_PRESENTATION_COMPLETE as any);
        }
    }
    
    private updateBalanceDisplay(): void {
        if (this.balanceText) {
            // Balance is only debited at SPIN_REQUESTED.
            // It's credited when ROUND_COMPLETE and currentWinAmount is known from WINS_CALCULATED (or GAMBLE_ENDED).
            // This function primarily updates the text display.
            // The actual balance variable should be updated before calling this for deductions,
            // or before calling this for wins (typically at ROUND_COMPLETE).
            this.balanceText.text = `Balance: $${this.balance + this.currentWinAmount}`;
        }
    }

    private determineWinType(amount: number): string {
        if (amount >= this.betAmount * 50) return 'jackpot';
        if (amount >= this.betAmount * 10) return 'large';
        if (amount >= this.betAmount * 5) return 'medium';
        if (amount > 0) return 'small';
        return 'none';
    }

    private showWinLine(win: ICalculatedWinLine): Promise<void> { 
        const points: { x: number; y: number }[] = [];
        for (let i = 0; i < win.count; i++) { 
            const reel = this.reels[i]; 
            const symbolRowOnReel = win.positions[i]; 
            const pos = reel.getPosition();
            points.push({
                x: pos.x + reel.getSymbolWidth() / 2,      
                y: pos.y + symbolRowOnReel * reel.getSymbolHeight() + reel.getSymbolHeight() / 2 
            });
        }
        if (points.length > 0) { 
            const winLine = new WinLine(points, 0xFFFF00, this.gameFlowController.getIsTurboOn()); // Pass turbo state
            this.winLinesContainer.addChild(winLine);
            this.winLines.push(winLine);
            return winLine.animate(); // Return the promise from animate
        }
        return Promise.resolve();
    }

    private hideWinLines(): void {
        for (const line of this.winLines) { line.destroy(); }
        this.winLines = [];
        this.winLinesContainer.removeChildren();
        if (this.winText) { this.winText.visible = false; }
        if (this.totalWinPopup) { this.totalWinPopup.hide(false); } // Hide new popup as well
    }

    private emitBalanceUpdate(): void {
        this.eventManager.emit(GameEvent.PLAYER_BALANCE_UPDATED as any, this.balance);
    }

    private handleInitiateFastStop(): void {
        if (this.gameFlowController.getCurrentState() === SlotGameState.REELS_SPINNING) {
            console.log('SlotScene: Handling INITIATE_FAST_STOP');
            if (this.spinStopTimeoutId) {
                window.clearTimeout(this.spinStopTimeoutId); // Use window.clearTimeout
                this.spinStopTimeoutId = null;
                console.log('SlotScene: Cleared regular spin stop timeout.');
            }
            this.triggerReelFastStopSequence();
        }
    }

    private triggerReelFastStopSequence(): void {
        if (!this.lastSpinOutcome) {
            console.warn('SlotScene: Fast stop triggered but lastSpinOutcome not yet available. Generating now.');
            // This case should be rare if REQUEST_STOP_SPIN is only allowed when REELS_SPINNING
            // and REELS_SPINNING implies handleSpinRequest has been called.
            this.lastSpinOutcome = this.reelController.generateSpinOutcome();
            // Ensure GameFlowController also knows about this outcome if it was generated late
            this.eventManager.emit(GameEvent.REELS_STOPPING_LOGIC_INITIATED as any, this.lastSpinOutcome);
        }

        if (this.lastSpinOutcome) {
            console.log('SlotScene: Triggering fast stop for reels.');
            const symbolsToStopAt: number[][] = this.lastSpinOutcome.finalSymbols;
            this.reels.forEach((reel, i) => {
                if (reel.getIsSpinning()) { // Only fast stop reels that are still visually spinning
                    reel.performFastStop(symbolsToStopAt[i]);
                }
            });
            // Since fast stop bypasses the natural tween completion that triggers REEL_STOPPED for each reel,
            // and subsequently ALL_REELS_STOPPED_VISUALLY, we might need to force the state transition.
            // However, performFastStop now calls stopAt, which should emit REEL_STOPPED.
            // The very short duration should mean ALL_REELS_STOPPED_VISUALLY is emitted quickly.
        } else {
            console.error('SlotScene: Could not trigger fast stop sequence, lastSpinOutcome is null.');
        }
    }

    private onCoreGameDataUpdated(data: IGameData): void {
        console.log("SlotScene: Core game data updated in SlotScene", data);
        this.payTable = new PayTable(data.paytable, data.scattersPaytable);
        
        const currentPaylines = data.paylines || configuredPaylines; 
        const numPaylines = currentPaylines.length > 0 ? currentPaylines.length : 1;
        this.payTable.setLineBet(this.betAmount / numPaylines);
        
        // Update WinController instantiation with wild symbol ID
        this.winController = new WinController(
            this.payTable, 
            this.numReels, 
            currentPaylines, 
            { wildSymbolId: data.wildSymbolId } // Use wildSymbolId from the data payload in config object
        );
        
        // Update ReelController with the new data
        if (data.reelStrips && data.symbols) {
            this.reelController.updateData(data.reelStrips, data.symbols);
        } else {
            console.warn("SlotScene: reelStrips or symbols missing in CORE_GAME_DATA_UPDATED, ReelController not updated with new strips/symbols.");
        }

        console.log("SlotScene: PayTable, WinController, and ReelController updated with new game data.");
    }

    public init(): void {
        // Initialize scene
        this.show();
    }

    protected onUpdate(delta: number): void {
        // Update scene
        TWEEN.update();
    }

    public onResize(): void {
        // Handle resize
        const scale = Math.min(Globals.width / 1920, Globals.height / 1080);
        
        // Update background
        if (this.background) {
            this.background.scale.set(scale);
        }

        // Update containers
        this.reelContainer.scale.set(scale);
        this.uiContainer.scale.set(scale);
        this.winLinesContainer.scale.set(scale);

        // Update UI positions
        if (this.spinButton) {
            this.spinButton.position.set(0, 400 * scale);
        }

        if (this.balanceText) {
            this.balanceText.position.set(-800 * scale, -400 * scale);
        }

        if (this.winText) {
            this.winText.position.set(0, -300 * scale);
        }

        if (this.totalWinPopup) {
            this.totalWinPopup.x = 0; // Keep centered
            this.totalWinPopup.y = -350 * scale; // Adjust y by scale
            // If PixiTextPopup internal text scales with its setScale method, call it
            // this.totalWinPopup.setScale(scale); // Or adjust font size in style directly if preferred
        }

        // Update reel masks
        for (const reel of this.reels) {
            reel.resize(scale);
        }

        // Resize FreeSpinsController UI
        // Assuming uiContainer is centered at (0,0) relative to gameContainer for positioning
        // And the FreeSpinsController positions its elements relative to its container's (0,0)
        this.freeSpinsController.resize(scale, 0, 0); // Pass scale, and relative centerX, topY for its elements
    }
} 