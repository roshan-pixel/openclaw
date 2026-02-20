"""
WhatsApp Log Bridge Server - PERMANENT FIX
Port: 5001
All Windows encoding issues fixed
"""

from flask import Flask, request, jsonify
import logging
from datetime import datetime
import json
from pathlib import Path
import sys
import io

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# Setup logging
log_dir = Path(__file__).parent / "logs"
log_dir.mkdir(exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(log_dir / 'whatsapp_activity.log', encoding='utf-8'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger('log_bridge')

app = Flask(__name__)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "service": "log_bridge"}), 200

@app.route('/log', methods=['POST'])
def log_event():
    """Receive and log events"""
    try:
        data = request.json

        event_type = data.get('event_type', 'unknown')
        timestamp = data.get('timestamp', datetime.now().isoformat())
        event_data = data.get('data', {})

        # Log the event
        log_entry = {
            "timestamp": timestamp,
            "type": event_type,
            "data": event_data
        }

        logger.info(f"[{event_type}] {json.dumps(event_data, ensure_ascii=False)}")

        # Save to detailed log file
        with open(log_dir / 'whatsapp_detailed.log', 'a', encoding='utf-8') as f:
            f.write(json.dumps(log_entry, ensure_ascii=False) + "\n")

        return jsonify({"status": "logged"}), 200

    except Exception as e:
        logger.error(f"Error logging event: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    logger.info("=" * 80)
    logger.info("WhatsApp Log Bridge Starting on port 5001")
    logger.info("=" * 80)
    app.run(host='0.0.0.0', port=5001, debug=False)
