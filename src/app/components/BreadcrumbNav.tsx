'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function BreadcrumbNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Don't render on server or on home page
  if (!mounted || pathname === '/') {
    return null;
  }
  
  // Extract path segments
  const pathSegments = pathname.split('/').filter(Boolean);
  
  // Define page titles for breadcrumbs
  const pageTitles: Record<string, string> = {
    'is-page-stable': 'Is Page Stable',
    'classic': 'Classic Load',
    'redirect': 'Redirect Chain',
    'start': 'Redirect Chain',
    '1': 'Redirect Chain',
    '2': 'Redirect Chain', 
    '3': 'Redirect Chain',
    'final': 'Redirect Chain',
    'hash': 'Hash-Only Navigation',
    'spa': 'SPA PushState',
    'xhr-bursts': 'XHR Bursts',
    'failures': 'Failed Requests',
    'sse': 'Server-Sent Events',
    'ws': 'WebSocket Noise',
    'dom-churn': 'DOM Churn',
    'cls': 'Layout Shifts (CLS)',
    'iframes': 'Iframes',
    'perf-mix': 'Performance Mix',
  };
  
  const getBreadcrumbTitle = (segment: string) => {
    return pageTitles[segment] || segment;
  };

  return (
    <nav>
      <ol className="flex items-center space-x-2 text-sm">
          <li>
            <Link 
              href="/" 
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              Home
            </Link>
          </li>
          {pathSegments.map((segment, index) => {
            const isLast = index === pathSegments.length - 1;
            const href = '/' + pathSegments.slice(0, index + 1).join('/');
            
            return (
              <div key={segment} className="flex items-center space-x-2">
                <li className="text-gray-500">&gt;</li>
                <li>
                  {isLast ? (
                    <span className="text-gray-900 font-medium">
                      {getBreadcrumbTitle(segment)}
                    </span>
                  ) : (
                    <Link 
                      href={href}
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {getBreadcrumbTitle(segment)}
                    </Link>
                  )}
                </li>
              </div>
            );
          })}
      </ol>
    </nav>
  );
}
