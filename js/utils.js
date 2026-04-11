// ── ESCAPE HTML ──
function esc(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── TOAST ──
function toast(msg, duration = 2600) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), duration);
}

// ── MODAL ──
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

// ── TABS ──
function switchTab(el, tabId) {
  el.closest('.modal, .tab-section').querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  const parent = el.closest('.modal, .tab-section');
  parent.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
}

// ── DATE FORMAT ──
function fmtDate(d) {
  if (!d) return '—';
  const dt = new Date(d);
  return dt.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

function fmtDateTime(d) {
  if (!d) return '—';
  const dt = new Date(d);
  return dt.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' ' + dt.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

function todayStr() { return new Date().toISOString().split('T')[0]; }

// ── STAGE HELPERS ──
const STAGES = ['design', 'pattern', 'sewing', 'sample_master', 'sample_vendor', 'production'];
const STAGE_LABELS = {
  design: 'Design', pattern: 'Pattern / Pola', sewing: 'Sewing',
  sample_master: 'Sample Master', sample_vendor: 'Sample Vendor', production: 'Turun Produksi'
};

function stageLabel(s) { return STAGE_LABELS[s] || s; }
function stageIndex(s) { return STAGES.indexOf(s); }

function stageBadgeClass(stage) {
  if (stage === 'production') return 'badge-final';
  if (stage === 'sample_vendor') return 'badge-vendor';
  if (stage === 'sample_master' || stage === 'sewing') return 'badge-progress';
  return 'badge-active';
}

function progressDotsHTML(stage) {
  const idx = stageIndex(stage);
  return STAGES.map((s, i) =>
    `<div class="pdot ${i < idx ? 'done' : i === idx ? 'active' : ''}"></div>`
  ).join('');
}

// ── AVAIL HTML ──
function availHTML(status) {
  const map = { ready: ['avail-ready', 'Ready'], on_order: ['avail-order', 'On order'], need_to_order: ['avail-need', 'Need to order'] };
  const [cls, label] = map[status] || ['', status || '—'];
  return `<span class="avail ${cls}">${label}</span>`;
}

// ── CURRENT USER (cached) ──
let _currentUser = null;
let _currentProfile = null;

async function getCurrentUser() {
  if (_currentUser) return _currentUser;
  const { data: { user } } = await db.auth.getUser();
  _currentUser = user;
  return user;
}

async function getCurrentProfile() {
  if (_currentProfile) return _currentProfile;
  const user = await getCurrentUser();
  if (!user) return null;
  const { data } = await db.from('profiles').select('*').eq('id', user.id).single();
  _currentProfile = data;
  return data;
}

function clearUserCache() { _currentUser = null; _currentProfile = null; }
