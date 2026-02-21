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
exports.webAuthExists =
  exports.WA_WEB_AUTH_DIR =
  exports.readWebSelfId =
  exports.pickWebChannel =
  exports.logWebSelfId =
  exports.logoutWeb =
  exports.getWebAuthAgeMs =
    void 0;
exports.createWaSocket = createWaSocket;
exports.waitForWaConnection = waitForWaConnection;
exports.getStatusCode = getStatusCode;
exports.formatError = formatError;
exports.newConnectionId = newConnectionId;
var node_crypto_1 = require("node:crypto");
var node_fs_1 = require("node:fs");
var baileys_1 = require("@whiskeysockets/baileys");
var qrcode_terminal_1 = require("qrcode-terminal");
var globals_js_1 = require("../globals.js");
var logging_js_1 = require("../logging.js");
var utils_js_1 = require("../utils.js");
var version_js_1 = require("../version.js");
var command_format_js_1 = require("../cli/command-format.js");
var auth_store_js_1 = require("./auth-store.js");
var auth_store_js_2 = require("./auth-store.js");
Object.defineProperty(exports, "getWebAuthAgeMs", {
  enumerable: true,
  get: function () {
    return auth_store_js_2.getWebAuthAgeMs;
  },
});
Object.defineProperty(exports, "logoutWeb", {
  enumerable: true,
  get: function () {
    return auth_store_js_2.logoutWeb;
  },
});
Object.defineProperty(exports, "logWebSelfId", {
  enumerable: true,
  get: function () {
    return auth_store_js_2.logWebSelfId;
  },
});
Object.defineProperty(exports, "pickWebChannel", {
  enumerable: true,
  get: function () {
    return auth_store_js_2.pickWebChannel;
  },
});
Object.defineProperty(exports, "readWebSelfId", {
  enumerable: true,
  get: function () {
    return auth_store_js_2.readWebSelfId;
  },
});
Object.defineProperty(exports, "WA_WEB_AUTH_DIR", {
  enumerable: true,
  get: function () {
    return auth_store_js_2.WA_WEB_AUTH_DIR;
  },
});
Object.defineProperty(exports, "webAuthExists", {
  enumerable: true,
  get: function () {
    return auth_store_js_2.webAuthExists;
  },
});
var credsSaveQueue = Promise.resolve();
function enqueueSaveCreds(authDir, saveCreds, logger) {
  credsSaveQueue = credsSaveQueue
    .then(function () {
      return safeSaveCreds(authDir, saveCreds, logger);
    })
    .catch(function (err) {
      logger.warn({ error: String(err) }, "WhatsApp creds save queue error");
    });
}
function readCredsJsonRaw(filePath) {
  try {
    if (!node_fs_1.default.existsSync(filePath)) {
      return null;
    }
    var stats = node_fs_1.default.statSync(filePath);
    if (!stats.isFile() || stats.size <= 1) {
      return null;
    }
    return node_fs_1.default.readFileSync(filePath, "utf-8");
  } catch (_a) {
    return null;
  }
}
function safeSaveCreds(authDir, saveCreds, logger) {
  return __awaiter(this, void 0, void 0, function () {
    var credsPath, backupPath, raw, err_1;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          try {
            credsPath = (0, auth_store_js_1.resolveWebCredsPath)(authDir);
            backupPath = (0, auth_store_js_1.resolveWebCredsBackupPath)(authDir);
            raw = readCredsJsonRaw(credsPath);
            if (raw) {
              try {
                JSON.parse(raw);
                node_fs_1.default.copyFileSync(credsPath, backupPath);
              } catch (_b) {
                // keep existing backup
              }
            }
          } catch (_c) {
            // ignore backup failures
          }
          _a.label = 1;
        case 1:
          _a.trys.push([1, 3, , 4]);
          return [4 /*yield*/, Promise.resolve(saveCreds())];
        case 2:
          _a.sent();
          return [3 /*break*/, 4];
        case 3:
          err_1 = _a.sent();
          logger.warn({ error: String(err_1) }, "failed saving WhatsApp creds");
          return [3 /*break*/, 4];
        case 4:
          return [2 /*return*/];
      }
    });
  });
}
/**
 * Create a Baileys socket backed by the multi-file auth store we keep on disk.
 * Consumers can opt into QR printing for interactive login flows.
 */
function createWaSocket(printQr_1, verbose_1) {
  return __awaiter(this, arguments, void 0, function (printQr, verbose, opts) {
    var baseLogger, logger, authDir, sessionLogger, _a, state, saveCreds, version, sock;
    var _b;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          baseLogger = (0, logging_js_1.getChildLogger)(
            { module: "baileys" },
            {
              level: verbose ? "info" : "silent",
            },
          );
          logger = (0, logging_js_1.toPinoLikeLogger)(baseLogger, verbose ? "info" : "silent");
          authDir = (0, utils_js_1.resolveUserPath)(
            (_b = opts.authDir) !== null && _b !== void 0
              ? _b
              : (0, auth_store_js_1.resolveDefaultWebAuthDir)(),
          );
          return [4 /*yield*/, (0, utils_js_1.ensureDir)(authDir)];
        case 1:
          _c.sent();
          sessionLogger = (0, logging_js_1.getChildLogger)({ module: "web-session" });
          (0, auth_store_js_1.maybeRestoreCredsFromBackup)(authDir);
          return [4 /*yield*/, (0, baileys_1.useMultiFileAuthState)(authDir)];
        case 2:
          ((_a = _c.sent()), (state = _a.state), (saveCreds = _a.saveCreds));
          return [4 /*yield*/, (0, baileys_1.fetchLatestBaileysVersion)()];
        case 3:
          version = _c.sent().version;
          sock = (0, baileys_1.makeWASocket)({
            auth: {
              creds: state.creds,
              keys: (0, baileys_1.makeCacheableSignalKeyStore)(state.keys, logger),
            },
            version: version,
            logger: logger,
            printQRInTerminal: false,
            browser: ["openclaw", "cli", version_js_1.VERSION],
            syncFullHistory: false,
            markOnlineOnConnect: false,
          });
          sock.ev.on("creds.update", function () {
            return enqueueSaveCreds(authDir, saveCreds, sessionLogger);
          });
          sock.ev.on("connection.update", function (update) {
            var _a;
            try {
              var connection = update.connection,
                lastDisconnect = update.lastDisconnect,
                qr = update.qr;
              if (qr) {
                (_a = opts.onQr) === null || _a === void 0 ? void 0 : _a.call(opts, qr);
                if (printQr) {
                  console.log("Scan this QR in WhatsApp (Linked Devices):");
                  qrcode_terminal_1.default.generate(qr, { small: true });
                }
              }
              if (connection === "close") {
                var status_1 = getStatusCode(
                  lastDisconnect === null || lastDisconnect === void 0
                    ? void 0
                    : lastDisconnect.error,
                );
                if (status_1 === baileys_1.DisconnectReason.loggedOut) {
                  console.error(
                    (0, globals_js_1.danger)(
                      "WhatsApp session logged out. Run: ".concat(
                        (0, command_format_js_1.formatCliCommand)("openclaw channels login"),
                      ),
                    ),
                  );
                }
              }
              if (connection === "open" && verbose) {
                console.log((0, globals_js_1.success)("WhatsApp Web connected."));
              }
            } catch (err) {
              sessionLogger.error({ error: String(err) }, "connection.update handler error");
            }
          });
          // Handle WebSocket-level errors to prevent unhandled exceptions from crashing the process
          if (sock.ws && typeof sock.ws.on === "function") {
            sock.ws.on("error", function (err) {
              sessionLogger.error({ error: String(err) }, "WebSocket error");
            });
          }
          return [2 /*return*/, sock];
      }
    });
  });
}
function waitForWaConnection(sock) {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      return [
        2 /*return*/,
        new Promise(function (resolve, reject) {
          var evWithOff = sock.ev;
          var handler = function () {
            var _a, _b, _c, _d;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
              args[_i] = arguments[_i];
            }
            var update = (_a = args[0]) !== null && _a !== void 0 ? _a : {};
            if (update.connection === "open") {
              (_b = evWithOff.off) === null || _b === void 0
                ? void 0
                : _b.call(evWithOff, "connection.update", handler);
              resolve();
            }
            if (update.connection === "close") {
              (_c = evWithOff.off) === null || _c === void 0
                ? void 0
                : _c.call(evWithOff, "connection.update", handler);
              reject(
                (_d = update.lastDisconnect) !== null && _d !== void 0
                  ? _d
                  : new Error("Connection closed"),
              );
            }
          };
          sock.ev.on("connection.update", handler);
        }),
      ];
    });
  });
}
function getStatusCode(err) {
  var _a, _b;
  return (_b =
    (_a = err === null || err === void 0 ? void 0 : err.output) === null || _a === void 0
      ? void 0
      : _a.statusCode) !== null && _b !== void 0
    ? _b
    : err === null || err === void 0
      ? void 0
      : err.status;
}
function safeStringify(value, limit) {
  if (limit === void 0) {
    limit = 800;
  }
  try {
    var seen_1 = new WeakSet();
    var raw = JSON.stringify(
      value,
      function (_key, v) {
        if (typeof v === "bigint") {
          return v.toString();
        }
        if (typeof v === "function") {
          var maybeName = v.name;
          var name_1 =
            typeof maybeName === "string" && maybeName.length > 0 ? maybeName : "anonymous";
          return "[Function ".concat(name_1, "]");
        }
        if (typeof v === "object" && v) {
          if (seen_1.has(v)) {
            return "[Circular]";
          }
          seen_1.add(v);
        }
        return v;
      },
      2,
    );
    if (!raw) {
      return String(value);
    }
    return raw.length > limit ? "".concat(raw.slice(0, limit), "\u2026") : raw;
  } catch (_a) {
    return String(value);
  }
}
function extractBoomDetails(err) {
  if (!err || typeof err !== "object") {
    return null;
  }
  var output = err === null || err === void 0 ? void 0 : err.output;
  if (!output || typeof output !== "object") {
    return null;
  }
  var payload = output.payload;
  var statusCode =
    typeof output.statusCode === "number"
      ? output.statusCode
      : typeof (payload === null || payload === void 0 ? void 0 : payload.statusCode) === "number"
        ? payload.statusCode
        : undefined;
  var error =
    typeof (payload === null || payload === void 0 ? void 0 : payload.error) === "string"
      ? payload.error
      : undefined;
  var message =
    typeof (payload === null || payload === void 0 ? void 0 : payload.message) === "string"
      ? payload.message
      : undefined;
  if (!statusCode && !error && !message) {
    return null;
  }
  return { statusCode: statusCode, error: error, message: message };
}
function formatError(err) {
  var _a, _b, _c, _d, _e, _f;
  if (err instanceof Error) {
    return err.message;
  }
  if (typeof err === "string") {
    return err;
  }
  if (!err || typeof err !== "object") {
    return String(err);
  }
  // Baileys frequently wraps errors under `error` with a Boom-like shape.
  var boom =
    (_b =
      (_a = extractBoomDetails(err)) !== null && _a !== void 0
        ? _a
        : extractBoomDetails(err === null || err === void 0 ? void 0 : err.error)) !== null &&
    _b !== void 0
      ? _b
      : extractBoomDetails(
          (_c = err === null || err === void 0 ? void 0 : err.lastDisconnect) === null ||
            _c === void 0
            ? void 0
            : _c.error,
        );
  var status =
    (_d = boom === null || boom === void 0 ? void 0 : boom.statusCode) !== null && _d !== void 0
      ? _d
      : getStatusCode(err);
  var code = err === null || err === void 0 ? void 0 : err.code;
  var codeText = typeof code === "string" || typeof code === "number" ? String(code) : undefined;
  var messageCandidates = [
    boom === null || boom === void 0 ? void 0 : boom.message,
    typeof (err === null || err === void 0 ? void 0 : err.message) === "string"
      ? err.message
      : undefined,
    typeof ((_e = err === null || err === void 0 ? void 0 : err.error) === null || _e === void 0
      ? void 0
      : _e.message) === "string"
      ? (_f = err.error) === null || _f === void 0
        ? void 0
        : _f.message
      : undefined,
  ].filter(function (v) {
    return Boolean(v && v.trim().length > 0);
  });
  var message = messageCandidates[0];
  var pieces = [];
  if (typeof status === "number") {
    pieces.push("status=".concat(status));
  }
  if (boom === null || boom === void 0 ? void 0 : boom.error) {
    pieces.push(boom.error);
  }
  if (message) {
    pieces.push(message);
  }
  if (codeText) {
    pieces.push("code=".concat(codeText));
  }
  if (pieces.length > 0) {
    return pieces.join(" ");
  }
  return safeStringify(err);
}
function newConnectionId() {
  return (0, node_crypto_1.randomUUID)();
}
