import { EventManager, GameEvent } from '../utils/EventManager';

/**
 * Interface for session statistics
 */
export interface ISessionStats {
    sessionStartTime: number;
    sessionDuration: number;
    spinCount: number;
    totalBet: number;
    totalWin: number;
    biggestWin: number;
    freeSpinsTriggered: number;
    gambleCount: number;
    gambleWins: number;
    gambleLosses: number;
    returnToPlayer: number;
    hitFrequency: number;
}

/**
 * Interface for statistics display/storage options
 */
export interface IStatisticsOptions {
    saveToLocalStorage?: boolean;
    localStorageKey?: string;
    trackAcrossSessions?: boolean;
    showInMenu?: boolean;
    clockFormat?: '12h' | '24h';
}

/**
 * Default options for statistics
 */
const DEFAULT_OPTIONS: IStatisticsOptions = {
    saveToLocalStorage: true,
    localStorageKey: 'slotgame_stats',
    trackAcrossSessions: true,
    showInMenu: true,
    clockFormat: '24h'
};

/**
 * Controller for tracking and displaying game statistics and metrics
 */
export class StatisticsController {
    private static instance: StatisticsController;
    private eventManager: EventManager;
    private options: IStatisticsOptions;
    
    private sessionStartTime: number = 0;
    private spinCount: number = 0;
    private spinWinCount: number = 0;
    private totalBet: number = 0;
    private totalWin: number = 0;
    private biggestWin: number = 0;
    private freeSpinsTriggered: number = 0;
    private gambleCount: number = 0;
    private gambleWins: number = 0;
    private gambleLosses: number = 0;
    
    // All-time stats
    private allTimeStats: {
        spinCount: number;
        totalBet: number;
        totalWin: number;
        biggestWin: number;
        freeSpinsTriggered: number;
        gambleWins: number;
        gambleLosses: number;
    };
    
    // Clock state
    private clockInterval: number | null = null;
    private currentTime: Date = new Date();
    
    private constructor(options?: Partial<IStatisticsOptions>) {
        this.options = { ...DEFAULT_OPTIONS, ...options };
        this.eventManager = EventManager.getInstance();
        
        // Initialize all-time stats
        this.allTimeStats = {
            spinCount: 0,
            totalBet: 0,
            totalWin: 0,
            biggestWin: 0,
            freeSpinsTriggered: 0,
            gambleWins: 0,
            gambleLosses: 0
        };
        
        this.loadStatsFromLocalStorage();
        this.initEventHandlers();
        this.startSession();
        this.startClock();
        
        console.log('StatisticsController Initialized');
    }
    
    /**
     * Get the singleton instance
     */
    public static getInstance(options?: Partial<IStatisticsOptions>): StatisticsController {
        if (!StatisticsController.instance) {
            StatisticsController.instance = new StatisticsController(options);
        } else if (options) {
            // Update options if provided to an existing instance
            StatisticsController.instance.options = { 
                ...StatisticsController.instance.options, 
                ...options 
            };
        }
        return StatisticsController.instance;
    }
    
    /**
     * Load statistics from localStorage if enabled
     */
    private loadStatsFromLocalStorage(): void {
        if (!this.options.saveToLocalStorage || !this.options.localStorageKey || !this.options.trackAcrossSessions) {
            return;
        }
        
        try {
            const savedStats = localStorage.getItem(this.options.localStorageKey);
            if (savedStats) {
                const parsedStats = JSON.parse(savedStats);
                this.allTimeStats = { ...this.allTimeStats, ...parsedStats };
                console.log('StatisticsController: Loaded stats from localStorage');
            }
        } catch (error) {
            console.error('StatisticsController: Error loading from localStorage:', error);
            // If loading fails, clear localStorage to prevent future errors
            if (this.options.localStorageKey) {
                localStorage.removeItem(this.options.localStorageKey);
            }
        }
    }
    
    /**
     * Save statistics to localStorage if enabled
     */
    private saveStatsToLocalStorage(): void {
        if (!this.options.saveToLocalStorage || !this.options.localStorageKey || !this.options.trackAcrossSessions) {
            return;
        }
        
        try {
            localStorage.setItem(this.options.localStorageKey, JSON.stringify(this.allTimeStats));
        } catch (error) {
            console.error('StatisticsController: Error saving to localStorage:', error);
        }
    }
    
    /**
     * Initialize event handlers for tracking game events
     */
    private initEventHandlers(): void {
        // Track spins
        this.eventManager.on(GameEvent.SPIN_REQUESTED as any, (betAmount: number) => {
            this.recordSpin(betAmount);
        });
        
        // Track wins
        this.eventManager.on(GameEvent.WIN_CALCULATION_COMPLETE as any, (winInfo: any) => {
            if (winInfo && winInfo.totalWinAmount > 0) {
                this.recordWin(winInfo.totalWinAmount);
            }
            
            // Track free spins awards
            if (winInfo && winInfo.awardedFreeSpins && winInfo.awardedFreeSpins.count > 0) {
                this.recordFreeSpinsTrigger(winInfo.awardedFreeSpins.count);
            }
        });
        
        // Track gamble
        this.eventManager.on(GameEvent.GAMBLE_CHOICE_MADE as any, () => {
            this.recordGamble();
        });
        
        this.eventManager.on(GameEvent.GAMBLE_WON as any, () => {
            this.recordGambleWin();
        });
        
        this.eventManager.on(GameEvent.GAMBLE_LOST as any, () => {
            this.recordGambleLoss();
        });
    }
    
    /**
     * Start a new session
     */
    private startSession(): void {
        this.sessionStartTime = Date.now();
        this.spinCount = 0;
        this.spinWinCount = 0;
        this.totalBet = 0;
        this.totalWin = 0;
        this.biggestWin = 0;
        this.freeSpinsTriggered = 0;
        this.gambleCount = 0;
        this.gambleWins = 0;
        this.gambleLosses = 0;
        
        console.log('StatisticsController: Session started at', new Date(this.sessionStartTime).toLocaleTimeString());
    }
    
    /**
     * Start the clock for time tracking
     */
    private startClock(): void {
        // Update time every second
        this.clockInterval = window.setInterval(() => {
            this.currentTime = new Date();
            this.eventManager.emit(GameEvent.TIME_UPDATED as any, this.formatTime(this.currentTime));
        }, 1000);
    }
    
    /**
     * Format the time according to user preferences
     */
    private formatTime(date: Date): string {
        if (this.options.clockFormat === '12h') {
            return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true });
        } else {
            return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
        }
    }
    
    /**
     * Record a spin with the given bet amount
     */
    public recordSpin(betAmount: number): void {
        this.spinCount++;
        this.totalBet += betAmount;
        
        if (this.options.trackAcrossSessions) {
            this.allTimeStats.spinCount++;
            this.allTimeStats.totalBet += betAmount;
            this.saveStatsToLocalStorage();
        }
        
        this.eventManager.emit(GameEvent.STATISTICS_UPDATED as any, this.getSessionStats());
    }
    
    /**
     * Record a win with the given amount
     */
    public recordWin(winAmount: number): void {
        if (winAmount <= 0) return;
        
        this.spinWinCount++;
        this.totalWin += winAmount;
        
        if (winAmount > this.biggestWin) {
            this.biggestWin = winAmount;
        }
        
        if (this.options.trackAcrossSessions) {
            this.allTimeStats.totalWin += winAmount;
            
            if (winAmount > this.allTimeStats.biggestWin) {
                this.allTimeStats.biggestWin = winAmount;
            }
            
            this.saveStatsToLocalStorage();
        }
        
        this.eventManager.emit(GameEvent.STATISTICS_UPDATED as any, this.getSessionStats());
    }
    
    /**
     * Record a free spins trigger
     */
    public recordFreeSpinsTrigger(count: number = 1): void {
        this.freeSpinsTriggered += count;
        
        if (this.options.trackAcrossSessions) {
            this.allTimeStats.freeSpinsTriggered += count;
            this.saveStatsToLocalStorage();
        }
        
        this.eventManager.emit(GameEvent.STATISTICS_UPDATED as any, this.getSessionStats());
    }
    
    /**
     * Record a gamble attempt
     */
    public recordGamble(): void {
        this.gambleCount++;
        
        this.eventManager.emit(GameEvent.STATISTICS_UPDATED as any, this.getSessionStats());
    }
    
    /**
     * Record a successful gamble
     */
    public recordGambleWin(): void {
        this.gambleWins++;
        
        if (this.options.trackAcrossSessions) {
            this.allTimeStats.gambleWins++;
            this.saveStatsToLocalStorage();
        }
        
        this.eventManager.emit(GameEvent.STATISTICS_UPDATED as any, this.getSessionStats());
    }
    
    /**
     * Record a failed gamble
     */
    public recordGambleLoss(): void {
        this.gambleLosses++;
        
        if (this.options.trackAcrossSessions) {
            this.allTimeStats.gambleLosses++;
            this.saveStatsToLocalStorage();
        }
        
        this.eventManager.emit(GameEvent.STATISTICS_UPDATED as any, this.getSessionStats());
    }
    
    /**
     * Get the current session duration in milliseconds
     */
    public getSessionDuration(): number {
        return Date.now() - this.sessionStartTime;
    }
    
    /**
     * Get the return to player percentage (RTP)
     */
    public getReturnToPlayer(): number {
        if (this.totalBet === 0) return 0;
        return (this.totalWin / this.totalBet) * 100;
    }
    
    /**
     * Get the hit frequency (percentage of spins that resulted in a win)
     */
    public getHitFrequency(): number {
        if (this.spinCount === 0) return 0;
        return (this.spinWinCount / this.spinCount) * 100;
    }
    
    /**
     * Get the current time formatted according to user preferences
     */
    public getCurrentTime(): string {
        return this.formatTime(this.currentTime);
    }
    
    /**
     * Get all session statistics
     */
    public getSessionStats(): ISessionStats {
        return {
            sessionStartTime: this.sessionStartTime,
            sessionDuration: this.getSessionDuration(),
            spinCount: this.spinCount,
            totalBet: this.totalBet,
            totalWin: this.totalWin,
            biggestWin: this.biggestWin,
            freeSpinsTriggered: this.freeSpinsTriggered,
            gambleCount: this.gambleCount,
            gambleWins: this.gambleWins,
            gambleLosses: this.gambleLosses,
            returnToPlayer: this.getReturnToPlayer(),
            hitFrequency: this.getHitFrequency()
        };
    }
    
    /**
     * Get all-time statistics
     */
    public getAllTimeStats(): any {
        return { ...this.allTimeStats };
    }
    
    /**
     * Reset session statistics
     */
    public resetSessionStats(): void {
        this.startSession();
        this.eventManager.emit(GameEvent.STATISTICS_UPDATED as any, this.getSessionStats());
    }
    
    /**
     * Reset all-time statistics
     */
    public resetAllTimeStats(): void {
        this.allTimeStats = {
            spinCount: 0,
            totalBet: 0,
            totalWin: 0,
            biggestWin: 0,
            freeSpinsTriggered: 0,
            gambleWins: 0,
            gambleLosses: 0
        };
        
        this.saveStatsToLocalStorage();
        this.eventManager.emit(GameEvent.STATISTICS_UPDATED as any, this.getSessionStats());
    }
    
    /**
     * Clean up resources when the controller is destroyed
     */
    public destroy(): void {
        if (this.clockInterval !== null) {
            window.clearInterval(this.clockInterval);
            this.clockInterval = null;
        }
    }
} 