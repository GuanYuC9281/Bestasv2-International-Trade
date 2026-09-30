/* GitHub Pages can provide only a client-side entry gate, not private access control. */
(() => {
  'use strict';
  const expected = 'be138c31ae3f73f4255cabef4a60fab6aedac563d521610115988eb705ca61ca';
  const salt = 'besta-engineering-login-v1';
  const iterations = 120000;
  const gate = document.getElementById('login-gate');
  const content = document.getElementById('protected-content');
  const form = document.getElementById('login-form');
  const account = document.getElementById('login-account');
  const password = document.getElementById('login-password');
  const error = document.getElementById('login-error');
  const submit = document.getElementById('login-submit');
  let failures = 0;
  let unlocked = false;

  const lock = () => {
    if (!unlocked) return;
    unlocked = false;
    content.hidden = true;
    gate.hidden = false;
    form.reset();
    error.textContent = '';
    document.dispatchEvent(new Event('engineering-lock'));
  };

  async function keyFor(user, secret) {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey('raw', encoder.encode(user + '\0' + secret), 'PBKDF2', false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: encoder.encode(salt), iterations, hash: 'SHA-256' }, key, 256);
    return Array.from(new Uint8Array(bits), byte => byte.toString(16).padStart(2, '0')).join('');
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submit.disabled) return;
    submit.disabled = true;
    error.textContent = '';
    try {
      const digest = await keyFor(account.value.trim(), password.value);
      if (digest !== expected) {
        failures += 1;
        password.value = '';
        if (failures >= 3) {
          location.replace('../');
          return;
        }
        error.textContent = `帳號或密碼錯誤，還可嘗試 ${3 - failures} 次。`;
        password.focus();
        return;
      }
      if (document.hidden) return;
      failures = 0;
      unlocked = true;
      password.value = '';
      account.value = '';
      gate.hidden = true;
      content.hidden = false;
      document.getElementById('title').setAttribute('tabindex', '-1');
      document.getElementById('title').focus({ preventScroll: true });
    } catch (_) {
      error.textContent = '目前瀏覽器無法驗證登入，請使用 HTTPS 開啟本頁。';
    } finally {
      submit.disabled = false;
    }
  });

  document.addEventListener('visibilitychange', () => { if (document.hidden) lock(); });
  window.addEventListener('pagehide', lock);
  window.addEventListener('pageshow', event => { if (event.persisted) lock(); });
})();
