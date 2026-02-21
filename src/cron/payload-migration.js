"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrateLegacyCronPayload = migrateLegacyCronPayload;
function readString(value) {
  if (typeof value !== "string") {
    return undefined;
  }
  return value;
}
function normalizeChannel(value) {
  return value.trim().toLowerCase();
}
function migrateLegacyCronPayload(payload) {
  var mutated = false;
  var channelValue = readString(payload.channel);
  var providerValue = readString(payload.provider);
  var nextChannel =
    typeof channelValue === "string" && channelValue.trim().length > 0
      ? normalizeChannel(channelValue)
      : typeof providerValue === "string" && providerValue.trim().length > 0
        ? normalizeChannel(providerValue)
        : "";
  if (nextChannel) {
    if (channelValue !== nextChannel) {
      payload.channel = nextChannel;
      mutated = true;
    }
  }
  if ("provider" in payload) {
    delete payload.provider;
    mutated = true;
  }
  return mutated;
}
