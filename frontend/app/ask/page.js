'use client';

import { useState } from 'react';
import { ui } from '@/lib/ui';
import VoiceRecorder from '@/components/VoiceRecorder';

const T = {
  title: 'Ask the Mufti',
  intro: 'Write your question clearly, or record it with your voice. You do not need to give your name.',
  question: 'Your question',
  questionVoice: 'Your question (optional when you record your voice)',
  voiceTitle: 'Or ask with your voice',
  email: 'Email (optional)',
  emailHint: 'It is never shown on the website.',
  notify: 'Notify me by email when my question is answered',
  send: 'Send question',
  sending: 'Sending...',
  thanks: 'Your question was sent. Thank you.',
  review: 'The Sheikh reviews every question before an answer is published.',
  another: 'Send another question',
  needQuestion: 'Write your question, or record it with your voice.',
  shortQuestion: 'The typed question needs at least 5 characters, or leave it empty.',
  failed: 'Something went wrong.',
  offline: 'Could not connect. Please try again.',
};

const VOICE = {
  record: 'Record',
  stop: 'Stop',
  again: 'Record again',
  remove: 'Remove recording',
  recording: 'Recording',
  hint: 'Up to 2 minutes. Your voice is private and is heard only by the Sheikh and his office.',
  denied: 'The microphone is blocked. Allow it in your browser settings, or type your question.',
  failed: 'The recording could not start. Please type your question.',
  empty: 'Nothing was recorded. Please try again.',
  unsupported: 'Your browser cannot record voice. Please type your question.',
};

function extensionOf(type) {
  if (type.includes('ogg')) return 'ogg';
  if (type.includes('mp4')) return 'm4a';
  if (type.includes('mpeg')) return 'mp3';
  return 'webm';
}

export default function AskPage() {
  const [status, setStatus] = useState('idle'); // idle | sending | done | error
  const [message, setMessage] = useState('');
  const [length, setLength] = useState(0);
  const [recording, setRecording] = useState(null); // { blob, seconds } or null

  async function handleSubmit(e) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    const question = String(form.get('question') || '').trim();
    const email = String(form.get('email') || '');
    const notify = form.get('notify') === 'on';
    const website = String(form.get('website') || '');

    if (!recording && question.length < 5) {
      setStatus('error');
      setMessage(T.needQuestion);
      return;
    }
    if (recording && question && question.length < 5) {
      setStatus('error');
      setMessage(T.shortQuestion);
      return;
    }

    setStatus('sending');
    setMessage('');

    try {
      let res;
      if (recording) {
        const body = new FormData();
        body.append('audio', recording.blob, `question.${extensionOf(recording.blob.type)}`);
        body.append('seconds', String(recording.seconds));
        body.append('question', question);
        body.append('email', email);
        body.append('notify', notify ? 'true' : 'false');
        body.append('website', website);
        res = await fetch('/api/questions/voice', { method: 'POST', body });
      } else {
        res = await fetch('/api/questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question, email, notify, website }),
        });
      }
      const data = await res.json();

      if (res.ok) {
        setStatus('done');
        formEl.reset();
        setLength(0);
        setRecording(null);
      } else {
        setStatus('error');
        setMessage(data.error || T.failed);
      }
    } catch {
      setStatus('error');
      setMessage(T.offline);
    }
  }

  if (status === 'done') {
    return (
      <main className="mx-auto max-w-xl px-4 py-10">
        <div role="status" className={ui.success}>
          {T.thanks}
        </div>
        <p className="mt-4 text-muted">{T.review}</p>
        <button type="button" onClick={() => setStatus('idle')} className={`${ui.secondary} mt-6`}>
          {T.another}
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">{T.title}</h1>
      <p className="mt-2 text-muted">{T.intro}</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label htmlFor="question" className={ui.label}>
            {recording ? T.questionVoice : T.question}
          </label>
          <textarea
            id="question"
            name="question"
            required={!recording}
            minLength={recording ? undefined : 5}
            maxLength={2000}
            rows={7}
            onChange={(e) => setLength(e.target.value.length)}
            className={ui.input}
          />
          <p className={`${ui.hint} text-end`}>{length} / 2000</p>
        </div>

        <div>
          <p className={ui.label}>{T.voiceTitle}</p>
          <VoiceRecorder onChange={setRecording} labels={VOICE} />
        </div>

        <div>
          <label htmlFor="email" className={ui.label}>{T.email}</label>
          <input id="email" name="email" type="email" autoComplete="email" className={ui.input} />
          <p className={ui.hint}>{T.emailHint}</p>
        </div>

        <label className="flex items-start gap-3">
          <input type="checkbox" name="notify" className="mt-1.5 h-4 w-4 accent-primary" />
          <span>{T.notify}</span>
        </label>

        {/* honeypot: hidden from people, bots fill it */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />

        {status === 'error' && (
          <p role="alert" className={ui.error}>{message}</p>
        )}

        <button type="submit" disabled={status === 'sending'} className={ui.primary}>
          {status === 'sending' ? T.sending : T.send}
        </button>
      </form>
    </main>
  );
}