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
exports.createNodesTool = createNodesTool;
var node_crypto_1 = require("node:crypto");
var typebox_1 = require("@sinclair/typebox");
var nodes_camera_js_1 = require("../../cli/nodes-camera.js");
var nodes_run_js_1 = require("../../cli/nodes-run.js");
var nodes_screen_js_1 = require("../../cli/nodes-screen.js");
var parse_duration_js_1 = require("../../cli/parse-duration.js");
var mime_js_1 = require("../../media/mime.js");
var agent_scope_js_1 = require("../agent-scope.js");
var typebox_js_1 = require("../schema/typebox.js");
var tool_images_js_1 = require("../tool-images.js");
var common_js_1 = require("./common.js");
var gateway_js_1 = require("./gateway.js");
var nodes_utils_js_1 = require("./nodes-utils.js");
var NODES_TOOL_ACTIONS = [
  "status",
  "describe",
  "pending",
  "approve",
  "reject",
  "notify",
  "camera_snap",
  "camera_list",
  "camera_clip",
  "screen_record",
  "location_get",
  "run",
];
var NOTIFY_PRIORITIES = ["passive", "active", "timeSensitive"];
var NOTIFY_DELIVERIES = ["system", "overlay", "auto"];
var CAMERA_FACING = ["front", "back", "both"];
var LOCATION_ACCURACY = ["coarse", "balanced", "precise"];
// Flattened schema: runtime validates per-action requirements.
var NodesToolSchema = typebox_1.Type.Object({
  action: (0, typebox_js_1.stringEnum)(NODES_TOOL_ACTIONS),
  gatewayUrl: typebox_1.Type.Optional(typebox_1.Type.String()),
  gatewayToken: typebox_1.Type.Optional(typebox_1.Type.String()),
  timeoutMs: typebox_1.Type.Optional(typebox_1.Type.Number()),
  node: typebox_1.Type.Optional(typebox_1.Type.String()),
  requestId: typebox_1.Type.Optional(typebox_1.Type.String()),
  // notify
  title: typebox_1.Type.Optional(typebox_1.Type.String()),
  body: typebox_1.Type.Optional(typebox_1.Type.String()),
  sound: typebox_1.Type.Optional(typebox_1.Type.String()),
  priority: (0, typebox_js_1.optionalStringEnum)(NOTIFY_PRIORITIES),
  delivery: (0, typebox_js_1.optionalStringEnum)(NOTIFY_DELIVERIES),
  // camera_snap / camera_clip
  facing: (0, typebox_js_1.optionalStringEnum)(CAMERA_FACING, {
    description: "camera_snap: front/back/both; camera_clip: front/back only.",
  }),
  maxWidth: typebox_1.Type.Optional(typebox_1.Type.Number()),
  quality: typebox_1.Type.Optional(typebox_1.Type.Number()),
  delayMs: typebox_1.Type.Optional(typebox_1.Type.Number()),
  deviceId: typebox_1.Type.Optional(typebox_1.Type.String()),
  duration: typebox_1.Type.Optional(typebox_1.Type.String()),
  durationMs: typebox_1.Type.Optional(typebox_1.Type.Number()),
  includeAudio: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
  // screen_record
  fps: typebox_1.Type.Optional(typebox_1.Type.Number()),
  screenIndex: typebox_1.Type.Optional(typebox_1.Type.Number()),
  outPath: typebox_1.Type.Optional(typebox_1.Type.String()),
  // location_get
  maxAgeMs: typebox_1.Type.Optional(typebox_1.Type.Number()),
  locationTimeoutMs: typebox_1.Type.Optional(typebox_1.Type.Number()),
  desiredAccuracy: (0, typebox_js_1.optionalStringEnum)(LOCATION_ACCURACY),
  // run
  command: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.String())),
  cwd: typebox_1.Type.Optional(typebox_1.Type.String()),
  env: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.String())),
  commandTimeoutMs: typebox_1.Type.Optional(typebox_1.Type.Number()),
  invokeTimeoutMs: typebox_1.Type.Optional(typebox_1.Type.Number()),
  needsScreenRecording: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
});
function createNodesTool(options) {
  var _this = this;
  var _a;
  var sessionKey =
    ((_a = options === null || options === void 0 ? void 0 : options.agentSessionKey) === null ||
    _a === void 0
      ? void 0
      : _a.trim()) || undefined;
  var agentId = (0, agent_scope_js_1.resolveSessionAgentId)({
    sessionKey: options === null || options === void 0 ? void 0 : options.agentSessionKey,
    config: options === null || options === void 0 ? void 0 : options.config,
  });
  return {
    label: "Nodes",
    name: "nodes",
    description:
      "Discover and control paired nodes (status/describe/pairing/notify/camera/screen/location/run).",
    parameters: NodesToolSchema,
    execute: function (_toolCallId, args) {
      return __awaiter(_this, void 0, void 0, function () {
        var params,
          action,
          gatewayOpts,
          _a,
          _b,
          node,
          nodeId,
          _c,
          _d,
          requestId,
          _e,
          requestId,
          _f,
          node,
          title,
          body,
          nodeId,
          node,
          nodeId,
          facingRaw,
          facings,
          maxWidth,
          quality,
          delayMs,
          deviceId,
          content,
          details,
          _i,
          facings_1,
          facing,
          raw,
          payload,
          normalizedFormat,
          isJpeg,
          filePath,
          result,
          node,
          nodeId,
          raw,
          payload,
          node,
          nodeId,
          facing,
          durationMs,
          includeAudio,
          deviceId,
          raw,
          payload,
          filePath,
          node,
          nodeId,
          durationMs,
          fps,
          screenIndex,
          includeAudio,
          raw,
          payload,
          filePath,
          written,
          node,
          nodeId,
          maxAgeMs,
          desiredAccuracy,
          locationTimeoutMs,
          raw,
          node,
          nodes,
          nodeId_1,
          nodeInfo,
          supportsSystemRun,
          commandRaw,
          command,
          cwd,
          env,
          commandTimeoutMs,
          invokeTimeoutMs,
          needsScreenRecording,
          raw,
          err_1,
          nodeLabel,
          gatewayLabel,
          agentLabel,
          message;
        var _g, _h, _j, _k;
        return __generator(this, function (_l) {
          switch (_l.label) {
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
              _l.label = 1;
            case 1:
              _l.trys.push([1, 43, , 44]);
              _a = action;
              switch (_a) {
                case "status":
                  return [3 /*break*/, 2];
                case "describe":
                  return [3 /*break*/, 4];
                case "pending":
                  return [3 /*break*/, 7];
                case "approve":
                  return [3 /*break*/, 9];
                case "reject":
                  return [3 /*break*/, 11];
                case "notify":
                  return [3 /*break*/, 13];
                case "camera_snap":
                  return [3 /*break*/, 16];
                case "camera_list":
                  return [3 /*break*/, 24];
                case "camera_clip":
                  return [3 /*break*/, 27];
                case "screen_record":
                  return [3 /*break*/, 31];
                case "location_get":
                  return [3 /*break*/, 35];
                case "run":
                  return [3 /*break*/, 38];
              }
              return [3 /*break*/, 41];
            case 2:
              _b = common_js_1.jsonResult;
              return [4 /*yield*/, (0, gateway_js_1.callGatewayTool)("node.list", gatewayOpts, {})];
            case 3:
              return [2 /*return*/, _b.apply(void 0, [_l.sent()])];
            case 4:
              node = (0, common_js_1.readStringParam)(params, "node", { required: true });
              return [4 /*yield*/, (0, nodes_utils_js_1.resolveNodeId)(gatewayOpts, node)];
            case 5:
              nodeId = _l.sent();
              _c = common_js_1.jsonResult;
              return [
                4 /*yield*/,
                (0, gateway_js_1.callGatewayTool)("node.describe", gatewayOpts, { nodeId: nodeId }),
              ];
            case 6:
              return [2 /*return*/, _c.apply(void 0, [_l.sent()])];
            case 7:
              _d = common_js_1.jsonResult;
              return [
                4 /*yield*/,
                (0, gateway_js_1.callGatewayTool)("node.pair.list", gatewayOpts, {}),
              ];
            case 8:
              return [2 /*return*/, _d.apply(void 0, [_l.sent()])];
            case 9:
              requestId = (0, common_js_1.readStringParam)(params, "requestId", {
                required: true,
              });
              _e = common_js_1.jsonResult;
              return [
                4 /*yield*/,
                (0, gateway_js_1.callGatewayTool)("node.pair.approve", gatewayOpts, {
                  requestId: requestId,
                }),
              ];
            case 10:
              return [2 /*return*/, _e.apply(void 0, [_l.sent()])];
            case 11:
              requestId = (0, common_js_1.readStringParam)(params, "requestId", {
                required: true,
              });
              _f = common_js_1.jsonResult;
              return [
                4 /*yield*/,
                (0, gateway_js_1.callGatewayTool)("node.pair.reject", gatewayOpts, {
                  requestId: requestId,
                }),
              ];
            case 12:
              return [2 /*return*/, _f.apply(void 0, [_l.sent()])];
            case 13:
              node = (0, common_js_1.readStringParam)(params, "node", { required: true });
              title = typeof params.title === "string" ? params.title : "";
              body = typeof params.body === "string" ? params.body : "";
              if (!title.trim() && !body.trim()) {
                throw new Error("title or body required");
              }
              return [4 /*yield*/, (0, nodes_utils_js_1.resolveNodeId)(gatewayOpts, node)];
            case 14:
              nodeId = _l.sent();
              return [
                4 /*yield*/,
                (0, gateway_js_1.callGatewayTool)("node.invoke", gatewayOpts, {
                  nodeId: nodeId,
                  command: "system.notify",
                  params: {
                    title: title.trim() || undefined,
                    body: body.trim() || undefined,
                    sound: typeof params.sound === "string" ? params.sound : undefined,
                    priority: typeof params.priority === "string" ? params.priority : undefined,
                    delivery: typeof params.delivery === "string" ? params.delivery : undefined,
                  },
                  idempotencyKey: node_crypto_1.default.randomUUID(),
                }),
              ];
            case 15:
              _l.sent();
              return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true })];
            case 16:
              node = (0, common_js_1.readStringParam)(params, "node", { required: true });
              return [4 /*yield*/, (0, nodes_utils_js_1.resolveNodeId)(gatewayOpts, node)];
            case 17:
              nodeId = _l.sent();
              facingRaw = typeof params.facing === "string" ? params.facing.toLowerCase() : "both";
              facings =
                facingRaw === "both"
                  ? ["front", "back"]
                  : facingRaw === "front" || facingRaw === "back"
                    ? [facingRaw]
                    : (function () {
                        throw new Error("invalid facing (front|back|both)");
                      })();
              maxWidth =
                typeof params.maxWidth === "number" && Number.isFinite(params.maxWidth)
                  ? params.maxWidth
                  : undefined;
              quality =
                typeof params.quality === "number" && Number.isFinite(params.quality)
                  ? params.quality
                  : undefined;
              delayMs =
                typeof params.delayMs === "number" && Number.isFinite(params.delayMs)
                  ? params.delayMs
                  : undefined;
              deviceId =
                typeof params.deviceId === "string" && params.deviceId.trim()
                  ? params.deviceId.trim()
                  : undefined;
              content = [];
              details = [];
              ((_i = 0), (facings_1 = facings));
              _l.label = 18;
            case 18:
              if (!(_i < facings_1.length)) {
                return [3 /*break*/, 22];
              }
              facing = facings_1[_i];
              return [
                4 /*yield*/,
                (0, gateway_js_1.callGatewayTool)("node.invoke", gatewayOpts, {
                  nodeId: nodeId,
                  command: "camera.snap",
                  params: {
                    facing: facing,
                    maxWidth: maxWidth,
                    quality: quality,
                    format: "jpg",
                    delayMs: delayMs,
                    deviceId: deviceId,
                  },
                  idempotencyKey: node_crypto_1.default.randomUUID(),
                }),
              ];
            case 19:
              raw = _l.sent();
              payload = (0, nodes_camera_js_1.parseCameraSnapPayload)(
                raw === null || raw === void 0 ? void 0 : raw.payload,
              );
              normalizedFormat = payload.format.toLowerCase();
              if (
                normalizedFormat !== "jpg" &&
                normalizedFormat !== "jpeg" &&
                normalizedFormat !== "png"
              ) {
                throw new Error("unsupported camera.snap format: ".concat(payload.format));
              }
              isJpeg = normalizedFormat === "jpg" || normalizedFormat === "jpeg";
              filePath = (0, nodes_camera_js_1.cameraTempPath)({
                kind: "snap",
                facing: facing,
                ext: isJpeg ? "jpg" : "png",
              });
              return [
                4 /*yield*/,
                (0, nodes_camera_js_1.writeBase64ToFile)(filePath, payload.base64),
              ];
            case 20:
              _l.sent();
              content.push({ type: "text", text: "MEDIA:".concat(filePath) });
              content.push({
                type: "image",
                data: payload.base64,
                mimeType:
                  (_g = (0, mime_js_1.imageMimeFromFormat)(payload.format)) !== null &&
                  _g !== void 0
                    ? _g
                    : isJpeg
                      ? "image/jpeg"
                      : "image/png",
              });
              details.push({
                facing: facing,
                path: filePath,
                width: payload.width,
                height: payload.height,
              });
              _l.label = 21;
            case 21:
              _i++;
              return [3 /*break*/, 18];
            case 22:
              result = { content: content, details: details };
              return [
                4 /*yield*/,
                (0, tool_images_js_1.sanitizeToolResultImages)(result, "nodes:camera_snap"),
              ];
            case 23:
              return [2 /*return*/, _l.sent()];
            case 24:
              node = (0, common_js_1.readStringParam)(params, "node", { required: true });
              return [4 /*yield*/, (0, nodes_utils_js_1.resolveNodeId)(gatewayOpts, node)];
            case 25:
              nodeId = _l.sent();
              return [
                4 /*yield*/,
                (0, gateway_js_1.callGatewayTool)("node.invoke", gatewayOpts, {
                  nodeId: nodeId,
                  command: "camera.list",
                  params: {},
                  idempotencyKey: node_crypto_1.default.randomUUID(),
                }),
              ];
            case 26:
              raw = _l.sent();
              payload =
                raw && typeof raw.payload === "object" && raw.payload !== null ? raw.payload : {};
              return [2 /*return*/, (0, common_js_1.jsonResult)(payload)];
            case 27:
              node = (0, common_js_1.readStringParam)(params, "node", { required: true });
              return [4 /*yield*/, (0, nodes_utils_js_1.resolveNodeId)(gatewayOpts, node)];
            case 28:
              nodeId = _l.sent();
              facing = typeof params.facing === "string" ? params.facing.toLowerCase() : "front";
              if (facing !== "front" && facing !== "back") {
                throw new Error("invalid facing (front|back)");
              }
              durationMs =
                typeof params.durationMs === "number" && Number.isFinite(params.durationMs)
                  ? params.durationMs
                  : typeof params.duration === "string"
                    ? (0, parse_duration_js_1.parseDurationMs)(params.duration)
                    : 3000;
              includeAudio = typeof params.includeAudio === "boolean" ? params.includeAudio : true;
              deviceId =
                typeof params.deviceId === "string" && params.deviceId.trim()
                  ? params.deviceId.trim()
                  : undefined;
              return [
                4 /*yield*/,
                (0, gateway_js_1.callGatewayTool)("node.invoke", gatewayOpts, {
                  nodeId: nodeId,
                  command: "camera.clip",
                  params: {
                    facing: facing,
                    durationMs: durationMs,
                    includeAudio: includeAudio,
                    format: "mp4",
                    deviceId: deviceId,
                  },
                  idempotencyKey: node_crypto_1.default.randomUUID(),
                }),
              ];
            case 29:
              raw = _l.sent();
              payload = (0, nodes_camera_js_1.parseCameraClipPayload)(
                raw === null || raw === void 0 ? void 0 : raw.payload,
              );
              filePath = (0, nodes_camera_js_1.cameraTempPath)({
                kind: "clip",
                facing: facing,
                ext: payload.format,
              });
              return [
                4 /*yield*/,
                (0, nodes_camera_js_1.writeBase64ToFile)(filePath, payload.base64),
              ];
            case 30:
              _l.sent();
              return [
                2 /*return*/,
                {
                  content: [{ type: "text", text: "FILE:".concat(filePath) }],
                  details: {
                    facing: facing,
                    path: filePath,
                    durationMs: payload.durationMs,
                    hasAudio: payload.hasAudio,
                  },
                },
              ];
            case 31:
              node = (0, common_js_1.readStringParam)(params, "node", { required: true });
              return [4 /*yield*/, (0, nodes_utils_js_1.resolveNodeId)(gatewayOpts, node)];
            case 32:
              nodeId = _l.sent();
              durationMs =
                typeof params.durationMs === "number" && Number.isFinite(params.durationMs)
                  ? params.durationMs
                  : typeof params.duration === "string"
                    ? (0, parse_duration_js_1.parseDurationMs)(params.duration)
                    : 10000;
              fps = typeof params.fps === "number" && Number.isFinite(params.fps) ? params.fps : 10;
              screenIndex =
                typeof params.screenIndex === "number" && Number.isFinite(params.screenIndex)
                  ? params.screenIndex
                  : 0;
              includeAudio = typeof params.includeAudio === "boolean" ? params.includeAudio : true;
              return [
                4 /*yield*/,
                (0, gateway_js_1.callGatewayTool)("node.invoke", gatewayOpts, {
                  nodeId: nodeId,
                  command: "screen.record",
                  params: {
                    durationMs: durationMs,
                    screenIndex: screenIndex,
                    fps: fps,
                    format: "mp4",
                    includeAudio: includeAudio,
                  },
                  idempotencyKey: node_crypto_1.default.randomUUID(),
                }),
              ];
            case 33:
              raw = _l.sent();
              payload = (0, nodes_screen_js_1.parseScreenRecordPayload)(
                raw === null || raw === void 0 ? void 0 : raw.payload,
              );
              filePath =
                typeof params.outPath === "string" && params.outPath.trim()
                  ? params.outPath.trim()
                  : (0, nodes_screen_js_1.screenRecordTempPath)({ ext: payload.format || "mp4" });
              return [
                4 /*yield*/,
                (0, nodes_screen_js_1.writeScreenRecordToFile)(filePath, payload.base64),
              ];
            case 34:
              written = _l.sent();
              return [
                2 /*return*/,
                {
                  content: [{ type: "text", text: "FILE:".concat(written.path) }],
                  details: {
                    path: written.path,
                    durationMs: payload.durationMs,
                    fps: payload.fps,
                    screenIndex: payload.screenIndex,
                    hasAudio: payload.hasAudio,
                  },
                },
              ];
            case 35:
              node = (0, common_js_1.readStringParam)(params, "node", { required: true });
              return [4 /*yield*/, (0, nodes_utils_js_1.resolveNodeId)(gatewayOpts, node)];
            case 36:
              nodeId = _l.sent();
              maxAgeMs =
                typeof params.maxAgeMs === "number" && Number.isFinite(params.maxAgeMs)
                  ? params.maxAgeMs
                  : undefined;
              desiredAccuracy =
                params.desiredAccuracy === "coarse" ||
                params.desiredAccuracy === "balanced" ||
                params.desiredAccuracy === "precise"
                  ? params.desiredAccuracy
                  : undefined;
              locationTimeoutMs =
                typeof params.locationTimeoutMs === "number" &&
                Number.isFinite(params.locationTimeoutMs)
                  ? params.locationTimeoutMs
                  : undefined;
              return [
                4 /*yield*/,
                (0, gateway_js_1.callGatewayTool)("node.invoke", gatewayOpts, {
                  nodeId: nodeId,
                  command: "location.get",
                  params: {
                    maxAgeMs: maxAgeMs,
                    desiredAccuracy: desiredAccuracy,
                    timeoutMs: locationTimeoutMs,
                  },
                  idempotencyKey: node_crypto_1.default.randomUUID(),
                }),
              ];
            case 37:
              raw = _l.sent();
              return [
                2 /*return*/,
                (0, common_js_1.jsonResult)(
                  (_h = raw === null || raw === void 0 ? void 0 : raw.payload) !== null &&
                    _h !== void 0
                    ? _h
                    : {},
                ),
              ];
            case 38:
              node = (0, common_js_1.readStringParam)(params, "node", { required: true });
              return [4 /*yield*/, (0, nodes_utils_js_1.listNodes)(gatewayOpts)];
            case 39:
              nodes = _l.sent();
              if (nodes.length === 0) {
                throw new Error(
                  "system.run requires a paired companion app or node host (no nodes available).",
                );
              }
              nodeId_1 = (0, nodes_utils_js_1.resolveNodeIdFromList)(nodes, node);
              nodeInfo = nodes.find(function (entry) {
                return entry.nodeId === nodeId_1;
              });
              supportsSystemRun = Array.isArray(
                nodeInfo === null || nodeInfo === void 0 ? void 0 : nodeInfo.commands,
              )
                ? (_j = nodeInfo === null || nodeInfo === void 0 ? void 0 : nodeInfo.commands) ===
                    null || _j === void 0
                  ? void 0
                  : _j.includes("system.run")
                : false;
              if (!supportsSystemRun) {
                throw new Error(
                  "system.run requires a companion app or node host; the selected node does not support system.run.",
                );
              }
              commandRaw = params.command;
              if (!commandRaw) {
                throw new Error("command required (argv array, e.g. ['echo', 'Hello'])");
              }
              if (!Array.isArray(commandRaw)) {
                throw new Error(
                  "command must be an array of strings (argv), e.g. ['echo', 'Hello']",
                );
              }
              command = commandRaw.map(function (c) {
                return String(c);
              });
              if (command.length === 0) {
                throw new Error("command must not be empty");
              }
              cwd =
                typeof params.cwd === "string" && params.cwd.trim() ? params.cwd.trim() : undefined;
              env = (0, nodes_run_js_1.parseEnvPairs)(params.env);
              commandTimeoutMs = (0, nodes_run_js_1.parseTimeoutMs)(params.commandTimeoutMs);
              invokeTimeoutMs = (0, nodes_run_js_1.parseTimeoutMs)(params.invokeTimeoutMs);
              needsScreenRecording =
                typeof params.needsScreenRecording === "boolean"
                  ? params.needsScreenRecording
                  : undefined;
              return [
                4 /*yield*/,
                (0, gateway_js_1.callGatewayTool)("node.invoke", gatewayOpts, {
                  nodeId: nodeId_1,
                  command: "system.run",
                  params: {
                    command: command,
                    cwd: cwd,
                    env: env,
                    timeoutMs: commandTimeoutMs,
                    needsScreenRecording: needsScreenRecording,
                    agentId: agentId,
                    sessionKey: sessionKey,
                  },
                  timeoutMs: invokeTimeoutMs,
                  idempotencyKey: node_crypto_1.default.randomUUID(),
                }),
              ];
            case 40:
              raw = _l.sent();
              return [
                2 /*return*/,
                (0, common_js_1.jsonResult)(
                  (_k = raw === null || raw === void 0 ? void 0 : raw.payload) !== null &&
                    _k !== void 0
                    ? _k
                    : {},
                ),
              ];
            case 41:
              throw new Error("Unknown action: ".concat(action));
            case 42:
              return [3 /*break*/, 44];
            case 43:
              err_1 = _l.sent();
              nodeLabel =
                typeof params.node === "string" && params.node.trim() ? params.node.trim() : "auto";
              gatewayLabel =
                gatewayOpts.gatewayUrl && gatewayOpts.gatewayUrl.trim()
                  ? gatewayOpts.gatewayUrl.trim()
                  : "default";
              agentLabel = agentId !== null && agentId !== void 0 ? agentId : "unknown";
              message = err_1 instanceof Error ? err_1.message : String(err_1);
              throw new Error(
                "agent="
                  .concat(agentLabel, " node=")
                  .concat(nodeLabel, " gateway=")
                  .concat(gatewayLabel, " action=")
                  .concat(action, ": ")
                  .concat(message),
              );
            case 44:
              return [2 /*return*/];
          }
        });
      });
    },
  };
}
