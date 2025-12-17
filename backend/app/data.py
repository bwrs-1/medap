from datetime import datetime
from typing import List

from .models import Post, Profile

sample_profiles: List[Profile] = [
    Profile(
        id=1,
        display_name="青水ラボ",
        location="愛知",
        favorite_variety="三色ラメ幹之",
        bio="稚魚から繁殖まで淡水で育てています。",
    ),
    Profile(
        id=2,
        display_name="緋色のめだか",
        location="大阪",
        favorite_variety="紅帝",
        bio="屋外飼育で色揚げに挑戦中。",
    ),
]

sample_posts: List[Post] = [
    Post(
        id=1,
        author_id=1,
        body="朝の水換え完了。青水がいい感じに育っています！",
        tags=["水質管理", "青水"],
        created_at=datetime.utcnow(),
    ),
    Post(
        id=2,
        author_id=2,
        body="紅帝の稚魚が孵化しました。水温は26℃をキープ！",
        tags=["繁殖", "稚魚"],
        created_at=datetime.utcnow(),
    ),
]
