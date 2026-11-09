import { useCallback, useEffect, useState } from 'react';
import api, { getErrorMessage } from '../api/client';

// GET helper with loading / error / reload. `deps` re-run the request.
export default function useFetch(url, params, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: '' });
  const [tick, setTick] = useState(0);
  const key = JSON.stringify(params || {});

  useEffect(() => {
    let active = true;
    if (!url) { setState({ data: null, loading: false, error: '' }); return undefined; } // nothing to fetch yet
    setState((s) => ({ ...s, loading: true, error: '' }));
    api.get(url, { params })
      .then((r) => active && setState({ data: r.data.data, loading: false, error: '' }))
      .catch((e) => active && setState({ data: null, loading: false, error: getErrorMessage(e) }));
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, key, tick, ...deps]);

  const reload = useCallback(() => setTick((t) => t + 1), []);
  return { ...state, reload };
}
