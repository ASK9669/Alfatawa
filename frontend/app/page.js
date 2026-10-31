import Link from 'next/link';

export default function HomePage() {
  const button = 'rounded-lg px-4 py-2';

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-4">
      <h1 className="text-3xl font-bold">Alfataawaa Afaan Oromoo</h1>
      <p>
        Fatwaa gaafdhu , viidiyoolee ilaali .
      </p>
      <div className="flex flex-wrap gap-3">
        <Link href="/fatwas" className={`${button} bg-primary hover:bg-primary-strong text-white`}>
          Fatwaa Dubbisi
        </Link>
        <Link href="/ask" className={`${button} border`}>
          Ask a question
        </Link>
        <Link href="/about" className={`${button} border`}>
            About the Sheikh
        </Link>
        <Link href="/youtube" className={`${button} border`}>
            YouTube
        </Link>
      </div>
    </main>
  );
}