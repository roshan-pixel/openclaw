"""
Sentient Conversation Engine - The Neural Mirror
Simulates human social behavior with temporal mirroring, emotional synchrony, and human errors
"""
import asyncio
import logging
import json
import time
import re
import random
from typing import Dict, List, Any, Optional, Callable, Tuple
from dataclasses import dataclass, field
from collections import defaultdict, Counter, deque
import string

logger = logging.getLogger(__name__)


@dataclass
class MoodState:
    """Current emotional state"""
    sentiment: str  # positive, neutral, negative
    energy_level: float  # 0-1 (low to high energy)
    stress_level: float  # 0-1
    recent_sentiments: deque = field(default_factory=lambda: deque(maxlen=5))
    
    def update(self, new_sentiment: str, new_energy: float):
        """Update mood with new data"""
        self.recent_sentiments.append((new_sentiment, new_energy, time.time()))
        
        # Calculate rolling average
        if self.recent_sentiments:
            avg_energy = sum(e for _, e, _ in self.recent_sentiments) / len(self.recent_sentiments)
            self.energy_level = avg_energy
            
            # Determine dominant sentiment
            sentiment_counts = Counter(s for s, _, _ in self.recent_sentiments)
            self.sentiment = sentiment_counts.most_common(1)[0][0]
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "sentiment": self.sentiment,
            "energy_level": f"{self.energy_level:.2f}",
            "stress_level": f"{self.stress_level:.2f}"
        }


@dataclass
class SocialArchetype:
    """Predefined social personality archetype"""
    name: str
    description: str
    emoji_frequency: float
    formality_level: float
    response_speed: float  # multiplier for wait time
    message_length: float  # multiplier for message length
    characteristics: Dict[str, Any] = field(default_factory=dict)


@dataclass
class OutlierWord:
    """Word used significantly more than average"""
    word: str
    user_frequency: int
    general_frequency: float
    significance_score: float  # How much more the user uses it
    context: List[str] = field(default_factory=list)  # Usage examples


class SpeakingStyle:
    """Enhanced speaking style with neural adaptation"""
    def __init__(self, user_id: str):
        self.user_id = user_id
        
        # Linguistic patterns
        self.avg_message_length: float = 50.0
        self.avg_words_per_message: float = 10.0
        self.typing_speed_wpm: float = 60.0  # Words per minute
        self.uses_punctuation: bool = True
        self.uses_capitalization: bool = True
        self.uses_emojis: bool = False
        self.emoji_frequency: float = 0.0
        
        # Common phrases
        self.greetings: List[str] = []
        self.farewells: List[str] = []
        self.expressions: List[str] = []
        self.filler_words: List[str] = []
        
        # Tone
        self.formality_level: float = 0.5
        self.enthusiasm_level: float = 0.5
        
        # Vocabulary
        self.common_words: Dict[str, int] = {}
        self.outlier_words: List[OutlierWord] = []
        self.unique_phrases: List[str] = []
        
        # Temporal patterns
        self.avg_response_time: float = 2.0  # seconds
        self.response_times: deque = deque(maxlen=50)
        
        # Error patterns
        self.typo_rate: float = 0.02  # 2% chance
        self.common_typos: Dict[str, str] = {
            "thanks": "thansk",
            "the": "teh",
            "message": "mesage",
            "please": "plz",
            "you": "u",
            "great": "grat"
        }
        
        # Social archetype
        self.archetype: Optional[str] = None
        
        # Mood tracking
        self.current_mood: MoodState = MoodState(
            sentiment="neutral",
            energy_level=0.5,
            stress_level=0.0
        )
        
        # Metadata
        self.messages_analyzed: int = 0
        self.last_updated: float = time.time()
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "user_id": self.user_id,
            "style": {
                "formality": f"{self.formality_level:.2f}",
                "enthusiasm": f"{self.enthusiasm_level:.2f}",
                "avg_length": f"{self.avg_message_length:.0f} chars",
                "typing_speed": f"{self.typing_speed_wpm:.0f} WPM",
                "typo_rate": f"{self.typo_rate * 100:.1f}%"
            },
            "mood": self.current_mood.to_dict(),
            "archetype": self.archetype,
            "outlier_words": [w.word for w in self.outlier_words[:5]],
            "messages_analyzed": self.messages_analyzed
        }


class SentientConversationEngine:
    """
    🧠 SENTIENT CONVERSATION ENGINE: The Neural Mirror
    
    Simulates true human social behavior:
    1. ✅ Wait-Time Algorithm (Temporal Mirroring)
    2. ✅ Dynamic System-Prompt Injection
    3. ✅ Emotional Synchrony (Sentiment Tracking)
    4. ✅ Word Favorite Vector (Lexical Adoption)
    5. ✅ Structured Response Blueprints
    6. ✅ Human Error Generator (Typos + Corrections)
    
    The AI that feels human!
    """
    
    def __init__(
        self,
        ai_response_generator: Optional[Callable] = None,
        sentiment_analyzer: Optional[Callable] = None,
        enable_typing_delay: bool = True,
        enable_human_errors: bool = True
    ):
        """Initialize Sentient Conversation Engine"""
        self.ai_response_generator = ai_response_generator
        self.sentiment_analyzer = sentiment_analyzer
        self.enable_typing_delay = enable_typing_delay
        self.enable_human_errors = enable_human_errors
        
        # User profiles
        self.user_profiles: Dict[str, SpeakingStyle] = {}
        
        # Social archetypes
        self.archetypes = self._define_archetypes()
        
        # General population word frequencies (for outlier detection)
        self.general_word_freq = self._load_general_frequencies()
        
        # Statistics
        self.total_messages_learned = 0
        self.total_responses_generated = 0
        self.total_typos_generated = 0
        self.total_corrections_sent = 0
        
        logger.info("🧠 Sentient Conversation Engine initialized")
        logger.info(f"  → Temporal Mirroring: {'ENABLED' if enable_typing_delay else 'DISABLED'}")
        logger.info(f"  → Human Errors: {'ENABLED' if enable_human_errors else 'DISABLED'}")
    
    def _define_archetypes(self) -> Dict[str, SocialArchetype]:
        """Define social personality archetypes"""
        return {
            "hype_man": SocialArchetype(
                name="The Hype-Man",
                description="Short messages, high emojis, rapid response",
                emoji_frequency=0.8,
                formality_level=0.2,
                response_speed=0.5,  # 2x faster
                message_length=0.6,  # Shorter messages
                characteristics={
                    "exclamation_usage": 0.7,
                    "caps_usage": 0.3,
                    "expressions": ["YOOO", "LETS GO", "FIRE", "CLUTCH"]
                }
            ),
            "stoic": SocialArchetype(
                name="The Stoic",
                description="No emojis, perfect grammar, longer wait times",
                emoji_frequency=0.0,
                formality_level=0.9,
                response_speed=1.5,  # 1.5x slower
                message_length=1.3,  # Longer messages
                characteristics={
                    "exclamation_usage": 0.1,
                    "punctuation_precise": True,
                    "expressions": ["I see", "Indeed", "Understood"]
                }
            ),
            "zoomer": SocialArchetype(
                name="The Zoomer",
                description="Lowercase only, heavy slang",
                emoji_frequency=0.5,
                formality_level=0.1,
                response_speed=0.7,
                message_length=0.7,
                characteristics={
                    "no_caps": True,
                    "slang_heavy": True,
                    "expressions": ["fr", "ngl", "lowkey", "deadass", "bruh"]
                }
            ),
            "professional": SocialArchetype(
                name="The Professional",
                description="Formal, structured, clear",
                emoji_frequency=0.1,
                formality_level=0.8,
                response_speed=1.2,
                message_length=1.2,
                characteristics={
                    "structured": True,
                    "expressions": ["Thank you", "I appreciate", "Regarding"]
                }
            )
        }
    
    def _load_general_frequencies(self) -> Dict[str, float]:
        """Load general population word frequencies (simplified)"""
        # In production, load from corpus
        return {
            "the": 0.07, "be": 0.04, "to": 0.04, "of": 0.03,
            "and": 0.03, "a": 0.02, "in": 0.02, "that": 0.01,
            "have": 0.01, "i": 0.01, "it": 0.01, "for": 0.01
        }
    
    async def learn_from_message(
        self,
        user_id: str,
        message: str,
        response_time: Optional[float] = None,
        context: Optional[Dict[str, Any]] = None
    ):
        """Learn from user message with neural adaptation"""
        
        # Get or create profile
        if user_id not in self.user_profiles:
            self.user_profiles[user_id] = SpeakingStyle(user_id=user_id)
        
        profile = self.user_profiles[user_id]
        profile.messages_analyzed += 1
        self.total_messages_learned += 1
        
        # 1. Analyze sentiment and mood
        await self._analyze_sentiment_and_mood(profile, message)
        
        # 2. Analyze linguistic patterns
        await self._analyze_linguistic_patterns(profile, message)
        
        # 3. Track response time (temporal pattern)
        if response_time:
            profile.response_times.append(response_time)
            profile.avg_response_time = sum(profile.response_times) / len(profile.response_times)
        
        # 4. Extract and track outlier words
        await self._track_outlier_words(profile, message)
        
        # 5. Detect and assign archetype
        await self._detect_archetype(profile)
        
        # 6. Update typing speed estimate
        await self._estimate_typing_speed(profile, message, response_time)
        
        profile.last_updated = time.time()
        
        logger.debug(f"✅ Learned from message (Mood: {profile.current_mood.sentiment})")
    
    async def _analyze_sentiment_and_mood(self, profile: SpeakingStyle, message: str):
        """Analyze sentiment and update mood state"""
        
        if self.sentiment_analyzer:
            # Use AI sentiment analyzer
            sentiment_result = await self.sentiment_analyzer(message)
            sentiment = sentiment_result.get("sentiment", "neutral")
            energy = sentiment_result.get("energy", 0.5)
        else:
            # Fallback: simple sentiment detection
            sentiment, energy = self._simple_sentiment_detection(message)
        
        # Update mood
        profile.current_mood.update(sentiment, energy)
        
        # Adjust enthusiasm based on mood
        if profile.current_mood.sentiment == "negative":
            profile.enthusiasm_level *= 0.7  # Reduce enthusiasm
            profile.emoji_frequency *= 0.5
        elif profile.current_mood.sentiment == "positive":
            profile.enthusiasm_level = min(1.0, profile.enthusiasm_level * 1.2)
    
    def _simple_sentiment_detection(self, message: str) -> Tuple[str, float]:
        """Simple sentiment detection (fallback)"""
        message_lower = message.lower()
        
        # Positive indicators
        positive_words = ['happy', 'great', 'awesome', 'love', 'good', 'nice', 'cool', 'amazing']
        # Negative indicators
        negative_words = ['sad', 'bad', 'hate', 'terrible', 'awful', 'wrong', 'problem', 'issue']
        # High energy indicators
        high_energy = ['!', 'lol', 'haha', 'wow', 'omg']
        
        pos_count = sum(1 for word in positive_words if word in message_lower)
        neg_count = sum(1 for word in negative_words if word in message_lower)
        energy_count = sum(message.count(ind) for ind in high_energy)
        
        # Determine sentiment
        if pos_count > neg_count:
            sentiment = "positive"
            energy = min(1.0, 0.6 + energy_count * 0.1)
        elif neg_count > pos_count:
            sentiment = "negative"
            energy = max(0.2, 0.5 - energy_count * 0.1)
        else:
            sentiment = "neutral"
            energy = 0.5
        
        return sentiment, energy
    
    async def _analyze_linguistic_patterns(self, profile: SpeakingStyle, message: str):
        """Analyze linguistic patterns"""
        # Message length
        profile.avg_message_length = (
            (profile.avg_message_length * (profile.messages_analyzed - 1) + len(message)) /
            profile.messages_analyzed
        )
        
        # Word count
        words = len(message.split())
        profile.avg_words_per_message = (
            (profile.avg_words_per_message * (profile.messages_analyzed - 1) + words) /
            profile.messages_analyzed
        )
        
        # Emoji usage
        emoji_pattern = r'[\U0001F600-\U0001F64F\U0001F300-\U0001F5FF\U0001F680-\U0001F6FF\U0001F1E0-\U0001F1FF]'
        emoji_count = len(re.findall(emoji_pattern, message))
        
        if emoji_count > 0:
            profile.uses_emojis = True
            profile.emoji_frequency = (
                (profile.emoji_frequency * (profile.messages_analyzed - 1) + emoji_count) /
                profile.messages_analyzed
            )
        
        # Punctuation and capitalization
        profile.uses_punctuation = bool(re.search(r'[.!?,]', message))
        profile.uses_capitalization = any(c.isupper() for c in message)
    
    async def _track_outlier_words(self, profile: SpeakingStyle, message: str):
        """Track words used significantly more than average"""
        words = re.findall(r'\b\w+\b', message.lower())
        
        for word in words:
            if len(word) > 3:  # Skip short words
                profile.common_words[word] = profile.common_words.get(word, 0) + 1
        
        # Calculate outliers
        total_words = sum(profile.common_words.values())
        
        for word, count in profile.common_words.items():
            user_freq = count / max(total_words, 1)
            general_freq = self.general_word_freq.get(word, 0.0001)
            
            # Significance: how much more the user uses this word
            significance = user_freq / general_freq
            
            if significance > 10 and count > 5:  # Used 10x more and at least 5 times
                # Check if already tracked
                existing = next((w for w in profile.outlier_words if w.word == word), None)
                
                if existing:
                    existing.user_frequency = count
                    existing.significance_score = significance
                else:
                    outlier = OutlierWord(
                        word=word,
                        user_frequency=count,
                        general_frequency=general_freq,
                        significance_score=significance
                    )
                    profile.outlier_words.append(outlier)
        
        # Sort by significance
        profile.outlier_words.sort(key=lambda w: w.significance_score, reverse=True)
    
    async def _detect_archetype(self, profile: SpeakingStyle):
        """Detect user's social archetype"""
        scores = {}
        
        for archetype_id, archetype in self.archetypes.items():
            score = 0
            
            # Compare emoji usage
            emoji_diff = abs(profile.emoji_frequency - archetype.emoji_frequency)
            score += (1 - emoji_diff) * 10
            
            # Compare formality
            formality_diff = abs(profile.formality_level - archetype.formality_level)
            score += (1 - formality_diff) * 10
            
            scores[archetype_id] = score
        
        # Assign best matching archetype
        profile.archetype = max(scores, key=scores.get)
        
        logger.debug(f"🎭 Archetype detected: {profile.archetype}")
    
    async def _estimate_typing_speed(
        self,
        profile: SpeakingStyle,
        message: str,
        response_time: Optional[float]
    ):
        """Estimate user's typing speed"""
        if response_time and response_time > 0:
            words = len(message.split())
            wpm = (words / response_time) * 60
            
            # Update with weighted average
            profile.typing_speed_wpm = (
                profile.typing_speed_wpm * 0.8 + wpm * 0.2
            )
    
    async def generate_response(
        self,
        user_id: str,
        content: str,
        response_type: str = "general"
    ) -> Dict[str, Any]:
        """
        Generate sentient human-like response
        
        Returns:
            {
                "message": str,
                "wait_time": float,
                "typing_indicator": bool,
                "correction": Optional[str],
                "system_prompt": str
            }
        """
        self.total_responses_generated += 1
        
        profile = self.user_profiles.get(user_id)
        
        if not profile:
            # Create default profile
            profile = SpeakingStyle(user_id=user_id)
            self.user_profiles[user_id] = profile
        
        # 1. Generate dynamic system prompt
        system_prompt = self._generate_brain_instructions(profile)
        
        # 2. Generate base response
        response = await self._generate_adapted_response(profile, content, response_type, system_prompt)
        
        # 3. Apply human error (typos)
        original_response = response
        if self.enable_human_errors and random.random() < profile.typo_rate:
            response, correction = self._inject_typo(response)
            self.total_typos_generated += 1
            if correction:
                self.total_corrections_sent += 1
        else:
            correction = None
        
        # 4. Calculate wait time (temporal mirroring)
        wait_time = self._calculate_wait_time(profile, response) if self.enable_typing_delay else 0.0
        
        return {
            "message": response,
            "wait_time": wait_time,
            "typing_indicator": wait_time > 1.0,
            "correction": correction,
            "system_prompt": system_prompt,
            "mood": profile.current_mood.to_dict()
        }
    
    def _generate_brain_instructions(self, profile: SpeakingStyle) -> str:
        """Generate dynamic system prompt for LLM"""
        
        # Capitalization instruction
        caps = "Do NOT use capital letters." if not profile.uses_capitalization else "Use standard casing."
        
        # Punctuation instruction
        punct = "Avoid periods at the end of messages." if not profile.uses_punctuation else "Use proper punctuation."
        
        # Emoji instruction
        emoji_inst = ""
        if profile.uses_emojis:
            emoji_inst = f"Use emojis occasionally (about {int(profile.emoji_frequency * 100)}% of messages)."
        else:
            emoji_inst = "Never use emojis."
        
        # Outlier words
        outlier_words_str = ", ".join([w.word for w in profile.outlier_words[:5]])
        vocab_inst = f"Occasionally use these words: {outlier_words_str}" if outlier_words_str else ""
        
        # Mood adjustment
        mood_inst = ""
        if profile.current_mood.sentiment == "negative":
            mood_inst = "The user seems down. Be supportive but don't be overly cheerful."
        elif profile.current_mood.sentiment == "positive":
            mood_inst = "The user is in a good mood. Match their positive energy."
        
        # Archetype characteristics
        archetype_inst = ""
        if profile.archetype and profile.archetype in self.archetypes:
            archetype = self.archetypes[profile.archetype]
            archetype_inst = f"Personality: {archetype.description}"
        
        # Compile system prompt
        system_prompt = f"""
PERSONALITY OVERRIDE:
- Style: {profile.formality_level:.1f} Formality (0=Very Casual, 1=Very Formal)
- Energy Level: {profile.current_mood.energy_level:.1f} (0=Low, 1=High)
- Message Length: Target ~{int(profile.avg_message_length * 0.8)}-{int(profile.avg_message_length * 1.2)} characters
- Formatting: {caps} {punct} {emoji_inst}
- Vocabulary: {vocab_inst}
- Mood Context: {mood_inst}
- Archetype: {archetype_inst}

IMPORTANT: Respond naturally as if you're this person's friend. Match their vibe exactly.
"""
        
        return system_prompt.strip()
    
    async def _generate_adapted_response(
        self,
        profile: SpeakingStyle,
        content: str,
        response_type: str,
        system_prompt: str
    ) -> str:
        """Generate response with full adaptation"""
        
        # Use AI generator if available
        if self.ai_response_generator:
            response = await self.ai_response_generator(content, system_prompt)
        else:
            response = content  # Fallback
        
        # Apply style transformations
        if not profile.uses_capitalization:
            response = response.lower()
        
        if not profile.uses_punctuation:
            response = response.rstrip('.!?,')
        
        # Add outlier words occasionally
        if profile.outlier_words and random.random() < 0.2:
            outlier = random.choice(profile.outlier_words[:3])
            # Try to naturally insert the word
            response = f"{response} that's {outlier.word}"
        
        return response
    
    def _calculate_wait_time(self, profile: SpeakingStyle, response: str) -> float:
        """Calculate realistic typing delay (temporal mirroring)"""
        
        # Calculate based on typing speed
        words = len(response.split())
        base_time = (words / profile.typing_speed_wpm) * 60
        
        # Add thinking time (complexity factor)
        complexity_factor = 1.0
        if '?' in response:
            complexity_factor = 1.3  # Questions take longer
        if len(response) > 200:
            complexity_factor = 1.5  # Long messages need more thought
        
        # Add random human variance (±20%)
        variance = random.uniform(0.8, 1.2)
        
        wait_time = base_time * complexity_factor * variance
        
        # Apply archetype speed modifier
        if profile.archetype and profile.archetype in self.archetypes:
            archetype = self.archetypes[profile.archetype]
            wait_time *= archetype.response_speed
        
        # Minimum 0.5s, maximum 10s
        wait_time = max(0.5, min(10.0, wait_time))
        
        return wait_time
    
    def _inject_typo(self, message: str) -> Tuple[str, Optional[str]]:
        """Inject realistic typo and generate correction"""
        
        words = message.split()
        
        # Find a word to typo
        for word in words:
            word_lower = word.lower().strip('.,!?')
            
            # Check if we have a predefined typo
            if word_lower in ['thanks', 'the', 'message', 'please', 'great']:
                typo_map = {
                    'thanks': 'thansk',
                    'the': 'teh',
                    'message': 'mesage',
                    'please': 'plz',
                    'great': 'grat'
                }
                
                typo = typo_map[word_lower]
                
                # Preserve case
                if word[0].isupper():
                    typo = typo.capitalize()
                
                # Create typo message
                typo_message = message.replace(word, typo)
                
                # Create correction
                correction = f"*{word_lower}"
                
                return typo_message, correction
        
        # If no suitable word found, return original
        return message, None
    
    def get_conversation_stats(self) -> Dict[str, Any]:
        """Get sentient engine statistics"""
        return {
            "total_users": len(self.user_profiles),
            "total_messages_learned": self.total_messages_learned,
            "total_responses_generated": self.total_responses_generated,
            "total_typos_generated": self.total_typos_generated,
            "total_corrections_sent": self.total_corrections_sent,
            "archetypes_available": len(self.archetypes),
            "temporal_mirroring": self.enable_typing_delay,
            "human_errors": self.enable_human_errors
        }


# Export
__all__ = ['SentientConversationEngine', 'SpeakingStyle', 'MoodState', 'SocialArchetype']
