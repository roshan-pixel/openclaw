"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.missingTargetMessage = missingTargetMessage;
exports.missingTargetError = missingTargetError;
exports.ambiguousTargetMessage = ambiguousTargetMessage;
exports.ambiguousTargetError = ambiguousTargetError;
exports.unknownTargetMessage = unknownTargetMessage;
exports.unknownTargetError = unknownTargetError;
function missingTargetMessage(provider, hint) {
  return "Delivering to ".concat(provider, " requires target").concat(formatTargetHint(hint));
}
function missingTargetError(provider, hint) {
  return new Error(missingTargetMessage(provider, hint));
}
function ambiguousTargetMessage(provider, raw, hint) {
  return 'Ambiguous target "'
    .concat(raw, '" for ')
    .concat(provider, ". Provide a unique name or an explicit id.")
    .concat(formatTargetHint(hint, true));
}
function ambiguousTargetError(provider, raw, hint) {
  return new Error(ambiguousTargetMessage(provider, raw, hint));
}
function unknownTargetMessage(provider, raw, hint) {
  return 'Unknown target "'
    .concat(raw, '" for ')
    .concat(provider, ".")
    .concat(formatTargetHint(hint, true));
}
function unknownTargetError(provider, raw, hint) {
  return new Error(unknownTargetMessage(provider, raw, hint));
}
function formatTargetHint(hint, withLabel) {
  if (withLabel === void 0) {
    withLabel = false;
  }
  if (!hint) {
    return "";
  }
  return withLabel ? " Hint: ".concat(hint) : " ".concat(hint);
}
