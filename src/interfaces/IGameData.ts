/**
 * Defines the structure for a single payline.
 * Each number represents the row index for the corresponding reel.
 * e.g., [0, 1, 2, 1, 0] means reel 0 uses symbol at row 0, reel 1 at row 1, etc.
 */
export type PaylineData = number[];

/**
 * Defines the core game data received from a server response (or mock).
 * This structure is based on the expected `inputSource.game` object
 * in the Phaser codebase.
 */
export interface IGameData {
    /**
     * List of symbol identifiers (names or IDs).
     * e.g., ["SYM1", "SYM2", "SCATTER", "WILD"]
     */
    symbols: string[];

    /**
     * The reel strips for the game. Each inner array is a reel,
     * and its elements are symbol identifiers from the `symbols` list.
     * e.g., [
     *   ["SYM1", "SYM2", "SYM3", "SYM1", "SYM4"], // Reel 1
     *   ["SYM2", "SYM5", "SCATTER", "SYM3", "SYM2"], // Reel 2
     *   // ... and so on for other reels
     * ]
     */
    reelStrips: string[][];

    /**
     * Defines the paylines for the game.
     * Each element is a PaylineData array.
     * e.g., [
     *   [1, 1, 1, 1, 1], // Middle line (assuming 3 rows, 0-indexed)
     *   [0, 0, 0, 0, 0], // Top line
     *   [2, 2, 2, 2, 2], // Bottom line
     * ]
     */
    paylines: PaylineData[];

    /**
     * The main paytable.
     * Structure: `paytable[symbolIndex][count - 1] = payout_multiplier`.
     * Assumes `symbolIndex` maps to the order in the `symbols` array.
     * `count` is the number of matching symbols (e.g., 3 of a kind, 4 of a kind).
     * Payout is typically a multiplier for the line bet.
     * e.g., paytable[0][2] = 50; (Symbol at index 0, 3 of a kind, pays 50x lineBet)
     * A value of 0 means no win for that combination.
     */
    paytable: number[][];

    /**
     * The paytable for scatter symbols.
     * Structure: `scattersPaytable[scatterSymbolIndex][count - 1] = total_bet_multiplier_or_freespins`.
     * `scatterSymbolIndex` maps to the scatter symbol's index in the `symbols` array
     * (or a dedicated scatter symbols list if applicable, for now assume main `symbols` list).
     * Payout is often a multiplier of the total bet or an award of free spins.
     * e.g., scattersPaytable[0][2] = 5; (Scatter symbol at index 0, 3 occurrences, pays 5x totalBet or awards 5 FS)
     */
    scattersPaytable: number[][];

    // Potentially other game-specific config data could go here in the future
    wildSymbolId?: number; // Optional: ID (index in symbols array) of the Wild symbol
    // Scatter and Free Spins configuration
    scatterSymbolId?: number;
    minScattersForFreeSpins?: number;
    freeSpinsAwardCount?: number;
    freeSpinsAwardMultiplier?: number;
    // e.g., freeSpinsTrigger?: { symbol: string; minCount: number; spinsAwarded: number[] };
    // e.g., wildSymbol?: string;
} 