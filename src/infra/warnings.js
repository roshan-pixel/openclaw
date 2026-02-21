"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.installProcessWarningFilter = installProcessWarningFilter;
var warningFilterKey = Symbol.for("openclaw.warning-filter");
function shouldIgnoreWarning(warning) {
  var _a, _b, _c;
  if (
    warning.code === "DEP0040" &&
    ((_a = warning.message) === null || _a === void 0 ? void 0 : _a.includes("punycode"))
  ) {
    return true;
  }
  if (
    warning.code === "DEP0060" &&
    ((_b = warning.message) === null || _b === void 0 ? void 0 : _b.includes("util._extend"))
  ) {
    return true;
  }
  if (
    warning.name === "ExperimentalWarning" &&
    ((_c = warning.message) === null || _c === void 0
      ? void 0
      : _c.includes("SQLite is an experimental feature"))
  ) {
    return true;
  }
  return false;
}
function installProcessWarningFilter() {
  var _a;
  var globalState = globalThis;
  if ((_a = globalState[warningFilterKey]) === null || _a === void 0 ? void 0 : _a.installed) {
    return;
  }
  globalState[warningFilterKey] = { installed: true };
  process.on("warning", function (warning) {
    var _a;
    if (shouldIgnoreWarning(warning)) {
      return;
    }
    process.stderr.write(
      "".concat((_a = warning.stack) !== null && _a !== void 0 ? _a : warning.toString(), "\n"),
    );
  });
}
