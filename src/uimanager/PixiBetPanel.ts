import * as PIXI from 'pixi.js';
import * as TWEEN from '@tweenjs/tween.js';
import { EventManager, GameEvent } from '../core/utils/EventManager';
import { Globals } from '../core/Global';
import { PixiButton, IPixiButtonConfig } from './PixiButton';
import { GameFlowController } from '../controller/gameFlowController';
import { formatCurrency } from '../core/utils/formatting';
// import { PixiButton, IPixiButtonConfig } from './PixiButton'; // If it has buttons

export interface IPixiBetPanelLayoutConfig {
    currentBetTextPos?: { x: number, y: number };
    increaseButtonPos?: { x: number, y: number };
    decreaseButtonPos?: { x: number, y: number };
    closeButtonPos?: { x: number, y: number }; // Optional close button
    betLevelsContainerPos?: { x: number, y: number }; // For the list of bet buttons
    betLevelButtonSpacing?: { x: number, y: number }; // Spacing for list buttons
    maxBetButtonPos?: { x: number, y: number };
    panelHeight?: number;
    panelWidth?: number;
    titleTextPos?: { x: number, y: number }; // Added
    padding?: { // Added padding property
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
        itemSpacing?: number;
        textVPadding?: number;
    };
    // TODO: Add layout for individual bet option buttons if that approach is chosen
}

export interface IPixiBetPanelConfig {
    name: string;
    backgroundTextureKey?: string;
    nineSliceConfig?: { leftWidth: number, topHeight: number, rightWidth: number, bottomHeight: number };
    layout: {
        portrait: IPixiBetPanelLayoutConfig;
        landscape: IPixiBetPanelLayoutConfig;
    };
    buttonConfigs: {
        increaseBet: IPixiButtonConfig;
        decreaseBet: IPixiButtonConfig;
        closeButton?: IPixiButtonConfig; // Optional
        betLevelButtonTemplate?: Partial<IPixiButtonConfig>; // Template for bet level list buttons
        maxBetButton?: IPixiButtonConfig; // Optional Max Bet button
    };
    textStyles?: {
        currentBetStyle?: Partial<PIXI.ITextStyle>;
        betLevelButtonStyle?: Partial<PIXI.ITextStyle>; // If text is directly on bet level buttons
        titleStyle?: Partial<PIXI.ITextStyle>; // Added
    };
    currencySymbol?: string;
    visibleOnInit?: boolean;
    showAnimation?: { type: 'fade' | 'slide', duration?: number }; 
    hideAnimation?: { type: 'fade' | 'slide', duration?: number };
    titleText?: string; // Added
}

const DEFAULT_BET_TEXT_STYLE: Partial<PIXI.ITextStyle> = {
    fontFamily: 'Arial',
    fontSize: 40,
    fill: '#ffffff',
    align: 'center'
};

const DEFAULT_BET_PANEL_TITLE_STYLE: Partial<PIXI.ITextStyle> = {
    fontFamily: 'Arial',
    fontSize: 48,
    fill: '#FFFFFF',
    align: 'center',
    stroke: '#000000',
    strokeThickness: 4
};

export class PixiBetPanel extends PIXI.Container {
    private config: IPixiBetPanelConfig;
    private eventManager: EventManager;
    private gameFlowController: GameFlowController;

    private backgroundSprite: PIXI.Sprite | PIXI.NineSlicePlane | null = null;
    private currentBetText: PIXI.Text | null = null;
    private increaseBetButton: PixiButton | null = null;
    private decreaseBetButton: PixiButton | null = null;
    private closeButton: PixiButton | null = null;
    private betLevelsContainer: PIXI.Container | null = null; // To hold bet level buttons
    private betLevelButtons: PixiButton[] = [];
    private maxBetButton: PixiButton | null = null;
    private titleText: PIXI.Text | null = null; // Added

    // Store bound listeners
    private _boundUpdateBetDisplay: () => void;
    private _boundHidePanel: () => void;
    private _onIncreaseBetClick: () => void;
    private _onDecreaseBetClick: () => void;
    private _onMaxBetClick: () => void;
    private _betLevelButtonClickHandlers: ((payload: any) => void)[] = [];

    constructor(config: IPixiBetPanelConfig) {
        super();
        this.config = config;
        this.name = config.name;
        this.eventManager = EventManager.getInstance();
        this.gameFlowController = GameFlowController.getInstance();

        this._boundUpdateBetDisplay = this.updatePanelState.bind(this);
        this._boundHidePanel = this.hidePanel.bind(this);
        this._onIncreaseBetClick = () => { if (!this.increaseBetButton?.isDisabled) this.gameFlowController.increaseBet(); };
        this._onDecreaseBetClick = () => { if (!this.decreaseBetButton?.isDisabled) this.gameFlowController.decreaseBet(); };
        this._onMaxBetClick = () => {
            if (!this.maxBetButton?.isDisabled) {
                const availableBets = this.gameFlowController.getAvailableBets();
                if (availableBets.length > 0) {
                    this.gameFlowController.setBetByAmount(availableBets[availableBets.length - 1]);
                }
            }
        };

        this.initBackground();
        this.initTitle(); // Added
        this.initBetDisplay();
        this.initButtons();
        
        this.updateLayout(Globals.screenHeight > Globals.screenWidth);
        this.updatePanelState();
        this.initEventHandlers();
        
        this.visible = config.visibleOnInit ?? false;
        this.alpha = this.visible ? 1 : 0;
        console.log(`PixiBetPanel [${this.config.name}] Initialized`);
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
            } else {
                console.warn(`PixiBetPanel [${this.config.name}]: Background texture '${this.config.backgroundTextureKey}' is not valid.`);
                this.createPlaceholderBackground();
            }
            if (this.backgroundSprite) this.addChildAt(this.backgroundSprite, 0);
        } else {
            this.createPlaceholderBackground();
        }
    }

    private createPlaceholderBackground(): void {
        console.warn(`PixiBetPanel [${this.config.name}]: Creating placeholder background.`);
            const gfx = new PIXI.Graphics();
            gfx.beginFill(0x222222, 0.8);
        gfx.drawRect(0,0, this.config.layout.portrait.panelWidth || 300 , this.config.layout.portrait.panelHeight || 400); // Example size from portrait config
            gfx.endFill();
            this.backgroundSprite = new PIXI.Sprite(Globals.app?.renderer.generateTexture(gfx));
            this.addChildAt(this.backgroundSprite, 0);
    }

    private initTitle(): void {
        if (this.config.titleText) {
            const style = { ...DEFAULT_BET_PANEL_TITLE_STYLE, ...this.config.textStyles?.titleStyle };
            this.titleText = new PIXI.Text(this.config.titleText, style);
            this.titleText.anchor.set(0.5);
            this.addChild(this.titleText);
        }
    }

    private initBetDisplay(): void {
        const styleOptions = { ...DEFAULT_BET_TEXT_STYLE, ...this.config.textStyles?.currentBetStyle };
        const initialBetText = `${this.config.currencySymbol || ''}${this.gameFlowController.getCurrentBet()}`;
        this.currentBetText = new PIXI.Text(initialBetText, styleOptions);
        this.currentBetText.anchor.set(0.5); // Default anchor, can be overridden by layout
        this.addChild(this.currentBetText);
    }

    private initButtons(): void {
        // Increase/Decrease Bet Buttons
        if (this.config.buttonConfigs.increaseBet) { // Ensure config exists
            this.increaseBetButton = new PixiButton(this.config.buttonConfigs.increaseBet);
            this.addChild(this.increaseBetButton);
        }
        if (this.config.buttonConfigs.decreaseBet) { // Ensure config exists
            this.decreaseBetButton = new PixiButton(this.config.buttonConfigs.decreaseBet);
            this.addChild(this.decreaseBetButton);
        }

        // Close Button
        if (this.config.buttonConfigs.closeButton) {
            this.closeButton = new PixiButton(this.config.buttonConfigs.closeButton);
            this.addChild(this.closeButton);
        }

        // Bet Level Selection Buttons (List)
        if (this.config.buttonConfigs.betLevelButtonTemplate) {
            this.betLevelsContainer = new PIXI.Container();
            this.addChild(this.betLevelsContainer);
            const availableBets = this.gameFlowController.getAvailableBets();
            
            const container = this.betLevelsContainer; // Assign to a new const for type narrowing
            if (container) { 
                availableBets.forEach((betAmount, index) => {
                    const template = this.config.buttonConfigs.betLevelButtonTemplate!;
                    const buttonConfig: IPixiButtonConfig = {
                        textureAtlasKey: template.textureAtlasKey || 'ui_atlas', 
                        upFrame: template.upFrame || 'button_up',           
                        ...template, 
                        nameKey: `bet_level_${betAmount}`,
                        textConfig: {
                            ...(template.textConfig || {}),
                            text: formatCurrency(betAmount, this.config.currencySymbol, 0), 
                            style: { ...(template.textConfig?.style || {}), ...(this.config.textStyles?.betLevelButtonStyle || {}) }
                        },
                        clickPayload: betAmount 
                    };
                    const button = new PixiButton(buttonConfig);
                    this.betLevelButtons.push(button);
                    container.addChild(button); // Use the narrowed const container
                });
            }
        }

        // Max Bet Button
        if (this.config.buttonConfigs.maxBetButton) {
            this.maxBetButton = new PixiButton(this.config.buttonConfigs.maxBetButton);
            this.addChild(this.maxBetButton);
        }
    }
    
    private initEventHandlers(): void {
        this.eventManager.on(GameEvent.BET_AMOUNT_CHANGED, this._boundUpdateBetDisplay);

        if (this.increaseBetButton) {
            const eventName = this.increaseBetButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.increaseBetButton.getNameKey()}`;
            this.eventManager.on(eventName as any, this._onIncreaseBetClick);
        }

        if (this.decreaseBetButton) {
            const eventName = this.decreaseBetButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.decreaseBetButton.getNameKey()}`;
            this.eventManager.on(eventName as any, this._onDecreaseBetClick);
        }

        if (this.closeButton) {
            const eventName = this.closeButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.closeButton.getNameKey()}`;
            this.eventManager.on(eventName as any, this._boundHidePanel);
        }

        if (this.maxBetButton) {
            const eventName = this.maxBetButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.maxBetButton.getNameKey()}`;
            this.eventManager.on(eventName as any, this._onMaxBetClick);
        }

        this._betLevelButtonClickHandlers = [];
        this.betLevelButtons.forEach(button => {
            const betAmount = button.getClickPayload();
            const handler = () => {
                if (typeof betAmount === 'number') {
                    this.gameFlowController.setBetByAmount(betAmount);
                }
            };
            this._betLevelButtonClickHandlers.push(handler);
            const eventName = button.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${button.getNameKey()}`;
            this.eventManager.on(eventName as any, handler);
        });
    }

    public updatePanelState(): void {
        const currentBet = this.gameFlowController.getCurrentBet();
        if (this.currentBetText) {
            this.currentBetText.text = `${this.config.currencySymbol || ''}${formatCurrency(currentBet, this.config.currencySymbol, 0)}`;
        }
        if (this.increaseBetButton) {
            this.increaseBetButton.setEnabled(this.gameFlowController.canIncreaseBet());
        }
        if (this.decreaseBetButton) {
            this.decreaseBetButton.setEnabled(this.gameFlowController.canDecreaseBet());
        }
        this.betLevelButtons.forEach(button => {
            button.setSelected(button.getClickPayload() === currentBet);
        });
        if (this.maxBetButton) {
            const availableBets = this.gameFlowController.getAvailableBets();
            if (availableBets.length > 0) {
                this.maxBetButton.setEnabled(currentBet < availableBets[availableBets.length - 1]);
            } else {
                this.maxBetButton.setEnabled(false);
            }
        }
    }

    public showPanel(): void {
        if (this.visible && this.alpha === 1) return;
        this.updatePanelState(); // Ensure display is current before showing
        this.visible = true;
        
        const duration = this.config.showAnimation?.duration || 200;
        if (this.config.showAnimation?.type === 'fade' || !this.config.showAnimation) { // Default to fade
            this.alpha = 0;
            new TWEEN.Tween(this).to({ alpha: 1 }, duration).easing(TWEEN.Easing.Quadratic.Out).start();
        } else {
            // TODO: Implement other animation types like 'slide'
            this.alpha = 1; 
        }
        this.eventManager.emit(GameEvent.UI_SHOW as any, {name: this.name, component: this}); 
        console.log(`PixiBetPanel [${this.config.name}] shown.`);
    }

    public hidePanel(): void {
        if (!this.visible || this.alpha === 0) return;

        const duration = this.config.hideAnimation?.duration || 200;
        const onComplete = () => {
        this.visible = false;
            this.eventManager.emit(GameEvent.UI_HIDE as any, {name: this.name, component: this}); 
        console.log(`PixiBetPanel [${this.config.name}] hidden.`);
        };

        if (this.config.hideAnimation?.type === 'fade' || !this.config.hideAnimation) { // Default to fade
            new TWEEN.Tween(this).to({ alpha: 0 }, duration).easing(TWEEN.Easing.Quadratic.In).onComplete(onComplete).start();
        } else {
            // TODO: Implement other animation types like 'slide'
            this.alpha = 0; 
            onComplete();
        }
    }

    public updateLayout(isPortrait: boolean, panelWidth?: number, panelHeight?: number): void {
        const layoutConf = isPortrait ? this.config.layout.portrait : this.config.layout.landscape;
        
        // Define default padding and merge with config
        const defaultPaddingValues = { top: 20, bottom: 20, left: 20, right: 20, itemSpacing: 15, textVPadding: 10 };
        // Correctly merge: if layoutConf.padding exists, spread it, otherwise spread an empty object.
        const padding = { ...defaultPaddingValues, ...(layoutConf.padding ? layoutConf.padding : {}) };

        const pW = panelWidth ?? layoutConf.panelWidth ?? this.width; 
        const pH = panelHeight ?? layoutConf.panelHeight ?? this.height;
        if (this.backgroundSprite) {
            this.backgroundSprite.width = pW;
            this.backgroundSprite.height = pH;
        }

        let currentY = padding.top;

        // Title
        if (this.titleText) {
            this.titleText.x = pW / 2;
            this.titleText.y = currentY + this.titleText.height / 2;
            currentY += this.titleText.height + padding.itemSpacing;
        }

        // Current Bet Text
        if (this.currentBetText) {
            this.currentBetText.x = pW / 2;
            this.currentBetText.y = currentY + this.currentBetText.height / 2;
            currentY += this.currentBetText.height + padding.itemSpacing;
        }

        // Decrease / Increase Buttons (around Current Bet or below)
        const controlButtonY = currentY + (this.decreaseBetButton?.height ?? 50) / 2; 
        if (this.decreaseBetButton) {
            this.decreaseBetButton.x = pW * 0.25; 
            this.decreaseBetButton.y = controlButtonY;
        }
        if (this.increaseBetButton) {
            this.increaseBetButton.x = pW * 0.75; 
            this.increaseBetButton.y = controlButtonY;
        }
        currentY += (this.decreaseBetButton?.height ?? 50) + padding.itemSpacing; 

        // Bet Levels Container
        if (this.betLevelsContainer) {
            this.betLevelsContainer.x = padding.left;
            this.betLevelsContainer.y = currentY;
            
            let currentButtonX = 0; 
            let currentButtonYInContainer = 0; 
            // Use padding.itemSpacing for betLevelButtonSpacing if not defined in layoutConf
            const spacingX = layoutConf.betLevelButtonSpacing?.x || padding.itemSpacing;
            const spacingY = layoutConf.betLevelButtonSpacing?.y || padding.itemSpacing;
            const containerWidth = pW - padding.left - padding.right;
            let maxButtonHeightInRow = 0;

            this.betLevelButtons.forEach((button, index) => {
                if (button.width > containerWidth) { 
                    button.scale.set(containerWidth / button.width);
                }
                if (maxButtonHeightInRow === 0) maxButtonHeightInRow = button.height;

                if (currentButtonX + button.width > containerWidth && currentButtonX > 0) { 
                    currentButtonX = 0;
                    currentButtonYInContainer += maxButtonHeightInRow + spacingY;
                    maxButtonHeightInRow = button.height;
                }
                button.position.set(currentButtonX, currentButtonYInContainer);
                currentButtonX += button.width + spacingX;
                if (button.height > maxButtonHeightInRow) maxButtonHeightInRow = button.height;
            });
            currentY += this.betLevelsContainer.height + padding.itemSpacing;
        }
        
        // Max Bet Button 
        if (this.maxBetButton) {
            this.maxBetButton.x = pW / 2; 
            this.maxBetButton.y = currentY + this.maxBetButton.height / 2;
            this.maxBetButton.pivot.x = this.maxBetButton.width / 2;
            currentY += this.maxBetButton.height + padding.itemSpacing;
        }

        // Close Button (bottom)
        if (this.closeButton) {
            this.closeButton.x = pW / 2; 
            this.closeButton.y = pH - padding.bottom - this.closeButton.height / 2;
            this.closeButton.pivot.x = this.closeButton.width / 2; 
        }
        
        console.log(`PixiBetPanel [${this.config.name}] Updated layout. Portrait: ${isPortrait}`);
    }

    public destroy(options?: PIXI.IDestroyOptions | boolean): void {
        this.eventManager.off(GameEvent.BET_AMOUNT_CHANGED, this._boundUpdateBetDisplay);
        
        if (this.increaseBetButton) {
            const eventName = this.increaseBetButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.increaseBetButton.getNameKey()}`;
            this.eventManager.off(eventName as any, this._onIncreaseBetClick);
        }
        if (this.decreaseBetButton) {
            const eventName = this.decreaseBetButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.decreaseBetButton.getNameKey()}`;
            this.eventManager.off(eventName as any, this._onDecreaseBetClick);
        }
        if (this.closeButton) {
             const eventName = this.closeButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.closeButton.getNameKey()}`;
             this.eventManager.off(eventName as any, this._boundHidePanel);
        }
        if (this.maxBetButton) {
            const eventName = this.maxBetButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.maxBetButton.getNameKey()}`;
            this.eventManager.off(eventName as any, this._onMaxBetClick);
        }

        this.betLevelButtons.forEach((button, index) => {
            const eventName = button.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${button.getNameKey()}`;
            if (this._betLevelButtonClickHandlers[index]) {
                this.eventManager.off(eventName as any, this._betLevelButtonClickHandlers[index]);
            }
        });
        this._betLevelButtonClickHandlers = [];

        // Destroy children
        this.backgroundSprite?.destroy(options);
        this.currentBetText?.destroy(options);
        this.increaseBetButton?.destroy();
        this.decreaseBetButton?.destroy();
        this.closeButton?.destroy();
        this.maxBetButton?.destroy();
        this.betLevelsContainer?.destroy({ children: true, texture: false, baseTexture: false }); // Destroys betLevelButtons too
        this.betLevelButtons = []; // Clear array as buttons are destroyed with container

        console.log(`PixiBetPanel [${this.config.name}] destroyed.`); 
        super.destroy(options);
    }
} 