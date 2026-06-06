import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AI by Design',
    short_name: 'aixdesign',
    description:
      'AI business coaching & consulting. We diagnose the bottleneck, design the system, and ship the lean, autonomous solution.',
    start_url: '/',
    display: 'standalone',
    background_color: '#1E1B17',
    theme_color: '#1E1B17',
    icons: [
      { src: '/icon.png', sizes: '32x32', type: 'image/png' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  }
}
