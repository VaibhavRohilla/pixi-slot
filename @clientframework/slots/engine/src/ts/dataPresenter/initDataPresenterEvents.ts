import {
    updateDataPresenterWithServerData,
    updateFutureDataWithServerData,
    updateFutureDataWithBufferData,
} from './updateDataWithServerData';
import { slotDataPresenter } from './instances';
import { updateDataPresenterWithFutureData } from './updateDataWithFutureData';
import { updateTakeBet } from './updateTakeBet';
import { eUserInputCommands } from '../gameFlow/userInput/userInputCommands';

let eventEmitter: Phaser.Events.EventEmitter = null;

export function initDataPresenterEvents(
    eventEmitter_: Phaser.Events.EventEmitter
): void {
    eventEmitter = eventEmitter_;
    eventEmitter.on(
        'event-update-current-data-with-server-data',
        (inputSource) => {
            updateDataPresenterWithServerData(
                slotDataPresenter,
                inputSource,
                eventEmitter
            );
            eventEmitter.emit('event-current-data-updated', slotDataPresenter);
        }
    );

    eventEmitter.on(
        'event-update-future-data-with-server-data',
        (inputSource) => {
            updateFutureDataWithServerData(slotDataPresenter, inputSource);
            eventEmitter.emit('event-future-data-updated', slotDataPresenter);
        }
    );

    eventEmitter.on(
        'event-update-future-data-with-buffer-data',
        (inputSource) => {
            updateFutureDataWithBufferData(slotDataPresenter, inputSource);
            eventEmitter.emit('event-future-data-updated', slotDataPresenter);
        }
    );

    eventEmitter.on('event-take-bet', (data) => {
        updateTakeBet(data);
        eventEmitter.emit('event-current-data-updated', data);
    });

    eventEmitter.on('event-update-total-all-wins-data', (data: number) => {
        slotDataPresenter.status.win = slotDataPresenter.futureStatus.win = slotDataPresenter.status.freeSpins.totalWin = slotDataPresenter.futureStatus.freeSpins.totalWin = data;
        eventEmitter.emit('event-current-data-updated', slotDataPresenter);
    });

    eventEmitter.on('event-update-current-win-data-with-future-data', () => {
        slotDataPresenter.status.win = slotDataPresenter.futureStatus.win;
        eventEmitter.emit('event-current-data-updated', slotDataPresenter);
    });

    eventEmitter.on('event-update-current-data-with-future-data', (data) => {
        updateDataPresenterWithFutureData(data);
        eventEmitter.emit('event-current-data-updated', data);
        eventEmitter.emit('event-current-data-updated-with-future-data', data);
    });

    eventEmitter.on('event-request-winlines-data', () => {
        eventEmitter.emit('event-winlines-data', slotDataPresenter.winLines);
    });

    eventEmitter.on('event-request-data', () => {
        eventEmitter.emit('event-data', slotDataPresenter);
    });

    eventEmitter.on(
        `event-user-input-${eUserInputCommands.stopAutospin}`,
        () => {
            eventEmitter.emit('event-autospin-stop');
            slotDataPresenter.betAndAutospin.currentAutospin = 0;
            eventEmitter.emit('event-current-data-updated', slotDataPresenter);
        }
    );
    eventEmitter.on(
        `event-user-input-${eUserInputCommands.confirmStopAfterJackpot}`,
        () => {
            slotDataPresenter.betAndAutospin.stopAfterJackpot = !slotDataPresenter
                .betAndAutospin.stopAfterJackpot;
        }
    );

    eventEmitter.on(
        `event-user-input-${eUserInputCommands.changeSetting}`,
        (arg) => {
            if (arg == 'stopAfterJackpot') {
                slotDataPresenter.betAndAutospin.stopAfterJackpot = !slotDataPresenter
                    .betAndAutospin.stopAfterJackpot;
                eventEmitter.emit(
                    'event-current-data-updated',
                    slotDataPresenter,
                    true
                );
            } else {
                switch (arg) {
                    case 'sound':
                        slotDataPresenter.settings.sound = !slotDataPresenter
                            .settings.sound;
                        break;
                    case 'music':
                        slotDataPresenter.settings.music = !slotDataPresenter
                            .settings.music;
                        break;
                    case 'holdForAuto':
                        slotDataPresenter.settings.holdForAuto = !slotDataPresenter
                            .settings.holdForAuto;
                        break;
                    case 'leftHanded':
                        slotDataPresenter.settings.leftHanded = !slotDataPresenter
                            .settings.leftHanded;
                        break;
                    case 'spaceForSpin':
                        slotDataPresenter.settings.spaceForSpin = !slotDataPresenter
                            .settings.spaceForSpin;
                        break;
                    case 'turbo':
                        slotDataPresenter.settings.turboOn = !slotDataPresenter
                            .settings.turboOn;
                        eventEmitter.emit(
                            'event-turbobutton-pulse',
                            slotDataPresenter.settings.turboOn
                        );
                        break;
                }
                eventEmitter.emit(
                    'event-current-data-updated',
                    slotDataPresenter
                );
                //eventEmitter.emit("event-settings-data-updated", slotDataPresenter.settings);
            }
        }
    );

    eventEmitter.on('event-history-set-playerId', (arg) => {
        slotDataPresenter.historyData.playerId = arg;
    });
}
