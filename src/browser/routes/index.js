"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerBrowserRoutes = registerBrowserRoutes;
var agent_js_1 = require("./agent.js");
var basic_js_1 = require("./basic.js");
var tabs_js_1 = require("./tabs.js");
function registerBrowserRoutes(app, ctx) {
    (0, basic_js_1.registerBrowserBasicRoutes)(app, ctx);
    (0, tabs_js_1.registerBrowserTabRoutes)(app, ctx);
    (0, agent_js_1.registerBrowserAgentRoutes)(app, ctx);
}
