import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const SEVERITIES = ["low", "medium", "high", "critical"] as const;

async function callAI(messages: Array<{ role: string; content: string }>, tools?: unknown, tool_choice?: unknown) {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("LOVABLE_API_KEY missing");
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "google/gemini-3-flash-preview", messages, tools, tool_choice }),
  });
  if (!res.ok) {
    if (res.status === 429) throw new Error("Rate limit reached. Try again shortly.");
    if (res.status === 402) throw new Error("AI credits exhausted. Add credits in Workspace settings.");
    const t = await res.text();
    console.error("AI gateway error", res.status, t);
    throw new Error("AI request failed");
  }
  return res.json();
}

function solvePrompt(title: string, category: string, severity: string, description: string) {
  return `You are a senior security and crisis-response advisor.
A user reported this real-life problem. Give ONLY the core solution — no preamble, no headings, no analysis.

Title: ${title}
Category: ${category}
Severity: ${severity}
Description:
${description}

Respond with 3-5 short bullet points (one line each) covering the most important actions to take right now. Keep the entire reply under 80 words. No markdown headers, no sections.`;
}

async function classifyAndSolve(title: string, category: string, description: string) {
  // 1. Classify severity via tool calling
  const classifyJson = await callAI(
    [
      { role: "system", content: "You triage real-life security/safety reports. Pick the correct severity." },
      {
        role: "user",
        content: `Classify the severity of this report.\nTitle: ${title}\nCategory: ${category}\nDescription: ${description}\n\nGuide:\n- low: minor, no immediate harm\n- medium: notable issue, limited risk\n- high: serious risk to safety, money, or data\n- critical: imminent danger, ongoing crime, or major breach`,
      },
    ],
    [
      {
        type: "function",
        function: {
          name: "set_severity",
          description: "Assign severity level",
          parameters: {
            type: "object",
            properties: { severity: { type: "string", enum: [...SEVERITIES] } },
            required: ["severity"],
            additionalProperties: false,
          },
        },
      },
    ],
    { type: "function", function: { name: "set_severity" } },
  );

  let severity = "medium";
  try {
    const args = classifyJson.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    if (args) {
      const parsed = JSON.parse(args);
      if (SEVERITIES.includes(parsed.severity)) severity = parsed.severity;
    }
  } catch (e) {
    console.error("Failed to parse severity", e);
  }

  // 2. Generate solution
  const solveJson = await callAI([
    { role: "system", content: "You are a precise, calm security advisor." },
    { role: "user", content: solvePrompt(title, category, severity, description) },
  ]);
  const solution: string = solveJson.choices?.[0]?.message?.content ?? "No response.";

  return { severity, solution };
}

export const createReportWithAI = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        title: z.string().min(1).max(200),
        description: z.string().min(10).max(4000),
        category: z.string().min(1).max(50),
        severity: z.enum(["auto", ...SEVERITIES]).default("auto"),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const ai = await classifyAndSolve(data.title, data.category, data.description);
    const severity = data.severity === "auto" ? ai.severity : data.severity;
    const solution = ai.solution;

    const { data: row, error } = await context.supabase
      .from("reports")
      .insert({
        user_id: context.userId,
        title: data.title,
        description: data.description,
        category: data.category,
        severity,
        status: "in_progress",
        ai_solution: solution,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);

    return { id: row.id, severity, solution };
  });

export const solveReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ reportId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: roleRow, error: roleErr } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (roleErr || !roleRow) throw new Error("Forbidden: admin only");

    const { data: report, error: reportErr } = await supabaseAdmin
      .from("reports")
      .select("id, title, description, category")
      .eq("id", data.reportId)
      .single();
    if (reportErr || !report) throw new Error("Report not found");

    const { severity, solution } = await classifyAndSolve(report.title, report.category, report.description);

    const { error: updateErr } = await supabaseAdmin
      .from("reports")
      .update({ ai_solution: solution, severity, status: "in_progress" })
      .eq("id", data.reportId);
    if (updateErr) throw new Error(updateErr.message);

    return { solution, severity };
  });
