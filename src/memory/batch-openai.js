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
exports.OPENAI_BATCH_ENDPOINT = void 0;
exports.runOpenAiEmbeddingBatches = runOpenAiEmbeddingBatches;
var retry_js_1 = require("../infra/retry.js");
var internal_js_1 = require("./internal.js");
exports.OPENAI_BATCH_ENDPOINT = "/v1/embeddings";
var OPENAI_BATCH_COMPLETION_WINDOW = "24h";
var OPENAI_BATCH_MAX_REQUESTS = 50000;
function getOpenAiBaseUrl(openAi) {
  var _a, _b;
  return (_b = (_a = openAi.baseUrl) === null || _a === void 0 ? void 0 : _a.replace(/\/$/, "")) !==
    null && _b !== void 0
    ? _b
    : "";
}
function getOpenAiHeaders(openAi, params) {
  var headers = openAi.headers ? __assign({}, openAi.headers) : {};
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
function splitOpenAiBatchRequests(requests) {
  if (requests.length <= OPENAI_BATCH_MAX_REQUESTS) {
    return [requests];
  }
  var groups = [];
  for (var i = 0; i < requests.length; i += OPENAI_BATCH_MAX_REQUESTS) {
    groups.push(requests.slice(i, i + OPENAI_BATCH_MAX_REQUESTS));
  }
  return groups;
}
function submitOpenAiBatch(params) {
  return __awaiter(this, void 0, void 0, function () {
    var baseUrl, jsonl, form, fileRes, text, filePayload, batchRes;
    var _this = this;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          baseUrl = getOpenAiBaseUrl(params.openAi);
          jsonl = params.requests
            .map(function (request) {
              return JSON.stringify(request);
            })
            .join("\n");
          form = new FormData();
          form.append("purpose", "batch");
          form.append(
            "file",
            new Blob([jsonl], { type: "application/jsonl" }),
            "memory-embeddings.".concat((0, internal_js_1.hashText)(String(Date.now())), ".jsonl"),
          );
          return [
            4 /*yield*/,
            fetch("".concat(baseUrl, "/files"), {
              method: "POST",
              headers: getOpenAiHeaders(params.openAi, { json: false }),
              body: form,
            }),
          ];
        case 1:
          fileRes = _a.sent();
          if (!!fileRes.ok) {
            return [3 /*break*/, 3];
          }
          return [4 /*yield*/, fileRes.text()];
        case 2:
          text = _a.sent();
          throw new Error(
            "openai batch file upload failed: ".concat(fileRes.status, " ").concat(text),
          );
        case 3:
          return [4 /*yield*/, fileRes.json()];
        case 4:
          filePayload = _a.sent();
          if (!filePayload.id) {
            throw new Error("openai batch file upload failed: missing file id");
          }
          return [
            4 /*yield*/,
            (0, retry_js_1.retryAsync)(
              function () {
                return __awaiter(_this, void 0, void 0, function () {
                  var res, text, err;
                  return __generator(this, function (_a) {
                    switch (_a.label) {
                      case 0:
                        return [
                          4 /*yield*/,
                          fetch("".concat(baseUrl, "/batches"), {
                            method: "POST",
                            headers: getOpenAiHeaders(params.openAi, { json: true }),
                            body: JSON.stringify({
                              input_file_id: filePayload.id,
                              endpoint: exports.OPENAI_BATCH_ENDPOINT,
                              completion_window: OPENAI_BATCH_COMPLETION_WINDOW,
                              metadata: {
                                source: "openclaw-memory",
                                agent: params.agentId,
                              },
                            }),
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
                        err = new Error(
                          "openai batch create failed: ".concat(res.status, " ").concat(text),
                        );
                        err.status = res.status;
                        throw err;
                      case 3:
                        return [2 /*return*/, res];
                    }
                  });
                });
              },
              {
                attempts: 3,
                minDelayMs: 300,
                maxDelayMs: 2000,
                jitter: 0.2,
                shouldRetry: function (err) {
                  var status = err.status;
                  return status === 429 || (typeof status === "number" && status >= 500);
                },
              },
            ),
          ];
        case 5:
          batchRes = _a.sent();
          return [4 /*yield*/, batchRes.json()];
        case 6:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
function fetchOpenAiBatchStatus(params) {
  return __awaiter(this, void 0, void 0, function () {
    var baseUrl, res, text;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          baseUrl = getOpenAiBaseUrl(params.openAi);
          return [
            4 /*yield*/,
            fetch("".concat(baseUrl, "/batches/").concat(params.batchId), {
              headers: getOpenAiHeaders(params.openAi, { json: true }),
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
          throw new Error("openai batch status failed: ".concat(res.status, " ").concat(text));
        case 3:
          return [4 /*yield*/, res.json()];
        case 4:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
function fetchOpenAiFileContent(params) {
  return __awaiter(this, void 0, void 0, function () {
    var baseUrl, res, text;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          baseUrl = getOpenAiBaseUrl(params.openAi);
          return [
            4 /*yield*/,
            fetch("".concat(baseUrl, "/files/").concat(params.fileId, "/content"), {
              headers: getOpenAiHeaders(params.openAi, { json: true }),
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
            "openai batch file content failed: ".concat(res.status, " ").concat(text),
          );
        case 3:
          return [4 /*yield*/, res.text()];
        case 4:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
function parseOpenAiBatchOutput(text) {
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
function readOpenAiBatchError(params) {
  return __awaiter(this, void 0, void 0, function () {
    var content, lines, first, message, err_1, message;
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return __generator(this, function (_j) {
      switch (_j.label) {
        case 0:
          _j.trys.push([0, 2, , 3]);
          return [
            4 /*yield*/,
            fetchOpenAiFileContent({
              openAi: params.openAi,
              fileId: params.errorFileId,
            }),
          ];
        case 1:
          content = _j.sent();
          lines = parseOpenAiBatchOutput(content);
          first = lines.find(function (line) {
            var _a, _b, _c;
            return (
              ((_a = line.error) === null || _a === void 0 ? void 0 : _a.message) ||
              ((_c = (_b = line.response) === null || _b === void 0 ? void 0 : _b.body) === null ||
              _c === void 0
                ? void 0
                : _c.error)
            );
          });
          message =
            (_b =
              (_a = first === null || first === void 0 ? void 0 : first.error) === null ||
              _a === void 0
                ? void 0
                : _a.message) !== null && _b !== void 0
              ? _b
              : typeof ((_e =
                    (_d =
                      (_c = first === null || first === void 0 ? void 0 : first.response) ===
                        null || _c === void 0
                        ? void 0
                        : _c.body) === null || _d === void 0
                      ? void 0
                      : _d.error) === null || _e === void 0
                    ? void 0
                    : _e.message) === "string"
                ? (_h =
                    (_g =
                      (_f = first === null || first === void 0 ? void 0 : first.response) ===
                        null || _f === void 0
                        ? void 0
                        : _f.body) === null || _g === void 0
                      ? void 0
                      : _g.error) === null || _h === void 0
                  ? void 0
                  : _h.message
                : undefined;
          return [2 /*return*/, message];
        case 2:
          err_1 = _j.sent();
          message = err_1 instanceof Error ? err_1.message : String(err_1);
          return [2 /*return*/, message ? "error file unavailable: ".concat(message) : undefined];
        case 3:
          return [2 /*return*/];
      }
    });
  });
}
function waitForOpenAiBatch(params) {
  return __awaiter(this, void 0, void 0, function () {
    var start, current, status_1, _a, state, detail, _b, suffix;
    var _c, _d, _e;
    return __generator(this, function (_f) {
      switch (_f.label) {
        case 0:
          start = Date.now();
          current = params.initial;
          _f.label = 1;
        case 1:
          if (!true) {
            return [3 /*break*/, 10];
          }
          if (!(current !== null && current !== void 0)) {
            return [3 /*break*/, 2];
          }
          _a = current;
          return [3 /*break*/, 4];
        case 2:
          return [
            4 /*yield*/,
            fetchOpenAiBatchStatus({
              openAi: params.openAi,
              batchId: params.batchId,
            }),
          ];
        case 3:
          _a = _f.sent();
          _f.label = 4;
        case 4:
          status_1 = _a;
          state = (_c = status_1.status) !== null && _c !== void 0 ? _c : "unknown";
          if (state === "completed") {
            if (!status_1.output_file_id) {
              throw new Error(
                "openai batch ".concat(params.batchId, " completed without output file"),
              );
            }
            return [
              2 /*return*/,
              {
                outputFileId: status_1.output_file_id,
                errorFileId:
                  (_d = status_1.error_file_id) !== null && _d !== void 0 ? _d : undefined,
              },
            ];
          }
          if (!["failed", "expired", "cancelled", "canceled"].includes(state)) {
            return [3 /*break*/, 8];
          }
          if (!status_1.error_file_id) {
            return [3 /*break*/, 6];
          }
          return [
            4 /*yield*/,
            readOpenAiBatchError({ openAi: params.openAi, errorFileId: status_1.error_file_id }),
          ];
        case 5:
          _b = _f.sent();
          return [3 /*break*/, 7];
        case 6:
          _b = undefined;
          _f.label = 7;
        case 7:
          detail = _b;
          suffix = detail ? ": ".concat(detail) : "";
          throw new Error("openai batch ".concat(params.batchId, " ").concat(state).concat(suffix));
        case 8:
          if (!params.wait) {
            throw new Error(
              "openai batch ".concat(params.batchId, " still ").concat(state, "; wait disabled"),
            );
          }
          if (Date.now() - start > params.timeoutMs) {
            throw new Error(
              "openai batch "
                .concat(params.batchId, " timed out after ")
                .concat(params.timeoutMs, "ms"),
            );
          }
          (_e = params.debug) === null || _e === void 0
            ? void 0
            : _e.call(
                params,
                "openai batch "
                  .concat(params.batchId, " ")
                  .concat(state, "; waiting ")
                  .concat(params.pollIntervalMs, "ms"),
              );
          return [
            4 /*yield*/,
            new Promise(function (resolve) {
              return setTimeout(resolve, params.pollIntervalMs);
            }),
          ];
        case 9:
          _f.sent();
          current = undefined;
          return [3 /*break*/, 1];
        case 10:
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
              var index, _a, _b, err_2;
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
                    err_2 = _c.sent();
                    firstError = err_2;
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
function runOpenAiEmbeddingBatches(params) {
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
          groups = splitOpenAiBatchRequests(params.requests);
          byCustomId = new Map();
          tasks = groups.map(function (group, groupIndex) {
            return function () {
              return __awaiter(_this, void 0, void 0, function () {
                var batchInfo,
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
                  response,
                  statusCode,
                  message,
                  data,
                  embedding;
                var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
                return __generator(this, function (_q) {
                  switch (_q.label) {
                    case 0:
                      return [
                        4 /*yield*/,
                        submitOpenAiBatch({
                          openAi: params.openAi,
                          requests: group,
                          agentId: params.agentId,
                        }),
                      ];
                    case 1:
                      batchInfo = _q.sent();
                      if (!batchInfo.id) {
                        throw new Error("openai batch create failed: missing batch id");
                      }
                      (_b = params.debug) === null || _b === void 0
                        ? void 0
                        : _b.call(params, "memory embeddings: openai batch created", {
                            batchId: batchInfo.id,
                            status: batchInfo.status,
                            group: groupIndex + 1,
                            groups: groups.length,
                            requests: group.length,
                          });
                      if (!params.wait && batchInfo.status !== "completed") {
                        throw new Error(
                          "openai batch ".concat(
                            batchInfo.id,
                            " submitted; enable remote.batch.wait to await completion",
                          ),
                        );
                      }
                      if (!(batchInfo.status === "completed")) {
                        return [3 /*break*/, 2];
                      }
                      _a = {
                        outputFileId:
                          (_c = batchInfo.output_file_id) !== null && _c !== void 0 ? _c : "",
                        errorFileId:
                          (_d = batchInfo.error_file_id) !== null && _d !== void 0 ? _d : undefined,
                      };
                      return [3 /*break*/, 4];
                    case 2:
                      return [
                        4 /*yield*/,
                        waitForOpenAiBatch({
                          openAi: params.openAi,
                          batchId: batchInfo.id,
                          wait: params.wait,
                          pollIntervalMs: params.pollIntervalMs,
                          timeoutMs: params.timeoutMs,
                          debug: params.debug,
                          initial: batchInfo,
                        }),
                      ];
                    case 3:
                      _a = _q.sent();
                      _q.label = 4;
                    case 4:
                      completed = _a;
                      if (!completed.outputFileId) {
                        throw new Error(
                          "openai batch ".concat(batchInfo.id, " completed without output file"),
                        );
                      }
                      return [
                        4 /*yield*/,
                        fetchOpenAiFileContent({
                          openAi: params.openAi,
                          fileId: completed.outputFileId,
                        }),
                      ];
                    case 5:
                      content = _q.sent();
                      outputLines = parseOpenAiBatchOutput(content);
                      errors = [];
                      remaining = new Set(
                        group.map(function (request) {
                          return request.custom_id;
                        }),
                      );
                      for (_i = 0, outputLines_1 = outputLines; _i < outputLines_1.length; _i++) {
                        line = outputLines_1[_i];
                        customId = line.custom_id;
                        if (!customId) {
                          continue;
                        }
                        remaining.delete(customId);
                        if ((_e = line.error) === null || _e === void 0 ? void 0 : _e.message) {
                          errors.push("".concat(customId, ": ").concat(line.error.message));
                          continue;
                        }
                        response = line.response;
                        statusCode =
                          (_f =
                            response === null || response === void 0
                              ? void 0
                              : response.status_code) !== null && _f !== void 0
                            ? _f
                            : 0;
                        if (statusCode >= 400) {
                          message =
                            (_k =
                              (_j =
                                (_h =
                                  (_g =
                                    response === null || response === void 0
                                      ? void 0
                                      : response.body) === null || _g === void 0
                                    ? void 0
                                    : _g.error) === null || _h === void 0
                                  ? void 0
                                  : _h.message) !== null && _j !== void 0
                                ? _j
                                : typeof (response === null || response === void 0
                                      ? void 0
                                      : response.body) === "string"
                                  ? response.body
                                  : undefined) !== null && _k !== void 0
                              ? _k
                              : "unknown error";
                          errors.push("".concat(customId, ": ").concat(message));
                          continue;
                        }
                        data =
                          (_m =
                            (_l =
                              response === null || response === void 0 ? void 0 : response.body) ===
                              null || _l === void 0
                              ? void 0
                              : _l.data) !== null && _m !== void 0
                            ? _m
                            : [];
                        embedding =
                          (_p =
                            (_o = data[0]) === null || _o === void 0 ? void 0 : _o.embedding) !==
                            null && _p !== void 0
                            ? _p
                            : [];
                        if (embedding.length === 0) {
                          errors.push("".concat(customId, ": empty embedding"));
                          continue;
                        }
                        byCustomId.set(customId, embedding);
                      }
                      if (errors.length > 0) {
                        throw new Error(
                          "openai batch "
                            .concat(batchInfo.id, " failed: ")
                            .concat(errors.join("; ")),
                        );
                      }
                      if (remaining.size > 0) {
                        throw new Error(
                          "openai batch "
                            .concat(batchInfo.id, " missing ")
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
            : _a.call(params, "memory embeddings: openai batch submit", {
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
