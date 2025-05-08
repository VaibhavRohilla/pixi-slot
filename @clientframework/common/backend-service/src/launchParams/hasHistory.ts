//import { getQueryParams } from './getQueryParams';
import { hasRecovery } from './hasRecovery';
//import { isDemo } from './token';
//const hasHistory_ = getQueryParams('hasHistory');

export function hasHistory(): boolean {
    return hasRecovery();
    // if (isDemo() || !hasHistory_ || hasHistory_ === 'false') {
    //     return false;
    // } else {
    //     return true;
    // }
}
