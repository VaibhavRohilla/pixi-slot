import * as PIXI from 'pixi.js';
import { EventManager, GameEvent } from '../core/utils/EventManager';
import { Globals } from '../core/Global';

export interface IPixiButtonTextConfig {
    text?: string;
    style?: Partial<PIXI.ITextStyle>;
    offset?: { x: number, y: number };
}

export interface IPixiButtonConfig {
    nameKey: string; // Unique identifier for this button instance
    textureAtlasKey: string;
    upFrame: string;
    overFrame?: string;
    downFrame?: string;
    disabledFrame?: string;
    selectedUpFrame?: string;   // For toggle buttons
    selectedOverFrame?: string; // For toggle buttons
    selectedDownFrame?: string; // For toggle buttons
    
    textConfig?: IPixiButtonTextConfig;
    
    initialX?: number;
    initialY?: number;
    anchorX?: number;
    anchorY?: number;
    
    soundOnClick?: string; // Sound key from SoundController
    soundOnDown?: string;  // Sound key for pointer down event
    isToggle?: boolean;
    initialSelected?: boolean;
    initiallyDisabled?: boolean;
    grayScaleWhenDisabled?: boolean;
    clickEventName?: string; // Custom event name to emit on click, otherwise defaults
    clickPayload?: any;      // Payload for the click event
}

const DEFAULT_BUTTON_ANCHOR = { x: 0.5, y: 0.5 };

export class PixiButton extends PIXI.Container {
    private config: IPixiButtonConfig;
    private eventManager: EventManager;
    
    public buttonSprite: PIXI.Sprite;
    private textLabel: PIXI.Text | null = null;

    private _isDisabled: boolean = false;
    private _isSelected: boolean = false;
    private isPointerOver: boolean = false;
    private isPointerDown: boolean = false;

    // For dynamic click actions
    private currentClickEventName: string | undefined;
    private currentClickPayload: any;

    constructor(config: IPixiButtonConfig) {
        super();
        this.config = config;
        this.name = config.nameKey; // PIXI.DisplayObject has a 'name' property
        this.eventManager = EventManager.getInstance();

        const atlas = Globals.resources[config.textureAtlasKey] as PIXI.Spritesheet;
        if (!atlas || !atlas.textures || !atlas.textures[config.upFrame]) {
            console.error(`PixiButton [${config.nameKey}]: Atlas or upFrame '${config.upFrame}' not found in '${config.textureAtlasKey}'. Creating placeholder.`);
            this.buttonSprite = new PIXI.Sprite(PIXI.Texture.WHITE);
            const gfx = new PIXI.Graphics().beginFill(0xcccccc).drawRect(0,0,100,50).endFill();
            this.buttonSprite.texture = Globals.app?.renderer.generateTexture(gfx) || PIXI.Texture.WHITE;
        } else {
            this.buttonSprite = new PIXI.Sprite(atlas.textures[config.upFrame]);
        }

        this.buttonSprite.anchor.set(config.anchorX ?? DEFAULT_BUTTON_ANCHOR.x, config.anchorY ?? DEFAULT_BUTTON_ANCHOR.y);
        this.addChild(this.buttonSprite);

        if (config.textConfig && config.textConfig.text) {
            const style = new PIXI.TextStyle(config.textConfig.style);
            this.textLabel = new PIXI.Text(config.textConfig.text, style);
            this.textLabel.anchor.set(0.5); // Center text by default
            this.textLabel.position.set(
                config.textConfig.offset?.x || 0,
                config.textConfig.offset?.y || 0
            );
            this.addChild(this.textLabel);
        }

        this.interactive = true;
        this.cursor = 'pointer';
        this._isDisabled = config.initiallyDisabled ?? false;
        this._isSelected = (config.isToggle ?? false) && (config.initialSelected ?? false);

        this.updateButtonTexture();
        if (this._isDisabled) this.applyDisabledState();

        this.on('pointerdown', this.onPointerDown, this);
        this.on('pointerup', this.onPointerUp, this);
        this.on('pointerover', this.onPointerOver, this);
        this.on('pointerout', this.onPointerOut, this);
        this.on('pointerupoutside', this.onPointerUpOutside, this);

        if (config.initialX !== undefined) this.x = config.initialX;
        if (config.initialY !== undefined) this.y = config.initialY;
        
        // Initialize dynamic click action from config
        this.currentClickEventName = config.clickEventName; // Use specific if provided
        this.currentClickPayload = config.clickPayload;
        
        console.log(`PixiButton [${this.config.nameKey}] Initialized`);
    }

    private updateButtonTexture(): void {
        if (!this.buttonSprite) return;
        const atlas = Globals.resources[this.config.textureAtlasKey] as PIXI.Spritesheet;
        if (!atlas || !atlas.textures) return;

        let frameKey: string | undefined;

        if (this._isDisabled && this.config.disabledFrame) {
            frameKey = this.config.disabledFrame;
        } else if (this.config.isToggle && this._isSelected) {
            if (this.isPointerDown && this.config.selectedDownFrame) frameKey = this.config.selectedDownFrame;
            else if (this.isPointerOver && this.config.selectedOverFrame) frameKey = this.config.selectedOverFrame;
            else frameKey = this.config.selectedUpFrame || this.config.upFrame; // Fallback to selectedUp or up
        } else {
            if (this.isPointerDown && this.config.downFrame) frameKey = this.config.downFrame;
            else if (this.isPointerOver && this.config.overFrame) frameKey = this.config.overFrame;
            else frameKey = this.config.upFrame;
        }

        if (frameKey && atlas.textures[frameKey]) {
            this.buttonSprite.texture = atlas.textures[frameKey];
        } else if (!this._isDisabled && !this._isSelected) { // Fallback to upFrame if others are missing for normal state
            this.buttonSprite.texture = atlas.textures[this.config.upFrame];
        }
    }

    private applyDisabledState(): void {
        this.interactive = !this._isDisabled;
        if (this.config.grayScaleWhenDisabled) {
            const colorMatrix = new PIXI.filters.ColorMatrixFilter();
            if (this._isDisabled) {
                colorMatrix.grayscale(0.5, false); // Apply grayscale
                this.filters = [colorMatrix];
            } else {
                this.filters = []; // Remove grayscale
            }
        } else {
             this.alpha = this.isDisabled ? 0.7 : 1.0; // Simple alpha change if no grayscale
        }
        this.updateButtonTexture(); // Ensure correct frame for disabled state
    }

    public setText(newText: string): void {
        if (this.textLabel) {
            this.textLabel.text = newText;
        } else if (this.config.textConfig) { // Create if wasn't before
            const style = new PIXI.TextStyle(this.config.textConfig.style);
            this.textLabel = new PIXI.Text(newText, style);
            this.textLabel.anchor.set(0.5);
            this.textLabel.position.set(this.config.textConfig.offset?.x || 0, this.config.textConfig.offset?.y || 0);
            this.addChild(this.textLabel);
        }
    }

    public setEnabled(isEnabled: boolean): void {
        if (this._isDisabled === !isEnabled) return;
        this._isDisabled = !isEnabled;
        this.applyDisabledState();
    }

    public get isDisabled(): boolean {
        return this._isDisabled;
    }

    public setSelected(isSelected: boolean): void {
        if (!this.config.isToggle || this._isSelected === isSelected) return;
        this._isSelected = isSelected;
        this.updateButtonTexture();
    }

    public get isSelected(): boolean {
        return this._isSelected;
    }

    public getNameKey(): string {
        return this.config.nameKey;
    }

    public getCustomClickEventName(): string | undefined {
        return this.config.clickEventName;
    }

    public getClickPayload(): any {
        return this.config.clickPayload; // This might need to return currentClickPayload if it can change
    }

    public setClickAction(eventName?: string, payload?: any): void {
        this.currentClickEventName = eventName;
        this.currentClickPayload = payload;
        console.log(`PixiButton [${this.config.nameKey}] click action set to event: ${eventName}`);
    }

    private onPointerDown(): void {
        if (this._isDisabled) return;
        this.isPointerDown = true;
        this.updateButtonTexture();
        if (this.config.soundOnDown) {
            this.eventManager.emit(GameEvent.SOUND_PLAY as any, { soundKey: this.config.soundOnDown });
        }
    }

    private onPointerUp(): void {
        if (this._isDisabled || !this.isPointerDown) return;
        const wasPointerDown = this.isPointerDown;
        this.isPointerDown = false;
        
        if (this.isPointerOver) { // Click completed inside bounds
            if (this.config.isToggle) {
                this.setSelected(!this._isSelected);
            }

            if (this.config.soundOnClick) {
                this.eventManager.emit(GameEvent.SOUND_PLAY as any, { soundKey: this.config.soundOnClick });
            }
            
            const baseClickEvent = GameEvent.UI_BUTTON_CLICKED_BASE; 
            const eventToEmit = this.currentClickEventName || `${baseClickEvent}_${this.getNameKey()}`;
            const payloadToEmit = this.currentClickPayload !== undefined ? this.currentClickPayload : this.getNameKey();

            this.eventManager.emit(eventToEmit as any, payloadToEmit);
            console.log(`PixiButton [${this.getNameKey()}] clicked, emitting: ${eventToEmit}`);
        }
        this.updateButtonTexture();
    }

    private onPointerOver(): void {
        if (this._isDisabled) return;
        this.isPointerOver = true;
        this.updateButtonTexture();
    }

    private onPointerOut(): void {
        if (this._isDisabled) return;
        this.isPointerOver = false;
        // this.isPointerDown = false; // Keep down state if dragged out then back in
        this.updateButtonTexture();
    }

    private onPointerUpOutside(): void {
        if (this._isDisabled) return;
        this.isPointerDown = false;
        this.isPointerOver = false; // Ensure over state is also reset
        this.updateButtonTexture();
    }
    
    public kill(): void { // Mimics Phaser's kill
        this.visible = false;
        this.setEnabled(false);
    }
    public revive(): void { // Mimics Phaser's revive
        this.visible = true;
        this.setEnabled(true);
    }

    public grayScaleEnable(): void { // Specific for Phaser code compatibility
        this.setEnabled(false); // Usually called when disabling
    }
    public grayScaleDisable(): void {
        this.setEnabled(true);
    }

    public destroy(options?: PIXI.IDestroyOptions | boolean): void {
        this.removeAllListeners();
        super.destroy(options);
    }
} 