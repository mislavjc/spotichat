import { useEffect, useRef } from 'react';

export const useAutoScroll = <T extends any[]>(dependencies: T) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return endRef;
};
