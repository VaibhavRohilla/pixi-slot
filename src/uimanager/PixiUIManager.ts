import { GameFlowController, SlotGameState } from "@/controller/gameFlowController";
import { Globals } from "@/core/Global";
import * as PIXI from 'pixi.js';
import { EventManager, GameEvent } from "@/core/utils/EventManager";
import { IPixiAutospinPanelConfig, PixiAutospinPanel } from "./PixiAutospinPanel";
import { IPixiBetPanelConfig, PixiBetPanel } from "./PixiBetPanel";
import { IPixiGambleUIConfig, PixiGambleUI } from "./PixiGambleUI";
import { IPixiHistoryPanelConfig, PixiHistoryPanel } from "./PixiHistoryPanel";
import { IPixiInfoPanelConfig, PixiInfoPanel } from "./PixiInfoPanel";
import { IPixiMainControlsPanelConfig, PixiMainControlsPanel } from "./PixiMainControlsPanel";
import { IPixiMenuPanelConfig, PixiMenuPanel } from "./PixiMenuPanel";
import { IPixiSidePanelConfig, PixiSidePanel } from "./PixiSidePanel";
import { IPixiTopInfoBarConfig, PixiTopInfoBar } from "./PixiTopInfoBar";

export interface IPixiUIManagerLayoutConfig {
    topInfoBarPos?: { x?: number, y?: number, widthRatio?: number, height?: number, padding?: { top?: number, bottom?: number } };
    mainControlsPanelPos?: { x?: number, y?: number, widthRatio?: number, height?:number, padding?: { top?: number, bottom?: number } };
    menuPanelPos?: { x?: number, y?: number };
    betPanelPos?: { x?: number, y?: number };
    autospinPanelPos?: { x?: number, y?: number };
    gambleUIPos?: { x?: number, y?: number };
    historyPanelPos?: { x?: number, y?: number };
    infoPanelPos?: { x: number, y: number };
    sidePanelPos?: { x: number, y: number };
    globalPadding?: { top?: number, bottom?: number, left?: number, right?: number };
}

// Master config that holds configs for all sub-panels
export interface IPixiUIManagerConfig {
    mainDisplayObject?: PIXI.Container; // Optional, can default to Globals.app.stage
    layout: { // UIManager's own layout config for its managed panels
        portrait: IPixiUIManagerLayoutConfig;
        landscape: IPixiUIManagerLayoutConfig;
    };
    // Panel specific configs - these contain their *internal* layout and appearance
    topInfoBarConfig: IPixiTopInfoBarConfig;
    mainControlsConfig: IPixiMainControlsPanelConfig;
    menuPanelConfig?: IPixiMenuPanelConfig; 
    betPanelConfig?: IPixiBetPanelConfig; 
    autospinPanelConfig?: IPixiAutospinPanelConfig; 
    gambleUIConfig?: IPixiGambleUIConfig; 
    sidePanelConfig?: IPixiSidePanelConfig; 
    infoPanelConfig?: IPixiInfoPanelConfig; // Added Info Panel Config
    historyPanelConfig?: IPixiHistoryPanelConfig; // Added History Panel Config
}

export class PixiUIManager extends PIXI.Container {
    private config: IPixiUIManagerConfig;
    private eventManager: EventManager;
    private gameFlowController: GameFlowController;

    private mainDisplayContainer: PIXI.Container; 

    private topInfoBar: PixiTopInfoBar | null = null;
    private mainControlsPanel: PixiMainControlsPanel | null = null;
    private menuPanel: PixiMenuPanel | null = null;
    private sidePanel: PixiSidePanel | null = null;
    private betPanel: PixiBetPanel | null = null; // PixiBetPanel | null = null; - TYPE FIXED
    private autospinPanel: PixiAutospinPanel | null = null; // PixiAutospinPanel | null = null;
    private infoPanel: PixiInfoPanel | null = null; // Added Info Panel property
    private historyPanel: PixiHistoryPanel | null = null; // Added History Panel property
    private gambleUIPanel: PixiGambleUI | null = null; // Uncommented

    // Store bound methods for listeners
    private _boundOnResize: () => void;
    private _boundOnGameStateChanged: (data: { newState: SlotGameState, oldState: SlotGameState }) => void;
    private _boundShowMenu: () => void;
    private _boundShowBetPanel: () => void;
    private _boundShowAutospinPanel: () => void;
    private _boundShowInfoPanel: () => void;
    private _boundShowHistoryPanel: () => void;
    private _boundShowGambleUI: (data: { gambleAmount: number, currentWin: number }) => void;
    private _boundHideGambleUI: () => void;

    constructor(config: IPixiUIManagerConfig) {
        super();
        this.config = config;
        this.name = 'PixiUIManager';
        if (!Globals.app && !config.mainDisplayObject) {
            console.error("PixiUIManager: PIXI.Application (Globals.app) or a mainDisplayObject in config is required!");
            this.mainDisplayContainer = new PIXI.Container(); 
        } else {
            this.mainDisplayContainer = config.mainDisplayObject || Globals.app!.stage; 
        }
        this.eventManager = EventManager.getInstance();
        this.gameFlowController = GameFlowController.getInstance();

        // Init bound methods
        this._boundOnResize = this.onResize.bind(this);
        this._boundOnGameStateChanged = this.onGameStateChanged.bind(this);
        this._boundShowMenu = this.showMenu.bind(this);
        this._boundShowBetPanel = this.showBetPanel.bind(this);
        this._boundShowAutospinPanel = this.showAutospinPanel.bind(this);
        this._boundShowInfoPanel = this.showInfoPanel.bind(this);
        this._boundShowHistoryPanel = this.showHistoryPanel.bind(this);
        this._boundShowGambleUI = this.showGambleUI.bind(this);
        this._boundHideGambleUI = this.hideGambleUI.bind(this);

        this.initPanels();
        this.initEventHandlers();
        
        this.onResize(); // Initial layout call
        console.log('PixiUIManager Initialized');
    }

    private initPanels(): void {
        // Mandatory panels
        if (this.config.topInfoBarConfig) { // Check in case config itself is optional in future
        this.topInfoBar = new PixiTopInfoBar(this.config.topInfoBarConfig);
            this.addPanel(this.topInfoBar, 'topInfoBar'); 
        }
        if (this.config.mainControlsConfig) {
        this.mainControlsPanel = new PixiMainControlsPanel(this.config.mainControlsConfig);
            this.addPanel(this.mainControlsPanel, 'mainControlsPanel'); 
        }

        // Optional panels
        if (this.config.menuPanelConfig) { 
            const panelConfig = this.config.menuPanelConfig; 
            this.menuPanel = new PixiMenuPanel(panelConfig);
            this.addPanel(this.menuPanel, 'menuPanel');
        }
        if (this.config.sidePanelConfig) {
            const panelConfig = this.config.sidePanelConfig;
            this.sidePanel = new PixiSidePanel(panelConfig);
            this.addPanel(this.sidePanel, 'sidePanel');
        }
        if (this.config.betPanelConfig) {  
            const panelConfig = this.config.betPanelConfig;
            this.betPanel = new PixiBetPanel(panelConfig);
            this.addPanel(this.betPanel, 'betPanel');
        }
        if (this.config.autospinPanelConfig) {  
            const panelConfig = this.config.autospinPanelConfig;
            this.autospinPanel = new PixiAutospinPanel(panelConfig);
            this.addPanel(this.autospinPanel, 'autospinPanel');
        }
        if (this.config.gambleUIConfig) { 
            const panelConfig = this.config.gambleUIConfig;
            this.gambleUIPanel = new PixiGambleUI(panelConfig);
            this.addPanel(this.gambleUIPanel, 'gambleUIPanel');
        }
        if (this.config.historyPanelConfig) { // Init History Panel
            const panelConfig = this.config.historyPanelConfig;
            this.historyPanel = new PixiHistoryPanel(panelConfig);
            this.addPanel(this.historyPanel, 'historyPanel');
        }
        if (this.config.infoPanelConfig) { // Init Info Panel
            const panelConfig = this.config.infoPanelConfig;
            this.infoPanel = new PixiInfoPanel(panelConfig);
            this.addPanel(this.infoPanel, 'infoPanel');
        }
    }

    private addPanel(panel: PIXI.Container | null, name: string): void {
        if (!panel) return;
        panel.name = name;
        panel.visible = false; 
        if (name === 'topInfoBar' || name === 'mainControlsPanel' || name === 'sidePanel') { 
            panel.visible = true;
        }
        this.mainDisplayContainer.addChild(panel);
    }

    private initEventHandlers(): void {
        this.eventManager.on(GameEvent.RESIZE as any, this._boundOnResize);
        this.eventManager.on(GameEvent.GAME_STATE_CHANGED as any, this._boundOnGameStateChanged);

        this.eventManager.on(GameEvent.SHOW_MENU_COMMAND as any, this._boundShowMenu);
        this.eventManager.on(GameEvent.REQUEST_BET_PANEL as any, this._boundShowBetPanel);
        this.eventManager.on(GameEvent.REQUEST_AUTOSPIN_PANEL as any, this._boundShowAutospinPanel);
        if (this.config.infoPanelConfig) this.eventManager.on(GameEvent.REQUEST_INFO_PANEL as any, this._boundShowInfoPanel); 
        if (this.config.historyPanelConfig) this.eventManager.on(GameEvent.REQUEST_HISTORY_PANEL as any, this._boundShowHistoryPanel);
        if (this.config.gambleUIConfig) {
             this.eventManager.on(GameEvent.GAMBLE_UI_SHOW as any, this._boundShowGambleUI);
             this.eventManager.on(GameEvent.GAMBLE_UI_HIDE as any, this._boundHideGambleUI);
        }
    }

    private onResize(): void {
        const screenW = Globals.screenWidth;
        const screenH = Globals.screenHeight;
        const isPortrait = screenH > screenW;
        this.updateLayout(isPortrait, screenW, screenH);
    }

    private onGameStateChanged(data: { newState: SlotGameState, oldState: SlotGameState }): void {
        // Show/hide panels based on game state, or delegate to panels to update their own states
        if (this.menuPanel && data.newState !== SlotGameState.IDLE && data.newState !== SlotGameState.ROUND_COMPLETE && data.newState !== SlotGameState.FREE_SPIN_IDLE) {
            // Example: auto-hide menu if game transitions to a busy state while menu is open
            // if (this.menuPanel.visible) this.menuPanel.hidePanel();
        }
        // MainControlsPanel already listens to GAME_STATE_CHANGED for its button states.
    }

    public updateLayout(isPortrait: boolean, screenWidth: number, screenHeight: number): void {
        const uiManagerLayoutConf = isPortrait ? this.config.layout.portrait : this.config.layout.landscape;
        const globalPadding = uiManagerLayoutConf.globalPadding || { top: 0, bottom: 0, left: 0, right: 0 };

        let currentTopY = globalPadding.top ?? 0;
        let topInfoBarActualHeight = 0;

        if (this.topInfoBar && this.config.topInfoBarConfig && uiManagerLayoutConf.topInfoBarPos) {
            const panelLayout = uiManagerLayoutConf.topInfoBarPos;
            this.topInfoBar.x = panelLayout.x ?? globalPadding.left ?? 0;
            this.topInfoBar.y = panelLayout.y ?? currentTopY;
            const panelWidth = (panelLayout.widthRatio ?? 1) * (screenWidth - (globalPadding.left ?? 0) - (globalPadding.right ?? 0));
            // TopInfoBar's updateLayout takes screenWidth and screenHeight for its internal full-width calculations
            this.topInfoBar.updateLayout(isPortrait, screenWidth, screenHeight); 
            topInfoBarActualHeight = this.topInfoBar.height + (panelLayout.padding?.bottom ?? 5); 
            currentTopY += topInfoBarActualHeight;
        }

        if (this.mainControlsPanel && this.config.mainControlsConfig && uiManagerLayoutConf.mainControlsPanelPos) {
            const panelLayout = uiManagerLayoutConf.mainControlsPanelPos;
            const panelHeight = panelLayout.height || 100;
            const panelWidth = (panelLayout.widthRatio ?? 1) * (screenWidth - (globalPadding.left ?? 0) - (globalPadding.right ?? 0));
            this.mainControlsPanel.x = panelLayout.x ?? globalPadding.left ?? 0;
            this.mainControlsPanel.y = panelLayout.y ?? (screenHeight - (globalPadding.bottom ?? 0) - panelHeight - (panelLayout.padding?.top ?? 0));
            // MainControlsPanel's updateLayout takes its target width and height
            this.mainControlsPanel.updateLayout(isPortrait, panelWidth, panelHeight);
        }

        const centerModalPanel = (panel: PIXI.Container | null, panelLayoutPos?: {x?: number, y?: number}) => {
            if (panel) { 
                // First, let the panel arrange its internal children based on its own config and orientation.
                // This should also allow it to determine its own natural width/height.
                if (typeof (panel as any).updateLayout === 'function') {
                    (panel as any).updateLayout(isPortrait); // Pass only orientation
                }

                // Now that the panel has its dimensions, center it or use explicit UIManager layout position.
                const panelWidth = panel.width;
                const panelHeight = panel.height;

                panel.x = panelLayoutPos?.x ?? (screenWidth - panelWidth) / 2;
                panel.y = panelLayoutPos?.y ?? (screenHeight - panelHeight) / 2;
            }
        };
        
        if (this.config.menuPanelConfig) centerModalPanel(this.menuPanel, uiManagerLayoutConf.menuPanelPos);
        if (this.config.betPanelConfig) centerModalPanel(this.betPanel, uiManagerLayoutConf.betPanelPos);
        if (this.config.autospinPanelConfig) centerModalPanel(this.autospinPanel, uiManagerLayoutConf.autospinPanelPos);
        if (this.config.gambleUIConfig) centerModalPanel(this.gambleUIPanel, uiManagerLayoutConf.gambleUIPos);
        if (this.config.historyPanelConfig) centerModalPanel(this.historyPanel, uiManagerLayoutConf.historyPanelPos);

        if (this.infoPanel && this.config.infoPanelConfig) {
            // For infoPanel, if explicit UIManager pos is given, use it. Otherwise, center.
            if (uiManagerLayoutConf.infoPanelPos && uiManagerLayoutConf.infoPanelPos.x !== undefined && uiManagerLayoutConf.infoPanelPos.y !== undefined) {
                if(typeof this.infoPanel.updateLayout === 'function') this.infoPanel.updateLayout(isPortrait); // Let it size itself first
                this.infoPanel.x = uiManagerLayoutConf.infoPanelPos.x;
                this.infoPanel.y = uiManagerLayoutConf.infoPanelPos.y;
            } else {
                centerModalPanel(this.infoPanel, undefined); 
            }
        }
        
        if (this.sidePanel && this.config.sidePanelConfig && uiManagerLayoutConf.sidePanelPos) {
            this.sidePanel.x = uiManagerLayoutConf.sidePanelPos.x; 
            this.sidePanel.y = uiManagerLayoutConf.sidePanelPos.y; 
            // SidePanel's updateLayout signature is updateLayout(isPortraitMode: boolean, panelX: number = 0, panelY: number = 0)
            // It uses these to set its own position, then lays out children. So UIManager sets the position.
            if (typeof this.sidePanel.updateLayout === 'function') {
                 this.sidePanel.updateLayout(isPortrait, this.sidePanel.x, this.sidePanel.y); 
            }
        }
        console.log(`PixiUIManager: Layout updated. Portrait: ${isPortrait}`);
    }

    public showMenu(): void {
        if (this.menuPanel && !this.menuPanel.visible) {
            this.menuPanel.showPanel();
        }
    }

    public hideMenu(): void {
        if (this.menuPanel && this.menuPanel.visible) {
            this.menuPanel.hidePanel();
        }
    }

    // --- Placeholder Panel Show/Hide Methods ---
    public showBetPanel(): void {
        console.log('PixiUIManager: Show Bet Panel requested.');
        if (!this.betPanel && this.config.betPanelConfig) {
            this.betPanel = new PixiBetPanel(this.config.betPanelConfig);
            this.addChild(this.betPanel);
            console.log('PixiUIManager: PixiBetPanel instance created.');
        }
        if (this.betPanel) {
            this.hideOtherModalPanels(this.betPanel); // Pass the panel to EXCLUDE from hiding
            this.betPanel.showPanel(); 
        } else {
            console.warn('PixiUIManager: BetPanel could not be shown (no instance or config).');
        }
    }

    public showAutospinPanel(): void {
        console.log('PixiUIManager: Show Autospin Panel requested.');
        if (!this.autospinPanel && this.config.autospinPanelConfig) {
            // this.autospinPanel = new PixiAutospinPanel(this.config.autospinPanelConfig);
            // this.addChild(this.autospinPanel);
            console.log('PixiUIManager: PixiAutospinPanel would be created here.');
        }
        if (this.autospinPanel) {
            this.hideOtherModalPanels(this.autospinPanel); 
            // this.autospinPanel.showPanel();
            this.autospinPanel.visible = true; // Assuming no showPanel for now
            // this.autospinPanel.updateLayout(Globals.screenHeight > Globals.screenWidth, Globals.screenWidth, Globals.screenHeight);
        } else {
            console.warn('PixiUIManager: AutospinPanel or its config not available.');
        }
    }

    public showInfoPanel(): void {
        if (this.infoPanel) {
            this.hideOtherModalPanels(this.infoPanel);
            this.infoPanel.showPanel();
        } else {
            console.warn('PixiUIManager: InfoPanel or its config not available.');
        }
    }

    public showHistoryPanel(): void {
        if (this.historyPanel) {
            this.hideOtherModalPanels(this.historyPanel);
            this.historyPanel.showPanel();
        } else {
            console.warn('PixiUIManager: HistoryPanel or its config not available.');
        }
    }

    public showGambleUI(data: { gambleAmount: number, currentWin: number }): void {
        if (this.gambleUIPanel) {
            this.hideOtherModalPanels(this.gambleUIPanel);
            this.gambleUIPanel.onGambleUIShow(data); // Call method on PixiGambleUI instance
        } else {
            console.warn('PixiUIManager: GambleUI or its config not available to show.');
        }
    }

    private hideGambleUI(): void {
        if (this.gambleUIPanel) {
            this.gambleUIPanel.hidePanel();
        }
    }

    // Helper to manage visibility if only one major popup/modal should be visible at a time.
    private hideOtherModalPanels(excludePanel?: PIXI.Container | any | null): void {
        const modalPanels: (PIXI.Container | null | undefined)[] = [
            this.menuPanel, this.betPanel, this.autospinPanel, 
            this.infoPanel, this.historyPanel, this.gambleUIPanel
        ];

        modalPanels.forEach(panel => {
            if (panel && panel !== excludePanel) {
                // Check if the panel has a hidePanel method, otherwise just set visible to false.
                if (typeof (panel as any).hidePanel === 'function') {
                    (panel as any).hidePanel();
                } else {
                    panel.visible = false;
                }
            }
        });
    }

    public destroy(): void {
        // Remove event listeners
        this.eventManager.off(GameEvent.RESIZE as any, this._boundOnResize);
        this.eventManager.off(GameEvent.GAME_STATE_CHANGED as any, this._boundOnGameStateChanged);
        this.eventManager.off(GameEvent.SHOW_MENU_COMMAND as any, this._boundShowMenu);
        this.eventManager.off(GameEvent.REQUEST_BET_PANEL as any, this._boundShowBetPanel);
        this.eventManager.off(GameEvent.REQUEST_AUTOSPIN_PANEL as any, this._boundShowAutospinPanel);
        if (this.config.infoPanelConfig) this.eventManager.off(GameEvent.REQUEST_INFO_PANEL as any, this._boundShowInfoPanel); 
        if (this.config.historyPanelConfig) this.eventManager.off(GameEvent.REQUEST_HISTORY_PANEL as any, this._boundShowHistoryPanel);
        if (this.config.gambleUIConfig) {
             this.eventManager.off(GameEvent.GAMBLE_UI_SHOW as any, this._boundShowGambleUI);
             this.eventManager.off(GameEvent.GAMBLE_UI_HIDE as any, this._boundHideGambleUI);
        }

        // Destroy all managed panel instances
        console.log("PixiUIManager: Destroying panels...");
        if (this.topInfoBar) this.topInfoBar.destroy();
        if (this.mainControlsPanel) this.mainControlsPanel.destroy();
        if (this.menuPanel) this.menuPanel.destroy();
        if (this.sidePanel) this.sidePanel.destroy();
        if (this.betPanel) this.betPanel.destroy();
        if (this.autospinPanel) this.autospinPanel.destroy();
        if (this.infoPanel) this.infoPanel.destroy();
        if (this.historyPanel) this.historyPanel.destroy();
        if (this.gambleUIPanel) this.gambleUIPanel.destroy();

        // Nullify references
        this.topInfoBar = null;
        this.mainControlsPanel = null;
        this.menuPanel = null;
        this.sidePanel = null;
        this.betPanel = null;
        this.autospinPanel = null;
        this.infoPanel = null;
        this.historyPanel = null;
        this.gambleUIPanel = null;

        // Destroy the UIManager container itself and its direct children (if any were added)
        super.destroy({ children: true }); // Destroy container and any direct children
        console.log("PixiUIManager Destroyed");
    }
} 