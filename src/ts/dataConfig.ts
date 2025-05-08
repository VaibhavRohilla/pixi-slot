import { IBetAndAutospinDataPresenter } from '@clientframework/slots/engine/src/ts/dataPresenter/interfaces';
import { setGameName } from '@clientframework/slots/engine/@clientframework/common/engine/src/ts/defaultConfig';
import { getUrlCurrency } from '@clientframework/common/backend-service/src/launchParams/currency';
import { isTrueRgs } from '@clientframework/common/backend-service/src/launchParams/isTrueRgs';
import { hasCheatTool } from '@clientframework/common/backend-service/src/launchParams/hasCheatTool';

export const betLimitsConfig: Partial<IBetAndAutospinDataPresenter> = {
    betLevels: [
        0.20,
        0.50,
        1.00,
        2.00,
        4.00,
        5.00,
        7.00,
        10.00,
        15.00,
        20.00,
        30.00,
        50.00,
        75.00,
        100.00,
        // 150.00,
        // 200.00
    ],
    lossLimitLevels: [1, 5, 10, 50, 100, 500, 1000],
    singleWinLimitLevels: [1, 5, 100, 1000],
    autoSpinLevels: [10, 20, 40, 60, 100],
};

export const IS_OFFLINE = false;
export const IS_USING_TRUE_RGS = isTrueRgs();
export const CURRENCY = getUrlCurrency();
export const CHEAT_TOOL = hasCheatTool();

setGameName('8 Golden Dragons');
