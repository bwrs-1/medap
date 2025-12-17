const API_BASE =
  window.MEDAKA_API_BASE || localStorage.getItem('MEDAKA_API_BASE') || 'http://localhost:8000';

const feedEl = document.querySelector('#feed');
const profilesEl = document.querySelector('#profiles');
const postTemplate = document.querySelector('#post-template');
const profileTemplate = document.querySelector('#profile-template');

const skeleton = () => {
  const div = document.createElement('div');
  div.className = 'skeleton';
  return div;
};

function formatTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString('ja-JP', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const SAMPLE_PROFILES = [
  {
    id: 1,
    display_name: '青水ラボ',
    location: '愛知',
    favorite_variety: '三色ラメ幹之',
    bio: '稚魚から繁殖まで淡水で育てています。',
  },
  {
    id: 2,
    display_name: '緋色のめだか',
    location: '大阪',
    favorite_variety: '紅帝',
    bio: '屋外飼育で色揚げに挑戦中。',
  },
];

const SAMPLE_POSTS = [
  {
    id: 1,
    author_id: 1,
    body: '朝の水換え完了。青水がいい感じに育っています！',
    tags: ['水質管理', '青水'],
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    author_id: 2,
    body: '紅帝の稚魚が孵化しました。水温は26℃をキープ！',
    tags: ['繁殖', '稚魚'],
    created_at: new Date().toISOString(),
  },
];

async function fetchJson(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${path}: ${res.status}`);
  }
  return res.json();
}

async function loadProfiles() {
  try {
    return await fetchJson('/profiles');
  } catch (error) {
    console.warn('Fetching profiles failed; falling back to sample data.', error);
    return SAMPLE_PROFILES;
  }
}

async function loadPosts() {
  try {
    return await fetchJson('/posts');
  } catch (error) {
    console.warn('Fetching posts failed; falling back to sample data.', error);
    return SAMPLE_POSTS;
  }
}

async function renderFeed() {
  feedEl.replaceChildren(skeleton(), skeleton());
  try {
    const posts = await loadPosts();
    const profiles = await loadProfiles();
    const profileMap = Object.fromEntries(profiles.map((p) => [p.id, p]));

    const fragments = posts.map((post) => {
      const card = postTemplate.content.firstElementChild.cloneNode(true);
      const author = profileMap[post.author_id];
      card.querySelector('.author').textContent = author?.display_name ?? '名無しの飼育者';
      card.querySelector('.time').textContent = formatTime(post.created_at);
      card.querySelector('.body').textContent = post.body;

      const tagsEl = card.querySelector('.tags');
      post.tags.forEach((tag) => {
        const pill = document.createElement('span');
        pill.className = 'tag';
        pill.textContent = `#${tag}`;
        tagsEl.appendChild(pill);
      });
      return card;
    });

    feedEl.replaceChildren(...fragments);
  } catch (error) {
    feedEl.replaceChildren(errorNotice(error));
  }
}

async function renderProfiles() {
  profilesEl.replaceChildren(skeleton());
  try {
    const profiles = await loadProfiles();
    const fragments = profiles.map((profile) => {
      const card = profileTemplate.content.firstElementChild.cloneNode(true);
      card.querySelector('.profile__name').textContent = profile.display_name;
      card.querySelector('.profile__bio').textContent = profile.bio ?? '紹介文はまだありません。';

      const meta = card.querySelector('.profile__meta');
      const location = profile.location ? `拠点: ${profile.location}` : '拠点未設定';
      const favorite = profile.favorite_variety ? `推し種: ${profile.favorite_variety}` : '推し種未設定';
      meta.textContent = `${location} · ${favorite}`;

      return card;
    });
    profilesEl.replaceChildren(...fragments);
  } catch (error) {
    profilesEl.replaceChildren(errorNotice(error));
  }
}

function errorNotice(error) {
  const div = document.createElement('div');
  div.className = 'card';
  div.innerHTML = `<strong>データ取得に失敗しました。</strong><p class="body">${error.message}</p>`;
  return div;
}

renderFeed();
renderProfiles();
