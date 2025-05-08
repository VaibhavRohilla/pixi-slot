import { generatePopupBackgroundTexture } from '../../factory/generatePopupBackgroundTexture';
import GameButton from '../gameButton';
import { IPointData } from '@clientframework/slots/engine/src/ts/dataPresenterVisual/iPointData';
import { createPopupButton, basePopupStyle } from '@specific/config';
import { CURRENCY } from '@specific/dataConfig';
import { globalGetIsPortrait } from '../../globalGetIsPortrait';
import { ButtonsGrid } from './buttonsGrid';
import { getUrlDenomination } from '@clientframework/common/backend-service/src/launchParams/denomination';
import { getCurrencyFormat } from '@clientframework/common/backend-service/src/launchParams/currency';

export let noBasePopup = true;
export default class BasePopup {
    bg: Phaser.GameObjects.Sprite;
    protected bgRotationLocked = false;
    protected bgDefaultAngle = 0;
    protected bgInvisible = true;

    protected bgAlpha = 1;
    protected buttons: GameButton[];
    protected title: Phaser.GameObjects.Text;
    protected buttonsGrid: ButtonsGrid;
    protected closePopupButton: GameButton;
    protected allElements: (
        | Phaser.GameObjects.Text
        | Phaser.GameObjects.Sprite
    )[] = [];

    protected usedTitleOffsetMultiplier: IPointData = null;
    protected showTween: Phaser.Tweens.Tween;

    protected popupActive = false;

    protected onOffOnSameButton = false;

    protected hasCloseButton = false;

    protected additionalButtonsOffsetY = 0;

    constructor(
        protected eventKeyId,
        protected scene: Phaser.Scene,
        x: number,
        y: number,
        protected valueLevels: number[],
        useCurrencyFormat = true,
        protected titleText = '',
        protected titleOffsetMultiplier: IPointData = { x: 0, y: 1 },
        protected alternativeTitleText = '',
        protected alternativeTitleOffsetMultiplier: IPointData = { x: 0, y: 1 },
        columnsLandscape = 3,
        columnsPortrait = 2,
        portraitScale = 1,
        landscapeScale = 1,
        externalButtons: GameButton[] = null,
        widthSpaceBetweenButtonsFactor?: number,
        heightSpaceBetweenButtonsFactor?: number,
        protected titleLeftAlign: boolean = false,
        titleFontSize = 100,
        protected titleOffsetMultiplierPortrait: IPointData = { x: 0, y: 1 }
    ) {
        this.hasCloseButton = basePopupStyle.hasCloseButton;
        this.bgInvisible = !basePopupStyle.hasBackground;
        const backgroundTextureKey = generatePopupBackgroundTexture(scene);
        this.bg = new Phaser.GameObjects.Sprite(
            scene,
            x,
            y,
            'uiPanel',
            'Bet-panel'
        );
        this.buttons = [];
        scene.add.existing(this.bg);
        this.allElements.push(this.bg);
        //this.bg.setScale(2, 2);
        this.bg.setAlpha(this.bgAlpha);
        this.bg.angle = this.bgDefaultAngle;

        if (basePopupStyle.hasBackground) {
            this.bg.setInteractive();
        } else {
            // this.bg.setInteractive();
            this.bg.setActive(false).setVisible(false);
        }

        let btn;
        this.valueLevels &&
            this.valueLevels.length > 0 &&
            this.valueLevels.forEach((value) => {
                let valStr = useCurrencyFormat
                    ? getCurrencyFormat(value, CURRENCY)
                    : (value * getUrlDenomination()).toString();
                if (value == -1) {
                    valStr = '∞';
                }
                btn = createPopupButton(
                    `${eventKeyId}-button`,
                    value,
                    scene,
                    valStr
                );
                this.buttons.push(btn);
                this.allElements.push(...btn.elements);
            });

        externalButtons &&
            externalButtons.length > 0 &&
            externalButtons.forEach((button) => {
                btn = button;
                this.buttons.push(btn);
                this.allElements.push(...btn.elements);
            });

        if (btn) {
            if (
                widthSpaceBetweenButtonsFactor &&
                heightSpaceBetweenButtonsFactor
            ) {
                this.buttonsGrid = new ButtonsGrid(
                    columnsLandscape,
                    columnsPortrait,
                    this.buttons,
                    0.1,
                    0.1,
                    portraitScale,
                    landscapeScale,
                    widthSpaceBetweenButtonsFactor,
                    heightSpaceBetweenButtonsFactor
                );
            } else {
                this.buttonsGrid = new ButtonsGrid(
                    columnsLandscape,
                    columnsPortrait,
                    this.buttons,
                    0.1 * btn.height,
                    0.1 * btn.height,
                    portraitScale,
                    landscapeScale
                );
            }
            this.buttonsGrid.setAdditionalOffsetY(
                this.additionalButtonsOffsetY
            );
        }

        this.title = scene.add.text(0, 0, this.titleText, basePopupStyle.style);
        this.title.setOrigin(0.5);
        this.allElements.push(this.title);
        this.usedTitleOffsetMultiplier = this.titleOffsetMultiplier;

        if (this.hasCloseButton) {
            this.closePopupButton = new GameButton(
                'closePopup',
                null,
                scene,
                0,
                0,
                'closeIdle',
                'closeDown',
                'closeOver',
                'statusPanel'
            );
        }
        if (this.closePopupButton) {
            this.allElements.push(...this.closePopupButton.elements);
        }

        this.scene.game.events.on('overlaysSceneResized', this.onResize, this);
        this.onResize();
        this.closePopup();

        this.initEvents();
    }

    setButtonsAdditionalOffsetY(value: number): void {
        this.additionalButtonsOffsetY = value;
        this.buttonsGrid && this.buttonsGrid.setAdditionalOffsetY(value);
    }

    changeBackground(textureKey: string, forcedScale = 1): void {
        this.bg.setTexture(textureKey);
        this.bgInvisible = false;
        this.bg.setScale(forcedScale);
    }

    lockBackgroundRotation(angle = 0): void {
        this.bgRotationLocked = true;
        this.bg.angle = this.bgDefaultAngle = angle;
    }

    setOnOffOnSameButton(value: boolean): void {
        this.onOffOnSameButton = value;
    }

    refreshTitleText(isAlternative): void {
        console.log('refreshTitleText, isAlternative', isAlternative);
        if (!isAlternative || !this.alternativeTitleText) {
            this.usedTitleOffsetMultiplier = this.titleOffsetMultiplier;
            this.title.setText(this.titleText);
        } else {
            this.usedTitleOffsetMultiplier = this.alternativeTitleOffsetMultiplier;
            console.log(
                'refreshTitleText, isAlternative',
                this.eventKeyId,
                isAlternative,
                this.alternativeTitleText
            );
            this.title.setText(this.alternativeTitleText);
        }
        this.onResize();
    }

    protected initEvents(): void {
        this.scene.game.events.on(
            `event-open-${this.eventKeyId}`,
            (alt) => {
                if (!this.popupActive) {
                    this.scene.game.events.emit('event-close-popups');
                    this.openPopupAnimation(alt);
                    if (
                        this.eventKeyId === 'bet-popup' ||
                        this.eventKeyId === 'spins-popup'
                    ) {
                        this.scene.game.events.emit(
                            'event-disableEnableMenuBtn',
                            this.popupActive
                        );
                    }
                } else if (this.onOffOnSameButton) {
                    this.closePopupAnimation();
                    if (this.eventKeyId === 'bet-popup') {
                        this.scene.game.events.emit(
                            'event-disableEnableMenuBtn',
                            this.popupActive
                        );
                    }
                }
            },
            this
        );
        this.scene.game.events.on(
            `event-close-${this.eventKeyId}`,
            this.closePopupAnimation,
            this
        );
        this.scene.game.events.on(
            'event-button-clicked-closePopup',
            () => this.closePopupAnimation(true),
            this
        );
        this.scene.game.events.on(
            'event-close-popups',
            this.closePopupAnimation,
            this
        );
        this.scene.game.events.on(
            'event-terminate-popups',
            this.closePopup,
            this
        );
        this.scene.game.events.on(
            `event-refresh-alternative-title-${this.eventKeyId}`,
            this.refreshTitleText,
            this
        );

        this.scene.game.events.on(
            'toggle-popup-close-button',
            (toggleButton) => {
                // if (this.closePopupButton) {
                //     if (toggleButton) {
                //         this.closePopupButton.setScale(1);
                //     } else {
                //         this.closePopupButton.setScale(0);
                //     }
                // }
            },
            this
        );
    }

    protected onResize(): void {
        const isPort = globalGetIsPortrait(this.scene);

        if (isPort) {
            this.resizePortrait();
        } else {
            this.resizeLandscape();
        }
        console.log('ON RESIZE');
    }

    private resizeLandscape(): void {
        if (this.alternativeTitleText == '') {
            this.usedTitleOffsetMultiplier = this.titleOffsetMultiplier;
        }
        this.bg.angle = this.bgDefaultAngle;
        this.bg.setScale(1, 1);
        //this.bg.setScale(3, 3);
        this.buttonsGrid &&
            this.buttonsGrid.resize(false, this.bg.x, this.bg.y);
        this.title.y =
            this.bg.y -
            this.bg.displayHeight / 2 +
            this.usedTitleOffsetMultiplier.y * this.title.height;

        this.title.x = this.titleLeftAlign
            ? this.bg.x -
            this.bg.displayWidth / 2 +
            this.title.width / 2 +
            this.usedTitleOffsetMultiplier.x * this.title.width
            : 0;
        //this.title.y = 0 + this.titleOffsetH;

        if (this.closePopupButton) {
            //this.closePopupButton.setScale(0.45)//this.scene.cameras.main.zoom);
            this.closePopupButton.x =
                this.bg.x +
                this.bg.displayWidth / 2 -
                1.15 * this.closePopupButton.height;
            this.closePopupButton.y =
                this.bg.y -
                this.bg.displayHeight / 2 +
                1.15 * this.closePopupButton.height;
        }
    }

    private resizePortrait(): void {
        if (this.alternativeTitleText == '') {
            this.usedTitleOffsetMultiplier = this.alternativeTitleOffsetMultiplier;
        }
        this.bg.angle = this.bgDefaultAngle + (!this.bgRotationLocked ? 90 : 0);
        this.bg.setScale(0.7, 1.5);
        this.buttonsGrid && this.buttonsGrid.resize(true, this.bg.x, this.bg.y);
        if (!this.bgRotationLocked) {
            this.title.y =
                this.bg.y -
                this.bg.displayWidth / 2 +
                this.usedTitleOffsetMultiplier.y * this.title.height;
            this.title.x = this.titleLeftAlign
                ? this.bg.x - this.bg.displayHeight / 2 + this.title.width / 2
                : 0 + this.usedTitleOffsetMultiplier.x * this.title.width;
        } else {
            this.title.y =
                this.bg.y -
                this.bg.displayHeight / 2 +
                this.usedTitleOffsetMultiplier.y * this.title.height;
            this.title.x = this.titleLeftAlign
                ? this.bg.x - this.bg.displayWidth / 2 + this.title.width / 2
                : 0 + this.usedTitleOffsetMultiplier.x * this.title.width;
        }

        if (this.closePopupButton) {
            //this.closePopupButton.setScale(0.45)//this.scene.cameras.main.zoom);
            this.closePopupButton.x =
                this.bg.x +
                this.bg.displayHeight / 2 -
                1.1 * this.closePopupButton.height; //1.1 - 1.15
            this.closePopupButton.y =
                this.bg.y -
                this.bg.displayWidth / 2 +
                1.1 * this.closePopupButton.height; //1.1
        }
    }

    closePopupAnimation(isCanceled = false): void {
        this.popupActive = false;
        this.scene.game.events.emit(
            'event-popup-closing',
            isCanceled,
            this.eventKeyId
        );
        this.buttons.forEach((button) => {
            button.setDisable();
        });
        this.showTween && this.showTween.stop();
        this.showTween = this.scene.add.tween({
            targets: this.allElements,
            duration: 500,
            alpha: 0,
            ease: 'Linear',
            onComplete: () => {
                this.closePopup(isCanceled);
            },
        });
    }

    closePopup(isCanceled = false): void {
        this.popupActive = false;
        noBasePopup = true;
        this.allElements.forEach((element) => {
            element && element.setActive(false).setVisible(false).setAlpha(1);
        });
        this.scene.game.events.emit('event-popup-closed', isCanceled);
    }

    openPopupAnimation(isAlternative = false): void {
        this.popupActive = true;
        this.refreshTitleText(isAlternative);

        this.openPopup(false);

        this.showTween && this.showTween.stop();
        this.allElements.forEach((element) => {
            if (!(element == this.bg && this.bgInvisible)) {
                this.showTween = this.scene.add.tween({
                    targets: element,
                    duration: 500,
                    alpha: element == this.bg ? this.bgAlpha : 1,
                    ease: 'Linear',
                    onComplete: () => {
                        this.openPopup(true);
                    },
                });
            }
        });
    }

    openPopup(visible = true): void {
        this.popupActive = true;
        noBasePopup = false;
        this.allElements.forEach((element) => {
            if (!(element == this.bg && this.bgInvisible)) {
                element &&
                    element
                        .setActive(true)
                        .setVisible(true)
                        .setAlpha(
                            visible
                                ? element == this.bg
                                    ? this.bgAlpha
                                    : 1
                                : 0
                        );
            }
        });
        this.buttons.forEach((button) => {
            button.setEnable();
        });
        this.scene.game.events.emit('event-popup-opened', this.eventKeyId);
    }
}
