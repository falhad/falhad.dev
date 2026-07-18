"use client"

// A plain black bubble with white text in a playful font. `canClose` is false
// for the opening "it's dark" prompt (only way out is clicking the lamp) and
// true for the playful lights-off quips.
export default function LampDialog({
  text,
  canClose,
  onClose,
}: {
  text: string
  canClose: boolean
  onClose: () => void
}) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-24 z-40 flex justify-center px-4 md:top-28">
      <div
        className="pointer-events-auto w-[min(440px,92vw)] rounded-2xl bg-black/90 px-6 py-5 text-center text-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)] ring-1 ring-white/15 backdrop-blur-sm"
        style={{ fontFamily: '"Comic Sans MS", "Comic Sans", "Chalkboard SE", "Marker Felt", cursive' }}
      >
        <p className="text-[1.05rem] leading-snug">{text}</p>
        {canClose ? (
          <button
            type="button"
            onClick={onClose}
            data-cursor="ok"
            className="mt-4 rounded-full border border-white/25 px-5 py-1.5 text-sm text-white/90 transition-colors hover:bg-white hover:text-black"
          >
            ok fine
          </button>
        ) : (
          <p className="mt-3 text-sm text-white/60">
            <span className="lampdlg-blink">👉</span> click the desk lamp
          </p>
        )}
      </div>
      <style>{`
        .lampdlg-blink { animation: lampdlg-blink 0.9s steps(1) infinite; display: inline-block; }
        @keyframes lampdlg-blink { 50% { opacity: 0; } }
        @media (prefers-reduced-motion: reduce) { .lampdlg-blink { animation: none; } }
      `}</style>
    </div>
  )
}
