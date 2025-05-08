import { getQueryParams } from '@clientframework/common/backend-service/src/launchParams/getQueryParams';

export const basePopupStyleJack = {
    hasCloseButton: false,
    popupStyleClassic: false,
    closeButton: {
        enabled: getQueryParams('autospinLimits') === 'true',
        idleFrame: 'OFF',
        downFrame: 'OFF',
        overFrame: 'OFF',
        position: { x: 0, y: 1 },
    },
    hasBackground: true,
    style: {
        //-430, 0 Game settings  -800 Bet
        fontSize: '35px',
        fontFamily: 'fortunaForJack',
        align: 'center',
        color: '#fff',
        // stroke: '#000',
        // strokeThickness: 8,
    },
};
