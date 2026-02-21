"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractMediaUserText = extractMediaUserText;
exports.formatMediaUnderstandingBody = formatMediaUnderstandingBody;
exports.formatAudioTranscripts = formatAudioTranscripts;
var MEDIA_PLACEHOLDER_RE = /^<media:[^>]+>(\s*\([^)]*\))?$/i;
var MEDIA_PLACEHOLDER_TOKEN_RE = /^<media:[^>]+>(\s*\([^)]*\))?\s*/i;
function extractMediaUserText(body) {
  var _a;
  var trimmed =
    (_a = body === null || body === void 0 ? void 0 : body.trim()) !== null && _a !== void 0
      ? _a
      : "";
  if (!trimmed) {
    return undefined;
  }
  if (MEDIA_PLACEHOLDER_RE.test(trimmed)) {
    return undefined;
  }
  var cleaned = trimmed.replace(MEDIA_PLACEHOLDER_TOKEN_RE, "").trim();
  return cleaned || undefined;
}
function formatSection(title, kind, text, userText) {
  var lines = ["[".concat(title, "]")];
  if (userText) {
    lines.push("User text:\n".concat(userText));
  }
  lines.push("".concat(kind, ":\n").concat(text));
  return lines.join("\n");
}
function formatMediaUnderstandingBody(params) {
  var _a, _b, _c, _d;
  var outputs = params.outputs.filter(function (output) {
    return output.text.trim();
  });
  if (outputs.length === 0) {
    return (_a = params.body) !== null && _a !== void 0 ? _a : "";
  }
  var userText = extractMediaUserText(params.body);
  var sections = [];
  if (userText && outputs.length > 1) {
    sections.push("User text:\n".concat(userText));
  }
  var counts = new Map();
  for (var _i = 0, outputs_1 = outputs; _i < outputs_1.length; _i++) {
    var output = outputs_1[_i];
    counts.set(
      output.kind,
      ((_b = counts.get(output.kind)) !== null && _b !== void 0 ? _b : 0) + 1,
    );
  }
  var seen = new Map();
  for (var _e = 0, outputs_2 = outputs; _e < outputs_2.length; _e++) {
    var output = outputs_2[_e];
    var count = (_c = counts.get(output.kind)) !== null && _c !== void 0 ? _c : 1;
    var next = ((_d = seen.get(output.kind)) !== null && _d !== void 0 ? _d : 0) + 1;
    seen.set(output.kind, next);
    var suffix = count > 1 ? " ".concat(next, "/").concat(count) : "";
    if (output.kind === "audio.transcription") {
      sections.push(
        formatSection(
          "Audio".concat(suffix),
          "Transcript",
          output.text,
          outputs.length === 1 ? userText : undefined,
        ),
      );
      continue;
    }
    if (output.kind === "image.description") {
      sections.push(
        formatSection(
          "Image".concat(suffix),
          "Description",
          output.text,
          outputs.length === 1 ? userText : undefined,
        ),
      );
      continue;
    }
    sections.push(
      formatSection(
        "Video".concat(suffix),
        "Description",
        output.text,
        outputs.length === 1 ? userText : undefined,
      ),
    );
  }
  return sections.join("\n\n").trim();
}
function formatAudioTranscripts(outputs) {
  if (outputs.length === 1) {
    return outputs[0].text;
  }
  return outputs
    .map(function (output, index) {
      return "Audio ".concat(index + 1, ":\n").concat(output.text);
    })
    .join("\n\n");
}
