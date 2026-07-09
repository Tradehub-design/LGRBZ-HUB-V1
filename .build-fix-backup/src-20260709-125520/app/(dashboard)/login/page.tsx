"use client";

import { Lock } from "lucide-react";
import { useState } from "react";
import { supabase, supabaseEnabled } from "@/lib/supabase/client";
import { PremiumStatCard } from "@/components/workspace/premium-stat-card";
import {
  Workspace,
  WorkspaceGrid,
  WorkspaceHeader,
  WorkspaceLink,
  WorkspacePanel,
} from "@/components/workspace";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  async function sendMagicLink() {
    if (!supabase) {
      setStatus("Supabase is not configured yet.");
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin + "/dashboard",
      },
    });

    setStatus(error ? error.message : "Magic link sent. Check your email.");
  }

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="v2.0 Platform"
        title="Login"
        description="Passwordless Supabase login foundation."
        actions={<WorkspaceLink href="/auth">Auth Status</WorkspaceLink>}
      />

      <WorkspaceGrid columns="xl:grid-cols-3">
        <PremiumStatCard icon={<Lock />} label="Supabase" value={supabaseEnabled ? "Enabled" : "Demo Mode"} tone={supabaseEnabled ? "green" : "amber"} />
        <PremiumStatCard label="Login Type" value="Magic Link" tone="blue" />
        <PremiumStatCard label="Status" value={status ? "Updated" : "Waiting"} tone="purple" />
      </WorkspaceGrid>

      <WorkspacePanel title="Sign In">
        <div className="max-w-xl space-y-4">
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email address"
            className="w-full rounded-xl border border-[#173047] bg-[#071827] px-4 py-3 text-white outline-none"
          />

          <button
            onClick={sendMagicLink}
            className="rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white"
          >
            Send Magic Link
          </button>

          {status ? <p className="text-sm text-slate-300">{status}</p> : null}
        </div>
      </WorkspacePanel>
    </Workspace>
  );
}
