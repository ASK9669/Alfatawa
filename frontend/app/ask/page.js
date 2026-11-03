"use client";

import { useState } from "react";
import { ui } from "@/lib/ui";

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
      <div className="mx-auto mb-10 max-w-5xl text-center">
        <span className="mb-3 inline-block rounded-full bg-[#e5f1e8] px-4 py-2 text-sm font-semibold text-[#087443]">
          Al-Fataawaa Islamic Fatwa Program
        </span>

        <h1 className="text-3xl font-bold tracking-tight text-[#064e35] sm:text-4xl">
          Ask the Mufti
        </h1>

        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
          Have a question about Islam? Submit your question and receive
          authentic Islamic guidance from qualified scholars.
        </p>
      </div>

      {/* Main content */}
      <div className="mx-auto grid max-w-6xl items-start gap-8 lg:grid-cols-2">
        {/* Left: Islamic poster and information */}
        <section className="space-y-5">
          <div className="overflow-hidden rounded-3xl border border-[#e5d8a9] bg-white shadow-lg">
            <img
              src="/ask-mufti-banner.png"
              alt="Al-Fataawaa Ask Mufti Islamic guidance poster"
              className="h-auto w-full object-contain"
            />
          </div>

          {/* Islamic guidance */}
          <div className="rounded-2xl border border-[#e6d9b1] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#075c3b]">
              Why Ask Al-Fataawaa?
            </h2>

            <p className="mt-2 text-sm leading-7 text-gray-600">
              Our platform provides a way to submit your Islamic questions and
              seek guidance on matters of worship, family, business, and
              everyday life.
            </p>

            <div className="mt-5 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-[#f0f7f1] p-3">
                <span className="text-2xl">☪</span>
                <p className="mt-2 text-xs font-semibold text-[#075c3b]">
                  Ibaadaa
                </p>
              </div>

              <div className="rounded-xl bg-[#f0f7f1] p-3">
                <span className="text-2xl">⌂</span>
                <p className="mt-2 text-xs font-semibold text-[#075c3b]">
                  Maatii
                </p>
              </div>

              <div className="rounded-xl bg-[#f0f7f1] p-3">
                <span className="text-2xl">⚖</span>
                <p className="mt-2 text-xs font-semibold text-[#075c3b]">
                  Mu'aamalaa
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Right: Question form */}
        <section className="rounded-3xl border border-[#e8e1cb] bg-white p-6 shadow-lg sm:p-8">
          {status === "done" ? (
            <div className="py-12 text-center" role="status">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-700">
                ✓
              </div>

              <h2 className="mt-5 text-2xl font-bold text-[#075c3b]">
                Gaafiin kee ergameera!
              </h2>

              <p className="mt-3 text-sm leading-7 text-gray-600">
                Gaafiin kee milkaa'inaan ergameera. Galatoomaa. Gaafiin
                ilaalamee yeroo gabaabaa keessatti deebiin isaa ni maxxanfama.
              </p>

              <button
                type="button"
                onClick={() => setStatus("idle")}
                className={`${ui.secondary} mt-7`}
              >
                Gaaffii biraa ergi
              </button>
            </div>
          ) : (
            <>
              <div className="mb-7 border-b border-gray-100 pb-5">
                <h2 className="text-2xl font-bold text-[#064e35]">
                  Submit Your Question
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Fill in the form below. You do not need to provide your name.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Question */}
                <div>
                  <label htmlFor="question" className={ui.label}>
                    Your Islamic Question
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <textarea
                    id="question"
                    name="question"
                    required
                    minLength={5}
                    maxLength={2000}
                    rows={7}
                    placeholder="Write your question clearly here..."
                    onChange={(e) => setLength(e.target.value.length)}
                    className={`${ui.input} resize-y`}
                  />

                  <p className={`${ui.hint} mt-1 text-end`}>
                    {length} / 2000 characters
                  </p>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className={ui.label}>
                    Email Address
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
                    className={ui.input}
                  />

                  <p className={`${ui.hint} mt-2`}>
                    Your email address will never be displayed publicly on the
                    website.
                  </p>
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
                    Deebiin isaa karaa Emailii tiin na haa qaqqabu.
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

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className={`${ui.primary} w-full justify-center py-3.5`}
                >
                  {status === "sending" ? "Ergamaa jira..." : "Gaaffii Ergi →"}
                </button>

                <p className="text-center text-xs leading-5 text-gray-400">
                  Your question will be reviewed before it is published on
                  Al-Fataawaa.
                </p>
              </form>
            </>
          )}
        </section>
      </div>

      {/* Footer */}
      <footer className="mx-auto mt-12 max-w-5xl border-t border-[#e5dfca] pt-6 text-center">
        <p className="text-sm font-semibold text-[#075c3b]">Al-Fataawaa</p>

        <p className="mt-1 text-xs text-gray-500">
          Seeking knowledge • Sharing guidance • Following Islam
        </p>
      </footer>
    </main>
  );
}
