import * as PIXI from 'pixi.js';
import * as TWEEN from '@tweenjs/tween.js';
import { EventManager, GameEvent, IGambleChoice, IGambleResult } from '../core/utils/EventManager';
import { Globals } from '../core/Global';
import { PixiButton, IPixiButtonConfig } from './PixiButton';
import { GambleController } from '../controller/GambleController';

export interface IPixiGambleUILayoutConfig {
    infoTextPos?: { x: number, y: number };
    instructionTextPos?: { x: number, y: number };
    redButtonPos?: { x: number, y: number };
    blackButtonPos?: { x: number, y: number };
    collectButtonPos?: { x: number, y: number };
    playerChoiceCardPos?: { x: number, y: number };
    revealedCardPos?: { x: number, y: number };
    resultTextPos?: { x: number, y: number };
    panelHeight?: number;
    panelWidth?: number;
}

export interface IPixiGambleUIConfig {
    name: string;
    backgroundTextureKey?: string;
    nineSliceConfig?: { leftWidth: number, topHeight: number, rightWidth: number, bottomHeight: number };
    layout: {
        portrait: IPixiGambleUILayoutConfig;
        landscape: IPixiGambleUILayoutConfig;
    };
    textures: {
        background?: string;
        cardBack: string;
        cardRed: string;
        cardBlack: string;
    };
    buttonConfigs: {
        redButton: IPixiButtonConfig;
        blackButton: IPixiButtonConfig;
        collectButton: IPixiButtonConfig;
    };
    textStyles?: {
        infoTextStyle?: Partial<PIXI.ITextStyle>;
        instructionTextStyle?: Partial<PIXI.ITextStyle>;
        resultTextStyle?: Partial<PIXI.ITextStyle>;
    };
    visibleOnInit?: boolean;
    showAnimation?: { type: 'fade' | 'slide', duration?: number };
    hideAnimation?: { type: 'fade' | 'slide', duration?: number };
}

const DEFAULT_INFO_STYLE: Partial<PIXI.ITextStyle> = { fontFamily: 'Arial', fontSize: 30, fill: '#ffffff', align: 'center' };
const DEFAULT_INSTRUCTION_STYLE: Partial<PIXI.ITextStyle> = { fontFamily: 'Arial', fontSize: 24, fill: '#dddddd', align: 'center' };
const DEFAULT_RESULT_TEXT_STYLE: Partial<PIXI.ITextStyle> = { fontFamily: 'Arial', fontSize: 48, fill: '#FFFF00', stroke: '#000000', strokeThickness: 6, align: 'center' };

export class PixiGambleUI extends PIXI.Container {
    private config: IPixiGambleUIConfig;
    private eventManager: EventManager;
    private gambleController: GambleController; // To interact with gamble logic

    private backgroundSprite: PIXI.Sprite | PIXI.NineSlicePlane | null = null;
    private infoText: PIXI.Text | null = null; // e.g., "Gamble current win: X to win Y"
    private instructionText: PIXI.Text | null = null; // e.g., "Choose Red or Black"
    private redButton: PixiButton | null = null;
    private blackButton: PixiButton | null = null;
    private collectButton: PixiButton | null = null;

    // New UI Elements for card display and result
    private playerChoiceDisplay: PIXI.Graphics | PIXI.Sprite | null = null; // Shows what player picked (e.g., a colored box)
    private revealedCardSprite: PIXI.Sprite | null = null; // Shows the outcome card
    private resultText: PIXI.Text | null = null; // Displays WIN/LOSE

    // Store bound listeners for cleanup
    private _boundOnGambleUIShow: (data: { gambleAmount: number, currentWin: number }) => void;
    private _boundOnGambleUIHide: () => void;
    private _onRedButtonClick: () => void;
    private _onBlackButtonClick: () => void;
    private _onCollectButtonClick: () => void;
    private _boundOnGambleResult: (result: IGambleResult) => void;

    constructor(config: IPixiGambleUIConfig) {
        super();
        this.config = config;
        this.name = config.name;
        this.eventManager = EventManager.getInstance();
        this.gambleController = GambleController.getInstance(); // Assuming GambleController is a singleton

        // Initialize bound listeners
        this._boundOnGambleUIShow = this.onGambleUIShow.bind(this);
        this._boundOnGambleUIHide = this.hidePanel.bind(this); // Or a specific hide handler
        this._onRedButtonClick = () => this.handlePlayerChoice('red');
        this._onBlackButtonClick = () => this.handlePlayerChoice('black');
        this._onCollectButtonClick = () => this.gambleController.endGamble(true);
        this._boundOnGambleResult = this.onGambleResult.bind(this);

        this.initBackground();
        this.initTextElements();
        this.initCardDisplays();
        this.initButtons();

        this.updateLayout(Globals.screenHeight > Globals.screenWidth);
        this.initEventHandlers();

        this.visible = config.visibleOnInit ?? false;
        this.alpha = this.visible ? 1 : 0;
        console.log(`PixiGambleUI [${this.config.name}] Initialized`);
    }

    public onGambleUIShow(data: { gambleAmount: number, currentWin: number }): void {
        this.updateDisplay(data.gambleAmount, data.currentWin, null);
        this.showPanel();
        if(this.playerChoiceDisplay) this.playerChoiceDisplay.visible = false;
        
        // Reset revealed card to back and make it visible (or ready to be shown before animation)
        if (this.revealedCardSprite && Globals.resources[this.config.textures.cardBack]) {
            this.revealedCardSprite.texture = Globals.resources[this.config.textures.cardBack] as PIXI.Texture;
            this.revealedCardSprite.scale.x = 1; // Ensure normal scale
            this.revealedCardSprite.visible = true; // Make it visible, animation will occur on this
        } else if (this.revealedCardSprite) {
            this.revealedCardSprite.visible = false; // Hide if no back texture
        }

        if(this.resultText) this.resultText.visible = false;
        this.setChoiceButtonsInteractive(true);
    }

    private initBackground(): void {
        if (this.config.backgroundTextureKey && Globals.resources[this.config.backgroundTextureKey]) {
            const texture = Globals.resources[this.config.backgroundTextureKey] as PIXI.Texture;
            if (this.config.nineSliceConfig && texture.valid) {
                this.backgroundSprite = new PIXI.NineSlicePlane(texture, 
                    this.config.nineSliceConfig.leftWidth, this.config.nineSliceConfig.topHeight, 
                    this.config.nineSliceConfig.rightWidth, this.config.nineSliceConfig.bottomHeight);
            } else if (texture.valid) {
                this.backgroundSprite = new PIXI.Sprite(texture);
            } else { this.createPlaceholderBackground(); }
            if (this.backgroundSprite) this.addChildAt(this.backgroundSprite, 0);
        } else {
            this.createPlaceholderBackground();
        }
    }

    private createPlaceholderBackground(): void {
        console.warn(`PixiGambleUI [${this.config.name}]: Creating placeholder background.`);
        const gfx = new PIXI.Graphics();
        const panelWidth = this.config.layout.portrait.panelWidth || this.config.layout.landscape.panelWidth || 400;
        const panelHeight = this.config.layout.portrait.panelHeight || this.config.layout.landscape.panelHeight || 300;
        gfx.beginFill(0x000033, 0.85); // Dark blueish placeholder
        gfx.drawRect(0,0, panelWidth, panelHeight);
        gfx.endFill();
        this.backgroundSprite = new PIXI.Sprite(Globals.app?.renderer.generateTexture(gfx));
        this.addChildAt(this.backgroundSprite, 0);
    }

    private initTextElements(): void {
        const infoStyle = { ...DEFAULT_INFO_STYLE, ...this.config.textStyles?.infoTextStyle };
        this.infoText = new PIXI.Text("Gamble Info", infoStyle);
        this.infoText.anchor.set(0.5);
        this.addChild(this.infoText);

        const instructionStyle = { ...DEFAULT_INSTRUCTION_STYLE, ...this.config.textStyles?.instructionTextStyle };
        this.instructionText = new PIXI.Text("Choose Red or Black", instructionStyle);
        this.instructionText.anchor.set(0.5);
        this.addChild(this.instructionText);
    }

    private initCardDisplays(): void {
        // Player's choice indicator (simple colored box for now)
        this.playerChoiceDisplay = new PIXI.Graphics();
        this.addChild(this.playerChoiceDisplay);
        this.playerChoiceDisplay.visible = false;

        // Revealed card sprite (starts with card back)
        if (Globals.resources[this.config.textures.cardBack]) {
            this.revealedCardSprite = new PIXI.Sprite(Globals.resources[this.config.textures.cardBack] as PIXI.Texture);
            this.revealedCardSprite.anchor.set(0.5);
            this.addChild(this.revealedCardSprite);
            this.revealedCardSprite.visible = false;
        } else { console.warn("PixiGambleUI: Card back texture not found."); }

        // Result text (WIN/LOSE)
        const resultStyle = { ...DEFAULT_RESULT_TEXT_STYLE, ...this.config.textStyles?.resultTextStyle }; // Add resultTextStyle to config
        this.resultText = new PIXI.Text('', resultStyle);
        this.resultText.anchor.set(0.5);
        this.addChild(this.resultText);
        this.resultText.visible = false;
    }

    private initButtons(): void {
        this.redButton = new PixiButton(this.config.buttonConfigs.redButton);
        this.addChild(this.redButton);

        this.blackButton = new PixiButton(this.config.buttonConfigs.blackButton);
        this.addChild(this.blackButton);

        this.collectButton = new PixiButton(this.config.buttonConfigs.collectButton);
        this.addChild(this.collectButton);
    }

    private initEventHandlers(): void {
        this.eventManager.on(GameEvent.GAMBLE_UI_SHOW as any, this._boundOnGambleUIShow);
        this.eventManager.on(GameEvent.GAMBLE_UI_HIDE as any, this._boundOnGambleUIHide);
        this.eventManager.on(GameEvent.GAMBLE_WON as any, this._boundOnGambleResult);
        this.eventManager.on(GameEvent.GAMBLE_LOST as any, this._boundOnGambleResult);

        if (this.redButton) {
            const eventName = this.redButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.redButton.getNameKey()}`;
            this.eventManager.on(eventName as any, this._onRedButtonClick);
        }
        if (this.blackButton) {
            const eventName = this.blackButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.blackButton.getNameKey()}`;
            this.eventManager.on(eventName as any, this._onBlackButtonClick);
        }
        if (this.collectButton) {
            const eventName = this.collectButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.collectButton.getNameKey()}`;
            this.eventManager.on(eventName as any, this._onCollectButtonClick);
        }
    }

    private handlePlayerChoice(choice: 'red' | 'black'): void {
        if(this.playerChoiceDisplay instanceof PIXI.Graphics){
            this.playerChoiceDisplay.clear().beginFill(choice === 'red' ? 0xff0000 : 0x101010).drawRect(-50, -75, 100, 150).endFill();
            this.playerChoiceDisplay.visible = true;
        }
        this.setChoiceButtonsInteractive(false);
        this.eventManager.emit(GameEvent.GAMBLE_CHOICE_MADE as any, { type: 'color', value: choice } as IGambleChoice);
    }

    private onGambleResult(result: IGambleResult): void {
        // Card reveal animation is now implemented
        
        if (!this.revealedCardSprite && !this.resultText) {
            console.warn('PixiGambleUI: UI elements for result missing.');
            this.updateDisplay(this.gambleController.getCurrentGambleAmount(), result.newWinAmount, result );
            this.setChoiceButtonsInteractive(!result.isWin ? false : (result.canGambleAgain ?? false));
            return;
        }

        // Ensure player's choice display is visible if it exists
        if (this.playerChoiceDisplay) this.playerChoiceDisplay.visible = true;
        // Hide previous result text
        if (this.resultText) this.resultText.visible = false; 

        const cardToReveal = this.revealedCardSprite;
        const originalScaleX = cardToReveal ? cardToReveal.scale.x : 1;
        const flipDuration = 150; 

        let finalCardTextureKey = this.config.textures.cardBack; 
        if (result.winningOutcome) {
            finalCardTextureKey = result.winningOutcome === 'red' ? this.config.textures.cardRed : this.config.textures.cardBlack;
        }
        const finalTexture = Globals.resources[finalCardTextureKey] as PIXI.Texture || 
                             (Globals.resources[this.config.textures.cardBack] as PIXI.Texture);

        this.setChoiceButtonsInteractive(false); // Disable choice buttons during reveal

        if (cardToReveal) {
            cardToReveal.visible = true;
            // Tween to scale X to 0 (card edge)
            new TWEEN.Tween(cardToReveal.scale)
                .to({ x: 0 }, flipDuration)
                .easing(TWEEN.Easing.Quadratic.In)
                .onComplete(() => {
                    if (finalTexture) cardToReveal.texture = finalTexture;
                    // Tween scale X back to original (card face up)
                    new TWEEN.Tween(cardToReveal.scale)
                        .to({ x: originalScaleX }, flipDuration)
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .onComplete(() => {
                            // Reveal animation complete
                            if (this.resultText) {
                                this.resultText.text = result.isWin ? "WIN!" : "LOSE";
                                this.resultText.style.fill = result.isWin ? 0x00ff00 : 0xff0000;
                                this.resultText.visible = true;
                            }
                            this.updateDisplay(this.gambleController.getCurrentGambleAmount(), result.newWinAmount, result );
                            this.setChoiceButtonsInteractive(!result.isWin ? false : (result.canGambleAgain ?? true)); 
                        })
                        .start();
                })
                .start();
        } else {
            // No card sprite, just show text result directly
            if (this.resultText) {
                this.resultText.text = result.isWin ? "WIN!" : "LOSE";
                this.resultText.style.fill = result.isWin ? 0x00ff00 : 0xff0000;
                this.resultText.visible = true;
            }
            this.updateDisplay(this.gambleController.getCurrentGambleAmount(), result.newWinAmount, result );
            this.setChoiceButtonsInteractive(!result.isWin ? false : (result.canGambleAgain ?? true)); 
        }
    }

    private setChoiceButtonsInteractive(interactive: boolean): void {
        this.redButton?.setEnabled(interactive);
        this.blackButton?.setEnabled(interactive);
        // Collect button is usually always active when panel is shown
        this.collectButton?.setEnabled(true);
    }

    public updateDisplay(gambleAmount: number, currentTotalWin: number, result?: IGambleResult | null): void {
        const potentialWinNextGamble = gambleAmount * 2; // Amount player risks * 2
        let infoStr = `Current Win: ${currentTotalWin}`;
        if (result?.isWin && result?.canGambleAgain) {
            infoStr += `\nGamble Next: ${currentTotalWin} to Win ${currentTotalWin * 2}`;
            if(this.instructionText) this.instructionText.text = 'Choose Again or Collect';
        } else if (!result || result?.canGambleAgain) { // Initial state or if won but not at limit yet
            infoStr += `\nGamble: ${gambleAmount} to Win: ${potentialWinNextGamble}`;
            if(this.instructionText) this.instructionText.text = 'Choose Red or Black, or Collect.';
        } else { // Lost or cannot gamble again
             if(this.instructionText) this.instructionText.text = result.isWin ? 'Collect Your Winnings!' : 'Better Luck Next Time!';
        }

        if (this.infoText) this.infoText.text = infoStr;
    }

    public showPanel(): void { 
        if (this.visible && this.alpha === 1) return;
        // updateDisplay would have been called by onGambleUIShow before this
        this.visible = true; 
        
        const duration = this.config.showAnimation?.duration || 300; // Default duration
        if (this.config.showAnimation?.type === 'fade' || !this.config.showAnimation) { 
            this.alpha = 0;
            new TWEEN.Tween(this).to({ alpha: 1 }, duration).easing(TWEEN.Easing.Quadratic.Out).start();
        } else {
            // TODO: Implement other animation types like 'slide' for gamble UI
            this.alpha = 1; 
        }
        // GAMBLE_UI_SHOW is handled by the listener calling this method, no need to re-emit a generic UI_SHOW unless desired for UIManager
        // this.eventManager.emit(GameEvent.UI_SHOW as any, {name: this.name, component: this}); 
        console.log(`PixiGambleUI [${this.config.name}] shown.`);
    }

    public hidePanel(): void { 
        if (!this.visible || this.alpha === 0) return;

        const duration = this.config.hideAnimation?.duration || 300;
        const onComplete = () => {
            this.visible = false;
            // GAMBLE_UI_HIDE is handled by the listener calling this method
            // this.eventManager.emit(GameEvent.UI_HIDE as any, {name: this.name, component: this}); 
            console.log(`PixiGambleUI [${this.config.name}] hidden.`);
        };

        if (this.config.hideAnimation?.type === 'fade' || !this.config.hideAnimation) { 
            new TWEEN.Tween(this).to({ alpha: 0 }, duration).easing(TWEEN.Easing.Quadratic.In).onComplete(onComplete).start();
        } else {
            // TODO: Implement other animation types like 'slide' for gamble UI
            this.alpha = 0; 
            onComplete();
        }
    }
    
    public updateLayout(isPortrait: boolean, panelX?: number, panelY?: number): void {
        const layoutConf = isPortrait ? this.config.layout.portrait : this.config.layout.landscape;
        
        if (panelX !== undefined) this.x = panelX;
        if (panelY !== undefined) this.y = panelY;

        const panelW = layoutConf.panelWidth || this.width; // Use current width as fallback if not in layout
        const panelH = layoutConf.panelHeight || this.height;

        if (this.backgroundSprite) {
            this.backgroundSprite.width = panelW;
            this.backgroundSprite.height = panelH;
        }

        if(this.infoText && layoutConf.infoTextPos) {
            this.infoText.position.set(layoutConf.infoTextPos.x, layoutConf.infoTextPos.y);
        }
        if(this.instructionText && layoutConf.instructionTextPos) {
            this.instructionText.position.set(layoutConf.instructionTextPos.x, layoutConf.instructionTextPos.y);
        }
        if(this.redButton && layoutConf.redButtonPos) {
            this.redButton.position.set(layoutConf.redButtonPos.x, layoutConf.redButtonPos.y);
        }
        if(this.blackButton && layoutConf.blackButtonPos) {
            this.blackButton.position.set(layoutConf.blackButtonPos.x, layoutConf.blackButtonPos.y);
        }
        if(this.collectButton && layoutConf.collectButtonPos) {
            this.collectButton.position.set(layoutConf.collectButtonPos.x, layoutConf.collectButtonPos.y);
        }
        if(this.playerChoiceDisplay && layoutConf.playerChoiceCardPos) {
            this.playerChoiceDisplay.position.set(layoutConf.playerChoiceCardPos.x, layoutConf.playerChoiceCardPos.y);
        }
        if(this.revealedCardSprite && layoutConf.revealedCardPos) {
            this.revealedCardSprite.position.set(layoutConf.revealedCardPos.x, layoutConf.revealedCardPos.y);
        }
        if(this.resultText && layoutConf.resultTextPos) {
            this.resultText.position.set(layoutConf.resultTextPos.x, layoutConf.resultTextPos.y);
        }
        console.log(`PixiGambleUI [${this.config.name}] Updated layout. Portrait: ${isPortrait}`);
    }

    public destroy(options?: PIXI.IDestroyOptions | boolean): void { 
        this.eventManager.off(GameEvent.GAMBLE_UI_SHOW as any, this._boundOnGambleUIShow);
        this.eventManager.off(GameEvent.GAMBLE_UI_HIDE as any, this._boundOnGambleUIHide);
        this.eventManager.off(GameEvent.GAMBLE_WON as any, this._boundOnGambleResult);
        this.eventManager.off(GameEvent.GAMBLE_LOST as any, this._boundOnGambleResult);
        
        if (this.redButton) {
            const eventName = this.redButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.redButton.getNameKey()}`;
            this.eventManager.off(eventName as any, this._onRedButtonClick);
        }
        if (this.blackButton) {
            const eventName = this.blackButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.blackButton.getNameKey()}`;
            this.eventManager.off(eventName as any, this._onBlackButtonClick);
        }
        if (this.collectButton) {
            const eventName = this.collectButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.collectButton.getNameKey()}`;
            this.eventManager.off(eventName as any, this._onCollectButtonClick);
        }

        // Destroy children
        this.backgroundSprite?.destroy(options);
        this.infoText?.destroy(options);
        this.instructionText?.destroy(options);
        this.redButton?.destroy(options);
        this.blackButton?.destroy(options);
        this.collectButton?.destroy(options);
        this.playerChoiceDisplay?.destroy(options);
        this.revealedCardSprite?.destroy(options);
        this.resultText?.destroy(options);

        console.log(`PixiGambleUI [${this.config.name}] destroyed.`); 
        super.destroy(options); 
    }
} 