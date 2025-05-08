import { BigWinAnimationType } from '@slotsEngine/game-objects/particles/particleWinAnimation';

let isMusicOn = false;
let isSoundOn = false;
let scene: Phaser.Scene;

let music: Phaser.Sound.WebAudioSound;
const rotation: Phaser.Sound.BaseSound[] = [];
const reelStop: Phaser.Sound.BaseSound[] = [];
let reelStopFast: Phaser.Sound.BaseSound;
let prolong: Phaser.Sound.WebAudioSound;
let buttonPressed: Phaser.Sound.BaseSound;
// let startAutoplay: Phaser.Sound.BaseSound;
// let stopAutoplay: Phaser.Sound.BaseSound;
let startCountUpWin: Phaser.Sound.BaseSound;
let stopCountUpWin: Phaser.Sound.BaseSound;
let win: Phaser.Sound.WebAudioSound;
let winHigher: Phaser.Sound.WebAudioSound;
let jackpotWin: Phaser.Sound.WebAudioSound;
// let winx25: Phaser.Sound.WebAudioSound;
// let winline: Phaser.Sound.BaseSound;
// let flamingBorder: Phaser.Sound.BaseSound;
let coinLineWin: Phaser.Sound.BaseSound;
let coinMidWin: Phaser.Sound.BaseSound;
let coinBigWin: Phaser.Sound.BaseSound;
let coinMegaWin: Phaser.Sound.BaseSound;

let freeSpinsWin: Phaser.Sound.WebAudioSound;
let freeSpinsEnd: Phaser.Sound.BaseSound;

const defaultFadeTime = 200;
const winAnimationSoundDurationOffset = -1500;

let fastStopPlayed = false;

function playSound(sound: Phaser.Sound.BaseSound): void {
    isSoundOn && sound && sound.play();
}
function stopSound(sound: Phaser.Sound.BaseSound): void {
    sound && sound.stop();
    if (sound instanceof Phaser.Sound.WebAudioSound) {
        sound.setVolume(1);
    }
}

function fadeSound(
    audioSound: Phaser.Sound.WebAudioSound,
    alpha = 0,
    shouldStop = false,
    duration: number = defaultFadeTime
): void {
    // it seems that phaser3 has a problem with managing a tween in this context (technically in the preload scene)
    // so the tween can only play in an active scene
    // TODO find a cleaner approach

    const backgroundScene = scene.scene.get('Background');
    const tween = backgroundScene.tweens.addCounter({
        from: audioSound.volume,
        to: alpha,
        duration: duration,
        onUpdate: () => {
            audioSound.setVolume(tween.getValue());
        },
        onComplete: () => {
            if (shouldStop) {
                stopSound(audioSound);
            }
        },
    });
}

function startMusicAfterDelay(
    music: Phaser.Sound.WebAudioSound,
    delay: number,
    fadeTiming: number
): void {
    setTimeout(() => {
        fadeSound(music, 1, false, fadeTiming);
    }, delay - fadeTiming);
}

export function initSoundEvents(scene_: Phaser.Scene): void {
    console.log('initSoundEvents');

    scene = scene_;

    music = (<Phaser.Sound.WebAudioSoundManager>scene.sound).add('music');

    for (let i = 1; i <= 1; i++) {
        rotation.push(scene.sound.add('reelSpin' + i));
    }

    for (let i = 1; i <= 5; i++) {
        reelStop.push(scene.sound.add('reelStop' + i));
    }

    reelStopFast = scene.sound.add('reelStopFast');

    prolong = (<Phaser.Sound.WebAudioSoundManager>scene.sound).add('prolong');

    buttonPressed = scene.sound.add('buttonPressed');

    // startAutoplay = scene.sound.add("startAutoplay");

    // stopAutoplay = scene.sound.add("stopAutoplay");

    startCountUpWin = scene.sound.add('CountUpLoop');
    stopCountUpWin = scene.sound.add('CountUpStop');

    win = (<Phaser.Sound.WebAudioSoundManager>scene.sound).add('win');
    jackpotWin = (<Phaser.Sound.WebAudioSoundManager>scene.sound).add(
        'jackpotWin'
    );
    winHigher = (<Phaser.Sound.WebAudioSoundManager>scene.sound).add(
        'winHigher'
    );

    freeSpinsWin = (<Phaser.Sound.WebAudioSoundManager>scene.sound).add(
        'freeSpins'
    );

    freeSpinsEnd = scene.sound.add('endFS');

    // winx25 = (<Phaser.Sound.WebAudioSoundManager>(scene.sound)).add("bigwin");
    // winline = scene.sound.add("winline");
    coinLineWin = scene.sound.add('coinlinewin');
    coinMidWin = scene.sound.add('coinmidwin');
    coinBigWin = scene.sound.add('coinbigwin');
    coinMegaWin = scene.sound.add('coinmegawin');
    // flamingBorder = scene.sound.add("flamingBorder");

    scene.game.events.on('event-button-select-music', (arg) => {
        if (isMusicOn != arg && arg) {
            music.play({ loop: true });
        } else if (!arg) {
            music.stop();
        }
        isMusicOn = arg;
    });

    scene.game.events.on('event-button-select-sound', (arg) => {
        isSoundOn = arg;
        // if (!isSoundOn) {// TODO - music should remain
        //     scene.sound.stopAll();
        // }
    });

    scene.game.events.on('event-animation-rotation-start', () => {
        if (music) {
            //fadeSound(music, 0, false, 200);
        }

        stopSound(win);
        stopSound(winHigher);
        playSound(rotation[Math.floor(Math.random() * rotation.length)]);
        fastStopPlayed = false;
    });

    scene.game.events.on('event-animation-rotation-end', (win) => {
        if (win === 0 && music) {
            // if(music.volume < 0.5) {
            //     music.setVolume(0.5);
            // }
            // fadeSound(music, 1, false, 100);
        }
    });

    scene.game.events.on(
        'event-reel-spin-stopping',
        (arg) => {
            if (!fastStopPlayed) {
                playSound(reelStop[arg]);
            }
        },
        this
    );

    scene.game.events.on(
        'event-reel-spin-stopping-fast',
        (arg) => {
            arg;
            if (!fastStopPlayed) {
                playSound(reelStopFast);
                fastStopPlayed = true;
                rotation.forEach((element) => {
                    stopSound(element);
                });
            }
            //fadeSound(music, 1, false, 100);
        },
        this
    );

    scene.game.events.on(
        'event-button-clicked',
        (arg) => {
            arg;
            playSound(buttonPressed);
        },
        this
    );

    // scene.game.events.on("event-autospin-start", (arg) => {
    //     playSound(startAutoplay);
    // }, this);

    // scene.game.events.on("event-autospin-stop", (arg) => {
    //     playSound(stopAutoplay);
    // }, this);

    scene.game.events.on(
        'event-start-bigwin-win',
        (arg) => {
            switch (arg) {
                case BigWinAnimationType.midWin:
                    playSound(coinMidWin);
                    break;
                case BigWinAnimationType.bigWin:
                    playSound(coinBigWin);
                    break;
                case BigWinAnimationType.megaWin:
                    playSound(coinMegaWin);
                    break;
            }
        },
        this
    );

    scene.game.events.on('event-start-bigwin-lineWinCoins', (arg) => {
        arg;
        playSound(coinLineWin);
    });

    scene.game.events.on('event-stop-bigwin-win', (arg) => {
        arg;
        // stopSound(coinMidWin);
        // stopSound(coinBigWin);
        // stopSound(coinMegaWin);
    });

    // scene.game.events.on("event-show-single-line", (arg) => {
    //     playSound(winline);
    // }, this);

    scene.game.events.on(
        'event-animate-background-win',
        (duration, multipliedBy) => {
            if (multipliedBy >= 15) {
                if (isSoundOn && music) {
                    fadeSound(music, 0);
                }
                playSound(winHigher);
            } else {
                playSound(win);
            }
            startMusicAfterDelay(
                music,
                duration - defaultFadeTime + winAnimationSoundDurationOffset,
                defaultFadeTime
            );
        }
    );
    scene.game.events.on(
        'event-start-prize-win-sound',
        (duration, multipliedBy) => {
            if (multipliedBy >= 15) {
                if (isSoundOn && music) {
                    fadeSound(music, 0);
                }
                playSound(jackpotWin);
            } else {
                playSound(win);
            }

            startMusicAfterDelay(
                music,
                duration - defaultFadeTime + winAnimationSoundDurationOffset,
                defaultFadeTime
            );
        }
    );

    scene.game.events.on(
        'event-count-start-textPopup-lineWin',
        (arg) => {
            arg;
            playSound(startCountUpWin);
        },
        this
    );

    scene.game.events.on(
        'event-count-end-textPopup-lineWin',
        (arg) => {
            arg;
            stopSound(startCountUpWin);
            playSound(stopCountUpWin);
        },
        this
    );

    scene.game.events.on(
        'event-reels-border-started',
        (arg) => {
            arg;
            console.log('FLAMINGBORDER');
            // playSound(flamingBorder);
        },
        this
    );

    scene.game.events.on(
        'event-stop-winlines-showing',
        (arg) => {
            arg;
            if (isSoundOn && music && music.volume < 1) {
                fadeSound(music, 1);

                if (win && win.volume > 0) {
                    fadeSound(win, 0, true);
                }
            }
        },
        this
    );

    scene.game.events.on(
        'event-start-popup-bonusPopup',
        (arg) => {
            arg;
            if (isSoundOn && music) {
                fadeSound(music, 0);

                playSound(freeSpinsWin);
            }
        },
        this
    );

    scene.game.events.on(
        'event-stopped-popup-bonusPopup',
        (arg) => {
            arg;
            if (isSoundOn && music) {
                fadeSound(music, 1);

                if (freeSpinsWin) {
                    fadeSound(freeSpinsWin, 0, true);
                }
            }
        },
        this
    );

    scene.game.events.on('event-started-popup-nearWinFrame', (arg) => {
        arg;
        playSound(prolong);
    });

    scene.game.events.on('event-stopping-popup-nearWinFrame', (arg) => {
        arg;
        fadeSound(prolong, 0, true, 500);
    });

    scene.game.events.on('event-animation-bonusEnd-start', (arg) => {
        arg;
        playSound(freeSpinsEnd);
    });

    if (navigator.userAgent.includes('iPhone')) {
        scene.sound.pauseOnBlur = false;
    } else {
        scene.sound.pauseOnBlur = true;
    }

    scene.game.events.on(
        'focus',
        () => {
            setTimeout(() => {
                console.log('resuming audio context...');
                scene.sound.resumeAll();
                //window.phaserAudioContext.resume();
                //scene.sound.pauseOnBlur = false;
            }, 500);
        },
        false
    );

    scene.game.events.on(
        'blur',
        () => {
            console.log('pausing audio context...');
            if (!navigator.userAgent.includes('iPhone')) {
                scene.sound.pauseOnBlur = true;
            }
            //window.phaserAudioContext.suspend();
        },
        false
    );
}
