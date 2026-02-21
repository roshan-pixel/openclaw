"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TELEGRAM_COMMAND_NAME_PATTERN = void 0;
exports.normalizeTelegramCommandName = normalizeTelegramCommandName;
exports.normalizeTelegramCommandDescription = normalizeTelegramCommandDescription;
exports.resolveTelegramCustomCommands = resolveTelegramCustomCommands;
exports.TELEGRAM_COMMAND_NAME_PATTERN = /^[a-z0-9_]{1,32}$/;
function normalizeTelegramCommandName(value) {
  var trimmed = value.trim();
  if (!trimmed) {
    return "";
  }
  var withoutSlash = trimmed.startsWith("/") ? trimmed.slice(1) : trimmed;
  return withoutSlash.trim().toLowerCase();
}
function normalizeTelegramCommandDescription(value) {
  return value.trim();
}
function resolveTelegramCustomCommands(params) {
  var _a, _b, _c;
  var entries = Array.isArray(params.commands) ? params.commands : [];
  var reserved = (_a = params.reservedCommands) !== null && _a !== void 0 ? _a : new Set();
  var checkReserved = params.checkReserved !== false;
  var checkDuplicates = params.checkDuplicates !== false;
  var seen = new Set();
  var resolved = [];
  var issues = [];
  for (var index = 0; index < entries.length; index += 1) {
    var entry = entries[index];
    var normalized = normalizeTelegramCommandName(
      String(
        (_b = entry === null || entry === void 0 ? void 0 : entry.command) !== null && _b !== void 0
          ? _b
          : "",
      ),
    );
    if (!normalized) {
      issues.push({
        index: index,
        field: "command",
        message: "Telegram custom command is missing a command name.",
      });
      continue;
    }
    if (!exports.TELEGRAM_COMMAND_NAME_PATTERN.test(normalized)) {
      issues.push({
        index: index,
        field: "command",
        message: 'Telegram custom command "/'.concat(
          normalized,
          '" is invalid (use a-z, 0-9, underscore; max 32 chars).',
        ),
      });
      continue;
    }
    if (checkReserved && reserved.has(normalized)) {
      issues.push({
        index: index,
        field: "command",
        message: 'Telegram custom command "/'.concat(
          normalized,
          '" conflicts with a native command.',
        ),
      });
      continue;
    }
    if (checkDuplicates && seen.has(normalized)) {
      issues.push({
        index: index,
        field: "command",
        message: 'Telegram custom command "/'.concat(normalized, '" is duplicated.'),
      });
      continue;
    }
    var description = normalizeTelegramCommandDescription(
      String(
        (_c = entry === null || entry === void 0 ? void 0 : entry.description) !== null &&
          _c !== void 0
          ? _c
          : "",
      ),
    );
    if (!description) {
      issues.push({
        index: index,
        field: "description",
        message: 'Telegram custom command "/'.concat(normalized, '" is missing a description.'),
      });
      continue;
    }
    if (checkDuplicates) {
      seen.add(normalized);
    }
    resolved.push({ command: normalized, description: description });
  }
  return { commands: resolved, issues: issues };
}
