"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserToolSchema = void 0;
var typebox_1 = require("@sinclair/typebox");
var typebox_js_1 = require("../schema/typebox.js");
var BROWSER_ACT_KINDS = [
    "click",
    "type",
    "press",
    "hover",
    "drag",
    "select",
    "fill",
    "resize",
    "wait",
    "evaluate",
    "close",
];
var BROWSER_TOOL_ACTIONS = [
    "status",
    "start",
    "stop",
    "profiles",
    "tabs",
    "open",
    "focus",
    "close",
    "snapshot",
    "screenshot",
    "navigate",
    "console",
    "pdf",
    "upload",
    "dialog",
    "act",
];
var BROWSER_TARGETS = ["sandbox", "host", "node"];
var BROWSER_SNAPSHOT_FORMATS = ["aria", "ai"];
var BROWSER_SNAPSHOT_MODES = ["efficient"];
var BROWSER_SNAPSHOT_REFS = ["role", "aria"];
var BROWSER_IMAGE_TYPES = ["png", "jpeg"];
// NOTE: Using a flattened object schema instead of Type.Union([Type.Object(...), ...])
// because Claude API on Vertex AI rejects nested anyOf schemas as invalid JSON Schema.
// The discriminator (kind) determines which properties are relevant; runtime validates.
var BrowserActSchema = typebox_1.Type.Object({
    kind: (0, typebox_js_1.stringEnum)(BROWSER_ACT_KINDS),
    // Common fields
    targetId: typebox_1.Type.Optional(typebox_1.Type.String()),
    ref: typebox_1.Type.Optional(typebox_1.Type.String()),
    // click
    doubleClick: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    button: typebox_1.Type.Optional(typebox_1.Type.String()),
    modifiers: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.String())),
    // type
    text: typebox_1.Type.Optional(typebox_1.Type.String()),
    submit: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    slowly: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    // press
    key: typebox_1.Type.Optional(typebox_1.Type.String()),
    // drag
    startRef: typebox_1.Type.Optional(typebox_1.Type.String()),
    endRef: typebox_1.Type.Optional(typebox_1.Type.String()),
    // select
    values: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.String())),
    // fill - use permissive array of objects
    fields: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.Object({}, { additionalProperties: true }))),
    // resize
    width: typebox_1.Type.Optional(typebox_1.Type.Number()),
    height: typebox_1.Type.Optional(typebox_1.Type.Number()),
    // wait
    timeMs: typebox_1.Type.Optional(typebox_1.Type.Number()),
    textGone: typebox_1.Type.Optional(typebox_1.Type.String()),
    // evaluate
    fn: typebox_1.Type.Optional(typebox_1.Type.String()),
});
// IMPORTANT: OpenAI function tool schemas must have a top-level `type: "object"`.
// A root-level `Type.Union([...])` compiles to `{ anyOf: [...] }` (no `type`),
// which OpenAI rejects ("Invalid schema ... type: None"). Keep this schema an object.
exports.BrowserToolSchema = typebox_1.Type.Object({
    action: (0, typebox_js_1.stringEnum)(BROWSER_TOOL_ACTIONS),
    target: (0, typebox_js_1.optionalStringEnum)(BROWSER_TARGETS),
    node: typebox_1.Type.Optional(typebox_1.Type.String()),
    profile: typebox_1.Type.Optional(typebox_1.Type.String()),
    targetUrl: typebox_1.Type.Optional(typebox_1.Type.String()),
    targetId: typebox_1.Type.Optional(typebox_1.Type.String()),
    limit: typebox_1.Type.Optional(typebox_1.Type.Number()),
    maxChars: typebox_1.Type.Optional(typebox_1.Type.Number()),
    mode: (0, typebox_js_1.optionalStringEnum)(BROWSER_SNAPSHOT_MODES),
    snapshotFormat: (0, typebox_js_1.optionalStringEnum)(BROWSER_SNAPSHOT_FORMATS),
    refs: (0, typebox_js_1.optionalStringEnum)(BROWSER_SNAPSHOT_REFS),
    interactive: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    compact: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    depth: typebox_1.Type.Optional(typebox_1.Type.Number()),
    selector: typebox_1.Type.Optional(typebox_1.Type.String()),
    frame: typebox_1.Type.Optional(typebox_1.Type.String()),
    labels: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    fullPage: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    ref: typebox_1.Type.Optional(typebox_1.Type.String()),
    element: typebox_1.Type.Optional(typebox_1.Type.String()),
    type: (0, typebox_js_1.optionalStringEnum)(BROWSER_IMAGE_TYPES),
    level: typebox_1.Type.Optional(typebox_1.Type.String()),
    paths: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.String())),
    inputRef: typebox_1.Type.Optional(typebox_1.Type.String()),
    timeoutMs: typebox_1.Type.Optional(typebox_1.Type.Number()),
    accept: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    promptText: typebox_1.Type.Optional(typebox_1.Type.String()),
    request: typebox_1.Type.Optional(BrowserActSchema),
});
