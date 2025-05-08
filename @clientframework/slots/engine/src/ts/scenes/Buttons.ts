import ComponentLayer from '@commonEngine/Scenes/ComponentLayer';
import {
    IReelCoordinatesData,
    syncCameraWithReelsCoordinatesData,
} from '../dataPresenterVisual/iReelCoordinatesData';
import GameButton from '@commonEngine/GameObjects/gameButton';
import { ISlotDataPresenter } from '../dataPresenter/interfaces';
import { eUserInputCommands } from '../gameFlow/userInput/userInputCommands';
import DeviceManager from '@clientframework/slots/engine/@clientframework/common/engine/src/ts/Scenes/DeviceManager';
import { globalGetIsPortrait } from '@clientframework/slots/engine/@clientframework/common/engine/src/ts/globalGetIsPortrait';
import { basePopupStyle, THREE_SECOND_RULE } from '@specific/config';
import { HISTORY_TOOL } from '../dataPresenter/defaultConfigSlot';
import { hasHistory } from '@clientframework/common/backend-service/src/launchParams/hasHistory';
import { hasHistoryUrl } from '@clientframework/common/backend-service/src/launchParams/historyUrl';

export default class Buttons extends ComponentLayer {
    constructor() {
        super({
            key: 'Buttons',
        });
    }

    // goes to true after first update()
    inited = false;

    buttonSpin: GameButton;

    buttonSpinStop: GameButton;
    buttonTurbo: GameButton;

    buttonAutoSpin: GameButton;
    buttonStopAutoSpin: GameButton;
    buttonBet: GameButton;
    buttonMenu: GameButton;

    buttonMenuInfo: GameButton;
    buttonMenuRules: GameButton;
    buttonMenuSettings: GameButton;
    buttonMenuCancel: GameButton;
    buttonMenuHome: GameButton;
    buttonFreeSpinsHome: GameButton;
    buttonMenuHelp: GameButton;
    buttonMenuHistory: GameButton;
    buttonCloseHistory: GameButton;

    menuButtons: GameButton[] = [];
    mainActiveButtons: GameButton[] = [];

    isAutospin = false;
    isMenuActive = false;
    isLeftHanded = false;

    lastReelsCoordsData: IReelCoordinatesData = null;

    deviceManager: DeviceManager;

    historyMenuActive = false;

    create(): void {
        this.buttonBet = new GameButton(
            'bet',
            null,
            this,
            0,
            0,
            'betLandscapeIdle',
            'betLandscapeDown',
            'betLandscapeOver',
            'statusPanel',
            'betIdle',
            'betDown',
            'betOver'
        );
        this.mainActiveButtons.push(this.buttonBet);

        this.buttonSpin = new GameButton(
            'spin',
            null,
            this,
            0,
            0,
            'spinLandscapeIdle',
            'spinLandscapeDown',
            'spinLandscapeOver',
            'statusPanel',
            'spinIdle',
            'spinDown',
            'spinOver'
        );
        this.mainActiveButtons.push(this.buttonSpin);

        this.buttonSpinStop = new GameButton(
            'spinStop',
            null,
            this,
            0,
            0,
            'stopLandscapeIdle',
            'stopLandscapeDown',
            'stopLandscapeOver',
            'statusPanel',
            'stopIdle',
            'stopDown',
            'stopOver'
        );
        this.buttonSpinStop.kill();
        this.buttonSpin.onSamePlace.push(this.buttonSpinStop);
        //this.mainActiveButtons.push(this.buttonSpinStop);
        if (!THREE_SECOND_RULE) {
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
                'StandardSpeedOver',
                'StandardSpeedIdle',
                'StandardSpeedDown',
                'StandardSpeedOver'
            );
            this.mainActiveButtons.push(this.buttonTurbo);
        }

        this.buttonAutoSpin = new GameButton(
            'autospin',
            null,
            this,
            0,
            0,
            'autospinLandscapeIdle',
            'autospinLandscapeDown',
            'autospinLandscapeOver',
            'statusPanel',
            'autospinIdle',
            'autospinDown',
            'autospinOver'
        );
        this.mainActiveButtons.push(this.buttonAutoSpin);

        const isPixelPerfect = false;
        this.buttonStopAutoSpin = new GameButton(
            'stopAutospin',
            null,
            this,
            0,
            0,
            'stopAutospin',
            'stopAutospin',
            'stopAutospin',
            'statusPanel',
            'stopAutospin',
            'stopAutospin',
            'stopAutospin',
            'stopAutospin',
            'stopAutospin',
            'stopAutospin',
            'stopAutospin',
            'stopAutospin',
            'stopAutospin',
            isPixelPerfect
        );
        //this.mainActiveButtons.push(this.buttonStopAutoSpin);

        this.buttonStopAutoSpin._createTextLabel('A', {
            fontSize: '100px',
            fontFamily: 'Arial',
            align: 'center',
            color: '#fff',
            stroke: '#000',
            strokeThickness: 0,
        });
        this.buttonStopAutoSpin.kill();

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
        );
        this.mainActiveButtons.push(this.buttonMenu);

        // MENU BUTTONS

        this.buttonMenuRules = new GameButton(
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
        this.buttonMenuRules.setScale(0.7);
        this.buttonMenuRules.kill();
        this.menuButtons.push(this.buttonMenuRules);

        this.buttonMenuInfo = new GameButton(
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
        this.buttonMenuInfo.setScale(0.7);
        this.buttonMenuInfo.kill();
        this.menuButtons.push(this.buttonMenuInfo);

        this.buttonMenuSettings = new GameButton(
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
        this.buttonMenuSettings.setScale(0.7);
        this.buttonMenuSettings.kill();
        this.menuButtons.push(this.buttonMenuSettings);

        this.buttonMenuCancel = new GameButton(
            'menuCancel',
            null,
            this,
            0,
            0,
            'menucloseIdle',
            'menucloseDown',
            'menucloseOver',
            'statusPanel'
        );
        this.buttonMenuCancel.setScale(0.7);
        this.buttonMenuCancel.kill();
        this.menuButtons.push(this.buttonMenuCancel);

        this.buttonMenuHelp = new GameButton(
            'menuHelp',
            null,
            this,
            0,
            0,
            'helpIdle',
            'helpDown',
            'helpOver',
            'helpButtons'
        );

        this.buttonMenuHelp.setScale(0.7);
        this.buttonMenuHelp.kill();
        this.menuButtons.push(this.buttonMenuHelp);

        if (HISTORY_TOOL) {
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
            this.buttonCloseHistory.kill();
            //this.menuButtons.push(this.buttonCloseHistory);
        }

        this.game.events.on(
            'event-button-clicked-menuHistory',
            (val) => {
                if (hasHistoryUrl()) {
                    return;
                }
                val;
                if (!this.historyMenuActive) {
                    this.historyMenuActive = true;
                    this.game.events.emit('event-close-popups');
                    this.menuButtons.forEach((button) => {
                        if (button && button !== this.buttonCloseHistory) {
                            button.kill();
                        }
                    });
                } else {
                    this.game.events.emit('event-button-clicked-menuCancel');
                    this.game.events.emit('event-button-clicked-historyClose');
                    this.historyMenuActive = false;
                }
            },
            this
        );

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

                    this.buttonFreeSpinsHome = new GameButton(
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
                    this.buttonFreeSpinsHome.setScale(0.7);
                    this.buttonFreeSpinsHome.kill();
                    //this.menuButtons.push(this.buttonFreeSpinsHome);
                }
            },
            this
        );
        this.game.events.emit('event-request-lobby-url');

        this.game.events.on(
            'event-current-data-updated',
            this.refreshFromModel,
            this
        );

        this.game.events.on(
            `event-user-input-${eUserInputCommands.historyClose}`,
            this.closeMenu,
            this
        );

        this.game.events.on(
            'event-reels-scene-coords-data',
            (data: IReelCoordinatesData) => {
                this.lastReelsCoordsData = data;
                this.resizeThisLayer(data);
            }
        );
        this.game.events.emit('event-request-reels-scene-coords-data');

        this.game.events.on('event-show-menu', this.showMenu, this);

        this.game.events.on(
            `event-user-input-${eUserInputCommands.closeMenu}`,
            this.closeMenu,
            this
        );

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
                this.buttonSpin.revive();
                this.buttonSpinStop.kill();
            },
            this
        );

        this.game.events.on(
            'event-state-StateAskServerForHistory-onEnter',
            () => {
                this.buttonCloseHistory && this.buttonCloseHistory.revive();
                this.buttonMenuHistory && this.buttonMenuHistory.kill();
            },
            this
        );

        this.game.events.on(
            'event-state-StateAskServerForHistory-onExit',
            () => {
                // this.buttonMenuHistory.revive();
                this.buttonCloseHistory && this.buttonCloseHistory.kill();
                this.historyMenuActive = false;
            },
            this
        );
    }

    resizeThisLayer(data: IReelCoordinatesData): void {
        syncCameraWithReelsCoordinatesData(this, data);

        if (globalGetIsPortrait(this)) {
            this.resizePortrait(data);
        } else {
            this.resizeLandscape(data);
        }
    }

    resizeLandscape(data: IReelCoordinatesData): void {
        const deltaXReels = data.reelsCoords[1].x - data.reelsCoords[0].x;
        const deltaYSymbol =
            data.reelsScale *
            (data.symbolsCoords[1][1].y - data.symbolsCoords[1][0].y);
        const reelsH = 3 * deltaYSymbol;
        const bottomReelsY = data.reelsCoords[2].y + reelsH;
        const bottomScreenY = this.scale.gameSize.height / data.camera.zoom;

        const rightScreenX =
            (0.5 * this.scale.gameSize.width) / data.camera.zoom;
        const reelsW = 5 * deltaXReels;
        const rightReelsX = data.reelsCoords[0].x + reelsW;

        const fieldY = bottomReelsY + 0.5 * (bottomScreenY - bottomReelsY);
        const mainButtonsX =
            (this.isLeftHanded ? -1 : 1) *
            (rightReelsX + 0.5 * (rightScreenX - rightReelsX));

        if (this.buttonSpin) {
            this.buttonSpin.x = mainButtonsX;
            this.buttonSpin.y = data.reelsCoords[4].y + 1.5 * deltaYSymbol;
        }

        if (this.buttonSpinStop) {
            this.buttonSpinStop.x = this.buttonSpin.x;
            this.buttonSpinStop.y = this.buttonSpin.y;
        }

        if (this.buttonBet) {
            this.buttonBet.x = mainButtonsX;
            this.buttonBet.y = data.reelsCoords[4].y + 0.5 * deltaYSymbol;
        }

        if (this.buttonAutoSpin) {
            this.buttonAutoSpin.x = mainButtonsX;
            this.buttonAutoSpin.y = data.reelsCoords[4].y + 2.5 * deltaYSymbol;
        }

        if (this.buttonStopAutoSpin) {
            this.buttonStopAutoSpin.x = this.buttonAutoSpin.x;
            this.buttonStopAutoSpin.y = this.buttonAutoSpin.y;
            this.buttonStopAutoSpin.setScale(0.8);
        }

        const menuY = fieldY;
        const menuX = mainButtonsX;
        const menuOffsetY = 1.3;
        //const menuOffsetX = 1.3;
        if (this.buttonMenu) {
            this.buttonMenu.x = mainButtonsX;
            this.buttonMenu.y = menuY;
        }

        if (this.buttonMenuRules) {
            this.buttonMenuRules.x = menuX;
            this.buttonMenuRules.y =
                menuY - menuOffsetY * this.buttonMenuRules.height;
        }

        if (this.buttonTurbo) {
            this.buttonTurbo.x = -this.buttonMenu.x; //this.buttonMenu.x + (this.isLeftHanded? 1 : -1) * (menuOffsetX * this.buttonMenuRules.width);
            this.buttonTurbo.y = menuY;
        }
        if (this.buttonMenuHistory) {
            this.buttonMenuHistory.x = -this.buttonMenu.x; //this.buttonMenu.x + (this.isLeftHanded? 1 : -1) * (menuOffsetX * this.buttonMenuRules.width);
            this.buttonMenuHistory.y = menuY;
            this.buttonMenuHistory.setScale(0.7);
        }

        if (this.buttonCloseHistory) {
            this.buttonCloseHistory.x = -this.buttonMenu.x; //this.buttonMenu.x + (this.isLeftHanded? 1 : -1) * (menuOffsetX * this.buttonMenuRules.width);
            this.buttonCloseHistory.y = menuY;
            this.buttonCloseHistory.setScale(0.5);
        }

        if (this.buttonMenuInfo) {
            this.buttonMenuInfo.x = menuX;
            this.buttonMenuInfo.y =
                this.buttonMenuRules.y -
                menuOffsetY * this.buttonMenuInfo.height;
        }

        if (this.buttonMenuSettings) {
            this.buttonMenuSettings.x = menuX;
            this.buttonMenuSettings.y =
                this.buttonMenuInfo.y -
                menuOffsetY * this.buttonMenuSettings.height;
        }

        if (this.buttonMenuHome) {
            this.buttonMenuHome.x = menuX;
            this.buttonMenuHome.y =
                this.buttonMenuSettings.y -
                menuOffsetY * this.buttonMenuHome.height;
        }

        if (this.buttonFreeSpinsHome) {
            this.buttonFreeSpinsHome.x = this.buttonMenu.x;
            this.buttonFreeSpinsHome.y = this.buttonMenu.y;
        }

        if (this.buttonMenuCancel) {
            this.buttonMenuCancel.x = menuX;
            this.buttonMenuCancel.y = menuY;
        }

        const buttonHelpCoordinateY = this.buttonMenuHome
            ? this.buttonMenuHome.y
            : this.buttonMenuSettings.y;

        if (this.buttonMenuHelp) {
            this.buttonMenuHelp.x = menuX;
            this.buttonMenuHelp.y =
                buttonHelpCoordinateY -
                menuOffsetY * this.buttonMenuHelp.height;
        }
    }

    resizePortrait(data: IReelCoordinatesData): void {
        const deltaXReels = data.reelsCoords[1].x - data.reelsCoords[0].x;
        const deltaYSymbol =
            data.reelsScale *
            (data.symbolsCoords[1][1].y - data.symbolsCoords[1][0].y);
        const reelsH = 3 * deltaYSymbol;
        const bottomReelsY = data.reelsCoords[2].y + reelsH;
        const bottomScreenY = this.scale.gameSize.height / data.camera.zoom;

        let iphoneMoveUp = false;
        this.deviceManager = this.scene.get('DeviceManager') as DeviceManager;
        if (
            navigator.userAgent.includes('iPhone') &&
            globalGetIsPortrait(this) &&
            this.deviceManager &&
            this.deviceManager.isIPhoneFullScreen
        ) {
            const screenWidth =
                this.scale.gameSize.width / this.cameras.main.zoom;
            const screenHeight =
                this.scale.gameSize.height / this.cameras.main.zoom;
            const phoneAspectRatio = screenWidth / screenHeight;
            if (phoneAspectRatio <= 0.9 * (1080 / 1920)) {
                iphoneMoveUp = true;
            }
        }
        let mainButtonsY = bottomReelsY + 0.65 * (bottomScreenY - bottomReelsY);
        if (iphoneMoveUp) {
            mainButtonsY = bottomReelsY + 0.45 * (bottomScreenY - bottomReelsY);
        }

        if (this.buttonSpin) {
            this.buttonSpin.x = data.reelsCoords[2].x + 0.5 * deltaXReels;
            this.buttonSpin.y = mainButtonsY;
        }

        if (this.buttonSpinStop) {
            this.buttonSpinStop.x = this.buttonSpin.x;
            this.buttonSpinStop.y = this.buttonSpin.y;
        }

        if (this.buttonBet) {
            this.buttonBet.x = data.reelsCoords[2].x - 1.25 * deltaXReels;
            this.buttonBet.y = mainButtonsY;
        }

        if (this.buttonAutoSpin) {
            this.buttonAutoSpin.x = data.reelsCoords[2].x + 2.25 * deltaXReels;
            this.buttonAutoSpin.y = mainButtonsY;
        }

        if (this.buttonStopAutoSpin) {
            this.buttonStopAutoSpin.x = this.buttonAutoSpin.x;
            this.buttonStopAutoSpin.y = this.buttonAutoSpin.y;
            this.buttonStopAutoSpin.setScale(1);
        }

        let menuY = bottomReelsY + 0.9 * (bottomScreenY - bottomReelsY);
        if (iphoneMoveUp) {
            menuY = bottomReelsY + 0.7 * (bottomScreenY - bottomReelsY);
        }
        const menuOffsetX = 1.3;

        if (this.buttonMenu) {
            this.buttonMenu.x =
                (this.isLeftHanded ? -1 : 1) *
                (data.reelsCoords[2].x + 2.5 * deltaXReels);
            this.buttonMenu.y = menuY;
        }

        if (this.buttonMenuRules) {
            this.buttonMenuRules.x =
                this.buttonMenu.x +
                (this.isLeftHanded ? 1 : -1) *
                (menuOffsetX * this.buttonMenuRules.width);
            this.buttonMenuRules.y = menuY;
        }

        if (this.buttonTurbo) {
            this.buttonTurbo.x = -this.buttonMenu.x; //this.buttonMenu.x + (this.isLeftHanded? 1 : -1) * (menuOffsetX * this.buttonMenuRules.width);
            this.buttonTurbo.y = menuY;
        }
        if (this.buttonMenuHistory) {
            this.buttonMenuHistory.x = -this.buttonMenu.x; //this.buttonMenu.x + (this.isLeftHanded? 1 : -1) * (menuOffsetX * this.buttonMenuRules.width);
            this.buttonMenuHistory.y = menuY;
            this.buttonMenuHistory.setScale(0.7);
        }

        if (this.buttonCloseHistory) {
            this.buttonCloseHistory.x = -this.buttonMenu.x; //this.buttonMenu.x + (this.isLeftHanded? 1 : -1) * (menuOffsetX * this.buttonMenuRules.width);
            this.buttonCloseHistory.y = menuY;
            this.buttonCloseHistory.setScale(0.5);
        }

        if (this.buttonMenuInfo) {
            this.buttonMenuInfo.x =
                this.buttonMenuRules.x +
                (this.isLeftHanded ? 1 : -1) *
                (menuOffsetX * this.buttonMenuInfo.width);
            this.buttonMenuInfo.y = menuY;
        }

        if (this.buttonMenuSettings) {
            this.buttonMenuSettings.x =
                this.buttonMenuInfo.x +
                (this.isLeftHanded ? 1 : -1) *
                (menuOffsetX * this.buttonMenuSettings.width);
            this.buttonMenuSettings.y = menuY;
        }

        if (this.buttonMenuHome) {
            this.buttonMenuHome.x =
                this.buttonMenuSettings.x +
                (this.isLeftHanded ? 1 : -1) *
                (menuOffsetX * this.buttonMenuHome.width);
            this.buttonMenuHome.y = menuY;
        }

        if (this.buttonFreeSpinsHome) {
            this.buttonFreeSpinsHome.x = this.buttonMenu.x;
            this.buttonFreeSpinsHome.y = this.buttonMenu.y;
        }

        if (this.buttonMenuCancel) {
            this.buttonMenuCancel.x = this.buttonMenu.x;
            this.buttonMenuCancel.y = menuY;
        }

        const buttonHelpCoordinateX = this.buttonMenuHome
            ? this.buttonMenuHome.x
            : this.buttonMenuSettings.x;

        if (this.buttonMenuHelp) {
            this.buttonMenuHelp.x =
                buttonHelpCoordinateX +
                (this.isLeftHanded ? 1 : -1) *
                (menuOffsetX * this.buttonMenuHelp.width);
            this.buttonMenuHelp.y = menuY;
        }
    }

    refreshFromModel(
        slotData: ISlotDataPresenter,
        isStopForAutospin = false
    ): void {
        this.game.events.emit(
            'event-button-select-turbo',
            slotData.settings.turboOn
        );

        this.isAutospin = false;
        if (isStopForAutospin) {
            return;
        }
        console.log('buttons refresh from model', this, slotData);
        if (slotData.betAndAutospin.currentAutospin > 0) {
            this.buttonAutoSpin && this.buttonAutoSpin.kill();
            if (this.buttonStopAutoSpin) {
                !this.isMenuActive && this.buttonStopAutoSpin.revive();
                this.buttonStopAutoSpin.setText(
                    slotData.betAndAutospin.currentAutospin.toString()
                );
                for (let i = 0; i < this.mainActiveButtons.length; i++) {
                    if (this.mainActiveButtons[i] == this.buttonAutoSpin) {
                        this.mainActiveButtons[i] = this.buttonStopAutoSpin;
                    }
                    if (this.mainActiveButtons[i] == this.buttonSpin) {
                        this.mainActiveButtons[i] = this.buttonSpinStop;
                    }
                }
            }
            this.isAutospin = true;
        } else {
            !this.isMenuActive &&
                this.buttonAutoSpin &&
                this.buttonAutoSpin.revive();
            this.buttonStopAutoSpin && this.buttonStopAutoSpin.kill();
            for (let i = 0; i < this.mainActiveButtons.length; i++) {
                if (this.mainActiveButtons[i] == this.buttonStopAutoSpin) {
                    this.mainActiveButtons[i] = this.buttonAutoSpin;
                }
                if (this.mainActiveButtons[i] == this.buttonSpinStop) {
                    this.mainActiveButtons[i] = this.buttonSpin;
                }
            }
        }
        this.isLeftHanded = slotData.settings.leftHanded;
        if (this.buttonSpin) {
            if (slotData.settings.holdForAuto) {
                this.buttonSpin.enableHolding(
                    slotData.settings.holdForAutoDelay
                );
            } else {
                this.buttonSpin.disableHolding();
            }
        }

        if (this.lastReelsCoordsData) {
            this.resizeThisLayer(this.lastReelsCoordsData);
        }

        if (slotData.status.freeSpins.totalSpins > 0) {
            this.mainActiveButtons.forEach((button) => {
                button && button != this.buttonTurbo && button.kill();
            });
            this.buttonSpinStop && this.buttonSpinStop.kill();
            this.buttonFreeSpinsHome && this.buttonFreeSpinsHome.revive();
        } else {
            if (!this.isMenuActive) {
                this.mainActiveButtons.forEach((button) => {
                    button && button.revive();
                });
            }
            this.buttonFreeSpinsHome && this.buttonFreeSpinsHome.kill();
        }
    }

    update(): void {
        if (!this.inited) {
            this.game.events.emit('event-init-button-events');
            this.inited = true;
        }
        if (this.buttonStopAutoSpin) {
            this.buttonStopAutoSpin.background.angle = Phaser.Math.RadToDeg(
                -(2 * Math.PI * this.time.now) / 2000
            );
        }
    }

    showMenu(): void {
        if (this.isMenuActive) {
            return;
        }

        this.isMenuActive = true;

        console.log('showMenu()');
        this.game.events.emit('event-close-popups');

        const menuButtonsSprites = [];
        const mainActiveButtonsSprites = [];

        this.menuButtons.forEach((button) => {
            button.setDisable();
            button.revive();
            button.setAlpha(0);
            menuButtonsSprites.push(...button.elements);
        });

        this.mainActiveButtons.forEach((button) => {
            button.setDisable();
            mainActiveButtonsSprites.push(...button.elements);
        });

        console.log(menuButtonsSprites);
        console.log(mainActiveButtonsSprites);

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
            },
        });

        this.add.tween({
            targets: mainActiveButtonsSprites,
            duration: 500,
            alpha: 0,
            ease: 'Linear',
            onComplete: () => {
                this.mainActiveButtons.forEach((button) => {
                    button.kill();
                    button.setAlpha(1);
                });
            },
        });
    }

    closeMenu(): void {
        if (!this.isMenuActive) {
            return;
        }

        this.isMenuActive = false;

        console.log('closeMenu()');
        this.game.events.emit('event-close-popups');

        const menuButtonsSprites = [];
        const mainActiveButtonsSprites = [];

        this.mainActiveButtons.forEach((button) => {
            button.setDisable();
            button.revive();
            button.setAlpha(0);
            mainActiveButtonsSprites.push(...button.elements);
        });

        this.menuButtons.forEach((button) => {
            button.setDisable();
            menuButtonsSprites.push(...button.elements);
        });

        this.add.tween({
            targets: mainActiveButtonsSprites,
            duration: 500,
            alpha: 1,
            ease: 'Linear',
            onComplete: () => {
                this.mainActiveButtons.forEach((button) => {
                    button.setEnable();
                    button.revive();
                    button.setAlpha(1);
                });
            },
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
}
