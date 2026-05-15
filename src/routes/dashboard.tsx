import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FileText, Plus, Download, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { StatusBadge, SeverityBadge } from "@/components/report-badges";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Report = {
  id: string;
  title: string;
  description: string;
  category: string;
  severity: string;
  status: string;
  ai_solution: string | null;
  created_at: string;
};

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const { user, loading } = useAuth();
  const [reports, setReports] = useState<Report[] | null>(null);

  useEffect(() => {
    if (!user) return;
    void supabase
      .from("reports")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setReports(data ?? []));
  }, [user]);

  if (loading) return null;
  if (!user) return <Navigate to="/login" />;

  function saveReport(r: Report) {
    const text = `SecureMind Report
=================

Title:       ${r.title}
Category:    ${r.category}
Severity:    ${r.severity}
Status:      ${r.status}
Submitted:   ${new Date(r.created_at).toLocaleString()}

Description
-----------
${r.description}

${r.ai_solution ? `AI Solution\n-----------\n${r.ai_solution}\n` : ""}`;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report-${r.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40) || "untitled"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Report saved to your device");
  }

  async function deleteReport(id: string) {
    const { error } = await supabase.from("reports").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setReports((prev) => prev?.filter((r) => r.id !== id) ?? null);
    toast.success("Report deleted");
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold">My reports</h1>
            <p className="mt-1 text-muted-foreground">Track the status of everything you've submitted.</p>
          </div>
          <Button asChild className="bg-gradient-primary shadow-glow">
            <Link to="/report"><Plus className="mr-2 h-4 w-4" />New report</Link>
          </Button>
        </div>

        <div className="mt-8 space-y-4">
          {reports === null && <p className="text-sm text-muted-foreground">Loading…</p>}
          {reports?.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
              <FileText className="mx-auto mb-3 h-8 w-8" />
              You haven't submitted any reports yet.
            </div>
          )}
          {reports?.map((r) => (
            <div key={r.id} className="rounded-2xl border border-border bg-gradient-card p-5 shadow-elegant">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg font-semibold">{r.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(r.created_at).toLocaleString()} · {r.category}
                  </p>
                </div>
                <div className="flex gap-2">
                  <SeverityBadge value={r.severity} />
                  <StatusBadge value={r.status} />
                </div>
              </div>
              <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{r.description}</p>
              {r.ai_solution && (
                <div className="mt-4 rounded-lg border border-primary/30 bg-primary/5 p-4 text-sm">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary-glow">AI solution</p>
                  <p className="whitespace-pre-wrap text-foreground/90">{r.ai_solution}</p>
                </div>
              )}
              <div className="mt-4 flex justify-end gap-2">
                <Button size="sm" variant="outline" onClick={() => saveReport(r)}>
                  <Download className="mr-2 h-4 w-4" /> Save
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this report?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This permanently removes "{r.title}" and its AI solution. This cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteReport(r.id)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
