import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Terminal,
  Menu,
  Mail,
  Link2,
  Code2,
  Layers,
  Database,
  ShieldCheck,
  ChevronRight,
  Quote,
  ExternalLink,
  Cpu,
  History,
  Activity,
  Workflow,
  AlertTriangle,
  Loader2,
  Lock,
  Compass
} from "lucide-react";
import { SystemLogEntry, TransmissionAnalysis, ActiveTab } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("index");
  const [logs, setLogs] = useState<SystemLogEntry[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loadingLogs, setLoadingLogs] = useState(true);

  // Form State
  const [sourceId, setSourceId] = useState("");
  const [contactVector, setContactVector] = useState("");
  const [dataStream, setDataStream] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transmissionResult, setTransmissionResult] = useState<TransmissionAnalysis | null>(null);
  const [transmissionError, setTransmissionError] = useState<string | null>(null);

  // Interactive Project Access State
  const [requisitioningId, setRequisitioningId] = useState<string | null>(null);
  const [requisitionOutput, setRequisitionOutput] = useState<Record<string, string>>({});

  // Label Hover Micro-interactions
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Load initial logs
  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/logs");
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (err) {
      console.error("Failed to load logs:", err);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    // Poll logs every 15 seconds to sync dynamically if needed
    const interval = setInterval(fetchLogs, 15000);
    return () => clearInterval(interval);
  }, []);

  // Handle form submission
  const handleExecuteTransmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceId || !contactVector || !dataStream) {
      setTransmissionError("ERROR // ALL FIELDS ARE MANDATORY FOR TRANSMISSION");
      return;
    }

    setIsSubmitting(true);
    setTransmissionError(null);
    setTransmissionResult(null);

    try {
      const res = await fetch("/api/transmission", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sourceId, contactVector, dataStream }),
      });

      if (!res.ok) {
        throw new Error("TRANSMISSION_FAILED // HARDWARE_INTERRUPT");
      }

      const data = await res.json();
      if (data.success) {
        setTransmissionResult(data.analysis);
        // Clear fields on success
        setSourceId("");
        setContactVector("");
        setDataStream("");
        // Prepend new log locally
        setLogs(prev => [data.logEntry, ...prev]);
      } else {
        throw new Error("STATION_OFFLINE // RETRY_LATER");
      }
    } catch (err: any) {
      setTransmissionError(err.message || "SYSTEM_ERROR // UPLINK_TIMEOUT");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simulate complex technical requisition for projects
  const handleAccessRequisition = (projId: string, projName: string) => {
    setRequisitioningId(projId);
    let steps = [
      `UPLINKING TO ${projId.toUpperCase()}...`,
      "INITIALIZING ENDPOINT DECRYPTION...",
      "BYPASSING LOCAL PROXY SHIELD...",
      "VERIFYING CERTIFICATE SEC_KEY...",
      "ACCESS GRANTED // PIPING CORE_CONFIG..."
    ];
    let currentStep = 0;

    const runStep = () => {
      if (currentStep < steps.length) {
        setRequisitionOutput(prev => ({
          ...prev,
          [projId]: (prev[projId] || "") + `> ${steps[currentStep]}\n`
        }));
        currentStep++;
        setTimeout(runStep, 400);
      } else {
        // Append final cool mock code structure
        const codeOutput = `\n// --- SECURE DATASTREAM RECOVERED ---
{
  "project": "${projName}",
  "arch_hash": "SHA-256//${Math.random().toString(16).substring(2, 10).toUpperCase()}",
  "deployment_node": "CLUST-WEST-04",
  "operational_uptime": "99.982%",
  "security_clearance": "CLASS-B-NOMINAL"
}
`;
        setRequisitionOutput(prev => ({
          ...prev,
          [projId]: (prev[projId] || "") + codeOutput
        }));
        setRequisitioningId(null);

        // Redirect to project URL after the animation completes
        const redirects: Record<string, string> = {
          cloud_infra: "https://github.com/saadhan-p/azure-zero-trust-lab",
          open_grc: "https://github.com/saadhan-p/OpenGRC-Lite",
          sentinel: "https://github.com/saadhan-p/Sentinel",
        };

        const redirectUrl = redirects[projId];
        if (redirectUrl) {
          setTimeout(() => {
            window.open(redirectUrl, "_blank", "noopener,noreferrer");
          }, 800);
        }
      }
    };

    // Reset previous output and start
    setRequisitionOutput(prev => ({ ...prev, [projId]: "" }));
    setTimeout(runStep, 100);
  };

  // Living Hash Randomizer on Table Row Hover
  const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);
  const [randomHashes, setRandomHashes] = useState<Record<number, string>>({});

  useEffect(() => {
    if (hoveredRowIndex === null) return;
    const interval = setInterval(() => {
      setRandomHashes(prev => ({
        ...prev,
        [hoveredRowIndex]: Math.random().toString(16).substring(2, 9)
      }));
    }, 45);
    return () => clearInterval(interval);
  }, [hoveredRowIndex]);

  return (
    <div className="min-h-screen bg-background text-on-background font-sans antialiased overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container cursor-crosshair">
      <div className="scanline"></div>

      {/* Navigation Header */}
      <header className="w-full top-0 sticky bg-background border-b-2 border-on-background z-50">
        <nav className="flex justify-between items-center w-full px-6 md:px-16 py-4 mx-auto max-w-[1440px]">
          <div
            onClick={() => setActiveTab("index")}
            className="font-mono text-xl md:text-2xl font-black tracking-tighter cursor-pointer hover:text-primary-container transition-colors"
            id="nav-logo"
          >
            SAADHAN_P.SYS
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex gap-8 items-center">
            <button
              onClick={() => setActiveTab("index")}
              className={`font-mono text-xs uppercase tracking-widest font-bold transition-all px-2 py-1 ${activeTab === "index"
                ? "text-primary-container border-l-8 border-primary-container pl-2"
                : "text-on-background hover:text-primary-container"
                }`}
              id="tab-index"
            >
              Project_Index
            </button>
            <button
              onClick={() => setActiveTab("tech_stack")}
              className={`font-mono text-xs uppercase tracking-widest font-bold transition-all px-2 py-1 ${activeTab === "tech_stack"
                ? "text-primary-container border-l-8 border-primary-container pl-2"
                : "text-on-background hover:text-primary-container"
                }`}
              id="tab-tech-stack"
            >
              Tech_Stack
            </button>
            <button
              onClick={() => setActiveTab("transmission")}
              className={`font-mono text-xs uppercase tracking-widest font-bold transition-all px-2 py-1 ${activeTab === "transmission"
                ? "text-primary-container border-l-8 border-primary-container pl-2"
                : "text-on-background hover:text-primary-container"
                }`}
              id="tab-transmission"
            >
              Transmission
            </button>
            <div className="ml-4 flex items-center justify-center p-1 border border-outline-variant rounded">
              <Terminal size={16} className="text-primary-container animate-pulse" />
            </div>
          </div>

          {/* Mobile Nav Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 border border-on-background bg-surface-container hover:bg-primary-container hover:text-on-primary transition-colors"
            id="mobile-nav-toggle"
          >
            <Menu size={20} />
          </button>
        </nav>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t-2 border-on-background bg-surface-container-lowest overflow-hidden flex flex-col font-mono text-sm uppercase"
              id="mobile-menu-container"
            >
              <button
                onClick={() => { setActiveTab("index"); setIsMobileMenuOpen(false); }}
                className={`w-full py-4 px-6 text-left border-b border-outline-variant ${activeTab === "index" ? "text-primary-container bg-surface-container" : ""}`}
              >
                Project_Index
              </button>
              <button
                onClick={() => { setActiveTab("tech_stack"); setIsMobileMenuOpen(false); }}
                className={`w-full py-4 px-6 text-left border-b border-outline-variant ${activeTab === "tech_stack" ? "text-primary-container bg-surface-container" : ""}`}
              >
                Tech_Stack
              </button>
              <button
                onClick={() => { setActiveTab("transmission"); setIsMobileMenuOpen(false); }}
                className={`w-full py-4 px-6 text-left ${activeTab === "transmission" ? "text-primary-container bg-surface-container" : ""}`}
              >
                Transmission
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content Shell with smooth Tab transitions */}
      <main className="max-w-[1440px] mx-auto px-6 md:px-16 py-12">
        <AnimatePresence mode="wait">
          {activeTab === "transmission" && (
            <motion.div
              key="transmission-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              id="view-transmission"
            >
              {/* Header section */}
              <section className="mb-16 border-b-2 border-on-background pb-12">
                <h1 className="font-sans text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-4">
                  TRANSMISSION<br />_INTERFACE
                </h1>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                  <p className="max-w-2xl font-sans text-lg text-on-surface-variant leading-relaxed uppercase">
                    ESTABLISHING SECURE PROTOCOLS FOR SYSTEM ARCHITECTURE, KERNEL INTERNALS, AND REGULATORY COMPLIANCE. SELECT A MODULE TO VIEW DETAILED CAPABILITIES.
                  </p>
                  <div className="flex items-center gap-2 bg-surface-container px-4 py-2 border-2 border-on-background block-shadow-primary shrink-0">
                    <span className="w-2 h-2 bg-primary-container animate-pulse rounded-full"></span>
                    <span className="font-mono text-xs uppercase font-bold tracking-wider text-on-background">System Status: Nominal</span>
                  </div>
                </div>
              </section>

              {/* Skills Modules Grid */}
              <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
                {/* MODULE 1: Languages */}
                <div className="border-2 border-on-background bg-surface-container-lowest flex flex-col hover:border-primary-container transition-colors group">
                  <div className="border-b-2 border-on-background p-4 flex justify-between items-center bg-surface-container-low group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors">
                    <span className="font-mono text-xs uppercase font-bold tracking-widest">MODULE_01 // LANGUAGES</span>
                    <Code2 size={16} />
                  </div>
                  <div className="p-6 flex-grow font-mono text-sm space-y-4">
                    <div className="bg-black p-4 border border-outline-variant font-mono text-xs leading-relaxed text-primary transition-all group-hover:border-primary-container">
                      <p className="text-on-surface-variant mb-1 font-bold">&gt; sys.path.append('/languages')</p>
                      <p>+ Python</p>
                      <p>+ JavaScript</p>
                      <p>+ TypeScript</p>
                      <p>+ Java</p>
                      <p>+ C++</p>
                      <p>+ PHP</p>
                    </div>
                    <p className="text-on-surface font-sans text-sm">
                      Core programming languages for full-stack development, systems programming, and scripting.
                    </p>
                  </div>
                  <div className="p-4 pt-0">
                    <div className="flex flex-wrap gap-2">
                      <span className="border border-on-background px-2 py-1 text-[10px] font-bold font-mono bg-surface-container">PYTHON</span>
                      <span className="border border-on-background px-2 py-1 text-[10px] font-bold font-mono bg-surface-container">JS/TS</span>
                      <span className="border border-on-background px-2 py-1 text-[10px] font-bold font-mono bg-surface-container">JAVA</span>
                    </div>
                  </div>
                </div>

                {/* MODULE 2: Frameworks */}
                <div className="border-2 border-on-background bg-surface-container-lowest flex flex-col hover:border-primary-container transition-colors group">
                  <div className="border-b-2 border-on-background p-4 flex justify-between items-center bg-surface-container-low group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors">
                    <span className="font-mono text-xs uppercase font-bold tracking-widest">MODULE_02 // FRAMEWORKS</span>
                    <Layers size={16} />
                  </div>
                  <div className="p-6 flex-grow font-mono text-sm space-y-4">
                    <div className="bg-black p-4 border border-outline-variant font-mono text-xs leading-relaxed text-primary transition-all group-hover:border-primary-container">
                      <p className="text-on-surface-variant mb-1 font-bold">&gt; npm list --depth=0</p>
                      <p>+ React</p>
                      <p>+ FastAPI</p>
                      <p>+ Node.js</p>
                      <p>+ Django</p>
                    </div>
                    <p className="text-on-surface font-sans text-sm">
                      Modern frameworks and runtimes for building scalable web applications and robust APIs.
                    </p>
                  </div>
                  <div className="p-4 pt-0">
                    <div className="flex flex-wrap gap-2">
                      <span className="border border-on-background px-2 py-1 text-[10px] font-bold font-mono bg-surface-container">REACT</span>
                      <span className="border border-on-background px-2 py-1 text-[10px] font-bold font-mono bg-surface-container">FASTAPI</span>
                      <span className="border border-on-background px-2 py-1 text-[10px] font-bold font-mono bg-surface-container">NODE</span>
                    </div>
                  </div>
                </div>

                {/* MODULE 3: Cloud/DB */}
                <div className="border-2 border-on-background bg-surface-container-lowest flex flex-col hover:border-primary-container transition-colors group">
                  <div className="border-b-2 border-on-background p-4 flex justify-between items-center bg-surface-container-low group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors">
                    <span className="font-mono text-xs uppercase font-bold tracking-widest">MODULE_03 // CLOUD_DB</span>
                    <Database size={16} />
                  </div>
                  <div className="p-6 flex-grow font-mono text-sm space-y-4">
                    <div className="bg-black p-4 border border-outline-variant font-mono text-xs leading-relaxed text-primary transition-all group-hover:border-primary-container">
                      <p className="text-on-surface-variant mb-1 font-bold">&gt; docker ps -a</p>
                      <p>+ Azure</p>
                      <p>+ PostgreSQL</p>
                      <p>+ Supabase</p>
                      <p>+ Docker</p>
                      <p>+ Linux</p>
                    </div>
                    <p className="text-on-surface font-sans text-sm">
                      Cloud infrastructure, containerization, and relational database management for high-availability systems.
                    </p>
                  </div>
                  <div className="p-4 pt-0">
                    <div className="flex flex-wrap gap-2">
                      <span className="border border-on-background px-2 py-1 text-[10px] font-bold font-mono bg-surface-container">AZURE</span>
                      <span className="border border-on-background px-2 py-1 text-[10px] font-bold font-mono bg-surface-container">POSTGRES</span>
                      <span className="border border-on-background px-2 py-1 text-[10px] font-bold font-mono bg-surface-container">DOCKER</span>
                    </div>
                  </div>
                </div>

                {/* MODULE 4: Cybersec */}
                <div className="border-2 border-on-background bg-surface-container-lowest flex flex-col hover:border-primary-container transition-colors group">
                  <div className="border-b-2 border-on-background p-4 flex justify-between items-center bg-surface-container-low group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors">
                    <span className="font-mono text-xs uppercase font-bold tracking-widest">MODULE_04 // CYBERSEC</span>
                    <ShieldCheck size={16} />
                  </div>
                  <div className="p-6 flex-grow font-mono text-sm space-y-4">
                    <div className="bg-black p-4 border border-outline-variant font-mono text-xs leading-relaxed text-primary transition-all group-hover:border-primary-container">
                      <p className="text-on-surface-variant mb-1 font-bold">&gt; tail -f /var/log/auth.log</p>
                      <p>+ Zero-Trust</p>
                      <p>+ GRC</p>
                      <p>+ SIEM</p>
                      <p>+ Threat Modeling</p>
                    </div>
                    <p className="text-on-surface font-sans text-sm">
                      Security protocols, risk management frameworks, and continuous monitoring for threat detection.
                    </p>
                  </div>
                  <div className="p-4 pt-0">
                    <div className="flex flex-wrap gap-2">
                      <span className="border border-on-background px-2 py-1 text-[10px] font-bold font-mono bg-surface-container">ZERO-TRUST</span>
                      <span className="border border-on-background px-2 py-1 text-[10px] font-bold font-mono bg-surface-container">GRC</span>
                      <span className="border border-on-background px-2 py-1 text-[10px] font-bold font-mono bg-surface-container">SIEM</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Form and Contact Information Section */}
              <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start border-t-2 border-on-background pt-12">

                {/* Contact Coordinates Info Card */}
                <div className="lg:col-span-4 space-y-8">
                  <div>
                    <h2 className="font-sans text-3xl md:text-4xl font-extrabold uppercase mb-4 tracking-tight">LET'S_CONNECT</h2>
                    <p className="font-mono text-xs text-on-surface-variant uppercase tracking-widest leading-relaxed">
                      WHETHER YOU ARE HIRING, INTERESTED IN COLLABORATION, OR HAVE A QUESTION, FEEL FREE TO REACH OUT. ALL STREAMS ARE MONITORED.
                    </p>
                  </div>

                  <div className="space-y-4 font-mono text-sm">
                    <a className="flex items-center gap-4 hover:text-primary-container transition-colors group" href="https://mail.google.com/mail/?view=cm&fs=1&to=saadhan275@gmail.com" target="_blank" rel="noopener noreferrer">
                      <div className="p-2 border border-on-background bg-surface-container group-hover:border-primary-container">
                        <Mail size={16} className="text-primary-container" />
                      </div>
                      <span className="uppercase tracking-wider">EMAIL</span>
                    </a>
                    <a className="flex items-center gap-4 hover:text-primary-container transition-colors group" href="https://linkedin.com/in/saadhan-p" target="_blank" rel="noreferrer">
                      <div className="p-2 border border-on-background bg-surface-container group-hover:border-primary-container">
                        <Link2 size={16} className="text-primary-container" />
                      </div>
                      <span className="uppercase tracking-wider">LINKEDIN</span>
                    </a>
                    <a className="flex items-center gap-4 hover:text-primary-container transition-colors group" href="https://github.com/saadhan-p" target="_blank" rel="noreferrer">
                      <div className="p-2 border border-on-background bg-surface-container group-hover:border-primary-container">
                        <Code2 size={16} className="text-primary-container" />
                      </div>
                      <span className="uppercase tracking-wider">GITHUB</span>
                    </a>
                  </div>

                  {/* Satellite View Graphic */}
                  <div className="w-full h-48 border-2 border-on-background relative overflow-hidden grayscale contrast-125">
                    <div
                      className="bg-cover bg-center w-full h-full opacity-60"
                      style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCCVTu3ea_h08FgB7VU7qkxNPY5tGsHl0Lw9FNubPR0IVWN3f4Rc26Ca7-fAaGL75EiWGPijIdymw1S7wzkkqjSDUpn4XAErQwDOJu0-0h5uiUA2UnjmmYdgPJgJkH2q7aTlTz3yf03lYP8vijmvTerABZLkX0rbWz7sw6iuFwdnaFM_JP5KXvRy8GKTxPWrQLFqv2CJ65FPWrPCPugBkrXrNN8YbNM4rZjkmsFRNOp6p8H50iy2d7qSV8pwJ9tLddT0B5rQv7J2Dho')` }}
                    ></div>
                    <div className="absolute inset-0 bg-primary-container/10 mix-blend-overlay"></div>
                    <div className="absolute bottom-2 left-2 bg-background/90 px-3 py-1 border border-on-background text-[10px] font-mono font-bold tracking-wider">
                      LAT: 12.9716° N // LON: 77.5946° E
                    </div>
                  </div>
                </div>

                {/* Interactive Transmission Form */}
                <div className="lg:col-span-8 space-y-6">
                  <form
                    onSubmit={handleExecuteTransmission}
                    className="space-y-8 bg-surface-container-low p-6 md:p-8 border-2 border-on-background block-shadow-white transition-all hover:translate-x-[-2px] hover:translate-y-[-2px]"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* SOURCE_ID Field */}
                      <div className="space-y-2 relative">
                        <label
                          style={{
                            transform: focusedField === "sourceId" ? "translateX(6px)" : "none",
                            transition: "transform 0.2s ease-out"
                          }}
                          className="block font-mono text-xs uppercase font-bold text-primary-container"
                        >
                          SOURCE_ID
                        </label>
                        <input
                          type="text"
                          required
                          value={sourceId}
                          onChange={(e) => setSourceId(e.target.value)}
                          onFocus={() => setFocusedField("sourceId")}
                          onBlur={() => setFocusedField(null)}
                          className="w-full bg-background border-2 border-on-background p-4 font-mono text-sm text-on-background placeholder:text-on-surface-variant/30 focus:border-primary-container focus:ring-0 focus:outline-none transition-all outline-none"
                          placeholder="ENTITY_NAME_OR_IDENTIFIER"
                        />
                      </div>

                      {/* CONTACT_VECTOR Field */}
                      <div className="space-y-2 relative">
                        <label
                          style={{
                            transform: focusedField === "contactVector" ? "translateX(6px)" : "none",
                            transition: "transform 0.2s ease-out"
                          }}
                          className="block font-mono text-xs uppercase font-bold text-primary-container"
                        >
                          CONTACT_VECTOR
                        </label>
                        <input
                          type="email"
                          required
                          value={contactVector}
                          onChange={(e) => setContactVector(e.target.value)}
                          onFocus={() => setFocusedField("contactVector")}
                          onBlur={() => setFocusedField(null)}
                          className="w-full bg-background border-2 border-on-background p-4 font-mono text-sm text-on-background placeholder:text-on-surface-variant/30 focus:border-primary-container focus:ring-0 focus:outline-none transition-all outline-none"
                          placeholder="SECURE_EMAIL_ENDPOINT"
                        />
                      </div>
                    </div>

                    {/* DATA_STREAM Field */}
                    <div className="space-y-2 relative">
                      <label
                        style={{
                          transform: focusedField === "dataStream" ? "translateX(6px)" : "none",
                          transition: "transform 0.2s ease-out"
                        }}
                        className="block font-mono text-xs uppercase font-bold text-primary-container"
                      >
                        DATA_STREAM
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={dataStream}
                        onChange={(e) => setDataStream(e.target.value)}
                        onFocus={() => setFocusedField("dataStream")}
                        onBlur={() => setFocusedField(null)}
                        className="w-full bg-background border-2 border-on-background p-4 font-mono text-sm text-on-background placeholder:text-on-surface-variant/30 focus:border-primary-container focus:ring-0 focus:outline-none transition-all outline-none resize-none"
                        placeholder="INPUT_TRANSMISSION_PAYLOAD_HERE..."
                      />
                    </div>

                    {/* Submit action */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary-container text-on-primary-container py-5 font-mono text-sm uppercase tracking-widest font-black hover:bg-white hover:text-black hover:block-shadow-primary transition-all border-2 border-primary-container flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          UPLINKING_TRANSMISSION...
                        </>
                      ) : (
                        "EXECUTE_TRANSMISSION"
                      )}
                    </button>

                    <div className="flex justify-between items-center text-[10px] font-mono text-on-surface-variant/50 uppercase font-bold tracking-wider">
                      <span>Encryption: AES-256-GCM</span>
                      <span>Protocol: HTTPS/TLS 1.3</span>
                      <span>Status: {isSubmitting ? "TRANSMITTING" : "Ready"}</span>
                    </div>
                  </form>

                  {/* Transmission Feedback Log Panel */}
                  <AnimatePresence>
                    {transmissionResult && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-2 border-green-500 bg-surface-container-lowest p-6 font-mono text-xs space-y-4 block-shadow-blue"
                        id="transmission-ack-panel"
                      >
                        <div className="flex justify-between items-center border-b border-green-500/30 pb-2">
                          <span className="text-green-500 font-bold tracking-wider uppercase flex items-center gap-2">
                            <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping"></span>
                            TRANSMISSION_ACK // STABLE_UPLINK
                          </span>
                          <span className="text-green-500/50">HASH: {transmissionResult.hexAck}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-outline uppercase">Classification</p>
                            <p className="text-on-background font-bold uppercase tracking-wider">{transmissionResult.classification}</p>
                          </div>
                          <div>
                            <p className="text-outline uppercase">Threat Assessment</p>
                            <span className={`inline-block px-2 py-0.5 font-bold uppercase rounded text-[10px] border ${transmissionResult.threatLevel === "LOW"
                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                              : transmissionResult.threatLevel === "MEDIUM"
                                ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                                : "bg-red-500/20 text-red-400 border-red-500/30"
                              }`}>
                              {transmissionResult.threatLevel}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-outline uppercase mb-1">Decrypted Payload Response</p>
                          <div className="bg-black border border-outline-variant p-3 text-primary text-xs whitespace-pre-wrap leading-relaxed">
                            {transmissionResult.decryptedResponse}
                          </div>
                        </div>
                        <div className="text-on-surface-variant font-bold text-[10px] uppercase">
                          System Acknowledgement: {transmissionResult.acknowledgement}
                        </div>
                      </motion.div>
                    )}

                    {transmissionError && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-2 border-error bg-surface-container-lowest p-4 font-mono text-xs text-error flex items-center gap-3"
                        id="transmission-error-panel"
                      >
                        <AlertTriangle size={16} className="text-error" />
                        <div>
                          <p className="font-bold tracking-wider">CRITICAL UPLINK INTERRUPT</p>
                          <p>{transmissionError}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === "index" && (
            <motion.div
              key="index-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              id="view-index"
            >
              {/* Hero Section */}
              <section className="relative min-h-[500px] md:min-h-[600px] flex flex-col justify-center border-b-2 border-on-background overflow-hidden pb-12">
                <div className="absolute inset-0 blueprint-overlay opacity-30 pointer-events-none"></div>
                <div className="relative z-10 w-full py-10">
                  <div className="inline-block border-heavy px-4 py-1.5 mb-8 bg-surface-container">
                    <span className="font-mono text-xs font-bold text-primary uppercase tracking-wider">CORE_ARCH_V1.0 // ACTIVE</span>
                  </div>
                  <h1 className="font-sans text-5xl md:text-7xl text-on-background font-black leading-none mb-8 tracking-tighter max-w-4xl">
                    Hi, I'm Saadhan P.
                  </h1>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
                    <div>
                      <p className="font-sans text-lg md:text-xl text-on-surface-variant max-w-xl mb-8 leading-relaxed uppercase">
                        I am a Full Stack Developer &amp; Cybersecurity Analyst specializing in secure, scalable web applications and zero-trust infrastructure.
                      </p>
                      <div className="flex flex-wrap gap-4">
                        <button
                          onClick={() => setActiveTab("tech_stack")}
                          className="bg-on-background text-background px-8 py-4 font-mono text-xs font-bold uppercase tracking-widest hover:bg-primary-container hover:text-on-primary-container hover:hard-shadow transition-all border-2 border-on-background"
                        >
                          View_My_Work
                        </button>
                        <button
                          onClick={() => setActiveTab("transmission")}
                          className="border-heavy border-on-background text-on-background px-8 py-4 font-mono text-xs font-bold uppercase tracking-widest hover:border-primary-container hover:text-primary-container transition-all"
                        >
                          Let's_Connect
                        </button>
                      </div>
                    </div>

                    {/* Tech Stack Overview sidebar */}
                    <div className="hidden md:block">
                      <div className="border-heavy p-6 bg-surface-container relative">
                        <div className="flex justify-between items-center mb-4 border-b border-outline-variant pb-2">
                          <span className="font-mono text-xs font-bold uppercase tracking-widest">TECH_STACK_OVERVIEW</span>
                          <Activity size={14} className="text-primary-container animate-pulse" />
                        </div>
                        <div className="space-y-3 font-mono text-xs font-medium">
                          <div className="flex justify-between border-b border-white/5 pb-1">
                            <span className="text-outline">LANGUAGE_01</span>
                            <span className="text-on-background uppercase font-bold">PYTHON [STABLE]</span>
                          </div>
                          <div className="flex justify-between border-b border-white/5 pb-1">
                            <span className="text-outline">LANGUAGE_02</span>
                            <span className="text-on-background uppercase font-bold">JAVASCRIPT [FULL_STACK]</span>
                          </div>
                          <div className="flex justify-between border-b border-white/5 pb-1">
                            <span className="text-outline">NETWORK_SEC</span>
                            <span className="text-primary-container uppercase font-bold">ZERO_TRUST [ACTIVE]</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-outline">UPTIME</span>
                            <span className="text-on-background uppercase font-bold">99.999%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Blueprint Background Aesthetic graphic */}
                <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 w-1/2 h-full opacity-20 pointer-events-none hidden lg:block">
                  <div
                    className="w-full h-full bg-contain bg-right bg-no-repeat"
                    style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBSj82E1vD_8IrECrLjUxIhuukQJX0-svNxnDJLK_skDgIDbj3sdCi-v_r2STQC9akVTOr3SVDgldOzo9mMS5-5Eh-pVDntanYt6bCtO8v20UFqpWdVovMRwBriv4Xq8aZONfu4RvkQ_RjTENgocE5OyzxyJrvQlImZNZQedNZ6EJHXOAcZNb2yHperwOi-cBSuYFx09VrIBlduj2SY_-_on7ly0JoPU13gceVmGQijXNocyVtCKTnUJcIx9JuBINotTkJPhzmCpUxq')` }}
                  ></div>
                </div>
              </section>

              {/* Profile Section */}
              <section className="py-20 border-b-2 border-on-background bg-surface-container-lowest -mx-6 md:-mx-16 px-6 md:px-16">
                <div className="max-w-[1440px] mx-auto">
                  <div className="flex flex-col lg:flex-row gap-16">
                    <div className="flex-1">
                      <h2 className="font-mono text-xs text-primary-container font-black tracking-widest mb-4">01_ABOUT_ME</h2>
                      <h3 className="font-sans text-3xl md:text-4xl font-extrabold text-on-background mb-8 uppercase tracking-tight">SECURE_BY_DESIGN</h3>
                      <div className="space-y-6 text-on-surface-variant font-sans text-base leading-relaxed max-w-2xl">
                        <p className="uppercase">
                          I am currently pursuing an MCA in Cybersecurity at Amrita Vishwa Vidyapeetham, with a strong foundation in building secure and scalable full-stack applications.
                        </p>
                        <p className="uppercase">
                          My current research focuses on Quantum Key Distribution (QKD) and its application in securing "dark" cloud environments against next-generation cryptographic threats.
                        </p>
                      </div>
                    </div>

                    {/* SYSTEM SPECS aside panel */}
                    <aside className="w-full lg:w-80 shrink-0">
                      <div className="border-heavy p-6 bg-surface-container-high block-shadow-primary">
                        <h4 className="font-mono text-xs font-black text-on-background mb-6 border-b-2 border-on-background pb-2 tracking-widest">SYSTEM_SPECS</h4>
                        <div className="space-y-6 font-mono text-xs">
                          <div className="flex items-start gap-4">
                            <div className="w-2 h-2 mt-1.5 bg-primary-container shrink-0"></div>
                            <div>
                              <p className="text-[10px] text-outline uppercase tracking-wider">Education</p>
                              <p className="font-bold text-on-background">MCA_CYBERSEC</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-4">
                            <div className="w-2 h-2 mt-1.5 bg-primary-container shrink-0"></div>
                            <div>
                              <p className="text-[10px] text-outline uppercase tracking-wider">Focus</p>
                              <p className="font-bold text-on-background">FULL_STACK_&amp;_SEC</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-4">
                            <div className="w-2 h-2 mt-1.5 bg-primary-container shrink-0"></div>
                            <div>
                              <p className="text-[10px] text-outline uppercase tracking-wider">Research</p>
                              <p className="font-bold text-on-background">QUANTUM_CRYPTOGRAPHY</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-4">
                            <div className="w-2 h-2 mt-1.5 bg-primary-container shrink-0"></div>
                            <div>
                              <p className="text-[10px] text-outline uppercase tracking-wider">Status</p>
                              <p className="font-bold text-primary-container animate-pulse">RESEARCH_ACTIVE</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </aside>
                  </div>
                </div>
              </section>

              {/* Operational History Section */}
              <section className="py-20 border-b-2 border-on-background">
                <h2 className="font-mono text-xs text-primary-container font-black tracking-widest mb-4">02_EXPERIENCE</h2>
                <h3 className="font-sans text-3xl md:text-4xl font-extrabold text-on-background mb-12 uppercase tracking-tight">OPERATIONAL_HISTORY</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Zenruva Experience */}
                  <div className="border-heavy p-8 bg-surface-container hover:block-shadow-primary transition-all group duration-300">
                    <div className="flex justify-between items-start mb-6 border-b border-outline-variant pb-4">
                      <div>
                        <h4 className="font-sans text-xl font-bold text-on-background uppercase tracking-tight">Zenruva</h4>
                        <p className="font-mono text-xs font-bold text-primary-container mt-1">FULL_STACK_DEVELOPER</p>
                      </div>
                      <Code2 className="text-primary-container group-hover:scale-110 transition-transform" />
                    </div>
                    <p className="text-on-surface-variant font-sans text-sm leading-relaxed uppercase">
                      Architected and deployed scalable web applications using modern full-stack technologies, ensuring high performance and security compliance.
                    </p>
                  </div>

                  {/* GreenNetspark Experience */}
                  <div className="border-heavy p-8 bg-surface-container hover:block-shadow-primary transition-all group duration-300">
                    <div className="flex justify-between items-start mb-6 border-b border-outline-variant pb-4">
                      <div>
                        <h4 className="font-sans text-xl font-bold text-on-background uppercase tracking-tight">GreenNetspark</h4>
                        <p className="font-mono text-xs font-bold text-primary-container mt-1">WEB_DEVELOPER_INTERN</p>
                      </div>
                      <Workflow className="text-primary-container group-hover:scale-110 transition-transform" />
                    </div>
                    <p className="text-on-surface-variant font-sans text-sm leading-relaxed uppercase">
                      Developed responsive frontend interfaces and integrated backend APIs, focusing on user experience and system reliability.
                    </p>
                  </div>
                </div>
              </section>

              {/* Credentials Section */}
              <section className="py-20 border-b-2 border-on-background bg-surface-container-lowest -mx-6 md:-mx-16 px-6 md:px-16">
                <div className="max-w-[1440px] mx-auto">
                  <h2 className="font-mono text-xs text-primary-container font-black tracking-widest mb-4">03_CREDENTIALS</h2>
                  <h3 className="font-sans text-3xl md:text-4xl font-extrabold text-on-background mb-12 uppercase tracking-tight">EDUCATION_&amp;_CERTS</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-2 border-on-background bg-surface-container">
                    {/* Education 1 */}
                    <div className="p-8 border-b-2 md:border-b-0 md:border-r-2 border-on-background hover:bg-surface-container-high transition-colors">
                      <div className="mb-8 font-mono text-[10px] text-outline uppercase font-bold tracking-wider">
                        EDU_01
                      </div>
                      <h4 className="font-sans text-xl font-extrabold text-on-background mb-2 leading-tight uppercase">Amrita Vishwa Vidyapeetham</h4>
                      <p className="font-mono text-xs font-bold text-primary-container mb-4">MCA in Cybersecurity</p>
                      <p className="text-on-surface-variant font-mono text-xs uppercase">CGPA: 8.87 / 10</p>
                    </div>

                    {/* Education 2 */}
                    <div className="p-8 border-b-2 md:border-b-0 md:border-r-2 border-on-background hover:bg-surface-container-high transition-colors">
                      <div className="mb-8 font-mono text-[10px] text-outline uppercase font-bold tracking-wider">
                        EDU_02
                      </div>
                      <h4 className="font-sans text-xl font-extrabold text-on-background mb-2 leading-tight uppercase">University of Mysore</h4>
                      <p className="font-mono text-xs font-bold text-primary-container mb-4">BCA</p>
                      <p className="text-on-surface-variant font-mono text-xs uppercase">CGPA: 8.12 / 10</p>
                    </div>

                    {/* Certifications Row */}
                    <div className="p-8 hover:bg-surface-container-high transition-colors">
                      <div className="mb-8 font-mono text-[10px] text-outline uppercase font-bold tracking-wider">
                        CERTIFICATIONS
                      </div>
                      <h4 className="font-sans text-xl font-extrabold text-on-background mb-6 uppercase tracking-tight">Industry Validation</h4>
                      <div className="flex flex-wrap gap-3">
                        <span className="border border-primary-container px-3 py-1.5 font-mono text-[10px] font-bold text-primary uppercase tracking-wider bg-surface-container-lowest">CISCO</span>
                        <span className="border border-primary-container px-3 py-1.5 font-mono text-[10px] font-bold text-primary uppercase tracking-wider bg-surface-container-lowest">EC-COUNCIL</span>
                        <span className="border border-primary-container px-3 py-1.5 font-mono text-[10px] font-bold text-primary uppercase tracking-wider bg-surface-container-lowest">IBM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Peer Review Quote Section */}
              <section className="py-20">
                <h2 className="font-mono text-xs text-primary-container font-black tracking-widest mb-4">04_VERIFICATION</h2>
                <h3 className="font-sans text-3xl md:text-4xl font-extrabold text-on-background mb-12 uppercase tracking-tight">PEER_REVIEW</h3>

                <div className="border-heavy p-8 md:p-12 bg-surface-container relative overflow-hidden block-shadow-primary">
                  <Quote size={80} className="text-on-background opacity-5 absolute -top-2 -left-2" />
                  <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <p className="font-sans text-lg md:text-xl text-on-surface italic mb-8 leading-relaxed uppercase">
                      "SAADHAN HAS EXHIBITED OUTSTANDING SYSTEMS ARCHITECTING ACUMEN AND ACADEMIC EXCELLENCE IN CYBERSECURITY RESEARCHS, FORMULATING COMPREHENSIVE SOLUTIONS FOR MODERN COMPLEX COMPUTATIONAL THREATS."
                    </p>
                    <div className="inline-block border-t border-outline/30 pt-4">
                      <p className="font-mono text-sm text-primary-container font-bold tracking-wider">Dr. Adwitiya Mukhopadhyay</p>
                      <p className="font-mono text-xs text-outline uppercase mt-1 tracking-widest">Professor / Researcher</p>
                    </div>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === "tech_stack" && (
            <motion.div
              key="tech-stack-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              id="view-tech-stack"
            >
              {/* Directory path header */}
              <section className="py-16 border-b-2 border-on-background">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-primary-container font-mono text-xs uppercase font-bold tracking-widest">
                    <span className="w-2 h-2 bg-primary-container animate-pulse rounded-full"></span>
                    DIRECTORY: ROOT / PROJECTS / REPOSITORY
                  </div>
                  <h1 className="font-sans text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                    PROJECT_REPOSITORY
                  </h1>
                  <p className="font-sans text-lg text-on-surface-variant max-w-2xl leading-relaxed uppercase">
                    Centralized archive of technical implementations, security frameworks, and hybrid computational experiments. All modules verified and deployed to production environment.
                  </p>
                </div>
              </section>

              {/* Projects Grid */}
              <section className="py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12">

                  {/* PROJECT 1 */}
                  <div className="group relative bg-on-background text-background border-4 border-on-background block-shadow-blue transition-all hover:translate-x-[-3px] hover:translate-y-[-3px] flex flex-col justify-between">
                    <div>
                      <div className="h-56 relative overflow-hidden bg-surface-container-highest border-b-4 border-on-background">
                        <img
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqtYE_jZiFXOSJCjyk8CX4r5stTiqakpWuIqSyl4J5udstKrYBIPcXwTRQKN3Khf6sCnu8X_CBbcsxZTXSgDRsok4q2xMX38d55GDdGoA75vOtOKmVqTeTm2bzPGqNkhvPOUbt7LH2Fqaa4xlkhT-LkuflGgnKSI5QMmPgfH54nXXWssZNJ75TNyvLVlvSLjnmJyWIbJ45X9fozW4U0uAfNan2WeQMiKBiTNY0s4nF5DQCLUOOgjenDQPXBbKVjfyT_Ojlyi2I2WB0"
                          alt="Isolated Cloud Terminal Grid"
                        />
                        <div className="absolute top-4 right-4">
                          <div className="flex items-center gap-2 bg-background text-on-background px-3 py-1 border-2 border-on-background font-mono text-[10px] font-bold uppercase tracking-widest shadow-sm">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                            STATUS: DEPLOYED
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="font-sans text-xl md:text-2xl font-black text-primary-container mb-4 uppercase tracking-tight">
                          Isolated Cloud Infrastructure &amp; Zero-Trust Access
                        </h3>
                        <p className="font-sans text-sm mb-6 opacity-90 leading-relaxed uppercase">
                          Highly secure cloud environment architecture. Key feature: "Dark" Ubuntu instance isolated for maximal operational security.
                        </p>
                        <div className="space-y-2">
                          <div className="font-mono text-xs font-bold uppercase tracking-widest text-outline">Tech_Stack</div>
                          <ul className="font-mono text-xs list-none space-y-1.5 font-bold">
                            <li className="flex items-center gap-2 text-background/80"><ChevronRight size={12} className="text-primary-container" /> Azure</li>
                            <li className="flex items-center gap-2 text-background/80"><ChevronRight size={12} className="text-primary-container" /> Linux</li>
                            <li className="flex items-center gap-2 text-background/80"><ChevronRight size={12} className="text-primary-container" /> Network Security Groups (NSG)</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 pt-0">
                      {requisitionOutput["cloud_infra"] && (
                        <pre className="bg-black text-primary p-4 border-2 border-primary-container font-mono text-[11px] overflow-x-auto rounded mb-4 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                          {requisitionOutput["cloud_infra"]}
                        </pre>
                      )}
                      <button
                        onClick={() => handleAccessRequisition("cloud_infra", "Isolated Cloud Infrastructure & Zero-Trust Access")}
                        disabled={requisitioningId !== null}
                        className="w-full bg-primary-container text-on-primary-container py-3.5 font-mono text-xs uppercase tracking-widest font-black hover:bg-on-background hover:text-background transition-colors border-2 border-primary-container flex items-center justify-center gap-2"
                      >
                        {requisitioningId === "cloud_infra" ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            REQUISITIONING...
                          </>
                        ) : (
                          "ACCESS_REQUISITION"
                        )}
                      </button>
                    </div>
                  </div>

                  {/* PROJECT 2 */}
                  <div className="group relative bg-on-background text-background border-4 border-on-background block-shadow-blue transition-all hover:translate-x-[-3px] hover:translate-y-[-3px] flex flex-col justify-between">
                    <div>
                      <div className="h-56 relative overflow-hidden bg-surface-container-highest border-b-4 border-on-background">
                        <img
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIQ8iiFWSGaaB_hzF5aPlbKMBhUkBdGM_fIOVNdGF7lqjrARkZQhK-lwLBNoUJizmwi_pCPtyThgFjSTlQ-BTzrwDwxRYMDCxS1QE07IE3MOF6fRMB3q4DUhLl_OKx4QffS4mCeWXHv6g4BVfvyt3jVZVu5geEGc2lo7RJKUL81VYY33ZQyROFkgZWwi7P2Wq5MVGy_vbeVuhfsjJZoa18MgfOdmUsscGKISyI0YfBR5AHe8jT8sK-s5OZYSxKzTK3rZblKcEKrupi"
                          alt="Compliance Platform Architecture Diagram"
                        />
                        <div className="absolute top-4 right-4">
                          <div className="flex items-center gap-2 bg-background text-on-background px-3 py-1 border-2 border-on-background font-mono text-[10px] font-bold uppercase tracking-widest shadow-sm">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                            STATUS: DEPLOYED
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="font-sans text-xl md:text-2xl font-black text-primary-container mb-4 uppercase tracking-tight">
                          OpenGRC — Compliance Automation Platform
                        </h3>
                        <p className="font-sans text-sm mb-6 opacity-90 leading-relaxed uppercase">
                          Enterprise-grade Governance, Risk, and Compliance platform optimizing regulatory adherence and automated audit trail generation.
                        </p>
                        <div className="space-y-2">
                          <div className="font-mono text-xs font-bold uppercase tracking-widest text-outline">Tech_Stack</div>
                          <ul className="font-mono text-xs list-none space-y-1.5 font-bold">
                            <li className="flex items-center gap-2 text-background/80"><ChevronRight size={12} className="text-primary-container" /> React.js</li>
                            <li className="flex items-center gap-2 text-background/80"><ChevronRight size={12} className="text-primary-container" /> Node.js</li>
                            <li className="flex items-center gap-2 text-background/80"><ChevronRight size={12} className="text-primary-container" /> PostgreSQL</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 pt-0">
                      {requisitionOutput["open_grc"] && (
                        <pre className="bg-black text-primary p-4 border-2 border-primary-container font-mono text-[11px] overflow-x-auto rounded mb-4 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                          {requisitionOutput["open_grc"]}
                        </pre>
                      )}
                      <button
                        onClick={() => handleAccessRequisition("open_grc", "OpenGRC Compliance Automation Platform")}
                        disabled={requisitioningId !== null}
                        className="w-full bg-primary-container text-on-primary-container py-3.5 font-mono text-xs uppercase tracking-widest font-black hover:bg-on-background hover:text-background transition-colors border-2 border-primary-container flex items-center justify-center gap-2"
                      >
                        {requisitioningId === "open_grc" ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            REQUISITIONING...
                          </>
                        ) : (
                          "ACCESS_REQUISITION"
                        )}
                      </button>
                    </div>
                  </div>

                  {/* PROJECT 3 */}
                  <div className="group relative bg-on-background text-background border-4 border-on-background block-shadow-blue transition-all hover:translate-x-[-3px] hover:translate-y-[-3px] flex flex-col justify-between">
                    <div>
                      <div className="h-56 relative overflow-hidden bg-surface-container-highest border-b-4 border-on-background">
                        <img
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWB1OSfQcmp7VkSJ3FORSqJtwf6ye3NLcx8in51tJz4NnwuA8-v9bgp7LxARvd7bPQaztlsmHymAwBk6Mkh5LgiKTd5sh5CO_vWKSlESBP_zYNDuOEsWvb3joo52vEUXnwr1JFkJVsm1fDpx5-iU0WaJ9-UiI_kLVNqWb5Oko_g96XdCJJGxKY9lrm8-feVrlIefjescSkOZ611I48DyB9WX47NyxN76Vcd7Hmt78RTgIjbqCoS7DsrKmnlpGA4juz9kRQhB9bFtIc"
                          alt="Topographic Mapping System and Digital Wireframe"
                        />
                        <div className="absolute top-4 right-4">
                          <div className="flex items-center gap-2 bg-background text-on-background px-3 py-1 border-2 border-on-background font-mono text-[10px] font-bold uppercase tracking-widest shadow-sm">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                            STATUS: DEPLOYED
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="font-sans text-xl md:text-2xl font-black text-primary-container mb-4 uppercase tracking-tight">
                          Sentinel
                        </h3>
                        <p className="font-sans text-sm mb-6 opacity-90 leading-relaxed uppercase">
                          Real-time endpoint protection and intrusion detection system featuring advanced behavioral analysis algorithms.
                        </p>
                        <div className="space-y-2">
                          <div className="font-mono text-xs font-bold uppercase tracking-widest text-outline">Tech_Stack</div>
                          <ul className="font-mono text-xs list-none space-y-1.5 font-bold">
                            <li className="flex items-center gap-2 text-background/80"><ChevronRight size={12} className="text-primary-container" /> Custom SIEM Engine</li>
                            <li className="flex items-center gap-2 text-background/80"><ChevronRight size={12} className="text-primary-container" /> Kernel-level monitoring</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 pt-0">
                      {requisitionOutput["sentinel"] && (
                        <pre className="bg-black text-primary p-4 border-2 border-primary-container font-mono text-[11px] overflow-x-auto rounded mb-4 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                          {requisitionOutput["sentinel"]}
                        </pre>
                      )}
                      <button
                        onClick={() => handleAccessRequisition("sentinel", "Sentinel Real-Time Endpoint System")}
                        disabled={requisitioningId !== null}
                        className="w-full bg-primary-container text-on-primary-container py-3.5 font-mono text-xs uppercase tracking-widest font-black hover:bg-on-background hover:text-background transition-colors border-2 border-primary-container flex items-center justify-center gap-2"
                      >
                        {requisitioningId === "sentinel" ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            REQUISITIONING...
                          </>
                        ) : (
                          "ACCESS_REQUISITION"
                        )}
                      </button>
                    </div>
                  </div>

                  {/* PROJECT 4 */}
                  <div className="group relative bg-on-background text-background border-4 border-on-background block-shadow-blue transition-all hover:translate-x-[-3px] hover:translate-y-[-3px] flex flex-col justify-between">
                    <div>
                      <div className="h-56 relative overflow-hidden bg-surface-container-highest border-b-4 border-on-background">
                        <img
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIQ8iiFWSGaaB_hzF5aPlbKMBhUkBdGM_fIOVNdGF7lqjrARkZQhK-lwLBNoUJizmwi_pCPtyThgFjSTlQ-BTzrwDwxRYMDCxS1QE07IE3MOF6fRMB3q4DUhLl_OKx4QffS4mCeWXHv6g4BVfvyt3jVZVu5geEGc2lo7RJKUL81VYY33ZQyROFkgZWwi7P2Wq5MVGy_vbeVuhfsjJZoa18MgfOdmUsscGKISyI0YfBR5AHe8jT8sK-s5OZYSxKzTK3rZblKcEKrupi"
                          alt="Abstract Quantum Laser Grid Lines"
                        />
                        <div className="absolute top-4 right-4">
                          <div className="flex items-center gap-2 bg-background text-on-background px-3 py-1 border-2 border-on-background font-mono text-[10px] font-bold uppercase tracking-widest shadow-sm">
                            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                            STATUS: PUBLISHED
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="font-sans text-xl md:text-2xl font-black text-primary-container mb-4 uppercase tracking-tight">
                          AURORA-QKD Protocol
                        </h3>
                        <p className="font-sans text-sm mb-6 opacity-90 leading-relaxed uppercase">
                          Published Research on advanced Quantum Key Distribution protocols. Key feature: 11% QBER improvement over standard models.
                        </p>
                        <div className="space-y-2">
                          <div className="font-mono text-xs font-bold uppercase tracking-widest text-outline">Tech_Stack</div>
                          <ul className="font-mono text-xs list-none space-y-1.5 font-bold">
                            <li className="flex items-center gap-2 text-background/80"><ChevronRight size={12} className="text-primary-container" /> Quantum Computing</li>
                            <li className="flex items-center gap-2 text-background/80"><ChevronRight size={12} className="text-primary-container" /> Research</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 pt-0">
                      {requisitionOutput["aurora_qkd"] && (
                        <pre className="bg-black text-primary p-4 border-2 border-primary-container font-mono text-[11px] overflow-x-auto rounded mb-4 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                          {requisitionOutput["aurora_qkd"]}
                        </pre>
                      )}
                      <button
                        onClick={() => handleAccessRequisition("aurora_qkd", "AURORA Quantum Key Distribution Protocol")}
                        disabled={requisitioningId !== null}
                        className="w-full bg-primary-container text-on-primary-container py-3.5 font-mono text-xs uppercase tracking-widest font-black hover:bg-on-background hover:text-background transition-colors border-2 border-primary-container flex items-center justify-center gap-2"
                      >
                        {requisitioningId === "aurora_qkd" ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            REQUISITIONING...
                          </>
                        ) : (
                          "ACCESS_REQUISITION"
                        )}
                      </button>
                    </div>
                  </div>

                </div>
              </section>

              {/* SYSTEM_LOG Terminals Table */}
              <section className="px-6 md:px-12 py-12 bg-surface-container-lowest border-t-2 border-on-background relative overflow-hidden block-shadow-blue mb-12">
                <div className="scanline"></div>
                <div className="flex items-center gap-4 mb-8">
                  <Terminal className="text-primary-container animate-pulse" />
                  <h2 className="font-sans text-xl md:text-2xl font-extrabold uppercase tracking-widest">SYSTEM_LOG</h2>
                </div>

                <div className="bg-black border-2 border-primary-container p-4 md:p-6 block-shadow-blue overflow-x-auto">
                  {loadingLogs ? (
                    <div className="flex flex-col items-center justify-center py-10 font-mono text-xs text-primary-container gap-3">
                      <Loader2 size={24} className="animate-spin text-primary-container" />
                      FETCHING_LOGS_STREAM...
                    </div>
                  ) : (
                    <table className="w-full font-mono text-xs md:text-sm text-left">
                      <thead className="bg-surface-container-low text-primary-container border-b-2 border-primary-container">
                        <tr>
                          <th className="py-3 px-4 font-bold tracking-wider uppercase">TIMESTAMP</th>
                          <th className="py-3 px-4 font-bold tracking-wider uppercase">EVENT_TYPE</th>
                          <th className="py-3 px-4 font-bold tracking-wider uppercase">DESCRIPTION</th>
                          <th className="py-3 px-4 font-bold tracking-wider uppercase text-right">HASH</th>
                        </tr>
                      </thead>
                      <tbody className="text-on-surface-variant divide-y divide-white/5">
                        {logs.map((log, index) => (
                          <tr
                            key={index}
                            onMouseEnter={() => setHoveredRowIndex(index)}
                            onMouseLeave={() => setHoveredRowIndex(null)}
                            className="hover:bg-surface-container transition-colors group"
                          >
                            <td className="py-4 px-4 terminal-text-glow font-medium text-primary text-xs whitespace-nowrap">
                              {log.timestamp}
                            </td>
                            <td className="py-4 px-4 uppercase font-bold text-xs whitespace-nowrap">
                              {log.eventType}
                            </td>
                            <td className="py-4 px-4 text-on-surface group-hover:text-primary-container transition-colors text-xs">
                              {log.description}
                            </td>
                            <td className="py-4 px-4 text-right font-bold opacity-80 group-hover:opacity-100 transition-opacity text-xs whitespace-nowrap">
                              {hoveredRowIndex === index ? (randomHashes[index] || log.hash) : log.hash}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                  <div className="mt-6 flex justify-between items-center text-[10px] font-mono font-bold text-primary-container animate-pulse uppercase tracking-widest">
                    <div>[ SYSTEM STATUS: OPTIMAL ]</div>
                    <div>[ CONNECTION: ENCRYPTED ]</div>
                  </div>
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Element */}
      <footer className="w-full bg-surface-container-lowest border-t-2 border-on-background mt-20">
        <div className="flex flex-col md:flex-row justify-between items-center w-full px-6 md:px-16 py-8 gap-6 max-w-[1440px] mx-auto">
          <div className="font-mono text-xs text-primary font-bold tracking-widest uppercase">
            ©2026 SAADHAN_P // CORE_ARCH_V1.0
          </div>
          <div className="flex gap-6 font-mono text-xs font-bold tracking-wider uppercase">
            <a className="text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container px-2 transition-colors" href="https://github.com/saadhan-p" target="_blank" rel="noreferrer">GITHUB</a>
            <a className="text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container px-2 transition-colors" href="https://linkedin.com/in/saadhan-p" target="_blank" rel="noreferrer">LINKEDIN</a>
            <a className="text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container px-2 transition-colors" href="#overflow">STACK_OVERFLOW</a>
          </div>
          <div className="flex items-center gap-2 select-none shrink-0">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
            <span className="font-mono text-[10px] uppercase font-black text-on-surface-variant tracking-widest">Uplink: Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
