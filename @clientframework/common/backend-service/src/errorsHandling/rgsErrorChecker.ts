import { getErrorCodesDataField } from '../client-remote-data/src/multilanguage/errorCodesDataField';
import { ErrorMsgKeys } from '../client-remote-data/src/multilanguage/errorMsgKeys';
import { getEventEmitter } from '../eventEmitter';
import LogicFormats from '../logicFormats';


export function noErrorsFromRGS(
    input: LogicFormats.iOutputStateAccountResolved
): number {
    console.log('noErrorsFromRGS, input = ', input);

    // has supplier
    if (input && input.error && input.error.hasOwnProperty('supplier')) {
        getEventEmitter().emit(
            'event-error-popup-supplier',
            input.error.message,
            input.error.supplier,
            input.error.hasOwnProperty('action')
                ? JSON.parse(JSON.stringify(input.error.action))
                : null,
            input.error.hasOwnProperty('buttons')
                ? JSON.parse(JSON.stringify(input.error.buttons))
                : null
        );
    }
    // default one
    else if (input.hasOwnProperty('resolved') && !input.resolved) {
        console.log('usao u error');
        const errorCodesField = getErrorCodesDataField(input);
        if (errorCodesField) {
            let detail;
            if (errorCodesField.hasOwnProperty('detail')) {
                detail = JSON.parse(input.error.detail);
                getEventEmitter().emit(
                    'event-error-popup',
                    errorCodesField.msg,
                    !errorCodesField.isError,
                    -1,
                    detail.currentValue,
                    detail.maxValue,
                    errorCodesField.detail.msgCurrent,
                    errorCodesField.detail.msgLimit
                );
            } else {
                getEventEmitter().emit(
                    'event-error-popup',
                    errorCodesField.msg,
                    !errorCodesField.isError
                );
            }
        } else {
            getEventEmitter().emit(
                'event-error-popup',
                ErrorMsgKeys.connectionError
            );
        }

        return 0;
    } else if (input.hasOwnProperty('isInitMsg')) {
        console.log('event-init-msg-handled');
        getEventEmitter().emit('event-init-msg-handled', true);
        //this.model.balance = input.account.balance;
        //this.table.refreshFromModel();
        /////////////////////////////////////ClientConnection.initMsgProcessed = true;
        console.log('isInitMsg');
        //////////////////////////////////////closeErrorPopups();
        //////////////////////////////////////allowLobbyCommand();
        //this.enableButtonsAndFields();
        return 1;
    } else {
        // ok
        return 1;
    }
}
