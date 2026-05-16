import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Shield,
  Lock,
  Sparkles,
  ArrowRight,
  Eye,
  Brain,
  Zap,
  FileText,
  CheckCircle2,
  Users,
  Clock,
  AlertTriangle,
  ShieldCheck,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "SecureMind — Private AI incident reporting" },
      {
        name: "description",
        content:
          "Submit security and safety reports privately. AI-assisted triage, severity scoring, and recommended solutions — visible only to you and the admin.",
      },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-6">
        {/* Hero */}
        <section className="relative pt-24 pb-32 text-center">
          <div className="animate-fade-up mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur" style={{ animationDelay: "0ms" }}>
            <Sparkles className="h-3.5 w-3.5 text-primary-glow animate-float" />
            AI-assisted incident response
          </div>
          <h1 className="animate-fade-up mt-6 font-display text-5xl font-semibold leading-tight md:text-7xl" style={{ animationDelay: "100ms" }}>
            Report any problem.
            <br />
            <span className="text-gradient animate-gradient-shift bg-gradient-primary bg-clip-text">Only the admin sees it.</span>
          </h1>
          <p className="animate-fade-up mx-auto mt-6 max-w-2xl text-lg text-muted-foreground" style={{ animationDelay: "200ms" }}>
            SecureMind is a private channel for real-life security and safety issues. You
            describe what happened — our AI triages it instantly and drafts a clear
            solution for the admin.
          </p>
          <div className="animate-fade-up mt-10 flex flex-wrap justify-center gap-3" style={{ animationDelay: "300ms" }}>
            <Button size="lg" asChild className="bg-gradient-primary shadow-glow animate-glow-pulse transition-transform hover:scale-105">
              <Link to="/signup">
                Submit a report <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="transition-transform hover:scale-105">
              <Link to="/login">I already have an account</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { value: "<10s", label: "AI triage time" },
              { value: "100%", label: "Private to admin" },
              { value: "4", label: "Severity levels" },
              { value: "24/7", label: "Available" },
            ].map((s, i) => (
              <div
                key={s.label}
                className="animate-fade-up hover-lift rounded-xl border border-border bg-card/40 p-4 backdrop-blur"
                style={{ animationDelay: `${400 + i * 80}ms` }}
              >
                <div className="font-display text-2xl font-semibold text-gradient">{s.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="grid gap-6 pb-24 md:grid-cols-3">
          {[
            {
              icon: Lock,
              title: "End-to-end private",
              body: "Reports are visible only to you and the admin. Row-level security enforced at the database.",
            },
            {
              icon: Brain,
              title: "AI-powered solutions",
              body: "Each report comes with an instant severity score and a short, actionable solution from AI.",
            },
            {
              icon: Eye,
              title: "Track every report",
              body: "Watch your reports move from open to in-progress to resolved with a clear audit trail.",
            },
            {
              icon: Zap,
              title: "Auto-severity",
              body: "Pick a category like cybersecurity or physical safety and the AI assigns the right severity.",
            },
            {
              icon: FileText,
              title: "Save & manage",
              body: "Save reports for later, regenerate AI solutions, or delete them anytime from your dashboard.",
            },
            {
              icon: ShieldCheck,
              title: "Admin oversight",
              body: "A dedicated admin view triages every incoming report and updates status in one place.",
            },
          ].map((f, i) => (
            <div
              key={f.title}
              className="animate-fade-up hover-lift rounded-2xl border border-border bg-gradient-card p-6 shadow-elegant hover:border-primary/40"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="mb-4 grid h-10 w-10 place-items-center rounded-lg bg-primary/15 text-primary-glow transition-transform duration-300 group-hover:scale-110">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </section>

        {/* How it works */}
        <section className="pb-24">
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl font-semibold md:text-4xl">How it works</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              From incident to resolution in three steps.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                step: "01",
                icon: FileText,
                title: "Describe the issue",
                body: "Write what happened and choose a category. No technical jargon required.",
              },
              {
                step: "02",
                icon: Brain,
                title: "AI triages instantly",
                body: "Severity and a short solution are generated automatically when the report is saved.",
              },
              {
                step: "03",
                icon: CheckCircle2,
                title: "Admin resolves",
                body: "The admin reviews, updates status, and closes the loop — you stay informed.",
              },
            ].map((s, i) => (
              <div
                key={s.step}
                className="animate-fade-up hover-lift relative rounded-2xl border border-border bg-gradient-card p-6 shadow-elegant"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <div className="absolute right-4 top-4 font-mono text-xs text-muted-foreground">
                  {s.step}
                </div>
                <s.icon className="h-6 w-6 text-primary-glow" />
                <h3 className="mt-4 font-display text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Use cases */}
        <section className="pb-24">
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl font-semibold md:text-4xl">What you can report</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              SecureMind handles anything that needs a private, tracked response.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Lock, title: "Cybersecurity", body: "Phishing, suspicious logins, data leaks." },
              { icon: AlertTriangle, title: "Physical safety", body: "Hazards, injuries, unsafe conditions." },
              { icon: Users, title: "Harassment", body: "Workplace or community concerns." },
              { icon: Globe, title: "Other", body: "Anything else that needs attention." },
            ].map((u) => (
              <div key={u.title} className="rounded-xl border border-border bg-card/40 p-5">
                <u.icon className="h-5 w-5 text-primary-glow" />
                <div className="mt-3 font-display font-semibold">{u.title}</div>
                <p className="mt-1 text-sm text-muted-foreground">{u.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="pb-24">
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl font-semibold md:text-4xl">Frequently asked</h2>
          </div>
          <div className="mx-auto grid max-w-3xl gap-4">
            {[
              {
                q: "Who can see my reports?",
                a: "Only you and the admin. Row-level security at the database makes other users physically unable to read them.",
              },
              {
                q: "How does the AI decide severity?",
                a: "Based on the category you choose and the description you write — it picks low, medium, high, or critical.",
              },
              {
                q: "Can I edit or delete a report?",
                a: "Yes. You can save reports to your dashboard and delete them anytime.",
              },
              {
                q: "Is it free?",
                a: "Yes — SecureMind is free to use for individuals and small teams.",
              },
            ].map((f) => (
              <div key={f.q} className="rounded-xl border border-border bg-card/40 p-5">
                <div className="font-display font-semibold">{f.q}</div>
                <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mb-24 overflow-hidden rounded-3xl border border-border bg-gradient-card p-10 text-center shadow-elegant">
          <Shield className="mx-auto h-10 w-10 text-primary-glow" />
          <h2 className="mt-4 font-display text-3xl font-semibold">Have a problem to report?</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Create an account and submit your first report in under a minute.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button size="lg" asChild className="bg-gradient-primary shadow-glow">
              <Link to="/signup">Create an account</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/login">
                <Clock className="mr-2 h-4 w-4" /> Sign in
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} SecureMind — Private incident reporting
      </footer>
    </div>
  );
}
