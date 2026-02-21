"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveNativeSkillsEnabled = resolveNativeSkillsEnabled;
exports.resolveNativeCommandsEnabled = resolveNativeCommandsEnabled;
exports.isNativeCommandsExplicitlyDisabled = isNativeCommandsExplicitlyDisabled;
var index_js_1 = require("../channels/plugins/index.js");
function resolveAutoDefault(providerId) {
  var id = (0, index_js_1.normalizeChannelId)(providerId);
  if (!id) {
    return false;
  }
  if (id === "discord" || id === "telegram") {
    return true;
  }
  if (id === "slack") {
    return false;
  }
  return false;
}
function resolveNativeSkillsEnabled(params) {
  var providerId = params.providerId,
    providerSetting = params.providerSetting,
    globalSetting = params.globalSetting;
  var setting = providerSetting === undefined ? globalSetting : providerSetting;
  if (setting === true) {
    return true;
  }
  if (setting === false) {
    return false;
  }
  return resolveAutoDefault(providerId);
}
function resolveNativeCommandsEnabled(params) {
  var providerId = params.providerId,
    providerSetting = params.providerSetting,
    globalSetting = params.globalSetting;
  var setting = providerSetting === undefined ? globalSetting : providerSetting;
  if (setting === true) {
    return true;
  }
  if (setting === false) {
    return false;
  }
  // auto or undefined -> heuristic
  return resolveAutoDefault(providerId);
}
function isNativeCommandsExplicitlyDisabled(params) {
  var providerSetting = params.providerSetting,
    globalSetting = params.globalSetting;
  if (providerSetting === false) {
    return true;
  }
  if (providerSetting === undefined) {
    return globalSetting === false;
  }
  return false;
}
