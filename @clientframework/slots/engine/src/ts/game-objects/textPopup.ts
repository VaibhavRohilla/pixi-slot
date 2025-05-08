import { getCurrencyFormat } from '@clientframework/common/backend-service/src/launchParams/currency';
import { getUrlDenomination } from '@clientframework/common/backend-service/src/launchParams/denomination';
import { CURRENCY } from '@specific/dataConfig';
import { STATUSPANEL_TEXT_FIELD_MAX_LENGTH } from '../dataPresenter/defaultConfigSlot';

export class TextPopup {
    private text: Phaser.GameObjects.Text | Phaser.GameObjects.BitmapText;
    private amount: number;
    private scaleFactor = 1;
    private currentScale = 1;
    private _x = 0;
    private _y = 0;

    private isPlayingAlternate = false;
    private isUsingAdditionalScaling = false;

    protected showingTween: Phaser.Tweens.Tween;
    protected isBitmapFont = false;
    constructor(
        private scene: Phaser.Scene,
        private _nameKey: string,
        x: number,
        y: number,
        private disappearing: boolean = true,
        style?: any,
        bitmapFontTextureKey?: string,
        private currency = ` ${CURRENCY}`,
        private alternateScaleFactor: number = 1,
        private additionalScaleFactor: number = 1
    ) {
        if (bitmapFontTextureKey) {
            this.text = scene.add.bitmapText(
                x,
                y,
                bitmapFontTextureKey,
                getCurrencyFormat(100, CURRENCY)
            );
            //this.text.setCenterAlign();
            //this.currency = `${CURRENCY}`;
            this.isBitmapFont = true;
        } else {
            let defaultStyle = false;
            if (!style) {
                defaultStyle = true;
                style = {
                    font: '200px Arial',
                    align: 'center',
                    color: '#ff0',
                    stroke: '#000',
                    strokeThickness: 16,
                };
            }

            this.text = scene.add.text(x, y, getCurrencyFormat(100, this.currency), style);

            if (defaultStyle) {
                //this.text.setStroke('#00f', 16);
                this.text.setShadow(2, 2, '#333333', 2, true, true);
                this.text.setTint(0xffff00, 0xffaa00, 0xffaa00, 0xffff00);
            }
        }
        this.text.setOrigin(0, 0);
        this.text.setDepth(100);
        if (this.disappearing) {
            this.turnOff();
        }

        scene.game.events.on(
            `event-start-textPopup-${this._nameKey}`,
            this.show,
            this
        );
        if (this.disappearing) {
            scene.game.events.on(
                `event-stop-textPopup-${this._nameKey}`,
                (duration = 500) => this.turnOff(duration),
                this
            );
        }
    }

    public setOrigin(xx: number, yy: number): void {
        this.text.setOrigin(xx, yy);
    }

    get width(): number {
        return this.text.width * (this.scaleFactor * this.currentScale);
    }

    get height(): number {
        return this.text.height * (this.scaleFactor * this.currentScale);
    }

    get nonScaledWidth(): number {
        return this.text.width;
    }

    get nonScaledHeight(): number {
        return this.text.height;
    }

    get x(): number {
        return this._x;
    }

    set x(xx: number) {
        this._x = xx;
        this.setTextPosition(this.x, this.y);
    }

    get y(): number {
        return this._y;
    }

    set y(yy: number) {
        this._y = yy;
        this.setTextPosition(this.x, this.y);
    }

    setTextPosition(x: number, y: number, scale?: number): void {
        this._x = x;
        this._y = y;
        this.setScale(scale !== undefined ? scale : this.scaleFactor);
    }

    setScale(scale: number): number {
        this.scaleFactor = scale;
        const newScale =
            this.scaleFactor *
            this.currentScale *
            (this.isPlayingAlternate ? this.alternateScaleFactor : 1) *
            (this.isUsingAdditionalScaling ? this.additionalScaleFactor : 1);

        this.text.setScale(newScale);
        this.text.setPosition(this._x, this._y);
        if (this.isBitmapFont) {
            this.text.x -= this.text.width / 2;
            this.text.y -= this.text.height / 4;
        } else {
            this.text.x -= (newScale * this.text.width) / 2;
            this.text.y -= (newScale * this.text.height) / 2;
        }

        return newScale;
    }

    setValue(amount: number): void {
        const txt = getCurrencyFormat(amount, this.currency);
        this.text.setText(txt);
        if (
            STATUSPANEL_TEXT_FIELD_MAX_LENGTH > 0 &&
            this.text.text.length > STATUSPANEL_TEXT_FIELD_MAX_LENGTH
        ) {
            this.setScale(
                (this.currentScale * STATUSPANEL_TEXT_FIELD_MAX_LENGTH) /
                    this.text.text.length
            );
        }
        this.setTextPosition(this.x, this.y, this.scaleFactor);
    }

    setText(txt: string | number): void {
        this.text.setText(txt.toString());
        this.setTextPosition(this.x, this.y, this.scaleFactor);
    }

    getText(): string {
        return this.text.text;
    }

    private show(
        toAmount = -1,
        fromAmount?: number,
        shouldReFade = true,
        showOnReels = true,
        showAlt = false,
        useAdditionalScaling = false
    ): void {
        this.isPlayingAlternate = showAlt;
        this.isUsingAdditionalScaling = useAdditionalScaling;

        this.text.setActive(showOnReels).setVisible(showOnReels);
        if (shouldReFade) {
            this.text.setAlpha(0).setScale(0, 0);
            this.showingTween && this.showingTween.stop();

            this.showingTween = this.scene.add.tween({
                targets: this.text,
                duration: 1000,
                alpha: '1',
                ease: 'Linear',
            });
            const tweenScale = this.scene.add.tween({
                targets: this.text,
                duration: 300,
                scaleX: 1,
                scaleY: 1,
                ease: 'Linear',
                onUpdate: () => {
                    this.currentScale = tweenScale.getValue();
                    this.setTextPosition(this.x, this.y, this.scaleFactor);
                },
                onComplete: () => {
                    this.currentScale = 1;
                    this.setTextPosition(this.x, this.y, this.scaleFactor);
                },
            });
        } else {
            this.setTextPosition(this.x, this.y, this.scaleFactor);
            //this.text.setAlpha(1).setScale(1, 1);
        }
        if (toAmount >= 0) {
            if (fromAmount != toAmount && typeof fromAmount !== 'undefined') {
                this.scene.game.events.emit(
                    `event-count-start-textPopup-${this._nameKey}`
                );
                this.scene.game.events.emit('event-count-start-textPopup-any');
                const tweenCounter = this.scene.tweens.addCounter({
                    from: fromAmount,
                    to: toAmount,
                    duration: 1000,
                    onUpdate: () => {
                        const txt =
                            getCurrencyFormat(tweenCounter.getValue(), this.currency);
                        this.text.setText(txt);
                        this.setTextPosition(this.x, this.y, this.scaleFactor);
                    },
                    onComplete: () => {
                        this.scene.game.events.emit(
                            `event-count-end-textPopup-${this._nameKey}`,
                            this.turnOff,
                            this
                        );
                        this.scene.game.events.emit(
                            'event-count-end-textPopup-any'
                        );
                    },
                });
            } else {
                const txt = getCurrencyFormat(toAmount, this.currency);
                this.text.setText(txt);
            }
        }
    }

    turnOn() {
        this.text.setActive(true).setVisible(true).setAlpha(1);
        this.currentScale = 1;
        this.setTextPosition(this.x, this.y, this.scaleFactor);
    }

    turnOff(duration = 0): void {
        if (duration > 0) {
            this.showingTween && this.showingTween.stop();
            this.showingTween = this.scene.add.tween({
                targets: this.text,
                duration: duration,
                alpha: '0',
                ease: 'Linear',
                onComplete: () => {
                    this.text.setActive(false).setVisible(false).setAlpha(1);
                },
            });
        } else {
            this.text.setActive(false).setVisible(false).setAlpha(1);
        }
    }
}
