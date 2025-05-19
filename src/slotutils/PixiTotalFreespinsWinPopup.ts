import * as PIXI from 'pixi.js';
import * as TWEEN from '@tweenjs/tween.js';
import { Globals } from '../core/Global';
import { EventManager, GameEvent } from '../core/utils/EventManager';
import { PixiTextPopup, IPixiTextPopupOptions } from './PixiTextPopup'; // Corrected: IPixiTextPopupOptions
import { PixiBorderLights, IPixiBorderLightsConfig } from './PixiBorderLights'; // Assuming you'll create this

// Forward declare if PixiBorderLights is not yet created to avoid import errors
// declare class PixiBorderLights extends PIXI.Container { constructor(config: any, targetSprite?: PIXI.Sprite); resize(): void; show(): void; hide(): void; updatePositionAndScale?(): void; }
// declare interface IPixiBorderLightsConfig {};

export interface IPixiTotalFreespinsWinPopupConfig {
    textures: {
        background: string;
        backlight: string;
    };
    textPopupConfig: IPixiTextPopupOptions; // Corrected: IPixiTextPopupOptions
    borderLightsConfig: IPixiBorderLightsConfig; // Config for PixiBorderLights
    // Timings for animations, fades etc.
    fadeInDuration?: number;
    fadeOutDuration?: number;
    textPopupId?: string; // Optional ID for event matching for TEXTPOPUP_COUNTUP_START
}

export class PixiTotalFreespinsWinPopup extends PIXI.Container {
    private config: IPixiTotalFreespinsWinPopupConfig;
    private eventManager: EventManager;

    private backgroundSprite: PIXI.Sprite | null = null;
    private backlightSprite: PIXI.Sprite | null = null;
    private amountTextPopup: PixiTextPopup | null = null;
    private borderEffect: PixiBorderLights | null = null;

    private activeTweens: TWEEN.Tween<any>[] = [];
    private isShowing: boolean = false;

    // Store bound listeners
    private _onTextPopupCountupStart: () => void;
    private _onTotalFsWinPopupClosing: () => void;

    constructor(config: IPixiTotalFreespinsWinPopupConfig) {
        super();
        this.config = {
            fadeInDuration: 300,
            fadeOutDuration: 300,
            ...config
        };
        this.eventManager = EventManager.getInstance();

        // Initialize bound listeners
        this._onTextPopupCountupStart = () => {
            if (this.isShowing) { 
                this.showSecondaryEffects();
            }
        };
        this._onTotalFsWinPopupClosing = () => {
            if (this.isShowing) {
                this.hideSecondaryEffects();
            }
        };

        this.initChildElements();
        this.initEventHandlers();

        this.visible = false;
        this.alpha = 0;
        console.log('PixiTotalFreespinsWinPopup Initialized');
    }

    private initChildElements(): void {
        // Background
        if (Globals.resources[this.config.textures.background]) {
            this.backgroundSprite = new PIXI.Sprite(Globals.resources[this.config.textures.background] as PIXI.Texture);
            this.backgroundSprite.anchor.set(0.5);
            this.addChild(this.backgroundSprite);
        } else {
            console.warn(`Texture not found: ${this.config.textures.background}`);
        }

        // Backlight (rendered behind background or blended)
        if (Globals.resources[this.config.textures.backlight]) {
            this.backlightSprite = new PIXI.Sprite(Globals.resources[this.config.textures.backlight] as PIXI.Texture);
            this.backlightSprite.anchor.set(0.5);
            if (this.backgroundSprite) {
                this.addChildAt(this.backlightSprite, this.getChildIndex(this.backgroundSprite));
            } else {
                this.addChild(this.backlightSprite);
            }
            this.backlightSprite.visible = false; // Controlled by text popup animation start
        } else {
            console.warn(`Texture not found: ${this.config.textures.backlight}`);
        }
        
        // Amount Text Popup - It adds its own elements to its parentContainer.
        // We DON'T addChild(this.amountTextPopup) because PixiTextPopup is not a DisplayObject itself.
        const textPopupParent = this.backgroundSprite || this; 
        this.amountTextPopup = new PixiTextPopup( this.config.textPopupConfig);

        // Border Lights - assuming it can attach to backgroundSprite or be positioned around it
        if (this.backgroundSprite && typeof PixiBorderLights !== 'undefined') {
            this.borderEffect = new PixiBorderLights(this.config.borderLightsConfig, this.backgroundSprite);
            this.addChild(this.borderEffect);
            this.borderEffect.visible = false; // Controlled by text popup animation start
        } else if (typeof PixiBorderLights === 'undefined'){
            console.warn('PixiBorderLights class is not defined. Border effect will not be created.');
        } else {
            console.warn('Background sprite for border effect not available.');
        }
    }

    private initEventHandlers(): void {
        if (this.amountTextPopup) {
            // Assuming PixiTextPopup will emit TEXTPOPUP_COUNTUP_START if its options enable it,
            // and an ID or reference is needed to distinguish if multiple popups use this global event.
            // For simplicity, let's assume PixiTextPopup does not emit its own ID with the event for now,
            // and this popup is the only one interested or a more specific event is used.
            // The original PixiTextPopup doesn't have an explicit getId() method.
            this.eventManager.on(GameEvent.TEXTPOPUP_COUNTUP_START as any, this._onTextPopupCountupStart);
            this.eventManager.on(GameEvent.TOTAL_FS_WIN_POPUP_CLOSING as any, this._onTotalFsWinPopupClosing);
        }
    }

    private showSecondaryEffects(): void {
        if (this.backlightSprite) {
            this.backlightSprite.visible = true;
            this.backlightSprite.alpha = 0;
            const blTween = new TWEEN.Tween(this.backlightSprite).to({alpha: 1}, 200).start();
            this.activeTweens.push(blTween);
        }
        if (this.borderEffect) {
            this.borderEffect.visible = true;
            this.borderEffect.show(); // Assuming PixiBorderLights has a show method
        }
    }

    private hideSecondaryEffects(): void {
        if (this.backlightSprite && this.backlightSprite.visible) {
            const blTween = new TWEEN.Tween(this.backlightSprite).to({alpha: 0}, 200).onComplete(() => this.backlightSprite!.visible = false).start();
            this.activeTweens.push(blTween);
        }
        if (this.borderEffect && this.borderEffect.visible) {
            this.borderEffect.hide(); // Assuming PixiBorderLights has a hide method
        }
    }

    public show(totalWinAmount: number, duration?: number): void {
        if (this.isShowing) return;
        this.isShowing = true;
        this.visible = true;
        this.alpha = 0;

        this.activeTweens.forEach(t => t.stop());
        this.activeTweens = [];

        if (this.amountTextPopup) {
            // Use setValue to set the amount and trigger animation (if configured in PixiTextPopup options)
            // PixiTextPopup.setValue(amount: number, animate: boolean = false, isTurbo?: boolean)
            this.amountTextPopup.setValue(totalWinAmount, true);
            // PixiTextPopup.show(animated: boolean = true, duration: number = 300)
            this.amountTextPopup.show(true, this.config.fadeInDuration); 
        }

        const showTween = new TWEEN.Tween(this)
            .to({ alpha: 1 }, this.config.fadeInDuration)
            .start();
        this.activeTweens.push(showTween);
        
        // If an overall duration is provided for the popup itself
        if (duration && duration > 0) {
            // This timeout should consider the text animation duration
            // setTimeout(() => this.hide(), duration + (this.amountTextPopup?.getAnimationDuration() || 2000));
        }
    }

    public hide(): void {
        if (!this.isShowing) return;
        
        this.eventManager.emit(GameEvent.TOTAL_FS_WIN_POPUP_CLOSING as any);

        this.activeTweens.forEach(t => t.stop());
        this.activeTweens = [];

        const hideTween = new TWEEN.Tween(this)
            .to({ alpha: 0 }, this.config.fadeOutDuration)
            .onComplete(() => {
                this.visible = false;
                this.isShowing = false;
                if (this.amountTextPopup) this.amountTextPopup.hide(true, this.config.fadeOutDuration); // Use its hide method parameters
            })
            .start();
        this.activeTweens.push(hideTween);
    }

    public updateLayout(reelLayoutData: any, isPortrait: boolean): void {
        if (!this.visible && !this.isShowing && !this.amountTextPopup) return; 

        const scale = reelLayoutData.reels[0]?.reelScale || 1.0;
        // TODO: Use detailed positioning logic from Phaser's createObjectsInFrontOfSymbols (lines 108-125)
        const middleX = Globals.gameWidth / 2; // Placeholder
        const middleY = Globals.gameHeight / 2; // Placeholder
        // const dY = ... calculation from Phaser
        // const targetY = middleY - 0.25 * dY; 

        if (this.backgroundSprite) {
            this.backgroundSprite.position.set(middleX, middleY); // Adjust with targetY
            this.backgroundSprite.scale.set(scale);
        }
        if (this.backlightSprite) {
            this.backlightSprite.position.set(middleX, middleY); // Adjust with targetY
            this.backlightSprite.scale.set(scale * 1.2); // Example: backlight might be larger
        }
        if (this.amountTextPopup) {
            // PixiTextPopup positions its internal textObject relative to its parent.
            // Its x/y setters refer to the internal textObject's position.
            this.amountTextPopup.x = this.backgroundSprite ? 0 : middleX; // Centered on background or this container
            this.amountTextPopup.y = this.backgroundSprite ? 0 : middleY; // Adjust with targetY and text anchor
            this.amountTextPopup.setScale(scale * 0.75); // Use setScale method
        }
        if (this.borderEffect) {
            if (this.borderEffect.updatePositionAndScale) {
                 this.borderEffect.updatePositionAndScale(); // If it recalculates based on target
            } else if (this.borderEffect.resize) {
                 this.borderEffect.resize();
            }
        }
        console.log(`PixiTotalFreespinsWinPopup: Updating layout`);
    }

    public destroy(options?: boolean | PIXI.IDestroyOptions | undefined): void {
        this.activeTweens.forEach(tween => tween.stop());
        this.activeTweens = [];
        
        this.eventManager.off(GameEvent.TEXTPOPUP_COUNTUP_START as any, this._onTextPopupCountupStart);
        this.eventManager.off(GameEvent.TOTAL_FS_WIN_POPUP_CLOSING as any, this._onTotalFsWinPopupClosing);

        super.destroy(options);
    }
} 