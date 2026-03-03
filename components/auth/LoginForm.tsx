"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <p className="text-text-muted text-sm mb-3">Welcome to arrgateway</p>
        <h1 className="text-3xl font-bold text-text-primary tracking-tight leading-tight">
          Sign in to your<br />media server
        </h1>
        <p className="text-text-muted text-sm mt-3">
          Enter your email and password to continue
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-surface border border-border-muted rounded-lg px-4 py-3 text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-[#3a3a3a] transition-colors"
          placeholder="Email address"
        />

        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-surface border border-border-muted rounded-lg px-4 py-3 text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-[#3a3a3a] transition-colors"
          placeholder="Password"
        />

        {error && (
          <p className="text-red-400 text-sm text-center pt-1">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1e1e1e] hover:bg-[#272727] border border-[#2e2e2e] text-text-primary font-medium text-sm rounded-lg py-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Signing in…" : "Continue"}
        </button>
      </form>
    </div>
  );
}
