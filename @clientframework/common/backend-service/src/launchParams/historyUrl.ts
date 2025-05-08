import { getEventEmitter, onEventEmitterSet } from '../eventEmitter';
import { getQueryParams } from './getQueryParams';
const historyUrl = getQueryParams('historyUrl');

export function hasHistoryUrl(): boolean {
    console.log(historyUrl);
    try {
        new URL(historyUrl);
        return true;
    } catch (err) {
        return false;
    }
}

function historyCommand(): void {
    window.open(historyUrl, '_blank');
}


onEventEmitterSet(() => {
    console.log('HISTORY EVENT');
    getEventEmitter().on('event-history-command', historyCommand, this);
}, this);
