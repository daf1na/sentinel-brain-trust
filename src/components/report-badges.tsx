import { Badge } from "@/components/ui/badge";

export function StatusBadge({ value }: { value: string }) {
  const map: Record<string, string> = {
    open: "bg-warning/15 text-warning border-warning/30",
    in_progress: "bg-primary/15 text-primary-glow border-primary/30",
    resolved: "bg-success/15 text-success border-success/30",
    closed: "bg-muted text-muted-foreground border-border",
  };
  return (
    <Badge variant="outline" className={`capitalize ${map[value] ?? ""}`}>
      {value.replace("_", " ")}
    </Badge>
  );
}

export function SeverityBadge({ value }: { value: string }) {
  const map: Record<string, string> = {
    low: "bg-muted text-muted-foreground border-border",
    medium: "bg-primary/10 text-primary-glow border-primary/30",
    high: "bg-warning/15 text-warning border-warning/30",
    critical: "bg-destructive/15 text-destructive border-destructive/40",
  };
  return (
    <Badge variant="outline" className={`capitalize ${map[value] ?? ""}`}>
      {value}
    </Badge>
  );
}
