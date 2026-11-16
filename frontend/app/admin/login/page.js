"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ui } from "@/lib/ui";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    setError("");
    const form = new FormData(e.currentTarget);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
    });
    const data = await res.json();

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError(data.error || "Login failed.");
      setSending(false);
    }
  }

  return (
    <main className="mx-auto max-w-sm  border-green-500 rounded-lg border px-4 py-12">
      <div className="rounded-lg border border-green-400 border-l-5 border-t-5 bg-surface p-6">
        <h1 className="text-2xl font-semibold tracking-tight">Admin Qofaafi</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label htmlFor="email" className={ui.label}>
              Email
            </label>
            <input
              id="email"
              placeholder="Enter your email"
              name="email"
              type="email"
              required
              autoComplete="username"
              className={ui.input}
            />
          </div>
          <div className="relative">
            <label htmlFor="password" className={ui.label}>
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              placeholder="Enter your password"
              className="w-full border rounded-lg p-3 pr-12"
            />
          

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {error && (
            <p role="alert" className={ui.error}>
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={sending}
            className={`${ui.primary} w-full`}
          >
            {sending ? "Seenaa jira..." : "Seeni"}
          </button>
        </form>
      </div>
    </main>
  );
}
