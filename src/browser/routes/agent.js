"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerBrowserAgentRoutes = registerBrowserAgentRoutes;
var agent_act_js_1 = require("./agent.act.js");
var agent_debug_js_1 = require("./agent.debug.js");
var agent_snapshot_js_1 = require("./agent.snapshot.js");
var agent_storage_js_1 = require("./agent.storage.js");
function registerBrowserAgentRoutes(app, ctx) {
    (0, agent_snapshot_js_1.registerBrowserAgentSnapshotRoutes)(app, ctx);
    (0, agent_act_js_1.registerBrowserAgentActRoutes)(app, ctx);
    (0, agent_debug_js_1.registerBrowserAgentDebugRoutes)(app, ctx);
    (0, agent_storage_js_1.registerBrowserAgentStorageRoutes)(app, ctx);
}
