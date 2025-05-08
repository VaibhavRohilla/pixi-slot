import BasePopup from '@clientframework/slots/engine/@clientframework/common/engine/src/ts/GameObjects/popups/basePopup';
import { slotDataPresenter } from '../../dataPresenter/instances';
import { CURRENCY } from '@specific/dataConfig';
import { createCheckBox } from '@specific/config';
import { getLanguageTextGameMsg } from '@clientframework/common/backend-service/src/client-remote-data/src/multilanguage/gameMsgData';
import { GameMsgKeys } from '@clientframework/common/backend-service/src/client-remote-data/src/multilanguage/gameMsgKeys';
import GameButton from '@clientframework/slots/engine/@clientframework/common/engine/src/ts/GameObjects/gameButton';
import { HISTORY_TOOL } from '../../dataPresenter/defaultConfigSlot';
import { HistoryPopup } from '../../game-objects/historyPopup';

export function createOverlaysClassic(scene: Phaser.Scene): void {
    const buttons = [];
    buttons.push(
        createCheckBox(
            'sound',
            null,
            scene,
            getLanguageTextGameMsg(GameMsgKeys.sound)
        )
    );
    buttons.push(
        createCheckBox(
            'music',
            null,
            scene,
            getLanguageTextGameMsg(GameMsgKeys.music)
        )
    );
    buttons.push(
        createCheckBox(
            'leftHanded',
            null,
            scene,
            getLanguageTextGameMsg(GameMsgKeys.leftHanded)
        )
    );
    if (!navigator.userAgent.includes('Mobile')) {
        buttons.push(
            createCheckBox(
                'spaceForSpin',
                null,
                scene,
                getLanguageTextGameMsg(GameMsgKeys.spaceForSpin)
            )
        );
    }

    new BasePopup(
        'bet-popup',
        scene,
        0,
        0,
        slotDataPresenter.betAndAutospin.betLevels,
        true,
        getLanguageTextGameMsg(GameMsgKeys.bet),
        { x: 0, y: 2 },
        getLanguageTextGameMsg(GameMsgKeys.autospin) +
        '\n' +
        getLanguageTextGameMsg(GameMsgKeys.bet),
        { x: 0, y: 1.2 },
        4,
        2,
        1,
        0.9
    );

    new BasePopup(
        'spins-popup',
        scene,
        0,
        0,
        slotDataPresenter.betAndAutospin.autoSpinLevels,
        false,
        getLanguageTextGameMsg(GameMsgKeys.autospin) +
        '\n' +
        getLanguageTextGameMsg(GameMsgKeys.numberOfSpins),
        { x: 0, y: 0.96 },
        null,
        null,
        3,
        2,
        1,
        1,
        null,
        null,
        null,
        null,
        100,
        { x: 0, y: 1.3 }
    );

    new BasePopup(
        'loss-limit-popup',
        scene,
        0,
        0,
        slotDataPresenter.betAndAutospin.lossLimitLevels,
        false,
        getLanguageTextGameMsg(GameMsgKeys.autospin) +
        '\n' +
        getLanguageTextGameMsg(GameMsgKeys.lossLimit) +
        ` (${CURRENCY})`,
        { x: 0, y: 1.2 }
    );

    new BasePopup(
        'single-win-limit-popup',
        scene,
        0,
        0,
        slotDataPresenter.betAndAutospin.singleWinLimitLevels,
        false,
        getLanguageTextGameMsg(GameMsgKeys.autospin) +
        '\n' +
        getLanguageTextGameMsg(GameMsgKeys.singleWinLimit) +
        ` (${CURRENCY})`,
        { x: 0, y: 1.2 }
    );

    const buttonStopAfterJackpot = createCheckBox(
        'stop-after-jackpot',
        null,
        scene,
        getLanguageTextGameMsg(GameMsgKeys.stopAfterJackpot)
    );

    const buttonConfirm = new GameButton(
        'confirm-stop-after-jackpot',
        null,
        scene,
        0,
        0,
        'okIdle',
        'okDown',
        'okOver',
        'statusPanel'
    );

    new BasePopup(
        'stop-after-jackpot-popup',
        scene,
        0,
        0,
        null,
        false,
        getLanguageTextGameMsg(GameMsgKeys.autospin) +
        '\n' +
        getLanguageTextGameMsg(GameMsgKeys.stopAfterJackpot),
        { x: 0, y: 1.2 },
        getLanguageTextGameMsg(GameMsgKeys.stopAfterJackpot),
        { x: 0, y: 1.2 },
        1,
        1,
        1,
        1,
        [buttonStopAfterJackpot, buttonConfirm]
    );

    //buttons.push(createCheckBox("holdForAuto", null, scene, getLanguageTextGameMsg(GameMsgKeys.holdForAutospin)));
    new BasePopup(
        'settings-popup',
        scene,
        0,
        0,
        [],
        false,
        getLanguageTextGameMsg(GameMsgKeys.options),
        { x: 0, y: 2 },
        '',
        { x: 0, y: 2 },
        1,
        1,
        1,
        1,
        buttons,
        0.1,
        0.5
    );

    if (HISTORY_TOOL) {
        new HistoryPopup(scene, 1, true);
    }
}
