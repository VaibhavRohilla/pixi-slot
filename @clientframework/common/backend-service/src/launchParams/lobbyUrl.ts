import { getQueryParams } from './getQueryParams';
import { stopCheckingConnections } from '../errorsHandling/connectionErrorChecker';
import { onEventEmitterSet, getEventEmitter } from '../eventEmitter';

let lobbyUrl = getQueryParams('lobbyUrl');
if (!lobbyUrl) {
    //demo mode
    lobbyUrl = ''; //"https://jackpots-stg.firebaseapp.com";
}

let lobbyCommandStarted = false;

function allowLobbyCommand(): void {
    lobbyCommandStarted = false;
}

export function getLobbyUrl(): string {
    return lobbyUrl;
}

function lobbyCommand(): void {
    //console.log("lobby clicked")
    if (!lobbyCommandStarted) {
        lobbyCommandStarted = true;
        stopCheckingConnections();
        //setTimeout(() => {ClientConnection.lobbyCommandStarted = false, 10000})
        if (lobbyUrl) {
            //console.log("lobby lobbyUrl clicked", ClientConnection.lobbyUrl)
            //window.open(ClientConnection.lobbyUrl, "_top");
            //window.top.location.replace(ClientConnection.lobbyUrl);
            //let elem = document.createElement('a')
            //elem.target = "_top";
            //elem.href = ClientConnection.lobbyUrl;
            //elem.click();

            console.log('lobby clicked');

            const inIframe = function (): boolean {
                try {
                    return window.self !== window.top;
                } catch (t) {
                    return !0;
                }
            };
            const parseUrl = function (t): string {
                return (
                    t.search('www') >= 0 &&
                        t.search('http') < 0 &&
                        (t = 'http://' + t),
                    t
                );
            };
            let l = lobbyUrl; //o.Settings.instance.getValue("lobbyUrl");
            if (
                l.search('www') >= 0 ||
                l.search('http') >= 0 ||
                '//' == l.substr(0, 2)
            ) {
                console.log('search(www...');
                if (((l = parseUrl(l)), inIframe())) {
                    console.log('its in iframe');
                    window.top.location.replace(l);
                } else {
                    if (
                        navigator.userAgent.includes('Opera Mini') ||
                        /*s.Device.instance().iOS*/ (/iPad|iPhone|iPod/.test(
                            navigator.userAgent
                        ) &&
                            navigator.userAgent.includes('Opera'))
                    ) {
                        console.log('opera');
                        window.location.href = l;
                    } else {
                        console.log('others, no opera, self');
                        window.open(l, '_self');
                    }
                }
            } else {
                console.log('search(www..., ELSE');
                /*n.isFunction(*/ typeof window[l] === 'function'
                    ? window[l]()
                    : /*!n.isNil*/ window.parent &&
                      /*n.isFunction*/ typeof window.parent[l] === 'function' &&
                      window.parent[l]();
            }
        }
    }
}

onEventEmitterSet(() => {
    console.log('LOBBY EVENTS');
    getEventEmitter().on('event-init-msg-handled', allowLobbyCommand, this);
    getEventEmitter().on('event-lobby-command', lobbyCommand, this);
    getEventEmitter().on(
        'event-request-lobby-url',
        () => {
            const url = getLobbyUrl();
            getEventEmitter().emit('event-get-lobby-url', url);
        },
        this
    );
}, this);
