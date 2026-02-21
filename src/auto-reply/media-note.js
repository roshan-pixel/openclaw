"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildInboundMediaNote = buildInboundMediaNote;
function formatMediaAttachedLine(params) {
  var _a, _b;
  var prefix =
    typeof params.index === "number" && typeof params.total === "number"
      ? "[media attached ".concat(params.index, "/").concat(params.total, ": ")
      : "[media attached: ";
  var typePart = ((_a = params.type) === null || _a === void 0 ? void 0 : _a.trim())
    ? " (".concat(params.type.trim(), ")")
    : "";
  var urlRaw = (_b = params.url) === null || _b === void 0 ? void 0 : _b.trim();
  var urlPart = urlRaw ? " | ".concat(urlRaw) : "";
  return "".concat(prefix).concat(params.path).concat(typePart).concat(urlPart, "]");
}
function buildInboundMediaNote(ctx) {
  var _a, _b, _c, _d, _e, _f;
  // Attachment indices follow MediaPaths/MediaUrls ordering as supplied by the channel.
  var suppressed = new Set();
  if (Array.isArray(ctx.MediaUnderstanding)) {
    for (var _i = 0, _g = ctx.MediaUnderstanding; _i < _g.length; _i++) {
      var output = _g[_i];
      suppressed.add(output.attachmentIndex);
    }
  }
  if (Array.isArray(ctx.MediaUnderstandingDecisions)) {
    for (var _h = 0, _j = ctx.MediaUnderstandingDecisions; _h < _j.length; _h++) {
      var decision = _j[_h];
      if (decision.outcome !== "success") {
        continue;
      }
      for (var _k = 0, _l = decision.attachments; _k < _l.length; _k++) {
        var attachment = _l[_k];
        if (
          ((_a = attachment.chosen) === null || _a === void 0 ? void 0 : _a.outcome) === "success"
        ) {
          suppressed.add(attachment.attachmentIndex);
        }
      }
    }
  }
  var pathsFromArray = Array.isArray(ctx.MediaPaths) ? ctx.MediaPaths : undefined;
  var paths =
    pathsFromArray && pathsFromArray.length > 0
      ? pathsFromArray
      : ((_b = ctx.MediaPath) === null || _b === void 0 ? void 0 : _b.trim())
        ? [ctx.MediaPath.trim()]
        : [];
  if (paths.length === 0) {
    return undefined;
  }
  var urls =
    Array.isArray(ctx.MediaUrls) && ctx.MediaUrls.length === paths.length
      ? ctx.MediaUrls
      : undefined;
  var types =
    Array.isArray(ctx.MediaTypes) && ctx.MediaTypes.length === paths.length
      ? ctx.MediaTypes
      : undefined;
  var entries = paths
    .map(function (entry, index) {
      var _a, _b;
      return {
        path: entry !== null && entry !== void 0 ? entry : "",
        type:
          (_a = types === null || types === void 0 ? void 0 : types[index]) !== null &&
          _a !== void 0
            ? _a
            : ctx.MediaType,
        url:
          (_b = urls === null || urls === void 0 ? void 0 : urls[index]) !== null && _b !== void 0
            ? _b
            : ctx.MediaUrl,
        index: index,
      };
    })
    .filter(function (entry) {
      return !suppressed.has(entry.index);
    });
  if (entries.length === 0) {
    return undefined;
  }
  if (entries.length === 1) {
    return formatMediaAttachedLine({
      path:
        (_d = (_c = entries[0]) === null || _c === void 0 ? void 0 : _c.path) !== null &&
        _d !== void 0
          ? _d
          : "",
      type: (_e = entries[0]) === null || _e === void 0 ? void 0 : _e.type,
      url: (_f = entries[0]) === null || _f === void 0 ? void 0 : _f.url,
    });
  }
  var count = entries.length;
  var lines = ["[media attached: ".concat(count, " files]")];
  for (var _m = 0, _o = entries.entries(); _m < _o.length; _m++) {
    var _p = _o[_m],
      idx = _p[0],
      entry = _p[1];
    lines.push(
      formatMediaAttachedLine({
        path: entry.path,
        index: idx + 1,
        total: count,
        type: entry.type,
        url: entry.url,
      }),
    );
  }
  return lines.join("\n");
}
