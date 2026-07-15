import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Pusdatin Kemenag Barito Utara',
    short_name: 'Pusdatin',
    description: 'Pusat Data dan Informasi Kementerian Agama Barito Utara',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#059669',
    icons: [
      {
        src: '/branding/kemenag.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
      },
      {
        src: '/branding/kemenag.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
      }
    ],
  };
}
