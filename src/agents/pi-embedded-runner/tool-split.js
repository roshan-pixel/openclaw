"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitSdkTools = splitSdkTools;
var pi_tool_definition_adapter_js_1 = require("../pi-tool-definition-adapter.js");
function splitSdkTools(options) {
    var tools = options.tools;
    return {
        builtInTools: [],
        customTools: (0, pi_tool_definition_adapter_js_1.toToolDefinitions)(tools),
    };
}
