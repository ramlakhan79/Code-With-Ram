import { useEffect, useMemo, useState } from 'react';

// Returns a now() function that follows the SERVER clock, so countdowns stay right even if the device clock is off.
// The offset is recalibrated every time fresh data arrives with a new `serverTime`.
export default function useServerClock(serverTime) {
  const offset = useMemo(() => (serverTime ? new Date(serverTime).getTime() - Date.now() : 0), [serverTime]);
  const [, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, []);
  return () => Date.now() + offset;
}
