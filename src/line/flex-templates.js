"use strict";
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
exports.createInfoCard = createInfoCard;
exports.createListCard = createListCard;
exports.createImageCard = createImageCard;
exports.createActionCard = createActionCard;
exports.createCarousel = createCarousel;
exports.createNotificationBubble = createNotificationBubble;
exports.createReceiptCard = createReceiptCard;
exports.createEventCard = createEventCard;
exports.createAgendaCard = createAgendaCard;
exports.createMediaPlayerCard = createMediaPlayerCard;
exports.createAppleTvRemoteCard = createAppleTvRemoteCard;
exports.createDeviceControlCard = createDeviceControlCard;
exports.toFlexMessage = toFlexMessage;
/**
 * Create an info card with title, body, and optional footer
 *
 * Editorial design: Clean hierarchy with accent bar, generous spacing,
 * and subtle background zones for visual separation.
 */
function createInfoCard(title, body, footer) {
  var bubble = {
    type: "bubble",
    size: "mega",
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        // Title with accent bar
        {
          type: "box",
          layout: "horizontal",
          contents: [
            {
              type: "box",
              layout: "vertical",
              contents: [],
              width: "4px",
              backgroundColor: "#06C755",
              cornerRadius: "2px",
            },
            {
              type: "text",
              text: title,
              weight: "bold",
              size: "xl",
              color: "#111111",
              wrap: true,
              flex: 1,
              margin: "lg",
            },
          ],
        },
        // Body text in subtle container
        {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: body,
              size: "md",
              color: "#444444",
              wrap: true,
              lineSpacing: "6px",
            },
          ],
          margin: "xl",
          paddingAll: "lg",
          backgroundColor: "#F8F9FA",
          cornerRadius: "lg",
        },
      ],
      paddingAll: "xl",
      backgroundColor: "#FFFFFF",
    },
  };
  if (footer) {
    bubble.footer = {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: footer,
          size: "xs",
          color: "#AAAAAA",
          wrap: true,
          align: "center",
        },
      ],
      paddingAll: "lg",
      backgroundColor: "#FAFAFA",
    };
  }
  return bubble;
}
/**
 * Create a list card with title and multiple items
 *
 * Editorial design: Numbered/bulleted list with clear visual hierarchy,
 * accent dots for each item, and generous spacing.
 */
function createListCard(title, items) {
  var itemContents = items.slice(0, 8).map(function (item, index) {
    var itemContents = [
      {
        type: "text",
        text: item.title,
        size: "md",
        weight: "bold",
        color: "#1a1a1a",
        wrap: true,
      },
    ];
    if (item.subtitle) {
      itemContents.push({
        type: "text",
        text: item.subtitle,
        size: "sm",
        color: "#888888",
        wrap: true,
        margin: "xs",
      });
    }
    var itemBox = {
      type: "box",
      layout: "horizontal",
      contents: [
        // Accent dot
        {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "box",
              layout: "vertical",
              contents: [],
              width: "8px",
              height: "8px",
              backgroundColor: index === 0 ? "#06C755" : "#DDDDDD",
              cornerRadius: "4px",
            },
          ],
          width: "20px",
          alignItems: "center",
          paddingTop: "sm",
        },
        // Item content
        {
          type: "box",
          layout: "vertical",
          contents: itemContents,
          flex: 1,
        },
      ],
      margin: index > 0 ? "lg" : undefined,
    };
    if (item.action) {
      itemBox.action = item.action;
    }
    return itemBox;
  });
  return {
    type: "bubble",
    size: "mega",
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: title,
          weight: "bold",
          size: "xl",
          color: "#111111",
          wrap: true,
        },
        {
          type: "separator",
          margin: "lg",
          color: "#EEEEEE",
        },
        {
          type: "box",
          layout: "vertical",
          contents: itemContents,
          margin: "lg",
        },
      ],
      paddingAll: "xl",
      backgroundColor: "#FFFFFF",
    },
  };
}
/**
 * Create an image card with image, title, and optional body text
 */
function createImageCard(imageUrl, title, body, options) {
  var _a, _b;
  var bubble = {
    type: "bubble",
    hero: {
      type: "image",
      url: imageUrl,
      size: "full",
      aspectRatio:
        (_a = options === null || options === void 0 ? void 0 : options.aspectRatio) !== null &&
        _a !== void 0
          ? _a
          : "20:13",
      aspectMode:
        (_b = options === null || options === void 0 ? void 0 : options.aspectMode) !== null &&
        _b !== void 0
          ? _b
          : "cover",
      action: options === null || options === void 0 ? void 0 : options.action,
    },
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: title,
          weight: "bold",
          size: "xl",
          wrap: true,
        },
      ],
      paddingAll: "lg",
    },
  };
  if (body && bubble.body) {
    bubble.body.contents.push({
      type: "text",
      text: body,
      size: "md",
      wrap: true,
      margin: "md",
      color: "#666666",
    });
  }
  return bubble;
}
/**
 * Create an action card with title, body, and action buttons
 */
function createActionCard(title, body, actions, options) {
  var _a;
  var bubble = {
    type: "bubble",
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: title,
          weight: "bold",
          size: "xl",
          wrap: true,
        },
        {
          type: "text",
          text: body,
          size: "md",
          wrap: true,
          margin: "md",
          color: "#666666",
        },
      ],
      paddingAll: "lg",
    },
    footer: {
      type: "box",
      layout: "vertical",
      contents: actions.slice(0, 4).map(function (action, index) {
        return {
          type: "button",
          action: action.action,
          style: index === 0 ? "primary" : "secondary",
          margin: index > 0 ? "sm" : undefined,
        };
      }),
      paddingAll: "md",
    },
  };
  if (options === null || options === void 0 ? void 0 : options.imageUrl) {
    bubble.hero = {
      type: "image",
      url: options.imageUrl,
      size: "full",
      aspectRatio: (_a = options.aspectRatio) !== null && _a !== void 0 ? _a : "20:13",
      aspectMode: "cover",
    };
  }
  return bubble;
}
/**
 * Create a carousel container from multiple bubbles
 * LINE allows max 12 bubbles in a carousel
 */
function createCarousel(bubbles) {
  return {
    type: "carousel",
    contents: bubbles.slice(0, 12),
  };
}
/**
 * Create a notification bubble (for alerts, status updates)
 *
 * Editorial design: Bold status indicator with accent color,
 * clear typography, optional icon for context.
 */
function createNotificationBubble(text, options) {
  var _a;
  // Color based on notification type
  var colors = {
    info: { accent: "#3B82F6", bg: "#EFF6FF" },
    success: { accent: "#06C755", bg: "#F0FDF4" },
    warning: { accent: "#F59E0B", bg: "#FFFBEB" },
    error: { accent: "#EF4444", bg: "#FEF2F2" },
  };
  var typeColors =
    colors[
      (_a = options === null || options === void 0 ? void 0 : options.type) !== null &&
      _a !== void 0
        ? _a
        : "info"
    ];
  var contents = [];
  // Accent bar
  contents.push({
    type: "box",
    layout: "vertical",
    contents: [],
    width: "4px",
    backgroundColor: typeColors.accent,
    cornerRadius: "2px",
  });
  // Content section
  var textContents = [];
  if (options === null || options === void 0 ? void 0 : options.title) {
    textContents.push({
      type: "text",
      text: options.title,
      size: "md",
      weight: "bold",
      color: "#111111",
      wrap: true,
    });
  }
  textContents.push({
    type: "text",
    text: text,
    size: (options === null || options === void 0 ? void 0 : options.title) ? "sm" : "md",
    color: (options === null || options === void 0 ? void 0 : options.title)
      ? "#666666"
      : "#333333",
    wrap: true,
    margin: (options === null || options === void 0 ? void 0 : options.title) ? "sm" : undefined,
  });
  contents.push({
    type: "box",
    layout: "vertical",
    contents: textContents,
    flex: 1,
    paddingStart: "lg",
  });
  return {
    type: "bubble",
    body: {
      type: "box",
      layout: "horizontal",
      contents: contents,
      paddingAll: "xl",
      backgroundColor: typeColors.bg,
    },
  };
}
/**
 * Create a receipt/summary card (for orders, transactions, data tables)
 *
 * Editorial design: Clean table layout with alternating row backgrounds,
 * prominent total section, and clear visual hierarchy.
 */
function createReceiptCard(params) {
  var title = params.title,
    subtitle = params.subtitle,
    items = params.items,
    total = params.total,
    footer = params.footer;
  var itemRows = items.slice(0, 12).map(function (item, index) {
    return {
      type: "box",
      layout: "horizontal",
      contents: [
        {
          type: "text",
          text: item.name,
          size: "sm",
          color: item.highlight ? "#111111" : "#666666",
          weight: item.highlight ? "bold" : "regular",
          flex: 3,
          wrap: true,
        },
        {
          type: "text",
          text: item.value,
          size: "sm",
          color: item.highlight ? "#06C755" : "#333333",
          weight: item.highlight ? "bold" : "regular",
          flex: 2,
          align: "end",
          wrap: true,
        },
      ],
      paddingAll: "md",
      backgroundColor: index % 2 === 0 ? "#FFFFFF" : "#FAFAFA",
    };
  });
  // Header section
  var headerContents = [
    {
      type: "text",
      text: title,
      weight: "bold",
      size: "xl",
      color: "#111111",
      wrap: true,
    },
  ];
  if (subtitle) {
    headerContents.push({
      type: "text",
      text: subtitle,
      size: "sm",
      color: "#888888",
      margin: "sm",
      wrap: true,
    });
  }
  var bodyContents = [
    {
      type: "box",
      layout: "vertical",
      contents: headerContents,
      paddingBottom: "lg",
    },
    {
      type: "separator",
      color: "#EEEEEE",
    },
    {
      type: "box",
      layout: "vertical",
      contents: itemRows,
      margin: "md",
      cornerRadius: "md",
      borderWidth: "light",
      borderColor: "#EEEEEE",
    },
  ];
  // Total section with emphasis
  if (total) {
    bodyContents.push({
      type: "box",
      layout: "horizontal",
      contents: [
        {
          type: "text",
          text: total.label,
          size: "lg",
          weight: "bold",
          color: "#111111",
          flex: 2,
        },
        {
          type: "text",
          text: total.value,
          size: "xl",
          weight: "bold",
          color: "#06C755",
          flex: 2,
          align: "end",
        },
      ],
      margin: "xl",
      paddingAll: "lg",
      backgroundColor: "#F0FDF4",
      cornerRadius: "lg",
    });
  }
  var bubble = {
    type: "bubble",
    size: "mega",
    body: {
      type: "box",
      layout: "vertical",
      contents: bodyContents,
      paddingAll: "xl",
      backgroundColor: "#FFFFFF",
    },
  };
  if (footer) {
    bubble.footer = {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: footer,
          size: "xs",
          color: "#AAAAAA",
          wrap: true,
          align: "center",
        },
      ],
      paddingAll: "lg",
      backgroundColor: "#FAFAFA",
    };
  }
  return bubble;
}
/**
 * Create a calendar event card (for meetings, appointments, reminders)
 *
 * Editorial design: Date as hero, strong typographic hierarchy,
 * color-blocked zones, full text wrapping for readability.
 */
function createEventCard(params) {
  var title = params.title,
    date = params.date,
    time = params.time,
    location = params.location,
    description = params.description,
    calendar = params.calendar,
    isAllDay = params.isAllDay,
    action = params.action;
  // Hero date block - the most important information
  var dateBlock = {
    type: "box",
    layout: "vertical",
    contents: [
      {
        type: "text",
        text: date.toUpperCase(),
        size: "sm",
        weight: "bold",
        color: "#06C755",
        wrap: true,
      },
      {
        type: "text",
        text: isAllDay ? "ALL DAY" : time !== null && time !== void 0 ? time : "",
        size: "xxl",
        weight: "bold",
        color: "#111111",
        wrap: true,
        margin: "xs",
      },
    ],
    paddingBottom: "lg",
    borderWidth: "none",
  };
  // If no time and not all day, hide the time display
  if (!time && !isAllDay) {
    dateBlock.contents = [
      {
        type: "text",
        text: date,
        size: "xl",
        weight: "bold",
        color: "#111111",
        wrap: true,
      },
    ];
  }
  // Event title with accent bar
  var titleBlock = {
    type: "box",
    layout: "horizontal",
    contents: [
      {
        type: "box",
        layout: "vertical",
        contents: [],
        width: "4px",
        backgroundColor: "#06C755",
        cornerRadius: "2px",
      },
      {
        type: "box",
        layout: "vertical",
        contents: __spreadArray(
          [
            {
              type: "text",
              text: title,
              size: "lg",
              weight: "bold",
              color: "#1a1a1a",
              wrap: true,
            },
          ],
          calendar
            ? [
                {
                  type: "text",
                  text: calendar,
                  size: "xs",
                  color: "#888888",
                  margin: "sm",
                  wrap: true,
                },
              ]
            : [],
          true,
        ),
        flex: 1,
        paddingStart: "lg",
      },
    ],
    paddingTop: "lg",
    paddingBottom: "lg",
    borderWidth: "light",
    borderColor: "#EEEEEE",
  };
  var bodyContents = [dateBlock, titleBlock];
  // Details section (location + description) in subtle background
  var hasDetails = location || description;
  if (hasDetails) {
    var detailItems = [];
    if (location) {
      detailItems.push({
        type: "box",
        layout: "horizontal",
        contents: [
          {
            type: "text",
            text: "📍",
            size: "sm",
            flex: 0,
          },
          {
            type: "text",
            text: location,
            size: "sm",
            color: "#444444",
            margin: "md",
            flex: 1,
            wrap: true,
          },
        ],
        alignItems: "flex-start",
      });
    }
    if (description) {
      detailItems.push({
        type: "text",
        text: description,
        size: "sm",
        color: "#666666",
        wrap: true,
        margin: location ? "lg" : "none",
      });
    }
    bodyContents.push({
      type: "box",
      layout: "vertical",
      contents: detailItems,
      margin: "lg",
      paddingAll: "lg",
      backgroundColor: "#F8F9FA",
      cornerRadius: "lg",
    });
  }
  return {
    type: "bubble",
    size: "mega",
    body: {
      type: "box",
      layout: "vertical",
      contents: bodyContents,
      paddingAll: "xl",
      backgroundColor: "#FFFFFF",
      action: action,
    },
  };
}
/**
 * Create a calendar agenda card showing multiple events
 *
 * Editorial timeline design: Time-focused left column with event details
 * on the right. Visual accent bars indicate event priority/recency.
 */
function createAgendaCard(params) {
  var title = params.title,
    subtitle = params.subtitle,
    events = params.events,
    footer = params.footer;
  // Header with title and optional subtitle
  var headerContents = [
    {
      type: "text",
      text: title,
      weight: "bold",
      size: "xl",
      color: "#111111",
      wrap: true,
    },
  ];
  if (subtitle) {
    headerContents.push({
      type: "text",
      text: subtitle,
      size: "sm",
      color: "#888888",
      margin: "sm",
      wrap: true,
    });
  }
  // Event timeline items
  var eventItems = events.slice(0, 6).map(function (event, index) {
    var _a;
    var isActive = event.isNow || index === 0;
    var accentColor = isActive ? "#06C755" : "#E5E5E5";
    // Time column (fixed width)
    var timeColumn = {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: (_a = event.time) !== null && _a !== void 0 ? _a : "—",
          size: "sm",
          weight: isActive ? "bold" : "regular",
          color: isActive ? "#06C755" : "#666666",
          align: "end",
          wrap: true,
        },
      ],
      width: "65px",
      justifyContent: "flex-start",
    };
    // Accent dot
    var dotColumn = {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "box",
          layout: "vertical",
          contents: [],
          width: "10px",
          height: "10px",
          backgroundColor: accentColor,
          cornerRadius: "5px",
        },
      ],
      width: "24px",
      alignItems: "center",
      justifyContent: "flex-start",
      paddingTop: "xs",
    };
    // Event details column
    var detailContents = [
      {
        type: "text",
        text: event.title,
        size: "md",
        weight: "bold",
        color: "#1a1a1a",
        wrap: true,
      },
    ];
    // Secondary info line
    var secondaryParts = [];
    if (event.location) {
      secondaryParts.push(event.location);
    }
    if (event.calendar) {
      secondaryParts.push(event.calendar);
    }
    if (secondaryParts.length > 0) {
      detailContents.push({
        type: "text",
        text: secondaryParts.join(" · "),
        size: "xs",
        color: "#888888",
        wrap: true,
        margin: "xs",
      });
    }
    var detailColumn = {
      type: "box",
      layout: "vertical",
      contents: detailContents,
      flex: 1,
    };
    return {
      type: "box",
      layout: "horizontal",
      contents: [timeColumn, dotColumn, detailColumn],
      margin: index > 0 ? "xl" : undefined,
      alignItems: "flex-start",
    };
  });
  var bodyContents = [
    {
      type: "box",
      layout: "vertical",
      contents: headerContents,
      paddingBottom: "lg",
    },
    {
      type: "separator",
      color: "#EEEEEE",
    },
    {
      type: "box",
      layout: "vertical",
      contents: eventItems,
      paddingTop: "xl",
    },
  ];
  var bubble = {
    type: "bubble",
    size: "mega",
    body: {
      type: "box",
      layout: "vertical",
      contents: bodyContents,
      paddingAll: "xl",
      backgroundColor: "#FFFFFF",
    },
  };
  if (footer) {
    bubble.footer = {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: footer,
          size: "xs",
          color: "#AAAAAA",
          align: "center",
          wrap: true,
        },
      ],
      paddingAll: "lg",
      backgroundColor: "#FAFAFA",
    };
  }
  return bubble;
}
/**
 * Create a media player card for Sonos, Spotify, Apple Music, etc.
 *
 * Editorial design: Album art hero with gradient overlay for text,
 * prominent now-playing indicator, refined playback controls.
 */
function createMediaPlayerCard(params) {
  var title = params.title,
    subtitle = params.subtitle,
    source = params.source,
    imageUrl = params.imageUrl,
    isPlaying = params.isPlaying,
    progress = params.progress,
    controls = params.controls,
    extraActions = params.extraActions;
  // Track info section
  var trackInfo = [
    {
      type: "text",
      text: title,
      weight: "bold",
      size: "xl",
      color: "#111111",
      wrap: true,
    },
  ];
  if (subtitle) {
    trackInfo.push({
      type: "text",
      text: subtitle,
      size: "md",
      color: "#666666",
      wrap: true,
      margin: "sm",
    });
  }
  // Status row with source and playing indicator
  var statusItems = [];
  if (isPlaying !== undefined) {
    statusItems.push({
      type: "box",
      layout: "horizontal",
      contents: [
        {
          type: "box",
          layout: "vertical",
          contents: [],
          width: "8px",
          height: "8px",
          backgroundColor: isPlaying ? "#06C755" : "#CCCCCC",
          cornerRadius: "4px",
        },
        {
          type: "text",
          text: isPlaying ? "Now Playing" : "Paused",
          size: "xs",
          color: isPlaying ? "#06C755" : "#888888",
          weight: "bold",
          margin: "sm",
        },
      ],
      alignItems: "center",
    });
  }
  if (source) {
    statusItems.push({
      type: "text",
      text: source,
      size: "xs",
      color: "#AAAAAA",
      margin: statusItems.length > 0 ? "lg" : undefined,
    });
  }
  if (progress) {
    statusItems.push({
      type: "text",
      text: progress,
      size: "xs",
      color: "#888888",
      align: "end",
      flex: 1,
    });
  }
  var bodyContents = [
    {
      type: "box",
      layout: "vertical",
      contents: trackInfo,
    },
  ];
  if (statusItems.length > 0) {
    bodyContents.push({
      type: "box",
      layout: "horizontal",
      contents: statusItems,
      margin: "lg",
      alignItems: "center",
    });
  }
  var bubble = {
    type: "bubble",
    size: "mega",
    body: {
      type: "box",
      layout: "vertical",
      contents: bodyContents,
      paddingAll: "xl",
      backgroundColor: "#FFFFFF",
    },
  };
  // Album art hero
  if (imageUrl) {
    bubble.hero = {
      type: "image",
      url: imageUrl,
      size: "full",
      aspectRatio: "1:1",
      aspectMode: "cover",
    };
  }
  // Control buttons in footer
  if (
    controls ||
    (extraActions === null || extraActions === void 0 ? void 0 : extraActions.length)
  ) {
    var footerContents = [];
    // Main playback controls with refined styling
    if (controls) {
      var controlButtons = [];
      if (controls.previous) {
        controlButtons.push({
          type: "button",
          action: {
            type: "postback",
            label: "⏮",
            data: controls.previous.data,
          },
          style: "secondary",
          flex: 1,
          height: "sm",
        });
      }
      if (controls.play) {
        controlButtons.push({
          type: "button",
          action: {
            type: "postback",
            label: "▶",
            data: controls.play.data,
          },
          style: isPlaying ? "secondary" : "primary",
          flex: 1,
          height: "sm",
          margin: controls.previous ? "md" : undefined,
        });
      }
      if (controls.pause) {
        controlButtons.push({
          type: "button",
          action: {
            type: "postback",
            label: "⏸",
            data: controls.pause.data,
          },
          style: isPlaying ? "primary" : "secondary",
          flex: 1,
          height: "sm",
          margin: controlButtons.length > 0 ? "md" : undefined,
        });
      }
      if (controls.next) {
        controlButtons.push({
          type: "button",
          action: {
            type: "postback",
            label: "⏭",
            data: controls.next.data,
          },
          style: "secondary",
          flex: 1,
          height: "sm",
          margin: controlButtons.length > 0 ? "md" : undefined,
        });
      }
      if (controlButtons.length > 0) {
        footerContents.push({
          type: "box",
          layout: "horizontal",
          contents: controlButtons,
        });
      }
    }
    // Extra actions
    if (extraActions === null || extraActions === void 0 ? void 0 : extraActions.length) {
      footerContents.push({
        type: "box",
        layout: "horizontal",
        contents: extraActions.slice(0, 2).map(function (action, index) {
          return {
            type: "button",
            action: {
              type: "postback",
              label: action.label.slice(0, 15),
              data: action.data,
            },
            style: "secondary",
            flex: 1,
            height: "sm",
            margin: index > 0 ? "md" : undefined,
          };
        }),
        margin: "md",
      });
    }
    if (footerContents.length > 0) {
      bubble.footer = {
        type: "box",
        layout: "vertical",
        contents: footerContents,
        paddingAll: "lg",
        backgroundColor: "#FAFAFA",
      };
    }
  }
  return bubble;
}
/**
 * Create an Apple TV remote card with a D-pad and control rows.
 */
function createAppleTvRemoteCard(params) {
  var deviceName = params.deviceName,
    status = params.status,
    actionData = params.actionData;
  var headerContents = [
    {
      type: "text",
      text: deviceName,
      weight: "bold",
      size: "xl",
      color: "#111111",
      wrap: true,
    },
  ];
  if (status) {
    headerContents.push({
      type: "text",
      text: status,
      size: "sm",
      color: "#666666",
      wrap: true,
      margin: "sm",
    });
  }
  var makeButton = function (label, data, style) {
    if (style === void 0) {
      style = "secondary";
    }
    return {
      type: "button",
      action: {
        type: "postback",
        label: label,
        data: data,
      },
      style: style,
      height: "sm",
      flex: 1,
    };
  };
  var dpadRows = [
    {
      type: "box",
      layout: "horizontal",
      contents: [{ type: "filler" }, makeButton("↑", actionData.up), { type: "filler" }],
    },
    {
      type: "box",
      layout: "horizontal",
      contents: [
        makeButton("←", actionData.left),
        makeButton("OK", actionData.select, "primary"),
        makeButton("→", actionData.right),
      ],
      margin: "md",
    },
    {
      type: "box",
      layout: "horizontal",
      contents: [{ type: "filler" }, makeButton("↓", actionData.down), { type: "filler" }],
      margin: "md",
    },
  ];
  var menuRow = {
    type: "box",
    layout: "horizontal",
    contents: [makeButton("Menu", actionData.menu), makeButton("Home", actionData.home)],
    margin: "lg",
  };
  var playbackRow = {
    type: "box",
    layout: "horizontal",
    contents: [makeButton("Play", actionData.play), makeButton("Pause", actionData.pause)],
    margin: "md",
  };
  var volumeRow = {
    type: "box",
    layout: "horizontal",
    contents: [
      makeButton("Vol +", actionData.volumeUp),
      makeButton("Mute", actionData.mute),
      makeButton("Vol -", actionData.volumeDown),
    ],
    margin: "md",
  };
  return {
    type: "bubble",
    size: "mega",
    body: {
      type: "box",
      layout: "vertical",
      contents: __spreadArray(
        __spreadArray(
          [
            {
              type: "box",
              layout: "vertical",
              contents: headerContents,
            },
            {
              type: "separator",
              margin: "lg",
              color: "#EEEEEE",
            },
          ],
          dpadRows,
          true,
        ),
        [menuRow, playbackRow, volumeRow],
        false,
      ),
      paddingAll: "xl",
      backgroundColor: "#FFFFFF",
    },
  };
}
/**
 * Create a device control card for Apple TV, smart home devices, etc.
 *
 * Editorial design: Device-focused header with status indicator,
 * clean control grid with clear visual hierarchy.
 */
function createDeviceControlCard(params) {
  var _a;
  var deviceName = params.deviceName,
    deviceType = params.deviceType,
    status = params.status,
    isOnline = params.isOnline,
    imageUrl = params.imageUrl,
    controls = params.controls;
  // Device header with status indicator
  var headerContents = [
    {
      type: "box",
      layout: "horizontal",
      contents: [
        // Status dot
        {
          type: "box",
          layout: "vertical",
          contents: [],
          width: "10px",
          height: "10px",
          backgroundColor: isOnline !== false ? "#06C755" : "#FF5555",
          cornerRadius: "5px",
        },
        {
          type: "text",
          text: deviceName,
          weight: "bold",
          size: "xl",
          color: "#111111",
          wrap: true,
          flex: 1,
          margin: "md",
        },
      ],
      alignItems: "center",
    },
  ];
  if (deviceType) {
    headerContents.push({
      type: "text",
      text: deviceType,
      size: "sm",
      color: "#888888",
      margin: "sm",
    });
  }
  if (status) {
    headerContents.push({
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: status,
          size: "sm",
          color: "#444444",
          wrap: true,
        },
      ],
      margin: "lg",
      paddingAll: "md",
      backgroundColor: "#F8F9FA",
      cornerRadius: "md",
    });
  }
  var bubble = {
    type: "bubble",
    size: "mega",
    body: {
      type: "box",
      layout: "vertical",
      contents: headerContents,
      paddingAll: "xl",
      backgroundColor: "#FFFFFF",
    },
  };
  if (imageUrl) {
    bubble.hero = {
      type: "image",
      url: imageUrl,
      size: "full",
      aspectRatio: "16:9",
      aspectMode: "cover",
    };
  }
  // Control buttons in refined grid layout (2 per row)
  if (controls.length > 0) {
    var rows = [];
    var limitedControls = controls.slice(0, 6);
    for (var i = 0; i < limitedControls.length; i += 2) {
      var rowButtons = [];
      for (var j = i; j < Math.min(i + 2, limitedControls.length); j++) {
        var ctrl = limitedControls[j];
        var buttonLabel = ctrl.icon ? "".concat(ctrl.icon, " ").concat(ctrl.label) : ctrl.label;
        rowButtons.push({
          type: "button",
          action: {
            type: "postback",
            label: buttonLabel.slice(0, 18),
            data: ctrl.data,
          },
          style: (_a = ctrl.style) !== null && _a !== void 0 ? _a : "secondary",
          flex: 1,
          height: "sm",
          margin: j > i ? "md" : undefined,
        });
      }
      // If odd number of controls in last row, add spacer
      if (rowButtons.length === 1) {
        rowButtons.push({
          type: "filler",
        });
      }
      rows.push({
        type: "box",
        layout: "horizontal",
        contents: rowButtons,
        margin: i > 0 ? "md" : undefined,
      });
    }
    bubble.footer = {
      type: "box",
      layout: "vertical",
      contents: rows,
      paddingAll: "lg",
      backgroundColor: "#FAFAFA",
    };
  }
  return bubble;
}
/**
 * Wrap a FlexContainer in a FlexMessage
 */
function toFlexMessage(altText, contents) {
  return {
    type: "flex",
    altText: altText,
    contents: contents,
  };
}
