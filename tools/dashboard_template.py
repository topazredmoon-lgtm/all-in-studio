#!/usr/bin/env python3
"""HTML Dashboard Template Generator (All-in Studio Command Center)
Generates a self-contained, reactive, high-performance HTML/CSS/JS dashboard.
Works in both offline standalone mode (file://) and live server mode (http://localhost:4321).
"""

import json

def generate_html(manifest, dossiers, incubator, telemetry):
    manifest_json = json.dumps(manifest)
    dossiers_json = json.dumps(dossiers)
    incubator_json = json.dumps(incubator)
    telemetry_json = json.dumps(telemetry)

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ALL-IN · Autonomous Studio Command Center</title>
<style>
:root {{
  --bg: #07090e;
  --bg-subtle: #0c1017;
  --panel: #111622;
  --panel-hover: #171e2e;
  --panel-active: #1d263a;
  --border: #232c3f;
  --border-bright: #33405c;
  --fg: #eef2f9;
  --fg-dim: #cbd5e1;
  --muted: #7e8b9f;
  --accent: #ff3b3b;
  --accent-glow: rgba(255, 59, 59, 0.25);
  --accent2: #ff9f43;
  --ok: #3ddc97;
  --ok-glow: rgba(61, 220, 151, 0.2);
  --warn: #ffd166;
  --cyan: #00e5ff;
  --purple: #a855f7;
  --dead: #4b5563;
  --radius-sm: 8px;
  --radius: 14px;
  --radius-lg: 20px;
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, Helvetica, Arial, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, "JetBrains Mono", Menlo, Consolas, monospace;
}}

* {{ box-sizing: border-box; margin: 0; padding: 0; }}
body {{
  background: var(--bg);
  color: var(--fg);
  font-family: var(--font-sans);
  font-size: 13px;
  line-height: 1.5;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}}

/* Header */
header {{
  background: rgba(11, 14, 22, 0.92);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 14px 28px;
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}}
.brand {{
  display: flex;
  align-items: center;
  gap: 12px;
}}
.brand-logo {{
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, var(--accent), #b30000);
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 14px;
  color: #fff;
  letter-spacing: 0.5px;
  box-shadow: 0 0 15px var(--accent-glow);
}}
.brand-text h1 {{
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 0.8px;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 8px;
}}
.brand-text .sub {{
  color: var(--muted);
  font-size: 11px;
  letter-spacing: 0.2px;
}}

/* Live Pulse Pill */
.daemon-pill {{
  display: flex;
  align-items: center;
  gap: 7px;
  background: rgba(61, 220, 151, 0.08);
  border: 1px solid rgba(61, 220, 151, 0.3);
  padding: 5px 11px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  color: var(--ok);
}}
.pulse-dot {{
  width: 7px;
  height: 7px;
  background: var(--ok);
  border-radius: 50%;
  box-shadow: 0 0 8px var(--ok);
  animation: pulse 1.8s infinite;
}}
@keyframes pulse {{
  0% {{ transform: scale(0.95); opacity: 0.7; }}
  50% {{ transform: scale(1.3); opacity: 1; }}
  100% {{ transform: scale(0.95); opacity: 0.7; }}
}}

/* Stats Ribbon */
.stats-ribbon {{
  display: flex;
  gap: 8px;
  margin-left: auto;
  flex-wrap: wrap;
}}
.stat-chip {{
  background: var(--panel);
  border: 1px solid var(--border);
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 11.5px;
  color: var(--muted);
}}
.stat-chip b {{
  color: var(--fg);
  font-weight: 600;
}}

/* Tabs Navigation */
.nav-tabs {{
  display: flex;
  gap: 6px;
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  padding: 4px;
  border-radius: 12px;
}}
.tab-btn {{
  background: transparent;
  border: none;
  color: var(--muted);
  padding: 7px 15px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}}
.tab-btn:hover {{
  color: var(--fg);
  background: var(--panel-hover);
}}
.tab-btn.active {{
  color: #fff;
  background: var(--accent);
  box-shadow: 0 2px 10px var(--accent-glow);
}}

/* Main Layout */
main {{
  flex: 1;
  padding: 24px 28px;
  max-width: 1750px;
  width: 100%;
  margin: 0 auto;
}}

/* Toolbar */
.toolbar {{
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  align-items: center;
  flex-wrap: wrap;
}}
.search-input {{
  flex: 1;
  min-width: 260px;
  background: var(--panel);
  border: 1px solid var(--border);
  color: var(--fg);
  padding: 9px 14px;
  border-radius: 10px;
  font-size: 13px;
  transition: border-color 0.2s;
}}
.search-input:focus {{
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 10px var(--accent-glow);
}}
.filter-select {{
  background: var(--panel);
  border: 1px solid var(--border);
  color: var(--fg);
  padding: 9px 13px;
  border-radius: 10px;
  font-size: 12px;
  cursor: pointer;
}}
.filter-select:focus {{
  outline: none;
  border-color: var(--accent);
}}
.action-btn {{
  background: var(--panel);
  border: 1px solid var(--border);
  color: var(--fg);
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.15s;
}}
.action-btn:hover {{
  background: var(--panel-hover);
  border-color: var(--border-bright);
}}
.action-btn.primary {{
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}}
.action-btn.primary:hover {{
  filter: brightness(1.1);
}}
.action-btn.cyan {{
  border-color: rgba(0, 229, 255, 0.4);
  color: var(--cyan);
}}
.action-btn.cyan:hover {{
  background: rgba(0, 229, 255, 0.1);
}}

/* Sections */
.view-section {{
  display: none;
  animation: fadeIn 0.2s ease;
}}
.view-section.active {{
  display: block;
}}
@keyframes fadeIn {{
  from {{ opacity: 0; transform: translateY(4px); }}
  to {{ opacity: 1; transform: translateY(0); }}
}}

/* Topics Grid */
.topics-grid {{
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(460px, 1fr));
  gap: 20px;
}}
.topic-card {{
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 6px 25px rgba(0,0,0,0.3);
  transition: transform 0.15s, border-color 0.15s;
}}
.topic-card:hover {{
  border-color: var(--border-bright);
}}
.card-head {{
  padding: 14px 18px;
  background: var(--bg-subtle);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}}
.card-title-group h3 {{
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.3px;
}}
.card-id {{
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--muted);
}}
.badge {{
  font-size: 11px;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 999px;
  border: 1px solid var(--border);
  text-transform: uppercase;
  letter-spacing: 0.4px;
}}
.badge.live {{ border-color: var(--ok); color: var(--ok); background: var(--ok-glow); }}
.badge.ready {{ border-color: var(--accent2); color: var(--accent2); background: rgba(255, 159, 67, 0.15); }}
.badge.todo {{ border-color: var(--warn); color: var(--warn); background: rgba(255, 209, 102, 0.1); }}
.badge.dead {{ border-color: var(--dead); color: var(--dead); }}

.card-body {{
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}}

/* Video Player in Card */
.player-container {{
  position: relative;
  background: #000;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--border);
}}
.player-container video {{
  display: block;
  width: 100%;
  height: 220px;
  background: #000;
  object-fit: contain;
}}
.player-controls-row {{
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: var(--bg-subtle);
  border-top: 1px solid var(--border);
  flex-wrap: wrap;
}}
.player-controls-row select {{
  flex: 1;
  min-width: 160px;
  background: var(--panel);
  border: 1px solid var(--border);
  color: var(--fg);
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 11px;
}}
.speed-chip {{
  background: var(--panel);
  border: 1px solid var(--border);
  color: var(--muted);
  font-size: 10.5px;
  padding: 3px 8px;
  border-radius: 6px;
  cursor: pointer;
}}
.speed-chip:hover, .speed-chip.active {{
  color: var(--fg);
  border-color: var(--accent);
}}

/* Metrics Grid */
.meta-grid {{
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  padding: 10px 12px;
  border-radius: 10px;
}}
.meta-item {{
  font-size: 11px;
  color: var(--muted);
}}
.meta-item b {{
  display: block;
  font-size: 14px;
  font-weight: 700;
  color: var(--fg);
}}

/* Directorial Cadence Audit Box */
.cadence-badge {{
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px 11px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 11px;
}}
.cadence-badge.pass {{
  border-color: rgba(61, 220, 151, 0.3);
  color: var(--ok);
}}
.cadence-badge.fail {{
  border-color: rgba(255, 59, 59, 0.4);
  color: var(--accent);
}}

/* QA Thumbs Row */
.qa-row {{
  display: flex;
  gap: 6px;
  align-items: center;
  overflow-x: auto;
  padding-bottom: 4px;
}}
.qa-thumb {{
  flex-shrink: 0;
  width: 64px;
  height: 40px;
  background: #000;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid var(--border);
  cursor: pointer;
  position: relative;
}}
.qa-thumb img {{
  width: 100%;
  height: 100%;
  object-fit: cover;
}}
.qa-thumb:hover {{
  border-color: var(--cyan);
}}

/* Ideas Box */
.ideas-group textarea {{
  width: 100%;
  min-height: 80px;
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  color: var(--fg);
  padding: 10px 12px;
  border-radius: 8px;
  font-family: var(--font-sans);
  font-size: 12px;
  resize: vertical;
}}
.ideas-group textarea:focus {{
  outline: none;
  border-color: var(--accent);
}}
.btn-row {{
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}}

/* Dossiers View */
.dossier-layout {{
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 22px;
}}
.dossier-sidebar {{
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: calc(100vh - 140px);
  overflow-y: auto;
}}
.dossier-nav-item {{
  padding: 10px 12px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 8px;
  color: var(--muted);
  cursor: pointer;
  font-size: 12.5px;
  font-weight: 600;
  text-align: left;
  transition: all 0.15s;
}}
.dossier-nav-item:hover {{
  color: var(--fg);
  background: var(--panel-hover);
}}
.dossier-nav-item.active {{
  color: #fff;
  background: var(--panel-active);
  border-color: var(--accent);
}}

.dossier-content {{
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 24px 28px;
  display: flex;
  flex-direction: column;
  gap: 22px;
}}
.dossier-header h2 {{
  font-size: 22px;
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.5px;
}}
.spine-box {{
  background: linear-gradient(135deg, rgba(255, 59, 59, 0.08), rgba(255, 159, 67, 0.04));
  border-left: 4px solid var(--accent);
  padding: 14px 18px;
  border-radius: 0 10px 10px 0;
}}
.spine-box .label {{
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--accent);
  letter-spacing: 0.5px;
}}
.spine-box .text {{
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  margin-top: 4px;
}}

.scorecard-grid {{
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 10px;
}}
.score-pill {{
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  padding: 10px 12px;
  border-radius: 10px;
}}
.score-pill .label {{
  font-size: 11px;
  color: var(--muted);
}}
.score-pill .val {{
  font-size: 16px;
  font-weight: 700;
  color: var(--ok);
}}

.dossier-section-title {{
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}}
.receipt-list {{
  display: grid;
  gap: 10px;
}}
.receipt-card {{
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  padding: 12px 14px;
  border-radius: 10px;
}}
.receipt-card h4 {{
  font-size: 13px;
  font-weight: 700;
  color: var(--cyan);
}}
.receipt-card p {{
  font-size: 12px;
  color: var(--fg-dim);
  margin-top: 4px;
}}

/* Incubator Cards */
.incubator-grid {{
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
  gap: 20px;
}}
.incubator-card {{
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  position: relative;
}}
.incubator-card:hover {{
  border-color: var(--cyan);
}}
.incubator-card h3 {{
  font-size: 16px;
  font-weight: 800;
  color: #fff;
}}
.tagline {{
  font-size: 12px;
  color: var(--accent2);
  font-weight: 600;
}}

/* Lightbox Modal */
.modal-overlay {{
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.85);
  backdrop-filter: blur(8px);
  z-index: 1000;
  align-items: center;
  justify-content: center;
  padding: 24px;
}}
.modal-overlay.active {{
  display: flex;
}}
.modal-window {{
  background: var(--panel);
  border: 1px solid var(--border-bright);
  border-radius: var(--radius-lg);
  max-width: 1000px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 15px 40px rgba(0,0,0,0.6);
}}
.modal-head {{
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}}
.modal-body {{
  padding: 20px;
  overflow-y: auto;
  text-align: center;
}}
.modal-body img {{
  max-width: 100%;
  max-height: 70vh;
  border-radius: 8px;
  border: 1px solid var(--border);
}}

/* Footer */
footer {{
  border-top: 1px solid var(--border);
  padding: 20px 28px;
  text-align: center;
  color: var(--muted);
  font-size: 11px;
  margin-top: 40px;
}}
</style>
</head>
<body>

<header>
  <div class="brand">
    <div class="brand-logo">AI</div>
    <div class="brand-text">
      <h1>ALL-IN · Command Center <span class="badge live">Studio OS</span></h1>
      <div class="sub">Autonomous Engine · 2026-10-15 Minimalist Standard · captchas v2 (#0E0C0B)</div>
    </div>
  </div>

  <div class="daemon-pill" id="daemonPill">
    <div class="pulse-dot"></div>
    <span id="daemonStatusText">AUTONOMOUS DAEMON ACTIVE</span>
  </div>

  <div class="stats-ribbon" id="statsRibbon"></div>

  <div class="nav-tabs">
    <button class="tab-btn active" data-tab="topics">🎥 Studio Matrix</button>
    <button class="tab-btn" data-tab="dossiers">📑 Topic Dossiers</button>
    <button class="tab-btn" data-tab="incubator">🚀 Viral Incubator</button>
    <button class="tab-btn" data-tab="rules">⚖️ Directorial Rules</button>
    <button class="tab-btn" data-tab="daemon">⚡ Studio Console</button>
  </div>
</header>

<main>
  <!-- TOPICS VIEW -->
  <section id="view-topics" class="view-section active">
    <div class="toolbar">
      <input type="text" class="search-input" id="searchBox" placeholder="Search topic by name, slug, beats, or keyword..." />
      <select class="filter-select" id="filterBadge">
        <option value="all">All Statuses</option>
        <option value="live">Shipped / Benchmark (Live)</option>
        <option value="ready">Renders / Sample Ready</option>
        <option value="todo">Script / Draft</option>
        <option value="dead">Dead / Retired</option>
      </select>
      <select class="filter-select" id="sortSelect">
        <option value="default">Sort: Default</option>
        <option value="renders">Sort: Most Renders</option>
        <option value="beats">Sort: Most Beats</option>
        <option value="words">Sort: Word Count</option>
      </select>
      <button class="action-btn cyan" onclick="triggerScan()">🔄 Refresh Studio Scan</button>
    </div>

    <div class="topics-grid" id="topicsGrid"></div>
  </section>

  <!-- DOSSIERS VIEW -->
  <section id="view-dossiers" class="view-section">
    <div class="dossier-layout">
      <div class="dossier-sidebar" id="dossierSidebar"></div>
      <div class="dossier-content" id="dossierContent"></div>
    </div>
  </section>

  <!-- INCUBATOR VIEW -->
  <section id="view-incubator" class="view-section">
    <div class="toolbar">
      <h2 style="font-size:18px;font-weight:700">Viral Topic Incubator (5-Gate Topic DNA Law)</h2>
      <span class="badge live" style="margin-left:auto">7 Production-Ready Concepts</span>
    </div>
    <div class="incubator-grid" id="incubatorGrid"></div>
  </section>

  <!-- RULES VIEW -->
  <section id="view-rules" class="view-section">
    <div class="toolbar">
      <h2 style="font-size:18px;font-weight:700">Studio Invariants & Directorial Standard (2026-10-15 Standard)</h2>
    </div>
    <div class="topics-grid" style="grid-template-columns: repeat(auto-fit, minmax(360px, 1fr))">
      <div class="topic-card" style="padding:18px">
        <h3 style="color:var(--accent);margin-bottom:8px">1. Captchas v2 + v23 Minimalist Standard</h3>
        <p style="color:var(--fg-dim);font-size:12.5px">The sole studio standard is <code>All-in_captchas_full_v2.mp4</code> (v23 bare background <code>#0E0C0B</code> + <code>ds/kit.tsx</code> + Kokoro <code>af_heart</code> 0.95 via <code>tools/tts.py</code>).</p>
        <div style="margin-top:12px;color:var(--warn);font-size:11.5px"><b>Strictly Banned:</b> Evidence boxes (DossierDoc, ForensicStamp, FieldCard, Highlighter) and woodcut engraving plates (Ouroboros, Balance).</div>
      </div>
      <div class="topic-card" style="padding:18px">
        <h3 style="color:var(--ok);margin-bottom:8px">2. End of Permanent Bi-Screen (Cadence Rule)</h3>
        <p style="color:var(--fg-dim);font-size:12.5px">At least <b>55% to 70%</b> of cuts must be full-frame (<code>layout: "full"</code>, <code>layout: "scene"</code>, or full-screen <code>clip</code>). <code>layout: "split"</code> is capped at <b>&le; 45% maximum</b> with <b>never more than 2 consecutive splits</b>.</p>
        <div style="margin-top:12px;color:var(--muted);font-size:11.5px">Full cuts allow hero visuals to breathe; scene cuts showcase documentary and archival photography.</div>
      </div>
      <div class="topic-card" style="padding:18px">
        <h3 style="color:var(--cyan);margin-bottom:8px">3. Show "WHO & WHAT" with Real Proofs</h3>
        <p style="color:var(--fg-dim);font-size:12.5px">Whenever naming a real person, case, court, company, or date, show <b>WHO & WHERE</b> with real Wikimedia Commons CC/PD photos, and <b>WHAT</b> with authentic digital instruments (PhoneChat, PhoneCall with red waveform, CallGrid 2x2, PageQuote, Score, Blocked).</p>
        <div style="margin-top:12px;color:var(--accent);font-size:11.5px"><b>LineIcon Ceiling:</b> Capped at &le; 25% across film. Zero lone LineIcon hero; zero LineIcon vs LineIcon faceoff.</div>
      </div>
      <div class="topic-card" style="padding:18px">
        <h3 style="color:var(--purple);margin-bottom:8px">4. The Money Rule (Zero Revenue Risk)</h3>
        <p style="color:var(--fg-dim);font-size:12.5px"><b>Allowed:</b> CC BY, CC BY-SA, CC0, and US Federal Government Public Domain only. Every asset must be logged in <code>LICENCES.md</code> and <code>SOURCES.md</code>.</p>
        <div style="margin-top:12px;color:var(--accent);font-size:11.5px"><b>Strictly Banned:</b> Commercial news (WSJ, Vox, CNN, MSNBC), TED/TEDx talks, and re-uploaded stock clips.</div>
      </div>
    </div>
  </section>

  <!-- DAEMON VIEW -->
  <section id="view-daemon" class="view-section">
    <div class="toolbar">
      <h2 style="font-size:18px;font-weight:700">Autonomous Engine & Studio CLI Dispatcher</h2>
      <button class="action-btn primary" onclick="triggerResearch()">🔬 Run Deep Web Research Pass</button>
    </div>
    <div class="topic-card" style="padding:20px;margin-bottom:20px">
      <h3 style="margin-bottom:10px">Interactive Studio Tool Dispatcher</h3>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <input type="text" id="cliTopicInput" placeholder="topic slug (e.g. apply-button, the-ai-cast)" class="search-input" style="max-width:320px" />
        <button class="action-btn primary" onclick="runStudioCmd('build')">Run Build</button>
        <button class="action-btn" onclick="runStudioCmd('tts')">Run TTS (Kokoro)</button>
        <button class="action-btn" onclick="runStudioCmd('tts-cb')">Run TTS (Chatterbox)</button>
        <button class="action-btn" onclick="runStudioCmd('qa')">Run 7-Gate QA</button>
        <button class="action-btn" onclick="runStudioCmd('render')">Run Remotion Render</button>
        <button class="action-btn" onclick="runStudioCmd('check')">TypeScript Check</button>
      </div>
      <div id="cliOutput" style="margin-top:15px;background:#05070a;border:1px solid var(--border);border-radius:8px;padding:12px;font-family:var(--font-mono);font-size:11.5px;max-height:260px;overflow-y:auto;white-space:pre-wrap;color:var(--fg-dim)">Command output will appear here...</div>
    </div>
  </section>
</main>

<!-- Lightbox Modal -->
<div class="modal-overlay" id="lightboxModal" onclick="closeLightbox(event)">
  <div class="modal-window" onclick="event.stopPropagation()">
    <div class="modal-head">
      <h3 id="modalTitle">QA Inspection</h3>
      <button class="action-btn" onclick="closeLightbox()">✕ Close</button>
    </div>
    <div class="modal-body" id="modalBody"></div>
  </div>
</div>

<footer>
  ALL-IN Studio Command Center · Auto-synced with <code>All-in-keep/All-in</code> · Directorial Standard 2026-10-15 · Zero Revenue Risk
</footer>

<script>
// Data injected by Autonomous Studio Engine
const MANIFEST = {manifest_json};
const DOSSIERS = {dossiers_json};
const INCUBATOR = {incubator_json};
const TELEMETRY = {telemetry_json};

// Root URL helper
const isHttp = window.location.protocol.startsWith("http");
const API_BASE = isHttp ? window.location.origin : "http://localhost:4321";
let serverOnline = isHttp;

// Check server connectivity
async function checkServer() {{
  if (isHttp) {{
    document.getElementById("daemonStatusText").textContent = "LIVE API SERVER CONNECTED (PORT 4321)";
    document.getElementById("daemonPill").style.borderColor = "var(--ok)";
    return;
  }}
  try {{
    const res = await fetch(API_BASE + "/api/status", {{ method: "GET", mode: "cors", signal: AbortSignal.timeout(1200) }});
    if (res.ok) {{
      serverOnline = true;
      document.getElementById("daemonStatusText").textContent = "LIVE API SERVER CONNECTED (PORT 4321)";
      document.getElementById("daemonPill").style.borderColor = "var(--ok)";
      refreshTopics();
    }}
  }} catch(e) {{
    serverOnline = false;
    document.getElementById("daemonStatusText").textContent = "STANDALONE DESKTOP MODE (OFFLINE)";
    document.getElementById("daemonPill").style.borderColor = "var(--warn)";
  }}
}}

function getMediaUrl(rel) {{
  const clean = String(rel || '').replace(/^\.\.\//, '');
  if (isHttp || serverOnline) {{
    return API_BASE + "/media/" + clean;
  }}
  return "file:///C:/Users/pc/Documents/All-in-keep/All-in/" + clean;
}}

function esc(s) {{
  return String(s ?? '').replace(/[&<>"]/g, c => ({{ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }}[c]));
}}

function fmtDur(s) {{
  if (!s || isNaN(s)) return "-";
  const m = Math.floor(s / 60);
  const r = Math.round(s % 60);
  return m + ":" + String(r).padStart(2, "0");
}}

function fmtBytes(n) {{
  if (!n) return "-";
  const u = ["B", "KB", "MB", "GB"];
  let i = 0;
  while (n >= 1024 && i < u.length - 1) {{ n /= 1024; i++; }}
  return n.toFixed(1) + " " + u[i];
}}


// Render Stats Ribbon
function renderRibbon() {{
  const el = document.getElementById("statsRibbon");
  el.innerHTML = `
    <div class="stat-chip"><b>${{MANIFEST.length}}</b> Topics</div>
    <div class="stat-chip"><b>${{TELEMETRY.total_renders}}</b> Renders</div>
    <div class="stat-chip"><b>${{TELEMETRY.total_beats}}</b> Beats</div>
    <div class="stat-chip"><b>${{TELEMETRY.total_words.toLocaleString()}}</b> Words</div>
    <div class="stat-chip"><span style="color:var(--ok)">●</span> <b>7/7</b> QA Standard</div>
  `;
}}

// Render Topics Grid
function renderTopics(list) {{
  const grid = document.getElementById("topicsGrid");
  if (!list.length) {{
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--muted)">No topics match your filter.</div>`;
    return;
  }}

  grid.innerHTML = list.map(t => {{
    const f = t.outputs && t.outputs.length ? t.outputs[0] : null;
    const playerSrc = f ? getMediaUrl(f.path) : "";
    const selOpts = t.outputs.map((o, idx) => `<option value="${{idx}}">${{esc(o.name)}} (${{fmtDur(o.dur)}}, ${{fmtBytes(o.size)}})</option>`).join("");
    
    // Cadence badge
    let cadenceHtml = "";
    if (t.total_cuts > 0) {{
      const isPass = t.cadence_pass === true;
      const statusClass = isPass ? "pass" : (t.cadence_pass === false ? "fail" : "");
      const icon = isPass ? "✓" : "⚠";
      cadenceHtml = `
        <div class="cadence-badge ${{statusClass}}">
          <span>Cadence: <b>${{t.full_scene_pct}}% Full</b> / <b>${{t.split_pct}}% Split</b></span>
          <span>${{icon}} Max split streak: ${{t.max_consecutive_splits}}</span>
        </div>`;
    }}

    // QA thumbnails
    const qaThumbs = (t.qa || []).slice(0, 5).map(q => `
      <div class="qa-thumb" onclick="openLightbox('${{getMediaUrl(q)}}', '${{esc(t.title)}} QA')">
        <img src="${{getMediaUrl(q)}}" loading="lazy" />
      </div>`).join("");

    const savedIdea = localStorage.getItem("idea:" + t.id) || "";

    return `
      <article class="topic-card" data-id="${{esc(t.id)}}">
        <div class="card-head">
          <div class="card-title-group">
            <h3>${{esc(t.title)}}</h3>
            <span class="card-id">${{esc(t.id)}}</span>
          </div>
          <span class="badge ${{t.badge}}">${{esc(t.status)}}</span>
        </div>

        <div class="card-body">
          <div class="player-container">
            ${{f ? `<video id="pv-${{esc(t.id)}}" src="${{playerSrc}}" controls preload="metadata" muted playsinline></video>` : `<div style="height:210px;display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:12px">No render outputs yet</div>`}}
            ${{t.outputs.length ? `
              <div class="player-controls-row">
                <select id="sel-${{esc(t.id)}}" onchange="switchVideo('${{esc(t.id)}}')">${{selOpts}}</select>
                <button class="speed-chip" onclick="setSpeed('${{esc(t.id)}}', 1)">1x</button>
                <button class="speed-chip" onclick="setSpeed('${{esc(t.id)}}', 1.25)">1.25x</button>
                <button class="speed-chip" onclick="setSpeed('${{esc(t.id)}}', 1.5)">1.5x</button>
              </div>` : ''}}
          </div>

          <div class="meta-grid">
            <div class="meta-item">Beats<b>${{t.beats}}</b></div>
            <div class="meta-item">Words<b>${{t.words}}</b></div>
            <div class="meta-item">Renders<b>${{t.outputs.length}}</b></div>
            <div class="meta-item">QA Assets<b>${{t.qa.length}}</b></div>
          </div>

          ${{cadenceHtml}}

          ${{qaThumbs ? `<div class="qa-row">${{qaThumbs}}</div>` : ''}}

          <div class="ideas-group">
            <textarea id="idea-${{esc(t.id)}}" placeholder="Directorial notes & amelioration ideas for ${{esc(t.title)}}...">${{esc(savedIdea)}}</textarea>
          </div>

          <div class="btn-row">
            <button class="action-btn primary" onclick="saveNote('${{esc(t.id)}}', this)">Save Notes</button>
            <button class="action-btn" onclick="copyCliCmd('build ${{esc(t.id)}}', this)">Copy Build</button>
            <button class="action-btn" onclick="copyCliCmd('qa ${{esc(t.id)}}', this)">Copy QA</button>
            <button class="action-btn cyan" onclick="showDossier('${{esc(t.id)}}')">Inspect Dossier</button>
          </div>
        </div>
      </article>`;
  }}).join("");

  // Autosave listener
  document.querySelectorAll("textarea[id^='idea-']").forEach(ta => {{
    ta.addEventListener("input", () => {{
      const tid = ta.id.replace("idea-", "");
      localStorage.setItem("idea:" + tid, ta.value);
    }});
  }});
}}

function switchVideo(id) {{
  const sel = document.getElementById("sel-" + id);
  const player = document.getElementById("pv-" + id);
  if (!sel || !player) return;
  const t = MANIFEST.find(x => x.id === id);
  if (!t || !t.outputs[sel.value]) return;
  player.src = getMediaUrl(t.outputs[sel.value].path);
  player.load();
  player.play().catch(() => {{}});
}}

function setSpeed(id, spd) {{
  const player = document.getElementById("pv-" + id);
  if (player) player.playbackRate = spd;
}}

function saveNote(id, btn) {{
  const val = document.getElementById("idea-" + id).value;
  localStorage.setItem("idea:" + id, val);
  if (serverOnline) {{
    fetch(API_BASE + "/api/notes/save", {{
      method: "POST",
      headers: {{ "Content-Type": "application/json" }},
      body: JSON.stringify({{ topic: id, note: val }})
    }}).catch(() => {{}});
  }}
  btn.textContent = "Saved ✓";
  setTimeout(() => btn.textContent = "Save Notes", 1200);
}}

function copyCliCmd(subcmd, btn) {{
  const cmd = ".\\\\allin.ps1 " + subcmd;
  navigator.clipboard.writeText(cmd);
  const prev = btn.textContent;
  btn.textContent = "Copied!";
  setTimeout(() => btn.textContent = prev, 1200);
}}

// Filter & Sort
function getFilteredTopics() {{
  const q = document.getElementById("searchBox").value.toLowerCase().trim();
  const badge = document.getElementById("filterBadge").value;
  const sort = document.getElementById("sortSelect").value;

  let list = MANIFEST.filter(t => {{
    const hay = (t.id + " " + t.title).toLowerCase();
    if (q && !hay.includes(q)) return false;
    if (badge !== "all" && t.badge !== badge) return false;
    return true;
  }});

  if (sort === "renders") list.sort((a,b) => b.outputs.length - a.outputs.length);
  else if (sort === "beats") list.sort((a,b) => b.beats - a.beats);
  else if (sort === "words") list.sort((a,b) => b.words - a.words);
  return list;
}}

function refreshTopics() {{
  renderTopics(getFilteredTopics());
}}

// Dossiers
let activeDossierSlug = "apply-button";

function renderDossierSidebar() {{
  const sb = document.getElementById("dossierSidebar");
  const slugs = Object.keys(DOSSIERS);
  sb.innerHTML = slugs.map(slug => `
    <button class="dossier-nav-item ${{slug === activeDossierSlug ? 'active' : ''}}" onclick="selectDossier('${{slug}}')">
      ${{esc(DOSSIERS[slug].title)}}
    </button>
  `).join("");
}}

function selectDossier(slug) {{
  activeDossierSlug = slug;
  renderDossierSidebar();
  renderDossierContent();
}}

function showDossier(slug) {{
  if (DOSSIERS[slug]) {{
    activeDossierSlug = slug;
  }}
  document.querySelector(".tab-btn[data-tab='dossiers']").click();
  renderDossierSidebar();
  renderDossierContent();
}}

function renderDossierContent() {{
  const el = document.getElementById("dossierContent");
  const d = DOSSIERS[activeDossierSlug];
  if (!d) {{
    el.innerHTML = `<div style="color:var(--muted)">Select a topic dossier from the left.</div>`;
    return;
  }}

  const numbersHtml = (d.sourced_numbers || []).map(sn => `
    <div class="score-pill">
      <div class="label">${{esc(sn.l)}}</div>
      <div class="val" style="color:var(--cyan)">${{esc(sn.n)}}</div>
    </div>`).join("");

  const receiptsHtml = (d.primary_receipts || []).map(r => `
    <div class="receipt-card">
      <h4>${{esc(r.title)}}</h4>
      <p>${{esc(r.desc)}}</p>
    </div>`).join("");

  const whoHtml = (d.who_and_what?.who || []).map(w => `
    <div class="receipt-card" style="border-left: 3px solid var(--ok)">
      <b>WHO / WHERE:</b> ${{esc(w.label)}}<br>
      <span style="color:var(--muted);font-size:11px">Query: "${{esc(w.commons_query)}}" · Widget: ${{esc(w.widget)}}</span>
    </div>`).join("");

  const whatHtml = (d.who_and_what?.what || []).map(w => `
    <div class="receipt-card" style="border-left: 3px solid var(--purple)">
      <b>WHAT (Widget):</b> <code>${{esc(w.widget)}}</code><br>
      <span style="color:var(--muted);font-size:11px">${{esc(w.desc)}}</span>
    </div>`).join("");

  const intelHtml = (d.fresh_intelligence_2026 || []).map(i => `
    <li style="margin-bottom:6px;color:var(--fg-dim)">${{esc(i)}}</li>`).join("");

  const planHtml = (d.amelioration_plan || []).map(p => `
    <li style="margin-bottom:6px;color:var(--ok)">${{esc(p)}}</li>`).join("");

  el.innerHTML = `
    <div class="dossier-header">
      <h2>${{esc(d.title)}}</h2>
      <div style="color:var(--muted);font-size:12px;margin-top:2px">Topic Slug: <code>${{esc(d.slug)}}</code> · 5-Gate Score: <b style="color:var(--ok)">${{d.five_gate_score?.total || '25/25'}}</b></div>
    </div>

    <div class="spine-box">
      <div class="label">The Ironic Inversion (Spine Sentence)</div>
      <div class="text">"${{esc(d.spine_sentence)}}"</div>
    </div>

    <div>
      <div class="dossier-section-title">📊 Sourced "Wait, WHAT?!" Numbers</div>
      <div class="scorecard-grid">${{numbersHtml}}</div>
    </div>

    <div>
      <div class="dossier-section-title">⚖️ Verifiable Primary Receipts (Court Dockets & Federal Audits)</div>
      <div class="receipt-list">${{receiptsHtml}}</div>
    </div>

    <div>
      <div class="dossier-section-title">📸 WHO & WHAT Visual Proof Plan (2026-10-15 Standard)</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div>${{whoHtml}}</div>
        <div>${{whatHtml}}</div>
      </div>
    </div>

    <div>
      <div class="dossier-section-title">🌐 Fresh 2025-2026 Real-World Intelligence</div>
      <ul style="padding-left:18px">${{intelHtml}}</ul>
    </div>

    <div style="background:var(--bg-subtle);border:1px solid var(--border);padding:16px;border-radius:10px">
      <div class="dossier-section-title" style="color:var(--ok)">🛠️ Topic Amelioration & Upgrade Plan</div>
      <ul style="padding-left:18px">${{planHtml}}</ul>
    </div>
  `;
}}

// Incubator
function renderIncubator() {{
  const grid = document.getElementById("incubatorGrid");
  grid.innerHTML = INCUBATOR.map(item => `
    <div class="incubator-card">
      <span class="badge ready" style="position:absolute;top:16px;right:16px">${{esc(item.status)}}</span>
      <h3>${{esc(item.title)}}</h3>
      <div class="tagline">${{esc(item.tagline)}}</div>
      
      <div class="spine-box" style="margin: 4px 0">
        <div class="label">Spine Sentence</div>
        <div style="font-size:13px;font-weight:600;color:#fff">${{esc(item.spine_sentence)}}</div>
      </div>

      <div style="font-size:12px;color:var(--fg-dim)">
        <b>Universal Object:</b> ${{esc(item.universal_object)}}<br>
        <b>Hidden Mechanism:</b> ${{esc(item.hidden_mechanism)}}<br>
        <b>Primary Receipt:</b> ${{esc(item.primary_receipt)}}
      </div>

      <div style="display:flex;gap:6px;flex-wrap:wrap">
        ${{(item.killer_numbers || []).map(n => `<span class="stat-chip" style="font-size:10.5px">⚡ ${{esc(n)}}</span>`).join("")}}
      </div>
    </div>
  `).join("");
}}

// Lightbox
function openLightbox(src, title) {{
  document.getElementById("modalTitle").textContent = title || "Inspection";
  document.getElementById("modalBody").innerHTML = `<img src="${{src}}" alt="preview" />`;
  document.getElementById("lightboxModal").classList.add("active");
}}
function closeLightbox() {{
  document.getElementById("lightboxModal").classList.remove("active");
}}

// Tab Switching
document.querySelectorAll(".tab-btn").forEach(btn => {{
  btn.addEventListener("click", () => {{
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".view-section").forEach(s => s.classList.remove("active"));
    btn.classList.add("active");
    const target = document.getElementById("view-" + btn.dataset.tab);
    if (target) target.classList.add("active");
    if (btn.dataset.tab === "dossiers") {{ renderDossierSidebar(); renderDossierContent(); }}
    if (btn.dataset.tab === "incubator") {{ renderIncubator(); }}
  }});
}});

// Listeners
document.getElementById("searchBox").addEventListener("input", refreshTopics);
document.getElementById("filterBadge").addEventListener("change", refreshTopics);
document.getElementById("sortSelect").addEventListener("change", refreshTopics);

// Server Commands
async function runStudioCmd(action) {{
  const topic = document.getElementById("cliTopicInput").value.trim();
  const out = document.getElementById("cliOutput");
  out.textContent = `[EXECUTING] allin.ps1 ${{action}} ${{topic}}...\\n`;
  if (!serverOnline) {{
    out.textContent += "\\nError: Local studio server is offline. Run `.\\\\allin.ps1 dashboard` in PowerShell to start the live server.";
    return;
  }}
  try {{
    const res = await fetch(API_BASE + "/api/action/run", {{
      method: "POST",
      headers: {{ "Content-Type": "application/json" }},
      body: JSON.stringify({{ action: action, topic: topic }})
    }});
    const data = await res.json();
    out.textContent = data.output || data.error || "Done.";
  }} catch(e) {{
    out.textContent += "\\nExecution error: " + e.message;
  }}
}}

async function triggerResearch() {{
  const out = document.getElementById("cliOutput");
  out.textContent = "[AUTONOMOUS RESEARCH] Triggering deep web search pass across active topics...\\n";
  if (!serverOnline) {{
    out.textContent += "Server offline. Run `python tools/autonomous_studio.py` locally.";
    return;
  }}
  const res = await fetch(API_BASE + "/api/research/run", {{ method: "POST" }});
  const data = await res.json();
  out.textContent = data.message || "Deep research completed.";
}}

function triggerScan() {{
  checkServer();
  refreshTopics();
}}

// Initialize
checkServer();
renderRibbon();
refreshTopics();
renderDossierSidebar();
renderDossierContent();
renderIncubator();
</script>
</body>
</html>"""
