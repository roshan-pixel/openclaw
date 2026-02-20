"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAgentStart = handleAgentStart;
exports.handleAutoCompactionStart = handleAutoCompactionStart;
exports.handleAutoCompactionEnd = handleAutoCompactionEnd;
exports.handleAgentEnd = handleAgentEnd;
var agent_events_js_1 = require("../infra/agent-events.js");
var code_spans_js_1 = require("../markdown/code-spans.js");
function handleAgentStart(ctx) {
    var _a, _b;
    ctx.log.debug("embedded run agent start: runId=".concat(ctx.params.runId));
    (0, agent_events_js_1.emitAgentEvent)({
        runId: ctx.params.runId,
        stream: "lifecycle",
        data: {
            phase: "start",
            startedAt: Date.now(),
        },
    });
    void ((_b = (_a = ctx.params).onAgentEvent) === null || _b === void 0 ? void 0 : _b.call(_a, {
        stream: "lifecycle",
        data: { phase: "start" },
    }));
}
function handleAutoCompactionStart(ctx) {
    var _a, _b;
    ctx.state.compactionInFlight = true;
    ctx.ensureCompactionPromise();
    ctx.log.debug("embedded run compaction start: runId=".concat(ctx.params.runId));
    (0, agent_events_js_1.emitAgentEvent)({
        runId: ctx.params.runId,
        stream: "compaction",
        data: { phase: "start" },
    });
    void ((_b = (_a = ctx.params).onAgentEvent) === null || _b === void 0 ? void 0 : _b.call(_a, {
        stream: "compaction",
        data: { phase: "start" },
    }));
}
function handleAutoCompactionEnd(ctx, evt) {
    var _a, _b;
    ctx.state.compactionInFlight = false;
    var willRetry = Boolean(evt.willRetry);
    if (willRetry) {
        ctx.noteCompactionRetry();
        ctx.resetForCompactionRetry();
        ctx.log.debug("embedded run compaction retry: runId=".concat(ctx.params.runId));
    }
    else {
        ctx.maybeResolveCompactionWait();
    }
    (0, agent_events_js_1.emitAgentEvent)({
        runId: ctx.params.runId,
        stream: "compaction",
        data: { phase: "end", willRetry: willRetry },
    });
    void ((_b = (_a = ctx.params).onAgentEvent) === null || _b === void 0 ? void 0 : _b.call(_a, {
        stream: "compaction",
        data: { phase: "end", willRetry: willRetry },
    }));
}
function handleAgentEnd(ctx) {
    var _a, _b, _c;
    ctx.log.debug("embedded run agent end: runId=".concat(ctx.params.runId));
    (0, agent_events_js_1.emitAgentEvent)({
        runId: ctx.params.runId,
        stream: "lifecycle",
        data: {
            phase: "end",
            endedAt: Date.now(),
        },
    });
    void ((_b = (_a = ctx.params).onAgentEvent) === null || _b === void 0 ? void 0 : _b.call(_a, {
        stream: "lifecycle",
        data: { phase: "end" },
    }));
    if (ctx.params.onBlockReply) {
        if ((_c = ctx.blockChunker) === null || _c === void 0 ? void 0 : _c.hasBuffered()) {
            ctx.blockChunker.drain({ force: true, emit: ctx.emitBlockChunk });
            ctx.blockChunker.reset();
        }
        else if (ctx.state.blockBuffer.length > 0) {
            ctx.emitBlockChunk(ctx.state.blockBuffer);
            ctx.state.blockBuffer = "";
        }
    }
    ctx.state.blockState.thinking = false;
    ctx.state.blockState.final = false;
    ctx.state.blockState.inlineCode = (0, code_spans_js_1.createInlineCodeState)();
    if (ctx.state.pendingCompactionRetry > 0) {
        ctx.resolveCompactionRetry();
    }
    else {
        ctx.maybeResolveCompactionWait();
    }
}
