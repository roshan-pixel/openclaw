"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCronUpdateParams =
  exports.validateCronAddParams =
  exports.validateCronStatusParams =
  exports.validateCronListParams =
  exports.validateSkillsUpdateParams =
  exports.validateSkillsInstallParams =
  exports.validateSkillsBinsParams =
  exports.validateSkillsStatusParams =
  exports.validateModelsListParams =
  exports.validateChannelsLogoutParams =
  exports.validateChannelsStatusParams =
  exports.validateTalkModeParams =
  exports.validateWizardStatusParams =
  exports.validateWizardCancelParams =
  exports.validateWizardNextParams =
  exports.validateWizardStartParams =
  exports.validateConfigSchemaParams =
  exports.validateConfigPatchParams =
  exports.validateConfigApplyParams =
  exports.validateConfigSetParams =
  exports.validateConfigGetParams =
  exports.validateSessionsCompactParams =
  exports.validateSessionsDeleteParams =
  exports.validateSessionsResetParams =
  exports.validateSessionsPatchParams =
  exports.validateSessionsResolveParams =
  exports.validateSessionsPreviewParams =
  exports.validateSessionsListParams =
  exports.validateNodeEventParams =
  exports.validateNodeInvokeResultParams =
  exports.validateNodeInvokeParams =
  exports.validateNodeDescribeParams =
  exports.validateNodeListParams =
  exports.validateNodeRenameParams =
  exports.validateNodePairVerifyParams =
  exports.validateNodePairRejectParams =
  exports.validateNodePairApproveParams =
  exports.validateNodePairListParams =
  exports.validateNodePairRequestParams =
  exports.validateAgentsListParams =
  exports.validateWakeParams =
  exports.validateAgentWaitParams =
  exports.validateAgentIdentityParams =
  exports.validateAgentParams =
  exports.validatePollParams =
  exports.validateSendParams =
  exports.validateEventFrame =
  exports.validateResponseFrame =
  exports.validateRequestFrame =
  exports.validateConnectParams =
    void 0;
exports.SessionsPreviewParamsSchema =
  exports.SessionsListParamsSchema =
  exports.NodeInvokeParamsSchema =
  exports.NodeListParamsSchema =
  exports.NodePairVerifyParamsSchema =
  exports.NodePairRejectParamsSchema =
  exports.NodePairApproveParamsSchema =
  exports.NodePairListParamsSchema =
  exports.NodePairRequestParamsSchema =
  exports.WakeParamsSchema =
  exports.AgentIdentityResultSchema =
  exports.AgentIdentityParamsSchema =
  exports.AgentParamsSchema =
  exports.PollParamsSchema =
  exports.SendParamsSchema =
  exports.ChatEventSchema =
  exports.AgentEventSchema =
  exports.StateVersionSchema =
  exports.ErrorShapeSchema =
  exports.SnapshotSchema =
  exports.PresenceEntrySchema =
  exports.GatewayFrameSchema =
  exports.EventFrameSchema =
  exports.ResponseFrameSchema =
  exports.RequestFrameSchema =
  exports.HelloOkSchema =
  exports.ConnectParamsSchema =
  exports.validateWebLoginWaitParams =
  exports.validateWebLoginStartParams =
  exports.validateUpdateRunParams =
  exports.validateChatEvent =
  exports.validateChatInjectParams =
  exports.validateChatAbortParams =
  exports.validateChatSendParams =
  exports.validateChatHistoryParams =
  exports.validateLogsTailParams =
  exports.validateExecApprovalsNodeSetParams =
  exports.validateExecApprovalsNodeGetParams =
  exports.validateExecApprovalResolveParams =
  exports.validateExecApprovalRequestParams =
  exports.validateExecApprovalsSetParams =
  exports.validateExecApprovalsGetParams =
  exports.validateDeviceTokenRevokeParams =
  exports.validateDeviceTokenRotateParams =
  exports.validateDevicePairRejectParams =
  exports.validateDevicePairApproveParams =
  exports.validateDevicePairListParams =
  exports.validateCronRunsParams =
  exports.validateCronRunParams =
  exports.validateCronRemoveParams =
    void 0;
exports.errorShape =
  exports.ErrorCodes =
  exports.PROTOCOL_VERSION =
  exports.ProtocolSchemas =
  exports.ShutdownEventSchema =
  exports.TickEventSchema =
  exports.UpdateRunParamsSchema =
  exports.ChatInjectParamsSchema =
  exports.ChatSendParamsSchema =
  exports.ChatHistoryParamsSchema =
  exports.LogsTailResultSchema =
  exports.LogsTailParamsSchema =
  exports.CronRunsParamsSchema =
  exports.CronRunParamsSchema =
  exports.CronRemoveParamsSchema =
  exports.CronUpdateParamsSchema =
  exports.CronAddParamsSchema =
  exports.CronStatusParamsSchema =
  exports.CronListParamsSchema =
  exports.CronJobSchema =
  exports.SkillsUpdateParamsSchema =
  exports.SkillsInstallParamsSchema =
  exports.SkillsStatusParamsSchema =
  exports.ModelsListParamsSchema =
  exports.AgentsListResultSchema =
  exports.AgentsListParamsSchema =
  exports.AgentSummarySchema =
  exports.WebLoginWaitParamsSchema =
  exports.WebLoginStartParamsSchema =
  exports.ChannelsLogoutParamsSchema =
  exports.ChannelsStatusResultSchema =
  exports.ChannelsStatusParamsSchema =
  exports.WizardStatusResultSchema =
  exports.WizardStartResultSchema =
  exports.WizardNextResultSchema =
  exports.WizardStepSchema =
  exports.WizardStatusParamsSchema =
  exports.WizardCancelParamsSchema =
  exports.WizardNextParamsSchema =
  exports.WizardStartParamsSchema =
  exports.ConfigSchemaResponseSchema =
  exports.ConfigSchemaParamsSchema =
  exports.ConfigPatchParamsSchema =
  exports.ConfigApplyParamsSchema =
  exports.ConfigSetParamsSchema =
  exports.ConfigGetParamsSchema =
  exports.SessionsCompactParamsSchema =
  exports.SessionsDeleteParamsSchema =
  exports.SessionsResetParamsSchema =
  exports.SessionsPatchParamsSchema =
    void 0;
exports.formatValidationErrors = formatValidationErrors;
var ajv_1 = require("ajv");
var schema_js_1 = require("./schema.js");
Object.defineProperty(exports, "AgentEventSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.AgentEventSchema;
  },
});
Object.defineProperty(exports, "AgentIdentityParamsSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.AgentIdentityParamsSchema;
  },
});
Object.defineProperty(exports, "AgentIdentityResultSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.AgentIdentityResultSchema;
  },
});
Object.defineProperty(exports, "AgentParamsSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.AgentParamsSchema;
  },
});
Object.defineProperty(exports, "AgentSummarySchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.AgentSummarySchema;
  },
});
Object.defineProperty(exports, "AgentsListParamsSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.AgentsListParamsSchema;
  },
});
Object.defineProperty(exports, "AgentsListResultSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.AgentsListResultSchema;
  },
});
Object.defineProperty(exports, "ChannelsLogoutParamsSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.ChannelsLogoutParamsSchema;
  },
});
Object.defineProperty(exports, "ChannelsStatusParamsSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.ChannelsStatusParamsSchema;
  },
});
Object.defineProperty(exports, "ChannelsStatusResultSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.ChannelsStatusResultSchema;
  },
});
Object.defineProperty(exports, "ChatEventSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.ChatEventSchema;
  },
});
Object.defineProperty(exports, "ChatHistoryParamsSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.ChatHistoryParamsSchema;
  },
});
Object.defineProperty(exports, "ChatInjectParamsSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.ChatInjectParamsSchema;
  },
});
Object.defineProperty(exports, "ChatSendParamsSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.ChatSendParamsSchema;
  },
});
Object.defineProperty(exports, "ConfigApplyParamsSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.ConfigApplyParamsSchema;
  },
});
Object.defineProperty(exports, "ConfigGetParamsSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.ConfigGetParamsSchema;
  },
});
Object.defineProperty(exports, "ConfigPatchParamsSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.ConfigPatchParamsSchema;
  },
});
Object.defineProperty(exports, "ConfigSchemaParamsSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.ConfigSchemaParamsSchema;
  },
});
Object.defineProperty(exports, "ConfigSchemaResponseSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.ConfigSchemaResponseSchema;
  },
});
Object.defineProperty(exports, "ConfigSetParamsSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.ConfigSetParamsSchema;
  },
});
Object.defineProperty(exports, "ConnectParamsSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.ConnectParamsSchema;
  },
});
Object.defineProperty(exports, "CronAddParamsSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.CronAddParamsSchema;
  },
});
Object.defineProperty(exports, "CronJobSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.CronJobSchema;
  },
});
Object.defineProperty(exports, "CronListParamsSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.CronListParamsSchema;
  },
});
Object.defineProperty(exports, "CronRemoveParamsSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.CronRemoveParamsSchema;
  },
});
Object.defineProperty(exports, "CronRunParamsSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.CronRunParamsSchema;
  },
});
Object.defineProperty(exports, "CronRunsParamsSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.CronRunsParamsSchema;
  },
});
Object.defineProperty(exports, "CronStatusParamsSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.CronStatusParamsSchema;
  },
});
Object.defineProperty(exports, "CronUpdateParamsSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.CronUpdateParamsSchema;
  },
});
Object.defineProperty(exports, "ErrorCodes", {
  enumerable: true,
  get: function () {
    return schema_js_1.ErrorCodes;
  },
});
Object.defineProperty(exports, "ErrorShapeSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.ErrorShapeSchema;
  },
});
Object.defineProperty(exports, "EventFrameSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.EventFrameSchema;
  },
});
Object.defineProperty(exports, "errorShape", {
  enumerable: true,
  get: function () {
    return schema_js_1.errorShape;
  },
});
Object.defineProperty(exports, "GatewayFrameSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.GatewayFrameSchema;
  },
});
Object.defineProperty(exports, "HelloOkSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.HelloOkSchema;
  },
});
Object.defineProperty(exports, "LogsTailParamsSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.LogsTailParamsSchema;
  },
});
Object.defineProperty(exports, "LogsTailResultSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.LogsTailResultSchema;
  },
});
Object.defineProperty(exports, "ModelsListParamsSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.ModelsListParamsSchema;
  },
});
Object.defineProperty(exports, "NodeInvokeParamsSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.NodeInvokeParamsSchema;
  },
});
Object.defineProperty(exports, "NodeListParamsSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.NodeListParamsSchema;
  },
});
Object.defineProperty(exports, "NodePairApproveParamsSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.NodePairApproveParamsSchema;
  },
});
Object.defineProperty(exports, "NodePairListParamsSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.NodePairListParamsSchema;
  },
});
Object.defineProperty(exports, "NodePairRejectParamsSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.NodePairRejectParamsSchema;
  },
});
Object.defineProperty(exports, "NodePairRequestParamsSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.NodePairRequestParamsSchema;
  },
});
Object.defineProperty(exports, "NodePairVerifyParamsSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.NodePairVerifyParamsSchema;
  },
});
Object.defineProperty(exports, "PollParamsSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.PollParamsSchema;
  },
});
Object.defineProperty(exports, "PROTOCOL_VERSION", {
  enumerable: true,
  get: function () {
    return schema_js_1.PROTOCOL_VERSION;
  },
});
Object.defineProperty(exports, "PresenceEntrySchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.PresenceEntrySchema;
  },
});
Object.defineProperty(exports, "ProtocolSchemas", {
  enumerable: true,
  get: function () {
    return schema_js_1.ProtocolSchemas;
  },
});
Object.defineProperty(exports, "RequestFrameSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.RequestFrameSchema;
  },
});
Object.defineProperty(exports, "ResponseFrameSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.ResponseFrameSchema;
  },
});
Object.defineProperty(exports, "SendParamsSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.SendParamsSchema;
  },
});
Object.defineProperty(exports, "SessionsCompactParamsSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.SessionsCompactParamsSchema;
  },
});
Object.defineProperty(exports, "SessionsDeleteParamsSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.SessionsDeleteParamsSchema;
  },
});
Object.defineProperty(exports, "SessionsListParamsSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.SessionsListParamsSchema;
  },
});
Object.defineProperty(exports, "SessionsPatchParamsSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.SessionsPatchParamsSchema;
  },
});
Object.defineProperty(exports, "SessionsPreviewParamsSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.SessionsPreviewParamsSchema;
  },
});
Object.defineProperty(exports, "SessionsResetParamsSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.SessionsResetParamsSchema;
  },
});
Object.defineProperty(exports, "ShutdownEventSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.ShutdownEventSchema;
  },
});
Object.defineProperty(exports, "SkillsInstallParamsSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.SkillsInstallParamsSchema;
  },
});
Object.defineProperty(exports, "SkillsStatusParamsSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.SkillsStatusParamsSchema;
  },
});
Object.defineProperty(exports, "SkillsUpdateParamsSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.SkillsUpdateParamsSchema;
  },
});
Object.defineProperty(exports, "SnapshotSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.SnapshotSchema;
  },
});
Object.defineProperty(exports, "StateVersionSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.StateVersionSchema;
  },
});
Object.defineProperty(exports, "TickEventSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.TickEventSchema;
  },
});
Object.defineProperty(exports, "UpdateRunParamsSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.UpdateRunParamsSchema;
  },
});
Object.defineProperty(exports, "WakeParamsSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.WakeParamsSchema;
  },
});
Object.defineProperty(exports, "WebLoginStartParamsSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.WebLoginStartParamsSchema;
  },
});
Object.defineProperty(exports, "WebLoginWaitParamsSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.WebLoginWaitParamsSchema;
  },
});
Object.defineProperty(exports, "WizardCancelParamsSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.WizardCancelParamsSchema;
  },
});
Object.defineProperty(exports, "WizardNextParamsSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.WizardNextParamsSchema;
  },
});
Object.defineProperty(exports, "WizardNextResultSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.WizardNextResultSchema;
  },
});
Object.defineProperty(exports, "WizardStartParamsSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.WizardStartParamsSchema;
  },
});
Object.defineProperty(exports, "WizardStartResultSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.WizardStartResultSchema;
  },
});
Object.defineProperty(exports, "WizardStatusParamsSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.WizardStatusParamsSchema;
  },
});
Object.defineProperty(exports, "WizardStatusResultSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.WizardStatusResultSchema;
  },
});
Object.defineProperty(exports, "WizardStepSchema", {
  enumerable: true,
  get: function () {
    return schema_js_1.WizardStepSchema;
  },
});
var ajv = new ajv_1.default({
  allErrors: true,
  strict: false,
  removeAdditional: false,
});
exports.validateConnectParams = ajv.compile(schema_js_1.ConnectParamsSchema);
exports.validateRequestFrame = ajv.compile(schema_js_1.RequestFrameSchema);
exports.validateResponseFrame = ajv.compile(schema_js_1.ResponseFrameSchema);
exports.validateEventFrame = ajv.compile(schema_js_1.EventFrameSchema);
exports.validateSendParams = ajv.compile(schema_js_1.SendParamsSchema);
exports.validatePollParams = ajv.compile(schema_js_1.PollParamsSchema);
exports.validateAgentParams = ajv.compile(schema_js_1.AgentParamsSchema);
exports.validateAgentIdentityParams = ajv.compile(schema_js_1.AgentIdentityParamsSchema);
exports.validateAgentWaitParams = ajv.compile(schema_js_1.AgentWaitParamsSchema);
exports.validateWakeParams = ajv.compile(schema_js_1.WakeParamsSchema);
exports.validateAgentsListParams = ajv.compile(schema_js_1.AgentsListParamsSchema);
exports.validateNodePairRequestParams = ajv.compile(schema_js_1.NodePairRequestParamsSchema);
exports.validateNodePairListParams = ajv.compile(schema_js_1.NodePairListParamsSchema);
exports.validateNodePairApproveParams = ajv.compile(schema_js_1.NodePairApproveParamsSchema);
exports.validateNodePairRejectParams = ajv.compile(schema_js_1.NodePairRejectParamsSchema);
exports.validateNodePairVerifyParams = ajv.compile(schema_js_1.NodePairVerifyParamsSchema);
exports.validateNodeRenameParams = ajv.compile(schema_js_1.NodeRenameParamsSchema);
exports.validateNodeListParams = ajv.compile(schema_js_1.NodeListParamsSchema);
exports.validateNodeDescribeParams = ajv.compile(schema_js_1.NodeDescribeParamsSchema);
exports.validateNodeInvokeParams = ajv.compile(schema_js_1.NodeInvokeParamsSchema);
exports.validateNodeInvokeResultParams = ajv.compile(schema_js_1.NodeInvokeResultParamsSchema);
exports.validateNodeEventParams = ajv.compile(schema_js_1.NodeEventParamsSchema);
exports.validateSessionsListParams = ajv.compile(schema_js_1.SessionsListParamsSchema);
exports.validateSessionsPreviewParams = ajv.compile(schema_js_1.SessionsPreviewParamsSchema);
exports.validateSessionsResolveParams = ajv.compile(schema_js_1.SessionsResolveParamsSchema);
exports.validateSessionsPatchParams = ajv.compile(schema_js_1.SessionsPatchParamsSchema);
exports.validateSessionsResetParams = ajv.compile(schema_js_1.SessionsResetParamsSchema);
exports.validateSessionsDeleteParams = ajv.compile(schema_js_1.SessionsDeleteParamsSchema);
exports.validateSessionsCompactParams = ajv.compile(schema_js_1.SessionsCompactParamsSchema);
exports.validateConfigGetParams = ajv.compile(schema_js_1.ConfigGetParamsSchema);
exports.validateConfigSetParams = ajv.compile(schema_js_1.ConfigSetParamsSchema);
exports.validateConfigApplyParams = ajv.compile(schema_js_1.ConfigApplyParamsSchema);
exports.validateConfigPatchParams = ajv.compile(schema_js_1.ConfigPatchParamsSchema);
exports.validateConfigSchemaParams = ajv.compile(schema_js_1.ConfigSchemaParamsSchema);
exports.validateWizardStartParams = ajv.compile(schema_js_1.WizardStartParamsSchema);
exports.validateWizardNextParams = ajv.compile(schema_js_1.WizardNextParamsSchema);
exports.validateWizardCancelParams = ajv.compile(schema_js_1.WizardCancelParamsSchema);
exports.validateWizardStatusParams = ajv.compile(schema_js_1.WizardStatusParamsSchema);
exports.validateTalkModeParams = ajv.compile(schema_js_1.TalkModeParamsSchema);
exports.validateChannelsStatusParams = ajv.compile(schema_js_1.ChannelsStatusParamsSchema);
exports.validateChannelsLogoutParams = ajv.compile(schema_js_1.ChannelsLogoutParamsSchema);
exports.validateModelsListParams = ajv.compile(schema_js_1.ModelsListParamsSchema);
exports.validateSkillsStatusParams = ajv.compile(schema_js_1.SkillsStatusParamsSchema);
exports.validateSkillsBinsParams = ajv.compile(schema_js_1.SkillsBinsParamsSchema);
exports.validateSkillsInstallParams = ajv.compile(schema_js_1.SkillsInstallParamsSchema);
exports.validateSkillsUpdateParams = ajv.compile(schema_js_1.SkillsUpdateParamsSchema);
exports.validateCronListParams = ajv.compile(schema_js_1.CronListParamsSchema);
exports.validateCronStatusParams = ajv.compile(schema_js_1.CronStatusParamsSchema);
exports.validateCronAddParams = ajv.compile(schema_js_1.CronAddParamsSchema);
exports.validateCronUpdateParams = ajv.compile(schema_js_1.CronUpdateParamsSchema);
exports.validateCronRemoveParams = ajv.compile(schema_js_1.CronRemoveParamsSchema);
exports.validateCronRunParams = ajv.compile(schema_js_1.CronRunParamsSchema);
exports.validateCronRunsParams = ajv.compile(schema_js_1.CronRunsParamsSchema);
exports.validateDevicePairListParams = ajv.compile(schema_js_1.DevicePairListParamsSchema);
exports.validateDevicePairApproveParams = ajv.compile(schema_js_1.DevicePairApproveParamsSchema);
exports.validateDevicePairRejectParams = ajv.compile(schema_js_1.DevicePairRejectParamsSchema);
exports.validateDeviceTokenRotateParams = ajv.compile(schema_js_1.DeviceTokenRotateParamsSchema);
exports.validateDeviceTokenRevokeParams = ajv.compile(schema_js_1.DeviceTokenRevokeParamsSchema);
exports.validateExecApprovalsGetParams = ajv.compile(schema_js_1.ExecApprovalsGetParamsSchema);
exports.validateExecApprovalsSetParams = ajv.compile(schema_js_1.ExecApprovalsSetParamsSchema);
exports.validateExecApprovalRequestParams = ajv.compile(
  schema_js_1.ExecApprovalRequestParamsSchema,
);
exports.validateExecApprovalResolveParams = ajv.compile(
  schema_js_1.ExecApprovalResolveParamsSchema,
);
exports.validateExecApprovalsNodeGetParams = ajv.compile(
  schema_js_1.ExecApprovalsNodeGetParamsSchema,
);
exports.validateExecApprovalsNodeSetParams = ajv.compile(
  schema_js_1.ExecApprovalsNodeSetParamsSchema,
);
exports.validateLogsTailParams = ajv.compile(schema_js_1.LogsTailParamsSchema);
exports.validateChatHistoryParams = ajv.compile(schema_js_1.ChatHistoryParamsSchema);
exports.validateChatSendParams = ajv.compile(schema_js_1.ChatSendParamsSchema);
exports.validateChatAbortParams = ajv.compile(schema_js_1.ChatAbortParamsSchema);
exports.validateChatInjectParams = ajv.compile(schema_js_1.ChatInjectParamsSchema);
exports.validateChatEvent = ajv.compile(schema_js_1.ChatEventSchema);
exports.validateUpdateRunParams = ajv.compile(schema_js_1.UpdateRunParamsSchema);
exports.validateWebLoginStartParams = ajv.compile(schema_js_1.WebLoginStartParamsSchema);
exports.validateWebLoginWaitParams = ajv.compile(schema_js_1.WebLoginWaitParamsSchema);
function formatValidationErrors(errors) {
  if (!(errors === null || errors === void 0 ? void 0 : errors.length)) {
    return "unknown validation error";
  }
  var parts = [];
  for (var _i = 0, errors_1 = errors; _i < errors_1.length; _i++) {
    var err = errors_1[_i];
    var keyword =
      typeof (err === null || err === void 0 ? void 0 : err.keyword) === "string"
        ? err.keyword
        : "";
    var instancePath =
      typeof (err === null || err === void 0 ? void 0 : err.instancePath) === "string"
        ? err.instancePath
        : "";
    if (keyword === "additionalProperties") {
      var params = err === null || err === void 0 ? void 0 : err.params;
      var additionalProperty =
        params === null || params === void 0 ? void 0 : params.additionalProperty;
      if (typeof additionalProperty === "string" && additionalProperty.trim()) {
        var where_1 = instancePath ? "at ".concat(instancePath) : "at root";
        parts.push("".concat(where_1, ": unexpected property '").concat(additionalProperty, "'"));
        continue;
      }
    }
    var message =
      typeof (err === null || err === void 0 ? void 0 : err.message) === "string" &&
      err.message.trim()
        ? err.message
        : "validation error";
    var where = instancePath ? "at ".concat(instancePath, ": ") : "";
    parts.push("".concat(where).concat(message));
  }
  // De-dupe while preserving order.
  var unique = Array.from(
    new Set(
      parts.filter(function (part) {
        return part.trim();
      }),
    ),
  );
  if (!unique.length) {
    var fallback = ajv.errorsText(errors, { separator: "; " });
    return fallback || "unknown validation error";
  }
  return unique.join("; ");
}
