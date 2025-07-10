"use client";

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function DebugRouter() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    console.log('[DEBUG] Current pathname:', pathname);
    console.log('[DEBUG] Router object:', router);
  }, [pathname, router]);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-2 text-xs rounded z-50">
      <div>Path: {pathname}</div>
      <div>Env: {process.env.NODE_ENV}</div>
    </div>
  );
} 