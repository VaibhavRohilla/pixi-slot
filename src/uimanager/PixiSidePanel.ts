import * as PIXI from 'pixi.js';
import * as TWEEN from '@tweenjs/tween.js';
import { Globals } from '../core/Global';
import { EventManager, GameEvent } from '../core/utils/EventManager';
import { Container, Sprite, Text, BitmapText, Texture, AnimatedSprite, BaseTexture, Rectangle, Ticker, IDestroyOptions } from 'pixi.js';

// TODO: Define these interfaces in much more detail based on Phaser's IConfigSidePanel
export interface IPixiSidePanelPrizeLevelConfig {
    // Config for how each prize level looks and behaves
    fontStyle?: Partial<PIXI.ITextStyle>; // If using PIXI.Text
    // texture keys for number sprites, active states, base states etc.
}

export interface IPixiPoint {
    x: number;
    y: number;
}

export interface IPixiSidePanelBitmapTextLayeredDesign {
    mainLayers?: {
        count: number;
        fadeOutForWin?: boolean;
        fadeOutForIdlePulse?: boolean;
    };
    additionalLayers?: { // If we decide to implement these specific extra texts
        count: number;
        hasActiveOverlay?: boolean;
    };
}

export interface IPixiSidePanelBitmapTextConfig {
    textureKey: string; 
    size: number;       
    layeredDesign?: IPixiSidePanelBitmapTextLayeredDesign;
    anchor?: IPixiPoint; 
    position?: IPixiPoint; // Base relative position within its direct parent (levelContainer)
    offsetX?: number; 
    offsetTop?: number; 
    offsetY?: number; // Y spacing between individual prize level texts
    additionalOffsetYSecond?: number; // Specific Y offset for second+ lines if different
    scaleXPort?: number; 
    scaleYPort?: number; 
    scaleXLand?: number; 
    scaleYLand?: number; 
}

export interface IPixiSidePanelPrizeSpriteConfig {
    useBaseOverlay?: boolean;  
    useActiveOverlay?: boolean; 
    animationFrameRate?: number; 
    anchor?: IPixiPoint; 
    position?: IPixiPoint; // Base relative position within its direct parent (levelContainer)
    baseFrameSuffix?: string; 
    activeFrameSuffix?: string; 
    animationFolderPrefix?: string; 
    
    offsetLeft?: number; // X offset from a reference point (e.g., background left edge)
    offsetX?: number;    // X spacing for multiple number sprites within the same prize level (if applicable)
    offsetTop?: number;  // Y offset for the first number sprite in a group relative to its prize text
    additionalOffsetY?: number[]; // Array of Y offsets for each number sprite relative to its prize text
    baseOverlayOffset?: IPixiPoint; // Offset for the base overlay sprite relative to the main number sprite
    scalePortrait?: number;   // Specific scale multiplier in portrait
    scaleLandscape?: number;  // Specific scale multiplier in landscape
}

export interface IPixiSidePanelAnimationSettings {
    pulseDuration?: number; 
    winPulseScaleFrom?: number; 
    winPulseScaleTo?: number;   
    winPulseDuration?: number;  
}

export interface IPixiSidePanelBMDTextureConfig {
    key: string;
    width: number;
    height: number;
    visible?: boolean;
}

export interface IPixiSidePanelOrientationSpecificPosition {
    scaleX?: number;
    scaleY?: number;
    xAdditional?: number;
    yAdditional?: number;
}

export interface IPixiSidePanelMainOffsets {
    reelOffsetW?: number;
    reelsOffsetH?: number;
    overlapOffsetX?: number;
    overlapOffsetY?: number;
}

// Simplified placeholder for now
export interface IPixiSidePanelLogoConfig {
    textureKey?: string;
    animatedAtlasKey?: string;
    animationName?: string;
    baseScale?: number;
    frameRate?: number;
    scaleFactorPortrait?: number;
    scaleFactorLandscape?: number;
}

export interface IPixiSidePanelAdditionalSpriteAnimationConfig {
    animationIsPreexistingInAtlas?: boolean;
    textureKeyOrAnimationName: string;
    baseScale?: number;
    frameRate?: number;
    loop?: boolean | number;
    portraitScaleFactor?: number;
}

export interface IPixiSidePanelAdditionalSpriteConfig {
    textureKey: string;
    atlasKey: string;
    winAnimation?: IPixiSidePanelAdditionalSpriteAnimationConfig;
    idleAnimation?: IPixiSidePanelAdditionalSpriteAnimationConfig;
    baseScalePortrait?: number;
    baseScaleLandscape?: number;
    offsets?: {
        portrait?: { offsetFactorYRelativeToLogo?: number; offsetX?: number; offsetY?: number };
        landscape?: { offsetFactorYRelativeToLogo?: number; offsetX?: number; offsetY?: number };
    };
}

export interface IPixiSidePanelConfig {
    textures: {
        background?: string;
        logo?: string; // Main static logo texture key
        animatedLogoAtlas?: string; // Spritesheet for animated logo
        additionalSpriteAtlas?: string; // Spritesheet for the 'lion' or similar
        prizeLevelNumbersAtlas: string; 
    };
    prizeLevelsCount: number; 
    prizeMinRequirement: number; 
    tableBgActualHeightDiff?: number; 
    
    size: { // Overall panel dimensions, can influence background sizing if not fixed asset
        portrait: { width: number; height: number; };
        landscape: { width: number; height: number; };
    };
    bmdTexture?: IPixiSidePanelBMDTextureConfig; // For panel background if dynamically drawn/sized
    
    // Panel level positioning/scaling adjustments per orientation
    positionLand?: IPixiSidePanelOrientationSpecificPosition;
    positionPort?: IPixiSidePanelOrientationSpecificPosition;
    
    mainOffsets?: IPixiSidePanelMainOffsets; // General offsets

    logoConfig?: IPixiSidePanelLogoConfig; // Configuration for the main logo
    additionalSpriteConfig?: IPixiSidePanelAdditionalSpriteConfig; // For the 'lion' like sprite

    prizeSpriteConfig?: IPixiSidePanelPrizeSpriteConfig;
    bitmapTextConfig?: IPixiSidePanelBitmapTextConfig;
    animationSettings?: IPixiSidePanelAnimationSettings;

    layout: { // Panel content layout settings (overrides some of the above if more specific)
        portrait: { 
            width: number; height: number; // Effective content area width/height
            backgroundOffset?: IPixiPoint; 
            logoOffset?: IPixiPoint; 
            prizeLevelsContainerOffset?: IPixiPoint; 
            prizeLevelVerticalSpacing?: number;
        }; 
        landscape: { 
            width: number; height: number; 
            backgroundOffset?: IPixiPoint; 
            logoOffset?: IPixiPoint; 
            prizeLevelsContainerOffset?: IPixiPoint;
            prizeLevelHorizontalSpacing?: number; 
        }; 
        panelContentScalePort?: number;
        panelContentScaleLand?: number;
    };
}

export class PixiSidePanel extends PIXI.Container {
    private config: IPixiSidePanelConfig;
    private eventManager: EventManager;

    private background: PIXI.Sprite | PIXI.Graphics | null = null;
    private logoSprite: PIXI.AnimatedSprite | PIXI.Sprite | null = null;
    // private logoAdditionalSprite: PIXI.AnimatedSprite | PIXI.Sprite | null = null;
    
    private prizeLevelContainers: PIXI.Container[] = [];
    // Sprites for the number indicating scatter count (e.g., 5x, 4x)
    private prizeLevelNumberSprites: (PIXI.AnimatedSprite | PIXI.Sprite)[] = []; 
    private prizeLevelNumberBaseSprites: PIXI.Sprite[] = [];
    private prizeLevelNumberActiveSprites: PIXI.Sprite[] = [];
    // BitmapText for the actual prize amounts (e.g., $100.00)
    private prizeLevelAmountTexts: PIXI.BitmapText[][] = []; // For layered text design

    private activeTweens: TWEEN.Tween<any>[] = [];
    private currentIdlePulseIndex: number = -1;
    private currentWinningPrizeIndex: number = -1;
    private prizeDisplayTweens: TWEEN.Tween<any>[] = []; // Specific array for win display tweens

    private isPortrait: boolean = false;

    private idlePulseTween: TWEEN.Tween<any> | null = null;
    private idlePulseData: { alpha: number } = { alpha: 0 }; // Helper for tweening

    private winPulseTween: TWEEN.Tween<any> | null = null;
    private winPulseTargetsInitialScales: Map<PIXI.DisplayObject | PIXI.BitmapText, {x: number, y: number}> = new Map();
    
    // Placeholder for the additional sprite (e.g., lion)
    private additionalSprite: PIXI.AnimatedSprite | PIXI.Sprite | null = null;

    private ticker: PIXI.Ticker | null = null;

    private winCurrentIndex: number = -1; // Track which prize level is currently winning

    private allElements: (Container | Sprite | BitmapText)[] = []; // Keep track for positioning

    constructor(config: IPixiSidePanelConfig) {
        super();
        this.config = config;
        this.eventManager = EventManager.getInstance();
        // this.isPortrait = Globals.screenHeight > Globals.screenWidth; // Initial orientation

        this.initBaseElements();
        this.initPrizeLevels();
        this.initAnimationsAndInteractions();
        this.initEventHandlers();

        // this.updateLayout(this.isPortrait); // Initial layout call
        this.visible = false; // Start hidden, show when needed
        console.log('PixiSidePanel Initialized');

        this.setupEventListeners();

        // Add TWEEN update to shared ticker
        this.ticker = PIXI.Ticker.shared;
        this.ticker.add(this.updateTweens);

        this.updateLayout(this.isPortrait); // Initial layout, Pass orientation

        // TWEEN.update expects milliseconds.
        // PIXI Ticker delta is multiplied by PIXI.settings.TARGET_FPMS (ms per frame)
        // However, TWEEN examples often just call TWEEN.update() without args.
        // Check TWEEN documentation for best practice with PIXI ticker.
        // For now, calling without args as it often works.
        TWEEN.update();
    }

    private initBaseElements(): void {
        // Create background
        if (this.config.bmdTexture && this.config.bmdTexture.key && Globals.resources[this.config.bmdTexture.key]) {
            this.background = new PIXI.Sprite(Globals.resources[this.config.bmdTexture.key] as PIXI.Texture);
            // Assuming bmdTexture was for a dynamically generated texture that is already sized.
            // If it needs to be a Graphics object for dynamic rounded rect, that's a different implementation.
            this.background.visible = this.config.bmdTexture.visible ?? true;
            this.addChild(this.background);
        } else if (this.config.textures.background && Globals.resources[this.config.textures.background]) {
            this.background = new PIXI.Sprite(Globals.resources[this.config.textures.background] as PIXI.Texture);
            this.addChild(this.background);
        } else {
            console.warn('PixiSidePanel: Background texture not specified or found.');
            // Optionally create a placeholder Graphics object for background
            // this.background = new PIXI.Graphics().beginFill(0x101010).drawRect(0,0,100,100).endFill();
            // this.addChild(this.background);
        }

        // Create Logo
        if (this.config.logoConfig) {
            const logoCfg = this.config.logoConfig;
            let createdLogo: PIXI.Sprite | PIXI.AnimatedSprite | null = null;

            if (logoCfg.animatedAtlasKey && Globals.resources[logoCfg.animatedAtlasKey]) {
                const logoAtlas = Globals.resources[logoCfg.animatedAtlasKey] as PIXI.Spritesheet;
                const animName = logoCfg.animationName || (logoAtlas.animations ? Object.keys(logoAtlas.animations)[0] : undefined);
                
                if (animName && logoAtlas.animations && logoAtlas.animations[animName]) {
                    createdLogo = new PIXI.AnimatedSprite(logoAtlas.animations[animName]);
                    (createdLogo as PIXI.AnimatedSprite).animationSpeed = (logoCfg.frameRate || 24) / 60;
                    (createdLogo as PIXI.AnimatedSprite).loop = true; // Defaulting to loop, make configurable if needed
                    // (createdLogo as PIXI.AnimatedSprite).play(); // Play if starts visible & animated
                } else if (logoCfg.textureKey && logoAtlas.textures[logoCfg.textureKey]) { // Fallback to static frame from same atlas
                     createdLogo = new PIXI.Sprite(logoAtlas.textures[logoCfg.textureKey]);
                }
            } else if (logoCfg.textureKey && Globals.resources[logoCfg.textureKey]) { // Static texture from general resources
                createdLogo = new PIXI.Sprite(Globals.resources[logoCfg.textureKey] as PIXI.Texture);
            }

            if (createdLogo) {
                this.logoSprite = createdLogo;
                this.logoSprite.anchor.set(0.5); 
                // Base scale is from logoCfg.baseScale.
                // Orientation-specific scaling (scaleFactorPortrait/Landscape) will be applied in updateLayout.
                this.logoSprite.scale.set(logoCfg.baseScale || 1.0);
                this.addChild(this.logoSprite);
            } else {
                console.warn('PixiSidePanel: Logo could not be created based on config.');
            }
        }

        // Create Additional Sprite (e.g., lion)
        if (this.config.additionalSpriteConfig) {
            const addSpriteCfg = this.config.additionalSpriteConfig;
            const atlas = Globals.resources[addSpriteCfg.atlasKey] as PIXI.Spritesheet;

            if (atlas) {
                let createdAddSprite: PIXI.Sprite | PIXI.AnimatedSprite | null = null;
                // Prefer idle animation if specified
                if (addSpriteCfg.idleAnimation) {
                    const idleAnimCfg = addSpriteCfg.idleAnimation;
                    let idleAnimFrames: PIXI.Texture[] | undefined;
                    if (idleAnimCfg.animationIsPreexistingInAtlas && atlas.animations && atlas.animations[idleAnimCfg.textureKeyOrAnimationName]) {
                        idleAnimFrames = atlas.animations[idleAnimCfg.textureKeyOrAnimationName];
                    } else if (!idleAnimCfg.animationIsPreexistingInAtlas) {
                        // TODO: Implement frame generation if textureKeyOrAnimationName is a prefix for a sequence
                        console.warn('PixiSidePanel: Additional sprite dynamic frame sequence loading not yet implemented for idle.');
                    }
                    if (idleAnimFrames && idleAnimFrames.length > 0) {
                        createdAddSprite = new PIXI.AnimatedSprite(idleAnimFrames);
                        (createdAddSprite as PIXI.AnimatedSprite).animationSpeed = (idleAnimCfg.frameRate || 24) / 60;
                        (createdAddSprite as PIXI.AnimatedSprite).loop = idleAnimCfg.loop !== undefined ? !!idleAnimCfg.loop : true;
                        (createdAddSprite as PIXI.AnimatedSprite).play();
                        if(idleAnimCfg.baseScale) createdAddSprite.scale.set(idleAnimCfg.baseScale * (idleAnimCfg.portraitScaleFactor && this.isPortrait ? idleAnimCfg.portraitScaleFactor : 1));
                    }
                }
                
                // Fallback to static texture if no idle animation successfully created
                if (!createdAddSprite && atlas.textures[addSpriteCfg.textureKey]) {
                    createdAddSprite = new PIXI.Sprite(atlas.textures[addSpriteCfg.textureKey]);
                }

                if (createdAddSprite) {
                    this.additionalSprite = createdAddSprite;
                    this.additionalSprite.anchor.set(0.5);
                    // Base scale for the sprite itself (portrait/landscape)
                    const baseScale = this.isPortrait ? (addSpriteCfg.baseScalePortrait || 1.0) : (addSpriteCfg.baseScaleLandscape || 1.0);
                    // If idleAnimCfg also had a baseScale and portraitScaleFactor, they might combine or override.
                    // Current logic: idleAnimCfg scale is applied if idle anim is created.
                    // If only static, then these baseScalePortrait/Landscape apply.
                    if (!(addSpriteCfg.idleAnimation && (this.additionalSprite as PIXI.AnimatedSprite).playing)) {
                         this.additionalSprite.scale.set(baseScale);
                    }
                    this.addChild(this.additionalSprite);
                } else {
                     console.warn(`PixiSidePanel: Additional sprite texture '${addSpriteCfg.textureKey}' or idle animation not found in atlas '${addSpriteCfg.atlasKey}'.`);
                }
                
                // TODO: Pre-create/store textures for win animation (addSpriteCfg.winAnimation)
                // This animation would be switched to by animatePrizeDisplay or similar.
            } else {
                console.warn(`PixiSidePanel: Atlas '${addSpriteCfg.atlasKey}' not found for additional sprite.`);
            }
        }
    }

    private initPrizeLevels(): void {
        const numbersAtlas = Globals.resources[this.config.textures.prizeLevelNumbersAtlas] as PIXI.Spritesheet;
        if (!numbersAtlas) {
            console.warn(`SidePanel: Numbers atlas not found: ${this.config.textures.prizeLevelNumbersAtlas}`);
            return;
        }

        const defaultAnchor: IPixiPoint = { x: 0.5, y: 0.5 };
        const defaultPosition: IPixiPoint = { x: 0, y: 0 };

        for (let i = 0; i < this.config.prizeLevelsCount; i++) {
            const levelContainer = new PIXI.Container();
            // Positioning of levelContainer itself is now handled in updateLayout
            this.addChild(levelContainer);
            this.prizeLevelContainers.push(levelContainer);

            const scatterCountValue = this.config.prizeMinRequirement + this.config.prizeLevelsCount - 1 - i;
            const valueString = scatterCountValue < 10 ? `0${scatterCountValue}` : scatterCountValue.toString();

            const spriteAnchor = this.config.prizeSpriteConfig?.anchor || defaultAnchor;
            const spritePosition = this.config.prizeSpriteConfig?.position || defaultPosition;

            // --- Number Sprites (e.g., "5x") ---
            // Base Sprite
            if (this.config.prizeSpriteConfig?.useBaseOverlay) {
                const baseFrameId = `${valueString}${this.config.prizeSpriteConfig?.baseFrameSuffix || '_base'}`;
                if (numbersAtlas.textures[baseFrameId]) {
                    const baseSprite = new PIXI.Sprite(numbersAtlas.textures[baseFrameId]);
                    baseSprite.anchor.set(spriteAnchor.x, spriteAnchor.y);
                    baseSprite.position.set(spritePosition.x, spritePosition.y);
                    levelContainer.addChild(baseSprite);
                    this.prizeLevelNumberBaseSprites[i] = baseSprite;
                } else {
                    console.warn(`SidePanel: Base frame not found: ${baseFrameId}`);
                }
            }

            // Main Number Sprite (Animated or Static)
            const mainFrameId = `${valueString}`;
            const animFolder = `${valueString}${this.config.prizeSpriteConfig?.animationFolderPrefix || '/anim_'}`;
            let hasAnimation = false;
            const animFrames: PIXI.Texture[] = [];

            if (numbersAtlas.animations && numbersAtlas.animations[animFolder]) { 
                animFrames.push(...numbersAtlas.animations[animFolder]);
                hasAnimation = animFrames.length > 0;
            } else {
                for (let f = 0; f <= 31; f++) { 
                    const frameName = `${animFolder}${f < 10 ? '0' : ''}${f}`;
                    if (numbersAtlas.textures[frameName]) {
                        animFrames.push(numbersAtlas.textures[frameName]);
                    }
                }
                hasAnimation = animFrames.length > 0;
            }

            if (hasAnimation) {
                const animSprite = new PIXI.AnimatedSprite(animFrames);
                animSprite.animationSpeed = (this.config.prizeSpriteConfig?.animationFrameRate || 24) / 60;
                animSprite.loop = false; // Play once for win highlight, then stop on static frame
                animSprite.anchor.set(spriteAnchor.x, spriteAnchor.y);
                animSprite.position.set(spritePosition.x, spritePosition.y);
                
                animSprite.onComplete = () => {
                    // Revert to the static frame texture if available
                    if (numbersAtlas.textures[mainFrameId]) {
                        animSprite.texture = numbersAtlas.textures[mainFrameId];
                    } else {
                        animSprite.gotoAndStop(0); // Fallback: stop on the first frame of the animation
                    }
                }; 
                levelContainer.addChild(animSprite);
                this.prizeLevelNumberSprites[i] = animSprite;
            } else if (numbersAtlas.textures[mainFrameId]) {
                const staticSprite = new PIXI.Sprite(numbersAtlas.textures[mainFrameId]);
                staticSprite.anchor.set(spriteAnchor.x, spriteAnchor.y);
                staticSprite.position.set(spritePosition.x, spritePosition.y);
                levelContainer.addChild(staticSprite);
                this.prizeLevelNumberSprites[i] = staticSprite;
            } else {
                console.warn(`SidePanel: Main/Anim frames not found for value: ${valueString}`);
            }

            // Active Sprite
            if (this.config.prizeSpriteConfig?.useActiveOverlay) {
                const activeFrameId = `${valueString}${this.config.prizeSpriteConfig?.activeFrameSuffix || '_active'}`;
                if (numbersAtlas.textures[activeFrameId]) {
                    const activeSprite = new PIXI.Sprite(numbersAtlas.textures[activeFrameId]);
                    activeSprite.visible = false; 
                    activeSprite.anchor.set(spriteAnchor.x, spriteAnchor.y);
                    activeSprite.position.set(spritePosition.x, spritePosition.y);
                    levelContainer.addChild(activeSprite);
                    this.prizeLevelNumberActiveSprites[i] = activeSprite;
                } else {
                    console.warn(`SidePanel: Active frame not found: ${activeFrameId}`);
                }
            }

            // --- Prize Amount Text (BitmapText) ---
            this.prizeLevelAmountTexts[i] = [];
            const numTextLayers = this.config.bitmapTextConfig?.layeredDesign?.mainLayers?.count || 1;
            const fontName = this.config.bitmapTextConfig?.textureKey;
            const fontSize = this.config.bitmapTextConfig?.size; 
            const textAnchor = this.config.bitmapTextConfig?.anchor || defaultAnchor;
            const textPosition = this.config.bitmapTextConfig?.position || defaultPosition;
            // const textTint = this.config.bitmapTextConfig?.tint; // Example for tint

            if (fontName && fontSize) {
                for (let j = 0; j < numTextLayers; j++) {
                    const amountText = new PIXI.BitmapText('', { fontName: fontName, fontSize: fontSize, align: 'center'});
                    amountText.anchor.set(textAnchor.x, textAnchor.y);
                    amountText.position.set(textPosition.x, textPosition.y);
                    // if(textTint !== undefined) amountText.tint = textTint;
                    levelContainer.addChild(amountText);
                    this.prizeLevelAmountTexts[i][j] = amountText;
                }
            } else {
                console.warn('SidePanel: Font name or size for prize amount text is missing in config.');
            }
        }
    }

    private initAnimationsAndInteractions(): void {
        // Setup idle pulsing animation for prize levels
        // Setup win animation triggers
        // TODO: Replicate idlePulse, winPulse, animatePrize, stopAnimatePrize logic from Phaser's SidePanel
        // This will involve TWEEN.js for pulsing and PIXI.AnimatedSprite for frame animations.
        
        if (this.config.prizeLevelsCount > 0) {
            this.startIdlePulse(this.config.prizeLevelsCount - 1); // Start initial pulse on the last/top item by default
        }
    }

    // Corresponds to Phaser's idlePulse
    private startIdlePulse(prizeLevelIndex: number): void {
        if (prizeLevelIndex < 0 || prizeLevelIndex >= this.config.prizeLevelsCount) return;
        if (!this.config.animationSettings?.pulseDuration || this.config.animationSettings.pulseDuration <= 0) {
            console.log('PixiSidePanel: Idle pulse disabled (no pulseDuration in config).');
            return;
        }

        this.stopIdlePulse(); 
        this.currentIdlePulseIndex = prizeLevelIndex;

        const activeNumberSprite = this.prizeLevelNumberActiveSprites[prizeLevelIndex];
        const amountTexts = this.prizeLevelAmountTexts[prizeLevelIndex]; // Array of text layers

        // TODO: Handle fading out of OTHER prize level texts if that's desired.
        // TODO: Handle special `prizeLevelTextCurrent` if that feature is ported.

        let mainAmountText: PIXI.BitmapText | null = null;
        if (amountTexts && amountTexts.length > 0) {
            mainAmountText = amountTexts[0]; // Assume first layer is primary for now
        }

        if (!activeNumberSprite && !mainAmountText) {
            console.warn(`PixiSidePanel: No elements to pulse for idle index ${prizeLevelIndex}`);
            // Potentially cycle to next immediately if this level is invalid
            const nextIndex = (this.currentIdlePulseIndex - 1 + this.config.prizeLevelsCount) % this.config.prizeLevelsCount;
            this.startIdlePulse(nextIndex);
            return;
        }

        this.idlePulseData.alpha = 0;

        const pulseDuration = this.config.animationSettings.pulseDuration;

        const fadeIn = new TWEEN.Tween(this.idlePulseData)
            .to({ alpha: 1 }, pulseDuration)
            .easing(TWEEN.Easing.Sinusoidal.InOut)
            .onUpdate(() => {
                if (activeNumberSprite) activeNumberSprite.alpha = this.idlePulseData.alpha;
                if (mainAmountText) mainAmountText.alpha = this.idlePulseData.alpha; 
                // TODO: Handle fadeOutForIdlePulse for other text layers if applicable
            })
            .onStart(()=> {
                if(activeNumberSprite) activeNumberSprite.visible = true;
                if(mainAmountText) mainAmountText.visible = true; // Or set visibility based on other logic
            });

        const fadeOut = new TWEEN.Tween(this.idlePulseData)
            .to({ alpha: 0 }, pulseDuration)
            .easing(TWEEN.Easing.Sinusoidal.InOut)
            .onUpdate(() => {
                if (activeNumberSprite) activeNumberSprite.alpha = this.idlePulseData.alpha;
                if (mainAmountText) mainAmountText.alpha = this.idlePulseData.alpha;
                // TODO: Handle fadeOutForIdlePulse for other text layers
            })
            .onComplete(() => {
                if (activeNumberSprite) activeNumberSprite.visible = false;
                // if (mainAmountText) mainAmountText.visible = false; // Keep text visible but alpha 0? Or hide.
                
                // Cycle to the next level
                const nextIndex = (this.currentIdlePulseIndex - 1 + this.config.prizeLevelsCount) % this.config.prizeLevelsCount;
                this.startIdlePulse(nextIndex);
            });

        fadeIn.chain(fadeOut);
        this.idlePulseTween = fadeIn;
        fadeIn.start();

        // Add to activeTweens for global stop if needed, though idlePulseTween is managed directly
        this.activeTweens.push(this.idlePulseTween); 
    }

    private stopIdlePulse(): void {
        if (this.idlePulseTween) {
            this.idlePulseTween.stop();
            const index = this.activeTweens.indexOf(this.idlePulseTween);
            if (index > -1) this.activeTweens.splice(index, 1);
            this.idlePulseTween = null;
        }
        if (this.currentIdlePulseIndex !== -1 && this.currentIdlePulseIndex < this.prizeLevelNumberActiveSprites.length) { // Boundary check
            const activeNumberSprite = this.prizeLevelNumberActiveSprites[this.currentIdlePulseIndex];
            const amountTexts = this.prizeLevelAmountTexts[this.currentIdlePulseIndex];
            if (activeNumberSprite) {
                activeNumberSprite.alpha = 0;
                activeNumberSprite.visible = false;
            }
            // Only reset main text if it was part of the idle pulse logic specifically
            // if (amountTexts && amountTexts[0]) {
            //     amountTexts[0].alpha = 1; 
            // }
        }
        this.currentIdlePulseIndex = -1;
    }

    // Corresponds to Phaser's animatePrize (excluding event handling part)
    private animatePrizeDisplay(prizeLevelIndex: number, duration?: number): void {
        if (prizeLevelIndex < 0 || prizeLevelIndex >= this.config.prizeLevelsCount) {
            console.warn('PixiSidePanel: Invalid prizeLevelIndex for animatePrizeDisplay', prizeLevelIndex);
            return;
        }
        this.currentWinningPrizeIndex = prizeLevelIndex;
        this.stopIdlePulse(); 
        this.stopPrizeDisplayAnimation(false); // Stop any previous win animation immediately

        const numberSprite = this.prizeLevelNumberSprites[prizeLevelIndex];
        if (numberSprite instanceof PIXI.AnimatedSprite) {
            numberSprite.gotoAndPlay(0);
        } else if (numberSprite) {
            // If static, maybe a small scale/alpha emphasis
            numberSprite.alpha = 0;
            const emphasisTween = new TWEEN.Tween(numberSprite)
                .to({ alpha: 1 }, 150)
                .yoyo(true).repeat(1) // Quick flash
                .start();
            this.prizeDisplayTweens.push(emphasisTween);
        }

        // TODO: Play logo animation (if this.logoSprite is an AnimatedSprite & configured)
        // if (this.logoSprite instanceof PIXI.AnimatedSprite) { this.logoSprite.gotoAndPlay(0); }

        // TODO: Set active state for logoAdditionalSprite if it exists and is part of this.

        const activeNumberSprite = this.prizeLevelNumberActiveSprites[prizeLevelIndex];
        if (activeNumberSprite) {
            activeNumberSprite.visible = true;
            activeNumberSprite.alpha = 0;
            const activeSpriteFadeIn = new TWEEN.Tween(activeNumberSprite)
                .to({ alpha: 1 }, 250) // Duration from Phaser's showingTween for active elements
                .start();
            this.prizeDisplayTweens.push(activeSpriteFadeIn);
        }
        
        // Main prize amount text emphasis (example: quick scale up and down)
        const mainAmountText = this.prizeLevelAmountTexts[prizeLevelIndex]?.[0];
        if (mainAmountText) {
            mainAmountText.visible = true;
            const currentScale = mainAmountText.scale.x; // Assuming uniform scale
            mainAmountText.scale.set(currentScale * 1.2);
            const textPulseTween = new TWEEN.Tween(mainAmountText.scale)
                .to({ x: currentScale, y: currentScale }, 300)
                .easing(TWEEN.Easing.Elastic.Out)
                .start();
            this.prizeDisplayTweens.push(textPulseTween);
        }

        // Handle layered text fading if configured
        if (this.config.bitmapTextConfig?.layeredDesign?.mainLayers?.fadeOutForWin && this.prizeLevelAmountTexts[prizeLevelIndex] && this.prizeLevelAmountTexts[prizeLevelIndex].length > (this.config.bitmapTextConfig.layeredDesign.mainLayers.count || 1)) {
            // If there are more layers than the count specified to remain (or more than 1 if count is 1),
            // fade out the secondary layers.
            // This assumes playWinPulse will handle the primary layer(s).
            const mainLayerCount = this.config.bitmapTextConfig.layeredDesign.mainLayers.count || 1;
            for (let layerIdx = mainLayerCount; layerIdx < this.prizeLevelAmountTexts[prizeLevelIndex].length; layerIdx++) {
                const layerText = this.prizeLevelAmountTexts[prizeLevelIndex][layerIdx];
                if (layerText) {
                    const fadeOutTween = new TWEEN.Tween(layerText)
                        .to({ alpha: 0 }, 125) // Duration from Phaser
                        .easing(TWEEN.Easing.Linear.None)
                        .start();
                    this.prizeDisplayTweens.push(fadeOutTween);
                }
            }
        }
        // TODO: Handle showing/fading in `prizeLevelTextCurrent` if that concept is ported.

        // Call playWinPulse for the winning texts (primary layer(s)) and potentially the logo
        const winPulseTargets: (PIXI.DisplayObject | PIXI.BitmapText)[] = [];
        if (mainAmountText) {
            winPulseTargets.push(...this.prizeLevelAmountTexts[prizeLevelIndex]); // Add all layers of text for this prize level
        }
        // Consider if only mainAmountText or all layers should pulse.
        // If logo should pulse too:
        // if (this.logoSprite) { winPulseTargets.push(this.logoSprite); }
        
        if (winPulseTargets.length > 0) {
            this.playWinPulse(
                winPulseTargets,
                this.config.animationSettings?.winPulseScaleFrom || 1.0,
                this.config.animationSettings?.winPulseScaleTo || 1.1,
                this.config.animationSettings?.winPulseDuration || 825,
                this.logoSprite, // Pass logo as alternate target for independent scaling logic if needed, or add to main targets
                true, // yoyo
                Infinity // repeat
            );
        }
        
        // TODO: Handle layered text fading (fadeOutForWin from config for other layers).
        
        console.log(`PixiSidePanel: Animate prize display for level index ${prizeLevelIndex}`);

        // Phaser scheduled stopAnimatePrize if duration was provided.
        // This might be better handled by game flow, but for now, let's keep similar logic.
        if (duration && duration > 0) {
            const timer = setTimeout(() => {
                const indexInTweens = this.prizeDisplayTweens.indexOf(timer as any); // This is not a tween, just a way to track timeout
                if(indexInTweens > -1) this.prizeDisplayTweens.splice(indexInTweens, 1);
                this.stopPrizeDisplayAnimation();
            }, duration);
            this.prizeDisplayTweens.push(timer as any); // Storing timer ID to potentially clear it
        }
    }

    // Corresponds to Phaser's stopAnimatePrize
    private stopPrizeDisplayAnimation(restartIdle: boolean = true): void { 
        this.prizeDisplayTweens.forEach(tweenOrTimer => {
            if (tweenOrTimer instanceof TWEEN.Tween) {
                tweenOrTimer.stop();
            } else {
                clearTimeout(tweenOrTimer); // Clear any scheduled timeouts
            }
        });
        this.prizeDisplayTweens = [];

        // TODO: Stop logo animation, prize number animations (if continuously looping).
        // For now, the number animation is set to loop=false, plays once.
        
        if (this.currentWinningPrizeIndex !== -1) {
            const activeNumberSprite = this.prizeLevelNumberActiveSprites[this.currentWinningPrizeIndex];
            if (activeNumberSprite) {
                activeNumberSprite.alpha = 0;
                activeNumberSprite.visible = false;
            }
            // Reset emphasis on main text if needed
            const mainAmountText = this.prizeLevelAmountTexts[this.currentWinningPrizeIndex]?.[0];
            if (mainAmountText && mainAmountText.scale.x !== (this.config.bitmapTextConfig?.size || mainAmountText.scale.x)) { // A bit of a guess for base scale
                 // This needs a proper base scale storage if we are tweening scale
            }
        }
        
        // TODO: Reset additional logo sprite to idle state.
        // TODO: Call this.stopWinPulse().
        // TODO: Reposition elements if needed (Phaser had this.repositionElements(1)).
        
        const previousWinIndex = this.currentWinningPrizeIndex;
        this.currentWinningPrizeIndex = -1;

        if (restartIdle) {
            this.stopWinPulse(); 
            // Restart idle pulse on the last idle index, or a default (e.g., last level if available, else -1).
            const nextIdleIndex = this.currentIdlePulseIndex !== -1 ? this.currentIdlePulseIndex : (this.config.prizeLevelsCount > 0 ? this.config.prizeLevelsCount - 1 : -1);
            if (nextIdleIndex !== -1) {
                this.startIdlePulse(nextIdleIndex);
            }
        }
        console.log(`PixiSidePanel: Stop prize display animation for index ${previousWinIndex}`);
    }

    // Corresponds to Phaser's winPulse
    private playWinPulse(
        targets: (PIXI.DisplayObject | PIXI.BitmapText)[], 
        scaleFrom: number, // e.g., 1.0
        scaleTo: number,   // e.g., 1.1
        duration: number, // e.g., 825ms (Phaser used this)
        alternateTarget?: PIXI.DisplayObject | null,
        yoyo: boolean = true,
        repeat: number = Infinity
    ): void {
        this.stopWinPulse(); // Stop any existing win pulse
        this.winPulseTargetsInitialScales.clear();

        const allTargets = alternateTarget ? [...targets, alternateTarget] : [...targets];

        allTargets.forEach(target => {
            if (target) { // Ensure target is not null/undefined
                this.winPulseTargetsInitialScales.set(target, { x: target.scale.x, y: target.scale.y });
            }
        });

        const pulseData = { factor: scaleFrom };
        this.winPulseTween = new TWEEN.Tween(pulseData)
            .to({ factor: scaleTo }, duration)
            .easing(TWEEN.Easing.Sinusoidal.InOut) // Example easing
            .onUpdate(() => {
                allTargets.forEach(target => {
                    if (target) {
                        const initial = this.winPulseTargetsInitialScales.get(target);
                        if (initial) {
                            target.scale.x = initial.x * pulseData.factor;
                            target.scale.y = initial.y * pulseData.factor;
                        }
                    }
                });
            })
            .yoyo(yoyo)
            .repeat(yoyo ? repeat : 0); // Repeat only makes sense with yoyo for pulsing
        
        if (!yoyo && repeat > 0) { // If not yoyoing but want discrete repeats (e.g. swell once)
            this.winPulseTween.repeat(repeat);
        } else if (!yoyo && repeat === 0) { // Play once to scaleTo
            this.winPulseTween.onComplete(()=>{
                // Optionally, do something when it reaches scaleTo if not yoyoing
            })
        }

        this.winPulseTween.start();
        this.activeTweens.push(this.winPulseTween); // Add to global list for potential forced stop
    }

    private stopWinPulse(): void {
        if (this.winPulseTween) {
            this.winPulseTween.stop();
            const index = this.activeTweens.indexOf(this.winPulseTween);
            if (index > -1) this.activeTweens.splice(index, 1);
            this.winPulseTween = null;

            // Restore initial scales
            this.winPulseTargetsInitialScales.forEach((initialScale, target) => {
                if (target) {
                    target.scale.set(initialScale.x, initialScale.y);
                }
            });
            this.winPulseTargetsInitialScales.clear();
        }
        // TODO: Replicate Phaser's stopWinPulse logic for resetting alphas if needed.
        // Phaser: this.allPrizeTexts.forEach(element => element.setAlpha(0));
        //         this.prizeLevelTexts[this.winCurrentIndex].forEach(element => element.setAlpha(1));
        // This alpha logic might belong more in animatePrizeDisplay/stopPrizeDisplayAnimation context.
    }

    private initEventHandlers(): void {
        // Listen to game events to update prize levels, show/hide panel, trigger win animations etc.
        this.eventManager.on(GameEvent.SLOT_DATA_UPDATED as any, this.handleSlotDataUpdate.bind(this));
        this.eventManager.on(GameEvent.SIDE_PANEL_SHOW_WIN as any, this.handlePrizeWinAnimation.bind(this));
        this.eventManager.on(GameEvent.SIDE_PANEL_STOP_WIN as any, this.handleStopPrizeWinAnimation.bind(this));
        this.eventManager.on(GameEvent.RESIZE as any, this.handleResize.bind(this)); 
        // Or REELS_LAYOUT_UPDATED if it provides enough context for side panel positioning
    }

    private handleSlotDataUpdate(data: { scattersPaytable: any[], status: { bet: number } }): void {
        // Assuming data structure similar to Phaser's ISlotDataPresenter
        if (data && data.scattersPaytable && data.scattersPaytable.length > 1) {
            const prizePayTable = data.scattersPaytable[1]; // This index might vary
            const prizeLevels: number[] = [];
            for (let i = prizePayTable.length - 1; i >= (this.config.prizeMinRequirement || 3) ; i--) {
                prizeLevels.push(prizePayTable[i] * data.status.bet);
            }
            this.updatePrizeLevels(prizeLevels);
        }
    }
    
    private handlePrizeWinAnimation(data: { count: number /* scatter count that won */, duration?: number }): void {
        // Find the index for this.config.prizeLevels array
        const winningIndex = (this.config.prizeMinRequirement + this.config.prizeLevelsCount -1) - data.count;
        if (winningIndex >= 0 && winningIndex < this.config.prizeLevelsCount) {
            // this.currentWinningPrizeIndex = winningIndex; // This is set in animatePrizeDisplay
            this.animatePrizeDisplay(winningIndex, data.duration);
            // console.log(`SidePanel: Animate prize for scatter count ${data.count}, index ${winningIndex}`);
        } else {
            console.warn(`SidePanel: Invalid scatter count ${data.count} for prize animation.`);
        }
    }

    private handleStopPrizeWinAnimation(): void {
        this.stopPrizeDisplayAnimation();
        // console.log('SidePanel: Stop prize win animation');
    }
    
    private handleResize(): void {
        // this.isPortrait = Globals.screenHeight > Globals.screenWidth;
        // this.updateLayout(this.isPortrait);
        // TODO: Request or use data from GameEvent.REELS_LAYOUT_UPDATED to get precise reel positions
        // for correct side panel placement as per Phaser's resizeSidePanel logic.
        console.log('SidePanel: handleResize - layout update needed');
    }

    public show(): void {
        this.visible = true;
        // TODO: Add fade-in animation if needed
    }

    public hide(): void {
        this.visible = false;
        // TODO: Add fade-out animation if needed
    }

    public updatePrizeLevels(newPrizeLevels: number[]): void {
        // Update the text of PIXI.BitmapText objects for each prize level
        newPrizeLevels.forEach((amount, index) => {
            if (this.prizeLevelAmountTexts[index] && this.prizeLevelAmountTexts[index][0]) {
                // Assuming only one layer for now, or apply to primary layer
                this.prizeLevelAmountTexts[index][0].text = amount.toFixed(2); // Format as needed
            } else if (this.prizeLevelAmountTexts[index]){
                 // Handle cases with multiple text layers if logic requires specific updates
            }
        });
        // TODO: Refresh layout of texts if their size changes significantly (part of updateLayout)
    }

    public updateLayout(isPortraitMode: boolean, panelX: number = 0, panelY: number = 0): void {
        this.isPortrait = isPortraitMode;
        this.position.set(panelX, panelY); // Position the main panel container

        const layoutConf = isPortraitMode ? this.config.layout.portrait : this.config.layout.landscape;
        const contentScale = (isPortraitMode ? this.config.layout.panelContentScalePort : this.config.layout.panelContentScaleLand) || 1.0;

        // Position Background
        if (this.background) {
            const bgOffsetX = layoutConf.backgroundOffset?.x || 0;
            const bgOffsetY = layoutConf.backgroundOffset?.y || 0;
            this.background.position.set(bgOffsetX, bgOffsetY);
            // Assuming background image is sized correctly or uses a 9-slice plane for dynamic sizing.
            // If it's a simple sprite, its scale might need to adapt to layoutConf.width/height.
            // For now, just apply contentScale if it's a PIXI.Sprite
            if (this.background instanceof PIXI.Sprite) {
                 this.background.scale.set(contentScale); 
            }
        }

        // Position Logo
        if (this.logoSprite) {
            const logoOffsetX = layoutConf.logoOffset?.x || 0;
            const logoOffsetY = layoutConf.logoOffset?.y || 0;
            this.logoSprite.position.set(logoOffsetX, logoOffsetY);
            this.logoSprite.scale.set(contentScale); // Apply overall content scale
             // TODO: Consider specific logo scaling from Phaser's config.logoCfg / animatedLogoCfg if ported
        }

        // Position Prize Level Containers
        const levelsContainerStartX = layoutConf.prizeLevelsContainerOffset?.x || 0;
        const levelsContainerStartY = layoutConf.prizeLevelsContainerOffset?.y || 0;
        
        const levelSpacing = (isPortraitMode && layoutConf.hasOwnProperty('prizeLevelVerticalSpacing')) ? 
                           (layoutConf as any).prizeLevelVerticalSpacing || 0 :
                           (!isPortraitMode && layoutConf.hasOwnProperty('prizeLevelHorizontalSpacing')) ? 
                           (layoutConf as any).prizeLevelHorizontalSpacing || 0 : 0;

        this.prizeLevelContainers.forEach((container, index) => {
            if (isPortraitMode) {
                container.position.set(levelsContainerStartX, levelsContainerStartY + index * levelSpacing);
            } else {
                container.position.set(levelsContainerStartX + index * levelSpacing, levelsContainerStartY);
            }
            container.scale.set(contentScale); 

            const prizeSpriteCfg = this.config.prizeSpriteConfig;
            const bitmapTextCfg = this.config.bitmapTextConfig;
            
            const bgSprite = this.background as PIXI.Sprite; 
            if (!bgSprite || !bgSprite.texture || bgSprite.texture === PIXI.Texture.EMPTY) {
                 return;
            }

            // Background dimensions and position *in panel space*, considering its anchor and current scale.
            // Assuming this.background has had its scale set by contentScale already.
            const bgAnchorX = bgSprite.anchor.x;
            const bgAnchorY = bgSprite.anchor.y;
            const bgCurrentScaledWidth = bgSprite.width; // This is post-scale
            const bgCurrentScaledHeight = bgSprite.height; // This is post-scale
            const bgTopLeftPanelX = bgSprite.x - bgCurrentScaledWidth * bgAnchorX;
            const bgTopLeftPanelY = bgSprite.y - bgCurrentScaledHeight * bgAnchorY;
            const bgCenterPanelX = bgTopLeftPanelX + bgCurrentScaledWidth / 2;

            // --- Reposition Prize Amount Texts (children of 'container') ---
            const amountTexts = this.prizeLevelAmountTexts[index];
            if (amountTexts && amountTexts.length > 0 && bitmapTextCfg) {
                const additionalOffsetYText = (index > 0 && bitmapTextCfg.additionalOffsetYSecond) ? bitmapTextCfg.additionalOffsetYSecond : 0;
                const textOffsetYPerLineDistribution = 
                    ((bgCurrentScaledHeight + (this.config.tableBgActualHeightDiff || 0)) / this.config.prizeLevelsCount) + 
                    (bitmapTextCfg.offsetY || 0); 
                const textOverallOffsetYFromBgTop = bitmapTextCfg.offsetTop || 0;
                
                // This is the target Y for the text's anchor point, calculated in panel space.
                const yAnchorInPanelSpace = bgTopLeftPanelY + textOverallOffsetYFromBgTop + 
                                   (index * textOffsetYPerLineDistribution) + 
                                   additionalOffsetYText;

                amountTexts.forEach(textInstance => {
                    const textCfgAnchor = bitmapTextCfg.anchor || { x: 0.5, y: 0.5 };
                    textInstance.anchor.set(textCfgAnchor.x, textCfgAnchor.y);
                    
                    // This is the target X for the text's anchor point, calculated in panel space.
                    const xAnchorInPanelSpace = bgCenterPanelX + (bitmapTextCfg.offsetX || 0);
                                        
                    // Convert target anchor position from panel space to local space of the container
                    const localPos = container.toLocal(new PIXI.Point(xAnchorInPanelSpace, yAnchorInPanelSpace), this);
                    textInstance.position.set(localPos.x, localPos.y);

                    let textScaleX = 1.0, textScaleY = 1.0;
                    if (isPortraitMode) {
                        textScaleX = bitmapTextCfg.scaleXPort ?? 1.0;
                        textScaleY = bitmapTextCfg.scaleYPort ?? 1.0;
                    } else {
                        textScaleX = bitmapTextCfg.scaleXLand ?? 1.0;
                        textScaleY = bitmapTextCfg.scaleYLand ?? 1.0;
                    }
                    // This local scale will be multiplied by the parent 'container' scale (contentScale)
                    // and also by the overall PixiSidePanel scale if this.scale is not 1.
                    textInstance.scale.set(textScaleX, textScaleY);
                });
            }

            // --- Reposition Prize Number Sprites (children of 'container') ---
            const numberSprite = this.prizeLevelNumberSprites[index];
            const baseNumberSprite = this.prizeLevelNumberBaseSprites[index];
            const activeNumberSprite = this.prizeLevelNumberActiveSprites[index];
            const mainTextForSpriteRef = (amountTexts && amountTexts.length > 0) ? amountTexts[0] : null;

            if (prizeSpriteCfg) {
                const numSpriteAnchor = prizeSpriteCfg.anchor || { x: 0.5, y: 0.5 };

                let additionalOffsetYNumSprite = 0;
                if (index === 0 && prizeSpriteCfg.offsetTop) { 
                    additionalOffsetYNumSprite = prizeSpriteCfg.offsetTop;
                }
                if (prizeSpriteCfg.additionalOffsetY && prizeSpriteCfg.additionalOffsetY[index] !== undefined) {
                    additionalOffsetYNumSprite += prizeSpriteCfg.additionalOffsetY[index]!;
                }
                
                let yInPanelSpaceForSprite = bgTopLeftPanelY; 
                if (mainTextForSpriteRef) {
                    // Get textInstance's anchor position in panel space for reference
                    const textAnchorGlobalPos = mainTextForSpriteRef.getGlobalPosition(new PIXI.Point());
                    const textAnchorPanelY = textAnchorGlobalPos.y - this.getGlobalPosition(new PIXI.Point()).y;
                    yInPanelSpaceForSprite = textAnchorPanelY + additionalOffsetYNumSprite;
                }

                const xInPanelSpaceForSprite = bgTopLeftPanelX + (prizeSpriteCfg.offsetLeft || 0);
                 // If prizeSpriteCfg.offsetX is for spacing multiple number sprites FOR THE SAME prize level:
                 // xInPanelSpaceForSprite += (spriteSubIndex_within_level * (prizeSpriteCfg.offsetX || 0));
                 // For now, assuming one number sprite display per level, so spriteSubIndex is 0.

                const elementsToPosition = [numberSprite, baseNumberSprite, activeNumberSprite].filter(s => !!s) as PIXI.Sprite[];
                elementsToPosition.forEach(sprite => {
                    sprite.anchor.set(numSpriteAnchor.x, numSpriteAnchor.y);
                    const localSpritePos = container.toLocal(new PIXI.Point(xInPanelSpaceForSprite, yInPanelSpaceForSprite), this);
                    sprite.position.set(localSpritePos.x, localSpritePos.y);
                    
                    let spriteSpecificScaleMultiplier = 1.0;
                    if (isPortraitMode && prizeSpriteCfg.scalePortrait) spriteSpecificScaleMultiplier = prizeSpriteCfg.scalePortrait;
                    if (!isPortraitMode && prizeSpriteCfg.scaleLandscape) spriteSpecificScaleMultiplier = prizeSpriteCfg.scaleLandscape;
                    sprite.scale.set(spriteSpecificScaleMultiplier, spriteSpecificScaleMultiplier);

                    if (sprite === baseNumberSprite && prizeSpriteCfg.baseOverlayOffset) {
                        sprite.x += prizeSpriteCfg.baseOverlayOffset.x; // These are local offsets to the sprite
                        sprite.y += prizeSpriteCfg.baseOverlayOffset.y;
                    }
                });
            }
        });

        console.log(`PixiSidePanel: Updated layout for ${isPortraitMode ? 'Portrait' : 'Landscape'}`);
    }

    public destroy(options?: boolean | PIXI.IDestroyOptions | undefined): void {
        this.activeTweens.forEach(tween => tween.stop());
        this.activeTweens = [];
        this.eventManager.off(GameEvent.SLOT_DATA_UPDATED as any, this.handleSlotDataUpdate.bind(this));
        this.eventManager.off(GameEvent.SIDE_PANEL_SHOW_WIN as any, this.handlePrizeWinAnimation.bind(this));
        this.eventManager.off(GameEvent.SIDE_PANEL_STOP_WIN as any, this.handleStopPrizeWinAnimation.bind(this));
        this.eventManager.off(GameEvent.RESIZE as any, this.handleResize.bind(this));
        this.ticker?.remove(this.updateTweens);
        super.destroy(options);
    }

    private setupEventListeners(): void {
        // Additional setup for event listeners or other initialization steps
    }

    private updateTweens(): void {
        // Implementation of updateTweens method
    }
} 