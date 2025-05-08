"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function loadFile(filename, filetype) {
    var fileref;
    if (filetype == "js") { //if filename is a external JavaScript file
        fileref = document.createElement('script');
        //fileref.setAttribute("type","text/javascript")
        fileref.setAttribute("src", filename);
        fileref.async = false;
        console.log(fileref);
    }
    else if (filetype == "css") { //if filename is an external CSS file
        fileref = document.createElement("link");
        fileref.setAttribute("rel", "stylesheet");
        fileref.setAttribute("type", "text/css");
        fileref.setAttribute("href", filename);
    }
    if (typeof fileref != "undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref);
}
exports.loadFile = loadFile;
