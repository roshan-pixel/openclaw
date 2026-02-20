"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.anthropicProvider = void 0;
var image_js_1 = require("../image.js");
exports.anthropicProvider = {
    id: "anthropic",
    capabilities: ["image"],
    describeImage: image_js_1.describeImageWithModel,
};
