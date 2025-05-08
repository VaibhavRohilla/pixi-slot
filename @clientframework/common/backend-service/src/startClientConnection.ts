import ClientConnectionWS from './clientConnection/clientConnectionWS';
//import ClientConnectionOffline from "./clientConnection/clientConnectionOffline";
import ClientController from './clientControllers/slotClientController';

export function startClientConnection(
    usingTrueRGS: boolean,
    isOffline: boolean
): void {
    console.log('startClientConnection, isOffline ', isOffline);

    new ClientController(usingTrueRGS);

    // if (isOffline)
    //     new ClientConnectionOffline()
    // else
    new ClientConnectionWS(usingTrueRGS);
}
