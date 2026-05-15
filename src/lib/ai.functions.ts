import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const solveReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ reportId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    // Verify caller is admin
    const { data: roleRow, error: roleErr } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (roleErr || !roleRow) throw new Error("Forbidden: admin only");

    const { data: report, error: reportErr } = await supabaseAdmin
      .from("reports")
      .select("id, title, description, category, severity")
      .eq("id", data.reportId)
      .single();
    if (reportErr || !report) throw new Error("Report not found");

    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY missing");

    const prompt = `You are a senior security and crisis-response advisor.
A user has reported the following real-life problem. Produce a concise, actionable plan to address it.

Title: ${report.title}
Category: ${report.category}
Severity: ${report.severity}
Description:
${report.description}

Respond in markdown with these sections:
1. **Immediate actions** (next 1 hour)
2. **Short-term plan** (next 24-72 hours)
3. **Root-cause analysis**
4. **Risks & escalation triggers**
Keep it practical and specific.`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are a precise, calm security advisor." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!res.ok) {
      if (res.status === 429) throw new Error("Rate limit reached. Try again shortly.");
      if (res.status === 402) throw new Error("AI credits exhausted. Add credits in Workspace settings.");
      const t = await res.text();
      console.error("AI gateway error", res.status, t);
      throw new Error("AI request failed");
    }

    const json = await res.json();
    const solution: string = json.choices?.[0]?.message?.content ?? "No response.";

    const { error: updateErr } = await supabaseAdmin
      .from("reports")
      .update({ ai_solution: solution, status: "in_progress" })
      .eq("id", data.reportId);
    if (updateErr) throw new Error(updateErr.message);

    return { solution };
  });
