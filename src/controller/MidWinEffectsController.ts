import * as PIXI from 'pixi.js';
import { EventManager, GameEvent } from '../core/utils/EventManager';
import { PixiMidWinReelEffect, IPixiMidWinReelEffectConfig } from './PixiMidWinReelEffect';
import { Globals } from '../core/Global'; // For screen dimensions or general app state if needed

export interface IMidWinEffectsControllerConfig {
    reelCount: number;
    reelEffectConfig: IPixiMidWinReelEffectConfig; // Config for individual reel effects
    // Add any other specific configurations needed for the controller itself
}

export class MidWinEffectsController {
    private effectsContainer: PIXI.Container;
    private eventManager: EventManager;
    private config: IMidWinEffectsControllerConfig;
    private reelEffects: PixiMidWinReelEffect[] = [];
    private isPortrait: boolean = false; // Track orientation

    // Store latest reel data to avoid requesting it constantly if not needed
    // Or rely on events providing this data.
    private lastReelLayoutData: any = null; // Define a proper interface for this

    constructor(effectsContainer: PIXI.Container, config: IMidWinEffectsControllerConfig) {
        this.effectsContainer = effectsContainer;
        this.config = config;
        this.eventManager = EventManager.getInstance();

        this.initReelEffects();
        this.initEventHandlers();
        this.updateOrientation();
        console.log('MidWinEffectsController Initialized');
    }

    private initReelEffects(): void {
        for (let i = 0; i < this.config.reelCount; i++) {
            const reelEffect = new PixiMidWinReelEffect(this.config.reelEffectConfig);
            this.reelEffects.push(reelEffect);
            this.effectsContainer.addChild(reelEffect);
        }
    }

    private initEventHandlers(): void {
        // Listen for events that should trigger the mid-win frames
        // e.g., GameEvent.SHOW_MID_WIN_FRAMES or similar (needs to be defined)
        this.eventManager.on(GameEvent.SHOW_MID_WIN_FRAMES as any, this.handleShowEffects.bind(this));
        this.eventManager.on(GameEvent.HIDE_MID_WIN_FRAMES as any, this.handleHideEffects.bind(this));

        // Listen for reel/screen resize events to update positions
        // This event (e.g., GameEvent.REELS_RESIZED_OR_MOVED) needs to provide necessary geometric data.
        this.eventManager.on(GameEvent.REELS_LAYOUT_UPDATED as any, this.handleReelsLayoutUpdate.bind(this));
        this.eventManager.on(GameEvent.RESIZE as any, this.handleGameResize.bind(this));
        
        // TODO: Listen for an event from PixiMidWinReelEffect (e.g., when its topSprite animation loops)
        // to trigger the pulse animation on front/behind sprites for all reels.
        // This requires PixiMidWinReelEffect to emit an event or this controller to manage a timer.
    }

    private updateOrientation(): void {
        this.isPortrait = Globals.screenHeight > Globals.screenWidth;
    }

    private handleShowEffects(data?: { duration?: number, fadingTime?: number }): void {
        console.log('MidWinEffectsController: handleShowEffects');
        this.updatePositionsIfNeeded(); // Ensure positions are correct before showing
        this.reelEffects.forEach(effect => {
            effect.show(data?.duration, data?.fadingTime);
        });
        // Phaser code requests reel scene coords data here.
        // If REELS_LAYOUT_UPDATED isn't guaranteed to fire before this, might need to request/fetch data.
    }

    private handleHideEffects(data?: { fadingTime?: number }): void {
        console.log('MidWinEffectsController: handleHideEffects');
        this.reelEffects.forEach(effect => {
            effect.hide(data?.fadingTime);
        });
    }

    private handleReelsLayoutUpdate(reelsLayout: { 
        reels: { x: number; y: number; symbolWidth: number; symbolHeight: number; numVisibleSymbols: number; reelScale: number }[], 
        isPortrait: boolean 
    }): void {
        console.log('MidWinEffectsController: handleReelsLayoutUpdate');
        this.lastReelLayoutData = reelsLayout; // Store for potential use
        this.isPortrait = reelsLayout.isPortrait;
        if (reelsLayout && reelsLayout.reels.length === this.reelEffects.length) {
            reelsLayout.reels.forEach((reelData, index) => {
                if (this.reelEffects[index]) {
                    this.reelEffects[index].updatePositionAndScale(reelData, this.isPortrait);
                }
            });
        }
    }
    
    private handleGameResize(): void {
        this.updateOrientation();
        // If positions depend on global screen size, not just reel layout, then re-trigger updates.
        // For now, assume REELS_LAYOUT_UPDATED will provide all necessary context including orientation.
        // If not, we might need to call updatePositionAndScale here with stored/recalculated data.
        if (this.lastReelLayoutData) { // If we have previous layout data, try to re-apply with new orientation
            this.handleReelsLayoutUpdate({ ...this.lastReelLayoutData, isPortrait: this.isPortrait });
        }
    }
    
    private updatePositionsIfNeeded(): void {
        // Placeholder: If direct access to reel data is needed outside of event updates.
        // For example, if GameFlowController.getReelLayoutData() exists.
        // Or emit an event to request layout data if it's stale.
    }

    // Method to trigger pulsing on front/behind elements if managed centrally
    public triggerPulseOnReelEffects(duration: number): void {
        this.reelEffects.forEach(effect => {
            // This assumes the pulsing should happen on all simultaneously.
            // Phaser's logic was: top anim on reel 0 loops -> pulse front/behind on ALL reels.
            effect.playPulseAnimation(duration);
        });
    }

    public destroy(): void {
        this.eventManager.off(GameEvent.SHOW_MID_WIN_FRAMES as any, this.handleShowEffects.bind(this));
        this.eventManager.off(GameEvent.HIDE_MID_WIN_FRAMES as any, this.handleHideEffects.bind(this));
        this.eventManager.off(GameEvent.REELS_LAYOUT_UPDATED as any, this.handleReelsLayoutUpdate.bind(this));
        this.eventManager.off(GameEvent.RESIZE as any, this.handleGameResize.bind(this));

        this.reelEffects.forEach(effect => effect.destroy());
        this.reelEffects = [];
        this.effectsContainer.removeChildren(); // Or more selectively if effectsContainer is shared
    }
} 