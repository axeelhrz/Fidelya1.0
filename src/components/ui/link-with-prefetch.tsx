import React, { useCallback, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface LinkWithPrefetchProps {
  href: string;
  children: React.ReactNode;
  prefetch?: boolean;
  className?: string;
}

export function LinkWithPrefetch({
  href,
  children,
  prefetch = false,
  className,
  ...props
}: LinkWithPrefetchProps & Omit<React.ComponentPropsWithoutRef<typeof Link>, 'href'>) {
  const router = useRouter();
  const [isPrefetched, setIsPrefetched] = useState(false);
  
  const handleMouseEnter = useCallback(() => {
    if (!isPrefetched && !prefetch) {
      router.prefetch(href);
      setIsPrefetched(true);
    }
  }, [href, isPrefetched, prefetch, router]);

  return (
    <Link 
      href={href} 
      prefetch={prefetch}
      className={className}
      onMouseEnter={handleMouseEnter}
      {...props}
    >
      {children}
    </Link>
  );
}