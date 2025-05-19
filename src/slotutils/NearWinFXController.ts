import { Container, Sprite, Graphics, Texture } from 'pixi.js';
import * as TWEEN from '@tweenjs/tween.js';
import { EventManager, GameEvent } from '../core/utils/EventManager';
// We might need access to Reel dimensions or the Reel class itself later
// For now, let's assume SlotScene will provide necessary info or sprite references.

// Forward declaration for Reel if it's not directly importable or to avoid circular dependency issues
// This assumes Reel class has getPosition(), getSymbolWidth(), getSymbolHeight(), numVisibleSymbols properties/methods.
// For now, we'll assume SlotScene passes the necessary geometry or the Reel instances themselves.
interface ReelGeo {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface ILandedScatterInfo {
    reelIndex: number;
    symbolRow: number; // The row index on the reel where the scatter landed
    symbolSprite?: Sprite | null; // Optional: direct reference to the symbol sprite for animation (changed to Sprite | null | undefined)
}

export class NearWinFXController {
    private effectsContainer: Container;
    private eventManager: EventManager;
    private activeEffects: (TWEEN.Tween<any> | Graphics)[] = []; // Can store Tweens or Graphics objects
    private reelHighlightGraphics: Graphics[] = [];

    constructor(effectsContainer: Container) {
        this.effectsContainer = effectsContainer;
        this.eventManager = EventManager.getInstance();
        // this.initEventListeners(); // If controller needs to react to global events
        console.log('NearWinFXController Initialized');
    }

    // private initEventListeners(): void {
    //     // Example: Listen for an event that might abruptly end near win (e.g., scene change)
    //     this.eventManager.on(GameEvent.SCENE_CHANGED, () => this.stopNearWinEffect());
    // }

    /**
     * Starts the visual effect for a near-win situation.
     * @param landedScatters - Information about the scatter symbols that have already landed.
     * @param stillSpinningReelIndices - Indices of reels that are still spinning.
     * @param reelsPublicData - Public data about the reels.
     */
    public startNearWinEffect(
        landedScatters: ILandedScatterInfo[],
        stillSpinningReelIndices: number[],
        reelsPublicData: {x: number, y: number, width: number, height: number, symbolHeight: number, numVisibleSymbols: number }[] // Pass geometry data
    ): void {
        console.log('NearWinFXController: startNearWinEffect', landedScatters, stillSpinningReelIndices);
        this.stopNearWinEffect(); // Clear any previous effects first

        landedScatters.forEach(scatter => {
            if (scatter.symbolSprite) {
                const originalScale = { x: scatter.symbolSprite.scale.x, y: scatter.symbolSprite.scale.y };
                const pulseTween = new TWEEN.Tween(scatter.symbolSprite.scale)
                    .to({ x: originalScale.x * 1.2, y: originalScale.y * 1.2 }, 300)
                    .easing(TWEEN.Easing.Sinusoidal.InOut)
                    .yoyo(true)
                    .repeat(Infinity)
                    .start();
                this.activeEffects.push(pulseTween);
            }
        });

        stillSpinningReelIndices.forEach(reelIndex => {
            const reelData = reelsPublicData[reelIndex];
            if (reelData) {
                const highlight = new Graphics();
                highlight.beginFill(0xFFD700, 0.2); // Gold, semi-transparent
                highlight.drawRect(0, 0, reelData.width, reelData.numVisibleSymbols * reelData.symbolHeight);
                highlight.endFill();
                highlight.position.set(reelData.x - reelData.width / 2, reelData.y - (reelData.numVisibleSymbols * reelData.symbolHeight) / 2 ); // Assuming reelData.x,y is center
                
                // If reelData.x,y is top-left of the reel container in SlotScene, then:
                // highlight.position.set(reelData.x, reelData.y);
                // This depends on how SlotScene calculates and passes reel positions.
                // For SlotScene, reel.position.set(startX + i * reelSpacing, 100);
                // The `100` is a y-offset. The reel's internal drawing is from its own (0,0).
                // The mask is drawRect(0,0, width, height). So reel x,y is top-left of its mask.
                highlight.position.set(reelData.x, reelData.y); // Assuming reelData provides top-left of the reel frame

                this.effectsContainer.addChild(highlight);
                this.reelHighlightGraphics.push(highlight);
                this.activeEffects.push(highlight); // Add to activeEffects for general cleanup if needed

                // Optional: Animate the highlight itself
                highlight.alpha = 0;
                const flashTween = new TWEEN.Tween(highlight)
                    .to({ alpha: 0.7 }, 250)
                    .easing(TWEEN.Easing.Sinusoidal.InOut)
                    .yoyo(true)
                    .repeat(Infinity)
                    .start();
                this.activeEffects.push(flashTween);
            }
        });

        // 3. Potentially play a suspenseful sound - to be handled by SoundController via events
        this.eventManager.emit(GameEvent.NEAR_WIN_START as any, { landedScatters, stillSpinningReelIndices });
    }

    /**
     * Stops all active near-win visual effects.
     */
    public stopNearWinEffect(): void {
        console.log('NearWinFXController: stopNearWinEffect');
        this.activeEffects.forEach(effect => {
            if (effect instanceof TWEEN.Tween) {
                effect.stop();
            }
        });
        this.activeEffects = []; // Clear tweens

        this.reelHighlightGraphics.forEach(graphic => {
            this.effectsContainer.removeChild(graphic);
            graphic.destroy();
        });
        this.reelHighlightGraphics = [];

        this.eventManager.emit(GameEvent.NEAR_WIN_STOP as any);
    }

    // public onResize(scale: number): void {
    //     // If effects need to be resized/repositioned
    // }
} 