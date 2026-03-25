import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Activity, ShieldCheck, Globe, Zap, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { runAPIDiagnostics, getAPIKey, GROQ_MODEL } from "@/src/services/groqService";

interface APIDiagnosticPanelProps {
  onClose: () => void;
  activeKey: string;
}

export default function APIDiagnosticPanel({ onClose, activeKey }: APIDiagnosticPanelProps) {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const runTests = async () => {
    setLoading(true);
    try {
      const data = await runAPIDiagnostics();
      setResults(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    setResults(null);
    // Wait 200ms to ensure all key updates have propagated
    const timer = setTimeout(() => {
      runAPIDiagnostics().then(r => {
        setResults(r);
        setLoading(false);
      });
    }, 200);
    return () => clearTimeout(timer);
  }, [activeKey]); // Re-runs whenever activeKey changes

  // if (!isOpen) return null; // Handled by parent rendering now

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-deep-navy/40 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-deep-navy p-6 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Activity className="w-6 h-6 text-accent-yellow" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-display">API Diagnostic Center</h2>
                <p className="text-white/60 text-xs font-sans">System health & connectivity monitor</p>
              </div>
            </div>
            <div style={{ display:"flex", gap:"8px" }}>
              <button type="button"
                onClick={() => {
                  setLoading(true);
                  setResults(null);
                  setTimeout(() => {
                    runAPIDiagnostics().then(r => {
                      setResults(r);
                      setLoading(false);
                    });
                  }, 100);
                }}
                style={{ background:"rgba(255,255,255,0.15)", border:"none", borderRadius:"50%", width:"36px", height:"36px", cursor:"pointer", fontSize:"16px", color:"white", display:"flex", alignItems:"center", justifyContent:"center" }}
                title="Re-run diagnostics"
              >
                🔄
              </button>
              <button type="button" onClick={onClose}
                style={{ background:"rgba(255,255,255,0.15)", border:"none", borderRadius:"50%", width:"36px", height:"36px", cursor:"pointer", fontSize:"18px", color:"white", display:"flex", alignItems:"center", justifyContent:"center" }}>
                ✕
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8 font-sans">
            {loading ? (
              <div className="h-64 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 text-primary-red animate-spin" />
                <p className="text-muted-text font-medium">Running system diagnostics...</p>
              </div>
            ) : results ? (
              <>
                {/* 1. Configuration */}
                <section>
                  <div className="flex items-center gap-2 mb-4 text-deep-navy">
                    <ShieldCheck className="w-5 h-5 text-fresh-green" />
                    <h3 className="font-bold uppercase tracking-wider text-xs">API Configuration</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { label:"API Provider", value:"Groq",              icon:"🟢" },
                      { label:"Model",        value: typeof GROQ_MODEL !== "undefined" ? GROQ_MODEL : "Not set", icon:"🧠" },
                      { label:"Endpoint",     value:"api.groq.com",      icon:"🌐" },
                      { label:"Active Key",   value:`${getAPIKey().substring(0,8)}...${getAPIKey().slice(-4)}`, icon:"🔑" },
                    ].map((item, idx) => (
                      <StatusCard key={idx} label={item.label} value={`${item.icon} ${item.value}`} />
                    ))}
                  </div>
                </section>

                {/* 2. Connectivity */}
                <section>
                  <div className="flex items-center gap-2 mb-4 text-deep-navy">
                    <Globe className="w-5 h-5 text-core-blue" />
                    <h3 className="font-bold uppercase tracking-wider text-xs">Connectivity Test</h3>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-text">Connection Status</span>
                      <span className="text-sm font-bold">{results.connectionTest.status}</span>
                    </div>
                    {results.connectionTest.error && (
                      <div className="p-3 bg-red-50 rounded-lg border border-red-100 flex gap-3">
                        <AlertCircle className="w-5 h-5 text-primary-red shrink-0" />
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-primary-red">Error Details</p>
                          <p className="text-xs text-primary-red/80 leading-relaxed">{results.connectionTest.error}</p>
                          <p className="text-xs font-bold text-primary-red mt-2">Possible Fix: {results.connectionTest.reason}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-text">Model Availability</span>
                      <span className="text-sm font-bold">{results.connectionTest.currentModelAvailable}</span>
                    </div>
                  </div>
                </section>

                {/* 3. Generation Test */}
                <section>
                  <div className="flex items-center gap-2 mb-4 text-deep-navy">
                    <Zap className="w-5 h-5 text-accent-yellow" />
                    <h3 className="font-bold uppercase tracking-wider text-xs">Generation Capability</h3>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-text">Test Response</span>
                      <span className="text-sm font-bold">{results.usageCheck.generationTest}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-text">Format Validation</span>
                      <span className="text-sm font-bold">{results.usageCheck.responseFormat}</span>
                    </div>
                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-[11px] text-muted-text font-mono">{results.usageCheck.tokensUsed}</p>
                    </div>
                  </div>
                </section>
              </>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <p className="text-muted-text">No diagnostic data available.</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-muted-text font-sans">
              Last checked: {new Date().toLocaleTimeString()}
            </p>
            <button
              onClick={runTests}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-deep-navy text-white rounded-pill text-sm font-bold hover:bg-primary-red transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              Re-run Diagnostics
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function StatusCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
      <p className="text-[10px] font-bold text-muted-text uppercase tracking-widest mb-1">{label}</p>
      <p className="text-sm font-bold text-deep-navy truncate">{value}</p>
    </div>
  );
}

function RefreshCw({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}
