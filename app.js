/* Reliant Forex Partners — simulated mobile demo. No backend; nothing is sent anywhere. */
(function () {
  'use strict';
  var screens = {};
  document.querySelectorAll('.rf-screen').forEach(function (s) { screens[s.dataset.route] = s; });
  var SECTION = { // screen number -> Menu section key
    '02': 'dashboard', '03': 'payment', '04': 'payment', '05': 'payment', '06': 'payment', '07': 'payment', '08': 'payment', '09': 'payment',
    '10': 'recipients', '11': 'recipients', '12': 'recipients', '13': 'recipients',
    '14': 'market-orders', '15': 'market-orders', '16': 'market-orders', '17': 'market-orders', '18': 'market-orders',
    '19': 'rate-alerts', '20': 'rate-alerts', '21': 'transfers', '22': 'transfers', '23': 'balances', '24': 'balances'
  };
  var MENU = [
    ['dashboard', 'Dashboard / Home', 'house.svg'],
    ['payment', 'Initiate Payment', 'arrow-up-right.svg'],
    ['recipients', 'Recipients', 'users.svg'],
    ['market-orders', 'Market Orders', 'chart-no-axes-combined.svg'],
    ['rate-alerts', 'Rate Alerts', 'bell.svg'],
    ['transfers', 'Transfer History', 'history.svg'],
    ['balances', 'Currency Balances', 'wallet.svg']
  ];
  var store = window.sessionStorage;
  var current = null;
  var recipientOrigin = 'recipients';

  function parseHash() {
    var h = (location.hash || '').replace(/^#\/?/, '');
    var parts = h.split('?');
    var q = {};
    (parts[1] || '').split('&').forEach(function (kv) { if (kv) { var p = kv.split('='); q[decodeURIComponent(p[0])] = decodeURIComponent(p[1] || ''); } });
    return { route: parts[0], query: q };
  }
  function go(route) { location.hash = '#/' + route; }

  function render() {
    var r = parseHash();
    var oldToast = document.querySelector('.rf-toast');
    if (oldToast && Date.now() - toastShownAt > 400) oldToast.hidden = true;
    var target = screens[r.route];
    if (!target) { location.replace('#/sign-in'); return; }
    if (r.route === 'add-recipient') recipientOrigin = r.query.origin === 'allocation' ? 'allocation' : 'recipients';
    closeOverlay();
    if (current && current !== target) current.hidden = true;
    target.hidden = false;
    current = target;
    document.title = target.dataset.title + ' · Reliant Forex Partners (demo)';
    window.scrollTo(0, 0);
  }

  /* Keep typed values while moving between steps (previous task keeps its data). */
  function restoreFields() {
    document.querySelectorAll('.rf-field').forEach(function (f) {
      if (f.type === 'password') return;
      var v = store.getItem('rf:' + f.id);
      if (v !== null) f.value = v;
      f.addEventListener('input', function () { store.setItem('rf:' + f.id, f.value); });
      f.addEventListener('change', function () { store.setItem('rf:' + f.id, f.value); });
    });
  }

  /* Overlays */
  var overlay = null, lastFocus = null;
  function closeOverlay() {
    if (!overlay) return;
    overlay.remove(); overlay = null;
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
  }
  function openSheet(node) {
    closeOverlay();
    lastFocus = document.activeElement;
    overlay = document.createElement('div');
    overlay.className = 'rf-overlay';
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeOverlay(); });
    overlay.appendChild(node);
    document.body.appendChild(overlay);
    var first = node.querySelector('button, a');
    if (first) first.focus();
  }
  function el(tag, attrs, text) {
    var e = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (text) e.textContent = text;
    return e;
  }
  function openMenu() {
    var sec = SECTION[current.dataset.screen];
    var sheet = el('div', { 'class': 'rf-sheet', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'rf-menu-title' });
    var head = el('div', { 'class': 'rf-sheet-head' });
    head.appendChild(el('h2', { id: 'rf-menu-title' }, 'Menu'));
    var close = el('button', { type: 'button', 'class': 'rf-close', 'data-action': 'close' }, 'Close');
    head.appendChild(close);
    sheet.appendChild(head);
    sheet.appendChild(el('p', {}, 'Workspace sections · Harborline Imports LLC'));
    MENU.forEach(function (m) {
      var a = el('a', { href: '#/' + m[0], 'class': 'rf-menu-item' });
      if (m[0] === sec) a.setAttribute('aria-current', 'page');
      var img = el('img', { src: 'assets/' + m[2], alt: '' });
      a.appendChild(img);
      a.appendChild(el('span', {}, m[1]));
      var chev = el('img', { src: 'assets/chevron-right.svg', alt: '' });
      chev.style.width = chev.style.height = '18px';
      a.appendChild(chev);
      sheet.appendChild(a);
    });
    sheet.appendChild(el('a', { href: '#/sign-in', 'class': 'rf-btn', 'data-action': 'sign-out' }, 'Sign Out · simulated'));
    openSheet(sheet);
  }
  function confirmSheet(title, body, yes, no, onYes) {
    var sheet = el('div', { 'class': 'rf-sheet', role: 'alertdialog', 'aria-modal': 'true', 'aria-labelledby': 'rf-confirm-title' });
    sheet.appendChild(el('h2', { id: 'rf-confirm-title' }, title));
    sheet.appendChild(el('p', {}, body));
    var y = el('button', { type: 'button', 'class': 'rf-btn rf-btn-primary' }, yes);
    var n = el('button', { type: 'button', 'class': 'rf-btn' }, no);
    y.addEventListener('click', function () { closeOverlay(); onYes(); });
    n.addEventListener('click', closeOverlay);
    sheet.appendChild(y); sheet.appendChild(n);
    openSheet(sheet);
  }
  var toastTimer = null, toastShownAt = 0;
  function toast(msg) {
    var t = document.querySelector('.rf-toast');
    if (!t) { t = el('div', { 'class': 'rf-toast', role: 'status', 'aria-live': 'polite' }); document.body.appendChild(t); }
    t.textContent = msg; t.hidden = false;
    toastShownAt = Date.now();
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, 3200);
  }

  var ACTIONS = {
    'open-menu': openMenu,
    'close': closeOverlay,
    'toggle-password': function (btn) {
      var pw = current.querySelector('input[type=password], input[data-was-password]');
      if (!pw) return;
      var show = pw.type === 'password';
      pw.type = show ? 'text' : 'password';
      pw.setAttribute('data-was-password', '1');
      btn.querySelector('p').textContent = show ? 'Hide password' : 'Show password';
    },
    'refresh-quote': function () { toast('Quote refreshed · demo rates are unchanged (simulated).'); },
    'bank-funding': function () { toast('Bank funding is an alternative branch in this demo. Continuing with USD balance funding.'); },
    'request-activation': function () { toast('Activation request noted · acknowledgement only. Nothing is activated or placed.'); },
    'apply-filters': function () { toast('Filters applied · historical records are static examples.'); },
    'save-recipient': function () {
      if (recipientOrigin === 'allocation') { toast('Recipient saved (simulated). Your booked quote and payment draft are unchanged.'); go('allocate-recipient'); }
      else { toast('Recipient saved (simulated).'); go('recipient'); }
    },
    'cancel-recipient': function () { go(recipientOrigin === 'allocation' ? 'allocate-recipient' : 'recipients'); },
    'save-edit': function () { toast('Changes saved (simulated).'); go('recipient'); },
    'save-alert': function () { toast('Alert saved (simulated) · no email is sent.'); go('rate-alerts'); },
    'cancel-order': function () {
      confirmSheet('Cancel demo order?', 'MO-DEMO-201 · simulated. No real order exists, so nothing is cancelled with a market.',
        'Confirm cancellation', 'Keep order', function () { toast('Demo order cancelled (simulated).'); go('market-orders'); });
    },
    'delete-alert': function (btn) {
      var card = btn.closest('[data-name="Information group"]');
      confirmSheet('Delete this alert?', 'Demo only · no alert records change and no emails are sent.', 'Delete alert', 'Keep alert', function () {
        if (card) card.hidden = true;
        toast('Alert deleted for this visit (simulated).');
      });
    },
    'sign-out': function () { closeOverlay(); }
  };

  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-action]');
    if (a && ACTIONS[a.dataset.action]) {
      if (a.tagName !== 'A') e.preventDefault();
      ACTIONS[a.dataset.action](a);
      return;
    }
    var link = e.target.closest('a[href^="#/"]');
    if (link && overlay && overlay.contains(link)) { closeOverlay(); return; }
    var box = e.target.closest('.rf-input');
    if (box && !e.target.closest('.rf-field')) {
      var f = box.querySelector('.rf-field');
      if (f) { f.focus(); if (f.tagName === 'SELECT' && f.showPicker) { try { f.showPicker(); } catch (err) { /* not supported */ } } }
    }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeOverlay(); });
  document.addEventListener('submit', function (e) { e.preventDefault(); });

  restoreFields();
  window.addEventListener('hashchange', render);
  render();
})();
