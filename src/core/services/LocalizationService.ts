import { EventManager, GameEvent } from '../utils/EventManager';

/**
 * Language code type
 */
export type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'ru' | 'zh' | 'ja' | string;

/**
 * Interface for localization options
 */
export interface ILocalizationOptions {
    defaultLanguage: LanguageCode;
    availableLanguages: LanguageCode[];
    translationsPath?: string;
    detectBrowserLanguage?: boolean;
    fallbackLanguage?: LanguageCode;
    autoLoadTranslations?: boolean;
}

/**
 * Default options for localization
 */
const DEFAULT_OPTIONS: ILocalizationOptions = {
    defaultLanguage: 'en',
    availableLanguages: ['en'],
    translationsPath: '/static/localization',
    detectBrowserLanguage: true,
    fallbackLanguage: 'en',
    autoLoadTranslations: true
};

/**
 * Service for game localization and multilingual support
 */
export class LocalizationService {
    private static instance: LocalizationService;
    private eventManager: EventManager;
    private options: ILocalizationOptions;
    
    private currentLanguage: LanguageCode;
    private translations: Record<LanguageCode, Record<string, string>> = {};
    private isLoadingLanguage: boolean = false;
    
    private constructor(options?: Partial<ILocalizationOptions>) {
        this.options = { ...DEFAULT_OPTIONS, ...options };
        this.eventManager = EventManager.getInstance();
        this.currentLanguage = this.options.defaultLanguage;
        
        console.log('LocalizationService Initialized');
        
        // Detect browser language if enabled
        if (this.options.detectBrowserLanguage) {
            this.detectBrowserLanguage();
        }
        
        // Auto-load translations if enabled
        if (this.options.autoLoadTranslations) {
            this.loadLanguage(this.currentLanguage)
                .catch(error => {
                    console.error(`LocalizationService: Error loading default language ${this.currentLanguage}:`, error);
                    // If the default language fails to load, try loading the fallback
                    if (this.options.fallbackLanguage && this.options.fallbackLanguage !== this.currentLanguage) {
                        return this.loadLanguage(this.options.fallbackLanguage);
                    }
                    // If no fallback or fallback failed, create empty translations
                    this.translations[this.currentLanguage] = {};
                    return Promise.resolve();
                });
        }
    }
    
    /**
     * Get the singleton instance
     */
    public static getInstance(options?: Partial<ILocalizationOptions>): LocalizationService {
        if (!LocalizationService.instance) {
            LocalizationService.instance = new LocalizationService(options);
        } else if (options) {
            // Update options if provided to an existing instance
            LocalizationService.instance.options = { 
                ...LocalizationService.instance.options, 
                ...options 
            };
        }
        return LocalizationService.instance;
    }
    
    /**
     * Detect the browser language and set it as current if available
     */
    private detectBrowserLanguage(): void {
        // Get browser language (e.g., 'en-US', 'es', 'fr-FR')
        const browserLang = navigator.language || (navigator as any).userLanguage;
        
        // Extract the language code (e.g., 'en', 'es', 'fr')
        const langCode = browserLang.split('-')[0] as LanguageCode;
        
        // Check if the language is available in our options
        if (this.options.availableLanguages.includes(langCode)) {
            console.log(`LocalizationService: Detected browser language ${langCode}`);
            this.currentLanguage = langCode;
        } else {
            console.log(`LocalizationService: Browser language ${langCode} not available, using default ${this.options.defaultLanguage}`);
        }
    }
    
    /**
     * Load translations for a specific language
     */
    public async loadLanguage(language: LanguageCode): Promise<void> {
        if (this.isLoadingLanguage) {
            console.warn(`LocalizationService: Already loading a language, ignoring request for ${language}`);
            return Promise.resolve();
        }
        
        if (!this.options.availableLanguages.includes(language)) {
            console.warn(`LocalizationService: Language ${language} not available`);
            return Promise.reject(new Error(`Language ${language} not available`));
        }
        
        this.isLoadingLanguage = true;
        this.eventManager.emit(GameEvent.LOCALIZATION_LOADING as any, { language });
        
        try {
            // If we already have this language loaded, just set it as current
            if (this.translations[language]) {
                this.currentLanguage = language;
                this.isLoadingLanguage = false;
                this.eventManager.emit(GameEvent.LOCALIZATION_CHANGED as any, { language });
                return Promise.resolve();
            }
            
            // Load translations from file
            const response = await fetch(`${this.options.translationsPath}/${language}.json`);
            
            if (!response.ok) {
                throw new Error(`Failed to load language ${language}: ${response.statusText}`);
            }
            
            const translations = await response.json();
            
            // Store translations
            this.translations[language] = translations;
            
            // Set as current language
            this.currentLanguage = language;
            
            console.log(`LocalizationService: Loaded language ${language}`);
            this.eventManager.emit(GameEvent.LOCALIZATION_CHANGED as any, { language });
            
            return Promise.resolve();
        } catch (error) {
            console.error(`LocalizationService: Error loading language ${language}:`, error);
            this.eventManager.emit(GameEvent.LOCALIZATION_ERROR as any, { language, error });
            return Promise.reject(error);
        } finally {
            this.isLoadingLanguage = false;
            this.eventManager.emit(GameEvent.LOCALIZATION_LOADING_COMPLETE as any, { language });
        }
    }
    
    /**
     * Get a translated text by key
     */
    public getText(key: string, defaultText: string = ''): string {
        // Return the default text if we don't have translations for the current language
        if (!this.translations[this.currentLanguage]) {
            return defaultText;
        }
        
        // Return the translation if it exists
        if (this.translations[this.currentLanguage][key]) {
            return this.translations[this.currentLanguage][key];
        }
        
        // If not found in the current language, try the fallback
        if (this.options.fallbackLanguage && 
            this.translations[this.options.fallbackLanguage] && 
            this.translations[this.options.fallbackLanguage][key]) {
            return this.translations[this.options.fallbackLanguage][key];
        }
        
        // If still not found, return the default text
        return defaultText;
    }
    
    /**
     * Get all available languages
     */
    public getAvailableLanguages(): LanguageCode[] {
        return [...this.options.availableLanguages];
    }
    
    /**
     * Get the current language
     */
    public getCurrentLanguage(): LanguageCode {
        return this.currentLanguage;
    }
    
    /**
     * Check if a language is loaded
     */
    public isLanguageLoaded(language: LanguageCode): boolean {
        return !!this.translations[language];
    }
    
    /**
     * Format a string with parameters
     * Example: formatString("Hello {0}!", ["World"]) => "Hello World!"
     */
    public formatString(text: string, params: string[]): string {
        return text.replace(/{(\d+)}/g, (match, index) => {
            return params[index] !== undefined ? params[index] : match;
        });
    }
    
    /**
     * Get a translated and formatted text
     * Example: getTextFormatted("GREETING", "Hello {0}!", ["World"]) => "Hello World!"
     */
    public getTextFormatted(key: string, defaultText: string, params: string[]): string {
        const text = this.getText(key, defaultText);
        return this.formatString(text, params);
    }
} 