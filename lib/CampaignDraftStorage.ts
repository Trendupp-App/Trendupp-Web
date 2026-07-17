const STORAGE_KEY = 'trendupp-campaign-progress';

interface CampaignProgress {
  campaignId: string;
  currentStep: number;
}

export function saveCampaignProgress(progress: CampaignProgress) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // ignore quota/serialization errors — non-critical
  }
}

export function loadCampaignProgress(): CampaignProgress | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearCampaignProgress() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
