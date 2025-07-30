// 解析 URL fragment 取得 Discord OAuth token
function getAccessToken() {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  return params.get('access_token');
}

async function fetchDiscordUser(token) {
  const res = await fetch('https://discord.com/api/users/@me', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error('Discord API 請求失敗');
  return res.json();
}

const accessToken = getAccessToken();
const loginStatus = document.getElementById('login-status');
const voteSection = document.getElementById('vote-section');
const candidateListEl = document.getElementById('candidate-list');
const voteResult = document.getElementById('vote-result');
let user = null;
let userId = null;

async function init() {
  if (!accessToken) {
    loginStatus.innerHTML = '<a href="login.html">請先使用 Discord 登入</a>';
    return;
  }
  try {
    loginStatus.innerText = '載入 Discord 使用者資訊...';
    user = await fetchDiscordUser(accessToken);
    userId = user.id;
    loginStatus.innerText = `歡迎，${user.username}！請選擇候選人投票。`;
    voteSection.style.display = 'block';
    loadCandidates();
  } catch (error) {
    loginStatus.innerText = 'Discord 登入失敗，請重新嘗試。';
  }
}

async function loadCandidates() {
  const db = firebase.database();
  const candidatesRef = db.ref('candidates');
  candidatesRef.once('value', (snapshot) => {
    const candidates = snapshot.val();
    if (!candidates) {
      candidateListEl.innerHTML = '尚無候選人';
      return;
    }
    candidateListEl.innerHTML = '';
    Object.entries(candidates).forEach(([id, candidate]) => {
      const li = document.createElement('li');
      li.innerHTML = `<button data-id="${id}">${candidate.name} (${candidate.party || '無黨籍'})</button>`;
      candidateListEl.appendChild(li);
    });

    // 綁定投票按鈕事件
    candidateListEl.querySelectorAll('button').forEach((btn) => {
      btn.addEventListener('click', () => vote(btn.dataset.id));
    });
  });
}

function vote(candidateId) {
  const db = firebase.database();
  const voteRef = db.ref('votes/' + userId);

  voteRef.once('value', (snapshot) => {
    if (snapshot.exists()) {
      voteResult.innerText = '❌ 您已投過票，無法重複投票。';
      return;
    }
    voteRef.set({
      candidateId,
      votedAt: Date.now()
    }, (error) => {
      if (error) {
        voteResult.innerText = '❌ 投票失敗，請稍後再試。';
      } else {
        voteResult.innerText = '✅ 投票成功，感謝您的參與！';
      }
    });
  });
}

init();