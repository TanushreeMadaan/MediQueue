'use client';

import type { Appointment } from '@/lib/types';
import StatusBadge from '@/components/ui/StatusBadge';
import { formatTime } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { User, Stethoscope, CheckCircle, XCircle, CalendarClock } from 'lucide-react';

interface AppointmentListItemProps {
  appointment: Appointment;
  onUpdateStatus: (id: number, status: 'completed' | 'cancelled' | 'no_show') => void;
  onReschedule: (appointment: Appointment) => void;
}

export default function AppointmentListItem({ appointment, onUpdateStatus, onReschedule }: AppointmentListItemProps) {
  return (
    <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="text-center font-semibold bg-gray-100 dark:bg-gray-800 p-2 rounded-lg w-20">
            <div className="text-lg text-gray-900 dark:text-gray-100">{formatTime(appointment.appointment_date)}</div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">{appointment.patient.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
              <Stethoscope className="h-4 w-4" />{appointment.doctor.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <StatusBadge status={appointment.status} />
          {appointment.status === 'booked' && (
            <div className="hidden md:flex gap-2">
              <Button size="sm" variant="outline" onClick={() => onUpdateStatus(appointment.id, 'completed')}>
                <CheckCircle className="mr-2 h-4 w-4" /> Complete
              </Button>
              <Button size="sm" variant="outline" onClick={() => onReschedule(appointment)}>
                <CalendarClock className="mr-2 h-4 w-4" /> Reschedule
              </Button>
              <Button size="sm" variant="danger" onClick={() => onUpdateStatus(appointment.id, 'cancelled')}>
                <XCircle className="mr-2 h-4 w-4" /> Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
