"""
System Info Tool - Detailed Windows system information
"""

import platform
import psutil
import subprocess
from typing import Any, Sequence
from mcp.types import Tool, TextContent

class SystemInfoTool:
    """Get detailed Windows system information"""
    
    requires_admin = False
    
    def get_tool_definition(self) -> Tool:
        return Tool(
            name="Windows-MCP:SystemInfo",
            description="Get detailed Windows system information including hardware, OS, performance metrics, and installed software.",
            inputSchema={
                "type": "object",
                "properties": {
                    "category": {
                        "type": "string",
                        "enum": ["all", "cpu", "memory", "disk", "network", "os", "battery", "sensors", "users"],
                        "description": "Information category to retrieve"
                    }
                },
                "required": ["category"]
            }
        )
    
    async def execute(self, arguments: dict) -> Sequence[TextContent]:
        """Execute system info query"""
        category = arguments.get("category", "all")
        
        try:
            info_lines = []
            
            if category in ["all", "os"]:
                info_lines.append("=== OPERATING SYSTEM ===")
                info_lines.append(f"System: {platform.system()}")
                info_lines.append(f"Release: {platform.release()}")
                info_lines.append(f"Version: {platform.version()}")
                info_lines.append(f"Machine: {platform.machine()}")
                info_lines.append(f"Processor: {platform.processor()}")
                info_lines.append(f"Architecture: {platform.architecture()[0]}")
                info_lines.append("")
            
            if category in ["all", "cpu"]:
                info_lines.append("=== CPU ===")
                info_lines.append(f"Physical cores: {psutil.cpu_count(logical=False)}")
                info_lines.append(f"Logical cores: {psutil.cpu_count(logical=True)}")
                cpu_freq = psutil.cpu_freq()
                if cpu_freq:
                    info_lines.append(f"Frequency: {cpu_freq.current:.2f} MHz (Max: {cpu_freq.max:.2f} MHz)")
                cpu_percent = psutil.cpu_percent(interval=1, percpu=True)
                info_lines.append(f"CPU Usage per core: {cpu_percent}")
                info_lines.append(f"Total CPU Usage: {psutil.cpu_percent(interval=1)}%")
                info_lines.append("")
            
            if category in ["all", "memory"]:
                mem = psutil.virtual_memory()
                info_lines.append("=== MEMORY ===")
                info_lines.append(f"Total: {mem.total / (1024**3):.2f} GB")
                info_lines.append(f"Available: {mem.available / (1024**3):.2f} GB")
                info_lines.append(f"Used: {mem.used / (1024**3):.2f} GB ({mem.percent}%)")
                info_lines.append(f"Free: {mem.free / (1024**3):.2f} GB")
                
                swap = psutil.swap_memory()
                info_lines.append(f"\nSwap Total: {swap.total / (1024**3):.2f} GB")
                info_lines.append(f"Swap Used: {swap.used / (1024**3):.2f} GB ({swap.percent}%)")
                info_lines.append("")
            
            if category in ["all", "disk"]:
                info_lines.append("=== DISK ===")
                for partition in psutil.disk_partitions():
                    try:
                        usage = psutil.disk_usage(partition.mountpoint)
                        info_lines.append(f"Drive: {partition.device}")
                        info_lines.append(f"  Mountpoint: {partition.mountpoint}")
                        info_lines.append(f"  File system: {partition.fstype}")
                        info_lines.append(f"  Total: {usage.total / (1024**3):.2f} GB")
                        info_lines.append(f"  Used: {usage.used / (1024**3):.2f} GB ({usage.percent}%)")
                        info_lines.append(f"  Free: {usage.free / (1024**3):.2f} GB")
                        info_lines.append("")
                    except PermissionError:
                        continue
            
            if category in ["all", "network"]:
                info_lines.append("=== NETWORK ===")
                net_io = psutil.net_io_counters()
                info_lines.append(f"Bytes sent: {net_io.bytes_sent / (1024**2):.2f} MB")
                info_lines.append(f"Bytes received: {net_io.bytes_recv / (1024**2):.2f} MB")
                info_lines.append(f"Packets sent: {net_io.packets_sent}")
                info_lines.append(f"Packets received: {net_io.packets_recv}")
                
                info_lines.append("\nNetwork Interfaces:")
                for interface, addrs in psutil.net_if_addrs().items():
                    info_lines.append(f"  {interface}:")
                    for addr in addrs:
                        info_lines.append(f"    {addr.family.name}: {addr.address}")
                info_lines.append("")
            
            if category in ["all", "battery"]:
                battery = psutil.sensors_battery()
                if battery:
                    info_lines.append("=== BATTERY ===")
                    info_lines.append(f"Percent: {battery.percent}%")
                    info_lines.append(f"Plugged in: {battery.power_plugged}")
                    if battery.secsleft != psutil.POWER_TIME_UNLIMITED:
                        hours = battery.secsleft // 3600
                        minutes = (battery.secsleft % 3600) // 60
                        info_lines.append(f"Time remaining: {hours}h {minutes}m")
                    info_lines.append("")
            
            if category in ["all", "users"]:
                info_lines.append("=== USERS ===")
                for user in psutil.users():
                    info_lines.append(f"User: {user.name}")
                    info_lines.append(f"  Terminal: {user.terminal}")
                    info_lines.append(f"  Host: {user.host}")
                    info_lines.append(f"  Started: {user.started}")
                info_lines.append("")
            
            return [TextContent(
                type="text",
                text="\n".join(info_lines)
            )]
        
        except Exception as e:
            return [TextContent(
                type="text",
                text=f"✗ System info query failed: {str(e)}"
            )]
