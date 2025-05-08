export function globalGetIsMobile(): boolean {
    return (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()))
}
let scene: Phaser.Scene = null
export function setScene(_scene) {
    scene = _scene
}
export function isTablet() {
    const width = document.documentElement.clientWidth
    const height = document.documentElement.clientHeight

    let aspectRatio = width > height ? width / height : height / width;

    return globalGetIsMobile() && aspectRatio <= 16 / 10;
}

export function globalGetIsPortrait(scene = null): boolean {
    const aspectRatio =
        document.documentElement.clientWidth /
        document.documentElement.clientHeight;
    const isPort = globalGetIsMobile()
        ? aspectRatio < 1
        : aspectRatio <= 10 / 16;

    return isPort;
}

export function globalAdjustElementScale(
    elementDimension: number,
    initialScale: number,
    screenPart: number,
    screenDimension: number
): number {
    let newScale = initialScale;
    newScale = Math.min(
        initialScale,
        (screenPart * screenDimension) / elementDimension
    );

    return newScale;
}
