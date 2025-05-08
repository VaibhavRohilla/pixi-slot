"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getQueryParams_1 = require("./getQueryParams");
var languageKeys_1 = require("../multilanguage/languageKeys");
var isInNode_1 = require("../helpers/isInNode");
var gameLanguage = "en";
var language = getQueryParams_1.getQueryParams("language");
if (!language && !isInNode_1.IsInNode()) {
    if (navigator.userAgent.indexOf("Mobile") == -1) {
        var url = document.referrer ? document.referrer : window.location.href;
        //delcons console.log("language url = ", url);
        var splittedUrl = url.split("/");
        var found = false;
        for (var lang in languageKeys_1.LanguageKeys) {
            for (var i = 0; i < splittedUrl.length && !found; i++) {
                if (lang == splittedUrl[i]) {
                    language = lang;
                    found = true;
                    break;
                }
            }
            if (found) {
                break;
            }
        }
    }
    if (!language) {
        //@ts-ignore
        language = window.navigator.userLanguage || window.navigator.language;
        language = language.substr(0, 2);
        //alert(language)
    }
}
if (!(language in languageKeys_1.LanguageKeys)) {
    language = "en";
}
gameLanguage = language;
function getGameLanguage() {
    return gameLanguage;
}
exports.getGameLanguage = getGameLanguage;
