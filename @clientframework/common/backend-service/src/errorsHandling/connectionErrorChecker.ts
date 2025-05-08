import { ErrorMsgKeys } from '../client-remote-data/src/multilanguage/errorMsgKeys';
import { onEventEmitterSet, getEventEmitter } from '../eventEmitter';

let connectionCheckSet = false;
let wasConnectionCheckError = false;
//let xhr: XMLHttpRequest;

function initCheckConnection(): void {
    console.log('initCheckConnection called');

    if (connectionCheckSet) {
        return;
    }

    connectionCheckSet = true;

    // if (true || navigator.userAgent.includes('iPhone')) {
    // {
    //     // } else {
    //     xhr = new XMLHttpRequest();

    //     xhr.addEventListener(
    //         'readystatechange',
    //         () => {
    //             //delcons console.log("processRequest", ClientConnection.xhr.readyState);
    //             if (xhr.readyState == 4) {
    //                 if (xhr.status >= 200 && xhr.status < 304) {
    //                     //delcons console.log("connection exists!");
    //                     if (wasConnectionCheckError) {
    //                         wasConnectionCheckError = false;
    //                         getEventEmitter().emit('event-online-again', true);
    //                         //con.reconnect();
    //                     }
    //                 } else {
    //                     this.wasConnectionCheckError = true;
    //                     getEventEmitter().emit(
    //                         'event-error-popup',
    //                         ErrorMsgKeys.networkNotResponding
    //                     );
    //                     //alert("connection doesn't exist!");
    //                 }
    //                 xhr.abort();
    //             }
    //         },
    //         false
    //     );
    // }

    setInterval(() => {
        //if (!ClientConnection.lobbyCommandStarted) {
        {
            // if (true || navigator.userAgent.includes('iPhone')) {
            if (navigator.onLine) {
                if (wasConnectionCheckError) {
                    wasConnectionCheckError = false;
                    console.log('reconnect, internet lost');
                    getEventEmitter().emit('event-online-again', true);
                    //con.reconnect();
                }
            } else {
                wasConnectionCheckError = true;
                getEventEmitter().emit(
                    'event-error-popup',
                    ErrorMsgKeys.networkNotResponding
                );
                //alert("connection doesn't exist!");
            }
        }
        // else {
        //     const file = window.location.href + '/assets/dot.png';
        //     const randomNum = Math.round(Math.random() * 10000);

        //     //delcons console.log(file + "?rand=" + randomNum)

        //     xhr.open('HEAD', file + '?rand=' + randomNum, true);

        //     xhr.send();
        // }
        //}
        /*else {
            // to imedaitely stop pinging in case of exiting. (iphone problem)
            // so as an alternative it gives 3
            ClientConnection.lobbyTriesCnt++;
            if (ClientConnection.lobbyTriesCnt == 3) {
                if (!wasConnectionCheckError) {
                    GameScene.languages_.errorPopup(ErrorsAndMsgKeys.connectionError, false);
                }
            }
        }*/
    }, 5000);
}

// to imedaitely stop pinging in case of exiting. (iphone problem)
export function stopCheckingConnections(): void {
    // if (true || navigator.userAgent.includes('iPhone')) {
    // } else {
    //     xhr.onreadystatechange = null;
    // }
}

onEventEmitterSet(() => {
    getEventEmitter().once(
        'event-start-checking-connection',
        initCheckConnection
    );
}, this);
