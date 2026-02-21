"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) {
            throw t[1];
          }
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return (
      (g.next = verb(0)),
      (g["throw"] = verb(1)),
      (g["return"] = verb(2)),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) {
        throw new TypeError("Generator is already executing.");
      }
      while ((g && ((g = 0), op[0] && (_ = 0)), _)) {
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                    ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                    : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      }
      if (op[0] & 5) {
        throw op[1];
      }
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.__resetDiscordChannelInfoCacheForTest = __resetDiscordChannelInfoCacheForTest;
exports.resolveDiscordChannelInfo = resolveDiscordChannelInfo;
exports.resolveMediaList = resolveMediaList;
exports.resolveDiscordMessageText = resolveDiscordMessageText;
exports.buildDiscordMediaPayload = buildDiscordMediaPayload;
var globals_js_1 = require("../../globals.js");
var fetch_js_1 = require("../../media/fetch.js");
var store_js_1 = require("../../media/store.js");
var DISCORD_CHANNEL_INFO_CACHE_TTL_MS = 5 * 60 * 1000;
var DISCORD_CHANNEL_INFO_NEGATIVE_CACHE_TTL_MS = 30 * 1000;
var DISCORD_CHANNEL_INFO_CACHE = new Map();
function __resetDiscordChannelInfoCacheForTest() {
  DISCORD_CHANNEL_INFO_CACHE.clear();
}
function resolveDiscordChannelInfo(client, channelId) {
  return __awaiter(this, void 0, void 0, function () {
    var cached, channel, name_1, topic, parentId, ownerId, payload, err_1;
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
      switch (_e.label) {
        case 0:
          cached = DISCORD_CHANNEL_INFO_CACHE.get(channelId);
          if (cached) {
            if (cached.expiresAt > Date.now()) {
              return [2 /*return*/, cached.value];
            }
            DISCORD_CHANNEL_INFO_CACHE.delete(channelId);
          }
          _e.label = 1;
        case 1:
          _e.trys.push([1, 3, , 4]);
          return [4 /*yield*/, client.fetchChannel(channelId)];
        case 2:
          channel = _e.sent();
          if (!channel) {
            DISCORD_CHANNEL_INFO_CACHE.set(channelId, {
              value: null,
              expiresAt: Date.now() + DISCORD_CHANNEL_INFO_NEGATIVE_CACHE_TTL_MS,
            });
            return [2 /*return*/, null];
          }
          name_1 =
            "name" in channel
              ? (_a = channel.name) !== null && _a !== void 0
                ? _a
                : undefined
              : undefined;
          topic =
            "topic" in channel
              ? (_b = channel.topic) !== null && _b !== void 0
                ? _b
                : undefined
              : undefined;
          parentId =
            "parentId" in channel
              ? (_c = channel.parentId) !== null && _c !== void 0
                ? _c
                : undefined
              : undefined;
          ownerId =
            "ownerId" in channel
              ? (_d = channel.ownerId) !== null && _d !== void 0
                ? _d
                : undefined
              : undefined;
          payload = {
            type: channel.type,
            name: name_1,
            topic: topic,
            parentId: parentId,
            ownerId: ownerId,
          };
          DISCORD_CHANNEL_INFO_CACHE.set(channelId, {
            value: payload,
            expiresAt: Date.now() + DISCORD_CHANNEL_INFO_CACHE_TTL_MS,
          });
          return [2 /*return*/, payload];
        case 3:
          err_1 = _e.sent();
          (0, globals_js_1.logVerbose)(
            "discord: failed to fetch channel ".concat(channelId, ": ").concat(String(err_1)),
          );
          DISCORD_CHANNEL_INFO_CACHE.set(channelId, {
            value: null,
            expiresAt: Date.now() + DISCORD_CHANNEL_INFO_NEGATIVE_CACHE_TTL_MS,
          });
          return [2 /*return*/, null];
        case 4:
          return [2 /*return*/];
      }
    });
  });
}
function resolveMediaList(message, maxBytes) {
  return __awaiter(this, void 0, void 0, function () {
    var attachments, out, _i, attachments_1, attachment, fetched, saved, err_2, id;
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
      switch (_e.label) {
        case 0:
          attachments = (_a = message.attachments) !== null && _a !== void 0 ? _a : [];
          if (attachments.length === 0) {
            return [2 /*return*/, []];
          }
          out = [];
          ((_i = 0), (attachments_1 = attachments));
          _e.label = 1;
        case 1:
          if (!(_i < attachments_1.length)) {
            return [3 /*break*/, 7];
          }
          attachment = attachments_1[_i];
          _e.label = 2;
        case 2:
          _e.trys.push([2, 5, , 6]);
          return [
            4 /*yield*/,
            (0, fetch_js_1.fetchRemoteMedia)({
              url: attachment.url,
              filePathHint:
                (_b = attachment.filename) !== null && _b !== void 0 ? _b : attachment.url,
            }),
          ];
        case 3:
          fetched = _e.sent();
          return [
            4 /*yield*/,
            (0, store_js_1.saveMediaBuffer)(
              fetched.buffer,
              (_c = fetched.contentType) !== null && _c !== void 0 ? _c : attachment.content_type,
              "inbound",
              maxBytes,
            ),
          ];
        case 4:
          saved = _e.sent();
          out.push({
            path: saved.path,
            contentType: saved.contentType,
            placeholder: inferPlaceholder(attachment),
          });
          return [3 /*break*/, 6];
        case 5:
          err_2 = _e.sent();
          id = (_d = attachment.id) !== null && _d !== void 0 ? _d : attachment.url;
          (0, globals_js_1.logVerbose)(
            "discord: failed to download attachment ".concat(id, ": ").concat(String(err_2)),
          );
          return [3 /*break*/, 6];
        case 6:
          _i++;
          return [3 /*break*/, 1];
        case 7:
          return [2 /*return*/, out];
      }
    });
  });
}
function inferPlaceholder(attachment) {
  var _a;
  var mime = (_a = attachment.content_type) !== null && _a !== void 0 ? _a : "";
  if (mime.startsWith("image/")) {
    return "<media:image>";
  }
  if (mime.startsWith("video/")) {
    return "<media:video>";
  }
  if (mime.startsWith("audio/")) {
    return "<media:audio>";
  }
  return "<media:document>";
}
function isImageAttachment(attachment) {
  var _a, _b, _c;
  var mime = (_a = attachment.content_type) !== null && _a !== void 0 ? _a : "";
  if (mime.startsWith("image/")) {
    return true;
  }
  var name =
    (_c = (_b = attachment.filename) === null || _b === void 0 ? void 0 : _b.toLowerCase()) !==
      null && _c !== void 0
      ? _c
      : "";
  if (!name) {
    return false;
  }
  return /\.(avif|bmp|gif|heic|heif|jpe?g|png|tiff?|webp)$/.test(name);
}
function buildDiscordAttachmentPlaceholder(attachments) {
  if (!attachments || attachments.length === 0) {
    return "";
  }
  var count = attachments.length;
  var allImages = attachments.every(isImageAttachment);
  var label = allImages ? "image" : "file";
  var suffix = count === 1 ? label : "".concat(label, "s");
  var tag = allImages ? "<media:image>" : "<media:document>";
  return "".concat(tag, " (").concat(count, " ").concat(suffix, ")");
}
function resolveDiscordMessageText(message, options) {
  var _a, _b, _c, _d;
  var baseText =
    ((_a = message.content) === null || _a === void 0 ? void 0 : _a.trim()) ||
    buildDiscordAttachmentPlaceholder(message.attachments) ||
    ((_c = (_b = message.embeds) === null || _b === void 0 ? void 0 : _b[0]) === null ||
    _c === void 0
      ? void 0
      : _c.description) ||
    ((_d = options === null || options === void 0 ? void 0 : options.fallbackText) === null ||
    _d === void 0
      ? void 0
      : _d.trim()) ||
    "";
  if (!(options === null || options === void 0 ? void 0 : options.includeForwarded)) {
    return baseText;
  }
  var forwardedText = resolveDiscordForwardedMessagesText(message);
  if (!forwardedText) {
    return baseText;
  }
  if (!baseText) {
    return forwardedText;
  }
  return "".concat(baseText, "\n").concat(forwardedText);
}
function resolveDiscordForwardedMessagesText(message) {
  var snapshots = resolveDiscordMessageSnapshots(message);
  if (snapshots.length === 0) {
    return "";
  }
  var forwardedBlocks = snapshots
    .map(function (snapshot) {
      var snapshotMessage = snapshot.message;
      if (!snapshotMessage) {
        return null;
      }
      var text = resolveDiscordSnapshotMessageText(snapshotMessage);
      if (!text) {
        return null;
      }
      var authorLabel = formatDiscordSnapshotAuthor(snapshotMessage.author);
      var heading = authorLabel
        ? "[Forwarded message from ".concat(authorLabel, "]")
        : "[Forwarded message]";
      return "".concat(heading, "\n").concat(text);
    })
    .filter(function (entry) {
      return Boolean(entry);
    });
  if (forwardedBlocks.length === 0) {
    return "";
  }
  return forwardedBlocks.join("\n\n");
}
function resolveDiscordMessageSnapshots(message) {
  var _a, _b;
  var rawData = message.rawData;
  var snapshots =
    (_b =
      (_a = rawData === null || rawData === void 0 ? void 0 : rawData.message_snapshots) !== null &&
      _a !== void 0
        ? _a
        : message.message_snapshots) !== null && _b !== void 0
      ? _b
      : message.messageSnapshots;
  if (!Array.isArray(snapshots)) {
    return [];
  }
  return snapshots.filter(function (entry) {
    return Boolean(entry) && typeof entry === "object";
  });
}
function resolveDiscordSnapshotMessageText(snapshot) {
  var _a, _b, _c, _d, _e, _f;
  var content =
    (_b = (_a = snapshot.content) === null || _a === void 0 ? void 0 : _a.trim()) !== null &&
    _b !== void 0
      ? _b
      : "";
  var attachmentText = buildDiscordAttachmentPlaceholder(
    (_c = snapshot.attachments) !== null && _c !== void 0 ? _c : undefined,
  );
  var embed = (_d = snapshot.embeds) === null || _d === void 0 ? void 0 : _d[0];
  var embedText =
    ((_e = embed === null || embed === void 0 ? void 0 : embed.description) === null ||
    _e === void 0
      ? void 0
      : _e.trim()) ||
    ((_f = embed === null || embed === void 0 ? void 0 : embed.title) === null || _f === void 0
      ? void 0
      : _f.trim()) ||
    "";
  return content || attachmentText || embedText || "";
}
function formatDiscordSnapshotAuthor(author) {
  var _a, _b, _c, _d;
  if (!author) {
    return undefined;
  }
  var globalName = (_a = author.global_name) !== null && _a !== void 0 ? _a : undefined;
  var username = (_b = author.username) !== null && _b !== void 0 ? _b : undefined;
  var name = (_c = author.name) !== null && _c !== void 0 ? _c : undefined;
  var discriminator = (_d = author.discriminator) !== null && _d !== void 0 ? _d : undefined;
  var base = globalName || username || name;
  if (username && discriminator && discriminator !== "0") {
    return "@".concat(username, "#").concat(discriminator);
  }
  if (base) {
    return "@".concat(base);
  }
  if (author.id) {
    return "@".concat(author.id);
  }
  return undefined;
}
function buildDiscordMediaPayload(mediaList) {
  var first = mediaList[0];
  var mediaPaths = mediaList.map(function (media) {
    return media.path;
  });
  var mediaTypes = mediaList
    .map(function (media) {
      return media.contentType;
    })
    .filter(Boolean);
  return {
    MediaPath: first === null || first === void 0 ? void 0 : first.path,
    MediaType: first === null || first === void 0 ? void 0 : first.contentType,
    MediaUrl: first === null || first === void 0 ? void 0 : first.path,
    MediaPaths: mediaPaths.length > 0 ? mediaPaths : undefined,
    MediaUrls: mediaPaths.length > 0 ? mediaPaths : undefined,
    MediaTypes: mediaTypes.length > 0 ? mediaTypes : undefined,
  };
}
