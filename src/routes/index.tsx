import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield, Lock, Sparkles, ArrowRight, Eye, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-6">
        {/* Hero */}
        <section className="relative pt-24 pb-32 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-primary-glow" />
            AI-assisted incident response
          </div>
          <h1 className="mt-6 font-display text-5xl font-semibold leading-tight md:text-7xl">
            Report any problem.
            <br />
            <span className="text-gradient">Only the admin sees it.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            SecureMind is a private channel for real-life security and safety issues. You
            describe what happened — our admin uses AI to triage it and draft a solution
            in seconds.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button size="lg" asChild className="bg-gradient-primary shadow-glow">
              <Link to="/signup">
                Submit a report <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/login">I already have an account</Link>
            </Button>
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
              body: "The admin asks an AI advisor for an immediate plan, short-term steps, and root-cause analysis.",
            },
            {
              icon: Eye,
              title: "Track every report",
              body: "Watch your reports move from open to in-progress to resolved with a clear audit trail.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-border bg-gradient-card p-6 shadow-elegant transition hover:border-primary/40"
            >
              <div className="mb-4 grid h-10 w-10 place-items-center rounded-lg bg-primary/15 text-primary-glow">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </section>

        {/* CTA */}
        <section className="mb-24 overflow-hidden rounded-3xl border border-border bg-gradient-card p-10 text-center shadow-elegant">
          <Shield className="mx-auto h-10 w-10 text-primary-glow" />
          <h2 className="mt-4 font-display text-3xl font-semibold">Have a problem to report?</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Create an account and submit your first report in under a minute.
          </p>
          <Button size="lg" asChild className="mt-6 bg-gradient-primary shadow-glow">
            <Link to="/signup">Create an account</Link>
          </Button>
        </section>
      </main>

      <footer className="border-t border-border/60 py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} SecureMind
      </footer>
    </div>
  );
}
