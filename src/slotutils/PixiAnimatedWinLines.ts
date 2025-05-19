import * as PIXI from 'pixi.js';
import { Globals } from '../core/Global';
import { EventManager, GameEvent } from '../core/utils/EventManager';

export interface IPixiWinLineGfxData {
    offsetY: number;
    flipY: boolean;
    // Add other line-specific graphic properties if needed
}

export interface IPixiAnimatedWinLinesConfig {
    textureKey: string; // Spritesheet key for winline animations
    animationPrefix: string; // e.g., 'animatedwinline' - frames might be named like 'animatedwinline0_00', 'animatedwinline0_01'
    animationFrameCount: number; // Number of frames per line animation, if uniform
    // Alternatively, provide a more detailed structure for animation frames per line if they vary significantly
    // e.g., animationFrames: { [lineIndex: number]: string[] } // frame names for each line
    frameRate?: number;
    baseScale?: number;
    numberOfWinLines: number;
    gfxData: IPixiWinLineGfxData[]; // Array of graphic data for each winline
    positionScaleFactorW?: number;
    positionScaleFactorH?: number;
}

export class PixiAnimatedWinLines extends PIXI.Container {
    private config: IPixiAnimatedWinLinesConfig;
    private eventManager: EventManager;
    private winLineSprites: (PIXI.AnimatedSprite | null)[] = [];
    private lastReelLayoutData: any = null; // Define a proper interface for reel layout data

    constructor(config: IPixiAnimatedWinLinesConfig) {
        super();
        this.config = {
            frameRate: 24, // Default
            baseScale: 1.0,
            positionScaleFactorW: 1.0,
            positionScaleFactorH: 1.0,
            ...config,
        };
        this.eventManager = EventManager.getInstance();
        this.initSprites();
        this.initEventHandlers();
        this.visible = false;
        console.log('PixiAnimatedWinLines Initialized');
    }

    private initSprites(): void {
        const spritesheet = Globals.resources[this.config.textureKey] as PIXI.Spritesheet;
        if (!spritesheet || !spritesheet.animations) {
            console.warn(`Spritesheet not found or animations not defined: ${this.config.textureKey}`);
            return;
        }

        for (let i = 0; i < this.config.numberOfWinLines; i++) {
            const animationName = `${this.config.animationPrefix}${i}`;
            const animationFrames = spritesheet.animations[animationName];

            if (animationFrames) {
                const sprite = new PIXI.AnimatedSprite(animationFrames);
                sprite.animationSpeed = (this.config.frameRate || 24) / 60; // Convert FPS to Pixi's speed unit
                sprite.loop = true;
                sprite.anchor.set(0.5);
                sprite.visible = false;
                this.addChild(sprite);
                this.winLineSprites[i] = sprite;
            } else {
                console.warn(`Animation not found in spritesheet: ${animationName}`);
                this.winLineSprites[i] = null;
            }
        }
    }

    private initEventHandlers(): void {
        this.eventManager.on(GameEvent.REELS_LAYOUT_UPDATED as any, this.handleReelsLayoutUpdate.bind(this));
        this.eventManager.on(GameEvent.SHOW_SINGLE_WINLINE as any, this.handleShowSingleWinLine.bind(this));
        this.eventManager.on(GameEvent.SHOW_MULTIPLE_WINLINES as any, this.handleShowMultipleWinLines.bind(this));
        this.eventManager.on(GameEvent.HIDE_ALL_WINLINES as any, this.handleHideAllWinLines.bind(this));
    }

    private handleReelsLayoutUpdate(reelsLayout: any): void {
        this.lastReelLayoutData = reelsLayout;
        this.updatePositionsAndScales();
    }

    private handleShowSingleWinLine(data: { winLineIndex: number }): void {
        this.handleHideAllWinLines();
        this.animateWinLine(data.winLineIndex);
    }

    private handleShowMultipleWinLines(data: { lineIndexes: number[] }): void {
        // Could optionally hide all first, or just add to existing visible lines
        // this.handleHideAllWinLines(); 
        data.lineIndexes.forEach(index => this.animateWinLine(index));
    }

    private handleHideAllWinLines(): void {
        this.visible = false;
        for (let i = 0; i < this.config.numberOfWinLines; i++) {
            this.stopWinLine(i);
        }
    }

    public animateWinLine(winLineIndex: number): void {
        if (winLineIndex < 0 || winLineIndex >= this.config.numberOfWinLines) return;
        const sprite = this.winLineSprites[winLineIndex];
        if (sprite) {
            this.visible = true;
            sprite.visible = true;
            sprite.gotoAndPlay(0);
            this.updateSpritePositionAndScale(sprite, winLineIndex); // Ensure position is correct when shown
        }
    }

    public stopWinLine(winLineIndex: number): void {
        if (winLineIndex < 0 || winLineIndex >= this.config.numberOfWinLines) return;
        const sprite = this.winLineSprites[winLineIndex];
        if (sprite) {
            sprite.stop();
            sprite.visible = false;
        }
    }

    private updatePositionsAndScales(): void {
        if (!this.lastReelLayoutData) return;
        
        for (let i = 0; i < this.config.numberOfWinLines; i++) {
            const sprite = this.winLineSprites[i];
            if (sprite && sprite.visible) { // Only update visible lines, or all if always positioned
                this.updateSpritePositionAndScale(sprite, i);
            }
        }
    }

    private updateSpritePositionAndScale(sprite: PIXI.AnimatedSprite, winLineIndex: number): void {
        if (!this.lastReelLayoutData || !this.lastReelLayoutData.reels || this.lastReelLayoutData.reels.length < 3) {
            // console.warn('Cannot update winline position: insufficient reel data');
            return;
        }

        const data = this.lastReelLayoutData; // reels: {x, y, symbolWidth, symbolHeight, numVisibleSymbols, reelScale}[]
        const reelLayout = data.reels;

        // Logic from Phaser's AnimatedWinLines refreshVisualModel:
        // const deltaYSymbol = data.reelsScale * (data.symbolsCoords[1][1].y - data.symbolsCoords[1][0].y);
        // const middleX: number = data.reelsCoords[2].x + data.reelsScale * data.symbolsCoords[2][1].x;
        // const middleY: number = data.reelsCoords[2].y + data.reelsScale * data.symbolsCoords[2][1].y;

        // Simplified: This needs careful translation of Phaser's coordinate system and offsets.
        // The Phaser version calculates a middle point of the entire reel set.
        // For now, let's assume the container this.PixiAnimatedWinLines is already centered on the reels.
        // And individual lines are positioned relative to this container's (0,0).
        
        // TODO: Replicate precise positioning logic from Phaser's AnimatedWinLines.refreshVisualModel
        // This involves using reelLayoutData more thoroughly to find a central X, Y for the whole winline display area
        // and then applying individual gfxData[winLineIndex].offsetY relative to that.

        const lineGfxData = this.config.gfxData[winLineIndex];
        if (!lineGfxData) return;

        // Example placeholder positioning - this will likely be incorrect until detailed logic is ported.
        // Assuming the container itself is positioned correctly over the reels.
        sprite.x = 0; // Position relative to this container
        sprite.y = lineGfxData.offsetY * (data.reels[0]?.reelScale || 1) * (this.config.positionScaleFactorH || 1);
        
        let finalScale = (this.config.baseScale || 1) * (data.reels[0]?.reelScale || 1);
        sprite.scale.set(finalScale);

        if (lineGfxData.flipY) {
            sprite.scale.y = -Math.abs(sprite.scale.y);
        } else {
            sprite.scale.y = Math.abs(sprite.scale.y);
        }
    }

    public destroy(options?: boolean | PIXI.IDestroyOptions | undefined): void {
        this.eventManager.off(GameEvent.REELS_LAYOUT_UPDATED as any, this.handleReelsLayoutUpdate.bind(this));
        this.eventManager.off(GameEvent.SHOW_SINGLE_WINLINE as any, this.handleShowSingleWinLine.bind(this));
        this.eventManager.off(GameEvent.SHOW_MULTIPLE_WINLINES as any, this.handleShowMultipleWinLines.bind(this));
        this.eventManager.off(GameEvent.HIDE_ALL_WINLINES as any, this.handleHideAllWinLines.bind(this));
        super.destroy(options);
    }
} 