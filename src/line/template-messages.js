"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConfirmTemplate = createConfirmTemplate;
exports.createButtonTemplate = createButtonTemplate;
exports.createTemplateCarousel = createTemplateCarousel;
exports.createCarouselColumn = createCarouselColumn;
exports.createImageCarousel = createImageCarousel;
exports.createImageCarouselColumn = createImageCarouselColumn;
exports.messageAction = messageAction;
exports.uriAction = uriAction;
exports.postbackAction = postbackAction;
exports.datetimePickerAction = datetimePickerAction;
exports.createYesNoConfirm = createYesNoConfirm;
exports.createButtonMenu = createButtonMenu;
exports.createLinkMenu = createLinkMenu;
exports.createProductCarousel = createProductCarousel;
exports.buildTemplateMessageFromPayload = buildTemplateMessageFromPayload;
/**
 * Create a confirm template (yes/no style dialog)
 */
function createConfirmTemplate(text, confirmAction, cancelAction, altText) {
    var _a;
    var template = {
        type: "confirm",
        text: text.slice(0, 240), // LINE limit
        actions: [confirmAction, cancelAction],
    };
    return {
        type: "template",
        altText: (_a = altText === null || altText === void 0 ? void 0 : altText.slice(0, 400)) !== null && _a !== void 0 ? _a : text.slice(0, 400),
        template: template,
    };
}
/**
 * Create a button template with title, text, and action buttons
 */
function createButtonTemplate(title, text, actions, options) {
    var _a, _b, _c, _d, _e;
    var hasThumbnail = Boolean((_a = options === null || options === void 0 ? void 0 : options.thumbnailImageUrl) === null || _a === void 0 ? void 0 : _a.trim());
    var textLimit = hasThumbnail ? 160 : 60;
    var template = {
        type: "buttons",
        title: title.slice(0, 40), // LINE limit
        text: text.slice(0, textLimit), // LINE limit (60 if no thumbnail, 160 with thumbnail)
        actions: actions.slice(0, 4), // LINE limit: max 4 actions
        thumbnailImageUrl: options === null || options === void 0 ? void 0 : options.thumbnailImageUrl,
        imageAspectRatio: (_b = options === null || options === void 0 ? void 0 : options.imageAspectRatio) !== null && _b !== void 0 ? _b : "rectangle",
        imageSize: (_c = options === null || options === void 0 ? void 0 : options.imageSize) !== null && _c !== void 0 ? _c : "cover",
        imageBackgroundColor: options === null || options === void 0 ? void 0 : options.imageBackgroundColor,
        defaultAction: options === null || options === void 0 ? void 0 : options.defaultAction,
    };
    return {
        type: "template",
        altText: (_e = (_d = options === null || options === void 0 ? void 0 : options.altText) === null || _d === void 0 ? void 0 : _d.slice(0, 400)) !== null && _e !== void 0 ? _e : "".concat(title, ": ").concat(text).slice(0, 400),
        template: template,
    };
}
/**
 * Create a carousel template with multiple columns
 */
function createTemplateCarousel(columns, options) {
    var _a, _b, _c, _d;
    var template = {
        type: "carousel",
        columns: columns.slice(0, 10), // LINE limit: max 10 columns
        imageAspectRatio: (_a = options === null || options === void 0 ? void 0 : options.imageAspectRatio) !== null && _a !== void 0 ? _a : "rectangle",
        imageSize: (_b = options === null || options === void 0 ? void 0 : options.imageSize) !== null && _b !== void 0 ? _b : "cover",
    };
    return {
        type: "template",
        altText: (_d = (_c = options === null || options === void 0 ? void 0 : options.altText) === null || _c === void 0 ? void 0 : _c.slice(0, 400)) !== null && _d !== void 0 ? _d : "View carousel",
        template: template,
    };
}
/**
 * Create a carousel column for use with createTemplateCarousel
 */
function createCarouselColumn(params) {
    var _a;
    return {
        title: (_a = params.title) === null || _a === void 0 ? void 0 : _a.slice(0, 40),
        text: params.text.slice(0, 120), // LINE limit
        actions: params.actions.slice(0, 3), // LINE limit: max 3 actions per column
        thumbnailImageUrl: params.thumbnailImageUrl,
        imageBackgroundColor: params.imageBackgroundColor,
        defaultAction: params.defaultAction,
    };
}
/**
 * Create an image carousel template (simpler, image-focused carousel)
 */
function createImageCarousel(columns, altText) {
    var _a;
    var template = {
        type: "image_carousel",
        columns: columns.slice(0, 10), // LINE limit: max 10 columns
    };
    return {
        type: "template",
        altText: (_a = altText === null || altText === void 0 ? void 0 : altText.slice(0, 400)) !== null && _a !== void 0 ? _a : "View images",
        template: template,
    };
}
/**
 * Create an image carousel column for use with createImageCarousel
 */
function createImageCarouselColumn(imageUrl, action) {
    return {
        imageUrl: imageUrl,
        action: action,
    };
}
// ============================================================================
// Action Helpers (same as rich-menu but re-exported for convenience)
// ============================================================================
/**
 * Create a message action (sends text when tapped)
 */
function messageAction(label, text) {
    return {
        type: "message",
        label: label.slice(0, 20),
        text: text !== null && text !== void 0 ? text : label,
    };
}
/**
 * Create a URI action (opens a URL when tapped)
 */
function uriAction(label, uri) {
    return {
        type: "uri",
        label: label.slice(0, 20),
        uri: uri,
    };
}
/**
 * Create a postback action (sends data to webhook when tapped)
 */
function postbackAction(label, data, displayText) {
    return {
        type: "postback",
        label: label.slice(0, 20),
        data: data.slice(0, 300),
        displayText: displayText === null || displayText === void 0 ? void 0 : displayText.slice(0, 300),
    };
}
/**
 * Create a datetime picker action
 */
function datetimePickerAction(label, data, mode, options) {
    return {
        type: "datetimepicker",
        label: label.slice(0, 20),
        data: data.slice(0, 300),
        mode: mode,
        initial: options === null || options === void 0 ? void 0 : options.initial,
        max: options === null || options === void 0 ? void 0 : options.max,
        min: options === null || options === void 0 ? void 0 : options.min,
    };
}
// ============================================================================
// Convenience Builders
// ============================================================================
/**
 * Create a simple yes/no confirmation dialog
 */
function createYesNoConfirm(question, options) {
    var _a, _b, _c, _d, _e, _f;
    var yesAction = (options === null || options === void 0 ? void 0 : options.yesData)
        ? postbackAction((_a = options.yesText) !== null && _a !== void 0 ? _a : "Yes", options.yesData, (_b = options.yesText) !== null && _b !== void 0 ? _b : "Yes")
        : messageAction((_c = options === null || options === void 0 ? void 0 : options.yesText) !== null && _c !== void 0 ? _c : "Yes");
    var noAction = (options === null || options === void 0 ? void 0 : options.noData)
        ? postbackAction((_d = options.noText) !== null && _d !== void 0 ? _d : "No", options.noData, (_e = options.noText) !== null && _e !== void 0 ? _e : "No")
        : messageAction((_f = options === null || options === void 0 ? void 0 : options.noText) !== null && _f !== void 0 ? _f : "No");
    return createConfirmTemplate(question, yesAction, noAction, options === null || options === void 0 ? void 0 : options.altText);
}
/**
 * Create a button menu with simple text buttons
 */
function createButtonMenu(title, text, buttons, options) {
    var actions = buttons.slice(0, 4).map(function (btn) { return messageAction(btn.label, btn.text); });
    return createButtonTemplate(title, text, actions, {
        thumbnailImageUrl: options === null || options === void 0 ? void 0 : options.thumbnailImageUrl,
        altText: options === null || options === void 0 ? void 0 : options.altText,
    });
}
/**
 * Create a button menu with URL links
 */
function createLinkMenu(title, text, links, options) {
    var actions = links.slice(0, 4).map(function (link) { return uriAction(link.label, link.url); });
    return createButtonTemplate(title, text, actions, {
        thumbnailImageUrl: options === null || options === void 0 ? void 0 : options.thumbnailImageUrl,
        altText: options === null || options === void 0 ? void 0 : options.altText,
    });
}
/**
 * Create a simple product/item carousel
 */
function createProductCarousel(products, altText) {
    var columns = products.slice(0, 10).map(function (product) {
        var _a, _b, _c;
        var actions = [];
        // Add main action
        if (product.actionUrl) {
            actions.push(uriAction((_a = product.actionLabel) !== null && _a !== void 0 ? _a : "View", product.actionUrl));
        }
        else if (product.actionData) {
            actions.push(postbackAction((_b = product.actionLabel) !== null && _b !== void 0 ? _b : "Select", product.actionData));
        }
        else {
            actions.push(messageAction((_c = product.actionLabel) !== null && _c !== void 0 ? _c : "Select", product.title));
        }
        return createCarouselColumn({
            title: product.title,
            text: product.price
                ? "".concat(product.description, "\n").concat(product.price).slice(0, 120)
                : product.description,
            thumbnailImageUrl: product.imageUrl,
            actions: actions,
        });
    });
    return createTemplateCarousel(columns, { altText: altText });
}
/**
 * Convert a TemplateMessagePayload from ReplyPayload to a LINE TemplateMessage
 */
function buildTemplateMessageFromPayload(payload) {
    switch (payload.type) {
        case "confirm": {
            var confirmAction = payload.confirmData.startsWith("http")
                ? uriAction(payload.confirmLabel, payload.confirmData)
                : payload.confirmData.includes("=")
                    ? postbackAction(payload.confirmLabel, payload.confirmData, payload.confirmLabel)
                    : messageAction(payload.confirmLabel, payload.confirmData);
            var cancelAction = payload.cancelData.startsWith("http")
                ? uriAction(payload.cancelLabel, payload.cancelData)
                : payload.cancelData.includes("=")
                    ? postbackAction(payload.cancelLabel, payload.cancelData, payload.cancelLabel)
                    : messageAction(payload.cancelLabel, payload.cancelData);
            return createConfirmTemplate(payload.text, confirmAction, cancelAction, payload.altText);
        }
        case "buttons": {
            var actions = payload.actions.slice(0, 4).map(function (action) {
                var _a;
                if (action.type === "uri" && action.uri) {
                    return uriAction(action.label, action.uri);
                }
                if (action.type === "postback" && action.data) {
                    return postbackAction(action.label, action.data, action.label);
                }
                // Default to message action
                return messageAction(action.label, (_a = action.data) !== null && _a !== void 0 ? _a : action.label);
            });
            return createButtonTemplate(payload.title, payload.text, actions, {
                thumbnailImageUrl: payload.thumbnailImageUrl,
                altText: payload.altText,
            });
        }
        case "carousel": {
            var columns = payload.columns.slice(0, 10).map(function (col) {
                var colActions = col.actions.slice(0, 3).map(function (action) {
                    var _a;
                    if (action.type === "uri" && action.uri) {
                        return uriAction(action.label, action.uri);
                    }
                    if (action.type === "postback" && action.data) {
                        return postbackAction(action.label, action.data, action.label);
                    }
                    return messageAction(action.label, (_a = action.data) !== null && _a !== void 0 ? _a : action.label);
                });
                return createCarouselColumn({
                    title: col.title,
                    text: col.text,
                    thumbnailImageUrl: col.thumbnailImageUrl,
                    actions: colActions,
                });
            });
            return createTemplateCarousel(columns, { altText: payload.altText });
        }
        default:
            return null;
    }
}
