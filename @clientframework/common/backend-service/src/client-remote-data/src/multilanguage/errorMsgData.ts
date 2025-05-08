import { ErrorMsgKeys } from "./errorMsgKeys";
import { LanguageKeys, ILanguageMsgData } from "./languageKeys";
import { getGameLanguage } from "../launchParams/gameLanguage";

type tLanguageTextsErrorMsg = {
    [k in ErrorMsgKeys] : ILanguageMsgData;
}

type tMultiLanguageErrorMsg = {
    [k in LanguageKeys] : tLanguageTextsErrorMsg;
}

function getField(key: ErrorMsgKeys) : ILanguageMsgData {
    let lang = getGameLanguage();

    if (errorMsgData.hasOwnProperty(lang)) {
        let langTexts: tLanguageTextsErrorMsg = errorMsgData[lang];
        if (langTexts.hasOwnProperty(key)) {
            let fieldData : ILanguageMsgData = langTexts[key];
            if (fieldData) {
                return fieldData;
            }
        }
    }

    return null;
}


export function getLanguageTextErrorMsg(key: ErrorMsgKeys): string {
    let field = getField(key);
    //delcons console.log("getlanguageText", key, field)
    if (field) {
        return field.text;
    }

    return ""
}

export function getErrorMsgData() {
    return errorMsgData;
}

export function setErrorMsgData(newData) {
    errorMsgData = JSON.parse(JSON.stringify(newData));
}

let errorMsgData: Partial<tMultiLanguageErrorMsg> = {
    en : {
        gameNotFound: {
            text: "Game not found"
        },
        errorCode: {
            text: "Error, code"
        },
        connectionError: {
            text: "Connection Error"
        },
        responsibleWagerLimit : {
            text: "Wager Unsuccessful\nOne of your Wager Limits have been exceeded"
        },
        responsibleDailyLimit : {
            text: "Wager Unsuccessful\nYour Daily Wager Limit has been exceeded"
        },
        responsibleWeeklyLimit : {
            text: "Wager Unsuccessful\nYour Weekly Wager Limit has been exceeded"
        },
        responsibleMonthlyLimit : {
            text: "Wager Unsuccessful\nYour Monthly Wager Limit has been exceeded"
        },
        responsibleDailyNetLoss : {
            text: "Wager Unsuccessful\nYour Daily Net Loss Limit has been exceeded"
        },
        responsibleWeeklyNetLoss : {
            text: "Wager Unsuccessful\nYour Weekly Net Loss Limit has been exceeded"
        },
        responsibleMonthlyNetLoss : {
            text: "Wager Unsuccessful\nYour Monthly Net Loss Limit has been exceeded"
        },
        responsibleDailyLimitSetByYou : {
            text: "Limit set by you"
        },
        responsibleWeeklyLimitSetByYou : {
            text: "Limit set by you"
        },
        responsibleMonthlyLimitSetByYou : {
            text: "Limit set by you"
        },
        responsibleTotalAmountWagered : {
            text: "Total amount wagered"
        },
        responsiblePotentialNetLoss : {
            text: "Potential Net Loss"
        },
        networkNotResponding : {
            text: "NETWORK NOT RESPONDING.\nPLEASE WAIT"
        },
        internalServerError : {
            text: "Internal server error"
        },
        badRequest : {
            text: "Bad Request"
        },
        badPlayerId : {
            text: "Bad playerId"
        },
        badToken : {
            text: "Bad token"
        },
        invalidToken : {
            text: "Invalid token"
        },
        invalidRefId : {
            text: "Invalid refId"
        },
        invalidPlayerId : {
            text: "Invalid playerId"
        },
        invalidRoundId : {
            text: "Invalid roundId"
        },
        expiredToken: {
            text: "Expired token"
        },
        duplicateId: {
            text: "Duplicate id"
        },
        duplicateRefId: {
            text: "Duplicate refId"
        },
        duplicateRoundId: {
            text: "Duplicate roundId"
        },
        roundAlreadyEnded: {
            text: "Round already ended"
        },
        unfinishedRoundsInSession: {
            text: "Unfinished rounds in session"
        },
        playerDoesNotHaveEnoughMoney: {
            text: "Player does not have enough money"
        },
        playerHasGoneAboveBetLimit: {
            text: "Player has gone above bet limit"
        },
        playerBlocked: {
            text: "Your account is blocked.\nPlease contact customer support"
        },
        expiredSession: {
            text: "Session expired due to inactivity "
        },
        multipleConnectionsNotAllowed: {
            text: "Multiple connections are not allowed"
        }
    },
    bg : {
            gameNotFound: {
                text: "Играта не е намерена"
            },
            errorCode: {
                text: "Грешка, код"
            },
            connectionError: {
                text: "Неуспешно свързване"
            },
            responsibleWagerLimit : {
                text: "Неуспешен залог\nЕдин от вашите лимити на залози е надвишен"
            },
            responsibleDailyLimit : {
                text: "Неуспешен залог\nВашият дневен лимит на залози е надвишен"
            },
            responsibleWeeklyLimit : {
                text: "Неуспешен залог\nВашият седмичен лимит на залози е надвишен"
            },
            responsibleMonthlyLimit : {
                text: "Неуспешен залог\nМесечният ви лимит на залози е надвишен"
            },
            responsibleDailyNetLoss : {
                text: "Неуспешен залог\nВашият дневен лимит на нетна загуба е надвишен"
            },
            responsibleWeeklyNetLoss : {
                text: "Неуспешен залог\nВашият седмичен лимит на нетна загуба е надвишен"
            },
            responsibleMonthlyNetLoss : {
                text: "Неуспешен залог\nМесечният ви лимит на нетна загуба е надвишен"
            },
            responsibleDailyLimitSetByYou : {
                text: "Определен от вас лимит"
            },
            responsibleWeeklyLimitSetByYou : {
                text: "Определен от вас лимит"
            },
            responsibleMonthlyLimitSetByYou : {
                text: "Определен от вас лимит"
            },
            responsibleTotalAmountWagered : {
                text: "Обща заложена сума"
            },
            responsiblePotentialNetLoss : {
                text: "Потенциална нетна загуба"
            },
            networkNotResponding : {
                text: "МРЕЖАТА НЕ ОТГОВАРЯ. МОЛЯ ИЗЧАКАЙТЕ"
            },
            internalServerError : {
                text: "Вътрешна грешка в сървъра"
            },
            badRequest : {
                text: "Грешна заявка"
            },
            badPlayerId : {
                text: "Грешен playerId"
            },
            badToken : {
                text: "Грешен жетон"
            },
            invalidToken : {
                text: "Невалиден жетон"
            },
            invalidRefId : {
                text: "Невалиден refId"
            },
            invalidPlayerId : {
                text: "Невалиден playerId"
            },
            invalidRoundId : {
                text: "Невалиден roundId"
            },
            expiredToken: {
                text: "Жетон с изтекъл срок"
            },
            duplicateId: {
                text: "Дублирай id (идентификатор)"
            },
            duplicateRefId: {
                text: "Дублирай refId"
            },
            duplicateRoundId: {
                text: "Дублирай roundId"
            },
            roundAlreadyEnded: {
                text: "Игралният рунд вече приключи"
            },
            unfinishedRoundsInSession: {
                text: "Незавършен игрален рунд в сесия"
            },
            playerDoesNotHaveEnoughMoney: {
                text: "Играчът няма достатъчно пари"
            },
            playerHasGoneAboveBetLimit: {
                text: "Играчът е надхвърлил лимита на залози"
            },
            playerBlocked: {
                text: "Вашият акаунт е блокиран.\n Моля, свържете се с “Услуги за поддръжка на потребители”"
            },
            expiredSession: {
                text: "Сесията е изтекла поради бездействие "
            },
            multipleConnectionsNotAllowed: {
                text: "Multiple connections are not allowed"
            }
        },
        cs : {
            gameNotFound: {
                text: "Hra nenalezena"
            },
            errorCode: {
                text: "Chyba, kód"
            },
            connectionError: {
                text: "Problém s připojením"
            },
            responsibleWagerLimit : {
                text: "Sázka se nezdařila\nByl překročen limit u jedné z vašich sázek"
            },
            responsibleDailyLimit : {
                text: "Sázka se nezdařila\nByl překročen limit u jedné z vašich sázek"
            },
            responsibleWeeklyLimit : {
                text: "Sázka se nezdařila\nVáš týdenní limit sázení byl překročen"
            },
            responsibleMonthlyLimit : {
                text: "Sázka se nezdařila\nVáš měsíční limit sázení byl překročen"
            },
            responsibleDailyNetLoss : {
                text: "Sázka se nezdařila\nVáš denní limit čisté ztráty byl překročen"
            },
            responsibleWeeklyNetLoss : {
                text: "Sázka se nezdařila\nVáš týdenní limit čisté ztráty byl překročen"
            },
            responsibleMonthlyNetLoss : {
                text: "Sázka se nezdařila\nVáš měsíční limit čisté ztráty byl překročen"
            },
            responsibleDailyLimitSetByYou : {
                text: "Vámi nastavený limit"
            },
            responsibleWeeklyLimitSetByYou : {
                text: "Vámi nastavený limit"
            },
            responsibleMonthlyLimitSetByYou : {
                text: "Vámi nastavený limit"
            },
            responsibleTotalAmountWagered : {
                text: "Celková hodnota sázek"
            },
            responsiblePotentialNetLoss : {
                text: "Případní čistá ztráta"
            },
            networkNotResponding : {
                text: "SÍŤ NEODPOVÍDÁ,\nPROSÍME VYČKEJTE"
            },
            internalServerError : {
                text: "Interní chyba serveru"
            },
            badRequest : {
                text: "Chybný požadavek"
            },
            badPlayerId : {
                text: "Chybný identifikační kód hráče"
            },
            badToken : {
                text: "Chybný token"
            },
            invalidToken : {
                text: "Neplatný token"
            },
            invalidRefId : {
                text: "Neplatný referenční identifikační kód"
            },
            invalidPlayerId : {
                text: "Neplatný identifikační kód hráče"
            },
            invalidRoundId : {
                text: "Neplatný identifikační kód kola"
            },
            expiredToken: {
                text: "Prošlý token"
            },
            duplicateId: {
                text: "Duplicitní identifikační kód"
            },
            duplicateRefId: {
                text: "Duplicitní referenční identifikační kód"
            },
            duplicateRoundId: {
                text: "Duplicitní identifikační kód kola"
            },
            roundAlreadyEnded: {
                text: "Kolo už skončilo"
            },
            unfinishedRoundsInSession: {
                text: "Nedokončená kola ve hře"
            },
            playerDoesNotHaveEnoughMoney: {
                text: "Hráč nemá dostatek peněz"
            },
            playerHasGoneAboveBetLimit: {
                text: "Hráč překročil sázecí limit"
            },
            playerBlocked: {
                text: "Váš účet je zablokován.\n Prosíme, kontaktujte zákaznickou podporu."
            },
            expiredSession: {
                text: "Hra skončila z důvodu neaktivity "
            },
            multipleConnectionsNotAllowed: {
                text: "Multiple connections are not allowed"
            }
        },
        da : {
            gameNotFound: {
                text: "Spil ikke fundet"
            },
            errorCode: {
                text: "Fejlkode"
            },
            connectionError: {
                text: "Forbindelsesfejl"
            },
            responsibleWagerLimit : {
                text: "Indsats mislykket\nEn af dine indsatsbegrænsninger er blevet overskredet"
            },
            responsibleDailyLimit : {
                text: "Indsats mislykket\nDin daglige indsatsbegrænsning er blevet overskredet"
            },
            responsibleWeeklyLimit : {
                text: "Indsats mislykket\nDin ugentlige indsatsbegrænsning er blevet overskredet"
            },
            responsibleMonthlyLimit : {
                text: "Indsats mislykket\nDin månedlige indsatsgrænse er blevet overskredet"
            },
            responsibleDailyNetLoss : {
                text: "Indsats mislykket\nDin daglige netto tabsgrænse er blevet overskredet"
            },
            responsibleWeeklyNetLoss : {
                text: "Indsats mislykket\nDin ugentlige netto tabsgrænse er blevet overskredet"
            },
            responsibleMonthlyNetLoss : {
                text: "Indsats mislykket\nDin månedlige netto tabsgrænse er blevet overskredet"
            },
            responsibleDailyLimitSetByYou : {
                text: "Grænse sat af dig"
            },
            responsibleWeeklyLimitSetByYou : {
                text: "Grænse sat af dig"
            },
            responsibleMonthlyLimitSetByYou : {
                text: "Grænse sat af dig"
            },
            responsibleTotalAmountWagered : {
                text: "Totalt beløb satset"
            },
            responsiblePotentialNetLoss : {
                text: "Potentielt nettotab"
            },
            networkNotResponding : {
                text: "NET SVARER IKKE.\nVENT VENLIGST"
            },
            internalServerError : {
                text: "Intern serverfejl"
            },
            badRequest : {
                text: "Ugyldig forespørgsel"
            },
            badPlayerId : {
                text: "Ugyldigt spillerID"
            },
            badToken : {
                text: "Ugyldig polet"
            },
            invalidToken : {
                text: "Ugyldig polet"
            },
            invalidRefId : {
                text: " Ugyldigt refId"
            },
            invalidPlayerId : {
                text: "Ugyldigt SpillerID"
            },
            invalidRoundId : {
                text: "Ugyldigt rundeID"
            },
            expiredToken: {
                text: "Udløbet polet"
            },
            duplicateId: {
                text: "Duplikat-id"
            },
            duplicateRefId: {
                text: "Duplikat refId"
            },
            duplicateRoundId: {
                text: "Duplikat rundeId"
            },
            roundAlreadyEnded: {
                text: "Runde allerede afsluttet"
            },
            unfinishedRoundsInSession: {
                text: "Ufærdige runder i sessionen"
            },
            playerDoesNotHaveEnoughMoney: {
                text: "Spiller har ikke nok penge"
            },
            playerHasGoneAboveBetLimit: {
                text: "Spiller er gået over indsatsgrænse"
            },
            playerBlocked: {
                text: "Din konto er blokeret.\n Kontakt venligst kundeservice"
            },
            expiredSession: {
                text: "Session udløbet på grund af inaktivitet"
            },
            multipleConnectionsNotAllowed: {
                text: "Multiple connections are not allowed"
            }
        },
    de : {
        gameNotFound: {
            text: "Spiel nicht gefunden"
        },
        errorCode: {
            text: "Fehler, Code"
        },
        connectionError: {
            text: "Verbindungsfehler"
        },
        responsibleWagerLimit : {
            text: "Einsatz nicht möglich\nEines Ihrer Einsatzlimits wurde überschritten"
        },
        responsibleDailyLimit : {
            text: "Einsatz nicht möglich\nIhr tägliches Einsatzlimit wurde überschritten"
        },
        responsibleWeeklyLimit : {
            text: "Einsatz nicht möglich\nIhr wöchentliches Einsatzlimit überschritten"
        },
        responsibleMonthlyLimit : {
            text: "Einsatz nicht möglich\nIhr monatliches Einsatzlimit überschritten"
        },
        responsibleDailyNetLoss : {
            text: "Einsatz nicht möglich\nIhr tägliches Verlustlimit könnte überschritten werden"
        },
        responsibleWeeklyNetLoss : {
            text: "Einsatz nicht möglich\nIhr wöchentliches Verlustlimit könnte\nüberschritten werden"
        },
        responsibleMonthlyNetLoss : {
            text: "Einsatz nicht möglich\nIhr monatliches Verlustlimit könnte überschritten werden"
        },
        responsibleDailyLimitSetByYou : {
            text: "Von Ihnen festgelegtes Limit"
        },
        responsibleWeeklyLimitSetByYou : {
            text: "Von Ihnen festgelegtes Limit"
        },
        responsibleMonthlyLimitSetByYou : {
            text: "Von Ihnen festgelegtes Limit"
        },
        responsibleTotalAmountWagered : {
            text: "Bereits getätigte Einsätze"
        },
        responsiblePotentialNetLoss : {
            text: "Potentieller Nettoverlust"
        },
        networkNotResponding : {
            text: "NETZWERK REAGIERT NICHT.\nBITTE WARTEN"
        },
        internalServerError : {
            text: "Interner Serverfehler"
        },
        badRequest : {
            text: "Falsche Anfrage"
        },
        badPlayerId : {
            text: "Falsche Spieler-ID"
        },
        badToken : {
            text: "Falscher Token"
        },
        invalidToken : {
            text: "Ungültiger Token"
        },
        invalidRefId : {
            text: "Ungültige Referenz-ID"
        },
        invalidPlayerId : {
            text: "Ungültige Spieler-ID"
        },
        invalidRoundId : {
            text: "Ungültige Runden-ID"
        },
        expiredToken: {
            text: "Abgelaufener Token"
        },
        duplicateId: {
            text: "Doppelte ID"
        },
        duplicateRefId: {
            text: "Doppelte Referenz-ID"
        },
        duplicateRoundId: {
            text: "Doppelte Runden-ID"
        },
        roundAlreadyEnded: {
            text: "Runde bereits beendet"
        },
        unfinishedRoundsInSession: {
            text: "Unvollendete Runden in der Sitzung"
        },
        playerDoesNotHaveEnoughMoney: {
            text: "Der Spieler hat nicht genug Geld"
        },
        playerHasGoneAboveBetLimit: {
            text: "Der Spieler hat das Einsatzlimit überschritten"
        },
        playerBlocked: {
            text: "Ihr Account ist gesperrt.\nBitte wenden Sie sich an den Kundendienst"
        },
        expiredSession: {
            text: "Die Sitzung ist aufgrund von Inaktivität abgelaufen"
        },
        multipleConnectionsNotAllowed: {
            text: "Multiple connections are not allowed"
        }
    },
    el : {
        gameNotFound: {
            text: "Game not found"
        },
        errorCode: {
            text: "Error, code"
        },
        connectionError: {
            text: "Connection Error"
        },
        responsibleWagerLimit : {
            text: "Wager Unsuccessful\nOne of your Wager Limits have been exceeded"
        },
        responsibleDailyLimit : {
            text: "Wager Unsuccessful\nYour Daily Wager Limit has been exceeded"
        },
        responsibleWeeklyLimit : {
            text: "Wager Unsuccessful\nYour Weekly Wager Limit has been exceeded"
        },
        responsibleMonthlyLimit : {
            text: "Wager Unsuccessful\nYour Monthly Wager Limit has been exceeded"
        },
        responsibleDailyNetLoss : {
            text: "Wager Unsuccessful\nYour Daily Net Loss Limit has been exceeded"
        },
        responsibleWeeklyNetLoss : {
            text: "Wager Unsuccessful\nYour Weekly Net Loss Limit has been exceeded"
        },
        responsibleMonthlyNetLoss : {
            text: "Wager Unsuccessful\nYour Monthly Net Loss Limit has been exceeded"
        },
        responsibleDailyLimitSetByYou : {
            text: "Limit set by you"
        },
        responsibleWeeklyLimitSetByYou : {
            text: "Limit set by you"
        },
        responsibleMonthlyLimitSetByYou : {
            text: "Limit set by you"
        },
        responsibleTotalAmountWagered : {
            text: "Total amount wagered"
        },
        responsiblePotentialNetLoss : {
            text: "Potential Net Loss"
        },
        networkNotResponding : {
            text: "NETWORK NOT RESPONDING.\nPLEASE WAIT"
        },
        internalServerError : {
            text: "Internal server error"
        },
        badRequest : {
            text: "Bad Request"
        },
        badPlayerId : {
            text: "Bad playerId"
        },
        badToken : {
            text: "Bad token"
        },
        invalidToken : {
            text: "Invalid token"
        },
        invalidRefId : {
            text: "Invalid refId"
        },
        invalidPlayerId : {
            text: "Invalid playerId"
        },
        invalidRoundId : {
            text: "Invalid roundId"
        },
        expiredToken: {
            text: "Expired token"
        },
        duplicateId: {
            text: "Duplicate id"
        },
        duplicateRefId: {
            text: "Duplicate refId"
        },
        duplicateRoundId: {
            text: "Duplicate roundId"
        },
        roundAlreadyEnded: {
            text: "Round already ended"
        },
        unfinishedRoundsInSession: {
            text: "Unfinished rounds in session"
        },
        playerDoesNotHaveEnoughMoney: {
            text: "Player does not have enough money"
        },
        playerHasGoneAboveBetLimit: {
            text: "Player has gone above bet limit"
        },
        playerBlocked: {
            text: "Your account is blocked.\nPlease contact customer support"
        },
        expiredSession: {
            text: "Session expired due to inactivity "
        },
        multipleConnectionsNotAllowed: {
            text: "Multiple connections are not allowed"
        }
    },
    es : {
        gameNotFound: {
            text: "Juego no encontrado"
        },
        errorCode: {
            text: "Error, código"
        },
        connectionError: {
            text: "Error de conexión"
        },
        responsibleWagerLimit : {
            text: "Apuesta no válida\nUna de tus apuesta excede los límites"
        },
        responsibleDailyLimit : {
            text: "Apuesta no válida\nTu límite de apuesta diario ha sido excedido"
        },
        responsibleWeeklyLimit : {
            text: "Apuesta no válida\nTu límite de apuesta semanal ha sido excedido"
        },
        responsibleMonthlyLimit : {
            text: "Apuesta no válida\nTu límite de apuesta mensual ha sido excedido"
        },
        responsibleDailyNetLoss : {
            text: "Apuesta no válida\nTu límite de pérdida diaria ha sido excedido"
        },
        responsibleWeeklyNetLoss : {
            text: "Apuesta no válida\nTu límite de pérdida semanal ha sido excedido"
        },
        responsibleMonthlyNetLoss : {
            text: "Apuesta no válida\nTu límite de pérdida mensual ha sido excedido."
        },
        responsibleDailyLimitSetByYou : {
            text: "Límite establecido por tí"
        },
        responsibleWeeklyLimitSetByYou : {
            text: "Límite establecido por tí"
        },
        responsibleMonthlyLimitSetByYou : {
            text: "Límite establecido por tí"
        },
        responsibleTotalAmountWagered : {
            text: "Cantidad total apostada"
        },
        responsiblePotentialNetLoss : {
            text: "Pérdida potencial"
        },
        networkNotResponding : {
            text: "LA RED NO RESPONDE.\nPOR FAVOR, ESPERE"
        },
        internalServerError : {
            text: "Error interno del servidor"
        },
        badRequest : {
            text: "Solicitud no válida"
        },
        badPlayerId : {
            text: "ID de jugador incorrecto"
        },
        badToken : {
            text: "Símbolo incorrecto"
        },
        invalidToken : {
            text: "Símbolo no válido"
        },
        invalidRefId : {
            text: "ID de referencia no válido"
        },
        invalidPlayerId : {
            text: "ID de jugador no válido"
        },
        invalidRoundId : {
            text: "ID de ronda/paritda no válido"
        },
        expiredToken: {
            text: "Símbolo caducado"
        },
        duplicateId: {
            text: "ID duplicado"
        },
        duplicateRefId: {
            text: "ID de referencia duplicado"
        },
        duplicateRoundId: {
            text: "ID de ronda/partida duplicado"
        },
        roundAlreadyEnded: {
            text: "La ronda/partida ha terminado"
        },
        unfinishedRoundsInSession: {
            text: "La ronda/partida sigue en marcha"
        },
        playerDoesNotHaveEnoughMoney: {
            text: "El jugador no tiene suficiente dinero"
        },
        playerHasGoneAboveBetLimit: {
            text: "El jugador ha sobrepasado el límite de apuesta"
        },
        playerBlocked: {
            text: "Tu cuenta ha sido bloqueada.\nPor favor, póngase en contacto con Servicio al Cliente"
        },
        expiredSession: {
            text: "La sesión ha caducado por inactividad"
        },
        multipleConnectionsNotAllowed: {
            text: "Multiple connections are not allowed"
        }
    },
    escl : {
        gameNotFound: {
            text: "Juego no encontrado"
        },
        errorCode: {
            text: "Código, error"
        },
        connectionError: {
            text: "Error de conexión"
        },
        responsibleWagerLimit : {
            text: "Apuesta sin éxito\nUno de tus límites de apuesta ha sido excedido"
        },
        responsibleDailyLimit : {
            text: "Apuesta sin éxito\nTu límite de apuestas diarias ha sido excedido"
        },
        responsibleWeeklyLimit : {
            text: "Apuesta sin éxito\nTu límite de apuestas semanales ha sido excedido"
        },
        responsibleMonthlyLimit : {
            text: "Apuesta sin éxito\nTu límite de apuestas mensuales ha sido excedido"
        },
        responsibleDailyNetLoss : {
            text: "Apuesta sin éxito\nSu límite diario de pérdidas netas ha sido excedido"
        },
        responsibleWeeklyNetLoss : {
            text: "Apuesta sin éxito\nSu límite semanal de pérdidas netas ha sido excedido"
        },
        responsibleMonthlyNetLoss : {
            text: "Apuesta sin éxito\nSu límite mensual de pérdidas netas ha sido excedido"
        },
        responsibleDailyLimitSetByYou : {
            text: "Límites establecidos por usted"
        },
        responsibleWeeklyLimitSetByYou : {
            text: "Límites establecidos por usted"
        },
        responsibleMonthlyLimitSetByYou : {
            text: "Límites establecidos por usted"
        },
        responsibleTotalAmountWagered : {
            text: "Suma total de la apuesta"
        },
        responsiblePotentialNetLoss : {
            text: "Pérdidas netas potenciales"
        },
        networkNotResponding : {
            text: "SIN RESPUESTA DE LA RED.\nPOR FAVOR ESPERE"
        },
        internalServerError : {
            text: "Error interno del servidor"
        },
        badRequest : {
            text: "Solicitud errónea"
        },
        badPlayerId : {
            text: "ID errónea del jugador"
        },
        badToken : {
            text: "Token erróneo"
        },
        invalidToken : {
            text: "Token inválido"
        },
        invalidRefId : {
            text: "Ref. ID errónea"
        },
        invalidPlayerId : {
            text: "ID del jugador erróneo"
        },
        invalidRoundId : {
            text: "ID de ronda inválido"
        },
        expiredToken: {
            text: "Token Caducado"
        },
        duplicateId: {
            text: "ID duplicada"
        },
        duplicateRefId: {
            text: "Ref. ID duplicada"
        },
        duplicateRoundId: {
            text: "ID de ronda duplicado"
        },
        roundAlreadyEnded: {
            text: "Ronda finalizada"
        },
        unfinishedRoundsInSession: {
            text: "Ronda sin finalizar en curso"
        },
        playerDoesNotHaveEnoughMoney: {
            text: "El jugador no tiene suficiente dinero"
        },
        playerHasGoneAboveBetLimit: {
            text: "El jugador ha excedido su límite de apuestas"
        },
        playerBlocked: {
            text: "Su cuenta ha sido bloqueada.\nPor favor, contacte atención al cliente"
        },
        expiredSession: {
            text: "La sesión ha caducado por falta de actividad"
        },
        multipleConnectionsNotAllowed: {
            text: "Multiple connections are not allowed"
        }
    },
    fi : {
        gameNotFound: {
            text: "Peliä ei löydy"
        },
        errorCode: {
            text: "Häiriö, koodi"
        },
        connectionError: {
            text: "Yhteyshäiriö"
        },
        responsibleWagerLimit : {
            text: "Panos epäonnistunut\nYksi panostusrajoistasi on ylittynyt"
        },
        responsibleDailyLimit : {
            text: "Panos epäonnistunut\nPäivittäinen panostusrajasi on ylittynyt"
        },
        responsibleWeeklyLimit : {
            text: "Panos epäonnistunut\nViikoittainen panostusrajasi on ylittynyt"
        },
        responsibleMonthlyLimit : {
            text: "Panos epäonnistunut\nKuukausittainen panostusrajasi on ylittynyt"
        },
        responsibleDailyNetLoss : {
            text: "Panos epäonnistunut\nPäivittäinen häviörajasi on ylittynyt"
        },
        responsibleWeeklyNetLoss : {
            text: "Panos epäonnistunut\nViikoittainen häviörajasi on ylittynyt"
        },
        responsibleMonthlyNetLoss : {
            text: "Panos epäonnistunut\nKuukausittainen häviörajasi on ylittynyt"
        },
        responsibleDailyLimitSetByYou : {
            text: "Asettamasi raja"
        },
        responsibleWeeklyLimitSetByYou : {
            text: "Asettamasi raja"
        },
        responsibleMonthlyLimitSetByYou : {
            text: "Asettamasi raja"
        },
        responsibleTotalAmountWagered : {
            text: "Panoksien kokonaismäärä"
        },
        responsiblePotentialNetLoss : {
            text: "Mahdollinen häviö"
        },
        networkNotResponding : {
            text: "HEIKKO VERKKOYHTEYS.\nODOTA HETKI"
        },
        internalServerError : {
            text: "Sisäinen palvelinhäiriö"
        },
        badRequest : {
            text: "Huono yhteys"
        },
        badPlayerId : {
            text: "Huono pelaajatunnus"
        },
        badToken : {
            text: "Huono poletti"
        },
        invalidToken : {
            text: "Toimimaton poletti"
        },
        invalidRefId : {
            text: "Toimimaton tuomaritunnus"
        },
        invalidPlayerId : {
            text: "Toimimaton pelaajtunnus"
        },
        invalidRoundId : {
            text: "Toimimaton kierrostunnus"
        },
        expiredToken: {
            text: "Vanhentunut poletti"
        },
        duplicateId: {
            text: "Kopio tunnus"
        },
        duplicateRefId: {
            text: "Kopioi tuomaritunnus"
        },
        duplicateRoundId: {
            text: "Kopioi kierrostunnus"
        },
        roundAlreadyEnded: {
            text: "Kierros päättynyt"
        },
        unfinishedRoundsInSession: {
            text: "Pelissä on keskeneräisiä kierroksia"
        },
        playerDoesNotHaveEnoughMoney: {
            text: "Pelaajalla ei ole tarpeeksi rahaa"
        },
        playerHasGoneAboveBetLimit: {
            text: "Pelaaja on ylittänyt rajan"
        },
        playerBlocked: {
            text: "Käyttäjätilisi on lukittu.\nOta yhteyttä asiakastukeen"
        },
        expiredSession: {
            text: "Pelaaja ei aktiivinen kierros on päättynyt"
        },
        multipleConnectionsNotAllowed: {
            text: "Multiple connections are not allowed"
        }
    },
    fr : {
        gameNotFound: {
            text: "Jeu non trouvé"
        },
        errorCode: {
            text: "Erreur, code"
        },
        connectionError: {
            text: "Erreur de connexion"
        },
        responsibleWagerLimit : {
            text: "Mise Refusée\nUne de vos limites de mises a été dépassée"
        },
        responsibleDailyLimit : {
            text: "Mise impossible\nVotre limite de mise quotidienne a été dépassée"
        },
        responsibleWeeklyLimit : {
            text: "Mise impossible\nVotre limise de mise hebdomadaire a été dépassée"
        },
        responsibleMonthlyLimit : {
            text: "Mise impossible\nVotre limite de mise mensuelle a été dépassée"
        },
        responsibleDailyNetLoss : {
            text: "Mise impossible\nVotre limite de perte nette quotidienne a été dépassée"
        },
        responsibleWeeklyNetLoss : {
            text: "Mise impossible\nVotre limite de perte nette hebdomadaire a été dépassée"
        },
        responsibleMonthlyNetLoss : {
            text: "Mise impossible\nVotre limite de perte nette mensuelle a été dépassée"
        },
        responsibleDailyLimitSetByYou : {
            text: "Limite fixée par vous"
        },
        responsibleWeeklyLimitSetByYou : {
            text: "Limite fixée par vous"
        },
        responsibleMonthlyLimitSetByYou : {
            text: "Limite fixée par vous"
        },
        responsibleTotalAmountWagered : {
            text: "Mise déjà placés"
        },
        responsiblePotentialNetLoss : {
            text: "Perte nette potentielle"
        },
        networkNotResponding : {
            text: "LE RÉSEAU NE FONCTIONNE.\nPAS VEUILLEZ ATTENDRE"
        },
        internalServerError : {
            text: "Erreur de Serveur Interne"
        },
        badRequest : {
            text: "Requête incorrecte"
        },
        badPlayerId : {
            text: "Identifiant de joueur incorrect"
        },
        badToken : {
            text: "Jeton incorrect"
        },
        invalidToken : {
            text: "Jeton non valide"
        },
        invalidRefId : {
            text: "Identifiant de ref non valide"
        },
        invalidPlayerId : {
            text: "Identifiant de joueur non valide"
        },
        invalidRoundId : {
            text: "Identifiant de partie non valide"
        },
        expiredToken: {
            text: "Jeton expiré"
        },
        duplicateId: {
            text: "Identifiant dupliqué"
        },
        duplicateRefId: {
            text: "Identifiant de ref dupliqué"
        },
        duplicateRoundId: {
            text: "Identifiant de partie dupliqué"
        },
        roundAlreadyEnded: {
            text: "La partie est déjà terminée"
        },
        unfinishedRoundsInSession: {
            text: "Parties non terminées en cours"
        },
        playerDoesNotHaveEnoughMoney: {
            text: "Le joueur n’a pas assez d'argent"
        },
        playerHasGoneAboveBetLimit: {
            text: "Le joueur a dépassé la limite de miste"
        },
        playerBlocked: {
            text: "Votre compte est bloqué.\nVeuillez contacter l'assistance client"
        },
        expiredSession: {
            text: "Votre session a expiré pour cause d’inactivité"
        },
        multipleConnectionsNotAllowed: {
            text: "Multiple connections are not allowed"
        }
    },
    hu : {
        gameNotFound: {
            text: "Játék nem található"
        },
        errorCode: {
            text: "Hiba, kód"
        },
        connectionError: {
            text: "Csatlakozási hiba"
        },
        responsibleWagerLimit : {
            text: "Érvénytelen fogadás\nTúllépte az egyik Fogadási Limit mértékét"
        },
        responsibleDailyLimit : {
            text: "Érvénytelen fogadás\nTúllépte a Napi Tét Limit mértékét"
        },
        responsibleWeeklyLimit : {
            text: "Érvénytelen fogadás\nTúllépte a Heti Tét Limit mértékét"
        },
        responsibleMonthlyLimit : {
            text: "Érvénytelen fogadás\nTúllépte a Havi Tét Limit mértékét"
        },
        responsibleDailyNetLoss : {
            text: "Érvénytelen fogadás\nTúllépte a Napi Teljes Veszteség Limit mértékét"
        },
        responsibleWeeklyNetLoss : {
            text: "Érvénytelen fogadás\nTúllépte a Heti Teljes Veszteség Limit mértékét"
        },
        responsibleMonthlyNetLoss : {
            text: "Érvénytelen fogadás\nTúllépte a Havi Teljes Veszteség Limit mértékét"
        },
        responsibleDailyLimitSetByYou : {
            text: "Limit Ön által beállítva"
        },
        responsibleWeeklyLimitSetByYou : {
            text: "Limit Ön által beállítva"
        },
        responsibleMonthlyLimitSetByYou : {
            text: "Limit Ön által beállítva"
        },
        responsibleTotalAmountWagered : {
            text: "Teljes összeg feltéve"
        },
        responsiblePotentialNetLoss : {
            text: "Lehetséges Teljes Veszteség"
        },
        networkNotResponding : {
            text: "A HÁLÓZAT NEM VÁLASZOL.\nKÉREM VÁRJON"
        },
        internalServerError : {
            text: "Belső szerverhiba"
        },
        badRequest : {
            text: "Hibás kérelem"
        },
        badPlayerId : {
            text: "Hibás játékos azonosító"
        },
        badToken : {
            text: "Rossz token"
        },
        invalidToken : {
            text: "Érvénytelen token"
        },
        invalidRefId : {
            text: "Érvénytelen refId"
        },
        invalidPlayerId : {
            text: "Érvénytelen játékos azonosító"
        },
        invalidRoundId : {
            text: "Érvénytelen roundId"
        },
        expiredToken: {
            text: "Lejárt token"
        },
        duplicateId: {
            text: "id duplikálás"
        },
        duplicateRefId: {
            text: "refId duplikálás"
        },
        duplicateRoundId: {
            text: "roundId duplikálás"
        },
        roundAlreadyEnded: {
            text: "A kör már véget ért"
        },
        unfinishedRoundsInSession: {
            text: "Befejezetlen körök folyamatban"
        },
        playerDoesNotHaveEnoughMoney: {
            text: "Játékosnak nincs elég pénze"
        },
        playerHasGoneAboveBetLimit: {
            text: "Játékos túllépte a tét limitet"
        },
        playerBlocked: {
            text: "A profilja le van tiltva. Kérem, keresse fel az Ügyfélszolgálatot."
        },
        expiredSession: {
            text: "Munkafolyamat inaktivitás miatt lejárt"
        },
        multipleConnectionsNotAllowed: {
            text: "Multiple connections are not allowed"
        }
    },
    it : {
        gameNotFound: {
            text: "Gioco non trovato"
        },
        errorCode: {
            text: "Errore, codice"
        },
        connectionError: {
            text: "Errore  di connesione"
        },
        responsibleWagerLimit : {
            text: "Scommessa non riuscita\nUno dei tuoi limiti di scommessa è stato superato"
        },
        responsibleDailyLimit : {
            text: "Scommessa non riuscita\nIl limite giornaliero di scommessa è stato superato"
        },
        responsibleWeeklyLimit : {
            text: "Scommessa non riuscita\nIl limite settimanale di scommessa è stato superato"
        },
        responsibleMonthlyLimit : {
            text: "Scommessa non riuscita\nIl limite mensile di scommessa è stato superato"
        },
        responsibleDailyNetLoss : {
            text: "Scommessa non riuscita\nIl limite giornaliero di perdita netta è stato superato"
        },
        responsibleWeeklyNetLoss : {
            text: "Scommessa non riuscita\nIl limite settimanale di perdita netta è stato superato"
        },
        responsibleMonthlyNetLoss : {
            text: "Scommessa non riuscita\nIl limite mensile di perdita netta è stato superato"
        },
        responsibleDailyLimitSetByYou : {
            text: "Limite stabilito da lei"
        },
        responsibleWeeklyLimitSetByYou : {
            text: "Limite stabilito da lei"
        },
        responsibleMonthlyLimitSetByYou : {
            text: "Limite stabilito da lei"
        },
        responsibleTotalAmountWagered : {
            text: "Scommesse già piazzate"
        },
        responsiblePotentialNetLoss : {
            text: "Potenziale perdita netta"
        },
        networkNotResponding : {
            text: "MANCATA RISPOSTA DELLA RETE.\nATTENDI"
        },
        internalServerError : {
            text: "Errore interno del server"
        },
        badRequest : {
            text: "Richiesta non valida"
        },
        badPlayerId : {
            text: "ID giocatore errato"
        },
        badToken : {
            text: "Gettone difettoso"
        },
        invalidToken : {
            text: "Gettone non valido"
        },
        invalidRefId : {
            text: "Codice Ref non valido"
        },
        invalidPlayerId : {
            text: "Codice giocatore non valido"
        },
        invalidRoundId : {
            text: "Codice giro non valido"
        },
        expiredToken: {
            text: "Gettone scaduto"
        },
        duplicateId: {
            text: "Codice duplicato"
        },
        duplicateRefId: {
            text: "Codice Ref duplicato"
        },
        duplicateRoundId: {
            text: "Codice giro duplicato"
        },
        roundAlreadyEnded: {
            text: "Il giro è già terminato"
        },
        unfinishedRoundsInSession: {
            text: "Giri incompiuti in sessione"
        },
        playerDoesNotHaveEnoughMoney: {
            text: "Il giocatore non ha abbastanza soldi"
        },
        playerHasGoneAboveBetLimit: {
            text: "Il giocatore ha superato il limite di puntata"
        },
        playerBlocked: {
            text: "Il tuo conto è bloccato.\nContatta l'assistenza clienti"
        },
        expiredSession: {
            text: "Sessione scaduta per inattività"
        },
        multipleConnectionsNotAllowed: {
            text: "Multiple connections are not allowed"
        }
    },
    ja : {
        gameNotFound: {
            text: "ゲームが見つかりません"
        },
        errorCode: {
            text: "エラー、コード"
        },
        connectionError: {
            text: "接続エラー"
        },
        responsibleWagerLimit : {
            text: "賭けは失敗しました\n賭けの上限のひとつを超えました"
        },
        responsibleDailyLimit : {
            text: "賭けは失敗しました\n１日の賭けの上限を超えました"
        },
        responsibleWeeklyLimit : {
            text: "賭けは失敗しました\n１週間の賭けの制限を超えました"
        },
        responsibleMonthlyLimit : {
            text: "賭けは失敗しました\n１ヶ月の賭けの制限を超えました"
        },
        responsibleDailyNetLoss : {
            text: "賭けは失敗しました\n１日の純損失制限を超えました"
        },
        responsibleWeeklyNetLoss : {
            text: "賭けは失敗しました\n１週間の純損失制限を超えました"
        },
        responsibleMonthlyNetLoss : {
            text: "賭けは失敗しました\n１ヶ月の純損失制限を超えました"
        },
        responsibleDailyLimitSetByYou : {
            text: "あなたが設定した制限"
        },
        responsibleWeeklyLimitSetByYou : {
            text: "あなたが設定した制限"
        },
        responsibleMonthlyLimitSetByYou : {
            text: "あなたが設定した制限"
        },
        responsibleTotalAmountWagered : {
            text: "賭けの総額"
        },
        responsiblePotentialNetLoss : {
            text: "潜在的な純損失"
        },
        networkNotResponding : {
            text: "ネットワークが応答していません。\nしばらくお待ちください。"
        },
        internalServerError : {
            text: "内部サーバーエラー"
        },
        badRequest : {
            text: "不正な要求"
        },
        badPlayerId : {
            text: "不正なプレイヤーID"
        },
        badToken : {
            text: "不正なトークン"
        },
        invalidToken : {
            text: "無効なトークン"
        },
        invalidRefId : {
            text: "無効なリファレンスID"
        },
        invalidPlayerId : {
            text: "無効なプレイヤーID"
        },
        invalidRoundId : {
            text: "無効なラウンドID"
        },
        expiredToken: {
            text: "期限切れのトークン"
        },
        duplicateId: {
            text: "重複したID"
        },
        duplicateRefId: {
            text: "重複したリファレンスID"
        },
        duplicateRoundId: {
            text: "重複したラウンドID"
        },
        roundAlreadyEnded: {
            text: "ラウンドはすでに終了しています。"
        },
        unfinishedRoundsInSession: {
            text: "セッション中の未完了ラウンド"
        },
        playerDoesNotHaveEnoughMoney: {
            text: "プレイヤーに十分なお金がありません。"
        },
        playerHasGoneAboveBetLimit: {
            text: "プレーヤーはベット制限を超えました。"
        },
        playerBlocked: {
            text: "アカウントがブロックされています。\nカスタマーサポートにお問い合わせください。"
        },
        expiredSession: {
            text: "非アクティブのためセッションが期限切れになりました。"
        },
        multipleConnectionsNotAllowed: {
            text: "Multiple connections are not allowed"
        }
    },
    no : {
        gameNotFound: {
            text: "Spill ikke funnet"
        },
        errorCode: {
            text: "Feil, kode"
        },
        connectionError: {
            text: "Tilkoblingsfeil"
        },
        responsibleWagerLimit : {
            text: "Mislykket Innsats\nEn av Dine Innsatsgrenser er Overskredet"
        },
        responsibleDailyLimit : {
            text: "Mislykket Innsats\nDin Daglige Innsats Grense er Overskredet"
        },
        responsibleWeeklyLimit : {
            text: "Mislykket Innsats\nDin Ukentlige Innsats grense er Overskredet"
        },
        responsibleMonthlyLimit : {
            text: "Mislykket Innsats\nDin Månedlige Innsats Grense er Overskredet"
        },
        responsibleDailyNetLoss : {
            text: "Mislykket Innsats\nDin Daglige Netto Tapsgrense er Overskredet"
        },
        responsibleWeeklyNetLoss : {
            text: "Mislykket Innsats\nDin Ukentlige Netto Tapsgrense er Overskredet"
        },
        responsibleMonthlyNetLoss : {
            text: "Mislykket Innsats\nDin Månedlige Netto Tapsgrense er Overskredet"
        },
        responsibleDailyLimitSetByYou : {
            text: "Grense satt av deg"
        },
        responsibleWeeklyLimitSetByYou : {
            text: "Grense satt av deg"
        },
        responsibleMonthlyLimitSetByYou : {
            text: "Grense satt av deg"
        },
        responsibleTotalAmountWagered : {
            text: "Totalt beløp satset"
        },
        responsiblePotentialNetLoss : {
            text: "Potensielt Netto Tap"
        },
        networkNotResponding : {
            text: "NETTVERK SVARER IKKE.\nVENNLIGST VENT"
        },
        internalServerError : {
            text: "Intern serverfeil"
        },
        badRequest : {
            text: "Ugyldig Forespørsel"
        },
        badPlayerId : {
            text: "Ugyldig spill id"
        },
        badToken : {
            text: "Ugyldig spillemynt"
        },
        invalidToken : {
            text: "Ugyldig spillemynt"
        },
        invalidRefId : {
            text: "Ugyldig referanse id"
        },
        invalidPlayerId : {
            text: "Ugyldig spill id"
        },
        invalidRoundId : {
            text: "Ugyldig runde id"
        },
        expiredToken: {
            text: "Utgått spillemynt"
        },
        duplicateId: {
            text: "Duplisert id"
        },
        duplicateRefId: {
            text: "Duplisert referanse id"
        },
        duplicateRoundId: {
            text: "Duplisert runde id"
        },
        roundAlreadyEnded: {
            text: "Runden er allerede avsluttet"
        },
        unfinishedRoundsInSession: {
            text: "Uferdige runder i økten"
        },
        playerDoesNotHaveEnoughMoney: {
            text: "Spilleren har ikke nok penger"
        },
        playerHasGoneAboveBetLimit: {
            text: "Spilleren har overskredet innsats grensen"
        },
        playerBlocked: {
            text: "Din konto er blokkert.\nVennligst kontakt kundestøtte"
        },
        expiredSession: {
            text: "Økten er utgått grunnet inaktivitet"
        },
        multipleConnectionsNotAllowed: {
            text: "Multiple connections are not allowed"
        }
    },
    pl : {
        gameNotFound: {
            text: "Brak wyników"
        },
        errorCode: {
            text: "Kod błędu"
        },
        connectionError: {
            text: "Nie nawiązano połączenia"
        },
        responsibleWagerLimit : {
            text: "Zakład nieprzyjęty\nZostał przekroczony jeden z limitów zakładu"
        },
        responsibleDailyLimit : {
            text: "Zakład nieprzyjęty\nZostał przekroczony dzienny limit zakładu"
        },
        responsibleWeeklyLimit : {
            text: "Zakład nieprzyjęty\nZostał przekroczony tygodniowy limit zakładu"
        },
        responsibleMonthlyLimit : {
            text: "Zakład nieprzyjęty\nZostał przekroczony miesięczny limit zakładu"
        },
        responsibleDailyNetLoss : {
            text: "Zakład nieprzyjęty\nZostał przekroczony dzienny limit strat"
        },
        responsibleWeeklyNetLoss : {
            text: "Zakład nieprzyjęty\nZostał przekroczony tygodniowy limit strat"
        },
        responsibleMonthlyNetLoss : {
            text: "Zakład nieprzyjęty\nZostał przekroczony miesięczny limit strat"
        },
        responsibleDailyLimitSetByYou : {
            text: "Twój limit"
        },
        responsibleWeeklyLimitSetByYou : {
            text: "Twój limit"
        },
        responsibleMonthlyLimitSetByYou : {
            text: "Twój limit"
        },
        responsibleTotalAmountWagered : {
            text: "Suma zakładów"
        },
        responsiblePotentialNetLoss : {
            text: "Potencjalna strata"
        },
        networkNotResponding : {
            text: "SIEĆ NIE ODPOWIADA.\nPROSZĘ CZEKAĆ"
        },
        internalServerError : {
            text: "Wewnętrzny błąd serwera"
        },
        badRequest : {
            text: "Nieprawidłowe żądanie"
        },
        badPlayerId : {
            text: "Błędny identyfikator użytkownika"
        },
        badToken : {
            text: "Nieprawidłowy token"
        },
        invalidToken : {
            text: "Nieważny token"
        },
        invalidRefId : {
            text: "Nieprawidłowy numer referencyjny"
        },
        invalidPlayerId : {
            text: "Nieprawidłowy identyfikator użytkownika"
        },
        invalidRoundId : {
            text: "Nieprawidłowy identyfikator rundy"
        },
        expiredToken: {
            text: "Token wygasł"
        },
        duplicateId: {
            text: "Podany identyfikator użytkownika już istnieje"
        },
        duplicateRefId: {
            text: "Podany numer referencyjny już istnieje"
        },
        duplicateRoundId: {
            text: "Podany identyfikator rundy już istnieje"
        },
        roundAlreadyEnded: {
            text: "Runda zakończona"
        },
        unfinishedRoundsInSession: {
            text: "Masz niedokończone rundy"
        },
        playerDoesNotHaveEnoughMoney: {
            text: "Gracz nie ma wystarczających środków na koncie"
        },
        playerHasGoneAboveBetLimit: {
            text: "Gracz przekroczył limit zakładu"
        },
        playerBlocked: {
            text: "Twoje konto zostało zablokowane.\nSkontaktuj się z działem obsługi klienta"
        },
        expiredSession: {
            text: "Twoja sesja wygasła"
        },
        multipleConnectionsNotAllowed: {
            text: "Multiple connections are not allowed"
        }
    },
    pt : {
        gameNotFound: {
            text: "Jogo não encontrado"
        },
        errorCode: {
            text: "Erro, código"
        },
        connectionError: {
            text: "Erro de Conexão"
        },
        responsibleWagerLimit : {
            text: "Aposta malsucessida\nUm dos Limites de Aposta foi ultrapassado"
        },
        responsibleDailyLimit : {
            text: "Aposta malsucessida\nO seu Limite Diário de Aposta foi ultrapassado"
        },
        responsibleWeeklyLimit : {
            text: "Aposta malsucessida\nO seu Limite Semanal de Aposta foi ultrapassado"
        },
        responsibleMonthlyLimit : {
            text: "Aposta malsucessida\nO seu Limite Mensal de Aposta foi ultrapassado"
        },
        responsibleDailyNetLoss : {
            text: "Aposta malsucessida\nO seu Limite de Perdas Líquidas Diárias foi ultrapassado"
        },
        responsibleWeeklyNetLoss : {
            text: "Aposta malsucessida\nO seu Limite de Perdas Líquidas Semanal foi ultrapassado"
        },
        responsibleMonthlyNetLoss : {
            text: "Aposta malsucessida\nO seu Limite de Perdas Líquidas Mensal foi ultrapassado"
        },
        responsibleDailyLimitSetByYou : {
            text: "Limite definido por si"
        },
        responsibleWeeklyLimitSetByYou : {
            text: "Limite definido por si"
        },
        responsibleMonthlyLimitSetByYou : {
            text: "Limite definido por si"
        },
        responsibleTotalAmountWagered : {
            text: "Montante total apostado"
        },
        responsiblePotentialNetLoss : {
            text: "Perdas Líquidas Potenciais"
        },
        networkNotResponding : {
            text: "A NETWORK NÃO ESTÁ A RESPONDER.\nPOR FAVOR AGUARDE"
        },
        internalServerError : {
            text: "Erro no servidor interno"
        },
        badRequest : {
            text: "Bad Request"
        },
        badPlayerId : {
            text: "Bad playerId"
        },
        badToken : {
            text: "Bad token"
        },
        invalidToken : {
            text: "Token inválido"
        },
        invalidRefId : {
            text: "RefId inválido"
        },
        invalidPlayerId : {
            text: "PlayerId inválido"
        },
        invalidRoundId : {
            text: "RoundId inválido"
        },
        expiredToken: {
            text: "Token expirado"
        },
        duplicateId: {
            text: "Id duplicado"
        },
        duplicateRefId: {
            text: "RefId duplicado"
        },
        duplicateRoundId: {
            text: "RoundId duplicado "
        },
        roundAlreadyEnded: {
            text: "Ronda já terminada"
        },
        unfinishedRoundsInSession: {
            text: "Rondas inacabadas na sessão"
        },
        playerDoesNotHaveEnoughMoney: {
            text: "O jogador não têm dinheiro suficiente"
        },
        playerHasGoneAboveBetLimit: {
            text: "O jogador ultrapassou o limite de aposta"
        },
        playerBlocked: {
            text: "A sua conta está bloqueada.\nPor favor contacte o apoio ao cliente"
        },
        expiredSession: {
            text: "A sessão expirou devido a inatividade"
        },
        multipleConnectionsNotAllowed: {
            text: "Multiple connections are not allowed"
        }
    },
    ro : {
        gameNotFound: {
            text: "Jocul nu a fost găsit"
        },
        errorCode: {
            text: "Eroare de cod "
        },
        connectionError: {
            text: "Eroare de conexiune"
        },
        responsibleWagerLimit : {
            text: "Pariu nereușit\nUna dintre limitele tale de pariere a fost depășită"
        },
        responsibleDailyLimit : {
            text: "Pariu nereușit\nLimita ta zilnică de pariere a fost depășită "
        },
        responsibleWeeklyLimit : {
            text: "Pariu nereușit\nLimita ta săptămânală de pariere a fost depășită "
        },
        responsibleMonthlyLimit : {
            text: "Pariu nereușit\nLimita ta lunară de pariere a fost depășită "
        },
        responsibleDailyNetLoss : {
            text: "Pariu nereușit\nLimita ta de pierderi nete zilnice a fost depășită "
        },
        responsibleWeeklyNetLoss : {
            text: "Pariu nereușit\nLimita ta de pierderi nete săptămânale a fost depășită"
        },
        responsibleMonthlyNetLoss : {
            text: "Pariu nereușit\nLimita ta de pierderi nete lunare a fost depășită"
        },
        responsibleDailyLimitSetByYou : {
            text: "Limită setată de tine"
        },
        responsibleWeeklyLimitSetByYou : {
            text: "Limită setată de tine"
        },
        responsibleMonthlyLimitSetByYou : {
            text: "Limită setată de tine"
        },
        responsibleTotalAmountWagered : {
            text: "Sumă totală pariată"
        },
        responsiblePotentialNetLoss : {
            text: "Pierderi nete potențiale"
        },
        networkNotResponding : {
            text: "REȚEAUA NU RĂSPUNDE.\nTE ROG AȘTEAPTĂ"
        },
        internalServerError : {
            text: "Eroare internă de server"
        },
        badRequest : {
            text: "Cerere nereușită"
        },
        badPlayerId : {
            text: "ID de jucător greșit"
        },
        badToken : {
            text: "Token greșit"
        },
        invalidToken : {
            text: "Token invalid"
        },
        invalidRefId : {
            text: "Refld invalid"
        },
        invalidPlayerId : {
            text: "ID de jucător invalid"
        },
        invalidRoundId : {
            text: "RoundID invalid"
        },
        expiredToken: {
            text: "Token expirat"
        },
        duplicateId: {
            text: "ID duplicat"
        },
        duplicateRefId: {
            text: "Refld duplicat"
        },
        duplicateRoundId: {
            text: "RoundID duplicat"
        },
        roundAlreadyEnded: {
            text: "Runda deja s-a încheiat"
        },
        unfinishedRoundsInSession: {
            text: "Runde neterminate în sesiunea de joc"
        },
        playerDoesNotHaveEnoughMoney: {
            text: "Jucătorul are fonduri insuficiente"
        },
        playerHasGoneAboveBetLimit: {
            text: "Jucătorul a depășit limita de pariere"
        },
        playerBlocked: {
            text: "Contul tău este blocat.\nTe rog contactează echipa de suport"
        },
        expiredSession: {
            text: "Sesiunea a expirat din cauza inactivității"
        },
        multipleConnectionsNotAllowed: {
            text: "Multiple connections are not allowed"
        }
    },
    ru : {
        gameNotFound: {
            text: "Игра не найдена"
        },
        errorCode: {
            text: "Ошибка, код"
        },
        connectionError: {
            text: "Ошибка соединения"
        },
        responsibleWagerLimit : {
            text: "Ставку сделать не удалось\nОдин из лимитов вашей ставки превышен"
        },
        responsibleDailyLimit : {
            text: "Ставку сделать не удалось\nВаш ежедневный лимит ставок превышен"
        },
        responsibleWeeklyLimit : {
            text: "Ставку сделать не удалось\nВаш еженедельный лимит ставок превышен"
        },
        responsibleMonthlyLimit : {
            text: "Ставку сделать не удалось\nВаш ежемесячный лимит ставок превышен"
        },
        responsibleDailyNetLoss : {
            text: "Ставку сделать не удалось\nВаш ежедневный лимит потерь превышен"
        },
        responsibleWeeklyNetLoss : {
            text: "Ставку сделать не удалось\nВаш еженедельный лимит потерь превышен"
        },
        responsibleMonthlyNetLoss : {
            text: "Ставку сделать не удалось\nВаш ежемесячный лимит потерь превышен"
        },
        responsibleDailyLimitSetByYou : {
            text: "Лимит настроен вами"
        },
        responsibleWeeklyLimitSetByYou : {
            text: "Лимит настроен вами"
        },
        responsibleMonthlyLimitSetByYou : {
            text: "Лимит настроен вами"
        },
        responsibleTotalAmountWagered : {
            text: "Общая сумма ставок"
        },
        responsiblePotentialNetLoss : {
            text: "Потенциальная сумма всех потерь"
        },
        networkNotResponding : {
            text: "СЕТЬ НЕ ОТВЕЧАЕТ.\nПОДОЖДИТЕ, ПОЖАЛУЙСТА"
        },
        internalServerError : {
            text: "Внутренняя ошибка сервера"
        },
        badRequest : {
            text: "Запрос не существует"
        },
        badPlayerId : {
            text: "Игрок не существует"
        },
        badToken : {
            text: "Токен не существует"
        },
        invalidToken : {
            text: "Токен недействителен"
        },
        invalidRefId : {
            text: "Поле недействительно"
        },
        invalidPlayerId : {
            text: "Игрок недействителен"
        },
        invalidRoundId : {
            text: "Раунд недействителен"
        },
        expiredToken: {
            text: "Срок действия токена истек"
        },
        duplicateId: {
            text: "Идентификационный номер дублирован"
        },
        duplicateRefId: {
            text: "Идентификационный номер поля дублирован"
        },
        duplicateRoundId: {
            text: "Идентификационный номер раунда дублирован"
        },
        roundAlreadyEnded: {
            text: "Раунд уже завершен"
        },
        unfinishedRoundsInSession: {
            text: "Незавершённые раунды в процессе"
        },
        playerDoesNotHaveEnoughMoney: {
            text: "У игрока недостаточно денег"
        },
        playerHasGoneAboveBetLimit: {
            text: "Игрок превысил лимит ставок "
        },
        playerBlocked: {
            text: "Ваш аккаунт заблокирован.\nСвяжитесь, пожалуйста, со службой поддержки"
        },
        expiredSession: {
            text: "Сессия завершена из-за бездействия"
        },
        multipleConnectionsNotAllowed: {
            text: "Multiple connections are not allowed"
        }
    },
    sk : {
        gameNotFound: {
            text: "Hra nebola nájdená"
        },
        errorCode: {
            text: "Chyba, kód"
        },
        connectionError: {
            text: "Chyba pripojenia"
        },
        responsibleWagerLimit : {
            text: "Stávka sa nepodarila\nPrekročili ste jeden zo stávkových limitov"
        },
        responsibleDailyLimit : {
            text: "Stávka sa nepodarila\nPrekročili ste svoj denný stávkový limit"
        },
        responsibleWeeklyLimit : {
            text: "Stávka sa nepodarila\nPrekročili ste svoj týždenný stávkový limit"
        },
        responsibleMonthlyLimit : {
            text: "Stávka sa nepodarila\nPrekročili ste svoj mesačný stávkový limit"
        },
        responsibleDailyNetLoss : {
            text: "Stávka sa nepodarila\nPrekročili ste svoj denný stratový limit"
        },
        responsibleWeeklyNetLoss : {
            text: "Stávka sa nepodarila\nPrekročili ste svoj týždenný stratový limit"
        },
        responsibleMonthlyNetLoss : {
            text: "Stávka sa nepodarila\nPrekročili ste svoj mesačný stratový limit"
        },
        responsibleDailyLimitSetByYou : {
            text: "Vami zvolený limit"
        },
        responsibleWeeklyLimitSetByYou : {
            text: "Vami zvolený limit"
        },
        responsibleMonthlyLimitSetByYou : {
            text: "Vami zvolený limit"
        },
        responsibleTotalAmountWagered : {
            text: "Celková hodnota stávok"
        },
        responsiblePotentialNetLoss : {
            text: "Potenciálna strana"
        },
        networkNotResponding : {
            text: "Sieť nereaguje.\nPočkajte prosím"
        },
        internalServerError : {
            text: "Vnútorná chyba servera"
        },
        badRequest : {
            text: "Chybná požiadavka"
        },
        badPlayerId : {
            text: "Chybná identifikácia hráča"
        },
        badToken : {
            text: "Chybný token"
        },
        invalidToken : {
            text: "Neplatný token"
        },
        invalidRefId : {
            text: "Neplatné refId"
        },
        invalidPlayerId : {
            text: "Neplátna identifikácia hráča"
        },
        invalidRoundId : {
            text: "Neplatná roundId"
        },
        expiredToken: {
            text: "Expirovaný token"
        },
        duplicateId: {
            text: "Duplikát id"
        },
        duplicateRefId: {
            text: "Duplikát refId"
        },
        duplicateRoundId: {
            text: "Duplikát roundId"
        },
        roundAlreadyEnded: {
            text: "Kolo je už ukončené"
        },
        unfinishedRoundsInSession: {
            text: "Prebiehajú nedokončené kolá"
        },
        playerDoesNotHaveEnoughMoney: {
            text: "Hráč nemá dostatok peňazí"
        },
        playerHasGoneAboveBetLimit: {
            text: "Hráč prekročil limit stávky"
        },
        playerBlocked: {
            text: "Váš účet je zablokovaný.\nProsím kontaktujte zákaznícku podporu."
        },
        expiredSession: {
            text: "Hra sa ukončila kvôli nedostatku aktivity"
        },
        multipleConnectionsNotAllowed: {
            text: "Multiple connections are not allowed"
        }
    },
    sv : {
        gameNotFound: {
            text: "Spel ej hittat"
        },
        errorCode: {
            text: "Fel, kod"
        },
        connectionError: {
            text: "Kontaktfel"
        },
        responsibleWagerLimit : {
            text: "Insats misslyckad\nEn av dina insatsgränser har överstigits"
        },
        responsibleDailyLimit : {
            text: "Insats misslyckad\nDin dagliga insatsgräns har överstigits"
        },
        responsibleWeeklyLimit : {
            text: "Insats misslyckad\nDin veckogräns har överstigits"
        },
        responsibleMonthlyLimit : {
            text: "Insats misslyckad\nDin månadsgräns har överstigits"
        },
        responsibleDailyNetLoss : {
            text: "Insats misslyckad\nDin dagliga nettoförlustgräns har överstigits"
        },
        responsibleWeeklyNetLoss : {
            text: "Insats misslyckad\nDin nettoförlustgräns per vecka har överstigits"
        },
        responsibleMonthlyNetLoss : {
            text: "Insats misslyckad\nDin nettoförlustgräns per månad har överstigits"
        },
        responsibleDailyLimitSetByYou : {
            text: "Gränser satta av dig"
        },
        responsibleWeeklyLimitSetByYou : {
            text: "Gränser satta av dig"
        },
        responsibleMonthlyLimitSetByYou : {
            text: "Gränser satta av dig"
        },
        responsibleTotalAmountWagered : {
            text: "Total summa omsatt"
        },
        responsiblePotentialNetLoss : {
            text: "Potentiell Nettoförlust"
        },
        networkNotResponding : {
            text: "NÄTVERKET SVARAR INTE.\nVAR GOD VÄNTA"
        },
        internalServerError : {
            text: "Intern server error"
        },
        badRequest : {
            text: "Felaktig begäran"
        },
        badPlayerId : {
            text: "Felaktigt spelarId"
        },
        badToken : {
            text: "Felaktig token"
        },
        invalidToken : {
            text: "Ogiltig token"
        },
        invalidRefId : {
            text: "Ogiltig refId"
        },
        invalidPlayerId : {
            text: "Ogiltig spelarId"
        },
        invalidRoundId : {
            text: "Ogiltig rundId"
        },
        expiredToken: {
            text: "Utgången token"
        },
        duplicateId: {
            text: "Duplicerad id"
        },
        duplicateRefId: {
            text: "Duplicerad refId"
        },
        duplicateRoundId: {
            text: "Duplicerad spelrundaId"
        },
        roundAlreadyEnded: {
            text: "Spelrunda redan avslutad"
        },
        unfinishedRoundsInSession: {
            text: "Oavslutade omgångar i session"
        },
        playerDoesNotHaveEnoughMoney: {
            text: "Spelaren har ej tillräckligt med pengarl"
        },
        playerHasGoneAboveBetLimit: {
            text: "Spelaren har överstigit bett limit"
        },
        playerBlocked: {
            text: "Ert konto har blivit blockerat\nvänligen kontakta kundtjänst"
        },
        expiredSession: {
            text: "Session har utgått på grund av inaktivitet"
        },
        multipleConnectionsNotAllowed: {
            text: "Multiple connections are not allowed"
        }
    },
    th : {
        gameNotFound: {
            text: "ไม่พบเกมนี้"
        },
        errorCode: {
            text: "code ผิดพลาด"
        },
        connectionError: {
            text: "การเชื่อมต่อขัดข้อง"
        },
        responsibleWagerLimit : {
            text: "วางเดิมพันไม่สำเร็จ\nหนึ่งในการเดิมพันของคุณถึงขีดจำกัดแล้ว"
        },
        responsibleDailyLimit : {
            text: "วางเดิมพันไม่สำเร็จ\nการเดิมพันของคุณในวันนี้ถึงขีดจำกัดแล้ว"
        },
        responsibleWeeklyLimit : {
            text: "วางเดิมพันไม่สำเร็จ\nการเดิมพันของคุณในอาทิตย์นี้ได้ถึงขีดจำกัดแล้ว"
        },
        responsibleMonthlyLimit : {
            text: "วางเดิมพันไม่สำเร็จ\nการเดิมพันของคุณในเดือนนี้ได้ถึงขีดจำกัดแล้ว"
        },
        responsibleDailyNetLoss : {
            text: "วางเดิมพันไม่สำเร็จ\nยอดเสียสะสมประจำวันของคุณได้ถึงขีดจำกัดแล้ว"
        },
        responsibleWeeklyNetLoss : {
            text: "วางเดิมพันไม่สำเร็จ\nยอดเสียสะสมประจำอาทิตย์ของคุณได้ถึงขีดจำกัดแล้ว"
        },
        responsibleMonthlyNetLoss : {
            text: "วางเดิมพันไม่สำเร็จ\nยอดเสียสะสมประจำเดือนของคุณได้ถึงขีดจำกัดแล้ว"
        },
        responsibleDailyLimitSetByYou : {
            text: "ตั้งขีดจำกัดด้วยตัวคุณเอง"
        },
        responsibleWeeklyLimitSetByYou : {
            text: "ตั้งขีดจำกัดด้วยตัวคุณเอง"
        },
        responsibleMonthlyLimitSetByYou : {
            text: "ตั้งขีดจำกัดด้วยตัวคุณเอง"
        },
        responsibleTotalAmountWagered : {
            text: "วงเงินเดิมพันรวม"
        },
        responsiblePotentialNetLoss : {
            text: "ยอดเสียสุทธิ"
        },
        networkNotResponding : {
            text: "เครือข่ายไม่ตอบสนอง\nกรุณารอสักครู่"
        },
        internalServerError : {
            text: "ระบบภายในขัดข้อง"
        },
        badRequest : {
            text: "การเรียกหน้าเวบไม่ถูกต้อง"
        },
        badPlayerId : {
            text: "ไอดีของผู้เล่นไม่ถูกต้อง"
        },
        badToken : {
            text: "โทเคนไม่ถูกต้อง"
        },
        invalidToken : {
            text: "โทเคนผิดพลาด"
        },
        invalidRefId : {
            text: "ไอดีของการอ้างอิงผิดพลาด"
        },
        invalidPlayerId : {
            text: "ไอดีของผู้เล่นผิดพลาด"
        },
        invalidRoundId : {
            text: "ไอดีของรอบผิดพลาด"
        },
        expiredToken: {
            text: "โทเคนหมดอายุแล้ว"
        },
        duplicateId: {
            text: "ไอดีซ้ำซ้อนกัน"
        },
        duplicateRefId: {
            text: "ไอดีของการอ้างอิงซ้ำซ้อนกัน"
        },
        duplicateRoundId: {
            text: "ไอดีของรอบซ้ำซ้อนกัน"
        },
        roundAlreadyEnded: {
            text: "รอบนี้จบไปแลเว"
        },
        unfinishedRoundsInSession: {
            text: "ส่วนของรอบที่ยังไม่สิ้นสุด"
        },
        playerDoesNotHaveEnoughMoney: {
            text: "ผู้เล่นมีจำนวนเงินไม่เพียงพอ"
        },
        playerHasGoneAboveBetLimit: {
            text: "ผู้เล่นได้ลงเดิมพันเกินขีดจำกัด"
        },
        playerBlocked: {
            text: "บัญชีของคุณได้ถูกระงับ\nกรุณาติดต่อฝ่ายบริการลูกค้า"
        },
        expiredSession: {
            text: "เซสชั่นหมดอายุเนื่องจากไม่มีการใช้งาน"
        },
        multipleConnectionsNotAllowed: {
            text: "Multiple connections are not allowed"
        }
    },
    tr : {
        gameNotFound: {
            text: "Oyun bulunamadı"
        },
        errorCode: {
            text: "Hata, kod"
        },
        connectionError: {
            text: "Bağlantı Hatası"
        },
        responsibleWagerLimit : {
            text: "Bahis Başarısız\nBahis Limitlerinden biri aşıldı."
        },
        responsibleDailyLimit : {
            text: "Bahis Başarısız\nGünlük Bahis Limiti aşıldı."
        },
        responsibleWeeklyLimit : {
            text: "Bahis Başarısız\nHaftalık Bahis Limiti aşıldı."
        },
        responsibleMonthlyLimit : {
            text: "Bahis Başarısız\nAylık Bahis Limiti aşıldı."
        },
        responsibleDailyNetLoss : {
            text: "Bahis Başarısız\nGünlük Net Kayıp Limiti aşıldı."
        },
        responsibleWeeklyNetLoss : {
            text: "Bahis Başarısız\nHaftalık Net Kayıp Limiti aşıldı."
        },
        responsibleMonthlyNetLoss : {
            text: "Bahis Başarısız\nAylık Net Kayıp Limiti aşıldı."
        },
        responsibleDailyLimitSetByYou : {
            text: "Koyduğunuz limit"
        },
        responsibleWeeklyLimitSetByYou : {
            text: "Koyduğunuz limit"
        },
        responsibleMonthlyLimitSetByYou : {
            text: "Koyduğunuz limit"
        },
        responsibleTotalAmountWagered : {
            text: "Bahise yatırılmış toplam miktar"
        },
        responsiblePotentialNetLoss : {
            text: "Potansiyel Net Kayıp"
        },
        networkNotResponding : {
            text: "AĞ CEVAP VERMİYOR.\nLÜTFEN BEKLEYİN"
        },
        internalServerError : {
            text: "İç Sunucu Hatası"
        },
        badRequest : {
            text: "Bozuk İstek"
        },
        badPlayerId : {
            text: "Bozuk playerId"
        },
        badToken : {
            text: "Bozuk jeton"
        },
        invalidToken : {
            text: "Geçersiz jeton"
        },
        invalidRefId : {
            text: "Geçersiz refId"
        },
        invalidPlayerId : {
            text: "Geçersiz playerId"
        },
        invalidRoundId : {
            text: "Geçersiz roundId"
        },
        expiredToken: {
            text: "Süresi dolmuş jeton"
        },
        duplicateId: {
            text: "Çift id"
        },
        duplicateRefId: {
            text: "Çift refId"
        },
        duplicateRoundId: {
            text: "Çift roundId"
        },
        roundAlreadyEnded: {
            text: "Tur zaten bitti"
        },
        unfinishedRoundsInSession: {
            text: "Oturumdaki tamamlanmamış turlar"
        },
        playerDoesNotHaveEnoughMoney: {
            text: "Oyuncunun yeterli parası yok"
        },
        playerHasGoneAboveBetLimit: {
            text: "Oyuncu bahis limitini aştı"
        },
        playerBlocked: {
            text: "Hesabınız blokelidir.\nLütfen müşteri hizmetleriyle görüşün."
        },
        expiredSession: {
            text: "Etkinlik yapılmadığı  için oturumun süresi doldu"
        },
        multipleConnectionsNotAllowed: {
            text: "Multiple connections are not allowed"
        }
    },
    vi : {
        gameNotFound: {
            text: "Không tìm thấy trò chơi"
        },
        errorCode: {
            text: "Lỗi, mã"
        },
        connectionError: {
            text: "Lỗi kết nối"
        },
        responsibleWagerLimit : {
            text: "Đặt cược không thành công\nMột trong những cược của bạn đã bị vượt quá"
        },
        responsibleDailyLimit : {
            text: "Đặt cược không thành công\nMức cược hàng ngày của bạn đã bị vượt quá"
        },
        responsibleWeeklyLimit : {
            text: "Đặt cược không thành công\nMức cược hàng tuần của bạn đã bị vượt quá"
        },
        responsibleMonthlyLimit : {
            text: "Đặt cược không thành công\nMức cược hàng tháng của bạn đã bị vượt quá"
        },
        responsibleDailyNetLoss : {
            text: "Đặt cược không thành công\nGiới hạn thua thực tế hàng ngày của bạn đã bị vượt quá"
        },
        responsibleWeeklyNetLoss : {
            text: "Đặt cược không thành công\nGiới hạn thua thực tế hàng tuần của bạn đã bị vượt quá"
        },
        responsibleMonthlyNetLoss : {
            text: "Đặt cược không thành công\nGiới hạn thua thực tế hàng tháng của bạn đã bị vượt quá"
        },
        responsibleDailyLimitSetByYou : {
            text: "Giới hạn do bạn thiết lập"
        },
        responsibleWeeklyLimitSetByYou : {
            text: "Giới hạn do bạn thiết lập"
        },
        responsibleMonthlyLimitSetByYou : {
            text: "Giới hạn do bạn thiết lập"
        },
        responsibleTotalAmountWagered : {
            text: "Tổng số tiền đặt cược"
        },
        responsiblePotentialNetLoss : {
            text: "Khả năng thua thực tế"
        },
        networkNotResponding : {
            text: "MẠNG ĐANG KHÔNG PHẢN HỒI.\nVUI LÒNG CHỜ"
        },
        internalServerError : {
            text: "Lỗi máy chủ nội bộ"
        },
        badRequest : {
            text: "Yêu cầu xấu"
        },
        badPlayerId : {
            text: "Nhận dạng người chơi xấu"
        },
        badToken : {
            text: "Tiền ảo xấu"
        },
        invalidToken : {
            text: "Nhận dạng tiền ảo không hợp lệ"
        },
        invalidRefId : {
            text: "Nhận dạng đường dẫn không hợp lệ"
        },
        invalidPlayerId : {
            text: "Nhận dạng người chơi không hợp lệ"
        },
        invalidRoundId : {
            text: "Nhận dạng vòng chơi không hợp lệ"
        },
        expiredToken: {
            text: "Tiền ảo đã hết hạn"
        },
        duplicateId: {
            text: "Nhận dạng tài khoản trùng lặp"
        },
        duplicateRefId: {
            text: "Nhận dạng đường dẫn trùng lặp"
        },
        duplicateRoundId: {
            text: "Nhận dạng vòng chơi trùng lặp"
        },
        roundAlreadyEnded: {
            text: "Vòng chơi đã kết thúc"
        },
        unfinishedRoundsInSession: {
            text: "Vòng chơi chưa kết thúc tại phiên"
        },
        playerDoesNotHaveEnoughMoney: {
            text: "Người chơi không có đủ tiền"
        },
        playerHasGoneAboveBetLimit: {
            text: "Người chơi vượt quá giới hạn đặt cược"
        },
        playerBlocked: {
            text: "Tài khoản của bạn bị chặn.\nVui lòng liên hệ bộ phận chăm sóc khách hàng"
        },
        expiredSession: {
            text: "Phiên đã hết hạn do không hoạt động"
        },
        multipleConnectionsNotAllowed: {
            text: "Multiple connections are not allowed"
        }
    },
    zhHans : {
        gameNotFound: {
            text: "未找到游戏"
        },
        errorCode: {
            text: "错误，代码"
        },
        connectionError: {
            text: "连接错误"
        },
        responsibleWagerLimit : {
            text: "投注不成功\n您已达到某项投注限额"
        },
        responsibleDailyLimit : {
            text: "投注不成功\n您已达到每日投注限额"
        },
        responsibleWeeklyLimit : {
            text: "投注不成功\n您已达到每周投注限额"
        },
        responsibleMonthlyLimit : {
            text: "投注不成功\n您已达到每月投注限额"
        },
        responsibleDailyNetLoss : {
            text: "投注不成功\n您已达到每日净损限额"
        },
        responsibleWeeklyNetLoss : {
            text: "投注不成功\n您已达到每周净损限额"
        },
        responsibleMonthlyNetLoss : {
            text: "投注不成功\n您已达到每月净损限额"
        },
        responsibleDailyLimitSetByYou : {
            text: "由您设定的限额"
        },
        responsibleWeeklyLimitSetByYou : {
            text: "由您设定的限额"
        },
        responsibleMonthlyLimitSetByYou : {
            text: "由您设定的限额"
        },
        responsibleTotalAmountWagered : {
            text: "总投注额"
        },
        responsiblePotentialNetLoss : {
            text: "潜在净损失"
        },
        networkNotResponding : {
            text: "网络无响应，\n请等待"
        },
        internalServerError : {
            text: "内部服务器错误"
        },
        badRequest : {
            text: "错误的请求"
        },
        badPlayerId : {
            text: "错误的玩家编号"
        },
        badToken : {
            text: "错误的令牌"
        },
        invalidToken : {
            text: "无效的令牌"
        },
        invalidRefId : {
            text: "无效的参考编号"
        },
        invalidPlayerId : {
            text: "无效的玩家编号"
        },
        invalidRoundId : {
            text: "无效的回合编号"
        },
        expiredToken: {
            text: "过期的令牌"
        },
        duplicateId: {
            text: "复制编号"
        },
        duplicateRefId: {
            text: "复制参考编号"
        },
        duplicateRoundId: {
            text: "复制回合编号"
        },
        roundAlreadyEnded: {
            text: "本回合已经结束"
        },
        unfinishedRoundsInSession: {
            text: "仍有尚未完成的回合"
        },
        playerDoesNotHaveEnoughMoney: {
            text: "玩家金额不足"
        },
        playerHasGoneAboveBetLimit: {
            text: "玩家超过投注极限"
        },
        playerBlocked: {
            text: "您的账户已被封锁。\n请与客服联系。"
        },
        expiredSession: {
            text: "由于处于非活动状态，会话已过期"
        },
        multipleConnectionsNotAllowed: {
            text: "Multiple connections are not allowed"
        }
    },
    zhHant : {
        gameNotFound: {
            text: "没有找到游戏"
        },
        errorCode: {
            text: "错误，代码"
        },
        connectionError: {
            text: "连接错误"
        },
        responsibleWagerLimit : {
            text: "投注失败\n您的投注之一超过了下注的最大限制"
        },
        responsibleDailyLimit : {
            text: "下注失败\n您的下注超出了当日下注限额"
        },
        responsibleWeeklyLimit : {
            text: "下注失败\n您的下注超出了本周最大下注限额"
        },
        responsibleMonthlyLimit : {
            text: "下注失败\n您的下注超出了本月最大下注限额"
        },
        responsibleDailyNetLoss : {
            text: "下注失败\n您已超出本日净亏损上限"
        },
        responsibleWeeklyNetLoss : {
            text: "下注失败\n您已超出本周净亏损上限"
        },
        responsibleMonthlyNetLoss : {
            text: "下注失败\n您已超出本月净亏损上限"
        },
        responsibleDailyLimitSetByYou : {
            text: "设置您的限额"
        },
        responsibleWeeklyLimitSetByYou : {
            text: "设置您的限额"
        },
        responsibleMonthlyLimitSetByYou : {
            text: "设置您的限额"
        },
        responsibleTotalAmountWagered : {
            text: "总投注额"
        },
        responsiblePotentialNetLoss : {
            text: "估计净损失"
        },
        networkNotResponding : {
            text: "网络连接没有响应，\n请等待"
        },
        internalServerError : {
            text: "内部服务器错误"
        },
        badRequest : {
            text: "请求错误"
        },
        badPlayerId : {
            text: "玩家ID错误"
        },
        badToken : {
            text: "筹码错误"
        },
        invalidToken : {
            text: "无效的筹码"
        },
        invalidRefId : {
            text: "无效的参考代码"
        },
        invalidPlayerId : {
            text: "无效的玩家ID"
        },
        invalidRoundId : {
            text: "无效的回合ID"
        },
        expiredToken: {
            text: "筹码已失效"
        },
        duplicateId: {
            text: "重复的玩家ID"
        },
        duplicateRefId: {
            text: "重复的参考代码"
        },
        duplicateRoundId: {
            text: "重复的游戏回合"
        },
        roundAlreadyEnded: {
            text: "本轮游戏已结束"
        },
        unfinishedRoundsInSession: {
            text: "本局游戏进行中"
        },
        playerDoesNotHaveEnoughMoney: {
            text: "玩家余额不足"
        },
        playerHasGoneAboveBetLimit: {
            text: "玩家超出投注限额"
        },
        playerBlocked: {
            text: "您的账户已被锁定，\n请联系客服"
        },
        expiredSession: {
            text: "由于不活跃状态，游戏已经结束"
        },
        multipleConnectionsNotAllowed: {
            text: "Multiple connections are not allowed"
        }
    }
}
