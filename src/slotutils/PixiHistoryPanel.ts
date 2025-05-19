import * as PIXI from 'pixi.js';
import * as TWEEN from '@tweenjs/tween.js';
import { EventManager, GameEvent } from '../core/utils/EventManager';
import { Globals } from '../core/Global';
import { PixiButton, IPixiButtonConfig } from './PixiButton';
import { HistoryController, ISlotHistoryRecord } from './HistoryController';
import { formatCurrency } from '../core/utils/formatting'; // For formatting bet/win amounts

export interface IPixiHistoryPanelLayoutConfig {
    titlePos?: { x: number, y: number };
    recordsContainerPos?: { x: number, y: number };
    recordsContainerSize?: { width: number, height: number };
    closeButtonPos?: { x: number, y: number };
    prevButtonPos?: { x: number, y: number }; // For pagination
    nextButtonPos?: { x: number, y: number }; // For pagination
    pageIndicatorPos?: { x: number, y: number }; // To show Page X of Y
    noRecordsTextPos?: { x: number, y: number };
    recordLineHeight?: number; // Vertical spacing for each history record line
    panelHeight?: number;
    panelWidth?: number;
}

export interface IPixiHistoryPanelConfig {
    name: string;
    backgroundTextureKey?: string;
    nineSliceConfig?: { leftWidth: number, topHeight: number, rightWidth: number, bottomHeight: number };
    layout: {
        portrait: IPixiHistoryPanelLayoutConfig;
        landscape: IPixiHistoryPanelLayoutConfig;
    };
    buttonConfigs: {
        closeButton: IPixiButtonConfig;
        prevButton?: IPixiButtonConfig; // Optional pagination button
        nextButton?: IPixiButtonConfig; // Optional pagination button
    };
    textStyles?: {
        titleStyle?: Partial<PIXI.ITextStyle>;
        recordTextStyle?: Partial<PIXI.ITextStyle>;
        noRecordsTextStyle?: Partial<PIXI.ITextStyle>;
        pageIndicatorStyle?: Partial<PIXI.ITextStyle>; // For Page X of Y
    };
    recordsPerPage?: number; // Replaces maxRecordsToShow for clarity with pagination
    currencySymbol?: string;
    visibleOnInit?: boolean;
    showAnimation?: { type: 'fade' | 'slide', duration?: number }; 
    hideAnimation?: { type: 'fade' | 'slide', duration?: number };
}

const DEFAULT_TITLE_STYLE: Partial<PIXI.ITextStyle> = { fontFamily: 'Arial', fontSize: 36, fill: '#ffffff', align: 'center' };
const DEFAULT_RECORD_STYLE: Partial<PIXI.ITextStyle> = { fontFamily: 'Arial', fontSize: 20, fill: '#cccccc', align: 'left', wordWrap: true, wordWrapWidth: 380 };
const DEFAULT_NO_RECORDS_STYLE: Partial<PIXI.ITextStyle> = { fontFamily: 'Arial', fontSize: 24, fill: '#aaaaaa', align: 'center' };
const DEFAULT_PAGE_INDICATOR_STYLE: Partial<PIXI.ITextStyle> = { fontFamily: 'Arial', fontSize: 18, fill: '#ffffff', align: 'center' };

export class PixiHistoryPanel extends PIXI.Container {
    private config: IPixiHistoryPanelConfig;
    private eventManager: EventManager;
    private historyController: HistoryController;

    private backgroundSprite: PIXI.Sprite | PIXI.NineSlicePlane | null = null;
    private titleText: PIXI.Text | null = null;
    private recordsContainer: PIXI.Container | null = null; // For text objects of records
    private noRecordsText: PIXI.Text | null = null;
    private closeButton: PixiButton | null = null;
    private scrollMask: PIXI.Graphics | null = null; // For scrolling recordsContainer
    private prevButton: PixiButton | null = null;
    private nextButton: PixiButton | null = null;
    private pageIndicatorText: PIXI.Text | null = null;
    private currentPage: number = 0;

    // Store bound listeners
    private _boundHidePanel: () => void;
    private _onPrevPageClick: () => void;
    private _onNextPageClick: () => void;

    constructor(config: IPixiHistoryPanelConfig) {
        super();
        this.config = {
            recordsPerPage: 10, // Default records per page
            currencySymbol: '$',
            ...config
        };
        this.name = config.name;
        this.eventManager = EventManager.getInstance();
        this.historyController = HistoryController.getInstance();

        this._boundHidePanel = this.hidePanel.bind(this);
        this._onPrevPageClick = () => this.changePage(-1);
        this._onNextPageClick = () => this.changePage(1);

        this.initBackground();
        this.initTitle();
        this.initRecordsDisplayArea();
        this.initNavigationButtons(); // Will now include pagination buttons
        
        this.updateLayout(Globals.screenHeight > Globals.screenWidth);
        this.initEventHandlers();
        this.loadPage(0); // Load initial page
        
        this.visible = config.visibleOnInit ?? false;
        this.alpha = this.visible ? 1 : 0;
        console.log(`PixiHistoryPanel [${this.config.name}] Initialized`);
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
        console.warn(`PixiHistoryPanel [${this.config.name}]: Creating placeholder background.`);
        const gfx = new PIXI.Graphics();
        const panelWidth = this.config.layout.portrait.panelWidth || this.config.layout.landscape.panelWidth || 600;
        const panelHeight = this.config.layout.portrait.panelHeight || this.config.layout.landscape.panelHeight || 400;
        gfx.beginFill(0x1a1a1a, 0.9);
        gfx.drawRect(0,0, panelWidth, panelHeight);
        gfx.endFill();
        this.backgroundSprite = new PIXI.Sprite(Globals.app?.renderer.generateTexture(gfx));
        this.addChildAt(this.backgroundSprite, 0);
    }

    private initTitle(): void {
        const style = { ...DEFAULT_TITLE_STYLE, ...this.config.textStyles?.titleStyle };
        this.titleText = new PIXI.Text('Game History', style);
        this.titleText.anchor.set(0.5);
        this.addChild(this.titleText);
    }

    private initRecordsDisplayArea(): void {
        this.recordsContainer = new PIXI.Container();
        this.recordsContainer.interactive = true; // Enable interactivity for scroll events
        this.addChild(this.recordsContainer);

        const style = { ...DEFAULT_NO_RECORDS_STYLE, ...this.config.textStyles?.noRecordsTextStyle };
        this.noRecordsText = new PIXI.Text('No history available.', style);
        this.noRecordsText.anchor.set(0.5);
        this.noRecordsText.visible = false; // Only show if records are empty
        this.addChild(this.noRecordsText); // Add to main panel, position in layout
    }

    private initNavigationButtons(): void {
        // Close button (can also be part of this method)
        if (this.config.buttonConfigs.closeButton && !this.closeButton) { // Ensure not already created
             this.closeButton = new PixiButton(this.config.buttonConfigs.closeButton);
             this.addChild(this.closeButton);
        }

        if (this.config.buttonConfigs.prevButton) {
            this.prevButton = new PixiButton(this.config.buttonConfigs.prevButton);
            this.addChild(this.prevButton);
        }
        if (this.config.buttonConfigs.nextButton) {
            this.nextButton = new PixiButton(this.config.buttonConfigs.nextButton);
            this.addChild(this.nextButton);
        }
        // Page Indicator Text
        const pageIndicatorStyle = { ...DEFAULT_PAGE_INDICATOR_STYLE, ...this.config.textStyles?.pageIndicatorStyle };
        this.pageIndicatorText = new PIXI.Text('', pageIndicatorStyle);
        this.pageIndicatorText.anchor.set(0.5);
        this.addChild(this.pageIndicatorText);
        this.updateNavigationState(); // Initial state for nav buttons and text
    }

    private initEventHandlers(): void {
        if (this.closeButton) {
            const eventName = this.closeButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.closeButton.getNameKey()}`;
            this.eventManager.on(eventName as any, this._boundHidePanel);
        }
        if (this.prevButton) {
            const eventName = this.prevButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.prevButton.getNameKey()}`;
            this.eventManager.on(eventName as any, this._onPrevPageClick); // Use stored handler
        }
        if (this.nextButton) {
            const eventName = this.nextButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.nextButton.getNameKey()}`;
            this.eventManager.on(eventName as any, this._onNextPageClick); // Use stored handler
        }
        
        // Wheel scroll (can co-exist with pagination or be removed if pagination is primary)
        if (this.recordsContainer) {
            this.recordsContainer.on('wheel', this.onRecordsScroll, this);
        }
    }

    private onRecordsScroll(event: any): void {
        if (!this.recordsContainer || !this.scrollMask || !event.data || !event.data.originalEvent) return;

        const wheelEvent = event.data.originalEvent as WheelEvent;
        const scrollAmount = wheelEvent.deltaY * 0.5; 

        let newY = this.recordsContainer.y - scrollAmount;

        const maskHeight = this.scrollMask.height;
        const contentHeight = this.recordsContainer.height;

        if (contentHeight <= maskHeight) { 
            newY = 0;
        } else {
            const minY = maskHeight - contentHeight;
            const maxY = 0;
            newY = Math.max(minY, Math.min(newY, maxY));
        }
        this.recordsContainer.y = newY;
    }

    private clampRecordsContainerY(newY: number): number {
        if (!this.recordsContainer || !this.scrollMask) {
            // If either is null, we can't clamp properly, return original or 0 if container is also null.
            return this.recordsContainer ? newY : 0; 
        }
        
        // At this point, this.recordsContainer and this.scrollMask are guaranteed not to be null.
        const maskHeight = this.scrollMask.height; 
        const contentHeight = this.recordsContainer.height;
        let clampedY = newY;

        if (contentHeight <= maskHeight) { 
            clampedY = 0;
        } else {
            const minY = maskHeight - contentHeight;
            const maxY = 0;
            clampedY = Math.max(minY, Math.min(newY, maxY));
        }
        return clampedY;
    }

    public populateHistoryRecords(): void {
        if (!this.recordsContainer) return;

        const allRecords = this.historyController.getHistoryRecords();
        this.recordsContainer.removeChildren(); 

        if (allRecords.length === 0) {
            if (this.noRecordsText) this.noRecordsText.visible = true;
            this.updateNavigationState(); 
            return;
        }

        if (this.noRecordsText) this.noRecordsText.visible = false;

        const recordsPerPage = this.config.recordsPerPage || 10;
        const startIndex = this.currentPage * recordsPerPage;
        const endIndex = startIndex + recordsPerPage;
        const recordsToShow = allRecords.slice(startIndex, endIndex);

        const recordStyle = { ...DEFAULT_RECORD_STYLE, ...this.config.textStyles?.recordTextStyle };
        const currentIsPortrait = Globals.screenHeight > Globals.screenWidth;
        const currentLayoutConf = currentIsPortrait ? this.config.layout.portrait : this.config.layout.landscape;
        const lineHeight = currentLayoutConf.recordLineHeight ?? 25; // Default to 25 if not in config
        let currentY = 0;

        for (const record of recordsToShow) {
            const date = new Date(record.timestamp);
            const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
            let recordString = `Time: ${timeStr} | Bet: ${formatCurrency(record.betAmount, this.config.currencySymbol, 0)} | Win: ${formatCurrency(record.winAmount, this.config.currencySymbol, 2)}`;
            if (record.freeSpinsAwarded) recordString += ` | FS Won: ${record.freeSpinsAwarded}`;
            if (record.gamblePlayed) recordString += ` | Gamble: ${record.gambleWon ? 'Won' : 'Lost'} (${formatCurrency(record.gambleInitialWin || 0, this.config.currencySymbol,0)} -> ${formatCurrency(record.gambleFinalWin || 0, this.config.currencySymbol, 2)})`;
            
            const recordText = new PIXI.Text(recordString, recordStyle);
            recordText.y = currentY;
            this.recordsContainer.addChild(recordText);
            currentY += lineHeight; 
        }
        this.updateNavigationState(); 
    }

    public showPanel(): void { 
        if (this.visible && this.alpha === 1) return;
        this.currentPage = 0; // Reset to first page when shown
        this.populateHistoryRecords(); 
        this.updateNavigationState(); // Ensure nav buttons are correct on initial show
        this.visible = true; 
        
        const duration = this.config.showAnimation?.duration || 300;
        if (this.config.showAnimation?.type === 'fade' || !this.config.showAnimation) { 
            this.alpha = 0;
            new TWEEN.Tween(this).to({ alpha: 1 }, duration).easing(TWEEN.Easing.Quadratic.Out).start();
        } else {
            this.alpha = 1; 
        }
        this.eventManager.emit(GameEvent.UI_SHOW as any, {name: this.name, component: this}); 
        console.log(`PixiHistoryPanel [${this.config.name}] shown.`);
    }

    public hidePanel(): void { 
        if (!this.visible || this.alpha === 0) return;
        const duration = this.config.hideAnimation?.duration || 300;
        const onComplete = () => {
            this.visible = false;
            this.eventManager.emit(GameEvent.UI_HIDE as any, {name: this.name, component: this}); 
            console.log(`PixiHistoryPanel [${this.config.name}] hidden.`);
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
        if(this.closeButton && layoutConf.closeButtonPos) this.closeButton.position.set(layoutConf.closeButtonPos.x, layoutConf.closeButtonPos.y);
        
        if (this.recordsContainer && layoutConf.recordsContainerPos && layoutConf.recordsContainerSize) {
            this.recordsContainer.position.set(layoutConf.recordsContainerPos.x, layoutConf.recordsContainerPos.y);
            // Optional: Add a mask for scrolling if content exceeds recordsContainerSize.height
            if (!this.scrollMask) {
                this.scrollMask = new PIXI.Graphics();
                this.addChild(this.scrollMask); // Mask needs to be child of the masked object's parent
            }
            this.scrollMask.clear();
            this.scrollMask.beginFill(0xff0000, 0.3); // Visible for debugging mask area
            this.scrollMask.drawRect(layoutConf.recordsContainerPos.x, layoutConf.recordsContainerPos.y, layoutConf.recordsContainerSize.width, layoutConf.recordsContainerSize.height);
            this.scrollMask.endFill();
            this.recordsContainer.mask = this.scrollMask;
        }

        if(this.noRecordsText && layoutConf.noRecordsTextPos) {
             this.noRecordsText.position.set(layoutConf.noRecordsTextPos.x, layoutConf.noRecordsTextPos.y);
        } else if (this.noRecordsText && this.recordsContainer) {
            // Default position if not in layout: center in recordsContainer
            this.noRecordsText.x = (layoutConf.recordsContainerSize?.width || panelW) / 2;
            this.noRecordsText.y = (layoutConf.recordsContainerSize?.height || panelH) / 2;
        }
        console.log(`PixiHistoryPanel [${this.config.name}] Updated layout. Portrait: ${isPortrait}`);
    }
    
    public destroy(options?: PIXI.IDestroyOptions | boolean): void { 
        if (this.closeButton) {
            const eventName = this.closeButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.closeButton.getNameKey()}`;
            this.eventManager.off(eventName as any, this._boundHidePanel);
        }
        if (this.prevButton) {
            const eventName = this.prevButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.prevButton.getNameKey()}`;
            this.eventManager.off(eventName as any, this._onPrevPageClick);
        }
        if (this.nextButton) {
            const eventName = this.nextButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.nextButton.getNameKey()}`;
            this.eventManager.off(eventName as any, this._onNextPageClick);
        }
        if (this.recordsContainer) {
            this.recordsContainer.off('wheel', this.onRecordsScroll, this);
        }
        
        this.backgroundSprite?.destroy(options);
        this.titleText?.destroy(options);
        this.recordsContainer?.destroy({ children: true, texture: false, baseTexture: false }); 
        this.noRecordsText?.destroy(options);
        this.closeButton?.destroy(options);
        this.prevButton?.destroy(options);
        this.nextButton?.destroy(options);
        this.pageIndicatorText?.destroy(options);
        this.scrollMask?.destroy();

        console.log(`PixiHistoryPanel [${this.config.name}] destroyed.`); 
        super.destroy(options); 
    }

    private changePage(direction: number): void {
        const recordsPerPage = this.config.recordsPerPage || 10;
        const totalRecords = this.historyController.getHistoryRecords().length;
        if (totalRecords === 0 && recordsPerPage === 0) { // Avoid division by zero if no records and no items per page
             this.updateNavigationState();
             return;
        }
        const totalPages = Math.max(1, Math.ceil(totalRecords / recordsPerPage)); // Ensure at least 1 page even if no records

        const newPageIndex = this.currentPage + direction;

        if (newPageIndex >= 0 && newPageIndex < totalPages) {
            this.currentPage = newPageIndex;
            this.populateHistoryRecords(); // This will also call updateNavigationState
        } else {
            // Optionally provide feedback if trying to go beyond limits, or just do nothing
            this.updateNavigationState(); // Still ensure nav state is correct
        }
    }

    private updateNavigationState(): void {
        const recordsPerPage = this.config.recordsPerPage || 10;
        const totalRecords = this.historyController.getHistoryRecords().length;
        if (totalRecords === 0 && recordsPerPage === 0) { 
             if (this.prevButton) { this.prevButton.visible = false; this.prevButton.setEnabled(false);}
             if (this.nextButton) { this.nextButton.visible = false; this.nextButton.setEnabled(false);}
             if (this.pageIndicatorText) { this.pageIndicatorText.visible = false; }
             return;
        }
        const totalPages = Math.max(1, Math.ceil(totalRecords / recordsPerPage));

        if (this.prevButton) {
            this.prevButton.visible = totalPages > 1;
            this.prevButton.setEnabled(this.currentPage > 0);
        }
        if (this.nextButton) {
            this.nextButton.visible = totalPages > 1;
            this.nextButton.setEnabled(this.currentPage < totalPages - 1);
        }
        if (this.pageIndicatorText) {
            if (totalPages > 1) {
                this.pageIndicatorText.visible = true;
                this.pageIndicatorText.text = `Page ${this.currentPage + 1} of ${totalPages}`;
            } else {
                this.pageIndicatorText.visible = false;
            }
        }
    }

    private loadPage(page: number): void {
        // Implement page load logic
        console.log(`Loading page ${page}`);
    }
} 