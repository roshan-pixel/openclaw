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
exports.loadGatewayTlsRuntime = loadGatewayTlsRuntime;
var node_child_process_1 = require("node:child_process");
var node_crypto_1 = require("node:crypto");
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var node_util_1 = require("node:util");
var utils_js_1 = require("../../utils.js");
var fingerprint_js_1 = require("./fingerprint.js");
var execFileAsync = (0, node_util_1.promisify)(node_child_process_1.execFile);
function fileExists(filePath) {
  return __awaiter(this, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          _b.trys.push([0, 2, , 3]);
          return [4 /*yield*/, promises_1.default.access(filePath)];
        case 1:
          _b.sent();
          return [2 /*return*/, true];
        case 2:
          _a = _b.sent();
          return [2 /*return*/, false];
        case 3:
          return [2 /*return*/];
      }
    });
  });
}
function generateSelfSignedCert(params) {
  return __awaiter(this, void 0, void 0, function () {
    var certDir, keyDir;
    var _a, _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          certDir = node_path_1.default.dirname(params.certPath);
          keyDir = node_path_1.default.dirname(params.keyPath);
          return [4 /*yield*/, (0, utils_js_1.ensureDir)(certDir)];
        case 1:
          _c.sent();
          if (!(keyDir !== certDir)) {
            return [3 /*break*/, 3];
          }
          return [4 /*yield*/, (0, utils_js_1.ensureDir)(keyDir)];
        case 2:
          _c.sent();
          _c.label = 3;
        case 3:
          return [
            4 /*yield*/,
            execFileAsync("openssl", [
              "req",
              "-x509",
              "-newkey",
              "rsa:2048",
              "-sha256",
              "-days",
              "3650",
              "-nodes",
              "-keyout",
              params.keyPath,
              "-out",
              params.certPath,
              "-subj",
              "/CN=openclaw-gateway",
            ]),
          ];
        case 4:
          _c.sent();
          return [4 /*yield*/, promises_1.default.chmod(params.keyPath, 384).catch(function () {})];
        case 5:
          _c.sent();
          return [
            4 /*yield*/,
            promises_1.default.chmod(params.certPath, 384).catch(function () {}),
          ];
        case 6:
          _c.sent();
          (_b = (_a = params.log) === null || _a === void 0 ? void 0 : _a.info) === null ||
          _b === void 0
            ? void 0
            : _b.call(
                _a,
                "gateway tls: generated self-signed cert at ".concat(
                  (0, utils_js_1.shortenHomeInString)(params.certPath),
                ),
              );
          return [2 /*return*/];
      }
    });
  });
}
function loadGatewayTlsRuntime(cfg, log) {
  return __awaiter(this, void 0, void 0, function () {
    var autoGenerate,
      baseDir,
      certPath,
      keyPath,
      caPath,
      hasCert,
      hasKey,
      err_1,
      _a,
      cert,
      key,
      ca,
      _b,
      x509,
      fingerprintSha256,
      err_2;
    var _c, _d, _e;
    return __generator(this, function (_f) {
      switch (_f.label) {
        case 0:
          if (!cfg || cfg.enabled !== true) {
            return [2 /*return*/, { enabled: false, required: false }];
          }
          autoGenerate = cfg.autoGenerate !== false;
          baseDir = node_path_1.default.join(utils_js_1.CONFIG_DIR, "gateway", "tls");
          certPath = (0, utils_js_1.resolveUserPath)(
            (_c = cfg.certPath) !== null && _c !== void 0
              ? _c
              : node_path_1.default.join(baseDir, "gateway-cert.pem"),
          );
          keyPath = (0, utils_js_1.resolveUserPath)(
            (_d = cfg.keyPath) !== null && _d !== void 0
              ? _d
              : node_path_1.default.join(baseDir, "gateway-key.pem"),
          );
          caPath = cfg.caPath ? (0, utils_js_1.resolveUserPath)(cfg.caPath) : undefined;
          return [4 /*yield*/, fileExists(certPath)];
        case 1:
          hasCert = _f.sent();
          return [4 /*yield*/, fileExists(keyPath)];
        case 2:
          hasKey = _f.sent();
          if (!(!hasCert && !hasKey && autoGenerate)) {
            return [3 /*break*/, 6];
          }
          _f.label = 3;
        case 3:
          _f.trys.push([3, 5, , 6]);
          return [
            4 /*yield*/,
            generateSelfSignedCert({ certPath: certPath, keyPath: keyPath, log: log }),
          ];
        case 4:
          _f.sent();
          return [3 /*break*/, 6];
        case 5:
          err_1 = _f.sent();
          return [
            2 /*return*/,
            {
              enabled: false,
              required: true,
              certPath: certPath,
              keyPath: keyPath,
              error: "gateway tls: failed to generate cert (".concat(String(err_1), ")"),
            },
          ];
        case 6:
          return [4 /*yield*/, fileExists(certPath)];
        case 7:
          _a = !_f.sent();
          if (_a) {
            return [3 /*break*/, 9];
          }
          return [4 /*yield*/, fileExists(keyPath)];
        case 8:
          _a = !_f.sent();
          _f.label = 9;
        case 9:
          if (_a) {
            return [
              2 /*return*/,
              {
                enabled: false,
                required: true,
                certPath: certPath,
                keyPath: keyPath,
                error: "gateway tls: cert/key missing",
              },
            ];
          }
          _f.label = 10;
        case 10:
          _f.trys.push([10, 16, , 17]);
          return [4 /*yield*/, promises_1.default.readFile(certPath, "utf8")];
        case 11:
          cert = _f.sent();
          return [4 /*yield*/, promises_1.default.readFile(keyPath, "utf8")];
        case 12:
          key = _f.sent();
          if (!caPath) {
            return [3 /*break*/, 14];
          }
          return [4 /*yield*/, promises_1.default.readFile(caPath, "utf8")];
        case 13:
          _b = _f.sent();
          return [3 /*break*/, 15];
        case 14:
          _b = undefined;
          _f.label = 15;
        case 15:
          ca = _b;
          x509 = new node_crypto_1.X509Certificate(cert);
          fingerprintSha256 = (0, fingerprint_js_1.normalizeFingerprint)(
            (_e = x509.fingerprint256) !== null && _e !== void 0 ? _e : "",
          );
          if (!fingerprintSha256) {
            return [
              2 /*return*/,
              {
                enabled: false,
                required: true,
                certPath: certPath,
                keyPath: keyPath,
                caPath: caPath,
                error: "gateway tls: unable to compute certificate fingerprint",
              },
            ];
          }
          return [
            2 /*return*/,
            {
              enabled: true,
              required: true,
              certPath: certPath,
              keyPath: keyPath,
              caPath: caPath,
              fingerprintSha256: fingerprintSha256,
              tlsOptions: {
                cert: cert,
                key: key,
                ca: ca,
                minVersion: "TLSv1.2",
              },
            },
          ];
        case 16:
          err_2 = _f.sent();
          return [
            2 /*return*/,
            {
              enabled: false,
              required: true,
              certPath: certPath,
              keyPath: keyPath,
              caPath: caPath,
              error: "gateway tls: failed to load cert (".concat(String(err_2), ")"),
            },
          ];
        case 17:
          return [2 /*return*/];
      }
    });
  });
}
