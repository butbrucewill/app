import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Download, Flame, Loader2, LogOut, RefreshCw, Search, Users } from "lucide-react";
import { API, formatApiErrorDetail } from "@/constants";
import BlogAdminPannel from "@/components/blog/BlogAdminPannel";


const inputCls =
  "w-full border border-white/20 bg-black/50 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-colors duration-200 focus:border-primary focus:ring-1 focus:ring-primary";

const TOKEN_KEY = "tkk_admin_token";

const authHeaders = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const tabCls = (active) =>
  `rounded-full px-5 py-2 text-xs font-bold uppercase tracking-widest transition-colors duration-200 ${
    active ? "bg-primary text-white" : "border border-white/20 text-white/60 hover:text-white"
  }`;

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [data, setData] = useState({ applications: [], total: 0 });
  const [search, setSearch] = useState("");
  const [loadingApps, setLoadingApps] = useState(false);
  const [exporting, setExporting] = useState(false);

  const [tab, setTab] = useState("apps"); // "apps" | "games" | "blogs"
  const [scores, setScores] = useState([]);
  const [loadingScores, setLoadingScores] = useState(false);

  useEffect(() => {
    axios
      .get(`${API}/auth/me`, { headers: authHeaders() })
      .then((res) => setUser(res.data))
      .catch(() => setUser(false));
  }, []);

  const fetchApplications = useCallback(async (q = "") => {
    setLoadingApps(true);
    try {
      const { data } = await axios.get(`${API}/admin/applications`, {
        params: { search: q },
        headers: authHeaders(),
      });
      setData(data);
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail));
    } finally {
      setLoadingApps(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchApplications();
  }, [user, fetchApplications]);

  const fetchScores = useCallback(async () => {
    setLoadingScores(true);
    try {
      const { data } = await axios.get(`${API}/admin/game-scores`, { headers: authHeaders() });
      setScores(data.scores || []);
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail));
    } finally {
      setLoadingScores(false);
    }
  }, []);

  useEffect(() => {
    if (user && tab === "games") fetchScores();
  }, [user, tab, fetchScores]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError("");
    try {
      const { data } = await axios.post(`${API}/auth/login`, { email, password });
      localStorage.setItem(TOKEN_KEY, data.token);
      setUser(data);
    } catch (err) {
      setLoginError(formatApiErrorDetail(err.response?.data?.detail));
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await axios.post(`${API}/auth/logout`, {}, { headers: authHeaders() }).catch(() => {});
    localStorage.removeItem(TOKEN_KEY);
    setUser(false);
    setData({ applications: [], total: 0 });
    setTab("apps");
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await axios.get(`${API}/admin/applications/export`, {
        headers: authHeaders(),
        responseType: "blob",
      });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = "tkk_applications.csv";
      a.click();
      URL.revokeObjectURL(url);
      toast.success("CSV exported");
    } catch (err) {
      toast.error("Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  if (user === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" data-testid="admin-loading" />
      </div>
    );
  }

  if (user === false) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A] px-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm border border-white/10 bg-card p-8" data-testid="admin-login-form">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center bg-primary">
              <Flame className="h-5 w-5 text-white" strokeWidth={2.5} />
            </span>
            <span className="font-display text-sm font-bold uppercase tracking-widest text-white">
              Organizer <span className="text-primary">Admin</span>
            </span>
          </div>
          <div className="mt-8 space-y-4">
            <input
              type="email"
              required
              data-testid="admin-email-input"
              className={inputCls}
              placeholder="Admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              required
              data-testid="admin-password-input"
              className={inputCls}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {loginError && (
              <p className="text-xs text-primary" data-testid="admin-login-error">{loginError}</p>
            )}
            <button
              type="submit"
              data-testid="admin-login-btn"
              disabled={loggingIn}
              className="flex w-full items-center justify-center gap-2 bg-primary px-6 py-3 font-display text-sm font-bold uppercase tracking-widest text-white transition-colors duration-200 hover:bg-primary/90 disabled:opacity-60"
            >
              {loggingIn && <Loader2 className="h-4 w-4 animate-spin" />}
              Sign In
            </button>
          </div>
          <a href="/" data-testid="admin-back-home-link" className="mt-6 block text-center text-xs text-white/40 hover:text-white">
            ← Back to site
          </a>
        </form>
      </div>
    );
  }

  // Logged in: token for components that take it as a prop (e.g. BlogAdminPannel)
  const token = localStorage.getItem(TOKEN_KEY) || "";

  return (
    <div className="min-h-screen bg-[#0A0A0A]" data-testid="admin-dashboard">
      <header className="border-b border-white/10 bg-black/60 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center bg-primary">
              <Flame className="h-5 w-5 text-white" strokeWidth={2.5} />
            </span>
            <span className="font-display text-sm font-bold uppercase tracking-widest text-white">
              TKK <span className="text-primary">Admin</span>
            </span>
          </div>
          <button
            onClick={handleLogout}
            data-testid="admin-logout-btn"
            className="flex items-center gap-2 border border-white/20 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white/70 transition-colors duration-200 hover:border-white/50 hover:text-white"
          >
            <LogOut className="h-3.5 w-3.5" /> Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {tab !== "blogs" && (
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold uppercase tracking-tight text-white">Applications</h1>
              <p className="mt-1 flex items-center gap-2 text-sm text-white/50">
                <Users className="h-4 w-4 text-primary" />
                <span data-testid="admin-total-count">{data.total} total applications</span>
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <input
                  data-testid="admin-search-input"
                  className={`${inputCls} pl-10`}
                  placeholder="Search name, email, phone, city"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && fetchApplications(search)}
                />
              </div>
              <button
                onClick={() => fetchApplications(search)}
                data-testid="admin-search-btn"
                className="flex items-center justify-center gap-2 border border-white/20 px-5 py-3 text-xs font-bold uppercase tracking-widest text-white/70 transition-colors duration-200 hover:border-white/50 hover:text-white"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loadingApps ? "animate-spin" : ""}`} /> Search
              </button>
              <button
                onClick={handleExport}
                data-testid="admin-export-btn"
                disabled={exporting}
                className="flex items-center justify-center gap-2 bg-primary px-5 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors duration-200 hover:bg-primary/90 disabled:opacity-60"
              >
                {exporting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                Export CSV
              </button>
            </div>
          </div>
        )}

        {/* ---- Tabs ---- */}
        <div className={`flex gap-3 ${tab === "blogs" ? "" : "mt-8"}`}>
          <button
            data-testid="admin-tab-applications"
            onClick={() => setTab("apps")}
            className={tabCls(tab === "apps")}
          >
            Applications
          </button>
          <button
            data-testid="admin-tab-games"
            onClick={() => setTab("games")}
            className={tabCls(tab === "games")}
          >
            Game Scores
          </button>
          <button
            data-testid="admin-tab-blogs"
            onClick={() => setTab("blogs")}
            className={tabCls(tab === "blogs")}
          >
            Blogs
          </button>
        </div>

        {/* ---- Tab content ---- */}
        {tab === "blogs" ? (
          <div className="mt-6" data-testid="admin-blogs-panel">
            <BlogAdminPannel token={token} />
          </div>
        ) : tab === "games" ? (
          <div className="mt-4 overflow-x-auto border border-white/10" data-testid="admin-games-table">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.03] text-xs uppercase tracking-widest text-white/50">
                  <th className="px-4 py-3">Player</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Rounds</th>
                  <th className="px-4 py-3">Wins</th>
                  <th className="px-4 py-3">Best Streak</th>
                  <th className="px-4 py-3">Balance</th>
                  <th className="px-4 py-3">Last Played</th>
                </tr>
              </thead>
              <tbody>
                {scores.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-white/40" data-testid="admin-games-empty">
                      {loadingScores ? "Loading..." : "No games played yet."}
                    </td>
                  </tr>
                )}
                {scores.map((s) => (
                  <tr key={s.player_key} className="border-b border-white/5 text-white/80 transition-colors duration-150 hover:bg-white/[0.03]" data-testid={`game-row-${s.player_key}`}>
                    <td className="px-4 py-3 font-semibold text-white">{s.player_name}</td>
                    <td className="px-4 py-3">{s.player_email || "—"}</td>
                    <td className="px-4 py-3">{s.rounds}</td>
                    <td className="px-4 py-3 text-bull">{s.wins}</td>
                    <td className="px-4 py-3">{s.best_streak}</td>
                    <td className="px-4 py-3">${Number(s.balance).toLocaleString()}</td>
                    <td className="px-4 py-3 text-white/50">
                      {s.updated_at ? new Date(s.updated_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto border border-white/10" data-testid="admin-applications-table">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.03] text-xs uppercase tracking-widest text-white/50">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">City</th>
                  <th className="px-4 py-3">DOB</th>
                  <th className="px-4 py-3">Experience</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Applied</th>
                </tr>
              </thead>
              <tbody>
                {data.applications.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-white/40" data-testid="admin-empty-state">
                      {loadingApps ? "Loading..." : "No applications yet."}
                    </td>
                  </tr>
                )}
                {data.applications.map((a) => (
                  <tr key={a.id} className="border-b border-white/5 text-white/80 transition-colors duration-150 hover:bg-white/[0.03]" data-testid={`admin-row-${a.id}`}>
                    <td className="px-4 py-3 font-semibold text-white">{a.full_name}</td>
                    <td className="px-4 py-3">{a.phone}</td>
                    <td className="px-4 py-3">{a.email}</td>
                    <td className="px-4 py-3">{a.city}</td>
                    <td className="px-4 py-3">{a.dob}</td>
                    <td className="px-4 py-3">{a.trading_experience}</td>
                    <td className="px-4 py-3">
                      <span className="bg-primary/15 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                        {a.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/50">
                      {a.created_at ? new Date(a.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}