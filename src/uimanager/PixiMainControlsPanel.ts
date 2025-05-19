import * as PIXI from 'pixi.js';
import { EventManager, GameEvent } from '../core/utils/EventManager';
import { Globals } from '../core/Global';
import { PixiButton, IPixiButtonConfig } from './PixiButton';
import { GameFlowController, SlotGameState } from '../controller/gameFlowController'; // To check game state
import { PixiTextPopup, IPixiTextPopupOptions } from './PixiTextPopup'; // Import PixiTextPopup
import { formatCurrency } from '../core/utils/formatting'; // Import formatting utility

export interface IPixiMainControlsPanelLayoutConfig {
    // Positions are relative to the MainControlsPanel container itself
    spinButtonPos?: { x: number, y: number };
    autospinButtonPos?: { x: number, y: number };
    betButtonPos?: { x: number, y: number };
    menuButtonPos?: { x: number, y: number };
    turboButtonPos?: { x: number, y: number };
    collectButtonPos?: { x: number, y: number };
    gambleButtonPos?: { x: number, y: number };
    // Stop buttons might share position with their counterparts
    panelHeight?: number;
    panelWidth?: number; // If panel has fixed width, otherwise might be dynamic
    padding?: { top?: number, bottom?: number, left?: number, right?: number, textVPadding?: number };
    betAmountTextPos?: { x: number, y: number }; // Added
    winAmountTextPos?: { x: number, y: number };  // Added
}

export interface IPixiMainControlsPanelConfig {
    name: string; // For debugging or specific identification
    backgroundTextureKey?: string;
    nineSliceConfig?: { leftWidth: number, topHeight: number, rightWidth: number, bottomHeight: number }; // For NineSlicePlane background
    layout: {
        portrait: IPixiMainControlsPanelLayoutConfig;
        landscape: IPixiMainControlsPanelLayoutConfig;
    };
    buttonConfigs: {
        spin: IPixiButtonConfig;
        stopSpin?: IPixiButtonConfig; // Optional, might reuse spin button visuals
        autospin: IPixiButtonConfig;
        stopAutospin?: IPixiButtonConfig;
        bet: IPixiButtonConfig;
        menu: IPixiButtonConfig;
        turbo?: IPixiButtonConfig;
        collect?: IPixiButtonConfig; // For collect after win/gamble
        gamble?: IPixiButtonConfig;  // To start gamble feature
    };
    textDisplayConfigs?: {
        betAmount?: Partial<IPixiTextPopupOptions>;
        winAmount?: Partial<IPixiTextPopupOptions>;
    };
    currencySymbol?: string; // Added
}

export class PixiMainControlsPanel extends PIXI.Container {
    private config: IPixiMainControlsPanelConfig;
    private eventManager: EventManager;
    private gameFlowController: GameFlowController;

    private backgroundSprite: PIXI.Sprite | PIXI.NineSlicePlane | null = null;
    
    private spinButton: PixiButton | null = null;
    private stopSpinButton: PixiButton | null = null; // May share instance with spinButton
    private autospinButton: PixiButton | null = null;
    private stopAutospinButton: PixiButton | null = null; // May share instance
    private betButton: PixiButton | null = null;
    private menuButton: PixiButton | null = null;
    private turboButton: PixiButton | null = null;
    private collectButton: PixiButton | null = null;
    private gambleButton: PixiButton | null = null;
    private betAmountText: PixiTextPopup | null = null;  // Added
    private winAmountText: PixiTextPopup | null = null;  // Added
    private currencySymbol: string = '';                // Added

    // Bound listeners for text updates
    private _boundUpdateBetAmountText: (amount: number) => void;
    private _boundUpdateWinAmountText: (amount: number) => void;

    constructor(config: IPixiMainControlsPanelConfig) {
        super();
        this.config = config;
        this.name = config.name; 
        this.eventManager = EventManager.getInstance();
        this.gameFlowController = GameFlowController.getInstance();
        this.currencySymbol = config.currencySymbol || ''; // Store currency symbol

        this._boundUpdateBetAmountText = this.updateBetAmountText.bind(this);
        this._boundUpdateWinAmountText = this.updateWinAmountText.bind(this);

        this.initBackground();
        this.initButtons();
        this.initTextDisplays(); // Call new method
        
        this.updateLayout(Globals.screenHeight > Globals.screenWidth, Globals.screenWidth, Globals.screenHeight);
        this.updateButtonStates(); // Initial state update
        this.initEventHandlers();
        console.log(`PixiMainControlsPanel [${this.config.name}] Initialized`);
    }

    private initBackground(): void {
        if (this.config.backgroundTextureKey && Globals.resources[this.config.backgroundTextureKey]) {
            const texture = Globals.resources[this.config.backgroundTextureKey] as PIXI.Texture;
            if (this.config.nineSliceConfig) {
                this.backgroundSprite = new PIXI.NineSlicePlane(
                    texture, 
                    this.config.nineSliceConfig.leftWidth,
                    this.config.nineSliceConfig.topHeight,
                    this.config.nineSliceConfig.rightWidth,
                    this.config.nineSliceConfig.bottomHeight
                );
            } else {
                this.backgroundSprite = new PIXI.Sprite(texture);
            }
            this.addChildAt(this.backgroundSprite, 0);
        }
    }

    private initButtons(): void {
        this.spinButton = new PixiButton(this.config.buttonConfigs.spin);
        this.addChild(this.spinButton);

        if (this.config.buttonConfigs.stopSpin) {
            this.stopSpinButton = new PixiButton(this.config.buttonConfigs.stopSpin);
            this.stopSpinButton.visible = false; // Initially hidden
            this.addChild(this.stopSpinButton);
        } else {
            // If no separate stopSpin config, spinButton might change its appearance/text
            // Or, stopSpinButton can be an alias to spinButton with different visual setup via methods.
        }

        this.autospinButton = new PixiButton(this.config.buttonConfigs.autospin);
        this.addChild(this.autospinButton);

        if (this.config.buttonConfigs.stopAutospin) {
            this.stopAutospinButton = new PixiButton(this.config.buttonConfigs.stopAutospin);
            this.stopAutospinButton.visible = false;
            this.addChild(this.stopAutospinButton);
        }

        this.betButton = new PixiButton(this.config.buttonConfigs.bet);
        this.addChild(this.betButton);

        this.menuButton = new PixiButton(this.config.buttonConfigs.menu);
        this.addChild(this.menuButton);

        if (this.config.buttonConfigs.turbo) {
            this.turboButton = new PixiButton(this.config.buttonConfigs.turbo);
            this.addChild(this.turboButton);
        }

        if (this.config.buttonConfigs.collect) {
            this.collectButton = new PixiButton(this.config.buttonConfigs.collect);
            this.collectButton.visible = false; // Initially hidden
            this.addChild(this.collectButton);
        }

        if (this.config.buttonConfigs.gamble) {
            this.gambleButton = new PixiButton(this.config.buttonConfigs.gamble);
            this.gambleButton.visible = false; // Initially hidden
            this.addChild(this.gambleButton);
        }
    }

    private initTextDisplays(): void {
        if (this.config.textDisplayConfigs?.betAmount) {
            this.betAmountText = new PixiTextPopup({
                initialText: formatCurrency(0, this.currencySymbol),
                ...(this.config.textDisplayConfigs.betAmount || {}),
            });
            this.addChild(this.betAmountText);
        }
        if (this.config.textDisplayConfigs?.winAmount) {
            this.winAmountText = new PixiTextPopup({
                initialText: formatCurrency(0, this.currencySymbol),
                ...(this.config.textDisplayConfigs.winAmount || {}),
            });
            this.addChild(this.winAmountText);
        }
    }

    private initEventHandlers(): void {
        this.eventManager.on(GameEvent.GAME_STATE_CHANGED as any, this.updateButtonStates.bind(this));
        this.eventManager.on(GameEvent.AUTOSPIN_STARTED as any, this.updateButtonStates.bind(this)); 
        this.eventManager.on(GameEvent.AUTOSPIN_ENDED as any, this.updateButtonStates.bind(this));

        // Listen for bet and win updates
        this.eventManager.on(GameEvent.BET_AMOUNT_CHANGED as any, this._boundUpdateBetAmountText);
        this.eventManager.on(GameEvent.WIN_AMOUNT_UPDATED as any, this._boundUpdateWinAmountText); 
        // Consider if WIN_AMOUNT_UPDATED is the final displayable win or if another event like ROUND_TOTAL_WIN is better.
        // For now, using WIN_AMOUNT_UPDATED which is emitted by GambleController and SlotScene.

        // --- Setup Button Click Actions to Emit GameEvents ---

        // Spin Button
        if (this.spinButton) {
            const eventName = this.spinButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.spinButton.getNameKey()}`;
            this.eventManager.on(eventName as any, () => {
                if (!this.spinButton!.isDisabled) {
                    this.eventManager.emit(GameEvent.REQUEST_SPIN as any);
                }
            });
        }

        // Autospin Button
        if (this.autospinButton) {
            const eventName = this.autospinButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.autospinButton.getNameKey()}`;
            this.eventManager.on(eventName as any, () => {
                if (!this.autospinButton!.isDisabled) {
                    this.eventManager.emit(GameEvent.REQUEST_AUTOSPIN_PANEL as any);
                }
            });
        }

        // Stop Autospin Button
        if (this.stopAutospinButton) {
            const eventName = this.stopAutospinButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.stopAutospinButton.getNameKey()}`;
            this.eventManager.on(eventName as any, () => {
                if (!this.stopAutospinButton!.isDisabled) {
                    this.eventManager.emit(GameEvent.REQUEST_STOP_AUTOSPIN as any);
                }
            });
        }

        // Bet Button
        if (this.betButton) {
            const eventName = this.betButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.betButton.getNameKey()}`;
            this.eventManager.on(eventName as any, () => {
                if (!this.betButton!.isDisabled) {
                    this.eventManager.emit(GameEvent.REQUEST_BET_PANEL as any);
                }
            });
        }

        // Menu Button
        if (this.menuButton) {
            const eventName = this.menuButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.menuButton.getNameKey()}`;
            this.eventManager.on(eventName as any, () => {
                if (!this.menuButton!.isDisabled) {
                    this.eventManager.emit(GameEvent.SHOW_MENU_COMMAND as any);
                }
            });
        }

        // Turbo Button
        if (this.turboButton) {
            const eventName = this.turboButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.turboButton.getNameKey()}`;
            this.eventManager.on(eventName as any, () => {
                if (!this.turboButton!.isDisabled) { 
                    this.eventManager.emit(GameEvent.SETTINGS_TOGGLE_TURBO as any, this.turboButton!.isSelected);
                }
            });
        }
        
        // Stop Spin Button
        if (this.stopSpinButton) {
            const eventName = this.stopSpinButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.stopSpinButton.getNameKey()}`;
            this.eventManager.on(eventName as any, () => {
                if (!this.stopSpinButton!.isDisabled) {
                    this.eventManager.emit(GameEvent.REQUEST_STOP_SPIN as any);
                }
            });
        }

        // Collect Button
        if (this.collectButton) {
            const eventName = this.collectButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.collectButton.getNameKey()}`;
            this.eventManager.on(eventName as any, () => {
                if (!this.collectButton!.isDisabled) {
                    this.eventManager.emit(GameEvent.REQUEST_COLLECT as any);
                }
            });
        }

        // Gamble Button
        if (this.gambleButton) {
            const eventName = this.gambleButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.gambleButton.getNameKey()}`;
            this.eventManager.on(eventName as any, () => {
                if (!this.gambleButton!.isDisabled) {
                    this.eventManager.emit(GameEvent.REQUEST_GAMBLE as any);
                }
            });
        }
    }

    public updateButtonStates(): void {
        const currentState = this.gameFlowController.getCurrentState();
        const isInFreeSpins = this.gameFlowController.getIsInFreeSpins();
        
        // Data fetched from GameFlowController (assuming these methods will be added there)
        const isAutospinning = this.gameFlowController.getIsAutospinning();
        const currentAutospinCount = this.gameFlowController.getCurrentAutospinCount();
        const isGambleAvailable = this.gameFlowController.getIsGambleAvailable();
        const isRecovery = this.gameFlowController.getIsRecovery();
        const turboOn = this.gameFlowController.getIsTurboOn();
        const isMenuActive = this.gameFlowController.getIsMenuActive();

        // Spin / Stop Spin Button Logic
        const showStopSpin = currentState === SlotGameState.REELS_SPINNING || currentState === SlotGameState.REELS_STOPPING;
        if (this.spinButton) this.spinButton.visible = !showStopSpin && !isGambleAvailable; // Hide spin if gamble is up
        if (this.stopSpinButton) {
            this.stopSpinButton.visible = showStopSpin;
        } else if (this.spinButton && showStopSpin) { 
            this.spinButton.visible = true; // Ensure it's visible
            this.spinButton.setText("STOP");
            this.spinButton.setClickAction(GameEvent.REQUEST_STOP_SPIN as any);
        } else if (this.spinButton) { // Revert to normal spin button
            this.spinButton.setText(this.config.buttonConfigs.spin.textConfig?.text || "SPIN");
            this.spinButton.setClickAction(this.config.buttonConfigs.spin.clickEventName as any /* or derived default */);
             // Need to re-construct the default event if not in config, or store initial action
             // For now, assuming REQUEST_SPIN is the default or handled by a listener on a generic nameKey event
             // This part needs careful handling of how original click action was defined.
             // A simple way: PixiButton could store its initial clickEventName & payload from config.
             // For this iteration, we will assume the PixiButton's internal listener for its original named event is still active if currentClickEventName is undefined.
             // Let's ensure `setClickAction()` with undefined reverts to its nameKey based event.
            const originalSpinClickEvent = this.config.buttonConfigs.spin.clickEventName || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.spinButton.getNameKey()}`;
            this.spinButton.setClickAction(originalSpinClickEvent, this.config.buttonConfigs.spin.clickPayload);
        }

        // Autospin / Stop Autospin Button Logic
        if (this.autospinButton) this.autospinButton.visible = !isAutospinning && !isInFreeSpins && !isGambleAvailable;
        if (this.stopAutospinButton) {
            this.stopAutospinButton.visible = isAutospinning;
            if (isAutospinning) {
                this.stopAutospinButton.setText(currentAutospinCount.toString());
            }
        } else if (this.autospinButton && isAutospinning) {
            this.autospinButton.visible = true; // Ensure it's visible
            this.autospinButton.setText(`STOP (${currentAutospinCount})`);
            this.autospinButton.setClickAction(GameEvent.REQUEST_STOP_AUTOSPIN as any);
        } else if (this.autospinButton) { // Revert to normal autospin button
            this.autospinButton.setText(this.config.buttonConfigs.autospin.textConfig?.text || "AUTO");
            const originalAutospinClickEvent = this.config.buttonConfigs.autospin.clickEventName || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.autospinButton.getNameKey()}`;
            this.autospinButton.setClickAction(originalAutospinClickEvent, this.config.buttonConfigs.autospin.clickPayload);
        }
        
        // Gamble and Collect Button Logic (from gambleButtonsState)
        if (isGambleAvailable) {
            this.collectButton?.revive(); // Show and enable collect
            if (isRecovery) { // In Phaser, gamble button shown if not in recovery and gamble available
                this.gambleButton?.revive(); // Show and enable gamble
            } else {
                this.gambleButton?.kill(); // Hide and disable gamble if in recovery (or other conditions)
            }
            // When gamble/collect is shown, typically spin/autospin are hidden
            if(this.spinButton) this.spinButton.visible = false;
            if(this.autospinButton) this.autospinButton.visible = false;
            if(this.stopAutospinButton) this.stopAutospinButton.visible = false; // Stop autospin also hidden

        } else {
            this.collectButton?.kill(); // Hide and disable
            this.gambleButton?.kill();  // Hide and disable
        }

        // General Interactivity based on game state
        const canInteractStandard = currentState === SlotGameState.IDLE || 
                                  currentState === SlotGameState.ROUND_COMPLETE || 
                                  currentState === SlotGameState.FREE_SPIN_IDLE;

        // Enable/disable based on overall interactability and specific conditions
        this.spinButton?.setEnabled(canInteractStandard && !isAutospinning && !isGambleAvailable);
        this.stopSpinButton?.setEnabled(showStopSpin); // Stop always enabled when visible

        this.autospinButton?.setEnabled(canInteractStandard && !isInFreeSpins && !isAutospinning && !isGambleAvailable);
        this.stopAutospinButton?.setEnabled(isAutospinning); // Stop autospin always enabled when visible

        this.betButton?.setEnabled(canInteractStandard && !isAutospinning && !isInFreeSpins && !isGambleAvailable);
        this.menuButton?.setEnabled(true); // Menu button is almost always enabled, actual panel opening might be blocked by game state
        
        // Turbo button state
        this.turboButton?.setSelected(turboOn);
        this.turboButton?.setEnabled(canInteractStandard && !isAutospinning && !isGambleAvailable);
        if (currentState === SlotGameState.REELS_SPINNING || currentState === SlotGameState.REELS_STOPPING) {
            this.turboButton?.setEnabled(false); // Disable turbo during spin cycle
        }
        
        // If menu is active, disable most main controls (logic from Phaser's showMenu/closeMenu)
        if (isMenuActive) {
            this.spinButton?.setEnabled(false);
            this.autospinButton?.setEnabled(false);
            this.stopAutospinButton?.setEnabled(false); // Also disable stop autospin if menu open
            this.betButton?.setEnabled(false);
            this.turboButton?.setEnabled(false);
            // Menu button itself would typically remain enabled to allow closing the menu, or be handled by the menu panel.
        }

        console.log(`PixiMainControlsPanel [${this.config.name}] updated states for: ${currentState}, Autospin: ${isAutospinning}, Gamble: ${isGambleAvailable}`);
    }

    public updateLayout(isPortrait: boolean, panelWidth: number, panelHeight: number): void {
        const layoutConf = isPortrait ? this.config.layout.portrait : this.config.layout.landscape;
        const padding = layoutConf.padding || { top: 10, bottom: 10, left: 10, right: 10, textVPadding: 10 }; // Added textVPadding

        if (this.backgroundSprite) {
            this.backgroundSprite.width = panelWidth;
            this.backgroundSprite.height = panelHeight;
        }

        // --- Dynamic Button Positioning (Landscape Focus) ---
        if (!isPortrait) {
            const middleX = panelWidth / 2;
            const bottomY = panelHeight - (padding.bottom ?? 10); 
            const buttonSpacing = 10; 
            const textVerticalPadding = padding.textVPadding ?? 10;

            let maxButtonHeight = 0;
            [this.spinButton, this.autospinButton, this.betButton, this.menuButton, this.turboButton].forEach(btn => {
                if (btn && btn.height > maxButtonHeight) maxButtonHeight = btn.height;
            });
            if (maxButtonHeight === 0) maxButtonHeight = 50; // Fallback button height

            let currentXLeft = middleX - buttonSpacing / 2; // Starting point for buttons to the left of center
            let currentXRight = middleX + buttonSpacing / 2; // Starting point for buttons to the right of center

            // Spin Button (Center)
            if (this.spinButton) {
                this.spinButton.pivot.set(this.spinButton.width / 2, this.spinButton.height);
                this.spinButton.position.set(middleX, bottomY);
                currentXLeft -= (this.spinButton.width / 2) + buttonSpacing; 
                currentXRight += (this.spinButton.width / 2) + buttonSpacing;
                
                if (this.stopSpinButton) {
                     this.stopSpinButton.pivot.set(this.stopSpinButton.width / 2, this.stopSpinButton.height);
                     this.stopSpinButton.position.set(middleX, bottomY);
                }
            } else {
                 // No spin button, adjust starting points if needed or keep centered
            }
            
            // Autospin Button (Right of Spin in default config)
            // For Phaser-like: Place Autospin to one side of Spin, Turbo to other etc.
            // Let's try: Menu | Bet | Auto | SPIN | Turbo | (other e.g. Info/Sound if not in menu)

            let layoutOrderRight: (PixiButton | null)[] = [this.turboButton, /* add more buttons if they go to the right */];
            let layoutOrderLeft: (PixiButton | null)[] = [this.autospinButton, this.betButton, this.menuButton]; // Order from center outwards

            // Layout buttons to the right of Spin
            layoutOrderRight.forEach(button => {
                if (button) {
                    button.pivot.set(0, button.height); // Bottom-left pivot
                    button.position.set(currentXRight, bottomY);
                    currentXRight += button.width + buttonSpacing;
                }
            });

            // Layout buttons to the left of Spin
            layoutOrderLeft.reverse().forEach(button => { // Reverse to place from center outwards to left
                if (button) {
                    button.pivot.set(button.width, button.height); // Bottom-right pivot
                    button.position.set(currentXLeft, bottomY);
                    currentXLeft -= (button.width + buttonSpacing);
                }
            });
            
            // Position Bet and Win text displays (above buttons)
            const textYPos = bottomY - maxButtonHeight - textVerticalPadding;
            if (this.betAmountText) {
                this.betAmountText.setAnchor(0.5, 1); // Anchor bottom-center
                this.betAmountText.position.set(panelWidth * 0.25, textYPos);
            }
            if (this.winAmountText) {
                this.winAmountText.setAnchor(0.5, 1); // Anchor bottom-center
                this.winAmountText.position.set(panelWidth * 0.75, textYPos);
            }
            
            // Gamble and Collect buttons (center them, typically replace spin)
            if (this.gambleButton && layoutConf.gambleButtonPos) { 
                this.gambleButton.pivot.set(this.gambleButton.width / 2, this.gambleButton.height);
                this.gambleButton.position.set(layoutConf.gambleButtonPos.x ?? middleX, layoutConf.gambleButtonPos.y ?? bottomY);
            }
            if (this.collectButton && layoutConf.collectButtonPos) { 
                 this.collectButton.pivot.set(this.collectButton.width / 2, this.collectButton.height);
                 this.collectButton.position.set(layoutConf.collectButtonPos.x ?? middleX, layoutConf.collectButtonPos.y ?? bottomY);
            }

        } else {
            // Portrait layout (keep existing simple config-based assignment for now)
            if(this.spinButton && layoutConf.spinButtonPos) { this.spinButton.position.set(layoutConf.spinButtonPos.x, layoutConf.spinButtonPos.y); }
            if(this.stopSpinButton && layoutConf.spinButtonPos) { this.stopSpinButton.position.set(layoutConf.spinButtonPos.x, layoutConf.spinButtonPos.y); } 
            if(this.autospinButton && layoutConf.autospinButtonPos) { this.autospinButton.position.set(layoutConf.autospinButtonPos.x, layoutConf.autospinButtonPos.y); }
            if(this.stopAutospinButton && layoutConf.autospinButtonPos) { this.stopAutospinButton.position.set(layoutConf.autospinButtonPos.x, layoutConf.autospinButtonPos.y); }
            if(this.betButton && layoutConf.betButtonPos) { this.betButton.position.set(layoutConf.betButtonPos.x, layoutConf.betButtonPos.y); }
            if(this.menuButton && layoutConf.menuButtonPos) { this.menuButton.position.set(layoutConf.menuButtonPos.x, layoutConf.menuButtonPos.y); }
            if(this.turboButton && layoutConf.turboButtonPos) { this.turboButton.position.set(layoutConf.turboButtonPos.x, layoutConf.turboButtonPos.y); }
            if(this.collectButton && layoutConf.collectButtonPos) { this.collectButton.position.set(layoutConf.collectButtonPos.x, layoutConf.collectButtonPos.y); }
            if(this.gambleButton && layoutConf.gambleButtonPos) { this.gambleButton.position.set(layoutConf.gambleButtonPos.x, layoutConf.gambleButtonPos.y); }
        }
        
        this.updateButtonStates(); 
        console.log(`PixiMainControlsPanel [${this.config.name}] Updated layout. Portrait: ${isPortrait}`);
    }

    public destroy(options?: PIXI.IDestroyOptions | boolean): void {
        this.eventManager.off(GameEvent.GAME_STATE_CHANGED as any, this.updateButtonStates.bind(this));
        this.eventManager.off(GameEvent.AUTOSPIN_STARTED as any, this.updateButtonStates.bind(this));
        this.eventManager.off(GameEvent.AUTOSPIN_ENDED as any, this.updateButtonStates.bind(this));
        this.eventManager.off(GameEvent.BET_AMOUNT_CHANGED as any, this._boundUpdateBetAmountText);
        this.eventManager.off(GameEvent.WIN_AMOUNT_UPDATED as any, this._boundUpdateWinAmountText);
        super.destroy(options);
    }

    // Methods to update text displays
    private updateBetAmountText(amount: number): void {
        this.betAmountText?.setValue(amount, false); // No animation for bet changes usually
    }

    private updateWinAmountText(amount: number): void {
        this.winAmountText?.setValue(amount, true); // Animate win amount updates
    }
} 