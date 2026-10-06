import { useCallback, useEffect, useState } from 'react';

export default function useAsync(asyncFunction, initialValue = null) {
  const [data, setData] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      setData(await asyncFunction());
    } catch (requestError) {
      setError(requestError);
    } finally {
      setIsLoading(false);
    }
  }, [asyncFunction]);

  useEffect(() => {
    execute();
  }, [execute]);

  return { data, isLoading, error, retry: execute };
}
