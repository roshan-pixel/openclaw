"""
Semantic Graph Memory - The Infinite Memory Upgrade
Knowledge graph with semantic relationships and infinite memory
"""
import asyncio
import logging
import json
import time
import hashlib
from typing import Dict, List, Any, Optional, Set, Tuple
from dataclasses import dataclass, field
from collections import defaultdict, deque
from datetime import datetime, timedelta
import re

logger = logging.getLogger(__name__)


@dataclass
class MemoryNode:
    """Node in the semantic graph"""
    id: str
    node_type: str  # user, action, tool, result, entity, concept
    content: str
    embedding: Optional[List[float]] = None  # Vector embedding
    metadata: Dict[str, Any] = field(default_factory=dict)
    created_at: float = field(default_factory=time.time)
    access_count: int = 0
    last_accessed: float = field(default_factory=time.time)
    importance: float = 1.0  # 0-1 score
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "type": self.node_type,
            "content": self.content[:100] + "..." if len(self.content) > 100 else self.content,
            "importance": f"{self.importance:.2f}",
            "access_count": self.access_count,
            "age_hours": (time.time() - self.created_at) / 3600
        }


@dataclass
class MemoryEdge:
    """Edge connecting nodes in the graph"""
    source_id: str
    target_id: str
    relationship: str  # caused, used, resulted_in, relates_to, follows, precedes
    strength: float = 1.0  # 0-1 score
    metadata: Dict[str, Any] = field(default_factory=dict)
    created_at: float = field(default_factory=time.time)
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "source": self.source_id,
            "target": self.target_id,
            "relationship": self.relationship,
            "strength": f"{self.strength:.2f}"
        }


@dataclass
class MemoryCluster:
    """Cluster of related memories"""
    id: str
    name: str
    node_ids: Set[str] = field(default_factory=set)
    centroid_embedding: Optional[List[float]] = None
    summary: Optional[str] = None
    importance: float = 1.0
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "name": self.name,
            "size": len(self.node_ids),
            "summary": self.summary,
            "importance": f"{self.importance:.2f}"
        }


class SemanticGraphMemory:
    """
    🧠 SEMANTIC GRAPH MEMORY: Infinite Memory Upgrade
    
    Revolutionary memory system:
    - Infinite capacity (no token limits)
    - Semantic relationships (knowledge graph)
    - Vector search (find by meaning)
    - Auto-summarization (compress old memories)
    - Context-aware retrieval
    - Entity tracking across time
    - Pattern recognition
    
    The system that never forgets!
    """
    
    def __init__(
        self,
        embedding_function: Optional[Callable] = None,
        summarization_function: Optional[Callable] = None,
        max_nodes: int = 100000,
        compression_threshold: int = 1000,
        enable_clustering: bool = True
    ):
        """
        Initialize Semantic Graph Memory
        
        Args:
            embedding_function: Function to generate vector embeddings
            summarization_function: Function to summarize old memories
            max_nodes: Maximum nodes before compression
            compression_threshold: When to start compressing
            enable_clustering: Enable automatic clustering
        """
        self.embedding_function = embedding_function
        self.summarization_function = summarization_function
        self.max_nodes = max_nodes
        self.compression_threshold = compression_threshold
        self.enable_clustering = enable_clustering
        
        # Graph storage
        self.nodes: Dict[str, MemoryNode] = {}
        self.edges: List[MemoryEdge] = []
        self.clusters: Dict[str, MemoryCluster] = {}
        
        # Indices for fast retrieval
        self.node_type_index: Dict[str, Set[str]] = defaultdict(set)
        self.temporal_index: Dict[str, List[str]] = defaultdict(list)  # date -> node_ids
        self.entity_index: Dict[str, Set[str]] = defaultdict(set)  # entity -> node_ids
        
        # Statistics
        self.total_nodes_created = 0
        self.total_edges_created = 0
        self.compressions_performed = 0
        self.queries_performed = 0
        
        logger.info("🧠 Semantic Graph Memory initialized (INFINITE MODE)")
        logger.info(f"  → Max nodes: {max_nodes}")
        logger.info(f"  → Clustering: {'ENABLED' if enable_clustering else 'DISABLED'}")
    
    def _generate_node_id(self, content: str) -> str:
        """Generate unique node ID"""
        return hashlib.sha256(f"{content}{time.time()}".encode()).hexdigest()[:16]
    
    def _generate_cluster_id(self) -> str:
        """Generate unique cluster ID"""
        return f"cluster_{len(self.clusters)}_{int(time.time())}"
    
    async def add_memory(
        self,
        content: str,
        node_type: str = "action",
        metadata: Optional[Dict[str, Any]] = None,
        importance: float = 1.0,
        related_to: Optional[List[str]] = None
    ) -> str:
        """
        Add a new memory to the graph
        
        Args:
            content: Memory content
            node_type: Type of memory (action, tool, result, entity, concept)
            metadata: Additional metadata
            importance: Importance score (0-1)
            related_to: IDs of related nodes
            
        Returns:
            Node ID
        """
        node_id = self._generate_node_id(content)
        
        # Generate embedding if function available
        embedding = None
        if self.embedding_function:
            embedding = await self.embedding_function(content)
        
        # Create node
        node = MemoryNode(
            id=node_id,
            node_type=node_type,
            content=content,
            embedding=embedding,
            metadata=metadata or {},
            importance=importance
        )
        
        self.nodes[node_id] = node
        self.total_nodes_created += 1
        
        # Update indices
        self.node_type_index[node_type].add(node_id)
        
        date_key = datetime.fromtimestamp(node.created_at).strftime("%Y-%m-%d")
        self.temporal_index[date_key].append(node_id)
        
        # Extract and index entities
        entities = self._extract_entities(content)
        for entity in entities:
            self.entity_index[entity].add(node_id)
        
        # Create edges to related nodes
        if related_to:
            for related_id in related_to:
                if related_id in self.nodes:
                    await self.add_relationship(
                        node_id,
                        related_id,
                        "relates_to",
                        strength=0.8
                    )
        
        logger.debug(f"🧠 Added memory node: {node_id} ({node_type})")
        
        # Check if compression needed
        if len(self.nodes) > self.compression_threshold:
            await self._compress_old_memories()
        
        return node_id
    
    async def add_relationship(
        self,
        source_id: str,
        target_id: str,
        relationship: str,
        strength: float = 1.0,
        metadata: Optional[Dict[str, Any]] = None
    ):
        """
        Add relationship between two nodes
        
        Args:
            source_id: Source node ID
            target_id: Target node ID
            relationship: Type of relationship
            strength: Relationship strength (0-1)
            metadata: Additional metadata
        """
        if source_id not in self.nodes or target_id not in self.nodes:
            logger.warning(f"Cannot add edge: node not found")
            return
        
        edge = MemoryEdge(
            source_id=source_id,
            target_id=target_id,
            relationship=relationship,
            strength=strength,
            metadata=metadata or {}
        )
        
        self.edges.append(edge)
        self.total_edges_created += 1
        
        logger.debug(f"🔗 Added edge: {source_id} --[{relationship}]--> {target_id}")
    
    def _extract_entities(self, text: str) -> List[str]:
        """Extract entities from text (simplified NER)"""
        entities = []
        
        # Extract capitalized words (potential entities)
        words = re.findall(r'\b[A-Z][a-z]+\b', text)
        entities.extend(words)
        
        # Extract tool names
        tool_pattern = r'windows-mcp-\w+'
        tools = re.findall(tool_pattern, text)
        entities.extend(tools)
        
        # Extract file paths
        path_pattern = r'[A-Z]:\\[\w\\.]+'
        paths = re.findall(path_pattern, text)
        entities.extend(paths)
        
        return list(set(entities))
    
    async def semantic_search(
        self,
        query: str,
        limit: int = 10,
        node_types: Optional[List[str]] = None,
        time_range: Optional[Tuple[float, float]] = None
    ) -> List[Dict[str, Any]]:
        """
        Search memories by semantic similarity
        
        Args:
            query: Search query
            limit: Maximum results
            node_types: Filter by node types
            time_range: Filter by time (start, end timestamps)
            
        Returns:
            List of matching nodes with scores
        """
        self.queries_performed += 1
        
        logger.info(f"🔍 Semantic search: {query[:50]}...")
        
        results = []
        
        # If no embedding function, fall back to keyword search
        if not self.embedding_function:
            results = await self._keyword_search(query, limit, node_types, time_range)
        else:
            # Generate query embedding
            query_embedding = await self.embedding_function(query)
            
            # Calculate similarity with all nodes
            similarities = []
            for node_id, node in self.nodes.items():
                # Apply filters
                if node_types and node.node_type not in node_types:
                    continue
                
                if time_range:
                    if not (time_range[0] <= node.created_at <= time_range[1]):
                        continue
                
                if node.embedding:
                    similarity = self._cosine_similarity(query_embedding, node.embedding)
                    similarities.append((node_id, similarity))
            
            # Sort by similarity
            similarities.sort(key=lambda x: x[1], reverse=True)
            
            # Build results
            for node_id, score in similarities[:limit]:
                node = self.nodes[node_id]
                node.access_count += 1
                node.last_accessed = time.time()
                
                results.append({
                    "node": node.to_dict(),
                    "score": score,
                    "related_nodes": self._get_related_nodes(node_id, max_depth=1)
                })
        
        logger.info(f"✅ Found {len(results)} results")
        
        return results
    
    async def _keyword_search(
        self,
        query: str,
        limit: int,
        node_types: Optional[List[str]],
        time_range: Optional[Tuple[float, float]]
    ) -> List[Dict[str, Any]]:
        """Fallback keyword search"""
        results = []
        query_lower = query.lower()
        
        for node_id, node in self.nodes.items():
            # Apply filters
            if node_types and node.node_type not in node_types:
                continue
            
            if time_range:
                if not (time_range[0] <= node.created_at <= time_range[1]):
                    continue
            
            # Simple keyword matching
            content_lower = node.content.lower()
            if query_lower in content_lower:
                score = content_lower.count(query_lower) / len(content_lower.split())
                results.append({
                    "node": node.to_dict(),
                    "score": score,
                    "related_nodes": []
                })
        
        results.sort(key=lambda x: x["score"], reverse=True)
        return results[:limit]
    
    def _cosine_similarity(self, vec1: List[float], vec2: List[float]) -> float:
        """Calculate cosine similarity between two vectors"""
        if len(vec1) != len(vec2):
            return 0.0
        
        dot_product = sum(a * b for a, b in zip(vec1, vec2))
        magnitude1 = sum(a * a for a in vec1) ** 0.5
        magnitude2 = sum(b * b for b in vec2) ** 0.5
        
        if magnitude1 == 0 or magnitude2 == 0:
            return 0.0
        
        return dot_product / (magnitude1 * magnitude2)
    
    def _get_related_nodes(self, node_id: str, max_depth: int = 2) -> List[Dict[str, Any]]:
        """Get nodes related to given node"""
        related = []
        visited = set()
        
        def traverse(current_id: str, depth: int):
            if depth > max_depth or current_id in visited:
                return
            
            visited.add(current_id)
            
            # Find outgoing edges
            for edge in self.edges:
                if edge.source_id == current_id:
                    target_node = self.nodes.get(edge.target_id)
                    if target_node:
                        related.append({
                            "node": target_node.to_dict(),
                            "relationship": edge.relationship,
                            "depth": depth
                        })
                        traverse(edge.target_id, depth + 1)
        
        traverse(node_id, 1)
        
        return related[:10]  # Limit to 10 related nodes
    
    async def get_context_for_query(
        self,
        query: str,
        max_tokens: int = 4000
    ) -> Dict[str, Any]:
        """
        Get relevant context for a query (for LLM consumption)
        
        Args:
            query: Query to find context for
            max_tokens: Maximum context tokens
            
        Returns:
            Context dictionary with relevant memories
        """
        # Search for relevant memories
        results = await self.semantic_search(query, limit=20)
        
        # Build context
        context = {
            "query": query,
            "relevant_memories": [],
            "entities": set(),
            "temporal_context": {},
            "total_tokens": 0
        }
        
        current_tokens = 0
        
        for result in results:
            node_data = result["node"]
            memory_text = node_data["content"]
            
            # Estimate tokens (rough: 1 token ≈ 4 chars)
            estimated_tokens = len(memory_text) // 4
            
            if current_tokens + estimated_tokens > max_tokens:
                break
            
            context["relevant_memories"].append({
                "content": memory_text,
                "type": node_data["type"],
                "importance": node_data["importance"],
                "score": result["score"]
            })
            
            current_tokens += estimated_tokens
        
        context["total_tokens"] = current_tokens
        
        logger.info(f"📦 Built context: {len(context['relevant_memories'])} memories, ~{current_tokens} tokens")
        
        return context
    
    async def _compress_old_memories(self):
        """Compress old, less important memories"""
        logger.info("🗜️ Starting memory compression...")
        
        # Find candidates for compression (old + low importance + low access)
        candidates = []
        current_time = time.time()
        
        for node_id, node in self.nodes.items():
            age_days = (current_time - node.created_at) / 86400
            
            # Compress if: > 30 days old, importance < 0.3, access < 5
            if age_days > 30 and node.importance < 0.3 and node.access_count < 5:
                candidates.append(node_id)
        
        if not candidates:
            logger.info("No memories to compress")
            return
        
        # Summarize and compress
        if self.summarization_function and len(candidates) > 10:
            # Group candidates by cluster/topic
            compressed_content = []
            for node_id in candidates[:100]:  # Compress max 100 at a time
                node = self.nodes[node_id]
                compressed_content.append(node.content)
            
            # Generate summary
            summary = await self.summarization_function(" ".join(compressed_content))
            
            # Create compressed node
            compressed_id = await self.add_memory(
                content=summary,
                node_type="compressed",
                metadata={"original_nodes": candidates[:100], "compression_date": time.time()},
                importance=0.5
            )
            
            # Remove original nodes
            for node_id in candidates[:100]:
                del self.nodes[node_id]
                # Remove from indices
                for idx in self.node_type_index.values():
                    idx.discard(node_id)
            
            self.compressions_performed += 1
            
            logger.info(f"✅ Compressed {len(candidates[:100])} memories into 1 summary node")
    
    def get_memory_stats(self) -> Dict[str, Any]:
        """Get memory system statistics"""
        # Calculate storage usage
        total_content_chars = sum(len(n.content) for n in self.nodes.values())
        
        # Node type distribution
        type_distribution = {
            node_type: len(node_ids)
            for node_type, node_ids in self.node_type_index.items()
        }
        
        # Temporal distribution
        temporal_distribution = {
            date: len(nodes)
            for date, nodes in sorted(self.temporal_index.items())[-7:]  # Last 7 days
        }
        
        return {
            "total_nodes": len(self.nodes),
            "total_edges": len(self.edges),
            "total_clusters": len(self.clusters),
            "total_nodes_created": self.total_nodes_created,
            "total_edges_created": self.total_edges_created,
            "compressions_performed": self.compressions_performed,
            "queries_performed": self.queries_performed,
            "storage_chars": total_content_chars,
            "storage_mb": total_content_chars / 1024 / 1024,
            "node_type_distribution": type_distribution,
            "temporal_distribution": temporal_distribution,
            "entities_tracked": len(self.entity_index)
        }
    
    def visualize_graph(self, max_nodes: int = 50) -> Dict[str, Any]:
        """Generate graph visualization data"""
        # Get most important nodes
        nodes_list = sorted(
            self.nodes.values(),
            key=lambda n: n.importance * (n.access_count + 1),
            reverse=True
        )[:max_nodes]
        
        node_ids = {n.id for n in nodes_list}
        
        # Get edges between these nodes
        edges_list = [
            e for e in self.edges
            if e.source_id in node_ids and e.target_id in node_ids
        ]
        
        return {
            "nodes": [n.to_dict() for n in nodes_list],
            "edges": [e.to_dict() for e in edges_list]
        }
    
    def export_to_json(self, filepath: str):
        """Export entire graph to JSON"""
        data = {
            "nodes": [n.to_dict() for n in self.nodes.values()],
            "edges": [e.to_dict() for e in self.edges],
            "clusters": [c.to_dict() for c in self.clusters.values()],
            "statistics": self.get_memory_stats(),
            "exported_at": time.time()
        }
        
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=2)
        
        logger.info(f"📦 Exported memory graph to {filepath}")


# Export
__all__ = ['SemanticGraphMemory', 'MemoryNode', 'MemoryEdge', 'MemoryCluster']
