#!/usr/bin/env python3
"""
OpenClaw All-in-One Startup Script - FIXED
Properly locates and starts OpenClaw gateway
"""

import os
import sys
import json
import subprocess
import threading
import time
import shutil
from pathlib import Path
from datetime import datetime

# Color codes
class Colors:
    GREEN = ''
    RED = ''
    YELLOW = ''
    BLUE = ''
    RESET = ''
    BOLD = ''

if os.name == 'nt':
    try:
        import colorama
        colorama.init()
        Colors.GREEN = '\033[92m'
        Colors.RED = '\033[91m'
        Colors.YELLOW = '\033[93m'
        Colors.BLUE = '\033[94m'
        Colors.RESET = '\033[0m'
        Colors.BOLD = '\033[1m'
    except ImportError:
        pass

def print_header(text):
    print("\n" + "=" * 70)
    print(f"{Colors.BOLD}{text}{Colors.RESET}")
    print("=" * 70)

def print_ok(text):
    print(f"{Colors.GREEN}[OK]{Colors.RESET} {text}")

def print_error(text):
    print(f"{Colors.RED}[ERROR]{Colors.RESET} {text}")

def print_warn(text):
    print(f"{Colors.YELLOW}[WARN]{Colors.RESET} {text}")

def print_info(text):
    print(f"{Colors.BLUE}[INFO]{Colors.RESET} {text}")


class APIHealthChecker:
    def __init__(self):
        self.checks_passed = 0
        self.checks_failed = 0
        self.checks_warned = 0

    def check_file_exists(self, path, description):
        print(f"\nChecking {description}...")
        if os.path.exists(path):
            print_ok(f"Found: {path}")
            self.checks_passed += 1
            return True
        else:
            print_error(f"Not found: {path}")
            self.checks_failed += 1
            return False

    def check_json_valid(self, path, description):
        print(f"\nValidating {description}...")
        try:
            with open(path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            print_ok(f"Valid JSON file")
            self.checks_passed += 1
            return data
        except Exception as e:
            print_error(f"Error: {e}")
            self.checks_failed += 1
            return None

    def check_google_vision_api(self):
        print_header("GOOGLE CLOUD VISION API")
        config_path = "config/vision_config.json"

        if not self.check_file_exists(config_path, "Vision config"):
            return False

        config = self.check_json_valid(config_path, "Vision config")
        if not config:
            return False

        if not config.get('enabled', False):
            print_warn("Vision API is disabled in config")
            self.checks_warned += 1
            return True

        creds_path = config.get('credentials_path', '')
        if not os.path.isabs(creds_path):
            creds_path = os.path.normpath(os.path.join(os.path.dirname(config_path), creds_path))

        if not os.path.exists(creds_path):
            print_error(f"Credentials not found: {creds_path}")
            self.checks_failed += 1
            return False

        print_ok(f"Credentials found")

        try:
            with open(creds_path, 'r') as f:
                creds = json.load(f)
            print_ok(f"Valid service account")
            print_info(f"  Project: {creds['project_id']}")

            from google.cloud import vision
            print_ok("Library installed")
            os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = creds_path
            vision.ImageAnnotatorClient()
            print_ok("API initialized")
            self.checks_passed += 1
            return True
        except Exception as e:
            print_error(f"Failed: {e}")
            self.checks_failed += 1
            return False

    def check_anthropic_api(self):
        print_header("ANTHROPIC CLAUDE API")

        api_key = os.environ.get('ANTHROPIC_API_KEY', '')
        if not api_key:
            env_path = '../.env'
            if os.path.exists(env_path):
                with open(env_path, 'r') as f:
                    for line in f:
                        if line.startswith('ANTHROPIC_API_KEY='):
                            api_key = line.split('=', 1)[1].strip()
                            break

        if not api_key:
            print_error("ANTHROPIC_API_KEY not found")
            self.checks_failed += 1
            return False

        if not api_key.startswith('sk-ant-'):
            print_error("Invalid API key format")
            self.checks_failed += 1
            return False

        print_ok(f"API key: {api_key[:20]}...{api_key[-4:]}")
        self.checks_passed += 1
        return True

    def check_mcp_config(self):
        print_header("MCP CONFIGURATION")
        config_path = "config/mcp_config.json"

        if not self.check_file_exists(config_path, "MCP config"):
            return False

        config = self.check_json_valid(config_path, "MCP config")
        if not config:
            return False

        servers = config.get('mcpServers', {})
        print_info(f"Found {len(servers)} MCP server(s)")
        self.checks_passed += 1
        return True

    def check_rest_api_config(self):
        print_header("REST API CONFIGURATION")

        if os.path.exists('openclaw_gateway.py'):
            print_ok("Gateway file found")
            self.checks_passed += 1
            return True
        else:
            print_error("Gateway file not found")
            self.checks_failed += 1
            return False

    def run_all_checks(self):
        print_header("OPENCLAW GATEWAY - API HEALTH CHECK")
        print_info(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

        self.check_mcp_config()
        self.check_rest_api_config()
        self.check_google_vision_api()
        self.check_anthropic_api()

        print_header("HEALTH CHECK SUMMARY")
        print(f"  Passed:  {Colors.GREEN}{self.checks_passed}{Colors.RESET}")
        print(f"  Warnings: {Colors.YELLOW}{self.checks_warned}{Colors.RESET}")
        print(f"  Failed:  {Colors.RED}{self.checks_failed}{Colors.RESET}")

        if self.checks_failed > 0:
            print(f"\n{Colors.RED}[CRITICAL] Fix errors before starting{Colors.RESET}")
            return False
        else:
            print(f"\n{Colors.GREEN}[SUCCESS] Ready to start{Colors.RESET}")
            return True


def find_openclaw_command():
    """Find openclaw executable"""
    # Try common locations
    locations = [
        'openclaw',  # In PATH
        'openclaw.exe',
        'openclaw.cmd',
        shutil.which('openclaw'),  # Search PATH
        os.path.expanduser('~/.cargo/bin/openclaw'),
        os.path.expanduser('~/AppData/Local/Programs/openclaw/openclaw.exe'),
    ]

    for loc in locations:
        if loc and shutil.which(loc):
            return loc

    return None


def start_rest_gateway():
    """Start REST API gateway"""
    try:
        import uvicorn
        print_info("REST API starting on port 8000...")
        uvicorn.run(
            "openclaw_gateway:app",
            host="0.0.0.0",
            port=8000,
            reload=False,
            log_level="info"
        )
    except Exception as e:
        print_error(f"REST gateway error: {e}")


def start_openclaw_gateway():
    """Start OpenClaw gateway"""
    print_info("Looking for OpenClaw...")
    time.sleep(3)

    openclaw_cmd = find_openclaw_command()

    if not openclaw_cmd:
        print_error("OpenClaw command not found!")
        print_info("Start it manually in another window:")
        print_info("  cd .. && openclaw gateway")
        return

    print_ok(f"Found: {openclaw_cmd}")
    print_info("Starting OpenClaw gateway...")

    try:
        # Change to parent directory for openclaw
        os.chdir('..')
        subprocess.run([openclaw_cmd, 'gateway'], check=True)
    except subprocess.CalledProcessError as e:
        print_error(f"OpenClaw failed: {e}")
    except KeyboardInterrupt:
        print_info("Stopped by user")
    finally:
        os.chdir('mcp-servers')


def main():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    checker = APIHealthChecker()
    if not checker.run_all_checks():
        print(f"\n{Colors.RED}Startup cancelled{Colors.RESET}")
        sys.exit(1)

    print_header("STARTING GATEWAYS")

    # Start REST API in background
    rest_thread = threading.Thread(target=start_rest_gateway, daemon=True)
    rest_thread.start()

    # Start OpenClaw
    try:
        start_openclaw_gateway()
    except KeyboardInterrupt:
        print(f"\n{Colors.YELLOW}Stopped by user{Colors.RESET}")
        sys.exit(0)


if __name__ == "__main__":
    main()
