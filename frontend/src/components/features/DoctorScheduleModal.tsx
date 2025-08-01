'use client';

import type { Doctor } from '@/lib/types';
import Modal from '@/components/ui/Modal';
import { formatTime } from '@/lib/utils';

interface DoctorScheduleModalProps {
  doctor: Doctor;
  isOpen: boolean;
  onClose: () => void;
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function DoctorScheduleModal({ doctor, isOpen, onClose }: DoctorScheduleModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${doctor.name}'s Schedule`}>
      <div className="space-y-4">
        {DAYS_OF_WEEK.map(day => {
          const schedule = doctor.availability?.find(a => a.day === day);
          return (
            <div key={day} className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <span className="font-medium text-gray-700 dark:text-gray-300">{day}</span>
              {schedule ? (
                <span className="font-semibold text-green-600 dark:text-green-400">
                  {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                </span>
              ) : (
                <span className="text-sm text-red-500 dark:text-red-400">Off-duty</span>
              )}
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
