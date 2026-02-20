"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LEGACY_CONFIG_MIGRATIONS = void 0;
var legacy_migrations_part_1_js_1 = require("./legacy.migrations.part-1.js");
var legacy_migrations_part_2_js_1 = require("./legacy.migrations.part-2.js");
var legacy_migrations_part_3_js_1 = require("./legacy.migrations.part-3.js");
exports.LEGACY_CONFIG_MIGRATIONS = __spreadArray(__spreadArray(__spreadArray([], legacy_migrations_part_1_js_1.LEGACY_CONFIG_MIGRATIONS_PART_1, true), legacy_migrations_part_2_js_1.LEGACY_CONFIG_MIGRATIONS_PART_2, true), legacy_migrations_part_3_js_1.LEGACY_CONFIG_MIGRATIONS_PART_3, true);
