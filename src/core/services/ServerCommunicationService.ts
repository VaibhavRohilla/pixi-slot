import { EventManager, GameEvent } from '../utils/EventManager';

/**
 * Possible states of connection to the server
 */
export enum ConnectionState {
    DISCONNECTED = 'DISCONNECTED',
    CONNECTING = 'CONNECTING',
    CONNECTED = 'CONNECTED',
    ERROR = 'ERROR'
}

/**
 * Main request types
 */
export enum RequestType {
    INIT = 'INIT',
    SPIN = 'SPIN',
    GET_HISTORY = 'GET_HISTORY',
    UPDATE_BET = 'UPDATE_BET'
}

/**
 * Response status
 */
export enum ResponseStatus {
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR'
}

/**
 * Base response interface
 */
export interface IServerResponse {
    status: ResponseStatus;
    requestId: string;
    timestamp: number;
    error?: {
        code: string;
        message: string;
    };
}

/**
 * Service that handles all server communications
 */
export class ServerCommunicationService {
    private static instance: ServerCommunicationService;
    private eventManager: EventManager;
    private connectionState: ConnectionState = ConnectionState.DISCONNECTED;
    private apiBaseUrl: string = '';
    private useMockData: boolean = true; // Set to true for development
    private requestTimeout: number = 10000; // 10 seconds timeout
    private pendingRequests: Map<string, { 
        type: RequestType, 
        timestamp: number, 
        timeoutId: number 
    }> = new Map();

    private constructor() {
        this.eventManager = EventManager.getInstance();
        console.log('ServerCommunicationService initialized');
    }

    /**
     * Get singleton instance
     */
    public static getInstance(): ServerCommunicationService {
        if (!ServerCommunicationService.instance) {
            ServerCommunicationService.instance = new ServerCommunicationService();
        }
        return ServerCommunicationService.instance;
    }

    /**
     * Initialize the service with configuration
     */
    public init(config: { apiBaseUrl?: string; useMockData?: boolean; requestTimeout?: number }): void {
        this.apiBaseUrl = config.apiBaseUrl || '';
        this.useMockData = config.useMockData !== undefined ? config.useMockData : true;
        this.requestTimeout = config.requestTimeout || 10000;

        this.setConnectionState(ConnectionState.CONNECTING);
        
        if (this.useMockData) {
            // When using mock data, simulate a successful connection after a short delay
            setTimeout(() => {
                this.setConnectionState(ConnectionState.CONNECTED);
                this.eventManager.emit(GameEvent.SERVER_CONNECTED as any);
            }, 500);
        } else {
            // In a real implementation, we would check connection to the server here
            this.checkServerConnection()
                .then(() => {
                    this.setConnectionState(ConnectionState.CONNECTED);
                    this.eventManager.emit(GameEvent.SERVER_CONNECTED as any);
                })
                .catch(error => {
                    this.setConnectionState(ConnectionState.ERROR);
                    this.eventManager.emit(GameEvent.SERVER_CONNECTION_ERROR as any, error);
                });
        }
    }

    /**
     * Check if server is reachable
     */
    private async checkServerConnection(): Promise<void> {
        if (this.useMockData) {
            return Promise.resolve();
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/health`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Server health check failed: ${response.statusText}`);
            }

            return Promise.resolve();
        } catch (error) {
            console.error('Server connection check failed:', error);
            return Promise.reject(error);
        }
    }

    /**
     * Set connection state and emit events
     */
    private setConnectionState(state: ConnectionState): void {
        const oldState = this.connectionState;
        this.connectionState = state;
        
        if (oldState !== state) {
            console.log(`Server connection state changed: ${oldState} -> ${state}`);
            this.eventManager.emit(GameEvent.SERVER_CONNECTION_STATE_CHANGED as any, {
                oldState,
                newState: state
            });
        }
    }

    /**
     * Get current connection state
     */
    public getConnectionState(): ConnectionState {
        return this.connectionState;
    }

    /**
     * Generate a unique request ID
     */
    private generateRequestId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }

    /**
     * Setup timeout for a request
     */
    private setupRequestTimeout(requestId: string, type: RequestType): number {
        return window.setTimeout(() => {
            if (this.pendingRequests.has(requestId)) {
                this.pendingRequests.delete(requestId);
                const error = {
                    code: 'TIMEOUT',
                    message: `Request ${type} timed out after ${this.requestTimeout}ms`
                };
                this.eventManager.emit(GameEvent.SERVER_REQUEST_TIMEOUT as any, {
                    requestId,
                    type,
                    error
                });
            }
        }, this.requestTimeout);
    }

    /**
     * Execute a server request
     */
    private async executeRequest<T extends IServerResponse>(
        type: RequestType,
        endpoint: string,
        data?: any
    ): Promise<T> {
        if (this.connectionState !== ConnectionState.CONNECTED) {
            return Promise.reject(new Error(`Cannot execute request when connection state is ${this.connectionState}`));
        }

        const requestId = this.generateRequestId();
        const timestamp = Date.now();
        
        // Setup timeout
        const timeoutId = this.setupRequestTimeout(requestId, type);
        
        // Track the request
        this.pendingRequests.set(requestId, {
            type,
            timestamp,
            timeoutId
        });
        
        try {
            let response: T;
            
            if (this.useMockData) {
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));
                
                // Load mock data
                response = await this.loadMockData<T>(type, data);
                response.requestId = requestId;
                response.timestamp = Date.now();
            } else {
                // Real server request
                const fetchResponse = await fetch(`${this.apiBaseUrl}${endpoint}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ...data,
                        requestId
                    }),
                });

                if (!fetchResponse.ok) {
                    throw new Error(`Server responded with ${fetchResponse.status}: ${fetchResponse.statusText}`);
                }

                response = await fetchResponse.json();
            }
            
            // Clear the timeout and remove from pending
            window.clearTimeout(timeoutId);
            this.pendingRequests.delete(requestId);
            
            // Emit success event
            this.eventManager.emit(GameEvent.SERVER_RESPONSE_RECEIVED as any, {
                type,
                requestId,
                response
            });
            
            return response;
        } catch (error) {
            // Clear the timeout and remove from pending
            window.clearTimeout(timeoutId);
            this.pendingRequests.delete(requestId);
            
            console.error(`Error in ${type} request:`, error);
            
            // Emit error event
            this.eventManager.emit(GameEvent.SERVER_REQUEST_ERROR as any, {
                type,
                requestId,
                error
            });
            
            return Promise.reject(error);
        }
    }

    /**
     * Load mock data for development
     */
    private async loadMockData<T>(type: RequestType, requestData?: any): Promise<T> {
        try {
            let mockFile: string;
            
            switch (type) {
                case RequestType.INIT:
                    mockFile = '/static/mockData/init.json';
                    break;
                case RequestType.SPIN:
                    mockFile = requestData?.freeSpin 
                        ? '/static/mockData/freeSpin.json' 
                        : '/static/mockData/spin.json';
                    break;
                case RequestType.GET_HISTORY:
                    mockFile = '/static/mockData/history.json';
                    break;
                case RequestType.UPDATE_BET:
                    mockFile = '/static/mockData/updateBet.json';
                    break;
                default:
                    throw new Error(`Unknown request type: ${type}`);
            }
            
            const response = await fetch(mockFile);
            if (!response.ok) {
                throw new Error(`Failed to load mock data for ${type}: ${response.statusText}`);
            }
            
            const mockData = await response.json();
            return mockData as T;
        } catch (error) {
            console.error(`Error loading mock data for ${type}:`, error);
            
            // Return a basic error response
            return {
                status: ResponseStatus.ERROR,
                requestId: 'mock-error',
                timestamp: Date.now(),
                error: {
                    code: 'MOCK_DATA_ERROR',
                    message: `Failed to load mock data for ${type}`
                }
            } as unknown as T;
        }
    }

    /**
     * Initialize the game
     */
    public async initGame(): Promise<IInitResponse> {
        return this.executeRequest<IInitResponse>(RequestType.INIT, '/init');
    }

    /**
     * Request a spin
     */
    public async requestSpin(data: ISpinRequest): Promise<ISpinResponse> {
        return this.executeRequest<ISpinResponse>(RequestType.SPIN, '/spin', data);
    }

    /**
     * Request game history
     */
    public async requestHistory(): Promise<IHistoryResponse> {
        return this.executeRequest<IHistoryResponse>(RequestType.GET_HISTORY, '/history');
    }

    /**
     * Update bet amount
     */
    public async updateBet(data: IUpdateBetRequest): Promise<IUpdateBetResponse> {
        return this.executeRequest<IUpdateBetResponse>(RequestType.UPDATE_BET, '/updateBet', data);
    }
}

/**
 * Interface for init response
 */
export interface IInitResponse extends IServerResponse {
    gameData: {
        symbols: string[];
        reelStrips: string[][];
        paylines: number[][];
        paytable: number[][];
        scattersPaytable: number[][];
        wildSymbolId?: number;
        scatterSymbolId?: number;
        minScattersForFreeSpins?: number;
        freeSpinsAwardCount?: number;
        freeSpinsAwardMultiplier?: number;
        freeSpinsReelStrips?: string[][];
    };
    playerData: {
        balance: number;
        currency: string;
        availableBets: number[];
        defaultBetIndex: number;
    };
}

/**
 * Interface for spin request
 */
export interface ISpinRequest {
    betAmount: number;
    lines: number;
    freeSpin?: boolean;
}

/**
 * Interface for spin response
 */
export interface ISpinResponse extends IServerResponse {
    outcome: {
        initialSymbols?: number[][];
        finalSymbols: number[][];
        winAmount: number;
        winLines: {
            lineId: number;
            symbolId: number;
            count: number;
            positions: number[][];
            win: number;
        }[];
        specialFeatures?: {
            freeSpins?: {
                awarded: boolean;
                count: number;
                multiplier: number;
            };
            respin?: {
                awarded: boolean;
                count: number;
            };
            bonus?: {
                awarded: boolean;
                type: string;
            };
        };
    };
    balance: number;
}

/**
 * Interface for update bet request
 */
export interface IUpdateBetRequest {
    betAmount: number;
}

/**
 * Interface for update bet response
 */
export interface IUpdateBetResponse extends IServerResponse {
    betAmount: number;
    balance: number;
}

/**
 * Interface for history response
 */
export interface IHistoryResponse extends IServerResponse {
    history: {
        records: {
            id: string;
            timestamp: number;
            betAmount: number;
            finalSymbols: number[][];
            winAmount: number;
            freeSpinsAwarded?: number;
            freeSpinsPlayed?: number;
            gamblePlayed?: boolean;
            gambleWon?: boolean;
            gambleInitialWin?: number;
            gambleFinalWin?: number;
        }[];
        hasMore: boolean;
        totalRecords: number;
    };
} 