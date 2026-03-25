/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import { Activity } from "lucide-react";
import { getAPIKey, GROQ_API_KEY, GROQ_MODEL } from "./services/groqService";
import HomePage from "./pages/HomePage";
import CreatePlan from "./pages/CreatePlan";
import PlanView from "./pages/PlanView";
import CommunityPage from "./pages/CommunityPage";
import APIDiagnosticPanel from "./components/APIDiagnosticPanel";

function APISettingsPanel({ currentKey, tempKey, onTempKeyChange, onSave, onClose, saved }) {

  const [showKey, setShowKey] = React.useState(false);

  const maskedKey = currentKey
    ? `${currentKey.substring(0, 8)}${"•".repeat(Math.max(0, currentKey.length - 12))}${currentKey.slice(-4)}`
    : "Not set";

  const keyStatus = currentKey.startsWith("gsk_") && currentKey.length > 20
    ? { label:"✅ Valid Format", color:"#065F46", bg:"#F0FFF4", border:"#2A9D8F" }
    : { label:"❌ Invalid Format", color:"#DC2626", bg:"#FFF5F5", border:"#E63946" };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }}>
      <div style={{ background:"white", borderRadius:"20px", width:"100%", maxWidth:"520px", boxShadow:"0 20px 60px rgba(0,0,0,0.3)", overflow:"hidden" }}>

        {/* Header */}
        <div style={{ background:"linear-gradient(135deg, #1D3557, #457B9D)", padding:"24px 28px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <h2 style={{ fontFamily:"Playfair Display,serif", fontSize:"20px", color:"white", margin:0 }}>🔑 API Settings</h2>
            <p style={{ fontFamily:"DM Sans,sans-serif", fontSize:"13px", color:"rgba(255,255,255,0.7)", margin:"4px 0 0" }}>Manage your Groq API key</p>
          </div>
          <button type="button" onClick={onClose}
            style={{ background:"rgba(255,255,255,0.15)", border:"none", borderRadius:"50%", width:"36px", height:"36px", cursor:"pointer", fontSize:"18px", color:"white", display:"flex", alignItems:"center", justifyContent:"center" }}>
            ✕
          </button>
        </div>

        <div style={{ padding:"28px" }}>

          {/* Current API Info */}
          <div style={{ background:"#F8F9FA", borderRadius:"14px", padding:"16px 20px", marginBottom:"24px", border:"1.5px solid #E9ECEF" }}>
            <p style={{ fontFamily:"DM Sans,sans-serif", fontSize:"12px", fontWeight:700, color:"#6C757D", margin:"0 0 10px", textTransform:"uppercase", letterSpacing:"0.5px" }}>
              Currently Active API
            </p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
              {[
                { label:"Provider",  value:"Groq",              icon:"🤖" },
                { label:"Model",     value:GROQ_MODEL,          icon:"🧠" },
                { label:"Endpoint",  value:"api.groq.com",      icon:"🌐" },
                { label:"Key Status", value:keyStatus.label,    icon:"🔐", color:keyStatus.color, bg:keyStatus.bg, border:keyStatus.border },
              ].map((item: any, i) => (
                <div key={i} style={{ background: item.bg || "white", border:`1px solid ${item.border || "#E9ECEF"}`, borderRadius:"10px", padding:"10px 14px" }}>
                  <p style={{ fontFamily:"DM Sans,sans-serif", fontSize:"10px", color:"#9CA3AF", margin:"0 0 3px", textTransform:"uppercase", letterSpacing:"0.5px" }}>{item.icon} {item.label}</p>
                  <p style={{ fontFamily:"JetBrains Mono,monospace", fontSize:"12px", color: item.color || "#1D3557", fontWeight:700, margin:0, wordBreak:"break-all" }}>{item.value}</p>
                </div>
              ))}
            </div>

            {/* Masked current key display */}
            <div style={{ marginTop:"12px", background:"white", border:"1px solid #E9ECEF", borderRadius:"10px", padding:"12px 14px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div>
                <p style={{ fontFamily:"DM Sans,sans-serif", fontSize:"10px", color:"#9CA3AF", margin:"0 0 3px", textTransform:"uppercase", letterSpacing:"0.5px" }}>🔑 Active Key</p>
                <p style={{ fontFamily:"JetBrains Mono,monospace", fontSize:"13px", color:"#1D3557", fontWeight:600, margin:0, letterSpacing:"1px" }}>
                  {showKey ? currentKey : maskedKey}
                </p>
              </div>
              <button type="button" onClick={() => setShowKey(p => !p)}
                style={{ background:"none", border:"1.5px solid #DEE2E6", borderRadius:"8px", padding:"6px 12px", fontFamily:"DM Sans,sans-serif", fontSize:"12px", color:"#6C757D", cursor:"pointer" }}>
                {showKey ? "🙈 Hide" : "👁️ Show"}
              </button>
            </div>
          </div>

          {/* Change API key section */}
          <div style={{ marginBottom:"20px" }}>
            <label style={{ display:"block", fontFamily:"DM Sans,sans-serif", fontSize:"14px", fontWeight:700, color:"#1D3557", marginBottom:"8px" }}>
              🔄 Change API Key
            </label>
            <p style={{ fontFamily:"DM Sans,sans-serif", fontSize:"12px", color:"#6C757D", margin:"0 0 10px", lineHeight:1.5 }}>
              Get your free API key from{" "}
              <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer"
                style={{ color:"#E63946", fontWeight:600 }}>
                console.groq.com/keys
              </a>
              . Keys start with <code style={{ background:"#F8F9FA", padding:"1px 6px", borderRadius:"4px", fontSize:"11px" }}>gsk_</code>
            </p>
            <div style={{ position:"relative" }}>
              <input
                type="text"
                value={tempKey}
                onChange={e => onTempKeyChange(e.target.value)}
                placeholder="gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                style={{ width:"100%", border:`1.5px solid ${tempKey.startsWith("gsk_") && tempKey.length > 20 ? "#2A9D8F" : "#DEE2E6"}`, borderRadius:"10px", padding:"12px 14px", fontFamily:"JetBrains Mono,monospace", fontSize:"13px", color:"#1D3557", outline:"none", boxSizing:"border-box", transition:"border-color 0.2s" }}
                onFocus={e => e.target.style.borderColor="#E63946"}
                onBlur={e => e.target.style.borderColor = tempKey.startsWith("gsk_") && tempKey.length > 20 ? "#2A9D8F" : "#DEE2E6"}
              />
              {tempKey.length > 0 && (
                <span style={{ position:"absolute", right:"12px", top:"50%", transform:"translateY(-50%)", fontSize:"16px" }}>
                  {tempKey.startsWith("gsk_") && tempKey.length > 20 ? "✅" : "❌"}
                </span>
              )}
            </div>
            {tempKey.length > 0 && !tempKey.startsWith("gsk_") && (
              <p style={{ fontFamily:"DM Sans,sans-serif", fontSize:"12px", color:"#DC2626", margin:"6px 0 0" }}>
                ❌ Invalid key format. Groq keys must start with gsk_
              </p>
            )}
            {tempKey.startsWith("gsk_") && tempKey.length > 20 && (
              <p style={{ fontFamily:"DM Sans,sans-serif", fontSize:"12px", color:"#065F46", margin:"6px 0 0" }}>
                ✅ Valid key format detected
              </p>
            )}
          </div>

          {/* Save button */}
          <button type="button" onClick={onSave}
            disabled={!tempKey.startsWith("gsk_") || tempKey.length < 20}
            style={{ width:"100%", background: tempKey.startsWith("gsk_") && tempKey.length > 20 ? "#E63946" : "#DEE2E6", color:"white", border:"none", borderRadius:"12px", padding:"14px", fontFamily:"DM Sans,sans-serif", fontSize:"15px", fontWeight:700, cursor: tempKey.startsWith("gsk_") && tempKey.length > 20 ? "pointer" : "not-allowed", transition:"all 0.2s", marginBottom:"12px" }}
            onMouseEnter={e => { if (tempKey.startsWith("gsk_") && tempKey.length > 20) e.currentTarget.style.background="#C1121F"; }}
            onMouseLeave={e => { if (tempKey.startsWith("gsk_") && tempKey.length > 20) e.currentTarget.style.background="#E63946"; }}
          >
            {saved ? "✅ API Key Saved!" : "💾 Save & Apply API Key"}
          </button>

          {saved && (
            <div style={{ background:"#F0FFF4", border:"1.5px solid #2A9D8F", borderRadius:"10px", padding:"12px 16px", textAlign:"center" }}>
              <p style={{ fontFamily:"DM Sans,sans-serif", fontSize:"13px", color:"#065F46", fontWeight:600, margin:0 }}>
                ✅ API key updated successfully! New key is now active.
              </p>
            </div>
          )}

          {/* Help links */}
          <div style={{ marginTop:"16px", padding:"14px", background:"#F8F9FA", borderRadius:"10px" }}>
            <p style={{ fontFamily:"DM Sans,sans-serif", fontSize:"12px", fontWeight:700, color:"#1D3557", margin:"0 0 8px" }}>🔗 Quick Links</p>
            <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
              {[
                { label:"Get Free API Key",        url:"https://console.groq.com/keys"             },
                { label:"Check Token Usage",        url:"https://console.groq.com/usage"            },
                { label:"Upgrade Plan",             url:"https://console.groq.com/settings/billing" },
                { label:"View Available Models",    url:"https://console.groq.com/docs/models"      },
              ].map((link,i) => (
                <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                  style={{ fontFamily:"DM Sans,sans-serif", fontSize:"12px", color:"#457B9D", textDecoration:"none", display:"flex", alignItems:"center", gap:"6px" }}
                  onMouseEnter={e => e.currentTarget.style.color="#E63946"}
                  onMouseLeave={e => e.currentTarget.style.color="#457B9D"}
                >
                  → {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Error Boundary for the entire app
class AppErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.error("App Crash:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "40px", textAlign: "center", fontFamily: "DM Sans, sans-serif" }}>
          <h1 style={{ color: "#E63946" }}>Something went wrong</h1>
          <p style={{ color: "#457B9D" }}>The application encountered an unexpected error.</p>
          <pre style={{ background: "#F8F9FA", padding: "20px", borderRadius: "10px", display: "inline-block", textAlign: "left", marginTop: "20px", fontSize: "12px" }}>
            {this.state.error?.message || "Unknown error"}
          </pre>
          <div style={{ marginTop: "20px" }}>
            <button onClick={() => window.location.reload()} style={{ background: "#E63946", color: "white", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer" }}>
              Reload Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [showAPISettings, setShowAPISettings] = React.useState(false);
  const [tempAPIKey,      setTempAPIKey]      = React.useState(GROQ_API_KEY);
  const [apiKeySaved,     setApiKeySaved]     = React.useState(false);
  const [currentAPIKey,   setCurrentAPIKey]   = React.useState(GROQ_API_KEY);

  function saveAPIKey() {
    if (!tempAPIKey || tempAPIKey.trim() === "") {
      alert("Please enter a valid API key");
      return;
    }
    if (!tempAPIKey.trim().startsWith("gsk_")) {
      alert("Invalid Groq API key. It must start with gsk_");
      return;
    }

    const newKey = tempAPIKey.trim();

    // Write to ALL possible locations so every function picks it up
    (window as any).__ACTIVE_GROQ_KEY__ = newKey;
    (window as any).__GROQ_API_KEY__    = newKey;

    // Also try to update module-level variable directly
    try { (window as any).GROQ_API_KEY = newKey; } catch(e) {}

    // Force React state update
    setCurrentAPIKey(newKey);
    setTempAPIKey(newKey);
    setApiKeySaved(true);

    console.log("API Key saved:", newKey.substring(0,8) + "...");
    console.log("getAPIKey() now returns:", getAPIKey().substring(0,8) + "...");

    setTimeout(() => setApiKeySaved(false), 3000);
  }

  return (
    <AppErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreatePlan />} />
          <Route path="/plan/:id" element={<PlanView />} />
          <Route path="/community" element={<CommunityPage />} />
        </Routes>

        {/* API Diagnostic Panel */}
        {showDiagnostics && (
          <APIDiagnosticPanel
            onClose={() => setShowDiagnostics(false)}
            activeKey={currentAPIKey}
          />
        )}

        {showAPISettings && (
          <APISettingsPanel
            currentKey={currentAPIKey}
            tempKey={tempAPIKey}
            onTempKeyChange={setTempAPIKey}
            onSave={saveAPIKey}
            onClose={() => setShowAPISettings(false)}
            saved={apiKeySaved}
          />
        )}

        {/* Diagnostic Trigger Button */}
        <button
          type="button"
          onClick={() => setShowAPISettings(true)}
          style={{
            background: "none",
            border: "1.5px solid #E63946",
            borderRadius: "999px",
            padding: "6px 16px",
            fontFamily: "DM Sans,sans-serif",
            fontSize: "13px",
            color: "#E63946",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginRight: "8px",
            position: "fixed",
            bottom: "24px",
            left: "80px",
            zIndex: 9999,
          }}
        >
          🔑 API Key
        </button>

        <button
          onClick={() => setShowDiagnostics(true)}
          className="fixed bottom-6 left-6 z-[9999] w-12 h-12 bg-white rounded-full shadow-2xl border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#E63946] hover:scale-110 transition-all group"
          title="API Diagnostics"
        >
          <Activity className="w-5 h-5 group-hover:animate-pulse" />
        </button>
      </Router>
    </AppErrorBoundary>
  );
}
