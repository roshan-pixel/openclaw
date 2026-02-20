"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.minimaxProvider = void 0;
var image_js_1 = require("../image.js");
exports.minimaxProvider = {
    id: "minimax",
    capabilities: ["image"],
    describeImage: image_js_1.describeImageWithModel,
};
