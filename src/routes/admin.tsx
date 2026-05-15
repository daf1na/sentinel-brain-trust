import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { StatusBadge, SeverityBadge } from "@/components/report-badges";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { solveReport } from "@/lib/ai.functions";

type Report = {
  id: string;
  title: string;
  description: string;
  category: string;
  severity: string;
  status: string;
  ai_solution: string | null;
  created_at: string;
  user_id: string;
};

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const [reports, setReports] = useState<Report[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const solve = useServerFn(solveReport);

  async function load() {
    const { data } = await supabase
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false });
    setReports(data ?? []);
  }

  useEffect(() => {
    if (isAdmin) void load();
  }, [isAdmin]);

  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (!isAdmin) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <main className="mx-auto max-w-2xl px-6 py-24 text-center">
          <h1 className="font-display text-3xl font-semibold">Admin only</h1>
          <p className="mt-3 text-muted-foreground">
            This area is restricted. Ask the admin to grant your account the admin role.
          </p>
          <p className="mt-6 text-xs text-muted-foreground">Your user ID: <code className="rounded bg-muted px-1.5 py-0.5">{user.id}</code></p>
        </main>
      </div>
    );
  }

  async function handleSolve(id: string) {
    setBusyId(id);
    try {
      await solve({ data: { reportId: id } });
      toast.success("AI solution generated");
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusyId(null);
    }
  }

  async function setStatus(id: string, status: string) {
    const { error } = await supabase.from("reports").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    await load();
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold">Admin console</h1>
            <p className="mt-1 text-muted-foreground">All user reports. Use AI to draft a solution.</p>
          </div>
          <div className="text-sm text-muted-foreground">
            {reports?.length ?? 0} report{reports?.length === 1 ? "" : "s"}
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {reports === null && <p className="text-sm text-muted-foreground">Loading…</p>}
          {reports?.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
              No reports yet.
            </div>
          )}
          {reports?.map((r) => (
            <div key={r.id} className="rounded-2xl border border-border bg-gradient-card p-5 shadow-elegant">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg font-semibold">{r.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(r.created_at).toLocaleString()} · {r.category} · user {r.user_id.slice(0, 8)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <SeverityBadge value={r.severity} />
                  <StatusBadge value={r.status} />
                  <Select value={r.status} onValueChange={(v) => setStatus(r.id, v)}>
                    <SelectTrigger className="h-8 w-36 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm text-foreground/90">{r.description}</p>

              <div className="mt-4 flex items-center justify-between gap-3">
                <Button
                  size="sm"
                  variant={r.ai_solution ? "outline" : "default"}
                  className={r.ai_solution ? "" : "bg-gradient-primary shadow-glow"}
                  disabled={busyId === r.id}
                  onClick={() => handleSolve(r.id)}
                >
                  {busyId === r.id ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Thinking…</>
                  ) : r.ai_solution ? (
                    <><Sparkles className="mr-2 h-4 w-4" /> Regenerate AI solution</>
                  ) : (
                    <><Sparkles className="mr-2 h-4 w-4" /> Solve with AI</>
                  )}
                </Button>
                {r.ai_solution && (
                  <span className="flex items-center gap-1.5 text-xs text-success">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Solution ready
                  </span>
                )}
              </div>

              {r.ai_solution && (
                <div className="mt-4 rounded-lg border border-primary/30 bg-primary/5 p-4 text-sm">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary-glow">AI solution</p>
                  <p className="whitespace-pre-wrap text-foreground/90">{r.ai_solution}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
