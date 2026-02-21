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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoleSnapshotStats = getRoleSnapshotStats;
exports.parseRoleRef = parseRoleRef;
exports.buildRoleSnapshotFromAriaSnapshot = buildRoleSnapshotFromAriaSnapshot;
exports.buildRoleSnapshotFromAiSnapshot = buildRoleSnapshotFromAiSnapshot;
var INTERACTIVE_ROLES = new Set([
  "button",
  "link",
  "textbox",
  "checkbox",
  "radio",
  "combobox",
  "listbox",
  "menuitem",
  "menuitemcheckbox",
  "menuitemradio",
  "option",
  "searchbox",
  "slider",
  "spinbutton",
  "switch",
  "tab",
  "treeitem",
]);
var CONTENT_ROLES = new Set([
  "heading",
  "cell",
  "gridcell",
  "columnheader",
  "rowheader",
  "listitem",
  "article",
  "region",
  "main",
  "navigation",
]);
var STRUCTURAL_ROLES = new Set([
  "generic",
  "group",
  "list",
  "table",
  "row",
  "rowgroup",
  "grid",
  "treegrid",
  "menu",
  "menubar",
  "toolbar",
  "tablist",
  "tree",
  "directory",
  "document",
  "application",
  "presentation",
  "none",
]);
function getRoleSnapshotStats(snapshot, refs) {
  var interactive = Object.values(refs).filter(function (r) {
    return INTERACTIVE_ROLES.has(r.role);
  }).length;
  return {
    lines: snapshot.split("\n").length,
    chars: snapshot.length,
    refs: Object.keys(refs).length,
    interactive: interactive,
  };
}
function getIndentLevel(line) {
  var match = line.match(/^(\s*)/);
  return match ? Math.floor(match[1].length / 2) : 0;
}
function createRoleNameTracker() {
  var counts = new Map();
  var refsByKey = new Map();
  return {
    counts: counts,
    refsByKey: refsByKey,
    getKey: function (role, name) {
      return "".concat(role, ":").concat(name !== null && name !== void 0 ? name : "");
    },
    getNextIndex: function (role, name) {
      var _a;
      var key = this.getKey(role, name);
      var current = (_a = counts.get(key)) !== null && _a !== void 0 ? _a : 0;
      counts.set(key, current + 1);
      return current;
    },
    trackRef: function (role, name, ref) {
      var _a;
      var key = this.getKey(role, name);
      var list = (_a = refsByKey.get(key)) !== null && _a !== void 0 ? _a : [];
      list.push(ref);
      refsByKey.set(key, list);
    },
    getDuplicateKeys: function () {
      var out = new Set();
      for (var _i = 0, refsByKey_1 = refsByKey; _i < refsByKey_1.length; _i++) {
        var _a = refsByKey_1[_i],
          key = _a[0],
          refs = _a[1];
        if (refs.length > 1) {
          out.add(key);
        }
      }
      return out;
    },
  };
}
function removeNthFromNonDuplicates(refs, tracker) {
  var _a;
  var duplicates = tracker.getDuplicateKeys();
  for (var _i = 0, _b = Object.entries(refs); _i < _b.length; _i++) {
    var _c = _b[_i],
      ref = _c[0],
      data = _c[1];
    var key = tracker.getKey(data.role, data.name);
    if (!duplicates.has(key)) {
      (_a = refs[ref]) === null || _a === void 0 ? true : delete _a.nth;
    }
  }
}
function compactTree(tree) {
  var _a;
  var lines = tree.split("\n");
  var result = [];
  for (var i = 0; i < lines.length; i += 1) {
    var line = lines[i];
    if (line.includes("[ref=")) {
      result.push(line);
      continue;
    }
    if (line.includes(":") && !line.trimEnd().endsWith(":")) {
      result.push(line);
      continue;
    }
    var currentIndent = getIndentLevel(line);
    var hasRelevantChildren = false;
    for (var j = i + 1; j < lines.length; j += 1) {
      var childIndent = getIndentLevel(lines[j]);
      if (childIndent <= currentIndent) {
        break;
      }
      if ((_a = lines[j]) === null || _a === void 0 ? void 0 : _a.includes("[ref=")) {
        hasRelevantChildren = true;
        break;
      }
    }
    if (hasRelevantChildren) {
      result.push(line);
    }
  }
  return result.join("\n");
}
function processLine(line, refs, options, tracker, nextRef) {
  var depth = getIndentLevel(line);
  if (options.maxDepth !== undefined && depth > options.maxDepth) {
    return null;
  }
  var match = line.match(/^(\s*-\s*)(\w+)(?:\s+"([^"]*)")?(.*)$/);
  if (!match) {
    return options.interactive ? null : line;
  }
  var prefix = match[1],
    roleRaw = match[2],
    name = match[3],
    suffix = match[4];
  if (roleRaw.startsWith("/")) {
    return options.interactive ? null : line;
  }
  var role = roleRaw.toLowerCase();
  var isInteractive = INTERACTIVE_ROLES.has(role);
  var isContent = CONTENT_ROLES.has(role);
  var isStructural = STRUCTURAL_ROLES.has(role);
  if (options.interactive && !isInteractive) {
    return null;
  }
  if (options.compact && isStructural && !name) {
    return null;
  }
  var shouldHaveRef = isInteractive || (isContent && name);
  if (!shouldHaveRef) {
    return line;
  }
  var ref = nextRef();
  var nth = tracker.getNextIndex(role, name);
  tracker.trackRef(role, name, ref);
  refs[ref] = {
    role: role,
    name: name,
    nth: nth,
  };
  var enhanced = "".concat(prefix).concat(roleRaw);
  if (name) {
    enhanced += ' "'.concat(name, '"');
  }
  enhanced += " [ref=".concat(ref, "]");
  if (nth > 0) {
    enhanced += " [nth=".concat(nth, "]");
  }
  if (suffix) {
    enhanced += suffix;
  }
  return enhanced;
}
function parseRoleRef(raw) {
  var trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }
  var normalized = trimmed.startsWith("@")
    ? trimmed.slice(1)
    : trimmed.startsWith("ref=")
      ? trimmed.slice(4)
      : trimmed;
  return /^e\d+$/.test(normalized) ? normalized : null;
}
function buildRoleSnapshotFromAriaSnapshot(ariaSnapshot, options) {
  if (options === void 0) {
    options = {};
  }
  var lines = ariaSnapshot.split("\n");
  var refs = {};
  var tracker = createRoleNameTracker();
  var counter = 0;
  var nextRef = function () {
    counter += 1;
    return "e".concat(counter);
  };
  if (options.interactive) {
    var result_1 = [];
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
      var line = lines_1[_i];
      var depth = getIndentLevel(line);
      if (options.maxDepth !== undefined && depth > options.maxDepth) {
        continue;
      }
      var match = line.match(/^(\s*-\s*)(\w+)(?:\s+"([^"]*)")?(.*)$/);
      if (!match) {
        continue;
      }
      var roleRaw = match[2],
        name_1 = match[3],
        suffix = match[4];
      if (roleRaw.startsWith("/")) {
        continue;
      }
      var role = roleRaw.toLowerCase();
      if (!INTERACTIVE_ROLES.has(role)) {
        continue;
      }
      var ref = nextRef();
      var nth = tracker.getNextIndex(role, name_1);
      tracker.trackRef(role, name_1, ref);
      refs[ref] = {
        role: role,
        name: name_1,
        nth: nth,
      };
      var enhanced = "- ".concat(roleRaw);
      if (name_1) {
        enhanced += ' "'.concat(name_1, '"');
      }
      enhanced += " [ref=".concat(ref, "]");
      if (nth > 0) {
        enhanced += " [nth=".concat(nth, "]");
      }
      if (suffix.includes("[")) {
        enhanced += suffix;
      }
      result_1.push(enhanced);
    }
    removeNthFromNonDuplicates(refs, tracker);
    return {
      snapshot: result_1.join("\n") || "(no interactive elements)",
      refs: refs,
    };
  }
  var result = [];
  for (var _a = 0, lines_2 = lines; _a < lines_2.length; _a++) {
    var line = lines_2[_a];
    var processed = processLine(line, refs, options, tracker, nextRef);
    if (processed !== null) {
      result.push(processed);
    }
  }
  removeNthFromNonDuplicates(refs, tracker);
  var tree = result.join("\n") || "(empty)";
  return {
    snapshot: options.compact ? compactTree(tree) : tree,
    refs: refs,
  };
}
function parseAiSnapshotRef(suffix) {
  var match = suffix.match(/\[ref=(e\d+)\]/i);
  return match ? match[1] : null;
}
/**
 * Build a role snapshot from Playwright's AI snapshot output while preserving Playwright's own
 * aria-ref ids (e.g. ref=e13). This makes the refs self-resolving across calls.
 */
function buildRoleSnapshotFromAiSnapshot(aiSnapshot, options) {
  if (options === void 0) {
    options = {};
  }
  var lines = String(aiSnapshot !== null && aiSnapshot !== void 0 ? aiSnapshot : "").split("\n");
  var refs = {};
  if (options.interactive) {
    var out_1 = [];
    for (var _i = 0, lines_3 = lines; _i < lines_3.length; _i++) {
      var line = lines_3[_i];
      var depth = getIndentLevel(line);
      if (options.maxDepth !== undefined && depth > options.maxDepth) {
        continue;
      }
      var match = line.match(/^(\s*-\s*)(\w+)(?:\s+"([^"]*)")?(.*)$/);
      if (!match) {
        continue;
      }
      var roleRaw = match[2],
        name_2 = match[3],
        suffix = match[4];
      if (roleRaw.startsWith("/")) {
        continue;
      }
      var role = roleRaw.toLowerCase();
      if (!INTERACTIVE_ROLES.has(role)) {
        continue;
      }
      var ref = parseAiSnapshotRef(suffix);
      if (!ref) {
        continue;
      }
      refs[ref] = __assign({ role: role }, name_2 ? { name: name_2 } : {});
      out_1.push(
        "- "
          .concat(roleRaw)
          .concat(name_2 ? ' "'.concat(name_2, '"') : "")
          .concat(suffix),
      );
    }
    return {
      snapshot: out_1.join("\n") || "(no interactive elements)",
      refs: refs,
    };
  }
  var out = [];
  for (var _a = 0, lines_4 = lines; _a < lines_4.length; _a++) {
    var line = lines_4[_a];
    var depth = getIndentLevel(line);
    if (options.maxDepth !== undefined && depth > options.maxDepth) {
      continue;
    }
    var match = line.match(/^(\s*-\s*)(\w+)(?:\s+"([^"]*)")?(.*)$/);
    if (!match) {
      out.push(line);
      continue;
    }
    var roleRaw = match[2],
      name_3 = match[3],
      suffix = match[4];
    if (roleRaw.startsWith("/")) {
      out.push(line);
      continue;
    }
    var role = roleRaw.toLowerCase();
    var isStructural = STRUCTURAL_ROLES.has(role);
    if (options.compact && isStructural && !name_3) {
      continue;
    }
    var ref = parseAiSnapshotRef(suffix);
    if (ref) {
      refs[ref] = __assign({ role: role }, name_3 ? { name: name_3 } : {});
    }
    out.push(line);
  }
  var tree = out.join("\n") || "(empty)";
  return {
    snapshot: options.compact ? compactTree(tree) : tree,
    refs: refs,
  };
}
