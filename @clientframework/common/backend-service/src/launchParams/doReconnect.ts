import { getQueryParams } from './getQueryParams';
import { isDemo } from './token';
const doReconnect_ = getQueryParams('doReconnect');

export function doReconnect(): boolean {
    if (!doReconnect_ || doReconnect_ !== 'false') {
        return true;
    } else {
        return false;
    }
}
