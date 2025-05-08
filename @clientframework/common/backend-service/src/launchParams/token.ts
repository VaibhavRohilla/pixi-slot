import { getQueryParams } from './getQueryParams';
const token = getQueryParams('token');

export function isDemo(): boolean {
    if (!token) {
        return true;
    } else {
        return false;
    }
}
