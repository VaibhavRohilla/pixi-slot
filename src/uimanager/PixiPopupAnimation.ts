import * as PIXI from 'pixi.js';
import * as TWEEN from '@tweenjs/tween.js';
import { EventManager, GameEvent } from '../core/utils/EventManager';
import { Globals } from '../core/Global';

export interface IPixiPopupAnimationOptions {
    textureKey?: string; // Fallback if animation frames/name not provided for a static sprite
    atlasKey?: string; // Spritesheet key if frames are from an atlas
    animationName?: string; // Predefined animation name in atlas.data.animations
    animationFrames?: string[] | PIXI.Texture[]; // Explicit frame names or textures for PIXI.AnimatedSprite
    frameRate?: number;
    loopAnimation?: boolean;
    
    initialScale?: number; // Overall initial scale of the popup content (sprite)
    scaleFactorX?: number; // For scale-up animation (multiplies initialScale)
    scaleFactorY?: number; // For scale-up animation (multiplies initialScale)
    isScalingUpOnShow?: boolean; // Whether to do the scale-up tween on show (default true)
    
    fadeInDuration?: number;
    fadeOutDuration?: number;
    showAnimationDuration?: number; // If > 0, schedules a hide after this duration (from when show is complete)
    delayAfterAnimComplete?: number; // If sprite has frame animation, delay before hiding after it completes

    anchorX?: number;
    anchorY?: number;
    initialVisibility?: boolean;
    depth?: number; // zIndex for PIXI v5+ (though direct zIndex is often better handled by parent container order)
}

const DEFAULT_POPUP_OPTIONS: Required<Omit<IPixiPopupAnimationOptions, 'textureKey'| 'atlasKey' | 'animationName' | 'animationFrames' | 'depth'> & Pick<IPixiPopupAnimationOptions, 'depth'>> = {
    frameRate: 24,
    loopAnimation: false,
    initialScale: 1.0,
    scaleFactorX: 1.5,
    scaleFactorY: 1.5,
    isScalingUpOnShow: true,
    fadeInDuration: 200,
    fadeOutDuration: 200,
    showAnimationDuration: -1, // -1 means no auto-hide based on duration
    delayAfterAnimComplete: 0,
    anchorX: 0.5,
    anchorY: 0.5,
    initialVisibility: false,
    depth: 100, // Default depth, similar to Phaser's PopupAnimation
};

export class PixiPopupAnimation extends PIXI.Container {
    public readonly nameKey: string;
    private sprite: PIXI.Sprite | PIXI.AnimatedSprite | null = null;
    private options: Required<Omit<IPixiPopupAnimationOptions, 'textureKey'| 'atlasKey' | 'animationName' | 'animationFrames' | 'depth'> & Pick<IPixiPopupAnimationOptions, 'depth'>> & IPixiPopupAnimationOptions;
    private eventManager: EventManager;
    private activeTweens: TWEEN.Tween<any>[] = [];
    private showTimerId: number | null = null;
    private delayAfterAnimTimerId: number | null = null;
    private _isShowing: boolean = false;
    private hasFrameAnimation: boolean = false;

    constructor(nameKey: string, options: IPixiPopupAnimationOptions) {
        super();
        this.nameKey = nameKey;
        this.options = { ...DEFAULT_POPUP_OPTIONS, ...options };
        this.eventManager = EventManager.getInstance();
        
        this.initSprite();
        this.initEventHandlers();

        if (this.sprite) {
            this.sprite.anchor.set(this.options.anchorX, this.options.anchorY);
            this.sprite.scale.set(this.options.initialScale);
            this.addChild(this.sprite);
        }
        this.visible = this.options.initialVisibility;
        this.alpha = this.options.initialVisibility ? 1 : 0;
        this.zIndex = this.options.depth; // For PIXI v5+ layer/group based sorting if used
        console.log(`PixiPopupAnimation [${this.nameKey}] Initialized`);
    }

    private initSprite(): void {
        let createdSprite: PIXI.Sprite | PIXI.AnimatedSprite | null = null;

        if (this.options.atlasKey && (this.options.animationName || this.options.animationFrames)) {
            const atlas = Globals.resources[this.options.atlasKey] as PIXI.Spritesheet;
            if (atlas) {
                let animTextures: PIXI.Texture[] | undefined;
                if (this.options.animationName && atlas.animations && atlas.animations[this.options.animationName]) {
                    animTextures = atlas.animations[this.options.animationName];
                } else if (Array.isArray(this.options.animationFrames)) {
                    animTextures = this.options.animationFrames.map(frameIdOrTexture => {
                        if (typeof frameIdOrTexture === 'string') return atlas.textures[frameIdOrTexture];
                        return frameIdOrTexture; // Assumes it's already PIXI.Texture
                    }).filter(t => t) as PIXI.Texture[];
                }

                if (animTextures && animTextures.length > 0) {
                    createdSprite = new PIXI.AnimatedSprite(animTextures);
                    (createdSprite as PIXI.AnimatedSprite).animationSpeed = this.options.frameRate / 60;
                    (createdSprite as PIXI.AnimatedSprite).loop = this.options.loopAnimation;
                    (createdSprite as PIXI.AnimatedSprite).onComplete = this.onAnimationComplete.bind(this);
                    this.hasFrameAnimation = true;
                }
            }
        }
        
        if (!createdSprite && this.options.textureKey && Globals.resources[this.options.textureKey]) {
            createdSprite = new PIXI.Sprite(Globals.resources[this.options.textureKey] as PIXI.Texture);
            this.hasFrameAnimation = false;
        }

        if (!createdSprite) {
            console.warn(`PixiPopupAnimation [${this.nameKey}]: No texture or animation found for:`, this.options);
            // Create a placeholder if nothing else
            const placeholder = new PIXI.Graphics().beginFill(0xff00ff, 0.5).drawRect(-50,-50,100,100).endFill();
            this.addChild(placeholder);
        } else {
            this.sprite = createdSprite;
        }
    }

    private initEventHandlers(): void {
        // Listen for global show/hide events if this pattern is used
        this.eventManager.on(`${GameEvent.SHOW_POPUP_ANIMATION}_${this.nameKey}` as any, this.show.bind(this));
        this.eventManager.on(`${GameEvent.HIDE_POPUP_ANIMATION}_${this.nameKey}` as any, this.hide.bind(this));
    }

    public get isShowing(): boolean {
        return this._isShowing;
    }

    public getSprite(): PIXI.Sprite | PIXI.AnimatedSprite | null {
        return this.sprite;
    }

    public show(showData?: { duration?: number }): void {
        if (this._isShowing && !this.options.loopAnimation) return; // Don't restart if already showing and not a looping main anim
        this.clearTimers();
        this.activeTweens.forEach(t => t.stop());
        this.activeTweens = [];

        this._isShowing = true;
        this.visible = true;
        this.alpha = 0; // Start transparent for fade-in

        this.eventManager.emit(`${GameEvent.POPUP_ANIMATION_STARTED}_${this.nameKey}` as any, this);
        console.log(`PixiPopupAnimation [${this.nameKey}]: show()`);

        if (this.sprite) {
            this.sprite.visible = true;
            if (this.hasFrameAnimation && this.sprite instanceof PIXI.AnimatedSprite) {
                this.sprite.gotoAndPlay(0);
            }

            let currentScaleX = this.options.initialScale;
            let currentScaleY = this.options.initialScale;

            if (this.options.isScalingUpOnShow) {
                currentScaleX *= 0.05 / this.options.scaleFactorX; // Start small
                currentScaleY *= 0.05 / this.options.scaleFactorY;
                this.sprite.scale.set(currentScaleX, currentScaleY);

                const scaleUpTween = new TWEEN.Tween(this.sprite.scale)
                    .to({ x: this.options.initialScale * this.options.scaleFactorX, y: this.options.initialScale * this.options.scaleFactorY }, 300) // Duration from Phaser
                    .easing(TWEEN.Easing.Linear.None)
                    .onComplete(()=> this.sprite?.scale.set(this.options.initialScale)) // Reset to initial after overshoot for effect
                    .start();
                this.activeTweens.push(scaleUpTween);
            } else {
                this.sprite.scale.set(this.options.initialScale);
            }
        }

        const fadeInTween = new TWEEN.Tween(this)
            .to({ alpha: 1 }, this.options.fadeInDuration)
            .easing(TWEEN.Easing.Linear.None)
            .start();
        this.activeTweens.push(fadeInTween);

        const durationToUse = showData?.duration ?? this.options.showAnimationDuration;
        if (durationToUse > 0) {
            this.showTimerId = window.setTimeout(() => this.hide(), durationToUse);
        }
    }

    public hide(hideData?: { duration?: number }): void {
        if (!this._isShowing && !this.visible) return;
        this.clearTimers();
        this.activeTweens.forEach(t => t.stop());
        this.activeTweens = [];

        this.eventManager.emit(`${GameEvent.POPUP_ANIMATION_STOPPING}_${this.nameKey}` as any, this);
        console.log(`PixiPopupAnimation [${this.nameKey}]: hide()`);

        const fadeOutDuration = hideData?.duration ?? this.options.fadeOutDuration;
        if (fadeOutDuration > 0) {
            const fadeOutTween = new TWEEN.Tween(this)
                .to({ alpha: 0 }, fadeOutDuration)
                .easing(TWEEN.Easing.Linear.None)
                .onComplete(() => this.stopInternal(true))
                .start();
            this.activeTweens.push(fadeOutTween);
        } else {
            this.stopInternal(true);
        }
    }

    private onAnimationComplete(): void {
        if (!this._isShowing) return; // Only process if popup is meant to be showing
        this.eventManager.emit(`${GameEvent.POPUP_ANIMATION_FRAME_ANIM_COMPLETE}_${this.nameKey}` as any, this);
        console.log(`PixiPopupAnimation [${this.nameKey}]: onAnimationComplete()`);

        if (this.options.delayAfterAnimComplete > 0) {
            this.delayAfterAnimTimerId = window.setTimeout(() => this.hide(), this.options.delayAfterAnimComplete);
        } else if (!this.options.loopAnimation) {
            // If not looping and no specific delay, just stop/hide based on if a showDuration timer is running
            if(!this.showTimerId) this.hide(); 
        }
    }

    private stopInternal(wasVisible: boolean): void {
        this.visible = false;
        this.alpha = 0; 
        this._isShowing = false;
        if (this.sprite instanceof PIXI.AnimatedSprite) {
            this.sprite.stop();
        }
        if(this.sprite) this.sprite.visible = false;

        if (wasVisible) { // Only emit stop event if it was truly shown and now stopped
            this.eventManager.emit(`${GameEvent.POPUP_ANIMATION_STOPPED}_${this.nameKey}` as any, this);
            console.log(`PixiPopupAnimation [${this.nameKey}]: stopInternal()`);
        }
    }

    private clearTimers(): void {
        if (this.showTimerId) clearTimeout(this.showTimerId);
        if (this.delayAfterAnimTimerId) clearTimeout(this.delayAfterAnimTimerId);
        this.showTimerId = null;
        this.delayAfterAnimTimerId = null;
    }
    
    // --- Public utility methods ---
    public setSpriteFrame(frameId: string | number): void {
        if (this.sprite instanceof PIXI.Sprite) { // Includes AnimatedSprite
            this.sprite.texture = PIXI.utils.TextureCache[frameId as string] || PIXI.Texture.EMPTY;
             if (this.sprite instanceof PIXI.AnimatedSprite && typeof frameId === 'number') {
                this.sprite.gotoAndStop(frameId);
            }
        }
    }
    public setAnchor(x: number, y: number): void { if(this.sprite) this.sprite.anchor.set(x,y); }
    public setSpriteScale(x: number, y?: number): void { if(this.sprite) this.sprite.scale.set(x, y ?? x); }
    // Add setPosition, etc. as needed, potentially transforming this.position instead of sprite directly
    
    public destroy(options?: PIXI.IDestroyOptions | boolean): void {
        this.clearTimers();
        this.activeTweens.forEach(t => t.stop());
        this.activeTweens = [];
        this.eventManager.off(`${GameEvent.SHOW_POPUP_ANIMATION}_${this.nameKey}` as any, this.show.bind(this));
        this.eventManager.off(`${GameEvent.HIDE_POPUP_ANIMATION}_${this.nameKey}` as any, this.hide.bind(this));
        super.destroy(options);
    }
} 