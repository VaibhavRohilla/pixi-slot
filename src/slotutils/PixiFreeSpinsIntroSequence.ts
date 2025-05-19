import * as PIXI from 'pixi.js';
import * as TWEEN from '@tweenjs/tween.js';
import { Globals } from '../core/Global';
import { EventManager, GameEvent } from '../core/utils/EventManager';
import { PixiTextPopup, IPixiTextPopupOptions } from './PixiTextPopup';
import { PixiBorderLights, IPixiBorderLightsConfig } from './PixiBorderLights';
import { PixiPopupAnimation, IPixiPopupAnimationOptions } from './PixiPopupAnimation';

export interface IPixiFreeSpinsIntroLayoutConfig {
    wheelPos?: { x: number, y: number };
    titleTextPos?: { x: number, y: number };
    winningCardPos?: { x: number, y: number };
    awardTextPos?: { x: number, y: number };
    // Add other element positions as needed
}

export interface IPixiFreeSpinsIntroConfig {
    name: string;
    layout: {
        portrait: IPixiFreeSpinsIntroLayoutConfig;
        landscape: IPixiFreeSpinsIntroLayoutConfig;
    };
    textures: {
        dimmingLayer?: string; // Optional, can use Graphics if not provided
        wheelStatic: string; // e.g., 'wheel' from Phaser
        wheelRotatingPart: string; // e.g., 'wheelRotatingPart'
        wheelPointer: string; // e.g., 'wheelPointer'
        cardsAtlas: string; // e.g., 'freeSpinsIntroCards' - for number of spins
        shineAtlas?: string; // e.g., 'freeSpinsIntro' for 'Near Win Frame_' like shine
        shineAnimationName?: string; // if shine is an animation in shineAtlas
    };
    textPopupOptions?: {
        title?: Partial<IPixiTextPopupOptions>;
        award?: Partial<IPixiTextPopupOptions>;
    };
    // borderLightsConfig?: IPixiBorderLightsConfig; // If border lights are used
    animationTimings: {
        cameraFlashDuration?: number; // ms
        wheelSpinDuration?: number; // ms
        delayBeforeAwardReveal?: number; // ms, after wheel stops
        awardDisplayDuration?: number; // ms, before everything fades
        sequenceFadeOutDuration?: number; // ms
    };
    // Mapping from spins/multiplier to wheel angle or card frame - simplified for now
    // This might be complex if the wheel has distinct segments for each possible outcome.
    // For now, we might just display the awarded values directly after an animation.
    cardFramePrefix?: string; // e.g., if cards in atlas are named 'card_10', 'card_12' etc.
                               // If not provided, text might be used on a generic card background.
    defaultFont?: string; // Fallback font if not in textPopupOptions
}

// Default configuration values (ensure this aligns with the new IPixiFreeSpinsIntroConfig)
const DEFAULT_FS_INTRO_CONFIG: Pick<IPixiFreeSpinsIntroConfig, 'animationTimings' | 'cardFramePrefix' | 'defaultFont'> = {
    animationTimings: {
        cameraFlashDuration: 500,
        wheelSpinDuration: 5000,
        delayBeforeAwardReveal: 1000, 
        awardDisplayDuration: 2000,
        sequenceFadeOutDuration: 500,
    },
    cardFramePrefix: 'card_',
    defaultFont: 'Arial'
};

export class PixiFreeSpinsIntroSequence extends PIXI.Container {
    private config: IPixiFreeSpinsIntroConfig;
    private eventManager: EventManager;
    private dimmingLayer: PIXI.Graphics | PIXI.Sprite | null = null;
    private wheelStatic: PIXI.Sprite | null = null;
    private wheelRotatingPart: PIXI.Sprite | null = null; 
    private wheelPointer: PIXI.Sprite | null = null;
    private titleTextPopup: PixiTextPopup | null = null;
    private winningCardSprite: PIXI.Sprite | null = null;
    private winningCardShine: PIXI.AnimatedSprite | PIXI.Sprite | null = null;
    private awardTextPopup: PixiTextPopup | null = null;
    
    private activeTweens: TWEEN.Tween<any>[] = [];
    private isShowing: boolean = false;

    constructor(config: IPixiFreeSpinsIntroConfig) {
        super();
        const mergedTimings = { 
            ...(DEFAULT_FS_INTRO_CONFIG.animationTimings || {}),
            ...(config.animationTimings || {})
        };
        this.config = {
            ...DEFAULT_FS_INTRO_CONFIG, 
            ...config, 
            animationTimings: mergedTimings
        };
        this.name = this.config.name || 'FreeSpinsIntroSequence';
        this.eventManager = EventManager.getInstance();
        this.visible = false;
        this.alpha = 0;
        this.initChildElements(); 
        console.log(`PixiFreeSpinsIntroSequence [${this.name}] Initialized with config:`, JSON.stringify(this.config));
    }

    private initChildElements(): void {
        // 1. Dimming Layer
        if (this.config.textures.dimmingLayer && Globals.resources[this.config.textures.dimmingLayer]) {
            this.dimmingLayer = new PIXI.Sprite(Globals.resources[this.config.textures.dimmingLayer] as PIXI.Texture);
            if (this.dimmingLayer instanceof PIXI.Sprite) { // Ensure it's a sprite for width/height
                this.dimmingLayer.width = Globals.screenWidth; 
                this.dimmingLayer.height = Globals.screenHeight;
            }
        } else {
            this.dimmingLayer = new PIXI.Graphics().beginFill(0x000000, 0.7).drawRect(0,0,Globals.screenWidth, Globals.screenHeight).endFill();
        }
        this.addChild(this.dimmingLayer);
        this.dimmingLayer.visible = false;

        // 2. Wheel Static Background
        if (Globals.resources[this.config.textures.wheelStatic]) {
            this.wheelStatic = new PIXI.Sprite(Globals.resources[this.config.textures.wheelStatic] as PIXI.Texture);
            this.wheelStatic.anchor.set(0.5);
            this.addChild(this.wheelStatic);
        } else { console.warn(`FS Intro: Texture not found: ${this.config.textures.wheelStatic}`); }

        // 3. Wheel Rotating Part
        if (Globals.resources[this.config.textures.wheelRotatingPart]) {
            this.wheelRotatingPart = new PIXI.Sprite(Globals.resources[this.config.textures.wheelRotatingPart] as PIXI.Texture);
            this.wheelRotatingPart.anchor.set(0.5);
            if(this.wheelStatic) this.addChildAt(this.wheelRotatingPart, this.getChildIndex(this.wheelStatic) + 1); else this.addChild(this.wheelRotatingPart);
        } else { console.warn(`FS Intro: Texture not found: ${this.config.textures.wheelRotatingPart}`); }

        // 4. Wheel Pointer
        if (Globals.resources[this.config.textures.wheelPointer]) {
            this.wheelPointer = new PIXI.Sprite(Globals.resources[this.config.textures.wheelPointer] as PIXI.Texture);
            this.wheelPointer.anchor.set(0.5, 0.8); 
            if(this.wheelRotatingPart) this.addChildAt(this.wheelPointer, this.getChildIndex(this.wheelRotatingPart) + 1); else this.addChild(this.wheelPointer);
        } else { console.warn(`FS Intro: Texture not found: ${this.config.textures.wheelPointer}`); }

        // 5. Title Text Popup ("FREE SPINS")
        const titleStyle = this.config.textPopupOptions?.title?.style || { fontFamily: this.config.defaultFont, fontSize: 80, fill: '#FFFFFF', stroke: '#000000', strokeThickness: 8, align: 'center' };
        this.titleTextPopup = new PixiTextPopup({
            initialText: getGameLanguage() === 'sv' ? 'GRATISSNURR' : ' FREE\nSPINS',
            ...(this.config.textPopupOptions?.title || {}),
            style: titleStyle,
            visible: false
        });
        this.addChild(this.titleTextPopup);

        // 6. Winning Card Sprite
        if (Globals.resources[this.config.textures.cardsAtlas]) {
            const cardsAtlas = Globals.resources[this.config.textures.cardsAtlas] as PIXI.Spritesheet;
            const firstCardFrameKey = Object.keys(cardsAtlas.textures)[0];
            if(firstCardFrameKey && cardsAtlas.textures[firstCardFrameKey]) {
                this.winningCardSprite = new PIXI.Sprite(cardsAtlas.textures[firstCardFrameKey]);
                this.winningCardSprite.anchor.set(0.5);
                this.winningCardSprite.visible = false;
                this.addChild(this.winningCardSprite);
            } else { console.warn(`FS Intro: No frames found in cardsAtlas: ${this.config.textures.cardsAtlas}`);}
        } else { console.warn(`FS Intro: Cards Atlas not found: ${this.config.textures.cardsAtlas}`); }

        // 7. Winning Card Shine
        if (this.config.textures.shineAtlas && Globals.resources[this.config.textures.shineAtlas] && this.config.textures.shineAnimationName) {
            const shineAtlas = Globals.resources[this.config.textures.shineAtlas] as PIXI.Spritesheet;
            const shineAnimName = this.config.textures.shineAnimationName;
            if (shineAnimName && shineAtlas.animations && shineAtlas.animations[shineAnimName] && shineAtlas.animations[shineAnimName].length > 0) {
                const shineAnim = new PIXI.AnimatedSprite(shineAtlas.animations[shineAnimName]);
                shineAnim.loop = true;
                shineAnim.animationSpeed = 0.5; 
                shineAnim.anchor.set(0.5);
                shineAnim.visible = false;
                this.winningCardShine = shineAnim;
                if(this.winningCardSprite) this.addChildAt(this.winningCardShine, this.getChildIndex(this.winningCardSprite) + 1); else this.addChild(this.winningCardShine);
            } else { console.warn(`FS Intro: Shine animation '${shineAnimName}' not found or empty in atlas '${this.config.textures.shineAtlas}'.`); }
        } else if (this.config.textures.shineAtlas && !this.config.textures.shineAnimationName) { 
            console.warn(`FS Intro: Shine atlas '${this.config.textures.shineAtlas}' provided but shineAnimationName is missing in config.textures.`);
        } else if (this.config.textures.shineAnimationName && !this.config.textures.shineAtlas) {
            console.warn(`FS Intro: shineAnimationName '${this.config.textures.shineAnimationName}' provided but shineAtlas texture is missing in config.textures.`);
        }

        // 8. Award Text Popup
        const awardStyle = this.config.textPopupOptions?.award?.style || { fontFamily: this.config.defaultFont, fontSize: 60, fill: '#FFFF00', stroke: '#000000', strokeThickness: 6, align: 'center' };
        this.awardTextPopup = new PixiTextPopup({
            initialText: '', 
            ...(this.config.textPopupOptions?.award || {}),
            style: awardStyle,
            visible: false
        });
        this.addChild(this.awardTextPopup);

        // Set initial visibility for all major components (often false, controlled by startIntro)
        if(this.wheelStatic) this.wheelStatic.visible = false;
        if(this.wheelRotatingPart) this.wheelRotatingPart.visible = false;
        if(this.wheelPointer) this.wheelPointer.visible = false;
    }

    public startIntro(awardedSpins: number, awardedMultiplier: number, isRetrigger: boolean = false): void {
        console.log(`PixiFreeSpinsIntroSequence: Starting intro. Spins: ${awardedSpins}, Multiplier: ${awardedMultiplier}, Retrigger: ${isRetrigger}`);
        this.isShowing = true;
        this.visible = true;
        this.alpha = 1; // Assuming main container fade is handled elsewhere or not used for intro start

        this.activeTweens.forEach(t => t.stop());
        this.activeTweens = [];

        // 1. Show Dimming Layer
        if (this.dimmingLayer) {
            this.dimmingLayer.visible = true;
            this.dimmingLayer.alpha = 0;
            const dimTween = new TWEEN.Tween(this.dimmingLayer).to({ alpha: 0.7 }, 300).start(); // Match Phaser flash, then stay
            this.activeTweens.push(dimTween);
        }
        
        // Simplified sequence for now - directly show award, then wheel animation concept
        // TODO: Replicate Phaser's multi-stage sequence with camera flashes, wheel spin, card reveal.

        if (this.awardTextPopup) {
            const multiplierText = 'Multiplier'.toLocaleUpperCase(); // Localization needed
            const freeSpinsText = getGameLanguage() === 'sv' ? 'GRATISSNURR' : 'Free Spins'.toUpperCase();
            this.awardTextPopup.setText(`X${awardedMultiplier} ${multiplierText}\n${awardedSpins} ${freeSpinsText}`);
            this.awardTextPopup.show(true, 300); // Show with fade
        }
        
        // Placeholder for wheel elements visibility and animation
        if(this.wheelStatic) this.wheelStatic.visible = true;
        if(this.wheelRotatingPart) this.wheelRotatingPart.visible = true;
        if(this.wheelPointer) this.wheelPointer.visible = true;
        if(this.titleTextPopup) this.titleTextPopup.show(true, 300);

        // Simulate sequence duration and then hide
        const totalDuration = this.config.animationTimings.wheelSpinDuration || 5000;
        setTimeout(() => {
            if (this.isShowing) { // Ensure it wasn't hidden prematurely
                this.hideSequence();
            }
        }, totalDuration);
    }

    private hideSequence(): void {
        if (!this.isShowing) return;
        this.isShowing = false;

        const fadeOutDuration = this.config.animationTimings.sequenceFadeOutDuration || 500;

        this.activeTweens.forEach(t => t.stop());
        this.activeTweens = [];

        // Fade out all elements
        const elementsToFade = [this.wheelStatic, this.wheelRotatingPart, this.wheelPointer, this.winningCardSprite, this.winningCardShine, this.dimmingLayer];
        elementsToFade.forEach(el => {
            if (el && el.visible) {
                const fade = new TWEEN.Tween(el).to({alpha: 0}, fadeOutDuration).onComplete(() => el.visible = false).start();
                this.activeTweens.push(fade);
            }
        });
        this.titleTextPopup?.hide(true, fadeOutDuration);
        this.awardTextPopup?.hide(true, fadeOutDuration);

        // After fade out, emit completion and fully hide container
        setTimeout(() => {
        this.visible = false;
            this.alpha = 0; // Ensure alpha is 0
        this.eventManager.emit(GameEvent.FREE_SPINS_INTRO_COMPLETE as any);
            console.log(`PixiFreeSpinsIntroSequence [${this.name}] sequence complete.`);
        }, fadeOutDuration + 50); // Add a little buffer
    }

    public updateLayout(isPortrait: boolean): void {
        // Ensure this panel itself is positioned by UIManager first if needed.
        // For internal layout, we use Globals for screen dimensions.
        const screenW = Globals.screenWidth;
        const screenH = Globals.screenHeight;
        const middleX = screenW / 2;
        const middleY = screenH / 2;

        // Determine a base scale for the components in this sequence.
        // Phaser used 0.7 * data.reelsScale. We'll use Globals.scale as a reference.
        const baseComponentScale = Globals.scale * 0.8; // Adjust this factor as needed for visual balance

        const layoutConf = isPortrait ? this.config.layout.portrait : this.config.layout.landscape;

        // 1. Dimming Layer
        if (this.dimmingLayer) {
            // Make it relative to this container's parent (usually the stage or UIManager)
            // If this container (FreeSpinsIntroSequence) is added to stage at 0,0, then dimming layer at 0,0 works.
            // If this container is positioned by UIManager, dimming layer might need -this.x, -this.y if it needs to cover *global* screen.
            // For now, assume it covers the area of this container, which should be screen-sized by UIManager.
            if (this.dimmingLayer instanceof PIXI.Graphics) {
                this.dimmingLayer.clear().beginFill(0x000000, 0.7).drawRect(0, 0, screenW, screenH).endFill();
                this.dimmingLayer.x = -this.x; // Ensure it covers full screen regardless of this container's position
                this.dimmingLayer.y = -this.y;
            } else { // Is a Sprite
                this.dimmingLayer.x = -this.x;
                this.dimmingLayer.y = -this.y;
                this.dimmingLayer.width = screenW;
                this.dimmingLayer.height = screenH;
            }
        }

        // 2. Wheel Static
        if (this.wheelStatic) {
            this.wheelStatic.position.set(layoutConf.wheelPos?.x ?? middleX, layoutConf.wheelPos?.y ?? middleY);
            this.wheelStatic.scale.set(baseComponentScale);
        }

        // 3. Wheel Rotating Part
        if (this.wheelRotatingPart) {
            this.wheelRotatingPart.position.set(layoutConf.wheelPos?.x ?? middleX, layoutConf.wheelPos?.y ?? middleY);
            this.wheelRotatingPart.scale.set(baseComponentScale);
        }

        // 4. Wheel Pointer
        if (this.wheelPointer) {
            this.wheelPointer.position.set(layoutConf.wheelPos?.x ?? middleX, layoutConf.wheelPos?.y ?? middleY); // Position with wheel center
            // Anchor was (0.5, 0.8) - adjust if sprite gfx is different. Phaser used (0.5, 3.2) for its asset.
            this.wheelPointer.scale.set(baseComponentScale);
        }

        // 5. Title Text Popup
        if (this.titleTextPopup) {
            this.titleTextPopup.x = layoutConf.titleTextPos?.x ?? middleX;
            this.titleTextPopup.y = layoutConf.titleTextPos?.y ?? middleY - (100 * baseComponentScale); // Example offset
            this.titleTextPopup.setScale(baseComponentScale * 0.8); // Text popups have their own internal scaling
        }

        // 6. Winning Card Sprite
        if (this.winningCardSprite) {
            this.winningCardSprite.position.set(layoutConf.winningCardPos?.x ?? middleX, layoutConf.winningCardPos?.y ?? middleY + (50 * baseComponentScale)); // Example offset
            this.winningCardSprite.scale.set(baseComponentScale);
            const cardAngle = 6; // From Phaser example
            this.winningCardSprite.angle = cardAngle;
        }

        // 7. Winning Card Shine
        if (this.winningCardShine) {
            if (this.winningCardSprite) {
                this.winningCardShine.position.copyFrom(this.winningCardSprite.position);
                this.winningCardShine.scale.copyFrom(this.winningCardSprite.scale);
                this.winningCardShine.angle = this.winningCardSprite.angle;
            }
        }

        // 8. Award Text Popup
        if (this.awardTextPopup) {
            this.awardTextPopup.x = layoutConf.awardTextPos?.x ?? middleX;
            this.awardTextPopup.y = layoutConf.awardTextPos?.y ?? middleY + (150 * baseComponentScale); // Example offset
            this.awardTextPopup.setScale(baseComponentScale * 0.7);
        }
        
        console.log(`PixiFreeSpinsIntroSequence [${this.name}] Updated layout. Portrait: ${isPortrait}`);
    }

    public destroy(options?: PIXI.IDestroyOptions | boolean) {
        this.activeTweens.forEach(t => t.stop());
        this.activeTweens = [];
        // TODO: Remove any event listeners this component might have registered on EventManager
        // Destroy children if they are not handled by PixiTextPopup's own destroy, etc.
        this.dimmingLayer?.destroy();
        this.wheelStatic?.destroy();
        this.wheelRotatingPart?.destroy();
        this.wheelPointer?.destroy();
        this.titleTextPopup?.destroy();
        this.winningCardSprite?.destroy();
        this.winningCardShine?.destroy();
        this.awardTextPopup?.destroy();
        super.destroy(options);
    }
}

function getGameLanguage(): string { // Simple stub for now, ideally from a localization service
    return Globals.language || 'en';
} 