"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitForever = waitForever;
function waitForever() {
    // Keep event loop alive via an unref'ed interval plus a pending promise.
    var interval = setInterval(function () { }, 1000000);
    interval.unref();
    return new Promise(function () {
        /* never resolve */
    });
}
