"""
Conversation Manager - Handles multi-turn conversation memory and context
"""
import json
import logging
import time
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
from pathlib import Path

logger = logging.getLogger(__name__)


class ConversationSession:
    """Represents a single conversation session."""
    
    def __init__(self, session_id: str, metadata: Dict = None):
        self.session_id = session_id
        self.messages: List[Dict[str, Any]] = []
        self.context: Dict[str, Any] = {}
        self.created_at = datetime.now()
        self.last_activity = datetime.now()
        self.metadata = metadata or {}
        self.total_tokens = 0
        self.tool_calls = []
        
    def add_message(self, role: str, content: Any, tool_calls: List = None):
        """Add a message to the conversation."""
        message = {
            "role": role,
            "content": content,
            "timestamp": datetime.now().isoformat(),
            "tool_calls": tool_calls or []
        }
        self.messages.append(message)
        self.last_activity = datetime.now()
        
        if tool_calls:
            self.tool_calls.extend(tool_calls)
    
    def add_context(self, key: str, value: Any):
        """Add contextual information to the session."""
        self.context[key] = value
        
    def get_context(self, key: str, default=None):
        """Retrieve contextual information."""
        return self.context.get(key, default)
    
    def get_recent_messages(self, count: int = 10) -> List[Dict]:
        """Get the most recent N messages."""
        return self.messages[-count:] if self.messages else []
    
    def get_messages_for_api(
        self, max_tokens: int = 8000, max_messages: int = 10
    ) -> List[Dict]:
        """
        Get messages formatted for Claude API with token optimization.

        Returns at most *max_messages* recent messages that together fit inside
        *max_tokens*.  The conservative defaults avoid re-sending large image
        blobs that accumulated in earlier turns and blowing up the context.

        Token estimation: 1 token ≈ 4 characters (rough but good enough for
        budget enforcement).
        """
        messages_for_api = []
        current_tokens = 0

        # Iterate from most recent to oldest, honour both caps.
        for msg in reversed(self.messages):
            if len(messages_for_api) >= max_messages:
                break

            # For token estimation, use only the textual parts of content so
            # that base64 image blobs stored in history don't inflate the count
            # or sneak large payloads back into the context.
            content = msg.get("content", "")
            if isinstance(content, list):
                # Multi-part content (e.g. tool results with image blocks).
                # Keep only text parts for both estimation and the API payload.
                # If there are no text parts, use an empty list rather than
                # falling back to the full content (which may contain large
                # base64 image blobs that would defeat the token budget).
                text_parts = [
                    part for part in content
                    if isinstance(part, dict) and part.get("type") == "text"
                ]
                content_for_api = text_parts  # empty list is fine; no blobs
                estimate_text = " ".join(p.get("text", "") for p in text_parts)
            else:
                content_for_api = content
                estimate_text = str(content)

            estimated_tokens = len(estimate_text) // 4

            if current_tokens + estimated_tokens > max_tokens:
                break

            api_msg = {
                "role": msg["role"],
                "content": content_for_api,
            }

            if msg.get("tool_calls"):
                api_msg["tool_calls"] = msg["tool_calls"]

            messages_for_api.insert(0, api_msg)
            current_tokens += estimated_tokens

        logger.debug(
            f"Session {self.session_id}: {len(messages_for_api)} messages "
            f"(~{current_tokens} tokens)"
        )
        return messages_for_api
    
    def summarize(self) -> Dict[str, Any]:
        """Get session summary."""
        return {
            "session_id": self.session_id,
            "created_at": self.created_at.isoformat(),
            "last_activity": self.last_activity.isoformat(),
            "message_count": len(self.messages),
            "tool_calls_count": len(self.tool_calls),
            "context_keys": list(self.context.keys()),
            "metadata": self.metadata
        }
    
    def to_dict(self) -> Dict[str, Any]:
        """Serialize session to dictionary."""
        return {
            "session_id": self.session_id,
            "messages": self.messages,
            "context": self.context,
            "created_at": self.created_at.isoformat(),
            "last_activity": self.last_activity.isoformat(),
            "metadata": self.metadata,
            "total_tokens": self.total_tokens,
            "tool_calls": self.tool_calls
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'ConversationSession':
        """Deserialize session from dictionary."""
        session = cls(data["session_id"], data.get("metadata", {}))
        session.messages = data.get("messages", [])
        session.context = data.get("context", {})
        session.created_at = datetime.fromisoformat(data["created_at"])
        session.last_activity = datetime.fromisoformat(data["last_activity"])
        session.total_tokens = data.get("total_tokens", 0)
        session.tool_calls = data.get("tool_calls", [])
        return session


class ConversationManager:
    """Manages multiple conversation sessions with persistence."""
    
    def __init__(self, storage_dir: str = "conversations", max_sessions: int = 100):
        self.storage_dir = Path(storage_dir)
        self.storage_dir.mkdir(exist_ok=True)
        
        self.sessions: Dict[str, ConversationSession] = {}
        self.max_sessions = max_sessions
        self.session_timeout = timedelta(hours=24)  # Auto-cleanup after 24h
        
        # Load existing sessions
        self._load_sessions()
        
        logger.info(f"ConversationManager initialized with {len(self.sessions)} sessions")
    
    def create_session(self, session_id: str = None, metadata: Dict = None) -> str:
        """Create a new conversation session."""
        if session_id is None:
            session_id = f"session_{int(time.time() * 1000)}"
        
        if session_id in self.sessions:
            logger.warning(f"Session {session_id} already exists, returning existing")
            return session_id
        
        # Check session limit
        if len(self.sessions) >= self.max_sessions:
            self._cleanup_old_sessions()
        
        session = ConversationSession(session_id, metadata)
        self.sessions[session_id] = session
        
        logger.info(f"Created session: {session_id}")
        self._save_session(session)
        
        return session_id
    
    def get_session(self, session_id: str) -> Optional[ConversationSession]:
        """Retrieve a conversation session."""
        session = self.sessions.get(session_id)
        
        if session:
            # Check if session is expired
            if datetime.now() - session.last_activity > self.session_timeout:
                logger.warning(f"Session {session_id} expired, deleting")
                self.delete_session(session_id)
                return None
        
        return session
    
    def add_message(
        self, 
        session_id: str, 
        role: str, 
        content: Any, 
        tool_calls: List = None,
        auto_create: bool = True
    ) -> bool:
        """Add a message to a session."""
        session = self.get_session(session_id)
        
        if not session:
            if auto_create:
                logger.info(f"Auto-creating session: {session_id}")
                self.create_session(session_id)
                session = self.sessions[session_id]
            else:
                logger.error(f"Session not found: {session_id}")
                return False
        
        session.add_message(role, content, tool_calls)
        self._save_session(session)
        
        return True
    
    def get_context(self, session_id: str, key: str, default=None):
        """Get context from a session."""
        session = self.get_session(session_id)
        return session.get_context(key, default) if session else default
    
    def set_context(self, session_id: str, key: str, value: Any) -> bool:
        """Set context in a session."""
        session = self.get_session(session_id)
        
        if not session:
            return False
        
        session.add_context(key, value)
        self._save_session(session)
        return True
    
    def get_messages_for_api(
        self,
        session_id: str,
        max_tokens: int = 8000,
        max_messages: int = 10,
    ) -> List[Dict]:
        """Get messages formatted for Claude API."""
        session = self.get_session(session_id)

        if not session:
            return []

        return session.get_messages_for_api(max_tokens, max_messages)
    
    def delete_session(self, session_id: str) -> bool:
        """Delete a conversation session."""
        if session_id not in self.sessions:
            return False
        
        # Remove from memory
        del self.sessions[session_id]
        
        # Remove from disk
        session_file = self.storage_dir / f"{session_id}.json"
        if session_file.exists():
            session_file.unlink()
        
        logger.info(f"Deleted session: {session_id}")
        return True
    
    def list_sessions(self) -> List[Dict[str, Any]]:
        """List all active sessions."""
        return [session.summarize() for session in self.sessions.values()]
    
    def clear_all_sessions(self):
        """Clear all sessions (use with caution)."""
        session_ids = list(self.sessions.keys())
        for session_id in session_ids:
            self.delete_session(session_id)
        
        logger.warning("Cleared all sessions")
    
    def _save_session(self, session: ConversationSession):
        """Save session to disk."""
        try:
            session_file = self.storage_dir / f"{session.session_id}.json"
            with open(session_file, 'w', encoding='utf-8') as f:
                json.dump(session.to_dict(), f, indent=2, ensure_ascii=False)
        except Exception as e:
            logger.error(f"Failed to save session {session.session_id}: {e}")
    
    def _load_sessions(self):
        """Load sessions from disk."""
        try:
            for session_file in self.storage_dir.glob("*.json"):
                try:
                    with open(session_file, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                    
                    session = ConversationSession.from_dict(data)
                    
                    # Check if session is expired
                    if datetime.now() - session.last_activity > self.session_timeout:
                        logger.info(f"Skipping expired session: {session.session_id}")
                        session_file.unlink()  # Delete expired session
                        continue
                    
                    self.sessions[session.session_id] = session
                    
                except Exception as e:
                    logger.error(f"Failed to load session from {session_file}: {e}")
            
            logger.info(f"Loaded {len(self.sessions)} sessions from disk")
            
        except Exception as e:
            logger.error(f"Failed to load sessions: {e}")
    
    def _cleanup_old_sessions(self):
        """Remove oldest sessions when limit is reached."""
        if len(self.sessions) < self.max_sessions:
            return
        
        # Sort by last activity
        sorted_sessions = sorted(
            self.sessions.values(),
            key=lambda s: s.last_activity
        )
        
        # Remove oldest 20%
        sessions_to_remove = int(self.max_sessions * 0.2)
        for session in sorted_sessions[:sessions_to_remove]:
            self.delete_session(session.session_id)
        
        logger.info(f"Cleaned up {sessions_to_remove} old sessions")


# Example usage and testing
if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    
    # Create manager
    manager = ConversationManager(storage_dir="test_conversations")
    
    # Create a session
    session_id = manager.create_session(metadata={"user": "test_user", "channel": "whatsapp"})
    print(f"Created session: {session_id}")
    
    # Add messages
    manager.add_message(session_id, "user", "Hello, can you help me?")
    manager.add_message(session_id, "assistant", "Of course! What do you need help with?")
    manager.add_message(session_id, "user", "Open Chrome and search for weather")
    manager.add_message(
        session_id, 
        "assistant", 
        "I'll help you with that.",
        tool_calls=["browser_open", "browser_search"]
    )
    
    # Set context
    manager.set_context(session_id, "last_browser_url", "https://google.com/search?q=weather")
    manager.set_context(session_id, "user_preference", "dark_mode")
    
    # Get messages for API
    messages = manager.get_messages_for_api(session_id)
    print(f"\nMessages for API ({len(messages)} messages):")
    for msg in messages:
        print(f"  {msg['role']}: {msg['content'][:50]}...")
    
    # Get context
    last_url = manager.get_context(session_id, "last_browser_url")
    print(f"\nLast browser URL: {last_url}")
    
    # List sessions
    print(f"\nActive sessions:")
    for summary in manager.list_sessions():
        print(f"  {summary['session_id']}: {summary['message_count']} messages")
    
    # Cleanup
    import shutil
    shutil.rmtree("test_conversations")
    print("\nTest completed and cleaned up")
