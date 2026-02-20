"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireNodeSqlite = requireNodeSqlite;
var node_module_1 = require("node:module");
var warnings_js_1 = require("../infra/warnings.js");
var require = (0, node_module_1.createRequire)(import.meta.url);
function requireNodeSqlite() {
    (0, warnings_js_1.installProcessWarningFilter)();
    return require("node:sqlite");
}
