"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInlineCodeState = createInlineCodeState;
exports.buildCodeSpanIndex = buildCodeSpanIndex;
var fences_js_1 = require("./fences.js");
function createInlineCodeState() {
    return { open: false, ticks: 0 };
}
function buildCodeSpanIndex(text, inlineState) {
    var fenceSpans = (0, fences_js_1.parseFenceSpans)(text);
    var startState = inlineState
        ? { open: inlineState.open, ticks: inlineState.ticks }
        : createInlineCodeState();
    var _a = parseInlineCodeSpans(text, fenceSpans, startState), inlineSpans = _a.spans, nextInlineState = _a.state;
    return {
        inlineState: nextInlineState,
        isInside: function (index) {
            return isInsideFenceSpan(index, fenceSpans) || isInsideInlineSpan(index, inlineSpans);
        },
    };
}
function parseInlineCodeSpans(text, fenceSpans, initialState) {
    var spans = [];
    var open = initialState.open;
    var ticks = initialState.ticks;
    var openStart = open ? 0 : -1;
    var i = 0;
    while (i < text.length) {
        var fence = findFenceSpanAtInclusive(fenceSpans, i);
        if (fence) {
            i = fence.end;
            continue;
        }
        if (text[i] !== "`") {
            i += 1;
            continue;
        }
        var runStart = i;
        var runLength = 0;
        while (i < text.length && text[i] === "`") {
            runLength += 1;
            i += 1;
        }
        if (!open) {
            open = true;
            ticks = runLength;
            openStart = runStart;
            continue;
        }
        if (runLength === ticks) {
            spans.push([openStart, i]);
            open = false;
            ticks = 0;
            openStart = -1;
        }
    }
    if (open) {
        spans.push([openStart, text.length]);
    }
    return {
        spans: spans,
        state: { open: open, ticks: ticks },
    };
}
function findFenceSpanAtInclusive(spans, index) {
    return spans.find(function (span) { return index >= span.start && index < span.end; });
}
function isInsideFenceSpan(index, spans) {
    return spans.some(function (span) { return index >= span.start && index < span.end; });
}
function isInsideInlineSpan(index, spans) {
    return spans.some(function (_a) {
        var start = _a[0], end = _a[1];
        return index >= start && index < end;
    });
}
