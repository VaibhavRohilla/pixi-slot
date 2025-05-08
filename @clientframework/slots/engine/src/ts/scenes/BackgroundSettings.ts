import Background from '@commonEngine/Scenes/Background';
import { eUserInputCommands } from '@clientframework/slots/engine/src/ts/gameFlow/userInput/userInputCommands';
import GameButton from '@clientframework/slots/engine/@clientframework/common/engine/src/ts/GameObjects/gameButton';
import { TextPopup } from '@clientframework/slots/engine/src/ts/game-objects/textPopup';
import { ISlotDataPresenter } from '@clientframework/slots/engine/src/ts/dataPresenter/interfaces';
import DeviceManager from '@clientframework/slots/engine/@clientframework/common/engine/src/ts/Scenes/DeviceManager';
import { getGameName } from '@clientframework/slots/engine/@clientframework/common/engine/src/ts/defaultConfig';
import { globalGetIsPortrait } from '@clientframework/slots/engine/@clientframework/common/engine/src/ts/globalGetIsPortrait';
import {
    basePopupStyle,
    COMPLEX_AUTO_SPIN,
    horizontalDesignUI,
    THREE_SECOND_RULE,
} from '@specific/config';
import { getLanguageTextGameMsg } from '@clientframework/common/backend-service/src/client-remote-data/src/multilanguage/gameMsgData';
import { GameMsgKeys } from '@clientframework/common/backend-service/src/client-remote-data/src/multilanguage/gameMsgKeys';
import { getMenuBgAsBg } from '../dataPresenter/defaultConfigSlot';
import { slotDataPresenter } from '../dataPresenter/instances';
import { HISTORY_TOOL } from '../dataPresenter/defaultConfigSlot';
import {
    getHistoryTextStyle,
    HistoryPopup,
} from '../game-objects/historyPopup';

export default class BackgroundSettings extends Background {
    constructor() {
        super('BackgroundSettings', false);
    }

    menuBG: Phaser.GameObjects.Image;

    buttonBet: GameButton;
    buttonBetOk: GameButton;
    buttonMenu: GameButton;
    buttonMenuCancel: GameButton;
    //buttonSpinB: GameButton;
    buttonSpinStop: GameButton;
    buttonSpin: GameButton;
    buttonAutoSpin: GameButton;
    buttonStopAutoSpin: GameButton;
    // buttonAutoSign: GameButton;
    // buttonAutoStop: GameButton;
    buttonSettings: GameButton;
    buttonTurbo: GameButton;
    // buttonTurboOn: GameButton;
    buttonInfoPage: GameButton;
    buttonRulesPage: GameButton;
    buttonMenuHome: GameButton;
    buttonMenuHistory: GameButton;
    buttonCloseHistory: GameButton;
    isClosingHistory = false;
    historyPopup: HistoryPopup;

    buttonHelpPage: GameButton;

    allButtonsElements: Phaser.GameObjects.Sprite[] = [];

    mainButtons: GameButton[] = [];
    menuButtons: GameButton[] = [];
    betMenuButtons: GameButton[] = [];

    buttonsCreated = false;
    inited = false;

    clockText: TextPopup;
    timerText: TextPopup;
    betFieldText: TextPopup;
    winFieldText: TextPopup;
    balanceFieldText: TextPopup;
    gameText: TextPopup;

    topBar: Phaser.GameObjects.Sprite;
    bottomBar: Phaser.GameObjects.Sprite;
    clock: Phaser.GameObjects.Sprite;

    turboBaseSprite: Phaser.GameObjects.Sprite;

    isAutospin = false;
    isMenuActive = 0;

    isLeftHanded = false;

    model: ISlotDataPresenter = null;

    deviceManager: DeviceManager;

    turboIsPulsing = false;
    turboIsFading = false;

    statsStartingTime = 0;

    init(data: object): void {
        this.bgImage = this.add.image(0, 0, getMenuBgAsBg() ? 'bg' : 'menu-bg');
        this.bgImage.setActive(false).setVisible(false).setAlpha(1);
        this.bgImage.setInteractive();

        this.menuBG = this.add.image(0, 0, 'menu-bg');
        this.menuBG.setActive(false).setVisible(false).setAlpha(1);
        this.menuBG.setInteractive();

        // skips parent specific init
        super.init(data, true);
    }

    create(): void {
        this.topBar = this.add.sprite(0, 0, 'statusPanel', 'TopBar');
        this.bottomBar = this.add.sprite(0, 0, 'statusPanel', 'BottomBar');
        this.clock = this.add.sprite(0, 0, 'statusPanel', 'Clock');

        const style = {
            fontSize: '35px',
            fontFamily: 'fortunaForJack',
            align: 'center',
            color: '#fff',
            // stroke: '#000',
            // strokeThickness: 16,
        };

        this.clockText = new TextPopup(this, 'timeText', 0, 0, false, style);
        this.timerText = new TextPopup(this, 'timerText', 0, 0, false, style);
        this.gameText = new TextPopup(this, 'gameText', 0, 0, false, style);
        this.betFieldText = new TextPopup(
            this,
            'betFieldText',
            0,
            0,
            false,
            style
        );
        this.winFieldText = new TextPopup(
            this,
            'winFieldText',
            0,
            0,
            false,
            style
        );
        this.balanceFieldText = new TextPopup(
            this,
            'balanceFieldText',
            0,
            0,
            false,
            style
        );

        //GAME BUTTONS
        this.buttonBet = new GameButton(
            'bet',
            null,
            this,
            0,
            0,
            'betIdle',
            'betDown',
            'betOver',
            'statusPanel'
        );
        //this.buttonBet.kill();
        this.allButtonsElements.push(...this.buttonBet.elements);

        this.buttonBetOk = new GameButton(
            'bet',
            null,
            this,
            0,
            0,
            'OK',
            'OK',
            'OK',
            'statusPanel',
            'OK',
            'OK',
            'OK',
            'OK - on',
            'OK - on',
            'OK - on',
            'OK - on'
        );
        this.buttonBetOk.kill();
        this.allButtonsElements.push(...this.buttonBetOk.elements);

        this.buttonMenu = new GameButton(
            'menu',
            null,
            this,
            0,
            0,
            'menuIdle',
            'menuDown',
            'menuOver',
            'statusPanel'
        ); //menuRules
        //this.buttonMenu.kill();
        this.allButtonsElements.push(...this.buttonMenu.elements);

        this.buttonMenuCancel = new GameButton(
            'menuCancel',
            null,
            this,
            0,
            0,
            'menuIdle',
            'menuDown',
            'menuOver',
            'statusPanel'
        ); //menuRules
        //this.buttonMenuCancel.kill();
        this.allButtonsElements.push(...this.buttonMenuCancel.elements);

        // this.buttonSpinB = new GameButton("spinB", null, this, 0, 0, "Spin-button", "Spin-button", "Spin-button", "statusPanel");
        // //this.buttonSpinB.kill();
        // this.allButtonsElements.push(...this.buttonSpinB.elements);

        this.buttonSpin = new GameButton(
            'spin',
            null,
            this,
            0,
            0,
            'Spin-button',
            'Spin-button',
            'Spin-button',
            'statusPanel',
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            true
        );
        this.buttonSpin._createSpriteField('statusPanel', 'spinIdle');
        //this.buttonSpin.kill();
        this.allButtonsElements.push(...this.buttonSpin.elements);

        this.buttonSpinStop = new GameButton(
            'spinStop',
            null,
            this,
            0,
            0,
            'Spin-button',
            'Spin-button',
            'Spin-button',
            'statusPanel',
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            true
        );
        this.buttonSpinStop._createSpriteField('statusPanel', 'stopIdle');
        this.buttonSpinStop.kill();
        //this.allButtonsElements.push(...this.buttonSpinStop.elements);

        this.buttonAutoSpin = new GameButton(
            'autospin',
            null,
            this,
            0,
            0,
            'autospinIdle',
            'autospinDown',
            'autospinOver',
            'statusPanel'
        );
        this.buttonAutoSpin._createSpriteField('statusPanel', 'Auto-sign');

        //this.buttonAutoSpin.kill();
        this.allButtonsElements.push(...this.buttonAutoSpin.elements);

        const isPixelPerfect = false;
        this.buttonStopAutoSpin = new GameButton(
            'stopAutospin',
            null,
            this,
            0,
            0,
            'autospinIdle',
            'autospinIdle',
            'autospinIdle',
            'statusPanel',
            'autospinIdle',
            'autospinIdle',
            'autospinIdle',
            'autospinIdle',
            'autospinIdle',
            'autospinIdle',
            'autospinIdle',
            'autospinIdle',
            'autospinIdle',
            isPixelPerfect
        );
        //this.mainButtons.push(this.buttonStopAutoSpin);

        this.buttonStopAutoSpin._createTextLabel('A', {
            fontSize: '55px',
            fontFamily: 'fortunaForJack',
            align: 'center',
            color: '#fff',
            stroke: '#000',
            strokeThickness: 5,
        });

        this.buttonStopAutoSpin.yOffsetTextLabel = -80;
        this.buttonStopAutoSpin.xOffsetTextLabel = 80;

        this.buttonStopAutoSpin._createSpriteField('statusPanel', 'Auto-stop');
        this.buttonStopAutoSpin.kill();

        this.buttonSettings = new GameButton(
            'menuSettings',
            null,
            this,
            0,
            0,
            'settingsIdle',
            'settingsDown',
            'settingsOver',
            'statusPanel'
        );
        //this.buttonSettings.kill();
        this.allButtonsElements.push(...this.buttonSettings.elements);
        if (!THREE_SECOND_RULE) {
            this.turboBaseSprite = this.add.sprite(
                0,
                0,
                'statusPanel',
                'StandardSpeedIdle'
            );
            this.turboBaseSprite.setActive(false).setVisible(false);

            this.buttonTurbo = new GameButton(
                'turbo',
                null,
                this,
                0,
                0,
                'TurboPlayIdle',
                'TurboPlayDown',
                'TurboPlayOver',
                'statusPanel',
                'TurboPlayIdle',
                'TurboPlayDown',
                'TurboPlayOver',
                'StandardSpeedIdle',
                'StandardSpeedDown',
                'StandardSpeedOver'
            );
            //this.buttonTurbo.kill();
            this.allButtonsElements.push(...this.buttonTurbo.elements);
        }

        /*this.buttonTurboOn = new GameButton("turboOn", null, this, 0, 0, "StandardSpeedIdle", "StandardSpeedDown", "StandardSpeedOver", "statusPanel");
        //this.buttonTurboOn.kill();
        this.allButtonsElements.push(...this.buttonTurboOn.elements);*/

        this.buttonInfoPage = new GameButton(
            'menuInfo',
            null,
            this,
            0,
            0,
            'infoIdle',
            'infoDown',
            'infoOver',
            'statusPanel'
        );
        //this.buttonInfoPage.kill();
        this.allButtonsElements.push(...this.buttonInfoPage.elements);

        this.buttonRulesPage = new GameButton(
            'menuRules',
            null,
            this,
            0,
            0,
            'rulesIdle',
            'rulesDown',
            'rulesOver',
            'statusPanel'
        );

        //this.buttonRulesPage.kill();
        this.allButtonsElements.push(...this.buttonRulesPage.elements);

        this.buttonHelpPage = new GameButton(
            'menuHelp',
            null,
            this,
            0,
            0,
            'helpIdle',
            'helpDown',
            'helpOver',
            'statusPanel'
        );

        if (this.buttonHelpPage) {
            this.allButtonsElements.push(...this.buttonHelpPage.elements);
        }

        this.mainButtons = [
            this.buttonBet,
            this.buttonSpin,
            this.buttonAutoSpin,
            this.buttonMenu,
            this.buttonBetOk,
        ];

        this.buttonTurbo && this.mainButtons.push(this.buttonTurbo);

        this.menuButtons = [
            this.buttonMenuCancel,
            this.buttonInfoPage,
            this.buttonRulesPage,
            this.buttonSettings,
        ];

        if (this.buttonHelpPage) {
            this.menuButtons.push(this.buttonHelpPage);
        }

        this.menuButtons.forEach((button) => button.kill());

        this.buttonsCreated = true;
        this.game.events.on(
            'event-get-lobby-url',
            (url: string) => {
                console.log('on(event-get-lobby-url', url);

                if (url && url != '' && !this.buttonMenuHome) {
                    this.buttonMenuHome = new GameButton(
                        'menuHome',
                        null,
                        this,
                        0,
                        0,
                        'lobbyIdle',
                        'lobbyDown',
                        'lobbyOver',
                        'statusPanel'
                    );
                    this.buttonMenuHome.setScale(0.7);
                    this.buttonMenuHome.kill();
                    this.menuButtons.push(this.buttonMenuHome);
                }
            },
            this
        );

        this.game.events.on('event-popup-closing', this.close, this);

        this.game.events.on(
            `event-user-input-${eUserInputCommands.showInfoPage}`,
            () => this.open(eUserInputCommands.showInfoPage),
            this
        );
        this.game.events.once(
            'event-reels-scene-coords-data',
            () => {
                this.statsStartingTime = this.time.now;
                this.resize();
            },
            this
        );
        this.game.events.on(
            `event-user-input-${eUserInputCommands.showRulesPage}`,
            () => this.open(eUserInputCommands.showRulesPage),
            this
        );

        this.game.events.on(
            `event-user-input-${eUserInputCommands.openHelpPage}`,
            () => this.open(eUserInputCommands.openHelpPage),
            this
        );

        this.game.events.on(
            'event-popup-opened',
            (arg) => this.open(arg),
            this
        );

        this.game.events.on('event-show-menu', this.showMenu, this);

        this.game.events.on(
            `event-user-input-${eUserInputCommands.closeMenu}`,
            this.closeMenu,
            this
        );

        this.game.events.on(
            `event-user-input-${eUserInputCommands.historyClose}`,
            this.closeMenu,
            this
        );

        this.game.events.emit('event-request-lobby-url');
        this.game.events.on(
            'event-current-data-updated',
            this.refreshButtonsFromModel,
            this
        );

        this.game.events.on(
            'event-current-data-updated',
            this.refreshFromModel,
            this
        );
        this.game.events.on('event-data', this.refreshFromModel, this);
        this.game.events.on(
            'event-future-data-updated',
            (arg) => this.refreshFromModel(arg, true),
            this
        );
        console.log('event-request-data');
        this.game.events.emit('event-request-data');

        this.game.events.on(
            'event-state-StatePresentSpinning-onEnter',
            (data: ISlotDataPresenter) => {
                this.buttonSpin.kill();
                if (data.status.freeSpins.totalSpins == 0) {
                    this.buttonSpinStop.revive();
                }
            },
            this
        );
        this.game.events.on(
            'event-state-StateIdle-onEnter',
            () => {
                if (this.isClosingHistory) {
                    this.isClosingHistory = false;
                    return;
                }
                this.buttonSpin.revive();
                this.buttonSpinStop.kill();
                if (this.model.settings.currentPage != 'bet-popup') {
                    this.fadeInMainButtons(
                        this.buttonSpin,
                        this.buttonTurbo,
                        this.buttonBetOk
                    );
                }
            },
            this
        );

        this.game.events.on(
            'event-state-StateAskServerBeforeSpin-onEnter',
            (data: ISlotDataPresenter) => {
                if (data.betAndAutospin.currentAutospin > 0) {
                    this.fadeOutMainButtons(
                        this.buttonSpin,
                        this.buttonTurbo,
                        this.buttonAutoSpin,
                        this.buttonStopAutoSpin
                    );
                } else {
                    this.fadeOutMainButtons(this.buttonSpin, this.buttonTurbo);
                }
            },
            this
        );

        this.game.events.on('refreshBlackField', this.resize, this);

        this.game.events.on(
            'event-turbobutton-pulse',
            (on) => {
                this.turboIsPulsing = on;
                this.turboBaseSprite &&
                    this.turboBaseSprite
                        .setActive(on)
                        .setVisible(on)
                        .setAlpha(1);
            },
            this
        );

        this.createHistoryElementsAndEvents();

        document.addEventListener('html-event-close-infoPage', (e) => {
            e;
            this.close();
        });

        document.addEventListener('html-event-close-rulesPage', (e) => {
            e;
            this.close();
        });

        // this.menuBG.on("pointerdown", () => {
        //     console.log("TOUHED")
        //     if (this.menuBG.active && !this.menuBG.visible) {
        //         this.game.events.emit("event-close-popups");
        //     }
        // }, this);
    }

    openTween: Phaser.Tweens.Tween;
    open(whoOpenedIt: string): void {
        this.buttonBetOk.selected = false;
        this.model.settings.menuTransition = true;

        this.model.settings.currentPage = whoOpenedIt;

        console.log('POPUP = ', this.isMenuActive);
        const targets = [];
        if (this.isMenuActive < 2) {
            targets.push(this.menuBG);
        } else {
            this.menuBG.setActive(true).setVisible(true).setAlpha(1);
            this.bgImage.setActive(true).setVisible(true).setAlpha(1);
        }

        if (
            COMPLEX_AUTO_SPIN ||
            (!COMPLEX_AUTO_SPIN && whoOpenedIt !== 'spins-popup')
        ) {
            if (this.isMenuActive < 2) {
                targets.push(this.bgImage);
            }

            targets.forEach((element) => {
                element.setActive(true).setVisible(true).setAlpha(0);
            });
            if (whoOpenedIt == 'bet-popup') {
                this.fadeOutMainButtons(this.buttonSpin, this.buttonBet);
                if (!slotDataPresenter.betAndAutospin.autoSpinInitiated) {
                    this.fadeInFollowingMainButtons(true, this.buttonBetOk);
                }
            }

            this.add.tween({
                targets: targets,
                duration: 500,
                alpha: '1',
                ease: 'Linear',
                onComplete: () => {
                    targets.forEach((element) => {
                        element.setActive(true).setVisible(true).setAlpha(1);
                    });
                    if (this.isMenuActive == 1) {
                        this.isMenuActive = 2;
                    }
                },
            });
            if (this.isMenuActive == 2) {
                this.refreshSettingsButtonsTransparency(whoOpenedIt);
            }
        }
    }

    close(): void {
        this.model.settings.menuTransition = true;
        const targets = this.isMenuActive ? [] : [this.bgImage, this.menuBG]; //, ...this.allButtonsElements];
        this.add.tween({
            targets,
            duration: 500,
            alpha: '0',
            ease: 'Linear',
            onComplete: () => {
                targets.forEach((element) => {
                    element.setActive(false).setVisible(false).setAlpha(1);
                    this.model.settings.menuTransition = false;
                });
            },
        });

        if (!this.isMenuActive) {
            this.fadeInMainButtons(this.buttonSpin, this.buttonBetOk);
            this.fadeOutFollowingMainButtons(true, this.buttonBetOk);
        }
        this.model.settings.currentPage = '';
    }

    adjustButtonScale(
        buttonDimension: number,
        initialScale: number,
        screenPart: number,
        screenDimension: number
    ): number {
        let newScale = initialScale;
        //if (buttonDimension * initialScale > screenPart * screenDimension) {
        newScale = Math.min(
            initialScale,
            (screenPart * screenDimension) / buttonDimension
        );
        //}

        return newScale;
    }

    resize(): void {
        super.resize();
        this.menuBG.setScale(this.bgImage.scale);
        this.menuBG.setPosition(this.bgImage.x, this.bgImage.y);
        this.menuBG.angle = globalGetIsPortrait(this) ? 90 : 0;
        const screenWidth = this.scale.gameSize.width / this.cameras.main.zoom;
        const screenHeight =
            this.scale.gameSize.height / this.cameras.main.zoom;
        let scale = this.bgImage.scale / this.bgImageScaleFactor;
        const bottomY = screenHeight;
        const rightX = screenWidth;
        const middleX = screenWidth / 2; //= 0.5 * rightX

        if (this.buttonsCreated) {
            this.deviceManager = this.scene.get(
                'DeviceManager'
            ) as DeviceManager;

            let limitScreenPart;
            let screenDimension;

            const limitScreenPartBars = 0.3;
            const screenDimensionBars = rightX;

            let phoneYOffset = 0;

            this.buttonStopAutoSpin.yOffsetTextLabel = -75;
            this.buttonStopAutoSpin.xOffsetTextLabel = 80;
            if (globalGetIsPortrait(this)) {
                phoneYOffset = -this.buttonMenu.background.displayHeight;
                scale *= 0.65;
                //this.closePopupButton.x = bottomX / 2
                //this.closePopupButton.y = bottomY - (this.closePopupButton.height) / 2

                let nonFullScreenSpecialiPhone = false;
                if (
                    (navigator.userAgent.includes('iPhone') &&
                        this.deviceManager &&
                        this.deviceManager.isIPhoneFullScreen) ||
                    (navigator.userAgent.includes('Mobile') &&
                        this.deviceManager.scale.isFullscreen)
                ) {
                    const phoneAspectRatio = rightX / bottomY;
                    if (phoneAspectRatio <= 0.92 * (1080 / 1920)) {
                        phoneYOffset = -0.08 * bottomY;
                    }
                    // if (this.deviceManager.iPhoneAspectRatio >= 1.1 * (1920 / 1080)) {
                    //     phoneYOffset = +0.1 * bottomY;
                    // }
                } else if (
                    horizontalDesignUI &&
                    navigator.userAgent.includes('iPhone') &&
                    this.deviceManager &&
                    !this.deviceManager.isIPhoneFullScreen &&
                    rightX / bottomY > 0.93 * (1080 / 1920)
                ) {
                    phoneYOffset = -0.04 * bottomY;
                    nonFullScreenSpecialiPhone = true;
                }

                limitScreenPart = 0.33;
                screenDimension = rightX;

                this.buttonMenu.setScale(
                    this.adjustButtonScale(
                        this.buttonMenu.nonScaledWidth,
                        scale * 0.85,
                        limitScreenPart,
                        screenDimension
                    )
                );
                this.buttonMenu.x = this.isLeftHanded
                    ? rightX - this.buttonMenu.width
                    : 0 + this.buttonMenu.width;
                if (nonFullScreenSpecialiPhone) {
                    this.buttonMenu.y =
                        bottomY -
                        this.buttonMenu.height +
                        (phoneYOffset != 0
                            ? phoneYOffset
                            : -0.15 * this.buttonMenu.height);
                } else {
                    this.buttonMenu.y =
                        bottomY -
                        this.buttonMenu.height +
                        (phoneYOffset != 0
                            ? phoneYOffset
                            : -0.3 * this.buttonMenu.height);
                }

                this.buttonMenuCancel.setScale(
                    this.adjustButtonScale(
                        this.buttonMenuCancel.nonScaledWidth,
                        scale * 0.85,
                        limitScreenPart,
                        screenDimension
                    )
                );
                this.buttonMenuCancel.x = this.buttonMenu.x;
                this.buttonMenuCancel.y = this.buttonMenu.y;

                if (this.buttonCloseHistory) {
                    this.buttonCloseHistory.setScale(
                        this.adjustButtonScale(
                            this.buttonMenuCancel.nonScaledWidth,
                            scale * 0.85,
                            limitScreenPart,
                            screenDimension
                        )
                    );
                    this.buttonCloseHistory.x = this.buttonMenu.x;
                    this.buttonCloseHistory.y = this.buttonMenu.y;
                }

                if (this.buttonMenuHome) {
                    this.buttonMenuHome.setScale(
                        this.adjustButtonScale(
                            this.buttonMenuHome.nonScaledWidth,
                            scale,
                            limitScreenPart,
                            screenDimension
                        )
                    );
                    this.buttonMenuHome.x = this.isLeftHanded
                        ? this.buttonMenuHome.width
                        : rightX - this.buttonMenuHome.width;
                    this.buttonMenuHome.y = this.buttonMenu.y;
                }

                this.historyResizePortrait(
                    scale,
                    limitScreenPart,
                    screenDimension,
                    rightX,
                    bottomY
                );

                this.buttonBet.setScale(
                    this.adjustButtonScale(
                        this.buttonBet.nonScaledWidth,
                        scale,
                        limitScreenPart,
                        screenDimension
                    )
                );
                this.buttonBet.x = this.isLeftHanded
                    ? this.buttonBet.width
                    : rightX - this.buttonBet.width;
                if (nonFullScreenSpecialiPhone) {
                    this.buttonBet.y =
                        this.buttonMenu.y - this.buttonBet.height * 0.1;
                } else {
                    this.buttonBet.y = this.buttonMenu.y;
                }

                this.buttonBetOk.setScale(
                    this.adjustButtonScale(
                        this.buttonBetOk.nonScaledWidth,
                        scale,
                        limitScreenPart,
                        screenDimension
                    )
                );
                this.buttonBetOk.x = this.buttonBet.x;
                this.buttonBetOk.y =
                    this.buttonBet.y -
                    0.5 * this.buttonBet.height -
                    this.buttonBetOk.height;

                this.buttonSpin.setScale(
                    this.adjustButtonScale(
                        this.buttonSpin.nonScaledWidth,
                        scale * (nonFullScreenSpecialiPhone ? 0.55 : 1),
                        limitScreenPart,
                        screenDimension
                    )
                );
                this.buttonSpin.x = middleX;
                if (nonFullScreenSpecialiPhone) {
                    this.buttonSpin.y =
                        bottomY -
                        this.buttonMenu.height +
                        (phoneYOffset != 0
                            ? phoneYOffset
                            : -0.2 * this.buttonMenu.height);
                } else {
                    this.buttonSpin.y = 0.8 * bottomY;
                }

                // this.buttonSpinB.setScale(scale);
                // this.buttonSpinB.x = middleX;
                // this.buttonSpinB.y = bottomY - (this.buttonSpin.height) * 2

                this.buttonSpinStop.setScale(
                    this.adjustButtonScale(
                        this.buttonSpinStop.nonScaledWidth,
                        scale * (nonFullScreenSpecialiPhone ? 0.55 : 1),
                        limitScreenPart,
                        screenDimension
                    )
                );
                this.buttonSpinStop.x = this.buttonSpin.x;
                if (nonFullScreenSpecialiPhone) {
                    this.buttonSpinStop.y =
                        bottomY -
                        this.buttonMenu.height +
                        (phoneYOffset != 0
                            ? phoneYOffset
                            : -0.2 * this.buttonMenu.height);
                } else {
                    this.buttonSpinStop.y = 0.8 * bottomY;
                }

                if (this.buttonTurbo) {
                    this.buttonTurbo.setScale(
                        this.adjustButtonScale(
                            this.buttonTurbo.nonScaledWidth,
                            scale,
                            limitScreenPart,
                            screenDimension
                        )
                    );
                    if (nonFullScreenSpecialiPhone) {
                        this.buttonTurbo.x =
                            (this.buttonSpin.x + this.buttonMenu.x) / 2;

                        this.buttonTurbo.y =
                            bottomY -
                            this.buttonMenu.height +
                            (phoneYOffset != 0
                                ? phoneYOffset
                                : -0.2 * this.buttonMenu.height);
                    } else {
                        this.buttonTurbo.x = this.isLeftHanded
                            ? rightX - this.buttonTurbo.width
                            : 0 + this.buttonTurbo.width;

                        this.buttonTurbo.y = 0.8 * bottomY + phoneYOffset;
                    }
                }
                /*
                this.buttonTurboOn.setScale(scale);
                this.buttonTurboOn.x = 0 + (this.buttonTurbo.width)
                this.buttonTurboOn.y = 0.66 * bottomY;
                */
                this.buttonAutoSpin.setScale(
                    this.adjustButtonScale(
                        this.buttonAutoSpin.nonScaledWidth,
                        scale * (nonFullScreenSpecialiPhone ? 0.66 : 1),
                        limitScreenPart,
                        screenDimension
                    )
                );
                if (nonFullScreenSpecialiPhone) {
                    this.buttonAutoSpin.x =
                        (this.buttonBet.x + this.buttonSpin.x) / 2;

                    this.buttonAutoSpin.y =
                        bottomY -
                        this.buttonMenu.height +
                        (phoneYOffset != 0
                            ? phoneYOffset
                            : -0.2 * this.buttonMenu.height);
                } else {
                    this.buttonAutoSpin.x = this.isLeftHanded
                        ? this.buttonAutoSpin.width + 0.8
                        : rightX - this.buttonAutoSpin.width * 0.8;

                    this.buttonAutoSpin.y = 0.8 * bottomY + phoneYOffset;
                }

                // this.buttonAutoSign.setScale(scale);
                // this.buttonAutoSign.x = rightX - (this.buttonAutoSpin.width) * 0.8
                // this.buttonAutoSign.y = bottomY - (this.buttonAutoSpin.height) * 2.7

                // this.buttonAutoStop.setScale(scale);
                // this.buttonAutoStop.x = rightX - (this.buttonAutoSpin.width) * 0.8
                // this.buttonAutoStop.y = bottomY - (this.buttonAutoSpin.height) * 2.7

                this.buttonStopAutoSpin.setScale(
                    this.adjustButtonScale(
                        this.buttonStopAutoSpin.nonScaledWidth,
                        scale * (nonFullScreenSpecialiPhone ? 0.66 : 1),
                        limitScreenPart,
                        screenDimension
                    )
                );
                this.buttonStopAutoSpin.x = this.buttonAutoSpin.x;
                this.buttonStopAutoSpin.y = this.buttonAutoSpin.y;

                let optionsY =
                    bottomY - this.buttonSettings.height * 2.5 + phoneYOffset;
                if (
                    navigator.userAgent.includes('iPhone') &&
                    phoneYOffset == 0
                ) {
                    optionsY = this.buttonMenuCancel.y;
                }

                this.buttonSettings.setScale(
                    this.adjustButtonScale(
                        this.buttonSettings.nonScaledWidth,
                        scale,
                        limitScreenPart,
                        screenDimension
                    )
                );
                if (this.buttonHelpPage) {
                    this.buttonSettings.x =
                        (nonFullScreenSpecialiPhone ? 0.75 : 0.75) * rightX -
                        (this.buttonInfoPage.width + middleX) / 2;
                } else {
                    this.buttonSettings.x = middleX;
                }
                this.buttonSettings.y = optionsY;

                this.buttonInfoPage.setScale(
                    this.adjustButtonScale(
                        this.buttonInfoPage.nonScaledWidth,
                        scale,
                        limitScreenPart,
                        screenDimension
                    )
                );
                if (this.buttonHelpPage) {
                    this.buttonInfoPage.x =
                        (nonFullScreenSpecialiPhone ? 0.5 : 0.5) * rightX -
                        (this.buttonInfoPage.width + middleX) / 2;
                } else {
                    this.buttonInfoPage.x =
                        (nonFullScreenSpecialiPhone ? 0.45 : 0.4) * rightX -
                        (this.buttonInfoPage.width +
                            this.buttonSettings.width) /
                        2;
                }
                this.buttonInfoPage.y = optionsY;

                this.buttonRulesPage.setScale(
                    this.adjustButtonScale(
                        this.buttonRulesPage.nonScaledWidth,
                        scale,
                        limitScreenPart,
                        screenDimension
                    )
                );
                if (this.buttonHelpPage) {
                    this.buttonRulesPage.x =
                        (nonFullScreenSpecialiPhone ? 0.35 : 0.35) * rightX +
                        (this.buttonRulesPage.width + middleX) / 2;
                } else {
                    this.buttonRulesPage.x =
                        (nonFullScreenSpecialiPhone ? 0.55 : 0.6) * rightX +
                        (this.buttonRulesPage.width +
                            this.buttonSettings.width) /
                        2;
                }
                this.buttonRulesPage.y = optionsY;

                if (this.buttonHelpPage) {
                    this.buttonHelpPage.x =
                        (nonFullScreenSpecialiPhone ? 0.55 : 0.55) * rightX +
                        (this.buttonHelpPage.width + middleX) / 2;

                    this.buttonHelpPage.y = optionsY;

                    this.buttonHelpPage.setScale(
                        this.adjustButtonScale(
                            this.buttonHelpPage.nonScaledWidth,
                            scale,
                            limitScreenPart,
                            screenDimension
                        )
                    );
                }
            } else {
                limitScreenPart = 0.33;
                screenDimension = bottomY;

                this.buttonMenu.setScale(
                    this.adjustButtonScale(
                        this.buttonMenu.nonScaledWidth,
                        scale,
                        limitScreenPart,
                        screenDimension
                    )
                );
                this.buttonMenu.x = this.isLeftHanded
                    ? rightX - this.buttonMenu.width
                    : 0 + this.buttonMenu.width;
                this.buttonMenu.y = 0 + this.buttonMenu.height / 0.8;

                this.buttonMenuCancel.setScale(
                    this.adjustButtonScale(
                        this.buttonMenuCancel.nonScaledWidth,
                        scale,
                        limitScreenPart,
                        screenDimension
                    )
                );
                this.buttonMenuCancel.x = this.buttonMenu.x;
                this.buttonMenuCancel.y = this.buttonMenu.y;

                if (this.buttonCloseHistory) {
                    this.buttonCloseHistory.setScale(
                        this.adjustButtonScale(
                            this.buttonMenuCancel.nonScaledWidth,
                            scale,
                            limitScreenPart,
                            screenDimension
                        )
                    );
                    this.buttonCloseHistory.x = this.buttonMenu.x;
                    this.buttonCloseHistory.y = this.buttonMenu.y;
                }

                if (this.buttonMenuHome) {
                    this.buttonMenuHome.setScale(
                        this.adjustButtonScale(
                            this.buttonMenuHome.nonScaledWidth,
                            scale,
                            limitScreenPart,
                            screenDimension
                        )
                    );
                    this.buttonMenuHome.x = this.isLeftHanded
                        ? rightX - this.buttonMenuHome.width
                        : 0 + this.buttonMenuHome.width;
                    this.buttonMenuHome.y =
                        bottomY - this.buttonMenuHome.height;
                }

                this.historyResizeLandscape(
                    scale,
                    limitScreenPart,
                    screenDimension,
                    rightX,
                    bottomY
                );

                this.buttonBet.setScale(
                    this.adjustButtonScale(
                        this.buttonBet.nonScaledWidth,
                        scale,
                        limitScreenPart,
                        screenDimension
                    )
                );
                this.buttonBet.x = this.isLeftHanded
                    ? rightX - this.buttonBet.width
                    : 0 + this.buttonBet.width;
                this.buttonBet.y = bottomY - this.buttonBet.height;

                this.buttonBetOk.setScale(
                    this.adjustButtonScale(
                        this.buttonBetOk.nonScaledWidth,
                        scale,
                        limitScreenPart,
                        screenDimension
                    )
                );
                this.buttonBetOk.x = middleX;
                this.buttonBetOk.y = this.buttonBet.y;

                this.buttonSpin.setScale(
                    this.adjustButtonScale(
                        this.buttonSpin.nonScaledWidth,
                        scale,
                        limitScreenPart,
                        screenDimension
                    )
                );
                this.buttonSpin.x = this.isLeftHanded
                    ? (1.45 * this.buttonSpin.width) / 2
                    : rightX - (1.45 * this.buttonSpin.width) / 2;
                if (navigator.userAgent.includes('iPhone')) {
                    this.buttonStopAutoSpin.yOffsetTextLabel = -30;
                    this.buttonStopAutoSpin.xOffsetTextLabel = 50;
                    this.buttonSpin.y = bottomY * 0.8;
                } else {
                    this.buttonSpin.y =
                        bottomY * 0.95 - this.buttonSpin.height / 2;
                }

                // this.buttonSpinB.setScale(scale);
                // this.buttonSpinB.x = rightX  -  (this.buttonSpin.width)
                // this.buttonSpinB.y = bottomY -  (this.buttonSpin.height)

                this.buttonSpinStop.setScale(
                    this.adjustButtonScale(
                        this.buttonSpinStop.nonScaledWidth,
                        scale,
                        limitScreenPart,
                        screenDimension
                    )
                );
                this.buttonSpinStop.x = this.buttonSpin.x;
                this.buttonSpinStop.y = this.buttonSpin.y;
                if (this.buttonTurbo) {
                    this.buttonTurbo.setScale(
                        this.adjustButtonScale(
                            this.buttonTurbo.nonScaledWidth,
                            scale,
                            limitScreenPart,
                            screenDimension
                        )
                    );
                    this.buttonTurbo.x = this.isLeftHanded
                        ? rightX -
                        this.buttonTurbo.width / 2 -
                        1.9 * this.buttonMenu.width
                        : this.buttonTurbo.width / 2 +
                        1.9 * this.buttonMenu.width;
                    this.buttonTurbo.y = bottomY - this.buttonTurbo.height;
                    /*
                    this.buttonTurboOn.setScale(scale);
                    this.buttonTurboOn.x = (this.buttonTurbo.width) / 2 + 1.6 * (this.buttonMenu.width)
                    this.buttonTurboOn.y = bottomY  - (this.buttonTurbo.height)
                    */
                }
                this.buttonAutoSpin.setScale(
                    this.adjustButtonScale(
                        this.buttonAutoSpin.nonScaledWidth,
                        scale,
                        limitScreenPart,
                        screenDimension
                    )
                );
                this.buttonAutoSpin.x = this.isLeftHanded
                    ? rightX * 0.05 + this.buttonAutoSpin.width / 2
                    : rightX * 0.95 - this.buttonAutoSpin.width / 2;
                this.buttonAutoSpin.y =
                    0 + (1.85 * this.buttonAutoSpin.height) / 2;

                // this.buttonAutoSign.setScale(scale);
                // this.buttonAutoSign.x = rightX  - (this.buttonAutoSpin.width)
                // this.buttonAutoSign.y = 0 + (this.buttonAutoSpin.height)

                // this.buttonAutoStop.setScale(scale);
                // this.buttonAutoStop.x = rightX  - (this.buttonAutoSpin.width)
                // this.buttonAutoStop.y = 0 + (this.buttonAutoSpin.height)

                this.buttonStopAutoSpin.setScale(
                    this.adjustButtonScale(
                        this.buttonStopAutoSpin.nonScaledWidth,
                        scale,
                        limitScreenPart,
                        screenDimension
                    )
                );
                this.buttonStopAutoSpin.x = this.buttonAutoSpin.x;
                this.buttonStopAutoSpin.y = this.buttonAutoSpin.y;

                if (!navigator.userAgent.includes('iPhone')) {
                    this.buttonSettings.setScale(
                        this.adjustButtonScale(
                            this.buttonSettings.nonScaledWidth,
                            scale,
                            limitScreenPart,
                            screenDimension
                        )
                    );
                    if (this.buttonHelpPage) {
                        this.buttonSettings.x =
                            0.7 * rightX -
                            (this.buttonInfoPage.width + middleX) / 2;
                    } else {
                        this.buttonSettings.x = middleX;
                    }
                    this.buttonSettings.y =
                        bottomY - this.buttonSettings.height;

                    this.buttonInfoPage.setScale(
                        this.adjustButtonScale(
                            this.buttonInfoPage.nonScaledWidth,
                            scale,
                            limitScreenPart,
                            screenDimension
                        )
                    );
                    if (this.buttonHelpPage) {
                        this.buttonInfoPage.x =
                            0.5 * rightX -
                            (this.buttonInfoPage.width + middleX) / 2;
                    } else {
                        this.buttonInfoPage.x =
                            0.4 * rightX -
                            (this.buttonInfoPage.width +
                                this.buttonSettings.width) /
                            2;
                    }
                    this.buttonInfoPage.y =
                        bottomY - this.buttonSettings.height;

                    this.buttonRulesPage.setScale(
                        this.adjustButtonScale(
                            this.buttonRulesPage.nonScaledWidth,
                            scale,
                            limitScreenPart,
                            screenDimension
                        )
                    );
                    if (this.buttonHelpPage) {
                        this.buttonRulesPage.x =
                            0.3 * rightX +
                            (this.buttonRulesPage.width + middleX) / 2;
                    } else {
                        this.buttonRulesPage.x =
                            0.6 * rightX +
                            (this.buttonRulesPage.width +
                                this.buttonSettings.width) /
                            2;
                    }
                    this.buttonRulesPage.y =
                        bottomY - this.buttonSettings.height;

                    if (this.buttonHelpPage) {
                        this.buttonHelpPage.setScale(
                            this.adjustButtonScale(
                                this.buttonHelpPage.nonScaledWidth,
                                scale,
                                limitScreenPart,
                                screenDimension
                            )
                        );

                        this.buttonHelpPage.x =
                            0.5 * rightX +
                            (this.buttonHelpPage.width + middleX) / 2;

                        this.buttonHelpPage.y =
                            bottomY - this.buttonSettings.height;
                    }
                } else {
                    this.buttonInfoPage.setScale(
                        this.adjustButtonScale(
                            this.buttonInfoPage.nonScaledWidth,
                            scale,
                            limitScreenPart,
                            screenDimension
                        )
                    );
                    this.buttonInfoPage.x = this.buttonMenuCancel.x;
                    this.buttonInfoPage.y =
                        0.5 * bottomY -
                        0.5 * this.buttonSettings.height -
                        this.buttonInfoPage.height * 1.3;

                    this.buttonSettings.setScale(
                        this.adjustButtonScale(
                            this.buttonSettings.nonScaledWidth,
                            scale,
                            limitScreenPart,
                            screenDimension
                        )
                    );
                    this.buttonSettings.x = this.buttonMenuCancel.x;
                    this.buttonSettings.y = 0.5 * bottomY * 0.85;

                    this.buttonRulesPage.setScale(
                        this.adjustButtonScale(
                            this.buttonRulesPage.nonScaledWidth,
                            scale,
                            limitScreenPart,
                            screenDimension
                        )
                    );
                    this.buttonRulesPage.x = this.buttonMenuCancel.x;
                    this.buttonRulesPage.y =
                        0.5 * bottomY -
                        0.5 * this.buttonSettings.height +
                        this.buttonRulesPage.height * 1.15;

                    if (this.buttonHelpPage) {
                        this.buttonHelpPage.setScale(
                            this.adjustButtonScale(
                                this.buttonHelpPage.nonScaledWidth,
                                scale,
                                limitScreenPart,
                                screenDimension
                            )
                        );
                        this.buttonHelpPage.x = this.buttonMenuCancel.x;
                        this.buttonHelpPage.y =
                            0.5 * bottomY +
                            0.5 * this.buttonSettings.height +
                            this.buttonRulesPage.height * 1.3;
                    }
                }
            }

            if (this.buttonTurbo && this.turboBaseSprite) {
                this.turboBaseSprite.setScale(this.buttonTurbo.scale);
                this.turboBaseSprite.setPosition(
                    this.buttonTurbo.x,
                    this.buttonTurbo.y
                );
            }

            this.clockText.setScale(
                this.adjustButtonScale(
                    this.clockText.nonScaledWidth,
                    scale,
                    limitScreenPartBars,
                    screenDimensionBars
                )
            );
            this.clockText.setTextPosition(
                rightX - 0.5 * this.clockText.width,
                0 + 0.5 * this.clockText.height
            );

            const clockScale =
                (0.8 * (this.topBar.height * scale)) / this.clock.height; //(this.clockText.height / newScale) / this.clock.height;
            this.clock.setScale(clockScale);
            this.clock.x =
                rightX -
                this.clockText.width -
                0.5 * clockScale * this.clock.width;
            this.clock.y = 0 + 0.5 * clockScale * this.clock.height;

            this.timerText.setScale(
                this.adjustButtonScale(
                    this.timerText.nonScaledWidth,
                    scale,
                    limitScreenPartBars,
                    screenDimensionBars
                )
            );
            this.timerText.setTextPosition(
                rightX -
                this.clockText.width -
                clockScale * this.clock.width -
                1.2 * 0.5 * this.timerText.width,
                0 + 0.5 * this.timerText.height
            );

            let bottomOffset = 0;
            if (phoneYOffset != 0) {
                bottomOffset = -(scale * this.bottomBar.height);
            }

            this.betFieldText.setScale(
                this.adjustButtonScale(
                    this.betFieldText.nonScaledWidth,
                    scale,
                    limitScreenPartBars,
                    screenDimensionBars
                )
            );
            this.betFieldText.setTextPosition(
                rightX - 0.5 * this.betFieldText.width,
                bottomY - 0.5 * this.betFieldText.height + bottomOffset
            );

            this.balanceFieldText.setScale(
                this.adjustButtonScale(
                    this.balanceFieldText.nonScaledWidth,
                    scale,
                    1.1 * limitScreenPartBars,
                    screenDimensionBars
                )
            );
            this.balanceFieldText.setTextPosition(
                0 + 0.5 * this.balanceFieldText.width,
                bottomY - 0.5 * this.balanceFieldText.height + bottomOffset
            );

            this.winFieldText.setScale(
                this.adjustButtonScale(
                    this.winFieldText.nonScaledWidth,
                    scale,
                    limitScreenPartBars,
                    screenDimensionBars
                )
            );
            this.winFieldText.setTextPosition(
                middleX,
                bottomY - 0.5 * this.winFieldText.height + bottomOffset
            );

            this.gameText.setText(` ${getGameName()} `);
            this.gameText.setScale(
                this.adjustButtonScale(
                    this.gameText.nonScaledWidth,
                    scale,
                    limitScreenPartBars,
                    screenDimensionBars
                )
            );
            this.gameText.setTextPosition(
                0 + 0.5 * this.gameText.width,
                0 + 0.5 * this.gameText.height
            );

            this.topBar.setScale(scale);
            this.topBar.x = middleX; // + (this.topBar.width)
            this.topBar.y = ((scale * this.topBar.height) / 2) * 0.5;
            this.topBar.setScale(rightX / this.topBar.width, scale);

            this.bottomBar.setScale(scale * (bottomOffset != 0 ? 3 : 1));
            this.bottomBar.x = middleX; // + (this.bottomBar.width)
            this.bottomBar.y =
                bottomY - ((scale * this.bottomBar.height) / 2) * 0.5;
            this.bottomBar.setScale(
                rightX / this.bottomBar.width,
                scale * (bottomOffset != 0 ? 3 : 1)
            );
        }
    }

    private getCurrentTime(): string {
        const d = new Date();
        const hr = d.getHours().toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false,
        });
        const min = d.getMinutes().toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false,
        });
        // let sec = (d.getSeconds()).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
        return hr + ':' + min;
    }

    refreshButtonsFromModel(slotData: ISlotDataPresenter): void {
        this.model = slotData;
        this.isAutospin = false;
        console.log('buttons refresh from model', this, slotData);
        if (slotData.betAndAutospin.currentAutospin > 0) {
            this.buttonAutoSpin && this.buttonAutoSpin.kill();
            if (this.buttonStopAutoSpin) {
                if (slotData.status.freeSpins.totalSpins == 0) {
                    !this.isMenuActive && this.buttonStopAutoSpin.revive();
                }
                this.buttonStopAutoSpin.setText(
                    slotData.betAndAutospin.currentAutospin.toString()
                );
                for (let i = 0; i < this.mainButtons.length; i++) {
                    if (this.mainButtons[i] == this.buttonAutoSpin) {
                        this.mainButtons[i] = this.buttonStopAutoSpin;
                        break;
                    }
                }
            }
            this.isAutospin = true;
        } else {
            if (
                this.model.settings.currentPage != 'bet-popup' &&
                slotData.status.freeSpins.totalSpins == 0
            ) {
                !this.isMenuActive &&
                    this.buttonAutoSpin &&
                    this.buttonAutoSpin.revive();
            }

            if (this.buttonBetOk) {
                this.buttonBetOk.selected = true;
            }
            this.buttonStopAutoSpin && this.buttonStopAutoSpin.kill();
            for (let i = 0; i < this.mainButtons.length; i++) {
                if (this.mainButtons[i] == this.buttonStopAutoSpin) {
                    this.mainButtons[i] = this.buttonAutoSpin;
                    break;
                }
            }
        }
        this.resize();
    }

    refreshFromModel(slotData: ISlotDataPresenter, isFutureData = false): void {
        isFutureData;
        this.model = slotData;
        this.isLeftHanded = slotData.settings.leftHanded;

        this.game.events.emit(
            'event-button-select-turbo',
            slotData.settings.turboOn
        );

        console.log('status panel refresh from model', this, slotData);

        if (this.betFieldText) {
            console.log('has bet field');
            this.betFieldText.setValue(slotData.status.bet);
            this.betFieldText.setText(
                ` ${getLanguageTextGameMsg(
                    GameMsgKeys.betJack
                )}  ${this.betFieldText.getText()}   `
            );
        }

        if (this.winFieldText) {
            console.log('has win field');
            if (slotData.status.freeSpins.totalSpins > 0) {
                this.winFieldText.setValue(slotData.status.freeSpins.totalWin);
            } else {
                this.winFieldText.setValue(slotData.status.win);
            }
            this.winFieldText.setText(
                `${getLanguageTextGameMsg(
                    GameMsgKeys.winJack
                )}  ${this.winFieldText.getText()}`
            );
        }

        if (this.balanceFieldText) {
            console.log('has balance field');
            this.balanceFieldText.setValue(slotData.status.balance);
            this.balanceFieldText.setText(
                ` ${getLanguageTextGameMsg(
                    GameMsgKeys.balanceJack
                )}  ${this.balanceFieldText.getText()}`
            );
        }

        this.resize();
    }

    update(): void {
        if (!this.inited) {
            this.game.events.emit('event-init-button-events');
            this.inited = true;
            this.resize();
        }

        if (
            this.turboIsPulsing &&
            !this.turboIsFading &&
            this.buttonTurbo.alive &&
            !this.isMenuActive
        ) {
            this.turboBaseSprite.setAlpha(
                0.5 * (1 + Math.sin((2 * Math.PI * this.time.now) / 825))
            );
        } else if (this.isMenuActive) {
            this.buttonTurbo && this.buttonTurbo.setAlpha(0);
        } else if (!this.turboIsFading) {
            this.buttonTurbo && this.buttonTurbo.setAlpha(1);
        }

        this.clockText.setText(` ${this.getCurrentTime()} `);

        const d = new Date(this.time.now - this.statsStartingTime);
        const hr = (d.getHours() - 1).toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false,
        });
        const min = d.getMinutes().toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false,
        });
        const sec = d.getSeconds().toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false,
        });
        const str = hr + ':' + min + ':' + sec;
        this.timerText.setText(str);
        this.gameText.setText(` ${getGameName()} `);
    }

    fadeInMainButtons(...exceptionButtons: GameButton[]): void {
        this.fadeInFollowingMainButtons(false, ...exceptionButtons);
    }

    fadeInFollowingMainButtons(
        invertExceptions: boolean,
        ...exceptionButtons: GameButton[]
    ): void {
        const mainActiveButtonsSprites = [];
        this.turboIsFading = true;
        this.mainButtons.forEach((button) => {
            if (
                (!exceptionButtons.includes(button) && !invertExceptions) ||
                (invertExceptions && exceptionButtons.includes(button))
            ) {
                button.setDisable();
                if (button === this.buttonTurbo) {
                    this.turboBaseSprite.setAlpha(0);
                    mainActiveButtonsSprites.push(this.turboBaseSprite);
                }

                if (!button.alive) {
                    button.revive();
                    button.setAlpha(0);
                }
                mainActiveButtonsSprites.push(...button.elements);
            }
        });

        this.add.tween({
            targets: mainActiveButtonsSprites,
            duration: 500,
            alpha: 1,
            ease: 'Linear',
            onComplete: () => {
                this.mainButtons.forEach((button) => {
                    if (
                        (!exceptionButtons.includes(button) &&
                            !invertExceptions) ||
                        (invertExceptions && exceptionButtons.includes(button))
                    ) {
                        button.setEnable();
                        button.revive();
                        button.setAlpha(1);
                    }
                });
                this.turboIsFading = false;
            },
        });
    }

    fadeOutMainButtons(...exceptionButtons: GameButton[]): void {
        this.fadeOutFollowingMainButtons(false, ...exceptionButtons);
    }

    fadeOutFollowingMainButtons(
        invertExceptions: boolean,
        ...exceptionButtons: GameButton[]
    ): void {
        const mainActiveButtonsSprites = [];
        this.turboIsFading = true;
        this.mainButtons.forEach((button) => {
            if (
                (!exceptionButtons.includes(button) && !invertExceptions) ||
                (invertExceptions && exceptionButtons.includes(button))
            ) {
                button.setDisable();
                if (button === this.buttonTurbo) {
                    mainActiveButtonsSprites.push(this.turboBaseSprite);
                }
                mainActiveButtonsSprites.push(...button.elements);
            }
        });

        this.add.tween({
            targets: mainActiveButtonsSprites,
            duration: 500,
            alpha: 0,
            ease: 'Linear',
            onComplete: () => {
                this.mainButtons.forEach((button) => {
                    if (
                        (!exceptionButtons.includes(button) &&
                            !invertExceptions) ||
                        (invertExceptions && exceptionButtons.includes(button))
                    ) {
                        button.kill();
                        button.setAlpha(1);
                    }
                });
                this.turboIsFading = false;
            },
        });
    }

    fadeInMenuButtons(): void {
        const menuButtonsSprites = [];

        this.menuButtons.forEach((button) => {
            button.setDisable();
            button.revive();
            button.setAlpha(0);
            menuButtonsSprites.push(...button.elements);
        });

        console.log(menuButtonsSprites);

        this.add.tween({
            targets: menuButtonsSprites,
            duration: 500,
            alpha: 1,
            ease: 'Linear',
            onComplete: () => {
                this.menuButtons.forEach((button) => {
                    button.setEnable();
                    button.revive();
                    button.setAlpha(1);
                });
                this.refreshSettingsButtonsTransparency('settings-popup');
            },
        });
    }

    fadeOutMenuButtons(): void {
        const menuButtonsSprites = [];

        this.menuButtons.forEach((button) => {
            button.setDisable();
            menuButtonsSprites.push(...button.elements);
        });

        this.add.tween({
            targets: menuButtonsSprites,
            duration: 500,
            alpha: 0,
            ease: 'Linear',
            onComplete: () => {
                this.menuButtons.forEach((button) => {
                    button.kill();
                    button.setAlpha(1);
                });
            },
        });
    }

    showMenu(): void {
        if (this.isMenuActive) {
            return;
        }

        this.isMenuActive = 1;

        console.log('showMenu()');
        this.game.events.emit('event-close-popups');

        this.fadeOutMainButtons();

        this.fadeInMenuButtons();

        this.buttonSettings.click();
    }

    closeMenu(): void {
        if (!this.isMenuActive) {
            return;
        }

        this.isMenuActive = 0;

        console.log('closeMenu()');
        this.game.events.emit('event-close-popups');

        this.fadeOutMenuButtons();

        this.fadeInMainButtons(this.buttonBetOk);
    }

    private refreshSettingsButtonsTransparency(whoOpenedIt: string): void {
        let openedBy = this.buttonSettings;

        if (this.buttonInfoPage.alpha === 1) {
            openedBy = this.buttonInfoPage;
        } else if (this.buttonRulesPage.alpha === 1) {
            openedBy = this.buttonRulesPage;
        }

        this.buttonSettings.setAlpha(0.5);
        this.buttonInfoPage.setAlpha(0.5);
        this.buttonRulesPage.setAlpha(0.5);
        this.buttonHelpPage.setAlpha(0.5);

        if (whoOpenedIt == 'settings-popup') {
            this.buttonSettings.setAlpha(1);
        } else if (whoOpenedIt == eUserInputCommands.showInfoPage) {
            this.buttonInfoPage.setAlpha(1);
        } else if (whoOpenedIt == eUserInputCommands.showRulesPage) {
            this.buttonRulesPage.setAlpha(1);
        } else if (whoOpenedIt === eUserInputCommands.openHelpPage) {
            openedBy.setAlpha(1);
        }
    }

    createHistoryElementsAndEvents(): void {
        if (!HISTORY_TOOL) {
            return;
        }
        this.buttonMenuHistory = new GameButton(
            'menuHistory',
            null,
            this,
            0,
            0,
            'history',
            'history',
            'history.',
            'historyButtons',
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            false
        );
        this.buttonMenuHistory.setScale(0.7);
        this.buttonMenuHistory.kill();
        this.menuButtons.push(this.buttonMenuHistory);

        this.buttonCloseHistory = new GameButton(
            'historyClose',
            null,
            this,
            0,
            0,
            basePopupStyle.closeButton.downFrame,
            basePopupStyle.closeButton.idleFrame,
            basePopupStyle.closeButton.overFrame,
            'statusPanel'
        );

        this.buttonCloseHistory.setScale(0.7);
        this.buttonCloseHistory.kill();

        this.game.events.on(
            'event-state-StateAskServerForHistory-onEnter',
            (arg) => {
                arg;
                this.isClosingHistory = false;
                this.bgImage.setDepth(2);
                this.menuBG.setDepth(2);
                this.clock.setDepth(2);
                this.buttonCloseHistory && this.buttonCloseHistory.background.setDepth(2);
                // this.scene.get('Overlays').cameras.main.setAlpha(0);
                this.scene.sleep('Overlays');
                this.buttonCloseHistory && this.buttonCloseHistory.revive();
            },
            this
        );

        this.game.events.on(
            'event-state-StateAskServerForHistory-onExit',
            (arg) => {
                arg;
                this.isClosingHistory = true;
                this.buttonCloseHistory.kill();
                this.scene.wake('Overlays');


                setTimeout(() => {
                    this.bgImage.setDepth(0);
                    this.clock.setDepth(0);
                    this.menuBG.setDepth(0);
                    // this.scene.get('Overlays').cameras.main.setAlpha(1);
                }, 500);
            },
            this
        );

        this.historyPopup = new HistoryPopup(
            this,
            this.bgImage.scale / this.bgImageScaleFactor,
            false,
            getHistoryTextStyle(25)
        );
    }

    historyResizeLandscape(
        scale: number,
        limitScreenPart: number,
        screenDimension: number,
        rightX: number,
        bottomY: number
    ): void {
        if (this.buttonMenuHistory) {
            this.buttonMenuHistory.setScale(
                this.adjustButtonScale(
                    this.buttonMenuHistory.nonScaledWidth,
                    scale,
                    limitScreenPart,
                    screenDimension
                )
            );
            this.buttonMenuHistory.x = this.isLeftHanded
                ? 0 + this.buttonMenuHistory.width
                : rightX - this.buttonMenuHistory.width;
            this.buttonMenuHistory.y = bottomY - this.buttonMenuHistory.height;
            this.historyPopup.resize(false);
        }
    }

    historyResizePortrait(
        scale: number,
        limitScreenPart: number,
        screenDimension: number,
        rightX: number,
        bottomY: number
    ): void {
        if (this.buttonMenuHistory) {
            this.buttonMenuHistory.setScale(
                this.adjustButtonScale(
                    this.buttonMenuHistory.nonScaledWidth,
                    scale,
                    limitScreenPart,
                    screenDimension
                )
            );
            this.buttonMenuHistory.x = this.isLeftHanded
                ? this.buttonMenuHistory.width
                : rightX - this.buttonMenuHistory.width;
            this.buttonMenuHistory.y = 0.1 * bottomY;
            this.historyPopup.resize(true);
        }
    }
}
