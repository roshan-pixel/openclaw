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
exports.getHeadersWithAuth = exports.fetchOk = exports.fetchJson = exports.appendCdpPath = void 0;
exports.normalizeCdpWsUrl = normalizeCdpWsUrl;
exports.captureScreenshotPng = captureScreenshotPng;
exports.captureScreenshot = captureScreenshot;
exports.createTargetViaCdp = createTargetViaCdp;
exports.evaluateJavaScript = evaluateJavaScript;
exports.formatAriaSnapshot = formatAriaSnapshot;
exports.snapshotAria = snapshotAria;
exports.snapshotDom = snapshotDom;
exports.getDomText = getDomText;
exports.querySelector = querySelector;
var cdp_helpers_js_1 = require("./cdp.helpers.js");
var cdp_helpers_js_2 = require("./cdp.helpers.js");
Object.defineProperty(exports, "appendCdpPath", {
  enumerable: true,
  get: function () {
    return cdp_helpers_js_2.appendCdpPath;
  },
});
Object.defineProperty(exports, "fetchJson", {
  enumerable: true,
  get: function () {
    return cdp_helpers_js_2.fetchJson;
  },
});
Object.defineProperty(exports, "fetchOk", {
  enumerable: true,
  get: function () {
    return cdp_helpers_js_2.fetchOk;
  },
});
Object.defineProperty(exports, "getHeadersWithAuth", {
  enumerable: true,
  get: function () {
    return cdp_helpers_js_2.getHeadersWithAuth;
  },
});
function normalizeCdpWsUrl(wsUrl, cdpUrl) {
  var ws = new URL(wsUrl);
  var cdp = new URL(cdpUrl);
  if (
    (0, cdp_helpers_js_1.isLoopbackHost)(ws.hostname) &&
    !(0, cdp_helpers_js_1.isLoopbackHost)(cdp.hostname)
  ) {
    ws.hostname = cdp.hostname;
    var cdpPort = cdp.port || (cdp.protocol === "https:" ? "443" : "80");
    if (cdpPort) {
      ws.port = cdpPort;
    }
    ws.protocol = cdp.protocol === "https:" ? "wss:" : "ws:";
  }
  if (cdp.protocol === "https:" && ws.protocol === "ws:") {
    ws.protocol = "wss:";
  }
  if (!ws.username && !ws.password && (cdp.username || cdp.password)) {
    ws.username = cdp.username;
    ws.password = cdp.password;
  }
  for (var _i = 0, _a = cdp.searchParams.entries(); _i < _a.length; _i++) {
    var _b = _a[_i],
      key = _b[0],
      value = _b[1];
    if (!ws.searchParams.has(key)) {
      ws.searchParams.append(key, value);
    }
  }
  return ws.toString();
}
function captureScreenshotPng(opts) {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            captureScreenshot({
              wsUrl: opts.wsUrl,
              fullPage: opts.fullPage,
              format: "png",
            }),
          ];
        case 1:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
function captureScreenshot(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var _this = this;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            (0, cdp_helpers_js_1.withCdpSocket)(opts.wsUrl, function (send) {
              return __awaiter(_this, void 0, void 0, function () {
                var clip, metrics, size, width, height, format, quality, result, base64;
                var _a, _b, _c, _d, _e;
                return __generator(this, function (_f) {
                  switch (_f.label) {
                    case 0:
                      return [4 /*yield*/, send("Page.enable")];
                    case 1:
                      _f.sent();
                      if (!opts.fullPage) {
                        return [3 /*break*/, 3];
                      }
                      return [4 /*yield*/, send("Page.getLayoutMetrics")];
                    case 2:
                      metrics = _f.sent();
                      size =
                        (_a =
                          metrics === null || metrics === void 0
                            ? void 0
                            : metrics.cssContentSize) !== null && _a !== void 0
                          ? _a
                          : metrics === null || metrics === void 0
                            ? void 0
                            : metrics.contentSize;
                      width = Number(
                        (_b = size === null || size === void 0 ? void 0 : size.width) !== null &&
                          _b !== void 0
                          ? _b
                          : 0,
                      );
                      height = Number(
                        (_c = size === null || size === void 0 ? void 0 : size.height) !== null &&
                          _c !== void 0
                          ? _c
                          : 0,
                      );
                      if (width > 0 && height > 0) {
                        clip = { x: 0, y: 0, width: width, height: height, scale: 1 };
                      }
                      _f.label = 3;
                    case 3:
                      format = (_d = opts.format) !== null && _d !== void 0 ? _d : "png";
                      quality =
                        format === "jpeg"
                          ? Math.max(
                              0,
                              Math.min(
                                100,
                                Math.round((_e = opts.quality) !== null && _e !== void 0 ? _e : 85),
                              ),
                            )
                          : undefined;
                      return [
                        4 /*yield*/,
                        send(
                          "Page.captureScreenshot",
                          __assign(
                            __assign(
                              __assign(
                                { format: format },
                                quality !== undefined ? { quality: quality } : {},
                              ),
                              { fromSurface: true, captureBeyondViewport: true },
                            ),
                            clip ? { clip: clip } : {},
                          ),
                        ),
                      ];
                    case 4:
                      result = _f.sent();
                      base64 = result === null || result === void 0 ? void 0 : result.data;
                      if (!base64) {
                        throw new Error("Screenshot failed: missing data");
                      }
                      return [2 /*return*/, Buffer.from(base64, "base64")];
                  }
                });
              });
            }),
          ];
        case 1:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
function createTargetViaCdp(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var version, wsUrlRaw, wsUrl;
    var _this = this;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          return [
            4 /*yield*/,
            (0, cdp_helpers_js_1.fetchJson)(
              (0, cdp_helpers_js_1.appendCdpPath)(opts.cdpUrl, "/json/version"),
              1500,
            ),
          ];
        case 1:
          version = _b.sent();
          wsUrlRaw = String(
            (_a =
              version === null || version === void 0 ? void 0 : version.webSocketDebuggerUrl) !==
              null && _a !== void 0
              ? _a
              : "",
          ).trim();
          wsUrl = wsUrlRaw ? normalizeCdpWsUrl(wsUrlRaw, opts.cdpUrl) : "";
          if (!wsUrl) {
            throw new Error("CDP /json/version missing webSocketDebuggerUrl");
          }
          return [
            4 /*yield*/,
            (0, cdp_helpers_js_1.withCdpSocket)(wsUrl, function (send) {
              return __awaiter(_this, void 0, void 0, function () {
                var created, targetId;
                var _a;
                return __generator(this, function (_b) {
                  switch (_b.label) {
                    case 0:
                      return [4 /*yield*/, send("Target.createTarget", { url: opts.url })];
                    case 1:
                      created = _b.sent();
                      targetId = String(
                        (_a =
                          created === null || created === void 0 ? void 0 : created.targetId) !==
                          null && _a !== void 0
                          ? _a
                          : "",
                      ).trim();
                      if (!targetId) {
                        throw new Error("CDP Target.createTarget returned no targetId");
                      }
                      return [2 /*return*/, { targetId: targetId }];
                  }
                });
              });
            }),
          ];
        case 2:
          return [2 /*return*/, _b.sent()];
      }
    });
  });
}
function evaluateJavaScript(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var _this = this;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            (0, cdp_helpers_js_1.withCdpSocket)(opts.wsUrl, function (send) {
              return __awaiter(_this, void 0, void 0, function () {
                var evaluated, result;
                var _a;
                return __generator(this, function (_b) {
                  switch (_b.label) {
                    case 0:
                      return [4 /*yield*/, send("Runtime.enable").catch(function () {})];
                    case 1:
                      _b.sent();
                      return [
                        4 /*yield*/,
                        send("Runtime.evaluate", {
                          expression: opts.expression,
                          awaitPromise: Boolean(opts.awaitPromise),
                          returnByValue:
                            (_a = opts.returnByValue) !== null && _a !== void 0 ? _a : true,
                          userGesture: true,
                          includeCommandLineAPI: true,
                        }),
                      ];
                    case 2:
                      evaluated = _b.sent();
                      result =
                        evaluated === null || evaluated === void 0 ? void 0 : evaluated.result;
                      if (!result) {
                        throw new Error("CDP Runtime.evaluate returned no result");
                      }
                      return [
                        2 /*return*/,
                        { result: result, exceptionDetails: evaluated.exceptionDetails },
                      ];
                  }
                });
              });
            }),
          ];
        case 1:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
function axValue(v) {
  if (!v || typeof v !== "object") {
    return "";
  }
  var value = v.value;
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return "";
}
function formatAriaSnapshot(nodes, limit) {
  var _a, _b, _c;
  var byId = new Map();
  for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
    var n = nodes_1[_i];
    if (n.nodeId) {
      byId.set(n.nodeId, n);
    }
  }
  // Heuristic: pick a root-ish node (one that is not referenced as a child), else first.
  var referenced = new Set();
  for (var _d = 0, nodes_2 = nodes; _d < nodes_2.length; _d++) {
    var n = nodes_2[_d];
    for (
      var _e = 0, _f = (_a = n.childIds) !== null && _a !== void 0 ? _a : [];
      _e < _f.length;
      _e++
    ) {
      var c = _f[_e];
      referenced.add(c);
    }
  }
  var root =
    (_b = nodes.find(function (n) {
      return n.nodeId && !referenced.has(n.nodeId);
    })) !== null && _b !== void 0
      ? _b
      : nodes[0];
  if (!(root === null || root === void 0 ? void 0 : root.nodeId)) {
    return [];
  }
  var out = [];
  var stack = [{ id: root.nodeId, depth: 0 }];
  while (stack.length && out.length < limit) {
    var popped = stack.pop();
    if (!popped) {
      break;
    }
    var id = popped.id,
      depth = popped.depth;
    var n = byId.get(id);
    if (!n) {
      continue;
    }
    var role = axValue(n.role);
    var name_1 = axValue(n.name);
    var value = axValue(n.value);
    var description = axValue(n.description);
    var ref = "ax".concat(out.length + 1);
    out.push(
      __assign(
        __assign(
          __assign(
            __assign(
              { ref: ref, role: role || "unknown", name: name_1 || "" },
              value ? { value: value } : {},
            ),
            description ? { description: description } : {},
          ),
          typeof n.backendDOMNodeId === "number" ? { backendDOMNodeId: n.backendDOMNodeId } : {},
        ),
        { depth: depth },
      ),
    );
    var children = ((_c = n.childIds) !== null && _c !== void 0 ? _c : []).filter(function (c) {
      return byId.has(c);
    });
    for (var i = children.length - 1; i >= 0; i--) {
      var child = children[i];
      if (child) {
        stack.push({ id: child, depth: depth + 1 });
      }
    }
  }
  return out;
}
function snapshotAria(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var limit;
    var _this = this;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          limit = Math.max(
            1,
            Math.min(2000, Math.floor((_a = opts.limit) !== null && _a !== void 0 ? _a : 500)),
          );
          return [
            4 /*yield*/,
            (0, cdp_helpers_js_1.withCdpSocket)(opts.wsUrl, function (send) {
              return __awaiter(_this, void 0, void 0, function () {
                var res, nodes;
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      return [4 /*yield*/, send("Accessibility.enable").catch(function () {})];
                    case 1:
                      _a.sent();
                      return [4 /*yield*/, send("Accessibility.getFullAXTree")];
                    case 2:
                      res = _a.sent();
                      nodes = Array.isArray(res === null || res === void 0 ? void 0 : res.nodes)
                        ? res.nodes
                        : [];
                      return [2 /*return*/, { nodes: formatAriaSnapshot(nodes, limit) }];
                  }
                });
              });
            }),
          ];
        case 1:
          return [2 /*return*/, _b.sent()];
      }
    });
  });
}
function snapshotDom(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var limit, maxTextChars, expression, evaluated, value, nodes;
    var _a, _b, _c;
    return __generator(this, function (_d) {
      switch (_d.label) {
        case 0:
          limit = Math.max(
            1,
            Math.min(5000, Math.floor((_a = opts.limit) !== null && _a !== void 0 ? _a : 800)),
          );
          maxTextChars = Math.max(
            0,
            Math.min(
              5000,
              Math.floor((_b = opts.maxTextChars) !== null && _b !== void 0 ? _b : 220),
            ),
          );
          expression = "(() => {\n    const maxNodes = "
            .concat(JSON.stringify(limit), ";\n    const maxText = ")
            .concat(
              JSON.stringify(maxTextChars),
              ';\n    const nodes = [];\n    const root = document.documentElement;\n    if (!root) return { nodes };\n    const stack = [{ el: root, depth: 0, parentRef: null }];\n    while (stack.length && nodes.length < maxNodes) {\n      const cur = stack.pop();\n      const el = cur.el;\n      if (!el || el.nodeType !== 1) continue;\n      const ref = "n" + String(nodes.length + 1);\n      const tag = (el.tagName || "").toLowerCase();\n      const id = el.id ? String(el.id) : undefined;\n      const className = el.className ? String(el.className).slice(0, 300) : undefined;\n      const role = el.getAttribute && el.getAttribute("role") ? String(el.getAttribute("role")) : undefined;\n      const name = el.getAttribute && el.getAttribute("aria-label") ? String(el.getAttribute("aria-label")) : undefined;\n      let text = "";\n      try { text = String(el.innerText || "").trim(); } catch {}\n      if (maxText && text.length > maxText) text = text.slice(0, maxText) + "\u2026";\n      const href = (el.href !== undefined && el.href !== null) ? String(el.href) : undefined;\n      const type = (el.type !== undefined && el.type !== null) ? String(el.type) : undefined;\n      const value = (el.value !== undefined && el.value !== null) ? String(el.value).slice(0, 500) : undefined;\n      nodes.push({\n        ref,\n        parentRef: cur.parentRef,\n        depth: cur.depth,\n        tag,\n        ...(id ? { id } : {}),\n        ...(className ? { className } : {}),\n        ...(role ? { role } : {}),\n        ...(name ? { name } : {}),\n        ...(text ? { text } : {}),\n        ...(href ? { href } : {}),\n        ...(type ? { type } : {}),\n        ...(value ? { value } : {}),\n      });\n      const children = el.children ? Array.from(el.children) : [];\n      for (let i = children.length - 1; i >= 0; i--) {\n        stack.push({ el: children[i], depth: cur.depth + 1, parentRef: ref });\n      }\n    }\n    return { nodes };\n  })()',
            );
          return [
            4 /*yield*/,
            evaluateJavaScript({
              wsUrl: opts.wsUrl,
              expression: expression,
              awaitPromise: true,
              returnByValue: true,
            }),
          ];
        case 1:
          evaluated = _d.sent();
          value = (_c = evaluated.result) === null || _c === void 0 ? void 0 : _c.value;
          if (!value || typeof value !== "object") {
            return [2 /*return*/, { nodes: [] }];
          }
          nodes = value.nodes;
          return [2 /*return*/, { nodes: Array.isArray(nodes) ? nodes : [] }];
      }
    });
  });
}
function getDomText(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var maxChars, selectorExpr, expression, evaluated, textValue, text;
    var _a, _b, _c;
    return __generator(this, function (_d) {
      switch (_d.label) {
        case 0:
          maxChars = Math.max(
            0,
            Math.min(
              5000000,
              Math.floor((_a = opts.maxChars) !== null && _a !== void 0 ? _a : 200000),
            ),
          );
          selectorExpr = opts.selector ? JSON.stringify(opts.selector) : "null";
          expression = "(() => {\n    const fmt = "
            .concat(JSON.stringify(opts.format), ";\n    const max = ")
            .concat(JSON.stringify(maxChars), ";\n    const sel = ")
            .concat(
              selectorExpr,
              ';\n    const pick = sel ? document.querySelector(sel) : null;\n    let out = "";\n    if (fmt === "text") {\n      const el = pick || document.body || document.documentElement;\n      try { out = String(el && el.innerText ? el.innerText : ""); } catch { out = ""; }\n    } else {\n      const el = pick || document.documentElement;\n      try { out = String(el && el.outerHTML ? el.outerHTML : ""); } catch { out = ""; }\n    }\n    if (max && out.length > max) out = out.slice(0, max) + "\\n<!-- \u2026truncated\u2026 -->";\n    return out;\n  })()',
            );
          return [
            4 /*yield*/,
            evaluateJavaScript({
              wsUrl: opts.wsUrl,
              expression: expression,
              awaitPromise: true,
              returnByValue: true,
            }),
          ];
        case 1:
          evaluated = _d.sent();
          textValue =
            (_c = (_b = evaluated.result) === null || _b === void 0 ? void 0 : _b.value) !== null &&
            _c !== void 0
              ? _c
              : "";
          text =
            typeof textValue === "string"
              ? textValue
              : typeof textValue === "number" || typeof textValue === "boolean"
                ? String(textValue)
                : "";
          return [2 /*return*/, { text: text }];
      }
    });
  });
}
function querySelector(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var limit, maxText, maxHtml, expression, evaluated, matches;
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
      switch (_e.label) {
        case 0:
          limit = Math.max(
            1,
            Math.min(200, Math.floor((_a = opts.limit) !== null && _a !== void 0 ? _a : 20)),
          );
          maxText = Math.max(
            0,
            Math.min(
              5000,
              Math.floor((_b = opts.maxTextChars) !== null && _b !== void 0 ? _b : 500),
            ),
          );
          maxHtml = Math.max(
            0,
            Math.min(
              20000,
              Math.floor((_c = opts.maxHtmlChars) !== null && _c !== void 0 ? _c : 1500),
            ),
          );
          expression = "(() => {\n    const sel = "
            .concat(JSON.stringify(opts.selector), ";\n    const lim = ")
            .concat(JSON.stringify(limit), ";\n    const maxText = ")
            .concat(JSON.stringify(maxText), ";\n    const maxHtml = ")
            .concat(
              JSON.stringify(maxHtml),
              ';\n    const els = Array.from(document.querySelectorAll(sel)).slice(0, lim);\n    return els.map((el, i) => {\n      const tag = (el.tagName || "").toLowerCase();\n      const id = el.id ? String(el.id) : undefined;\n      const className = el.className ? String(el.className).slice(0, 300) : undefined;\n      let text = "";\n      try { text = String(el.innerText || "").trim(); } catch {}\n      if (maxText && text.length > maxText) text = text.slice(0, maxText) + "\u2026";\n      const value = (el.value !== undefined && el.value !== null) ? String(el.value).slice(0, 500) : undefined;\n      const href = (el.href !== undefined && el.href !== null) ? String(el.href) : undefined;\n      let outerHTML = "";\n      try { outerHTML = String(el.outerHTML || ""); } catch {}\n      if (maxHtml && outerHTML.length > maxHtml) outerHTML = outerHTML.slice(0, maxHtml) + "\u2026";\n      return {\n        index: i + 1,\n        tag,\n        ...(id ? { id } : {}),\n        ...(className ? { className } : {}),\n        ...(text ? { text } : {}),\n        ...(value ? { value } : {}),\n        ...(href ? { href } : {}),\n        ...(outerHTML ? { outerHTML } : {}),\n      };\n    });\n  })()',
            );
          return [
            4 /*yield*/,
            evaluateJavaScript({
              wsUrl: opts.wsUrl,
              expression: expression,
              awaitPromise: true,
              returnByValue: true,
            }),
          ];
        case 1:
          evaluated = _e.sent();
          matches = (_d = evaluated.result) === null || _d === void 0 ? void 0 : _d.value;
          return [2 /*return*/, { matches: Array.isArray(matches) ? matches : [] }];
      }
    });
  });
}
