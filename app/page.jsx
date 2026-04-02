/**
 * MENA Titan — Expert Dashboard
 * Gold & Slate premium theme · Bilingual AR/EN · RTL support
 *
 * Tabs: Pending Questions · Earnings · Profile Editor
 *
 * Dependencies (all already in the Next.js / shadcn environment):
 *   react, lucide-react, @radix-ui/react-tabs, @radix-ui/react-avatar,
 *   @radix-ui/react-switch, @radix-ui/react-select, @radix-ui/react-badge,
 *   class-variance-authority, clsx, tailwind-merge
 *
 * Since this file is self-contained for review, all shadcn primitives are
 * re-implemented inline so it runs in any React sandbox without installs.
 */

"use client";

import { useState } from "react";

// ─── Design tokens ────────────────────────────────────────────────────────────
const GOLD   = "#C9A84C";
const GOLD_L = "#E8C97A";
const GOLD_D = "#8C6B1F";
const SLATE  = "#1C2333";
const SLATE2 = "#242D42";
const SLATE3 = "#2E3A54";
const SLATE4 = "#3D4F72";
const SILVER = "#8C97AF";
const LIGHT  = "#F4F1EA";

// ─── i18n strings ─────────────────────────────────────────────────────────────
const T = {
  en: {
    dir: "ltr",
    dashboard: "Expert Dashboard",
    tabs: { pending: "Pending Questions", earnings: "Earnings", profile: "Profile" },
    greeting: "Welcome back,",
    badge_available: "Available",
    badge_unavailable: "Unavailable",

    // Pending
    pending_title: "Awaiting Your Answer",
    pending_empty: "No pending questions — you're all caught up!",
    respond: "Record Answer",
    expires: "Expires in",
    audio_q: "Audio question",
    from: "from",

    // Earnings
    earnings_title: "Your Earnings",
    earnings_subtitle: "Your 80% share after platform fee",
    total_earned: "Total Earned",
    this_month: "This Month",
    pending_release: "Pending Release",
    avg_per_q: "Avg. per Question",
    recent_payouts: "Recent Payouts",
    released: "Released",
    escrowed: "In Escrow",
    answered: "Answered",

    // Profile
    profile_title: "Edit Profile",
    save: "Save Changes",
    full_name: "Full name",
    full_name_ar: "Full name (Arabic)",
    title_en: "Professional title",
    title_ar: "Professional title (Arabic)",
    bio_en: "Bio (English)",
    bio_ar: "Bio (Arabic)",
    price: "Price per question (USD)",
    availability: "Available to answer questions",
    tags: "Expertise tags",
    saved: "Profile saved!",
  },
  ar: {
    dir: "rtl",
    dashboard: "لوحة تحكم الخبير",
    tabs: { pending: "الأسئلة المعلقة", earnings: "الأرباح", profile: "الملف الشخصي" },
    greeting: "مرحباً بعودتك،",
    badge_available: "متاح",
    badge_unavailable: "غير متاح",

    // Pending
    pending_title: "بانتظار إجابتك",
    pending_empty: "لا توجد أسئلة معلقة — أحسنت!",
    respond: "تسجيل الإجابة",
    expires: "ينتهي خلال",
    audio_q: "سؤال صوتي",
    from: "من",

    // Earnings
    earnings_title: "أرباحك",
    earnings_subtitle: "حصتك البالغة 80٪ بعد عمولة المنصة",
    total_earned: "إجمالي الأرباح",
    this_month: "هذا الشهر",
    pending_release: "في انتظار التحرير",
    avg_per_q: "المتوسط لكل سؤال",
    recent_payouts: "المدفوعات الأخيرة",
    released: "محرر",
    escrowed: "محجوز",
    answered: "مُجاب",

    // Profile
    profile_title: "تعديل الملف الشخصي",
    save: "حفظ التغييرات",
    full_name: "الاسم الكامل",
    full_name_ar: "الاسم الكامل (بالعربية)",
    title_en: "المسمى الوظيفي",
    title_ar: "المسمى الوظيفي (بالعربية)",
    bio_en: "نبذة شخصية (إنجليزي)",
    bio_ar: "نبذة شخصية (عربي)",
    price: "السعر لكل سؤال (USD)",
    availability: "متاح للإجابة على الأسئلة",
    tags: "مجالات الخبرة",
    saved: "تم حفظ الملف الشخصي!",
  },
};

// ─── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_QUESTIONS = [
  {
    id: "q1",
    asker: "Rania Al-Masri",
    avatar: "RA",
    media_type: "text",
    body: "What's your take on raising a Series A in the MENA region right now vs waiting 12 months given the macro environment?",
    price_cents: 15000,
    expires_hours: 18,
    created_at: "2h ago",
  },
  {
    id: "q2",
    asker: "Khalid Nour",
    avatar: "KN",
    media_type: "audio",
    body: null,
    price_cents: 20000,
    expires_hours: 41,
    created_at: "5h ago",
  },
  {
    id: "q3",
    asker: "Sara Bint Yousuf",
    avatar: "SY",
    media_type: "text",
    body: "How should we structure a co-founder equity split for a 3-person founding team where one co-founder is part-time for the first 6 months?",
    price_cents: 15000,
    expires_hours: 62,
    created_at: "9h ago",
  },
];

const MOCK_PAYOUTS = [
  { id: "t1", question: "Series A timing strategy",  asker: "Rania Al-Masri", amount: 12000, status: "released", date: "Mar 28" },
  { id: "t2", question: "Go-to-market for KSA",      asker: "Omar Tawfiq",    amount: 16000, status: "released", date: "Mar 25" },
  { id: "t3", question: "Hiring C-suite early",      asker: "Dina Fahd",      amount: 12000, status: "escrowed", date: "Mar 22" },
  { id: "t4", question: "Valuation benchmarks MENA", asker: "Faris Al-Amin",  amount: 20000, status: "released", date: "Mar 18" },
];

// ─── Inline CSS ────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');

  .mt-root *, .mt-root *::before, .mt-root *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .mt-root {
    --gold:   ${GOLD};
    --gold-l: ${GOLD_L};
    --gold-d: ${GOLD_D};
    --slate:  ${SLATE};
    --slate2: ${SLATE2};
    --slate3: ${SLATE3};
    --slate4: ${SLATE4};
    --silver: ${SILVER};
    --light:  ${LIGHT};
    --radius: 10px;
    font-family: 'DM Sans', sans-serif;
    background: var(--slate);
    color: var(--light);
    min-height: 100vh;
    padding: 0;
  }

  /* ── Layout ── */
  .mt-shell { display: flex; min-height: 100vh; }
  .mt-sidebar {
    width: 220px; flex-shrink: 0;
    background: var(--slate2);
    border-right: 1px solid rgba(201,168,76,0.12);
    display: flex; flex-direction: column;
    padding: 28px 0;
  }
  .mt-main { flex: 1; padding: 32px 36px; overflow-y: auto; max-height: 100vh; }

  /* ── Sidebar ── */
  .mt-logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px; font-weight: 600;
    color: var(--gold);
    letter-spacing: 0.04em;
    padding: 0 24px 28px;
    border-bottom: 1px solid rgba(201,168,76,0.12);
  }
  .mt-logo span { color: var(--light); font-weight: 400; }
  .mt-nav { padding: 20px 12px; display: flex; flex-direction: column; gap: 4px; }
  .mt-nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 14px; border-radius: 8px;
    font-size: 13.5px; font-weight: 400; color: var(--silver);
    cursor: pointer; transition: all .18s; border: none;
    background: transparent; width: 100%; text-align: left;
  }
  .mt-nav-item:hover { background: rgba(201,168,76,0.07); color: var(--light); }
  .mt-nav-item.active {
    background: linear-gradient(135deg, rgba(201,168,76,0.18) 0%, rgba(201,168,76,0.06) 100%);
    color: var(--gold-l);
    border: 1px solid rgba(201,168,76,0.22);
  }
  .mt-nav-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--gold); opacity: 0; flex-shrink: 0; }
  .mt-nav-item.active .mt-nav-dot { opacity: 1; }
  .mt-sidebar-footer { margin-top: auto; padding: 16px 12px 0; border-top: 1px solid rgba(201,168,76,0.08); }

  /* ── Header ── */
  .mt-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 28px;
  }
  .mt-greeting { font-size: 13px; color: var(--silver); margin-bottom: 2px; }
  .mt-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 26px; font-weight: 600; color: var(--light);
  }
  .mt-name span { color: var(--gold); }

  .mt-badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;
    cursor: pointer; transition: all .18s;
  }
  .mt-badge.available {
    background: rgba(74,180,120,0.12);
    color: #6EE7A8;
    border: 1px solid rgba(74,180,120,0.25);
  }
  .mt-badge.unavailable {
    background: rgba(200,80,80,0.1);
    color: #F4908A;
    border: 1px solid rgba(200,80,80,0.22);
  }
  .mt-badge-dot { width: 6px; height: 6px; border-radius: 50%; }
  .mt-badge.available .mt-badge-dot { background: #6EE7A8; }
  .mt-badge.unavailable .mt-badge-dot { background: #F4908A; }

  .mt-lang-toggle {
    display: flex; align-items: center; gap: 0;
    background: var(--slate3); border-radius: 8px;
    border: 1px solid rgba(201,168,76,0.15); overflow: hidden;
  }
  .mt-lang-btn {
    padding: 6px 14px; font-size: 12.5px; font-weight: 500;
    cursor: pointer; border: none; background: transparent;
    color: var(--silver); transition: all .18s;
  }
  .mt-lang-btn.active { background: var(--gold); color: var(--slate); }

  .mt-header-right { display: flex; align-items: center; gap: 12px; }

  /* ── Cards ── */
  .mt-card {
    background: var(--slate2);
    border: 1px solid rgba(201,168,76,0.1);
    border-radius: var(--radius);
    padding: 20px 22px;
  }
  .mt-card-gold {
    background: linear-gradient(135deg, rgba(201,168,76,0.14) 0%, rgba(201,168,76,0.04) 100%);
    border: 1px solid rgba(201,168,76,0.3);
  }

  /* ── Stat grid ── */
  .mt-stat-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; margin-bottom: 24px; }
  .mt-stat-label { font-size: 11.5px; color: var(--silver); text-transform: uppercase; letter-spacing: .07em; margin-bottom: 6px; }
  .mt-stat-value {
    font-family: 'Cormorant Garamond', serif;
    font-size: 28px; font-weight: 600; color: var(--gold-l);
    line-height: 1;
  }
  .mt-stat-sub { font-size: 11px; color: var(--silver); margin-top: 4px; }

  /* ── Section header ── */
  .mt-section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px; font-weight: 600; color: var(--light);
    margin-bottom: 4px;
  }
  .mt-section-sub { font-size: 12.5px; color: var(--silver); margin-bottom: 18px; }

  /* ── Question cards ── */
  .mt-q-list { display: flex; flex-direction: column; gap: 12px; }
  .mt-q-card {
    background: var(--slate2);
    border: 1px solid rgba(201,168,76,0.1);
    border-radius: var(--radius);
    padding: 16px 18px;
    display: flex; gap: 14px;
    transition: border-color .2s, transform .15s;
  }
  .mt-q-card:hover { border-color: rgba(201,168,76,0.3); transform: translateY(-1px); }
  .mt-avatar {
    width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, var(--gold-d), var(--gold));
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 600; color: var(--slate);
  }
  .mt-q-body { flex: 1; min-width: 0; }
  .mt-q-meta { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; flex-wrap: wrap; }
  .mt-q-name { font-size: 13px; font-weight: 500; color: var(--light); }
  .mt-q-time { font-size: 11.5px; color: var(--silver); }
  .mt-q-text { font-size: 13.5px; color: rgba(244,241,234,0.8); line-height: 1.55; margin-bottom: 10px; }
  .mt-q-footer { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; }
  .mt-q-price {
    font-size: 12px; color: var(--gold);
    background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.2);
    border-radius: 5px; padding: 2px 8px;
  }
  .mt-q-expires { font-size: 11.5px; color: var(--silver); }
  .mt-q-expires.urgent { color: #F4908A; }
  .mt-chip {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 11px; padding: 2px 8px; border-radius: 5px;
    background: rgba(100,160,255,0.12); color: #90B8FF;
    border: 1px solid rgba(100,160,255,0.2);
  }

  /* ── Button ── */
  .mt-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 16px; border-radius: 7px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
    cursor: pointer; border: none; transition: all .18s;
  }
  .mt-btn-gold {
    background: linear-gradient(135deg, var(--gold), var(--gold-d));
    color: var(--slate);
  }
  .mt-btn-gold:hover { filter: brightness(1.1); transform: translateY(-1px); box-shadow: 0 4px 16px rgba(201,168,76,0.35); }
  .mt-btn-ghost {
    background: transparent; color: var(--silver);
    border: 1px solid rgba(201,168,76,0.2);
  }
  .mt-btn-ghost:hover { border-color: rgba(201,168,76,0.5); color: var(--gold-l); }
  .mt-btn-sm { padding: 6px 12px; font-size: 12.5px; }

  /* ── Payout table ── */
  .mt-table { width: 100%; border-collapse: collapse; }
  .mt-table th {
    font-size: 11px; font-weight: 500; text-transform: uppercase;
    letter-spacing: .07em; color: var(--silver);
    padding: 8px 12px; text-align: left;
    border-bottom: 1px solid rgba(201,168,76,0.1);
  }
  .mt-table td {
    font-size: 13px; color: rgba(244,241,234,0.85);
    padding: 11px 12px;
    border-bottom: 1px solid rgba(255,255,255,0.04);
  }
  .mt-table tr:last-child td { border-bottom: none; }
  .mt-status-pill {
    display: inline-block; padding: 2px 9px; border-radius: 20px; font-size: 11.5px; font-weight: 500;
  }
  .mt-status-released { background: rgba(74,180,120,0.12); color: #6EE7A8; }
  .mt-status-escrowed { background: rgba(201,168,76,0.12); color: var(--gold-l); }

  /* ── Profile form ── */
  .mt-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .mt-form-group { display: flex; flex-direction: column; gap: 6px; }
  .mt-form-group.span2 { grid-column: span 2; }
  .mt-label { font-size: 12px; color: var(--silver); font-weight: 500; letter-spacing: .03em; }
  .mt-input {
    background: var(--slate3); border: 1px solid rgba(201,168,76,0.15);
    border-radius: 7px; padding: 10px 13px;
    font-family: 'DM Sans', sans-serif; font-size: 13.5px; color: var(--light);
    outline: none; transition: border-color .18s;
    width: 100%;
  }
  .mt-input:focus { border-color: rgba(201,168,76,0.45); }
  .mt-input::placeholder { color: var(--slate4); }
  .mt-input[dir="rtl"] { text-align: right; }
  .mt-textarea { resize: vertical; min-height: 80px; }
  .mt-price-row { display: flex; align-items: center; gap: 0; }
  .mt-price-prefix {
    background: var(--slate3); border: 1px solid rgba(201,168,76,0.15);
    border-right: none; border-radius: 7px 0 0 7px;
    padding: 10px 12px; font-size: 12px; color: var(--silver);
  }
  .mt-price-input {
    border-radius: 0 7px 7px 0 !important;
  }

  .mt-switch-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: var(--slate3); border-radius: 8px; border: 1px solid rgba(201,168,76,0.1); }
  .mt-switch-label { font-size: 13.5px; color: var(--light); }
  .mt-switch-track {
    width: 40px; height: 22px; border-radius: 11px;
    background: var(--slate4); position: relative; cursor: pointer;
    transition: background .2s; flex-shrink: 0; border: none;
  }
  .mt-switch-track.on { background: var(--gold); }
  .mt-switch-thumb {
    position: absolute; top: 3px; left: 3px;
    width: 16px; height: 16px; border-radius: 50%; background: white;
    transition: transform .2s;
  }
  .mt-switch-track.on .mt-switch-thumb { transform: translateX(18px); }

  .mt-tags-row { display: flex; flex-wrap: wrap; gap: 8px; }
  .mt-tag {
    padding: 4px 12px; border-radius: 20px; font-size: 12px; cursor: pointer;
    border: 1px solid rgba(201,168,76,0.2); color: var(--silver);
    background: transparent; transition: all .15s;
  }
  .mt-tag.active { background: rgba(201,168,76,0.15); color: var(--gold-l); border-color: rgba(201,168,76,0.4); }

  .mt-save-row { display: flex; align-items: center; gap: 12px; margin-top: 8px; }
  .mt-saved-msg { font-size: 12.5px; color: #6EE7A8; }

  /* ── Divider gold ── */
  .mt-gold-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent);
    margin: 22px 0;
  }

  /* ── Earnings chart bar ── */
  .mt-bar-chart { display: flex; align-items: flex-end; gap: 8px; height: 80px; margin-top: 8px; }
  .mt-bar-col { display: flex; flex-direction: column; align-items: center; gap: 4px; flex: 1; }
  .mt-bar {
    width: 100%; border-radius: 4px 4px 0 0;
    background: linear-gradient(to top, var(--gold-d), var(--gold));
    opacity: 0.7; transition: opacity .15s;
    min-height: 4px;
  }
  .mt-bar:hover { opacity: 1; }
  .mt-bar-label { font-size: 10px; color: var(--silver); }

  /* ── RTL overrides ── */
  [dir="rtl"] .mt-nav-item { text-align: right; }
  [dir="rtl"] .mt-table th, [dir="rtl"] .mt-table td { text-align: right; }
  [dir="rtl"] .mt-price-prefix { border-left: none; border-right: none; border-radius: 0 7px 7px 0; }
  [dir="rtl"] .mt-price-input { border-radius: 7px 0 0 7px !important; }

  /* ── Empty state ── */
  .mt-empty { text-align: center; padding: 48px 20px; color: var(--silver); font-size: 14px; }
  .mt-empty-icon { font-size: 36px; margin-bottom: 12px; }
`;

// ─── Icon components (inline SVG, no emoji) ───────────────────────────────────
const Icon = ({ d, size = 15, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d}/>
  </svg>
);
const IconInbox    = () => <Icon d="M22 12h-6l-2 3H10l-2-3H2M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/>;
const IconEarnings = () => <Icon d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>;
const IconProfile  = () => <Icon d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"/>;
const IconVideo    = () => <Icon d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.889L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/>;
const IconLogout   = () => <Icon d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>;

// ─── Sub-components ───────────────────────────────────────────────────────────
function Switch({ on, onToggle }) {
  return (
    <button className={`mt-switch-track ${on ? "on" : ""}`} onClick={onToggle} type="button">
      <span className="mt-switch-thumb"/>
    </button>
  );
}

const TAGS = ["VC","Fintech","Growth","SaaS","M&A","Operations","Marketing","Real Estate","Healthcare"];

function TagSelector({ selected, onChange }) {
  const toggle = (t) => onChange(
    selected.includes(t) ? selected.filter(x => x !== t) : [...selected, t]
  );
  return (
    <div className="mt-tags-row">
      {TAGS.map(t => (
        <button key={t} type="button"
          className={`mt-tag ${selected.includes(t) ? "active" : ""}`}
          onClick={() => toggle(t)}>{t}</button>
      ))}
    </div>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────
function PendingTab({ t }) {
  return (
    <div>
      <p className="mt-section-title">{t.pending_title}</p>
      <p className="mt-section-sub">{MOCK_QUESTIONS.length} questions awaiting response</p>
      <div className="mt-q-list">
        {MOCK_QUESTIONS.map(q => {
          const earnCents = Math.round(q.price_cents * 0.8);
          const urgent = q.expires_hours < 24;
          return (
            <div key={q.id} className="mt-q-card">
              <div className="mt-avatar">{q.asker.split(" ").map(n=>n[0]).join("")}</div>
              <div className="mt-q-body">
                <div className="mt-q-meta">
                  <span className="mt-q-name">{q.asker}</span>
                  <span className="mt-q-time">{q.created_at}</span>
                  {q.media_type === "audio" && (
                    <span className="mt-chip">
                      <IconVideo /> {t.audio_q}
                    </span>
                  )}
                </div>
                {q.body_text
                  ? <p className="mt-q-text">{q.body}</p>
                  : <p className="mt-q-text" style={{color: "var(--silver)", fontStyle:"italic"}}>{t.audio_q} · 0:42</p>
                }
                <div className="mt-q-footer">
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <span className="mt-q-price">+${(earnCents/100).toFixed(2)} USD</span>
                    <span className={`mt-q-expires ${urgent?"urgent":""}`}>
                      {t.expires} {q.expires_hours}h
                    </span>
                  </div>
                  <button className="mt-btn mt-btn-gold mt-btn-sm">
                    <IconVideo /> {t.respond}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EarningsTab({ t }) {
  const bars = [
    { label:"Oct", h:35 },{ label:"Nov", h:52 },{ label:"Dec", h:45 },
    { label:"Jan", h:68 },{ label:"Feb", h:58 },{ label:"Mar", h:80 },
  ];
  return (
    <div>
      <p className="mt-section-title">{t.earnings_title}</p>
      <p className="mt-section-sub">{t.earnings_subtitle}</p>
      <div className="mt-stat-grid">
        {[
          { label: t.total_earned,    value: "$4,960", sub: "All time" },
          { label: t.this_month,      value: "$960",   sub: "March 2025" },
          { label: t.pending_release, value: "$120",   sub: "In escrow" },
          { label: t.avg_per_q,       value: "$124",   sub: "per answer" },
        ].map(s => (
          <div key={s.label} className="mt-card mt-card-gold">
            <p className="mt-stat-label">{s.label}</p>
            <p className="mt-stat-value">{s.value}</p>
            <p className="mt-stat-sub">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="mt-card" style={{marginBottom:20}}>
        <p className="mt-label" style={{marginBottom:4}}>Monthly earnings (6 months)</p>
        <div className="mt-bar-chart">
          {bars.map(b => (
            <div key={b.label} className="mt-bar-col">
              <div className="mt-bar" style={{height: b.h + "%"}}/>
              <span className="mt-bar-label">{b.label}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-section-title" style={{fontSize:17,marginBottom:14}}>{t.recent_payouts}</p>
      <div className="mt-card" style={{padding:0,overflow:"hidden"}}>
        <table className="mt-table">
          <thead>
            <tr>
              <th>Question</th>
              <th>From</th>
              <th>Your cut (80%)</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_PAYOUTS.map(p => (
              <tr key={p.id}>
                <td style={{maxWidth:200, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{p.question}</td>
                <td style={{color:"var(--silver)"}}>{p.asker}</td>
                <td style={{color:"var(--gold-l)", fontFamily:"'Cormorant Garamond',serif", fontSize:16}}>
                  ${(p.amount/100).toFixed(2)}
                </td>
                <td>
                  <span className={`mt-status-pill mt-status-${p.status}`}>
                    {p.status === "released" ? t.released : t.escrowed}
                  </span>
                </td>
                <td style={{color:"var(--silver)"}}>{p.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-gold-divider"/>
      <p style={{fontSize:12, color:"var(--silver)", lineHeight:1.6}}>
        Platform fee: <strong style={{color:"var(--light)"}}>20%</strong> · Your share: <strong style={{color:"var(--gold)"}}>80%</strong> · Payouts released within 48h of answer confirmation.
      </p>
    </div>
  );
}

function ProfileTab({ t }) {
  const [form, setForm] = useState({
    full_name:   "Dr. Yasir Al-Fahad",
    full_name_ar:"د. ياسر الفهد",
    title:       "Venture Capital & Growth Strategy",
    title_ar:    "رأس المال المخاطر واستراتيجية النمو",
    bio:         "Former Partner at STV, 15+ years investing in MENA tech. LP in 3 regional funds. Advisor to 40+ startups across KSA, UAE, Egypt.",
    bio_ar:      "شريك سابق في STV، أكثر من 15 عامًا من الاستثمار في التكنولوجيا في منطقة الشرق الأوسط وشمال أفريقيا.",
    price:       "150",
    available:   true,
    tags:        ["VC","Growth","Fintech","SaaS"],
  });
  const [saved, setSaved] = useState(false);

  const set = (k, v) => { setForm(f => ({...f, [k]:v})); setSaved(false); };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <p className="mt-section-title">{t.profile_title}</p>
      <div className="mt-gold-divider" style={{marginTop:8}}/>

      <div className="mt-form-grid">
        <div className="mt-form-group">
          <label className="mt-label">{t.full_name}</label>
          <input className="mt-input" value={form.full_name} onChange={e=>set("full_name",e.target.value)}/>
        </div>
        <div className="mt-form-group">
          <label className="mt-label">{t.full_name_ar}</label>
          <input className="mt-input" dir="rtl" value={form.full_name_ar} onChange={e=>set("full_name_ar",e.target.value)}/>
        </div>
        <div className="mt-form-group">
          <label className="mt-label">{t.title_en}</label>
          <input className="mt-input" value={form.title} onChange={e=>set("title",e.target.value)}/>
        </div>
        <div className="mt-form-group">
          <label className="mt-label">{t.title_ar}</label>
          <input className="mt-input" dir="rtl" value={form.title_ar} onChange={e=>set("title_ar",e.target.value)}/>
        </div>
        <div className="mt-form-group span2">
          <label className="mt-label">{t.bio_en}</label>
          <textarea className="mt-input mt-textarea" value={form.bio} onChange={e=>set("bio",e.target.value)}/>
        </div>
        <div className="mt-form-group span2">
          <label className="mt-label">{t.bio_ar}</label>
          <textarea className="mt-input mt-textarea" dir="rtl" value={form.bio_ar} onChange={e=>set("bio_ar",e.target.value)}/>
        </div>
        <div className="mt-form-group">
          <label className="mt-label">{t.price}</label>
          <div className="mt-price-row">
            <span className="mt-price-prefix">$</span>
            <input className="mt-input mt-price-input" type="number" value={form.price} onChange={e=>set("price",e.target.value)}/>
          </div>
        </div>
        <div className="mt-form-group" style={{justifyContent:"flex-end"}}>
          <div className="mt-switch-row">
            <span className="mt-switch-label">{t.availability}</span>
            <Switch on={form.available} onToggle={()=>set("available",!form.available)}/>
          </div>
        </div>
        <div className="mt-form-group span2">
          <label className="mt-label">{t.tags}</label>
          <TagSelector selected={form.tags} onChange={v=>set("tags",v)}/>
        </div>
      </div>

      <div className="mt-save-row">
        <button className="mt-btn mt-btn-gold" onClick={handleSave}>{t.save}</button>
        {saved && <span className="mt-saved-msg">✓ {t.saved}</span>}
      </div>
    </div>
  );
}

// ─── Root component ───────────────────────────────────────────────────────────
export default function ExpertDashboard() {
  const [lang, setLang]         = useState("en");
  const [tab, setTab]           = useState("pending");
  const [available, setAvail]   = useState(true);
  const t = T[lang];

  const navItems = [
    { key: "pending",  label: t.tabs.pending,  Icon: IconInbox    },
    { key: "earnings", label: t.tabs.earnings, Icon: IconEarnings },
    { key: "profile",  label: t.tabs.profile,  Icon: IconProfile  },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="mt-root" dir={t.dir}>
        <div className="mt-shell">

          {/* ── Sidebar ── */}
          <aside className="mt-sidebar">
            <div className="mt-logo">MENA<span> Titan</span></div>
            <nav className="mt-nav">
              {navItems.map(({ key, label, Icon: I }) => (
                <button key={key}
                  className={`mt-nav-item ${tab === key ? "active" : ""}`}
                  onClick={() => setTab(key)}>
                  <span className="mt-nav-dot"/>
                  <I/> {label}
                </button>
              ))}
            </nav>
            <div className="mt-sidebar-footer">
              <button className="mt-nav-item" style={{color:"var(--silver)"}}>
                <IconLogout/> Sign out
              </button>
            </div>
          </aside>

          {/* ── Main ── */}
          <main className="mt-main">
            <div className="mt-header">
              <div>
                <p className="mt-greeting">{t.greeting}</p>
                <p className="mt-name">Dr. Yasir <span>Al-Fahad</span></p>
              </div>
              <div className="mt-header-right">
                <button
                  className={`mt-badge ${available ? "available" : "unavailable"}`}
                  onClick={() => setAvail(a => !a)}>
                  <span className="mt-badge-dot"/>
                  {available ? t.badge_available : t.badge_unavailable}
                </button>
                <div className="mt-lang-toggle">
                  <button className={`mt-lang-btn ${lang==="en"?"active":""}`} onClick={()=>setLang("en")}>EN</button>
                  <button className={`mt-lang-btn ${lang==="ar"?"active":""}`} onClick={()=>setLang("ar")}>AR</button>
                </div>
              </div>
            </div>

            {tab === "pending"  && <PendingTab  t={t}/>}
            {tab === "earnings" && <EarningsTab t={t}/>}
            {tab === "profile"  && <ProfileTab  t={t}/>}
          </main>

        </div>
      </div>
    </>
  );
}
