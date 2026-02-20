"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GATEWAY_DAEMON_RUNTIME_OPTIONS = exports.DEFAULT_GATEWAY_DAEMON_RUNTIME = void 0;
exports.isGatewayDaemonRuntime = isGatewayDaemonRuntime;
exports.DEFAULT_GATEWAY_DAEMON_RUNTIME = "node";
exports.GATEWAY_DAEMON_RUNTIME_OPTIONS = [
    {
        value: "node",
        label: "Node (recommended)",
        hint: "Required for WhatsApp + Telegram. Bun can corrupt memory on reconnect.",
    },
];
function isGatewayDaemonRuntime(value) {
    return value === "node" || value === "bun";
}
