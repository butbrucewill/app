import { useEffect, useRef, useState } from "react";
import { IMAGES } from "@/constants";

const PATTERNS = [
  { label: "Ascending Triangle", bias: 0.74, pivots: [[0, 0], [0.12, 10], [0.28, 3], [0.42, 10], [0.58, 5.5], [0.72, 10], [0.85, 7], [1, 9]], note: "Flat resistance plus rising lows usually resolves upward." },
  { label: "Descending Triangle", bias: 0.26, pivots: [[0, 10], [0.12, 0], [0.28, 7], [0.42, 0.5], [0.58, 4], [0.72, 0.5], [0.85, 2], [1, 1]], note: "Flat support plus falling highs usually resolves downward." },
  { label: "Head & Shoulders", bias: 0.28, pivots: [[0, 1], [0.15, 6], [0.28, 2], [0.45, 10], [0.58, 2.2], [0.72, 6.5], [0.85, 2.5], [1, 2]], note: "A lower right shoulder tends to keep sliding." },
  { label: "Double Bottom", bias: 0.72, pivots: [[0, 8], [0.2, 0.5], [0.4, 6], [0.6, 0.5], [0.8, 5.5], [1, 6.5]], note: "Two failed pushes to the same low often break the middle peak." },
  { label: "Double Top", bias: 0.27, pivots: [[0, 2], [0.2, 10], [0.4, 4], [0.6, 9.5], [0.8, 5], [1, 4]], note: "Two failed pushes to the same high often break the middle trough." },
  { label: "Bull Flag", bias: 0.76, pivots: [[0, 0], [0.22, 12], [0.4, 10.7], [0.55, 11.4], [0.7, 10.3], [0.85, 11], [1, 10.5]], note: "A sharp pole followed by a tight pullback tends to continue." },
];
const TICKERS = ["NIFTY 50", "SENSEX 30", "BTC/USDT", "GOLD SPOT", "CRUDE OIL", "S&P 500", "NASDAQ 100", "EUR/USD", "ETH/USDT", "US10Y"];
const money = (value) => `${value < 0 ? "-$" : "$"}${Math.abs(value).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function makeCloses(pivots, count) {
  return Array.from({ length: count }, (_, index) => {
    const x = index / (count - 1);
    let left = pivots[0], right = pivots[pivots.length - 1];
    for (let pivot = 0; pivot < pivots.length - 1; pivot += 1) {
      if (x >= pivots[pivot][0] && x <= pivots[pivot + 1][0]) { left = pivots[pivot]; right = pivots[pivot + 1]; break; }
    }
    const t = (x - left[0]) / (right[0] - left[0] || 1);
    return left[1] + (right[1] - left[1]) * t + (Math.random() - 0.5) * 0.5;
  });
}

function makeCandles(closes) {
  return closes.map((close, index, values) => {
    const open = index ? values[index - 1] : close - (Math.random() - 0.5) * 0.8;
    const wick = 0.18 + Math.random() * 0.32;
    return { o: open, h: Math.max(open, close) + wick, l: Math.min(open, close) - wick, c: close };
  });
}

export function GamingZone() {
  const canvasRef = useRef(null);
  const timerRef = useRef(null);
  const revealRef = useRef(null);
  const startedAt = useRef(0);
  const [balance, setBalance] = useState(1000);
  const [bet, setBet] = useState(100);
  const [round, setRound] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [seconds, setSeconds] = useState(10);
  const [game, setGame] = useState(null);
  const [active, setActive] = useState(false);
  const [result, setResult] = useState(null);
  const [focus, setFocus] = useState(false);
  const [timeframe, setTimeframe] = useState("1M");

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas || !game?.display.length) return;
    const width = canvas.clientWidth;
    const height = focus ? 520 : window.innerWidth > 860 ? 360 : window.innerWidth > 560 ? 300 : 250;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr; canvas.height = height * dpr; canvas.style.height = `${height}px`;
    const ctx = canvas.getContext("2d"); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, width, height);
    const pad = 16, span = game.max - game.min || 1, step = (width - pad * 2) / game.all.length;
    const y = (value) => height - pad - ((value - game.min) / span) * (height - pad * 2);
    ctx.font = "9px monospace"; ctx.fillStyle = "rgba(237,231,216,.32)"; ctx.strokeStyle = "rgba(237,231,216,.06)";
    for (let row = 0; row <= 4; row += 1) { const lineY = pad + row * (height - pad * 2) / 4; ctx.beginPath(); ctx.moveTo(pad, lineY); ctx.lineTo(width - pad, lineY); ctx.stroke(); ctx.fillText(`$${(100 + game.max - row * span / 4).toFixed(1)}`, width - 55, lineY - 3); }
    game.display.forEach((candle, index) => { const x = pad + step * index + step / 2; const color = candle.c >= candle.o ? (index < game.split ? "#3E6B47" : "#4FBE68") : (index < game.split ? "#8B4A43" : "#E0564B"); ctx.strokeStyle = color; ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(x, y(candle.h)); ctx.lineTo(x, y(candle.l)); ctx.stroke(); ctx.fillRect(x - Math.max(2, step * 0.28), Math.min(y(candle.o), y(candle.c)), Math.max(2, step * 0.56), Math.max(1.4, Math.abs(y(candle.o) - y(candle.c)))); });
    const last = game.display[game.display.length - 1]; ctx.setLineDash([2, 5]); ctx.strokeStyle = "rgba(237,231,216,.28)"; ctx.beginPath(); ctx.moveTo(pad, y(last.c)); ctx.lineTo(width - pad, y(last.c)); ctx.stroke(); ctx.setLineDash([]);
    if (game.split <= game.display.length) { const splitX = pad + step * game.split; ctx.setLineDash([3, 4]); ctx.strokeStyle = "rgba(201,162,75,.55)"; ctx.beginPath(); ctx.moveTo(splitX, pad * 0.4); ctx.lineTo(splitX, height - pad * 0.4); ctx.stroke(); ctx.setLineDash([]); }
  };

  useEffect(() => { draw(); const onResize = () => draw(); window.addEventListener("resize", onResize); return () => { window.removeEventListener("resize", onResize); clearInterval(timerRef.current); clearInterval(revealRef.current); }; }, [game, focus]);

  const resolve = (direction) => {
    if (!game || !active) return;
    clearInterval(timerRef.current);
    const correct = direction ? (direction === "up") === game.goesUp : false;
    const multiplier = direction ? clamp(3 - ((Date.now() - startedAt.current) / 10000) * 2, 1, 3) : 0;
    const net = direction && correct ? bet * (multiplier - 1) : -bet;
    const nextStreak = direction && correct ? streak + 1 : 0;
    setBalance((value) => Math.max(0, value + net)); setRound((value) => value + 1); setStreak(nextStreak); setBest((value) => Math.max(value, nextStreak));
    let revealed = 32; clearInterval(revealRef.current); revealRef.current = setInterval(() => { revealed += 1; setGame((current) => current ? { ...current, display: current.all.slice(0, Math.min(revealed, current.all.length)) } : current); if (revealed >= game.all.length) { clearInterval(revealRef.current); setActive(false); setResult({ win: Boolean(direction && correct), title: direction === null ? "Bell rang - too slow" : correct ? multiplier >= 2.2 ? "Lightning call" : "Correct call" : "Wrong side", text: `${game.pattern.label} actually broke ${game.goesUp ? "UP" : "DOWN"}. You called ${direction || "no call"}. ${direction && correct ? `Profit: ${money(net)} (${multiplier.toFixed(1)}x).` : `Lost stake: ${money(bet)}.`} ${game.pattern.note}` }); } }, 55);
  };

  const start = () => {
    if (balance < bet) { setResult({ win: false, title: "Out of funds", text: `Balance ${money(balance)} is below your ${money(bet)} stake.` }); return; }
    const pattern = PATTERNS[Math.floor(Math.random() * PATTERNS.length)]; const setup = makeCloses(pattern.pivots, 32); const goesUp = Math.random() < pattern.bias; let value = setup[31]; const continuation = Array.from({ length: 11 }, () => { value += (goesUp ? 1 : -1) * (0.55 + Math.random() * 0.5) + (Math.random() - 0.5) * 0.6; return value; }); const all = makeCandles(setup.concat(continuation));
    setGame({ pattern, goesUp, all, display: all.slice(0, 32), split: 32, min: Math.min(...all.flatMap((c) => [c.h, c.l])), max: Math.max(...all.flatMap((c) => [c.h, c.l])), ticker: TICKERS[Math.floor(Math.random() * TICKERS.length)] }); setActive(true); setResult(null); setSeconds(10); startedAt.current = Date.now(); clearInterval(timerRef.current); timerRef.current = setInterval(() => { const remaining = Math.max(0, 10000 - (Date.now() - startedAt.current)); setSeconds(Math.ceil(remaining / 1000)); if (!remaining) { clearInterval(timerRef.current); resolve(null); } }, 100);
  };

  const chartProgress = (seconds / 10) * 264;
  return <section id="gamingzone" className={`gaming-zone ${focus ? "gaming-zone-focus" : ""}`}><div className="gaming-panel"><span className="gaming-rivet top-left" /><span className="gaming-rivet top-right" /><span className="gaming-rivet bottom-left" /><span className="gaming-rivet bottom-right" />
    <div className="gaming-head"><div><img src={IMAGES.logo} alt="Trading Ke Khiladi" style={{ height: "44px", width: "auto", marginBottom: "12px", display: "block" }} /><span className="gaming-eyebrow">Trading Ke Khiladi · Gaming Zone</span><h2>Call It.</h2></div><p>Study the tape for ten seconds, then slam a paddle before the bell. Speed and accuracy both pay.</p></div>
    <div className="gaming-readouts">{[["Balance", money(balance)], ["Round", round], ["Streak", streak], ["Best", best]].map(([label, value]) => <div className="gaming-readout" key={label}><span>{label}</span><strong className={label === "Balance" && balance < 1000 ? "down" : ""}>{value}</strong></div>)}</div>
    <div className="gaming-bet"><span>Stake</span>{[50, 100, 200, 500].map((amount) => <button type="button" key={amount} className={bet === amount ? "active" : ""} disabled={active} onClick={() => setBet(amount)}>${amount}</button>)}</div>
    <div className="gaming-grid"><section className="gaming-chart-side"><div className="gaming-nameplate"><span>{game?.ticker || "— · — · —"}</span><strong>{game?.pattern.label || "Press start to draw the tape"}</strong></div><div className="gaming-toolbar"><span><i /> Live simulated market</span><div>{["1M", "5M", "15M", "1H"].map((value) => <button type="button" className={timeframe === value ? "active" : ""} key={value} onClick={() => setTimeframe(value)}>{value}</button>)}<button type="button" onClick={() => setFocus(!focus)}>{focus ? "Exit view" : "⌗ View chart"}</button></div></div><div className="gaming-scope"><canvas ref={canvasRef} /></div><div className="gaming-strip"><span>Exchange <b>SIM-X</b></span><span>Last <b>{game ? `$${(100 + game.display[game.display.length - 1].c).toFixed(2)}` : "—"}</b></span><span>Feed <b>REAL-TIME</b></span></div></section>
      <aside className="gaming-controls"><div className="gaming-control-title"><strong>MAKE YOUR CALL</strong><span>Round ready</span></div><div className="gaming-control-row"><div className="gaming-annunciator"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" /><circle className={seconds <= 3 ? "urgent" : ""} style={{ strokeDasharray: 264, strokeDashoffset: 264 - chartProgress }} cx="50" cy="50" r="42" /></svg><b>{seconds}</b></div><div className="gaming-paddles"><button type="button" className="up" disabled={!active} onClick={() => resolve("up")}><span>▲</span>Up</button><button type="button" className="down" disabled={!active} onClick={() => resolve("down")}><span>▼</span>Down</button></div></div><div className="gaming-actions"><button type="button" onClick={start} disabled={active}>{active ? "Round live" : balance <= 0 ? "Refresh to reset" : result ? "Next pattern" : "Start round"}</button><button type="button" onClick={() => setResult({ win: balance >= 1000, title: balance >= 1000 ? "Session closed in the green" : "Session closed in the red", text: `Final balance ${money(balance)} on a $1,000 start.` })}>Cash out</button></div>{result && <div className={`gaming-result ${result.win ? "win" : "lose"}`}><strong>{result.title}</strong>{result.text}</div>}<details className="gaming-guide"><summary>Pattern field guide (6)</summary><div>{PATTERNS.map((pattern) => <article key={pattern.label}><strong>{pattern.label}</strong><span>{pattern.note}</span></article>)}</div></details></aside></div><p className="gaming-fine">Simulated tape - every candle generated fresh in your browser. No real capital at risk.</p>
  </div></section>;
}

export default GamingZone;