import { getQueryParams } from '../launchParams/getQueryParams';
import { getGameId } from '../launchParams/gameId';
import { getRgsUrl } from '../launchParams/rgsUrl';

export function getConnectionUrl(
    isUsingTrueRGS: boolean,
    testServerUrl = 'ws://localhost:9090'
): string {
    let retVal = testServerUrl;

    if (isUsingTrueRGS) {
        const token = getQueryParams('token');
        const path = token ? 'rgs?token=' + token + '&' : 'demo';
        const gameId = getGameId();

        const rgsUrl = getRgsUrl();

        if (rgsUrl) {
            retVal = rgsUrl + '/' + path + '?gameId=' + gameId;
        } else if (
            process.env.NODE_ENV === 'production' &&
            process.env &&
            process.env.RGS_TYPE === 'production'
        ) {
            retVal =
                'wss://rgs.link.com/' +
                path +
                '?gameId=' +
                gameId;
        } else if (
            process.env.NODE_ENV === 'production' &&
            process.env &&
            process.env.RGS_TYPE === 'staging'
        ) {
            retVal =
                'wss://rgs-stg.link.net/' + path + '?gameId=' + gameId;
        } else {
            retVal =
                'wss://rgs-router-new.link.net/' +
                path +
                '?gameId=' +
                gameId;
        }
        console.log(retVal);
    }

    return retVal;
}
