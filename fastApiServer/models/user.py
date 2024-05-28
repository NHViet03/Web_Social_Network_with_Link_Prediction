from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date
from uuid import UUID

class User(BaseModel):
    fullname: str = Field(..., max_length=25)
    username: str = Field(..., max_length=25)
    email: str
    password: str
    birthday: Optional[date] = None
    avatar: str = Field(
        default="https://static-00.iconduck.com/assets.00/avatar-default-symbolic-icon-2048x1949-pq9uiebg.png"
    )
    role: str = Field(default="user")
    gender: str = Field(default="male")
    story: str = Field(default="", max_length=200)
    website: str = None
    followers: List[UUID] = []
    following: List[UUID] = []
    saved: List[UUID] = []

    class Config:
        orm_mode = True
