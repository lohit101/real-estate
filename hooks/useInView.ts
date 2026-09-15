import { useEffect, useState, useRef } from 'react';

const useInView = (threshold = 0.1, delay = 0) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          clearTimeout(timer);
          if (entry.isIntersecting) {
            timer = setTimeout(() => setIsVisible(true), delay);
          } else {
            setIsVisible(false);
          }
        });
      },
      { threshold }
    );

    if (element) {
      observer.observe(element);
    }

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [threshold, delay]);

  return [ref, isVisible] as const;
};

export default useInView;