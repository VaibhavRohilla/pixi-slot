import { ErrorMsgKeys } from '../client-remote-data/src/multilanguage/errorMsgKeys';
import { errorPresenter } from './errorPopupPresenter';
import { onEventEmitterSet, getEventEmitter } from '../eventEmitter';

export function preloadAndCreateErrorPopups(scene: Phaser.Scene = null): void {
    errorPresenter.preloadAndAddErrorPopups(scene);
}

onEventEmitterSet(() => {
    getEventEmitter().on(
        'event-error-popup',
        (
            key: ErrorMsgKeys,
            isResponsible = false,
            code = -1,
            amount = -1,
            limit = -1,
            amountText?: ErrorMsgKeys,
            limitText?: ErrorMsgKeys
        ) =>
            errorPresenter.showErrorPopup(
                key,
                isResponsible,
                code,
                amount,
                limit,
                amountText,
                limitText
            ),
        errorPresenter
    );

    getEventEmitter().on(
        'event-init-msg-handled',
        errorPresenter.closePopups,
        errorPresenter
    );
    getEventEmitter().on(
        'event-error-popup-force-continue',
        errorPresenter.closePopups,
        errorPresenter
    );

    getEventEmitter().on(
        'event-error-popup-force-void',
        errorPresenter.quitGame,
        errorPresenter
    );

    getEventEmitter().on(
        'event-error-popup-force-history',
        errorPresenter.showHistory,
        errorPresenter
    );

    getEventEmitter().on(
        'event-error-popup-supplier',
        (msg: string, supplier: string, action: any, buttons: any) =>
            errorPresenter.showSupplierErrorPopup(
                msg,
                supplier,
                action,
                buttons
            ),
        errorPresenter
    );
}, this);
