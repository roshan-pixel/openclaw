"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChannelMessageAdapter = getChannelMessageAdapter;
var DEFAULT_ADAPTER = {
  supportsEmbeds: false,
};
var DISCORD_ADAPTER = {
  supportsEmbeds: true,
  buildCrossContextEmbeds: function (originLabel) {
    return [
      {
        description: "From ".concat(originLabel),
      },
    ];
  },
};
function getChannelMessageAdapter(channel) {
  if (channel === "discord") {
    return DISCORD_ADAPTER;
  }
  return DEFAULT_ADAPTER;
}
