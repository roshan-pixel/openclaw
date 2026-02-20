"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEmbeddedPiSessionEventHandler = createEmbeddedPiSessionEventHandler;
var pi_embedded_subscribe_handlers_lifecycle_js_1 = require("./pi-embedded-subscribe.handlers.lifecycle.js");
var pi_embedded_subscribe_handlers_messages_js_1 = require("./pi-embedded-subscribe.handlers.messages.js");
var pi_embedded_subscribe_handlers_tools_js_1 = require("./pi-embedded-subscribe.handlers.tools.js");
function createEmbeddedPiSessionEventHandler(ctx) {
    return function (evt) {
        switch (evt.type) {
            case "message_start":
                (0, pi_embedded_subscribe_handlers_messages_js_1.handleMessageStart)(ctx, evt);
                return;
            case "message_update":
                (0, pi_embedded_subscribe_handlers_messages_js_1.handleMessageUpdate)(ctx, evt);
                return;
            case "message_end":
                (0, pi_embedded_subscribe_handlers_messages_js_1.handleMessageEnd)(ctx, evt);
                return;
            case "tool_execution_start":
                // Async handler - best-effort typing indicator, avoids blocking tool summaries.
                // Catch rejections to avoid unhandled promise rejection crashes.
                (0, pi_embedded_subscribe_handlers_tools_js_1.handleToolExecutionStart)(ctx, evt).catch(function (err) {
                    ctx.log.debug("tool_execution_start handler failed: ".concat(String(err)));
                });
                return;
            case "tool_execution_update":
                (0, pi_embedded_subscribe_handlers_tools_js_1.handleToolExecutionUpdate)(ctx, evt);
                return;
            case "tool_execution_end":
                (0, pi_embedded_subscribe_handlers_tools_js_1.handleToolExecutionEnd)(ctx, evt);
                return;
            case "agent_start":
                (0, pi_embedded_subscribe_handlers_lifecycle_js_1.handleAgentStart)(ctx);
                return;
            case "auto_compaction_start":
                (0, pi_embedded_subscribe_handlers_lifecycle_js_1.handleAutoCompactionStart)(ctx);
                return;
            case "auto_compaction_end":
                (0, pi_embedded_subscribe_handlers_lifecycle_js_1.handleAutoCompactionEnd)(ctx, evt);
                return;
            case "agent_end":
                (0, pi_embedded_subscribe_handlers_lifecycle_js_1.handleAgentEnd)(ctx);
                return;
            default:
                return;
        }
    };
}
