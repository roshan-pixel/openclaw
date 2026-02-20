"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listSandboxContainers = listSandboxContainers;
exports.listSandboxBrowsers = listSandboxBrowsers;
exports.removeSandboxContainer = removeSandboxContainer;
exports.removeSandboxBrowserContainer = removeSandboxBrowserContainer;
var bridge_server_js_1 = require("../../browser/bridge-server.js");
var config_js_1 = require("../../config/config.js");
var browser_bridges_js_1 = require("./browser-bridges.js");
var config_js_2 = require("./config.js");
var docker_js_1 = require("./docker.js");
var registry_js_1 = require("./registry.js");
var shared_js_1 = require("./shared.js");
function listSandboxContainers() {
    return __awaiter(this, void 0, void 0, function () {
        var config, registry, results, _i, _a, entry, state, actualImage, result, _b, agentId, configuredImage;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    config = (0, config_js_1.loadConfig)();
                    return [4 /*yield*/, (0, registry_js_1.readRegistry)()];
                case 1:
                    registry = _c.sent();
                    results = [];
                    _i = 0, _a = registry.entries;
                    _c.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 9];
                    entry = _a[_i];
                    return [4 /*yield*/, (0, docker_js_1.dockerContainerState)(entry.containerName)];
                case 3:
                    state = _c.sent();
                    actualImage = entry.image;
                    if (!state.exists) return [3 /*break*/, 7];
                    _c.label = 4;
                case 4:
                    _c.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, (0, docker_js_1.execDocker)(["inspect", "-f", "{{.Config.Image}}", entry.containerName], { allowFailure: true })];
                case 5:
                    result = _c.sent();
                    if (result.code === 0) {
                        actualImage = result.stdout.trim();
                    }
                    return [3 /*break*/, 7];
                case 6:
                    _b = _c.sent();
                    return [3 /*break*/, 7];
                case 7:
                    agentId = (0, shared_js_1.resolveSandboxAgentId)(entry.sessionKey);
                    configuredImage = (0, config_js_2.resolveSandboxConfigForAgent)(config, agentId).docker.image;
                    results.push(__assign(__assign({}, entry), { image: actualImage, running: state.running, imageMatch: actualImage === configuredImage }));
                    _c.label = 8;
                case 8:
                    _i++;
                    return [3 /*break*/, 2];
                case 9: return [2 /*return*/, results];
            }
        });
    });
}
function listSandboxBrowsers() {
    return __awaiter(this, void 0, void 0, function () {
        var config, registry, results, _i, _a, entry, state, actualImage, result, _b, agentId, configuredImage;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    config = (0, config_js_1.loadConfig)();
                    return [4 /*yield*/, (0, registry_js_1.readBrowserRegistry)()];
                case 1:
                    registry = _c.sent();
                    results = [];
                    _i = 0, _a = registry.entries;
                    _c.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 9];
                    entry = _a[_i];
                    return [4 /*yield*/, (0, docker_js_1.dockerContainerState)(entry.containerName)];
                case 3:
                    state = _c.sent();
                    actualImage = entry.image;
                    if (!state.exists) return [3 /*break*/, 7];
                    _c.label = 4;
                case 4:
                    _c.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, (0, docker_js_1.execDocker)(["inspect", "-f", "{{.Config.Image}}", entry.containerName], { allowFailure: true })];
                case 5:
                    result = _c.sent();
                    if (result.code === 0) {
                        actualImage = result.stdout.trim();
                    }
                    return [3 /*break*/, 7];
                case 6:
                    _b = _c.sent();
                    return [3 /*break*/, 7];
                case 7:
                    agentId = (0, shared_js_1.resolveSandboxAgentId)(entry.sessionKey);
                    configuredImage = (0, config_js_2.resolveSandboxConfigForAgent)(config, agentId).browser.image;
                    results.push(__assign(__assign({}, entry), { image: actualImage, running: state.running, imageMatch: actualImage === configuredImage }));
                    _c.label = 8;
                case 8:
                    _i++;
                    return [3 /*break*/, 2];
                case 9: return [2 /*return*/, results];
            }
        });
    });
}
function removeSandboxContainer(containerName) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, docker_js_1.execDocker)(["rm", "-f", containerName], { allowFailure: true })];
                case 1:
                    _b.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = _b.sent();
                    return [3 /*break*/, 3];
                case 3: return [4 /*yield*/, (0, registry_js_1.removeRegistryEntry)(containerName)];
                case 4:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function removeSandboxBrowserContainer(containerName) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _i, _b, _c, sessionKey, bridge;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, docker_js_1.execDocker)(["rm", "-f", containerName], { allowFailure: true })];
                case 1:
                    _d.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = _d.sent();
                    return [3 /*break*/, 3];
                case 3: return [4 /*yield*/, (0, registry_js_1.removeBrowserRegistryEntry)(containerName)];
                case 4:
                    _d.sent();
                    _i = 0, _b = browser_bridges_js_1.BROWSER_BRIDGES.entries();
                    _d.label = 5;
                case 5:
                    if (!(_i < _b.length)) return [3 /*break*/, 8];
                    _c = _b[_i], sessionKey = _c[0], bridge = _c[1];
                    if (!(bridge.containerName === containerName)) return [3 /*break*/, 7];
                    return [4 /*yield*/, (0, bridge_server_js_1.stopBrowserBridgeServer)(bridge.bridge.server).catch(function () { return undefined; })];
                case 6:
                    _d.sent();
                    browser_bridges_js_1.BROWSER_BRIDGES.delete(sessionKey);
                    _d.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 5];
                case 8: return [2 /*return*/];
            }
        });
    });
}
