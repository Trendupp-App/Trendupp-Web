export default function StepNicheSkeleton() {
  const widths = [72, 90, 64, 110, 80, 96, 70, 104, 86, 60, 98, 76];

  return (
    <div className="flex flex-col gap-4 w-full animate-pulse">
      <div className="flex flex-wrap gap-2 justify-center">
        {widths.map((w, i) => (
          <div key={i} className="h-9 rounded-full bg-[#c4c2cb]" style={{ width: `${w}px` }} />
        ))}
      </div>
      <div className="h-12 w-full rounded-md bg-[#c6c4ce] mt-2" />
      <div className="h-4 w-36 mx-auto rounded bg-[#bbb9c2] mt-1" />
    </div>
  );
}
