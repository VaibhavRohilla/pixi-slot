  // Basic type definitions (can be expanded)
export interface IPointData {
    x: number;
    y: number;
}

export interface IReelConfig {
    nearWinProlongSymbol?: number;
    nearWinProlongSymbolCount?: number;
    // Add other reel-specific configurations here as needed
    // e.g., spinSpeed, bounceEasing, etc.
}

export interface IWinAnimationConfig {
    allLinesDuration?: number;
    lineByLineDuration?: number;
    // Add other win animation specific configs
}

// Ported configurations (simplified and adapted for PixiJS)
export const reelSymbolConfig: IPointData = { x: 280, y: 250 }; // from phaserCode config

export const sceneReelsConfig: IReelConfig = {
    nearWinProlongSymbol: 8,
    nearWinProlongSymbolCount: 2,
    // resizeReel function from phaserCode is highly Phaser-specific and needs a PixiJS equivalent.
    // This will be handled in the reel logic/controller that interacts with PixiJS components.
};

export const animationWinConfig: IWinAnimationConfig = {
    allLinesDuration: 3000,
    lineByLineDuration: 1000,
    // winTextForcedY and other Phaser-specific details need re-evaluation for PixiJS.
};

// Symbol related configs
export const SYMBOLS_NUMBER = 9; // Current SlotScene.ts uses 0-8 (9 symbols)
export const SYMBOLS_FPS = 30; // Default from phaserCode, can be adjusted

// General game settings from phaserCode config
export const SHOW_LOGO = true;
export const THREE_SECOND_RULE = false; // Default, was read from query params
export const COMPLEX_AUTO_SPIN = false; // Default, was read from query params

// Configurations for win lines, border lights, particles, side panels, etc.,
// from phaserCode/ts/config.ts are highly tied to Phaser's structure.
// These will need significant adaptation or reimplementation if their visual/functional aspects are desired.
// For now, we are focusing on core reel and win logic.

export const paylines: number[][] = [
    [1, 1, 1, 1, 1], // Middle line (0-indexed row for a 3-row setup)
    [0, 0, 0, 0, 0], // Top line
    [2, 2, 2, 2, 2], // Bottom line
    [0, 1, 2, 1, 0], // V shape
    [2, 1, 0, 1, 2]  // Inverted V shape
];

// Bet levels from Phaser's dataConfig.ts
export const availableBetLevels: number[] = [ 
    0.20, 0.50, 1.00, 2.00, 4.00, 5.00, 7.00, 
    10.00, 15.00, 20.00, 30.00, 50.00, 75.00, 100.00 
];
export const defaultBetIndex: number = 2; // Default to 1.00 (index 2)

// Autospin related options from Phaser's dataConfig.ts
export const autospinCounts: number[] = [10, 20, 40, 60, 100];
// For stop conditions, prepend 0 for "OFF"
export const autospinLossLimitOptions: number[] = [0, 1, 5, 10, 50, 100, 500, 1000];
export const autospinSingleWinLimitOptions: number[] = [0, 1, 5, 100, 1000];
// We can use lossLimitOptions for balanceIncreaseLimitOptions too, or define separately.
export const autospinBalanceIncreaseLimitOptions: number[] = [0, 1, 5, 10, 50, 100, 500, 1000];

// Game Name
export const GAME_NAME = '8 Golden Dragons';

// Currency - this should ideally be dynamic
export const DEFAULT_CURRENCY_SYMBOL = '$'; // Can be overridden by launch params

// Gamble feature configuration
export const gambleMaxRounds = 5; // Maximum number of gamble rounds allowed per win
export const gambleMaxWinMultiplier = 32; // Maximum win is 32x the initial gamble stake

console.log('Game Config Loaded with Paylines and Bet Levels'); 