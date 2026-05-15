import { Link, useNavigate } from "@tanstack/react-router";
import { Shield, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export function SiteHeader() {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-primary shadow-glow">
            <Shield className="h-4 w-4 text-primary-foreground" />
          </span>
          SecureMind
        </Link>

        <nav className="hidden items-center gap-1 text-sm md:flex">
          <Link to="/" className="rounded-md px-3 py-2 text-muted-foreground transition hover:text-foreground" activeOptions={{ exact: true }} activeProps={{ className: "text-foreground" }}>Home</Link>
          {user && (
            <>
              <Link to="/report" className="rounded-md px-3 py-2 text-muted-foreground transition hover:text-foreground" activeProps={{ className: "text-foreground" }}>Report</Link>
              <Link to="/dashboard" className="rounded-md px-3 py-2 text-muted-foreground transition hover:text-foreground" activeProps={{ className: "text-foreground" }}>My Reports</Link>
            </>
          )}
          {isAdmin && (
            <Link to="/admin" className="rounded-md px-3 py-2 text-muted-foreground transition hover:text-foreground" activeProps={{ className: "text-foreground" }}>Admin</Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Sign in</Link>
              </Button>
              <Button size="sm" asChild className="bg-gradient-primary shadow-glow">
                <Link to="/signup">Get started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
