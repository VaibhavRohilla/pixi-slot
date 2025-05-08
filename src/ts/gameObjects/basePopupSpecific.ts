import BasePopup from "@clientframework/slots/engine/@clientframework/common/engine/src/ts/GameObjects/popups/basePopup";
import { globalGetIsPortrait } from "@clientframework/slots/engine/@clientframework/common/engine/src/ts/globalGetIsPortrait";


export default class BasePopupSpecific extends BasePopup {

    onResize() {
        const isPort = globalGetIsPortrait(this.scene);
        this.titleLeftAlign = !isPort;

        if (this.eventKeyId === 'bet-popup') {
            this.usedTitleOffsetMultiplier = isPort ? { x: 1.75, y: 1 } : { x: 0.6, y: 1 };
            if (this.title.text === this.alternativeTitleText) {
                this.usedTitleOffsetMultiplier = isPort ? { x: 1.2, y: 1 } : { x: 0.3, y: 1 }
            }

        }
        super.onResize();
    }
}
