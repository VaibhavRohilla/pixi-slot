import { EventManager, GameEvent } from '../core/utils/EventManager';
import { ServerCommunicationService, IHistoryResponse, ResponseStatus } from '../core/services/ServerCommunicationService';

export interface ISlotHistoryRecord {
    id?: string;          // Optional server-side record ID
    timestamp: number;
    betAmount: number;
    // initialSymbols?: number[][]; // Optional, could be large
    finalSymbols: number[][];
    winAmount: number;
    freeSpinsAwarded?: number;
    freeSpinsPlayed?: number; // If tracking FS session within a main spin history
    gamblePlayed?: boolean;
    gambleWon?: boolean;
    gambleInitialWin?: number;
    gambleFinalWin?: number;
}

export interface IHistoryFilter {
    startDate?: Date;   // Filter by start date
    endDate?: Date;     // Filter by end date
    minWin?: number;    // Filter by minimum win amount
    maxWin?: number;    // Filter by maximum win amount
    onlyWins?: boolean; // Show only wins
}

export interface IHistoryOptions {
    maxLocalRecords?: number;
    saveToLocalStorage?: boolean;
    localStorageKey?: string;
    fetchFromServer?: boolean;
}

const DEFAULT_OPTIONS: IHistoryOptions = {
    maxLocalRecords: 20,
    saveToLocalStorage: true,
    localStorageKey: 'slotgame_history',
    fetchFromServer: true
};

export class HistoryController {
    private static instance: HistoryController;
    private eventManager: EventManager;
    private serverService: ServerCommunicationService;
    private options: IHistoryOptions;
    private records: ISlotHistoryRecord[] = [];
    private hasMoreServerRecords: boolean = false;
    private isLoadingHistory: boolean = false;
    private filters: IHistoryFilter = {};

    private constructor(options?: Partial<IHistoryOptions>) {
        this.options = { ...DEFAULT_OPTIONS, ...options };
        this.eventManager = EventManager.getInstance();
        this.serverService = ServerCommunicationService.getInstance();
        this.loadHistoryFromLocalStorage();
        console.log('HistoryController Initialized');
        
        // Listen for server initialization to fetch history
        this.eventManager.on(GameEvent.SERVER_INIT_COMPLETE as any, () => {
            if (this.options.fetchFromServer) {
                this.fetchHistoryFromServer();
            }
        });
    }

    public static getInstance(options?: Partial<IHistoryOptions>): HistoryController {
        if (!HistoryController.instance) {
            HistoryController.instance = new HistoryController(options);
        } else if (options) {
            // Update options if provided to an existing instance
            HistoryController.instance.options = { 
                ...HistoryController.instance.options, 
                ...options 
            };
        }
        return HistoryController.instance;
    }

    /**
     * Load history from localStorage if enabled
     */
    private loadHistoryFromLocalStorage(): void {
        if (!this.options.saveToLocalStorage || !this.options.localStorageKey) return;
        
        try {
            const savedHistory = localStorage.getItem(this.options.localStorageKey);
            if (savedHistory) {
                this.records = JSON.parse(savedHistory);
                console.log(`HistoryController: Loaded ${this.records.length} records from localStorage`);
            }
        } catch (error) {
            console.error('HistoryController: Error loading from localStorage:', error);
            // If loading fails, clear localStorage to prevent future errors
            if (this.options.localStorageKey) {
                localStorage.removeItem(this.options.localStorageKey);
            }
        }
    }

    /**
     * Save history to localStorage if enabled
     */
    private saveHistoryToLocalStorage(): void {
        if (!this.options.saveToLocalStorage || !this.options.localStorageKey) return;
        
        try {
            localStorage.setItem(this.options.localStorageKey, JSON.stringify(this.records));
        } catch (error) {
            console.error('HistoryController: Error saving to localStorage:', error);
        }
    }

    /**
     * Fetch history from server
     */
    public async fetchHistoryFromServer(): Promise<void> {
        if (this.isLoadingHistory) return;
        
        this.isLoadingHistory = true;
        this.eventManager.emit(GameEvent.HISTORY_LOADING as any);
        
        try {
            const response = await this.serverService.requestHistory();
            
            if (response.status === ResponseStatus.SUCCESS) {
                // Replace local records with server records
                this.records = response.history.records.map(record => ({
                    id: record.id,
                    timestamp: record.timestamp,
                    betAmount: record.betAmount,
                    finalSymbols: record.finalSymbols,
                    winAmount: record.winAmount,
                    freeSpinsAwarded: record.freeSpinsAwarded,
                    freeSpinsPlayed: record.freeSpinsPlayed,
                    gamblePlayed: record.gamblePlayed,
                    gambleWon: record.gambleWon,
                    gambleInitialWin: record.gambleInitialWin,
                    gambleFinalWin: record.gambleFinalWin
                }));
                
                this.hasMoreServerRecords = response.history.hasMore;
                this.saveHistoryToLocalStorage();
                
                this.eventManager.emit(GameEvent.HISTORY_UPDATED as any, {
                    records: this.getFilteredRecords(),
                    hasMore: this.hasMoreServerRecords
                });
            } else {
                console.error('HistoryController: Error fetching history:', response.error);
                this.eventManager.emit(GameEvent.HISTORY_LOAD_ERROR as any, response.error);
            }
        } catch (error) {
            console.error('HistoryController: Error fetching history:', error);
            this.eventManager.emit(GameEvent.HISTORY_LOAD_ERROR as any, error);
        } finally {
            this.isLoadingHistory = false;
            this.eventManager.emit(GameEvent.HISTORY_LOADING_COMPLETE as any);
        }
    }

    /**
     * Add a new record to history
     */
    public addRecord(recordData: Omit<ISlotHistoryRecord, 'timestamp'>): void {
        const newRecord: ISlotHistoryRecord = {
            ...recordData,
            timestamp: Date.now()
        };

        // Add to the beginning of the array
        this.records.unshift(newRecord);
        
        // Limit the number of records in memory
        if (this.options.maxLocalRecords && this.records.length > this.options.maxLocalRecords) {
            this.records = this.records.slice(0, this.options.maxLocalRecords);
        }
        
        // Save to localStorage if enabled
        this.saveHistoryToLocalStorage();
        
        console.log('HistoryController: Record added', newRecord);
        
        this.eventManager.emit(GameEvent.HISTORY_UPDATED as any, {
            records: this.getFilteredRecords(),
            hasMore: this.hasMoreServerRecords
        });
    }

    /**
     * Get all history records (optionally filtered)
     */
    public getHistoryRecords(): readonly ISlotHistoryRecord[] {
        return this.getFilteredRecords();
    }

    /**
     * Apply filters to records
     */
    private getFilteredRecords(): ISlotHistoryRecord[] {
        let filtered = [...this.records];
        
        if (this.filters.startDate) {
            filtered = filtered.filter(record => record.timestamp >= this.filters.startDate!.getTime());
        }
        
        if (this.filters.endDate) {
            filtered = filtered.filter(record => record.timestamp <= this.filters.endDate!.getTime());
        }
        
        if (this.filters.minWin !== undefined) {
            filtered = filtered.filter(record => record.winAmount >= this.filters.minWin!);
        }
        
        if (this.filters.maxWin !== undefined) {
            filtered = filtered.filter(record => record.winAmount <= this.filters.maxWin!);
        }
        
        if (this.filters.onlyWins) {
            filtered = filtered.filter(record => record.winAmount > 0);
        }
        
        return filtered;
    }
    
    /**
     * Set filters for records
     */
    public setFilters(filters: IHistoryFilter): void {
        this.filters = { ...filters };
        
        this.eventManager.emit(GameEvent.HISTORY_UPDATED as any, {
            records: this.getFilteredRecords(),
            hasMore: this.hasMoreServerRecords
        });
    }
    
    /**
     * Clear all filters
     */
    public clearFilters(): void {
        this.filters = {};
        
        this.eventManager.emit(GameEvent.HISTORY_UPDATED as any, {
            records: this.getFilteredRecords(),
            hasMore: this.hasMoreServerRecords
        });
    }

    /**
     * Clear history (local only, doesn't affect server)
     */
    public clearHistory(): void {
        this.records = [];
        this.saveHistoryToLocalStorage();
        console.log('HistoryController: History cleared');
        
        this.eventManager.emit(GameEvent.HISTORY_UPDATED as any, {
            records: [],
            hasMore: this.hasMoreServerRecords
        });
    }
    
    /**
     * Get a specific history record by ID or index
     */
    public getRecord(idOrIndex: string | number): ISlotHistoryRecord | null {
        if (typeof idOrIndex === 'string') {
            return this.records.find(record => record.id === idOrIndex) || null;
        } else if (typeof idOrIndex === 'number' && idOrIndex >= 0 && idOrIndex < this.records.length) {
            return this.records[idOrIndex];
        }
        return null;
    }
    
    /**
     * Check if history is currently loading
     */
    public isLoading(): boolean {
        return this.isLoadingHistory;
    }
    
    /**
     * Check if there are more records on the server that can be fetched
     */
    public hasMoreRecords(): boolean {
        return this.hasMoreServerRecords;
    }
    
    /**
     * Get the total number of records
     */
    public getRecordCount(): number {
        return this.records.length;
    }
    
    /**
     * Get the number of filtered records
     */
    public getFilteredRecordCount(): number {
        return this.getFilteredRecords().length;
    }
} 