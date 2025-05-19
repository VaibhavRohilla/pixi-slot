import { EventManager, GameEvent } from '../core/utils/EventManager';
import { Globals } from '../core/Global';

// Assuming sound keys in Globals.soundResources match these or are mapped appropriately
const SOUND_KEYS = {
    MUSIC: 'audio-music', // Assuming you have a general music track
    REEL_SPIN: 'audio-reelrotation1', // Existing key from SlotScene
    REEL_STOP_BASE: 'audio-reelstop', // Existing key pattern from SlotScene (e.g., audio-reelstop1)
    REEL_STOP_FAST: 'audio-reelstopfast', // From Phaser code
    PROLONG: 'audio-prolong', // From Phaser code for near-win tension
    BUTTON_CLICK: 'audio-button-click', // Generic button click
    COUNT_UP_LOOP: 'audio-countuploop', // For win amount counting animation
    COUNT_UP_STOP: 'audio-countupstop', // When win amount counting stops
    WIN_SMALL: 'audio-win', // Existing, can be for regular small wins
    WIN_MEDIUM: 'audio-win-medium', // For medium wins (Phaser's 'winHigher' might map here or be separate)
    WIN_LARGE: 'audio-win-large', // For large wins
    WIN_JACKPOT: 'audio-jackpotwin', // For jackpot wins
    COIN_LINE_WIN: 'audio-coinlinewin', // Sound for line wins (coins)
    COIN_MID_WIN: 'audio-coinmidwin', // Sound for mid-tier big wins (coins)
    COIN_BIG_WIN: 'audio-coinbigwin', // Sound for big wins (coins)
    COIN_MEGA_WIN: 'audio-coinmegawin', // Sound for mega wins (coins)
    FREE_SPINS_WIN_EFFECT: 'audio-freespinswineffect', // Sound accompanying free spins win popup/effect (Phaser's 'freeSpins')
    FREE_SPINS_END_EFFECT: 'audio-freespinsendeffect', // Sound for end of free spins sequence (Phaser's 'endFS')
    // Phaser's 'winHigher' could be WIN_MEDIUM or a new key if distinct enough.
    // Phaser's 'flamingBorder' is related to an effect, sound 'event-reels-border-started' - map if effect exists
};

export class SoundController {
    private static instance: SoundController;
    private eventManager: EventManager;
    private isMusicOn: boolean = true; // Default based on common game patterns
    private isSoundOn: boolean = true; // Default

    private musicSound: Howl | null = null; // To store the music sound instance for control

    // Public getters for sound states
    public getIsSoundOn(): boolean {
        return this.isSoundOn;
    }

    public getIsMusicOn(): boolean {
        return this.isMusicOn;
    }

    private constructor() {
        this.eventManager = EventManager.getInstance();
        this.initEventHandlers();
        this.initMusic();
        console.log('SoundController Initialized');
    }

    public static getInstance(): SoundController {
        if (!SoundController.instance) {
            SoundController.instance = new SoundController();
        }
        return SoundController.instance;
    }

    private initMusic(): void {
        if (Globals.soundResources[SOUND_KEYS.MUSIC]) {
            this.musicSound = Globals.soundResources[SOUND_KEYS.MUSIC] as Howl;
            if (this.isMusicOn) {
                this.musicSound.loop(true);
                this.musicSound.play();
            }
        }
    }

    private playSound(soundKey: string, options?: { loop?: boolean; volume?: number }): void {
        if (this.isSoundOn && Globals.soundResources[soundKey]) {
            const sound = Globals.soundResources[soundKey] as Howl;
            if (options?.loop !== undefined) sound.loop(options.loop);
            if (options?.volume !== undefined) sound.volume(options.volume);
            sound.play();
        }
    }

    private stopSound(soundKey: string): void {
        if (Globals.soundResources[soundKey]) {
            (Globals.soundResources[soundKey] as Howl).stop();
        }
    }

    // Basic fade (assumes Howler.js or similar with fade method)
    // For more complex tweens, @tweenjs/tween.js could be integrated here
    private fadeSound(soundKey: string, toVolume: number, duration: number, stopWhenDone: boolean = false): void {
        if (Globals.soundResources[soundKey]) {
            const sound = Globals.soundResources[soundKey] as Howl;
            const currentVolume = sound.volume() as number; // Howler returns volume as number or Howl itself if setting
            sound.fade(currentVolume, toVolume, duration);
            if (stopWhenDone && toVolume === 0) {
                // Howler's fade will stop the sound if it reaches 0 volume and there are no other plays queued.
                // However, to be explicit or if it needs to stop sooner for some reason:
                setTimeout(() => sound.stop(), duration);
            }
        }
    }

    private initEventHandlers(): void {
        // Music and Sound Toggle (assuming you'll have UI elements dispatching these)
        this.eventManager.on(GameEvent.MUSIC_TOGGLE as any, (isOn: boolean) => {
            this.isMusicOn = isOn;
            if (this.musicSound) {
                if (this.isMusicOn) {
                    this.musicSound.loop(true);
                    if (!this.musicSound.playing()) {
                        this.musicSound.play();
                    }
                    // Ensure volume is 1 if it was faded
                    if (this.musicSound.volume() !== 1) {
                        this.fadeSound(SOUND_KEYS.MUSIC, 1, 500); 
                    }
                } else {
                    this.fadeSound(SOUND_KEYS.MUSIC, 0, 500, true); // Fade out and stop
                }
            }
        });

        this.eventManager.on(GameEvent.SOUND_TOGGLE as any, (isOn: boolean) => {
            this.isSoundOn = isOn;
            if (!this.isSoundOn) {
                // Optionally stop all non-music sounds immediately
                Object.keys(SOUND_KEYS).forEach(key => {
                    const soundKeyConstant = SOUND_KEYS[key as keyof typeof SOUND_KEYS];
                    if (key !== 'MUSIC' && Globals.soundResources[soundKeyConstant]) {
                        this.stopSound(soundKeyConstant);
                    }
                });
                // Howler specific global mute might be an option too: Howler.mute(true)
            } else {
                // Howler.mute(false)
            }
        });

        // Reel Sounds (adapting from SlotScene and Phaser code)
        this.eventManager.on(GameEvent.REEL_START_SPIN, (reelIndex?: number) => {
            // reelIndex might not be needed if it's a general spin sound
            this.stopSound(SOUND_KEYS.WIN_SMALL); // Stop any lingering win sounds
            this.stopSound(SOUND_KEYS.WIN_MEDIUM);
            this.stopSound(SOUND_KEYS.WIN_LARGE);
            this.stopSound(SOUND_KEYS.WIN_JACKPOT);
            this.stopSound(SOUND_KEYS.COIN_LINE_WIN);
            this.stopSound(SOUND_KEYS.COIN_MID_WIN);
            this.stopSound(SOUND_KEYS.COIN_BIG_WIN);
            this.stopSound(SOUND_KEYS.COIN_MEGA_WIN);

            this.playSound(SOUND_KEYS.REEL_SPIN);
            // Phaser code fades music here, implement if desired:
            if (this.isMusicOn && this.musicSound && this.musicSound.volume() > 0.5) { // Check current volume before fading
                 this.fadeSound(SOUND_KEYS.MUSIC, 0.5, 200);
            }
        });

        this.eventManager.on(GameEvent.REEL_STOPPED, (reelIndex: number) => {
            const reelStopSoundKey = `${SOUND_KEYS.REEL_STOP_BASE}${reelIndex + 1}`;
            if (Globals.soundResources[reelStopSoundKey]) {
                this.playSound(reelStopSoundKey);
            } else {
                // Fallback if specific reel stop sound doesn't exist
                this.playSound(SOUND_KEYS.REEL_STOP_BASE + '1');
            }
            // Phaser code potentially fades music back in if win == 0
            // This logic might fit better after win calculations in GameEvent.ROUND_COMPLETE or similar
        });
        
        // Fast Stop reel sound
        this.eventManager.on(GameEvent.REEL_STOP_FAST as any, () => { 
            this.playSound(SOUND_KEYS.REEL_STOP_FAST);
            this.stopSound(SOUND_KEYS.REEL_SPIN); // Stop the main spin sound
            // Phaser code also fades music back in here. Consider timing.
            // if (this.isMusicOn && this.musicSound && this.musicSound.volume() < 1) {
            //    this.fadeSound(SOUND_KEYS.MUSIC, 1, 100);
            // }
        });

        // Button Click
        this.eventManager.on(GameEvent.BUTTON_CLICK as any, (buttonId?: string) => {
            // buttonId could be used for specific button sounds if needed
            this.playSound(SOUND_KEYS.BUTTON_CLICK);
        });

        // Win Sounds (Adapt based on how SlotScene communicates win amounts/types)
        // Assuming GameEvent.SHOW_WIN might carry a payload like: { amount: number, type: 'small' | 'medium' | 'large' | 'jackpot' | 'coinMid' | 'coinBig' | 'coinMega' }
        this.eventManager.on(GameEvent.SHOW_WIN as any, (winData: { amount: number, type?: string, duration?: number, isJackpot?: boolean }) => {
            this.stopSound(SOUND_KEYS.REEL_SPIN); // Stop reel spin sound if it was looping

            let winSoundKey = SOUND_KEYS.WIN_SMALL; // Default
            let musicTargetVolume = 0.5; // Default music fade for wins
            let shouldFadeMusic = true;

            if (winData.type) {
                switch (winData.type) {
                    case 'medium': 
                        winSoundKey = SOUND_KEYS.WIN_MEDIUM; 
                        break;
                    case 'large': 
                        winSoundKey = SOUND_KEYS.WIN_LARGE; 
                        break;
                    case 'jackpot': 
                        winSoundKey = SOUND_KEYS.WIN_JACKPOT;
                        musicTargetVolume = 0; // Mute music for jackpot
                        break;
                    case 'coinLine': // From 'event-start-bigwin-lineWinCoins'
                        winSoundKey = SOUND_KEYS.COIN_LINE_WIN;
                        shouldFadeMusic = false; // Or a lighter fade
                        break;
                    case 'coinMid': // From 'event-start-bigwin-win'
                        winSoundKey = SOUND_KEYS.COIN_MID_WIN;
                        break;
                    case 'coinBig':
                        winSoundKey = SOUND_KEYS.COIN_BIG_WIN;
                        break;
                    case 'coinMega':
                        winSoundKey = SOUND_KEYS.COIN_MEGA_WIN;
                        musicTargetVolume = 0; // Mute music for mega coin win
                        break;
                    default: // 'small' or undefined
                        winSoundKey = SOUND_KEYS.WIN_SMALL;
                        shouldFadeMusic = false; // No music fade for small wins, or very slight
                        break;
                }
            }
            this.playSound(winSoundKey);
            
            if (shouldFadeMusic && this.isMusicOn && this.musicSound && this.musicSound.volume() > musicTargetVolume) {
                this.fadeSound(SOUND_KEYS.MUSIC, musicTargetVolume, 200);
            }

            // Phaser's startMusicAfterDelay logic for win sounds that cut music:
            // This needs a way to know the duration of the win sound/animation.
            // Could be part of winData.duration or a new event like GameEvent.WIN_ANIMATION_SOUND_ENDED
            if (winData.duration && (winData.type === 'jackpot' || winData.type === 'coinMega' || winData.type === 'large')) {
                const soundDuration = winData.duration; // in ms
                const fadeTime = 200; // default fade time
                const winAnimationSoundDurationOffset = -1500; // from Phaser, adjust as needed
                const delay = Math.max(0, soundDuration - fadeTime + winAnimationSoundDurationOffset);

                setTimeout(() => {
                    if (this.isMusicOn && this.musicSound) {
                        this.fadeSound(SOUND_KEYS.MUSIC, 1, fadeTime);
                    }
                }, delay);
            }
        });
        
        this.eventManager.on(GameEvent.WIN_ANIMATION_COMPLETE as any, () => {
            // Logic from 'event-stop-winlines-showing' in Phaser
            if (this.isMusicOn && this.musicSound && this.musicSound.volume() < 1) {
                this.fadeSound(SOUND_KEYS.MUSIC, 1, 200);
            }
            // Stop looping win sounds, non-looping sounds will stop on their own.
            // If specific coin sounds are long and need explicit stopping, add them.
            // this.stopSound(SOUND_KEYS.COIN_MID_WIN); 
            // this.stopSound(SOUND_KEYS.COIN_BIG_WIN);
            // this.stopSound(SOUND_KEYS.COIN_MEGA_WIN);
        });

        // Count Up Sounds
        this.eventManager.on(GameEvent.COUNTUP_START as any, () => this.playSound(SOUND_KEYS.COUNT_UP_LOOP, { loop: true }));
        this.eventManager.on(GameEvent.COUNTUP_STOP as any, () => { 
            this.stopSound(SOUND_KEYS.COUNT_UP_LOOP);
            this.playSound(SOUND_KEYS.COUNT_UP_STOP);
        });

        // Free Spins Sounds
        this.eventManager.on(GameEvent.FREE_SPINS_START as any, () => {
            if (this.isMusicOn && this.musicSound) this.fadeSound(SOUND_KEYS.MUSIC, 0, 200);
            this.playSound(SOUND_KEYS.FREE_SPINS_WIN_EFFECT);
        });

        this.eventManager.on(GameEvent.FREE_SPINS_END as any, () => {
            // Fade music back in first
            if (this.isMusicOn && this.musicSound) this.fadeSound(SOUND_KEYS.MUSIC, 1, 200);
            // Then fade out the free spins win effect sound if it's playing and then play end sound
            if (Globals.soundResources[SOUND_KEYS.FREE_SPINS_WIN_EFFECT]) {
                 this.fadeSound(SOUND_KEYS.FREE_SPINS_WIN_EFFECT, 0, 200, true);
            }
            this.playSound(SOUND_KEYS.FREE_SPINS_END_EFFECT);
        });
        
        // Near Win / Prolong sound
        this.eventManager.on(GameEvent.NEAR_WIN_START as any, () => {
            this.playSound(SOUND_KEYS.PROLONG);
        });
        this.eventManager.on(GameEvent.NEAR_WIN_STOP as any, () => {
            this.fadeSound(SOUND_KEYS.PROLONG, 0, 500, true);
        });

        // Bonus/Popup related sounds (from Phaser's event-start-popup-bonusPopup)
        // This might be tied to a specific GameEvent for showing bonus popups
        this.eventManager.on(GameEvent.BONUS_POPUP_SHOW as any, () => {
            if (this.isMusicOn && this.musicSound) {
                this.fadeSound(SOUND_KEYS.MUSIC, 0, 200);
            }
            // Assuming FREE_SPINS_WIN_EFFECT is the generic sound for such popups for now
            // Or add a new SOUND_KEYS.BONUS_POPUP_OPEN
            this.playSound(SOUND_KEYS.FREE_SPINS_WIN_EFFECT); 
        });

        this.eventManager.on(GameEvent.BONUS_POPUP_HIDE as any, () => {
            if (this.isMusicOn && this.musicSound) {
                this.fadeSound(SOUND_KEYS.MUSIC, 1, 200);
            }
            if (Globals.soundResources[SOUND_KEYS.FREE_SPINS_WIN_EFFECT]) {
                this.fadeSound(SOUND_KEYS.FREE_SPINS_WIN_EFFECT, 0, 200, true);
            }
        });


        // Handle browser focus/blur for sound resume/pause
        document.addEventListener('visibilitychange', () => {
            const currentMusicVolume = this.musicSound ? this.musicSound.volume() as number : 1;
            if (document.hidden) {
                if (this.musicSound && this.isMusicOn && this.musicSound.playing()) {
                    this.musicSound.pause();
                }
                // Howler.mute(true); // Alternative global mute
            } else {
                if (this.musicSound && this.isMusicOn && !this.musicSound.playing()) {
                    this.musicSound.play(); 
                    // Restore volume if it was faded, or simply ensure it is at target
                    if(this.musicSound.volume() !== currentMusicVolume) {
                         this.musicSound.volume(currentMusicVolume); // Or fade to desired volume
                    }
                }
                // Howler.mute(false);
            }
        });
    }
} 