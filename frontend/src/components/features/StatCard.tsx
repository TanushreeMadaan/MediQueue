import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  color?: 'blue' | 'green' | 'purple' | 'yellow' | 'indigo' | 'red';
}

const colorVariants = {
  blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400',
  green: 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400',
  purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400',
  yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-400',
  indigo: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400',
  red: 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400',
};

export default function StatCard({ title, value, icon: Icon, description, color = 'blue' }: StatCardProps) {
  const colorClass = colorVariants[color] || colorVariants.blue;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm dark:bg-gray-900 border dark:border-gray-800">
      <div className="flex items-start justify-between">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {title}
        </h3>
        <div className={cn('p-2 rounded-lg', colorClass)}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
        )}
      </div>
    </div>
  );
}
