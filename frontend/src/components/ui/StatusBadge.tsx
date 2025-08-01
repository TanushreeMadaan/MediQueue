'use client';

import { cn } from '@/lib/utils';
import { getStatusColor, formatStatusText } from '@/lib/utils';
import { Clock, UserCheck, CheckCircle2, XCircle, CalendarCheck2, UserX } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

// Map statuses to consistent icons
const statusIcons: { [key: string]: React.ReactNode } = {
  waiting: <Clock className="mr-1.5 h-3 w-3" />,
  with_doctor: <UserCheck className="mr-1.5 h-3 w-3" />,
  completed: <CheckCircle2 className="mr-1.5 h-3 w-3" />,
  cancelled: <XCircle className="mr-1.5 h-3 w-3" />,
  booked: <CalendarCheck2 className="mr-1.5 h-3 w-3" />,
  no_show: <UserX className="mr-1.5 h-3 w-3" />,
};

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase().replace(/ /g, '_');
  
  const colorClass = getStatusColor(normalizedStatus);
  const icon = statusIcons[normalizedStatus];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        colorClass,
        className
      )}
    >
      {icon}
      {formatStatusText(normalizedStatus)}
    </span>
  );
}
