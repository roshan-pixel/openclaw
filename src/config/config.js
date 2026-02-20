"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenClawSchema = exports.validateConfigObjectWithPlugins = exports.validateConfigObject = exports.migrateLegacyConfig = exports.writeConfigFile = exports.resolveConfigSnapshotHash = exports.readConfigFileSnapshot = exports.parseConfigJson5 = exports.loadConfig = exports.createConfigIO = void 0;
var io_js_1 = require("./io.js");
Object.defineProperty(exports, "createConfigIO", { enumerable: true, get: function () { return io_js_1.createConfigIO; } });
Object.defineProperty(exports, "loadConfig", { enumerable: true, get: function () { return io_js_1.loadConfig; } });
Object.defineProperty(exports, "parseConfigJson5", { enumerable: true, get: function () { return io_js_1.parseConfigJson5; } });
Object.defineProperty(exports, "readConfigFileSnapshot", { enumerable: true, get: function () { return io_js_1.readConfigFileSnapshot; } });
Object.defineProperty(exports, "resolveConfigSnapshotHash", { enumerable: true, get: function () { return io_js_1.resolveConfigSnapshotHash; } });
Object.defineProperty(exports, "writeConfigFile", { enumerable: true, get: function () { return io_js_1.writeConfigFile; } });
var legacy_migrate_js_1 = require("./legacy-migrate.js");
Object.defineProperty(exports, "migrateLegacyConfig", { enumerable: true, get: function () { return legacy_migrate_js_1.migrateLegacyConfig; } });
__exportStar(require("./paths.js"), exports);
__exportStar(require("./runtime-overrides.js"), exports);
__exportStar(require("./types.js"), exports);
var validation_js_1 = require("./validation.js");
Object.defineProperty(exports, "validateConfigObject", { enumerable: true, get: function () { return validation_js_1.validateConfigObject; } });
Object.defineProperty(exports, "validateConfigObjectWithPlugins", { enumerable: true, get: function () { return validation_js_1.validateConfigObjectWithPlugins; } });
var zod_schema_js_1 = require("./zod-schema.js");
Object.defineProperty(exports, "OpenClawSchema", { enumerable: true, get: function () { return zod_schema_js_1.OpenClawSchema; } });
