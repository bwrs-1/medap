from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class Profile(BaseModel):
    id: int = Field(..., description="Internal profile identifier")
    display_name: str = Field(..., description="Public facing name")
    location: Optional[str] = Field(None, description="Breeding region or habitat")
    favorite_variety: Optional[str] = Field(None, description="Preferred medaka variety")
    bio: Optional[str] = Field(None, description="Short profile bio")


class Post(BaseModel):
    id: int
    author_id: int
    body: str = Field(..., description="Post content")
    tags: List[str] = Field(default_factory=list, description="Topic tags for discovery")
    created_at: datetime = Field(default_factory=datetime.utcnow)


class HealthResponse(BaseModel):
    status: str
    environment: str
