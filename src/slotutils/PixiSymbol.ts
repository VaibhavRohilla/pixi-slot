import * as PIXI from 'pixi.js';
import { EventManager, GameEvent } from '../core/utils/EventManager';
import { Globals } from '../core/Global';
import { PixiPopupAnimation, IPixiPopupAnimationOptions } from './PixiPopupAnimation'; // Assuming this exists

export enum PixiSymbolState {
    IDLE = 'IDLE',
    ANIMATING = 'ANIMATING', // Standard win animation
    DROPPING = 'DROPPING',   // Specific drop/fall animation
    // BLUR = 'BLUR' // If a blur state is needed during fast spins
}

export interface IPixiSymbolConfig {
    staticSymbolAtlasKey: string; // Atlas for default static symbol textures
    animatedSymbolAtlasKey?: string; // Atlas for animated symbol textures (if different)
    winFrameOptions?: Partial<IPixiPopupAnimationOptions>; // Options for the win frame popup

    // Frame naming conventions (could be more complex if needed)
    staticFramePrefix?: string;    // e.g., 'sym_' or 'symbols/sym_'
    animatedFramePrefix?: string; // e.g., 'anim_sym_'
    dropFramePrefix?: string;     // e.g., 'drop_sym_'
    animationFrameCount?: number; // Default if not defined in atlas
    dropAnimationFrameCount?: number;

    defaultFPS?: number;
    defaultScale?: { x: number, y: number };
    animationScale?: { x: number, y: number }; // Scale during win animation
    // Add specific scales for drop animation if needed

    // Feature flags from defaultConfigSlot that might affect symbol behavior directly
    animateSymbolsWinframeInFreeSpins?: boolean;
    symbolsAnimReverseOrder?: boolean;
}

const DEFAULT_SYMBOL_CONFIG: Pick<IPixiSymbolConfig, 'staticFramePrefix' | 'defaultFPS' | 'defaultScale' | 'animationScale'> = {
    staticFramePrefix: 'sym_', // Example
    defaultFPS: 24,
    defaultScale: { x: 1.0, y: 1.0 },
    animationScale: { x: 1.1, y: 1.1 }, // Slight bump for animation
};

export class PixiSymbol extends PIXI.AnimatedSprite {
    public symbolId: number;
    private currentState: PixiSymbolState;
    private config: IPixiSymbolConfig & typeof DEFAULT_SYMBOL_CONFIG;
    private eventManager: EventManager;
    private winFrameEffect: PixiPopupAnimation | null = null;

    private staticSymbolTexture: PIXI.Texture | null = null;
    private animatedSymbolTextures: PIXI.Texture[] | null = null;
    private dropSymbolTextures: PIXI.Texture[] | null = null;

    constructor(initialSymbolId: number, config: IPixiSymbolConfig, initialX: number = 0, initialY: number = 0) {
        // Apply defaults to the passed config first
        const mergedConfig = { ...DEFAULT_SYMBOL_CONFIG, ...config };
        
        // Now use mergedConfig to get the initial texture for the super call
        const initialTexture = PixiSymbol.getSymbolTexture(initialSymbolId, mergedConfig.staticSymbolAtlasKey, mergedConfig.staticFramePrefix!);
        super(initialTexture ? [initialTexture] : [PIXI.Texture.EMPTY], false); 

        this.config = mergedConfig; // Assign fully merged config to this.config
        this.eventManager = EventManager.getInstance();
        this.symbolId = initialSymbolId;
        this.currentState = PixiSymbolState.IDLE;

        this.anchor.set(0.5);
        this.position.set(initialX, initialY);
        this.scale.set(this.config.defaultScale!.x, this.config.defaultScale!.y);

        this.loadTextures();
        this.setSymbol(initialSymbolId, PixiSymbolState.IDLE); // Apply initial state and texture

        if (this.config.winFrameOptions) {
            const winFrameName = `symbolWinFrame_${this.symbolId}_${Math.random().toString(36).substring(7)}`;
            this.winFrameEffect = new PixiPopupAnimation(winFrameName, { 
                initialVisibility: false, 
                ...this.config.winFrameOptions 
            });
            this.addChild(this.winFrameEffect); // Win frame is child of symbol
            this.winFrameEffect.position.set(0,0); // Centered on symbol (due to anchors)
        }
        console.log(`PixiSymbol ${this.symbolId} Initialized`);
    }

    private static getSymbolTexture(symbolId: number, atlasKey: string, prefix: string): PIXI.Texture | null {
        const atlas = Globals.resources[atlasKey] as PIXI.Spritesheet;
        if (atlas && atlas.textures) {
            const frameName = `${prefix}${symbolId}`;
            return atlas.textures[frameName] || null;
        }
        return null;
    }

    private static getAnimationFrames(symbolId: number, atlasKey: string, animPrefix: string, frameCount?:number ): PIXI.Texture[] | null {
        const atlas = Globals.resources[atlasKey] as PIXI.Spritesheet;
        if (!atlas) return null;
        
        const animKey = `${animPrefix}${symbolId}`;
        if(atlas.animations && atlas.animations[animKey]){
            return atlas.animations[animKey];
        }
        // Fallback to manual frame loading if not in atlas.animations
        if(frameCount && atlas.textures){
            const frames: PIXI.Texture[] = [];
            for(let i=0; i < frameCount; i++){
                const frameName = `${animKey}_${i.toString().padStart(2,'0')}`; //e.g. anim_sym_0_00
                if(atlas.textures[frameName]) frames.push(atlas.textures[frameName]);
                else break;
            }
            return frames.length > 0 ? frames : null;
        }
        return null;
    }

    private loadTextures(): void {
        this.staticSymbolTexture = PixiSymbol.getSymbolTexture(this.symbolId, this.config.staticSymbolAtlasKey, this.config.staticFramePrefix!);
        
        if (this.config.animatedSymbolAtlasKey && this.config.animatedFramePrefix) {
            this.animatedSymbolTextures = PixiSymbol.getAnimationFrames(this.symbolId, this.config.animatedSymbolAtlasKey, this.config.animatedFramePrefix!, this.config.animationFrameCount);
        } else {
            this.animatedSymbolTextures = null;
        }

        if (this.config.animatedSymbolAtlasKey && this.config.dropFramePrefix) { 
            this.dropSymbolTextures = PixiSymbol.getAnimationFrames(this.symbolId, this.config.animatedSymbolAtlasKey, this.config.dropFramePrefix!, this.config.dropAnimationFrameCount);
        } else {
            this.dropSymbolTextures = null;
        }
    }

    public getCurrentState(): PixiSymbolState {
        return this.currentState;
    }

    public setSymbol(symbolId: number, state: PixiSymbolState = PixiSymbolState.IDLE): Promise<void> {
        if (this.symbolId !== symbolId) {
            this.symbolId = symbolId;
            this.loadTextures(); 
        }

        const oldState = this.currentState;
        this.currentState = state;

        this.stop(); 
        if (this.winFrameEffect) this.winFrameEffect.hide({ duration: 0 });

        let animationPromise: Promise<void> = Promise.resolve();

        switch (this.currentState) {
            case PixiSymbolState.IDLE:
                this.setToIdleState();
                break;
            case PixiSymbolState.ANIMATING:
                this.setToAnimatingState(); // This might also need to return a Promise if its animations have a defined end for sequence control
                break;
            case PixiSymbolState.DROPPING:
                animationPromise = this.setToDroppingState();
                break;
        }

        if (oldState === PixiSymbolState.DROPPING && this.currentState !== PixiSymbolState.DROPPING) {
             // SYMBOL_DROP_ANIM_ENDED is now effectively handled by the promise resolution of setToDroppingState, 
             // followed by setToIdleState.
        }
        return animationPromise;
    }

    private setToIdleState(): void {
        if (this.staticSymbolTexture) {
            this.textures = [this.staticSymbolTexture]; // Show static texture
            this.texture = this.staticSymbolTexture; // Ensure current texture is updated
        } else {
            console.warn(`PixiSymbol ${this.symbolId}: Static texture missing for idle state.`);
            this.textures = [PIXI.Texture.EMPTY];
            this.texture = PIXI.Texture.EMPTY;
        }
        this.scale.set(this.config.defaultScale?.x ?? 1.0, this.config.defaultScale?.y ?? 1.0);
        this.loop = false;
    }

    private setToAnimatingState(isFreeSpins?: boolean): void {
        if (this.animatedSymbolTextures && this.animatedSymbolTextures.length > 0) {
            this.textures = this.animatedSymbolTextures;
            this.animationSpeed = (this.config.defaultFPS ?? 24) / 60;
            this.loop = true; // Or from config for specific symbol win anims
            this.gotoAndPlay(0);
            this.scale.set(this.config.animationScale?.x ?? 1.0, this.config.animationScale?.y ?? 1.0);

            if (this.winFrameEffect && (this.config.animateSymbolsWinframeInFreeSpins || !isFreeSpins) ) {
                this.winFrameEffect.show();
            }
        } else {
            this.setToIdleState(); // Fallback to idle if no animation
        }
    }

    private setToDroppingState(): Promise<void> {
        return new Promise<void>((resolve) => {
            if (this.dropSymbolTextures && this.dropSymbolTextures.length > 0) {
                this.textures = this.dropSymbolTextures;
                this.animationSpeed = (this.config.defaultFPS ?? 24) / 60;
                this.loop = false; 
                this.onComplete = () => {
                    this.onComplete = undefined; // Clear listener with undefined
                    this.setToIdleState(); // Revert to idle after drop completes
                    this.eventManager.emit(GameEvent.SYMBOL_DROP_ANIM_ENDED as any, this);
                    resolve();
                };
                this.gotoAndPlay(0);
                this.scale.set(this.config.defaultScale?.x ?? 1.0, this.config.defaultScale?.y ?? 1.0);
                this.eventManager.emit(GameEvent.SYMBOL_DROP_ANIM_STARTED as any, this);
            } else {
                this.setToIdleState(); // Fallback to idle if no drop animation
                resolve(); // Resolve immediately if no animation
            }
        });
    }
    
    public async playDropAnimation(): Promise<void> {
        return this.setSymbol(this.symbolId, PixiSymbolState.DROPPING);
    }

    public playWinAnimation(): void { // More explicit control for win frame
        if (this.winFrameEffect) {
            this.winFrameEffect.show();
        }
    }
    public stopWinAnimation(): void {
        if (this.winFrameEffect) {
            this.winFrameEffect.hide();
        }
    }
    
    public resizeSymbol(): void { /* Placeholder for now */ }

    public destroy(options?: PIXI.IDestroyOptions | boolean): void {
        if (this.winFrameEffect) {
            this.winFrameEffect.destroy();
            this.winFrameEffect = null;
        }
        super.destroy(options);
    }
} 