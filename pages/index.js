import { useState, useEffect, useRef } from "react"

const css = `
  :root {
    --bg: #0a0e13;
    --bg2: #0f1419;
    --bg3: #141b24;
    --border: rgba(0,255,136,0.15);
    --border2: rgba(0,255,136,0.3);
    --green: #00ff88;
    --green2: #00cc6a;
    --gdim: rgba(0,255,136,0.08);
    --text: #e2e8f0;
    --text2: #94a3b8;
    --text3: #4a5568;
    --mono: 'JetBrains Mono', monospace;
    --sans: 'Inter', sans-serif;
    --red: #ff4757;
    --amber: #ffa502;
    --blue: #3b82f6;
    --cyan: #06b6d4;
  }
  html, body { background: var(--bg); color: var(--text); font-family: var(--sans); }
  .port { background: var(--bg); color: var(--text); font-family: var(--sans); min-height: 100vh; }
  .grid-bg {
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image:
      linear-gradient(rgba(0,255,136,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,255,136,0.03) 1px, transparent 1px);
    background-size: 40px 40px;
  }
  .nav {
    position: sticky; top: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    height: 54px; padding: 0 32px;
    background: rgba(10,14,19,0.95);
    border-bottom: 1px solid var(--border);
    backdrop-filter: blur(8px);
  }
  .nav-brand { font-family: var(--mono); font-size: 13px; color: var(--green); letter-spacing: .04em; }
  .nav-links { display: flex; gap: 4px; }
  .nav-btn {
    font-family: var(--mono); font-size: 11px; padding: 6px 14px;
    border-radius: 4px; border: 1px solid transparent;
    cursor: pointer; background: transparent; color: var(--text2);
    letter-spacing: .03em; transition: all .15s;
  }
  .nav-btn:hover { background: var(--gdim); color: var(--green); }
  .nav-btn.on { background: var(--gdim); color: var(--green); border-color: var(--border2); }
  .page { padding: 40px 32px 60px; max-width: 1100px; margin: 0 auto; }
  .card {
    background: var(--bg2); border: 1px solid var(--border);
    border-radius: 10px; padding: 20px; transition: border-color .2s;
  }
  .card:hover { border-color: var(--border2); }
  .card-feat { border-color: var(--green2) !important; box-shadow: 0 0 28px rgba(0,255,136,0.07); }
  .badge {
    display: inline-block; font-family: var(--mono); font-size: 10px;
    padding: 2px 8px; border-radius: 3px; margin: 2px; border: 1px solid;
    letter-spacing: .03em;
  }
  .bg { background: rgba(0,255,136,0.08); color: var(--green); border-color: rgba(0,255,136,0.25); }
  .bb { background: rgba(59,130,246,0.1); color: #60a5fa; border-color: rgba(59,130,246,0.25); }
  .ba { background: rgba(255,165,2,0.1); color: #fbbf24; border-color: rgba(255,165,2,0.25); }
  .br { background: rgba(255,71,87,0.1); color: #fb7185; border-color: rgba(255,71,87,0.25); }
  .bc { background: rgba(6,182,212,0.1); color: #22d3ee; border-color: rgba(6,182,212,0.25); }
  .bd { background: rgba(255,255,255,0.04); color: var(--text3); border-color: rgba(255,255,255,0.08); }
  .sec {
    font-family: var(--mono); font-size: 10px; letter-spacing: .12em;
    text-transform: uppercase; color: var(--green); margin-bottom: 14px;
    display: flex; align-items: center; gap: 10px;
  }
  .sec::after { content: ''; flex: 1; height: 1px; background: var(--border); }
  .stat { background: var(--bg3); border: 1px solid var(--border); border-radius: 8px; padding: 16px; text-align: center; }
  .sv { font-family: var(--mono); font-size: 24px; font-weight: 700; }
  .sl { font-size: 11px; color: var(--text2); margin-top: 4px; font-family: var(--mono); }
  .skill-row { display: flex; align-items: center; gap: 12px; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.04); }
  .skill-row:last-child { border: none; }
  .skill-track { width: 90px; height: 4px; background: rgba(255,255,255,0.08); border-radius: 2px; overflow: hidden; }
  .skill-fill { height: 100%; background: var(--green); border-radius: 2px; transition: width 1.2s ease; }
  .tl-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; margin-top: 6px; }
  .tl-on { background: var(--green); box-shadow: 0 0 10px rgba(0,255,136,0.6); }
  .tl-off { background: var(--bg3); border: 1px solid var(--border2); }
  .tl-line { width: 1px; background: var(--border); flex-grow: 1; margin: 4px auto; }
  .proj-card {
    background: var(--bg2); border: 1px solid var(--border); border-radius: 10px;
    padding: 20px; cursor: pointer; transition: all .2s;
    display: flex; flex-direction: column; gap: 12px;
  }
  .proj-card:hover { border-color: var(--border2); transform: translateY(-2px); box-shadow: 0 6px 24px rgba(0,0,0,0.5); }
  .proj-feat { border-color: var(--green2) !important; box-shadow: 0 0 28px rgba(0,255,136,0.07); }
  .acc-track { width: 100px; height: 5px; background: rgba(255,255,255,0.08); border-radius: 2px; overflow: hidden; }
  .acc-fill { height: 100%; border-radius: 2px; transition: width 1s ease; }
  .c-input {
    width: 100%; background: var(--bg3); border: 1px solid var(--border);
    border-radius: 6px; padding: 10px 14px; color: var(--text);
    font-family: var(--mono); font-size: 12px; outline: none; transition: border-color .15s;
  }
  .c-input:focus { border-color: var(--green2); }
  .c-input::placeholder { color: var(--text3); }
  .cta-btn {
    background: var(--green); color: #0a0e13; border: none; border-radius: 6px;
    padding: 11px 22px; font-family: var(--mono); font-size: 12px; font-weight: 700;
    cursor: pointer; letter-spacing: .05em; transition: all .15s;
  }
  .cta-btn:hover { background: #00e57a; box-shadow: 0 0 18px rgba(0,255,136,0.45); }
  .cta-btn:disabled { opacity: .6; cursor: not-allowed; }
  .ghost-btn {
    background: transparent; color: var(--green); border: 1px solid var(--border2);
    border-radius: 6px; padding: 10px 20px; font-family: var(--mono); font-size: 12px;
    cursor: pointer; letter-spacing: .03em; transition: all .15s;
    text-decoration: none; display: inline-block;
  }
  .ghost-btn:hover { background: var(--gdim); box-shadow: 0 0 14px rgba(0,255,136,0.2); }
  @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes glitch { 0%,93%,100%{transform:none;opacity:1} 94%{transform:translateX(3px);opacity:.8} 96%{transform:translateX(-2px);opacity:.9} }
  @keyframes scanline { 0%{top:-2px} 100%{top:100%} }
  @keyframes pulse { 0%,100%{box-shadow:0 0 8px rgba(0,255,136,0.5)} 50%{box-shadow:0 0 18px rgba(0,255,136,0.9)} }
  .fade-up { animation: fadeUp 0.4s ease forwards; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }
`

function useTyping(text, speed = 40, delay = 0) {
  const [d, setD] = useState("")
  const [done, setDone] = useState(false)
  useEffect(() => {
    setD(""); setDone(false); let i = 0
    const t = setTimeout(() => {
      const iv = setInterval(() => {
        if (i < text.length) setD(text.slice(0, ++i))
        else { clearInterval(iv); setDone(true) }
      }, speed)
      return () => clearInterval(iv)
    }, delay)
    return () => clearTimeout(t)
  }, [text])
  return [d, done]
}

function Counter({ to, suffix = "", dur = 1200 }) {
  const [v, setV] = useState(0)
  const r = useRef(false)
  useEffect(() => {
    if (r.current) return; r.current = true
    const s = Date.now()
    const tick = () => {
      const p = Math.min((Date.now() - s) / dur, 1)
      setV(Math.round(p * to))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [])
  return <span>{v}{suffix}</span>
}

const B = ({ c = "g", children }) => (
  <span className={`badge ${c === "g" ? "bg" : c === "b" ? "bb" : c === "a" ? "ba" : c === "r" ? "br" : c === "c" ? "bc" : "bd"}`}>
    {children}
  </span>
)
const Sec = ({ children }) => <div className="sec">{children}</div>
const Card = ({ children, feat, style = {}, onClick }) => (
  <div className={`card${feat ? " card-feat" : ""}`} style={style} onClick={onClick}>{children}</div>
)
const Scanline = () => (
  <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 50, overflow: "hidden", opacity: 0.025 }}>
    <div style={{ position: "absolute", width: "100%", height: 2, background: "var(--green)", animation: "scanline 10s linear infinite" }} />
  </div>
)

const EXP = [
  {
    role: "IT Officer", co: "The IELTS Institute", loc: "Nepal", period: "2023-09 → 2024-11", on: true,
    bullets: [
      "RBAC + MFA across staff accounts — eliminated shared-credential use in Q1",
      "Quarterly phishing-awareness training across 3 campuses",
      "Linux & Windows Server patching + weekly backup verification",
    ],
    tags: [["MFA","g"],["RBAC","g"],["Linux","c"],["Windows Server","c"],["Incident Response","a"]],
  },
  {
    role: "Network Engineer", co: "Nextgen Solutions", loc: "Nepal", period: "2022-07 → 2023-07", on: true,
    bullets: [
      "Deployed Palo Alto NGFW, Cisco FTD/FMC & ISE for Nepal's Government Integrated Data Centre — multi-tenant national infrastructure with zero-trust segmentation",
      "F5 WAF + Arbor APS DDoS protection — signature tuning & IR handover documentation",
      "Firewall rule-sets & VPN concentrators aligned to ISO 27001 control objectives",
    ],
    tags: [["Palo Alto NGFW","g"],["Cisco FTD/FMC","g"],["Cisco ISE","g"],["F5 WAF","a"],["Arbor APS","a"],["ISO 27001","b"]],
  },
  {
    role: ".NET Developer", co: "Qxera", loc: "Kathmandu", period: "2019-09 → 2020-03", on: false,
    bullets: ["ASP.NET MVC web applications — application-layer security perspective relevant to security review work"],
    tags: [["ASP.NET MVC","d"],["SQL","d"]],
  },
]

const EDU = [
  { d: "MSc Cyber Security with Advanced Practice", i: "Northumbria University, London", p: "2025 → present", b: "IN PROGRESS" },
  { d: "MSc Computer Science", i: "Pokhara University, Nepal", p: "2019 → 2022", b: "DEAN'S LIST" },
  { d: "BE Information Technology", i: "Pokhara University, Nepal", p: "2014 → 2018", b: null },
]

const PROJECTS = [
  {
    id: "ssrf", tier: "msc_research", feat: true, icon: "🛡",
    title: "SSRF: trust-based exploits & adaptive multi-layered defense framework",
    meta: "MSc dissertation · Northumbria University London · May 2026 · Supervisor: Prof. Hamid Jahankhani",
    summary: "89% accuracy, 0% false positives, <1ms latency. Python ML detection + 7 Kubernetes NetworkPolicies across 900 automated test executions.",
    metrics: [
      { l: "accuracy", v: "89%", hi: false },
      { l: "false_positives", v: "0%", hi: true },
      { l: "test_runs", v: "900", hi: false },
      { l: "latency", v: "<1ms", hi: false },
    ],
    tags: [["Zero Trust (NIST 800-207)","g"],["Kubernetes NetworkPolicy","c"],["Python","b"],["OWASP WebGoat","a"],["SSRF","r"],["Docker · Minikube","b"]],
    what: [
      "5 Python modules: URL parser, rule matcher, logistic regression (15 features), risk scorer (0–100), orchestrator",
      "7 Kubernetes NetworkPolicies: default-deny egress, metadata block (169.254.x.x), RFC 1918 private IP block, namespace isolation, external allowlist, DNS policy, combined SSRF defense",
      "Flask REST API: /analyze /batch /health /stats endpoints",
      "100-case synthetic dataset across 6 attack categories — 900 executions across 3 configurations",
    ],
    cats: [
      { n: "Benign external", a: 100 }, { n: "Private IP SSRF", a: 90 },
      { n: "Azure/GCP metadata", a: 86.7 }, { n: "Localhost SSRF", a: 85 },
      { n: "AWS metadata", a: 85 }, { n: "Bypass techniques", a: 80 },
    ],
    contributions: [
      "Zero false positive rate — eliminates SOC alert fatigue, production viable",
      "Layer independence confirmed: 89% consistent across all 3 configurations",
      "Platform-agnostic detection — beyond PHP-only tools (SSRFuzz, Artemis)",
      "Sub-millisecond latency vs NIST's estimated 5–15% mTLS overhead",
    ],
    context: [
      "Capital One 2019: $150M+ loss, 100M records exposed via SSRF + misconfigured WAF",
      "452% surge in SSRF attacks 2023–2024 (SonicWall 2025)",
      "69,000 attempts in single campaign against CVE-2017-9841 (F5 Labs 2025)",
      "SSRF merged into OWASP A01:2025 Broken Access Control",
    ],
    links: [],
  },
  {
    id: "thesis", tier: "msc_thesis", feat: false, icon: "🗺",
    title: "Travel route planning via congestion detection & arrival time prediction",
    meta: "MSc Computer Science thesis · Pokhara University · 2022 · Dean's List",
    summary: "GPS trajectory LSTM/GRU congestion detection with HMM map matching on Kathmandu valley data. Simulated in OMNeT++, Veins and SUMO.",
    tags: [["LSTM/GRU","g"],["Hidden Markov Model","b"],["OMNeT++ / SUMO","c"],["Python","b"],["QGIS","c"]],
    what: [
      "HMM map matching on real GPS trajectory data from Kathmandu valley",
      "LSTM + GRU models for congestion index classification and arrival time prediction",
      "RSU + cloud hybrid rerouting architecture for real-time re-routing",
      "V2V beaconing simulation with accident scenario at t=73s",
    ],
    contributions: [
      "ML applied to real network infrastructure and routing problems",
      "Smart city / ITS simulation toolchains (OMNeT++, Veins, SUMO)",
      "Network behaviour modelling relevant to SecOps threat modelling",
    ],
    links: [],
  },
  {
    id: "entnet", tier: "be_project", feat: false, icon: "🌐",
    title: "Enterprise network design",
    meta: "BE Information Technology final project · Pokhara University · 2018",
    summary: "Dual-ISP redundant enterprise LAN — HSRP failover, OSPF, VLAN segmentation (IT/HR/Sales/ServerFarm), SSH-secured access. Validated in Cisco Packet Tracer.",
    tags: [["OSPF","g"],["HSRP","g"],["VLAN/STP","b"],["SSH","a"],["Cisco Packet Tracer","d"]],
    what: [
      "Dual ISP cross-connected to HQ1 + HQ2 routers for full redundancy",
      "HSRP master/slave core switches with per-VLAN virtual gateway IPs",
      "4 VLANs: IT(10) HR(20) Sales(30) ServerFarm(40)",
      "5 remote branches with OSPF + dedicated server farm (mail, web, file, AD)",
    ],
    contributions: [
      "Same segmentation principles later deployed at Nepal's Government Integrated Data Centre",
      "Direct academic → professional pipeline demonstrated",
    ],
    links: [],
  },
  {
    id: "letscode", tier: "be_project", feat: false, icon: "💻",
    title: "Letscode Together — collaborative coding platform",
    meta: "BE Information Technology final project · Pokhara University · 2018",
    summary: "Real-time collaborative coding platform with shared live editor and challenge tracking.",
    tags: [["Real-time collab","b"],["Web dev","c"],["SQL","d"]],
    what: [
      "Shared live editor for collaborative problem-solving sessions",
      "Challenge and problem tracking with user management",
      "Built as a BE final year project alongside the Enterprise Network Design",
    ],
    contributions: ["Full-stack development skills alongside the networking track"],
    links: [],
  },
  {
    id: "rental", tier: "software", feat: false, icon: "🚗",
    title: "Online vehicle rental system",
    meta: "Personal project · github.com/ph0enix14464",
    summary: "Full-stack booking app with OWASP-aware auth, session management and input validation.",
    tags: [["Web dev","b"],["SQL","d"],["OWASP","a"]],
    what: [
      "Browse, book and manage vehicle reservations",
      "OWASP-aware auth, session management and input validation",
    ],
    contributions: ["Application-layer security thinking relevant to web security reviews"],
    links: [{ l: "GitHub", u: "https://github.com/ph0enix14464/OnlineVehicleRentalSystem" }],
  },
  {
    id: "food", tier: "software", feat: false, icon: "🍜",
    title: "Online food ordering system",
    meta: "Personal project · github.com/ph0enix14464",
    summary: "Web-based ordering platform with menu browsing, cart management, and OWASP-aware auth.",
    tags: [["Full stack","b"],["SQL","d"],["OWASP","a"]],
    what: [
      "Menu browsing, cart management, order processing",
      "OWASP-aware auth and input validation",
    ],
    contributions: ["Application-layer security perspective from dev background"],
    links: [{ l: "GitHub", u: "https://github.com/ph0enix14464/Online-Food-Ordering-Sytem" }],
  },
]

function Home({ goTo }) {
  const [title, tDone] = useTyping("Cyber Security Professional", 45, 400)
  const [sub, sDone] = useTyping("Network Security · SecOps · Research", 30, 1800)
  const [show, setShow] = useState(true)
  useEffect(() => { if (tDone) setTimeout(() => setShow(true), 600) }, [tDone])

  return (
    <div className="page fade-up">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>
        <div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--green)", marginBottom: 8, opacity: .7 }}># whoami</div>
          <h1 style={{ fontFamily: "var(--mono)", fontSize: 32, fontWeight: 700, lineHeight: 1.1, marginBottom: 10, animation: "glitch 5s infinite" }}>
            Hritik Jung Basnet
          </h1>
          <div style={{ fontFamily: "var(--mono)", fontSize: 15, color: "var(--green)", marginBottom: 6, minHeight: 22 }}>
            {title}{!tDone && <span style={{ animation: "blink 1s infinite" }}>_</span>}
          </div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text2)", marginBottom: 24, minHeight: 18 }}>
            {tDone && sub}{tDone && !sDone && <span style={{ animation: "blink 1s infinite" }}>_</span>}
          </div>
          <div style={{ background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 6, padding: "16px 18px", marginBottom: 22, fontFamily: "var(--mono)", fontSize: 11, lineHeight: 1.9 }}>
            <div><span style={{ color: "var(--green)" }}>$ </span><span style={{ color: "var(--text2)" }}>cat </span><span style={{ color: "var(--amber)" }}>bio.txt</span></div>
            <div style={{ marginTop: 10, color: "var(--text)", opacity: .85 }}>
              Enterprise firewall deployments for Nepal's<br />
              Government Integrated Data Centre.<br />
              Palo Alto NGFW · Cisco FTD/FMC · ISE · F5 WAF · Arbor APS<br /><br />
              MSc Cyber Security @ Northumbria University London.<br />
              Dissertation: SSRF defense → <span style={{ color: "var(--green)" }}>0% false positives</span> in K8s.
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 22 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--green)", display: "inline-block", animation: "pulse 2s infinite" }} />
            <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text2)" }}>
              Available immediately · UK placement year work rights
            </span>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
            <button className="cta-btn" onClick={() => goTo("projects")}>./view_projects.sh ↗</button>
            <button className="ghost-btn" onClick={() => goTo("contact")}>contact --hire</button>
          </div>
          <div>
            {[["Palo Alto NGFW","g"],["Cisco FTD/FMC","g"],["Cisco ISE","g"],["ISO 27001","a"],["Zero Trust","a"],["Kubernetes","c"],["SSRF Research","c"]].map(([s,c]) => <B key={s} c={c}>{s}</B>)}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden", height: 280, position: "relative" }}>
            <img
              src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/hritik.jpeg`}
              alt="Hritik Jung Basnet at Northumbria University London"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%", filter: "brightness(.85) contrast(1.1)" }}
              onError={e => {
                e.target.parentNode.innerHTML = `<div style="height:100%;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:10px;background:#141b24"><div style="width:80px;height:80px;border-radius:50%;background:#0a0e13;border:2px solid rgba(0,255,136,0.3);display:flex;align-items:center;justify-content:center;font-family:monospace;font-size:20px;font-weight:700;color:#00ff88">HJB</div><span style="font-family:monospace;font-size:10px;color:#4a5568">add hritik.jpeg to /public/images/</span></div>`
              }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,14,19,.75) 0%, transparent 55%)" }} />
            <div style={{ position: "absolute", bottom: 12, left: 14, fontFamily: "var(--mono)", fontSize: 10, color: "var(--green)", opacity: .85 }}>
              @ Northumbria University, London
            </div>
          </div>

          {show && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                ["SOC Analyst", "Tier 1–2 triage · SIEM · IR"],
                ["Network Security Eng.", "Firewall · IDS/IPS · Zero-trust"],
                ["Security Analyst", "Vuln. mgmt · Runbooks · Compliance"],
                ["Available Now", "UK placement year work rights"],
              ].map(([t, d]) => (
                <div key={t} className="stat" style={{ textAlign: "left" }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 11, fontWeight: 600, color: "var(--green)", marginBottom: 4 }}>{t}</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text2)" }}>{d}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Experience() {
  return (
    <div className="page fade-up">
      <Sec>work_experience</Sec>
      <div style={{ display: "grid", gridTemplateColumns: "20px 1fr", gap: "0 18px", marginBottom: 36 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 6 }}>
          {EXP.map((e, i) => (
            <div key={e.role} style={{ display: "contents" }}>
              <div className="tl-dot tl-on" />
              {i < EXP.length - 1 && <div className="tl-line" style={{ minHeight: 120 }} />}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {EXP.map(e => (
            <Card key={e.role}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 2 }}>{e.role}</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text2)" }}>
                    {e.co} <span style={{ color: "var(--text3)" }}>// {e.loc}</span>
                  </div>
                </div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--green)", background: "var(--gdim)", border: "1px solid var(--border)", borderRadius: 3, padding: "4px 10px" }}>
                  {e.period}
                </div>
              </div>
              <ul style={{ paddingLeft: 0, listStyle: "none" }}>
                {e.bullets.map(b => (
                  <li key={b} style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.85, paddingLeft: 14, position: "relative", marginBottom: 2 }}>
                    <span style={{ position: "absolute", left: 0, color: "var(--green)", fontFamily: "var(--mono)" }}>›</span>{b}
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: 14 }}>{e.tags.map(([t, c]) => <B key={t} c={c}>{t}</B>)}</div>
            </Card>
          ))}
        </div>
      </div>

      <Sec>education</Sec>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {EDU.map(e => (
          <Card key={e.d} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>{e.d}</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text3)" }}>{e.i} · {e.p}</div>
            </div>
            {e.b && <B c={e.b === "IN PROGRESS" ? "g" : "a"}>{e.b}</B>}
          </Card>
        ))}
      </div>
    </div>
  )
}

function Projects() {
  const [active, setActive] = useState(null)
  const [bars, setBars] = useState(false)
  useEffect(() => { if (active) setTimeout(() => setBars(true), 300); else setBars(false) }, [active])

  const p = active ? PROJECTS.find(x => x.id === active) : null

  if (p) return (
    <div className="page fade-up">
      <div onClick={() => setActive(null)} style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--green)", cursor: "pointer", marginBottom: 24, display: "inline-flex", alignItems: "center", gap: 6 }}>
        ← cd ..
      </div>
      <Card feat={p.feat} style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 10, background: "var(--bg3)", border: "1px solid var(--border2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{p.icon}</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{p.title}</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text2)" }}>{p.meta}</div>
          </div>
        </div>
        <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.8, marginBottom: 16 }}>{p.summary}</p>
        {p.metrics && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 16 }}>
            {p.metrics.map(m => (
              <div key={m.l} className="stat">
                <div className="sv" style={{ color: m.hi ? "var(--green)" : "var(--text)", fontSize: 22 }}>{m.v}</div>
                <div className="sl">{m.l}</div>
              </div>
            ))}
          </div>
        )}
        <div>{p.tags.map(([t, c]) => <B key={t} c={c}>{t}</B>)}</div>
      </Card>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {p.what && (
          <Card>
            <Sec>what_was_built</Sec>
            <ul style={{ paddingLeft: 0, listStyle: "none" }}>
              {p.what.map(w => (
                <li key={w} style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.9, paddingLeft: 14, position: "relative", marginBottom: 2 }}>
                  <span style={{ position: "absolute", left: 0, color: "var(--green)", fontFamily: "var(--mono)" }}>›</span>{w}
                </li>
              ))}
            </ul>
          </Card>
        )}
        {p.cats && (
          <Card>
            <Sec>detection_by_category</Sec>
            {p.cats.map(c => (
              <div key={c.n} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text2)", flex: 1 }}>{c.n}</span>
                <div className="acc-track">
                  <div className="acc-fill" style={{ width: bars ? `${c.a}%` : "0%", background: c.a === 100 ? "var(--green)" : "var(--cyan)" }} />
                </div>
                <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", minWidth: 38, textAlign: "right" }}>{c.a}%</span>
              </div>
            ))}
          </Card>
        )}
        {p.contributions && (
          <Card>
            <Sec>contributions</Sec>
            <ul style={{ paddingLeft: 0, listStyle: "none" }}>
              {p.contributions.map(c => (
                <li key={c} style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.9, paddingLeft: 14, position: "relative", marginBottom: 2 }}>
                  <span style={{ position: "absolute", left: 0, color: "var(--green)", fontFamily: "var(--mono)" }}>›</span>{c}
                </li>
              ))}
            </ul>
          </Card>
        )}
        {p.context && (
          <Card>
            <Sec>threat_context</Sec>
            <ul style={{ paddingLeft: 0, listStyle: "none" }}>
              {p.context.map(c => (
                <li key={c} style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.9, paddingLeft: 14, position: "relative", marginBottom: 2 }}>
                  <span style={{ position: "absolute", left: 0, color: "var(--red)", fontFamily: "var(--mono)" }}>!</span>{c}
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>
      {p.links.length > 0 && (
        <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
          {p.links.map(l => <a key={l.l} href={l.u} target="_blank" rel="noopener noreferrer" className="ghost-btn">⬡ {l.l} ↗</a>)}
        </div>
      )}
    </div>
  )

  const TIERS = [
    { id: "msc_research", label: "msc_research", cols: 1 },
    { id: "msc_thesis", label: "msc_thesis", cols: 2 },
    { id: "be_project", label: "be_project", cols: 2 },
    { id: "software", label: "software", cols: 2 },
  ]

  return (
    <div className="page fade-up">
      {TIERS.map(tier => {
        const items = PROJECTS.filter(x => x.tier === tier.id)
        if (!items.length) return null
        return (
          <div key={tier.id} style={{ marginBottom: 28 }}>
            <Sec>{tier.label}</Sec>
            <div style={{ display: "grid", gridTemplateColumns: tier.cols === 1 ? "1fr" : "1fr 1fr", gap: 14 }}>
              {items.map(x => (
                <div key={x.id} className={`proj-card${x.feat ? " proj-feat" : ""}`} onClick={() => setActive(x.id)}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--bg3)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{x.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{x.title}</span>
                        {x.feat && <B c="g">FEATURED</B>}
                      </div>
                      <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", marginTop: 2 }}>{x.meta}</div>
                    </div>
                  </div>
                  {x.metrics && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
                      {x.metrics.map(m => (
                        <div key={m.l} className="stat" style={{ padding: "10px 8px" }}>
                          <div style={{ fontFamily: "var(--mono)", fontSize: 17, fontWeight: 700, color: m.hi ? "var(--green)" : "var(--text)" }}>{m.v}</div>
                          <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", marginTop: 2 }}>{m.l}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  <p style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.7, margin: 0 }}>{x.summary}</p>
                  <div>
                    {x.tags.slice(0, 5).map(([t, c]) => <B key={t} c={c}>{t}</B>)}
                    {x.tags.length > 5 && <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)" }}> +{x.tags.length - 5}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
      <Sec>community_practice</Sec>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        {[
          { icon: "🎓", t: "volunteer_cyber_trainer", d: "Networking & security workshops — Nepal · Aug 2022 → Oct 2024" },
          { icon: "⚡", t: "tryhackme + hack_the_box", d: "SOC paths · web exploitation · privilege escalation · CTFs" },
        ].map(a => (
          <Card key={a.t} style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 22 }}>{a.icon}</span>
              <div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--green)", marginBottom: 3 }}>{a.t}</div>
                <div style={{ fontSize: 12, color: "var(--text2)" }}>{a.d}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

function Skills() {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => { setTimeout(() => setLoaded(true), 150) }, [])
  const fw = [
    { n: "Palo Alto NGFW", l: 5 }, { n: "Cisco FTD/FMC", l: 4 },
    { n: "Cisco ISE", l: 4 }, { n: "F5 WAF", l: 4 },
    { n: "Arbor APS", l: 4 }, { n: "IDS/IPS + VPN", l: 4 },
  ]
  return (
    <div className="page fade-up">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <div>
          <Sec>firewall_network // core strength</Sec>
          <Card style={{ marginBottom: 16 }}>
            {fw.map(s => (
              <div key={s.n} className="skill-row">
                <span style={{ fontSize: 13, color: "var(--text)", flex: 1 }}>{s.n}</span>
                <div className="skill-track">
                  <div className="skill-fill" style={{ width: loaded ? `${s.l * 20}%` : "0%" }} />
                </div>
                <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", minWidth: 22 }}>{s.l}/5</span>
              </div>
            ))}
          </Card>
          <Sec>compliance_frameworks</Sec>
          <Card style={{ marginBottom: 16 }}>
            {["ISO 27001", "NIST CSF / 800-207", "OWASP", "CIS Controls", "Zero Trust (NIST 800-207)"].map(s => <B key={s} c="a">{s}</B>)}
          </Card>
          <Sec>education</Sec>
          <Card>
            {EDU.map((e, i) => (
              <div key={e.d} style={{ marginBottom: i < EDU.length - 1 ? 14 : 0, paddingBottom: i < EDU.length - 1 ? 14 : 0, borderBottom: i < EDU.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{e.d}</div>
                  {e.b && <B c={e.b === "IN PROGRESS" ? "g" : "a"}>{e.b}</B>}
                </div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", marginTop: 3 }}>{e.i} · {e.p}</div>
              </div>
            ))}
          </Card>
        </div>
        <div>
          <Sec>secops_ir</Sec>
          <Card style={{ marginBottom: 16 }}>
            {["Incident Response", "Vulnerability Mgmt", "SIEM concepts", "RBAC / Access Ctrl", "Runbook Authoring", "SSRF Defense", "Kubernetes NetworkPolicy"].map(s => <B key={s} c="c">{s}</B>)}
          </Card>
          <Sec>offensive_tooling</Sec>
          <Card style={{ marginBottom: 16 }}>
            {["Metasploit", "Nmap", "Burp Suite", "Kali Linux"].map(s => <B key={s} c="r">{s}</B>)}
          </Card>
          <Sec>cloud_dev</Sec>
          <Card style={{ marginBottom: 16 }}>
            {["AWS", "Azure", "Linux", "Windows Server", "Docker / Minikube", "Python", "Bash", "SQL", "scikit-learn"].map(s => <B key={s} c="b">{s}</B>)}
          </Card>
          <Sec>certifications</Sec>
          <Card style={{ marginBottom: 16 }}>
            {["CCNA Routing & Switching", "AWS Academy Cloud Foundations", "Cisco ESA / ISE / NGFW Bootcamps", "Zimbra Pre-Sales Engineer"].map(c => (
              <div key={c} style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text2)", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "var(--green)" }}>✓</span>{c}
              </div>
            ))}
          </Card>
          <Sec>active_practice</Sec>
          <Card>
            {[
              { icon: "🚩", t: "TryHackMe", d: "SOC · web exploitation · privilege escalation" },
              { icon: "⬡", t: "Hack The Box + CTFs", d: "Retired machines · ProLabs · competitions" },
            ].map(a => (
              <div key={a.t} style={{ display: "flex", gap: 12, padding: "9px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", alignItems: "center" }}>
                <span style={{ fontSize: 20 }}>{a.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{a.t}</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text2)", marginTop: 2 }}>{a.d}</div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  )
}

function Contact() {
  const [status, setStatus] = useState("idle")

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus("sending")
    const data = new FormData(e.target)
    try {
      const res = await fetch("https://formspree.io/f/mlgvpedo", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      })
      if (res.ok) setStatus("sent")
      else setStatus("error")
    } catch {
      setStatus("error")
    }
  }

  return (
    <div className="page fade-up">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, alignItems: "start" }}>
        <div>
          <div style={{ background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 8, padding: "16px 18px", marginBottom: 22, fontFamily: "var(--mono)", fontSize: 11, lineHeight: 1.9 }}>
            <div><span style={{ color: "var(--green)" }}>$ </span><span style={{ color: "var(--text2)" }}>cat </span><span style={{ color: "var(--amber)" }}>availability.txt</span></div>
            <div style={{ marginTop: 10, color: "var(--text)", opacity: .85 }}>
              Status: <span style={{ color: "var(--green)" }}>AVAILABLE</span><br />
              Rights: UK placement year work rights<br />
              Notice: Immediately available<br />
              Roles: SOC Analyst · Network Security · Security Analyst
            </div>
          </div>
          {[
            { icon: "✉", l: "EMAIL", v: "hritik.jung@gmail.com", href: "mailto:hritik.jung@gmail.com" },
            { icon: "📞", l: "PHONE", v: "07386 811735", href: "tel:07386811735" },
            { icon: "📍", l: "LOCATION", v: "London SE2 0EY", href: null },
            { icon: "in", l: "LINKEDIN", v: "linkedin.com/in/hritik-jung-basnet", href: "https://linkedin.com/in/hritik-jung-basnet" },
            { icon: "⬡", l: "GITHUB", v: "github.com/ph0enix14464", href: "https://github.com/ph0enix14464" },
          ].map(c => (
            <div key={c.l} style={{ display: "flex", alignItems: "center", gap: 16, padding: "11px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <span style={{ fontSize: 18, width: 24, textAlign: "center" }}>{c.icon}</span>
              <div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", letterSpacing: ".1em", marginBottom: 2 }}>{c.l}</div>
                {c.href
                  ? <a href={c.href} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: "var(--green)", textDecoration: "none", fontFamily: "var(--mono)" }}>{c.v}</a>
                  : <div style={{ fontSize: 13, fontFamily: "var(--mono)" }}>{c.v}</div>}
              </div>
            </div>
          ))}
          <div style={{ marginTop: 20 }}>
            <a href="/cv.pdf" download="Hritik_Jung_Basnet_CV.pdf" className="ghost-btn">./download_cv.sh ↗</a>
          </div>
        </div>

        <Card>
          <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--green)", marginBottom: 18 }}>// send_message.sh</div>
          {status === "sent" ? (
            <div style={{ textAlign: "center", padding: "36px 0" }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 28, color: "var(--green)", marginBottom: 12 }}>✓</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--green)" }}>Message transmitted.</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", marginTop: 6 }}>I'll respond shortly.</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[["name", "text", "your_name"], ["email", "email", "your@email.com"]].map(([l, t, ph]) => (
                <div key={l}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", marginBottom: 6 }}>{l}:</div>
                  <input type={t} name={l} placeholder={ph} className="c-input" required />
                </div>
              ))}
              <div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", marginBottom: 6 }}>message:</div>
                <textarea name="message" placeholder="what_would_you_like_to_discuss?" className="c-input" style={{ height: 110, resize: "vertical" }} required />
              </div>
              {status === "error" && (
                <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--red)" }}>
                  ! transmission failed — please try again or email directly.
                </div>
              )}
              <button type="submit" className="cta-btn" disabled={status === "sending"}>
                {status === "sending" ? "transmitting..." : "./send --secure ↗"}
              </button>
            </form>
          )}
        </Card>
      </div>
    </div>
  )
}

const PAGES = [
  { id: "home", label: "~", Page: Home },
  { id: "experience", label: "experience", Page: Experience },
  { id: "projects", label: "projects", Page: Projects },
  { id: "skills", label: "skills", Page: Skills },
  { id: "contact", label: "contact", Page: Contact },
]

export default function Portfolio() {
  const [page, setPage] = useState("home")
  const cur = PAGES.find(p => p.id === page)
  const goTo = (id) => { setPage(id); window.scrollTo({ top: 0, behavior: "smooth" }) }

  return (
    <>
      <style>{css}</style>
      <div className="port">
        <div className="grid-bg" />
        <Scanline />
        <nav className="nav">
          <span className="nav-brand">
            <span style={{ color: "var(--text3)" }}>hritik@portfolio</span>
            <span style={{ color: "var(--text2)" }}>:</span>
            <span style={{ color: "#60a5fa" }}>{page === "home" ? "~" : `/${page}`}</span>
            <span style={{ color: "var(--text2)" }}> $</span>
          </span>
          <div className="nav-links">
            {PAGES.map(p => (
              <button key={p.id} className={`nav-btn${page === p.id ? " on" : ""}`} onClick={() => goTo(p.id)}>
                {p.label}
              </button>
            ))}
          </div>
        </nav>
        {cur && <cur.Page goTo={goTo} />}
      </div>
    </>
  )
}
