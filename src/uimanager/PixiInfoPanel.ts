import * as PIXI from 'pixi.js';
import * as TWEEN from '@tweenjs/tween.js';
import { EventManager, GameEvent } from '../core/utils/EventManager';
import { Globals } from '../core/Global';
import { PixiButton, IPixiButtonConfig } from './PixiButton';
// May need to import PayTable or other data sources later

export interface IPixiInfoPanelLayoutConfig {
    titlePos?: { x: number, y: number };
    contentContainerPos?: { x: number, y: number };
    contentContainerSize?: { width: number, height: number };
    closeButtonPos?: { x: number, y: number };
    // Potentially Prev/Next buttons for multi-page info
    prevButtonPos?: { x: number, y: number };
    nextButtonPos?: { x: number, y: number };
    pageIndicatorPos?: { x: number, y: number };
    panelHeight?: number;
    panelWidth?: number;
}

export interface IPixiInfoPageData {
    title?: string; // Optional if panel has a main title
    content: PIXI.DisplayObject | string; // Can be a complex PIXI object (e.g., formatted paytable) or just a string
}

export interface IPixiInfoPanelConfig {
    name: string;
    backgroundTextureKey?: string;
    nineSliceConfig?: { leftWidth: number, topHeight: number, rightWidth: number, bottomHeight: number };
    layout: {
        portrait: IPixiInfoPanelLayoutConfig;
        landscape: IPixiInfoPanelLayoutConfig;
    };
    buttonConfigs: {
        closeButton: IPixiButtonConfig;
        prevButton?: IPixiButtonConfig;
        nextButton?: IPixiButtonConfig;
    };
    textStyles?: {
        titleStyle?: Partial<PIXI.ITextStyle>;
        contentTextStyle?: Partial<PIXI.ITextStyle>; // For simple string content
        pageIndicatorStyle?: Partial<PIXI.ITextStyle>;
    };
    pages: IPixiInfoPageData[]; // Array of pages to display
    panelTitle?: string; // An overall title for the panel itself
    visibleOnInit?: boolean;
    showAnimation?: { type: 'fade' | 'slide', duration?: number }; 
    hideAnimation?: { type: 'fade' | 'slide', duration?: number };
}

const DEFAULT_PANEL_TITLE_STYLE: Partial<PIXI.ITextStyle> = { fontFamily: 'Arial', fontSize: 36, fill: '#ffffff', align: 'center' };
const DEFAULT_CONTENT_TEXT_STYLE: Partial<PIXI.ITextStyle> = { fontFamily: 'Arial', fontSize: 20, fill: '#cccccc', align: 'left', wordWrap: true };

export class PixiInfoPanel extends PIXI.Container {
    private config: IPixiInfoPanelConfig;
    private eventManager: EventManager;

    private backgroundSprite: PIXI.Sprite | PIXI.NineSlicePlane | null = null;
    private panelTitleText: PIXI.Text | null = null; // Overall panel title
    private contentContainer: PIXI.Container | null = null; // Holds the current page's content
    private closeButton: PixiButton | null = null;
    private prevButton: PixiButton | null = null;
    private nextButton: PixiButton | null = null;
    private pageIndicatorText: PIXI.Text | null = null;
    private scrollMask: PIXI.Graphics | null = null; 

    private currentPageIndex: number = 0;

    private _boundHidePanel: () => void;
    private _onPrevPage: () => void;
    private _onNextPage: () => void;

    constructor(config: IPixiInfoPanelConfig) {
        super();
        this.config = config;
        this.name = config.name;
        this.eventManager = EventManager.getInstance();

        this._boundHidePanel = this.hidePanel.bind(this);
        this._onPrevPage = () => this.changePage(-1);
        this._onNextPage = () => this.changePage(1);

        this.initBackground();
        this.initTitle();
        this.initContentArea();
        this.initNavigationButtons();
        
        this.updateLayout(Globals.screenHeight > Globals.screenWidth);
        this.initEventHandlers();
        this.loadPage(0);
        
        this.visible = config.visibleOnInit ?? false;
        this.alpha = this.visible ? 1 : 0;
        console.log(`PixiInfoPanel [${this.config.name}] Initialized`);
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
        console.warn(`PixiInfoPanel [${this.config.name}]: Creating placeholder background.`);
        const gfx = new PIXI.Graphics();
        const panelWidth = this.config.layout.portrait.panelWidth || this.config.layout.landscape.panelWidth || 800;
        const panelHeight = this.config.layout.portrait.panelHeight || this.config.layout.landscape.panelHeight || 600;
        gfx.beginFill(0x111122, 0.95); 
        gfx.drawRect(0,0, panelWidth, panelHeight);
        gfx.endFill();
        this.backgroundSprite = new PIXI.Sprite(Globals.app?.renderer.generateTexture(gfx));
        this.addChildAt(this.backgroundSprite, 0);
    }

    private initTitle(): void {
        if (this.config.panelTitle) {
            const style = { ...DEFAULT_PANEL_TITLE_STYLE, ...this.config.textStyles?.titleStyle };
            this.panelTitleText = new PIXI.Text(this.config.panelTitle, style);
            this.panelTitleText.anchor.set(0.5);
            this.addChild(this.panelTitleText);
        }
    }

    private initContentArea(): void {
        this.contentContainer = new PIXI.Container();
        this.addChild(this.contentContainer);

        // Scroll Mask - its position and size will be set in updateLayout
        this.scrollMask = new PIXI.Graphics();
        this.addChild(this.scrollMask); // Mask must be a child of the object it's masking OR its parent
        this.contentContainer.mask = this.scrollMask;
    }

    private initNavigationButtons(): void {
        this.closeButton = new PixiButton(this.config.buttonConfigs.closeButton);
        this.addChild(this.closeButton);

        if (this.config.buttonConfigs.prevButton) {
            this.prevButton = new PixiButton(this.config.buttonConfigs.prevButton);
            this.prevButton.visible = false; // Initially hidden, shown based on page index
            this.addChild(this.prevButton);
        }
        if (this.config.buttonConfigs.nextButton) {
            this.nextButton = new PixiButton(this.config.buttonConfigs.nextButton);
            this.nextButton.visible = false; // Initially hidden
            this.addChild(this.nextButton);
        }
        if (this.config.pages.length > 1) {
            const style = { ...DEFAULT_CONTENT_TEXT_STYLE, ...this.config.textStyles?.pageIndicatorStyle }; // Reuse content style or specific page indicator style
            this.pageIndicatorText = new PIXI.Text('', style);
            this.pageIndicatorText.anchor.set(0.5);
            this.addChild(this.pageIndicatorText);
        }
    }

    private initEventHandlers(): void {
        if (this.closeButton) {
            const eventName = this.closeButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.closeButton.getNameKey()}`;
            this.eventManager.on(eventName as any, this._boundHidePanel);
        }
        if (this.prevButton) {
            const eventName = this.prevButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.prevButton.getNameKey()}`;
            this.eventManager.on(eventName as any, this._onPrevPage);
        }
        if (this.nextButton) {
            const eventName = this.nextButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.nextButton.getNameKey()}`;
            this.eventManager.on(eventName as any, this._onNextPage);
        }
    }

    private loadPage(pageIndex: number): void {
        if (!this.contentContainer || pageIndex < 0 || pageIndex >= this.config.pages.length) {
            return;
        }
        this.currentPageIndex = pageIndex;
        this.contentContainer.removeChildren(); // Clear previous page content

        const pageData = this.config.pages[this.currentPageIndex];
        if (pageData) {
            if (typeof pageData.content === 'string') {
                const style = { ...DEFAULT_CONTENT_TEXT_STYLE, ...this.config.textStyles?.contentTextStyle };
                // Adjust wordWrapWidth if contentContainer has a defined size in layout
                const layoutConf = Globals.screenHeight > Globals.screenWidth ? this.config.layout.portrait : this.config.layout.landscape;
                if (layoutConf.contentContainerSize?.width) {
                    style.wordWrapWidth = layoutConf.contentContainerSize.width - 20; // Small padding
                }
                const contentText = new PIXI.Text(pageData.content, style);
                this.contentContainer.addChild(contentText);
            } else if (pageData.content instanceof PIXI.DisplayObject) {
                this.contentContainer.addChild(pageData.content);
            }
        }
        this.updateNavigationState();
    }

    private changePage(direction: number): void {
        const newIndex = this.currentPageIndex + direction;
        if (newIndex >= 0 && newIndex < this.config.pages.length) {
            this.loadPage(newIndex);
        }
    }

    private updateNavigationState(): void {
        const numPages = this.config.pages.length;
        if (this.prevButton) {
            this.prevButton.visible = numPages > 1;
            this.prevButton.setEnabled(this.currentPageIndex > 0);
        }
        if (this.nextButton) {
            this.nextButton.visible = numPages > 1;
            this.nextButton.setEnabled(this.currentPageIndex < numPages - 1);
        }
        if (this.pageIndicatorText) {
            if (numPages > 1) {
                this.pageIndicatorText.visible = true;
                this.pageIndicatorText.text = `Page ${this.currentPageIndex + 1} of ${numPages}`;
            } else {
                this.pageIndicatorText.visible = false;
            }
        }
    }

    public showPanel(): void { 
        if (this.visible && this.alpha === 1) return;
        // Ensure the first page is loaded and nav state is correct before showing
        this.loadPage(this.currentPageIndex); // Or always default to page 0: this.loadPage(0);
        this.updateNavigationState(); 
        this.visible = true; 
        
        const duration = this.config.showAnimation?.duration || 300;
        if (this.config.showAnimation?.type === 'fade' || !this.config.showAnimation) { 
            this.alpha = 0;
            new TWEEN.Tween(this).to({ alpha: 1 }, duration).easing(TWEEN.Easing.Quadratic.Out).start();
        } else {
            // TODO: Implement other show animations like 'slide'
            this.alpha = 1; 
        }
        this.eventManager.emit(GameEvent.UI_SHOW as any, {name: this.name, component: this}); 
        console.log(`PixiInfoPanel [${this.config.name}] shown.`);
    }

    public hidePanel(): void { 
        if (!this.visible || this.alpha === 0) return;
        const duration = this.config.hideAnimation?.duration || 300;
        const onComplete = () => {
            this.visible = false;
            this.eventManager.emit(GameEvent.UI_HIDE as any, {name: this.name, component: this}); 
            console.log(`PixiInfoPanel [${this.config.name}] hidden.`);
        };

        if (this.config.hideAnimation?.type === 'fade' || !this.config.hideAnimation) { 
            new TWEEN.Tween(this).to({ alpha: 0 }, duration).easing(TWEEN.Easing.Quadratic.In).onComplete(onComplete).start();
        } else {
            // TODO: Implement other hide animations like 'slide'
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

        if(this.panelTitleText && layoutConf.titlePos) this.panelTitleText.position.set(layoutConf.titlePos.x, layoutConf.titlePos.y);
        if(this.closeButton && layoutConf.closeButtonPos) this.closeButton.position.set(layoutConf.closeButtonPos.x, layoutConf.closeButtonPos.y);
        
        if (this.contentContainer && layoutConf.contentContainerPos && layoutConf.contentContainerSize) {
            this.contentContainer.position.set(layoutConf.contentContainerPos.x, layoutConf.contentContainerPos.y);
            if (this.scrollMask) {
                this.scrollMask.clear();
                this.scrollMask.beginFill(0xff0000, 0.0); // Set alpha to 0 for invisible mask
                this.scrollMask.drawRect(0, 0, layoutConf.contentContainerSize.width, layoutConf.contentContainerSize.height);
                this.scrollMask.endFill();
                // Position mask relative to contentContainer's parent (which is this panel)
                this.scrollMask.x = layoutConf.contentContainerPos.x;
                this.scrollMask.y = layoutConf.contentContainerPos.y;
                this.contentContainer.mask = this.scrollMask;
            }
             // Update wordWrapWidth for text content based on new container size
            const pageData = this.config.pages[this.currentPageIndex];
            if (pageData && typeof pageData.content === 'string' && this.contentContainer.children[0] instanceof PIXI.Text) {
                const textContent = this.contentContainer.children[0] as PIXI.Text;
                const style = textContent.style as PIXI.TextStyle;
                style.wordWrapWidth = layoutConf.contentContainerSize.width - 20; // small padding
                textContent.style = style; // Re-assign to trigger redraw
            }
        }

        if(this.prevButton && layoutConf.prevButtonPos) this.prevButton.position.set(layoutConf.prevButtonPos.x, layoutConf.prevButtonPos.y);
        if(this.nextButton && layoutConf.nextButtonPos) this.nextButton.position.set(layoutConf.nextButtonPos.x, layoutConf.nextButtonPos.y);
        if(this.pageIndicatorText && layoutConf.pageIndicatorPos) this.pageIndicatorText.position.set(layoutConf.pageIndicatorPos.x, layoutConf.pageIndicatorPos.y);
        
        console.log(`PixiInfoPanel [${this.config.name}] Updated layout. Portrait: ${isPortrait}`);
    }
    
    public destroy(options?: PIXI.IDestroyOptions | boolean): void { 
        if (this.closeButton) {
            const eventName = this.closeButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.closeButton.getNameKey()}`;
            this.eventManager.off(eventName as any, this._boundHidePanel);
        }
        if (this.prevButton) {
            const eventName = this.prevButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.prevButton.getNameKey()}`;
            this.eventManager.off(eventName as any, this._onPrevPage);
        }
        if (this.nextButton) {
            const eventName = this.nextButton.getCustomClickEventName() || `${GameEvent.UI_BUTTON_CLICKED_BASE}_${this.nextButton.getNameKey()}`;
            this.eventManager.off(eventName as any, this._onNextPage);
        }
        
        this.backgroundSprite?.destroy(options);
        this.panelTitleText?.destroy(options);
        this.contentContainer?.destroy({ children: true, texture: true, baseTexture: true });
        this.closeButton?.destroy(options);
        this.prevButton?.destroy(options);
        this.nextButton?.destroy(options);
        this.pageIndicatorText?.destroy(options);
        this.scrollMask?.destroy();

        console.log(`PixiInfoPanel [${this.config.name}] destroyed.`); 
        super.destroy(options); 
    }
} 