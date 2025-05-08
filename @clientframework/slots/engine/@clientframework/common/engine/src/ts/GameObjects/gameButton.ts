import { PIXEL_PERFECT_BUTTONS } from '@specific/config';
import { globalGetIsPortrait } from '../globalGetIsPortrait';
import { eUserInputCommands } from '@slotsEngine/gameFlow/userInput/userInputCommands';

export default class GameButton {
    //public clicked: () => void;
    private textField: Phaser.GameObjects.Text;
    private spriteField: Phaser.GameObjects.Sprite;
    private backgroundSprite: Phaser.GameObjects.Sprite;

    get elements(): any[] {
        const retVal = [];
        this.textField && retVal.push(this.textField);
        this.spriteField && retVal.push(this.spriteField);
        this.backgroundSprite && retVal.push(this.backgroundSprite);

        return retVal;
    }

    onSamePlace: GameButton[] = [];

    private _selected = false;
    set selected(value) {
        this._selected = value;
        this.refreshDefaultFrames();
    }

    get selected(): boolean {
        return this._selected;
    }

    private image: string = null;
    private imageDown: string = null;
    private imageOver: string = null;
    private clickedOn = false;
    private buttonGrayScaled = false;
    private hasGrayScaleTexture = false;
    private spriteFieldName = '';

    constructor(
        private idKey: string,
        private idValue: any,
        private scene: Phaser.Scene,
        x: number,
        y: number,
        private imageLandscape: string,
        private imageDownLandscape: string,
        private imageOverLandscape: string,
        private textureKey: string = null,

        private imagePortrait: string = imageLandscape,
        private imageDownPortrait: string = imageDownLandscape,
        private imageOverPortrait: string = imageOverLandscape,

        private imageLandscapeSelected: string = imageLandscape,
        private imageDownLandscapeSelected: string = imageDownLandscape,
        private imageOverLandscapeSelected: string = imageOverLandscape,

        private imagePortraitSelected: string = imageLandscapeSelected,
        private imageDownPortraitSelected: string = imageDownLandscapeSelected,
        private imageOverPortraitSelected: string = imageOverLandscapeSelected,

        private isPixelPerfect = PIXEL_PERFECT_BUTTONS
    ) {
        this.image = imageLandscape;
        this.imageDown = imageDownLandscape;
        this.imageOver = imageOverLandscape;

        if (textureKey && textureKey != '') {
            this.backgroundSprite = scene.add.sprite(
                x,
                y,
                textureKey,
                this.image
            );

            if (
                !this.isPixelPerfect &&
                this.imagePortrait &&
                this.imagePortrait != ''
            ) {
                const w = this.backgroundSprite.width;
                this.backgroundSprite.setFrame(this.imagePortrait);
                const wp = this.backgroundSprite.width;
                if (w > wp) {
                    this.backgroundSprite.setFrame(this.image);
                }
            }
        } else {
            this.backgroundSprite = scene.add.sprite(x, y, this.image);
        }
        if (this.image === 'BetField') {
            this.backgroundSprite.setInteractive();
            this.backgroundSprite.input.hitArea.setTo(5, y, this.backgroundSprite.width - 16, this.backgroundSprite.height - 10);
        }
        this.backgroundSprite.setDepth(1);

        if (this.backgroundSprite.texture.getFrameNames().includes(this.image + '_disabled')) {
            this.hasGrayScaleTexture = true;
        }

        this.setEnable();

        this.scene.game.events.once(
            'event-init-button-events',
            () => {
                setTimeout(() => {
                    this.backgroundSprite.on('pointerdown', (e) => {
                        if (this.buttonGrayScaled || e.rightButtonDown()) {
                            return;
                        }
                        this.clickedOn = true;
                        this.setBackgroundTexture(this.imageDown);
                        this.holdingEnabled && this.startHolding();
                    });

                    this.backgroundSprite.on('pointerup', () => {
                        if (this.buttonGrayScaled) return;
                        if (this.clickedOn) {
                            if (
                                !this.holdingEnabled ||
                                (this.holdingEnabled && this.holdingEvent)
                            ) {
                                this.click();
                                this.clickedOn = false;
                            }

                            this.setBackgroundTexture(this.image);
                            this.stopHolding();
                        }
                    });

                    this.backgroundSprite.on('pointerover', () => {
                        if (this.buttonGrayScaled || navigator.userAgent.includes('Mobile')) {
                            return;
                        }

                        this.setBackgroundTexture(this.imageOver);
                        //this.stopHolding();
                    });

                    this.backgroundSprite.on('pointerout', () => {
                        if (this.buttonGrayScaled) return;
                        this.clickedOn = false;

                        this.setBackgroundTexture(this.image);
                        this.stopHolding();
                    });

                    /*this.scene.game.events.on(
                        `event-button-select-${this.idKey}`,
                        (arg: boolean) => {
                            this.selected = arg;
                        }
                    );*/

                    this.scene.game.events.on(
                        `event-button-select-${this.idKey}-by-val`,
                        (arg: number) => {
                            this.selected = this.idValue == arg;
                        }
                    );
                }, 200);
            },
            this
        );

        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.refreshDefaultFrames();
            }, 50);
        });

        this.scene.scale.on(
            Phaser.Scale.Events.ORIENTATION_CHANGE,
            () => this.refreshDefaultFrames(),
            this
        );
        this.refreshDefaultFrames();
    }

    click(): void {
        console.log(`event-button-clicked-${this.idKey}, ${this.idValue}`);
        this.scene.game.events.emit(
            `event-button-clicked-${this.idKey}`,
            this.idValue
        );
        this.scene.game.events.emit('event-button-clicked', this.idValue);
        this.scene.game.events.emit('event-button-clicked-new', this.idKey);
    }

    private setBackgroundTexture(image: string): void {
        //console.log("setBackgroundTexture(image: string", image)
        if (this.backgroundSprite) {
            if (this.textureKey != '') {
                this.backgroundSprite.setFrame(image ? image : this.image);
            } else {
                //console.log("this.backgroundSprite.setTexture", image?image:this.image)
                this.backgroundSprite.setTexture(image ? image : this.image);
            }
        }
    }

    private refreshDefaultFrames(): void {
        //console.log("ORIENTATION!!")
        let out: string, over: string, down: string;
        if (globalGetIsPortrait(this.scene)) {
            out = this.selected
                ? this.imagePortraitSelected
                : this.imagePortrait;
            over = this.selected
                ? this.imageOverPortraitSelected
                : this.imageOverPortrait;
            down = this.selected
                ? this.imageDownPortraitSelected
                : this.imageDownPortrait;
            //console.log("ORIENTATION!! port")
        } else {
            out = this.selected
                ? this.imageLandscapeSelected
                : this.imageLandscape;
            over = this.selected
                ? this.imageOverLandscapeSelected
                : this.imageOverLandscape;
            down = this.selected
                ? this.imageDownLandscapeSelected
                : this.imageDownLandscape;
        }

        if (this.imageDown && down) {
            this.imageDown = down;
        }
        if (this.imageOver && over) {
            this.imageOver = over;
        }
        if (this.image && out) {
            this.image = out;
        }
        //console.log(`refreshDefaultFrames ${this.image} ${this.imageDown} ${this.imageOver}`)
        if (this.hasGrayScaleTexture && this.buttonGrayScaled) {
            this.setBackgroundTexture(this.image + '_disabled');
        } else {
            this.setBackgroundTexture(this.image);
        }
    }

    _createTextLabel(
        text = 'A',
        style: Phaser.Types.GameObjects.Text.TextStyle /*= {
            fontSize: "35px",
            fontFamily: "Arial",
            align: "center",
            color: '#fff',
            stroke: '#000',
            strokeThickness: 5,
        }*/
    ): void {
        this.textField = new Phaser.GameObjects.Text(
            this.scene,
            this.backgroundSprite.x,
            this.backgroundSprite.y,
            text,
            style
        );
        this.textField.setOrigin(0.5);
        this.scene.add.existing(this.textField);
        this.textField.setDepth(1);
    }

    _createSpriteField(texture: string, frame: string): void {
        this.spriteField = new Phaser.GameObjects.Sprite(
            this.scene,
            this.backgroundSprite.x,
            this.backgroundSprite.y,
            texture,
            frame
        );
        this.spriteField.setOrigin(0.5);
        this.scene.add.existing(this.spriteField);
        this.spriteField.setDepth(1);
        this.spriteFieldName = frame;
    }

    _addTextLabel(textField: Phaser.GameObjects.Text): void {
        this.textField = textField;
        this.scene.add.existing(textField);
        if (this.textField.depth == 0) {
            this.textField.setDepth(1);
        }
    }

    _addSpriteField(sprite: Phaser.GameObjects.Sprite): void {
        this.spriteField = sprite;
        this.scene.add.existing(sprite);
        if (this.spriteField.depth == 0) {
            this.spriteField.setDepth(1);
        }
    }

    setText(text: string): void {
        this.textField && this.textField.setText(text);
    }

    setSpriteFieldFrame(frame: string): void {
        this.spriteField && this.spriteField.setFrame(frame);
    }

    private _xOffset = 0;
    get xOffset(): number {
        return this._xOffset;
    }

    set xOffset(value: number) {
        this._xOffset = value;
        this.setX(this._x);
    }

    private _xOffsetTextLabel = 0;
    get xOffsetTextLabel(): number {
        return this._xOffsetTextLabel;
    }

    set xOffsetTextLabel(value: number) {
        this._xOffsetTextLabel = value;
        this.setX(this._x);
    }
    setOrigin(x: number = 0.5, y: number = 0.5): void {
        this.textField.setOrigin(x, y)
    }
    private _yOffset = 0;
    get yOffset(): number {
        return this._yOffset;
    }

    set yOffset(value: number) {
        this._yOffset = value;
        this.setY(this._y);
    }

    private _yOffsetTextLabel = 0;
    get yOffsetTextLabel(): number {
        return this._yOffsetTextLabel;
    }

    set yOffsetTextLabel(value: number) {
        this._yOffsetTextLabel = value;
        this.setY(this._y);
    }

    private _x = 0;
    set x(value: number) {
        this.setX(value);
    }

    get x(): number {
        return this._x;
    }

    private _y = 0;
    set y(value: number) {
        this.setY(value);
    }

    get y(): number {
        return this._y;
    }

    setX(value: number): this {
        this._x = value;
        this.textField &&
            this.textField.setX(this._x + this.xOffset + this.xOffsetTextLabel);
        this.spriteField && this.spriteField.setX(this._x + this.xOffset);
        this.backgroundSprite &&
            this.backgroundSprite.setX(this._x + this.xOffset);
        return this;
    }

    setY(value: number): this {
        this._y = value;
        this.textField &&
            this.textField.setY(this._y + this.yOffset + this.yOffsetTextLabel);
        this.spriteField && this.spriteField.setY(this._y + this.yOffset);
        this.backgroundSprite &&
            this.backgroundSprite.setY(this._y + this.yOffset);
        return this;
    }

    get width(): number {
        return (
            this.backgroundSprite.width *
            this.scale *
            this.backgroundScaleFactorW
        );
    }

    get nonScaledWidth(): number {
        return this.backgroundSprite.width * this.backgroundScaleFactorW;
    }

    get height(): number {
        return Math.max(
            this.backgroundSprite.height *
            this.scale *
            this.backgroundScaleFactorH,
            this.textField ? this.textField.height : 0,
            this.spriteField ? this.spriteField.height : 0
        );
    }

    private _scale = 1;
    setScale(scale: number): void {
        this._scale = scale;
        this.backgroundSprite &&
            this.backgroundSprite.setScale(
                scale * this.backgroundScaleFactorW,
                scale * this.backgroundScaleFactorH
            );
        this.spriteField && this.spriteField.setScale(scale, scale);
        this.textField && this.textField.setScale(scale);
    }

    set scale(scale: number) {
        this.setScale(scale);
    }

    get scale(): number {
        return this._scale;
    }

    private _backgroundScaleFactorW = 1;
    private _backgroundScaleFactorH = 1;
    set backgroundScaleFactorW(value: number) {
        this._backgroundScaleFactorW = value;
        this.setScale(this.scale);
    }

    get backgroundScaleFactorW(): number {
        return this._backgroundScaleFactorW;
    }

    set backgroundScaleFactorH(value: number) {
        this._backgroundScaleFactorH = value;
        this.setScale(this.scale);
    }

    get backgroundScaleFactorH(): number {
        return this._backgroundScaleFactorH;
    }

    private _alive = true;
    get alive(): boolean {
        return this._alive;
    }

    kill(): void {
        this._alive = false;
        this.backgroundSprite &&
            this.backgroundSprite.setActive(false).setVisible(false);
        this.textField && this.textField.setActive(false).setVisible(false);
        this.spriteField && this.spriteField.setActive(false).setVisible(false);
    }

    revive(): void {
        this._alive = true;
        this.backgroundSprite &&
            this.backgroundSprite.setActive(true).setVisible(true);
        this.textField && this.textField.setActive(true).setVisible(true);
        this.spriteField && this.spriteField.setActive(true).setVisible(true);
        this.onSamePlace.forEach((button) => {
            button.kill();
        });
    }

    setAlpha(alpha: number): void {
        this.backgroundSprite && this.backgroundSprite.setAlpha(alpha);
        this.textField && this.textField.setAlpha(alpha);
        this.spriteField && this.spriteField.setAlpha(alpha);
    }

    get alpha(): number {
        if (this.backgroundSprite) {
            return this.backgroundSprite.alpha;
        }

        return 1;
    }

    get background(): Phaser.GameObjects.Sprite {
        return this.backgroundSprite;
    }

    private _enabled = false;
    get enabled(): boolean {
        return this._enabled;
    }

    set enabled(value: boolean) {
        this._setEnabled(value);
    }

    setDisable(): void {
        this._setEnabled(false);
    }

    setEnable(): void {
        this._setEnabled(true);
    }

    private _setEnabled(value: boolean): void {
        this.backgroundSprite &&
            (value
                ? this.backgroundSprite.setInteractive({
                    pixelPerfect: this.isPixelPerfect,
                })
                : this.backgroundSprite.disableInteractive());
        this._enabled = value;
    }

    private holdingTime = 1000;
    private holdingEnabled = false;
    private holdingEvent: Phaser.Time.TimerEvent = null;
    enableHolding(holdingTime_: number): void {
        this.holdingEnabled = true;
        this.holdingTime = holdingTime_;
        this.stopHolding();
    }

    disableHolding(): void {
        this.holdingEnabled = false;
        this.stopHolding();
    }

    private stopHolding(): void {
        if (this.holdingEvent) {
            console.log('stopHolding!!!');
            this.holdingEvent.remove(false);
            this.holdingEvent = null; //If true, the function of the Timer Event will be called before its removal.
        }
    }

    private startHolding(): void {
        console.log('STARTED HOLDING A');
        if (this.holdingEnabled) {
            this.stopHolding();
            console.log('STARTED HOLDING');
            this.holdingEvent = this.scene.time.addEvent({
                delay: this.holdingTime,
                callback: () => {
                    this.stopHolding();
                    console.log(
                        `HOLD!! event-button-hold-${this.idKey}, ${this.idValue}`
                    );
                    this.scene.game.events.emit(
                        `event-button-hold-${this.idKey}`,
                        this.idValue
                    );
                },
                callbackScope: this,
                loop: false,
            });
        }
    }

    grayScaleDisable(): void {
        if (this.hasGrayScaleTexture) {
            this.setBackgroundTexture(this.image + '_disabled');
            if (this.spriteField) {
                if (this.textureKey !== '') {
                    this.spriteField.setFrame(this.spriteFieldName + '_disabled');
                } else {
                    this.spriteField.setTexture(this.spriteFieldName + '_disabled');
                }
            }
            this.buttonGrayScaled = true;
        }
    }

    grayScaleEnable(): void {
        if (this.hasGrayScaleTexture && this.buttonGrayScaled) {
            this.setBackgroundTexture(this.image);
            if (this.spriteField) {
                if (this.textureKey !== '') {
                    this.spriteField.setFrame(this.spriteFieldName);
                } else {
                    this.spriteField.setTexture(this.spriteFieldName);
                }
            }
            this.buttonGrayScaled = false;
        }
    }
}
