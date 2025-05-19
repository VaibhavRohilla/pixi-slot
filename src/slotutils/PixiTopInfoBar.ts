import * as PIXI from 'pixi.js';
import { EventManager, GameEvent } from '../core/utils/EventManager';
import { Globals } from '../core/Global';
import { PixiTextPopup, IPixiTextPopupOptions } from './PixiTextPopup';
import { PixiButton, IPixiButtonConfig } from './PixiButton';
import { formatCurrency } from '../core/utils/formatting'; // Assuming you have this utility

export interface IPixiTopInfoBarLayoutConfig {
    // Positions are relative to the TopInfoBar container itself
    balanceLabelPos?: { x: number, y: number };
    balanceAmountPos?: { x: number, y: number };
    betLabelPos?: { x: number, y: number };
    betAmountPos?: { x: number, y: number };
    winLabelPos?: { x: number, y: number };
    winAmountPos?: { x: number, y: number };
    clockTextPos?: { x: number, y: number };
    menuButtonPos?: { x: number, y: number };
    // Overall height/width for the bar, or it can be dynamic based on content
    height?: number;
    padding?: { top?: number, bottom?: number, left?: number, right?: number };
}

export interface IPixiTopInfoBarConfig {
    backgroundTextureKey?: string;
    layout: {
        portrait: IPixiTopInfoBarLayoutConfig;
        landscape: IPixiTopInfoBarLayoutConfig;
    };
    textStyles?: { // Common styles, can be overridden in specific popup options
        label?: Partial<IPixiTextPopupOptions>;
        amount?: Partial<IPixiTextPopupOptions>;
        clock?: Partial<IPixiTextPopupOptions>;
    };
    // Specific options if defaults + common styles aren't enough
    balanceLabelOptions?: Partial<IPixiTextPopupOptions>;
    balanceAmountOptions?: Partial<IPixiTextPopupOptions>;
    betLabelOptions?: Partial<IPixiTextPopupOptions>;
    betAmountOptions?: Partial<IPixiTextPopupOptions>;
    winLabelOptions?: Partial<IPixiTextPopupOptions>;
    winAmountOptions?: Partial<IPixiTextPopupOptions>;
    clockOptions?: Partial<IPixiTextPopupOptions>;
    menuButtonConfig?: IPixiButtonConfig;
    currencySymbol?: string;
    backgroundNineSlice?: { // Configuration for NineSlicePlane borders
        left: number;
        top: number;
        right: number;
        bottom: number;
    }
}

export class PixiTopInfoBar extends PIXI.Container {
    private config: IPixiTopInfoBarConfig;
    private eventManager: EventManager;

    private backgroundSprite: PIXI.Sprite | PIXI.NineSlicePlane | null = null;
    
    private balanceLabelText: PixiTextPopup | null = null;
    private balanceAmountText: PixiTextPopup | null = null;
    private betLabelText: PixiTextPopup | null = null;
    private betAmountText: PixiTextPopup | null = null;
    private winLabelText: PixiTextPopup | null = null;
    private winAmountText: PixiTextPopup | null = null;
    private clockText: PixiTextPopup | null = null;
    private menuButton: PixiButton | null = null;

    private currencySymbol: string;
    private clockIntervalId: number | null = null; // For NodeJS.Timeout, use number. For browser, it's also number.

    // Store bound listeners
    private _boundUpdateBalance: (balance: number) => void;
    private _boundUpdateBet: (bet: number) => void;
    private _boundUpdateWin: (win: number) => void;

    constructor(config: IPixiTopInfoBarConfig) {
        super();
        this.config = config;
        this.eventManager = EventManager.getInstance();
        this.currencySymbol = config.currencySymbol || '';

        // Initialize bound listeners
        this._boundUpdateBalance = this.updateBalance.bind(this);
        this._boundUpdateBet = this.updateBet.bind(this);
        this._boundUpdateWin = this.updateWin.bind(this);

        this.initBackground();
        this.initTextPopups();
        this.initButtons();
        this.initClock(); // Initialize and start the clock
        
        this.updateLayout(Globals.screenHeight > Globals.screenWidth, Globals.screenWidth, Globals.screenHeight);
        this.initEventHandlers();
        console.log('PixiTopInfoBar Initialized');
    }

    private initBackground(): void {
        if (this.config.backgroundTextureKey && Globals.resources[this.config.backgroundTextureKey]) {
            const texture = Globals.resources[this.config.backgroundTextureKey] as PIXI.Texture;
            if (this.config.backgroundNineSlice && texture) {
                // Use NineSlicePlane if configured
                const ns = this.config.backgroundNineSlice;
                this.backgroundSprite = new PIXI.NineSlicePlane(
                    texture,
                    ns.left ?? 10, // Default border size if not specified
                    ns.top ?? 10,
                    ns.right ?? 10,
                    ns.bottom ?? 10
                );
                console.log('PixiTopInfoBar: Using NineSlicePlane background.');
            } else if (texture) {
                 // Fallback to regular Sprite if NineSlicePlane not configured
                 console.log('PixiTopInfoBar: Using Sprite background.');
                this.backgroundSprite = new PIXI.Sprite(texture);
            } else {
                 console.warn('PixiTopInfoBar: Background texture invalid.');
                 return;
            }
            this.addChildAt(this.backgroundSprite, 0); // Add background first
        }
    }

    private initTextPopups(): void {
        const commonLabelStyle = this.config.textStyles?.label || {};
        const commonAmountStyle = this.config.textStyles?.amount || {};
        const commonClockStyle = this.config.textStyles?.clock || {};

        this.balanceLabelText = new PixiTextPopup({ initialText: 'BALANCE', ...commonLabelStyle, ...this.config.balanceLabelOptions });
        this.balanceAmountText = new PixiTextPopup({ initialText: formatCurrency(0, this.currencySymbol), ...commonAmountStyle, ...this.config.balanceAmountOptions });
        
        this.betLabelText = new PixiTextPopup({ initialText: 'BET', ...commonLabelStyle, ...this.config.betLabelOptions });
        this.betAmountText = new PixiTextPopup({ initialText: formatCurrency(0, this.currencySymbol), ...commonAmountStyle, ...this.config.betAmountOptions });

        this.winLabelText = new PixiTextPopup({ initialText: 'WIN', ...commonLabelStyle, ...this.config.winLabelOptions });
        this.winAmountText = new PixiTextPopup({ initialText: formatCurrency(0, this.currencySymbol), ...commonAmountStyle, ...this.config.winAmountOptions });

        this.clockText = new PixiTextPopup({ initialText: '00:00', ...commonClockStyle, ...this.config.clockOptions });
        // After creating, add them to this container
        if (this.balanceLabelText) this.addChild(this.balanceLabelText);
        if (this.balanceAmountText) this.addChild(this.balanceAmountText);
        if (this.betLabelText) this.addChild(this.betLabelText);
        if (this.betAmountText) this.addChild(this.betAmountText);
        if (this.winLabelText) this.addChild(this.winLabelText);
        if (this.winAmountText) this.addChild(this.winAmountText);
        if (this.clockText) this.addChild(this.clockText);
    }

    private initButtons(): void {
        if (this.config.menuButtonConfig) {
            this.menuButton = new PixiButton(this.config.menuButtonConfig);
            this.addChild(this.menuButton);
        }
    }
    
    private initEventHandlers(): void {
        // Listen for game data updates
        this.eventManager.on(GameEvent.PLAYER_BALANCE_UPDATED as any, this._boundUpdateBalance);
        this.eventManager.on(GameEvent.BET_AMOUNT_CHANGED as any, this._boundUpdateBet);
        this.eventManager.on(GameEvent.WIN_AMOUNT_UPDATED as any, this._boundUpdateWin);
        // Clock is updated via interval, not event, unless a specific TIME_SYNC event is needed
    }

    private initClock(): void {
        this.updateClockDisplay(); // Initial display
        if (this.clockIntervalId) clearInterval(this.clockIntervalId);
        this.clockIntervalId = setInterval(() => this.updateClockDisplay(), 1000) as any;
    }

    private updateClockDisplay(): void {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        this.updateClock(`${hours}:${minutes}`);
    }

    public updateBalance(balance: number): void {
        this.balanceAmountText?.setValue(balance, true);
    }
    public updateBet(bet: number): void {
        this.betAmountText?.setValue(bet, false);
    }
    public updateWin(win: number): void {
        this.winAmountText?.setValue(win, true);
    }
    public updateClock(timeString: string): void {
        this.clockText?.setText(timeString);
    }

    public updateLayout(isPortrait: boolean, screenWidth: number, screenHeight: number): void {
        const layoutConf = isPortrait ? this.config.layout.portrait : this.config.layout.landscape;
        const barHeight = layoutConf.height || (this.backgroundSprite ? this.backgroundSprite.height : 60);
        const padding = layoutConf.padding || { top: 5, bottom: 5, left: 10, right: 10 }; 
        
        if (this.backgroundSprite) {
            this.backgroundSprite.width = screenWidth; 
            this.backgroundSprite.height = barHeight;
            this.backgroundSprite.x = 0;
            this.backgroundSprite.y = 0;
        }

        const internalPaddingLeft = padding.left ?? 10;
        const internalPaddingRight = padding.right ?? 10;
        const verticalCenter = barHeight / 2;

        if (this.clockText) {
            this.clockText.setAnchor(0.5, 0.5); // Uses new signature
            this.clockText.x = screenWidth / 2;
            this.clockText.y = verticalCenter; 
        }

        if (this.balanceLabelText) {
            this.balanceLabelText.setAnchor(0, 0.5); // Uses new signature
            this.balanceLabelText.x = internalPaddingLeft;
            this.balanceLabelText.y = verticalCenter;
        }

        if (this.balanceAmountText && this.balanceLabelText) {
            this.balanceAmountText.setAnchor(0, 0.5); // Uses new signature
            const labelWidth = this.balanceLabelText.getTextWidth() > 0 ? this.balanceLabelText.getTextWidth() : 50;
            this.balanceAmountText.x = this.balanceLabelText.x + labelWidth + (internalPaddingLeft / 2); 
            this.balanceAmountText.y = verticalCenter;
        }

        if (this.menuButton) {
            this.menuButton.y = verticalCenter; 
            this.menuButton.pivot.set(this.menuButton.width, this.menuButton.height / 2);
            this.menuButton.x = screenWidth - internalPaddingRight;
        }
        
        console.log(`PixiTopInfoBar: Updated layout. Portrait: ${isPortrait}, Width: ${screenWidth}, Height: ${barHeight}`);
    }

    public destroy(options?: PIXI.IDestroyOptions | boolean): void {
        if (this.clockIntervalId) {
            clearInterval(this.clockIntervalId);
            this.clockIntervalId = null;
        }
        
        this.eventManager.off(GameEvent.PLAYER_BALANCE_UPDATED as any, this._boundUpdateBalance);
        this.eventManager.off(GameEvent.BET_AMOUNT_CHANGED as any, this._boundUpdateBet);
        this.eventManager.off(GameEvent.WIN_AMOUNT_UPDATED as any, this._boundUpdateWin);
        super.destroy(options);
    }
} 