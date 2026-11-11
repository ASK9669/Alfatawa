"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ui } from "@/lib/ui";
import BackButton from "../../BackButton";
import AudioPlayer from "./AudioPlayer";

export default function AnswerForm({ fatwa, categories }) {
  const router = useRouter();

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(fatwa);
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");

  async function save(e, status) {
    const form = e.currentTarget.form;

    setBusy(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(`/api/admin/fatwas/${fatwa.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          questionOromo: form.questionOromo.value,
          category: form.category.value,
          answerOromo: form.answerOromo.value,
          youtubeUrl: form.youtubeUrl.value,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not save.");
        return;
      }

      setSaved({
        ...saved,
        status: data.status,
        number: data.number,
        slug: data.slug,
      });

      let text =
        data.status === "Published"
          ? `Fatwaan lakkoofsa ${data.number} irratti milkaa'inaan maxxanfameera!`
          : data.status === "Draft"
            ? "Deebiin kee milkaa'inaan kuufameera!"
            : "Gaaffiin kun milkaa'inaan haqameera!";

      if (data.emailStatus === "sent") {
        text += "Abbaa gaafateef email in ergameera.";
      }

      if (data.emailStatus === "failed") {
        text += " Email erguun hin milkoofne. Maxxansuu irra deebi'i.";
      }

      setMessage(text);
      setShowSuccess(true);

      router.refresh();
    } catch (err) {
      setError("Rakkoon tokko uumameera. Irra deebi'ii yaali.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <form className="mt-6 space-y-7">
        {/* Back Button and Status */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
            {saved.status}
          </span>
        </div>
              {fatwa.audio && (
        <div className="rounded-md border bg-surface p-4">
          <p className="mb-2 text-sm font-semibold">
            Voice question{fatwa.audioSeconds ? ` (${fatwa.audioSeconds} seconds)` : ''}
          </p>
          <AudioPlayer src={`/api/admin/audio/${fatwa.audio}`} />
          <p className={ui.hint}>
            Only you can hear this. Type the question below if you want to publish it. The
            recording is never shown on the website.
          </p>
        </div>
      )}

        {/* Question */}
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
          <div className="mb-4">
            <h2 className="text-lg font-bold">Gaaffii</h2>
            <p className="mt-1 text-sm text-muted">
              Gaafii ergame sirreessuun ni danda'ama.{" "}
            </p>
          </div>
          <textarea
            id="questionOromo"
            name="questionOromo"
            rows={4}
            defaultValue={fatwa.questionOromo}
            className={`${ui.input} resize-y leading-7`}
          />
        </div>

        {/* Category */}
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
          <h2 className="mb-4 text-lg font-bold">Ramaddii</h2>

          <select
            id="category"
            name="category"
            defaultValue={fatwa.category}
            className={ui.input}
          >
            <option value="">Ramaddii filadhu</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nameOromo}
              </option>
            ))}
          </select>

          <p className={ui.hint}>Tokko filachuun dirqama.</p>
        </div>

        {/* Answer */}
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
          <div className="mb-4">
            <h2 className="text-lg font-bold">Deebii Fatwaa</h2>
            <p className="mt-1 text-sm text-muted">
              Deebii guutuu asitti barreessi.
            </p>
          </div>
          <textarea
            id="answerOromo"
            name="answerOromo"
            rows={14}
            defaultValue={fatwa.answerOromo}
            className={`${ui.input} resize-y leading-8`}
          />
        </div>

        {/* YouTube */}
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
          <h2 className="mb-4 text-lg font-bold">YouTube Video</h2>

          <label htmlFor="youtubeUrl" className={ui.label}>
            YouTube link (optional)
          </label>

          <input
            id="youtubeUrl"
            name="youtubeUrl"
            type="url"
            defaultValue={fatwa.youtubeUrl}
            placeholder="https://www.youtube.com/watch?v=..."
            className={ui.input}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            ⚠️ {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
          <div className="flex flex-row flex-wrap items-center justify-center gap-2 sm:gap-3">
            {/* Publish */}
            <button
              type="button"
              disabled={busy}
              onClick={(e) => save(e, "Published")}
              className="rounded-lg border border-l-4 border-t-4 border-green-700 px-3 py-2 text-sm font-medium text-green-800 transition hover:bg-green-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {busy ? "Eegaa..." : "Maxxansi"}
            </button>

            {/* Save Draft */}
            <button
              type="button"
              disabled={busy}
              onClick={(e) => save(e, "Draft")}
              className="rounded-lg border border-l-4 border-t-4 border-amber-500 px-3 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              {busy ? "Eegaa..." : "Yeroof Kaayi"}
            </button>

            {/* Reject */}
            <button
              type="button"
              disabled={busy}
              onClick={(e) => {
                if (
                  confirm("Gaafii kana  akka in maxxanfamneef haquu barbaadaa?")
                ) {
                  save(e, "Rejected");
                }
              }}
              className="rounded-lg border border-l-4 border-t-4 border-red-600 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {busy ? "Eegaa..." : "Haqi"}
            </button>
          </div>
        </div>
      </form>

      {/* Success Popup */}
      {showSuccess && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-bulr-sm"
          onClick={() => setShowSuccess(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="success-title"
            className="w-full max-w-sm animate-in zoom-in-95 border border-green-600 border-t-7 border-l-7 rounded-2xl bg-white p-7 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-600">
              ✓
            </div>

            <h2 id="success-title" className="mt-5 text-xl font-bold">
              Milkaa'eera!
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted">{message}</p>

            <div className="mt-6 flex flex-col gap-3">
              {saved.status === "Published" && saved.slug && (
                <a
                  href={`/fatwas/${saved.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-primary px-4 py-3 text-sm font-semibold text-primary transition hover:bg-primary/5"
                >
                  Weebsaayitii irratti Ilaali ↗
                </a>
              )}

              <BackButton />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
