'use client';

import { useForm } from 'react-hook-form';
import { useMutation } from '@/hooks/useApi';
import { appointmentApi } from '@/lib/api';
import type { Appointment, UpdateAppointmentDto } from '@/lib/types';
import { format } from 'date-fns';

import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface AppointmentRescheduleModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface RescheduleFormData {
  appointment_date: string;
}

export default function AppointmentRescheduleModal({ appointment, isOpen, onClose, onSuccess }: AppointmentRescheduleModalProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<RescheduleFormData>();

  const { mutate: rescheduleAppointment, loading } = useMutation(
    (params: { id: number; data: UpdateAppointmentDto }) => appointmentApi.update(params.id, params.data)
  );

  const onSubmit = async (data: RescheduleFormData) => {
    if (!appointment) return;
    try {
      await rescheduleAppointment({
        id: appointment.id,
        data: { appointment_date: new Date(data.appointment_date).toISOString() }
      });
      onSuccess();
    } catch (err) {
      console.error("Failed to reschedule appointment:", err);
    }
  };

  if (!appointment) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Reschedule for ${appointment.patient.name}`}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <fieldset disabled={loading}>
          <div>
            <label htmlFor="appointment_date" className="block text-sm font-medium mb-1 dark:text-gray-300">New Date & Time *</label>
            <Input
              id="appointment_date"
              type="datetime-local"
              defaultValue={format(new Date(appointment.appointment_date), "yyyy-MM-dd'T'HH:mm")}
              {...register('appointment_date', { required: 'Please select a new date and time' })}
            />
            {errors.appointment_date && <p className="mt-1 text-sm text-red-500">{errors.appointment_date.message}</p>}
          </div>
        </fieldset>
        <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-800">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button type="submit" loading={loading}>Confirm Reschedule</Button>
        </div>
      </form>
    </Modal>
  );
}
