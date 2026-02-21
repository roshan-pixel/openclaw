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
exports.runGeminiEmbeddingBatches = runGeminiEmbeddingBatches;
var subsystem_js_1 = require("../logging/subsystem.js");
var env_js_1 = require("../infra/env.js");
var internal_js_1 = require("./internal.js");
var GEMINI_BATCH_MAX_REQUESTS = 50000;
var debugEmbeddings = (0, env_js_1.isTruthyEnvValue)(process.env.OPENCLAW_DEBUG_MEMORY_EMBEDDINGS);
var log = (0, subsystem_js_1.createSubsystemLogger)("memory/embeddings");
var debugLog = function (message, meta) {
  if (!debugEmbeddings) {
    return;
  }
  var suffix = meta ? " ".concat(JSON.stringify(meta)) : "";
  log.raw("".concat(message).concat(suffix));
};
function getGeminiBaseUrl(gemini) {
  var _a, _b;
  return (_b = (_a = gemini.baseUrl) === null || _a === void 0 ? void 0 : _a.replace(/\/$/, "")) !==
    null && _b !== void 0
    ? _b
    : "";
}
function getGeminiHeaders(gemini, params) {
  var headers = gemini.headers ? __assign({}, gemini.headers) : {};
  if (params.json) {
    if (!headers["Content-Type"] && !headers["content-type"]) {
      headers["Content-Type"] = "application/json";
    }
  } else {
    delete headers["Content-Type"];
    delete headers["content-type"];
  }
  return headers;
}
function getGeminiUploadUrl(baseUrl) {
  if (baseUrl.includes("/v1beta")) {
    return baseUrl.replace(/\/v1beta\/?$/, "/upload/v1beta");
  }
  return "".concat(baseUrl.replace(/\/$/, ""), "/upload");
}
function splitGeminiBatchRequests(requests) {
  if (requests.length <= GEMINI_BATCH_MAX_REQUESTS) {
    return [requests];
  }
  var groups = [];
  for (var i = 0; i < requests.length; i += GEMINI_BATCH_MAX_REQUESTS) {
    groups.push(requests.slice(i, i + GEMINI_BATCH_MAX_REQUESTS));
  }
  return groups;
}
function buildGeminiUploadBody(params) {
  var boundary = "openclaw-".concat((0, internal_js_1.hashText)(params.displayName));
  var jsonPart = JSON.stringify({
    file: {
      displayName: params.displayName,
      mimeType: "application/jsonl",
    },
  });
  var delimiter = "--".concat(boundary, "\r\n");
  var closeDelimiter = "--".concat(boundary, "--\r\n");
  var parts = [
    ""
      .concat(delimiter, "Content-Type: application/json; charset=UTF-8\r\n\r\n")
      .concat(jsonPart, "\r\n"),
    ""
      .concat(delimiter, "Content-Type: application/jsonl; charset=UTF-8\r\n\r\n")
      .concat(params.jsonl, "\r\n"),
    closeDelimiter,
  ];
  var body = new Blob([parts.join("")], { type: "multipart/related" });
  return {
    body: body,
    contentType: "multipart/related; boundary=".concat(boundary),
  };
}
function submitGeminiBatch(params) {
  return __awaiter(this, void 0, void 0, function () {
    var baseUrl,
      jsonl,
      displayName,
      uploadPayload,
      uploadUrl,
      fileRes,
      text_1,
      filePayload,
      fileId,
      batchBody,
      batchEndpoint,
      batchRes,
      text;
    var _a, _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          baseUrl = getGeminiBaseUrl(params.gemini);
          jsonl = params.requests
            .map(function (request) {
              return JSON.stringify({
                key: request.custom_id,
                request: {
                  content: request.content,
                  task_type: request.taskType,
                },
              });
            })
            .join("\n");
          displayName = "memory-embeddings-".concat(
            (0, internal_js_1.hashText)(String(Date.now())),
          );
          uploadPayload = buildGeminiUploadBody({ jsonl: jsonl, displayName: displayName });
          uploadUrl = "".concat(getGeminiUploadUrl(baseUrl), "/files?uploadType=multipart");
          debugLog("memory embeddings: gemini batch upload", {
            uploadUrl: uploadUrl,
            baseUrl: baseUrl,
            requests: params.requests.length,
          });
          return [
            4 /*yield*/,
            fetch(uploadUrl, {
              method: "POST",
              headers: __assign(__assign({}, getGeminiHeaders(params.gemini, { json: false })), {
                "Content-Type": uploadPayload.contentType,
              }),
              body: uploadPayload.body,
            }),
          ];
        case 1:
          fileRes = _c.sent();
          if (!!fileRes.ok) {
            return [3 /*break*/, 3];
          }
          return [4 /*yield*/, fileRes.text()];
        case 2:
          text_1 = _c.sent();
          throw new Error(
            "gemini batch file upload failed: ".concat(fileRes.status, " ").concat(text_1),
          );
        case 3:
          return [4 /*yield*/, fileRes.json()];
        case 4:
          filePayload = _c.sent();
          fileId =
            (_a = filePayload.name) !== null && _a !== void 0
              ? _a
              : (_b = filePayload.file) === null || _b === void 0
                ? void 0
                : _b.name;
          if (!fileId) {
            throw new Error("gemini batch file upload failed: missing file id");
          }
          batchBody = {
            batch: {
              displayName: "memory-embeddings-".concat(params.agentId),
              inputConfig: {
                file_name: fileId,
              },
            },
          };
          batchEndpoint = ""
            .concat(baseUrl, "/")
            .concat(params.gemini.modelPath, ":asyncBatchEmbedContent");
          debugLog("memory embeddings: gemini batch create", {
            batchEndpoint: batchEndpoint,
            fileId: fileId,
          });
          return [
            4 /*yield*/,
            fetch(batchEndpoint, {
              method: "POST",
              headers: getGeminiHeaders(params.gemini, { json: true }),
              body: JSON.stringify(batchBody),
            }),
          ];
        case 5:
          batchRes = _c.sent();
          if (!batchRes.ok) {
            return [3 /*break*/, 7];
          }
          return [4 /*yield*/, batchRes.json()];
        case 6:
          return [2 /*return*/, _c.sent()];
        case 7:
          return [4 /*yield*/, batchRes.text()];
        case 8:
          text = _c.sent();
          if (batchRes.status === 404) {
            throw new Error(
              "gemini batch create failed: 404 (asyncBatchEmbedContent not available for this model/baseUrl). Disable remote.batch.enabled or switch providers.",
            );
          }
          throw new Error("gemini batch create failed: ".concat(batchRes.status, " ").concat(text));
      }
    });
  });
}
function fetchGeminiBatchStatus(params) {
  return __awaiter(this, void 0, void 0, function () {
    var baseUrl, name, statusUrl, res, text;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          baseUrl = getGeminiBaseUrl(params.gemini);
          name = params.batchName.startsWith("batches/")
            ? params.batchName
            : "batches/".concat(params.batchName);
          statusUrl = "".concat(baseUrl, "/").concat(name);
          debugLog("memory embeddings: gemini batch status", { statusUrl: statusUrl });
          return [
            4 /*yield*/,
            fetch(statusUrl, {
              headers: getGeminiHeaders(params.gemini, { json: true }),
            }),
          ];
        case 1:
          res = _a.sent();
          if (!!res.ok) {
            return [3 /*break*/, 3];
          }
          return [4 /*yield*/, res.text()];
        case 2:
          text = _a.sent();
          throw new Error("gemini batch status failed: ".concat(res.status, " ").concat(text));
        case 3:
          return [4 /*yield*/, res.json()];
        case 4:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
function fetchGeminiFileContent(params) {
  return __awaiter(this, void 0, void 0, function () {
    var baseUrl, file, downloadUrl, res, text;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          baseUrl = getGeminiBaseUrl(params.gemini);
          file = params.fileId.startsWith("files/")
            ? params.fileId
            : "files/".concat(params.fileId);
          downloadUrl = "".concat(baseUrl, "/").concat(file, ":download");
          debugLog("memory embeddings: gemini batch download", { downloadUrl: downloadUrl });
          return [
            4 /*yield*/,
            fetch(downloadUrl, {
              headers: getGeminiHeaders(params.gemini, { json: true }),
            }),
          ];
        case 1:
          res = _a.sent();
          if (!!res.ok) {
            return [3 /*break*/, 3];
          }
          return [4 /*yield*/, res.text()];
        case 2:
          text = _a.sent();
          throw new Error(
            "gemini batch file content failed: ".concat(res.status, " ").concat(text),
          );
        case 3:
          return [4 /*yield*/, res.text()];
        case 4:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
function parseGeminiBatchOutput(text) {
  if (!text.trim()) {
    return [];
  }
  return text
    .split("\n")
    .map(function (line) {
      return line.trim();
    })
    .filter(Boolean)
    .map(function (line) {
      return JSON.parse(line);
    });
}
function waitForGeminiBatch(params) {
  return __awaiter(this, void 0, void 0, function () {
    var start, current, status_1, _a, state, outputFileId, message;
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    return __generator(this, function (_m) {
      switch (_m.label) {
        case 0:
          start = Date.now();
          current = params.initial;
          _m.label = 1;
        case 1:
          if (!true) {
            return [3 /*break*/, 6];
          }
          if (!(current !== null && current !== void 0)) {
            return [3 /*break*/, 2];
          }
          _a = current;
          return [3 /*break*/, 4];
        case 2:
          return [
            4 /*yield*/,
            fetchGeminiBatchStatus({
              gemini: params.gemini,
              batchName: params.batchName,
            }),
          ];
        case 3:
          _a = _m.sent();
          _m.label = 4;
        case 4:
          status_1 = _a;
          state = (_b = status_1.state) !== null && _b !== void 0 ? _b : "UNKNOWN";
          if (["SUCCEEDED", "COMPLETED", "DONE"].includes(state)) {
            outputFileId =
              (_f =
                (_d = (_c = status_1.outputConfig) === null || _c === void 0 ? void 0 : _c.file) !==
                  null && _d !== void 0
                  ? _d
                  : (_e = status_1.outputConfig) === null || _e === void 0
                    ? void 0
                    : _e.fileId) !== null && _f !== void 0
                ? _f
                : (_h = (_g = status_1.metadata) === null || _g === void 0 ? void 0 : _g.output) ===
                      null || _h === void 0
                  ? void 0
                  : _h.responsesFile;
            if (!outputFileId) {
              throw new Error(
                "gemini batch ".concat(params.batchName, " completed without output file"),
              );
            }
            return [2 /*return*/, { outputFileId: outputFileId }];
          }
          if (["FAILED", "CANCELLED", "CANCELED", "EXPIRED"].includes(state)) {
            message =
              (_k = (_j = status_1.error) === null || _j === void 0 ? void 0 : _j.message) !==
                null && _k !== void 0
                ? _k
                : "unknown error";
            throw new Error(
              "gemini batch ".concat(params.batchName, " ").concat(state, ": ").concat(message),
            );
          }
          if (!params.wait) {
            throw new Error(
              "gemini batch ".concat(params.batchName, " still ").concat(state, "; wait disabled"),
            );
          }
          if (Date.now() - start > params.timeoutMs) {
            throw new Error(
              "gemini batch "
                .concat(params.batchName, " timed out after ")
                .concat(params.timeoutMs, "ms"),
            );
          }
          (_l = params.debug) === null || _l === void 0
            ? void 0
            : _l.call(
                params,
                "gemini batch "
                  .concat(params.batchName, " ")
                  .concat(state, "; waiting ")
                  .concat(params.pollIntervalMs, "ms"),
              );
          return [
            4 /*yield*/,
            new Promise(function (resolve) {
              return setTimeout(resolve, params.pollIntervalMs);
            }),
          ];
        case 5:
          _m.sent();
          current = undefined;
          return [3 /*break*/, 1];
        case 6:
          return [2 /*return*/];
      }
    });
  });
}
function runWithConcurrency(tasks, limit) {
  return __awaiter(this, void 0, void 0, function () {
    var resolvedLimit, results, next, firstError, workers;
    var _this = this;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          if (tasks.length === 0) {
            return [2 /*return*/, []];
          }
          resolvedLimit = Math.max(1, Math.min(limit, tasks.length));
          results = Array.from({ length: tasks.length });
          next = 0;
          firstError = null;
          workers = Array.from({ length: resolvedLimit }, function () {
            return __awaiter(_this, void 0, void 0, function () {
              var index, _a, _b, err_1;
              return __generator(this, function (_c) {
                switch (_c.label) {
                  case 0:
                    if (!true) {
                      return [3 /*break*/, 5];
                    }
                    if (firstError) {
                      return [2 /*return*/];
                    }
                    index = next;
                    next += 1;
                    if (index >= tasks.length) {
                      return [2 /*return*/];
                    }
                    _c.label = 1;
                  case 1:
                    _c.trys.push([1, 3, , 4]);
                    _a = results;
                    _b = index;
                    return [4 /*yield*/, tasks[index]()];
                  case 2:
                    _a[_b] = _c.sent();
                    return [3 /*break*/, 4];
                  case 3:
                    err_1 = _c.sent();
                    firstError = err_1;
                    return [2 /*return*/];
                  case 4:
                    return [3 /*break*/, 0];
                  case 5:
                    return [2 /*return*/];
                }
              });
            });
          });
          return [4 /*yield*/, Promise.allSettled(workers)];
        case 1:
          _a.sent();
          if (firstError) {
            throw firstError;
          }
          return [2 /*return*/, results];
      }
    });
  });
}
function runGeminiEmbeddingBatches(params) {
  return __awaiter(this, void 0, void 0, function () {
    var groups, byCustomId, tasks;
    var _this = this;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          if (params.requests.length === 0) {
            return [2 /*return*/, new Map()];
          }
          groups = splitGeminiBatchRequests(params.requests);
          byCustomId = new Map();
          tasks = groups.map(function (group, groupIndex) {
            return function () {
              return __awaiter(_this, void 0, void 0, function () {
                var batchInfo,
                  batchName,
                  completed,
                  _a,
                  content,
                  outputLines,
                  errors,
                  remaining,
                  _i,
                  outputLines_1,
                  line,
                  customId,
                  embedding;
                var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
                return __generator(this, function (_w) {
                  switch (_w.label) {
                    case 0:
                      return [
                        4 /*yield*/,
                        submitGeminiBatch({
                          gemini: params.gemini,
                          requests: group,
                          agentId: params.agentId,
                        }),
                      ];
                    case 1:
                      batchInfo = _w.sent();
                      batchName = (_b = batchInfo.name) !== null && _b !== void 0 ? _b : "";
                      if (!batchName) {
                        throw new Error("gemini batch create failed: missing batch name");
                      }
                      (_c = params.debug) === null || _c === void 0
                        ? void 0
                        : _c.call(params, "memory embeddings: gemini batch created", {
                            batchName: batchName,
                            state: batchInfo.state,
                            group: groupIndex + 1,
                            groups: groups.length,
                            requests: group.length,
                          });
                      if (
                        !params.wait &&
                        batchInfo.state &&
                        !["SUCCEEDED", "COMPLETED", "DONE"].includes(batchInfo.state)
                      ) {
                        throw new Error(
                          "gemini batch ".concat(
                            batchName,
                            " submitted; enable remote.batch.wait to await completion",
                          ),
                        );
                      }
                      if (
                        !(
                          batchInfo.state &&
                          ["SUCCEEDED", "COMPLETED", "DONE"].includes(batchInfo.state)
                        )
                      ) {
                        return [3 /*break*/, 2];
                      }
                      _a = {
                        outputFileId:
                          (_k =
                            (_g =
                              (_e =
                                (_d = batchInfo.outputConfig) === null || _d === void 0
                                  ? void 0
                                  : _d.file) !== null && _e !== void 0
                                ? _e
                                : (_f = batchInfo.outputConfig) === null || _f === void 0
                                  ? void 0
                                  : _f.fileId) !== null && _g !== void 0
                              ? _g
                              : (_j =
                                    (_h = batchInfo.metadata) === null || _h === void 0
                                      ? void 0
                                      : _h.output) === null || _j === void 0
                                ? void 0
                                : _j.responsesFile) !== null && _k !== void 0
                            ? _k
                            : "",
                      };
                      return [3 /*break*/, 4];
                    case 2:
                      return [
                        4 /*yield*/,
                        waitForGeminiBatch({
                          gemini: params.gemini,
                          batchName: batchName,
                          wait: params.wait,
                          pollIntervalMs: params.pollIntervalMs,
                          timeoutMs: params.timeoutMs,
                          debug: params.debug,
                          initial: batchInfo,
                        }),
                      ];
                    case 3:
                      _a = _w.sent();
                      _w.label = 4;
                    case 4:
                      completed = _a;
                      if (!completed.outputFileId) {
                        throw new Error(
                          "gemini batch ".concat(batchName, " completed without output file"),
                        );
                      }
                      return [
                        4 /*yield*/,
                        fetchGeminiFileContent({
                          gemini: params.gemini,
                          fileId: completed.outputFileId,
                        }),
                      ];
                    case 5:
                      content = _w.sent();
                      outputLines = parseGeminiBatchOutput(content);
                      errors = [];
                      remaining = new Set(
                        group.map(function (request) {
                          return request.custom_id;
                        }),
                      );
                      for (_i = 0, outputLines_1 = outputLines; _i < outputLines_1.length; _i++) {
                        line = outputLines_1[_i];
                        customId =
                          (_m = (_l = line.key) !== null && _l !== void 0 ? _l : line.custom_id) !==
                            null && _m !== void 0
                            ? _m
                            : line.request_id;
                        if (!customId) {
                          continue;
                        }
                        remaining.delete(customId);
                        if ((_o = line.error) === null || _o === void 0 ? void 0 : _o.message) {
                          errors.push("".concat(customId, ": ").concat(line.error.message));
                          continue;
                        }
                        if (
                          (_q =
                            (_p = line.response) === null || _p === void 0 ? void 0 : _p.error) ===
                            null || _q === void 0
                            ? void 0
                            : _q.message
                        ) {
                          errors.push(
                            "".concat(customId, ": ").concat(line.response.error.message),
                          );
                          continue;
                        }
                        embedding =
                          (_v =
                            (_s =
                              (_r = line.embedding) === null || _r === void 0
                                ? void 0
                                : _r.values) !== null && _s !== void 0
                              ? _s
                              : (_u =
                                    (_t = line.response) === null || _t === void 0
                                      ? void 0
                                      : _t.embedding) === null || _u === void 0
                                ? void 0
                                : _u.values) !== null && _v !== void 0
                            ? _v
                            : [];
                        if (embedding.length === 0) {
                          errors.push("".concat(customId, ": empty embedding"));
                          continue;
                        }
                        byCustomId.set(customId, embedding);
                      }
                      if (errors.length > 0) {
                        throw new Error(
                          "gemini batch ".concat(batchName, " failed: ").concat(errors.join("; ")),
                        );
                      }
                      if (remaining.size > 0) {
                        throw new Error(
                          "gemini batch "
                            .concat(batchName, " missing ")
                            .concat(remaining.size, " embedding responses"),
                        );
                      }
                      return [2 /*return*/];
                  }
                });
              });
            };
          });
          (_a = params.debug) === null || _a === void 0
            ? void 0
            : _a.call(params, "memory embeddings: gemini batch submit", {
                requests: params.requests.length,
                groups: groups.length,
                wait: params.wait,
                concurrency: params.concurrency,
                pollIntervalMs: params.pollIntervalMs,
                timeoutMs: params.timeoutMs,
              });
          return [4 /*yield*/, runWithConcurrency(tasks, params.concurrency)];
        case 1:
          _b.sent();
          return [2 /*return*/, byCustomId];
      }
    });
  });
}
