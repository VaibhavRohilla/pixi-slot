import { hasHistory } from '@clientframework/common/backend-service/src/launchParams/hasHistory';
import { IHistoryPopupStyle } from '../game-objects/historyPopup';
import { GameMsgKeys } from '@clientframework/common/backend-service/src/client-remote-data/src/multilanguage/gameMsgKeys';
export interface IConfigReelOverlay {
    textureKey: string;
    smallTextureKey?: string;
}

let SYMBOL_ANIM_REVERSE_ORDER = false;
export function setSymbolsAnimReverseOrder(value: boolean): void {
    SYMBOL_ANIM_REVERSE_ORDER = value;
}

export function getSymbolsAnimReverseOrder(): boolean {
    return SYMBOL_ANIM_REVERSE_ORDER;
}

export const STATUSPANEL_TEXT_FIELD_MAX_LENGTH = 12;

let PRELOAD_ANIMATE_BACKLIGHT_INSTEAD_OF_LOGO = false;
export function setAnimateBacklightInsteadOfLogo(value: boolean): void {
    PRELOAD_ANIMATE_BACKLIGHT_INSTEAD_OF_LOGO = value;
}

export function getAnimateBacklightInsteadOfLogo(): boolean {
    return PRELOAD_ANIMATE_BACKLIGHT_INSTEAD_OF_LOGO;
}

const LOADING_BAR_Y_RATIO = { portrait: 11 / 12, landscape: 11 / 12 };
export function setLoadingBarYRatio(portrait: number, landscape: number): void {
    LOADING_BAR_Y_RATIO.portrait = portrait;
    LOADING_BAR_Y_RATIO.landscape = landscape;
}

export function getLoadingBarYRatio(portrait: boolean): number {
    if (portrait) {
        return LOADING_BAR_Y_RATIO.portrait;
    } else {
        return LOADING_BAR_Y_RATIO.landscape;
    }
}

let PRELOAD_START_BACKGROUND_ANIMATIONS = false;
export function setPreloadStartBackgroundAnimations(value: boolean): void {
    PRELOAD_START_BACKGROUND_ANIMATIONS = value;
}

export function getPreloadStartBackgroundAnimations(): boolean {
    return PRELOAD_START_BACKGROUND_ANIMATIONS;
}

// if false, the intro goes in the Overlays scene
let FREE_SPINS_INTRO_ON_REELS = false;
export function setFreeSpinsIntroOnReels(value: boolean): void {
    FREE_SPINS_INTRO_ON_REELS = value;
}

export function getFreeSpinsIntroOnReels(): boolean {
    return FREE_SPINS_INTRO_ON_REELS;
}

let MENU_BG_AS_BG = true;
export function setMenuBgAsBg(value: boolean): void {
    MENU_BG_AS_BG = value;
}

export function getMenuBgAsBg(): boolean {
    return MENU_BG_AS_BG;
}

let REELS_NUMBER = 5;
export function setReelsNumber(value: number): void {
    REELS_NUMBER = value;
}

export function getReelsNumber(): number {
    return REELS_NUMBER;
}

let reelOverlayConfig: IConfigReelOverlay = null;
export function setReelOverlayConfig(value: IConfigReelOverlay): void {
    reelOverlayConfig = value;
}
export function getReelOverlayConfig(): IConfigReelOverlay {
    return reelOverlayConfig;
}

let winLevelRequiredForBigWin = 15;
export function setWinLevelRequiredForBigWin(value: number): void {
    winLevelRequiredForBigWin = value;
}
export function getWinLevelRequiredForBigWin(): number {
    return winLevelRequiredForBigWin;
}

let winBacklightAnimRepeat = false;
export function setWinBacklightAnimRepeat(value: boolean): void {
    winBacklightAnimRepeat = value;
}
export function getWinBacklightAnimRepeat(): boolean {
    return winBacklightAnimRepeat;
}

let presentExpandingWinsInPostWin = false;
export function setPresentExpandingWinsInPostWin(value: boolean): void {
    presentExpandingWinsInPostWin = value;
}
export function getPresentExpandingWinsInPostWin(): boolean {
    return presentExpandingWinsInPostWin;
}

let reelBlackOverlayDuringExpandingWildAnimation = false;
export function setReelBlackOverlayDuringExpandingWildAnimation(
    value: boolean
): void {
    reelBlackOverlayDuringExpandingWildAnimation = value;
}
export function getReelBlackOverlayDuringExpandingWildAnimation(): boolean {
    return reelBlackOverlayDuringExpandingWildAnimation;
}

let animateSymbolsWinframeInFreeSpins = true;
export function setAnimateSymbolsWinframeInFreeSpins(value: boolean): void {
    animateSymbolsWinframeInFreeSpins = value;
}
export function getAnimateSymbolsWinframeInFreeSpins(): boolean {
    return animateSymbolsWinframeInFreeSpins;
}

export const HISTORY_TOOL = hasHistory();

let defaultReelExcludedSymbols = null;
export function setDefaultReelExcludedSymbols(value: number[][]): void {
    defaultReelExcludedSymbols = value;
}

export function getDefaultReelExcludedSymbols(): number[][] {
    return defaultReelExcludedSymbols;
}

let bonusReelExcludedSymbols = null;
export function setBonusReelExcludedSymbols(value: number[][]): void {
    bonusReelExcludedSymbols = value;
}

export function getBonusReelExcludedSymbols(): number[][] {
    return bonusReelExcludedSymbols;
}

let winPopupRelativeYParameters = {
    startRow: 2,
    endRow: -100,
    relativeFactorY: 1,
};
export function setWinPopupRelativeParameters(
    startRow: number,
    endRow: number,
    relativeFactorY: number
): void {
    winPopupRelativeYParameters = {
        startRow,
        endRow,
        relativeFactorY,
    };
}
export function getWinPopupRelativeParameters(): {
    startRow: number;
    endRow: number;
    relativeFactorY: number;
} {
    return winPopupRelativeYParameters;
}

let HistoryPopupStyle = null;
export function setHistoryPopupStyle(newStyle: IHistoryPopupStyle): void {
    HistoryPopupStyle = newStyle;
}

export function getHistoryPopupStyle(): IHistoryPopupStyle {
    return HistoryPopupStyle;
}

let hasIntroAfterLoadingScreen = false;
export function setHasIntroAfterLoadingScreen(value: boolean): void {
    hasIntroAfterLoadingScreen = value;
}
export function getHasIntroAfterLoadingScreen(): boolean {
    return hasIntroAfterLoadingScreen;
}

let historyFeaturesTriggeredKey = GameMsgKeys.historyTriggeredFreeSpins;
export function setHistoryFeaturesTriggeredKey(value: GameMsgKeys): void {
    historyFeaturesTriggeredKey = value;
}
export function getHistoryFeaturesTriggeredKey(): GameMsgKeys {
    return historyFeaturesTriggeredKey;
}

let historyFeaturesKey = GameMsgKeys.historyFreeSpins;
export function setHistoryFeaturesKey(value: GameMsgKeys): void {
    historyFeaturesKey = value;
}
export function getHistoryFeaturesKey(): GameMsgKeys {
    return historyFeaturesKey;
}

export let updateWinLinesScene = function (): void { };
export function setUpdateWinLinesScene(callback: () => void): void {
    updateWinLinesScene = callback;
}

export let preloadHasFadeInShadow = true;

export function setPreloadHasFadeInShadow(value: boolean): void {
    preloadHasFadeInShadow = value;
}

export function getPreloadHasFadeInShadow(): boolean {
    return preloadHasFadeInShadow;
}

export let displayEdgeSymbolsInReelSpin = false;
export function setDisplayEdgeSymbolsInReelSpin(value: boolean): void {
    displayEdgeSymbolsInReelSpin = value;
}
export function getDisplayEdgeSymbolsInReelSpin(): boolean {
    return displayEdgeSymbolsInReelSpin;
}


export let keyboardShortcutsEnabled = false;
export function setKeyboardShortcutsEnabled(value: boolean): void {
    keyboardShortcutsEnabled = value;
}
export function getKeyboardShortcutsEnabled(): boolean {
    return keyboardShortcutsEnabled;
}








let stopAutospinOnSpin = false;
export function setStopAutospinOnSpin(val: boolean): void {
    stopAutospinOnSpin = val;
}

export function getStopAutospinOnSpin(): boolean {
    return stopAutospinOnSpin;
}

let stopAnimateSymbolsOnIdleState = false;
export function setStopAnimateSymbolsOnIdleState(value: boolean): void {
    stopAnimateSymbolsOnIdleState = value;
}
export function getStopAnimateSymbolsOnIdleState(): boolean {
    return stopAnimateSymbolsOnIdleState;
}

let betPopupButtonsAdditionalOffsetY = 0;
export function setBetPopupButtonsAdditionalOffsetY(value: number): void {
    betPopupButtonsAdditionalOffsetY = value;
}
export function getBetPopupButtonsAdditionalOffsetY(): number {
    return betPopupButtonsAdditionalOffsetY;
}

const currencyTextRelativeOffset: { x: number; y: number } = {
    x: 0,
    y: 0,
};
export function setCurrencyTextRelativeOffset(
    xValue: number,
    yValue: number
): void {
    currencyTextRelativeOffset.x = xValue;
    currencyTextRelativeOffset.y = yValue;
}
export function getCurrencyTextRelativeOffset(): { x: number; y: number } {
    return currencyTextRelativeOffset;
}

let currencyRelativeScale = 1;

export function setCurrencyRelativeScale(val: number) {
    currencyRelativeScale = val;
}

export function getCurrencyRelativeScale(): number {
    return currencyRelativeScale;
}

let hasCurrencyText = false;

export function setHasCurrencyText(val: boolean) {
    hasCurrencyText = val;
}

export function getHasCurrencyText(): boolean {
    return hasCurrencyText;
}

let textPopupShouldRefade = false;

export function setTextPopupRefade(val: boolean) {
    textPopupShouldRefade = val;
}

export function getTextPopupRefade(): boolean {
    return textPopupShouldRefade;
}


let GAMBLE_TIMEOUT_DURATION = 2500;

export function setGambleTimeoutDuration(val: number) {
    GAMBLE_TIMEOUT_DURATION = val;
}

export function getGambleTimeoutDuration(): number {
    return GAMBLE_TIMEOUT_DURATION;
}

let reelStripSizeOffset = 1;

export function setReelStripSizeOffset(val: number) {
    reelStripSizeOffset = val;
}

export function getReelStripSizeOffset(): number {
    return reelStripSizeOffset;
}

let hasMorphedScreen = false;


export function setHasMorphedScreen(val: boolean): void {
    hasMorphedScreen = val;
}

export function getHasMorphedScreen(): boolean {
    return hasMorphedScreen;
}