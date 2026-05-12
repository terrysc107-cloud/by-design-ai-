'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

// Replace this with your YouTube or Vimeo embed URL
// YouTube:  https://www.youtube.com/embed/YOUR_VIDEO_ID
// Vimeo:    https://player.vimeo.com/video/YOUR_VIDEO_ID
const VIDEO_EMBED_URL = 'https://www.youtube.com/embed/YOUR_VIDEO_ID?rel=0&modestbranding=1&color=white'

export default function VideoSection() {
  const [playing, setPlaying] = useState(false)
  const shouldReduce = useReducedMotion()

  return (
    <section className="section">
      <motion.div
        className="flex flex-col gap-10"
        initial={shouldReduce ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Header */}
        <div className="flex flex-col gap-3">
          <p className="text-gold text-xs tracking-[0.25em] uppercase font-medium">
            5 Minutes
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
            Watch Before You Book
          </h2>
          <p className="text-white/50 text-sm md:text-base leading-relaxed max-w-xl">
            This is a short walkthrough of exactly how the audit works, what you&apos;ll walk away with, and who this is built for. Watch it before you decide.
          </p>
        </div>

        {/* Video player */}
        <div className="relative">
          {/* Gold left accent */}
          <div className="absolute -left-px top-0 bottom-0 w-[3px] bg-gold/60" />

          <div className="video-embed-wrap border border-white/8 ml-6">
            {!playing ? (
              /* Thumbnail / Play overlay */
              <div
                className="absolute inset-0 flex items-center justify-center cursor-pointer group bg-[#0d0d0d]"
                onClick={() => setPlaying(true)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setPlaying(true)}
                aria-label="Play video"
              >
                {/* Subtle grid bg */}
                <div
                  className="absolute inset-0 opacity-[0.04]"
                  style={{
                    backgroundImage:
                      'linear-gradient(rgba(201,168,76,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.5) 1px, transparent 1px)',
                    backgroundSize: '48px 48px',
                  }}
                />

                {/* Play button */}
                <motion.div
                  className="relative z-10 flex flex-col items-center gap-4"
                  whileHover={shouldReduce ? {} : { scale: 1.03 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-16 h-16 bg-gold flex items-center justify-center">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M5 3.5L16 10L5 16.5V3.5Z" fill="#0A0A0A" />
                    </svg>
                  </div>
                  <p className="text-white/50 text-xs tracking-widest uppercase">
                    Play
                  </p>
                </motion.div>
              </div>
            ) : (
              <iframe
                src={`${VIDEO_EMBED_URL}&autoplay=1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="By Design AI — How the Audit Works"
              />
            )}
          </div>
        </div>

        {/* Caption */}
        <p className="text-white/30 text-xs tracking-wide">
          Average watch time: 4 min 38 sec &nbsp;·&nbsp; No fluff. No pitch. Just the system.
        </p>
      </motion.div>
    </section>
  )
}
