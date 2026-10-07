import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Smartphone, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getExperienceTips } from "@/lib/experience.functions";

type Conn = { effectiveType?: string; saveData?: boolean };

export function ExperienceAdvisor() {
  const run = useServerFn(getExperienceTips);
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [info, setInfo] = useState({ deviceType: "Phone", screen: "", connection: "unknown", reducedMotion: false, lowData: false });
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [tips, setTips] = useState<string[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const w = window.innerWidth;
    setIsMobile(w < 900);
    const c = (navigator as Navigator & { connection?: Conn }).connection;
    setInfo({
      deviceType: w < 600 ? "Phone" : "Tablet",
      screen: `${w}×${window.innerHeight} ${w > window.innerHeight ? "landscape" : "portrait"}`,
      connection: c?.effectiveType ?? "unknown",
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      lowData: !!c?.saveData,
    });
  }, []);

  if (!isMobile) return null;

  const submit = async () => {
    setLoading(true); setError(""); setTips([]);
    try {
      const r = await run({ data: { ...info, note } });
      if (r.ok) setTips(r.tips); else setError(r.error);
    } catch { setError("Something went wrong. Please try again."); }
    setLoading(false);
  };

  return (
    <>
      <button className="advisor-fab" onClick={() => setOpen(true)} aria-label="Personalize my experience"><Smartphone size={18} /></button>
      {open && (
        <div className="advisor-panel" role="dialog" aria-label="Experience advisor">
          <div className="advisor-head"><strong>Tailor this site to your device</strong><button onClick={() => setOpen(false)} aria-label="Close"><X size={18} /></button></div>
          <p className="advisor-sub">Share your device and conditions — AI suggests the best way to browse.</p>
          <label>Device<select value={info.deviceType} onChange={(e) => setInfo({ ...info, deviceType: e.target.value })}><option>Phone</option><option>Tablet</option><option>Foldable</option></select></label>
          <label>Connection<select value={info.connection} onChange={(e) => setInfo({ ...info, connection: e.target.value })}>{["unknown", "slow-2g", "2g", "3g", "4g", "wifi"].map((o) => <option key={o}>{o}</option>)}</select></label>
          <label className="advisor-check"><input type="checkbox" checked={info.lowData} onChange={(e) => setInfo({ ...info, lowData: e.target.checked })} />Save data</label>
          <label className="advisor-check"><input type="checkbox" checked={info.reducedMotion} onChange={(e) => setInfo({ ...info, reducedMotion: e.target.checked })} />Less motion</label>
          <label>Anything else? (optional)<input maxLength={300} value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. browsing outdoors, one hand" /></label>
          <p className="advisor-meta">Screen: {info.screen}</p>
          <Button variant="cinematic" onClick={submit} disabled={loading}>{loading ? <><Loader2 className="animate-spin" /> Thinking…</> : "Get recommendations"}</Button>
          {error && <p className="advisor-error" role="alert">{error}</p>}
          {tips.length > 0 && <ul className="advisor-tips">{tips.map((t, i) => <li key={i}>{t}</li>)}</ul>}
        </div>
      )}
    </>
  );
}
