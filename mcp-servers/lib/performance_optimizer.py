"""
Performance Optimizer - Caching, async execution, rate limiting, and request queuing
"""
import asyncio
import logging
import time
import hashlib
import json
from typing import Dict, List, Any, Optional, Callable
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from collections import deque

logger = logging.getLogger(__name__)


@dataclass
class CacheEntry:
    """Represents a cached tool result."""
    key: str
    result: Any
    created_at: float
    access_count: int = 0
    last_accessed: float = field(default_factory=time.time)
    
    def is_expired(self, ttl: float) -> bool:
        """Check if cache entry is expired."""
        return (time.time() - self.created_at) > ttl
    
    def access(self):
        """Mark entry as accessed."""
        self.access_count += 1
        self.last_accessed = time.time()


@dataclass
class RateLimitBucket:
    """Token bucket for rate limiting."""
    capacity: int
    tokens: float
    refill_rate: float  # tokens per second
    last_refill: float = field(default_factory=time.time)
    
    def consume(self, tokens: int = 1) -> bool:
        """Try to consume tokens. Returns True if successful."""
        self._refill()
        
        if self.tokens >= tokens:
            self.tokens -= tokens
            return True
        return False
    
    def _refill(self):
        """Refill tokens based on elapsed time."""
        now = time.time()
        elapsed = now - self.last_refill
        
        self.tokens = min(
            self.capacity,
            self.tokens + (elapsed * self.refill_rate)
        )
        self.last_refill = now
    
    def wait_time(self, tokens: int = 1) -> float:
        """Calculate wait time needed for tokens."""
        self._refill()
        
        if self.tokens >= tokens:
            return 0.0
        
        tokens_needed = tokens - self.tokens
        return tokens_needed / self.refill_rate


@dataclass
class QueuedRequest:
    """Represents a queued request."""
    request_id: str
    tool_name: str
    arguments: Dict[str, Any]
    priority: int = 0
    created_at: float = field(default_factory=time.time)
    future: asyncio.Future = field(default_factory=asyncio.Future)


class PerformanceOptimizer:
    """Manages caching, async execution, rate limiting, and request queuing."""
    
    def __init__(
        self,
        tool_executor: Callable,
        cache_ttl: float = 300.0,  # 5 minutes
        max_cache_size: int = 1000,
        rate_limit_per_second: float = 10.0,
        max_concurrent: int = 5,
        queue_size: int = 100
    ):
        """
        Initialize the performance optimizer.
        
        Args:
            tool_executor: Async function to execute tools
            cache_ttl: Cache time-to-live in seconds
            max_cache_size: Maximum number of cache entries
            rate_limit_per_second: Maximum requests per second
            max_concurrent: Maximum concurrent executions
            queue_size: Maximum queue size
        """
        self.tool_executor = tool_executor
        self.cache_ttl = cache_ttl
        self.max_cache_size = max_cache_size
        
        # Cache storage
        self.cache: Dict[str, CacheEntry] = {}
        self.cache_hits = 0
        self.cache_misses = 0
        
        # Rate limiting
        self.rate_limiter = RateLimitBucket(
            capacity=int(rate_limit_per_second * 2),  # 2x burst capacity
            tokens=rate_limit_per_second * 2,
            refill_rate=rate_limit_per_second
        )
        
        # Concurrent execution control
        self.semaphore = asyncio.Semaphore(max_concurrent)
        self.active_tasks = 0
        
        # Request queue
        self.request_queue: deque[QueuedRequest] = deque(maxlen=queue_size)
        self.queue_processor_task: Optional[asyncio.Task] = None
        self.is_processing = False
        
        # Statistics
        self.total_requests = 0
        self.total_cache_hits = 0
        self.total_rate_limited = 0
        self.total_queued = 0
        
        logger.info(f"PerformanceOptimizer initialized (cache_ttl={cache_ttl}s, rate_limit={rate_limit_per_second}/s)")
    
    def _generate_cache_key(self, tool_name: str, arguments: Dict[str, Any]) -> str:
        """Generate a unique cache key for a tool call."""
        # Create deterministic string representation
        args_str = json.dumps(arguments, sort_keys=True)
        combined = f"{tool_name}:{args_str}"
        
        # Hash for shorter key
        return hashlib.sha256(combined.encode()).hexdigest()[:16]
    
    def _is_cacheable(self, tool_name: str) -> bool:
        """Determine if a tool's result should be cached."""
        # Don't cache tools that have side effects or time-sensitive results
        non_cacheable = {
            "snapshot", "screenshot", "camera",
            "type", "click", "move",  # UI interactions
            "shell", "exec",  # Command execution
            "file_ops",  # File operations
        }
        
        return tool_name.lower() not in non_cacheable
    
    async def execute(
        self,
        tool_name: str,
        arguments: Dict[str, Any],
        use_cache: bool = True,
        priority: int = 0,
        request_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Execute a tool with performance optimizations.
        
        Args:
            tool_name: Name of the tool
            arguments: Tool arguments
            use_cache: Whether to use caching
            priority: Request priority (higher = more important)
            request_id: Optional request identifier
            
        Returns:
            Dictionary with 'success', 'result', 'cached', 'wait_time' keys
        """
        self.total_requests += 1
        start_time = time.time()
        
        # Generate cache key
        cache_key = self._generate_cache_key(tool_name, arguments)
        
        # Check cache
        if use_cache and self._is_cacheable(tool_name):
            cached_result = self._get_from_cache(cache_key)
            if cached_result is not None:
                self.total_cache_hits += 1
                logger.info(f"✓ Cache hit for {tool_name} (key: {cache_key})")
                
                return {
                    "success": True,
                    "result": cached_result,
                    "cached": True,
                    "wait_time": 0,
                    "execution_time": time.time() - start_time
                }
        
        # Rate limiting check
        if not self.rate_limiter.consume():
            wait_time = self.rate_limiter.wait_time()
            self.total_rate_limited += 1
            
            logger.warning(f"⏱ Rate limited, waiting {wait_time:.2f}s")
            await asyncio.sleep(wait_time)
            self.rate_limiter.consume()  # Consume after waiting
        
        # Execute with concurrency control
        async with self.semaphore:
            self.active_tasks += 1
            
            try:
                logger.info(f"→ Executing {tool_name} (active: {self.active_tasks})")
                
                result = await self.tool_executor(tool_name, arguments)
                
                # Cache result if applicable
                if use_cache and self._is_cacheable(tool_name):
                    self._add_to_cache(cache_key, result)
                
                execution_time = time.time() - start_time
                logger.info(f"✓ {tool_name} completed in {execution_time:.2f}s")
                
                return {
                    "success": True,
                    "result": result,
                    "cached": False,
                    "wait_time": 0,
                    "execution_time": execution_time
                }
                
            except Exception as e:
                logger.error(f"✗ {tool_name} failed: {e}")
                return {
                    "success": False,
                    "result": None,
                    "error": str(e),
                    "cached": False,
                    "execution_time": time.time() - start_time
                }
            
            finally:
                self.active_tasks -= 1
    
    async def execute_batch(
        self,
        requests: List[Dict[str, Any]],
        parallel: bool = True
    ) -> List[Dict[str, Any]]:
        """
        Execute multiple tool calls, optionally in parallel.
        
        Args:
            requests: List of dicts with 'tool_name' and 'arguments'
            parallel: Execute in parallel if True
            
        Returns:
            List of results
        """
        logger.info(f"Executing batch of {len(requests)} requests (parallel={parallel})")
        
        if parallel:
            # Execute all in parallel
            tasks = [
                self.execute(req['tool_name'], req['arguments'])
                for req in requests
            ]
            return await asyncio.gather(*tasks, return_exceptions=True)
        else:
            # Execute sequentially
            results = []
            for req in requests:
                result = await self.execute(req['tool_name'], req['arguments'])
                results.append(result)
            return results
    
    def _get_from_cache(self, key: str) -> Optional[Any]:
        """Get result from cache."""
        entry = self.cache.get(key)
        
        if entry is None:
            self.cache_misses += 1
            return None
        
        if entry.is_expired(self.cache_ttl):
            # Remove expired entry
            del self.cache[key]
            self.cache_misses += 1
            return None
        
        entry.access()
        self.cache_hits += 1
        return entry.result
    
    def _add_to_cache(self, key: str, result: Any):
        """Add result to cache."""
        # Check cache size limit
        if len(self.cache) >= self.max_cache_size:
            self._evict_cache_entry()
        
        entry = CacheEntry(
            key=key,
            result=result,
            created_at=time.time()
        )
        
        self.cache[key] = entry
        logger.debug(f"Cached result (key: {key}, size: {len(self.cache)})")
    
    def _evict_cache_entry(self):
        """Evict least recently used cache entry."""
        if not self.cache:
            return
        
        # Find LRU entry
        lru_key = min(
            self.cache.keys(),
            key=lambda k: self.cache[k].last_accessed
        )
        
        del self.cache[lru_key]
        logger.debug(f"Evicted cache entry: {lru_key}")
    
    def clear_cache(self):
        """Clear all cache entries."""
        count = len(self.cache)
        self.cache.clear()
        logger.info(f"Cleared {count} cache entries")
    
    def get_stats(self) -> Dict[str, Any]:
        """Get performance statistics."""
        cache_hit_rate = (
            self.cache_hits / (self.cache_hits + self.cache_misses)
            if (self.cache_hits + self.cache_misses) > 0
            else 0
        )
        
        return {
            "total_requests": self.total_requests,
            "cache": {
                "size": len(self.cache),
                "hits": self.cache_hits,
                "misses": self.cache_misses,
                "hit_rate": f"{cache_hit_rate:.2%}"
            },
            "rate_limiting": {
                "total_limited": self.total_rate_limited,
                "current_tokens": self.rate_limiter.tokens,
                "capacity": self.rate_limiter.capacity
            },
            "concurrency": {
                "active_tasks": self.active_tasks,
                "max_concurrent": self.semaphore._value
            },
            "queue": {
                "size": len(self.request_queue),
                "total_queued": self.total_queued
            }
        }
    
    async def shutdown(self):
        """Shutdown the optimizer."""
        logger.info("Shutting down PerformanceOptimizer...")
        
        if self.queue_processor_task and not self.queue_processor_task.done():
            self.queue_processor_task.cancel()
            try:
                await self.queue_processor_task
            except asyncio.CancelledError:
                pass
        
        self.clear_cache()
        logger.info("PerformanceOptimizer shutdown complete")


# Example usage and testing
async def mock_tool_executor(tool_name: str, arguments: Dict[str, Any]) -> str:
    """Mock tool executor for testing."""
    await asyncio.sleep(0.2)  # Simulate execution time
    return f"Result from {tool_name} with {arguments}"


async def main():
    """Test the performance optimizer."""
    logging.basicConfig(level=logging.INFO, format='%(levelname)s - %(message)s')
    
    optimizer = PerformanceOptimizer(
        tool_executor=mock_tool_executor,
        cache_ttl=60.0,
        rate_limit_per_second=5.0,
        max_concurrent=3
    )
    
    print("\n" + "="*60)
    print("TEST 1: Cache Performance")
    print("="*60)
    
    # First call - cache miss
    result1 = await optimizer.execute("get_weather", {"location": "London"})
    print(f"First call - Cached: {result1['cached']}, Time: {result1['execution_time']:.3f}s")
    
    # Second call - cache hit
    result2 = await optimizer.execute("get_weather", {"location": "London"})
    print(f"Second call - Cached: {result2['cached']}, Time: {result2['execution_time']:.3f}s")
    
    print("\n" + "="*60)
    print("TEST 2: Parallel Execution")
    print("="*60)
    
    requests = [
        {"tool_name": "get_weather", "arguments": {"location": "Paris"}},
        {"tool_name": "get_weather", "arguments": {"location": "Tokyo"}},
        {"tool_name": "get_weather", "arguments": {"location": "NYC"}},
    ]
    
    start = time.time()
    results = await optimizer.execute_batch(requests, parallel=True)
    duration = time.time() - start
    
    print(f"Executed {len(results)} requests in {duration:.2f}s (parallel)")
    
    print("\n" + "="*60)
    print("TEST 3: Rate Limiting")
    print("="*60)
    
    # Try to exceed rate limit
    tasks = [
        optimizer.execute("api_call", {"id": i})
        for i in range(10)
    ]
    
    start = time.time()
    results = await asyncio.gather(*tasks)
    duration = time.time() - start
    
    print(f"Executed 10 requests in {duration:.2f}s (rate limited to 5/s)")
    
    print("\n" + "="*60)
    print("PERFORMANCE STATISTICS")
    print("="*60)
    
    stats = optimizer.get_stats()
    print(f"\nTotal Requests: {stats['total_requests']}")
    print(f"Cache Hit Rate: {stats['cache']['hit_rate']}")
    print(f"Rate Limited: {stats['rate_limiting']['total_limited']}")
    print(f"Active Tasks: {stats['concurrency']['active_tasks']}")
    
    await optimizer.shutdown()


if __name__ == "__main__":
    asyncio.run(main())
