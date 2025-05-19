import * as PIXI from 'pixi.js';
import * as TWEEN from '@tweenjs/tween.js';
import { EventManager, GameEvent } from '../core/utils/EventManager';
import { Globals } from '../core/Global';
import { PixiButton, IPixiButtonConfig } from './PixiButton';
import { SoundController } from '../controller/soundController'; // Corrected casing
import { GameFlowController } from '../controller/gameFlowController'; // To get settings states
// import { SettingsController } from './SettingsController'; // If a dedicated settings controller exists

export interface IPixiMenuPanelLayoutConfig {
    soundButtonPos?: { x: number, y: number };
    musicButtonPos?: { x: number, y: number };
    fullscreenButtonPos?: { x: number, y: number };
    infoButtonPos?: { x: number, y: number };
    historyButtonPos?: { x: number, y: number };
    homeButtonPos?: { x: number, y: number };
    gambleToggleButtonPos?: { x: number, y: number };
    closeMenuButtonPos?: { x: number, y: number };
    panelHeight?: number;
    panelWidth?: number;
}

export interface IPixiMenuPanelConfig {
    name: string;
    backgroundTextureKey?: string;
    nineSliceConfig?: { leftWidth: number, topHeight: number, rightWidth: number, bottomHeight: number };
    layout: {
        portrait: IPixiMenuPanelLayoutConfig;
        landscape: IPixiMenuPanelLayoutConfig;
    };
    buttonConfigs: {
        soundToggle?: IPixiButtonConfig; // Optional, if game has sound toggle
        musicToggle?: IPixiButtonConfig; // Optional, if game has music toggle
        fullscreenToggle?: IPixiButtonConfig;
        info?: IPixiButtonConfig; 
        history?: IPixiButtonConfig;
        home?: IPixiButtonConfig;
        gambleToggle?: IPixiButtonConfig;
        closeMenu: IPixiButtonConfig;
    };
    visibleOnInit?: boolean;
    showAnimation?: { type: 'fade' | 'slide', duration: number }; // Example animation config
    hideAnimation?: { type: 'fade' | 'slide', duration: number };
}

export class PixiMenuPanel extends PIXI.Container {
    private config: IPixiMenuPanelConfig;
    private eventManager: EventManager;
    private soundController: SoundController;
    private gameFlowController: GameFlowController;
    // private settingsController: SettingsController;

    private backgroundSprite: PIXI.Sprite | PIXI.NineSlicePlane | null = null;
    
    private soundButton: PixiButton | null = null;
    private musicButton: PixiButton | null = null;
    private fullscreenButton: PixiButton | null = null;
    private infoButton: PixiButton | null = null;
    private historyButton: PixiButton | null = null;
    private homeButton: PixiButton | null = null;
    private gambleToggleButton: PixiButton | null = null;
    private closeMenuButton: PixiButton | null = null;

    // Store bound listeners for proper removal
    private _boundHidePanel: () => void;
    private _onSoundButtonClick: () => void;
    private _onMusicButtonClick: () => void;
    private _onFullscreenButtonClick: () => void;
    private _onGambleToggleClick: () => void;
    private _onInfoButtonClick: () => void;
    private _onHistoryButtonClick: () => void;
    private _onHomeButtonClick: () => void;
    private _boundUpdateButtonStates: () => void;

    constructor(config: IPixiMenuPanelConfig) {
        super();
        this.config = config;
        this.name = config.name;
        this.eventManager = EventManager.getInstance();
        this.soundController = SoundController.getInstance(); // Assuming singleton
        this.gameFlowController = GameFlowController.getInstance(); // Assuming singleton
        // this.settingsController = SettingsController.getInstance(); // If you have one

        this.initBackground();
        this.initButtons();
        
        // Initialize bound listeners
        this._boundHidePanel = this.hidePanel.bind(this);
        this._onSoundButtonClick = () => { if(this.soundButton) this.eventManager.emit(GameEvent.SOUND_TOGGLE as any, !this.soundButton.isSelected); };
        this._onMusicButtonClick = () => { if(this.musicButton) this.eventManager.emit(GameEvent.MUSIC_TOGGLE as any, !this.musicButton.isSelected); };
        this._onFullscreenButtonClick = () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => {
                    console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
                });
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
            }
        };
        this._onGambleToggleClick = () => { if(this.gambleToggleButton) this.eventManager.emit(GameEvent.SETTINGS_TOGGLE_GAMBLE_ALLOWED as any, !this.gambleToggleButton.isSelected); };
        this._onInfoButtonClick = () => { if(this.infoButton && !this.infoButton.isDisabled) this.eventManager.emit(GameEvent.REQUEST_INFO_PANEL as any); };
        this._onHistoryButtonClick = () => { if(this.historyButton && !this.historyButton.isDisabled) this.eventManager.emit(GameEvent.REQUEST_HISTORY_PANEL as any); };
        this._onHomeButtonClick = () => { console.log('Home button clicked - TBD: Emit GO_TO_HOME_COMMAND or similar'); }; 
        this._boundUpdateButtonStates = this.updateButtonStates.bind(this);

        this.updateLayout(Globals.screenHeight > Globals.screenWidth, Globals.screenWidth, Globals.screenHeight);
        this.updateButtonStates(); 
        this.initButtonListeners();
        
        this.visible = config.visibleOnInit ?? false;
        this.alpha = this.visible ? 1 : 0;
        console.log(`PixiMenuPanel [${this.config.name}] Initialized`);
    }

    private initBackground(): void {
        if (this.config.backgroundTextureKey && Globals.resources[this.config.backgroundTextureKey]) {
            const texture = Globals.resources[this.config.backgroundTextureKey] as PIXI.Texture;
            if (this.config.nineSliceConfig) {
                this.backgroundSprite = new PIXI.NineSlicePlane(texture, 
                    this.config.nineSliceConfig.leftWidth, this.config.nineSliceConfig.topHeight, 
                    this.config.nineSliceConfig.rightWidth, this.config.nineSliceConfig.bottomHeight);
            } else {
                this.backgroundSprite = new PIXI.Sprite(texture);
            }
            this.addChildAt(this.backgroundSprite, 0);
        }
    }

    private initButtons(): void {
        if (this.config.buttonConfigs.soundToggle) {
            this.soundButton = new PixiButton(this.config.buttonConfigs.soundToggle);
            this.addChild(this.soundButton);
        }
        if (this.config.buttonConfigs.musicToggle) {
            this.musicButton = new PixiButton(this.config.buttonConfigs.musicToggle);
            this.addChild(this.musicButton);
        }
        if (this.config.buttonConfigs.fullscreenToggle) {
            this.fullscreenButton = new PixiButton(this.config.buttonConfigs.fullscreenToggle);
            this.addChild(this.fullscreenButton);
        }
        if (this.config.buttonConfigs.info) {
            this.infoButton = new PixiButton(this.config.buttonConfigs.info);
            this.addChild(this.infoButton);
        }
        if (this.config.buttonConfigs.history) {
            this.historyButton = new PixiButton(this.config.buttonConfigs.history);
            this.addChild(this.historyButton);
        }
        if (this.config.buttonConfigs.home) {
            this.homeButton = new PixiButton(this.config.buttonConfigs.home);
            this.addChild(this.homeButton);
        }
        if (this.config.buttonConfigs.gambleToggle) {
            this.gambleToggleButton = new PixiButton(this.config.buttonConfigs.gambleToggle);
            this.addChild(this.gambleToggleButton);
        }
        this.closeMenuButton = new PixiButton(this.config.buttonConfigs.closeMenu);
        this.addChild(this.closeMenuButton);
    }

    private initButtonListeners(): void {
        if (this.closeMenuButton) {
            const closeEvent = this.closeMenuButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.closeMenuButton.getNameKey()}`;
            this.eventManager.on(closeEvent as any, this._boundHidePanel);
        }

        if (this.soundButton) {
            const soundEvent = this.soundButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.soundButton.getNameKey()}`;
            this.eventManager.on(soundEvent as any, this._onSoundButtonClick);
        }

        if (this.musicButton) {
            const musicEvent = this.musicButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.musicButton.getNameKey()}`;
            this.eventManager.on(musicEvent as any, this._onMusicButtonClick);
        }

        if (this.fullscreenButton) {
            const fullscreenEvent = this.fullscreenButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.fullscreenButton.getNameKey()}`;
            this.eventManager.on(fullscreenEvent as any, this._onFullscreenButtonClick);
        }

        if (this.gambleToggleButton) {
            const gambleEvent = this.gambleToggleButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.gambleToggleButton.getNameKey()}`;
            this.eventManager.on(gambleEvent as any, this._onGambleToggleClick);
        }

        if (this.infoButton) {
            const infoEvent = this.infoButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.infoButton.getNameKey()}`;
            this.eventManager.on(infoEvent as any, this._onInfoButtonClick);
        }

        if (this.historyButton) {
            const historyEvent = this.historyButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.historyButton.getNameKey()}`;
            this.eventManager.on(historyEvent as any, this._onHistoryButtonClick);
        }

        if (this.homeButton) {
            const homeEvent = this.homeButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.homeButton.getNameKey()}`;
            this.eventManager.on(homeEvent as any, this._onHomeButtonClick);
        }
        
        this.eventManager.on(GameEvent.GAME_STATE_CHANGED as any, this._boundUpdateButtonStates);
        document.addEventListener('fullscreenchange', this._boundUpdateButtonStates);
    }

    public showPanel(): void {
        if (this.visible && this.alpha === 1) return;
        this.updateButtonStates(); // Update states before showing
        this.visible = true;
        // TODO: Implement show animation (e.g., fade in, slide in based on this.config.showAnimation)
        new TWEEN.Tween(this).to({ alpha: 1 }, this.config.showAnimation?.duration || 200).start();
        this.eventManager.emit(GameEvent.MENU_PANEL_OPENED as any, { name: this.name });
        console.log(`PixiMenuPanel [${this.config.name}] shown`);
    }

    public hidePanel(): void {
        if (!this.visible && this.alpha === 0) return;
        // TODO: Implement hide animation
        new TWEEN.Tween(this)
            .to({ alpha: 0 }, this.config.hideAnimation?.duration || 200)
            .onComplete(() => this.visible = false)
            .start();
        this.eventManager.emit(GameEvent.MENU_PANEL_CLOSED as any, { name: this.name });
        console.log(`PixiMenuPanel [${this.config.name}] hidden`);
    }

    public updateButtonStates(): void {
        if (this.soundButton) {
            this.soundButton.setSelected(this.soundController.getIsSoundOn());
        }
        if (this.musicButton) {
            this.musicButton.setSelected(this.soundController.getIsMusicOn());
        }
        if (this.fullscreenButton) {
            this.fullscreenButton.setSelected(document.fullscreenElement != null);
        }
        if (this.gambleToggleButton) {
            this.gambleToggleButton.setSelected(this.gameFlowController.getAllowGambleSetting());
        }
        console.log(`PixiMenuPanel [${this.config.name}] updating button states. Sound: ${this.soundButton?.isSelected}, Music: ${this.musicButton?.isSelected}, Fullscreen: ${this.fullscreenButton?.isSelected}, Gamble Allowed: ${this.gambleToggleButton?.isSelected}`);
    }

    public updateLayout(isPortrait: boolean, panelX?: number, panelY?: number): void {
        const layoutConf = isPortrait ? this.config.layout.portrait : this.config.layout.landscape;
        const panelW = layoutConf.panelWidth ?? this.width;
        const panelH = layoutConf.panelHeight ?? this.height;

        if (panelX !== undefined) this.x = panelX;
        if (panelY !== undefined) this.y = panelY;

        if (this.backgroundSprite) {
            this.backgroundSprite.width = panelW;
            this.backgroundSprite.height = panelH;
        }
        
        // Simplified positioning, assumes all buttons are direct children and positions are absolute to panel's (0,0)
        if(this.soundButton && layoutConf.soundButtonPos) this.soundButton.position.set(layoutConf.soundButtonPos.x, layoutConf.soundButtonPos.y);
        if(this.musicButton && layoutConf.musicButtonPos) this.musicButton.position.set(layoutConf.musicButtonPos.x, layoutConf.musicButtonPos.y);
        if(this.fullscreenButton && layoutConf.fullscreenButtonPos) this.fullscreenButton.position.set(layoutConf.fullscreenButtonPos.x, layoutConf.fullscreenButtonPos.y);
        if(this.infoButton && layoutConf.infoButtonPos) this.infoButton.position.set(layoutConf.infoButtonPos.x, layoutConf.infoButtonPos.y);
        if(this.historyButton && layoutConf.historyButtonPos) this.historyButton.position.set(layoutConf.historyButtonPos.x, layoutConf.historyButtonPos.y);
        if(this.homeButton && layoutConf.homeButtonPos) this.homeButton.position.set(layoutConf.homeButtonPos.x, layoutConf.homeButtonPos.y);
        if(this.gambleToggleButton && layoutConf.gambleToggleButtonPos) this.gambleToggleButton.position.set(layoutConf.gambleToggleButtonPos.x, layoutConf.gambleToggleButtonPos.y);
        if(this.closeMenuButton && layoutConf.closeMenuButtonPos) this.closeMenuButton.position.set(layoutConf.closeMenuButtonPos.x, layoutConf.closeMenuButtonPos.y);

        console.log(`PixiMenuPanel [${this.config.name}] Updated layout. Portrait: ${isPortrait}`);
    }

    public destroy(options?: PIXI.IDestroyOptions | boolean): void {
        this.eventManager.off(GameEvent.GAME_STATE_CHANGED as any, this._boundUpdateButtonStates);
        document.removeEventListener('fullscreenchange', this._boundUpdateButtonStates);
        
        if (this.closeMenuButton) {
             const closeEvent = this.closeMenuButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.closeMenuButton.getNameKey()}`;
             this.eventManager.off(closeEvent as any, this._boundHidePanel);
        }
        if (this.soundButton) {
            const soundEvent = this.soundButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.soundButton.getNameKey()}`;
            this.eventManager.off(soundEvent as any, this._onSoundButtonClick);
        }
        if (this.musicButton) {
            const musicEvent = this.musicButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.musicButton.getNameKey()}`;
            this.eventManager.off(musicEvent as any, this._onMusicButtonClick);
        }
        if (this.fullscreenButton) {
            const fullscreenEvent = this.fullscreenButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.fullscreenButton.getNameKey()}`;
            this.eventManager.off(fullscreenEvent as any, this._onFullscreenButtonClick);
        }
        if (this.gambleToggleButton) {
            const gambleEvent = this.gambleToggleButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.gambleToggleButton.getNameKey()}`;
            this.eventManager.off(gambleEvent as any, this._onGambleToggleClick);
        }
        if (this.infoButton) {
            const infoEvent = this.infoButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.infoButton.getNameKey()}`;
            this.eventManager.off(infoEvent as any, this._onInfoButtonClick);
        }
        if (this.historyButton) {
            const historyEvent = this.historyButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.historyButton.getNameKey()}`;
            this.eventManager.off(historyEvent as any, this._onHistoryButtonClick);
        }
        if (this.homeButton) {
            const homeEvent = this.homeButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.homeButton.getNameKey()}`;
            this.eventManager.off(homeEvent as any, this._onHomeButtonClick);
        }

        // TODO: Add .off for all other button listeners similarly. 
        // This requires storing the bound function or ensuring the lambda is correctly referenced if not using .bind for .on()
        // For arrow functions used in .on(), they don't need .off() with context, just event name and the arrow function itself.
        // For .bind(this) methods, it's best to store the bound reference if you want to .off() it specifically.
        // Simpler approach for now might be to clear listeners by event name if no other component uses these specific named events.

        super.destroy(options);
    }
} 