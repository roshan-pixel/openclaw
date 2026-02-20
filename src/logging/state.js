"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggingState = void 0;
exports.loggingState = {
    cachedLogger: null,
    cachedSettings: null,
    cachedConsoleSettings: null,
    overrideSettings: null,
    consolePatched: false,
    forceConsoleToStderr: false,
    consoleTimestampPrefix: false,
    consoleSubsystemFilter: null,
    resolvingConsoleSettings: false,
    rawConsole: null,
};
