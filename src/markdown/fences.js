"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFenceSpans = parseFenceSpans;
exports.findFenceSpanAt = findFenceSpanAt;
exports.isSafeFenceBreak = isSafeFenceBreak;
function parseFenceSpans(buffer) {
  var spans = [];
  var open;
  var offset = 0;
  while (offset <= buffer.length) {
    var nextNewline = buffer.indexOf("\n", offset);
    var lineEnd = nextNewline === -1 ? buffer.length : nextNewline;
    var line = buffer.slice(offset, lineEnd);
    var match = line.match(/^( {0,3})(`{3,}|~{3,})(.*)$/);
    if (match) {
      var indent = match[1];
      var marker = match[2];
      var markerChar = marker[0];
      var markerLen = marker.length;
      if (!open) {
        open = {
          start: offset,
          markerChar: markerChar,
          markerLen: markerLen,
          openLine: line,
          marker: marker,
          indent: indent,
        };
      } else if (open.markerChar === markerChar && markerLen >= open.markerLen) {
        var end = lineEnd;
        spans.push({
          start: open.start,
          end: end,
          openLine: open.openLine,
          marker: open.marker,
          indent: open.indent,
        });
        open = undefined;
      }
    }
    if (nextNewline === -1) {
      break;
    }
    offset = nextNewline + 1;
  }
  if (open) {
    spans.push({
      start: open.start,
      end: buffer.length,
      openLine: open.openLine,
      marker: open.marker,
      indent: open.indent,
    });
  }
  return spans;
}
function findFenceSpanAt(spans, index) {
  return spans.find(function (span) {
    return index > span.start && index < span.end;
  });
}
function isSafeFenceBreak(spans, index) {
  return !findFenceSpanAt(spans, index);
}
