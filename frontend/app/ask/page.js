"use client";

import { useState } from "react";
import { ui } from "@/lib/ui";
import VoiceRecorder from "@/components/VoiceRecorder";
import BackButton from "../admin/BackButton";

// All page text is kept here for easy translation.
const T = {
  title: "Fatwaa Gaafadhuu",
  intro: "Gaafii kee Barreeffamaan ykn Sagaleen gaafachuu dandeessa.",
  how: "Filadhu",
  modeVoice: "Sagalee",
  modeText: "Barreeffama",
  question: "Gaafii kee barreessii ergi",
  voiceTitle: "Sagalee kee waraabii ergi",
  email: "Email (optional)",
  emailHint: "",
  notify: "yoo deebiin ergamee naaf beeksisi",
  send: "Gaafii Ergi",
  sending: "ergaa jira...",
  thanks:
    "Gaafii kee Milkaa'inaan ergameera. Deebiin isaa yeroo gabaabaa keessatti siif ergama.",
  review: "Deebiin isaa fatwaa page irratti maxxanfama.",
  another: "Gaafii biraa ergi",
  needQuestion: "Please gaafii kee barreessi.",
  needRecording: "Please Sagalee kee waraabi.",
  failed: "Ergaan kee hin milkoofne, irra deebi'ii yaali",
  offline: "Internet connection is required.",
};

const VOICE = {
  record: " 🎙️ Waraabi",
  stop: "Dhaabi",
  again: "haaraa waraabi",
  remove: "Haqi",
  recording: "Waraabaa jira...",
  hint: "Sagaleen Daqiiqaa 2 Caaluu hin qabu. ",
  denied: "microphone kee banadhu ykn barreefamaan erguu dandeessa",
  failed: "Waraabbiin hin milkoofne ykn barreefamaan erguu dandeessa.",
  empty: "sagaleen hin waaraaabmne, irra deebi'ii yaali.",
  unsupported: "Browser kee sagalee hin waraabu, barreefamaan erguu dandeessa.",
};

function extensionOf(type) {
  if (type.includes("ogg")) return "ogg";
  if (type.includes("mp4")) return "m4a";
  if (type.includes("mpeg")) return "mp3";
  return "webm";
}

export default function AskPage() {
  // State variables
  const [mode, setMode] = useState("text");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [text, setText] = useState("");
  const [recording, setRecording] = useState(null);

  // Switch between text and voice.
  function chooseMode(next) {
    if (next === mode) return;

    if (next === "text") {
      setRecording(null);
    }

    setMode(next);
    setStatus("idle");
    setMessage("");
  }

  // Submit question.
  async function handleSubmit(e) {
    e.preventDefault();

    const formEl = e.currentTarget;
    const form = new FormData(formEl);

    const email = String(form.get("email") || "");
    const notify = form.get("notify") === "on";
    const website = String(form.get("website") || "");
    const question = text.trim();

    if (mode === "text" && question.length < 5) {
      setStatus("error");
      setMessage(T.needQuestion);
      return;
    }

    if (mode === "voice" && !recording) {
      setStatus("error");
      setMessage(T.needRecording);
      return;
    }

    setStatus("sending");
    setMessage("");

    try {
      let res;

      if (mode === "voice") {
        const body = new FormData();

        body.append(
          "audio",
          recording.blob,
          `question.${extensionOf(recording.blob.type)}`,
        );

        body.append("seconds", String(recording.seconds));
        body.append("email", email);
        body.append("notify", notify ? "true" : "false");
        body.append("website", website);

        res = await fetch("/api/questions/voice", {
          method: "POST",
          body,
        });
      } else {
        res = await fetch("/api/questions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question,
            email,
            notify,
            website,
          }),
        });
      }

      const data = await res.json();

      if (res.ok) {
        setStatus("done");

        formEl.reset();
        setText("");
        setRecording(null);
      } else {
        setStatus("error");
        setMessage(data.error || T.failed);
      }
    } catch (error) {
      console.error("Question submission error:", error);

      setStatus("error");
      setMessage(T.offline);
    }
  }

  // SUCCESS SCREEN
  if (status === "done") {
    return (
      <main className="min-h-screen bg-[#f7faf7] px-4 py-12">
        <div className="mx-auto max-w-lg rounded-3xl border border-green-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-700">
            ✓
          </div>

          <h1 className="text-2xl font-bold text-green-800">Milkaa'eera!</h1>

          <p className="mt-4 leading-7 text-gray-600">{T.thanks}</p>

          <p className="mt-3 text-sm text-gray-500">{T.review}</p>
          <div className="flex-row gap-3">
            <button
              type="button"
              onClick={() => {
                setStatus("idle");
                setMessage("");
                setMode("text");
              }}
              className="m-4 rounded-xl bg-white border border-green-700 border-l-4 border-t-4 border-green-700 px-2 py-2 font-semibold text-black transition hover:bg-green-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {T.another}
            </button>
            <BackButton />
          </div>
        </div>
      </main>
    );
  }

  // MAIN ASK PAGE
  return (
    <main className="min-h-screen bg-[#f7faf7] px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-2xl">
        {/* HEADER */}
        <div className="mb-8 text-center">
          <div className="text-center justify-center flex">
            <img src="kuran.png" alt="Ask" className="h-auto w-auto rounded-4xl" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-green-900 sm:text-4xl">
            {T.title}
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-gray-600 sm:text-base">
            {T.intro}
          </p>

          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-yellow-500" />
        </div>

        {/* FORM CARD */}
        <form
          onSubmit={handleSubmit}
          className="space-y-7 rounded-3xl border border-gray-100 bg-white p-5 shadow-[0_8px_35px_rgba(0,0,0,0.04)] sm:p-8"
        >
          {/* QUESTION TYPE SELECTION */}
          <div>
            <p className="mb-4 text-sm font-semibold text-gray-800">{T.how}</p>

            <div className="grid grid-cols-2 gap-3">
              {/* TEXT FIRST */}
              <button
                type="button"
                aria-pressed={mode === "text"}
                onClick={() => chooseMode("text")}
                className={`flex flex-col items-center gap-2 rounded-2xl border  transition-all duration-200 ${
                  mode === "text"
                    ? "border-green-700 bg-green-50 text-green-800 shadow-sm ring-1 ring-green-700 border-t-4 border-l-4"
                    : "border-gray-200 bg-white text-gray-600 hover:border-green-400 hover:bg-green-50/50 border-3 "
                }`}
              >
                <span className="font-semibold"> <span className="text-3xl">✍️</span>{T.modeText}</span>
              </button>

              {/* VOICE SECOND */}
              <button
                type="button"
                aria-pressed={mode === "voice"}
                onClick={() => chooseMode("voice")}
                className={`flex flex-col items-center gap-2 rounded-2xl border p-1 transition-all duration-200 ${
                  mode === "voice"
                    ? "border-green-700 bg-green-50 text-green-800 shadow-sm ring-1 ring-green-700 border-t-4 border-l-4"
                    : "border-gray-200 bg-white text-gray-600 hover:border-green-400 hover:bg-green-50/50 border-3"
                }`}
              >
                <span className="font-semibold"> <span className="text-3xl">🎙️</span>{T.modeVoice}</span>
              </button>
            </div>
          </div>

          {/* TEXT QUESTION */}
          {mode === "text" && (
            <div className="space-y-3">
              <label
                htmlFor="question"
                className="block text-sm font-semibold text-gray-800"
              >
                {T.question}
              </label>

              <textarea
                id="question"
                name="question"
                required
                minLength={5}
                maxLength={2000}
                rows={7}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Gaafii kee asitti barreessi..."
                className="w-full resize-y rounded-2xl border border-green-400 bg-gray-50 px-4 py-4 text-sm leading-7 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100 border-t-4 border-l-4"
              />

              <p className="text-right text-xs text-gray-400">
                {text.length} / 2000
              </p>
            </div>
          )}

          {/* VOICE RECORDING */}
          {mode === "voice" && (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-900">
                {T.voiceTitle}
              </p>

              <div className="rounded-2xl border border-green-600 bg-green-50/50 p-2 border-l-4 border-t-4 sm:p-5">
                <VoiceRecorder  onChange={setRecording} labels={VOICE} />
              </div>
            </div>
          )}

          {/* EMAIL */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-gray-800"
            >
              {T.email}
            </label>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="your name @gmail.com"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100"
            />

            <p className="mt-2 text-xs text-gray-400">{T.emailHint}</p>
          </div>

          {/* NOTIFICATION */}
          <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-gray-50 p-4">
            <input
              type="checkbox"
              defaultChecked
              name="notify"
              className="mt-1 h-4 w-4 accent-green-700"
            />

            <span className="text-sm leading-6 text-gray-700">{T.notify}</span>
          </label>

          {/* HONEYPOT SPAM PROTECTION */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
          />

          {/* ERROR MESSAGE */}
          {status === "error" && (
            <p
              role="alert"
              className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700"
            >
              {message}
            </p>
          )}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={status === "sending"}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-800 px-6 py-4 font-semibold text-white shadow-sm transition duration-200 hover:bg-green-900 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "sending" ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                {T.sending}
              </>
            ) : (
              <>
                {T.send}
                <span>➜</span>
              </>
            )}
          </button>

          {/* FOOTER */}
          <p className="text-center text-xs leading-6 text-gray-400">
            Al-Fataawaa Afaan Oromoo || Dr Jibriil Qamar .
          </p>
        </form>
      </div>
    </main>
  );
}
