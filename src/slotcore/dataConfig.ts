export interface IBetLimitsConfig {
    betLevels: number[];
    lossLimitLevels: number[];
    singleWinLimitLevels: number[];
    autoSpinLevels: number[];
}

export const betLimitsConfig: IBetLimitsConfig = {
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
    ],
    lossLimitLevels: [1, 5, 10, 50, 100, 500, 1000],
    singleWinLimitLevels: [1, 5, 100, 1000],
    autoSpinLevels: [10, 20, 40, 60, 100],
};

// These might need to be fetched or set differently in a PixiJS context
// For now, using placeholder values or direct ports
export const IS_OFFLINE = false; 
// const IS_USING_TRUE_RGS = isTrueRgs(); // Placeholder, original uses a function
// const CURRENCY = getUrlCurrency(); // Placeholder, original uses a function
// const CHEAT_TOOL = hasCheatTool(); // Placeholder, original uses a function

export const IS_USING_TRUE_RGS = false; // Placeholder
export const CURRENCY = 'USD'; // Placeholder
export const CHEAT_TOOL = false; // Placeholder


export const GAME_NAME = '8 Golden Dragons'; // Ported from setGameName('8 Golden Dragons'); 