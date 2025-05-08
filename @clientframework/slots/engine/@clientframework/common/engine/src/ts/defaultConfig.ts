import { hasRecovery } from '@clientframework/common/backend-service/src/launchParams/hasRecovery';

let gameName = '8 Golden Dragons';

export function setGameName(newName: string): void {
    gameName = newName;
}

export function getGameName(): string {
    return gameName;
}

let reelsSensitiveBackground = false;

export function setReelsSensitiveBackground(val: boolean): void {
    reelsSensitiveBackground = val;
}

export function getReelsSensitiveBackground(): boolean {
    return reelsSensitiveBackground;
}

export const HAS_RECOVERY: boolean = hasRecovery();
