from datetime import datetime
from typing import List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .data import sample_posts, sample_profiles
from .models import HealthResponse, Post, Profile

app = FastAPI(
    title="Medaka Social API",
    description="シンプルなメダカ専用SNSバックエンドのひな型",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", response_model=HealthResponse)
def health_check() -> HealthResponse:
    """Confirm the service is reachable."""
    return HealthResponse(status="ok", environment="development")


@app.get("/profiles", response_model=List[Profile])
def list_profiles() -> List[Profile]:
    """Return sample breeder profiles."""
    return sample_profiles


@app.get("/profiles/{profile_id}", response_model=Profile)
def get_profile(profile_id: int) -> Profile:
    for profile in sample_profiles:
        if profile.id == profile_id:
            return profile
    raise HTTPException(status_code=404, detail="Profile not found")


@app.get("/posts", response_model=List[Post])
def list_posts() -> List[Post]:
    """Return the feed ordered by creation time descending."""
    return sorted(sample_posts, key=lambda post: post.created_at, reverse=True)


@app.post("/posts", response_model=Post, status_code=201)
def create_post(post: Post) -> Post:
    """Add a new post to the in-memory feed."""
    new_id = max((p.id for p in sample_posts), default=0) + 1
    created = post.copy(update={"id": new_id, "created_at": datetime.utcnow()})
    sample_posts.append(created)
    return created
