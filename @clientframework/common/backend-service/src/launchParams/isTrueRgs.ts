import { getQueryParams } from './getQueryParams';
const trueRgs = getQueryParams('isTrueRgs');

export function isTrueRgs(): boolean {
    if (trueRgs === 'false') {
        return false;
    } else {
        return true;
    }
}
