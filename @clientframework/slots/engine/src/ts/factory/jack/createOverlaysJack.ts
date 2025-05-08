import BasePopup from '@clientframework/slots/engine/@clientframework/common/engine/src/ts/GameObjects/popups/basePopup';
import { slotDataPresenter } from '../../dataPresenter/instances';
import { createFreeSpinsIntro } from '@specific/factory/createFreeSpinsIntro';
import { COMPLEX_AUTO_SPIN, createCheckBox } from '@specific/config';
import { getLanguageTextGameMsg } from '@clientframework/common/backend-service/src/client-remote-data/src/multilanguage/gameMsgData';
import { GameMsgKeys } from '@clientframework/common/backend-service/src/client-remote-data/src/multilanguage/gameMsgKeys';
import { CURRENCY } from '@specific/dataConfig';
import GameButton from '@clientframework/slots/engine/@clientframework/common/engine/src/ts/GameObjects/gameButton';
import { getGameLanguage } from '@clientframework/common/backend-service/src/client-remote-data/src/launchParams/gameLanguage';
import { getFreeSpinsIntroOnReels } from '../../dataPresenter/defaultConfigSlot';

export function createOverlaysJack(scene: Phaser.Scene): void {
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
        const language = getGameLanguage();
        const languagesNeedSmallerText = ['ja', 'es', 'de'];
        const languagesNeedSlightlySmallerText = ['escl', 'pt', 'th'];

        let fontSize = 60;
        if (languagesNeedSlightlySmallerText.includes(language)) {
            fontSize = 55;
        } else if (languagesNeedSmallerText.includes(language)) {
            fontSize = 50;
        }
        buttons.push(
            createCheckBox(
                'spaceForSpin',
                null,
                scene,
                getLanguageTextGameMsg(GameMsgKeys.spaceForSpinJack),
                fontSize
            )
        );
    }

    if (!getFreeSpinsIntroOnReels()) {
        createFreeSpinsIntro(scene);
    }

    const betPopup = new BasePopup(
        'bet-popup',
        scene,
        0,
        -85,
        slotDataPresenter.betAndAutospin.betLevels,
        true,
        getLanguageTextGameMsg(GameMsgKeys.betJack),
        { x: 0.2, y: 1.3 },
        '',
        { x: 0.1, y: 4 },
        4,
        3,
        0.92,
        1.1,
        null,
        0,
        0,
        true
    );

    betPopup.setOnOffOnSameButton(true);

    const autoSpinText =
        getLanguageTextGameMsg(GameMsgKeys.autospinJack) +
        '\n' +
        getLanguageTextGameMsg(GameMsgKeys.numberOfSpinsJack);

    // const language = getGameLanguage();
    // const languagesNeedSlightlySmallerText = ['escl', 'tr'];
    // const languagesNeedSmallerText = [
    //     'bg',
    //     'cs',
    //     'el',
    //     'hu',
    //     'ja',
    //     'fi',
    //     'pl',
    //     'sk',
    //     'th',
    //     'vi',
    // ];
    // const languagesNeedMuchSmallerText = ['pt', 'ru'];
    // let fontSize = 100;
    // if (languagesNeedSlightlySmallerText.includes(language)) {
    //     fontSize = 90;
    // } else if (languagesNeedSmallerText.includes(language)) {
    //     fontSize = 77;
    // } else if (languagesNeedMuchSmallerText.includes(language)) {
    //     fontSize = 64;
    // }
    if (COMPLEX_AUTO_SPIN) {
        const spinsPopup = new BasePopup(
            'spins-popup',
            scene,
            0,
            0,
            slotDataPresenter.betAndAutospin.autoSpinLevels,
            false,
            autoSpinText,
            { x: 0, y: 0.9 }
        );
        spinsPopup.lockBackgroundRotation(0);
        spinsPopup.setOnOffOnSameButton(true);
    } else {
        const spinsPopup = new BasePopup(
            'spins-popup',
            scene,
            0,
            0,
            slotDataPresenter.betAndAutospin.autoSpinLevels,
            false,
            autoSpinText,
            { x: 0, y: 0.25 }, //autospin
            '',
            { x: 0, y: 0.25 },
            1,
            1,
            1,
            1,
            null,
            0.01,
            0.2
        );
        spinsPopup.changeBackground('autospinPanel', 1.2);
        spinsPopup.lockBackgroundRotation(0);
        spinsPopup.setOnOffOnSameButton(true);
    }

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
        { x: 0, y: 1.0 }
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

    //lossLimitPopup = new BasePopup("loss-limit-popup", scene, 0, 0, slotDataPresenter.betAndAutospin.lossLimitLevels, false, getLanguageTextGameMsg(GameMsgKeys.autospin) + "\n" + getLanguageTextGameMsg(GameMsgKeys.lossLimit) + ` (${CURRENCY})` 1.2);

    //buttons.push(createCheckBox("holdForAuto", null, this, getLanguageTextGameMsg(GameMsgKeys.holdForAutospin)));
    new BasePopup(
        'settings-popup',
        scene,
        0,
        0,
        [],
        false,
        getLanguageTextGameMsg(GameMsgKeys.optionsJack),
        { x: 0.5, y: 2 },
        '',
        { x: -0.07, y: 4 },
        2,
        1,
        1,
        1,
        buttons,
        0.1,
        0.5,
        false
    );
}
