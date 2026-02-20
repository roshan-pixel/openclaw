"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReplyPrefixContext = createReplyPrefixContext;
var identity_js_1 = require("../agents/identity.js");
var response_prefix_template_js_1 = require("../auto-reply/reply/response-prefix-template.js");
function createReplyPrefixContext(params) {
    var cfg = params.cfg, agentId = params.agentId;
    var prefixContext = {
        identityName: (0, identity_js_1.resolveIdentityName)(cfg, agentId),
    };
    var onModelSelected = function (ctx) {
        var _a;
        // Mutate the object directly instead of reassigning to ensure closures see updates.
        prefixContext.provider = ctx.provider;
        prefixContext.model = (0, response_prefix_template_js_1.extractShortModelName)(ctx.model);
        prefixContext.modelFull = "".concat(ctx.provider, "/").concat(ctx.model);
        prefixContext.thinkingLevel = (_a = ctx.thinkLevel) !== null && _a !== void 0 ? _a : "off";
    };
    return {
        prefixContext: prefixContext,
        responsePrefix: (0, identity_js_1.resolveEffectiveMessagesConfig)(cfg, agentId).responsePrefix,
        responsePrefixContextProvider: function () { return prefixContext; },
        onModelSelected: onModelSelected,
    };
}
