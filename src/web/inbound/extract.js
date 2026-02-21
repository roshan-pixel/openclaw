"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractMentionedJids = extractMentionedJids;
exports.extractText = extractText;
exports.extractMediaPlaceholder = extractMediaPlaceholder;
exports.extractLocationData = extractLocationData;
exports.describeReplyContext = describeReplyContext;
var baileys_1 = require("@whiskeysockets/baileys");
var location_js_1 = require("../../channels/location.js");
var globals_js_1 = require("../../globals.js");
var utils_js_1 = require("../../utils.js");
var vcard_js_1 = require("../vcard.js");
function unwrapMessage(message) {
  var normalized = (0, baileys_1.normalizeMessageContent)(message);
  return normalized;
}
function extractContextInfo(message) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
  if (!message) {
    return undefined;
  }
  var contentType = (0, baileys_1.getContentType)(message);
  var candidate = contentType ? message[contentType] : undefined;
  var contextInfo =
    candidate && typeof candidate === "object" && "contextInfo" in candidate
      ? candidate.contextInfo
      : undefined;
  if (contextInfo) {
    return contextInfo;
  }
  var fallback =
    (_x =
      (_v =
        (_t =
          (_r =
            (_p =
              (_m =
                (_k =
                  (_h =
                    (_f =
                      (_d =
                        (_b =
                          (_a = message.extendedTextMessage) === null || _a === void 0
                            ? void 0
                            : _a.contextInfo) !== null && _b !== void 0
                          ? _b
                          : (_c = message.imageMessage) === null || _c === void 0
                            ? void 0
                            : _c.contextInfo) !== null && _d !== void 0
                        ? _d
                        : (_e = message.videoMessage) === null || _e === void 0
                          ? void 0
                          : _e.contextInfo) !== null && _f !== void 0
                      ? _f
                      : (_g = message.documentMessage) === null || _g === void 0
                        ? void 0
                        : _g.contextInfo) !== null && _h !== void 0
                    ? _h
                    : (_j = message.audioMessage) === null || _j === void 0
                      ? void 0
                      : _j.contextInfo) !== null && _k !== void 0
                  ? _k
                  : (_l = message.stickerMessage) === null || _l === void 0
                    ? void 0
                    : _l.contextInfo) !== null && _m !== void 0
                ? _m
                : (_o = message.buttonsResponseMessage) === null || _o === void 0
                  ? void 0
                  : _o.contextInfo) !== null && _p !== void 0
              ? _p
              : (_q = message.listResponseMessage) === null || _q === void 0
                ? void 0
                : _q.contextInfo) !== null && _r !== void 0
            ? _r
            : (_s = message.templateButtonReplyMessage) === null || _s === void 0
              ? void 0
              : _s.contextInfo) !== null && _t !== void 0
          ? _t
          : (_u = message.interactiveResponseMessage) === null || _u === void 0
            ? void 0
            : _u.contextInfo) !== null && _v !== void 0
        ? _v
        : (_w = message.buttonsMessage) === null || _w === void 0
          ? void 0
          : _w.contextInfo) !== null && _x !== void 0
      ? _x
      : (_y = message.listMessage) === null || _y === void 0
        ? void 0
        : _y.contextInfo;
  if (fallback) {
    return fallback;
  }
  for (var _i = 0, _z = Object.values(message); _i < _z.length; _i++) {
    var value = _z[_i];
    if (!value || typeof value !== "object") {
      continue;
    }
    if (!("contextInfo" in value)) {
      continue;
    }
    var candidateContext = value.contextInfo;
    if (candidateContext) {
      return candidateContext;
    }
  }
  return undefined;
}
function extractMentionedJids(rawMessage) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
  var message = unwrapMessage(rawMessage);
  if (!message) {
    return undefined;
  }
  var candidates = [
    (_b =
      (_a = message.extendedTextMessage) === null || _a === void 0 ? void 0 : _a.contextInfo) ===
      null || _b === void 0
      ? void 0
      : _b.mentionedJid,
    (_g =
      (_f =
        (_e =
          (_d =
            (_c = message.extendedTextMessage) === null || _c === void 0
              ? void 0
              : _c.contextInfo) === null || _d === void 0
            ? void 0
            : _d.quotedMessage) === null || _e === void 0
          ? void 0
          : _e.extendedTextMessage) === null || _f === void 0
        ? void 0
        : _f.contextInfo) === null || _g === void 0
      ? void 0
      : _g.mentionedJid,
    (_j = (_h = message.imageMessage) === null || _h === void 0 ? void 0 : _h.contextInfo) ===
      null || _j === void 0
      ? void 0
      : _j.mentionedJid,
    (_l = (_k = message.videoMessage) === null || _k === void 0 ? void 0 : _k.contextInfo) ===
      null || _l === void 0
      ? void 0
      : _l.mentionedJid,
    (_o = (_m = message.documentMessage) === null || _m === void 0 ? void 0 : _m.contextInfo) ===
      null || _o === void 0
      ? void 0
      : _o.mentionedJid,
    (_q = (_p = message.audioMessage) === null || _p === void 0 ? void 0 : _p.contextInfo) ===
      null || _q === void 0
      ? void 0
      : _q.mentionedJid,
    (_s = (_r = message.stickerMessage) === null || _r === void 0 ? void 0 : _r.contextInfo) ===
      null || _s === void 0
      ? void 0
      : _s.mentionedJid,
    (_u =
      (_t = message.buttonsResponseMessage) === null || _t === void 0 ? void 0 : _t.contextInfo) ===
      null || _u === void 0
      ? void 0
      : _u.mentionedJid,
    (_w =
      (_v = message.listResponseMessage) === null || _v === void 0 ? void 0 : _v.contextInfo) ===
      null || _w === void 0
      ? void 0
      : _w.mentionedJid,
  ];
  var flattened = candidates
    .flatMap(function (arr) {
      return arr !== null && arr !== void 0 ? arr : [];
    })
    .filter(Boolean);
  if (flattened.length === 0) {
    return undefined;
  }
  return Array.from(new Set(flattened));
}
function extractText(rawMessage) {
  var _a, _b, _c, _d, _e, _f, _g;
  var message = unwrapMessage(rawMessage);
  if (!message) {
    return undefined;
  }
  var extracted = (0, baileys_1.extractMessageContent)(message);
  var candidates = [message, extracted && extracted !== message ? extracted : undefined];
  for (var _i = 0, candidates_1 = candidates; _i < candidates_1.length; _i++) {
    var candidate = candidates_1[_i];
    if (!candidate) {
      continue;
    }
    if (typeof candidate.conversation === "string" && candidate.conversation.trim()) {
      return candidate.conversation.trim();
    }
    var extended =
      (_a = candidate.extendedTextMessage) === null || _a === void 0 ? void 0 : _a.text;
    if (extended === null || extended === void 0 ? void 0 : extended.trim()) {
      return extended.trim();
    }
    var caption =
      (_e =
        (_c = (_b = candidate.imageMessage) === null || _b === void 0 ? void 0 : _b.caption) !==
          null && _c !== void 0
          ? _c
          : (_d = candidate.videoMessage) === null || _d === void 0
            ? void 0
            : _d.caption) !== null && _e !== void 0
        ? _e
        : (_f = candidate.documentMessage) === null || _f === void 0
          ? void 0
          : _f.caption;
    if (caption === null || caption === void 0 ? void 0 : caption.trim()) {
      return caption.trim();
    }
  }
  var contactPlaceholder =
    (_g = extractContactPlaceholder(message)) !== null && _g !== void 0
      ? _g
      : extracted && extracted !== message
        ? extractContactPlaceholder(extracted)
        : undefined;
  if (contactPlaceholder) {
    return contactPlaceholder;
  }
  return undefined;
}
function extractMediaPlaceholder(rawMessage) {
  var message = unwrapMessage(rawMessage);
  if (!message) {
    return undefined;
  }
  if (message.imageMessage) {
    return "<media:image>";
  }
  if (message.videoMessage) {
    return "<media:video>";
  }
  if (message.audioMessage) {
    return "<media:audio>";
  }
  if (message.documentMessage) {
    return "<media:document>";
  }
  if (message.stickerMessage) {
    return "<media:sticker>";
  }
  return undefined;
}
function extractContactPlaceholder(rawMessage) {
  var _a, _b, _c;
  var message = unwrapMessage(rawMessage);
  if (!message) {
    return undefined;
  }
  var contact = (_a = message.contactMessage) !== null && _a !== void 0 ? _a : undefined;
  if (contact) {
    var _d = describeContact({
        displayName: contact.displayName,
        vcard: contact.vcard,
      }),
      name_1 = _d.name,
      phones = _d.phones;
    return formatContactPlaceholder(name_1, phones);
  }
  var contactsArray =
    (_c = (_b = message.contactsArrayMessage) === null || _b === void 0 ? void 0 : _b.contacts) !==
      null && _c !== void 0
      ? _c
      : undefined;
  if (!contactsArray || contactsArray.length === 0) {
    return undefined;
  }
  var labels = contactsArray
    .map(function (entry) {
      return describeContact({ displayName: entry.displayName, vcard: entry.vcard });
    })
    .map(function (entry) {
      return formatContactLabel(entry.name, entry.phones);
    })
    .filter(function (value) {
      return Boolean(value);
    });
  return formatContactsPlaceholder(labels, contactsArray.length);
}
function describeContact(input) {
  var _a, _b;
  var displayName = ((_a = input.displayName) !== null && _a !== void 0 ? _a : "").trim();
  var parsed = (0, vcard_js_1.parseVcard)(
    (_b = input.vcard) !== null && _b !== void 0 ? _b : undefined,
  );
  var name = displayName || parsed.name;
  return { name: name, phones: parsed.phones };
}
function formatContactPlaceholder(name, phones) {
  var label = formatContactLabel(name, phones);
  if (!label) {
    return "<contact>";
  }
  return "<contact: ".concat(label, ">");
}
function formatContactsPlaceholder(labels, total) {
  var cleaned = labels
    .map(function (label) {
      return label.trim();
    })
    .filter(Boolean);
  if (cleaned.length === 0) {
    var suffix_1 = total === 1 ? "contact" : "contacts";
    return "<contacts: ".concat(total, " ").concat(suffix_1, ">");
  }
  var remaining = Math.max(total - cleaned.length, 0);
  var suffix = remaining > 0 ? " +".concat(remaining, " more") : "";
  return "<contacts: ".concat(cleaned.join(", ")).concat(suffix, ">");
}
function formatContactLabel(name, phones) {
  var phoneLabel = formatPhoneList(phones);
  var parts = [name, phoneLabel].filter(function (value) {
    return Boolean(value);
  });
  if (parts.length === 0) {
    return undefined;
  }
  return parts.join(", ");
}
function formatPhoneList(phones) {
  var _a;
  var cleaned =
    (_a =
      phones === null || phones === void 0
        ? void 0
        : phones
            .map(function (phone) {
              return phone.trim();
            })
            .filter(Boolean)) !== null && _a !== void 0
      ? _a
      : [];
  if (cleaned.length === 0) {
    return undefined;
  }
  var _b = summarizeList(cleaned, cleaned.length, 1),
    shown = _b.shown,
    remaining = _b.remaining;
  var primary = shown[0];
  if (!primary) {
    return undefined;
  }
  if (remaining === 0) {
    return primary;
  }
  return "".concat(primary, " (+").concat(remaining, " more)");
}
function summarizeList(values, total, maxShown) {
  var shown = values.slice(0, maxShown);
  var remaining = Math.max(total - shown.length, 0);
  return { shown: shown, remaining: remaining };
}
function extractLocationData(rawMessage) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  var message = unwrapMessage(rawMessage);
  if (!message) {
    return null;
  }
  var live = (_a = message.liveLocationMessage) !== null && _a !== void 0 ? _a : undefined;
  if (live) {
    var latitudeRaw = live.degreesLatitude;
    var longitudeRaw = live.degreesLongitude;
    if (latitudeRaw != null && longitudeRaw != null) {
      var latitude = Number(latitudeRaw);
      var longitude = Number(longitudeRaw);
      if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
        return {
          latitude: latitude,
          longitude: longitude,
          accuracy: (_b = live.accuracyInMeters) !== null && _b !== void 0 ? _b : undefined,
          caption: (_c = live.caption) !== null && _c !== void 0 ? _c : undefined,
          source: "live",
          isLive: true,
        };
      }
    }
  }
  var location = (_d = message.locationMessage) !== null && _d !== void 0 ? _d : undefined;
  if (location) {
    var latitudeRaw = location.degreesLatitude;
    var longitudeRaw = location.degreesLongitude;
    if (latitudeRaw != null && longitudeRaw != null) {
      var latitude = Number(latitudeRaw);
      var longitude = Number(longitudeRaw);
      if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
        var isLive = Boolean(location.isLive);
        return {
          latitude: latitude,
          longitude: longitude,
          accuracy: (_e = location.accuracyInMeters) !== null && _e !== void 0 ? _e : undefined,
          name: (_f = location.name) !== null && _f !== void 0 ? _f : undefined,
          address: (_g = location.address) !== null && _g !== void 0 ? _g : undefined,
          caption: (_h = location.comment) !== null && _h !== void 0 ? _h : undefined,
          source: isLive ? "live" : location.name || location.address ? "place" : "pin",
          isLive: isLive,
        };
      }
    }
  }
  return null;
}
function describeReplyContext(rawMessage) {
  var _a, _b;
  var message = unwrapMessage(rawMessage);
  if (!message) {
    return null;
  }
  var contextInfo = extractContextInfo(message);
  var quoted = (0, baileys_1.normalizeMessageContent)(
    contextInfo === null || contextInfo === void 0 ? void 0 : contextInfo.quotedMessage,
  );
  if (!quoted) {
    return null;
  }
  var location = extractLocationData(quoted);
  var locationText = location ? (0, location_js_1.formatLocationText)(location) : undefined;
  var text = extractText(quoted);
  var body = [text, locationText].filter(Boolean).join("\n").trim();
  if (!body) {
    body = extractMediaPlaceholder(quoted);
  }
  if (!body) {
    var quotedType = quoted ? (0, baileys_1.getContentType)(quoted) : undefined;
    (0, globals_js_1.logVerbose)(
      "Quoted message missing extractable body".concat(
        quotedType ? " (type ".concat(quotedType, ")") : "",
      ),
    );
    return null;
  }
  var senderJid =
    (_a = contextInfo === null || contextInfo === void 0 ? void 0 : contextInfo.participant) !==
      null && _a !== void 0
      ? _a
      : undefined;
  var senderE164 = senderJid
    ? (_b = (0, utils_js_1.jidToE164)(senderJid)) !== null && _b !== void 0
      ? _b
      : senderJid
    : undefined;
  var sender = senderE164 !== null && senderE164 !== void 0 ? senderE164 : "unknown sender";
  return {
    id: (contextInfo === null || contextInfo === void 0 ? void 0 : contextInfo.stanzaId)
      ? String(contextInfo.stanzaId)
      : undefined,
    body: body,
    sender: sender,
    senderJid: senderJid,
    senderE164: senderE164,
  };
}
