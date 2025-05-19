import * as PIXI from 'pixi.js';
import * as TWEEN from '@tweenjs/tween.js';
import { Globals } from '../core/Global'; // Assuming Globals might provide textures or configurations
import { EventManager, GameEvent } from '../core/utils/EventManager'; // Import EventManager

export interface IPixiMidWinReelEffectConfig {
    textures: {
        reelBehind: string; // Texture key for the sprite behind the reel
        reelFront: string;  // Texture key for the sprite in front of the reel (but behind symbols)
        midWinAnim: string; // Texture key for the top/bottom animation (likely a spritesheet)
    };
    animationSpeed?: number;
    // Configuration for scale factors, to be extracted from Phaser logic if not hardcoded
    scales?: {
        behind_port?: { x: number, y: number },
        behind_land?: { x: number, y: number },
        front_port?: { x: number, y: number },
        front_land?: { x: number, y: number },
        top_base_scale_multiplier?: number, // e.g. Phaser used a raw scale of 2 for midWinAnim
        bottom_base_scale_multiplier?: number,
    };
    // Configuration for anchor/origin points, if they differ from default 0.5
    anchors?: {
        front_port?: { x: number, y: number },
        front_land?: { x: number, y: number },
        // top and bottom are 0.5,0.5 in Phaser
    }
}

export class PixiMidWinReelEffect extends PIXI.Container {
    private config: IPixiMidWinReelEffectConfig;
    private behindSprite: PIXI.Sprite | null = null;
    private frontSprite: PIXI.Sprite | null = null;
    private topSprite: PIXI.AnimatedSprite | PIXI.Sprite | null = null; // Could be animated or static
    private bottomSprite: PIXI.AnimatedSprite | PIXI.Sprite | null = null;

    private activeTweens: TWEEN.Tween<any>[] = [];
    private eventManager: EventManager; // Add EventManager instance

    constructor(config: IPixiMidWinReelEffectConfig) {
        super();
        this.config = config;
        this.eventManager = EventManager.getInstance(); // Get instance
        this.initSprites();
    }

    private initSprites(): void {
        // Ensure textures are loaded in Globals.resources or pass them directly
        const behindTexture = Globals.resources[this.config.textures.reelBehind] as PIXI.Texture;
        if (behindTexture) {
            this.behindSprite = new PIXI.Sprite(behindTexture);
            this.behindSprite.anchor.set(0.5);
            this.addChild(this.behindSprite);
        } else {
            console.warn(`Texture not found: ${this.config.textures.reelBehind}`);
        }

        const frontTexture = Globals.resources[this.config.textures.reelFront] as PIXI.Texture;
        if (frontTexture) {
            this.frontSprite = new PIXI.Sprite(frontTexture);
            this.frontSprite.anchor.set(0.5);
            this.addChild(this.frontSprite);
        } else {
            console.warn(`Texture not found: ${this.config.textures.reelFront}`);
        }

        // For top/bottom, assuming midWinAnim might be a spritesheet
        // This part needs to be adapted based on how 'midWinAnim' textures are packed/named
        const midWinAnimSpritesheet = Globals.resources[this.config.textures.midWinAnim] as PIXI.Spritesheet;

        if (midWinAnimSpritesheet && midWinAnimSpritesheet.animations) {
            const animFrames = midWinAnimSpritesheet.animations['midWinAnim']; // Assuming animation name in sheet is 'midWinAnim'
            if (animFrames && animFrames.length > 0) { // Ensure animFrames is not empty
                const topAnimSprite = new PIXI.AnimatedSprite(animFrames);
                topAnimSprite.animationSpeed = (this.config.animationSpeed || 0.5);
                topAnimSprite.loop = true; // Keep it looping visually
                topAnimSprite.onLoop = this.handleTopSpriteLoop.bind(this); // Assign callback directly
                topAnimSprite.anchor.set(0.5);
                this.addChild(topAnimSprite);
                this.topSprite = topAnimSprite;

                const bottomAnimSprite = new PIXI.AnimatedSprite(animFrames); // Reuse frames
                bottomAnimSprite.animationSpeed = (this.config.animationSpeed || 0.5);
                bottomAnimSprite.loop = true;
                bottomAnimSprite.anchor.set(0.5);
                this.addChild(bottomAnimSprite);
                this.bottomSprite = bottomAnimSprite;
            } else {
                console.warn(`Animation 'midWinAnim' not found or empty in spritesheet: ${this.config.textures.midWinAnim}`);
                this.createPlaceholderTopBottomSprites();
            }
        } else {
            console.warn(`Spritesheet not found or has no animations: ${this.config.textures.midWinAnim}`);
            this.createPlaceholderTopBottomSprites();
        }
        
        this.visible = false;
    }

    private createPlaceholderTopBottomSprites(): void {
        const placeholderTexture = PIXI.Texture.WHITE; // Or some default graphic
        this.topSprite = new PIXI.Sprite(placeholderTexture);
        this.topSprite.width = 50; this.topSprite.height = 50; // Example size
        this.topSprite.anchor.set(0.5);
        this.addChild(this.topSprite);

        this.bottomSprite = new PIXI.Sprite(placeholderTexture);
        this.bottomSprite.width = 50; this.bottomSprite.height = 50;
        this.bottomSprite.anchor.set(0.5);
        this.addChild(this.bottomSprite);
    }

    private handleTopSpriteLoop(): void {
        // The TODO was: "Implement pulsing animation for front/behind sprites based on topSprite animation repeat"
        // This method is now called on loop. It will trigger the pulse.
        this.playPulseAnimation(200); // Example pulse duration
        this.eventManager.emit(GameEvent.MID_WIN_REEL_EFFECT_LOOPED as any, { reelEffect: this });
    }

    public show(duration: number = 0, fadingTime: number = 0): void {
        this.visible = true;
        this.alpha = 0;

        // Clear previous tweens
        this.activeTweens.forEach(tween => tween.stop());
        this.activeTweens = [];

        const showTween = new TWEEN.Tween(this)
            .to({ alpha: 1 }, fadingTime > 0 ? fadingTime : 200)
            .onComplete(() => {
                // Start looping animations if any (e.g., for topSprite if it's AnimatedSprite)
                if (this.topSprite instanceof PIXI.AnimatedSprite) {
                    this.topSprite.play();
                }
                if (this.bottomSprite instanceof PIXI.AnimatedSprite) {
                    this.bottomSprite.play();
                }
            })
            .start();
        this.activeTweens.push(showTween);
    }

    public hide(fadingTime: number = 0): void {
        // Clear previous tweens
        this.activeTweens.forEach(tween => tween.stop());
        this.activeTweens = [];

        const hideTween = new TWEEN.Tween(this)
            .to({ alpha: 0 }, fadingTime > 0 ? fadingTime : 200)
            .onComplete(() => {
                this.visible = false;
                if (this.topSprite instanceof PIXI.AnimatedSprite) {
                    this.topSprite.stop();
                }
                if (this.bottomSprite instanceof PIXI.AnimatedSprite) {
                    this.bottomSprite.stop();
                }
            })
            .start();
        this.activeTweens.push(hideTween);
    }

    /**
     * Updates the position and scale of the effect elements.
     * @param reelData - Geometric data of the reel (x, y, width, height, scale).
     * @param isPortrait - Current orientation.
     */
    public updatePositionAndScale(
        reelData: { 
            x: number; // Center X of the reel slot for this effect
            y: number; // Center Y of the reel slot for this effect
            symbolWidth: number; // Effective width of one reel column (used as deltaXReels)
            symbolHeight: number; // Unscaled height of one symbol cell
            numVisibleSymbols: number; 
            reelScale: number; // Overall scale of the reels
        },
        isPortrait: boolean,
        // Optionally pass deltaXReels if it's calculated by the controller from full layout
        // deltaXReelsExplicit?: number 
    ): void {
        if (!this.visible && !this.alpha) return; // Only update if meant to be seen or transitioning

        const reelCenterX = reelData.x;
        // Assuming reelData.y is the top of the reel visual area, common in Pixi layouts.
        // Phaser's data.reelsCoords[i].y + N * deltaYSymbol suggests its y was also top-like or symbol-row based.
        // Let's adjust to consider reelData.y as the top of the visible symbols area.
        const reelVisualTopY = reelData.y; 
        const baseReelScale = reelData.reelScale;
        
        // For deltaXReels, using symbolWidth might represent the width of a reel column including some spacing.
        // If it's just symbol visual width, a true deltaXReels (column to column center) would be needed from controller.
        const deltaXReels = reelData.symbolWidth; 
        const unscaledSymbolHeight = reelData.symbolHeight;
        const scaledSymbolHeight = baseReelScale * unscaledSymbolHeight;

        // The Y calculations in Phaser (e.g., `reelY + 1.5 * deltaYSymbol`) seem to be offsets from a reel's origin.
        // If our reelData.y is the top of the visible reel area, and we want our effects positioned relative to the 
        // *center* of the visible reel area height for some calculations:
        const reelVisibleHeight = reelData.numVisibleSymbols * scaledSymbolHeight;
        const reelVisualCenterY = reelVisualTopY + reelVisibleHeight / 2;

        // --- Behind Sprite --- 
        if (this.behindSprite) {
            // Phaser's reelWinBgResize is not fully known. We will use similar logic to 'front' but with 'behind' scales/offsets.
            // Offsets from Phaser: (isPort ? 0.455 : 0.485) * deltaXReels and (isPort ? 1.5 : 1.495) * deltaYSymbolScaled
            // These offsets are likely from the reel's origin (top-left in Phaser context usually).
            // Let's try to map: X relative to reelCenterX, Y relative to reelVisualTopY.
            const offsetX_b = (isPortrait ? 0.455 : 0.485) * deltaXReels;
            const offsetY_b = (isPortrait ? 1.5 : 1.495) * scaledSymbolHeight; 
            this.behindSprite.position.set(reelCenterX + offsetX_b - (deltaXReels / 2) , reelVisualTopY + offsetY_b);
            
            const scaleFactorX_b = isPortrait ? (this.config.scales?.behind_port?.x || 0.94) : (this.config.scales?.behind_land?.x || 1.2);
            const scaleFactorY_b = isPortrait ? (this.config.scales?.behind_port?.y || 1.15) : (this.config.scales?.behind_land?.y || 1.15);
            this.behindSprite.scale.set(baseReelScale * scaleFactorX_b, baseReelScale * scaleFactorY_b);
            this.behindSprite.anchor.set(0.5); // Assuming default anchor
        }

        // --- Front Sprite --- 
        if (this.frontSprite) {
            const frontAnchorX = isPortrait ? (this.config.anchors?.front_port?.x || 0.45) : (this.config.anchors?.front_land?.x || 0.5);
            const frontAnchorY = isPortrait ? (this.config.anchors?.front_port?.y || 0.5) : (this.config.anchors?.front_land?.y || 0.5);
            this.frontSprite.anchor.set(frontAnchorX, frontAnchorY);

            const offsetX_f = (isPortrait ? 0.444 : 0.479) * deltaXReels;
            const offsetY_f = 1.5 * scaledSymbolHeight;
            this.frontSprite.position.set(reelCenterX + offsetX_f - (deltaXReels/2), reelVisualTopY + offsetY_f);

            const scaleFactorX_f = isPortrait ? (this.config.scales?.front_port?.x || 0.94) : (this.config.scales?.front_land?.x || 1.2);
            const scaleFactorY_f = isPortrait ? (this.config.scales?.front_port?.y || 1.15) : (this.config.scales?.front_land?.y || 1.15);
            this.frontSprite.scale.set(baseReelScale * scaleFactorX_f, baseReelScale * scaleFactorY_f);
        }

        // --- Top Sprite --- 
        if (this.topSprite) {
            this.topSprite.anchor.set(0.5);
            
            const offsetX_t = (isPortrait ? 0.55 : 0.49) * deltaXReels;
            const offsetY_t = -0.08 * scaledSymbolHeight; // Offset from reel top
            this.topSprite.position.set(reelCenterX + offsetX_t - (deltaXReels/2), reelVisualTopY + offsetY_t);
            
            const topSpriteBaseScaleMultiplier = this.config.scales?.top_base_scale_multiplier || 1.0;
            this.topSprite.scale.set(baseReelScale * topSpriteBaseScaleMultiplier);
        }

        // --- Bottom Sprite --- 
        if (this.bottomSprite) {
            this.bottomSprite.anchor.set(0.5);

            const offsetX_bt = (isPortrait ? 0.55 : 0.5) * deltaXReels;
            const offsetY_bt = 3 * scaledSymbolHeight; // Offset from reel top
            this.bottomSprite.position.set(reelCenterX + offsetX_bt - (deltaXReels/2), reelVisualTopY + offsetY_bt);

            const bottomSpriteBaseScaleMultiplier = this.config.scales?.bottom_base_scale_multiplier || 1.0;
            this.bottomSprite.scale.set(baseReelScale * bottomSpriteBaseScaleMultiplier);
        }
    }

    public playPulseAnimation(duration: number): void {
        // Called when the top animation loops, to pulse front/behind
        if (this.frontSprite) {
            const pulse1 = new TWEEN.Tween(this.frontSprite.scale)
                .to({ x: this.frontSprite.scale.x * 1.1, y: this.frontSprite.scale.y * 1.1 }, duration / 2)
                .yoyo(true)
                .repeat(1)
                .start();
            this.activeTweens.push(pulse1);
        }
        if (this.behindSprite) {
            const pulse2 = new TWEEN.Tween(this.behindSprite.scale)
                .to({ x: this.behindSprite.scale.x * 1.1, y: this.behindSprite.scale.y * 1.1 }, duration / 2)
                .yoyo(true)
                .repeat(1)
                .start();
            this.activeTweens.push(pulse2);
        }
    }

    public destroy(options?: boolean | PIXI.IDestroyOptions | undefined): void {
        this.activeTweens.forEach(tween => tween.stop());
        this.activeTweens = [];

        if (this.topSprite instanceof PIXI.AnimatedSprite) {
            this.topSprite.onLoop = undefined; // Clear the callback with undefined
        }
        // Also for bottomSprite if it had listeners

        super.destroy(options);
    }
} 