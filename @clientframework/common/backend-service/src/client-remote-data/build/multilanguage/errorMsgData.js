"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var gameLanguage_1 = require("../launchParams/gameLanguage");
function getField(key) {
    var lang = gameLanguage_1.getGameLanguage();
    if (errorMsgData.hasOwnProperty(lang)) {
        var langTexts = errorMsgData[lang];
        if (langTexts.hasOwnProperty(key)) {
            var fieldData = langTexts[key];
            if (fieldData) {
                return fieldData;
            }
        }
    }
    return null;
}
function getLanguageTextErrorMsg(key) {
    var field = getField(key);
    //delcons console.log("getlanguageText", key, field)
    if (field) {
        return field.text;
    }
    return "";
}
exports.getLanguageTextErrorMsg = getLanguageTextErrorMsg;
function getErrorMsgData() {
    return errorMsgData;
}
exports.getErrorMsgData = getErrorMsgData;
function setErrorMsgData(newData) {
    errorMsgData = JSON.parse(JSON.stringify(newData));
}
exports.setErrorMsgData = setErrorMsgData;
var errorMsgData = {
    en: {
        gameNotFound: {
            text: "Game not found"
        },
        errorCode: {
            text: "Error, code"
        },
        connectionError: {
            text: "Connection Error"
        },
        responsibleWagerLimit: {
            text: "Wager Unsuccessful\nOne of your Wager Limits have been exceeded"
        },
        responsibleDailyLimit: {
            text: "Wager Unsuccessful\nYour Daily Wager Limit has been exceeded"
        },
        responsibleWeeklyLimit: {
            text: "Wager Unsuccessful\nYour Weekly Wager Limit has been exceeded"
        },
        responsibleMonthlyLimit: {
            text: "Wager Unsuccessful\nYour Monthly Wager Limit has been exceeded"
        },
        responsibleDailyNetLoss: {
            text: "Wager Unsuccessful\nYour Daily Net Loss Limit has been exceeded"
        },
        responsibleWeeklyNetLoss: {
            text: "Wager Unsuccessful\nYour Weekly Net Loss Limit has been exceeded"
        },
        responsibleMonthlyNetLoss: {
            text: "Wager Unsuccessful\nYour Monthly Net Loss Limit has been exceeded"
        },
        responsibleDailyLimitSetByYou: {
            text: "Limit set by you"
        },
        responsibleWeeklyLimitSetByYou: {
            text: "Limit set by you"
        },
        responsibleMonthlyLimitSetByYou: {
            text: "Limit set by you"
        },
        responsibleTotalAmountWagered: {
            text: "Total amount wagered"
        },
        responsiblePotentialNetLoss: {
            text: "Potential Net Loss"
        },
        networkNotResponding: {
            text: "NETWORK NOT RESPONDING.\nPLEASE WAIT"
        },
        internalServerError: {
            text: "Internal server error"
        },
        badRequest: {
            text: "Bad Request"
        },
        badPlayerId: {
            text: "Bad playerId"
        },
        badToken: {
            text: "Bad token"
        },
        invalidToken: {
            text: "Invalid token"
        },
        invalidRefId: {
            text: "Invalid refId"
        },
        invalidPlayerId: {
            text: "Invalid playerId"
        },
        invalidRoundId: {
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
        }
    },
    de: {
        gameNotFound: {
            text: "Game not found"
        },
        errorCode: {
            text: "Error, code"
        },
        connectionError: {
            text: "Verbindungsfehler"
        },
        responsibleWagerLimit: {
            text: "Wager Unsuccessful\nOne of your Wager Limits have been exceeded"
        },
        responsibleDailyLimit: {
            text: "Einsatz nicht möglich\ntägliches Einsatzlimit überschritten"
        },
        responsibleWeeklyLimit: {
            text: "Einsatz nicht möglich\nwöchentliches Einsatzlimit überschritten"
        },
        responsibleMonthlyLimit: {
            text: "Einsatz nicht möglich\nmonatliches Einsatzlimit überschritten"
        },
        responsibleDailyNetLoss: {
            text: "Einsatz nicht möglich\ntägliches Verlustlimit könnte überschritten werden"
        },
        responsibleWeeklyNetLoss: {
            text: "Einsatz nicht möglich\nwöchentliches Verlustlimit könnte\nüberschritten werden"
        },
        responsibleMonthlyNetLoss: {
            text: "Einsatz nicht möglich\nmonatliches Verlustlimit könnte überschritten werden"
        },
        responsibleDailyLimitSetByYou: {
            text: "Von Ihnen festgelegtes Limit"
        },
        responsibleWeeklyLimitSetByYou: {
            text: "Von Ihnen festgelegtes Limit"
        },
        responsibleMonthlyLimitSetByYou: {
            text: "Von Ihnen festgelegtes Limit"
        },
        responsibleTotalAmountWagered: {
            text: "Bereits getätigte Einsätze"
        },
        responsiblePotentialNetLoss: {
            text: "Potentieller Nettoverlust"
        },
        networkNotResponding: {
            text: "NETZWERK REAGIERT NICHT.\nBITTE WARTEN"
        },
        internalServerError: {
            text: "Internal server error"
        },
        badRequest: {
            text: "Bad Request"
        },
        badPlayerId: {
            text: "Bad playerId"
        },
        badToken: {
            text: "Bad token"
        },
        invalidToken: {
            text: "Invalid token"
        },
        invalidRefId: {
            text: "Invalid refId"
        },
        invalidPlayerId: {
            text: "Invalid playerId"
        },
        invalidRoundId: {
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
            text: "Ihr Account ist gesperrt.\nBitte wenden Sie sich an den Kundendienst"
        },
        expiredSession: {
            text: "Session expired due to inactivity "
        }
    },
    it: {
        gameNotFound: {
            text: "Game not found"
        },
        errorCode: {
            text: "Error, code"
        },
        connectionError: {
            text: "Errore  di connesione"
        },
        responsibleWagerLimit: {
            text: "Wager Unsuccessful\nOne of your Wager Limits have been exceeded"
        },
        responsibleDailyLimit: {
            text: "Scommessa non riuscita\nlimite di scommessa giornaliero superato"
        },
        responsibleWeeklyLimit: {
            text: "Scommessa non riuscita\nlimite di scommessa settimanale superato"
        },
        responsibleMonthlyLimit: {
            text: "Scommessa non riuscita\nlimite di scommessa mensile superato"
        },
        responsibleDailyNetLoss: {
            text: "Scommessa non riuscita\nIl limite di perdita netta giornaliera\npotrebbe essere superato"
        },
        responsibleWeeklyNetLoss: {
            text: "Scommessa non riuscita\nIl limite di perdita netta settimanale\npotrebbe essere superato"
        },
        responsibleMonthlyNetLoss: {
            text: "Scommessa non riuscita\nil limite di perdita netta mensile\npotrebbe essere superato"
        },
        responsibleDailyLimitSetByYou: {
            text: "Limite stabilito da lei"
        },
        responsibleWeeklyLimitSetByYou: {
            text: "Limite stabilito da lei"
        },
        responsibleMonthlyLimitSetByYou: {
            text: "Limite stabilito da lei"
        },
        responsibleTotalAmountWagered: {
            text: "Scommesse già piazzate"
        },
        responsiblePotentialNetLoss: {
            text: "Potenziale perdita netta"
        },
        networkNotResponding: {
            text: "MANCATA RISPOSTA DELLA RETE.\nATTENDI"
        },
        internalServerError: {
            text: "Internal server error"
        },
        badRequest: {
            text: "Bad Request"
        },
        badPlayerId: {
            text: "Bad playerId"
        },
        badToken: {
            text: "Bad token"
        },
        invalidToken: {
            text: "Invalid token"
        },
        invalidRefId: {
            text: "Invalid refId"
        },
        invalidPlayerId: {
            text: "Invalid playerId"
        },
        invalidRoundId: {
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
            text: "Il tuo conto è bloccato.\nContatta l'assistenza clienti"
        },
        expiredSession: {
            text: "Session expired due to inactivity "
        }
    },
    fr: {
        gameNotFound: {
            text: "Game not found"
        },
        errorCode: {
            text: "Error, code"
        },
        connectionError: {
            text: "Erreur de connexion"
        },
        responsibleWagerLimit: {
            text: "Wager Unsuccessful\nOne of your Wager Limits have been exceeded"
        },
        responsibleDailyLimit: {
            text: "Mise impossible\nlimite quotidienne de mise est dépassée"
        },
        responsibleWeeklyLimit: {
            text: "Mise impossible\nlimite hebdomadaire de mise est dépassée"
        },
        responsibleMonthlyLimit: {
            text: "Mise impossible\nlimite mensuelle de mise est dépassée"
        },
        responsibleDailyNetLoss: {
            text: "Mise impossible\nlimite quotidienne de perte nette\npourrait être dépassée"
        },
        responsibleWeeklyNetLoss: {
            text: "Mise impossible\nlimite de perte nette hebdomadaire\npourrait être dépassée"
        },
        responsibleMonthlyNetLoss: {
            text: "Mise impossible\nlimite mensuelle de perte nette\npourrait être dépassée"
        },
        responsibleDailyLimitSetByYou: {
            text: "Limite fixée par vous"
        },
        responsibleWeeklyLimitSetByYou: {
            text: "Limite fixée par vous"
        },
        responsibleMonthlyLimitSetByYou: {
            text: "Limite fixée par vous"
        },
        responsibleTotalAmountWagered: {
            text: "Mise déjà placés"
        },
        responsiblePotentialNetLoss: {
            text: "Perte nette potentielle"
        },
        networkNotResponding: {
            text: "LE RÉSEAU NE FONCTIONNE.\nPAS VEUILLEZ ATTENDRE"
        },
        internalServerError: {
            text: "Internal server error"
        },
        badRequest: {
            text: "Bad Request"
        },
        badPlayerId: {
            text: "Bad playerId"
        },
        badToken: {
            text: "Bad token"
        },
        invalidToken: {
            text: "Invalid token"
        },
        invalidRefId: {
            text: "Invalid refId"
        },
        invalidPlayerId: {
            text: "Invalid playerId"
        },
        invalidRoundId: {
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
            text: "Votre compte est bloqué.\nVeuillez contacter l'assistance client"
        },
        expiredSession: {
            text: "Session expired due to inactivity"
        }
    },
    sv: {
        gameNotFound: {
            text: "Spel ej hittat"
        },
        errorCode: {
            text: "Fel, kod"
        },
        connectionError: {
            text: "Kontaktfel"
        },
        responsibleWagerLimit: {
            text: "Insats misslyckad\nEn av dina insatsgränser har överstigits"
        },
        responsibleDailyLimit: {
            text: "Insats misslyckad\nDin dagliga insatsgräns har överstigits"
        },
        responsibleWeeklyLimit: {
            text: "Insats misslyckad\nDin veckogräns har överstigits"
        },
        responsibleMonthlyLimit: {
            text: "Insats misslyckad\nDin månadsgräns har överstigits"
        },
        responsibleDailyNetLoss: {
            text: "Insats misslyckad\nDin dagliga nettoförlustgräns har överstigits"
        },
        responsibleWeeklyNetLoss: {
            text: "Insats misslyckad\nDin nettoförlustgräns per vecka har överstigits"
        },
        responsibleMonthlyNetLoss: {
            text: "Insats misslyckad\nDin nettoförlustgräns per månad har överstigits"
        },
        responsibleDailyLimitSetByYou: {
            text: "Gränser satta av dig"
        },
        responsibleWeeklyLimitSetByYou: {
            text: "Gränser satta av dig"
        },
        responsibleMonthlyLimitSetByYou: {
            text: "Gränser satta av dig"
        },
        responsibleTotalAmountWagered: {
            text: "Total summa omsatt"
        },
        responsiblePotentialNetLoss: {
            text: "Potentiell Nettoförlust"
        },
        networkNotResponding: {
            text: "NÄTVERKET SVARAR INTE.\nVAR GOD VÄNTA"
        },
        internalServerError: {
            text: "Intern server error"
        },
        badRequest: {
            text: "Felaktig begäran"
        },
        badPlayerId: {
            text: "Felaktigt spelarId"
        },
        badToken: {
            text: "Felaktig token"
        },
        invalidToken: {
            text: "Ogiltig token"
        },
        invalidRefId: {
            text: "Ogiltig refId"
        },
        invalidPlayerId: {
            text: "Ogiltig spelarId"
        },
        invalidRoundId: {
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
        }
    },
};
