import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createReportWithAI } from "@/lib/ai.functions";

export const Route = createFileRoute("/report")({
  component: ReportPage,
});

function ReportPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");
  const [severity, setSeverity] = useState<"auto" | "low" | "medium" | "high" | "critical">("auto");
  const [submitting, setSubmitting] = useState(false);
  const create = useServerFn(createReportWithAI);

  if (loading) return null;
  if (!user) return <Navigate to="/login" />;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    try {
      const res = await create({
        data: { title: title.trim(), description: description.trim(), category, severity },
      });
      toast.success(
        severity === "auto" ? `Report submitted. AI severity: ${res.severity}` : "Report submitted.",
      );
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="font-display text-3xl font-semibold">Submit a report</h1>
        <p className="mt-2 text-muted-foreground">
          Only you and the admin will see this. AI will automatically assess severity and draft a solution.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5 rounded-2xl border border-border bg-gradient-card p-6 shadow-elegant">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" required maxLength={120} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Short summary" />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="physical">Physical security</SelectItem>
                <SelectItem value="cyber">Cybersecurity</SelectItem>
                <SelectItem value="harassment">Harassment</SelectItem>
                <SelectItem value="fraud">Fraud / scam</SelectItem>
                <SelectItem value="medical">Medical / safety</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">What happened?</Label>
            <Textarea id="description" required minLength={10} maxLength={4000} rows={8} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the situation, when it happened, who's involved, and what you've already tried." />
          </div>

          <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-xs text-muted-foreground flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-primary-glow mt-0.5 shrink-0" />
            <span>AI will analyze your report, set the severity (low → critical), and draft an action plan automatically.</span>
          </div>

          <Button type="submit" disabled={submitting} className="w-full bg-gradient-primary shadow-glow">
            {submitting ? "Analyzing with AI…" : "Submit report"}
          </Button>
        </form>
      </main>
    </div>
  );
}
