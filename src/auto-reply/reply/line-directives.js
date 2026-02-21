"use strict";
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) {
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2) {
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseLineDirectives = parseLineDirectives;
exports.hasLineDirectives = hasLineDirectives;
var flex_templates_js_1 = require("../../line/flex-templates.js");
/**
 * Parse LINE-specific directives from text and extract them into ReplyPayload fields.
 *
 * Supported directives:
 * - [[quick_replies: option1, option2, option3]]
 * - [[location: title | address | latitude | longitude]]
 * - [[confirm: question | yes_label | no_label]]
 * - [[buttons: title | text | btn1:data1, btn2:data2]]
 * - [[media_player: title | artist | source | imageUrl | playing/paused]]
 * - [[event: title | date | time | location | description]]
 * - [[agenda: title | event1_title:event1_time, event2_title:event2_time, ...]]
 * - [[device: name | type | status | ctrl1:data1, ctrl2:data2]]
 * - [[appletv_remote: name | status]]
 *
 * Returns the modified payload with directives removed from text and fields populated.
 */
function parseLineDirectives(payload) {
  var _a;
  var text = payload.text;
  if (!text) {
    return payload;
  }
  var result = __assign({}, payload);
  var lineData = __assign(
    {},
    (_a = result.channelData) === null || _a === void 0 ? void 0 : _a.line,
  );
  var toSlug = function (value) {
    return (
      value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "") || "device"
    );
  };
  var lineActionData = function (action, extras) {
    var base = ["line.action=".concat(encodeURIComponent(action))];
    if (extras) {
      for (var _i = 0, _a = Object.entries(extras); _i < _a.length; _i++) {
        var _b = _a[_i],
          key = _b[0],
          value = _b[1];
        base.push("".concat(encodeURIComponent(key), "=").concat(encodeURIComponent(value)));
      }
    }
    return base.join("&");
  };
  // Parse [[quick_replies: option1, option2, option3]]
  var quickRepliesMatch = text.match(/\[\[quick_replies:\s*([^\]]+)\]\]/i);
  if (quickRepliesMatch) {
    var options = quickRepliesMatch[1]
      .split(",")
      .map(function (s) {
        return s.trim();
      })
      .filter(Boolean);
    if (options.length > 0) {
      lineData.quickReplies = __spreadArray(
        __spreadArray([], lineData.quickReplies || [], true),
        options,
        true,
      );
    }
    text = text.replace(quickRepliesMatch[0], "").trim();
  }
  // Parse [[location: title | address | latitude | longitude]]
  var locationMatch = text.match(/\[\[location:\s*([^\]]+)\]\]/i);
  if (locationMatch && !lineData.location) {
    var parts = locationMatch[1].split("|").map(function (s) {
      return s.trim();
    });
    if (parts.length >= 4) {
      var title = parts[0],
        address = parts[1],
        latStr = parts[2],
        lonStr = parts[3];
      var latitude = parseFloat(latStr);
      var longitude = parseFloat(lonStr);
      if (!isNaN(latitude) && !isNaN(longitude)) {
        lineData.location = {
          title: title || "Location",
          address: address || "",
          latitude: latitude,
          longitude: longitude,
        };
      }
    }
    text = text.replace(locationMatch[0], "").trim();
  }
  // Parse [[confirm: question | yes_label | no_label]] or [[confirm: question | yes_label:yes_data | no_label:no_data]]
  var confirmMatch = text.match(/\[\[confirm:\s*([^\]]+)\]\]/i);
  if (confirmMatch && !lineData.templateMessage) {
    var parts = confirmMatch[1].split("|").map(function (s) {
      return s.trim();
    });
    if (parts.length >= 3) {
      var question = parts[0],
        yesPart = parts[1],
        noPart = parts[2];
      // Parse yes_label:yes_data format
      var _b = yesPart.includes(":")
          ? yesPart.split(":").map(function (s) {
              return s.trim();
            })
          : [yesPart, yesPart.toLowerCase()],
        yesLabel = _b[0],
        yesData = _b[1];
      var _c = noPart.includes(":")
          ? noPart.split(":").map(function (s) {
              return s.trim();
            })
          : [noPart, noPart.toLowerCase()],
        noLabel = _c[0],
        noData = _c[1];
      lineData.templateMessage = {
        type: "confirm",
        text: question,
        confirmLabel: yesLabel,
        confirmData: yesData,
        cancelLabel: noLabel,
        cancelData: noData,
        altText: question,
      };
    }
    text = text.replace(confirmMatch[0], "").trim();
  }
  // Parse [[buttons: title | text | btn1:data1, btn2:data2]]
  var buttonsMatch = text.match(/\[\[buttons:\s*([^\]]+)\]\]/i);
  if (buttonsMatch && !lineData.templateMessage) {
    var parts = buttonsMatch[1].split("|").map(function (s) {
      return s.trim();
    });
    if (parts.length >= 3) {
      var title = parts[0],
        bodyText = parts[1],
        actionsStr = parts[2];
      var actions = actionsStr.split(",").map(function (actionStr) {
        var trimmed = actionStr.trim();
        // Find first colon delimiter, ignoring URLs without a label.
        var colonIndex = (function () {
          var index = trimmed.indexOf(":");
          if (index === -1) {
            return -1;
          }
          var lower = trimmed.toLowerCase();
          if (lower.startsWith("http://") || lower.startsWith("https://")) {
            return -1;
          }
          return index;
        })();
        var label;
        var data;
        if (colonIndex === -1) {
          label = trimmed;
          data = trimmed;
        } else {
          label = trimmed.slice(0, colonIndex).trim();
          data = trimmed.slice(colonIndex + 1).trim();
        }
        // Detect action type
        if (data.startsWith("http://") || data.startsWith("https://")) {
          return { type: "uri", label: label, uri: data };
        }
        if (data.includes("=")) {
          return { type: "postback", label: label, data: data };
        }
        return { type: "message", label: label, data: data || label };
      });
      if (actions.length > 0) {
        lineData.templateMessage = {
          type: "buttons",
          title: title,
          text: bodyText,
          actions: actions.slice(0, 4), // LINE limit
          altText: "".concat(title, ": ").concat(bodyText),
        };
      }
    }
    text = text.replace(buttonsMatch[0], "").trim();
  }
  // Parse [[media_player: title | artist | source | imageUrl | playing/paused]]
  var mediaPlayerMatch = text.match(/\[\[media_player:\s*([^\]]+)\]\]/i);
  if (mediaPlayerMatch && !lineData.flexMessage) {
    var parts = mediaPlayerMatch[1].split("|").map(function (s) {
      return s.trim();
    });
    if (parts.length >= 1) {
      var title = parts[0],
        artist = parts[1],
        source = parts[2],
        imageUrl = parts[3],
        statusStr = parts[4];
      var isPlaying =
        (statusStr === null || statusStr === void 0 ? void 0 : statusStr.toLowerCase()) ===
        "playing";
      // LINE requires HTTPS URLs for images - skip local/HTTP URLs
      var validImageUrl = (
        imageUrl === null || imageUrl === void 0 ? void 0 : imageUrl.startsWith("https://")
      )
        ? imageUrl
        : undefined;
      var deviceKey = toSlug(source || title || "media");
      var card = (0, flex_templates_js_1.createMediaPlayerCard)({
        title: title || "Unknown Track",
        subtitle: artist || undefined,
        source: source || undefined,
        imageUrl: validImageUrl,
        isPlaying: statusStr ? isPlaying : undefined,
        controls: {
          previous: { data: lineActionData("previous", { "line.device": deviceKey }) },
          play: { data: lineActionData("play", { "line.device": deviceKey }) },
          pause: { data: lineActionData("pause", { "line.device": deviceKey }) },
          next: { data: lineActionData("next", { "line.device": deviceKey }) },
        },
      });
      lineData.flexMessage = {
        altText: "\uD83C\uDFB5 ".concat(title).concat(artist ? " - ".concat(artist) : ""),
        contents: card,
      };
    }
    text = text.replace(mediaPlayerMatch[0], "").trim();
  }
  // Parse [[event: title | date | time | location | description]]
  var eventMatch = text.match(/\[\[event:\s*([^\]]+)\]\]/i);
  if (eventMatch && !lineData.flexMessage) {
    var parts = eventMatch[1].split("|").map(function (s) {
      return s.trim();
    });
    if (parts.length >= 2) {
      var title = parts[0],
        date = parts[1],
        time = parts[2],
        location_1 = parts[3],
        description = parts[4];
      var card = (0, flex_templates_js_1.createEventCard)({
        title: title || "Event",
        date: date || "TBD",
        time: time || undefined,
        location: location_1 || undefined,
        description: description || undefined,
      });
      lineData.flexMessage = {
        altText: "\uD83D\uDCC5 "
          .concat(title, " - ")
          .concat(date)
          .concat(time ? " ".concat(time) : ""),
        contents: card,
      };
    }
    text = text.replace(eventMatch[0], "").trim();
  }
  // Parse [[appletv_remote: name | status]]
  var appleTvMatch = text.match(/\[\[appletv_remote:\s*([^\]]+)\]\]/i);
  if (appleTvMatch && !lineData.flexMessage) {
    var parts = appleTvMatch[1].split("|").map(function (s) {
      return s.trim();
    });
    if (parts.length >= 1) {
      var deviceName = parts[0],
        status_1 = parts[1];
      var deviceKey = toSlug(deviceName || "apple_tv");
      var card = (0, flex_templates_js_1.createAppleTvRemoteCard)({
        deviceName: deviceName || "Apple TV",
        status: status_1 || undefined,
        actionData: {
          up: lineActionData("up", { "line.device": deviceKey }),
          down: lineActionData("down", { "line.device": deviceKey }),
          left: lineActionData("left", { "line.device": deviceKey }),
          right: lineActionData("right", { "line.device": deviceKey }),
          select: lineActionData("select", { "line.device": deviceKey }),
          menu: lineActionData("menu", { "line.device": deviceKey }),
          home: lineActionData("home", { "line.device": deviceKey }),
          play: lineActionData("play", { "line.device": deviceKey }),
          pause: lineActionData("pause", { "line.device": deviceKey }),
          volumeUp: lineActionData("volume_up", { "line.device": deviceKey }),
          volumeDown: lineActionData("volume_down", { "line.device": deviceKey }),
          mute: lineActionData("mute", { "line.device": deviceKey }),
        },
      });
      lineData.flexMessage = {
        altText: "\uD83D\uDCFA ".concat(deviceName || "Apple TV", " Remote"),
        contents: card,
      };
    }
    text = text.replace(appleTvMatch[0], "").trim();
  }
  // Parse [[agenda: title | event1_title:event1_time, event2_title:event2_time, ...]]
  var agendaMatch = text.match(/\[\[agenda:\s*([^\]]+)\]\]/i);
  if (agendaMatch && !lineData.flexMessage) {
    var parts = agendaMatch[1].split("|").map(function (s) {
      return s.trim();
    });
    if (parts.length >= 2) {
      var title = parts[0],
        eventsStr = parts[1];
      var events = eventsStr.split(",").map(function (eventStr) {
        var trimmed = eventStr.trim();
        var colonIdx = trimmed.lastIndexOf(":");
        if (colonIdx > 0) {
          return {
            title: trimmed.slice(0, colonIdx).trim(),
            time: trimmed.slice(colonIdx + 1).trim(),
          };
        }
        return { title: trimmed };
      });
      var card = (0, flex_templates_js_1.createAgendaCard)({
        title: title || "Agenda",
        events: events,
      });
      lineData.flexMessage = {
        altText: "\uD83D\uDCCB ".concat(title, " (").concat(events.length, " events)"),
        contents: card,
      };
    }
    text = text.replace(agendaMatch[0], "").trim();
  }
  // Parse [[device: name | type | status | ctrl1:data1, ctrl2:data2]]
  var deviceMatch = text.match(/\[\[device:\s*([^\]]+)\]\]/i);
  if (deviceMatch && !lineData.flexMessage) {
    var parts = deviceMatch[1].split("|").map(function (s) {
      return s.trim();
    });
    if (parts.length >= 1) {
      var deviceName = parts[0],
        deviceType = parts[1],
        status_2 = parts[2],
        controlsStr = parts[3];
      var deviceKey_1 = toSlug(deviceName || "device");
      var controls = controlsStr
        ? controlsStr.split(",").map(function (ctrlStr) {
            var _a = ctrlStr.split(":").map(function (s) {
                return s.trim();
              }),
              label = _a[0],
              data = _a[1];
            var action = data || label.toLowerCase().replace(/\s+/g, "_");
            return { label: label, data: lineActionData(action, { "line.device": deviceKey_1 }) };
          })
        : [];
      var card = (0, flex_templates_js_1.createDeviceControlCard)({
        deviceName: deviceName || "Device",
        deviceType: deviceType || undefined,
        status: status_2 || undefined,
        controls: controls,
      });
      lineData.flexMessage = {
        altText: "\uD83D\uDCF1 ".concat(deviceName).concat(status_2 ? ": ".concat(status_2) : ""),
        contents: card,
      };
    }
    text = text.replace(deviceMatch[0], "").trim();
  }
  // Clean up multiple whitespace/newlines
  text = text.replace(/\n{3,}/g, "\n\n").trim();
  result.text = text || undefined;
  if (Object.keys(lineData).length > 0) {
    result.channelData = __assign(__assign({}, result.channelData), { line: lineData });
  }
  return result;
}
/**
 * Check if text contains any LINE directives
 */
function hasLineDirectives(text) {
  return /\[\[(quick_replies|location|confirm|buttons|media_player|event|agenda|device|appletv_remote):/i.test(
    text,
  );
}
