"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeAllowlist = mergeAllowlist;
exports.summarizeMapping = summarizeMapping;
function mergeAllowlist(params) {
  var _a;
  var seen = new Set();
  var merged = [];
  var push = function (value) {
    var normalized = value.trim();
    if (!normalized) {
      return;
    }
    var key = normalized.toLowerCase();
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    merged.push(normalized);
  };
  for (
    var _i = 0, _b = (_a = params.existing) !== null && _a !== void 0 ? _a : [];
    _i < _b.length;
    _i++
  ) {
    var entry = _b[_i];
    push(String(entry));
  }
  for (var _c = 0, _d = params.additions; _c < _d.length; _c++) {
    var entry = _d[_c];
    push(entry);
  }
  return merged;
}
function summarizeMapping(label, mapping, unresolved, runtime) {
  var _a;
  var lines = [];
  if (mapping.length > 0) {
    var sample = mapping.slice(0, 6);
    var suffix =
      mapping.length > sample.length ? " (+".concat(mapping.length - sample.length, ")") : "";
    lines.push("".concat(label, " resolved: ").concat(sample.join(", ")).concat(suffix));
  }
  if (unresolved.length > 0) {
    var sample = unresolved.slice(0, 6);
    var suffix =
      unresolved.length > sample.length ? " (+".concat(unresolved.length - sample.length, ")") : "";
    lines.push("".concat(label, " unresolved: ").concat(sample.join(", ")).concat(suffix));
  }
  if (lines.length > 0) {
    (_a = runtime.log) === null || _a === void 0 ? void 0 : _a.call(runtime, lines.join("\n"));
  }
}
