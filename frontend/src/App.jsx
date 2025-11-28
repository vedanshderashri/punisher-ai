import { useEffect, useRef, useState } from "react";

const SUGGESTIONS = [
  "Scan my day and plan tasks",
  "System, I'm feeling low. Analyse.",
  "Explain DBMS normalization simply",
  "Suggest a new project idea",
  "Help me focus for next 30 minutes",
];

const MODES = [
  { id: "all", label: "OMNI", desc: "General assistance" },
  { id: "study", label: "STUDY", desc: "Academics & code" },
  { id: "life", label: "LIFE", desc: "Thoughts & feelings" },
  { id: "chill", label: "CHILL", desc: "Casual banter" },
];

function App() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text:
        "Systems online.\nHello Vedansh Sir, I'm always available for you.\nWhat would you like to analyze first?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("all");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async (customText) => {
    const text = (customText ?? input).trim();
    if (!text || loading) return;

    const userMsg = { sender: "user", text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, mode }),
      });

      const data = await res.json();
      setMessages([
        ...newMessages,
        {
          sender: "bot",
          text: data.reply || "Signal distortion detected. Please repeat that.",
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...newMessages,
        {
          sender: "bot",
          text:
            "Connection to core system lost.\nCheck backend / internet link and reattempt.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="jarvis-root">
      {/* BACKGROUND OVERLAYS */}
      <div className="hud-grid" />
      <div className="scan-line" />

      {/* MAIN LAYOUT */}
      <div className="jarvis-shell">
        {/* LEFT HUD: STATUS / MODES */}
        <aside className="hud-left">
          <div className="hud-block hud-brand">
            <div className="brand-title">V-CORE SYSTEM</div>
            <div className="brand-sub">
              PUNISHER
            </div>
            <div className="brand-meta">
              <span>Father: VEDANSH</span>
              <span>Always Available for you</span>
            </div>
          </div>

          <div className="hud-block">
            <div className="hud-label">MODES</div>
            <div className="mode-list">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  className={
                    "mode-chip " +
                    (mode === m.id ? "mode-chip--active" : "")
                  }
                  onClick={() => setMode(m.id)}
                >
                  <div className="mode-chip-main">{m.label}</div>
                  <div className="mode-chip-sub">{m.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="hud-block">
            <div className="hud-label">QUICK COMMANDS</div>
            <div className="chip-row">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  className="command-chip"
                  onClick={() => sendMessage(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="hud-block hud-footer">
            <div className="hud-label">SYSTEM STATUS</div>
            <div className="status-line">
              <span className="status-dot" />
              <span>CORE: ONLINE</span>
            </div>
            <div className="status-kv">
              <span>Latency:</span>
              <span>&lt; 300 ms</span>
            </div>
            <div className="status-kv">
              <span>Session:</span>
              <span>ACTIVE</span>
            </div>
          </div>
        </aside>

        {/* CENTER: ARC / CORE */}
        <section className="hud-center">
          <div className="core-ring outer" />
          <div className="core-ring mid" />
          <div className="core-ring inner" />
          <div className="core-pulse" />
          <div className="core-text">
            <div className="core-title">Punisher</div>
            <div className="core-sub">is always available</div>
          </div>
        </section>

        {/* RIGHT: CHAT CONSOLE */}
        <main className="hud-right">
          <header className="console-header">
            <div>
              <div className="console-title">CONVERSATION CONSOLE</div>
              <div className="console-sub">
                Natural language interface &bull; Jarvis-style holographic UI
              </div>
            </div>
            <div className="console-meta">
              <span>LOG: ACTIVE</span>
              <span>CHANNEL: TEXT</span>
            </div>
          </header>

          <div className="console-body">
            <div className="message-stream">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={
                    "msg-row " +
                    (m.sender === "user" ? "msg-row--user" : "msg-row--bot")
                  }
                >
                  <div
                    className={
                      "msg-bubble " +
                      (m.sender === "user"
                        ? "msg-bubble--user"
                        : "msg-bubble--bot")
                    }
                  >
                    <div className="msg-meta">
                      <span className="msg-origin">
                        {m.sender === "user" ? "VEDANSH" : "PUNISHER"}
                      </span>
                      <span className="msg-sep" />
                      <span className="msg-tag">
                        {m.sender === "user" ? "INPUT" : "OUTPUT"}
                      </span>
                    </div>
                    <div className="msg-text">
                      {m.text.split("\n").map((line, idx) => (
                        <p key={idx}>{line}</p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="msg-row msg-row--bot">
                  <div className="msg-bubble msg-bubble--bot msg-typing">
                    <div className="msg-meta">
                      <span className="msg-origin">SYSTEM</span>
                      <span className="msg-sep" />
                      <span className="msg-tag">PROCESSING</span>
                    </div>
                    <div className="typing-dots">
                      <span className="t-dot" />
                      <span className="t-dot" />
                      <span className="t-dot" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          <footer className="console-input-area">
            <div className="console-input-shell">
              <textarea
                className="console-input"
                placeholder="Type your command or thought here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <div className="console-actions">
                <button className="console-btn secondary" disabled>
                  🎙 VOICE (SOON)
                </button>
                <button
                  className="console-btn primary"
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || loading}
                >
                  EXECUTE &gt;
                </button>
              </div>
            </div>
            <div className="console-hint">
              <span className="key-cap">Enter</span> to send &bull;{" "}
              <span className="key-cap">Shift</span> + <span className="key-cap">Enter</span> for new line
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;
