import { getQueryParams } from './getQueryParams';
const cheatTool = getQueryParams('hasCheatTool');

export function hasCheatTool(): boolean {
    if (cheatTool === 'true') {
        return true;
    } else {
        return false;
    }
}
