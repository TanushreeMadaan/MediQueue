'use client';

import { useForm } from 'react-hook-form';
import { useApi, useMutation } from '@/hooks/useApi';
import { appointmentApi, doctorApi, patientApi } from '@/lib/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/TextArea';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import type { Appointment, Doctor, Patient, CreateAppointmentDto } from '@/lib/types';
import { format } from 'date-fns';

interface AppointmentFormData {
  patient_id: string; 
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  notes?: string;
  fee?: number;
}

interface AppointmentFormProps {
  appointment?: Appointment;
  onSuccess: (appointment: Appointment) => void;
  onCancel: () => void;
}

export default function AppointmentForm({ appointment, onSuccess, onCancel }: AppointmentFormProps) {
  const { data: doctors, loading: doctorsLoading } = useApi(doctorApi.getAll);
  const { data: patients, loading: patientsLoading } = useApi(patientApi.getAll);

  const { mutate: saveAppointment, loading, error } = useMutation(
    (data: CreateAppointmentDto) =>
      appointment
        ? appointmentApi.update(appointment.id, data)
        : appointmentApi.create(data)
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    defaultValues: appointment
      ? {
          patient_id: String(appointment.patient_id),
          doctor_id: String(appointment.doctor_id),
          appointment_date: format(new Date(appointment.appointment_date), 'yyyy-MM-dd'),
          appointment_time: format(new Date(appointment.appointment_date), 'HH:mm'),
          notes: appointment.notes || '',
          fee: appointment.fee || undefined,
        }
      : {
          patient_id: '',
          doctor_id: '',
          appointment_date: format(new Date(), 'yyyy-MM-dd'), // Default to today
        },
  });

  const onSubmit = async (data: AppointmentFormData) => {
    try {
      const appointmentDateTime = `${data.appointment_date}T${data.appointment_time}:00`;
      
      const appointmentData: CreateAppointmentDto = {
        patient_id: Number(data.patient_id),
        doctor_id: Number(data.doctor_id),
        appointment_date: appointmentDateTime,
        fee: data.fee ? Number(data.fee) : undefined,
      };

      const result = await saveAppointment(appointmentData);
      if (result) {
        onSuccess(result);
      }
    } catch (err) {
      console.error('Failed to save appointment:', err);
    }
  };

  const isDataLoading = doctorsLoading || patientsLoading;
  if (isDataLoading) {
    return <LoadingSpinner />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-lg text-sm dark:bg-red-900/50 dark:text-red-300 dark:border-red-700">
          {error}
        </div>
      )}

      <fieldset disabled={loading} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Patient Select */}
          <div>
            <label htmlFor="patient_id" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Patient *</label>
            <Select {...register('patient_id', { required: 'Patient is required' })}>
              <option value="">Select a patient</option>
              {patients?.map(p => <option key={p.id} value={p.id}>{p.name} - {p.phone}</option>)}
            </Select>
            {errors.patient_id && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.patient_id.message}</p>}
          </div>

          {/* Doctor Select */}
          <div>
            <label htmlFor="doctor_id" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Doctor *</label>
            <Select {...register('doctor_id', { required: 'Doctor is required' })}>
              <option value="">Select a doctor</option>
              {doctors?.filter(d => d.is_available).map(d => <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>)}
            </Select>
            {errors.doctor_id && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.doctor_id.message}</p>}
          </div>

          {/* Date Input */}
          <div>
            <label htmlFor="appointment_date" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Date *</label>
            <Input type="date" {...register('appointment_date', { required: 'Date is required' })} min={format(new Date(), 'yyyy-MM-dd')} />
            {errors.appointment_date && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.appointment_date.message}</p>}
          </div>

          {/* Time Input */}
          <div>
            <label htmlFor="appointment_time" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Time *</label>
            <Input type="time" {...register('appointment_time', { required: 'Time is required' })} />
            {errors.appointment_time && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.appointment_time.message}</p>}
          </div>
        </div>
        
        {/* Notes Textarea */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Notes</label>
          <Textarea {...register('notes')} rows={3} placeholder="Additional notes, reason for visit, etc." />
        </div>
      </fieldset>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {appointment ? 'Update Appointment' : 'Book Appointment'}
        </Button>
      </div>
    </form>
  );
}
