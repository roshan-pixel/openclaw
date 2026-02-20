import os
from pathlib import Path
import anthropic

# Load .env
env_file = Path('..') / '.env'
if env_file.exists():
    with open(env_file) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, value = line.split('=', 1)
                os.environ[key.strip()] = value.strip()

api_key = os.environ.get('ANTHROPIC_API_KEY')
client = anthropic.Anthropic(api_key=api_key)

print("Testing available models...\n")

models_to_test = [
    "claude-3-5-sonnet-20241022",
    "claude-3-5-haiku-20241022", 
    "claude-sonnet-4-20250514",
    "claude-3-haiku-20240307",
    "claude-3-opus-20240229"
]

for model in models_to_test:
    try:
        response = client.messages.create(
            model=model,
            max_tokens=10,
            messages=[{"role": "user", "content": "Hi"}]
        )
        print(f"✅ {model} - WORKS!")
    except Exception as e:
        print(f"❌ {model} - {str(e)[:80]}")
