"use client";

import { useState } from "react";
import { ui } from "@/lib/ui";
import Link from "next/link";
import BackButton from "../admin/BackButton";

export default function AskPage() {
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [length, setLength] = useState(0);

  async function handleSubmit(e) {
    e.preventDefault();

    const formEl = e.currentTarget;
    setStatus("sending");
    setMessage("");

    const form = new FormData(formEl);

    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: form.get("question"),
          email: form.get("email"),
          notify: form.get("notify") === "on",
          website: form.get("website"),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("done");
        formEl.reset();
        setLength(0);
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setMessage("Could not connect. Please try again.");
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f8f2] px-4 py-10 sm:px-6 lg:px-8">
      {/* Page introduction */}

      {/* Main content */}
      <div className="mx-auto  max-w-6xl lg:grid-cols-2">
        {/* Left: Islamic poster and information */}

        {/* Right: Question form */}
        <section className="rounded-3xl border border-[#e8e1cb] bg-white p-6 shadow-lg sm:p-8">
          {status === "done" ? (
            <div className="py-12 text-center" role="status">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-700">
                ✓
              </div>

              <h2 className="mt-5 text-2xl font-bold text-[#075c3b]">
                Gaafiin kee milkaa'inaan ergameera!
              </h2>

              <p className="mt-3 text-sm leading-7 text-gray-600">
                Gaafiin kee milkaa'inaan ergameera. Gaafiin kee ilaalamee yeroo
                gabaabaa keessatti deebiin isaa ni maxxanfama. Galatoomi
              </p>

              <Link
                href="/"
                className="m-4  rounded-lg border-r-4 border-t-4 border border-green-800 px-4 py-2 text-sm font-medium text-black transition hover:bg-green-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Bahi
              </Link>
             

              <button
                type="button"
                onClick={() => setStatus("idle")}
                className={`${ui.secondary} m-4  rounded-lg border-r-4 border-t-4 border border-green-800 px-4 py-2 text-sm font-medium text-black transition hover:bg-green-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-500`}
              >
                Gaafii biraa ergi
              </button>
            </div>
          ) : (
            <>
              <div className="mb-7 border-b border-gray-100 pb-5">
                <div className="flex items-center gap-x-3">
                  <img
                    src="/kuran.png"
                    alt="Al-Fataawaa Ask Mufti Icon"
                    className=" w-full h-auto rounded-full "
                  />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Question */}
                <div>
                  <label htmlFor="question" className={ui.label}>
                    Gaafii kee barreessi
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <textarea
                    id="question"
                    name="question"
                    required
                    minLength={5}
                    maxLength={2000}
                    rows={7}
                    placeholder="Gaafii kee asitti barreessi..."
                    onChange={(e) => setLength(e.target.value.length)}
                    className={`${ui.input} resize-y border border-yellow-600 bg-gray-600 text-black placeholder-gray-400 focus:border-[#087443] focus:ring-[#087443]`}
                  />

                  <p className={`${ui.hint} mt-1 text-end`}>
                    {length} / 2000 jechoota
                  </p>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className={ui.label}>
                    Email 
                    <span className="ml-2 text-xs font-normal text-gray-400">
                      (Optional)
                    </span>
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="example@gmail.com"
                    className={`${ui.input} border border-yellow-600 bg-gray-500 text-black placeholder-gray-400 focus:border-[#087443] focus:ring-[#087443]`}
                  />
                </div>

                {/* Email notification */}
                <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-[#f4f8f4] p-4">
                  <input
                    type="checkbox"
                    defaultChecked
                    name="notify"
                    className="mt-1 h-4 w-4 accent-[#087443]"
                  />

                  <span className="text-sm leading-6 text-gray-700">
                    <span className="block text-xs text-gray-500">
                      Notify me by email when my question is answered.
                    </span>
                  </span>
                </label>

                {/* Honeypot */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                />

                {/* Error */}
                {status === "error" && (
                  <p role="alert" className={ui.error}>
                    {message}
                  </p>
                )}
                <p className="text-center text-sm text-muted">
                  <BackButton />
                

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="m-4  rounded-lg border-r-4 border-t-4 border border-green-800 px-4 py-2 text-sm font-medium text-black transition hover:bg-green-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
    
                >
                  {status === "sending" ? "Ergamaa jira..." : "Gaafii Ergi"}
                </button>
                </p>
                <p className="text-center text-xs leading-5 text-gray-400">
                  Gaafiin kee sirriitti laalamee, Deebiin isaa yeroo gabaabaa
                  keessatti ni maxxanfama.
                </p>
              </form>
            </>
          )}
        </section>
      </div>

      {/* Footer */}
      <footer className="mx-auto mt-12 max-w-5xl border-t border-[#e5dfca] pt-6 text-center">
        <p className="text-sm font-semibold text-[#075c3b]">
          Al-Fataawaa ||Dr jibriil Qamar
        </p>
      </footer>
    </main>
  );
}
