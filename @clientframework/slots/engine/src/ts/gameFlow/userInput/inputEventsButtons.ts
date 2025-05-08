import { eUserInputCommands } from './userInputCommands';
import { noErrorPopup } from './initUserInputEvents';
import { basePopupStyle, COMPLEX_AUTO_SPIN } from '@specific/config';
import { slotDataPresenter } from '../../dataPresenter/instances';
import { getStopAutospinOnSpin } from '../../dataPresenter/defaultConfigSlot';
import { hasHistoryUrl } from '@clientframework/common/backend-service/src/launchParams/historyUrl';

export function initButtonInputEvents(scene: Phaser.Scene): void {
    scene.game.events.on('event-button-clicked-spin', () => {
        noErrorPopup &&
            scene.game.events.emit(
                `event-user-input-${eUserInputCommands.spinPressed}`
            );
    });

    scene.game.events.on('event-button-clicked-spinStop', () => {
        noErrorPopup &&

            scene.game.events.emit(
                `event-user-input-${eUserInputCommands.spinPressed}`
            );

    });

    if (getStopAutospinOnSpin()) {
        scene.game.events.on('event-button-clicked-spinStop', () => {
            if (noErrorPopup && slotDataPresenter.betAndAutospin.currentAutospin > 0) {
                scene.game.events.emit(
                    `event-user-input-${eUserInputCommands.stopAutospin}`
                );
            }
        });
    }

    scene.game.events.on('event-button-hold-spin', () => {
        noErrorPopup &&
            scene.game.events.emit(
                `event-user-input-${eUserInputCommands.numberOfSpinsSpinPopup}`
            );
    });

    scene.game.events.on('event-button-clicked-bet', () => {
        noErrorPopup &&
            scene.game.events.emit(
                `event-user-input-${eUserInputCommands.betPopup}`
            );
        scene.game.events.emit(
            'toggle-popup-close-button',
            basePopupStyle.popupStyleClassic
        );
    });

    scene.game.events.on('event-button-clicked-bet-popup-button', (val) => {
        if (val && val > 0) {
            noErrorPopup &&
                scene.game.events.emit(
                    `event-user-input-${eUserInputCommands.betRequest}`,
                    val
                );
        }
    });


    scene.game.events.on('event-button-clicked-menuFullscreen', () => {
        noErrorPopup &&
            scene.game.events.emit(
                `event-user-input-${eUserInputCommands.fullscreenPressed}`
            );
    });
    scene.game.events.on('event-button-clicked-menuExitFullscreen', () => {
        noErrorPopup &&
            scene.game.events.emit(
                `event-user-input-${eUserInputCommands.exitfullscreenPressed}`
            );
    });
    scene.game.events.on('event-button-clicked-menuGambleon', () => {
        noErrorPopup &&
            scene.game.events.emit(
                `event-user-input-${eUserInputCommands.buttonGamblePressed}`
            );
    });

    scene.game.events.on('event-button-clicked-autospin', () => {
        scene.game.events.emit('event-disableTurboTillAuto');
        if (COMPLEX_AUTO_SPIN) {
            noErrorPopup &&
                scene.game.events.emit(
                    `event-user-input-${eUserInputCommands.betPopup}`,
                    true
                );
            scene.game.events.emit('toggle-popup-close-button', true);
        } else {
            noErrorPopup &&
                scene.game.events.emit(
                    `event-user-input-${eUserInputCommands.numberOfSpinsSpinPopup}`,
                    true
                );
        }
    });

    scene.game.events.on('event-button-clicked-spins-popup-button', (val) => {
        if (val && val > 0) {
            noErrorPopup &&
                scene.game.events.emit(
                    `event-user-input-${eUserInputCommands.autoSpinSetNumberOfSpins}`,
                    val
                );
        }
    });

    scene.game.events.on(
        'event-button-clicked-loss-limit-popup-button',
        (val) => {
            if (val && val >= -1) {
                noErrorPopup &&
                    scene.game.events.emit(
                        `event-user-input-${eUserInputCommands.autoSpinSetLossLimit}`,
                        val
                    );
            }
        }
    );

    scene.game.events.on(
        'event-button-clicked-single-win-limit-popup-button',
        (val) => {
            if (val && val >= -1) {
                noErrorPopup &&
                    scene.game.events.emit(
                        `event-user-input-${eUserInputCommands.autoSpinSetSingleWinLimit}`,
                        val
                    );
            }
        }
    );

    scene.game.events.on('event-button-clicked-stop-after-jackpot', () => {
        noErrorPopup &&
            scene.game.events.emit(
                `event-user-input-${eUserInputCommands.changeSetting}`,
                'stopAfterJackpot'
            );
    });

    scene.game.events.on(
        'event-button-clicked-confirm-stop-after-jackpot',
        (val) => {
            val;
            noErrorPopup &&
                scene.game.events.emit(
                    `event-user-input-${eUserInputCommands.confirmStopAfterJackpot}`
                );
        }
    );

    scene.game.events.on('event-button-clicked-stopAutospin', (val) => {
        val;
        noErrorPopup &&
            scene.game.events.emit(
                `event-user-input-${eUserInputCommands.stopAutospin}`
            );
    });

    scene.game.events.on('event-button-clicked-menu', (val) => {
        val;
        noErrorPopup &&
            scene.game.events.emit(
                `event-user-input-${eUserInputCommands.showMenu}`
            );
    });

    scene.game.events.on('event-button-clicked-menuCancel', (val) => {
        val;
        if (noErrorPopup) {
            if (slotDataPresenter.historyData.pageActive) {
                scene.game.events.emit(
                    `event-user-input-${eUserInputCommands.historyClose}`
                );
            } else {
                scene.game.events.emit(
                    `event-user-input-${eUserInputCommands.closeMenu}`
                );
            }
        }
    });

    scene.game.events.on('event-button-clicked-historyClose', (val) => {
        val;
        if (noErrorPopup) {
            if (!slotDataPresenter.historyData.isLoadingHistory) {
                scene.game.events.emit(
                    `event-user-input-${eUserInputCommands.historyClose}`
                );
            }
        }
    });

    scene.game.events.on('event-button-clicked-menuInfo', (val) => {
        val;
        noErrorPopup &&
            scene.game.events.emit(
                `event-user-input-${eUserInputCommands.showInfoPage}`
            );
    });

    scene.game.events.on('event-button-clicked-menuRules', (val) => {
        val;
        noErrorPopup &&
            scene.game.events.emit(
                `event-user-input-${eUserInputCommands.showRulesPage}`
            );
    });

    scene.game.events.on('event-button-clicked-menuHome', (val) => {
        val;
        noErrorPopup &&
            scene.game.events.emit(
                `event-user-input-${eUserInputCommands.backToLobby}`
            );
    });

    scene.game.events.on('event-button-clicked-menuSettings', (val) => {
        val;
        noErrorPopup &&
            scene.game.events.emit(
                `event-user-input-${eUserInputCommands.showSettingsPage}`
            );
    });

    scene.game.events.on('event-button-clicked-sound', (val) => {
        val;
        scene.game.events.emit('event-stopSound', val);
        noErrorPopup &&
            scene.game.events.emit(
                `event-user-input-${eUserInputCommands.changeSetting}`,
                'sound'
            );

    });

    scene.game.events.on('event-button-clicked-music', (val) => {
        val;
        scene.game.events.emit('event-stopMusic', val);
        noErrorPopup &&
            scene.game.events.emit(
                `event-user-input-${eUserInputCommands.changeSetting}`,
                'music'
            );
    });

    scene.game.events.on('event-button-clicked-leftHanded', (val) => {
        val;
        noErrorPopup &&
            scene.game.events.emit(
                `event-user-input-${eUserInputCommands.changeSetting}`,
                'leftHanded'
            );
    });

    scene.game.events.on('event-button-clicked-spaceForSpin', (val) => {
        val;
        noErrorPopup &&
            scene.game.events.emit(
                `event-user-input-${eUserInputCommands.changeSetting}`,
                'spaceForSpin'
            );
    });

    scene.game.events.on('event-button-clicked-holdForAuto', (val) => {
        val;
        noErrorPopup &&
            scene.game.events.emit(
                `event-user-input-${eUserInputCommands.changeSetting}`,
                'holdForAuto'
            );
    });

    scene.game.events.on('event-button-clicked-turbo', (val) => {
        val;
        scene.game.events.emit('event-buttonClickedTurbo', val);
        noErrorPopup &&
            scene.game.events.emit(
                `event-user-input-${eUserInputCommands.changeSetting}`,
                'turbo'
            );
    });

    scene.game.events.on('event-button-clicked-menuHelp', (val) => {
        val;
        noErrorPopup &&
            scene.game.events.emit(
                `event-user-input-${eUserInputCommands.openHelpPage}`
            );
    });

    scene.game.events.on('event-button-clicked-menuHistory', (val) => {
        val;
        if (noErrorPopup) {
            if (hasHistoryUrl()) {
                scene.game.events.emit('event-history-command');
            } else {
                if (slotDataPresenter.historyData.pageActive) {
                    scene.game.events.emit(
                        `event-user-input-${eUserInputCommands.historyClose}`
                    );
                } else {
                    scene.game.events.emit(
                        `event-user-input-${eUserInputCommands.historyRequest}`
                    );
                }
            }
        }
    });

    scene.game.events.on('event-button-clicked-historyPrev', (val) => {
        val;
        noErrorPopup &&
            scene.game.events.emit(
                `event-user-input-${eUserInputCommands.historyPrev}`
            );
    });

    scene.game.events.on('event-button-clicked-historyNext', (val) => {
        val;
        noErrorPopup &&
            scene.game.events.emit(
                `event-user-input-${eUserInputCommands.historyNext}`
            );
    });
}
