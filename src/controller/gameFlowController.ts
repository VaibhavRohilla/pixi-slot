import { EventManager, GameEvent, IAutospinStartData, IAutospinStopConditions, IGambleChoice, IGambleResult } from "../core/utils/EventManager";
import { ISpinWinInfo } from "./winController"; // Assuming WinController exports this
import { IReelSpinOutcome } from "./reelController"; // Assuming ReelController exports this
import { IFreeSpinsAwardedData } from "../controller/FreeSpinsController"; // Import for payload type
import { GambleController } from '../controller/GambleController'; // Keep GambleController import only
import { availableBetLevels, defaultBetIndex, paylines as configuredPaylines } from '../slotcore/gameConfig'; // Import bet configs and paylines
import { HistoryController, ISlotHistoryRecord } from './HistoryController'; // Import HistoryController
import { IGameData, PaylineData } from '../interfaces/IGameData'; // Import IGameData and PaylineData
import { ServerCommunicationService, IInitResponse, ISpinResponse, ISpinRequest, ResponseStatus } from '../core/services/ServerCommunicationService';

// Interface for core game data usually received from backend or game-specific config
export interface ICoreGameData {
    symbols: string[]; // List of symbol names/keys, index implies symbolId
    paytable: number[][]; // Payouts: paytable[symbolId][matches-2 or matches-3] = payout multiplier/amount
    scatterPaytable?: number[][]; // Optional: specific scatter payouts
    paylines?: number[][]; // Optional: if paylines are also dynamic
    reelStrips?: number[][]; // Added reelStrips
}

// It's crucial to define these GameEvents in your core/utils/EventManager.ts
// GameEvent.REQUEST_SPIN
// GameEvent.ALL_REELS_SPINNING
// GameEvent.ALL_REELS_STOPPED_VISUALLY // When all TWEEN animations for reel stops are complete
// GameEvent.WIN_CALCULATION_COMPLETE // Emitted by WinController, payload: ISpinWinInfo
// GameEvent.START_WIN_PRESENTATION // When SlotScene starts showing win lines/animations
// GameEvent.WIN_PRESENTATION_COMPLETE // When SlotScene is done showing win lines/animations
// GameEvent.GAME_STATE_CHANGED // Emitted by this controller, payload: SlotGameState (new state)

export enum SlotGameState {
    INIT = 'INIT',
    CONNECTION = 'CONNECTION',
    CONNECTION_ERROR = 'CONNECTION_ERROR',
    IDLE = 'IDLE',
    SPIN_REQUESTED = 'SPIN_REQUESTED',
    REELS_ACCELERATING = 'REELS_ACCELERATING', // Reels have been told to spin
    REELS_SPINNING = 'REELS_SPINNING',     // Visual spinning is active
    REELS_STOPPING = 'REELS_STOPPING',     // stopReels has been initiated, final symbols determined
    ALL_REELS_STOPPED = 'ALL_REELS_STOPPED',// All visual reel stop tweens are complete
    WINS_CALCULATING = 'WINS_CALCULATING',
    WINS_CALCULATED = 'WINS_CALCULATED',
    WIN_PRESENTATION = 'WIN_PRESENTATION',
    ROUND_COMPLETE = 'ROUND_COMPLETE',      // After win presentation or no win, ready for idle

    // Free Spins States
    FREE_SPINS_INTRO = 'FREE_SPINS_INTRO',
    FREE_SPIN_IDLE = 'FREE_SPIN_IDLE',
    // FREE_SPIN_REQUESTED = 'FREE_SPIN_REQUESTED', // Can reuse SPIN_REQUESTED if logic adapts
    // FREE_SPIN_ACTIVE = 'FREE_SPIN_ACTIVE', // Covered by existing REELS_SPINNING, REELS_STOPPING etc.
    FREE_SPINS_OUTRO = 'FREE_SPINS_OUTRO',

    // Near Win State
    NEAR_WIN_ACTIVE = 'NEAR_WIN_ACTIVE',

    // Gamble State
    GAMBLE_ACTIVE = 'GAMBLE_ACTIVE'
}

export class GameFlowController {
    private static instance: GameFlowController;
    private currentState: SlotGameState;
    private eventManager: EventManager;
    private serverService: ServerCommunicationService;

    // Free Spins Tracking
    private isInFreeSpins: boolean = false;
    private totalFreeSpins: number = 0;
    private remainingFreeSpins: number = 0;
    private freeSpinsMultiplier: number = 1;

    // States for MainControlsPanel
    private _isAutospinning: boolean = false;
    private _currentAutospinCount: number = 0;
    private _isGambleAvailable: boolean = false;
    private _allowGambleSetting: boolean = true; // Assuming gamble is allowed by default
    private _isRecovery: boolean = false; // Assume not in recovery by default
    private _isTurboOn: boolean = false;
    private _isMenuActive: boolean = false;

    // Autospin advanced conditions
    private autospinStopConditions: IAutospinStopConditions | null = null;
    private autospinInitialBalance: number = 0; // To track balance changes for stop conditions
    private currentKnownBalance: number = 0; // To store latest balance from events

    // Bet Management
    private availableBets: number[] = availableBetLevels;
    private currentBetIndex: number = defaultBetIndex;
    public currentBetAmount: number = availableBetLevels[defaultBetIndex];

    private gambleController: GambleController; // Add GambleController instance
    private currentSpinWinInfo: ISpinWinInfo | null = null; // To store latest win info for gamble
    private historyController: HistoryController; // Add HistoryController instance
    private lastSpinOutcomeForHistory: IReelSpinOutcome | null = null; // To store outcome for history
    private gamblePlayedThisRound: boolean = false;
    private gambleWonThisRound?: boolean;
    private gambleInitialWinThisRound?: number;

    // Core Game Data (will be loaded from mock JSON)
    private _gameData: IGameData | null = null;
    // Keep individual properties synchronized with _gameData
    private _symbolsList: string[] = [];
    private _paytable: number[][] = [];
    private _scatterPaytable: number[][] = [];
    private _paylines: PaylineData[] = []; 
    private _reelStrips: string[][] = []; 
    private _wildSymbolId: number | undefined; // Added for Wild Symbol ID
    private _scatterSymbolId: number | undefined;
    private _minScattersForFreeSpins: number | undefined;
    private _freeSpinsAwardCount: number | undefined;
    private _freeSpinsAwardMultiplier: number | undefined;
    private _freeSpinsReelStrips: string[][] = []; // Added for Free Spins special reel strips

    private constructor() {
        this.currentState = SlotGameState.INIT;
        this.eventManager = EventManager.getInstance();
        this.serverService = ServerCommunicationService.getInstance();
        
        this.initEventHandlers();
        this.eventManager.on(GameEvent.SCENE_READY as any, () => {
            // Initialize server connection
            this.setState(SlotGameState.CONNECTION);
            this.serverService.init({
                useMockData: true, // Use mock data for development
                apiBaseUrl: '' // Will be set to the real API URL in production
            });
        });
        
        this.gambleController = GambleController.getInstance();
        this.historyController = HistoryController.getInstance();
        this.currentBetAmount = this.availableBets[this.currentBetIndex];
        console.log('GameFlowController Initialized');
    }

    public static getInstance(): GameFlowController {
        if (!GameFlowController.instance) {
            GameFlowController.instance = new GameFlowController();
        }
        return GameFlowController.instance;
    }

    private setState(newState: SlotGameState): void {
        if (this.currentState === newState) return;
        console.log(`GameFlow: State changing from ${this.currentState} to ${newState}`);
        const oldState = this.currentState;
        this.currentState = newState;
        this.eventManager.emit(GameEvent.GAME_STATE_CHANGED as any, {newState, oldState} );

        // Auto-transitions or actions based on entering a new state
        if (newState === SlotGameState.FREE_SPINS_INTRO) {
            // If autospin is active and configured to stop on free spins, stop it now.
            if (this._isAutospinning && this.autospinStopConditions?.stopOnFreeSpins) {
                console.log('GameFlow: Autospin stopping due to Free Spins trigger.');
                this.eventManager.emit(GameEvent.AUTOSPIN_ENDED as any);
            }
            // Simulate intro duration, then move to free spin idle
            setTimeout(() => {
                if (this.currentState === SlotGameState.FREE_SPINS_INTRO) { // Ensure still in this state
                    this.setState(SlotGameState.FREE_SPIN_IDLE);
                }
            }, 1000); // 1 second for intro, adjust as needed
        } else if (newState === SlotGameState.FREE_SPINS_OUTRO) {
            // Simulate outro duration, then end free spins
            setTimeout(() => {
                if (this.currentState === SlotGameState.FREE_SPINS_OUTRO) { // Ensure still in this state
                    this.eventManager.emit(GameEvent.FREE_SPINS_END as any);
                    this.isInFreeSpins = false;
                    // After outro, go to a general round complete before idle.
                    this.setState(SlotGameState.ROUND_COMPLETE);
                }
            }, 1000); // 1 second for outro, adjust as needed
        }
    }

    public getCurrentState(): SlotGameState {
        return this.currentState;
    }

    public canRequestSpin(): boolean {
        return (this.currentState === SlotGameState.IDLE || 
               this.currentState === SlotGameState.ROUND_COMPLETE ||
               this.currentState === SlotGameState.FREE_SPIN_IDLE);
    }

    public getIsInFreeSpins(): boolean {
        return this.isInFreeSpins;
    }

    public getRemainingFreeSpins(): number {
        return this.remainingFreeSpins;
    }

    public getTotalFreeSpins(): number {
        return this.totalFreeSpins;
    }

    public getFreeSpinsMultiplier(): number {
        return this.freeSpinsMultiplier;
    }

    // --- Placeholder Getters for MainControlsPanel ---
    public getIsAutospinning(): boolean {
        return this._isAutospinning;
    }

    public getCurrentAutospinCount(): number {
        return this._currentAutospinCount;
    }

    public getIsGambleAvailable(): boolean {
        // Gamble is available if the setting allows it AND the game is in a state where gamble can be offered.
        return this._allowGambleSetting && this._isGambleAvailable;
    }

    public getAllowGambleSetting(): boolean {
        return this._allowGambleSetting;
    }

    public getIsRecovery(): boolean {
        return this._isRecovery;
    }

    public getIsTurboOn(): boolean {
        return this._isTurboOn;
    }

    public getIsMenuActive(): boolean {
        return this._isMenuActive;
    }
    // --- End Placeholder Getters ---

    // --- Bet Management Methods ---
    public getCurrentBet(): number {
        return this.currentBetAmount;
    }

    public getAvailableBets(): number[] {
        return [...this.availableBets];
    }

    public canIncreaseBet(): boolean {
        return this.currentBetIndex < this.availableBets.length - 1;
    }

    public canDecreaseBet(): boolean {
        return this.currentBetIndex > 0;
    }

    public increaseBet(): boolean {
        if (this.canIncreaseBet()) {
            this.currentBetIndex++;
            this.currentBetAmount = this.availableBets[this.currentBetIndex];
            this.updateServerBet(this.currentBetAmount);
            return true;
        }
        return false;
    }

    public decreaseBet(): boolean {
        if (this.canDecreaseBet()) {
            this.currentBetIndex--;
            this.currentBetAmount = this.availableBets[this.currentBetIndex];
            this.updateServerBet(this.currentBetAmount);
            return true;
        }
        return false;
    }

    public setBetByIndex(index: number): boolean {
        if (index >= 0 && index < this.availableBets.length) {
            this.currentBetIndex = index;
            this.currentBetAmount = this.availableBets[this.currentBetIndex];
            this.updateServerBet(this.currentBetAmount);
            return true;
        }
        console.warn(`GameFlow: Invalid bet index ${index}`);
        return false;
    }

    public setBetByAmount(amount: number): boolean {
        const index = this.availableBets.indexOf(amount);
        if (index !== -1) {
            return this.setBetByIndex(index);
        }
        console.warn(`GameFlow: Invalid bet amount ${amount}`);
        return false;
    }
    
    private updateServerBet(betAmount: number): void {
        // Notify event listeners about bet change before server response
        this.eventManager.emit(GameEvent.BET_AMOUNT_CHANGED as any, betAmount);
        
        this.serverService.updateBet({ betAmount })
            .then(response => {
                if (response.status === ResponseStatus.SUCCESS) {
                    // Update balance if needed
                    if (response.balance !== undefined) {
                        this.currentKnownBalance = response.balance;
                        this.eventManager.emit(GameEvent.PLAYER_BALANCE_UPDATED as any, response.balance);
                    }
                    console.log(`GameFlow: Bet updated to ${response.betAmount} via server`);
                }
            })
            .catch(error => {
                console.error('GameFlow: Error updating bet:', error);
                // If the server bet update fails, don't change the bet and revert UI
                // This could be enhanced to retry or show an error message to the user
            });
    }
    // --- End Bet Management Methods ---

    // Load game data from server
    private async loadGameData(): Promise<void> {
        try {
            // Use the init method of ServerCommunicationService
            const initResponse = await this.serverService.initGame();
            
            if (initResponse.status === ResponseStatus.SUCCESS && initResponse.gameData) {
                console.log("Game data loaded successfully from server:", initResponse.gameData);
                
                // Update core game data
                const gameData: IGameData = {
                    symbols: initResponse.gameData.symbols,
                    reelStrips: initResponse.gameData.reelStrips,
                    paylines: initResponse.gameData.paylines,
                    paytable: initResponse.gameData.paytable,
                    scattersPaytable: initResponse.gameData.scattersPaytable,
                    wildSymbolId: initResponse.gameData.wildSymbolId,
                    scatterSymbolId: initResponse.gameData.scatterSymbolId,
                    minScattersForFreeSpins: initResponse.gameData.minScattersForFreeSpins,
                    freeSpinsAwardCount: initResponse.gameData.freeSpinsAwardCount,
                    freeSpinsAwardMultiplier: initResponse.gameData.freeSpinsAwardMultiplier
                };
                
                this.updateCoreGameData(gameData);
                
                // Store the free spins reel strips if available
                if (initResponse.gameData.freeSpinsReelStrips) {
                    this._freeSpinsReelStrips = initResponse.gameData.freeSpinsReelStrips;
                }
                
                // Update bet and balance info
                if (initResponse.playerData) {
                    this.availableBets = initResponse.playerData.availableBets || this.availableBets;
                    this.currentBetIndex = initResponse.playerData.defaultBetIndex !== undefined ? 
                        initResponse.playerData.defaultBetIndex : this.currentBetIndex;
                    this.currentBetAmount = this.availableBets[this.currentBetIndex];
                    this.eventManager.emit(GameEvent.BET_AMOUNT_CHANGED as any, this.currentBetAmount);
                    
                    if (initResponse.playerData.balance !== undefined) {
                        this.currentKnownBalance = initResponse.playerData.balance;
                        this.eventManager.emit(GameEvent.PLAYER_BALANCE_UPDATED as any, initResponse.playerData.balance);
                    }
                }
                
                this.setState(SlotGameState.IDLE);
                this.eventManager.emit(GameEvent.SERVER_INIT_COMPLETE as any);
            } else {
                throw new Error("Invalid or incomplete game data in server response");
            }
        } catch (error) {
            console.error("Error loading game data from server:", error);
            this.setState(SlotGameState.CONNECTION_ERROR);
            // Consider loading fallback data or showing an error message to the user
        }
    }

    // Getters for Core Game Data - Update types if needed
    public getSymbolsList(): readonly string[] { return this._symbolsList; }
    public getPaytable(): readonly number[][] { return this._paytable; }
    public getScatterPaytable(): readonly number[][] { return this._scatterPaytable; }
    public getPaylines(): readonly PaylineData[] { return this._paylines; } // Use PaylineData[]
    public getReelStrips(): readonly string[][] { return this._reelStrips; } // Use string[][]
    public getFreeSpinsReelStrips(): readonly string[][] { return this._freeSpinsReelStrips; } // Added getter
    public getSymbolName(symbolId: number): string {
        return this._symbolsList[symbolId] || `SYM_ID_${symbolId}`; // Fallback name
    }
    public getWildSymbolId(): number | undefined { return this._wildSymbolId; } // Added getter
    public getScatterSymbolId(): number | undefined { return this._scatterSymbolId; }
    public getMinScattersForFreeSpins(): number | undefined { return this._minScattersForFreeSpins; }
    public getFreeSpinsAwardCount(): number | undefined { return this._freeSpinsAwardCount; }
    public getFreeSpinsAwardMultiplier(): number | undefined { return this._freeSpinsAwardMultiplier; }

    // Update this method to accept IGameData and update internal state
    public updateCoreGameData(data: IGameData): void {
        this._gameData = data; // Store the raw loaded data if needed

        // Update individual properties (deep copy to prevent mutation issues)
        this._symbolsList = data.symbols ? [...data.symbols] : [];
        this._paytable = data.paytable ? data.paytable.map(p => [...p]) : [];
        this._scatterPaytable = data.scattersPaytable ? data.scattersPaytable.map(p => [...p]) : [];
        this._paylines = data.paylines ? data.paylines.map(p => [...p]) : []; 
        this._reelStrips = data.reelStrips ? data.reelStrips.map(s => [...s]) : []; 
        this._wildSymbolId = data.wildSymbolId; 
        this._scatterSymbolId = data.scatterSymbolId;
        this._minScattersForFreeSpins = data.minScattersForFreeSpins;
        this._freeSpinsAwardCount = data.freeSpinsAwardCount;
        this._freeSpinsAwardMultiplier = data.freeSpinsAwardMultiplier;

        console.log('GameFlowController: Core game data updated from loaded data.');

        // Create an explicitly typed payload object
        const payload: IGameData = {
            symbols: this._symbolsList,
            paytable: this._paytable,
            scattersPaytable: this._scatterPaytable, 
            paylines: this._paylines,
            reelStrips: this._reelStrips,
            wildSymbolId: this._wildSymbolId, 
            scatterSymbolId: this._scatterSymbolId,
            minScattersForFreeSpins: this._minScattersForFreeSpins,
            freeSpinsAwardCount: this._freeSpinsAwardCount,
            freeSpinsAwardMultiplier: this._freeSpinsAwardMultiplier
        };

        // Emit the typed payload object
        this.eventManager.emit(GameEvent.CORE_GAME_DATA_UPDATED as any, payload);
    }

    private initEventHandlers(): void {
        // Server connection events
        this.eventManager.on(GameEvent.SERVER_CONNECTED as any, () => {
            console.log('GameFlow: Server connected');
            this.loadGameData();
        });

        this.eventManager.on(GameEvent.SERVER_CONNECTION_ERROR as any, (error: any) => {
            console.error('GameFlow: Server connection error', error);
            this.setState(SlotGameState.CONNECTION_ERROR);
        });

        this.eventManager.on(GameEvent.PLAYER_BALANCE_UPDATED as any, (newBalance: number) => {
            this.currentKnownBalance = newBalance;
            console.log(`GameFlow: Balance updated to ${this.currentKnownBalance}`); // Log balance update
        });

        this.eventManager.on(GameEvent.FREE_SPINS_START as any, (data: IFreeSpinsAwardedData) => {
            console.log('GameFlow: FREE_SPINS_START event received', data);
            // If a near win was active, FREE_SPINS_START takes precedence
            this.isInFreeSpins = true;
            this.totalFreeSpins = data.totalSpins;
            this.remainingFreeSpins = data.currentSpins;
            this.freeSpinsMultiplier = data.multiplier;
            this.setState(SlotGameState.FREE_SPINS_INTRO);
        });

        // Near Win Event Handlers
        this.eventManager.on(GameEvent.NEAR_WIN_DETECTED as any, () => {
            if (this.currentState !== SlotGameState.FREE_SPINS_INTRO && 
                this.currentState !== SlotGameState.FREE_SPIN_IDLE && 
                this.currentState !== SlotGameState.FREE_SPINS_OUTRO && 
                !this.isInFreeSpins) { // Only activate near win if not in a free spins cycle
                console.log('GameFlow: NEAR_WIN_DETECTED event received');
                this.setState(SlotGameState.NEAR_WIN_ACTIVE);
            }
        });

        this.eventManager.on(GameEvent.NEAR_WIN_EFFECT_CONCLUDED as any, () => {
            if (this.currentState === SlotGameState.NEAR_WIN_ACTIVE) {
                console.log('GameFlow: NEAR_WIN_EFFECT_CONCLUDED event received');
                // The near win effect concluded. What happens next depends on whether all reels have stopped.
                // SlotScene's ALL_REELS_STOPPED_VISUALLY event will eventually move to WINS_CALCULATING.
                // For now, we can assume the normal flow will resume. If specific state is needed, adjust here.
                // If reels are still stopping, it might go back to REELS_STOPPING, or ALL_REELS_STOPPED.
                // This state transition might be better handled by the main game loop that leads to WINS_CALCULATING.
                // For now, let's assume the conclusion of near win effect doesn't force an immediate state change here,
                // but rather allows the existing reel stopping flow to proceed to ALL_REELS_STOPPED_VISUALLY.
                // If SlotScene.stopNearWinEffect is called because all reels stopped and FS not won, then
                // ALL_REELS_STOPPED_VISUALLY will be emitted by SlotScene, leading to WINS_CALCULATING.
            }
        });

        this.eventManager.on(GameEvent.REQUEST_SPIN as any, () => {
            if (this.canRequestSpin()) {
                if (this.isInFreeSpins) {
                    if (this.remainingFreeSpins > 0) {
                        this.remainingFreeSpins--;
                        console.log(`GameFlow: Free spin requested. Remaining: ${this.remainingFreeSpins}`);
                        this.requestSpinFromServer(true);
                    } else {
                        // This case should ideally be handled by transitioning to OUTRO sooner
                        console.warn("GameFlow: Spin requested during free spins, but no spins remaining.");
                        this.setState(SlotGameState.FREE_SPINS_OUTRO);
                    }
                } else {
                    this.requestSpinFromServer(false);
                }
            } else {
                console.warn(`GameFlow: Spin requested in invalid state: ${this.currentState}`);
            }
        });

        // Listen for when the first reel actually starts spinning (visual cue)
        this.eventManager.on(GameEvent.REEL_START_SPIN, () => {
            // Transition to REELS_SPINNING only if we are in a state that expects it.
            // This helps manage cases where multiple REEL_START_SPIN events might fire for each reel.
            if (this.currentState === SlotGameState.SPIN_REQUESTED || this.currentState === SlotGameState.REELS_ACCELERATING) {
                this.setState(SlotGameState.REELS_ACCELERATING); // Initial state when first reel spins
            }
        });
        
        // A new event that SlotScene should emit when all reels have started their visual spin tween
        this.eventManager.on(GameEvent.ALL_REELS_SPINNING as any, () => {
             if (this.currentState === SlotGameState.REELS_ACCELERATING) {
                this.setState(SlotGameState.REELS_SPINNING);
            }
        });

        // SlotScene should emit this after it has called stopAt on all visual reels
        // and has the IReelSpinOutcome from ReelController.
        this.eventManager.on(GameEvent.REELS_STOPPING_LOGIC_INITIATED as any, (outcome: IReelSpinOutcome) => {
            if (this.currentState === SlotGameState.REELS_SPINNING) {
                this.setState(SlotGameState.REELS_STOPPING);
                this.lastSpinOutcomeForHistory = outcome; // Store for history
                this.gamblePlayedThisRound = false; // Reset gamble tracking for new spin
            }
        });

        // SlotScene emits this when all visual reel stop tweens are complete (via Promise.all from stopAt)
        // This used to be SPIN_COMPLETE. We can repurpose SPIN_COMPLETE or use a new event.
        // Let's use a more descriptive one: ALL_REELS_STOPPED_VISUALLY
        this.eventManager.on(GameEvent.ALL_REELS_STOPPED_VISUALLY as any, () => {
            // If near win was active, it should have been concluded by SlotScene before this event if FS not won,
            // or by FREE_SPINS_START if FS was won.
            if (this.currentState === SlotGameState.REELS_STOPPING || this.currentState === SlotGameState.NEAR_WIN_ACTIVE) {
                this.setState(SlotGameState.ALL_REELS_STOPPED);
                this.setState(SlotGameState.WINS_CALCULATING);
            }
        });

        // WinController will emit this event after wins are calculated
        this.eventManager.on(GameEvent.WIN_CALCULATION_COMPLETE as any, (winInfo: ISpinWinInfo) => {
            if (this.currentState === SlotGameState.WINS_CALCULATING) {
                this.setState(SlotGameState.WINS_CALCULATED);
                this.currentSpinWinInfo = winInfo; // Store for potential gamble

                if (winInfo.awardedFreeSpins && !this.isInFreeSpins) {
                    // FREE_SPINS_START would have been emitted by SlotScene and handled already, changing state.
                    // So, if we reach here and awardedFreeSpins is true, it implies FREE_SPINS_START took over.
                } else if (winInfo.totalWinAmount > 0 && this._allowGambleSetting && !this._isAutospinning && !this.isInFreeSpins) {
                    this._isGambleAvailable = true;
                     this.eventManager.emit(GameEvent.GAME_STATE_CHANGED as any, {newState: this.currentState, oldState: this.currentState}); // Trigger UI update
                } else if (winInfo.totalWinAmount > 0) {
                    // SlotScene, upon seeing WINS_CALCULATED and totalWin > 0, will start presentation
                    this.setState(SlotGameState.WIN_PRESENTATION);
                } else {
                    this.setState(SlotGameState.ROUND_COMPLETE);
                }
            }
        });
        
        // SlotScene emits this when it begins the visual win presentation (showing lines, popups etc.)
        this.eventManager.on(GameEvent.START_WIN_PRESENTATION as any, () => {
            if (this.currentState === SlotGameState.WINS_CALCULATED) {
                this.setState(SlotGameState.WIN_PRESENTATION);
            }
        });

        // SlotScene emits this after all win animations/presentations are finished
        this.eventManager.on(GameEvent.WIN_PRESENTATION_COMPLETE as any, () => {
            if (this.currentState === SlotGameState.WIN_PRESENTATION) {
                this.setState(SlotGameState.ROUND_COMPLETE);
            }
        });

        // Modified to handle free spin looping or exiting AND AUTOSPIN
        this.eventManager.on(GameEvent.GAME_STATE_CHANGED as any, (data: {newState: SlotGameState, oldState: SlotGameState}) => {
            if (data.newState === SlotGameState.ROUND_COMPLETE) {
                if (this.isInFreeSpins && this.remainingFreeSpins > 0) {
                    // Auto-request next free spin
                    setTimeout(() => {
                        if (this.currentState === SlotGameState.ROUND_COMPLETE && this.isInFreeSpins && this.remainingFreeSpins > 0) {
                            this.setState(SlotGameState.FREE_SPIN_IDLE);
                            // If using AUTO mode for free spins, auto-trigger the next spin after a delay
                            setTimeout(() => {
                                if (this.currentState === SlotGameState.FREE_SPIN_IDLE) {
                                    this.eventManager.emit(GameEvent.REQUEST_SPIN as any);
                                }
                            }, 500); // Short delay before auto-spin
                        }
                    }, 500); // Short delay before going to IDLE state
                } else if (this.isInFreeSpins && this.remainingFreeSpins <= 0) {
                    // Enter free spins outro when no spins remain
                    this.setState(SlotGameState.FREE_SPINS_OUTRO);
                } else if (this._isAutospinning) {
                    // Handle autospin logic
                    let shouldStopAutospin = false;
                    
                    // Check stop conditions
                    if (this.autospinStopConditions) {
                        // Check if we should stop on current win
                        if (this.currentSpinWinInfo && this.currentSpinWinInfo.totalWinAmount > 0) {
                            if (this.autospinStopConditions.stopOnAnyWin) {
                                shouldStopAutospin = true;
                                console.log('GameFlow: Autospin stopping due to win.');
                            } else if (this.autospinStopConditions.stopIfWinExceeds && 
                                      this.currentSpinWinInfo.totalWinAmount >= this.autospinStopConditions.stopIfWinExceeds) {
                                shouldStopAutospin = true;
                                console.log(`GameFlow: Autospin stopping due to win exceeding ${this.autospinStopConditions.stopIfWinExceeds}.`);
                            }
                        }
                        
                        // Check balance change conditions
                        if (this.autospinInitialBalance > 0 && this.currentKnownBalance > 0) {
                            if (this.autospinStopConditions.stopIfBalanceIncreasesBy && 
                                this.currentKnownBalance >= this.autospinInitialBalance + this.autospinStopConditions.stopIfBalanceIncreasesBy) {
                                shouldStopAutospin = true;
                                console.log(`GameFlow: Autospin stopping due to balance increase by ${this.currentKnownBalance - this.autospinInitialBalance}.`);
                            } else if (this.autospinStopConditions.stopIfBalanceDecreasesBy && 
                                      this.autospinInitialBalance - this.currentKnownBalance >= this.autospinStopConditions.stopIfBalanceDecreasesBy) {
                                shouldStopAutospin = true;
                                console.log(`GameFlow: Autospin stopping due to balance decrease by ${this.autospinInitialBalance - this.currentKnownBalance}.`);
                            }
                        }
                    }
                    
                    // Decrement autospin count and check if we're done
                    this._currentAutospinCount--;
                    if (this._currentAutospinCount <= 0) {
                        shouldStopAutospin = true;
                        console.log('GameFlow: Autospin stopping due to completed count.');
                    }
                    
                    if (shouldStopAutospin) {
                        this._isAutospinning = false;
                        this._currentAutospinCount = 0;
                        this.eventManager.emit(GameEvent.AUTOSPIN_ENDED as any);
                        this.setState(SlotGameState.IDLE);
                    } else {
                        // Continue autospin with a delay
                        setTimeout(() => {
                            if (this.currentState === SlotGameState.ROUND_COMPLETE && this._isAutospinning) {
                                this.setState(SlotGameState.IDLE);
                                // Small delay before the next auto-spin to give player visual feedback
                                setTimeout(() => {
                                    if (this.currentState === SlotGameState.IDLE && this._isAutospinning) {
                                        this.eventManager.emit(GameEvent.REQUEST_SPIN as any);
                                    }
                                }, 500);
                            }
                        }, 500);
                    }
                } else {
                    // Normal transition to IDLE after a brief delay
                    setTimeout(() => {
                        if (this.currentState === SlotGameState.ROUND_COMPLETE) {
                            this.setState(SlotGameState.IDLE);
                        }
                    }, 500);
                }
            }
        });
        
        // Handle gamble-related events
        this.eventManager.on(GameEvent.REQUEST_GAMBLE as any, () => {
            if (this.currentState === SlotGameState.WINS_CALCULATED && this._isGambleAvailable) {
                this.setState(SlotGameState.GAMBLE_ACTIVE);
                this.gamblePlayedThisRound = true;
                this.gambleInitialWinThisRound = this.currentSpinWinInfo ? this.currentSpinWinInfo.totalWinAmount : 0;
                this.gambleController.startGamble(this.currentSpinWinInfo ? this.currentSpinWinInfo.totalWinAmount : 0);
            }
        });
        
        this.eventManager.on(GameEvent.GAMBLE_CHOICE_MADE as any, (choice: IGambleChoice) => {
            if (this.currentState === SlotGameState.GAMBLE_ACTIVE) {
                this.gambleController.makeChoice(choice);
            }
        });
        
        this.eventManager.on(GameEvent.GAMBLE_WON as any, (result: IGambleResult) => {
            this.gambleWonThisRound = true;
            
            if (!result.canGambleAgain) {
                this.gambleController.endGamble(false); // Automatically collect after max rounds or win cap
            }
        });
        
        this.eventManager.on(GameEvent.GAMBLE_LOST as any, (result: IGambleResult) => {
            this.gambleWonThisRound = false;
            // No action needed - the gamble controller will end the gamble automatically on loss
        });
        
        this.eventManager.on(GameEvent.GAMBLE_ENDED as any, (data: { finalWinAmount: number, collected: boolean }) => {
            if (this.currentState === SlotGameState.GAMBLE_ACTIVE) {
                this._isGambleAvailable = false;
                
                if (this.currentSpinWinInfo) {
                    // Update the current win info with the new amount from gamble
                    this.currentSpinWinInfo.totalWinAmount = data.finalWinAmount;
                }
                
                // Emit win amount update event for UI elements
                this.eventManager.emit(GameEvent.WIN_AMOUNT_UPDATED as any, data.finalWinAmount);
                
                // Add to history
                if (this.lastSpinOutcomeForHistory && this.gamblePlayedThisRound && this.gambleInitialWinThisRound !== undefined) {
                    this.historyController.addRecord({
                        betAmount: this.currentBetAmount,
                        finalSymbols: this.lastSpinOutcomeForHistory.finalSymbols,
                        winAmount: data.finalWinAmount,
                        gamblePlayed: true,
                        gambleWon: this.gambleWonThisRound,
                        gambleInitialWin: this.gambleInitialWinThisRound,
                        gambleFinalWin: data.finalWinAmount
                    });
                }
                
                // Transition back to wins presentation or directly to round complete
                if (data.finalWinAmount > 0) {
                    this.setState(SlotGameState.WIN_PRESENTATION);
                } else {
                    this.setState(SlotGameState.ROUND_COMPLETE);
                }
            }
        });
        
        // Handle autospin events
        this.eventManager.on(GameEvent.AUTOSPIN_STARTED as any, (data: IAutospinStartData) => {
            this._isAutospinning = true;
            this._currentAutospinCount = data.count;
            this.autospinStopConditions = data.stopConditions || null;
            this.autospinInitialBalance = this.currentKnownBalance;
            
            if (this.currentState === SlotGameState.IDLE || this.currentState === SlotGameState.ROUND_COMPLETE) {
                this.eventManager.emit(GameEvent.REQUEST_SPIN as any);
            }
        });
        
        this.eventManager.on(GameEvent.AUTOSPIN_ENDED as any, () => {
            this._isAutospinning = false;
            this._currentAutospinCount = 0;
            // No need to emit any additional events, the UI will update based on the state
        });
        
        // Handle settings changes
        this.eventManager.on(GameEvent.SETTINGS_TOGGLE_TURBO as any, (isOn: boolean) => {
            this._isTurboOn = isOn;
            console.log(`GameFlow: Turbo mode ${isOn ? 'enabled' : 'disabled'}`);
        });
        
        this.eventManager.on(GameEvent.SETTINGS_TOGGLE_GAMBLE_ALLOWED as any, (isAllowed: boolean) => {
            this._allowGambleSetting = isAllowed;
            console.log(`GameFlow: Gamble feature ${isAllowed ? 'enabled' : 'disabled'}`);
            
            // If we're currently in a state with gamble available, update immediately
            if (this.currentState === SlotGameState.WINS_CALCULATED) {
                this._isGambleAvailable = isAllowed && (this.currentSpinWinInfo?.totalWinAmount ?? 0) > 0;
                this.eventManager.emit(GameEvent.GAME_STATE_CHANGED as any, {newState: this.currentState, oldState: this.currentState});
            }
        });
        
        // Handle menu state
        this.eventManager.on(GameEvent.MENU_PANEL_OPENED as any, () => {
            this._isMenuActive = true;
        });
        
        this.eventManager.on(GameEvent.MENU_PANEL_CLOSED as any, () => {
            this._isMenuActive = false;
        });
        
        // Handle fast stop
        this.eventManager.on(GameEvent.REQUEST_STOP_SPIN as any, () => {
            if (this.currentState === SlotGameState.REELS_SPINNING) {
                this.eventManager.emit(GameEvent.INITIATE_FAST_STOP as any);
            }
        });
    }
    
    /**
     * Request a spin from the server
     */
    private requestSpinFromServer(freeSpin: boolean = false): void {
        // Set state to spin requested
        this.setState(SlotGameState.SPIN_REQUESTED);
        
        // Determine bet amount - free spins don't cost anything
        const spinCost = freeSpin ? 0 : this.currentBetAmount;
        
        // Create spin request object
        const spinRequest: ISpinRequest = {
            betAmount: spinCost,
            lines: this._paylines.length,
            freeSpin: freeSpin
        };
        
        // Make the server request
        this.serverService.requestSpin(spinRequest)
            .then((response: ISpinResponse) => {
                if (response.status === ResponseStatus.SUCCESS) {
                    // Update balance
                    if (response.balance !== undefined) {
                        this.currentKnownBalance = response.balance;
                        this.eventManager.emit(GameEvent.PLAYER_BALANCE_UPDATED as any, response.balance);
                    }
                    
                    // Process special features (e.g., free spins award)
                    if (response.outcome.specialFeatures?.freeSpins?.awarded) {
                        const freeSpinsData: IFreeSpinsAwardedData = {
                            totalSpins: response.outcome.specialFeatures.freeSpins.count,
                            currentSpins: response.outcome.specialFeatures.freeSpins.count,
                            multiplier: response.outcome.specialFeatures.freeSpins.multiplier
                        };
                        
                        this.eventManager.emit(GameEvent.FREE_SPINS_START as any, freeSpinsData);
                    }
                    
                    // Store outcome in history if it's a win
                    if (response.outcome.winAmount > 0 && this.lastSpinOutcomeForHistory && !this.gamblePlayedThisRound) {
                        this.historyController.addRecord({
                            betAmount: spinCost,
                            finalSymbols: this.lastSpinOutcomeForHistory.finalSymbols,
                            winAmount: response.outcome.winAmount,
                            freeSpinsAwarded: response.outcome.specialFeatures?.freeSpins?.awarded ? 
                                response.outcome.specialFeatures.freeSpins.count : 0,
                            freeSpinsPlayed: freeSpin ? 1 : 0,
                            gamblePlayed: false
                        });
                    }
                } else {
                    // Handle error response
                    console.error('GameFlow: Spin request error:', response.error);
                    // Revert to idle state
                    this.setState(SlotGameState.IDLE);
                }
            })
            .catch(error => {
                console.error('GameFlow: Error during spin request:', error);
                // Revert to idle state
                this.setState(SlotGameState.IDLE);
            });
    }
}