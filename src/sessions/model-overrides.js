"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyModelOverrideToSessionEntry = applyModelOverrideToSessionEntry;
function applyModelOverrideToSessionEntry(params) {
    var _a;
    var entry = params.entry, selection = params.selection, profileOverride = params.profileOverride;
    var profileOverrideSource = (_a = params.profileOverrideSource) !== null && _a !== void 0 ? _a : "user";
    var updated = false;
    if (selection.isDefault) {
        if (entry.providerOverride) {
            delete entry.providerOverride;
            updated = true;
        }
        if (entry.modelOverride) {
            delete entry.modelOverride;
            updated = true;
        }
    }
    else {
        if (entry.providerOverride !== selection.provider) {
            entry.providerOverride = selection.provider;
            updated = true;
        }
        if (entry.modelOverride !== selection.model) {
            entry.modelOverride = selection.model;
            updated = true;
        }
    }
    if (profileOverride) {
        if (entry.authProfileOverride !== profileOverride) {
            entry.authProfileOverride = profileOverride;
            updated = true;
        }
        if (entry.authProfileOverrideSource !== profileOverrideSource) {
            entry.authProfileOverrideSource = profileOverrideSource;
            updated = true;
        }
        if (entry.authProfileOverrideCompactionCount !== undefined) {
            delete entry.authProfileOverrideCompactionCount;
            updated = true;
        }
    }
    else {
        if (entry.authProfileOverride) {
            delete entry.authProfileOverride;
            updated = true;
        }
        if (entry.authProfileOverrideSource) {
            delete entry.authProfileOverrideSource;
            updated = true;
        }
        if (entry.authProfileOverrideCompactionCount !== undefined) {
            delete entry.authProfileOverrideCompactionCount;
            updated = true;
        }
    }
    if (updated) {
        entry.updatedAt = Date.now();
    }
    return { updated: updated };
}
