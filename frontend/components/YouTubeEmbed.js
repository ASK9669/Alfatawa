export function getYouTubeId(url = '') {
  const match = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);
  return match ? match[1] : null;
}

export default function YouTubeEmbed({ url }) {
  const id = getYouTubeId(url);
  if (!id) return null;

  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title="YouTube video player"
        loading="lazy"
        allowFullScreen
        className="h-full w-full"
      />
    </div>
  );
}