import { ErrorMsgKeys } from "./errorMsgKeys";
import { GameMsgKeys } from "./gameMsgKeys";

type tRGamingType = "NetLoss" | "Wager";
type tRGamingPeriod = "Daily" | "Weekly" | "Monthly";
type tRGamingMsgLimit = ErrorMsgKeys.responsibleDailyLimitSetByYou | ErrorMsgKeys.responsibleWeeklyLimitSetByYou | ErrorMsgKeys.responsibleMonthlyLimitSetByYou;
type tRGamingMsgCurrent = ErrorMsgKeys.responsibleTotalAmountWagered | ErrorMsgKeys.responsiblePotentialNetLoss;

interface IRGamingDetail {
    period: tRGamingPeriod;
    type: tRGamingType;
    msgLimit: tRGamingMsgLimit;
    msgCurrent: tRGamingMsgCurrent;
}

interface IErrorCodeData {
    statusCode?: number;
    code?: number;
    detail?: IRGamingDetail;
    msg: ErrorMsgKeys | GameMsgKeys;
    isError: boolean;
}

export function getErrorCodesData() {
    return errorCodesData;
}

export function setErrorCodesData(newData) {
    errorCodesData = JSON.parse(JSON.stringify(newData));
}

let errorCodesData: IErrorCodeData[] = [
    {
        code: 402,
        statusCode: 501,
        detail: {
            type: "NetLoss",
            period: "Daily",
            msgLimit: ErrorMsgKeys.responsibleDailyLimitSetByYou,
            msgCurrent: ErrorMsgKeys.responsiblePotentialNetLoss,
        },
        msg: ErrorMsgKeys.responsibleDailyNetLoss,
        isError: false
    },
    {
        code: 402,
        statusCode: 501,
        detail: {
            type: "NetLoss",
            period: "Weekly",
            msgLimit: ErrorMsgKeys.responsibleWeeklyLimitSetByYou,
            msgCurrent: ErrorMsgKeys.responsiblePotentialNetLoss,
        },
        msg: ErrorMsgKeys.responsibleWeeklyNetLoss,
        isError: false
    },
    {
        code: 402,
        statusCode: 501,
        detail: {
            type: "NetLoss",
            period: "Monthly",
            msgLimit: ErrorMsgKeys.responsibleMonthlyLimitSetByYou,
            msgCurrent: ErrorMsgKeys.responsiblePotentialNetLoss,
        },
        msg: ErrorMsgKeys.responsibleMonthlyNetLoss,
        isError: false
    },
    {
        code: 402,
        statusCode: 501,
        detail: {
            type: "Wager",
            period: "Daily",
            msgLimit: ErrorMsgKeys.responsibleDailyLimitSetByYou,
            msgCurrent: ErrorMsgKeys.responsibleTotalAmountWagered,
        },
        msg: ErrorMsgKeys.responsibleDailyLimit,
        isError: false
    },
    {
        code: 402,
        statusCode: 501,
        detail: {
            type: "Wager",
            period: "Weekly",
            msgLimit: ErrorMsgKeys.responsibleWeeklyLimitSetByYou,
            msgCurrent: ErrorMsgKeys.responsibleTotalAmountWagered,
        },
        msg: ErrorMsgKeys.responsibleWeeklyLimit,
        isError: false
    },
    {
        code: 402,
        statusCode: 501,
        detail: {
            type: "Wager",
            period: "Monthly",
            msgLimit: ErrorMsgKeys.responsibleMonthlyLimitSetByYou,
            msgCurrent: ErrorMsgKeys.responsibleTotalAmountWagered,
        },
        msg: ErrorMsgKeys.responsibleMonthlyLimit,
        isError: false
    },
    {
        code: 402,
        statusCode: 501,
        msg: ErrorMsgKeys.responsibleWagerLimit,
        isError: false
    },
    {
        code: 500,
        statusCode: 50,
        msg: ErrorMsgKeys.internalServerError,
        isError: true
    },
    {
        statusCode: 101,
        msg: ErrorMsgKeys.badRequest,
        isError: true
    },
    {
        code: 403,
        statusCode: 104,
        msg: ErrorMsgKeys.badPlayerId,
        isError: true
    },
    {
        code: 403,
        statusCode: 105,
        msg: ErrorMsgKeys.badToken,
        isError: true
    },
    {
        code: 401,
        statusCode: 201,
        msg: ErrorMsgKeys.invalidToken,
        isError: true
    },
    {
        code: 403,
        statusCode: 202,
        msg: ErrorMsgKeys.invalidRefId,
        isError: true
    },
    {
        code: 401,
        statusCode: 203,
        msg: ErrorMsgKeys.invalidPlayerId,
        isError: true
    },
    {
        code: 403,
        statusCode: 204,
        msg: ErrorMsgKeys.invalidRoundId,
        isError: true
    },
    {
        code: 401,
        statusCode: 251,
        msg: ErrorMsgKeys.expiredToken,
        isError: true
    },
    {
        code: 403,
        statusCode: 301,
        msg: ErrorMsgKeys.duplicateId,
        isError: true
    },
    {
        code: 403,
        statusCode: 302,
        msg: ErrorMsgKeys.duplicateRefId,
        isError: true
    },
    {
        code: 403,
        statusCode: 303,
        msg: ErrorMsgKeys.duplicateRoundId,
        isError: true
    },
    {
        code: 403,
        statusCode: 304,
        msg: ErrorMsgKeys.roundAlreadyEnded,
        isError: true
    },
    {
        code: 403,
        statusCode: 305,
        msg: ErrorMsgKeys.unfinishedRoundsInSession,
        isError: true
    },
    {
        code: 402,
        statusCode: 401,
        msg: ErrorMsgKeys.playerDoesNotHaveEnoughMoney,
        isError: false
    },
    {
        code: 402,
        statusCode: 501,
        msg: ErrorMsgKeys.playerHasGoneAboveBetLimit,
        isError: true
    },
    {
        code: 402,
        statusCode: 502,
        msg: ErrorMsgKeys.playerBlocked,
        isError: true
    },
    {
        code: 402,
        statusCode: 401,
        msg: GameMsgKeys.notEnoughBalance,
        isError: false
    },
    {
        code: 500,
        msg: GameMsgKeys.notEnoughBalance,
        isError: false
    },
    {
        code: 400,
        msg: ErrorMsgKeys.expiredSession,
        isError: true
    },
    {
        code: 429,
        statusCode: 429,
        msg: ErrorMsgKeys.multipleConnectionsNotAllowed,
        isError: true
    }
];
