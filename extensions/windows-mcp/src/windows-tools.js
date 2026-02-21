"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWindowsTools = createWindowsTools;
function createWindowsTools() {
  return [
    {
      name: "windows_screenshot",
      description: "Capture a screenshot of the Windows desktop",
      inputSchema: {
        type: "object",
        properties: {},
      },
    },
    {
      name: "windows_click",
      description: "Click at coordinates using pyautogui",
      inputSchema: {
        type: "object",
        properties: {
          x: { type: "number", description: "X coordinate" },
          y: { type: "number", description: "Y coordinate" },
        },
        required: ["x", "y"],
      },
    },
    {
      name: "windows_type",
      description: "Type text on keyboard",
      inputSchema: {
        type: "object",
        properties: {
          text: { type: "string", description: "Text to type" },
        },
        required: ["text"],
      },
    },
  ];
}
