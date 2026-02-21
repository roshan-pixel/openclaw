"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatCliCommand = formatCliCommand;
var profile_utils_js_1 = require("./profile-utils.js");
var cli_name_js_1 = require("./cli-name.js");
var CLI_PREFIX_RE = /^(?:pnpm|npm|bunx|npx)\s+openclaw\b|^openclaw\b/;
var PROFILE_FLAG_RE = /(?:^|\s)--profile(?:\s|=|$)/;
var DEV_FLAG_RE = /(?:^|\s)--dev(?:\s|$)/;
function formatCliCommand(command, env) {
  if (env === void 0) {
    env = process.env;
  }
  var cliName = (0, cli_name_js_1.resolveCliName)();
  var normalizedCommand = (0, cli_name_js_1.replaceCliName)(command, cliName);
  var profile = (0, profile_utils_js_1.normalizeProfileName)(env.OPENCLAW_PROFILE);
  if (!profile) {
    return normalizedCommand;
  }
  if (!CLI_PREFIX_RE.test(normalizedCommand)) {
    return normalizedCommand;
  }
  if (PROFILE_FLAG_RE.test(normalizedCommand) || DEV_FLAG_RE.test(normalizedCommand)) {
    return normalizedCommand;
  }
  return normalizedCommand.replace(CLI_PREFIX_RE, function (match) {
    return "".concat(match, " --profile ").concat(profile);
  });
}
