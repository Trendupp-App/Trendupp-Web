import { useQuery } from '@tanstack/react-query';

// Third-party FX rate lookup — not our backend, so this deliberately bypasses
// apiClient (wrong baseURL/auth headers for an external host).
const USD_RATES_URL = 'https://open.er-api.com/v6/latest/USD';

async function fetchUsdToNgnRate(): Promise<number> {
  const res = await fetch(USD_RATES_URL);
  if (!res.ok) throw new Error('Failed to fetch exchange rate');
  const data = await res.json();
  const rate = data?.rates?.NGN;
  if (typeof rate !== 'number') throw new Error('NGN rate missing from exchange rate response');
  return rate;
}

// Rates move slowly enough that an hour-long cache avoids hammering the
// third-party API on every drawer open without showing stale data.
export function useUsdToNgnRate(enabled: boolean = true) {
  return useQuery({
    queryKey: ['exchange-rate', 'USD', 'NGN'],
    queryFn: fetchUsdToNgnRate,
    enabled,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 2,
    retry: 1,
  });
}

// Single source of truth for "should we show this creator NGN instead of the
// campaign's own currency" — Nigerian creators only, for now.
// Reverted: creators now always see the campaign's own currency, regardless
// of country. Left displayInNgn hardcoded to false rather than ripping out
// every call site so the conversion can be re-enabled by flipping this back.
export function useDisplayCurrency() {
  const displayInNgn = false;
  const { data: usdToNgnRate, isLoading: isLoadingRate } = useUsdToNgnRate(displayInNgn);
  return { displayInNgn, usdToNgnRate, isLoadingRate };
}
