"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBooleanValue = parseBooleanValue;
var DEFAULT_TRUTHY = ["true", "1", "yes", "on"];
var DEFAULT_FALSY = ["false", "0", "no", "off"];
var DEFAULT_TRUTHY_SET = new Set(DEFAULT_TRUTHY);
var DEFAULT_FALSY_SET = new Set(DEFAULT_FALSY);
function parseBooleanValue(value, options) {
  var _a, _b;
  if (options === void 0) {
    options = {};
  }
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value !== "string") {
    return undefined;
  }
  var normalized = value.trim().toLowerCase();
  if (!normalized) {
    return undefined;
  }
  var truthy = (_a = options.truthy) !== null && _a !== void 0 ? _a : DEFAULT_TRUTHY;
  var falsy = (_b = options.falsy) !== null && _b !== void 0 ? _b : DEFAULT_FALSY;
  var truthySet = truthy === DEFAULT_TRUTHY ? DEFAULT_TRUTHY_SET : new Set(truthy);
  var falsySet = falsy === DEFAULT_FALSY ? DEFAULT_FALSY_SET : new Set(falsy);
  if (truthySet.has(normalized)) {
    return true;
  }
  if (falsySet.has(normalized)) {
    return false;
  }
  return undefined;
}
