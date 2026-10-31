export default function FatwaNumber({ number, large = false }) {
  return (
    <span className="flex shrink-0 items-baseline gap-1 text-primary">
      <span className={large ? 'text-lg text-muted' : 'text-sm text-muted'}>No.</span>
      <span
        className={`${large ? 'text-7xl' : 'text-3xl'} font-semibold leading-none tabular-nums`}
      >
        {number}
      </span>
    </span>
  );
}