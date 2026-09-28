import { useState } from "react";

// Each platform has its own limit and brand color.
const PLATFORMS = {
  Twitter: { limit: 280, color: "#1D9BF0" },
  LinkedIn: { limit: 3000, color: "#0A66C2" },
};

export default function PostComposer() {
  const [platform, setPlatform] = useState("Twitter");
  const [text, setText] = useState("");
  const [posted, setPosted] = useState(false);

  const { limit, color } = PLATFORMS[platform];
  const count = text.length;
  const over = count - limit; // positive number means too long
  const isOver = over > 0;
  const isEmpty = text.trim().length === 0;

  // Progress ring maths
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(count / limit, 1);
  const ringColor = isOver ? "#C73E1D" : color;

  function handleChange(e) {
    setText(e.target.value);
    setPosted(false);
  }

  function handlePost() {
    // Replace this with your real API call.
    setPosted(true);
    setText("");
  }

  // If the text is too long for Twitter but fine for LinkedIn, say so.
  const fitsLinkedIn = platform === "Twitter" && count <= PLATFORMS.LinkedIn.limit;

  return (
    <div className="pc-page">
      <style>{css}</style>

      <div className="pc-card" style={{ "--accent": color }}>
        <div className="pc-tabs" role="tablist" aria-label="Choose platform">
          {Object.keys(PLATFORMS).map((name) => (
            <button
              key={name}
              role="tab"
              aria-selected={platform === name}
              className={"pc-tab" + (platform === name ? " is-active" : "")}
              onClick={() => {
                setPlatform(name);
                setPosted(false);
              }}
            >
              {name}
            </button>
          ))}
        </div>

        <textarea
          className={"pc-textarea" + (isOver ? " has-error" : "")}
          value={text}
          onChange={handleChange}
          placeholder={
            platform === "Twitter"
              ? "What's happening?"
              : "What do you want to talk about?"
          }
          rows={7}
          aria-invalid={isOver}
          aria-describedby="pc-feedback"
        />

        <div className="pc-footer">
          <div id="pc-feedback" className="pc-feedback" aria-live="polite">
            {isOver && (
              <p className="pc-error">
                {over} character{over === 1 ? "" : "s"} over the {limit} limit.{" "}
                {fitsLinkedIn
                  ? "Shorten it, or switch to LinkedIn."
                  : "Shorten your post to publish."}
              </p>
            )}
            {posted && !isOver && (
              <p className="pc-success">Posted to {platform}.</p>
            )}
          </div>

          <div className="pc-actions">
            <div className="pc-counter" title={`${count} of ${limit}`}>
              <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true">
                <circle cx="22" cy="22" r={radius} className="pc-ring-bg" />
                <circle
                  cx="22"
                  cy="22"
                  r={radius}
                  className="pc-ring"
                  stroke={ringColor}
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - progress)}
                />
              </svg>
              <span className={"pc-count" + (isOver ? " is-over" : "")}>
                {count}
                <small>/{limit}</small>
              </span>
            </div>

            <button
              className="pc-post"
              onClick={handlePost}
              disabled={isEmpty || isOver}
            >
              Post to {platform}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600&display=swap');

.pc-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: #E9EEF2;
  font-family: 'Instrument Sans', system-ui, sans-serif;
  color: #1B2432;
}

.pc-card {
  width: 100%;
  max-width: 560px;
  background: #fff;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 1px 0 #d5dde4, 0 18px 40px -24px rgba(27, 36, 50, .35);
}

/* Platform switch */
.pc-tabs {
  display: inline-flex;
  padding: 4px;
  gap: 4px;
  background: #EEF2F5;
  border-radius: 12px;
  margin-bottom: 16px;
}
.pc-tab {
  border: 0;
  background: transparent;
  padding: 8px 18px;
  border-radius: 9px;
  font: inherit;
  font-weight: 500;
  color: #5b6776;
  cursor: pointer;
  transition: background .2s, color .2s;
}
.pc-tab.is-active {
  background: var(--accent);
  color: #fff;
}
.pc-tab:focus-visible,
.pc-post:focus-visible,
.pc-textarea:focus-visible {
  outline: 3px solid var(--accent);
  outline-offset: 2px;
}

/* Text area */
.pc-textarea {
  width: 100%;
  box-sizing: border-box;
  resize: vertical;
  min-height: 140px;
  border: 1.5px solid #D5DDE4;
  border-radius: 14px;
  padding: 14px 16px;
  font: inherit;
  font-size: 17px;
  line-height: 1.5;
  color: inherit;
  background: #FAFBFC;
  transition: border-color .2s;
}
.pc-textarea::placeholder { color: #8b96a3; }
.pc-textarea.has-error { border-color: #C73E1D; }

/* Footer */
.pc-footer {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-top: 14px;
  flex-wrap: wrap;
}
.pc-feedback { flex: 1 1 200px; min-height: 22px; }
.pc-feedback p { margin: 0; font-size: 14px; line-height: 1.45; }
.pc-error { color: #C73E1D; font-weight: 500; }
.pc-success { color: #1F7A4D; font-weight: 500; }

.pc-actions { display: flex; align-items: center; gap: 14px; margin-left: auto; }

/* Counter ring */
.pc-counter { display: flex; align-items: center; gap: 10px; }
.pc-counter svg { transform: rotate(-90deg); }
.pc-ring-bg { fill: none; stroke: #E3E9EE; stroke-width: 4; }
.pc-ring {
  fill: none;
  stroke-width: 4;
  stroke-linecap: round;
  transition: stroke-dashoffset .15s ease, stroke .2s;
}
.pc-count {
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  font-size: 15px;
  min-width: 70px;
}
.pc-count small { font-weight: 400; color: #8b96a3; }
.pc-count.is-over { color: #C73E1D; }

/* Post button */
.pc-post {
  border: 0;
  border-radius: 999px;
  padding: 11px 20px;
  font: inherit;
  font-weight: 600;
  color: #fff;
  background: var(--accent);
  cursor: pointer;
  transition: opacity .2s, transform .1s;
}
.pc-post:active:not(:disabled) { transform: scale(.97); }
.pc-post:disabled { opacity: .4; cursor: not-allowed; }

@media (prefers-reduced-motion: reduce) {
  * { transition: none !important; }
}
`;
