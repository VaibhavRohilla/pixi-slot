import { getQueryParams } from './getQueryParams';

const urlDenomination = Number(getQueryParams('denomination'));

export function getUrlDenomination(): number {
    if (!urlDenomination) {
        return 1;
    } else {
        return 1 / urlDenomination;
    }
}
