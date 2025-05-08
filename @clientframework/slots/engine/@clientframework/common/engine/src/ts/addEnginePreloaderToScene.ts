import * as NProgress from 'nprogress';

export function addEnginePreloaderToScene(myScene: Phaser.Scene): void {
    const percentDone = NProgress.status < 0.5 ? NProgress.status : 0;

    myScene.load.on('progress', (value: number) => {
        if (value === 1) {
            // to allow for NProgress done() animation
            return;
        }

        const status = percentDone + (1 - percentDone) * value;

        NProgress.set(status);

        console.log(`boot preload ${value * 100}%`);
    });

    myScene.load.on('complete', () => {
        console.log('boot preload complete');

        NProgress.done();

        //myScene.time.delayedCall(NProgress.settings.speed, () =>
        {
            // Fade out logo
            const logo: SVGAElement = document.querySelector('#preload svg');
            logo.style.opacity = '1';
            logo.style.webkitTransition =
                //logo.style.transition = `opacity ${NProgress.settings.speed}ms linear`;
                logo.style.opacity = '0';

            //myScene.time.delayedCall(NProgress.settings.speed, () =>
            {
                (logo.parentNode as HTMLElement).remove();

                myScene.game.events.emit('event-engine-preloader-faded-out');
            } //, null, myScene);
        } //, null, myScene);
    });
}
