#!/usr/bin/env python3
"""
WhatsApp → OpenClaw Gateway v4.0 Memory Bridge
=============================================
Forwards WhatsApp messages to advanced memory systems:
- Semantic Graph Memory (Knowledge Graph)
- Sentient Conversation (Personality Learning)
- Predictive Execution (Pattern Learning)

Author: OpenClaw v4.0
Date: Feb 2026
"""

import asyncio
import os
import websockets
import json
import requests
from datetime import datetime
from typing import Dict, Any, Optional
import logging
import signal
import sys
import time

# ============================================================
# CONFIGURATION
# ============================================================

# Gateway v4.0 settings
GATEWAY_URL = "http://localhost:8000"
GATEWAY_API_KEY = os.environ.get("WINCLAW_API_KEY", "")

# OpenClaw CLI WebSocket
OPENCLAW_WS = "ws://127.0.0.1:18789"

# Memory settings
STORE_IN_SEMANTIC_MEMORY = True      # Store all messages in knowledge graph
LEARN_PERSONALITY = True              # Learn user personality patterns
ENABLE_PREDICTIVE_LEARNING = True    # Learn action patterns

# Filtering
MIN_MESSAGE_LENGTH = 3               # Ignore very short messages
IGNORED_USERS = []                   # List of user IDs to ignore
IGNORED_KEYWORDS = ["spam", "ad"]    # Ignore messages with these keywords

# Logging
LOG_FILE = "logs/whatsapp_bridge.log"

# ============================================================
# LOGGING SETUP
# ============================================================

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(LOG_FILE),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("whatsapp_bridge")

# ============================================================
# STATISTICS
# ============================================================

stats = {
    "messages_received": 0,
    "messages_stored": 0,
    "messages_filtered": 0,
    "memory_errors": 0,
    "started_at": datetime.now().isoformat()
}

# ============================================================
# MEMORY FUNCTIONS
# ============================================================

def store_in_semantic_memory(user_id: str, message: str, metadata: Optional[Dict] = None) -> bool:
    """
    Store WhatsApp message in Semantic Graph Memory.

    Args:
        user_id: WhatsApp user ID
        message: Message text
        metadata: Additional metadata

    Returns:
        True if successful, False otherwise
    """
    if not STORE_IN_SEMANTIC_MEMORY:
        return True

    try:
        # Create enriched content
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        content = f"[{timestamp}] WhatsApp from {user_id}: {message}"

        # Add metadata if available
        if metadata:
            content += f" | Metadata: {json.dumps(metadata)}"

        response = requests.post(
            f"{GATEWAY_URL}/memory/add",
            params={
                "content": content,
                "node_type": "whatsapp_message",
                "importance": 0.8
            },
            headers={"X-API-Key": GATEWAY_API_KEY},
            timeout=5
        )

        if response.status_code == 200:
            logger.info(f"✓ Stored in Semantic Memory: {user_id}")
            return True
        else:
            logger.warning(f"✗ Semantic Memory failed: {response.status_code}")
            return False

    except Exception as e:
        logger.error(f"✗ Semantic Memory error: {e}")
        stats["memory_errors"] += 1
        return False


def learn_personality(user_id: str, message: str) -> Optional[Dict[str, Any]]:
    """
    Send message to Sentient Chat for personality learning.

    Args:
        user_id: WhatsApp user ID
        message: Message text

    Returns:
        Response data if successful, None otherwise
    """
    if not LEARN_PERSONALITY:
        return None

    try:
        response = requests.post(
            f"{GATEWAY_URL}/sentient/chat",
            json={
                "user_id": user_id,
                "message": message
            },
            headers={"X-API-Key": GATEWAY_API_KEY},
            timeout=10
        )

        if response.status_code == 200:
            data = response.json()
            mood = data.get("mood", {})
            logger.info(f"✓ Personality learned: {user_id} | Mood: {mood.get('primary', 'neutral')}")
            return data
        else:
            logger.warning(f"✗ Sentient Chat failed: {response.status_code}")
            return None

    except Exception as e:
        logger.error(f"✗ Sentient Chat error: {e}")
        stats["memory_errors"] += 1
        return None


def should_process_message(user_id: str, message: str) -> bool:
    """
    Filter messages based on configuration.

    Args:
        user_id: WhatsApp user ID
        message: Message text

    Returns:
        True if message should be processed
    """
    # Check user blacklist
    if user_id in IGNORED_USERS:
        logger.debug(f"Filtered: User {user_id} is ignored")
        return False

    # Check message length
    if len(message.strip()) < MIN_MESSAGE_LENGTH:
        logger.debug(f"Filtered: Message too short ({len(message)} chars)")
        return False

    # Check keywords
    message_lower = message.lower()
    for keyword in IGNORED_KEYWORDS:
        if keyword in message_lower:
            logger.debug(f"Filtered: Contains ignored keyword '{keyword}'")
            return False

    return True


# ============================================================
# WEBSOCKET HANDLERS
# ============================================================

async def handle_whatsapp_message(data: Dict[str, Any]):
    """
    Process incoming WhatsApp message.

    Args:
        data: Message data from WebSocket
    """
    stats["messages_received"] += 1

    # Extract message details
    user_id = data.get("from", "unknown")
    message = data.get("text", "")
    metadata = data.get("metadata", {})

    logger.info(f"📱 WhatsApp Message:")
    logger.info(f"   From: {user_id}")
    logger.info(f"   Text: {message[:100]}...")

    # Filter message
    if not should_process_message(user_id, message):
        stats["messages_filtered"] += 1
        return

    # Store in memory systems (parallel for speed)
    success = True

    # 1. Semantic Memory
    if STORE_IN_SEMANTIC_MEMORY:
        semantic_success = store_in_semantic_memory(user_id, message, metadata)
        success = success and semantic_success

    # 2. Sentient Learning
    if LEARN_PERSONALITY:
        personality_data = learn_personality(user_id, message)
        if personality_data:
            logger.info(f"   → User Profile Updated")

    if success:
        stats["messages_stored"] += 1
        logger.info(f"✓ Message processed successfully")
    else:
        logger.warning(f"⚠ Message processing had errors")


async def websocket_listener():
    """
    Main WebSocket listener loop.
    """
    reconnect_delay = 1
    max_reconnect_delay = 60

    while True:
        try:
            logger.info(f"Connecting to OpenClaw CLI at {OPENCLAW_WS}...")

            async with websockets.connect(OPENCLAW_WS) as websocket:
                logger.info("✓ Connected to OpenClaw CLI")
                logger.info("✓ Listening for WhatsApp messages...")
                reconnect_delay = 1  # Reset on successful connection

                async for message in websocket:
                    try:
                        data = json.loads(message)

                        # Check if it's a WhatsApp message
                        msg_type = data.get("type", "")

                        if "whatsapp" in msg_type.lower() or data.get("source") == "whatsapp":
                            await handle_whatsapp_message(data)
                        else:
                            logger.debug(f"Ignored non-WhatsApp message: {msg_type}")

                    except json.JSONDecodeError:
                        logger.warning("Failed to parse WebSocket message")
                    except Exception as e:
                        logger.error(f"Error processing message: {e}", exc_info=True)

        except websockets.exceptions.ConnectionClosed:
            logger.warning(f"WebSocket connection closed. Reconnecting in {reconnect_delay}s...")
            await asyncio.sleep(reconnect_delay)
            reconnect_delay = min(reconnect_delay * 2, max_reconnect_delay)

        except Exception as e:
            logger.error(f"WebSocket error: {e}")
            logger.info(f"Reconnecting in {reconnect_delay}s...")
            await asyncio.sleep(reconnect_delay)
            reconnect_delay = min(reconnect_delay * 2, max_reconnect_delay)


# ============================================================
# STATISTICS & MONITORING
# ============================================================

async def print_stats():
    """Print statistics periodically."""
    while True:
        await asyncio.sleep(300)  # Every 5 minutes

        runtime = (datetime.now() - datetime.fromisoformat(stats["started_at"])).total_seconds()

        logger.info("=" * 60)
        logger.info("📊 STATISTICS")
        logger.info("=" * 60)
        logger.info(f"Runtime: {runtime/60:.1f} minutes")
        logger.info(f"Messages Received: {stats['messages_received']}")
        logger.info(f"Messages Stored: {stats['messages_stored']}")
        logger.info(f"Messages Filtered: {stats['messages_filtered']}")
        logger.info(f"Memory Errors: {stats['memory_errors']}")
        logger.info("=" * 60)


def check_gateway_health() -> bool:
    """
    Check if Gateway v4.0 is running and accessible.

    Returns:
        True if gateway is healthy
    """
    try:
        response = requests.get(
            f"{GATEWAY_URL}/health",
            timeout=5
        )

        if response.status_code == 200:
            data = response.json()
            logger.info("✓ Gateway v4.0 is healthy")
            logger.info(f"  → Status: {data.get('status')}")
            logger.info(f"  → Memory Active: {data.get('semantic_memory_active')}")
            logger.info(f"  → Sentient Active: {data.get('sentient_conversation_active')}")
            return True
        else:
            logger.error(f"✗ Gateway unhealthy: {response.status_code}")
            return False

    except Exception as e:
        logger.error(f"✗ Cannot reach Gateway: {e}")
        logger.error("Make sure Gateway v4.0 is running on port 8000!")
        return False


# ============================================================
# SIGNAL HANDLERS
# ============================================================

def signal_handler(sig, frame):
    """Handle Ctrl+C gracefully."""
    logger.info("\n\nShutting down WhatsApp Memory Bridge...")

    # Print final stats
    runtime = (datetime.now() - datetime.fromisoformat(stats["started_at"])).total_seconds()

    logger.info("=" * 60)
    logger.info("📊 FINAL STATISTICS")
    logger.info("=" * 60)
    logger.info(f"Runtime: {runtime/60:.1f} minutes")
    logger.info(f"Messages Received: {stats['messages_received']}")
    logger.info(f"Messages Stored: {stats['messages_stored']}")
    logger.info(f"Messages Filtered: {stats['messages_filtered']}")
    logger.info(f"Memory Errors: {stats['memory_errors']}")
    logger.info("=" * 60)

    sys.exit(0)


# ============================================================
# MAIN
# ============================================================

async def main():
    """Main entry point."""
    print("\n" + "=" * 60)
    print("📱 WhatsApp → OpenClaw Gateway v4.0 Memory Bridge")
    print("=" * 60)
    print(f"Gateway URL: {GATEWAY_URL}")
    print(f"OpenClaw WS: {OPENCLAW_WS}")
    print(f"Log File: {LOG_FILE}")
    print("=" * 60)
    print()

    # Check gateway health before starting
    if not check_gateway_health():
        logger.error("\n❌ Gateway v4.0 is not running!")
        logger.error("\nPlease start it first:")
        logger.error("  cd <your-openclaw-repo-path>\\mcp-servers")
        logger.error("  python openclaw_gateway.py")
        sys.exit(1)

    print()
    logger.info("✓ Starting WebSocket listener...")
    logger.info("✓ Memory systems ready")
    logger.info("✓ Press Ctrl+C to stop")
    print()

    # Start tasks
    await asyncio.gather(
        websocket_listener(),
        print_stats()
    )


if __name__ == "__main__":
    # Register signal handler
    signal.signal(signal.SIGINT, signal_handler)

    # Run
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        signal_handler(None, None)
