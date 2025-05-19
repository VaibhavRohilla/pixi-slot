import { Container, Text, TextStyle, ITextStyle, Graphics, IDestroyOptions } from 'pixi.js';
import * as TWEEN from '@tweenjs/tween.js';
import { formatCurrency } from '../core/utils/formatting';

export interface IPixiTextPopupOptions {
    initialText?: string;
    style?: Partial<ITextStyle>;
    x?: number;
    y?: number;
    anchorX?: number;
    anchorY?: number;
    visible?: boolean;
    currencySymbol?: string;
    maxWidth?: number;
    showScaleAnimation?: boolean;
    background?: {
        color?: number;
        alpha?: number;
        padding?: number;
        cornerRadius?: number;
    } | boolean;
}

const DEFAULT_TEXT_POPUP_STYLE: Partial<ITextStyle> = {
    fontFamily: 'Arial',
    fontSize: 70,
    fill: '#ffffff',
    stroke: '#000000',
    strokeThickness: 6,
    align: 'center',
};

const DEFAULT_BACKGROUND_OPTIONS = {
    color: 0x000000,
    alpha: 0.7,
    padding: 10,
    cornerRadius: 15
};

export class PixiTextPopup extends Container {
    private textObject: Text;
    private backgroundGraphic: Graphics | null = null;
    private options: IPixiTextPopupOptions;
    private fullBackgroundOptions: typeof DEFAULT_BACKGROUND_OPTIONS | null = null;

    private currencySymbol: string;
    private currentAmount: number = 0;
    private activeCounterTween: TWEEN.Tween<any> | null = null;

    private baseScaleX: number = 1;
    private baseScaleY: number = 1;
    private autoScaleFactor: number = 1;

    constructor(options: IPixiTextPopupOptions = {}) {
        super();
        this.options = { 
            ...{ 
                visible: false, x: 0, y: 0, anchorX: 0.5, anchorY: 0.5, 
                currencySymbol: '$', maxWidth: 0, showScaleAnimation: true, background: false 
            }, 
            ...options 
        };

        if (this.options.background) {
            if (typeof this.options.background === 'boolean') {
                this.fullBackgroundOptions = { ...DEFAULT_BACKGROUND_OPTIONS };
            } else {
                this.fullBackgroundOptions = { ...DEFAULT_BACKGROUND_OPTIONS, ...this.options.background };
            }
            this.backgroundGraphic = new Graphics();
            this.addChild(this.backgroundGraphic);
        }

        const style = new TextStyle({...DEFAULT_TEXT_POPUP_STYLE, ...this.options.style});
        this.textObject = new Text(this.options.initialText || '', style);
        
        this.textObject.anchor.set(this.options.anchorX, this.options.anchorY);
        this.addChild(this.textObject);

        this.x = this.options.x || 0;
        this.y = this.options.y || 0;
        this.visible = this.options.visible || false;

        this.currencySymbol = this.options.currencySymbol || '';

        if (this.options.initialText) {
            this.setText(this.options.initialText);
        } else if (this.backgroundGraphic) {
            this._drawBackground();
        }
        if (!this.options.visible) {
            this.alpha = 0;
        }
        
        console.log('PixiTextPopup Initialized', this.options);
    }

    private _applyCombinedScale(): void {
        const newScaleX = this.baseScaleX * this.autoScaleFactor;
        const newScaleY = this.baseScaleY * this.autoScaleFactor;

        this.scale.set(newScaleX, newScaleY);
        
        if (this.backgroundGraphic) {
            this._drawBackground();
        } 
    }

    private _checkAndApplyAutoSize(): void {
        if (!this.options.maxWidth || this.options.maxWidth <= 0) {
            this.autoScaleFactor = 1;
            this._applyCombinedScale();
            return;
        }

        const currentContainerScaleX = this.scale.x;
        const currentContainerScaleY = this.scale.y;
        this.scale.set(this.baseScaleX, this.baseScaleY);

        const currentTextWidth = this.textObject.width;
        if (currentTextWidth > this.options.maxWidth) {
            this.autoScaleFactor = this.options.maxWidth / currentTextWidth;
        } else {
            this.autoScaleFactor = 1;
        }
        this.scale.set(currentContainerScaleX, currentContainerScaleY);
        this._applyCombinedScale();
    }

    public setText(text: string): void {
        this.textObject.text = text;
        this._checkAndApplyAutoSize();
        this._drawBackground();
    }

    public setValue(amount: number, animate: boolean = false, isTurbo?: boolean): void {
        const targetAmount = amount;
        
        if (this.activeCounterTween) {
            this.activeCounterTween.stop();
            this.activeCounterTween = null;
        }

        this.currentAmount = targetAmount; 

        if (animate && this.textObject.text !== formatCurrency(targetAmount, this.currencySymbol)) {
            const counter = { value: parseFloat(this.textObject.text.replace(this.currencySymbol, '')) || 0 };
            if (isNaN(counter.value)) counter.value = 0;

            const animationDuration = isTurbo ? 500 : 1000; // Adjust duration based on turbo

            this.activeCounterTween = new TWEEN.Tween(counter)
                .to({ value: targetAmount }, animationDuration)
                .easing(TWEEN.Easing.Linear.None) 
                .onUpdate(() => {
                    this.setText(formatCurrency(counter.value, this.currencySymbol));
                })
                .onComplete(() => {
                    this.activeCounterTween = null;
                    this.setText(formatCurrency(targetAmount, this.currencySymbol));
                })
                .start();
        } else {
            this.setText(formatCurrency(targetAmount, this.currencySymbol));
        }
    }

    public show(animated: boolean = true, duration: number = 300): void {
        this._drawBackground();
        this.visible = true;
        const finalAlpha = 1;
        const initialAlpha = animated ? 0 : finalAlpha;
        const currentScaleX = this.scale.x;
        const currentScaleY = this.scale.y;
        const initialScaleX = animated && this.options.showScaleAnimation ? currentScaleX * 0.5 : currentScaleX;
        const initialScaleY = animated && this.options.showScaleAnimation ? currentScaleY * 0.5 : currentScaleY;

        this.alpha = initialAlpha;
        this.scale.set(initialScaleX, initialScaleY);

        if (animated) {
            new TWEEN.Tween(this)
                .to({ alpha: finalAlpha, scaleX: currentScaleX, scaleY: currentScaleY }, duration)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onComplete(() => {
                    this.alpha = finalAlpha;
                    this.scale.set(currentScaleX, currentScaleY);
                })
                .start();
        } else {
            this.alpha = finalAlpha;
            this.scale.set(currentScaleX, currentScaleY);
        }
    }

    public hide(animated: boolean = true, duration: number = 300): void {
        if (this.activeCounterTween) { 
            this.activeCounterTween.stop();
            this.activeCounterTween = null;
            this.setText(formatCurrency(this.currentAmount, this.currencySymbol)); 
        }

        const finalAlpha = 0;
        const initialAlpha = this.alpha;
        const currentScaleX = this.scale.x;
        const currentScaleY = this.scale.y;
        const finalScaleX = animated && this.options.showScaleAnimation ? currentScaleX * 0.5 : currentScaleX;
        const finalScaleY = animated && this.options.showScaleAnimation ? currentScaleY * 0.5 : currentScaleY;

        if (animated) {
            new TWEEN.Tween(this)
                .to({ alpha: finalAlpha, scaleX: finalScaleX, scaleY: finalScaleY }, duration)
                .easing(TWEEN.Easing.Quadratic.In)
                .onComplete(() => {
                    this.visible = false;
                    this.alpha = finalAlpha; 
                    this.scale.set(currentScaleX, currentScaleY);
                })
                .start();
        } else {
            this.visible = false;
            this.alpha = finalAlpha;
        }
    }

    public setScale(scale: number): void {
        this.baseScaleX = scale;
        this.baseScaleY = scale;
        this._applyCombinedScale();
    }

    public getTextWidth(): number {
        return this.textObject.width * this.autoScaleFactor * this.baseScaleX;
    }

    public getTextHeight(): number {
        return this.textObject.height * this.autoScaleFactor * this.baseScaleY;
    }

    public setAnchor(x: number, y?: number): void {
        this.textObject.anchor.set(x, y === undefined ? x : y);
        this._drawBackground(); 
    }

    public destroy(options?: IDestroyOptions | boolean): void {
        if (this.activeCounterTween) {
            this.activeCounterTween.stop();
        }
        super.destroy(options);
    }

    private _drawBackground(): void {
        if (!this.backgroundGraphic || !this.fullBackgroundOptions) return;

        this.backgroundGraphic.clear();
        const textTrueWidth = this.textObject.width / this.textObject.scale.x;
        const textTrueHeight = this.textObject.height / this.textObject.scale.y;
        const padding = this.fullBackgroundOptions.padding;

        const bgWidth = textTrueWidth + padding * 2;
        const bgHeight = textTrueHeight + padding * 2;

        this.backgroundGraphic.beginFill(this.fullBackgroundOptions.color, this.fullBackgroundOptions.alpha);
        this.backgroundGraphic.drawRoundedRect(0, 0, bgWidth, bgHeight, this.fullBackgroundOptions.cornerRadius);
        this.backgroundGraphic.endFill();

        const textAnchorX = this.textObject.anchor.x;
        const textAnchorY = this.textObject.anchor.y;

        this.backgroundGraphic.pivot.set(0,0);
        this.backgroundGraphic.x = this.textObject.x - (textAnchorX * bgWidth) + (textAnchorX - 0.5) * (bgWidth - textTrueWidth);
        this.backgroundGraphic.y = this.textObject.y - (textAnchorY * bgHeight) + (textAnchorY - 0.5) * (bgHeight - textTrueHeight);

        this.backgroundGraphic.pivot.set(bgWidth * textAnchorX, bgHeight * textAnchorY);
        this.backgroundGraphic.position.set(this.textObject.x, this.textObject.y);
    }
} 