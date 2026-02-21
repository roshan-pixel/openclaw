"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_CLI_NAME = void 0;
exports.resolveCliName = resolveCliName;
exports.replaceCliName = replaceCliName;
var node_path_1 = require("node:path");
exports.DEFAULT_CLI_NAME = "openclaw";
var KNOWN_CLI_NAMES = new Set([exports.DEFAULT_CLI_NAME]);
var CLI_PREFIX_RE = /^(?:((?:pnpm|npm|bunx|npx)\s+))?(openclaw)\b/;
function resolveCliName(argv) {
  if (argv === void 0) {
    argv = process.argv;
  }
  var argv1 = argv[1];
  if (!argv1) {
    return exports.DEFAULT_CLI_NAME;
  }
  var base = node_path_1.default.basename(argv1).trim();
  if (KNOWN_CLI_NAMES.has(base)) {
    return base;
  }
  return exports.DEFAULT_CLI_NAME;
}
function replaceCliName(command, cliName) {
  if (cliName === void 0) {
    cliName = resolveCliName();
  }
  if (!command.trim()) {
    return command;
  }
  if (!CLI_PREFIX_RE.test(command)) {
    return command;
  }
  return command.replace(CLI_PREFIX_RE, function (_match, runner) {
    return "".concat(runner !== null && runner !== void 0 ? runner : "").concat(cliName);
  });
}
