import Background from '@commonEngine/Scenes/Background';
import { eUserInputCommands } from '@clientframework/slots/engine/src/ts/gameFlow/userInput/userInputCommands';
import GameButton from '@clientframework/slots/engine/@clientframework/common/engine/src/ts/GameObjects/gameButton';
import { TextPopup } from '@clientframework/slots/engine/src/ts/game-objects/textPopup';
import { ISlotDataPresenter } from '@clientframework/slots/engine/src/ts/dataPresenter/interfaces';
import DeviceManager from '@clientframework/slots/engine/@clientframework/common/engine/src/ts/Scenes/DeviceManager';
import { globalGetIsPortrait } from '@clientframework/slots/engine/@clientframework/common/engine/src/ts/globalGetIsPortrait';
import { THREE_SECOND_RULE } from '@specific/config';
import { getLanguageTextGameMsg } from '@clientframework/common/backend-service/src/client-remote-data/src/multilanguage/gameMsgData';
import { GameMsgKeys } from '@clientframework/common/backend-service/src/client-remote-data/src/multilanguage/gameMsgKeys';
import { HISTORY_TOOL } from '@clientframework/slots/engine/src/ts/dataPresenter/defaultConfigSlot';
import {
    HistoryPopup,
    getHistoryTextStyle,
} from '@clientframework/slots/engine/src/ts/game-objects/historyPopup';
import { slotDataPresenter } from '@clientframework/slots/engine/src/ts/dataPresenter/instances';
import { getGameLanguage } from '@clientframework/common/backend-service/src/client-remote-data/src/launchParams/gameLanguage';


export default class BackgroundSpecificSettings extends Background {
    constructor() {
        super('BackgroundSettings');
    }

    buttongambleMystery: GameButton;
    buttongamble: GameButton;
    buttonCollect: GameButton;
    buttonBet: GameButton;
    buttonBetOk: GameButton;
    buttonMenu: GameButton;
    buttonMenuCancel: GameButton;
    buttonCloseHistory: GameButton;
    //buttonSpinB: GameButton;
    buttonSpinStop: GameButton;
    buttonSpin: GameButton;
    buttonAutoSpin: GameButton;
    buttonStopAutoSpin: GameButton;
    // buttonAutoSign: GameButton;
    // buttonAutoStop: GameButton;
    //  buttonSettings: GameButton;
    buttonGambleon: GameButton;
    buttonTurbo: GameButton;
    // buttonTurboOn: GameButton;
    buttonFullScreen: GameButton;
    buttonFullScreenExit: GameButton;
    buttonRulesPage: GameButton;
    buttonMenuHome: GameButton;
    buttonMenuHistory: GameButton;
    isClosingHistory = false;
    historyPopup: HistoryPopup;
    mainActiveButtons: GameButton[] = [];
    buttonHelpPage: GameButton;
    buttonSoundOn: GameButton;
    buttonMusicOn: GameButton;
    allButtonsElements: Phaser.GameObjects.Sprite[] = [];
    mainButtons: GameButton[] = [];
    menuButtons: GameButton[] = [];
    betMenuButtons: GameButton[] = [];

    buttonsCreated = false;
    buttonsCollectShow = false;
    buttonSoundClicked = false;
    isFullscreen = false;
    inited = false;

    clockText: TextPopup;
    timerText: TextPopup;
    betFieldText: TextPopup;
    betFieldTextAmt: TextPopup;
    collectText: TextPopup;
    betFieldText1: TextPopup;
    betFieldTextAmt1: TextPopup;
    winFieldText: TextPopup;
    winFieldTextAmt: TextPopup;
    winFieldText1: TextPopup;
    winFieldTextAmt1: TextPopup;
    balanceFieldText: TextPopup;
    balanceFieldTextAmt: TextPopup;
    gameText: TextPopup;

    topBar: Phaser.GameObjects.Sprite;
    bottomBar: Phaser.GameObjects.Sprite;
    clock: Phaser.GameObjects.Sprite;
    buttonPanelBackPort: Phaser.GameObjects.Sprite;
    buttonPanelBackLand: Phaser.GameObjects.Sprite;
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
        this.bgImage = this.add.image(0, 0, 'bg');
        this.bgImage.setActive(false).setVisible(false).setAlpha(1);

        this.buttonPanelBackPort = this.add.sprite(
            0,
            0,
            'uiPanel',
            'Bet-Win panel - port'
        );
        this.buttonPanelBackPort.setVisible(false);
        this.buttonPanelBackLand = this.add.sprite(
            0,
            0,
            'uiPanel',
            'Bet-Win panel - land'
        );
        this.buttonPanelBackLand.setVisible(false);
        // this.buttonPanelBackLand.setOrigin(0, 0);
        // this.buttonPanelBackLand.setDepth(1);
        this.buttonPanelBackPort.setOrigin(0, 0);
        this.buttonPanelBackPort.setDepth(1);

        // skips parent specific init
        super.init(data, true);
    }

    create(): void {
        this.input.on(
            'pointerdown',
            function (event, gameObjects) {
                if (slotDataPresenter.historyData.pageActive) {
                    return;
                }
                if (
                    (!gameObjects || gameObjects.length == 0) &&
                    !slotDataPresenter.historyData.isLoadingHistory
                ) {
                    this.game.events.emit('event-close-popups');
                    this.game.events.emit(
                        `event-user-input-${eUserInputCommands.closeMenu}`
                    );
                    // if (slotDataPresenter.historyData.pageActive) {
                    //     this.game.events.emit(
                    //         `event-user-input-${eUserInputCommands.historyClose}`
                    //     );
                    // }
                    this.game.events.emit('event-disableEnableMenuBtn', false);
                }
            },
            this
        );

        this.topBar = this.add.sprite(0, 0, 'uiPanel', 'Portrait top bar');
        this.topBar.setActive(false).setVisible(false).setAlpha(1);
        this.bottomBar = this.add.sprite(
            0,
            0,
            'uiPanel',
            'Landscape Bottom bar'
        );
        this.bottomBar.setActive(false).setVisible(false).setAlpha(1);
        this.clock = this.add.sprite(0, 0, 'uiPanel', 'Clock');

        const style = {
            fontSize: 'bold 32px',
            fontFamily: 'ArialNarrow',
            align: 'left',
            color: '#fff',
            // stroke: '#000',
            // strokeThickness: 16,
        };
        const styleCollect = {
            fontSize: '35px',
            fontFamily: 'ArialNarrow',
            align: 'left',
            color: '#fff',
            stroke: '#000',
            strokeThickness: 7,
        };

        const styleClock = {
            fontSize: 'bold 34px',
            fontFamily: 'ArialNarrow',
            align: 'left',
            color: '#fef800',
            // stroke: '#000',
            // strokeThickness: 16,
        };
        // const styleAmt = {
        //     fontSize: 'bold 40px',
        //     fontFamily: 'ArialNarrow',
        //     align: 'left',
        //     color: '#fef800',
        //     // stroke: '#000',
        //     // strokeThickness: 16,
        // };
        const styleBetAndWinAmt = {
            fontSize: 'bold 45px',
            fontFamily: 'ArialNarrow',
            align: 'left',
            color: '#fef800',
            // stroke: '#000',
            // strokeThickness: 16,
        };

        this.clockText = new TextPopup(
            this,
            'timeText',
            0,
            0,
            false,
            styleClock,
            undefined,
            ''
        );
        // this.timerText = new TextPopup(this, 'timerText', 0, 0, false, styleAmt);
        // this.gameText = new TextPopup(this, 'gameText', 0, 0, false, style);
        /*this.betFieldText = new TextPopup(
            this,
            'betFieldText',
            0,
            0,
            false,
            style
        );

        this.betFieldTextAmt = new TextPopup(
            this,
            'betFieldTextAmt',
            0,
            0,
            false,
            styleAmt
        );
*/
        this.collectText = new TextPopup(
            this,
            'collectText',
            0,
            0,
            false,
            styleCollect,
            undefined,
            ''
        );
        this.collectText.turnOff();
        this.betFieldText1 = new TextPopup(
            this,
            'betFieldText1',
            0,
            0,
            false,
            style,
            undefined,
            ''
        );

        this.betFieldTextAmt1 = new TextPopup(
            this,
            'betFieldTextAmt1',
            0,
            0,
            false,
            styleBetAndWinAmt
        );

        /*this.winFieldText = new TextPopup(
            this,
            'winFieldText',
            0,
            0,
            false,
            style
        );*/

        /*this.winFieldTextAmt = new TextPopup(
            this,
            'winFieldTextAmt',
            0,
            0,
            false,
            styleAmt
        );*/

        this.winFieldText1 = new TextPopup(
            this,
            'winFieldText1',
            0,
            0,
            false,
            style,
            undefined,
            ''
        );
        this.winFieldTextAmt1 = new TextPopup(
            this,
            'winFieldTextAmt1',
            0,
            0,
            false,
            styleBetAndWinAmt
        );
        this.balanceFieldText = new TextPopup(
            this,
            'balanceFieldText',
            0,
            0,
            false,
            style,
            undefined,
            ''
        );

        this.balanceFieldTextAmt = new TextPopup(
            this,
            'balanceFieldTextAmt',
            0,
            0,
            false,
            styleClock
        );
        //GAME BUTTONS
        this.buttonBet = new GameButton(
            'bet',
            null,
            this,
            0,
            0,
            'Bet_panel_opening_marker_land',
            'Bet_panel_opening_marker_land',
            'Bet_panel_opening_marker_land',
            'uiPanel'
        );
        this.allButtonsElements.push(...this.buttonBet.elements);
        this.buttongambleMystery = new GameButton(
            'mysteryGamble',
            null,
            this,
            0,
            0,
            'Gamble-button-land',
            'Gamble-button-land',
            'Gamble-button-land',
            'uiPanel',
            'Gamble-button-port',
            'Gamble-button-port',
            'Gamble-button-port'
        );
        //this.buttonBet.kill();
        this.allButtonsElements.push(...this.buttongambleMystery.elements);

        this.buttongamble = new GameButton(
            'x2Gamble',
            null,
            this,
            0,
            0,
            'Gamble-button-land',
            'Gamble-button-land',
            'Gamble-button-land',
            'uiPanel',
            'Gamble-button-port',
            'Gamble-button-port',
            'Gamble-button-port'
        );
        //this.buttonBet.kill();
        this.allButtonsElements.push(...this.buttongamble.elements);
        this.buttongamble._createTextLabel('GAMBLE', {
            fontSize: '25px',
            fontFamily: 'fortunaForJack',
            align: 'center',
            color: '#fff',
            stroke: '#000',
            strokeThickness: 5,
        });
        this.buttongamble.kill();

        this.buttongambleMystery._createTextLabel('GAMBLE\nMYSTERY', {
            fontSize: '25px',
            fontFamily: 'fortunaForJack',
            align: 'center',
            color: '#fff',
            stroke: '#000',
            strokeThickness: 5,
        });
        this.buttongambleMystery.kill();

        this.buttonCollect = new GameButton(
            'collectGamble',
            null,
            this,
            0,
            0,
            'Spin-Land-base',
            'Spin-Land-base',
            'Spin-Land-base',
            'uiPanel',
            'Spin port',
            'Spin port',
            'Spin port'
        );
        this.buttonCollect._createSpriteField('uiPanel', 'Spin-Land-arrows');
        this.allButtonsElements.push(...this.buttonCollect.elements);
        this.buttonCollect._createTextLabel('SPIN', {
            fontSize: '23px',
            fontFamily: 'Arial',
            align: 'center',
            color: '#fff',
            // stroke: '#000',
            // strokeThickness: 5,
        });
        this.buttonCollect.kill();

        this.buttonBetOk = new GameButton(
            'bet',
            null,
            this,
            0,
            0,
            'Bet_panel_closing_marker_land',
            'Bet_panel_closing_marker_land',
            'Bet_panel_closing_marker_land',
            'uiPanel'
        );
        this.buttonBetOk.kill();
        this.allButtonsElements.push(...this.buttonBetOk.elements);

        this.buttonMenu = new GameButton(
            'menu',
            null,
            this,
            0,
            0,
            'MENU',
            'MENU',
            'MENU',
            'uiPanel'
        ); //menuRules
        //this.buttonMenu.kill();
        this.allButtonsElements.push(...this.buttonMenu.elements);

        this.buttonMenuCancel = new GameButton(
            'menuCancel',
            null,
            this,
            0,
            0,
            'MENU',
            'MENU',
            'MENU',
            'uiPanel'
        ); //menuRules
        //this.buttonMenuCancel.kill();
        this.allButtonsElements.push(...this.buttonMenuCancel.elements);

        this.buttonCloseHistory = new GameButton(
            'historyClose',
            null,
            this,
            0,
            0,
            'Exit',
            'Exit',
            'Exit',
            'uiPanel',
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

        this.buttonCloseHistory.kill();

        // this.buttonSpinB = new GameButton("spinB", null, this, 0, 0, "Spin-button", "Spin-button", "Spin-button", "statusPanel");
        // //this.buttonSpinB.kill();
        // this.allButtonsElements.push(...this.buttonSpinB.elements);

        this.buttonSpin = new GameButton(
            'spin',
            null,
            this,
            0,
            0,
            'Spin-Land-base',
            'Spin-Land-base',
            'Spin-Land-base',
            'uiPanel',
            'Spin port',
            'Spin port',
            'Spin port'
        );
        this.buttonSpin._createSpriteField('uiPanel', 'Spin-Land-arrows');
        //this.buttonSpin.kill();
        this.allButtonsElements.push(...this.buttonSpin.elements);

        this.buttonSpinStop = new GameButton(
            'spinStop',
            null,
            this,
            0,
            0,
            'Spin-Land-base',
            'Spin-Land-base',
            'Spin-Land-base',
            'uiPanel',
            'Spin port',
            'Spin port',
            'Spin port'
        );
        this.buttonSpinStop._createSpriteField('uiPanel', 'Spin-Land-arrows');
        this.buttonSpinStop._createTextLabel('STOP', {
            fontSize: '23px',
            fontFamily: 'Arial',
            align: 'center',
            color: '#fff',
        });
        this.buttonSpinStop.kill();
        //this.allButtonsElements.push(...this.buttonSpinStop.elements);

        this.buttonAutoSpin = new GameButton(
            'autospin',
            null,
            this,
            0,
            0,
            'Auto Off',
            'Auto Off',
            'Auto Off',
            'uiPanel',
            'Auto Off',
            'Auto Off',
            'Auto Off',
            'Auto On',
            'Auto On',
            'Auto On',
            'Auto On',
            'Auto On',
            'Auto On'
        );

        // this.buttonAutoSpin._createSpriteField('statusPanel', 'Auto-sign');

        //this.buttonAutoSpin.kill();
        this.allButtonsElements.push(...this.buttonAutoSpin.elements);

        const isPixelPerfect = false;
        this.buttonStopAutoSpin = new GameButton(
            'stopAutospin',
            null,
            this,
            0,
            0,
            'Auto On',
            'Auto On',
            'Auto On',
            'uiPanel',
            'Auto On',
            'Auto On',
            'Auto On',
            'Auto On',
            'Auto On',
            'Auto On',
            'Auto On',
            'Auto On',
            'Auto On',
            isPixelPerfect
        );
        //this.mainButtons.push(this.buttonStopAutoSpin);

        this.buttonSpin._createTextLabel('SPIN', {
            fontSize: '23px',
            fontFamily: 'Arial',
            align: 'center',
            color: '#fff',
            // stroke: '#000',
            // strokeThickness: 5,
        });

        this.buttonAutoSpin._createTextLabel('AUTO', {
            fontSize: '25px',
            fontFamily: 'fortunaForJack',
            align: 'center',
            color: '#fff',
            stroke: '#000',
            strokeThickness: 5,
        });
        this.buttonStopAutoSpin._createTextLabel('STOP', {
            fontSize: '25px',
            fontFamily: 'fortunaForJack',
            align: 'center',
            color: '#fff',
            stroke: '#000',
            strokeThickness: 5,
        });
        // this.buttonAutoSpin.yOffsetTextLabel = -30;
        this.buttonAutoSpin.setOrigin(0.5, 1.5);
        this.buttonStopAutoSpin.setOrigin(0.5, 1.5);
        // this.buttonStopAutoSpin.yOffsetTextLabel = -80;
        //  this.buttonStopAutoSpin.xOffsetTextLabel = 80;

        // this.buttonStopAutoSpin._createSpriteField('statusPanel', 'Auto-stop');
        this.buttonStopAutoSpin.kill();

        this.buttonGambleon = new GameButton(
            'menuGambleon',
            null,
            this,
            0,
            0,
            'Gamble on',
            'Gamble on',
            'Gamble on',
            'uiPanel',
            'Gamble on',
            'Gamble on',
            'Gamble on',
            'Gamble off',
            'Gamble off',
            'Gamble off',
            'Gamble off',
            'Gamble off',
            'Gamble off'
        );
        this.buttonGambleon.setScale(0.7);
        this.buttonGambleon.kill();
        this.menuButtons.push(this.buttonGambleon);

        // this.allButtonsElements.push(...this.buttonSettings.elements);
        if (!THREE_SECOND_RULE) {
            /*this.turboBaseSprite = this.add.sprite(
                0,
                0,
                'uiPanel',
                'Auto Off'
            );
            this.turboBaseSprite.setActive(false).setVisible(false);*/

            this.buttonTurbo = new GameButton(
                'turbo',
                null,
                this,
                0,
                0,
                'Auto Off',
                'Auto Off',
                'Auto Off',
                'uiPanel',
                'Auto Off',
                'Auto Off',
                'Auto Off',
                'Auto On',
                'Auto On',
                'Auto On',
                'Auto On',
                'Auto On',
                'Auto On'
            );
            //this.buttonTurbo.kill();
            this.allButtonsElements.push(...this.buttonTurbo.elements);
            this.mainButtons.push(this.buttonTurbo);
        }
        if (this.buttonTurbo) {
            this.buttonTurbo._createTextLabel('TURBO', {
                fontSize: '25px',
                fontFamily: 'fortunaForJack',
                align: 'center',
                color: '#fff',
                stroke: '#000',
                strokeThickness: 5,
            });
            this.buttonTurbo.setOrigin(0.5, 1.5);
        }

        /*this.buttonTurboOn = new GameButton("turboOn", null, this, 0, 0, "StandardSpeedIdle", "StandardSpeedDown", "StandardSpeedOver", "statusPanel");
        //this.buttonTurboOn.kill();
        this.allButtonsElements.push(...this.buttonTurboOn.elements);*/

        this.buttonFullScreen = new GameButton(
            'menuFullscreen',
            null,
            this,
            0,
            0,
            'Fullscreen',
            'Fullscreen',
            'Fullscreen',
            'uiPanel'
        );
        this.buttonFullScreenExit = new GameButton(
            'menuExitFullscreen',
            null,
            this,
            0,
            0,
            'Fullscreen',
            'Fullscreen',
            'Fullscreen',
            'uiPanel'
        );
        this.buttonFullScreenExit.kill();
        this.allButtonsElements.push(...this.buttonFullScreen.elements);
        this.allButtonsElements.push(...this.buttonFullScreenExit.elements);

        this.buttonRulesPage = new GameButton(
            'menuInfo',
            null,
            this,
            0,
            0,
            'Info',
            'Info',
            'Info',
            'uiPanel'
        );

        //this.buttonRulesPage.kill();
        this.allButtonsElements.push(...this.buttonRulesPage.elements);

        this.buttonHelpPage = new GameButton(
            'menuHelp',
            null,
            this,
            0,
            0,
            'Rules',
            'Rules',
            'Rules',
            'uiPanel'
        );
        this.buttonSoundOn = new GameButton(
            'sound',
            null,
            this,
            0,
            0,
            'Sound on',
            'Sound on',
            'Sound on',
            'uiPanel',
            'Sound on',
            'Sound on',
            'Sound on',
            'Sound off',
            'Sound off',
            'Sound off',
            'Sound off',
            'Sound off',
            'Sound off'
        );
        this.buttonMusicOn = new GameButton(
            'music',
            null,
            this,
            0,
            0,
            'Music on',
            'Music on',
            'Music on',
            'uiPanel',
            'Music on',
            'Music on',
            'Music on',
            'Music off',
            'Music off',
            'Music off',
            'Music off',
            'Music off',
            'Music off'
        );

        if (this.buttonHelpPage) {
            this.allButtonsElements.push(...this.buttonHelpPage.elements);
        }
        if (this.buttonSoundOn) {
            this.allButtonsElements.push(...this.buttonSoundOn.elements);
        }
        if (this.buttonMusicOn) {
            this.allButtonsElements.push(...this.buttonMusicOn.elements);
        }

        this.mainButtons = [
            this.buttonBet,
            this.buttonSpin,
            this.buttonAutoSpin,
            this.buttonMenu,
            this.buttonBetOk,
        ];

        this.menuButtons = [
            this.buttonMenuCancel,
            this.buttonFullScreen,
            this.buttonFullScreenExit,
            this.buttonRulesPage,
            this.buttonGambleon,
            this.buttonSoundOn,
            this.buttonMusicOn,
        ];

        if (this.buttonHelpPage) {
            this.menuButtons.push(this.buttonHelpPage);
        }
        if (this.buttonSoundOn) {
            this.menuButtons.push(this.buttonSoundOn);
        }
        if (this.buttonMusicOn) {
            this.menuButtons.push(this.buttonMusicOn);
        }

        this.menuButtons.forEach((button) => button.kill());

        this.game.events.on('event-send-to-server-getHistory', () => {
            this.fadeOutMenuButtons();
        });

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
                    'Lobby',
                    'Lobby',
                    'Lobby',
                    'uiPanel'
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
        this.game.events.on(
            'event-state-StatePresentWin-onEnter',
            this.refreshFromModel,
            this
        );
        console.log('event-request-data');
        this.game.events.emit('event-request-data');

        this.game.events.on(
            'event-state-StatePresentSpinning-onEnter',
            (data: ISlotDataPresenter) => {
                this.buttonTurbo && this.buttonTurbo.grayScaleEnable();
                this.buttonSpin.kill();
                this.buttonAutoSpin.grayScaleDisable();
                this.buttonBet.grayScaleDisable();
                this.buttonMenu.grayScaleDisable();
                if (data.status.freeSpins.totalSpins == 0) {
                    if (!THREE_SECOND_RULE) {
                        this.buttonSpinStop.revive();
                    }
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
                this.buttonsCollectShow = false;
                this.buttonSpin.revive();
                this.buttonSpinStop.kill();
                this.buttonAutoSpin.grayScaleEnable();
                this.buttonBet.grayScaleEnable();
                this.buttonMenu.grayScaleEnable();
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
                this.buttonsCollectShow = false;
                if (data.betAndAutospin.currentAutospin > 0) {
                    this.fadeOutMainButtons(
                        this.buttonSpin,
                        this.buttonTurbo,
                        this.buttonAutoSpin,
                        this.buttonStopAutoSpin
                    );
                    this.gambleButtonsState(false, data);
                } else {
                    this.fadeOutMainButtons(this.buttonSpin, this.buttonTurbo);
                }
            },
            this
        );
        this.game.events.on('event-stopSound', (arg) => {
            arg;
            if (this.buttonSoundOn.selected) {
                this.buttonSoundOn.selected = false;
                this.buttonSoundClicked = true;
                this.game.events.emit(
                    'event-stopSoundRestart',
                    'buttonSoundOn'
                );
            } else {
                this.buttonSoundOn.selected = true;
                this.buttonSoundClicked = true;
            }
        });

        this.game.events.on('event-stopMusic', (arg) => {
            if (this.buttonMusicOn.selected) {
                this.buttonMusicOn.selected = false;
                this.buttonSoundClicked = true;
                this.game.events.emit('event-button-select-music', false);
            } else {
                this.buttonMusicOn.selected = true;
                this.buttonSoundClicked = true;
                this.game.events.emit('event-button-select-music', true);
            }
        });
        this.game.events.on('event-disableEnableMenuBtn', (arg) => {
            if (arg) {
                this.buttonMenu.setDisable();
                this.buttonSpin.setDisable();
                this.buttonAutoSpin.setDisable();
                if (this.buttonTurbo) {
                    this.buttonTurbo.setDisable();
                }
            } else {
                this.buttonMenu.setEnable();
                this.buttonSpin.setEnable();
                this.buttonAutoSpin.setEnable();
                if (this.buttonTurbo) {
                    this.buttonTurbo.setEnable();
                }
            }
        });
        this.game.events.on('event-buttonClickedTurbo', (arg) => {
            if (this.buttonTurbo.selected) {
                this.buttonTurbo.selected = false;
                this.buttonSoundClicked = true;
            } else {
                this.buttonTurbo.selected = true;
                this.buttonSoundClicked = true;
            }
        });
        this.game.events.on('refreshBlackField', this.resize, this);
        this.game.events.on(
            `event-user-input-${eUserInputCommands.fullscreenPressed}`,
            this.Fullscreen,
            this
        );
        this.game.events.on(
            `event-user-input-${eUserInputCommands.exitfullscreenPressed}`,
            this.ExitFullscreen,
            this
        );
        this.game.events.on(
            `event-user-input-${eUserInputCommands.buttonGamblePressed}`,
            this.MenuGambleon,
            this
        );
        this.game.events.on(
            'event-ShowGambleAnimations',
            () => {
                this.buttongamble.kill();
            },
            this
        );
        this.game.events.on(
            'gambleButtonsState',
            this.gambleButtonsState,
            this
        );
        /*this.game.events.on(
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
        );*/

        this.createHistoryElementsAndEvents();
        document.addEventListener('html-event-button-info', (e) => {
            e;
            this.game.events.emit('event-button-clicked-new');
        });
        document.addEventListener('html-event-close-infoPage', (e) => {
            e;
            this.close();
        });

        document.addEventListener('html-event-close-rulesPage', (e) => {
            e;
            this.close();
        });
        document.addEventListener('event-disableEnableMenuBtn', (e) => {
            e;
            this.game.events.emit(
                `event-user-input-${eUserInputCommands.closeMenu}`
            );
        });

        this.game.events.on('event-autospin-start', () => {
            this.buttonTurbo && this.buttonTurbo.grayScaleDisable();
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
        this.buttonSoundClicked = false;
        this.model.settings.currentPage = whoOpenedIt;

        console.log('POPUP = ', this.isMenuActive);
        const targets = [];
        if (this.isMenuActive < 2) {
            // if(this.model.settings.currentPage !== "openHelpPage"){
            //     targets.push(this.menuBG);
            // }
        } else {
            // if(this.model.settings.currentPage== "openHelpPage"){
            //     this.menuBG.setActive(true).setVisible(false).setAlpha(0);

            // }else{
            //     this.menuBG.setActive(true).setVisible(true).setAlpha(1);
            // }
            if (this.isClosingHistory) {
                this.bgImage.setActive(false).setVisible(false).setAlpha(0);
            }
        }
        if (whoOpenedIt === 'spins-popup') {
            this.buttonMenu.setDisable();
        }
        if (whoOpenedIt != 'spins-popup') {
            if (this.isMenuActive < 2) {
                // targets.push(this.bgImage);
            }

            targets.forEach((element) => {
                element.setActive(true).setVisible(true).setAlpha(0);
            });
            if (whoOpenedIt == 'bet-popup') {
                this.fadeOutMainButtons(this.buttonSpin, this.buttonBet);
                this.fadeInFollowingMainButtons(true, this.buttonBetOk);
                this.buttonBetOk.revive();
                this.buttonBet.kill();
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
        } else {
            // targets.forEach(element => {
            //     element.setActive(true).setVisible(true).setAlpha(0);
            // });
        }
    }

    close(): void {
        this.model.settings.menuTransition = true;
        this.buttonSoundClicked = false;
        const targets = this.isMenuActive ? [] : [this.bgImage]; //, ...this.allButtonsElements];
        this.add.tween({
            targets,
            duration: 500,
            alpha: '0',
            ease: 'Linear',
            onStart: () => {
                this.buttonFullScreenExit.kill();
            },
            onComplete: () => {
                targets.forEach((element) => {
                    element.setActive(false).setVisible(false).setAlpha(1);
                    this.model.settings.menuTransition = false;
                    if (this.model.settings.currentPage === '') {
                        this.buttonMenu.setEnable();
                        this.buttonSpin.setEnable();
                    }
                });
            },
        });
        this.buttonBet.revive();
        this.buttonBetOk.kill();

        if (!this.isMenuActive) {
            this.fadeInMainButtons(
                this.buttonSpin,
                this.buttonTurbo,
                this.buttonBetOk
            );
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

    resize(gameSize = this.scale.gameSize): void {
        super.resize();

        const screenWidth = this.scale.gameSize.width / this.cameras.main.zoom;
        const screenHeight =
            this.scale.gameSize.height / this.cameras.main.zoom;
        let scale = this.bgImage.scale / this.bgImageScaleFactor;
        // this.menuBG.setScale(scale*1.1);
        // this.menuBG.setPosition(this.bgImage.x, this.bgImage.y);
        // this.menuBG.angle = globalGetIsPortrait(this) ? 90 : 0;
        // this.gameCover.setScale(this.bgImage.scale * 2);
        // this.gameCover.x = this.bgImage.x;
        // this.gameCover.y = this.bgImage.y;
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

            const phoneYOffset = 0;
            let buttonScale = scale;
            if (navigator.userAgent.includes('Mobile')) {
                buttonScale *= 1.05;
            }
            // this.buttonStopAutoSpin.yOffsetTextLabel = -75;
            // this.buttonStopAutoSpin.xOffsetTextLabel = 80;
            if (globalGetIsPortrait(this)) {
                scale *= 0.63;
                buttonScale *= 0.65;
                //this.closePopupButton.x = bottomX / 2
                //this.closePopupButton.y = bottomY - (this.closePopupButton.height) / 2
                this.topBar.setActive(false).setVisible(true).setAlpha(1);
                this.bottomBar.setActive(false).setVisible(false).setAlpha(1);
                this.collectText.setScale(
                    this.adjustButtonScale(
                        this.collectText.nonScaledWidth,
                        scale,
                        limitScreenPartBars,
                        screenDimensionBars
                    )
                );

                this.collectText.setTextPosition(
                    this.buttonSpin.x,
                    this.buttonSpin.y - this.buttonSpin.width / 1.7
                );
                this.betFieldText1.setScale(
                    this.adjustButtonScale(
                        this.betFieldText1.nonScaledWidth,
                        scale,
                        0.25,
                        this.buttonPanelBackPort.displayWidth
                    )
                );
                this.betFieldTextAmt1.setScale(
                    this.adjustButtonScale(
                        this.betFieldTextAmt1.nonScaledWidth,
                        scale,
                        limitScreenPartBars,
                        screenDimensionBars
                    )
                );
                // this.betFieldText1.setTextPosition(
                //     0 + this.betFieldText1.width / 0.6,
                //     bottomY - 3.1 * this.betFieldText1.height
                // );

                // portrait

                this.betFieldText1.setTextPosition(
                    this.buttonPanelBackPort.x +
                    this.betFieldText1.width / 2 +
                    40 * scale,
                    this.buttonPanelBackPort.y + 40 * scale
                );

                this.betFieldTextAmt1.setTextPosition(
                    this.betFieldText1.x -
                    this.betFieldText1.width * 0.6 +
                    this.betFieldTextAmt1.width / 2,
                    this.betFieldText1.y + this.betFieldTextAmt1.height * 1.5
                );

                this.winFieldText1.setScale(
                    this.adjustButtonScale(
                        this.winFieldText1.nonScaledWidth,
                        scale,
                        0.25,
                        this.buttonPanelBackPort.displayWidth
                    )
                );
                this.winFieldTextAmt1.setScale(
                    this.adjustButtonScale(
                        this.winFieldTextAmt1.nonScaledWidth,
                        scale,
                        limitScreenPartBars,
                        screenDimensionBars
                    )
                );
                this.winFieldText1.setTextPosition(
                    this.buttonPanelBackPort.x +
                    this.buttonPanelBackPort.displayWidth / 2 +
                    this.winFieldText1.width / 2,
                    this.betFieldText1.y
                );
                this.winFieldTextAmt1.setTextPosition(
                    this.winFieldText1.x -
                    this.winFieldText1.width * 0.6 +
                    this.winFieldTextAmt1.width / 2,
                    this.winFieldText1.y + this.winFieldTextAmt1.height * 1.5
                );
                const nonFullScreenSpecialiPhone = false; /*if (
                    horizontalDesignUI &&
                    navigator.userAgent.includes('iPhone') &&
                    this.deviceManager &&
                    !this.deviceManager.isIPhoneFullScreen &&
                    rightX / bottomY > 0.93 * (1080 / 1920)
                ) {
                    phoneYOffset = -0.04 * bottomY;
                    nonFullScreenSpecialiPhone = true;
                }*/
                /* if (
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
                } else*/ limitScreenPart = 0.33;
                screenDimension = rightX;

                this.buttonMenu.setScale(
                    this.adjustButtonScale(
                        this.buttonMenu.nonScaledWidth,
                        buttonScale * 0.85,
                        limitScreenPart,
                        screenDimension
                    )
                );
                this.buttonMenu.x = this.isLeftHanded
                    ? rightX * 0.055 + this.buttonMenu.width / 2
                    : rightX * 0.99 - this.buttonMenu.width / 2;
                if (nonFullScreenSpecialiPhone) {
                    this.buttonMenu.y = this.buttonMenu.y =
                        0 + this.buttonMenu.height * 1.8;
                } else {
                    this.buttonMenu.y = 0 + this.buttonMenu.height * 1.8;
                }

                this.buttonMenuCancel.setScale(
                    this.adjustButtonScale(
                        this.buttonMenuCancel.nonScaledWidth,
                        buttonScale,
                        limitScreenPart,
                        screenDimension
                    )
                );
                this.buttonMenuCancel.setScale(buttonScale);
                this.buttonMenuCancel.x = this.buttonMenu.x;
                this.buttonMenuCancel.y = this.buttonMenu.y;

                this.buttonCloseHistory.setScale(
                    this.adjustButtonScale(
                        this.buttonCloseHistory.nonScaledWidth,
                        buttonScale,
                        limitScreenPart,
                        screenDimension
                    )
                );
                this.buttonCloseHistory.setScale(buttonScale);
                this.buttonCloseHistory.x = this.buttonMenu.x;
                this.buttonCloseHistory.y = this.buttonMenu.y;

                if (this.buttonMenuHome) {
                    this.buttonMenuHome.setScale(
                        this.adjustButtonScale(
                            this.buttonMenuHome.nonScaledWidth,
                            buttonScale,
                            limitScreenPart,
                            screenDimension
                        )
                    );
                    this.buttonMenuHome.x = this.isLeftHanded
                        ? rightX * 0.05 + this.buttonMenuHome.width / 2
                        : rightX * 0.99 - this.buttonMenu.width / 2;
                    this.buttonMenuHome.y =
                        this.buttonHelpPage.y + this.buttonMenuHome.height;
                }

                this.buttonBet.setScale(
                    this.adjustButtonScale(
                        this.buttonBet.nonScaledWidth,
                        scale * 1.5,
                        limitScreenPart * 1.2,
                        screenDimension * 1.2
                    )
                );
                this.buttonBet.x = this.isLeftHanded
                    ? middleX - this.buttonBet.width * 0.85
                    : middleX - this.buttonBet.width * 0.85;
                if (nonFullScreenSpecialiPhone) {
                    this.buttonBet.y =
                        this.buttonMenu.y - this.buttonBet.height * 0.1;
                } else {
                    this.buttonBet.y =
                        bottomY - 2.2 * this.winFieldText1.height;
                }

                this.buttonBetOk.setScale(
                    this.adjustButtonScale(
                        this.buttonBetOk.nonScaledWidth,
                        scale * 1.5,
                        limitScreenPart * 1.2,
                        screenDimension * 1.2
                    )
                );
                this.buttonBetOk.x = this.buttonBet.x;
                this.buttonBetOk.y = this.buttonBet.y;

                this.buttonSpin.setScale(
                    this.adjustButtonScale(
                        this.buttonSpin.nonScaledWidth,
                        scale * (nonFullScreenSpecialiPhone ? 0.55 : 1.3),
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
                    this.buttonSpin.y = 0.83 * bottomY;
                }

                // this.buttonSpinB.setScale(scale);
                // this.buttonSpinB.x = middleX;
                // this.buttonSpinB.y = bottomY - (this.buttonSpin.height) * 2
                this.buttonPanelBackPort.setVisible(true);
                this.buttonPanelBackLand.setVisible(false);
                this.buttonPanelBackPort.x = 0;
                this.buttonPanelBackPort.y = 0.9 * bottomY;
                this.buttonPanelBackPort.setScale(scale);
                this.buttonPanelBackPort.setScale(
                    rightX / this.buttonPanelBackPort.width,
                    scale
                );
                this.buttonSpinStop.setScale(
                    this.adjustButtonScale(
                        this.buttonSpinStop.nonScaledWidth,
                        scale * (nonFullScreenSpecialiPhone ? 0.55 : 1.3),
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
                    this.buttonSpinStop.y = 0.83 * bottomY;
                }

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
                        ? this.buttonSpin.x - this.buttonAutoSpin.width * 1.5
                        : this.buttonSpin.x + this.buttonAutoSpin.width * 1.5;
                    this.buttonAutoSpin.y = 0.83 * bottomY + phoneYOffset;
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
                            ? this.buttonSpin.x +
                            this.buttonAutoSpin.width * 1.5
                            : this.buttonSpin.x -
                            this.buttonAutoSpin.width * 1.5;
                        this.buttonTurbo.y = 0.83 * bottomY + phoneYOffset;
                    }
                }

                if (
                    navigator.userAgent.includes('Mobile') &&
                    !navigator.userAgent.includes('iPhone')
                ) {
                    this.buttongambleMystery.setScale(
                        this.adjustButtonScale(
                            this.buttongambleMystery.nonScaledWidth,
                            scale * 0.85,
                            limitScreenPart,
                            screenDimension
                        )
                    );

                    this.buttongamble.setScale(
                        this.adjustButtonScale(
                            this.buttongamble.nonScaledWidth,
                            scale * 0.85,
                            limitScreenPart,
                            screenDimension
                        )
                    );

                    this.buttongamble.x = this.isLeftHanded
                        ? this.buttonAutoSpin.x - this.buttongamble.width * 1.15
                        : this.buttonAutoSpin.x +
                        this.buttongamble.width * 1.15;
                    this.buttongamble.y = 0.83 * bottomY + phoneYOffset;

                    this.buttongambleMystery.x = this.isLeftHanded
                        ? this.buttongamble.x
                        : this.buttongamble.x;
                    this.buttongambleMystery.y =
                        this.buttongamble.y - 1.1 * this.buttongamble.height;
                } else {
                    this.buttongambleMystery.setScale(
                        this.adjustButtonScale(
                            this.buttongambleMystery.nonScaledWidth,
                            scale * (nonFullScreenSpecialiPhone ? 0.55 : 1),
                            limitScreenPart,
                            screenDimension
                        )
                    );

                    this.buttongamble.setScale(
                        this.adjustButtonScale(
                            this.buttongamble.nonScaledWidth,
                            scale * (nonFullScreenSpecialiPhone ? 0.55 : 0.98),
                            limitScreenPart,
                            screenDimension
                        )
                    );

                    this.buttongamble.x = this.isLeftHanded
                        ? this.buttonAutoSpin.x - this.buttongamble.width * 1.1
                        : this.buttonAutoSpin.x + this.buttongamble.width * 1.1;
                    this.buttongamble.y = 0.83 * bottomY + phoneYOffset;

                    this.buttongambleMystery.x = this.isLeftHanded
                        ? this.buttongamble.x
                        : this.buttongamble.x;
                    this.buttongambleMystery.y =
                        this.buttongamble.y - 1.1 * this.buttongamble.height;
                }

                this.buttonCollect.setScale(
                    this.adjustButtonScale(
                        this.buttonCollect.nonScaledWidth,
                        scale * (nonFullScreenSpecialiPhone ? 0.55 : 1.3),
                        limitScreenPart,
                        screenDimension
                    )
                );

                this.buttonCollect.x = this.buttonSpin.x;
                if (nonFullScreenSpecialiPhone) {
                    this.buttonCollect.y =
                        bottomY -
                        this.buttonMenu.height +
                        (phoneYOffset != 0
                            ? phoneYOffset
                            : -0.2 * this.buttonMenu.height);
                } else {
                    this.buttonCollect.y = 0.83 * bottomY;
                }

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

                // let optionsY =
                //     bottomY - this.buttonGambleon.height * 2.5 + phoneYOffset;
                // if (
                //     navigator.userAgent.includes('iPhone') &&
                //     phoneYOffset == 0
                // ) {
                //     optionsY = this.buttonMenuCancel.y;
                // }

                this.buttonGambleon.setScale(
                    this.adjustButtonScale(
                        this.buttonGambleon.nonScaledWidth,
                        buttonScale,
                        limitScreenPart,
                        screenDimension
                    )
                );

                this.buttonFullScreen.setScale(
                    this.adjustButtonScale(
                        this.buttonFullScreen.nonScaledWidth,
                        buttonScale,
                        limitScreenPart,
                        screenDimension
                    )
                );
                if (this.buttonHelpPage) {
                    this.buttonFullScreen.x = this.isLeftHanded
                        ? rightX * 0.05 + this.buttonFullScreen.width / 2
                        : rightX * 0.99 - this.buttonMenu.width / 2;
                } else {
                    this.buttonFullScreen.x =
                        (nonFullScreenSpecialiPhone ? 0.45 : 0.4) * rightX -
                        (this.buttonFullScreen.width +
                            this.buttonGambleon.width) /
                        2;
                }
                this.buttonFullScreen.y =
                    this.buttonMenu.y + this.buttonFullScreen.height;
                this.buttonFullScreenExit.setScale(
                    this.adjustButtonScale(
                        this.buttonFullScreen.nonScaledWidth,
                        buttonScale,
                        limitScreenPart,
                        screenDimension
                    )
                );
                if (this.buttonHelpPage) {
                    this.buttonFullScreenExit.x = this.isLeftHanded
                        ? rightX * 0.05 + this.buttonFullScreenExit.width / 2
                        : rightX * 0.99 - this.buttonMenu.width / 2;
                } else {
                    this.buttonFullScreenExit.x =
                        (nonFullScreenSpecialiPhone ? 0.45 : 0.4) * rightX -
                        (this.buttonFullScreenExit.width +
                            this.buttonGambleon.width) /
                        2;
                }
                this.buttonFullScreenExit.y =
                    this.buttonMenu.y + this.buttonFullScreenExit.height;

                this.buttonRulesPage.setScale(
                    this.adjustButtonScale(
                        this.buttonRulesPage.nonScaledWidth,
                        buttonScale,
                        limitScreenPart,
                        screenDimension
                    )
                );
                if (this.buttonHelpPage) {
                    this.buttonRulesPage.x = this.isLeftHanded
                        ? rightX * 0.05 + this.buttonFullScreen.width / 2
                        : rightX * 0.99 - this.buttonMenu.width / 2;
                } else {
                    this.buttonRulesPage.x = this.isLeftHanded
                        ? rightX * 0.05 + this.buttonFullScreen.width / 2
                        : rightX * 0.99 - this.buttonMenu.width / 2;
                }
                this.buttonRulesPage.y =
                    this.buttonMenu.y + this.buttonRulesPage.height *2;
                if (this.buttonHelpPage) {
                    this.buttonGambleon.x = this.isLeftHanded
                        ? rightX * 0.05 + this.buttonGambleon.width / 2.3
                        : rightX * 0.99 - this.buttonGambleon.width / 2.3;
                } else {
                    this.buttonGambleon.x = this.isLeftHanded
                        ? rightX * 0.05 + this.buttonGambleon.width / 2.3
                        : rightX * 0.99 - this.buttonGambleon.width / 2.3;
                }
                this.buttonGambleon.y =
                    this.buttonRulesPage.y + this.buttonGambleon.height;
                if (this.buttonSoundOn) {
                    this.buttonSoundOn.setScale(
                        this.adjustButtonScale(
                            this.buttonSoundOn.nonScaledWidth,
                            buttonScale,
                            limitScreenPart,
                            screenDimension
                        )
                    );
                    this.buttonSoundOn.x = this.isLeftHanded
                        ? rightX * 0.05 + this.buttonGambleon.width / 2.3
                        : rightX * 0.99 - this.buttonGambleon.width / 2.3;

                    this.buttonSoundOn.y =
                        this.buttonGambleon.y + this.buttonSoundOn.height;
                }
                if (this.buttonMusicOn) {
                    this.buttonMusicOn.setScale(
                        this.adjustButtonScale(
                            this.buttonSoundOn.nonScaledWidth,
                            buttonScale,
                            limitScreenPart,
                            screenDimension
                        )
                    );
                    this.buttonMusicOn.x = this.isLeftHanded
                        ? rightX * 0.05 + this.buttonGambleon.width / 2.3
                        : rightX * 0.99 - this.buttonGambleon.width / 2.3;

                    this.buttonMusicOn.y =
                        this.buttonSoundOn.y + this.buttonSoundOn.height;
                }

                if (this.buttonHelpPage) {
                    this.buttonHelpPage.setScale(
                        this.adjustButtonScale(
                            this.buttonHelpPage.nonScaledWidth,
                            buttonScale,
                            limitScreenPart,
                            screenDimension
                        )
                    );
                    this.buttonHelpPage.x = this.isLeftHanded
                        ? rightX * 0.05 + this.buttonGambleon.width / 2.3
                        : rightX * 0.99 - this.buttonGambleon.width / 2.3;

                    this.buttonHelpPage.y =
                        this.buttonMusicOn.y + this.buttonHelpPage.height;
                }

                this.historyResizePortrait(
                    buttonScale,
                    limitScreenPart,
                    screenDimension,
                    rightX,
                    bottomY
                );

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
                    0 + 1 * this.clockText.height
                );

                const clockScale =
                    (0.7 * (this.bottomBar.height * scale)) / this.clock.height; //(this.clockText.height / newScale) / this.clock.height;
                this.clock.setScale(clockScale);
                this.clock.x =
                    rightX -
                    this.clockText.width -
                    0.7 * clockScale * this.clock.width;
                this.clock.y = 0 + 0.9 * clockScale * this.clock.height;
                this.balanceFieldText.setScale(
                    this.adjustButtonScale(
                        this.balanceFieldText.nonScaledWidth,
                        scale,
                        limitScreenPartBars,
                        screenDimensionBars
                    )
                );
                this.balanceFieldTextAmt.setScale(
                    this.adjustButtonScale(
                        this.balanceFieldTextAmt.nonScaledWidth,
                        scale,
                        limitScreenPartBars,
                        screenDimensionBars
                    )
                );
                this.balanceFieldText.setOrigin(-0.5, 0);
                this.balanceFieldText.setTextPosition(
                    0,
                    0 + 0.8 * this.balanceFieldText.height
                );
                this.balanceFieldTextAmt.setOrigin(-0.5, 0);
                this.balanceFieldTextAmt.setTextPosition(
                    this.bottomBar.width * 0.03 + this.balanceFieldText.width,
                    0 + 0.9 * this.balanceFieldText.height
                );
            } else {
                limitScreenPart = 0.33;
                screenDimension = bottomY;
                this.topBar.setActive(false).setVisible(false).setAlpha(1);
                this.bottomBar.setActive(false).setVisible(true).setAlpha(1);
                scale =
                    gameSize.width /
                    (this.bgImage.width * this.bgImageScaleFactor);
                scale = scale / 1.1;
                const scaleY =
                    gameSize.height /
                    (this.bgImage.height * this.bgImageScaleFactor);

                this.buttonMenu.setScale(
                    this.adjustButtonScale(
                        this.buttonMenu.nonScaledWidth,
                        buttonScale,
                        limitScreenPart,
                        screenDimension
                    )
                );
                /* this.buttonMenu.x = this.isLeftHanded
                    ? rightX - this.buttonMenu.width
                    : 0 + this.buttonMenu.width;
                this.buttonMenu.y = 0 + this.buttonMenu.height / 0.8;*/
                this.buttonMenu.x = this.isLeftHanded
                    ? rightX * 0.05 + this.buttonMenu.width / 2
                    : rightX * 0.99 - this.buttonMenu.width / 2;
                this.buttonMenu.y = 0 + this.buttonMenu.height / 0.8;
                this.buttonMenuCancel.setScale(
                    this.adjustButtonScale(
                        this.buttonMenuCancel.nonScaledWidth,
                        buttonScale,
                        limitScreenPart,
                        screenDimension
                    )
                );
                this.buttonMenuCancel.x = this.buttonMenu.x;
                this.buttonMenuCancel.y = this.buttonMenu.y;

                this.buttonCloseHistory.setScale(
                    this.adjustButtonScale(
                        this.buttonCloseHistory.nonScaledWidth,
                        buttonScale,
                        limitScreenPart,
                        screenDimension
                    )
                );
                this.buttonCloseHistory.x = this.buttonMenu.x;
                this.buttonCloseHistory.y = this.buttonMenu.y;

                if (this.buttonMenuHome) {
                    this.buttonMenuHome.setScale(
                        this.adjustButtonScale(
                            this.buttonMenuHome.nonScaledWidth,
                            buttonScale,
                            limitScreenPart,
                            screenDimension
                        )
                    );
                    this.buttonMenuHome.x = this.isLeftHanded
                        ? rightX * 0.05 + this.buttonMenuHome.width / 2
                        : rightX * 0.99 - this.buttonMenuHome.width / 2;
                    this.buttonMenuHome.y =
                        this.buttonHelpPage.y + this.buttonMenuHome.height;
                }

                this.buttonBet.setScale(
                    this.adjustButtonScale(
                        this.buttonBet.nonScaledWidth,
                        scale,
                        limitScreenPart,
                        screenDimension
                    )
                );
                this.buttonPanelBackPort.setVisible(false);
                this.buttonPanelBackLand.setVisible(true);
                this.buttonPanelBackLand.setScale(scale);
                if (this.buttonTurbo) {
                    this.buttonPanelBackLand.x = this.isLeftHanded
                        ? middleX + 185
                        : middleX / 1.35;
                } else {
                    this.buttonPanelBackLand.x = this.isLeftHanded
                        ? middleX + 135
                        : middleX / 1.23;
                }

                this.buttonBet.x = this.isLeftHanded
                    ? this.buttonPanelBackLand.x - this.buttonBet.width / 1.2
                    : this.buttonPanelBackLand.x - this.buttonBet.width / 1.2;
                this.buttonBet.y =
                    bottomY - (1.75 * this.buttonAutoSpin.height) / 2;

                this.buttonBetOk.setScale(
                    this.adjustButtonScale(
                        this.buttonBetOk.nonScaledWidth,
                        scale,
                        limitScreenPart,
                        screenDimension
                    )
                );
                this.buttonBetOk.x = this.buttonBet.x;
                this.buttonBetOk.y = this.buttonBet.y;

                this.buttonSpin.setScale(
                    this.adjustButtonScale(
                        this.buttonSpin.nonScaledWidth,
                        scale,
                        limitScreenPart,
                        screenDimension
                    )
                );

                this.buttonAutoSpin.setScale(
                    this.adjustButtonScale(
                        this.buttonAutoSpin.nonScaledWidth,
                        scale,
                        limitScreenPart,
                        screenDimension
                    )
                );

                this.buttonAutoSpin.y =
                    bottomY - (1.75 * this.buttonAutoSpin.height) / 2;
                this.buttonPanelBackLand.y = this.buttonAutoSpin.y;
                this.buttonBet.y = this.buttonPanelBackLand.y;
                this.buttonBetOk.y = this.buttonBet.y;
                bottomY - (1.75 * this.buttonAutoSpin.height) / 2;
                if (this.buttonTurbo) {
                    this.buttonAutoSpin.x = this.isLeftHanded
                        ? this.buttonPanelBackLand.x -
                        3.88 * this.buttonAutoSpin.width
                        : this.buttonPanelBackLand.x +
                        3.88 * this.buttonAutoSpin.width;
                    this.buttonSpin.x = this.isLeftHanded
                        ? this.buttonPanelBackLand.x -
                        3.23 * this.buttonSpin.width
                        : this.buttonPanelBackLand.x +
                        3.23 * this.buttonSpin.width;
                } else {
                    this.buttonSpin.x = this.isLeftHanded
                        ? this.buttonPanelBackLand.x -
                        2.6 * this.buttonSpin.width
                        : this.buttonPanelBackLand.x +
                        2.6 * this.buttonSpin.width;
                    this.buttonAutoSpin.x = this.isLeftHanded
                        ? this.buttonPanelBackLand.x -
                        2.85 * this.buttonAutoSpin.width
                        : this.buttonPanelBackLand.x +
                        2.85 * this.buttonAutoSpin.width;
                }

                this.buttongambleMystery.setScale(
                    this.adjustButtonScale(
                        this.buttongambleMystery.nonScaledWidth,
                        scale,
                        limitScreenPart,
                        screenDimension
                    )
                );

                this.buttonCollect.setScale(
                    this.adjustButtonScale(
                        this.buttonCollect.nonScaledWidth,
                        scale,
                        limitScreenPart,
                        screenDimension
                    )
                );

                this.buttongamble.setScale(
                    this.adjustButtonScale(
                        this.buttongamble.nonScaledWidth,
                        scale,
                        limitScreenPart,
                        screenDimension
                    )
                );

                this.buttonCollect.x = this.isLeftHanded
                    ? this.buttonPanelBackLand.x -
                    3.2 * this.buttonCollect.width
                    : this.buttonPanelBackLand.x +
                    3.2 * this.buttonCollect.width;

                this.buttongamble.y =
                    bottomY - (1.75 * this.buttonAutoSpin.height) / 2;
                this.buttongambleMystery.x = this.isLeftHanded
                    ? this.buttonSpin.x - 1.35 * this.buttongambleMystery.width
                    : this.buttonSpin.x + 1.35 * this.buttongambleMystery.width;
                this.buttongambleMystery.y =
                    this.buttongamble.y - this.buttongambleMystery.width * 1.05;
                this.buttongamble.x = this.isLeftHanded
                    ? this.buttongambleMystery.x
                    : this.buttongambleMystery.x;
                if (navigator.userAgent.includes('iPhone')) {
                    // this.buttonStopAutoSpin.yOffsetTextLabel = -30;
                    // this.buttonStopAutoSpin.xOffsetTextLabel = 50;
                    this.buttonSpin.y = this.buttonAutoSpin.y;
                } else {
                    this.buttonSpin.y =
                        bottomY - (1.75 * this.buttonAutoSpin.height) / 2;
                }

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

                this.buttonCollect.x = this.buttonSpin.x;
                this.buttonCollect.y = this.buttonSpin.y;

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
                        ? this.buttonPanelBackLand.x -
                        2.85 * this.buttonTurbo.width
                        : this.buttonPanelBackLand.x +
                        2.84 * this.buttonTurbo.width;
                    this.buttonTurbo.y =
                        bottomY - (1.75 * this.buttonTurbo.height) / 2;
                }

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
                    this.buttonGambleon.setScale(
                        this.adjustButtonScale(
                            this.buttonGambleon.nonScaledWidth,
                            buttonScale,
                            limitScreenPart,
                            screenDimension
                        )
                    );

                    if (this.buttonHelpPage) {
                        this.buttonGambleon.x = this.isLeftHanded
                            ? rightX * 0.05 + this.buttonGambleon.width / 2
                            : rightX * 0.99 - this.buttonGambleon.width / 2;
                    } else {
                        this.buttonGambleon.x = middleX;
                    }
                    this.buttonGambleon.y =
                        this.buttonRulesPage.y + this.buttonGambleon.height;

                    this.buttonFullScreen.setScale(
                        this.adjustButtonScale(
                            this.buttonFullScreen.nonScaledWidth,
                            buttonScale,
                            limitScreenPart,
                            screenDimension
                        )
                    );
                    if (this.buttonHelpPage) {
                        this.buttonFullScreen.x = this.isLeftHanded
                            ? rightX * 0.05 + this.buttonFullScreen.width / 2
                            : rightX * 0.99 - this.buttonFullScreen.width / 2;
                    } else {
                        this.buttonFullScreen.x =
                            0.4 * rightX -
                            (this.buttonFullScreen.width +
                                this.buttonGambleon.width) /
                            2;
                    }
                    this.buttonFullScreen.y =
                        this.buttonMenu.y + this.buttonFullScreen.height;

                    this.buttonFullScreenExit.setScale(
                        this.adjustButtonScale(
                            this.buttonFullScreenExit.nonScaledWidth,
                            buttonScale,
                            limitScreenPart,
                            screenDimension
                        )
                    );
                    if (this.buttonHelpPage) {
                        this.buttonFullScreenExit.x = this.isLeftHanded
                            ? rightX * 0.05 + this.buttonFullScreenExit.width / 2
                            : rightX * 0.99 - this.buttonFullScreenExit.width / 2;
                    } else {
                        this.buttonFullScreenExit.x =
                            0.4 * rightX -
                            (this.buttonFullScreenExit.width +
                                this.buttonGambleon.width) /
                            2;
                    }
                    this.buttonFullScreenExit.y =
                        this.buttonMenu.y + this.buttonFullScreenExit.height;

                    this.buttonRulesPage.setScale(
                        this.adjustButtonScale(
                            this.buttonRulesPage.nonScaledWidth,
                            buttonScale,
                            limitScreenPart,
                            screenDimension
                        )
                    );
                    if (this.buttonHelpPage) {
                        this.buttonRulesPage.x = this.isLeftHanded
                            ? rightX * 0.05 + this.buttonRulesPage.width / 2
                            : rightX * 0.99 - this.buttonRulesPage.width / 2;
                    } else {
                        this.buttonRulesPage.x =
                            0.6 * rightX +
                            (this.buttonRulesPage.width +
                                this.buttonGambleon.width) /
                            2;
                    }
                    this.buttonRulesPage.y =
                        this.buttonMenu.y + this.buttonRulesPage.height *2;
                    if (this.buttonSoundOn) {
                        this.buttonSoundOn.setScale(
                            this.adjustButtonScale(
                                this.buttonSoundOn.nonScaledWidth,
                                buttonScale,
                                limitScreenPart,
                                screenDimension
                            )
                        );
                        this.buttonSoundOn.x = this.isLeftHanded
                            ? rightX * 0.05 + this.buttonSoundOn.width / 2
                            : rightX * 0.99 - this.buttonSoundOn.width / 2;

                        this.buttonSoundOn.y =
                            this.buttonGambleon.y + this.buttonSoundOn.height;
                    }

                    if (this.buttonMusicOn) {
                        this.buttonMusicOn.setScale(
                            this.adjustButtonScale(
                                this.buttonSoundOn.nonScaledWidth,
                                buttonScale,
                                limitScreenPart,
                                screenDimension
                            )
                        );
                        this.buttonMusicOn.x = this.isLeftHanded
                            ? rightX * 0.05 + this.buttonSoundOn.width / 2
                            : rightX * 0.99 - this.buttonSoundOn.width / 2;

                        this.buttonMusicOn.y =
                            this.buttonSoundOn.y + this.buttonSoundOn.height;
                    }

                    if (this.buttonHelpPage) {
                        this.buttonHelpPage.setScale(
                            this.adjustButtonScale(
                                this.buttonHelpPage.nonScaledWidth,
                                buttonScale,
                                limitScreenPart,
                                screenDimension
                            )
                        );
                        this.buttonHelpPage.x = this.isLeftHanded
                            ? rightX * 0.05 + this.buttonHelpPage.width / 2
                            : rightX * 0.99 - this.buttonHelpPage.width / 2;

                        this.buttonHelpPage.y =
                            this.buttonMusicOn.y + this.buttonHelpPage.height;
                    }
                } else {
                    this.buttonFullScreen.setScale(
                        this.adjustButtonScale(
                            this.buttonFullScreen.nonScaledWidth,
                            buttonScale,
                            limitScreenPart,
                            screenDimension
                        )
                    );
                    this.buttonFullScreen.x = this.buttonMenuCancel.x;
                    this.buttonFullScreen.y =
                        this.buttonMenu.y + this.buttonFullScreen.height;
                    this.buttonFullScreenExit.setScale(
                        this.adjustButtonScale(
                            this.buttonFullScreenExit.nonScaledWidth,
                            buttonScale,
                            limitScreenPart,
                            screenDimension
                        )
                    );
                    this.buttonFullScreenExit.x = this.buttonMenuCancel.x;
                    this.buttonFullScreenExit.y =
                        this.buttonMenu.y + this.buttonFullScreenExit.height;

                    this.buttonRulesPage.setScale(
                        this.adjustButtonScale(
                            this.buttonRulesPage.nonScaledWidth,
                            buttonScale,
                            limitScreenPart,
                            screenDimension
                        )
                    );
                    this.buttonRulesPage.x = this.buttonMenuCancel.x;
                    this.buttonRulesPage.y =
                        //this.buttonMenuHome.y + this.buttonRulesPage.height;
                        this.buttonMenu.y + this.buttonRulesPage.height *2;
                    this.buttonGambleon.setScale(
                        this.adjustButtonScale(
                            this.buttonGambleon.nonScaledWidth,
                            buttonScale,
                            limitScreenPart,
                            screenDimension
                        )
                    );
                    this.buttonGambleon.x = this.buttonMenuCancel.x;
                    this.buttonGambleon.y =
                        this.buttonRulesPage.y + this.buttonGambleon.height;

                    if (this.buttonSoundOn) {
                        this.buttonSoundOn.setScale(
                            this.adjustButtonScale(
                                this.buttonSoundOn.nonScaledWidth,
                                buttonScale,
                                limitScreenPart,
                                screenDimension
                            )
                        );
                        this.buttonSoundOn.x = this.buttonMenuCancel.x;
                        this.buttonSoundOn.y =
                            this.buttonGambleon.y + this.buttonSoundOn.height;
                    }
                    if (this.buttonMusicOn) {
                        this.buttonMusicOn.setScale(
                            this.adjustButtonScale(
                                this.buttonMusicOn.nonScaledWidth,
                                buttonScale,
                                limitScreenPart,
                                screenDimension
                            )
                        );
                        this.buttonMusicOn.x = this.buttonMenuCancel.x;
                        this.buttonMusicOn.y =
                            this.buttonSoundOn.y + this.buttonSoundOn.height;
                    }

                    if (this.buttonHelpPage) {
                        this.buttonHelpPage.setScale(
                            this.adjustButtonScale(
                                this.buttonHelpPage.nonScaledWidth,
                                buttonScale,
                                limitScreenPart,
                                screenDimension
                            )
                        );
                        this.buttonHelpPage.x = this.buttonMenuCancel.x;
                        this.buttonHelpPage.y =
                            //this.buttonSoundOn.y + this.buttonHelpPage.height;
                            this.buttonMusicOn.y + this.buttonHelpPage.height;
                    }
                }

                this.historyResizeLandscape(
                    buttonScale,
                    limitScreenPart,
                    screenDimension,
                    rightX,
                    bottomY
                );

                this.betFieldText1.setScale(
                    this.adjustButtonScale(
                        this.betFieldText1.nonScaledWidth,
                        scale,
                        0.25,
                        this.buttonPanelBackLand.displayWidth
                    )
                );
                this.betFieldTextAmt1.setScale(
                    this.adjustButtonScale(
                        this.betFieldTextAmt1.nonScaledWidth,
                        scale,
                        limitScreenPartBars,
                        screenDimensionBars
                    )
                );
                this.collectText.setScale(
                    this.adjustButtonScale(
                        this.collectText.nonScaledWidth,
                        scale,
                        limitScreenPartBars,
                        screenDimensionBars
                    )
                );
                this.collectText.setTextPosition(
                    this.buttonSpin.x,
                    this.buttonSpin.y - this.buttonSpin.width / 2.5
                );

                // landscape

                this.betFieldText1.setTextPosition(
                    this.buttonPanelBackLand.x -
                    this.buttonPanelBackLand.displayWidth / 2 +
                    this.betFieldText1.width / 2 +
                    60 * scale,
                    this.buttonPanelBackLand.y -
                    this.buttonPanelBackLand.displayHeight / 2 +
                    30 * scale
                );

                this.betFieldTextAmt1.setTextPosition(
                    this.betFieldText1.x -
                    this.betFieldText1.width * 0.5 +
                    this.betFieldTextAmt1.width / 2,
                    this.betFieldText1.y + this.betFieldTextAmt1.height
                );

                this.winFieldText1.setScale(
                    this.adjustButtonScale(
                        this.winFieldText1.nonScaledWidth,
                        scale,
                        0.25,
                        this.buttonPanelBackLand.displayWidth
                    )
                );
                this.winFieldTextAmt1.setScale(
                    this.adjustButtonScale(
                        this.winFieldTextAmt1.nonScaledWidth,
                        scale,
                        limitScreenPartBars,
                        screenDimensionBars
                    )
                );
                this.winFieldText1.setTextPosition(
                    this.buttonPanelBackLand.x + this.winFieldText1.width / 2,
                    this.betFieldText1.y
                );
                this.winFieldTextAmt1.setTextPosition(
                    this.winFieldText1.x -
                    this.winFieldText1.width * 0.6 +
                    this.winFieldTextAmt1.width / 2,
                    this.winFieldText1.y + this.winFieldTextAmt1.height
                );
                this.clockText.setScale(
                    this.adjustButtonScale(
                        this.clockText.nonScaledWidth,
                        scale,
                        limitScreenPartBars,
                        screenDimensionBars
                    )
                );
                let bottomSet = 0;
                if (phoneYOffset != 0) {
                    bottomSet = -(scale * this.bottomBar.height);
                }

                this.clockText.setTextPosition(
                    rightX - 0.5 * this.clockText.width,
                    bottomY - 0.6 * this.clockText.height + bottomSet
                );

                const clockScale =
                    (0.7 * (this.bottomBar.height * scale)) / this.clock.height; //(this.clockText.height / newScale) / this.clock.height;
                this.clock.setScale(clockScale);
                this.clock.x =
                    rightX -
                    this.clockText.width -
                    0.7 * clockScale * this.clock.width;
                this.clock.y = bottomY - 0.6 * clockScale * this.clock.height;
                this.balanceFieldText.setScale(
                    this.adjustButtonScale(
                        this.balanceFieldText.nonScaledWidth,
                        scale,
                        limitScreenPartBars,
                        screenDimensionBars
                    )
                );
                this.balanceFieldTextAmt.setScale(
                    this.adjustButtonScale(
                        this.balanceFieldTextAmt.nonScaledWidth,
                        scale,
                        limitScreenPartBars,
                        screenDimensionBars
                    )
                );
                this.balanceFieldText.setOrigin(-0.5, 0);
                this.balanceFieldText.setTextPosition(
                    0,
                    bottomY - 0.5 * this.balanceFieldText.height + bottomSet
                );
                this.balanceFieldTextAmt.setOrigin(-0.5, 0);
                this.balanceFieldTextAmt.setTextPosition(
                    this.bottomBar.width * 0.03 + this.balanceFieldText.width,
                    bottomY - 0.45 * this.balanceFieldTextAmt.height + bottomSet
                );
            }

            let bottomOffset = 0;
            if (phoneYOffset != 0) {
                bottomOffset = -(scale * this.bottomBar.height);
            }

            this.topBar.setScale(scale);
            this.topBar.x = middleX; // + (this.topBar.width)
            this.topBar.y = ((scale * this.topBar.height) / 2) * 0.5;
            this.topBar.setScale(rightX / this.topBar.width, scale);

            this.bottomBar.setScale(scale * (bottomOffset != 0 ? 3 : 1));
            this.bottomBar.x = middleX; // + (this.bottomBar.width)
            this.bottomBar.y =
                bottomY - ((scale * this.bottomBar.height) / 2) * 0.8;
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

        return hr + ':' + min;
    }

    refreshButtonsFromModel(slotData: ISlotDataPresenter): void {
        this.model = slotData;
        this.isAutospin = false;
        console.log('buttons refresh from model', this, slotData);
        if (slotData.betAndAutospin.currentAutospin > 0) {
            if (!this.buttonSoundClicked) {
                this.buttonAutoSpin && this.buttonAutoSpin.kill();
                this.buttonSoundClicked = false;
            }
            if (this.buttonStopAutoSpin) {
                if (slotData.status.freeSpins.totalSpins == 0) {
                    if (!this.buttonSoundClicked) {
                        !this.isMenuActive && this.buttonStopAutoSpin.revive();
                        this.buttonSoundClicked = false;
                    }
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

            this.buttonAutoSpin && this.buttonAutoSpin.revive();

            for (let i = 0; i < this.mainButtons.length; i++) {
                if (this.mainButtons[i] == this.buttonStopAutoSpin) {
                    this.mainButtons[i] = this.buttonAutoSpin;
                    break;
                }
            }
        }
        this.resize();
    }

    Fullscreen() {
        this.isFullscreen = true;
        this.scale.startFullscreen();
        this.buttonFullScreenExit.revive();
        this.buttonFullScreen.kill();
    }

    ExitFullscreen() {
        this.isFullscreen = false;
        this.buttonFullScreenExit.kill();
        this.buttonFullScreen.revive();
        this.scale.stopFullscreen();
    }

    MenuGambleon() {
        if (this.buttonGambleon.selected) {
            this.buttonGambleon.selected = false;
            this.game.events.emit('event-allowGamble', false);
        } else {
            this.buttonGambleon.selected = true;
            this.game.events.emit('event-allowGamble', true);
        }
    }

    refreshFromModel(slotData: ISlotDataPresenter, isFutureData = false): void {
        isFutureData;
        this.model = slotData;
        this.isLeftHanded = slotData.settings.leftHanded;

        this.game.events.emit(
            'event-button-select-turbo',
            slotData.settings.turboOn
        );
        this.collectText.setText(
            getGameLanguage() == 'sv' ? ' Hämta ut '.toUpperCase() : ' COLLECT '
        );
        console.log('status panel refresh from model', this, slotData);

        if (this.betFieldText1) {
            console.log('has bet field');
            this.betFieldTextAmt1.setValue(slotData.status.bet);
            this.betFieldText1.setText(
                `${getLanguageTextGameMsg(GameMsgKeys.betJack).toUpperCase()}`
            );
        }

        if (this.winFieldText1) {
            console.log('has win field');
            this.winFieldTextAmt1.setValue(slotData.status.win);
            this.winFieldText1.setText(
                `${getLanguageTextGameMsg(GameMsgKeys.winJack).toUpperCase()}`
            );
        }

        if (this.balanceFieldText) {
            console.log('has balance field');
            this.balanceFieldTextAmt.setValue(slotData.status.balance);
            this.balanceFieldText.setText(
                `${getLanguageTextGameMsg(GameMsgKeys.credit).toUpperCase()}`
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

        if (this.turboIsPulsing && !this.turboIsFading && !this.isMenuActive) {
            /* this.turboBaseSprite.setAlpha(
                0.5 * (1 + Math.sin((2 * Math.PI * this.time.now) / 825))
            );*/
        } else if (this.isMenuActive) {
            this.buttonTurbo && this.buttonTurbo.setAlpha(1);
        } else if (!this.turboIsFading) {
            this.buttonTurbo && this.buttonTurbo.setAlpha(1);
        }

        this.clockText.setText(` ${this.getCurrentTime()} `);
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
        /*this.mainButtons.forEach((button) => {
            if (
                (!exceptionButtons.includes(button) && !invertExceptions) ||
                (invertExceptions && exceptionButtons.includes(button))
            ) {
                button.setDisable();
                if (button === this.buttonTurbo) {
                // this.turboBaseSprite.setAlpha(0);
                //  mainActiveButtonsSprites.push(this.turboBaseSprite);
                }

                if (!button.alive) {
                    button.revive();
                    button.setAlpha(0);
                }
                mainActiveButtonsSprites.push(...button.elements);
            }
        });*/

        this.add.tween({
            targets: mainActiveButtonsSprites,
            duration: 500,
            alpha: 1,
            ease: 'Linear',
            onComplete: () => {
                /* this.mainButtons.forEach((button) => {
                    if (
                        (!exceptionButtons.includes(button) &&
                            !invertExceptions) ||
                        (invertExceptions && exceptionButtons.includes(button))
                    ) {
                        button.setEnable();
                        button.revive();
                        button.setAlpha(1);
                    }
                });*/
                this.turboIsFading = false;
            },
        });
    }

    fadeOutMainButtons(...exceptionButtons: GameButton[]): void {
        this.fadeOutFollowingMainButtons(false, ...exceptionButtons);
    }

    gambleButtonsState(isShow: boolean, data?: ISlotDataPresenter): void {
        if (isShow) {
            this.buttonCollect.revive();
            if (!this.buttonsCollectShow) {
                if (data && data.isRecovery == 0) {
                    this.buttongamble.revive();
                }
                this.buttonsCollectShow = true;
            }
            this.buttonSpinStop.kill();
            this.collectText.turnOn();
        } else {
            this.buttongamble.kill();
            // this.buttongambleMystery.kill();
            this.buttonCollect.kill();
            this.collectText.turnOff();
        }
    }

    fadeOutFollowingMainButtons(
        invertExceptions: boolean,
        ...exceptionButtons: GameButton[]
    ): void {
        const mainActiveButtonsSprites = [];
        this.turboIsFading = true;
        /* this.mainButtons.forEach((button) => {
            if (
                (!exceptionButtons.includes(button) && !invertExceptions) ||
                (invertExceptions && exceptionButtons.includes(button))
            ) {
                button.setDisable();
                if (button === this.buttonTurbo) {
                // mainActiveButtonsSprites.push(this.turboBaseSprite);
                }
                mainActiveButtonsSprites.push(...button.elements);
            }
        });*/

        this.add.tween({
            targets: mainActiveButtonsSprites,
            duration: 500,
            alpha: 0,
            ease: 'Linear',
            onComplete: () => {
                /* this.mainButtons.forEach((button) => {
                    if (
                        (!exceptionButtons.includes(button) &&
                            !invertExceptions) ||
                        (invertExceptions && exceptionButtons.includes(button))
                    ) {
                        button.kill();
                        button.setAlpha(1);
                    }
                });*/
                this.turboIsFading = false;
            },
        });
    }

    fadeInMenuButtons(): void {
        const menuButtonsSprites = [];

        this.menuButtons.forEach((button) => {
            button.setDisable();
            button.revive();
            //button.setAlpha(0);
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
            //alpha: 0,
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
        this.buttonSoundClicked = false;

        if (this.buttonTurbo) {
            this.buttonTurbo.setDisable();
        }
        this.buttonAutoSpin.setDisable();
        this.buttonBet.setDisable();

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
                    //button.setAlpha(1);
                });
                if (this.isFullscreen) {
                    this.buttonFullScreenExit.revive();
                    this.buttonFullScreenExit.setEnable();
                    this.buttonFullScreen.setDisable();
                } else {
                    this.buttonFullScreen.revive();
                    this.buttonFullScreen.setEnable();
                    this.buttonFullScreenExit.setDisable();
                }
            },
            onCompleteScope: this
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
        setTimeout(
            function (): void {
                //this.gameCover.setActive(true).setVisible(true).setAlpha(0.01);
                this.isMenuActive = 1;
            }.bind(this),
            600
        );
    }

    closeMenu(): void {
        if (!this.isMenuActive) {
            return;
        }
        this.buttonSoundClicked = false;
        //this.gameCover.setActive(false).setVisible(false).setAlpha(1);
        this.isMenuActive = 0;
        if (this.buttonTurbo) {
            this.buttonTurbo.setEnable();
        }
        this.buttonBet.setEnable();
        this.buttonAutoSpin.setEnable();
        console.log('closeMenu()');
        this.game.events.emit('event-close-popups');

        this.fadeOutMenuButtons();

        this.fadeInMainButtons(this.buttonBetOk);
    }

    private refreshSettingsButtonsTransparency(whoOpenedIt: string): void {
        // this.buttonGambleon.setAlpha(0.5);
        //  this.buttonFullScreen.setAlpha(0.5);
        //  this.buttonRulesPage.setAlpha(0.5);
        /*  if (this.buttonHelpPage) {
            this.buttonHelpPage.setAlpha(0.5);
        }
        if (this.buttonSoundOn) {
            this.buttonSoundOn.setAlpha(0.5);
        }*/
        if (whoOpenedIt == 'settings-popup') {
            this.buttonGambleon.setAlpha(1);
        } else if (whoOpenedIt == 'settings-popup') {
            this.buttonGambleon.setAlpha(1);
        } else if (whoOpenedIt == eUserInputCommands.showInfoPage) {
            this.buttonFullScreen.setAlpha(1);
        } else if (whoOpenedIt == eUserInputCommands.showRulesPage) {
            this.buttonRulesPage.setAlpha(1);
        } else if (whoOpenedIt == eUserInputCommands.openHelpPage) {
            /* if (this.buttonHelpPage) {
                this.buttonHelpPage.setAlpha(1);
            }*/
            if (this.buttonSoundOn) {
                this.buttonSoundOn.setAlpha(1);
            }
            if (this.buttonMusicOn) {
                this.buttonMusicOn.setAlpha(1);
            }
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
            null,
            null,
            null,
            'historyButton'
        );
        // this.buttonMenuHistory.setScale(0.7);
        this.buttonMenuHistory.kill();
        this.menuButtons.push(this.buttonMenuHistory);

        const bgOldDepth = this.bgImage.depth;
        const oldMenuBgDepth = bgOldDepth;
        const cancelBtnOldDepth = this.buttonMenuCancel.background.depth;

        this.game.events.on(
            'event-state-StateAskServerForHistory-onEnter',
            (arg) => {
                arg;
                this.isClosingHistory = false;
                this.betFieldText1.turnOff();
                this.betFieldTextAmt1.turnOff();
                this.winFieldText1.turnOff();
                this.winFieldTextAmt1.turnOff();
                this.balanceFieldText.turnOff();
                this.balanceFieldTextAmt.turnOff();
                this.bgImage.setDepth(2);
                this.bgImage.setActive(true).setVisible(true);
                this.clock.setDepth(2);
                this.scene.get('Overlays').cameras.main.setAlpha(0);
                this.buttonMenuCancel.background.setDepth(2);
                this.buttonCloseHistory.background.setDepth(2);
                this.buttonCloseHistory.revive();
            },
            this
        );

        this.game.events.on(
            'event-button-clicked-historyClose',
            () => {
                if (!slotDataPresenter.historyData.isLoadingHistory) {
                    // this.game.events.emit('event-close-popups');
                    this.game.events.emit(
                        `event-user-input-${eUserInputCommands.closeMenu}`
                    );
                    this.game.events.emit('event-disableEnableMenuBtn', false);
                }
            },
            this
        );

        this.game.events.on(
            'event-state-StateAskServerForHistory-onExit',
            (arg) => {
                arg;
                this.betFieldText1.turnOn();
                this.betFieldTextAmt1.turnOn();
                this.winFieldText1.turnOn();
                this.winFieldTextAmt1.turnOn();
                this.balanceFieldText.turnOn();
                this.balanceFieldTextAmt.turnOn();
                this.isClosingHistory = true;
                this.bgImage.setDepth(oldMenuBgDepth);
                this.bgImage.setActive(false).setVisible(false);
                this.clock.setDepth(0);
                this.scene.get('Overlays').cameras.main.setAlpha(1);
                this.buttonMenuCancel.background.setDepth(cancelBtnOldDepth);
                this.buttonCloseHistory.kill();
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
                ? rightX * 0.05 + this.buttonMenuHistory.width / 2.3
                : rightX * 0.9872 - this.buttonMenuHistory.width / 2.3;

                if(!this.buttonMenuHome){
                    this.buttonMenuHistory.y =
                    this.buttonHelpPage.y + this.buttonMenuHistory.height;
                    }else{
                        this.buttonMenuHistory.y =
                        this.buttonHelpPage.y + this.buttonMenuHistory.height*2;
                    }
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
                ? rightX * 0.05 + this.buttonGambleon.width / 2.3
                : rightX * 0.99 - this.buttonGambleon.width / 2.3;

                if(!this.buttonMenuHome){
                    this.buttonMenuHistory.y =
                    this.buttonHelpPage.y + this.buttonMenuHistory.height;
                    }else{
                        this.buttonMenuHistory.y =
                        this.buttonHelpPage.y + this.buttonMenuHistory.height*2;
                    }
            this.historyPopup.resize(true);
        }
    }
}
