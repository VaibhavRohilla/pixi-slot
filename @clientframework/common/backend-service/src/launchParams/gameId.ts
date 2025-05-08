import { getQueryParams } from './getQueryParams';
import { ErrorMsgKeys } from '../client-remote-data/src/multilanguage/errorMsgKeys';
import { getEventEmitter } from '../eventEmitter';

const gameId = getQueryParams('gameId') || '2014';

export function getGameId(): string {
    if (!gameId) {
        console.log('no gameid');
        getEventEmitter().emit('event-error-popup', ErrorMsgKeys.gameNotFound);
    }
    return gameId;
}
