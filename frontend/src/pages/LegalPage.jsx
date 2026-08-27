import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { IMAGES } from "@/constants";

const CONTENT = {
  terms: {
    title: "Terms & Conditions",
    updated: "Last updated: August 2026",
    sections: [
      {
        h: "1. The Event",
        p: "Trading Ke Khiladi is a 6-day entertainment event held at a villa resort in Thailand for 40 selected participants, divided into 4 teams of 10. All trading activity during the event is simulated (paper trading) using virtual capital. No real-money trading takes place at any point during the event.",
      },
      {
        h: "2. Applications & Selection",
        p: "Submitting an application does not guarantee selection. The organizer team reviews every application and contacts shortlisted candidates directly. Selection decisions are final and at the sole discretion of the organizers.",
      },
      {
        h: "3. Registration Fee",
        p: "Selected participants confirm their seat by paying the registration fee of ₹3,00,000, which covers the 6-day villa stay, meals, and the event experience. Payment instructions are shared only with selected participants by the organizer team. We never ask for payment details over unsolicited calls, emails, or messages.",
      },
      {
        h: "4. Prizes",
        p: "The winners of the event take home the ₹30,00,000 prize pool. All scoring is based on simulated trading performance across the week's games and challenges, and the award is subject to the official event rules shared with selected participants, and to applicable laws including deduction of taxes where required.",
      },
      {
        h: "5. Eligibility & Conduct",
        p: "Applicants must be 18 years or older. Participants are expected to follow the event code of conduct at the venue. The organizers may remove any participant for misconduct, in which case no refund is owed.",
      },
      {
        h: "6. Media",
        p: "The event is filmed. By participating, selected participants consent to being recorded and to the use of event footage for promotional purposes, as detailed in the participation agreement signed before the event.",
      },
      {
        h: "7. Changes & Cancellation",
        p: "The organizers may modify the schedule, venue, games, or format where necessary. If the event is cancelled by the organizers, registration fees paid will be refunded as per the Refund & Cancellation Policy.",
      },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    updated: "Last updated: August 2026",
    sections: [
      {
        h: "1. What We Collect",
        p: "When you apply, we collect your full name, phone number, email address, city, date of birth, and self-declared trading experience. We do not collect payment details, identity documents, or financial information through this website.",
      },
      {
        h: "2. How We Use It",
        p: "Your application details are used solely to review your application, shortlist candidates, and contact you about the event. We may also use your contact details to share important event-related updates.",
      },
      {
        h: "3. Who Sees It",
        p: "Application data is accessible only to the Trading Ke Khiladi organizer team. We do not sell, rent, or share your personal data with third-party advertisers.",
      },
      {
        h: "4. Storage & Security",
        p: "Applications are stored in a secured database with access restricted to authorized organizers. We retain application data for the duration of the event cycle and delete it afterwards unless you are selected and further records are required.",
      },
      {
        h: "5. Your Rights",
        p: "You may request a copy, correction, or deletion of your application data at any time by contacting the organizer team through the official channels listed on our social media.",
      },
    ],
  },
  risk: {
    title: "Risk Disclosure",
    updated: "Last updated: August 2026",
    sections: [
      {
        h: "1. Simulated Trading Only",
        p: "All trading activity in Trading Ke Khiladi is simulated (paper trading) conducted with virtual capital on a simulated environment. No participant trades real money during the event, and no real brokerage accounts are used.",
      },
      {
        h: "2. No Guaranteed Outcomes",
        p: "Nothing on this website or in the event constitutes financial advice, investment advice, or a promise of returns. Prizes are awarded based on performance in simulated games and challenges, subject to the official event rules. Past or simulated performance does not indicate future real-market results.",
      },
      {
        h: "3. Real-Market Risk",
        p: "Trading in real financial markets involves substantial risk of loss and is not suitable for every investor. Leverage can amplify losses. Skills demonstrated in a simulated environment may not translate to real-market outcomes, where costs, slippage, liquidity, and psychology differ significantly.",
      },
      {
        h: "4. Independent Advice",
        p: "If you choose to trade real markets independently of this event, consider seeking advice from a SEBI-registered investment adviser and never trade with money you cannot afford to lose.",
      },
    ],
  },
  refund: {
    title: "Refund & Cancellation Policy",
    updated: "Last updated: August 2026 — subject to final event terms",
    sections: [
      {
        h: "1. Applications",
        p: "Submitting an application is free. No payment is collected at the application stage, so no refund applies to applications.",
      },
      {
        h: "2. Cancellation by Organizers",
        p: "If the event is cancelled by the organizers, selected participants will receive a full refund of the registration fee paid, within 30 working days of the cancellation announcement.",
      },
      {
        h: "3. Cancellation by Participants",
        p: "If a selected participant cancels after paying the registration fee, the refund amount depends on how far in advance the cancellation is made. The detailed refund schedule will be shared in the participation agreement provided to selected participants before payment.",
      },
      {
        h: "4. Removal for Misconduct",
        p: "Participants removed from the event for violating the code of conduct are not eligible for any refund.",
      },
      {
        h: "5. How to Request",
        p: "Refund requests must be sent to the organizer team through the official contact channels shared with selected participants. Refunds are processed to the original payment method.",
      },
    ],
  },
};

export default function LegalPage() {
  const { slug } = useParams();
  const doc = CONTENT[slug];

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <header className="border-b border-white/10 bg-black/60 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
          <Link to="/" data-testid="legal-logo" className="flex items-center">
            <img src={IMAGES.logo} alt="Trading Ke Khiladi" className="h-8 w-auto" />
          </Link>
          <Link
            to="/"
            data-testid="legal-back-link"
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back to site
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6" data-testid={`legal-${slug}`}>
        {!doc ? (
          <h1 className="font-display text-3xl font-bold uppercase text-white">Page not found</h1>
        ) : (
          <>
            <h1 className="font-display text-4xl font-bold uppercase tracking-tight text-white sm:text-5xl">
              {doc.title}
            </h1>
            <p className="mt-3 text-xs uppercase tracking-widest text-white/40">{doc.updated}</p>
            <div className="mt-10 space-y-8">
              {doc.sections.map((s) => (
                <div key={s.h}>
                  <h2 className="font-display text-lg font-bold uppercase tracking-tight text-primary">{s.h}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-white/70 md:text-base">{s.p}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
