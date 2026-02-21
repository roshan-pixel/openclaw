"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDebugCommand = parseDebugCommand;
var config_value_js_1 = require("./config-value.js");
function parseDebugCommand(raw) {
  var _a;
  var trimmed = raw.trim();
  if (!trimmed.toLowerCase().startsWith("/debug")) {
    return null;
  }
  var rest = trimmed.slice("/debug".length).trim();
  if (!rest) {
    return { action: "show" };
  }
  var match = rest.match(/^(\S+)(?:\s+([\s\S]+))?$/);
  if (!match) {
    return { action: "error", message: "Invalid /debug syntax." };
  }
  var action = match[1].toLowerCase();
  var args = ((_a = match[2]) !== null && _a !== void 0 ? _a : "").trim();
  switch (action) {
    case "show":
      return { action: "show" };
    case "reset":
      return { action: "reset" };
    case "unset": {
      if (!args) {
        return { action: "error", message: "Usage: /debug unset path" };
      }
      return { action: "unset", path: args };
    }
    case "set": {
      if (!args) {
        return {
          action: "error",
          message: "Usage: /debug set path=value",
        };
      }
      var eqIndex = args.indexOf("=");
      if (eqIndex <= 0) {
        return {
          action: "error",
          message: "Usage: /debug set path=value",
        };
      }
      var path = args.slice(0, eqIndex).trim();
      var rawValue = args.slice(eqIndex + 1);
      if (!path) {
        return {
          action: "error",
          message: "Usage: /debug set path=value",
        };
      }
      var parsed = (0, config_value_js_1.parseConfigValue)(rawValue);
      if (parsed.error) {
        return { action: "error", message: parsed.error };
      }
      return { action: "set", path: path, value: parsed.value };
    }
    default:
      return {
        action: "error",
        message: "Usage: /debug show|set|unset|reset",
      };
  }
}
