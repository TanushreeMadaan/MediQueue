'use client';

import { useCallback } from 'react';
import { useApi } from '@/hooks/useApi';
import { queueApi, appointmentApi, doctorApi } from '@/lib/api';
import { isToday } from 'date-fns';
import StatCard from './StatCard';
import { ListOrdered, Calendar, Stethoscope, CheckCircle2 } from 'lucide-react';

export default function DashboardStats() {
  // fethcing data
  const { data: queue, loading: queueLoading } = useApi(useCallback(() => queueApi.getAll(), []));
  const { data: appointments, loading: appointmentsLoading } = useApi(useCallback(() => appointmentApi.getAll(), []));
  const { data: doctors, loading: doctorsLoading } = useApi(useCallback(() => doctorApi.getAll(), []));

  const isLoading = queueLoading || appointmentsLoading || doctorsLoading;

  const waitingInQueue = queue?.filter(q => q.status === 'waiting').length || 0;
  
  const appointmentsToday = appointments?.filter(a => isToday(new Date(a.appointment_date))).length || 0;
  
  const completedToday = appointments?.filter(
    a => isToday(new Date(a.appointment_date)) && a.status === 'completed'
  ).length || 0;
  
  const availableDoctors = doctors?.filter(d => d.is_available).length || 0;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 h-[148px] rounded-lg shadow-sm border dark:border-gray-800 animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Patients in Queue"
        value={waitingInQueue}
        icon={ListOrdered}
        description="Currently waiting"
        color="blue"
      />
      <StatCard
        title="Today's Appointments"
        value={appointmentsToday}
        icon={Calendar}
        description="Total scheduled"
        color="indigo"
      />
      <StatCard
        title="Completed Today"
        value={completedToday}
        icon={CheckCircle2}
        description={`${appointmentsToday > 0 ? Math.round((completedToday / appointmentsToday) * 100) : 0}% completion`}
        color="green"
      />
      <StatCard
        title="Available Doctors"
        value={availableDoctors}
        icon={Stethoscope}
        description="Ready for consultation"
        color="purple"
      />
    </div>
  );
}
