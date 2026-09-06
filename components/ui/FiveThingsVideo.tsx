'use client'

import { useRef, useState } from 'react'

/**
 * The "Five Things" reel — the 67s vertical short that argues for the Build Lab
 * by showing the artifact the Lab teaches you to build (charter, floors,
 * schedule, archive, meeting), then closes on runyouraiboard.com/build-lab.
 *
 * Source composition: video/build-lab-five-things (HyperFrames). The file in
 * public/ is a web encode of that render, not the master: CRF 25 with
 * +faststart, 3.1MB against the master's 24MB. Re-encode from the master rather
 * than re-rendering if it ever needs replacing.
 *
 * CLICK TO PLAY, NOT AUTOPLAY, and `preload="none"` behind it. The reel is
 * narrated, so a muted autoplay would show the argument with the argument
 * turned off, and 3.1MB on every page load to do it. The poster frame is the
 * hook card from the reel itself, which reads as a still headline until someone
 * asks for the rest.
 *
 * No icon library: this site has zero SVGs in it and draws its arrows with the
 * `→` character, so the play glyph is a clip-path triangle rather than an
 * imported icon or a hand-rolled path.
 */
export default function FiveThingsVideo({
  className = '',
  /** Distinguishes the placement in any future analytics on this element. */
  placement,
}: {
  className?: string
  placement: string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [started, setStarted] = useState(false)

  function start() {
    setStarted(true)
    videoRef.current?.play()
  }

  return (
    <figure className={`m-0 ${className}`}>
      <div className="relative w-full max-w-[280px] overflow-hidden rounded-[22px] border border-[#E3EAF3] bg-[#09111F] shadow-[0_24px_60px_rgba(20,42,71,.18)]">
        <video
          ref={videoRef}
          data-placement={placement}
          className="block w-full aspect-[9/16] object-cover"
          src="/video/five-things.mp4"
          poster="/video/five-things-poster.jpg"
          preload="none"
          playsInline
          controls={started}
          onEnded={() => setStarted(false)}
        />

        {/* The overlay is removed rather than faded once playing, so it can
            never sit over the native controls and swallow a tap. */}
        {!started && (
          <button
            type="button"
            onClick={start}
            aria-label="Play the Build Lab reel, 67 seconds"
            className="group absolute inset-0 flex items-end justify-center pb-8 bg-[#09111F]/25 hover:bg-[#09111F]/10 transition-colors"
          >
            <span className="flex items-center gap-3 rounded-xl bg-[#2878FF] px-5 py-3 text-white text-[11px] font-semibold tracking-widest uppercase motion-safe:transition-transform motion-safe:group-hover:-translate-y-px motion-safe:group-active:translate-y-0">
              <span
                aria-hidden
                className="block w-0 h-0 border-y-[6px] border-y-transparent border-l-[10px] border-l-white"
              />
              Watch
            </span>
          </button>
        )}
      </div>

      <figcaption className="text-[#526071] text-xs leading-relaxed mt-3 max-w-[280px]">
        67 seconds. Captions are on screen, so sound is optional.
      </figcaption>
    </figure>
  )
}
