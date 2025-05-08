import BasePopup from '@clientframework/slots/engine/@clientframework/common/engine/src/ts/GameObjects/popups/basePopup';
import { createFreeSpinsIntro } from '@specific/factory/createFreeSpinsIntro';
import { createCheckBox } from '@specific/config';
import { CURRENCY } from '@specific/dataConfig';
import { getLanguageTextGameMsg } from '@clientframework/common/backend-service/src/client-remote-data/src/multilanguage/gameMsgData';
import { GameMsgKeys } from '@clientframework/common/backend-service/src/client-remote-data/src/multilanguage/gameMsgKeys';
import BasePopupSpecific from '@specific/gameObjects/basePopupSpecific';
import { slotDataPresenter } from '@clientframework/slots/engine/src/ts/dataPresenter/instances';
import { getFreeSpinsIntroOnReels } from '../../dataPresenter/defaultConfigSlot';

export function createOverlaysFlamingHotJoker(scene: Phaser.Scene): any {
    const buttons = [];
    buttons.push(
        createCheckBox(
            'sound',
            null,
            scene,
            getLanguageTextGameMsg(GameMsgKeys.soundJack)
        )
    );
    buttons.push(
        createCheckBox(
            'music',
            null,
            scene,
            getLanguageTextGameMsg(GameMsgKeys.musicJack)
        )
    );
    buttons.push(
        createCheckBox(
            'leftHanded',
            null,
            scene,
            getLanguageTextGameMsg(GameMsgKeys.leftHandedJack)
        )
    );
    if (!navigator.userAgent.includes('Mobile')) {
        buttons.push(
            createCheckBox(
                'spaceForSpin',
                null,
                scene,
                getLanguageTextGameMsg(GameMsgKeys.spaceForSpinJack)
            )
        );
    }

    if (!getFreeSpinsIntroOnReels()) {
        createFreeSpinsIntro(scene);
    }

    const betPopup = new BasePopupSpecific(
        'bet-popup',
        scene,
        0,
        0,
        slotDataPresenter.betAndAutospin.betLevels,
        true,
        getLanguageTextGameMsg(GameMsgKeys.totalBet),
        { x: 1.75, y: 1 },
        getLanguageTextGameMsg(GameMsgKeys.autospinJoker).toUpperCase() +
        ' ' +
        getLanguageTextGameMsg(GameMsgKeys.totalBet),
        { x: 0.3, y: 1 },
        4,
        3,
        1,
        1,
        null,
        -0.03,
        -0.07
    );

    betPopup.setOnOffOnSameButton(true);

    const autoSpinText =
        getLanguageTextGameMsg(GameMsgKeys.autospinJoker).toUpperCase() +
        '\n' +
        getLanguageTextGameMsg(GameMsgKeys.numberOfSpinsJack);
    const spinsPopup = new BasePopupSpecific(
        'spins-popup',
        scene,
        0,
        0,
        slotDataPresenter.betAndAutospin.autoSpinLevels,
        false,
        autoSpinText,
        { x: 0.6, y: 1 },
        '',
        { x: 2, y: 1.2 },
        4,
        3,
        1,
        1,
        null,
        -0.03,
        -0.07
    );

    // spinsPopup.changeBackground('autospinPanel', 1.2);
    // spinsPopup.lockBackgroundRotation(0);
    //spinsPopup.setOnOffOnSameButton(true);

    const lostLimit = new BasePopup(
        'loss-limit-popup',
        scene,
        0,
        0,
        slotDataPresenter.betAndAutospin.lossLimitLevels,
        false,
        getLanguageTextGameMsg(GameMsgKeys.autospinJoker) +
        '\n' +
        getLanguageTextGameMsg(GameMsgKeys.lossLimit) +
        ` (${CURRENCY})`,
        { x: 0.4, y: 1 },
        '',
        { x: 1.2, y: 1.2 },
        4,
        3,
        1,
        1,
        null,
        -0.03,
        -0.07,
        true
    );

    const singleWinLimit = new BasePopup(
        'single-win-limit-popup',
        scene,
        0,
        0,
        slotDataPresenter.betAndAutospin.singleWinLimitLevels,
        false,
        getLanguageTextGameMsg(GameMsgKeys.autospinJoker) +
        '\n' +
        getLanguageTextGameMsg(GameMsgKeys.singleWinLimit) +
        ` (${CURRENCY})`,
        { x: 0.2, y: 1 },
        '',
        { x: 1.2, y: 1.2 },
        4,
        3,
        1,
        1,
        null,
        -0.03,
        -0.07,
        true
    );

    //lossLimitPopup = new BasePopup("loss-limit-popup", scene, 0, 0, slotDataPresenter.betAndAutospin.lossLimitLevels, false, getLanguageTextGameMsg(GameMsgKeys.autospinJoker) + "\n" + getLanguageTextGameMsg(GameMsgKeys.lossLimit) + ` (${CURRENCY})` 1.2);

    //buttons.push(createCheckBox("holdForAuto", null, this, getLanguageTextGameMsg(GameMsgKeys.holdForAutospin)));
    new BasePopup(
        'settings-popup',
        scene,
        0,
        0,
        [],
        false,
        getLanguageTextGameMsg(GameMsgKeys.optionsJack),
        { x: 0.6, y: 2 },
        '',
        { x: 0.05, y: 4 },
        2,
        1,
        1,
        1,
        buttons,
        0.1,
        0.5,
        true
    );

    return {
        betPopup,
        spinsPopup,
        singleWinLimit,
        lostLimit,
    };
}
