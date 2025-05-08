import { getQueryParams } from './getQueryParams';
const gameId = getQueryParams('rgsUrl') || 'wss://rtr.g-div.com';

export function getRgsUrl(): string {
    if (!gameId) {
        console.log('no rgsUrl');
        //getEventEmitter().emit("event-error-popup", ErrorMsgKeys.gameNotFound);
    }
    return gameId;
}
