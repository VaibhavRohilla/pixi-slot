import { getQueryParams } from './getQueryParams';

let noAutospin = getQueryParams('noAutospin');

export function getNoAutospin(): boolean {
    if (!noAutospin) {
        return false;
    } else {
        return (noAutospin == 'true')
    }
}
