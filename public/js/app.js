async function loadUser() {
  try {
    const res = await fetch('/api/me');
    const user = await res.json();
    const el = document.getElementById('user-area');
    if (!el) return;
    if (user) {
      el.innerHTML = `
        <span style="margin-right:.8rem">👋 ${user.name}</span>
        <a href="/api/logout" class="btn" style="padding:.4rem .9rem;font-size:.85rem">Logout</a>
      `;
    } else {
      el.innerHTML = `<a href="/login.html" class="btn" style="padding:.4rem .9rem;font-size:.85rem">Login</a>`;
    }
  } catch (e) { console.warn(e); }
}
document.addEventListener('DOMContentLoaded', loadUser);
