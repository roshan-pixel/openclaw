#!/usr/bin/env python3
"""
MCP Server Stdio Diagnostic Tool
Tests MCP servers to find exactly where stdout pollution occurs
"""

import subprocess
import json
import sys
import time
from datetime import datetime

def log(msg):
    """Print timestamped log to stderr"""
    print(f"[{datetime.now().strftime('%H:%M:%S')}] {msg}", file=sys.stderr)

def test_mcp_server(server_script, test_name="Test"):
    """
    Test an MCP server and capture ALL output to diagnose pollution
    Returns: (success, diagnostics_dict)
    """
    log(f"\n{'='*70}")
    log(f"Testing: {server_script}")
    log(f"{'='*70}")
    
    diagnostics = {
        "server": server_script,
        "test_name": test_name,
        "success": False,
        "phases": {},
        "raw_outputs": {},
        "errors": []
    }
    
    try:
        log("Starting MCP server process...")
        proc = subprocess.Popen(
            ["python", server_script],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            bufsize=1
        )
        
        diagnostics["phases"]["process_started"] = True
        log("✓ Process started")
        
        # Give it a moment to crash if it's going to
        time.sleep(0.5)
        if proc.poll() is not None:
            diagnostics["errors"].append(f"Process crashed immediately with code {proc.returncode}")
            stderr = proc.stderr.read()
            diagnostics["raw_outputs"]["stderr_on_crash"] = stderr
            log(f"✗ Process crashed! Return code: {proc.returncode}")
            log(f"Stderr: {stderr[:500]}")
            return False, diagnostics
        
        def send_jsonrpc(method, params=None, req_id=1):
            """Send JSON-RPC request and try to read response"""
            request = {
                "jsonrpc": "2.0",
                "id": req_id,
                "method": method
            }
            if params:
                request["params"] = params
            
            request_json = json.dumps(request)
            log(f"→ Sending: {method} (id={req_id})")
            
            try:
                proc.stdin.write(request_json + "\n")
                proc.stdin.flush()
            except Exception as e:
                diagnostics["errors"].append(f"Failed to send {method}: {str(e)}")
                log(f"✗ Failed to send: {e}")
                return None
            
            # Try to read response
            try:
                log("  Waiting for response...")
                response_line = proc.stdout.readline()
                
                if not response_line:
                    diagnostics["errors"].append(f"No response for {method} (EOF)")
                    log("✗ No response (EOF)")
                    return None
                
                # Check if it's valid JSON
                try:
                    response = json.loads(response_line)
                    log(f"✓ Got valid JSON response ({len(response_line)} bytes)")
                    return response
                except json.JSONDecodeError as je:
                    diagnostics["errors"].append(f"Invalid JSON response for {method}: {str(je)}")
                    diagnostics["raw_outputs"][f"bad_response_{method}"] = response_line[:200]
                    log(f"✗ Invalid JSON: {str(je)}")
                    log(f"  First 200 chars: {repr(response_line[:200])}")
                    
                    # Try to read any additional garbage
                    try:
                        proc.stdout.settimeout(0.5)
                        extra = proc.stdout.read(1000)
                        if extra:
                            diagnostics["raw_outputs"][f"extra_output_{method}"] = extra[:500]
                            log(f"  Extra output found: {repr(extra[:200])}")
                    except:
                        pass
                    
                    return None
                    
            except Exception as e:
                diagnostics["errors"].append(f"Error reading response for {method}: {str(e)}")
                log(f"✗ Error reading response: {e}")
                return None
        
        # Test 1: Initialize
        log("\n--- Phase 1: Initialize ---")
        response = send_jsonrpc("initialize", {
            "protocolVersion": "2024-11-05",
            "capabilities": {},
            "clientInfo": {"name": "diagnostic-client", "version": "1.0.0"}
        })
        
        if response and "result" in response:
            diagnostics["phases"]["initialize"] = True
            server_info = response["result"].get("serverInfo", {})
            log(f"✓ Initialize successful")
            log(f"  Server: {server_info.get('name', 'unknown')}")
        else:
            diagnostics["phases"]["initialize"] = False
            log("✗ Initialize failed")
            # Don't continue if initialize fails
            proc.terminate()
            return False, diagnostics
        
        # Test 2: Send initialized notification
        log("\n--- Phase 2: Initialized notification ---")
        notification = {"jsonrpc": "2.0", "method": "notifications/initialized"}
        try:
            proc.stdin.write(json.dumps(notification) + "\n")
            proc.stdin.flush()
            diagnostics["phases"]["initialized_notification"] = True
            log("✓ Notification sent")
        except Exception as e:
            diagnostics["phases"]["initialized_notification"] = False
            diagnostics["errors"].append(f"Failed to send notification: {str(e)}")
            log(f"✗ Failed: {e}")
        
        # Test 3: List tools
        log("\n--- Phase 3: List tools ---")
        response = send_jsonrpc("tools/list", request_id=2)
        
        if response and "result" in response:
            tools = response["result"].get("tools", [])
            diagnostics["phases"]["list_tools"] = len(tools)
            log(f"✓ List tools successful: {len(tools)} tools found")
            for i, tool in enumerate(tools[:3], 1):
                log(f"  {i}. {tool['name']}")
            if len(tools) > 3:
                log(f"  ... and {len(tools)-3} more")
        else:
            diagnostics["phases"]["list_tools"] = 0
            log("✗ List tools failed")
        
        # Test 4: Call a tool (if available)
        if diagnostics["phases"].get("list_tools", 0) > 0:
            log("\n--- Phase 4: Call tool ---")
            
            # Find a safe tool to test
            test_tool = None
            for tool in tools:
                if "wait" in tool["name"].lower():
                    test_tool = tool
                    break
                if "snapshot" in tool["name"].lower():
                    test_tool = tool
                    break
            
            if test_tool:
                log(f"Testing tool: {test_tool['name']}")
                
                # Prepare arguments based on tool
                if "wait" in test_tool["name"].lower():
                    args = {"seconds": 0.1}
                elif "snapshot" in test_tool["name"].lower():
                    args = {"use_vision": False}
                else:
                    args = {}
                
                response = send_jsonrpc("tools/call", {
                    "name": test_tool["name"],
                    "arguments": args
                }, request_id=3)
                
                if response and "result" in response:
                    diagnostics["phases"]["call_tool"] = True
                    log("✓ Tool call successful")
                    content = response["result"].get("content", [])
                    if content and len(content) > 0:
                        first_content = content[0]
                        if first_content.get("type") == "text":
                            log(f"  Result: {first_content.get('text', '')[:100]}")
                        elif first_content.get("type") == "image":
                            log(f"  Result: Image returned ({len(first_content.get('data', ''))} bytes)")
                else:
                    diagnostics["phases"]["call_tool"] = False
                    log("✗ Tool call failed")
            else:
                log("⊘ No safe tool found to test")
        
        # All tests passed
        diagnostics["success"] = all([
            diagnostics["phases"].get("initialize", False),
            diagnostics["phases"].get("list_tools", 0) > 0
        ])
        
        if diagnostics["success"]:
            log("\n✅ ALL TESTS PASSED")
        else:
            log("\n❌ SOME TESTS FAILED")
        
        return diagnostics["success"], diagnostics
        
    except Exception as e:
        diagnostics["errors"].append(f"Test exception: {str(e)}")
        log(f"\n✗ Test failed with exception: {e}")
        import traceback
        traceback.print_exc()
        return False, diagnostics
        
    finally:
        try:
            proc.terminate()
            proc.wait(timeout=2)
            log("\nServer process terminated")
        except:
            try:
                proc.kill()
            except:
                pass

def main():
    """Run diagnostics on available MCP servers"""
    print("=" * 70, file=sys.stderr)
    print("MCP SERVER STDIO DIAGNOSTIC TOOL", file=sys.stderr)
    print("=" * 70, file=sys.stderr)
    
    servers_to_test = [
        ("minimal_screenshot_mcp.py", "Minimal Screenshot Server"),
        ("windows_mcp_server_ultraclean.py", "Ultra-Clean Windows Server"),
        ("windows_mcp_server.py", "Original Windows Server"),
    ]
    
    results = []
    
    for server_file, test_name in servers_to_test:
        if not os.path.exists(server_file):
            log(f"\n⊘ Skipping {server_file} (not found)")
            continue
        
        success, diagnostics = test_mcp_server(server_file, test_name)
        results.append((test_name, success, diagnostics))
        
        time.sleep(1)  # Brief pause between tests
    
    # Summary
    print("\n" + "=" * 70, file=sys.stderr)
    print("SUMMARY", file=sys.stderr)
    print("=" * 70, file=sys.stderr)
    
    for test_name, success, diagnostics in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"\n{status} - {test_name}", file=sys.stderr)
        
        if not success:
            print(f"  Errors:", file=sys.stderr)
            for error in diagnostics.get("errors", [])[:3]:
                print(f"    • {error}", file=sys.stderr)
        
        phases = diagnostics.get("phases", {})
        print(f"  Phases:", file=sys.stderr)
        for phase, result in phases.items():
            print(f"    {phase}: {result}", file=sys.stderr)
    
    print("\n" + "=" * 70, file=sys.stderr)
    
    # Return exit code based on results
    if any(success for _, success, _ in results):
        print("✅ At least one server passed all tests", file=sys.stderr)
        return 0
    else:
        print("❌ All servers failed", file=sys.stderr)
        return 1

if __name__ == "__main__":
    import os
    sys.exit(main())
