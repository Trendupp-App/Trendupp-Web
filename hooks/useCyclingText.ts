import { useEffect, useState } from 'react';

export function useCyclingText(active: boolean, messages: string[], intervalMs = 2000): string {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, intervalMs);
    return () => clearInterval(interval);
  }, [active, messages, intervalMs]);

  return active ? (messages[index] ?? messages[0]) : messages[0];
}
