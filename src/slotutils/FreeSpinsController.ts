import { Container, Text, TextStyle } from 'pixi.js';
import { EventManager, GameEvent } from '../core/utils/EventManager';
import * as TWEEN from '@tweenjs/tween.js';
import { ReelController } from './reelController';
import { GameFlowController } from './gameFlowController';

export interface IFreeSpinsAwardedData {
    totalSpins: number;
    currentSpins: number; // This will be the initial count, same as totalSpins
    multiplier: number;
    retrigger?: boolean; // Indicates if this is a retrigger award
}

export interface IFreeSpinsConfig {
    minScattersToTrigger: number;
    initialSpinsAwarded: number;
    retriggersAllowed: boolean;
    retriggersAddSpins: boolean; // If false, retriggering resets spins to initial amount
    initialMultiplier: number;
    progressiveMultipliers?: number[]; // Optional array of progressive multipliers
    useSpecialReelStrips: boolean; // Whether to use special reel strips for free spins
}

export class FreeSpinsController {
    private uiContainer: Container;
    private eventManager: EventManager;
    private gameFlowController: GameFlowController;
    private reelController: ReelController | null = null;

    private freeSpinsText: Text | null = null;
    private multiplierText: Text | null = null;
    private specialMessage: Text | null = null;

    private config: IFreeSpinsConfig = {
        minScattersToTrigger: 3,
        initialSpinsAwarded: 10,
        retriggersAllowed: true,
        retriggersAddSpins: true,
        initialMultiplier: 2,
        progressiveMultipliers: undefined,
        useSpecialReelStrips: false
    };

    private isActive: boolean = false;
    private originalReelStrips: string[][] | null = null;
    private spinCounter: number = 0; // Counts spins within free spins session
    private retriggersCounter: number = 0; // Counts number of retriggers in session

    constructor(uiContainer: Container, reelController?: ReelController) {
        this.uiContainer = uiContainer;
        this.eventManager = EventManager.getInstance();
        this.gameFlowController = GameFlowController.getInstance();
        this.reelController = reelController || null;
        this.init();
    }

    public setReelController(reelController: ReelController): void {
        this.reelController = reelController;
    }

    public setConfig(config: Partial<IFreeSpinsConfig>): void {
        this.config = { ...this.config, ...config };
        console.log('FreeSpinsController: Config updated', this.config);
    }

    private init(): void {
        const textStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 36,
            fill: 0xffffff,
            align: 'center',
            stroke: '#000000',
            strokeThickness: 4,
        });

        this.freeSpinsText = new Text('', textStyle);
        this.freeSpinsText.anchor.set(0.5);
        this.freeSpinsText.position.set(0, -250); // Placeholder position
        this.freeSpinsText.visible = false;
        this.uiContainer.addChild(this.freeSpinsText);

        this.multiplierText = new Text('', textStyle);
        this.multiplierText.anchor.set(0.5);
        this.multiplierText.position.set(0, -200); // Placeholder position
        this.multiplierText.visible = false;
        this.uiContainer.addChild(this.multiplierText);

        this.specialMessage = new Text('', textStyle);
        this.specialMessage.anchor.set(0.5);
        this.specialMessage.position.set(0, -150); // Placeholder position
        this.specialMessage.visible = false;
        this.uiContainer.addChild(this.specialMessage);

        this.eventManager.on(GameEvent.FREE_SPINS_START as any, this.handleFreeSpinsAwarded.bind(this));
        this.eventManager.on(GameEvent.FREE_SPINS_END as any, this.handleFreeSpinsConcluded.bind(this));
        this.eventManager.on(GameEvent.GAME_STATE_CHANGED as any, this.handleGameStateChanged.bind(this));
    }

    private handleGameStateChanged(data: { newState: string, oldState: string }): void {
        if (data.newState === 'FREE_SPINS_INTRO') {
            this.startFreeSpinsMode();
        } else if (data.newState === 'FREE_SPINS_OUTRO') {
            this.endFreeSpinsMode();
        } else if (data.newState === 'FREE_SPIN_IDLE') {
            // This could be used to update the display or handle per-spin updates
            this.updateProgressiveMultiplier();
        }
    }

    private handleFreeSpinsAwarded(data: IFreeSpinsAwardedData): void {
        if (data.retrigger && this.isActive) {
            this.handleRetrigger(data);
        } else {
            this.spinCounter = 0;
            this.retriggersCounter = 0;
            this.updateDisplay(data.currentSpins, data.totalSpins, data.multiplier);
            
            if (this.specialMessage) {
                this.specialMessage.text = 'FREE SPINS AWARDED!';
                this.specialMessage.visible = true;
                this.specialMessage.alpha = 0;
                
                new TWEEN.Tween(this.specialMessage)
                    .to({ alpha: 1 }, 300)
                    .start();
                
                // Hide special message after 3 seconds
                setTimeout(() => {
                    if (this.specialMessage) {
                        new TWEEN.Tween(this.specialMessage)
                            .to({ alpha: 0 }, 300)
                            .onComplete(() => {
                                if (this.specialMessage) this.specialMessage.visible = false;
                            })
                            .start();
                    }
                }, 3000);
            }
        }
        
        this.show();
    }

    private handleRetrigger(data: IFreeSpinsAwardedData): void {
        this.retriggersCounter++;
        
        let newRemainingSpins = this.gameFlowController.getRemainingFreeSpins();
        if (this.config.retriggersAddSpins) {
            newRemainingSpins += data.totalSpins;
        } else {
            newRemainingSpins = Math.max(newRemainingSpins, data.totalSpins);
        }
        
        const newTotalSpins = this.gameFlowController.getTotalFreeSpins() + 
                             (this.config.retriggersAddSpins ? data.totalSpins : 0);
        
        this.updateDisplay(newRemainingSpins, newTotalSpins, data.multiplier);
        
        if (this.specialMessage) {
            this.specialMessage.text = 'FREE SPINS RETRIGGER!';
            this.specialMessage.visible = true;
            this.specialMessage.alpha = 0;
            
            new TWEEN.Tween(this.specialMessage)
                .to({ alpha: 1 }, 300)
                .start();
            
            // Hide special message after 3 seconds
            setTimeout(() => {
                if (this.specialMessage) {
                    new TWEEN.Tween(this.specialMessage)
                        .to({ alpha: 0 }, 300)
                        .onComplete(() => {
                            if (this.specialMessage) this.specialMessage.visible = false;
                        })
                        .start();
                }
            }, 3000);
        }
    }

    private handleFreeSpinsConcluded(): void {
        this.hide();
        this.eventManager.emit(GameEvent.FREE_SPINS_OUTRO_COMPLETE as any);
    }

    // Switch to free spins reel strips if available
    private startFreeSpinsMode(): void {
        this.isActive = true;
        
        // Switch to free spins reel strips if configured and available
        if (this.config.useSpecialReelStrips && this.reelController) {
            // Store original reel strips for restoration later
            this.originalReelStrips = this.reelController.getReelStrips().map(strip => [...strip]);
            
            // Get free spins reel strips from game flow controller
            const freeSpinsReelStrips = this.gameFlowController.getFreeSpinsReelStrips();
            if (freeSpinsReelStrips && freeSpinsReelStrips.length > 0) {
                console.log('FreeSpinsController: Switching to free spins reel strips');
                this.reelController.updateReelStrips(freeSpinsReelStrips);
                
                // Notify any registered listeners that reel strips have changed
                this.eventManager.emit(GameEvent.REELS_SWITCHED_TO_FREE_SPINS_MODE as any);
            }
        }
    }

    // Restore original reel strips when free spins end
    private endFreeSpinsMode(): void {
        this.isActive = false;
        
        // Restore original reel strips if we switched them
        if (this.config.useSpecialReelStrips && this.reelController && this.originalReelStrips) {
            console.log('FreeSpinsController: Restoring original reel strips');
            this.reelController.updateReelStrips(this.originalReelStrips);
            this.originalReelStrips = null;
            
            // Notify any registered listeners that reel strips have been restored
            this.eventManager.emit(GameEvent.REELS_RESTORED_FROM_FREE_SPINS_MODE as any);
        }
    }

    // Update multiplier based on number of spins if progressive multipliers are configured
    private updateProgressiveMultiplier(): void {
        if (!this.isActive || !this.config.progressiveMultipliers || this.config.progressiveMultipliers.length === 0) {
            return;
        }
        
        this.spinCounter++;
        
        // Determine which multiplier should be active based on the spin count
        const multiplierIndex = Math.min(this.spinCounter - 1, this.config.progressiveMultipliers.length - 1);
        const newMultiplier = this.config.progressiveMultipliers[multiplierIndex];
        
        if (newMultiplier && newMultiplier !== this.gameFlowController.getFreeSpinsMultiplier()) {
            console.log(`FreeSpinsController: Updating multiplier to ${newMultiplier} on spin ${this.spinCounter}`);
            
            // Update display with new multiplier
            this.updateDisplay(
                this.gameFlowController.getRemainingFreeSpins(),
                this.gameFlowController.getTotalFreeSpins(),
                newMultiplier
            );
            
            // Notify game that multiplier has changed
            this.eventManager.emit(GameEvent.FREE_SPINS_MULTIPLIER_CHANGED as any, {
                multiplier: newMultiplier,
                previousMultiplier: this.gameFlowController.getFreeSpinsMultiplier(),
                spinNumber: this.spinCounter
            });
            
            // Display special message for multiplier change
            if (this.specialMessage) {
                this.specialMessage.text = `MULTIPLIER INCREASED TO x${newMultiplier}!`;
                this.specialMessage.visible = true;
                this.specialMessage.alpha = 0;
                
                new TWEEN.Tween(this.specialMessage)
                    .to({ alpha: 1 }, 300)
                    .start();
                
                // Hide special message after 3 seconds
                setTimeout(() => {
                    if (this.specialMessage) {
                        new TWEEN.Tween(this.specialMessage)
                            .to({ alpha: 0 }, 300)
                            .onComplete(() => {
                                if (this.specialMessage) this.specialMessage.visible = false;
                            })
                            .start();
                    }
                }, 3000);
            }
        }
    }

    // Public method for SlotScene to call to update the display
    public updateDisplay(currentSpins: number, totalSpins: number, multiplier: number): void {
        if (this.freeSpinsText) {
            this.freeSpinsText.text = `Free Spins: ${currentSpins} / ${totalSpins}`;
        }
        if (this.multiplierText) {
            this.multiplierText.text = `Multiplier: x${multiplier}`;
        }
    }
    
    // setMultiplier might be called if multiplier changes mid-free spins by some game mechanic
    public setMultiplier(multiplier: number, currentSpins: number, totalSpins: number): void {
        this.updateDisplay(currentSpins, totalSpins, multiplier);
    }

    public getSpinCounter(): number {
        return this.spinCounter;
    }

    public getRetriggersCount(): number {
        return this.retriggersCounter;
    }

    public isInFreeSpinsMode(): boolean {
        return this.isActive;
    }

    public show(): void {
        if (this.freeSpinsText) {
            this.freeSpinsText.visible = true;
            this.freeSpinsText.alpha = 0;
            new TWEEN.Tween(this.freeSpinsText)
                .to({ alpha: 1 }, 300)
                .start();
        }
        if (this.multiplierText) {
            this.multiplierText.visible = true;
            this.multiplierText.alpha = 0;
            new TWEEN.Tween(this.multiplierText)
                .to({ alpha: 1 }, 300)
                .start();
        }
    }

    public hide(): void {
        if (this.freeSpinsText) {
            new TWEEN.Tween(this.freeSpinsText)
                .to({ alpha: 0 }, 300)
                .onComplete(() => {
                    if(this.freeSpinsText) this.freeSpinsText.visible = false;
                })
                .start();
        }
        if (this.multiplierText) {
            new TWEEN.Tween(this.multiplierText)
                .to({ alpha: 0 }, 300)
                .onComplete(() => {
                    if(this.multiplierText) this.multiplierText.visible = false;
                })
                .start();
        }
    }

    public resize(scale: number, centerX: number, topY: number): void {
        const yOffsetSpins = -250 * scale;
        const yOffsetMultiplier = -200 * scale;
        const yOffsetSpecial = -150 * scale;
        const fontSize = 36 * scale;

        if (this.freeSpinsText) {
            this.freeSpinsText.style.fontSize = fontSize;
            this.freeSpinsText.position.set(centerX, topY + yOffsetSpins);
        }
        if (this.multiplierText) {
            this.multiplierText.style.fontSize = fontSize;
            this.multiplierText.position.set(centerX, topY + yOffsetMultiplier);
        }
        if (this.specialMessage) {
            this.specialMessage.style.fontSize = fontSize;
            this.specialMessage.position.set(centerX, topY + yOffsetSpecial);
        }
    }
} 