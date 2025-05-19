export enum GameEvent {
  // Scene Events
  SCENE_LOADED = 'scene:loaded',
  SCENE_CHANGED = 'scene:changed',
  SCENE_PAUSED = 'scene:paused',
  SCENE_RESUMED = 'scene:resumed',
  SCENE_READY = 'scene:ready',

  // Asset Events
  ASSET_LOADED = 'asset:loaded',
  ASSET_LOAD_ERROR = 'asset:loadError',
  ASSET_LOAD_PROGRESS = 'asset:loadProgress',

  // Game State Events
  GAME_STARTED = 'GAME_STARTED',
  GAME_PAUSED = 'gamePaused',
  GAME_RESUMED = 'gameResumed',
  GAME_OVER = 'game:over',
  GAME_STATE_CHANGED = 'game:stateChanged',

  // Input Events
  KEY_DOWN = 'input:keydown',
  KEY_UP = 'input:keyup',
  POINTER_DOWN = 'input:pointerdown',
  POINTER_UP = 'input:pointerup',
  POINTER_MOVE = 'input:pointermove',
  SWIPE = 'input:swipe',
  DOUBLE_TAP = 'input:doubletap',

  // Sound Events
  SOUND_PLAY = 'sound:play',
  SOUND_STOP = 'sound:stop',
  SOUND_PAUSE = 'sound:pause',
  SOUND_RESUME = 'sound:resume',
  SOUND_VOLUME_CHANGED = 'sound:volumeChanged',
  MUSIC_TOGGLE = 'sound:musicToggle',
  SOUND_TOGGLE = 'sound:soundToggle',
  BUTTON_CLICK = 'sound:buttonClick',

  // UI Events
  UI_SHOW = 'ui:show',
  UI_HIDE = 'ui:hide',
  UI_CLICK = 'ui:click',
  UI_HOVER = 'ui:hover',

  // Debug Events
  DEBUG_TOGGLE = 'debugToggle',
  DEBUG_METRICS_UPDATE = 'debug:metricsUpdate',

  // Mobile Events
  ORIENTATION_CHANGED = 'mobile:orientationChanged',
  RESIZE = 'mobile:resize',
  FULLSCREEN_CHANGED = 'mobile:fullscreenChanged',
  TOUCH_START = 'mobile:touchStart',
  TOUCH_END = 'mobile:touchEnd',
  TOUCH_MOVE = 'mobile:touchMove',
  TOUCH_CANCEL = 'mobile:touchCancel',

  // Loading Events
  LOADING_COMPLETE = 'LOADING_COMPLETE',
  LOADING_ERROR = 'LOADING_ERROR',

  // Slot Game Events
  REEL_START_SPIN = 'REEL_START_SPIN',
  REEL_STOPPED = 'REEL_STOPPED',
  REEL_STOP_FAST = 'REEL_STOP_FAST',
  SPIN_COMPLETE = 'SPIN_COMPLETE',
  REQUEST_SPIN = 'game:requestSpin',
  SPIN_REQUESTED = 'game:spinRequested',
  ALL_REELS_SPINNING = 'game:allReelsSpinning',
  REELS_STOPPING_LOGIC_INITIATED = 'game:reelsStoppingLogicInitiated',
  ALL_REELS_STOPPED_VISUALLY = 'game:allReelsStoppedVisually',
  WIN_CALCULATION_COMPLETE = 'game:winCalculationComplete',
  START_WIN_PRESENTATION = 'game:startWinPresentation',
  WIN_PRESENTATION_COMPLETE = 'game:winPresentationComplete',
  SHOW_WIN = 'game:showWin',
  WIN_ANIMATION_COMPLETE = 'game:winAnimationComplete',
  FREE_SPINS_START = 'game:freeSpinsStart',
  FREE_SPINS_END = 'game:freeSpinsEnd',
  FREE_SPINS_MULTIPLIER_CHANGED = 'game:freeSpinsMultiplierChanged',
  FREE_SPINS_OUTRO_COMPLETE = 'game:freeSpinsOutroComplete',
  REELS_SWITCHED_TO_FREE_SPINS_MODE = 'game:reelsSwitchedToFreeSpinsMode',
  REELS_RESTORED_FROM_FREE_SPINS_MODE = 'game:reelsRestoredFromFreeSpinsMode',
  COUNTUP_START = 'game:countupStart',
  COUNTUP_STOP = 'game:countupStop',

  // Near Win Events
  NEAR_WIN_DETECTED = 'game:nearWinDetected',
  NEAR_WIN_EFFECT_CONCLUDED = 'game:nearWinEffectConcluded',
  NEAR_WIN_START = 'game:nearWinStart',
  NEAR_WIN_STOP = 'game:nearWinStop',

  // Bonus/Popup Events (can be used for Free Spins popups, etc.)
  BONUS_POPUP_SHOW = 'game:bonusPopupShow',
  BONUS_POPUP_HIDE = 'game:bonusPopupHide',

  // Mid Win Frame Events
  SHOW_MID_WIN_FRAMES = 'game:showMidWinFrames',
  HIDE_MID_WIN_FRAMES = 'game:hideMidWinFrames',

  // Layout Update Events
  REELS_LAYOUT_UPDATED = 'game:reelsLayoutUpdated', // Event to signal reel and overall layout changes

  // WinLine Events
  SHOW_SINGLE_WINLINE = 'game:showSingleWinLine',
  SHOW_MULTIPLE_WINLINES = 'game:showMultipleWinLines',
  HIDE_ALL_WINLINES = 'game:hideAllWinLines',

  // Data Update Events
  SLOT_DATA_UPDATED = 'game:slotDataUpdated', // For general slot data updates

  // Side Panel Events
  SIDE_PANEL_SHOW_WIN = 'ui:sidePanelShowWin',
  SIDE_PANEL_STOP_WIN = 'ui:sidePanelStopWin',

  // TextPopup Events (if it emits its own state changes)
  TEXTPOPUP_COUNTUP_START = 'ui:textPopupCountupStart',

  // Total Free Spins Win Popup Events
  TOTAL_FS_WIN_POPUP_CLOSING = 'ui:totalFsWinPopupClosing',

  // Free Spins Intro Sequence Events
  FREE_SPINS_INTRO_EFFECTS_DONE = 'game:freeSpinsIntroEffectsDone', // Intermediate step in intro
  FREE_SPINS_INTRO_COMPLETE = 'game:freeSpinsIntroComplete',     // Entire intro sequence finished

  // Generic PopupAnimation Events (to be used with a suffix like _${nameKey})
  SHOW_POPUP_ANIMATION = 'ui:showPopupAnimation',
  HIDE_POPUP_ANIMATION = 'ui:hidePopupAnimation',
  POPUP_ANIMATION_STARTED = 'ui:popupAnimationStarted',
  POPUP_ANIMATION_STOPPING = 'ui:popupAnimationStopping',
  POPUP_ANIMATION_FRAME_ANIM_COMPLETE = 'ui:popupAnimationFrameAnimComplete',
  POPUP_ANIMATION_STOPPED = 'ui:popupAnimationStopped',

  // Symbol Specific Events
  SYMBOL_DROP_ANIM_STARTED = 'symbol:dropAnimStarted',
  SYMBOL_DROP_ANIM_ENDED = 'symbol:dropAnimEnded',

  // Reel Specific Events
  REEL_SPIN_STARTED = 'reel:spinStarted',       // Payload: { reelId: number }
  // REEL_STOPPED is already defined for individual reel stop sound trigger
  // REEL_STOP_FAST is already defined for fast stop sound trigger
  REEL_SPIN_COMPLETED = 'reel:spinCompleted',     // Payload: { reelId: number, finalSymbols: number[] }

  // UI Button Event (base for specific button clicks)
  UI_BUTTON_CLICKED_BASE = 'ui:buttonClicked',

  // Player/Game Data Events
  PLAYER_BALANCE_UPDATED = 'data:playerBalanceUpdated',
  BET_AMOUNT_CHANGED = 'data:betAmountChanged',
  WIN_AMOUNT_UPDATED = 'data:winAmountUpdated',
  TIME_UPDATED = 'data:timeUpdated',

  // Autospin Events
  AUTOSPIN_STARTED = 'game:autospinStarted',
  AUTOSPIN_ENDED = 'game:autospinEnded',

  // Menu Panel Events
  MENU_PANEL_OPENED = 'ui:menuPanelOpened',
  MENU_PANEL_CLOSED = 'ui:menuPanelClosed',
  SHOW_MENU_COMMAND = 'ui:showMenuCommand',

  // Settings Events (New Section)
  SETTINGS_TOGGLE_TURBO = 'settings:toggleTurbo', // Payload: boolean (newState)
  SETTINGS_TOGGLE_GAMBLE_ALLOWED = 'settings:toggleGambleAllowed', // Payload: boolean (newState)

  // Command Events for UI actions
  REQUEST_STOP_SPIN = 'game:requestStopSpin',
  REQUEST_STOP_AUTOSPIN = 'game:requestStopAutospin',
  REQUEST_COLLECT = 'game:requestCollect',
  REQUEST_GAMBLE = 'game:requestGamble',
  REQUEST_BET_PANEL = 'ui:requestBetPanel',
  REQUEST_AUTOSPIN_PANEL = 'ui:requestAutospinPanel',
  REQUEST_INFO_PANEL = 'ui:requestInfoPanel',
  REQUEST_HISTORY_PANEL = 'ui:requestHistoryPanel',

  // Gamble Events (New Section)
  GAMBLE_UI_SHOW = 'ui:gambleUIShow',           // Payload: { gambleAmount: number, currentWin: number }
  GAMBLE_UI_HIDE = 'ui:gambleUIHide',
  GAMBLE_WON = 'game:gambleWon',                 // Payload: IGambleResult { isWin: true, newWinAmount: number, canGambleAgain?: boolean }
  GAMBLE_LOST = 'game:gambleLost',               // Payload: IGambleResult { isWin: false, newWinAmount: 0 }
  GAMBLE_ENDED = 'game:gambleEnded',             // Payload: { finalWinAmount: number, collected: boolean }
  GAMBLE_CHOICE_MADE = 'game:gambleChoiceMade',    // Payload: IGambleChoice { type: 'color', value: 'red' | 'black' }

  // Fast Stop Event
  INITIATE_FAST_STOP = 'game:initiateFastStop',

  // Mid-Win Effect Events
  MID_WIN_REEL_EFFECT_LOOPED = 'visual:midWinReelEffectLooped',

  // Core Game Data Update Event
  CORE_GAME_DATA_UPDATED = 'data:coreGameDataUpdated',

  // Server Communication Events
  SERVER_CONNECTED = 'server:connected',
  SERVER_CONNECTION_ERROR = 'server:connectionError',
  SERVER_CONNECTION_STATE_CHANGED = 'server:connectionStateChanged',
  SERVER_REQUEST_TIMEOUT = 'server:requestTimeout',
  SERVER_RESPONSE_RECEIVED = 'server:responseReceived',
  SERVER_REQUEST_ERROR = 'server:requestError',
  SERVER_INIT_COMPLETE = 'server:initComplete',

  // History Events
  HISTORY_LOADING = 'history:loading',
  HISTORY_LOADING_COMPLETE = 'history:loadingComplete',
  HISTORY_UPDATED = 'history:updated',
  HISTORY_LOAD_ERROR = 'history:loadError',
  HISTORY_RECORD_SELECTED = 'history:recordSelected',
  HISTORY_REPLAY_REQUESTED = 'history:replayRequested',
  HISTORY_REPLAY_STARTED = 'history:replayStarted',
  HISTORY_REPLAY_COMPLETED = 'history:replayCompleted',

  // Statistics Events
  STATISTICS_UPDATED = 'stats:updated',
  STATISTICS_RESET = 'stats:reset',
  STATISTICS_SESSION_STARTED = 'stats:sessionStarted',
  STATISTICS_SESSION_ENDED = 'stats:sessionEnded',
  STATISTICS_SHOW = 'stats:show',
  STATISTICS_HIDE = 'stats:hide',

  // Localization Events
  LOCALIZATION_LOADING = 'locale:loading',
  LOCALIZATION_LOADING_COMPLETE = 'locale:loadingComplete',
  LOCALIZATION_CHANGED = 'locale:changed',
  LOCALIZATION_ERROR = 'locale:error',
  LOCALIZATION_TEXT_UPDATED = 'locale:textUpdated'
}

// ---- Data Interfaces for Events ---->

export interface IAutospinStopConditions {
    stopOnAnyWin?: boolean;
    stopIfWinExceeds?: number | null;
    stopIfBalanceIncreasesBy?: number | null;
    stopIfBalanceDecreasesBy?: number | null;
    stopOnFreeSpins?: boolean;
}

export interface IAutospinStartData {
    count: number;
    stopConditions?: IAutospinStopConditions;
}

export interface IGambleChoice {
    type: 'color'; // For now, only color gamble
    value: 'red' | 'black';
}

export interface IGambleResult {
    isWin: boolean;
    newWinAmount: number;
    canGambleAgain?: boolean; // If multiple gamble rounds are allowed
    winningOutcome?: 'red' | 'black'; // The actual outcome of the gamble choice
}

// Potentially other event-specific data interfaces can go here

export class EventManager {
  private static instance: EventManager;
  private listeners: Map<string, Function[]> = new Map();

  private constructor() {}

  public static getInstance(): EventManager {
    if (!EventManager.instance) {
      EventManager.instance = new EventManager();
    }
    return EventManager.instance;
  }

  public on(event: GameEvent, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  public off(event: GameEvent, callback: Function): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  public emit(event: GameEvent, data?: any): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  public destroy(): void {
    this.listeners.clear();
    (EventManager as any).instance = null;
  }
}
