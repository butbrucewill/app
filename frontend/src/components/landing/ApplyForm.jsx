import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { CheckCircle2, Loader2 } from "lucide-react";
import { API, formatApiErrorDetail, IMAGES } from "@/constants";
import { FadeIn, Eyebrow, RiseHeading } from "./FadeIn";

const EXPERIENCE_OPTIONS = [
  "Just starting out",
  "Less than 1 year",
  "1–3 years",
  "3+ years",
];

const inputCls =
  "w-full rounded-xl border border-white/20 bg-black/50 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-colors duration-200 focus:border-primary focus:ring-1 focus:ring-primary";

export const ApplyForm = () => {
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    city: "",
    dob: "",
    trading_experience: "",
  });
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(null);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!consent) {
      toast.error("Please accept the terms to continue.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/applications`, form);
      setSubmitted(data);
    } catch (err) {
      const msg = formatApiErrorDetail(err.response?.data?.detail);
      if (err.response?.status === 409) {
        toast.info(msg);
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="apply" className="relative scroll-mt-36 overflow-hidden py-20 sm:py-28">
      <div className="absolute inset-0" aria-hidden="true">
        <img
          src={IMAGES.challenges}
          alt=""
          className="h-full w-full scale-110 object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(10,10,10,0.5),#0A0A0A_78%)]" />
      </div>
      <div className="relative z-10 mx-auto max-w-2xl px-4 sm:px-6">
        <FadeIn className="text-center">
          <Eyebrow>Applications Open</Eyebrow>
        </FadeIn>
        <RiseHeading
          center
          className="mt-6 font-display text-4xl uppercase leading-[0.95] tracking-tight text-white sm:text-6xl"
          lines={[{ text: "Think You're A" }, { text: "Khiladi?", accent: true }]}
        />
        <FadeIn delay={0.15} className="text-center">
          <p className="mt-5 text-base leading-relaxed text-white/60 md:text-lg">
            Fill this in. If you make the shortlist, our team calls you for the next
            steps. Only 40 seats exist.
          </p>
        </FadeIn>

        <FadeIn delay={0.15}>
          {submitted ? (
            <div className="glass mt-10 rounded-3xl border-primary/40 p-10 text-center" data-testid="apply-success">
              <CheckCircle2 className="mx-auto h-14 w-14 text-primary" strokeWidth={1.5} />
              <h3 className="mt-6 font-display text-2xl font-bold uppercase tracking-tight text-white">
                Application received
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                You're in the pile, {submitted.name || "Khiladi"}. Our team reviews
                every application and reaches out on your phone and email if you're
                shortlisted. Keep an eye on your inbox.
              </p>
              <p className="mt-5 text-xs uppercase tracking-widest text-white/40">
                Application ID: <span className="text-white/70">{submitted.id}</span>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="glass mt-10 space-y-5 rounded-3xl p-6 sm:p-10" data-testid="apply-form">
              <div>
                <label htmlFor="apply-name" className="mb-2 block text-xs font-bold uppercase tracking-widest text-white/60">Full Name</label>
                <input id="apply-name" data-testid="apply-name-input" required minLength={2} className={inputCls} placeholder="Your full name" value={form.full_name} onChange={set("full_name")} />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="apply-phone" className="mb-2 block text-xs font-bold uppercase tracking-widest text-white/60">Phone</label>
                  <input id="apply-phone" data-testid="apply-phone-input" required minLength={8} className={inputCls} placeholder="+91 ..." value={form.phone} onChange={set("phone")} />
                </div>
                <div>
                  <label htmlFor="apply-email" className="mb-2 block text-xs font-bold uppercase tracking-widest text-white/60">Email</label>
                  <input id="apply-email" data-testid="apply-email-input" required type="email" className={inputCls} placeholder="you@email.com" value={form.email} onChange={set("email")} />
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="apply-city" className="mb-2 block text-xs font-bold uppercase tracking-widest text-white/60">City</label>
                  <input id="apply-city" data-testid="apply-city-input" required minLength={2} className={inputCls} placeholder="Your city" value={form.city} onChange={set("city")} />
                </div>
                <div>
                  <label htmlFor="apply-dob" className="mb-2 block text-xs font-bold uppercase tracking-widest text-white/60">Date of Birth</label>
                  <input id="apply-dob" data-testid="apply-dob-input" required type="date" max="2008-12-31" className={`${inputCls} [color-scheme:dark]`} value={form.dob} onChange={set("dob")} />
                </div>
              </div>
              <div>
                <label htmlFor="apply-experience" className="mb-2 block text-xs font-bold uppercase tracking-widest text-white/60">Trading Experience</label>
                <select id="apply-experience" data-testid="apply-experience-select" required className={inputCls} value={form.trading_experience} onChange={set("trading_experience")}>
                  <option value="" disabled>Select your experience</option>
                  {EXPERIENCE_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>

              <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-white/50">
                <input
                  type="checkbox"
                  data-testid="apply-consent-checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[#FF3333]"
                />
                <span>
                  I agree to the <a href="/legal/terms" className="text-primary underline">Terms & Conditions</a> and
                  understand that all trading in the show is simulated (paper trading)
                  with virtual capital, and no outcomes are guaranteed.
                </span>
              </label>

              <button
                type="submit"
                data-testid="apply-submit-btn"
                disabled={loading}
                className="btn-gradient glow-red flex w-full items-center justify-center gap-2 rounded-full px-8 py-4 font-display text-sm uppercase tracking-widest text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_60px_-10px_#FF3333] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          )}
        </FadeIn>
      </div>
    </section>
  );
};
