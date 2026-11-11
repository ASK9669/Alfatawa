"use client";

import { useEffect, useRef, useState } from "react";
import { ui } from "@/lib/ui";

const MAX_SECONDS = 120;
const TYPES = [
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/mp4",
  "audio/ogg;codecs=opus",
];

function pickType() {
  return TYPES.find((t) => MediaRecorder.isTypeSupported(t)) || "";
}

function clock(total) {
  const m = Math.floor(total / 60);
  const s = String(total % 60).padStart(2, "0");
  return `${m}:${s}`;
}

export default function VoiceRecorder({ onChange, labels }) {
  const [supported, setSupported] = useState(true);
  const [state, setState] = useState("idle"); // idle | recording | done
  const [seconds, setSeconds] = useState(0);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const startedRef = useRef(0);
  const urlRef = useRef("");

  function stopStream() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }

  useEffect(() => {
    setSupported(
      Boolean(navigator.mediaDevices?.getUserMedia) &&
        typeof MediaRecorder !== "undefined",
    );
    return () => {
      clearInterval(timerRef.current);
      stopStream();
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
  }, []);

  function stop() {
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
  }

  async function start() {
    setError("");
    try {
      // the microphone permission is asked only now, when the visitor taps Record
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = pickType();
      const recorder = new MediaRecorder(stream, {
        ...(mimeType ? { mimeType } : {}),
        audioBitsPerSecond: 32000,
      });
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        clearInterval(timerRef.current);
        stopStream();
        const type = recorder.mimeType || mimeType || "audio/webm";
        const blob = new Blob(chunksRef.current, { type });
        const secs = Math.max(
          1,
          Math.round((Date.now() - startedRef.current) / 1000),
        );
        if (blob.size === 0) {
          setState("idle");
          setError(labels.empty);
          return;
        }
        const objectUrl = URL.createObjectURL(blob);
        urlRef.current = objectUrl;
        setUrl(objectUrl);
        setSeconds(Math.min(secs, MAX_SECONDS));
        setState("done");
        onChange({ blob, seconds: Math.min(secs, MAX_SECONDS) });
      };

      recorderRef.current = recorder;
      startedRef.current = Date.now();
      setSeconds(0);
      recorder.start();
      setState("recording");

      timerRef.current = setInterval(() => {
        const s = Math.round((Date.now() - startedRef.current) / 1000);
        setSeconds(Math.min(s, MAX_SECONDS));
        if (s >= MAX_SECONDS) stop();
      }, 250);
    } catch (e) {
      stopStream();
      setError(e?.name === "NotAllowedError" ? labels.denied : labels.failed);
    }
  }

  function discard() {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = "";
    setUrl("");
    setSeconds(0);
    setState("idle");
    onChange(null);
  }

  async function again() {
    discard();
    await start();
  }

  if (!supported) {
    return <p className={ui.hint}>{labels.unsupported}</p>;
  }

  return (
    <div className="space-y-3 rounded-md border bg-surface p-4">
      {state === "idle" && (
        <button
          type="button"
          onClick={start}
          className="bg-white border border-green-700 border-l-4 border-t-4 border-green-700 rounded-md px-4 py-2 text-sm font-medium text-black hover:bg-primary-strong"
        >
          {labels.record}
        </button>
      )}

      {state === "recording" && (
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-2 font-medium" role="timer">
            <span
              className="inline-block h-3 w-3 animate-pulse rounded-full bg-red-600"
              aria-hidden="true"
            />
            {labels.recording} {clock(seconds)} / {clock(MAX_SECONDS)}
          </span>
          <button type="button" onClick={stop} className={ui.primary}>
            {labels.stop}
          </button>
        </div>
      )}

      {state === "done" && (
        <div className="space-y-3">
          <audio controls src={url} className="w-full" />
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={again} className={ui.secondary}>
              {labels.again}
            </button>
            <button type="button" onClick={discard} className={ui.secondary}>
              {labels.remove}
            </button>
          </div>
        </div>
      )}

      {error && (
        <p role="alert" className={ui.error}>
          {error}
        </p>
      )}
      <p className={ui.hint}>{labels.hint}</p>
    </div>
  );
}
