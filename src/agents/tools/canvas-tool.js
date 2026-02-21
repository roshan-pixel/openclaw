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
exports.createCanvasTool = createCanvasTool;
var node_crypto_1 = require("node:crypto");
var promises_1 = require("node:fs/promises");
var typebox_1 = require("@sinclair/typebox");
var nodes_camera_js_1 = require("../../cli/nodes-camera.js");
var nodes_canvas_js_1 = require("../../cli/nodes-canvas.js");
var mime_js_1 = require("../../media/mime.js");
var typebox_js_1 = require("../schema/typebox.js");
var common_js_1 = require("./common.js");
var gateway_js_1 = require("./gateway.js");
var nodes_utils_js_1 = require("./nodes-utils.js");
var CANVAS_ACTIONS = ["present", "hide", "navigate", "eval", "snapshot", "a2ui_push", "a2ui_reset"];
var CANVAS_SNAPSHOT_FORMATS = ["png", "jpg", "jpeg"];
// Flattened schema: runtime validates per-action requirements.
var CanvasToolSchema = typebox_1.Type.Object({
  action: (0, typebox_js_1.stringEnum)(CANVAS_ACTIONS),
  gatewayUrl: typebox_1.Type.Optional(typebox_1.Type.String()),
  gatewayToken: typebox_1.Type.Optional(typebox_1.Type.String()),
  timeoutMs: typebox_1.Type.Optional(typebox_1.Type.Number()),
  node: typebox_1.Type.Optional(typebox_1.Type.String()),
  // present
  target: typebox_1.Type.Optional(typebox_1.Type.String()),
  x: typebox_1.Type.Optional(typebox_1.Type.Number()),
  y: typebox_1.Type.Optional(typebox_1.Type.Number()),
  width: typebox_1.Type.Optional(typebox_1.Type.Number()),
  height: typebox_1.Type.Optional(typebox_1.Type.Number()),
  // navigate
  url: typebox_1.Type.Optional(typebox_1.Type.String()),
  // eval
  javaScript: typebox_1.Type.Optional(typebox_1.Type.String()),
  // snapshot
  outputFormat: (0, typebox_js_1.optionalStringEnum)(CANVAS_SNAPSHOT_FORMATS),
  maxWidth: typebox_1.Type.Optional(typebox_1.Type.Number()),
  quality: typebox_1.Type.Optional(typebox_1.Type.Number()),
  delayMs: typebox_1.Type.Optional(typebox_1.Type.Number()),
  // a2ui_push
  jsonl: typebox_1.Type.Optional(typebox_1.Type.String()),
  jsonlPath: typebox_1.Type.Optional(typebox_1.Type.String()),
});
function createCanvasTool() {
  var _this = this;
  return {
    label: "Canvas",
    name: "canvas",
    description:
      "Control node canvases (present/hide/navigate/eval/snapshot/A2UI). Use snapshot to capture the rendered UI.",
    parameters: CanvasToolSchema,
    execute: function (_toolCallId, args) {
      return __awaiter(_this, void 0, void 0, function () {
        var params,
          action,
          gatewayOpts,
          nodeId,
          invoke,
          _a,
          placement,
          invokeParams,
          url,
          javaScript,
          raw,
          result,
          formatRaw,
          format,
          maxWidth,
          quality,
          raw,
          payload,
          filePath,
          mimeType,
          jsonl,
          _b,
          _c;
        var _this = this;
        var _d, _e;
        return __generator(this, function (_f) {
          switch (_f.label) {
            case 0:
              params = args;
              action = (0, common_js_1.readStringParam)(params, "action", { required: true });
              gatewayOpts = {
                gatewayUrl: (0, common_js_1.readStringParam)(params, "gatewayUrl", { trim: false }),
                gatewayToken: (0, common_js_1.readStringParam)(params, "gatewayToken", {
                  trim: false,
                }),
                timeoutMs: typeof params.timeoutMs === "number" ? params.timeoutMs : undefined,
              };
              return [
                4 /*yield*/,
                (0, nodes_utils_js_1.resolveNodeId)(
                  gatewayOpts,
                  (0, common_js_1.readStringParam)(params, "node", { trim: true }),
                  true,
                ),
              ];
            case 1:
              nodeId = _f.sent();
              invoke = function (command, invokeParams) {
                return __awaiter(_this, void 0, void 0, function () {
                  return __generator(this, function (_a) {
                    switch (_a.label) {
                      case 0:
                        return [
                          4 /*yield*/,
                          (0, gateway_js_1.callGatewayTool)("node.invoke", gatewayOpts, {
                            nodeId: nodeId,
                            command: command,
                            params: invokeParams,
                            idempotencyKey: node_crypto_1.default.randomUUID(),
                          }),
                        ];
                      case 1:
                        return [2 /*return*/, _a.sent()];
                    }
                  });
                });
              };
              _a = action;
              switch (_a) {
                case "present":
                  return [3 /*break*/, 2];
                case "hide":
                  return [3 /*break*/, 4];
                case "navigate":
                  return [3 /*break*/, 6];
                case "eval":
                  return [3 /*break*/, 8];
                case "snapshot":
                  return [3 /*break*/, 10];
                case "a2ui_push":
                  return [3 /*break*/, 14];
                case "a2ui_reset":
                  return [3 /*break*/, 21];
              }
              return [3 /*break*/, 23];
            case 2:
              placement = {
                x: typeof params.x === "number" ? params.x : undefined,
                y: typeof params.y === "number" ? params.y : undefined,
                width: typeof params.width === "number" ? params.width : undefined,
                height: typeof params.height === "number" ? params.height : undefined,
              };
              invokeParams = {};
              if (typeof params.target === "string" && params.target.trim()) {
                invokeParams.url = params.target.trim();
              }
              if (
                Number.isFinite(placement.x) ||
                Number.isFinite(placement.y) ||
                Number.isFinite(placement.width) ||
                Number.isFinite(placement.height)
              ) {
                invokeParams.placement = placement;
              }
              return [4 /*yield*/, invoke("canvas.present", invokeParams)];
            case 3:
              _f.sent();
              return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true })];
            case 4:
              return [4 /*yield*/, invoke("canvas.hide", undefined)];
            case 5:
              _f.sent();
              return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true })];
            case 6:
              url = (0, common_js_1.readStringParam)(params, "url", { required: true });
              return [4 /*yield*/, invoke("canvas.navigate", { url: url })];
            case 7:
              _f.sent();
              return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true })];
            case 8:
              javaScript = (0, common_js_1.readStringParam)(params, "javaScript", {
                required: true,
              });
              return [4 /*yield*/, invoke("canvas.eval", { javaScript: javaScript })];
            case 9:
              raw = _f.sent();
              result =
                (_d = raw === null || raw === void 0 ? void 0 : raw.payload) === null ||
                _d === void 0
                  ? void 0
                  : _d.result;
              if (result) {
                return [
                  2 /*return*/,
                  {
                    content: [{ type: "text", text: result }],
                    details: { result: result },
                  },
                ];
              }
              return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true })];
            case 10:
              formatRaw =
                typeof params.outputFormat === "string" ? params.outputFormat.toLowerCase() : "png";
              format = formatRaw === "jpg" || formatRaw === "jpeg" ? "jpeg" : "png";
              maxWidth =
                typeof params.maxWidth === "number" && Number.isFinite(params.maxWidth)
                  ? params.maxWidth
                  : undefined;
              quality =
                typeof params.quality === "number" && Number.isFinite(params.quality)
                  ? params.quality
                  : undefined;
              return [
                4 /*yield*/,
                invoke("canvas.snapshot", {
                  format: format,
                  maxWidth: maxWidth,
                  quality: quality,
                }),
              ];
            case 11:
              raw = _f.sent();
              payload = (0, nodes_canvas_js_1.parseCanvasSnapshotPayload)(
                raw === null || raw === void 0 ? void 0 : raw.payload,
              );
              filePath = (0, nodes_canvas_js_1.canvasSnapshotTempPath)({
                ext: payload.format === "jpeg" ? "jpg" : payload.format,
              });
              return [
                4 /*yield*/,
                (0, nodes_camera_js_1.writeBase64ToFile)(filePath, payload.base64),
              ];
            case 12:
              _f.sent();
              mimeType =
                (_e = (0, mime_js_1.imageMimeFromFormat)(payload.format)) !== null && _e !== void 0
                  ? _e
                  : "image/png";
              return [
                4 /*yield*/,
                (0, common_js_1.imageResult)({
                  label: "canvas:snapshot",
                  path: filePath,
                  base64: payload.base64,
                  mimeType: mimeType,
                  details: { format: payload.format },
                }),
              ];
            case 13:
              return [2 /*return*/, _f.sent()];
            case 14:
              if (!(typeof params.jsonl === "string" && params.jsonl.trim())) {
                return [3 /*break*/, 15];
              }
              _b = params.jsonl;
              return [3 /*break*/, 19];
            case 15:
              if (!(typeof params.jsonlPath === "string" && params.jsonlPath.trim())) {
                return [3 /*break*/, 17];
              }
              return [4 /*yield*/, promises_1.default.readFile(params.jsonlPath.trim(), "utf8")];
            case 16:
              _c = _f.sent();
              return [3 /*break*/, 18];
            case 17:
              _c = "";
              _f.label = 18;
            case 18:
              _b = _c;
              _f.label = 19;
            case 19:
              jsonl = _b;
              if (!jsonl.trim()) {
                throw new Error("jsonl or jsonlPath required");
              }
              return [4 /*yield*/, invoke("canvas.a2ui.pushJSONL", { jsonl: jsonl })];
            case 20:
              _f.sent();
              return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true })];
            case 21:
              return [4 /*yield*/, invoke("canvas.a2ui.reset", undefined)];
            case 22:
              _f.sent();
              return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true })];
            case 23:
              throw new Error("Unknown action: ".concat(action));
          }
        });
      });
    },
  };
}
