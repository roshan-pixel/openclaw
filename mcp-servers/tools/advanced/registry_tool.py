"""
Registry Tool - Windows Registry operations
"""

import winreg
from typing import Any, Sequence
from mcp.types import Tool, TextContent

class RegistryTool:
    """Windows Registry read/write operations"""
    
    requires_admin = True
    
    def get_tool_definition(self) -> Tool:
        return Tool(
            name="Windows-MCP:Registry",
            description="Read, write, and manage Windows Registry keys and values. Requires admin privileges.",
            inputSchema={
                "type": "object",
                "properties": {
                    "action": {
                        "type": "string",
                        "enum": ["read", "write", "delete", "list_keys", "list_values"],
                        "description": "Registry operation to perform"
                    },
                    "hive": {
                        "type": "string",
                        "enum": ["HKEY_LOCAL_MACHINE", "HKEY_CURRENT_USER", "HKEY_CLASSES_ROOT", "HKEY_USERS", "HKEY_CURRENT_CONFIG"],
                        "description": "Registry hive"
                    },
                    "key_path": {
                        "type": "string",
                        "description": "Registry key path (e.g., 'Software\\Microsoft\\Windows')"
                    },
                    "value_name": {
                        "type": "string",
                        "description": "Registry value name (optional for list operations)"
                    },
                    "value_data": {
                        "type": "string",
                        "description": "Data to write (for write action)"
                    },
                    "value_type": {
                        "type": "string",
                        "enum": ["REG_SZ", "REG_DWORD", "REG_BINARY", "REG_MULTI_SZ", "REG_EXPAND_SZ"],
                        "description": "Registry value type (for write action)"
                    },
                    "confirmed": {
                        "type": "boolean",
                        "default": False,
                        "description": "Set to true to confirm write/delete operations. Required for any action that modifies the registry."
                    }
                },
                "required": ["action", "hive", "key_path"]
            }
        )
    
    def _get_hive(self, hive_name: str):
        """Convert hive name to winreg constant"""
        hives = {
            "HKEY_LOCAL_MACHINE": winreg.HKEY_LOCAL_MACHINE,
            "HKEY_CURRENT_USER": winreg.HKEY_CURRENT_USER,
            "HKEY_CLASSES_ROOT": winreg.HKEY_CLASSES_ROOT,
            "HKEY_USERS": winreg.HKEY_USERS,
            "HKEY_CURRENT_CONFIG": winreg.HKEY_CURRENT_CONFIG
        }
        return hives.get(hive_name)
    
    def _get_value_type(self, type_name: str):
        """Convert type name to winreg constant"""
        types = {
            "REG_SZ": winreg.REG_SZ,
            "REG_DWORD": winreg.REG_DWORD,
            "REG_BINARY": winreg.REG_BINARY,
            "REG_MULTI_SZ": winreg.REG_MULTI_SZ,
            "REG_EXPAND_SZ": winreg.REG_EXPAND_SZ
        }
        return types.get(type_name, winreg.REG_SZ)
    
    async def execute(self, arguments: dict) -> Sequence[TextContent]:
        """Execute registry operation"""
        action = arguments.get("action")
        hive_name = arguments.get("hive")
        key_path = arguments.get("key_path")
        value_name = arguments.get("value_name", "")

        # Require explicit confirmation for any mutating operation
        if action in ("write", "delete") and not arguments.get("confirmed", False):
            return [TextContent(
                type="text",
                text=f"✗ Registry {action} requires confirmed=true. Set confirmed=true to acknowledge this will modify the registry."
            )]

        hive = self._get_hive(hive_name)
        
        try:
            if action == "read":
                with winreg.OpenKey(hive, key_path) as key:
                    value_data, value_type = winreg.QueryValueEx(key, value_name)
                    return [TextContent(
                        type="text",
                        text=f"✓ Registry value read:\nPath: {hive_name}\\{key_path}\\{value_name}\nData: {value_data}\nType: {value_type}"
                    )]
            
            elif action == "write":
                value_data = arguments.get("value_data")
                value_type_name = arguments.get("value_type", "REG_SZ")
                value_type = self._get_value_type(value_type_name)
                
                # Convert data based on type
                if value_type == winreg.REG_DWORD:
                    value_data = int(value_data)
                
                with winreg.OpenKey(hive, key_path, 0, winreg.KEY_SET_VALUE) as key:
                    winreg.SetValueEx(key, value_name, 0, value_type, value_data)
                    return [TextContent(
                        type="text",
                        text=f"✓ Registry value written:\nPath: {hive_name}\\{key_path}\\{value_name}\nData: {value_data}"
                    )]
            
            elif action == "delete":
                with winreg.OpenKey(hive, key_path, 0, winreg.KEY_SET_VALUE) as key:
                    winreg.DeleteValue(key, value_name)
                    return [TextContent(
                        type="text",
                        text=f"✓ Registry value deleted:\nPath: {hive_name}\\{key_path}\\{value_name}"
                    )]
            
            elif action == "list_keys":
                subkeys = []
                with winreg.OpenKey(hive, key_path) as key:
                    i = 0
                    while True:
                        try:
                            subkey = winreg.EnumKey(key, i)
                            subkeys.append(subkey)
                            i += 1
                        except OSError:
                            break
                
                return [TextContent(
                    type="text",
                    text=f"✓ Subkeys in {hive_name}\\{key_path}:\n" + "\n".join(f"  - {k}" for k in subkeys)
                )]
            
            elif action == "list_values":
                values = []
                with winreg.OpenKey(hive, key_path) as key:
                    i = 0
                    while True:
                        try:
                            name, data, vtype = winreg.EnumValue(key, i)
                            values.append(f"{name} = {data} (type: {vtype})")
                            i += 1
                        except OSError:
                            break
                
                return [TextContent(
                    type="text",
                    text=f"✓ Values in {hive_name}\\{key_path}:\n" + "\n".join(f"  - {v}" for v in values)
                )]
        
        except PermissionError:
            return [TextContent(
                type="text",
                text=f"✗ Permission denied. Run as administrator (GodMode required)."
            )]
        except FileNotFoundError:
            return [TextContent(
                type="text",
                text=f"✗ Registry key not found: {hive_name}\\{key_path}"
            )]
        except Exception as e:
            return [TextContent(
                type="text",
                text=f"✗ Registry operation failed: {str(e)}"
            )]
