import { getQueryParams } from './getQueryParams';
import { isDemo } from './token';
const hasRecovery_ = getQueryParams('hasRecovery');

export function hasRecovery(): boolean {
    if (isDemo() || !hasRecovery_ || hasRecovery_ === 'false') {
        return false;
    } else {
        return true;
    }
}
