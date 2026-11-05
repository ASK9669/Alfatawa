export default function FatwaNumber({ number, large = false }) {
  return (
    <span className="flex shrink-0 items-baseline gap-1 text-primary">
      <span className={large ? 'text-sm text-muted' : 'text-sm text-muted'}>Lakk:</span>
      <span
        className={`${large ? 'text-5xl' : 'text-2xl'} font-semibold leading-none tabular-nums`}
      >
        {number}
      </span>
    </span>
  );
}