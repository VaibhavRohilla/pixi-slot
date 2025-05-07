import { EventManager, GameEvent } from './EventManager';

export interface GameConfig {
  debug: boolean;
  sound: {
    enabled: boolean;
    volume: number;
    musicVolume: number;
    effectsVolume: number;
  };
  graphics: {
    quality: 'low' | 'medium' | 'high';
    antialias: boolean;
    resolution: number;
  };
  gameplay: {
    difficulty: 'easy' | 'normal' | 'hard';
    language: string;
    autosave: boolean;
  };
  features: {
    particles: boolean;
    shadows: boolean;
    postProcessing: boolean;
  };
}

const DEFAULT_CONFIG: GameConfig = {
  debug: false,
  sound: {
    enabled: true,
    volume: 1.0,
    musicVolume: 0.7,
    effectsVolume: 1.0,
  },
  graphics: {
    quality: 'medium',
    antialias: true,
    resolution: window.devicePixelRatio || 1,
  },
  gameplay: {
    difficulty: 'normal',
    language: 'en',
    autosave: true,
  },
  features: {
    particles: true,
    shadows: true,
    postProcessing: false,
  },
};

export class ConfigManager {
  private static instance: ConfigManager;
  private config: GameConfig = DEFAULT_CONFIG;
  private eventManager: EventManager;

  private constructor() {
    this.eventManager = EventManager.getInstance();
    this.loadConfig();
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  private loadConfig(): void {
    try {
      const savedConfig = localStorage.getItem('gameConfig');
      if (savedConfig) {
        this.config = { ...DEFAULT_CONFIG, ...JSON.parse(savedConfig) };
      }
    } catch (error) {
      console.error('Failed to load config:', error);
      this.config = DEFAULT_CONFIG;
    }
  }

  private saveConfig(): void {
    try {
      localStorage.setItem('gameConfig', JSON.stringify(this.config));
    } catch (error) {
      console.error('Failed to save config:', error);
    }
  }

  public updateConfig(updates: Partial<GameConfig>): void {
    this.config = { ...this.config, ...updates };
    this.saveConfig();
    this.eventManager.emit(GameEvent.DEBUG_METRICS_UPDATE, this.config);
  }

  public resetConfig(): void {
    this.config = DEFAULT_CONFIG;
    this.saveConfig();
    this.eventManager.emit(GameEvent.DEBUG_METRICS_UPDATE, this.config);
  }

  public isFeatureEnabled(feature: keyof GameConfig['features']): boolean {
    return this.config.features[feature];
  }

  public enableFeature(feature: keyof GameConfig['features']): void {
    this.config.features[feature] = true;
    this.saveConfig();
    this.eventManager.emit(GameEvent.DEBUG_TOGGLE, { feature, enabled: true });
  }

  public disableFeature(feature: keyof GameConfig['features']): void {
    this.config.features[feature] = false;
    this.saveConfig();
    this.eventManager.emit(GameEvent.DEBUG_TOGGLE, { feature, enabled: false });
  }

  public getConfig(): GameConfig {
    return { ...this.config };
  }

  public destroy(): void {
    this.saveConfig();
    (ConfigManager as any).instance = null;
  }
}
