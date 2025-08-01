'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { useMutation } from '@/hooks/useApi';
import { doctorApi } from '@/lib/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Checkbox from '@/components/ui/CheckBox';
import type { Doctor, UpdateDoctorDto } from '@/lib/types';
import { Plus, Trash2 } from 'lucide-react';

interface DoctorFormProps {
  doctor?: Doctor;
  onSuccess: (doctor: Doctor) => void;
  onCancel: () => void;
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function DoctorForm({ doctor, onSuccess, onCancel }: DoctorFormProps) {
  const { mutate: saveDoctor, loading, error } = useMutation(
    (data: UpdateDoctorDto) =>
      doctor ? doctorApi.update(doctor.id, data) : doctorApi.create(data)
  );

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateDoctorDto>({
    defaultValues: doctor
      ? { ...doctor, availability: doctor.availability || [] }
      : { availability: [{ day: 'Monday', start_time: '09:00', end_time: '17:00' }], is_available: true },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'availability',
  });

  const onSubmit = async (data: UpdateDoctorDto) => {
    try {
      const result = await saveDoctor(data);
      if (result) {
        onSuccess(result);
      }
    } catch (err) {
      console.error('Failed to save doctor:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-lg text-sm dark:bg-red-900/50 dark:text-red-300 dark:border-red-700">
          {error}
        </div>
      )}

      <fieldset disabled={loading} className="space-y-4">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Full Name *</label>
            <Input {...register('name', { required: 'Name is required' })} placeholder="Dr. John Doe" />
            {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Specialization *</label>
            <Input {...register('specialization', { required: 'Specialization is required' })} placeholder="General Medicine" />
            {errors.specialization && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.specialization.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Gender *</label>
            <Select {...register('gender', { required: 'Gender is required' })}>
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </Select>
            {errors.gender && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.gender.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Location/Room *</label>
            <Input {...register('location', { required: 'Location is required' })} placeholder="Room 101" />
            {errors.location && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.location.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Phone Number *</label>
            <Input {...register('phone', { required: 'Phone number is required' })} placeholder="+1234567890" />
            {errors.phone && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Email Address *</label>
            <Input type="email" {...register('email', { required: 'Email is required' })} placeholder="doctor@clinic.com" />
            {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>}
          </div>
        </div>

        {/* Availability Toggle */}
        <div className="flex items-center gap-x-3">
          <Checkbox id="is_available" {...register('is_available')} />
          <label htmlFor="is_available" className="text-sm font-medium text-gray-700 dark:text-gray-300">Currently Available</label>
        </div>

        {/* Dynamic Schedule */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Availability Schedule</h3>
            <Button type="button" variant="outline" size="sm" onClick={() => append({ day: 'Monday', start_time: '09:00', end_time: '17:00' })}>
              <Plus className="h-4 w-4 mr-2" /> Add Slot
            </Button>
          </div>
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 rounded-lg dark:bg-gray-800/50">
                <Select {...register(`availability.${index}.day`)} className="flex-grow">
                  {DAYS_OF_WEEK.map(day => <option key={day} value={day}>{day}</option>)}
                </Select>
                <Input type="time" {...register(`availability.${index}.start_time`)} />
                <span className="text-gray-500">to</span>
                <Input type="time" {...register(`availability.${index}.end_time`)} />
                <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)} className="text-red-600 dark:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </fieldset>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>Cancel</Button>
        <Button type="submit" loading={loading}>{doctor ? 'Update Doctor' : 'Add Doctor'}</Button>
      </div>
    </form>
  );
}
