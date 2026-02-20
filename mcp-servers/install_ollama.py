#!/usr/bin/env python3
"""
Ollama Auto-Installer for OpenClaw
Installs Ollama + DeepSeek-R1 8B + Configures OpenClaw
"""

import os
import subprocess
import urllib.request
import time
import json
from pathlib import Path

def download_ollama():
    """Download Ollama Windows installer"""
    print("📥 Downloading Ollama for Windows...")

    url = "https://ollama.com/download/OllamaSetup.exe"
    output = "OllamaSetup.exe"

    try:
        urllib.request.urlretrieve(url, output)
        print(f"✓ Downloaded: {output}")
        return output
    except Exception as e:
        print(f"❌ Download failed: {e}")
        print("\n📌 Manual download: https://ollama.com/download/windows")
        return None

def install_ollama(installer_path):
    """Run Ollama installer"""
    print("\n🔧 Installing Ollama...")
    print("   (Installation window will open)")

    try:
        # Run installer (silent mode)
        subprocess.run([installer_path, "/S"], check=True)
        print("✓ Ollama installed!")
        return True
    except Exception as e:
        print(f"❌ Installation failed: {e}")
        print("\nPlease run manually: double-click OllamaSetup.exe")
        return False

def wait_for_ollama():
    """Wait for Ollama service to start"""
    print("\n⏳ Waiting for Ollama service to start...")

    for i in range(30):
        try:
            result = subprocess.run(
                ["ollama", "list"], 
                capture_output=True, 
                timeout=5
            )
            if result.returncode == 0:
                print("✓ Ollama service is running!")
                return True
        except:
            pass

        time.sleep(2)
        print(f"   Waiting... ({i+1}/30)")

    print("⚠ Ollama may need manual start")
    return False

def pull_model(model_name):
    """Download AI model"""
    print(f"\n🤖 Downloading {model_name}...")
    print("   (This may take 5-10 minutes)")

    try:
        subprocess.run(["ollama", "pull", model_name], check=True)
        print(f"✓ {model_name} downloaded!")
        return True
    except Exception as e:
        print(f"❌ Model download failed: {e}")
        return False

def configure_openclaw(model_name):
    """Update OpenClaw configuration"""
    print(f"\n⚙️ Configuring OpenClaw to use {model_name}...")

    config_path = Path.home() / ".openclaw" / "openclaw.json"

    try:
        # Create .openclaw directory if needed
        config_path.parent.mkdir(parents=True, exist_ok=True)

        # Load existing config or create new
        if config_path.exists():
            with open(config_path, 'r') as f:
                config = json.load(f)
        else:
            config = {}

        # Update gateway config
        if "gateway" not in config:
            config["gateway"] = {}

        config["gateway"]["agentModel"] = f"ollama/{model_name}"
        config["gateway"]["baseURL"] = "http://localhost:11434"

        # Save config
        with open(config_path, 'w') as f:
            json.dump(config, f, indent=2)

        print(f"✓ OpenClaw configured!")
        print(f"   Config: {config_path}")
        return True

    except Exception as e:
        print(f"❌ Configuration failed: {e}")
        return False

def test_ollama():
    """Test Ollama installation"""
    print("\n🧪 Testing Ollama...")

    try:
        result = subprocess.run(
            ["ollama", "list"],
            capture_output=True,
            text=True,
            timeout=10
        )

        if result.returncode == 0:
            print("✓ Ollama is working!")
            print("\nInstalled models:")
            print(result.stdout)
            return True
        else:
            print("❌ Ollama test failed")
            return False

    except Exception as e:
        print(f"❌ Test failed: {e}")
        return False

def main():
    print("="*60)
    print("🦙 OLLAMA AUTO-INSTALLER FOR OPENCLAW")
    print("="*60)
    print()

    # Step 1: Download
    installer = download_ollama()
    if not installer:
        return

    # Step 2: Install
    if not install_ollama(installer):
        return

    # Step 3: Wait for service
    wait_for_ollama()

    # Step 4: Pull model
    model = "deepseek-r1:8b"
    print(f"\n📌 Selected model: {model}")
    print("   Size: ~4.9GB")
    print("   Quality: Excellent")
    print()

    choice = input("Continue with DeepSeek-R1 8B? (Y/n): ").strip().lower()

    if choice in ['', 'y', 'yes']:
        if not pull_model(model):
            print("\n⚠ You can try manually:")
            print(f"   ollama pull {model}")
            return
    else:
        print("\n📋 Available models:")
        print("   ollama pull deepseek-r1:8b      # Best overall")
        print("   ollama pull qwen2.5:7b          # Fastest")
        print("   ollama pull llama3.2:3b         # Smallest")
        return

    # Step 5: Configure OpenClaw
    configure_openclaw(model)

    # Step 6: Test
    test_ollama()

    # Done!
    print()
    print("="*60)
    print("🎉 INSTALLATION COMPLETE!")
    print("="*60)
    print()
    print("🚀 Next steps:")
    print("   1. Restart OpenClaw: openclaw gateway")
    print("   2. Send WhatsApp message")
    print("   3. No more API costs! 💰")
    print()
    print("📊 Monitor usage:")
    print("   ollama ps              # Running models")
    print("   ollama list            # Installed models")
    print(f"   ollama run {model}     # Chat directly")
    print()

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n👋 Installation cancelled")
    except Exception as e:
        print(f"\n\n❌ Error: {e}")
