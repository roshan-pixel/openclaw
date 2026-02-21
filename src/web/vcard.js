"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseVcard = parseVcard;
var ALLOWED_VCARD_KEYS = new Set(["FN", "N", "TEL"]);
function parseVcard(vcard) {
  if (!vcard) {
    return { phones: [] };
  }
  var lines = vcard.split(/\r?\n/);
  var nameFromN;
  var nameFromFn;
  var phones = [];
  for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
    var rawLine = lines_1[_i];
    var line = rawLine.trim();
    if (!line) {
      continue;
    }
    var colonIndex = line.indexOf(":");
    if (colonIndex === -1) {
      continue;
    }
    var key = line.slice(0, colonIndex).toUpperCase();
    var rawValue = line.slice(colonIndex + 1).trim();
    if (!rawValue) {
      continue;
    }
    var baseKey = normalizeVcardKey(key);
    if (!baseKey || !ALLOWED_VCARD_KEYS.has(baseKey)) {
      continue;
    }
    var value = cleanVcardValue(rawValue);
    if (!value) {
      continue;
    }
    if (baseKey === "FN" && !nameFromFn) {
      nameFromFn = normalizeVcardName(value);
      continue;
    }
    if (baseKey === "N" && !nameFromN) {
      nameFromN = normalizeVcardName(value);
      continue;
    }
    if (baseKey === "TEL") {
      var phone = normalizeVcardPhone(value);
      if (phone) {
        phones.push(phone);
      }
    }
  }
  return {
    name: nameFromFn !== null && nameFromFn !== void 0 ? nameFromFn : nameFromN,
    phones: phones,
  };
}
function normalizeVcardKey(key) {
  var primary = key.split(";")[0];
  if (!primary) {
    return undefined;
  }
  var segments = primary.split(".");
  return segments[segments.length - 1] || undefined;
}
function cleanVcardValue(value) {
  return value.replace(/\\n/gi, " ").replace(/\\,/g, ",").replace(/\\;/g, ";").trim();
}
function normalizeVcardName(value) {
  return value.replace(/;/g, " ").replace(/\s+/g, " ").trim();
}
function normalizeVcardPhone(value) {
  var trimmed = value.trim();
  if (!trimmed) {
    return "";
  }
  if (trimmed.toLowerCase().startsWith("tel:")) {
    return trimmed.slice(4).trim();
  }
  return trimmed;
}
