// 簡單管理員頁面示範
const db = firebase.database();
const adminContent = document.getElementById('admin-content');
const ADMIN_UID = 'YOUR_DISCORD_ADMIN_ID'; // 管理員 Discord ID

async function fetchDiscordUser(token) {
  const res = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Discord API 請求失敗');
  return res.json();
}

function checkAdmin(userId) {
  return userId === ADMIN_UID;
}

async function init() {
  // 此頁需自行透過 OAuth token 取得 userId，並驗證是否為管理員
  adminContent.innerText = '管理後台尚未完成，請自行擴充';
}

init();