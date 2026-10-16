// ============ تنظیمات ============
const USERS_URL = 'data/users.json';
const STORAGE_KEY = 'pg_current_user';
const USERS_CACHE = 'pg_users_cache';

// ============ بارگذاری کاربران ============
async function loadUsers() {
  // اول کش localStorage
  const cached = localStorage.getItem(USERS_CACHE);
  if (cached) {
    try { return JSON.parse(cached); } catch(e) {}
  }
  // وگرنه از فایل JSON
  try {
    const res = await fetch(USERS_URL);
    if (!res.ok) throw new Error('fetch failed');
    const data = await res.json();
    localStorage.setItem(USERS_CACHE, JSON.stringify(data));
    return data;
  } catch (err) {
    console.error('خطا در بارگذاری users.json:', err);
    return { users: [] };
  }
}

// ============ بررسی کلید ============
function findUserByKey(usersData, key) {
  if (!usersData || !usersData.users) return null;
  const clean = key.trim();
  return usersData.users.find(u => u.key === clean) || null;
}

// ============ هندل فرم لاگین ============
const form = document.getElementById('loginForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = document.getElementById('keyInput');
    const errorBox = document.getElementById('errorMsg');
    const key = input.value;

    errorBox.classList.remove('show');

    const usersData = await loadUsers();
    const user = findUserByKey(usersData, key);

    if (!user) {
      errorBox.textContent = '❌ کلید اشتباه است! دوباره امتحان کن.';
      errorBox.classList.add('show');
      input.value = '';
      input.focus();
      return;
    }

    if (!user.permissions.includes('game')) {
      errorBox.textContent = '⛔ این کلید به بخش بازی‌ها دسترسی ندارد.';
      errorBox.classList.add('show');
      return;
    }

    // ذخیره کاربر جاری
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));

    // رفتن به داشبورد
    window.location.href = 'dashboard.html';
  });
}