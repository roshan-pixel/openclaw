"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BLUEBUBBLES_GROUP_ACTIONS = exports.BLUEBUBBLES_ACTION_NAMES = exports.BLUEBUBBLES_ACTIONS = void 0;
exports.BLUEBUBBLES_ACTIONS = {
    react: { gate: "reactions" },
    edit: { gate: "edit", unsupportedOnMacOS26: true },
    unsend: { gate: "unsend" },
    reply: { gate: "reply" },
    sendWithEffect: { gate: "sendWithEffect" },
    renameGroup: { gate: "renameGroup", groupOnly: true },
    setGroupIcon: { gate: "setGroupIcon", groupOnly: true },
    addParticipant: { gate: "addParticipant", groupOnly: true },
    removeParticipant: { gate: "removeParticipant", groupOnly: true },
    leaveGroup: { gate: "leaveGroup", groupOnly: true },
    sendAttachment: { gate: "sendAttachment" },
};
var BLUEBUBBLES_ACTION_SPECS = exports.BLUEBUBBLES_ACTIONS;
exports.BLUEBUBBLES_ACTION_NAMES = Object.keys(exports.BLUEBUBBLES_ACTIONS);
exports.BLUEBUBBLES_GROUP_ACTIONS = new Set(exports.BLUEBUBBLES_ACTION_NAMES.filter(function (action) { var _a; return (_a = BLUEBUBBLES_ACTION_SPECS[action]) === null || _a === void 0 ? void 0 : _a.groupOnly; }));
