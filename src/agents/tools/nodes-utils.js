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
exports.listNodes = listNodes;
exports.resolveNodeIdFromList = resolveNodeIdFromList;
exports.resolveNodeId = resolveNodeId;
var gateway_js_1 = require("./gateway.js");
function parseNodeList(value) {
  var obj = typeof value === "object" && value !== null ? value : {};
  return Array.isArray(obj.nodes) ? obj.nodes : [];
}
function parsePairingList(value) {
  var obj = typeof value === "object" && value !== null ? value : {};
  var pending = Array.isArray(obj.pending) ? obj.pending : [];
  var paired = Array.isArray(obj.paired) ? obj.paired : [];
  return { pending: pending, paired: paired };
}
function normalizeNodeKey(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}
function loadNodes(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var res, _a, res, paired;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          _b.trys.push([0, 2, , 4]);
          return [4 /*yield*/, (0, gateway_js_1.callGatewayTool)("node.list", opts, {})];
        case 1:
          res = _b.sent();
          return [2 /*return*/, parseNodeList(res)];
        case 2:
          _a = _b.sent();
          return [4 /*yield*/, (0, gateway_js_1.callGatewayTool)("node.pair.list", opts, {})];
        case 3:
          res = _b.sent();
          paired = parsePairingList(res).paired;
          return [
            2 /*return*/,
            paired.map(function (n) {
              return {
                nodeId: n.nodeId,
                displayName: n.displayName,
                platform: n.platform,
                remoteIp: n.remoteIp,
              };
            }),
          ];
        case 4:
          return [2 /*return*/];
      }
    });
  });
}
function pickDefaultNode(nodes) {
  var withCanvas = nodes.filter(function (n) {
    return Array.isArray(n.caps) ? n.caps.includes("canvas") : true;
  });
  if (withCanvas.length === 0) {
    return null;
  }
  var connected = withCanvas.filter(function (n) {
    return n.connected;
  });
  var candidates = connected.length > 0 ? connected : withCanvas;
  if (candidates.length === 1) {
    return candidates[0];
  }
  var local = candidates.filter(function (n) {
    var _a;
    return (
      ((_a = n.platform) === null || _a === void 0 ? void 0 : _a.toLowerCase().startsWith("mac")) &&
      typeof n.nodeId === "string" &&
      n.nodeId.startsWith("mac-")
    );
  });
  if (local.length === 1) {
    return local[0];
  }
  return null;
}
function listNodes(opts) {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      return [2 /*return*/, loadNodes(opts)];
    });
  });
}
function resolveNodeIdFromList(nodes, query, allowDefault) {
  if (allowDefault === void 0) {
    allowDefault = false;
  }
  var q = String(query !== null && query !== void 0 ? query : "").trim();
  if (!q) {
    if (allowDefault) {
      var picked = pickDefaultNode(nodes);
      if (picked) {
        return picked.nodeId;
      }
    }
    throw new Error("node required");
  }
  var qNorm = normalizeNodeKey(q);
  var matches = nodes.filter(function (n) {
    if (n.nodeId === q) {
      return true;
    }
    if (typeof n.remoteIp === "string" && n.remoteIp === q) {
      return true;
    }
    var name = typeof n.displayName === "string" ? n.displayName : "";
    if (name && normalizeNodeKey(name) === qNorm) {
      return true;
    }
    if (q.length >= 6 && n.nodeId.startsWith(q)) {
      return true;
    }
    return false;
  });
  if (matches.length === 1) {
    return matches[0].nodeId;
  }
  if (matches.length === 0) {
    var known = nodes
      .map(function (n) {
        return n.displayName || n.remoteIp || n.nodeId;
      })
      .filter(Boolean)
      .join(", ");
    throw new Error("unknown node: ".concat(q).concat(known ? " (known: ".concat(known, ")") : ""));
  }
  throw new Error(
    "ambiguous node: ".concat(q, " (matches: ").concat(
      matches
        .map(function (n) {
          return n.displayName || n.remoteIp || n.nodeId;
        })
        .join(", "),
      ")",
    ),
  );
}
function resolveNodeId(opts_1, query_1) {
  return __awaiter(this, arguments, void 0, function (opts, query, allowDefault) {
    var nodes;
    if (allowDefault === void 0) {
      allowDefault = false;
    }
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, loadNodes(opts)];
        case 1:
          nodes = _a.sent();
          return [2 /*return*/, resolveNodeIdFromList(nodes, query, allowDefault)];
      }
    });
  });
}
