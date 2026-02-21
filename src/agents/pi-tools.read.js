"use strict";
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) {
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
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
exports.CLAUDE_PARAM_GROUPS = void 0;
exports.normalizeToolParams = normalizeToolParams;
exports.patchToolSchemaForClaudeCompatibility = patchToolSchemaForClaudeCompatibility;
exports.assertRequiredParams = assertRequiredParams;
exports.wrapToolParamNormalization = wrapToolParamNormalization;
exports.createSandboxedReadTool = createSandboxedReadTool;
exports.createSandboxedWriteTool = createSandboxedWriteTool;
exports.createSandboxedEditTool = createSandboxedEditTool;
exports.createOpenClawReadTool = createOpenClawReadTool;
var pi_coding_agent_1 = require("@mariozechner/pi-coding-agent");
var mime_js_1 = require("../media/mime.js");
var sandbox_paths_js_1 = require("./sandbox-paths.js");
var tool_images_js_1 = require("./tool-images.js");
function sniffMimeFromBase64(base64) {
  return __awaiter(this, void 0, void 0, function () {
    var trimmed, take, sliceLen, head, _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          trimmed = base64.trim();
          if (!trimmed) {
            return [2 /*return*/, undefined];
          }
          take = Math.min(256, trimmed.length);
          sliceLen = take - (take % 4);
          if (sliceLen < 8) {
            return [2 /*return*/, undefined];
          }
          _b.label = 1;
        case 1:
          _b.trys.push([1, 3, , 4]);
          head = Buffer.from(trimmed.slice(0, sliceLen), "base64");
          return [4 /*yield*/, (0, mime_js_1.detectMime)({ buffer: head })];
        case 2:
          return [2 /*return*/, _b.sent()];
        case 3:
          _a = _b.sent();
          return [2 /*return*/, undefined];
        case 4:
          return [2 /*return*/];
      }
    });
  });
}
function rewriteReadImageHeader(text, mimeType) {
  // pi-coding-agent uses: "Read image file [image/png]"
  if (text.startsWith("Read image file [") && text.endsWith("]")) {
    return "Read image file [".concat(mimeType, "]");
  }
  return text;
}
function normalizeReadImageResult(result, filePath) {
  return __awaiter(this, void 0, void 0, function () {
    var content, image, sniffed, nextContent;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          content = Array.isArray(result.content) ? result.content : [];
          image = content.find(function (b) {
            return (
              !!b &&
              typeof b === "object" &&
              b.type === "image" &&
              typeof b.data === "string" &&
              typeof b.mimeType === "string"
            );
          });
          if (!image) {
            return [2 /*return*/, result];
          }
          if (!image.data.trim()) {
            throw new Error("read: image payload is empty (".concat(filePath, ")"));
          }
          return [4 /*yield*/, sniffMimeFromBase64(image.data)];
        case 1:
          sniffed = _a.sent();
          if (!sniffed) {
            return [2 /*return*/, result];
          }
          if (!sniffed.startsWith("image/")) {
            throw new Error(
              "read: file looks like "
                .concat(sniffed, " but was treated as ")
                .concat(image.mimeType, " (")
                .concat(filePath, ")"),
            );
          }
          if (sniffed === image.mimeType) {
            return [2 /*return*/, result];
          }
          nextContent = content.map(function (block) {
            if (block && typeof block === "object" && block.type === "image") {
              var b = block;
              return __assign(__assign({}, b), { mimeType: sniffed });
            }
            if (
              block &&
              typeof block === "object" &&
              block.type === "text" &&
              typeof block.text === "string"
            ) {
              var b = block;
              return __assign(__assign({}, b), { text: rewriteReadImageHeader(b.text, sniffed) });
            }
            return block;
          });
          return [2 /*return*/, __assign(__assign({}, result), { content: nextContent })];
      }
    });
  });
}
exports.CLAUDE_PARAM_GROUPS = {
  read: [{ keys: ["path", "file_path"], label: "path (path or file_path)" }],
  write: [{ keys: ["path", "file_path"], label: "path (path or file_path)" }],
  edit: [
    { keys: ["path", "file_path"], label: "path (path or file_path)" },
    {
      keys: ["oldText", "old_string"],
      label: "oldText (oldText or old_string)",
    },
    {
      keys: ["newText", "new_string"],
      label: "newText (newText or new_string)",
    },
  ],
};
// Normalize tool parameters from Claude Code conventions to pi-coding-agent conventions.
// Claude Code uses file_path/old_string/new_string while pi-coding-agent uses path/oldText/newText.
// This prevents models trained on Claude Code from getting stuck in tool-call loops.
function normalizeToolParams(params) {
  if (!params || typeof params !== "object") {
    return undefined;
  }
  var record = params;
  var normalized = __assign({}, record);
  // file_path → path (read, write, edit)
  if ("file_path" in normalized && !("path" in normalized)) {
    normalized.path = normalized.file_path;
    delete normalized.file_path;
  }
  // old_string → oldText (edit)
  if ("old_string" in normalized && !("oldText" in normalized)) {
    normalized.oldText = normalized.old_string;
    delete normalized.old_string;
  }
  // new_string → newText (edit)
  if ("new_string" in normalized && !("newText" in normalized)) {
    normalized.newText = normalized.new_string;
    delete normalized.new_string;
  }
  return normalized;
}
function patchToolSchemaForClaudeCompatibility(tool) {
  var schema = tool.parameters && typeof tool.parameters === "object" ? tool.parameters : undefined;
  if (!schema || !schema.properties || typeof schema.properties !== "object") {
    return tool;
  }
  var properties = __assign({}, schema.properties);
  var required = Array.isArray(schema.required)
    ? schema.required.filter(function (key) {
        return typeof key === "string";
      })
    : [];
  var changed = false;
  var aliasPairs = [
    { original: "path", alias: "file_path" },
    { original: "oldText", alias: "old_string" },
    { original: "newText", alias: "new_string" },
  ];
  for (var _i = 0, aliasPairs_1 = aliasPairs; _i < aliasPairs_1.length; _i++) {
    var _a = aliasPairs_1[_i],
      original = _a.original,
      alias = _a.alias;
    if (!(original in properties)) {
      continue;
    }
    if (!(alias in properties)) {
      properties[alias] = properties[original];
      changed = true;
    }
    var idx = required.indexOf(original);
    if (idx !== -1) {
      required.splice(idx, 1);
      changed = true;
    }
  }
  if (!changed) {
    return tool;
  }
  return __assign(__assign({}, tool), {
    parameters: __assign(
      __assign(__assign({}, schema), { properties: properties }),
      required.length > 0 ? { required: required } : {},
    ),
  });
}
function assertRequiredParams(record, groups, toolName) {
  var _a;
  if (!record || typeof record !== "object") {
    throw new Error("Missing parameters for ".concat(toolName));
  }
  var _loop_1 = function (group) {
    var satisfied = group.keys.some(function (key) {
      if (!(key in record)) {
        return false;
      }
      var value = record[key];
      if (typeof value !== "string") {
        return false;
      }
      if (group.allowEmpty) {
        return true;
      }
      return value.trim().length > 0;
    });
    if (!satisfied) {
      var label = (_a = group.label) !== null && _a !== void 0 ? _a : group.keys.join(" or ");
      throw new Error("Missing required parameter: ".concat(label));
    }
  };
  for (var _i = 0, groups_1 = groups; _i < groups_1.length; _i++) {
    var group = groups_1[_i];
    _loop_1(group);
  }
}
// Generic wrapper to normalize parameters for any tool
function wrapToolParamNormalization(tool, requiredParamGroups) {
  var _this = this;
  var patched = patchToolSchemaForClaudeCompatibility(tool);
  return __assign(__assign({}, patched), {
    execute: function (toolCallId, params, signal, onUpdate) {
      return __awaiter(_this, void 0, void 0, function () {
        var normalized, record;
        return __generator(this, function (_a) {
          normalized = normalizeToolParams(params);
          record =
            normalized !== null && normalized !== void 0
              ? normalized
              : params && typeof params === "object"
                ? params
                : undefined;
          if (
            requiredParamGroups === null || requiredParamGroups === void 0
              ? void 0
              : requiredParamGroups.length
          ) {
            assertRequiredParams(record, requiredParamGroups, tool.name);
          }
          return [
            2 /*return*/,
            tool.execute(
              toolCallId,
              normalized !== null && normalized !== void 0 ? normalized : params,
              signal,
              onUpdate,
            ),
          ];
        });
      });
    },
  });
}
function wrapSandboxPathGuard(tool, root) {
  var _this = this;
  return __assign(__assign({}, tool), {
    execute: function (toolCallId, args, signal, onUpdate) {
      return __awaiter(_this, void 0, void 0, function () {
        var normalized, record, filePath;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              normalized = normalizeToolParams(args);
              record =
                normalized !== null && normalized !== void 0
                  ? normalized
                  : args && typeof args === "object"
                    ? args
                    : undefined;
              filePath = record === null || record === void 0 ? void 0 : record.path;
              if (!(typeof filePath === "string" && filePath.trim())) {
                return [3 /*break*/, 2];
              }
              return [
                4 /*yield*/,
                (0, sandbox_paths_js_1.assertSandboxPath)({
                  filePath: filePath,
                  cwd: root,
                  root: root,
                }),
              ];
            case 1:
              _a.sent();
              _a.label = 2;
            case 2:
              return [
                2 /*return*/,
                tool.execute(
                  toolCallId,
                  normalized !== null && normalized !== void 0 ? normalized : args,
                  signal,
                  onUpdate,
                ),
              ];
          }
        });
      });
    },
  });
}
function createSandboxedReadTool(root) {
  var base = (0, pi_coding_agent_1.createReadTool)(root);
  return wrapSandboxPathGuard(createOpenClawReadTool(base), root);
}
function createSandboxedWriteTool(root) {
  var base = (0, pi_coding_agent_1.createWriteTool)(root);
  return wrapSandboxPathGuard(
    wrapToolParamNormalization(base, exports.CLAUDE_PARAM_GROUPS.write),
    root,
  );
}
function createSandboxedEditTool(root) {
  var base = (0, pi_coding_agent_1.createEditTool)(root);
  return wrapSandboxPathGuard(
    wrapToolParamNormalization(base, exports.CLAUDE_PARAM_GROUPS.edit),
    root,
  );
}
function createOpenClawReadTool(base) {
  var _this = this;
  var patched = patchToolSchemaForClaudeCompatibility(base);
  return __assign(__assign({}, patched), {
    execute: function (toolCallId, params, signal) {
      return __awaiter(_this, void 0, void 0, function () {
        var normalized, record, result, filePath, normalizedResult;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              normalized = normalizeToolParams(params);
              record =
                normalized !== null && normalized !== void 0
                  ? normalized
                  : params && typeof params === "object"
                    ? params
                    : undefined;
              assertRequiredParams(record, exports.CLAUDE_PARAM_GROUPS.read, base.name);
              return [
                4 /*yield*/,
                base.execute(
                  toolCallId,
                  normalized !== null && normalized !== void 0 ? normalized : params,
                  signal,
                ),
              ];
            case 1:
              result = _a.sent();
              filePath =
                typeof (record === null || record === void 0 ? void 0 : record.path) === "string"
                  ? String(record.path)
                  : "<unknown>";
              return [4 /*yield*/, normalizeReadImageResult(result, filePath)];
            case 2:
              normalizedResult = _a.sent();
              return [
                2 /*return*/,
                (0, tool_images_js_1.sanitizeToolResultImages)(
                  normalizedResult,
                  "read:".concat(filePath),
                ),
              ];
          }
        });
      });
    },
  });
}
