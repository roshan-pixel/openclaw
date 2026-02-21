"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BRACKETED_PASTE_END = exports.BRACKETED_PASTE_START = void 0;
exports.encodeKeySequence = encodeKeySequence;
exports.encodePaste = encodePaste;
var ESC = "\x1b";
var CR = "\r";
var TAB = "\t";
var BACKSPACE = "\x7f";
exports.BRACKETED_PASTE_START = "".concat(ESC, "[200~");
exports.BRACKETED_PASTE_END = "".concat(ESC, "[201~");
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
var namedKeyMap = new Map([
  ["enter", CR],
  ["return", CR],
  ["tab", TAB],
  ["escape", ESC],
  ["esc", ESC],
  ["space", " "],
  ["bspace", BACKSPACE],
  ["backspace", BACKSPACE],
  ["up", "".concat(ESC, "[A")],
  ["down", "".concat(ESC, "[B")],
  ["right", "".concat(ESC, "[C")],
  ["left", "".concat(ESC, "[D")],
  ["home", "".concat(ESC, "[1~")],
  ["end", "".concat(ESC, "[4~")],
  ["pageup", "".concat(ESC, "[5~")],
  ["pgup", "".concat(ESC, "[5~")],
  ["ppage", "".concat(ESC, "[5~")],
  ["pagedown", "".concat(ESC, "[6~")],
  ["pgdn", "".concat(ESC, "[6~")],
  ["npage", "".concat(ESC, "[6~")],
  ["insert", "".concat(ESC, "[2~")],
  ["ic", "".concat(ESC, "[2~")],
  ["delete", "".concat(ESC, "[3~")],
  ["del", "".concat(ESC, "[3~")],
  ["dc", "".concat(ESC, "[3~")],
  ["btab", "".concat(ESC, "[Z")],
  ["f1", "".concat(ESC, "OP")],
  ["f2", "".concat(ESC, "OQ")],
  ["f3", "".concat(ESC, "OR")],
  ["f4", "".concat(ESC, "OS")],
  ["f5", "".concat(ESC, "[15~")],
  ["f6", "".concat(ESC, "[17~")],
  ["f7", "".concat(ESC, "[18~")],
  ["f8", "".concat(ESC, "[19~")],
  ["f9", "".concat(ESC, "[20~")],
  ["f10", "".concat(ESC, "[21~")],
  ["f11", "".concat(ESC, "[23~")],
  ["f12", "".concat(ESC, "[24~")],
  ["kp/", "".concat(ESC, "Oo")],
  ["kp*", "".concat(ESC, "Oj")],
  ["kp-", "".concat(ESC, "Om")],
  ["kp+", "".concat(ESC, "Ok")],
  ["kp7", "".concat(ESC, "Ow")],
  ["kp8", "".concat(ESC, "Ox")],
  ["kp9", "".concat(ESC, "Oy")],
  ["kp4", "".concat(ESC, "Ot")],
  ["kp5", "".concat(ESC, "Ou")],
  ["kp6", "".concat(ESC, "Ov")],
  ["kp1", "".concat(ESC, "Oq")],
  ["kp2", "".concat(ESC, "Or")],
  ["kp3", "".concat(ESC, "Os")],
  ["kp0", "".concat(ESC, "Op")],
  ["kp.", "".concat(ESC, "On")],
  ["kpenter", "".concat(ESC, "OM")],
]);
var modifiableNamedKeys = new Set([
  "up",
  "down",
  "left",
  "right",
  "home",
  "end",
  "pageup",
  "pgup",
  "ppage",
  "pagedown",
  "pgdn",
  "npage",
  "insert",
  "ic",
  "delete",
  "del",
  "dc",
]);
function encodeKeySequence(request) {
  var _a, _b;
  var warnings = [];
  var data = "";
  if (request.literal) {
    data += request.literal;
  }
  if ((_a = request.hex) === null || _a === void 0 ? void 0 : _a.length) {
    for (var _i = 0, _c = request.hex; _i < _c.length; _i++) {
      var raw = _c[_i];
      var byte = parseHexByte(raw);
      if (byte === null) {
        warnings.push("Invalid hex byte: ".concat(raw));
        continue;
      }
      data += String.fromCharCode(byte);
    }
  }
  if ((_b = request.keys) === null || _b === void 0 ? void 0 : _b.length) {
    for (var _d = 0, _e = request.keys; _d < _e.length; _d++) {
      var token = _e[_d];
      data += encodeKeyToken(token, warnings);
    }
  }
  return { data: data, warnings: warnings };
}
function encodePaste(text, bracketed) {
  if (bracketed === void 0) {
    bracketed = true;
  }
  if (!bracketed) {
    return text;
  }
  return "".concat(exports.BRACKETED_PASTE_START).concat(text).concat(exports.BRACKETED_PASTE_END);
}
function encodeKeyToken(raw, warnings) {
  var token = raw.trim();
  if (!token) {
    return "";
  }
  if (token.length === 2 && token.startsWith("^")) {
    var ctrl = toCtrlChar(token[1]);
    if (ctrl) {
      return ctrl;
    }
  }
  var parsed = parseModifiers(token);
  var base = parsed.base;
  var baseLower = base.toLowerCase();
  if (baseLower === "tab" && parsed.mods.shift) {
    return "".concat(ESC, "[Z");
  }
  var baseSeq = namedKeyMap.get(baseLower);
  if (baseSeq) {
    var seq = baseSeq;
    if (modifiableNamedKeys.has(baseLower) && hasAnyModifier(parsed.mods)) {
      var mod = xtermModifier(parsed.mods);
      if (mod > 1) {
        var modified = applyXtermModifier(seq, mod);
        if (modified) {
          seq = modified;
          return seq;
        }
      }
    }
    if (parsed.mods.alt) {
      return "".concat(ESC).concat(seq);
    }
    return seq;
  }
  if (base.length === 1) {
    return applyCharModifiers(base, parsed.mods);
  }
  if (parsed.hasModifiers) {
    warnings.push('Unknown key "'.concat(base, '" for modifiers; sending literal.'));
  }
  return base;
}
function parseModifiers(token) {
  var mods = { ctrl: false, alt: false, shift: false };
  var rest = token;
  var sawModifiers = false;
  while (rest.length > 2 && rest[1] === "-") {
    var mod = rest[0].toLowerCase();
    if (mod === "c") {
      mods.ctrl = true;
    } else if (mod === "m") {
      mods.alt = true;
    } else if (mod === "s") {
      mods.shift = true;
    } else {
      break;
    }
    sawModifiers = true;
    rest = rest.slice(2);
  }
  return { mods: mods, base: rest, hasModifiers: sawModifiers };
}
function applyCharModifiers(char, mods) {
  var value = char;
  if (mods.shift && value.length === 1 && /[a-z]/.test(value)) {
    value = value.toUpperCase();
  }
  if (mods.ctrl) {
    var ctrl = toCtrlChar(value);
    if (ctrl) {
      value = ctrl;
    }
  }
  if (mods.alt) {
    value = "".concat(ESC).concat(value);
  }
  return value;
}
function toCtrlChar(char) {
  if (char.length !== 1) {
    return null;
  }
  if (char === "?") {
    return "\x7f";
  }
  var code = char.toUpperCase().charCodeAt(0);
  if (code >= 64 && code <= 95) {
    return String.fromCharCode(code & 0x1f);
  }
  return null;
}
function xtermModifier(mods) {
  var mod = 1;
  if (mods.shift) {
    mod += 1;
  }
  if (mods.alt) {
    mod += 2;
  }
  if (mods.ctrl) {
    mod += 4;
  }
  return mod;
}
function applyXtermModifier(sequence, modifier) {
  var escPattern = escapeRegExp(ESC);
  var csiNumber = new RegExp("^".concat(escPattern, "\\[(\\d+)([~A-Z])$"));
  var csiArrow = new RegExp("^".concat(escPattern, "\\[(A|B|C|D|H|F)$"));
  var numberMatch = sequence.match(csiNumber);
  if (numberMatch) {
    return "".concat(ESC, "[").concat(numberMatch[1], ";").concat(modifier).concat(numberMatch[2]);
  }
  var arrowMatch = sequence.match(csiArrow);
  if (arrowMatch) {
    return "".concat(ESC, "[1;").concat(modifier).concat(arrowMatch[1]);
  }
  return null;
}
function hasAnyModifier(mods) {
  return mods.ctrl || mods.alt || mods.shift;
}
function parseHexByte(raw) {
  var trimmed = raw.trim().toLowerCase();
  var normalized = trimmed.startsWith("0x") ? trimmed.slice(2) : trimmed;
  if (!/^[0-9a-f]{1,2}$/.test(normalized)) {
    return null;
  }
  var value = Number.parseInt(normalized, 16);
  if (Number.isNaN(value) || value < 0 || value > 0xff) {
    return null;
  }
  return value;
}
