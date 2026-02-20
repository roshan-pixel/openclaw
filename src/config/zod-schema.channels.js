"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelHeartbeatVisibilitySchema = void 0;
var zod_1 = require("zod");
exports.ChannelHeartbeatVisibilitySchema = zod_1.z
    .object({
    showOk: zod_1.z.boolean().optional(),
    showAlerts: zod_1.z.boolean().optional(),
    useIndicator: zod_1.z.boolean().optional(),
})
    .strict()
    .optional();
