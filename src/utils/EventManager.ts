export enum GameEvent {
  // Scene Events
  SCENE_LOADED = 'scene:loaded',
  SCENE_CHANGED = 'scene:changed',
  SCENE_PAUSED = 'scene:paused',
  SCENE_RESUMED = 'scene:resumed',

  // Asset Events
  ASSET_LOADED = 'asset:loaded',
  ASSET_LOAD_ERROR = 'asset:loadError',
  ASSET_LOAD_PROGRESS = 'asset:loadProgress',

  // Game State Events
  GAME_STARTED = 'gameStarted',
  GAME_PAUSED = 'gamePaused',
  GAME_RESUMED = 'gameResumed',
  GAME_OVER = 'game:over',

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
  LOADING_COMPLETE = 'loadingComplete',
  LOADING_ERROR = 'loadingError',
}

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
