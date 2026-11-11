'use client';

import { useState } from 'react';

export default function AudioPlayer({ src }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <p className="text-sm text-muted">
        The recording is not available. It may have been deleted.
      </p>
    );
  }
  return (
    <audio
      controls
      preload="metadata"
      src={src}
      onError={() => setFailed(true)}
      className="w-full"
    />
  );
}