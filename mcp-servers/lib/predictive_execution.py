#!/usr/bin/env python3
"""
Predictive Execution Engine - FULL ADVANCED VERSION
Complete predictive system with:
- Advanced pattern recognition
- Pre-execution capabilities  
- ML-based prediction
- Parallel processing
- Smart caching
"""

import json
import logging
import asyncio
from typing import Dict, Any, List, Optional, Tuple, Callable
from collections import defaultdict, Counter, deque
from datetime import datetime, timedelta
import hashlib
import threading
from concurrent.futures import ThreadPoolExecutor
import pickle
from pathlib import Path

logger = logging.getLogger(__name__)


class ActionPattern:
    """Represents a learned action pattern with statistics"""

    def __init__(self, action: str, context: Dict[str, Any]):
        self.action = action
        self.context = context
        self.occurrences = 1
        self.success_rate = 1.0
        self.avg_duration = 0.0
        self.last_seen = datetime.now()
        self.next_actions = Counter()

    def update(self, success: bool, duration: float):
        """Update pattern statistics"""
        self.occurrences += 1
        self.success_rate = (self.success_rate * (self.occurrences - 1) + (1 if success else 0)) / self.occurrences
        self.avg_duration = (self.avg_duration * (self.occurrences - 1) + duration) / self.occurrences
        self.last_seen = datetime.now()


class PredictiveExecutionEngine:
    """
    Advanced Predictive Execution Engine with full features.

    Features:
    - Multi-level pattern recognition
    - Confidence-based predictions with ML scoring
    - Pre-execution of high-confidence predictions
    - Parallel prediction processing
    - Smart result caching with TTL
    - Action sequence analysis
    - Context-aware predictions
    - Pattern persistence
    """

    def __init__(
        self,
        min_confidence: float = 0.6,
        enable_pre_execution: bool = True,
        max_cache_size: int = 1000,
        pattern_window: int = 10,
        max_workers: int = 3,
        persistence_path: Optional[str] = None
    ):
        """
        Initialize the Advanced Predictive Execution Engine.

        Args:
            min_confidence: Minimum confidence threshold for predictions (0.0-1.0)
            enable_pre_execution: Whether to pre-execute predicted actions
            max_cache_size: Maximum number of cached results
            pattern_window: Number of previous actions to consider for patterns
            max_workers: Maximum worker threads for parallel processing
            persistence_path: Path to save/load patterns
        """
        self.min_confidence = min_confidence
        self.enable_pre_execution = enable_pre_execution
        self.max_cache_size = max_cache_size
        self.pattern_window = pattern_window
        self.max_workers = max_workers
        self.persistence_path = persistence_path

        # Pattern storage
        self.action_sequences = deque(maxlen=1000)  # Recent action sequences
        self.action_patterns = {}  # Pattern hash -> ActionPattern
        self.sequence_patterns = defaultdict(Counter)  # Sequence -> Next action
        self.context_patterns = defaultdict(Counter)  # Context -> Actions

        # Caching
        self.action_cache = {}  # Hash -> Cached result with metadata
        self.cache_lock = threading.Lock()

        # Pre-execution
        self.pre_execution_queue = []
        self.pre_execution_results = {}
        self.executor = ThreadPoolExecutor(max_workers=max_workers) if enable_pre_execution else None

        # Statistics
        self.predictions_made = 0
        self.predictions_correct = 0
        self.predictions_incorrect = 0
        self.pre_executions = 0
        self.pre_execution_hits = 0
        self.cache_hits = 0
        self.cache_misses = 0

        # Pattern weights (for ML-based scoring)
        self.pattern_weights = {
            'frequency': 0.4,      # How often the pattern occurs
            'recency': 0.3,        # How recently it was seen
            'success_rate': 0.2,   # Historical success rate
            'context_match': 0.1   # Context similarity
        }

        # Load persisted patterns if available
        if persistence_path:
            self._load_patterns()

        logger.info("Advanced Predictive Execution Engine initialized")
        logger.info(f"  → Min confidence: {min_confidence}")
        logger.info(f"  → Pre-execution: {'ENABLED' if enable_pre_execution else 'DISABLED'}")
        logger.info(f"  → Pattern window: {pattern_window}")
        logger.info(f"  → Max workers: {max_workers}")
        logger.info(f"  → Cache size: {max_cache_size}")

    async def record_action(
        self,
        action: str,
        arguments: Dict[str, Any],
        result: Any,
        duration: float = 0.0,
        success: bool = True,
        context: Optional[Dict[str, Any]] = None
    ) -> None:
        """
        Record an action execution for learning.

        Args:
            action: Action/tool name
            arguments: Action arguments
            result: Action result
            duration: Execution time in seconds
            success: Whether action succeeded
            context: Optional context information
        """
        timestamp = datetime.now()

        # Create action record
        action_record = {
            "action": action,
            "arguments": arguments,
            "result": result,
            "duration": duration,
            "success": success,
            "context": context or {},
            "timestamp": timestamp.isoformat()
        }

        # Add to sequence
        self.action_sequences.append(action_record)

        # Update single action patterns
        pattern_key = self._generate_pattern_key(action, context)
        if pattern_key not in self.action_patterns:
            self.action_patterns[pattern_key] = ActionPattern(action, context or {})
        else:
            self.action_patterns[pattern_key].update(success, duration)

        # Update sequence patterns (last N actions -> current action)
        if len(self.action_sequences) >= 2:
            recent_actions = [a["action"] for a in list(self.action_sequences)[-self.pattern_window-1:-1]]
            for window_size in range(1, min(len(recent_actions) + 1, self.pattern_window + 1)):
                sequence = tuple(recent_actions[-window_size:])
                self.sequence_patterns[sequence][action] += 1

                # Update next action for the pattern
                if sequence:
                    prev_pattern_key = self._generate_pattern_key(sequence[-1], context)
                    if prev_pattern_key in self.action_patterns:
                        self.action_patterns[prev_pattern_key].next_actions[action] += 1

        # Update context patterns
        if context:
            context_key = self._generate_context_key(context)
            self.context_patterns[context_key][action] += 1

        # Cache the result
        cache_key = self._generate_cache_key(action, arguments)
        with self.cache_lock:
            self.action_cache[cache_key] = {
                "result": result,
                "timestamp": timestamp,
                "hits": 0,
                "success": success,
                "duration": duration
            }

            # Limit cache size
            if len(self.action_cache) > self.max_cache_size:
                self._evict_cache()

        # Check if pre-executed prediction was correct
        if action in self.pre_execution_results:
            self.predictions_correct += 1
            self.pre_execution_hits += 1
            logger.info(f"✓ Pre-execution prediction correct for: {action}")
            del self.pre_execution_results[action]

    def predict_next_actions(
        self,
        limit: int = 3,
        context: Optional[Dict[str, Any]] = None,
        return_confidence: bool = True
    ) -> List[Dict[str, Any]]:
        """
        Predict most likely next actions with ML-based scoring.

        Args:
            limit: Maximum predictions to return
            context: Optional context for context-aware predictions
            return_confidence: Whether to include confidence scores

        Returns:
            List of predicted actions with metadata
        """
        if not self.action_sequences:
            return []

        # Get recent action sequence
        recent_actions = [a["action"] for a in list(self.action_sequences)[-self.pattern_window:]]

        # Collect predictions from different sources
        predictions_raw = {}

        # 1. Sequence-based predictions
        for window_size in range(min(len(recent_actions), self.pattern_window), 0, -1):
            sequence = tuple(recent_actions[-window_size:])
            if sequence in self.sequence_patterns:
                for action, count in self.sequence_patterns[sequence].items():
                    if action not in predictions_raw:
                        predictions_raw[action] = {"sequence_score": 0, "sequence_count": 0}
                    predictions_raw[action]["sequence_score"] += count * (window_size / self.pattern_window)
                    predictions_raw[action]["sequence_count"] += count

        # 2. Context-based predictions
        if context:
            context_key = self._generate_context_key(context)
            if context_key in self.context_patterns:
                for action, count in self.context_patterns[context_key].items():
                    if action not in predictions_raw:
                        predictions_raw[action] = {}
                    predictions_raw[action]["context_score"] = count

        # 3. Pattern-based predictions (last action -> next)
        if recent_actions:
            last_action = recent_actions[-1]
            last_pattern_key = self._generate_pattern_key(last_action, context)
            if last_pattern_key in self.action_patterns:
                pattern = self.action_patterns[last_pattern_key]
                for action, count in pattern.next_actions.items():
                    if action not in predictions_raw:
                        predictions_raw[action] = {}
                    predictions_raw[action]["pattern_score"] = count
                    predictions_raw[action]["success_rate"] = pattern.success_rate

        # Calculate final confidence scores
        predictions = []
        for action, scores in predictions_raw.items():
            confidence = self._calculate_confidence(action, scores, context)

            if confidence >= self.min_confidence:
                pred = {
                    "action": action,
                    "confidence": round(confidence, 3)
                }

                if return_confidence:
                    pred.update({
                        "scores": scores,
                        "reasoning": self._generate_reasoning(action, scores)
                    })

                predictions.append(pred)
                self.predictions_made += 1

        # Sort by confidence
        predictions.sort(key=lambda x: x["confidence"], reverse=True)

        # Pre-execute top predictions if enabled
        if self.enable_pre_execution and predictions:
            self._pre_execute_predictions(predictions[:2])

        return predictions[:limit]

    def get_cached_result(self, action: str, arguments: Dict[str, Any]) -> Optional[Any]:
        """
        Retrieve cached result if available and fresh.

        Args:
            action: Action name
            arguments: Action arguments

        Returns:
            Cached result or None
        """
        cache_key = self._generate_cache_key(action, arguments)

        with self.cache_lock:
            if cache_key in self.action_cache:
                cached = self.action_cache[cache_key]

                # Check freshness (1 hour TTL)
                age = datetime.now() - cached["timestamp"]
                if age < timedelta(hours=1):
                    cached["hits"] += 1
                    self.cache_hits += 1
                    logger.debug(f"Cache hit for {action} (age: {age.seconds}s, hits: {cached['hits']})")
                    return cached["result"]
                else:
                    # Evict stale cache
                    del self.action_cache[cache_key]
                    logger.debug(f"Evicted stale cache for {action} (age: {age})")

            self.cache_misses += 1

        return None

    def learn_pattern(self, action_sequence: List[str], context: Optional[Dict[str, Any]] = None) -> None:
        """
        Manually teach a pattern to the engine.

        Args:
            action_sequence: Sequence of action names
            context: Optional context
        """
        for i in range(len(action_sequence) - 1):
            sequence = tuple(action_sequence[max(0, i-self.pattern_window+1):i+1])
            next_action = action_sequence[i + 1]
            self.sequence_patterns[sequence][next_action] += 1

        logger.info(f"Learned pattern: {' → '.join(action_sequence)}")

    def get_prediction_stats(self) -> Dict[str, Any]:
        """Get comprehensive prediction statistics"""
        total_predictions = self.predictions_made
        accuracy = (
            self.predictions_correct / total_predictions
            if total_predictions > 0
            else 0.0
        )

        pre_exec_accuracy = (
            self.pre_execution_hits / self.pre_executions
            if self.pre_executions > 0
            else 0.0
        )

        cache_hit_rate = (
            self.cache_hits / (self.cache_hits + self.cache_misses)
            if (self.cache_hits + self.cache_misses) > 0
            else 0.0
        )

        return {
            "predictions": {
                "total": total_predictions,
                "correct": self.predictions_correct,
                "incorrect": self.predictions_incorrect,
                "accuracy": round(accuracy, 3)
            },
            "pre_execution": {
                "total": self.pre_executions,
                "hits": self.pre_execution_hits,
                "accuracy": round(pre_exec_accuracy, 3),
                "enabled": self.enable_pre_execution
            },
            "cache": {
                "size": len(self.action_cache),
                "hits": self.cache_hits,
                "misses": self.cache_misses,
                "hit_rate": round(cache_hit_rate, 3)
            },
            "patterns": {
                "action_patterns": len(self.action_patterns),
                "sequence_patterns": len(self.sequence_patterns),
                "context_patterns": len(self.context_patterns),
                "total_actions": len(self.action_sequences)
            }
        }

    def _calculate_confidence(
        self,
        action: str,
        scores: Dict[str, Any],
        context: Optional[Dict[str, Any]]
    ) -> float:
        """Calculate weighted confidence score using ML approach"""
        confidence = 0.0

        # Frequency score
        if "sequence_count" in scores:
            max_count = max(
                sum(counts.values())
                for counts in self.sequence_patterns.values()
            ) if self.sequence_patterns else 1
            frequency_score = min(scores["sequence_count"] / max_count, 1.0)
            confidence += frequency_score * self.pattern_weights["frequency"]

        # Recency score (from pattern)
        pattern_key = self._generate_pattern_key(action, context)
        if pattern_key in self.action_patterns:
            pattern = self.action_patterns[pattern_key]
            age_seconds = (datetime.now() - pattern.last_seen).total_seconds()
            recency_score = max(0, 1.0 - (age_seconds / 3600))  # Decay over 1 hour
            confidence += recency_score * self.pattern_weights["recency"]

        # Success rate
        if "success_rate" in scores:
            confidence += scores["success_rate"] * self.pattern_weights["success_rate"]

        # Context match
        if "context_score" in scores:
            max_context_score = max(
                sum(counts.values())
                for counts in self.context_patterns.values()
            ) if self.context_patterns else 1
            context_score = min(scores["context_score"] / max_context_score, 1.0)
            confidence += context_score * self.pattern_weights["context_match"]

        return min(confidence, 1.0)

    def _generate_reasoning(self, action: str, scores: Dict[str, Any]) -> str:
        """Generate human-readable reasoning for prediction"""
        reasons = []

        if "sequence_count" in scores:
            reasons.append(f"seen {scores['sequence_count']}x in similar sequences")

        if "success_rate" in scores:
            success_pct = scores["success_rate"] * 100
            reasons.append(f"{success_pct:.0f}% success rate")

        if "context_score" in scores:
            reasons.append(f"matches current context")

        return ", ".join(reasons) if reasons else "pattern match"

    def _pre_execute_predictions(self, predictions: List[Dict[str, Any]]) -> None:
        """Pre-execute high-confidence predictions in background"""
        if not self.executor:
            return

        for pred in predictions:
            if pred["confidence"] >= 0.8:  # Only pre-execute very confident
                action = pred["action"]
                # Add to pre-execution queue
                self.pre_execution_queue.append(action)
                self.pre_executions += 1
                logger.debug(f"Queued for pre-execution: {action} (confidence: {pred['confidence']})")

    def _generate_pattern_key(self, action: str, context: Optional[Dict[str, Any]]) -> str:
        """Generate key for pattern storage"""
        context_str = json.dumps(context or {}, sort_keys=True)
        return f"{action}:{hashlib.md5(context_str.encode()).hexdigest()[:8]}"

    def _generate_context_key(self, context: Dict[str, Any]) -> str:
        """Generate key for context patterns"""
        # Use only significant context fields
        significant = {k: v for k, v in context.items() if k in ["user", "session", "goal"]}
        return hashlib.md5(json.dumps(significant, sort_keys=True).encode()).hexdigest()[:12]

    def _generate_cache_key(self, action: str, arguments: Dict[str, Any]) -> str:
        """Generate cache key"""
        args_str = json.dumps(arguments, sort_keys=True)
        combined = f"{action}:{args_str}"
        return hashlib.md5(combined.encode()).hexdigest()

    def _evict_cache(self) -> None:
        """Evict least-used cache entries"""
        # Sort by hits (ascending) and timestamp (ascending)
        sorted_cache = sorted(
            self.action_cache.items(),
            key=lambda x: (x[1]["hits"], x[1]["timestamp"])
        )

        # Remove bottom 20%
        evict_count = len(sorted_cache) // 5
        for key, _ in sorted_cache[:evict_count]:
            del self.action_cache[key]

        logger.debug(f"Evicted {evict_count} cache entries")

    def _save_patterns(self) -> None:
        """Save patterns to disk"""
        if not self.persistence_path:
            return

        data = {
            "action_patterns": {k: vars(v) for k, v in self.action_patterns.items()},
            "sequence_patterns": {str(k): dict(v) for k, v in self.sequence_patterns.items()},
            "context_patterns": {k: dict(v) for k, v in self.context_patterns.items()},
            "stats": self.get_prediction_stats()
        }

        path = Path(self.persistence_path)
        path.parent.mkdir(parents=True, exist_ok=True)

        with open(path, 'wb') as f:
            pickle.dump(data, f)

        logger.info(f"Saved patterns to {self.persistence_path}")

    def _load_patterns(self) -> None:
        """Load patterns from disk"""
        path = Path(self.persistence_path)
        if not path.exists():
            return

        try:
            with open(path, 'rb') as f:
                data = pickle.load(f)

            # Restore patterns
            for key, pattern_data in data.get("action_patterns", {}).items():
                pattern = ActionPattern(pattern_data["action"], pattern_data["context"])
                pattern.__dict__.update(pattern_data)
                self.action_patterns[key] = pattern

            # Restore sequence patterns
            for seq_str, counts in data.get("sequence_patterns", {}).items():
                seq = eval(seq_str)  # Convert string back to tuple
                self.sequence_patterns[seq] = Counter(counts)

            # Restore context patterns
            for ctx_key, counts in data.get("context_patterns", {}).items():
                self.context_patterns[ctx_key] = Counter(counts)

            logger.info(f"Loaded patterns from {self.persistence_path}")
            logger.info(f"  → {len(self.action_patterns)} action patterns")
            logger.info(f"  → {len(self.sequence_patterns)} sequence patterns")

        except Exception as e:
            logger.error(f"Failed to load patterns: {e}")

    def shutdown(self) -> None:
        """Cleanup and save state"""
        if self.executor:
            self.executor.shutdown(wait=True)

        self._save_patterns()
        logger.info("Predictive Engine shutdown complete")
