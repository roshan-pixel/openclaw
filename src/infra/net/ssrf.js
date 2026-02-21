"use strict";
var __extends =
  (this && this.__extends) ||
  (function () {
    var extendStatics = function (d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (d, b) {
            d.__proto__ = b;
          }) ||
        function (d, b) {
          for (var p in b) {
            if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
          }
        };
      return extendStatics(d, b);
    };
    return function (d, b) {
      if (typeof b !== "function" && b !== null) {
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      }
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
    };
  })();
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
exports.SsrFBlockedError = void 0;
exports.isPrivateIpAddress = isPrivateIpAddress;
exports.isBlockedHostname = isBlockedHostname;
exports.createPinnedLookup = createPinnedLookup;
exports.resolvePinnedHostname = resolvePinnedHostname;
exports.createPinnedDispatcher = createPinnedDispatcher;
exports.closeDispatcher = closeDispatcher;
exports.assertPublicHostname = assertPublicHostname;
var promises_1 = require("node:dns/promises");
var node_dns_1 = require("node:dns");
var undici_1 = require("undici");
var SsrFBlockedError = /** @class */ (function (_super) {
  __extends(SsrFBlockedError, _super);
  function SsrFBlockedError(message) {
    var _this = _super.call(this, message) || this;
    _this.name = "SsrFBlockedError";
    return _this;
  }
  return SsrFBlockedError;
})(Error);
exports.SsrFBlockedError = SsrFBlockedError;
var PRIVATE_IPV6_PREFIXES = ["fe80:", "fec0:", "fc", "fd"];
var BLOCKED_HOSTNAMES = new Set(["localhost", "metadata.google.internal"]);
function normalizeHostname(hostname) {
  var normalized = hostname.trim().toLowerCase().replace(/\.$/, "");
  if (normalized.startsWith("[") && normalized.endsWith("]")) {
    return normalized.slice(1, -1);
  }
  return normalized;
}
function parseIpv4(address) {
  var parts = address.split(".");
  if (parts.length !== 4) {
    return null;
  }
  var numbers = parts.map(function (part) {
    return Number.parseInt(part, 10);
  });
  if (
    numbers.some(function (value) {
      return Number.isNaN(value) || value < 0 || value > 255;
    })
  ) {
    return null;
  }
  return numbers;
}
function parseIpv4FromMappedIpv6(mapped) {
  if (mapped.includes(".")) {
    return parseIpv4(mapped);
  }
  var parts = mapped.split(":").filter(Boolean);
  if (parts.length === 1) {
    var value_1 = Number.parseInt(parts[0], 16);
    if (Number.isNaN(value_1) || value_1 < 0 || value_1 > 4294967295) {
      return null;
    }
    return [
      (value_1 >>> 24) & 0xff,
      (value_1 >>> 16) & 0xff,
      (value_1 >>> 8) & 0xff,
      value_1 & 0xff,
    ];
  }
  if (parts.length !== 2) {
    return null;
  }
  var high = Number.parseInt(parts[0], 16);
  var low = Number.parseInt(parts[1], 16);
  if (
    Number.isNaN(high) ||
    Number.isNaN(low) ||
    high < 0 ||
    low < 0 ||
    high > 0xffff ||
    low > 0xffff
  ) {
    return null;
  }
  var value = (high << 16) + low;
  return [(value >>> 24) & 0xff, (value >>> 16) & 0xff, (value >>> 8) & 0xff, value & 0xff];
}
function isPrivateIpv4(parts) {
  var octet1 = parts[0],
    octet2 = parts[1];
  if (octet1 === 0) {
    return true;
  }
  if (octet1 === 10) {
    return true;
  }
  if (octet1 === 127) {
    return true;
  }
  if (octet1 === 169 && octet2 === 254) {
    return true;
  }
  if (octet1 === 172 && octet2 >= 16 && octet2 <= 31) {
    return true;
  }
  if (octet1 === 192 && octet2 === 168) {
    return true;
  }
  if (octet1 === 100 && octet2 >= 64 && octet2 <= 127) {
    return true;
  }
  return false;
}
function isPrivateIpAddress(address) {
  var normalized = address.trim().toLowerCase();
  if (normalized.startsWith("[") && normalized.endsWith("]")) {
    normalized = normalized.slice(1, -1);
  }
  if (!normalized) {
    return false;
  }
  if (normalized.startsWith("::ffff:")) {
    var mapped = normalized.slice("::ffff:".length);
    var ipv4_1 = parseIpv4FromMappedIpv6(mapped);
    if (ipv4_1) {
      return isPrivateIpv4(ipv4_1);
    }
  }
  if (normalized.includes(":")) {
    if (normalized === "::" || normalized === "::1") {
      return true;
    }
    return PRIVATE_IPV6_PREFIXES.some(function (prefix) {
      return normalized.startsWith(prefix);
    });
  }
  var ipv4 = parseIpv4(normalized);
  if (!ipv4) {
    return false;
  }
  return isPrivateIpv4(ipv4);
}
function isBlockedHostname(hostname) {
  var normalized = normalizeHostname(hostname);
  if (!normalized) {
    return false;
  }
  if (BLOCKED_HOSTNAMES.has(normalized)) {
    return true;
  }
  return (
    normalized.endsWith(".localhost") ||
    normalized.endsWith(".local") ||
    normalized.endsWith(".internal")
  );
}
function createPinnedLookup(params) {
  var _a;
  var normalizedHost = normalizeHostname(params.hostname);
  var fallback = (_a = params.fallback) !== null && _a !== void 0 ? _a : node_dns_1.lookup;
  var fallbackLookup = fallback;
  var fallbackWithOptions = fallback;
  var records = params.addresses.map(function (address) {
    return {
      address: address,
      family: address.includes(":") ? 6 : 4,
    };
  });
  var index = 0;
  return function (host, options, callback) {
    var cb = typeof options === "function" ? options : callback;
    if (!cb) {
      return;
    }
    var normalized = normalizeHostname(host);
    if (!normalized || normalized !== normalizedHost) {
      if (typeof options === "function" || options === undefined) {
        return fallbackLookup(host, cb);
      }
      return fallbackWithOptions(host, options, cb);
    }
    var opts = typeof options === "object" && options !== null ? options : {};
    var requestedFamily =
      typeof options === "number" ? options : typeof opts.family === "number" ? opts.family : 0;
    var candidates =
      requestedFamily === 4 || requestedFamily === 6
        ? records.filter(function (entry) {
            return entry.family === requestedFamily;
          })
        : records;
    var usable = candidates.length > 0 ? candidates : records;
    if (opts.all) {
      cb(null, usable);
      return;
    }
    var chosen = usable[index % usable.length];
    index += 1;
    cb(null, chosen.address, chosen.family);
  };
}
function resolvePinnedHostname(hostname_1) {
  return __awaiter(this, arguments, void 0, function (hostname, lookupFn) {
    var normalized, results, _i, results_1, entry, addresses;
    if (lookupFn === void 0) {
      lookupFn = promises_1.lookup;
    }
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          normalized = normalizeHostname(hostname);
          if (!normalized) {
            throw new Error("Invalid hostname");
          }
          if (isBlockedHostname(normalized)) {
            throw new SsrFBlockedError("Blocked hostname: ".concat(hostname));
          }
          if (isPrivateIpAddress(normalized)) {
            throw new SsrFBlockedError("Blocked: private/internal IP address");
          }
          return [4 /*yield*/, lookupFn(normalized, { all: true })];
        case 1:
          results = _a.sent();
          if (results.length === 0) {
            throw new Error("Unable to resolve hostname: ".concat(hostname));
          }
          for (_i = 0, results_1 = results; _i < results_1.length; _i++) {
            entry = results_1[_i];
            if (isPrivateIpAddress(entry.address)) {
              throw new SsrFBlockedError("Blocked: resolves to private/internal IP address");
            }
          }
          addresses = Array.from(
            new Set(
              results.map(function (entry) {
                return entry.address;
              }),
            ),
          );
          if (addresses.length === 0) {
            throw new Error("Unable to resolve hostname: ".concat(hostname));
          }
          return [
            2 /*return*/,
            {
              hostname: normalized,
              addresses: addresses,
              lookup: createPinnedLookup({ hostname: normalized, addresses: addresses }),
            },
          ];
      }
    });
  });
}
function createPinnedDispatcher(pinned) {
  return new undici_1.Agent({
    connect: {
      lookup: pinned.lookup,
    },
  });
}
function closeDispatcher(dispatcher) {
  return __awaiter(this, void 0, void 0, function () {
    var candidate, _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          if (!dispatcher) {
            return [2 /*return*/];
          }
          candidate = dispatcher;
          _b.label = 1;
        case 1:
          _b.trys.push([1, 4, , 5]);
          if (!(typeof candidate.close === "function")) {
            return [3 /*break*/, 3];
          }
          return [4 /*yield*/, candidate.close()];
        case 2:
          _b.sent();
          return [2 /*return*/];
        case 3:
          if (typeof candidate.destroy === "function") {
            candidate.destroy();
          }
          return [3 /*break*/, 5];
        case 4:
          _a = _b.sent();
          return [3 /*break*/, 5];
        case 5:
          return [2 /*return*/];
      }
    });
  });
}
function assertPublicHostname(hostname_1) {
  return __awaiter(this, arguments, void 0, function (hostname, lookupFn) {
    if (lookupFn === void 0) {
      lookupFn = promises_1.lookup;
    }
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, resolvePinnedHostname(hostname, lookupFn)];
        case 1:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
}
