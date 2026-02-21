"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveSenderLabel = resolveSenderLabel;
exports.listSenderLabelCandidates = listSenderLabelCandidates;
function normalize(value) {
  var trimmed = value === null || value === void 0 ? void 0 : value.trim();
  return trimmed ? trimmed : undefined;
}
function resolveSenderLabel(params) {
  var _a, _b, _c;
  var name = normalize(params.name);
  var username = normalize(params.username);
  var tag = normalize(params.tag);
  var e164 = normalize(params.e164);
  var id = normalize(params.id);
  var display =
    (_b =
      (_a = name !== null && name !== void 0 ? name : username) !== null && _a !== void 0
        ? _a
        : tag) !== null && _b !== void 0
      ? _b
      : "";
  var idPart =
    (_c = e164 !== null && e164 !== void 0 ? e164 : id) !== null && _c !== void 0 ? _c : "";
  if (display && idPart && display !== idPart) {
    return "".concat(display, " (").concat(idPart, ")");
  }
  return display || idPart || null;
}
function listSenderLabelCandidates(params) {
  var candidates = new Set();
  var name = normalize(params.name);
  var username = normalize(params.username);
  var tag = normalize(params.tag);
  var e164 = normalize(params.e164);
  var id = normalize(params.id);
  if (name) {
    candidates.add(name);
  }
  if (username) {
    candidates.add(username);
  }
  if (tag) {
    candidates.add(tag);
  }
  if (e164) {
    candidates.add(e164);
  }
  if (id) {
    candidates.add(id);
  }
  var resolved = resolveSenderLabel(params);
  if (resolved) {
    candidates.add(resolved);
  }
  return Array.from(candidates);
}
