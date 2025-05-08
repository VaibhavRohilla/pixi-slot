import ComponentLayer from '@commonEngine/Scenes/ComponentLayer';
import {
    IReelCoordinatesData,
    syncCameraWithReelsCoordinatesData,
} from '../dataPresenterVisual/iReelCoordinatesData';
import { TextPopup } from '../game-objects/textPopup';
import { ISlotDataPresenter } from '../dataPresenter/interfaces';

import {
    createGameObjectsFreeSpins,
    resizeGameObjectsFreeSpins,
} from '@specific/specifics/createGameObjectsFreeSpins';
import { globalGetIsPortrait } from '@clientframework/slots/engine/@clientframework/common/engine/src/ts/globalGetIsPortrait';

export default class StatusPanel extends ComponentLayer {
    constructor() {
        super({
            key: 'StatusPanel',
        });
    }

    betField: Phaser.GameObjects.Sprite;
    winField: Phaser.GameObjects.Sprite;
    balanceField: Phaser.GameObjects.Sprite;

    clockText: Phaser.GameObjects.Text;
    timerText: Phaser.GameObjects.Text;
    betFieldText: TextPopup;
    winFieldText: TextPopup;
    balanceFieldText: TextPopup;

    statsStartingTime = 0;

    create(): void {
        this.betField = this.add.sprite(0, 0, 'statusPanel', 'bet');
        this.winField = this.add.sprite(0, 0, 'statusPanel', 'win');
        this.balanceField = this.add.sprite(0, 0, 'statusPanel', 'balance');

        const style = {
            font: '35px Arial',
            align: 'center',
            color: '#fff',
            // stroke: '#000',
            // strokeThickness: 16,
        };

        this.clockText = this.add.text(0, 10, '00:00', style);

        this.betFieldText = new TextPopup(
            this,
            'betFieldText',
            0,
            0,
            false,
            style
        );

        this.timerText = this.add.text(0, 10, '00:00', style);

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

        createGameObjectsFreeSpins(this);

        this.game.events.on(
            'event-reels-scene-coords-data',
            (data: IReelCoordinatesData) => {
                syncCameraWithReelsCoordinatesData(this, data);

                if (globalGetIsPortrait(this)) {
                    this.resizePortrait(data);
                } else {
                    this.resizeLandscape(data);
                }
            }
        );

        this.game.events.once(
            'event-reels-scene-coords-data',
            () => {
                this.statsStartingTime = this.time.now;
                this.resize();
            },
            this
        );

        this.game.events.emit('event-request-reels-scene-coords-data');
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
    }

    update(): void {
        this.clockText.setText(this.getCurrentTime());

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
    }

    refreshFromModel(slotData: ISlotDataPresenter, isFutureData = false): void {
        isFutureData;
        console.log('status panel refresh from model', this, slotData);
        if (this.betFieldText) {
            console.log('has bet field');
            this.betFieldText.setValue(slotData.status.bet);
        }
        if (this.winFieldText) {
            console.log('has win field');
            if (slotData.status.freeSpins.totalSpins > 0) {
                this.winFieldText &&
                    this.winFieldText.setValue(
                        slotData.status.freeSpins.totalWin
                    );
            } else {
                this.winFieldText &&
                    this.winFieldText.setValue(slotData.status.win);
            }
        }
        if (this.balanceFieldText) {
            console.log('has balance field');
            this.balanceFieldText.setValue(slotData.status.balance);
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

        const reelsW = 5 * deltaXReels;
        const middleReelsX = data.reelsCoords[2].x + 0.5 * deltaXReels;
        const fieldY = bottomReelsY + 0.5 * (bottomScreenY - bottomReelsY);

        this.resizeElements(data, fieldY, reelsW, middleReelsX, bottomReelsY);
    }

    resizePortrait(data: IReelCoordinatesData): void {
        const deltaXReels = data.reelsCoords[1].x - data.reelsCoords[0].x;
        const deltaYSymbol =
            data.reelsScale *
            (data.symbolsCoords[1][1].y - data.symbolsCoords[1][0].y);
        const reelsH = 3 * deltaYSymbol;
        const bottomReelsY = data.reelsCoords[2].y + reelsH;
        const bottomScreenY = this.scale.gameSize.height / data.camera.zoom;

        const reelsW = 5 * deltaXReels;
        const middleReelsX = data.reelsCoords[2].x + 0.5 * deltaXReels;
        const fieldY = bottomReelsY + 0.2 * (bottomScreenY - bottomReelsY);

        this.resizeElements(data, fieldY, reelsW, middleReelsX, bottomReelsY);
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

    protected resizeElements(
        data: IReelCoordinatesData,
        fieldY: number,
        reelsW: number,
        middleReelsX: number,
        reelsBottom: number
    ): void {
        if (this.betField) {
            this.betField.x = middleReelsX - (2 * reelsW) / 6;
            this.betField.y = fieldY;

            if (this.betFieldText) {
                this.betFieldText.setTextPosition(
                    this.betField.x + 15,
                    this.betField.y
                );
            }
        }
        if (this.winField) {
            this.winField.x = middleReelsX;
            this.winField.y = fieldY;

            if (this.winField) {
                this.winFieldText.setTextPosition(
                    this.winField.x + 15,
                    this.winField.y
                );
            }
        }
        if (this.balanceField) {
            this.balanceField.x = middleReelsX + (2 * reelsW) / 6;
            this.balanceField.y = fieldY;

            if (this.balanceFieldText) {
                this.balanceFieldText.setTextPosition(
                    this.balanceField.x + 15,
                    this.balanceField.y
                );
            }
        }

        resizeGameObjectsFreeSpins(
            data,
            fieldY,
            reelsW,
            middleReelsX,
            reelsBottom
        );

        if (this.clockText) {
            this.clockText.x = middleReelsX + (2 * reelsW) / 5;
        }

        if (this.timerText) {
            this.timerText.x = this.clockText.x - (this.timerText.width + 30);
        }
    }
}
