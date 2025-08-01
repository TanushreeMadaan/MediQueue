'use client';

import { useState } from 'react';
import type { Doctor } from '@/lib/types';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import StatusBadge from '@/components/ui/StatusBadge';
import DoctorScheduleModal from './DoctorScheduleModal'; // Import the new modal
import { Stethoscope, Phone, Mail, MapPin, Trash2, Edit, CalendarDays } from 'lucide-react';

interface DoctorCardProps {
  doctor: Doctor;
  onEdit: (doctor: Doctor) => void;
  onDelete: (doctor: Doctor) => void;
  onUpdateAvailability: (doctor: Doctor, is_available: boolean) => void;
}

export default function DoctorCard({ doctor, onEdit, onDelete, onUpdateAvailability }: DoctorCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isScheduleModalOpen, setScheduleModalOpen] = useState(false);

  const status = doctor.is_available ? 'Available' : 'Unavailable';

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm dark:bg-gray-900 border dark:border-gray-800 flex flex-col">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                <Stethoscope className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{doctor.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{doctor.specialization}</p>
              </div>
            </div>
            <StatusBadge status={status} />
          </div>

          <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-x-2"><MapPin className="h-4 w-4" /><span>{doctor.location}</span></div>
            <div className="flex items-center gap-x-2"><Phone className="h-4 w-4" /><span>{doctor.phone}</span></div>
            <div className="flex items-center gap-x-2"><Mail className="h-4 w-4" /><span>{doctor.email}</span></div>
          </div>
        </div>

        {/* Updated Actions Footer */}
        <div className="mt-auto p-4 bg-gray-50 dark:bg-gray-900/50 border-t dark:border-gray-800 grid grid-cols-2 gap-2">
          <Button size="sm" variant="outline" onClick={() => setScheduleModalOpen(true)}>
            <CalendarDays className="mr-2 h-4 w-4" />
            View Schedule
          </Button>
          <Button size="sm" variant="outline" onClick={() => onUpdateAvailability(doctor, !doctor.is_available)}>
            {doctor.is_available ? 'Set Unavailable' : 'Set Available'}
          </Button>
          <div className="col-span-2 flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => onEdit(doctor)} className="flex-1">
              <Edit className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
            <Button size="sm" variant="danger" onClick={() => setShowDeleteConfirm(true)} className="flex-1">
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          </div>
        </div>
      </div>

      
      <DoctorScheduleModal
        doctor={doctor}
        isOpen={isScheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
      />

      {/* Delete Confirmation Modal (no changes here) */}
      <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="Confirm Deletion" size="sm">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Are you sure you want to delete Dr. {doctor.name}? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
            <Button variant="danger" onClick={() => { onDelete(doctor); setShowDeleteConfirm(false); }}>Delete Doctor</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
