import BackgroundBasis from '@commonEngine/Scenes/testScenes/BackgroundBasis';
import { ISlotDataPresenter } from '../dataPresenter/interfaces';
import { createOverlays } from '@specific/config';
import { CHEAT_TOOL } from '@specific/dataConfig';
import { createCheatTool } from '../factory/createCheatTool';
import ComponentLayer from '@clientframework/slots/engine/@clientframework/common/engine/src/ts/Scenes/ComponentLayer';
import BasePopup from '@clientframework/slots/engine/@clientframework/common/engine/src/ts/GameObjects/popups/basePopup';

export default class Overlays extends ComponentLayer {
    betPopup: BasePopup;
    autoSpinPopup: BasePopup;
    lossLimitPopup: BasePopup;
    singleWinPopup: BasePopup;
    cheatTool = null;

    constructor() {
        super({
            key: 'Overlays',
        });
        //this.originalSize = new Phaser.Structs.Size(1920, 1080);
    }

    // preload() {
    //     this.load.image("blackField", require("ASSETS_DIR_COMMON/blackField.png"))
    // }

    create(): void {
        //buttons.push(createCheckBox("holdForAuto", null, this, getLanguageTextGameMsg(GameMsgKeys.holdForAutospin)));
        const retObj = createOverlays(this);
        this.betPopup = retObj.betPopup;
        this.autoSpinPopup = retObj.spinsPopup;
        this.lossLimitPopup = retObj.lostLimit;
        this.singleWinPopup = retObj.singleWinLimit;

        this.game.events.on(
            'event-current-data-updated',
            this.refreshFromModel,
            this
        );
        this.game.events.on('event-data', this.refreshFromModel, this);
        this.game.events.emit('event-request-data');

        this.game.events.on(
            'event-popup-opened',
            () => this.game.events.emit('event-request-data'),
            this
        );
        if (CHEAT_TOOL) {
            this.cheatTool = createCheatTool(this);
        }
        this.resize();
    }

    resize(gameSize: Phaser.Structs.Size = this.scale.gameSize): void {
        let syncScene = this.scene.get('BackgroundSettings');
        this.cameras.main.setZoom(syncScene.cameras.main.zoom);
        this.cameras.main.setOrigin(syncScene.cameras.main.originX, syncScene.cameras.main.originY);
        this.cameras.main.setScroll(syncScene.cameras.main.scrollX, syncScene.cameras.main.scrollY);

        const screenWidth = syncScene.scale.gameSize.width / this.cameras.main.zoom;
        const screenHeight =
        syncScene.scale.gameSize.height / this.cameras.main.zoom;
        const bottomY = screenHeight;
        const rightX = screenWidth;
        this.betPopup.bg.setPosition(
            rightX / 2, bottomY / 2
        );
        this.autoSpinPopup.bg.setPosition(
            rightX / 2, bottomY / 2
        );
        this.lossLimitPopup.bg.setPosition(
            rightX / 2, bottomY / 2
        );
        this.singleWinPopup.bg.setPosition(
            rightX / 2, bottomY / 2
        );
        this.cheatTool && this.cheatTool.setPosition(
            rightX / 2, bottomY / 2
        );
        this.cheatTool && this.cheatTool.setScale(2)

        console.log('RESIZE OVERLAYS A');
        // if (!this.scene.manager.isActive(this.scene.key)) {
        //     return;
        // }

        console.log('RESIZE OVERLAYS B');
        this.game.events.emit('overlaysSceneResized');
    }

    refreshFromModel(slotData: ISlotDataPresenter): void {
        this.game.events.emit(
            'event-button-select-sound',
            slotData.settings.sound
        );
        this.game.events.emit(
            'event-button-select-music',
            slotData.settings.music
        );
        this.game.events.emit(
            'event-button-select-leftHanded',
            slotData.settings.leftHanded
        );
        this.game.events.emit(
            'event-button-select-spaceForSpin',
            slotData.settings.spaceForSpin
        );
        this.game.events.emit(
            'event-button-select-holdForAuto',
            slotData.settings.holdForAuto
        );
        this.game.events.emit(
            'event-button-select-stop-after-jackpot',
            slotData.betAndAutospin.stopAfterJackpot
        );

        //event-button-clicked-bet-popup-button
        this.game.events.emit(
            'event-button-select-bet-popup-button-by-val',
            slotData.status.bet
        );
    }
}
