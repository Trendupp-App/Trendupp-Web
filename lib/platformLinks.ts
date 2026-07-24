import type { ExternalLinks } from '@/types/settings';

function stripAt(handle: string): string {
  return handle.replace(/^@/, '');
}

export interface ResolvedExternalLinks {
  website: string | null;
  instagram: string | null;
  twitter: string | null;
  linkedin: string | null;
  youtube: string | null;
}

// The API returns handles ("@trendupp"), not full URLs — build clickable
// links from them. websiteUrl is already a full URL.
export function resolveExternalLinks(links?: ExternalLinks): ResolvedExternalLinks {
  return {
    website: links?.websiteUrl || null,
    instagram: links?.instagram ? `https://instagram.com/${stripAt(links.instagram)}` : null,
    twitter: links?.twitter ? `https://twitter.com/${stripAt(links.twitter)}` : null,
    linkedin: links?.linkedin ? `https://linkedin.com/company/${stripAt(links.linkedin)}` : null,
    youtube: links?.youtube ? `https://youtube.com/@${stripAt(links.youtube)}` : null,
  };
}
