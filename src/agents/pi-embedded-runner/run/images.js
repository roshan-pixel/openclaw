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
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2) {
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectImageReferences = detectImageReferences;
exports.loadImageFromRef = loadImageFromRef;
exports.modelSupportsImages = modelSupportsImages;
exports.detectAndLoadPromptImages = detectAndLoadPromptImages;
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var node_url_1 = require("node:url");
var sandbox_paths_js_1 = require("../../sandbox-paths.js");
var tool_images_js_1 = require("../../tool-images.js");
var tui_formatters_js_1 = require("../../../tui/tui-formatters.js");
var media_js_1 = require("../../../web/media.js");
var utils_js_1 = require("../../../utils.js");
var logger_js_1 = require("../logger.js");
/**
 * Common image file extensions for detection.
 */
var IMAGE_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".bmp",
  ".tiff",
  ".tif",
  ".heic",
  ".heif",
]);
/**
 * Checks if a file extension indicates an image file.
 */
function isImageExtension(filePath) {
  var ext = node_path_1.default.extname(filePath).toLowerCase();
  return IMAGE_EXTENSIONS.has(ext);
}
function sanitizeImagesWithLog(images, label) {
  return __awaiter(this, void 0, void 0, function () {
    var _a, sanitized, dropped;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          return [4 /*yield*/, (0, tool_images_js_1.sanitizeImageBlocks)(images, label)];
        case 1:
          ((_a = _b.sent()), (sanitized = _a.images), (dropped = _a.dropped));
          if (dropped > 0) {
            logger_js_1.log.warn(
              "Native image: dropped "
                .concat(dropped, " image(s) after sanitization (")
                .concat(label, ")."),
            );
          }
          return [2 /*return*/, sanitized];
      }
    });
  });
}
/**
 * Detects image references in a user prompt.
 *
 * Patterns detected:
 * - Absolute paths: /path/to/image.png
 * - Relative paths: ./image.png, ../images/photo.jpg
 * - Home paths: ~/Pictures/screenshot.png
 * - file:// URLs: file:///path/to/image.png
 * - Message attachments: [Image: source: /path/to/image.jpg]
 *
 * @param prompt The user prompt text to scan
 * @returns Array of detected image references
 */
function detectImageReferences(prompt) {
  var _a;
  var refs = [];
  var seen = new Set();
  // Helper to add a path ref
  var addPathRef = function (raw) {
    var trimmed = raw.trim();
    if (!trimmed || seen.has(trimmed.toLowerCase())) {
      return;
    }
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return;
    }
    if (!isImageExtension(trimmed)) {
      return;
    }
    seen.add(trimmed.toLowerCase());
    var resolved = trimmed.startsWith("~") ? (0, utils_js_1.resolveUserPath)(trimmed) : trimmed;
    refs.push({ raw: trimmed, type: "path", resolved: resolved });
  };
  // Pattern for [media attached: path (type) | url] or [media attached N/M: path (type) | url] format
  // Each bracket = ONE file. The | separates path from URL, not multiple files.
  // Multi-file format uses separate brackets on separate lines.
  var mediaAttachedPattern = /\[media attached(?:\s+\d+\/\d+)?:\s*([^\]]+)\]/gi;
  var match;
  while ((match = mediaAttachedPattern.exec(prompt)) !== null) {
    var content = match[1];
    // Skip "[media attached: N files]" header lines
    if (/^\d+\s+files?$/i.test(content.trim())) {
      continue;
    }
    // Extract path before the (mime/type) or | delimiter
    // Format is: path (type) | url  OR  just: path (type)
    // Path may contain spaces (e.g., "ChatGPT Image Apr 21.png")
    // Use non-greedy .+? to stop at first image extension
    var pathMatch = content.match(
      /^\s*(.+?\.(?:png|jpe?g|gif|webp|bmp|tiff?|heic|heif))\s*(?:\(|$|\|)/i,
    );
    if (pathMatch === null || pathMatch === void 0 ? void 0 : pathMatch[1]) {
      addPathRef(pathMatch[1].trim());
    }
  }
  // Pattern for [Image: source: /path/...] format from messaging systems
  var messageImagePattern =
    /\[Image:\s*source:\s*([^\]]+\.(?:png|jpe?g|gif|webp|bmp|tiff?|heic|heif))\]/gi;
  while ((match = messageImagePattern.exec(prompt)) !== null) {
    var raw = (_a = match[1]) === null || _a === void 0 ? void 0 : _a.trim();
    if (raw) {
      addPathRef(raw);
    }
  }
  // Remote HTTP(S) URLs are intentionally ignored. Native image injection is local-only.
  // Pattern for file:// URLs - treat as paths since loadWebMedia handles them
  var fileUrlPattern = /file:\/\/[^\s<>"'`\]]+\.(?:png|jpe?g|gif|webp|bmp|tiff?|heic|heif)/gi;
  while ((match = fileUrlPattern.exec(prompt)) !== null) {
    var raw = match[0];
    if (seen.has(raw.toLowerCase())) {
      continue;
    }
    seen.add(raw.toLowerCase());
    // Use fileURLToPath for proper handling (e.g., file://localhost/path)
    try {
      var resolved = (0, node_url_1.fileURLToPath)(raw);
      refs.push({ raw: raw, type: "path", resolved: resolved });
    } catch (_b) {
      // Skip malformed file:// URLs
    }
  }
  // Pattern for file paths (absolute, relative, or home)
  // Matches:
  // - /absolute/path/to/file.ext (including paths with special chars like Messages/Attachments)
  // - ./relative/path.ext
  // - ../parent/path.ext
  // - ~/home/path.ext
  var pathPattern =
    /(?:^|\s|["'`(])((\.\.?\/|[~/])[^\s"'`()[\]]*\.(?:png|jpe?g|gif|webp|bmp|tiff?|heic|heif))/gi;
  while ((match = pathPattern.exec(prompt)) !== null) {
    // Use capture group 1 (the path without delimiter prefix); skip if undefined
    if (match[1]) {
      addPathRef(match[1]);
    }
  }
  return refs;
}
/**
 * Loads an image from a file path or URL and returns it as ImageContent.
 *
 * @param ref The detected image reference
 * @param workspaceDir The current workspace directory for resolving relative paths
 * @param options Optional settings for sandbox and size limits
 * @returns The loaded image content, or null if loading failed
 */
function loadImageFromRef(ref, workspaceDir, options) {
  return __awaiter(this, void 0, void 0, function () {
    var targetPath, resolveRoot, validated, err_1, _a, media, mimeType, data, err_2;
    var _b, _c;
    return __generator(this, function (_d) {
      switch (_d.label) {
        case 0:
          _d.trys.push([0, 10, , 11]);
          targetPath = ref.resolved;
          // Remote URL loading is disabled (local-only).
          if (ref.type === "url") {
            logger_js_1.log.debug(
              "Native image: rejecting remote URL (local-only): ".concat(ref.resolved),
            );
            return [2 /*return*/, null];
          }
          // For file paths, resolve relative to the appropriate root:
          // - When sandbox is enabled, resolve relative to sandboxRoot for security
          // - Otherwise, resolve relative to workspaceDir
          // Note: ref.resolved may already be absolute (e.g., after ~ expansion in detectImageReferences),
          // in which case we skip relative resolution.
          if (ref.type === "path" && !node_path_1.default.isAbsolute(targetPath)) {
            resolveRoot =
              (_b = options === null || options === void 0 ? void 0 : options.sandboxRoot) !==
                null && _b !== void 0
                ? _b
                : workspaceDir;
            targetPath = node_path_1.default.resolve(resolveRoot, targetPath);
          }
          if (
            !(
              ref.type === "path" &&
              (options === null || options === void 0 ? void 0 : options.sandboxRoot)
            )
          ) {
            return [3 /*break*/, 4];
          }
          _d.label = 1;
        case 1:
          _d.trys.push([1, 3, , 4]);
          return [
            4 /*yield*/,
            (0, sandbox_paths_js_1.assertSandboxPath)({
              filePath: targetPath,
              cwd: options.sandboxRoot,
              root: options.sandboxRoot,
            }),
          ];
        case 2:
          validated = _d.sent();
          targetPath = validated.resolved;
          return [3 /*break*/, 4];
        case 3:
          err_1 = _d.sent();
          // Log the actual error for debugging (sandbox violation or other path error)
          logger_js_1.log.debug(
            "Native image: sandbox validation failed for "
              .concat(ref.resolved, ": ")
              .concat(err_1 instanceof Error ? err_1.message : String(err_1)),
          );
          return [2 /*return*/, null];
        case 4:
          if (!(ref.type === "path")) {
            return [3 /*break*/, 8];
          }
          _d.label = 5;
        case 5:
          _d.trys.push([5, 7, , 8]);
          return [4 /*yield*/, promises_1.default.stat(targetPath)];
        case 6:
          _d.sent();
          return [3 /*break*/, 8];
        case 7:
          _a = _d.sent();
          logger_js_1.log.debug("Native image: file not found: ".concat(targetPath));
          return [2 /*return*/, null];
        case 8:
          return [
            4 /*yield*/,
            (0, media_js_1.loadWebMedia)(
              targetPath,
              options === null || options === void 0 ? void 0 : options.maxBytes,
            ),
          ];
        case 9:
          media = _d.sent();
          if (media.kind !== "image") {
            logger_js_1.log.debug(
              "Native image: not an image file: "
                .concat(targetPath, " (got ")
                .concat(media.kind, ")"),
            );
            return [2 /*return*/, null];
          }
          mimeType = (_c = media.contentType) !== null && _c !== void 0 ? _c : "image/jpeg";
          data = media.buffer.toString("base64");
          return [2 /*return*/, { type: "image", data: data, mimeType: mimeType }];
        case 10:
          err_2 = _d.sent();
          // Log the actual error for debugging (size limits, network failures, etc.)
          logger_js_1.log.debug(
            "Native image: failed to load "
              .concat(ref.resolved, ": ")
              .concat(err_2 instanceof Error ? err_2.message : String(err_2)),
          );
          return [2 /*return*/, null];
        case 11:
          return [2 /*return*/];
      }
    });
  });
}
/**
 * Checks if a model supports image input based on its input capabilities.
 *
 * @param model The model object with input capability array
 * @returns True if the model supports image input
 */
function modelSupportsImages(model) {
  var _a, _b;
  return (_b = (_a = model.input) === null || _a === void 0 ? void 0 : _a.includes("image")) !==
    null && _b !== void 0
    ? _b
    : false;
}
/**
 * Extracts image references from conversation history messages.
 * Scans user messages for image paths/URLs that can be loaded.
 * Each ref includes the messageIndex so images can be injected at their original location.
 *
 * Note: Global deduplication is intentional - if the same image appears in multiple
 * messages, we only inject it at the FIRST occurrence. This is sufficient because:
 * 1. The model sees all message content including the image
 * 2. Later references to "the image" or "that picture" will work since it's in context
 * 3. Injecting duplicates would waste tokens and potentially hit size limits
 */
function detectImagesFromHistory(messages) {
  var allRefs = [];
  var seen = new Set();
  var messageHasImageContent = function (msg) {
    if (!msg || typeof msg !== "object") {
      return false;
    }
    var content = msg.content;
    if (!Array.isArray(content)) {
      return false;
    }
    return content.some(function (part) {
      return part != null && typeof part === "object" && part.type === "image";
    });
  };
  for (var i = 0; i < messages.length; i++) {
    var msg = messages[i];
    if (!msg || typeof msg !== "object") {
      continue;
    }
    var message = msg;
    // Only scan user messages for image references
    if (message.role !== "user") {
      continue;
    }
    // Skip if message already has image content (prevents reloading each turn)
    if (messageHasImageContent(msg)) {
      continue;
    }
    var text = (0, tui_formatters_js_1.extractTextFromMessage)(msg);
    if (!text) {
      continue;
    }
    var refs = detectImageReferences(text);
    for (var _i = 0, refs_1 = refs; _i < refs_1.length; _i++) {
      var ref = refs_1[_i];
      var key = ref.resolved.toLowerCase();
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      allRefs.push(__assign(__assign({}, ref), { messageIndex: i }));
    }
  }
  return allRefs;
}
/**
 * Detects and loads images referenced in a prompt for models with vision capability.
 *
 * This function scans the prompt for image references (file paths and URLs),
 * loads them, and returns them as ImageContent array ready to be passed to
 * the model's prompt method.
 *
 * Also scans conversation history for images from previous turns and returns
 * them mapped by message index so they can be injected at their original location.
 *
 * @param params Configuration for image detection and loading
 * @returns Object with loaded images for current prompt and history images by message index
 */
function detectAndLoadPromptImages(params) {
  return __awaiter(this, void 0, void 0, function () {
    var promptRefs,
      historyRefs,
      seenPaths,
      uniqueHistoryRefs,
      allRefs,
      promptImages,
      historyImagesByIndex,
      loadedCount,
      skippedCount,
      _i,
      allRefs_1,
      ref,
      image,
      existing,
      sanitizedPromptImages,
      sanitizedHistoryImagesByIndex,
      _a,
      historyImagesByIndex_1,
      _b,
      index,
      images,
      sanitized;
    var _c, _d;
    return __generator(this, function (_e) {
      switch (_e.label) {
        case 0:
          // If model doesn't support images, return empty results
          if (!modelSupportsImages(params.model)) {
            return [
              2 /*return*/,
              {
                images: [],
                historyImagesByIndex: new Map(),
                detectedRefs: [],
                loadedCount: 0,
                skippedCount: 0,
              },
            ];
          }
          promptRefs = detectImageReferences(params.prompt);
          historyRefs = params.historyMessages
            ? detectImagesFromHistory(params.historyMessages)
            : [];
          seenPaths = new Set(
            promptRefs.map(function (r) {
              return r.resolved.toLowerCase();
            }),
          );
          uniqueHistoryRefs = historyRefs.filter(function (r) {
            return !seenPaths.has(r.resolved.toLowerCase());
          });
          allRefs = __spreadArray(__spreadArray([], promptRefs, true), uniqueHistoryRefs, true);
          if (allRefs.length === 0) {
            return [
              2 /*return*/,
              {
                images: (_c = params.existingImages) !== null && _c !== void 0 ? _c : [],
                historyImagesByIndex: new Map(),
                detectedRefs: [],
                loadedCount: 0,
                skippedCount: 0,
              },
            ];
          }
          logger_js_1.log.debug(
            "Native image: detected "
              .concat(allRefs.length, " image refs (")
              .concat(promptRefs.length, " in prompt, ")
              .concat(uniqueHistoryRefs.length, " in history)"),
          );
          promptImages = __spreadArray(
            [],
            (_d = params.existingImages) !== null && _d !== void 0 ? _d : [],
            true,
          );
          historyImagesByIndex = new Map();
          loadedCount = 0;
          skippedCount = 0;
          ((_i = 0), (allRefs_1 = allRefs));
          _e.label = 1;
        case 1:
          if (!(_i < allRefs_1.length)) {
            return [3 /*break*/, 4];
          }
          ref = allRefs_1[_i];
          return [
            4 /*yield*/,
            loadImageFromRef(ref, params.workspaceDir, {
              maxBytes: params.maxBytes,
              sandboxRoot: params.sandboxRoot,
            }),
          ];
        case 2:
          image = _e.sent();
          if (image) {
            if (ref.messageIndex !== undefined) {
              existing = historyImagesByIndex.get(ref.messageIndex);
              if (existing) {
                existing.push(image);
              } else {
                historyImagesByIndex.set(ref.messageIndex, [image]);
              }
            } else {
              // Current prompt image
              promptImages.push(image);
            }
            loadedCount++;
            logger_js_1.log.debug(
              "Native image: loaded ".concat(ref.type, " ").concat(ref.resolved),
            );
          } else {
            skippedCount++;
          }
          _e.label = 3;
        case 3:
          _i++;
          return [3 /*break*/, 1];
        case 4:
          return [4 /*yield*/, sanitizeImagesWithLog(promptImages, "prompt:images")];
        case 5:
          sanitizedPromptImages = _e.sent();
          sanitizedHistoryImagesByIndex = new Map();
          ((_a = 0), (historyImagesByIndex_1 = historyImagesByIndex));
          _e.label = 6;
        case 6:
          if (!(_a < historyImagesByIndex_1.length)) {
            return [3 /*break*/, 9];
          }
          ((_b = historyImagesByIndex_1[_a]), (index = _b[0]), (images = _b[1]));
          return [4 /*yield*/, sanitizeImagesWithLog(images, "history:images:".concat(index))];
        case 7:
          sanitized = _e.sent();
          if (sanitized.length > 0) {
            sanitizedHistoryImagesByIndex.set(index, sanitized);
          }
          _e.label = 8;
        case 8:
          _a++;
          return [3 /*break*/, 6];
        case 9:
          return [
            2 /*return*/,
            {
              images: sanitizedPromptImages,
              historyImagesByIndex: sanitizedHistoryImagesByIndex,
              detectedRefs: allRefs,
              loadedCount: loadedCount,
              skippedCount: skippedCount,
            },
          ];
      }
    });
  });
}
