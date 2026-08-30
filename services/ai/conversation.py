"""
Conversation Management for KrishiMitra AI
"""

import uuid
from datetime import datetime
from typing import List, Dict, Optional
from collections import defaultdict


class ConversationManager:
    """
    Manages conversation history and sessions for the AI chatbot
    
    In-memory storage for now. Can be replaced with database storage later.
    """
    
    def __init__(self):
        # Store conversations: conversation_id -> list of messages
        self.conversations: Dict[str, List[Dict]] = defaultdict(list)
        
        # Store metadata: conversation_id -> metadata
        self.metadata: Dict[str, Dict] = {}
    
    def create_conversation(
        self,
        language: str = "hi",
        user_id: Optional[str] = None
    ) -> str:
        """
        Create a new conversation session
        
        Returns:
            conversation_id
        """
        conversation_id = str(uuid.uuid4())
        
        self.conversations[conversation_id] = []
        self.metadata[conversation_id] = {
            "created_at": datetime.utcnow().isoformat(),
            "language": language,
            "user_id": user_id,
            "message_count": 0
        }
        
        return conversation_id
    
    def add_message(
        self,
        conversation_id: str,
        role: str,
        content: str,
        message_type: str = "text"
    ) -> None:
        """
        Add a message to the conversation
        
        Args:
            conversation_id: Conversation ID
            role: "user" or "assistant"
            content: Message content (text)
            message_type: "text" or "voice"
        """
        if conversation_id not in self.conversations:
            # Create conversation if it doesn't exist
            self.conversations[conversation_id] = []
            self.metadata[conversation_id] = {
                "created_at": datetime.utcnow().isoformat(),
                "language": "hi",
                "message_count": 0
            }
        
        message = {
            "role": role,
            "content": content,
            "timestamp": datetime.utcnow().isoformat(),
            "type": message_type
        }
        
        self.conversations[conversation_id].append(message)
        self.metadata[conversation_id]["message_count"] += 1
        self.metadata[conversation_id]["last_updated"] = datetime.utcnow().isoformat()
    
    def get_conversation_history(
        self,
        conversation_id: str,
        limit: Optional[int] = None
    ) -> List[Dict[str, str]]:
        """
        Get conversation history for AI context
        
        Returns messages in format: [{"role": "user/assistant", "content": "..."}]
        """
        if conversation_id not in self.conversations:
            return []
        
        messages = self.conversations[conversation_id]
        
        # Apply limit if specified
        if limit:
            messages = messages[-limit:]
        
        # Return in format expected by AI providers
        return [
            {"role": msg["role"], "content": msg["content"]}
            for msg in messages
        ]
    
    def get_full_conversation(
        self,
        conversation_id: str
    ) -> List[Dict]:
        """
        Get full conversation with all metadata
        """
        if conversation_id not in self.conversations:
            return []
        
        return self.conversations[conversation_id]
    
    def get_conversation_metadata(
        self,
        conversation_id: str
    ) -> Optional[Dict]:
        """
        Get conversation metadata
        """
        return self.metadata.get(conversation_id)
    
    def conversation_exists(self, conversation_id: str) -> bool:
        """Check if conversation exists"""
        return conversation_id in self.conversations
    
    def delete_conversation(self, conversation_id: str) -> bool:
        """Delete a conversation"""
        if conversation_id in self.conversations:
            del self.conversations[conversation_id]
            del self.metadata[conversation_id]
            return True
        return False
    
    def get_recent_conversations(
        self,
        user_id: Optional[str] = None,
        limit: int = 10
    ) -> List[Dict]:
        """
        Get recent conversations
        
        Returns list of conversation summaries
        """
        conversations = []
        
        for conv_id, metadata in self.metadata.items():
            if user_id and metadata.get("user_id") != user_id:
                continue
            
            conversations.append({
                "conversation_id": conv_id,
                "created_at": metadata.get("created_at"),
                "last_updated": metadata.get("last_updated"),
                "language": metadata.get("language"),
                "message_count": metadata.get("message_count"),
                "preview": self._get_conversation_preview(conv_id)
            })
        
        # Sort by last_updated descending
        conversations.sort(
            key=lambda x: x.get("last_updated", x.get("created_at", "")),
            reverse=True
        )
        
        return conversations[:limit]
    
    def _get_conversation_preview(self, conversation_id: str) -> Optional[str]:
        """Get first user message as preview"""
        messages = self.conversations.get(conversation_id, [])
        for msg in messages:
            if msg["role"] == "user":
                content = msg["content"]
                return content[:50] + "..." if len(content) > 50 else content
        return None


# Global conversation manager instance
conversation_manager = ConversationManager()
