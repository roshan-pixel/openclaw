"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildNodeShellCommand = buildNodeShellCommand;
function buildNodeShellCommand(command, platform) {
    var normalized = String(platform !== null && platform !== void 0 ? platform : "")
        .trim()
        .toLowerCase();
    if (normalized.startsWith("win")) {
        return ["cmd.exe", "/d", "/s", "/c", command];
    }
    return ["/bin/sh", "-lc", command];
}
