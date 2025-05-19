import * as PIXI from 'pixi.js';
import * as TWEEN from '@tweenjs/tween.js';
import { EventManager, GameEvent, IAutospinStartData, IAutospinStopConditions } from '../core/utils/EventManager';
import { Globals } from '../core/Global';
import { PixiButton, IPixiButtonConfig, IPixiButtonTextConfig } from './PixiButton';
import { GameFlowController } from '../controller/gameFlowController';
import { 
    autospinCounts as defaultConfigAutospinCounts,
    autospinSingleWinLimitOptions as defaultConfigWinExceedsOptions,
    autospinBalanceIncreaseLimitOptions as defaultConfigBalanceIncreaseOptions,
    autospinLossLimitOptions as defaultConfigBalanceDecreaseOptions 
} from '../slotcore/gameConfig';

export interface IPixiAutospinPanelLayoutConfig {
    // Positions for title, spin count buttons, start button, close button
    titlePos?: { x: number, y: number };
    spinCountButtonStartPos?: { x: number, y: number };
    spinCountButtonSpacing?: { x: number, y: number };
    startButtonPos?: { x: number, y: number };
    closeButtonPos?: { x: number, y: number };
    stopOnAnyWinTogglePos?: { x: number, y: number };
    stopOnFreeSpinsTogglePos?: { x: number, y: number };
    // Numerical condition UI elements
    winExceedsLabelPos?: { x: number, y: number };
    winExceedsValuePos?: { x: number, y: number };
    winExceedsIncreaseButtonPos?: { x: number, y: number };
    winExceedsDecreaseButtonPos?: { x: number, y: number };
    balanceIncreaseLabelPos?: { x: number, y: number };
    balanceIncreaseValuePos?: { x: number, y: number };
    balanceIncreaseIncreaseButtonPos?: { x: number, y: number };
    balanceIncreaseDecreaseButtonPos?: { x: number, y: number };
    balanceDecreaseLabelPos?: { x: number, y: number };
    balanceDecreaseValuePos?: { x: number, y: number };
    balanceDecreaseIncreaseButtonPos?: { x: number, y: number };
    balanceDecreaseDecreaseButtonPos?: { x: number, y: number };
    panelHeight?: number;
    panelWidth?: number;
}

export interface IPixiAutospinPanelConfig {
    name: string;
    backgroundTextureKey?: string;
    nineSliceConfig?: { leftWidth: number, topHeight: number, rightWidth: number, bottomHeight: number };
    layout: {
        portrait: IPixiAutospinPanelLayoutConfig;
        landscape: IPixiAutospinPanelLayoutConfig;
    };
    availableSpinCounts: number[]; // e.g., [10, 25, 50, 100]
    buttonConfigs: {
        // Template provides all visual properties (frames, base style/offset for text if any).
        // nameKey, text (actual string), and clickPayload are set per instance.
        spinCountButtonTemplate: Omit<IPixiButtonConfig, 'nameKey' | 'clickPayload' | 'textConfig'> & {
            textConfig?: Pick<IPixiButtonTextConfig, 'style' | 'offset'>; 
        };
        startButton: IPixiButtonConfig;
        closeButton: IPixiButtonConfig;
        stopOnAnyWinToggle?: IPixiButtonConfig;
        stopOnFreeSpinsToggle?: IPixiButtonConfig;
        // Configs for numerical input +/- buttons
        increaseButtonTemplate?: Partial<IPixiButtonConfig>; // Template for '+'
        decreaseButtonTemplate?: Partial<IPixiButtonConfig>; // Template for '-'
    };
    textStyles?: {
        titleStyle?: Partial<PIXI.ITextStyle>;
        spinCountButtonStyle?: Partial<PIXI.ITextStyle>; 
        advancedOptionLabelStyle?: Partial<PIXI.ITextStyle>; 
        advancedOptionValueStyle?: Partial<PIXI.ITextStyle>; // For displaying numerical limit values
    };
    // Predefined steps for numerical conditions, these will be passed when UIManager creates this panel
    winExceedsOptions?: number[]; 
    balanceIncreaseOptions?: number[];
    balanceDecreaseOptions?: number[]; 
    defaultStopConditions?: Partial<IAutospinStopConditions>; 
    visibleOnInit?: boolean;
    showAnimation?: { type: 'fade' | 'slide', duration?: number }; 
    hideAnimation?: { type: 'fade' | 'slide', duration?: number };
}

const DEFAULT_ADV_LABEL_STYLE: Partial<PIXI.ITextStyle> = { fontFamily: 'Arial', fontSize: 24, fill: '#ffffff', align: 'left' };
const DEFAULT_ADV_VALUE_STYLE: Partial<PIXI.ITextStyle> = { fontFamily: 'Arial', fontSize: 24, fill: '#ffff00', align: 'center' };
const DEFAULT_TITLE_STYLE: Partial<PIXI.ITextStyle> = { fontFamily: 'Arial', fontSize: 40, fill: '#ffffff' };

export class PixiAutospinPanel extends PIXI.Container {
    private config: IPixiAutospinPanelConfig;
    private eventManager: EventManager;
    private gameFlowController: GameFlowController;

    private backgroundSprite: PIXI.Sprite | PIXI.NineSlicePlane | null = null;
    private titleText: PIXI.Text | null = null;
    private spinCountButtons: PixiButton[] = [];
    private startButton: PixiButton | null = null;
    private closeButton: PixiButton | null = null;
    private stopOnAnyWinToggle: PixiButton | null = null;
    private stopOnFreeSpinsToggle: PixiButton | null = null;
    
    // UI for numerical stop conditions
    private winExceedsLabel: PIXI.Text | null = null;
    private winExceedsValueText: PIXI.Text | null = null;
    private winExceedsIncreaseButton: PixiButton | null = null;
    private winExceedsDecreaseButton: PixiButton | null = null;

    private balanceIncreaseLabel: PIXI.Text | null = null;
    private balanceIncreaseValueText: PIXI.Text | null = null;
    private balanceIncreaseIncreaseButton: PixiButton | null = null;
    private balanceIncreaseDecreaseButton: PixiButton | null = null;

    private balanceDecreaseLabel: PIXI.Text | null = null;
    private balanceDecreaseValueText: PIXI.Text | null = null;
    private balanceDecreaseIncreaseButton: PixiButton | null = null;
    private balanceDecreaseDecreaseButton: PixiButton | null = null;

    private selectedSpinCount: number;
    private currentStopConditions: IAutospinStopConditions; // For advanced settings

    // Store bound listeners
    private _boundHidePanel: () => void;
    private _onStartAutospinClick: () => void;
    private _onSpinCountButtonClickHandlers: ((payload: any) => void)[] = [];
    // Store handlers for advanced condition UI interaction
    private _onStopOnAnyWinToggle: () => void;
    private _onStopOnFreeSpinsToggle: () => void;
    private _onWinExceedsIncrease: () => void;
    private _onWinExceedsDecrease: () => void;
    private _onBalanceIncreaseIncrease: () => void;
    private _onBalanceIncreaseDecrease: () => void;
    private _onBalanceDecreaseIncrease: () => void;
    private _onBalanceDecreaseDecrease: () => void;

    constructor(config: IPixiAutospinPanelConfig) {
        super();
        this.config = config;
        this.name = config.name;
        this.eventManager = EventManager.getInstance();
        this.gameFlowController = GameFlowController.getInstance();

        this.selectedSpinCount = (config.availableSpinCounts && config.availableSpinCounts.length > 0) ? config.availableSpinCounts[0] : (defaultConfigAutospinCounts[0] || 10);
        this.currentStopConditions = { 
            stopOnFreeSpins: true, 
            stopOnAnyWin: false,
            stopIfWinExceeds: 0, 
            stopIfBalanceIncreasesBy: 0,
            stopIfBalanceDecreasesBy: 0,
            ...(config.defaultStopConditions || {}) 
        };
        // Initialize with first valid option if available from config, or 0 (OFF)
        this.currentStopConditions.stopIfWinExceeds = config.winExceedsOptions?.[0] ?? 0;
        this.currentStopConditions.stopIfBalanceIncreasesBy = config.balanceIncreaseOptions?.[0] ?? 0;
        this.currentStopConditions.stopIfBalanceDecreasesBy = config.balanceDecreaseOptions?.[0] ?? 0;

        this._boundHidePanel = this.hidePanel.bind(this);
        this._onStartAutospinClick = this.handleStartAutospin.bind(this);
        this._onStopOnAnyWinToggle = () => {
            if (this.stopOnAnyWinToggle) {
                this.currentStopConditions.stopOnAnyWin = this.stopOnAnyWinToggle.isSelected;
                console.log('Autospin stopOnAnyWin set to:', this.currentStopConditions.stopOnAnyWin);
                this.updateButtonStates(); 
            }
        };
        this._onStopOnFreeSpinsToggle = () => {
            if (this.stopOnFreeSpinsToggle) {
                this.currentStopConditions.stopOnFreeSpins = this.stopOnFreeSpinsToggle.isSelected;
                console.log('Autospin stopOnFreeSpins set to:', this.currentStopConditions.stopOnFreeSpins);
                this.updateButtonStates();
            }
        };
        this._onWinExceedsIncrease = () => this.adjustNumericCondition('stopIfWinExceeds', true);
        this._onWinExceedsDecrease = () => this.adjustNumericCondition('stopIfWinExceeds', false);
        this._onBalanceIncreaseIncrease = () => this.adjustNumericCondition('stopIfBalanceIncreasesBy', true);
        this._onBalanceIncreaseDecrease = () => this.adjustNumericCondition('stopIfBalanceIncreasesBy', false);
        this._onBalanceDecreaseIncrease = () => this.adjustNumericCondition('stopIfBalanceDecreasesBy', true);
        this._onBalanceDecreaseDecrease = () => this.adjustNumericCondition('stopIfBalanceDecreasesBy', false);

        this.initBackground();
        this.initTitle();
        this.initSpinCountButtons();
        this.initMainButtons(); // Includes boolean toggles now
        // Call new method to init numerical condition UI elements
        this.initAdvancedNumericalConditionsUI(); 
        
        this.updateLayout(Globals.screenHeight > Globals.screenWidth);
        this.updateButtonStates(); 
        this.initEventHandlers();
        
        this.visible = config.visibleOnInit ?? false;
        this.alpha = this.visible ? 1 : 0;
        console.log(`PixiAutospinPanel [${this.config.name}] Initialized`);
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
                this.createPlaceholderBackground(); 
            }
            if (this.backgroundSprite) this.addChildAt(this.backgroundSprite, 0);
        } else {
            this.createPlaceholderBackground();
        }
    }

    private createPlaceholderBackground(): void {
        console.warn(`PixiAutospinPanel [${this.config.name}]: Creating placeholder background.`);
        const gfx = new PIXI.Graphics();
        const panelWidth = this.config.layout.portrait.panelWidth || this.config.layout.landscape.panelWidth || 400;
        const panelHeight = this.config.layout.portrait.panelHeight || this.config.layout.landscape.panelHeight || 500;
        gfx.beginFill(0x101010, 0.9);
        gfx.drawRect(0,0, panelWidth, panelHeight);
        gfx.endFill();
        this.backgroundSprite = new PIXI.Sprite(Globals.app?.renderer.generateTexture(gfx));
        this.addChildAt(this.backgroundSprite, 0);
    }

    private initTitle(): void {
        if (this.config.textStyles?.titleStyle || DEFAULT_TITLE_STYLE) {
            const style = { ...DEFAULT_TITLE_STYLE, ...this.config.textStyles?.titleStyle };
            this.titleText = new PIXI.Text('AUTOSPIN', style);
            this.titleText.anchor.set(0.5);
            this.addChild(this.titleText);
        }
    }

    private initSpinCountButtons(): void {
        this.config.availableSpinCounts.forEach((count, index) => {
            const template = this.config.buttonConfigs.spinCountButtonTemplate;
            const buttonConfig: IPixiButtonConfig = {
                ...template, // Spread all visual frame properties etc. from template
                nameKey: `autospin_count_${count}`,
                textConfig: {
                    // Combine styles: template specific style, then panel-wide button style for spin counts
                    style: { ...(template.textConfig?.style || {}), ...(this.config.textStyles?.spinCountButtonStyle || {}) },
                    offset: template.textConfig?.offset, // Use offset from template if defined
                    text: count.toString() // Set the specific count as text
                },
                clickPayload: count 
            };
            const button = new PixiButton(buttonConfig);
            // Listener for these will be set in initEventHandlers to call handleSpinCountSelected
            this.spinCountButtons.push(button);
            this.addChild(button);
        });
    }

    private initMainButtons(): void {
        this.startButton = new PixiButton(this.config.buttonConfigs.startButton);
        this.addChild(this.startButton);

        this.closeButton = new PixiButton(this.config.buttonConfigs.closeButton);
        this.addChild(this.closeButton);

        if (this.config.buttonConfigs.stopOnAnyWinToggle) {
            this.stopOnAnyWinToggle = new PixiButton({
                isToggle: true, // Ensure it behaves as a toggle
                initialSelected: this.currentStopConditions.stopOnAnyWin ?? false,
                ...this.config.buttonConfigs.stopOnAnyWinToggle
            });
            this.addChild(this.stopOnAnyWinToggle);
        }
        if (this.config.buttonConfigs.stopOnFreeSpinsToggle) {
            this.stopOnFreeSpinsToggle = new PixiButton({
                isToggle: true, // Ensure it behaves as a toggle
                initialSelected: this.currentStopConditions.stopOnFreeSpins ?? true,
                ...this.config.buttonConfigs.stopOnFreeSpinsToggle
            });
            this.addChild(this.stopOnFreeSpinsToggle);
        }
    }
    
    private initEventHandlers(): void {
        if (this.startButton) {
            const startEventName = this.startButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.startButton.getNameKey()}`;
            this.eventManager.on(startEventName as any, this._onStartAutospinClick);
        }
        if (this.closeButton) {
            const closeEventName = this.closeButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.closeButton.getNameKey()}`;
            this.eventManager.on(closeEventName as any, this._boundHidePanel);
        }

        this._onSpinCountButtonClickHandlers = []; 
        this.spinCountButtons.forEach(button => {
            const eventName = button.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${button.getNameKey()}`;
            const handler = (payload: any) => { 
                if (typeof payload === 'number') {
                    this.handleSpinCountSelected(payload);
                }
            };
            this._onSpinCountButtonClickHandlers.push(handler);
            this.eventManager.on(eventName as any, handler);
        });

        if (this.stopOnAnyWinToggle) {
            const eventName = this.stopOnAnyWinToggle.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.stopOnAnyWinToggle.getNameKey()}`;
            this.eventManager.on(eventName as any, this._onStopOnAnyWinToggle);
        }
        if (this.stopOnFreeSpinsToggle) {
            const eventName = this.stopOnFreeSpinsToggle.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.stopOnFreeSpinsToggle.getNameKey()}`;
            this.eventManager.on(eventName as any, this._onStopOnFreeSpinsToggle);
        }

        // Numerical conditions +/- button listeners
        if(this.winExceedsIncreaseButton) this.eventManager.on(this.winExceedsIncreaseButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.winExceedsIncreaseButton.getNameKey()}` as any, this._onWinExceedsIncrease);
        if(this.winExceedsDecreaseButton) this.eventManager.on(this.winExceedsDecreaseButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.winExceedsDecreaseButton.getNameKey()}` as any, this._onWinExceedsDecrease);
        if(this.balanceIncreaseIncreaseButton) this.eventManager.on(this.balanceIncreaseIncreaseButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.balanceIncreaseIncreaseButton.getNameKey()}` as any, this._onBalanceIncreaseIncrease);
        if(this.balanceIncreaseDecreaseButton) this.eventManager.on(this.balanceIncreaseDecreaseButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.balanceIncreaseDecreaseButton.getNameKey()}` as any, this._onBalanceIncreaseDecrease);
        if(this.balanceDecreaseIncreaseButton) this.eventManager.on(this.balanceDecreaseIncreaseButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.balanceDecreaseIncreaseButton.getNameKey()}` as any, this._onBalanceDecreaseIncrease);
        if(this.balanceDecreaseDecreaseButton) this.eventManager.on(this.balanceDecreaseDecreaseButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.balanceDecreaseDecreaseButton.getNameKey()}` as any, this._onBalanceDecreaseDecrease);

        // Add listeners for clicking the value texts to cycle them
        if (this.winExceedsValueText) {
            this.winExceedsValueText.on('pointerdown', () => this.adjustNumericCondition('stopIfWinExceeds', true, true)); // true for increase, true for cycle
        }
        if (this.balanceIncreaseValueText) {
            this.balanceIncreaseValueText.on('pointerdown', () => this.adjustNumericCondition('stopIfBalanceIncreasesBy', true, true));
        }
        if (this.balanceDecreaseValueText) {
            this.balanceDecreaseValueText.on('pointerdown', () => this.adjustNumericCondition('stopIfBalanceDecreasesBy', true, true));
        }
    }

    private handleSpinCountSelected(count: number): void {
        this.selectedSpinCount = count;
        console.log(`PixiAutospinPanel: Selected spin count: ${count}`);
        this.updateButtonStates();
    }

    private adjustNumericCondition(
        conditionKey: keyof Pick<IAutospinStopConditions, 'stopIfWinExceeds' | 'stopIfBalanceIncreasesBy' | 'stopIfBalanceDecreasesBy'>, 
        increase: boolean, 
        cycle: boolean = false // New parameter to indicate cycling behavior
    ): void {
        let options: number[] | undefined;
        switch (conditionKey) {
            case 'stopIfWinExceeds':         options = this.config.winExceedsOptions || defaultConfigWinExceedsOptions; break;
            case 'stopIfBalanceIncreasesBy': options = this.config.balanceIncreaseOptions || defaultConfigBalanceIncreaseOptions; break;
            case 'stopIfBalanceDecreasesBy': options = this.config.balanceDecreaseOptions || defaultConfigBalanceDecreaseOptions; break;
            default: options = [0, 50, 100, 500]; 
        }
        
        let currentValue = (this.currentStopConditions[conditionKey] as number | null | undefined) || 0;
        let currentIndex = options.indexOf(currentValue);
        if (currentIndex === -1 && currentValue !== 0) { 
            currentIndex = 0; 
        }

        if (increase) {
            if (currentIndex < options.length - 1) {
                currentIndex++;
            } else if (cycle) { // If at the end and cycling is enabled, wrap to beginning
                currentIndex = 0;
            }
        } else { // Decrease
            if (currentIndex > 0) {
                currentIndex--;
            } else if (cycle) { // If at the beginning and cycling (though usually decrease doesn't cycle this way)
                currentIndex = options.length - 1; // For a true cycle on decrease, but +/- are usually capped
            }
        }
        (this.currentStopConditions[conditionKey] as any) = options[currentIndex];
        console.log(`Autospin ${conditionKey} set to:`, this.currentStopConditions[conditionKey]);
        this.updateButtonStates();
    }

    private handleStartAutospin(): void {
        console.log(`PixiAutospinPanel: Start Autospin clicked. Count: ${this.selectedSpinCount}, Conditions:`, this.currentStopConditions);
        const startData: IAutospinStartData = {
            count: this.selectedSpinCount,
            stopConditions: { ...this.currentStopConditions }
        };
        this.eventManager.emit(GameEvent.AUTOSPIN_STARTED as any, startData);
        this.hidePanel(); 
    }

    public updateButtonStates(): void {
        this.spinCountButtons.forEach(button => {
            button.setSelected(button.getClickPayload() === this.selectedSpinCount);
        });
        this.startButton?.setEnabled(true); 

        if (this.stopOnAnyWinToggle) {
            this.stopOnAnyWinToggle.setSelected(this.currentStopConditions.stopOnAnyWin ?? false);
        }
        if (this.stopOnFreeSpinsToggle) {
            this.stopOnFreeSpinsToggle.setSelected(this.currentStopConditions.stopOnFreeSpins ?? true);
        }

        const updateNumericDisplay = (valueText: PIXI.Text | null, decreaseBtn: PixiButton | null, increaseBtn: PixiButton | null, currentValueKey: keyof IAutospinStopConditions, optionsArray?: number[]) => {
            if (!valueText) return;
            const currentValue = this.currentStopConditions[currentValueKey] as number | null | undefined;
            const options = optionsArray || [0, 50, 100, 200, 500, 1000]; 
            valueText.text = (currentValue === 0 || currentValue === null || currentValue === undefined) ? 'OFF' : currentValue.toString();
            
            const currentIndex = options.indexOf(currentValue || 0);
            decreaseBtn?.setEnabled(currentIndex > 0);
            increaseBtn?.setEnabled(currentIndex < options.length - 1);
        };

        updateNumericDisplay(this.winExceedsValueText, this.winExceedsDecreaseButton, this.winExceedsIncreaseButton, 'stopIfWinExceeds', this.config.winExceedsOptions || defaultConfigWinExceedsOptions);
        updateNumericDisplay(this.balanceIncreaseValueText, this.balanceIncreaseDecreaseButton, this.balanceIncreaseIncreaseButton, 'stopIfBalanceIncreasesBy', this.config.balanceIncreaseOptions || defaultConfigBalanceIncreaseOptions);
        updateNumericDisplay(this.balanceDecreaseValueText, this.balanceDecreaseDecreaseButton, this.balanceDecreaseIncreaseButton, 'stopIfBalanceDecreasesBy', this.config.balanceDecreaseOptions || defaultConfigBalanceDecreaseOptions);
    }

    public showPanel(): void { 
        if (this.visible && this.alpha === 1) return;
        this.updateButtonStates(); 
        this.visible = true; 
        
        const duration = this.config.showAnimation?.duration || 200;
        if (this.config.showAnimation?.type === 'fade' || !this.config.showAnimation) { 
            this.alpha = 0;
            new TWEEN.Tween(this).to({ alpha: 1 }, duration).easing(TWEEN.Easing.Quadratic.Out).start();
        } else {
            this.alpha = 1; 
        }
        this.eventManager.emit(GameEvent.UI_SHOW as any, {name: this.name, component: this}); 
        console.log(`PixiAutospinPanel [${this.config.name}] shown.`);
    }

    public hidePanel(): void { 
        if (!this.visible || this.alpha === 0) return;

        const duration = this.config.hideAnimation?.duration || 200;
        const onComplete = () => {
            this.visible = false;
            this.eventManager.emit(GameEvent.UI_HIDE as any, {name: this.name, component: this}); 
            console.log(`PixiAutospinPanel [${this.config.name}] hidden.`);
        };

        if (this.config.hideAnimation?.type === 'fade' || !this.config.hideAnimation) { 
            new TWEEN.Tween(this).to({ alpha: 0 }, duration).easing(TWEEN.Easing.Quadratic.In).onComplete(onComplete).start();
        } else {
            this.alpha = 0; 
            onComplete();
        }
    }
    
    public updateLayout(isPortrait: boolean, panelX?: number, panelY?: number): void {
        const layoutConf = isPortrait ? this.config.layout.portrait : this.config.layout.landscape;
        
        if (panelX !== undefined) this.x = panelX;
        if (panelY !== undefined) this.y = panelY;

        const panelW = layoutConf.panelWidth || this.width; 
        const panelH = layoutConf.panelHeight || this.height;

        if (this.backgroundSprite) {
            this.backgroundSprite.width = panelW;
            this.backgroundSprite.height = panelH;
        }

        if(this.titleText && layoutConf.titlePos) this.titleText.position.set(layoutConf.titlePos.x, layoutConf.titlePos.y);

        // Spin Count Buttons (example: vertical list)
        let currentButtonY = layoutConf.spinCountButtonStartPos?.y || (this.titleText?.y || 0) + (this.titleText?.height || 0) + 20;
        const spinCountButtonX = layoutConf.spinCountButtonStartPos?.x || panelW / 2;
        const spinCountSpacingY = layoutConf.spinCountButtonSpacing?.y || (this.spinCountButtons[0]?.height || 40) + 10;

        this.spinCountButtons.forEach(button => {
            button.position.set(spinCountButtonX, currentButtonY);
            currentButtonY += spinCountSpacingY;
        });

        // Boolean Toggles (Stop on Any Win, Stop on Free Spins)
        if(this.stopOnAnyWinToggle && layoutConf.stopOnAnyWinTogglePos) this.stopOnAnyWinToggle.position.set(layoutConf.stopOnAnyWinTogglePos.x, layoutConf.stopOnAnyWinTogglePos.y);
        if(this.stopOnFreeSpinsToggle && layoutConf.stopOnFreeSpinsTogglePos) this.stopOnFreeSpinsToggle.position.set(layoutConf.stopOnFreeSpinsTogglePos.x, layoutConf.stopOnFreeSpinsTogglePos.y);

        // Numerical Conditions (Example: each condition as a row: Label, Value, Dec, Inc)
        // This requires careful planning of actual coordinates in the config.
        const positionNumericRow = (label: PIXI.Text | null, valueText: PIXI.Text | null, decBtn: PixiButton | null, incBtn: PixiButton | null, 
                                   labelPos?: {x:number,y:number}, valPos?: {x:number,y:number}, decPos?: {x:number,y:number}, incPos?: {x:number,y:number}) => {
            if(label && labelPos) label.position.set(labelPos.x, labelPos.y);
            if(valueText && valPos) valueText.position.set(valPos.x, valPos.y);
            if(decBtn && decPos) decBtn.position.set(decPos.x, decPos.y);
            if(incBtn && incPos) incBtn.position.set(incPos.x, incPos.y);
        };

        positionNumericRow(this.winExceedsLabel, this.winExceedsValueText, this.winExceedsDecreaseButton, this.winExceedsIncreaseButton, 
                         layoutConf.winExceedsLabelPos, layoutConf.winExceedsValuePos, layoutConf.winExceedsDecreaseButtonPos, layoutConf.winExceedsIncreaseButtonPos);
        positionNumericRow(this.balanceIncreaseLabel, this.balanceIncreaseValueText, this.balanceIncreaseDecreaseButton, this.balanceIncreaseIncreaseButton, 
                         layoutConf.balanceIncreaseLabelPos, layoutConf.balanceIncreaseValuePos, layoutConf.balanceIncreaseDecreaseButtonPos, layoutConf.balanceIncreaseIncreaseButtonPos);
        positionNumericRow(this.balanceDecreaseLabel, this.balanceDecreaseValueText, this.balanceDecreaseDecreaseButton, this.balanceDecreaseIncreaseButton, 
                         layoutConf.balanceDecreaseLabelPos, layoutConf.balanceDecreaseValuePos, layoutConf.balanceDecreaseDecreaseButtonPos, layoutConf.balanceDecreaseIncreaseButtonPos);

        // Start and Close Buttons
        if(this.startButton && layoutConf.startButtonPos) this.startButton.position.set(layoutConf.startButtonPos.x, layoutConf.startButtonPos.y);
        if(this.closeButton && layoutConf.closeButtonPos) this.closeButton.position.set(layoutConf.closeButtonPos.x, layoutConf.closeButtonPos.y);
        
        console.log(`PixiAutospinPanel [${this.config.name}] Updated layout. Portrait: ${isPortrait}`);
    }
    
    public destroy(options?: PIXI.IDestroyOptions | boolean): void {
        if (this.startButton) {
            const eventName = this.startButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.startButton.getNameKey()}`;
            this.eventManager.off(eventName as any, this._onStartAutospinClick);
        }
        if (this.closeButton) {
            const eventName = this.closeButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.closeButton.getNameKey()}`;
            this.eventManager.off(eventName as any, this._boundHidePanel);
        }
        
        this.spinCountButtons.forEach((button, index) => {
            const eventName = button.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${button.getNameKey()}`;
            if (this._onSpinCountButtonClickHandlers[index]) {
                this.eventManager.off(eventName as any, this._onSpinCountButtonClickHandlers[index]);
            }
        });
        this._onSpinCountButtonClickHandlers = []; 

        if (this.stopOnAnyWinToggle) {
            const eventName = this.stopOnAnyWinToggle.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.stopOnAnyWinToggle.getNameKey()}`;
            this.eventManager.off(eventName as any, this._onStopOnAnyWinToggle);
        }
        if (this.stopOnFreeSpinsToggle) {
            const eventName = this.stopOnFreeSpinsToggle.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.stopOnFreeSpinsToggle.getNameKey()}`;
            this.eventManager.off(eventName as any, this._onStopOnFreeSpinsToggle);
        }

        if(this.winExceedsIncreaseButton) this.eventManager.off(this.winExceedsIncreaseButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.winExceedsIncreaseButton.getNameKey()}` as any, this._onWinExceedsIncrease);
        if(this.winExceedsDecreaseButton) this.eventManager.off(this.winExceedsDecreaseButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.winExceedsDecreaseButton.getNameKey()}` as any, this._onWinExceedsDecrease);
        if(this.balanceIncreaseIncreaseButton) this.eventManager.off(this.balanceIncreaseIncreaseButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.balanceIncreaseIncreaseButton.getNameKey()}` as any, this._onBalanceIncreaseIncrease);
        if(this.balanceIncreaseDecreaseButton) this.eventManager.off(this.balanceIncreaseDecreaseButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.balanceIncreaseDecreaseButton.getNameKey()}` as any, this._onBalanceIncreaseDecrease);
        if(this.balanceDecreaseIncreaseButton) this.eventManager.off(this.balanceDecreaseIncreaseButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.balanceDecreaseIncreaseButton.getNameKey()}` as any, this._onBalanceDecreaseIncrease);
        if(this.balanceDecreaseDecreaseButton) this.eventManager.off(this.balanceDecreaseDecreaseButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.balanceDecreaseDecreaseButton.getNameKey()}` as any, this._onBalanceDecreaseDecrease);

        // Remove listeners from value texts
        this.winExceedsValueText?.off('pointerdown');
        this.balanceIncreaseValueText?.off('pointerdown');
        this.balanceDecreaseValueText?.off('pointerdown');

        this.spinCountButtons.forEach(button => button.destroy());
        this.spinCountButtons = [];
        
        this.titleText?.destroy();
        this.startButton?.destroy();
        this.closeButton?.destroy();
        this.stopOnAnyWinToggle?.destroy();
        this.stopOnFreeSpinsToggle?.destroy();

        this.winExceedsLabel?.destroy();
        this.winExceedsValueText?.destroy();
        this.winExceedsIncreaseButton?.destroy();
        this.winExceedsDecreaseButton?.destroy();
        this.balanceIncreaseLabel?.destroy();
        this.balanceIncreaseValueText?.destroy();
        this.balanceIncreaseIncreaseButton?.destroy();
        this.balanceIncreaseDecreaseButton?.destroy();
        this.balanceDecreaseLabel?.destroy();
        this.balanceDecreaseValueText?.destroy();
        this.balanceDecreaseIncreaseButton?.destroy();
        this.balanceDecreaseDecreaseButton?.destroy();

        this.backgroundSprite?.destroy();
        
        console.log(`PixiAutospinPanel [${this.config.name}] destroyed.`); 
        super.destroy(options);
    }

    private initAdvancedNumericalConditionsUI(): void {
        const advLabelStyle = { ...DEFAULT_ADV_LABEL_STYLE, ...this.config.textStyles?.advancedOptionLabelStyle };
        const advValueStyle = { ...DEFAULT_ADV_VALUE_STYLE, ...this.config.textStyles?.advancedOptionValueStyle };
        const incButtonBaseConfig = this.config.buttonConfigs.increaseButtonTemplate || {}; 
        const decButtonBaseConfig = this.config.buttonConfigs.decreaseButtonTemplate || {};

        // --- Stop if win exceeds ---
        this.winExceedsLabel = new PIXI.Text('If win exceeds:', advLabelStyle);
        this.addChild(this.winExceedsLabel);
        this.winExceedsValueText = new PIXI.Text((this.currentStopConditions.stopIfWinExceeds || 'OFF').toString(), advValueStyle);
        this.winExceedsValueText.anchor.set(0.5);
        this.winExceedsValueText.interactive = true;
        this.winExceedsValueText.cursor = 'pointer';
        this.addChild(this.winExceedsValueText);
        this.winExceedsDecreaseButton = new PixiButton({ nameKey: 'decWinExceeds', textConfig: {text: '-'}, ...decButtonBaseConfig } as IPixiButtonConfig);
        this.addChild(this.winExceedsDecreaseButton);
        this.winExceedsIncreaseButton = new PixiButton({ nameKey: 'incWinExceeds', textConfig: {text: '+'}, ...incButtonBaseConfig } as IPixiButtonConfig);
        this.addChild(this.winExceedsIncreaseButton);

        // --- Stop if balance increases by ---
        this.balanceIncreaseLabel = new PIXI.Text('If balance increases by:', advLabelStyle);
        this.addChild(this.balanceIncreaseLabel);
        this.balanceIncreaseValueText = new PIXI.Text((this.currentStopConditions.stopIfBalanceIncreasesBy || 'OFF').toString(), advValueStyle);
        this.balanceIncreaseValueText.anchor.set(0.5);
        this.balanceIncreaseValueText.interactive = true;
        this.balanceIncreaseValueText.cursor = 'pointer';
        this.addChild(this.balanceIncreaseValueText);
        this.balanceIncreaseDecreaseButton = new PixiButton({ nameKey: 'decBalInc', textConfig: {text: '-'}, ...decButtonBaseConfig } as IPixiButtonConfig);
        this.addChild(this.balanceIncreaseDecreaseButton);
        this.balanceIncreaseIncreaseButton = new PixiButton({ nameKey: 'incBalInc', textConfig: {text: '+'}, ...incButtonBaseConfig } as IPixiButtonConfig);
        this.addChild(this.balanceIncreaseIncreaseButton);

        // --- Stop if balance decreases by ---
        this.balanceDecreaseLabel = new PIXI.Text('If balance decreases by:', advLabelStyle);
        this.addChild(this.balanceDecreaseLabel);
        this.balanceDecreaseValueText = new PIXI.Text((this.currentStopConditions.stopIfBalanceDecreasesBy || 'OFF').toString(), advValueStyle);
        this.balanceDecreaseValueText.anchor.set(0.5);
        this.balanceDecreaseValueText.interactive = true;
        this.balanceDecreaseValueText.cursor = 'pointer';
        this.addChild(this.balanceDecreaseValueText);
        this.balanceDecreaseDecreaseButton = new PixiButton({ nameKey: 'decBalDec', textConfig: {text: '-'}, ...decButtonBaseConfig } as IPixiButtonConfig);
        this.addChild(this.balanceDecreaseDecreaseButton);
        this.balanceDecreaseIncreaseButton = new PixiButton({ nameKey: 'incBalDec', textConfig: {text: '+'}, ...incButtonBaseConfig } as IPixiButtonConfig);
        this.addChild(this.balanceDecreaseIncreaseButton);
    }
}