"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) {
          k2 = k;
        }
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) {
          k2 = k;
        }
        o[k2] = m[k];
      });
var __exportStar =
  (this && this.__exportStar) ||
  function (m, exports) {
    for (var p in m) {
      if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p))
        __createBinding(exports, m, p);
    }
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelsSchema = exports.ChannelHeartbeatVisibilitySchema = void 0;
var zod_1 = require("zod");
var zod_schema_providers_core_js_1 = require("./zod-schema.providers-core.js");
var zod_schema_providers_whatsapp_js_1 = require("./zod-schema.providers-whatsapp.js");
var zod_schema_core_js_1 = require("./zod-schema.core.js");
var zod_schema_channels_js_1 = require("./zod-schema.channels.js");
__exportStar(require("./zod-schema.providers-core.js"), exports);
__exportStar(require("./zod-schema.providers-whatsapp.js"), exports);
var zod_schema_channels_js_2 = require("./zod-schema.channels.js");
Object.defineProperty(exports, "ChannelHeartbeatVisibilitySchema", {
  enumerable: true,
  get: function () {
    return zod_schema_channels_js_2.ChannelHeartbeatVisibilitySchema;
  },
});
exports.ChannelsSchema = zod_1.z
  .object({
    defaults: zod_1.z
      .object({
        groupPolicy: zod_schema_core_js_1.GroupPolicySchema.optional(),
        heartbeat: zod_schema_channels_js_1.ChannelHeartbeatVisibilitySchema,
      })
      .strict()
      .optional(),
    whatsapp: zod_schema_providers_whatsapp_js_1.WhatsAppConfigSchema.optional(),
    telegram: zod_schema_providers_core_js_1.TelegramConfigSchema.optional(),
    discord: zod_schema_providers_core_js_1.DiscordConfigSchema.optional(),
    googlechat: zod_schema_providers_core_js_1.GoogleChatConfigSchema.optional(),
    slack: zod_schema_providers_core_js_1.SlackConfigSchema.optional(),
    signal: zod_schema_providers_core_js_1.SignalConfigSchema.optional(),
    imessage: zod_schema_providers_core_js_1.IMessageConfigSchema.optional(),
    bluebubbles: zod_schema_providers_core_js_1.BlueBubblesConfigSchema.optional(),
    msteams: zod_schema_providers_core_js_1.MSTeamsConfigSchema.optional(),
  })
  .passthrough() // Allow extension channel configs (nostr, matrix, zalo, etc.)
  .optional();
