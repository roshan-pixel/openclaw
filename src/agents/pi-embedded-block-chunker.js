"use strict";
var __classPrivateFieldSet =
  (this && this.__classPrivateFieldSet) ||
  function (receiver, state, value, kind, f) {
    if (kind === "m") {
      throw new TypeError("Private method is not writable");
    }
    if (kind === "a" && !f) {
      throw new TypeError("Private accessor was defined without a setter");
    }
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) {
      throw new TypeError(
        "Cannot write private member to an object whose class did not declare it",
      );
    }
    return (
      kind === "a" ? f.call(receiver, value) : f ? (f.value = value) : state.set(receiver, value),
      value
    );
  };
var __classPrivateFieldGet =
  (this && this.__classPrivateFieldGet) ||
  function (receiver, state, kind, f) {
    if (kind === "a" && !f) {
      throw new TypeError("Private accessor was defined without a getter");
    }
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) {
      throw new TypeError(
        "Cannot read private member from an object whose class did not declare it",
      );
    }
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
  };
var _EmbeddedBlockChunker_instances,
  _EmbeddedBlockChunker_buffer,
  _EmbeddedBlockChunker_chunking,
  _EmbeddedBlockChunker_pickSoftBreakIndex,
  _EmbeddedBlockChunker_pickBreakIndex;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmbeddedBlockChunker = void 0;
var fences_js_1 = require("../markdown/fences.js");
var EmbeddedBlockChunker = /** @class */ (function () {
  function EmbeddedBlockChunker(chunking) {
    _EmbeddedBlockChunker_instances.add(this);
    _EmbeddedBlockChunker_buffer.set(this, "");
    _EmbeddedBlockChunker_chunking.set(this, void 0);
    __classPrivateFieldSet(this, _EmbeddedBlockChunker_chunking, chunking, "f");
  }
  EmbeddedBlockChunker.prototype.append = function (text) {
    if (!text) {
      return;
    }
    __classPrivateFieldSet(
      this,
      _EmbeddedBlockChunker_buffer,
      __classPrivateFieldGet(this, _EmbeddedBlockChunker_buffer, "f") + text,
      "f",
    );
  };
  EmbeddedBlockChunker.prototype.reset = function () {
    __classPrivateFieldSet(this, _EmbeddedBlockChunker_buffer, "", "f");
  };
  Object.defineProperty(EmbeddedBlockChunker.prototype, "bufferedText", {
    get: function () {
      return __classPrivateFieldGet(this, _EmbeddedBlockChunker_buffer, "f");
    },
    enumerable: false,
    configurable: true,
  });
  EmbeddedBlockChunker.prototype.hasBuffered = function () {
    return __classPrivateFieldGet(this, _EmbeddedBlockChunker_buffer, "f").length > 0;
  };
  EmbeddedBlockChunker.prototype.drain = function (params) {
    // KNOWN: We cannot split inside fenced code blocks (Markdown breaks + UI glitches).
    // When forced (maxChars), we close + reopen the fence to keep Markdown valid.
    var force = params.force,
      emit = params.emit;
    var minChars = Math.max(
      1,
      Math.floor(__classPrivateFieldGet(this, _EmbeddedBlockChunker_chunking, "f").minChars),
    );
    var maxChars = Math.max(
      minChars,
      Math.floor(__classPrivateFieldGet(this, _EmbeddedBlockChunker_chunking, "f").maxChars),
    );
    if (
      __classPrivateFieldGet(this, _EmbeddedBlockChunker_buffer, "f").length < minChars &&
      !force
    ) {
      return;
    }
    if (
      force &&
      __classPrivateFieldGet(this, _EmbeddedBlockChunker_buffer, "f").length <= maxChars
    ) {
      if (__classPrivateFieldGet(this, _EmbeddedBlockChunker_buffer, "f").trim().length > 0) {
        emit(__classPrivateFieldGet(this, _EmbeddedBlockChunker_buffer, "f"));
      }
      __classPrivateFieldSet(this, _EmbeddedBlockChunker_buffer, "", "f");
      return;
    }
    while (
      __classPrivateFieldGet(this, _EmbeddedBlockChunker_buffer, "f").length >= minChars ||
      (force && __classPrivateFieldGet(this, _EmbeddedBlockChunker_buffer, "f").length > 0)
    ) {
      var breakResult =
        force && __classPrivateFieldGet(this, _EmbeddedBlockChunker_buffer, "f").length <= maxChars
          ? __classPrivateFieldGet(
              this,
              _EmbeddedBlockChunker_instances,
              "m",
              _EmbeddedBlockChunker_pickSoftBreakIndex,
            ).call(this, __classPrivateFieldGet(this, _EmbeddedBlockChunker_buffer, "f"), 1)
          : __classPrivateFieldGet(
              this,
              _EmbeddedBlockChunker_instances,
              "m",
              _EmbeddedBlockChunker_pickBreakIndex,
            ).call(
              this,
              __classPrivateFieldGet(this, _EmbeddedBlockChunker_buffer, "f"),
              force ? 1 : undefined,
            );
      if (breakResult.index <= 0) {
        if (force) {
          emit(__classPrivateFieldGet(this, _EmbeddedBlockChunker_buffer, "f"));
          __classPrivateFieldSet(this, _EmbeddedBlockChunker_buffer, "", "f");
        }
        return;
      }
      var breakIdx = breakResult.index;
      var rawChunk = __classPrivateFieldGet(this, _EmbeddedBlockChunker_buffer, "f").slice(
        0,
        breakIdx,
      );
      if (rawChunk.trim().length === 0) {
        __classPrivateFieldSet(
          this,
          _EmbeddedBlockChunker_buffer,
          stripLeadingNewlines(
            __classPrivateFieldGet(this, _EmbeddedBlockChunker_buffer, "f").slice(breakIdx),
          ).trimStart(),
          "f",
        );
        continue;
      }
      var nextBuffer = __classPrivateFieldGet(this, _EmbeddedBlockChunker_buffer, "f").slice(
        breakIdx,
      );
      var fenceSplit = breakResult.fenceSplit;
      if (fenceSplit) {
        var closeFence = rawChunk.endsWith("\n")
          ? "".concat(fenceSplit.closeFenceLine, "\n")
          : "\n".concat(fenceSplit.closeFenceLine, "\n");
        rawChunk = "".concat(rawChunk).concat(closeFence);
        var reopenFence = fenceSplit.reopenFenceLine.endsWith("\n")
          ? fenceSplit.reopenFenceLine
          : "".concat(fenceSplit.reopenFenceLine, "\n");
        nextBuffer = "".concat(reopenFence).concat(nextBuffer);
      }
      emit(rawChunk);
      if (fenceSplit) {
        __classPrivateFieldSet(this, _EmbeddedBlockChunker_buffer, nextBuffer, "f");
      } else {
        var nextStart =
          breakIdx < __classPrivateFieldGet(this, _EmbeddedBlockChunker_buffer, "f").length &&
          /\s/.test(__classPrivateFieldGet(this, _EmbeddedBlockChunker_buffer, "f")[breakIdx])
            ? breakIdx + 1
            : breakIdx;
        __classPrivateFieldSet(
          this,
          _EmbeddedBlockChunker_buffer,
          stripLeadingNewlines(
            __classPrivateFieldGet(this, _EmbeddedBlockChunker_buffer, "f").slice(nextStart),
          ),
          "f",
        );
      }
      if (
        __classPrivateFieldGet(this, _EmbeddedBlockChunker_buffer, "f").length < minChars &&
        !force
      ) {
        return;
      }
      if (
        __classPrivateFieldGet(this, _EmbeddedBlockChunker_buffer, "f").length < maxChars &&
        !force
      ) {
        return;
      }
    }
  };
  return EmbeddedBlockChunker;
})();
exports.EmbeddedBlockChunker = EmbeddedBlockChunker;
((_EmbeddedBlockChunker_buffer = new WeakMap()),
  (_EmbeddedBlockChunker_chunking = new WeakMap()),
  (_EmbeddedBlockChunker_instances = new WeakSet()),
  (_EmbeddedBlockChunker_pickSoftBreakIndex = function _EmbeddedBlockChunker_pickSoftBreakIndex(
    buffer,
    minCharsOverride,
  ) {
    var _a, _b;
    var minChars = Math.max(
      1,
      Math.floor(
        minCharsOverride !== null && minCharsOverride !== void 0
          ? minCharsOverride
          : __classPrivateFieldGet(this, _EmbeddedBlockChunker_chunking, "f").minChars,
      ),
    );
    if (buffer.length < minChars) {
      return { index: -1 };
    }
    var fenceSpans = (0, fences_js_1.parseFenceSpans)(buffer);
    var preference =
      (_a = __classPrivateFieldGet(this, _EmbeddedBlockChunker_chunking, "f").breakPreference) !==
        null && _a !== void 0
        ? _a
        : "paragraph";
    if (preference === "paragraph") {
      var paragraphIdx = buffer.indexOf("\n\n");
      while (paragraphIdx !== -1) {
        var candidates = [paragraphIdx, paragraphIdx + 1];
        for (var _i = 0, candidates_1 = candidates; _i < candidates_1.length; _i++) {
          var candidate = candidates_1[_i];
          if (candidate < minChars) {
            continue;
          }
          if (candidate < 0 || candidate >= buffer.length) {
            continue;
          }
          if ((0, fences_js_1.isSafeFenceBreak)(fenceSpans, candidate)) {
            return { index: candidate };
          }
        }
        paragraphIdx = buffer.indexOf("\n\n", paragraphIdx + 2);
      }
    }
    if (preference === "paragraph" || preference === "newline") {
      var newlineIdx = buffer.indexOf("\n");
      while (newlineIdx !== -1) {
        if (newlineIdx >= minChars && (0, fences_js_1.isSafeFenceBreak)(fenceSpans, newlineIdx)) {
          return { index: newlineIdx };
        }
        newlineIdx = buffer.indexOf("\n", newlineIdx + 1);
      }
    }
    if (preference !== "newline") {
      var matches = buffer.matchAll(/[.!?](?=\s|$)/g);
      var sentenceIdx = -1;
      for (var _c = 0, matches_1 = matches; _c < matches_1.length; _c++) {
        var match = matches_1[_c];
        var at = (_b = match.index) !== null && _b !== void 0 ? _b : -1;
        if (at < minChars) {
          continue;
        }
        var candidate = at + 1;
        if ((0, fences_js_1.isSafeFenceBreak)(fenceSpans, candidate)) {
          sentenceIdx = candidate;
        }
      }
      if (sentenceIdx >= minChars) {
        return { index: sentenceIdx };
      }
    }
    return { index: -1 };
  }),
  (_EmbeddedBlockChunker_pickBreakIndex = function _EmbeddedBlockChunker_pickBreakIndex(
    buffer,
    minCharsOverride,
  ) {
    var _a, _b;
    var minChars = Math.max(
      1,
      Math.floor(
        minCharsOverride !== null && minCharsOverride !== void 0
          ? minCharsOverride
          : __classPrivateFieldGet(this, _EmbeddedBlockChunker_chunking, "f").minChars,
      ),
    );
    var maxChars = Math.max(
      minChars,
      Math.floor(__classPrivateFieldGet(this, _EmbeddedBlockChunker_chunking, "f").maxChars),
    );
    if (buffer.length < minChars) {
      return { index: -1 };
    }
    var window = buffer.slice(0, Math.min(maxChars, buffer.length));
    var fenceSpans = (0, fences_js_1.parseFenceSpans)(buffer);
    var preference =
      (_a = __classPrivateFieldGet(this, _EmbeddedBlockChunker_chunking, "f").breakPreference) !==
        null && _a !== void 0
        ? _a
        : "paragraph";
    if (preference === "paragraph") {
      var paragraphIdx = window.lastIndexOf("\n\n");
      while (paragraphIdx >= minChars) {
        var candidates = [paragraphIdx, paragraphIdx + 1];
        for (var _i = 0, candidates_2 = candidates; _i < candidates_2.length; _i++) {
          var candidate = candidates_2[_i];
          if (candidate < minChars) {
            continue;
          }
          if (candidate < 0 || candidate >= buffer.length) {
            continue;
          }
          if ((0, fences_js_1.isSafeFenceBreak)(fenceSpans, candidate)) {
            return { index: candidate };
          }
        }
        paragraphIdx = window.lastIndexOf("\n\n", paragraphIdx - 1);
      }
    }
    if (preference === "paragraph" || preference === "newline") {
      var newlineIdx = window.lastIndexOf("\n");
      while (newlineIdx >= minChars) {
        if ((0, fences_js_1.isSafeFenceBreak)(fenceSpans, newlineIdx)) {
          return { index: newlineIdx };
        }
        newlineIdx = window.lastIndexOf("\n", newlineIdx - 1);
      }
    }
    if (preference !== "newline") {
      var matches = window.matchAll(/[.!?](?=\s|$)/g);
      var sentenceIdx = -1;
      for (var _c = 0, matches_2 = matches; _c < matches_2.length; _c++) {
        var match = matches_2[_c];
        var at = (_b = match.index) !== null && _b !== void 0 ? _b : -1;
        if (at < minChars) {
          continue;
        }
        var candidate = at + 1;
        if ((0, fences_js_1.isSafeFenceBreak)(fenceSpans, candidate)) {
          sentenceIdx = candidate;
        }
      }
      if (sentenceIdx >= minChars) {
        return { index: sentenceIdx };
      }
    }
    if (preference === "newline" && buffer.length < maxChars) {
      return { index: -1 };
    }
    for (var i = window.length - 1; i >= minChars; i--) {
      if (/\s/.test(window[i]) && (0, fences_js_1.isSafeFenceBreak)(fenceSpans, i)) {
        return { index: i };
      }
    }
    if (buffer.length >= maxChars) {
      if ((0, fences_js_1.isSafeFenceBreak)(fenceSpans, maxChars)) {
        return { index: maxChars };
      }
      var fence = (0, fences_js_1.findFenceSpanAt)(fenceSpans, maxChars);
      if (fence) {
        return {
          index: maxChars,
          fenceSplit: {
            closeFenceLine: "".concat(fence.indent).concat(fence.marker),
            reopenFenceLine: fence.openLine,
          },
        };
      }
      return { index: maxChars };
    }
    return { index: -1 };
  }));
function stripLeadingNewlines(value) {
  var i = 0;
  while (i < value.length && value[i] === "\n") {
    i++;
  }
  return i > 0 ? value.slice(i) : value;
}
