'use client';

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fullscreen?: boolean;
}

export default function LoadingSpinner({
  size = 'md',
  className,
  fullscreen = false,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-10 w-10',
    xl: 'h-16 w-16',
  };

  // The spinner component itself
  const spinner = (
    <div role="status">
      <Loader2
        className={cn(
          'animate-spin text-blue-600 dark:text-blue-500',
          sizeClasses[size],
          className
        )}
      />
      <span className="sr-only">Loading...</span>
    </div>
  );

  // If fullscreen, wrap it in an overlay
  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return spinner;
}
