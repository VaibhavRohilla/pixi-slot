const getScreenOrientationType = (): OrientationType => {
    return window.innerHeight > window.innerWidth
        ? 'portrait-primary'
        : 'landscape-primary';
};

((): void => {
    const screen = window.screen;
    const orientation = screen
        ? screen.orientation ||
          (<any>screen).mozOrientation ||
          (<any>screen).msOrientation
        : false;

    if (orientation) {
        return;
    }

    if (!screen) {
        (<any>window).screen = {} as Screen;
    }

    (<any>window.screen).orientation = {
        type: getScreenOrientationType(),
    } as ScreenOrientation;

    window.addEventListener(
        'resize',
        () => {
            const type = getScreenOrientationType();

            if (window.screen.orientation.type !== type) {
                (<any>window.screen.orientation).type = type;

                window.dispatchEvent(new Event('orientationchange'));
            }
        },
        false
    );
})();
