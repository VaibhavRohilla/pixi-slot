"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errorMsgKeys_1 = require("./errorMsgKeys");
var gameMsgKeys_1 = require("./gameMsgKeys");
function getErrorCodesData() {
    return errorCodesData;
}
exports.getErrorCodesData = getErrorCodesData;
function setErrorCodesData(newData) {
    errorCodesData = JSON.parse(JSON.stringify(newData));
}
exports.setErrorCodesData = setErrorCodesData;
var errorCodesData = [
    {
        code: 402,
        statusCode: 501,
        detail: {
            type: "NetLoss",
            period: "Daily",
            msgLimit: errorMsgKeys_1.ErrorMsgKeys.responsibleDailyLimitSetByYou,
            msgCurrent: errorMsgKeys_1.ErrorMsgKeys.responsiblePotentialNetLoss,
        },
        msg: errorMsgKeys_1.ErrorMsgKeys.responsibleDailyNetLoss,
        isError: false
    },
    {
        code: 402,
        statusCode: 501,
        detail: {
            type: "NetLoss",
            period: "Weekly",
            msgLimit: errorMsgKeys_1.ErrorMsgKeys.responsibleWeeklyLimitSetByYou,
            msgCurrent: errorMsgKeys_1.ErrorMsgKeys.responsiblePotentialNetLoss,
        },
        msg: errorMsgKeys_1.ErrorMsgKeys.responsibleWeeklyNetLoss,
        isError: false
    },
    {
        code: 402,
        statusCode: 501,
        detail: {
            type: "NetLoss",
            period: "Monthly",
            msgLimit: errorMsgKeys_1.ErrorMsgKeys.responsibleMonthlyLimitSetByYou,
            msgCurrent: errorMsgKeys_1.ErrorMsgKeys.responsiblePotentialNetLoss,
        },
        msg: errorMsgKeys_1.ErrorMsgKeys.responsibleMonthlyNetLoss,
        isError: false
    },
    {
        code: 402,
        statusCode: 501,
        detail: {
            type: "Wager",
            period: "Daily",
            msgLimit: errorMsgKeys_1.ErrorMsgKeys.responsibleDailyLimitSetByYou,
            msgCurrent: errorMsgKeys_1.ErrorMsgKeys.responsibleTotalAmountWagered,
        },
        msg: errorMsgKeys_1.ErrorMsgKeys.responsibleDailyLimit,
        isError: false
    },
    {
        code: 402,
        statusCode: 501,
        detail: {
            type: "Wager",
            period: "Weekly",
            msgLimit: errorMsgKeys_1.ErrorMsgKeys.responsibleWeeklyLimitSetByYou,
            msgCurrent: errorMsgKeys_1.ErrorMsgKeys.responsibleTotalAmountWagered,
        },
        msg: errorMsgKeys_1.ErrorMsgKeys.responsibleWeeklyLimit,
        isError: false
    },
    {
        code: 402,
        statusCode: 501,
        detail: {
            type: "Wager",
            period: "Monthly",
            msgLimit: errorMsgKeys_1.ErrorMsgKeys.responsibleMonthlyLimitSetByYou,
            msgCurrent: errorMsgKeys_1.ErrorMsgKeys.responsibleTotalAmountWagered,
        },
        msg: errorMsgKeys_1.ErrorMsgKeys.responsibleMonthlyLimit,
        isError: false
    },
    {
        code: 402,
        statusCode: 501,
        msg: errorMsgKeys_1.ErrorMsgKeys.responsibleWagerLimit,
        isError: false
    },
    {
        code: 500,
        statusCode: 50,
        msg: errorMsgKeys_1.ErrorMsgKeys.internalServerError,
        isError: true
    },
    {
        statusCode: 101,
        msg: errorMsgKeys_1.ErrorMsgKeys.badRequest,
        isError: true
    },
    {
        code: 403,
        statusCode: 104,
        msg: errorMsgKeys_1.ErrorMsgKeys.badPlayerId,
        isError: true
    },
    {
        code: 403,
        statusCode: 105,
        msg: errorMsgKeys_1.ErrorMsgKeys.badToken,
        isError: true
    },
    {
        code: 401,
        statusCode: 201,
        msg: errorMsgKeys_1.ErrorMsgKeys.invalidToken,
        isError: true
    },
    {
        code: 403,
        statusCode: 202,
        msg: errorMsgKeys_1.ErrorMsgKeys.invalidRefId,
        isError: true
    },
    {
        code: 401,
        statusCode: 203,
        msg: errorMsgKeys_1.ErrorMsgKeys.invalidPlayerId,
        isError: true
    },
    {
        code: 403,
        statusCode: 204,
        msg: errorMsgKeys_1.ErrorMsgKeys.invalidRoundId,
        isError: true
    },
    {
        code: 401,
        statusCode: 251,
        msg: errorMsgKeys_1.ErrorMsgKeys.expiredToken,
        isError: true
    },
    {
        code: 403,
        statusCode: 301,
        msg: errorMsgKeys_1.ErrorMsgKeys.duplicateId,
        isError: true
    },
    {
        code: 403,
        statusCode: 302,
        msg: errorMsgKeys_1.ErrorMsgKeys.duplicateRefId,
        isError: true
    },
    {
        code: 403,
        statusCode: 303,
        msg: errorMsgKeys_1.ErrorMsgKeys.duplicateRoundId,
        isError: true
    },
    {
        code: 403,
        statusCode: 304,
        msg: errorMsgKeys_1.ErrorMsgKeys.roundAlreadyEnded,
        isError: true
    },
    {
        code: 403,
        statusCode: 305,
        msg: errorMsgKeys_1.ErrorMsgKeys.unfinishedRoundsInSession,
        isError: true
    },
    {
        code: 402,
        statusCode: 401,
        msg: errorMsgKeys_1.ErrorMsgKeys.playerDoesNotHaveEnoughMoney,
        isError: true
    },
    {
        code: 402,
        statusCode: 501,
        msg: errorMsgKeys_1.ErrorMsgKeys.playerHasGoneAboveBetLimit,
        isError: true
    },
    {
        code: 402,
        statusCode: 502,
        msg: errorMsgKeys_1.ErrorMsgKeys.playerBlocked,
        isError: true
    },
    {
        code: 402,
        statusCode: 401,
        msg: gameMsgKeys_1.GameMsgKeys.notEnoughBalance,
        isError: false
    },
    {
        code: 500,
        msg: gameMsgKeys_1.GameMsgKeys.notEnoughBalance,
        isError: false
    },
    {
        code: 400,
        msg: errorMsgKeys_1.ErrorMsgKeys.expiredSession,
        isError: true
    }
];
