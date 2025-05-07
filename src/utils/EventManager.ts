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
  GAME_STARTED = 'game:started',
  GAME_PAUSED = 'game:paused',
  GAME_RESUMED = 'game:resumed',
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
  DEBUG_TOGGLE = 'debug:toggle',
  DEBUG_METRICS_UPDATE = 'debug:metricsUpdate',

  // Mobile Events
  ORIENTATION_CHANGED = 'mobile:orientationChanged',
  RESIZE = 'mobile:resize',
  FULLSCREEN_CHANGED = 'mobile:fullscreenChanged',
  TOUCH_START = 'mobile:touchStart',
  TOUCH_END = 'mobile:touchEnd',
  TOUCH_MOVE = 'mobile:touchMove',
  TOUCH_CANCEL = 'mobile:touchCancel',
}

export class EventManager {
  private static instance: EventManager;
  private eventHandlers: Map<string, Set<Function>> = new Map();

  private constructor() {}

  public static getInstance(): EventManager {
    if (!EventManager.instance) {
      EventManager.instance = new EventManager();
    }
    return EventManager.instance;
  }

  public emit(event: string, data?: any): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in event handler for ${event}:`, error);
        }
      });
    }
  }

  public on(event: string, handler: Function): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.add(handler);
    }
  }

  public off(event: string, handler: Function): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.eventHandlers.delete(event);
      }
    }
  }

  public destroy(): void {
    this.eventHandlers.clear();
    (EventManager as any).instance = null;
  }
}
